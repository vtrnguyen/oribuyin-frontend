import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-customer-layout",
    standalone: true,
    imports: [
        RouterOutlet,
    ],
    templateUrl: "./customer_layout.component.html",
    styleUrls: ["./customer_layout.component.scss"],
})
export class CustomerLayoutComponent {

}