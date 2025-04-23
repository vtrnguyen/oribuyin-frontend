import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Notification } from "../../types/notification.type";

@Component({
    selector: "app-notification-component",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./notification.component.html",
    styleUrls: ["./notification.component.scss"],
})
export class NotificationComponent implements OnChanges {
    @Input() isVisible: boolean = false;
    @Input() type: Notification = "info";
    @Input() title: string = "";
    @Input() message: string = "";
    @Input() duration: number = 3000;

    private timeOutID: any;

    ngOnChanges(): void {
        if (this.isVisible) {
            this.autoHide();
        } else {
            this.clearTimeout();
        }
    }

    private autoHide(): void {
        this.clearTimeout();
        this.timeOutID = setTimeout(() => {
            this.isVisible = false;
        }, this.duration);
    }

    private clearTimeout(): void {
        if (this.timeOutID) {
            clearTimeout(this.timeOutID);
            this.timeOutID = null;
        }
    }

    getIconClass(): string {
        switch(this.type) {
            case "success":
                return "fas fa-check-circle";
            case "error":
                return "fas fa-time-circle";
            case "warning":
                return "fas fa-exclamation-triangle";
            case "info":
            default:
                return "fas fa-info-circle";
        }
    }
}