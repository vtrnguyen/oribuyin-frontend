import { CommonModule } from "@angular/common";
import { Component, HostListener } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-staff-layout",
    standalone: true,
    imports: [
        RouterOutlet,
        CommonModule,
    ],
    templateUrl: "./staff_layout.component.html",
    styleUrls: ["./staff_layout.component.scss"],
})
export class StaffLayoutComponent {
    isStaffMenuOpen: boolean = false;

    toggleStaffMenu(): void {
        this.isStaffMenuOpen = !this.isStaffMenuOpen;
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