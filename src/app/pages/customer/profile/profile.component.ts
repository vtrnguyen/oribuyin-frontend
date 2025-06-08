import { Component, OnInit } from "@angular/core";
import { UsersService } from "../../../core/services/users.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-customer-profile",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
    ],
    templateUrl: "./profile.component.html",
    styleUrls: ["./profile.component.scss"],
})
export class CustomerProfileComponent implements OnInit {
    user: any = {};
    editUser: any = {};
    editMode: boolean = false;

    constructor(private usersService: UsersService) { }

    ngOnInit(): void {
        const userID = this.usersService.getCurrentUserID();

        this.usersService.getUserByID(userID).subscribe((res: any) => {
            if (res && res.code === 1) {
                this.user = res.data[0];
            }
        });
    }

    editProfile(): void {
        this.editUser = { ...this.user };
        this.editMode = true;
    }

    cancelEdit(): void {
        this.editMode = false;
    }

    saveProfile(): void {
        const userID = this.usersService.getCurrentUserID();

        this.usersService.updateUser(userID, this.editUser, null).subscribe((res: any) => {
            if (res && res.code === 1) {
                this.user = { ...this.editUser };
                this.editMode = false;
            }
        })
    }
}
