import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";

@Component({
    selector: "app-admin-products",
    standalone: true,
    imports: [
        CommonModule,
        NotificationComponent,
    ],
    templateUrl: "./products.component.html",
    styleUrls: ["./products.component.scss"],
})
export class AdminProductsComponent {
    totalProducts: number = 0;
    
    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";
    
    openAddProductModal(): void {
    
    }
    
    downloadProductInfo(): void {
    
    }
}
