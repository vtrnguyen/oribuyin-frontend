import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, inject, ViewChild } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from "../../core/auth/auth.service";

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
export class AdminLayoutComponent {
    isAdminMenuOpen: boolean = false;
    @ViewChild("adminMenuButton") adminMenuButton!: ElementRef;
    @ViewChild("adminMenu") adminMenu!: ElementRef;

    constructor(private authService: AuthService) { }

    toggleAdminMenu(): void {
        this.isAdminMenuOpen = !this.isAdminMenuOpen;
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
        const adminMenuButton = document.getElementById("adminMenuButton");
        const adminMenu = document.getElementById("adminMenu");

        if (adminMenuButton && adminMenu && this.isAdminMenuOpen && event?.target) {
            if (!adminMenuButton.contains(event.target as Node) &&
                !adminMenu.contains(event.target as Node)) {
                this.isAdminMenuOpen = false;
            }
        }
    }
}