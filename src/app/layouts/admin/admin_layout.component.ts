import { CommonModule } from "@angular/common";
import { Component, HostListener } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-admin-layout",
    standalone: true,
    imports: [
        RouterOutlet,
        CommonModule,
    ],
    templateUrl: "./admin_layout.component.html",
    styleUrls: ["./admin_layout.component.scss"],
})
export class AdminLayoutComponent {
    isAdminMenuOpen: boolean = false;

    toggleAdminMenu(): void {
        this.isAdminMenuOpen = !this.isAdminMenuOpen;
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