import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, ViewChild, OnInit } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";
import { UsersService } from "../../core/services/users.service";
import { User } from "../../shared/interfaces/user.interface";

@Component({
    selector: "app-admin-layout",
    standalone: true,
    imports: [
        RouterOutlet,
        RouterModule,
        CommonModule,
    ],
    templateUrl: "./admin_layout.component.html",
    styleUrls: ["./admin_layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
    userInfo: User | null = null;
    isAdminMenuOpen: boolean = false;
    isSidebarOpen: boolean = false;

    currentWindowWidth: number = 0;

    @ViewChild("adminMenuButton") adminMenuButton!: ElementRef;
    @ViewChild("adminMenu") adminMenu!: ElementRef;

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    ngOnInit(): void {
        this.loadUserInfo();

        // Initialize window width and sidebar state
        this.currentWindowWidth = window.innerWidth;
        this.checkScreenSize();
    }

    private loadUserInfo(): void {
        const userID: number = this.usersService.getCurrentUserID();

        this.usersService.getUserByID(userID).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.userInfo = {
                        id: response.data[0].id,
                        avatar: response.data[0].avatar,
                        firstName: response.data[0].first_name,
                        lastName: response.data[0].last_name,
                        userName: "",
                        password: "",
                        role: "staff",
                        email: response.data[0].email,
                        phoneNumber: response.data[0].phone_number,
                        gender: response.data[0].gender,
                        birthDay: response.data[0].birth_day,
                        address: response.data[0].address,
                    }
                }
            },
            error: (error: any) => {
                console.log(">>> error when fetching user info:", error);
            }
        });
    }

    get isMobileScreen(): boolean {
        return this.currentWindowWidth < 768;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: Event): void {
        this.currentWindowWidth = (event.target as Window).innerWidth;
        this.checkScreenSize();
    }

    checkScreenSize(): void {
        if (this.currentWindowWidth >= 768) {
            this.isSidebarOpen = true;
        } else {
            this.isSidebarOpen = false;
        }
    }

    toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
        if (this.isSidebarOpen && this.isAdminMenuOpen) {
            this.isAdminMenuOpen = false;
        }
    }

    closeSidebar(): void {
        if (this.isMobileScreen) {
            this.isSidebarOpen = false;
        }
    }

    toggleAdminMenu(): void {
        this.isAdminMenuOpen = !this.isAdminMenuOpen;
        if (this.isAdminMenuOpen && this.isSidebarOpen && this.isMobileScreen) {
            this.isSidebarOpen = false;
        }
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: MouseEvent): void {
        if (this.isAdminMenuOpen &&
            this.adminMenuButton && !this.adminMenuButton.nativeElement.contains(event.target as Node) &&
            this.adminMenu && !this.adminMenu.nativeElement.contains(event.target as Node)) {
            this.isAdminMenuOpen = false;
        }
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: (response) => {
                this.authService.clearLocalStorageAndRedirect();
            },
            error: (error) => {
                console.error("Logout error:", error);
                this.authService.clearLocalStorageAndRedirect();
            }
        });
        this.isAdminMenuOpen = false;
    }
}