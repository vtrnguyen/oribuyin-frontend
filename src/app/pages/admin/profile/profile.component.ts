import { Component } from "@angular/core";
import { Notification } from "../../../shared/types/notification.type";
import { UsersService } from "../../../core/services/users.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";

@Component({
    selector: "app-admin-profile",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        NotificationComponent,
    ],
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class AdminProfileComponent {
    user: any = {};
    editUser: any = {};
    editMode: boolean = false;

    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    constructor(private usersService: UsersService) { }

    ngOnInit(): void {
        this.loadUserInfo();
    }

    editProfile(): void {
        this.editUser = { ...this.user };

        if (this.user.birth_day) {
            const d = new Date(this.user.birth_day);
            this.editUser.birth_day = d.toISOString().slice(0, 10);
        } else {
            this.editUser.birthdate = '';
        }

        this.editMode = true;
    }

    cancelEdit(): void {
        this.editMode = false;
    }

    saveProfile(): void {
        const userID = this.usersService.getCurrentUserID();

        this.usersService.updateUserProfile(userID, this.editUser).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.showNotification("success", "Thành công", "Đã cập nhật hồ sơ của bạn.");
                    this.editUser = {};
                    this.editMode = false;
                    this.loadUserInfo();
                } else {
                    this.showNotification("warning", "Chú ý", "Email hoặc số điện thoại đã tồn tại.");
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", "Lỗi khi cập nhật hồ sơ.");
            },
        });
    }

    private loadUserInfo(): void {
        const userID = this.usersService.getCurrentUserID();

        this.usersService.getUserByID(userID).subscribe((res: any) => {
            if (res && res.code === 1) {
                this.user = res.data[0];
            }
        });
    }

    private showNotification(
        type: Notification,
        title: string,
        message: string
    ): void {
        this.notificationType = type;
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationVisible = true;
        setTimeout(() => {
            this.notificationVisible = false;
        }, 3000);
    }
}
