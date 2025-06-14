import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, ViewChild, OnInit } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";

@Component({
    selector: "app-staff-layout",
    standalone: true,
    imports: [
        RouterOutlet,
        RouterModule,
        CommonModule,
    ],
    templateUrl: "./staff_layout.component.html",
    styleUrls: ["./staff_layout.component.scss"],
})
export class StaffLayoutComponent implements OnInit {
    isStaffMenuOpen: boolean = false;
    isSidebarOpen: boolean = false;

    currentWindowWidth: number = 0;

    @ViewChild("staffMenuButton") staffMenuButton!: ElementRef;
    @ViewChild("staffMenu") staffMenu!: ElementRef;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
        this.currentWindowWidth = window.innerWidth;
        this.checkScreenSize();
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
        if (this.isSidebarOpen && this.isStaffMenuOpen) {
            this.isStaffMenuOpen = false;
        }
    }

    closeSidebar(): void {
        if (this.isMobileScreen) {
            this.isSidebarOpen = false;
        }
    }

    toggleStaffMenu(): void {
        this.isStaffMenuOpen = !this.isStaffMenuOpen;
        if (this.isStaffMenuOpen && this.isSidebarOpen && this.isMobileScreen) {
            this.isSidebarOpen = false;
        }
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: MouseEvent): void {
        if (this.isStaffMenuOpen &&
            this.staffMenuButton && !this.staffMenuButton.nativeElement.contains(event.target as Node) &&
            this.staffMenu && !this.staffMenu.nativeElement.contains(event.target as Node)) {
            this.isStaffMenuOpen = false;
        }
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: (response) => {
                this.authService.clearLocalStorageAndRedirect();
            },
            error: (error) => {
                this.authService.clearLocalStorageAndRedirect();
            }
        });
        this.isStaffMenuOpen = false;
    }
}