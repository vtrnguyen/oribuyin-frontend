import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
    selector: "app-customer-home",
    standalone: true,
    imports: [
        CommonModule,
    ],
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
})
export class CustomerHomeComponent {

}
