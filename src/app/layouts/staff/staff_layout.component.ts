import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, inject, ViewChild } from "@angular/core";
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
export class StaffLayoutComponent {
    isStaffMenuOpen: boolean = false;
    @ViewChild("staffMenuButton") staffMenuButton!: ElementRef;
    @ViewChild("staffMenu") staffMenu!: ElementRef;

    constructor(private authService: AuthService) { }

    toggleStaffMenu(): void {
        this.isStaffMenuOpen = !this.isStaffMenuOpen;
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
    }

    @HostListener("document:click", ["$event"])
    onDocumentClick(event: MouseEvent): void {
        const staffMenuButton = document.getElementById("staffMenuButton");
        const staffMenu = document.getElementById("staffMenu");

        if (staffMenuButton && staffMenu && this.isStaffMenuOpen && event?.target) {
            if (!staffMenuButton.contains(event.target as Node) &&
                !staffMenu.contains(event.target as Node)) {
                this.isStaffMenuOpen = false;
            }
        }
    }
}