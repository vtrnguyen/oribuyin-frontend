import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ClickOutsideModule } from 'ng-click-outside';

@Component({
    selector: 'app-customer-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        CommonModule,
        FormsModule,
        ClickOutsideModule,
    ],
    templateUrl: './customer_layout.component.html',
    styleUrls: ['./customer_layout.component.scss'],
})
export class CustomerLayoutComponent implements OnInit {
    searchQuery: string = '';
    isUserDropdownOpen: boolean = false;
    cartItemCount: number = 0;

    constructor(private router: Router) { }

    ngOnInit(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            window.scrollTo(0, 0);
        });

        this.cartItemCount = 2;
    }

    handleSearch(): void {
        if (this.searchQuery.trim()) {
            console.log(`Tìm kiếm cho: ${this.searchQuery}`);
            this.router.navigate(['/searches'], { queryParams: { q: this.searchQuery } });
            this.searchQuery = '';
        }
    }

    toggleUserDropdown(): void {
        this.isUserDropdownOpen = !this.isUserDropdownOpen;
    }

    logout(): void {

    }
}