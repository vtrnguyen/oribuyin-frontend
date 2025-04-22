import { Component, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { User } from "../../../shared/interfaces/user.interface";
import { ClickOutsideModule } from 'ng-click-outside';
import { UsersService } from "../../../core/services/users.service";
import * as XLSX from "xlsx";

@Component({
    selector: "app-admin-users",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
    ],
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
    providers: [DatePipe],
})
export class AdminUsersComponent implements OnInit {
    isAddUserModalOpen: boolean = false;
    isDeleteUserModalOpen: boolean = false;
    users: User[] = [];
    totalUsers: number = this.users.length;
    isActionsMenuOpen: boolean = false;
    selectedUser: User | null = null;

    constructor(
        private datePipe: DatePipe,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.usersService.getAllUsers().subscribe((response: any) => {
            this.users = response.data.map((item: any) => ({
                id: item.user.id,
                firstName: item.user.first_name,
                lastName: item.user.last_name,
                email: item.user.email,
                phoneNumber: item.user.phone_number,
                avatar: item.user.avatar,
                gender: item.user.gender,
                birthDay: item.user.birth_day,
                address: item.user.address,
                role: item.role,
                userName: item.user_name,
            }));

            this.totalUsers = this.users.length;
        });
    }

    openAddUserModal(): void {
        this.isAddUserModalOpen = true;
    }

    closeAddUserModal(): void {
        this.isAddUserModalOpen = false;
    }

    openDeleteUserModal(): void {
        this.isDeleteUserModalOpen = true;
        this.isActionsMenuOpen = false;
    }

    closeDeleteUserModal(): void {
        this.isDeleteUserModalOpen = false;
    }

    toggleActionsMenu(user: User, button: HTMLButtonElement): void {
        if (this.selectedUser === user && this.isActionsMenuOpen) {
            this.closeActionMenu();
        } else {
            this.selectedUser = user;
            this.isActionsMenuOpen = true;
        }
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

    downloadUserInfo(): void {
        const data = this.users.map(user => ({
            "Mã người dùng": user.id,
            "Họ và tên": `${user.firstName} ${user.lastName}`,
            "Tên tài khoản": user.role,
            "Quyền người dùng": this.getRoleDisplayName(user.role),
            Email: user.email,
            "Số điện thoại": user.phoneNumber,
            "Giới tính": user.gender,
            "Ngày sinh": user.birthDay ? this.datePipe.transform(user.birthDay, 'dd/MM/yyyy') : '',
            "Địa chỉ": user.address,
        }));
        
        // init worksheet
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        // init workbook with the worksheet
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "OriBuyin's Users");

        // save file
        XLSX.writeFile(wb, "danh_sach_nguoi_dung_cua_oribuyin.xlsx");
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

    getGenderDisplayName(gender: string | null): string {
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
