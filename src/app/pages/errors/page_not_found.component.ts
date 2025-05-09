import { Location } from "@angular/common";
import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-page-not-found",
    templateUrl: "./page_not_found.component.html",
    styleUrls: ["./page_not_found.component.html"],
})
export class PageNotFoundComponent {
    constructor(
        private router: Router,
        private location: Location
    ) { }

    backToPrevious(): void {
        this.location.back();
    }

    backToHome(): void {
        this.router.navigate(["/"]);
    }
}
