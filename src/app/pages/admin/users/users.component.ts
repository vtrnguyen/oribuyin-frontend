import { Component, OnInit } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { User } from "../../../shared/interfaces/user.interface";
import { ClickOutsideModule } from 'ng-click-outside';
import { UsersService } from "../../../core/services/users.service";
import * as XLSX from "xlsx";
import { NotificationComponent } from "../../../shared/components/notifications/notification.component";
import { Notification } from "../../../shared/types/notification.type";
import { isValidEmail, isValidPhoneNumber } from "../../../utils/validation.utils";

@Component({
    selector: "app-admin-users",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NotificationComponent,
    ],
    templateUrl: "./users.component.html",
    styleUrls: ["./users.component.scss"],
    providers: [DatePipe],
})
export class AdminUsersComponent implements OnInit {
    isAddUserModalOpen: boolean = false;
    isEditUserModalOpen: boolean = false;
    isDeleteUserModalOpen: boolean = false;
    users: User[] = [];
    totalUsers: number = this.users.length;
    isActionsMenuOpen: boolean = false;
    selectedUser: User | null = null;
    editingUser: User | null = null;
    deletingUser: User | null = null;
    notificationVisible: boolean = false;
    notificationType: Notification = "success";
    notificationTitle: string = "";
    notificationMessage: string = "";

    // adding user properties
    newFirstName: string = "";
    newLastName: string = '';
    newEmail: string = '';
    newPhoneNumber: string = '';
    newGender: string = 'male';
    newBirthDay: string = '';
    newAddress: string = '';
    newUsername: string = '';
    newPassword: string = '';
    newConfirmPassword: string = '';
    newRole: string = 'customer';

    // updating user properties
    updateID: number = 0;
    updateFirstName: string = "";
    updateLastName: string = "";
    updateAvatar: string = "images/default_avatar.png";
    updateEmail: string = "";
    updatePhoneNumber: string = "";
    updateGender: string = 'male';
    updateBirthDay: string = "";
    updateAddress: string = "";
    updateUsername: string = "";
    updatePassword: string = "";
    updateConfirmPassword: string = "";
    updateRole: string = "customer";

    constructor(
        private datePipe: DatePipe,
        private usersService: UsersService
    ) {}

    ngOnInit(): void {
        this.getAllUsers();
    }

    // adding modal
    openAddUserModal(): void {
        this.isAddUserModalOpen = true;
    }

    
    closeAddUserModal(): void {
        this.isAddUserModalOpen = false;
        this.resetAddingUserForm();
    }


    // editing modal
    openEditUserModal(user: User): void {
        this.updateID = user.id;
        this.updateFirstName = user.firstName;
        this.updateLastName = user.lastName;
        this.updateAvatar = user.avatar;
        this.updateEmail = user.email;
        this.updatePhoneNumber = user.phoneNumber;
        this.updateGender = user.gender;
        this.updateBirthDay = user.birthDay.toString();
        this.updateAddress = user.address;
        this.updateUsername = user.userName;
        this.updatePassword = "";
        this.updateConfirmPassword = "";
        this.updateRole = user.role;

        this.isEditUserModalOpen = true;
    }

    closeEditUserModal() {
        this.isEditUserModalOpen = false;
        this.resetEditingUserForm();
    }


    // deleting modal
    openDeleteUserModal(user: User): void {
        this.isDeleteUserModalOpen = true;
        this.deletingUser = user;
        this.isActionsMenuOpen = false;
    }

    closeDeleteUserModal(): void {
        this.isDeleteUserModalOpen = false;
        this.deletingUser = null;
    }


    // actions menu
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


