import { Component } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { User } from "../../../shared/interfaces/user.interface";

@Component({
    selector: "app-admin-users",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
    providers: [DatePipe],
})
export class AdminUsersComponent {
    isAddUserModalOpen: boolean = false;
    users: User[] = [
        { id: 1, avatar: 'images/avatar.webp', firstName: 'Jese', lastName: 'Leos', userName: "user1", password: "123", role: 'admin', email: 'jese@example.com', phoneNumber: '123-456-7890', gender: 'male', birthDay: new Date('1990-05-15'), address: 'USA' },
        { id: 2, avatar: 'images/avatar.webp', firstName: 'Bonnie', lastName: 'Green', userName: "user2", password: "123", role: 'customer', email: 'bonnie@example.com', phoneNumber: '987-654-3210', gender: 'female', birthDay: new Date('1992-08-20'), address: 'USA' },
        { id: 3, avatar: 'images/avatar.webp', firstName: 'Leslie', lastName: 'Livingston', userName: "user3", password: "123", role: 'staff', email: 'leslie@example.com', phoneNumber: '555-123-4567', gender: 'other', birthDay: new Date('1988-11-01'), address: 'USA' },
        { id: 4, avatar: 'images/avatar.webp', firstName: 'Micheal', lastName: 'Gough', userName: "user4", password: "123", role: 'staff', email: 'michael@example.com', phoneNumber: '111-222-3333', gender: 'male', birthDay: new Date('1995-03-10'), address: 'France' },
        { id: 5, avatar: 'images/avatar.webp', firstName: 'Joseph', lastName: 'McFall', userName: "user5", password: "123", role: 'customer', email: '[đã xoá địa chỉ email]', phoneNumber: '444-555-6666', gender: 'male', birthDay: new Date('1993-07-25'), address: 'England' },
        { id: 6, avatar: 'images/avatar.webp', firstName: 'Robert', lastName: 'Brown', userName: "user6", password: "123", role: 'admin', email: '[đã xoá địa chỉ email]', phoneNumber: '777-888-9999', gender: 'male', birthDay: new Date('1991-12-05'), address: 'Canada' },
        { id: 7, avatar: 'images/avatar.webp', firstName: 'Robert', lastName: 'Brown', userName: "user7", password: "123", role: 'staff', email: '[đã xoá địa chỉ email]', phoneNumber: '777-888-9999', gender: 'male', birthDay: new Date('1991-12-05'), address: 'Canada' },
        { id: 8, avatar: 'images/avatar.webp', firstName: 'Robert', lastName: 'Brown', userName: "user8", password: "123", role: 'customer', email: '[đã xoá địa chỉ email]', phoneNumber: '777-888-9999', gender: 'male', birthDay: new Date('1991-12-05'), address: 'Canada' },
        { id: 9, avatar: 'images/avatar.webp', firstName: 'Robert', lastName: 'Brown', userName: "user9", password: "123", role: 'admin', email: '[đã xoá địa chỉ email]', phoneNumber: '777-888-9999', gender: 'male', birthDay: new Date('1991-12-05'), address: 'Canada' },
        { id: 10, avatar: 'images/avatar.webp', firstName: 'Robert', lastName: 'Brown', userName: "user10", password: "123", role: 'staff', email: '[đã xoá địa chỉ email]', phoneNumber: '777-888-9999', gender: 'male', birthDay: new Date('1991-12-05'), address: 'Canada' },
        { id: 11, avatar: 'images/avatar.webp', firstName: 'Robert', lastName: 'Brown', userName: "user11", password: "123", role: 'admin', email: '[đã xoá địa chỉ email]', phoneNumber: '777-888-9999', gender: 'male', birthDay: new Date('1991-12-05'), address: 'Canada' },
        { id: 12, avatar: 'images/avatar.webp', firstName: 'Robert', lastName: 'Brown', userName: "user12", password: "123", role: 'customer', email: '[đã xoá địa chỉ email]', phoneNumber: '777-888-9999', gender: 'male', birthDay: new Date('1991-12-05'), address: 'Canada' },
    ];
    totalUsers: number = this.users.length;
    isActionsMenuOpen: boolean = false;
    selectedUser: User | null = null;

    constructor(private datePipe: DatePipe) {}

    openAddUserModal(): void {
        this.isAddUserModalOpen = true;
    }

    closeAddUserModal(): void {
        this.isAddUserModalOpen = false;
    }

    openActionsMenu(user: User): void {
        this.selectedUser = user;
        this.isActionsMenuOpen = true;
    }

    closeActionMenu(): void {
        this.isActionsMenuOpen = false;
        this.selectedUser = null;
    }

    viewUser(user: User): void {
        console.log("Xem thông tin người dùng:", user);
        this.closeActionMenu();
    }

    editUser(user: User): void {
        console.log("Chỉnh sửa thông tin người dùng:", user);
        this.closeActionMenu();
    }

    deleteUser(user: User): void {
        console.log("Xóa thông tin người dùng:", user);
        this.closeActionMenu();
    }

    getRoleDisplayName(role: "admin" | "staff" | "customer"): string {
        switch (role) {
            case "admin":
                return "Quản trị viên";
            case "staff":
                return "Nhân viên";
            case "customer":
                return "Khách hàng";
            default:
                return "";
        }
    }

    getGenderDisplayName(gender: "male" | "female" | "other"): string {
        switch (gender) {
            case "male":
                return "Nam";
            case "female":
                return "Nữ";
            case "other":
                return "Khác";
            default:
                return "";
        }
    }
}