    // CRUD
    getAllUsers(): void {
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

    addUser(): void {
        const newUser = {
            first_name: this.newFirstName.trim(),
            last_name: this.newLastName.trim(),
            email: this.newEmail.trim(),
            phone_number: this.newPhoneNumber.trim(),
            gender: this.newGender,
            birth_day: this.newBirthDay,
            address: this.newAddress.trim(),
            avatar: 'images/default_avatar.png',
        };

        const newAccount = {
            user_name: this.newUsername.trim(),
            password: this.newPassword,
            role: this.newRole,
        };


        if (!newUser.first_name || !newUser.last_name || !newUser.email 
            || !newUser.phone_number || !newUser.gender || !newUser.birth_day || !newUser.address || 
            !newAccount.user_name || !newAccount.password || !newAccount.role) {
            this.showNotification("warning", "Thông báo", "Không được để trống thông tin!");
            return;
        }

        if (!isValidEmail(newUser.email)) {
            this.showNotification("warning", "Thông báo", "Định dạng email không hợp lệ!");
            return;
        }

        if (!isValidPhoneNumber(newUser.phone_number)) {
            this.showNotification("warning", "Thông báo", "Định dạng số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 hoặc 11 số)!");
            return;
        }

        if (this.newPassword !== this.newConfirmPassword) {
            this.showNotification('error', 'Lỗi', 'Mật khẩu xác nhận không khớp.');
            return;
        }

        this.usersService.createUser(newUser, newAccount).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.getAllUsers();
                    this.closeAddUserModal();
                    this.showNotification('success', 'Thành công', 'Tạo mới người dùng thành công.');
                }
            },
            error: (error: any) => {
                if (error.error?.subcode === 1) {
                    this.showNotification('error', 'Lỗi', 'Tên tài khoản đã tồn tại!');
                    return;
                }

                if (error.error?.subcode === 2) {
                    this.showNotification('error', 'Lỗi', 'Email đã tồn tại!');
                    return;
                }

                if (error.error?.subcode === 3) {
                    this.showNotification('error', 'Lỗi', 'Số điện thoại đã tồn tại!');
                    return;
                }

                this.showNotification('error', 'Lỗi', 'Tạo mới người dùng không thành công.');
            },
        })
    }

    viewUser(user: User): void {
        console.log("Xem thông tin người dùng:", user);
        this.closeActionMenu();
    }

    updateUser(): void {
        const updatingUser =  {
            first_name: this.updateFirstName.trim(),
            last_name: this.updateLastName.trim(),
            email: this.updateEmail.trim(),
            phone_number: this.updatePhoneNumber.trim(),
            gender: this.updateGender,
            birth_day: this.updateBirthDay.trim(),
            address: this.updateAddress.trim(),
        };

        const updatingAccount = {
            user_name: this.updateUsername.trim(),
            password: this.updatePassword.trim(),
            role: this.updateRole,
        };

        if (!updatingUser.first_name || !updatingUser.last_name || !updatingUser.email
            || !updatingUser.phone_number || !updatingUser.gender || !updatingUser.birth_day || !updatingUser.address ||
            !updatingAccount.user_name || !updatingAccount.password || !updatingAccount.role) {
            this.showNotification("warning", "Thông báo", "Không được để trống thông tin!");
            return;
        }

        if (!isValidEmail(updatingUser.email)) {
            this.showNotification("warning", "Thông báo", "Định dạng email không hợp lệ!");
            return;
        }

        if (!isValidPhoneNumber(updatingUser.phone_number)) {
            this.showNotification("warning", "Thông báo", "Định dạng số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10 hoặc 11 số)!");
            return;
        }

        if (this.updatePassword && this.updatePassword !== this.updateConfirmPassword) {
            this.showNotification("error", "Lỗi", "Mật khẩu xác nhận không khớp!");
            return;
        }

        this.usersService.updateUser(this.updateID, updatingUser, updatingAccount).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.getAllUsers();
                    this.closeEditUserModal();
                    this.showNotification("success", "Thành công", "Cập nhật thông tin người dùng thành công.");
                }
            },
            error: (error: any) => {
                if (error.error?.subcode === 2) {
                    this.showNotification("error", "Lỗi", "Email đã tồn tại!");
                    return;
                }

                if (error.error?.subcode === 3) {
                    this.showNotification("error", "Lỗi", "Số điện thoại đã tồn tại!");
                    return;
                }

                this.showNotification("error", "Lỗi", "Cập nhật thông tin người dùng không thành công!");
            }
        });
    }

    deleteUser(): void {
        if (this.deletingUser === null) return;

        this.usersService.deleteUser(this.deletingUser.id).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.getAllUsers();
                    this.showNotification("success", "Thành công", `Đã xóa người dùng ${this.deletingUser?.firstName} ${this.deletingUser?.lastName}`);
                    this.closeDeleteUserModal();
                } else {
                    this.showNotification("error", "Lỗi", `Không thể xóa người dùng ${this.deletingUser?.firstName} ${this.deletingUser?.lastName}`);
                }
            },
            error: (error: any) => {
                this.showNotification("error", "Lỗi", `Không thể xóa người dùng ${this.deletingUser?.firstName} ${this.deletingUser?.lastName}`);
            }
        })
    }


    // download all users info
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

    // show notification
    showNotification(type: Notification, title: string, message: string): void {
        this.notificationType = type;
        this.notificationTitle = title;
        this.notificationMessage = message;
        this.notificationVisible = true;
        setTimeout(() => {
            this.notificationVisible = false;
        }, 3000);
    }


    // reset forms
    resetAddingUserForm(): void {
        this.newFirstName = '';
        this.newLastName = '';
        this.newEmail = '';
        this.newPhoneNumber = '';
        this.newGender = 'other';
        this.newBirthDay = '';
        this.newAddress = '';
        this.newUsername = '';
        this.newPassword = '';
        this.newConfirmPassword = '';
        this.newRole = 'customer';
    }

    resetEditingUserForm(): void {
        this.updateID = 0;
        this.updateFirstName = "";
        this.updateLastName = "";
        this.updateAvatar = "images/default_avatar.png";
        this.updateEmail = "";
        this.updatePhoneNumber = "";
        this.updateGender = 'male';
        this.updateBirthDay = "";
        this.updateAddress = "";
        this.updateUsername = "";
        this.updatePassword = "";
        this.updateConfirmPassword = "";
        this.updateRole = "customer";
    }


    // get selections options
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
