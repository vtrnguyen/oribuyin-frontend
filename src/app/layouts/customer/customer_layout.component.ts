import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { ClickOutsideModule } from 'ng-click-outside';
import { AuthService } from '../../core/auth/auth.service';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../shared/interfaces/user.interface';
import { CartService } from '../../core/services/cart.service';
import { CartStateManagerService } from '../../shared/services/cart_state_manager.service';
import { ChatbotCustomerComponent } from '../../shared/components/chatbot/chatbot-customer.component';
import { ProductsService } from '../../core/services/products.service';

@Component({
    selector: 'app-customer-layout',
    standalone: true,
    imports: [
        RouterOutlet,
        RouterLink,
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        ChatbotCustomerComponent,
    ],
    templateUrl: './customer_layout.component.html',
    styleUrls: ['./customer_layout.component.scss'],
})
export class CustomerLayoutComponent implements OnInit {
    userInfo: User | null = null;
    isUserDropdownOpen: boolean = false;
    cartItemCount: number = 0;

    // search properties
    searchQuery: string = '';
    isSearchFocused: boolean = false;
    topSearchKeywords: { keyword: string; count: number }[] = [];
    searchHistory: string[] = [];
    showSearchPanel: boolean = false;

    constructor(
        private router: Router,
        private authService: AuthService,
        private usersService: UsersService,
        private cartService: CartService,
        private cartStateManagerService: CartStateManagerService,
        private productsService: ProductsService,
    ) { }

    ngOnInit(): void {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            window.scrollTo(0, 0);
        });

        this.loadUserInfo();
        this.loadNumberOfCartProduct();
        this.loadTopSearchKeywords();

        this.cartStateManagerService.updateCartItemQuantity$.subscribe(() => {
            this.loadNumberOfCartProduct();
        });
    }

    onSearchFocus(): void {
        this.isSearchFocused = true;
        this.showSearchPanel = true;
        this.loadSearchHistory();
    }

    onSearchBlur(): void {
        // Delay to allow click events on suggestions to fire
        setTimeout(() => {
            this.isSearchFocused = false;
            this.showSearchPanel = false;
        }, 200);
    }

    handleSearch(): void {
        if (this.searchQuery.trim()) {
            this.router.navigate(['/searches'], { queryParams: { q: this.searchQuery } });
            this.searchQuery = '';
            this.showSearchPanel = false;
        }
    }

    searchWithKeyword(keyword: string): void {
        this.searchQuery = keyword;
        this.router.navigate(['/searches'], { queryParams: { q: keyword } });
        this.searchQuery = '';
        this.showSearchPanel = false;
    }

    toggleUserDropdown(): void {
        this.isUserDropdownOpen = !this.isUserDropdownOpen;
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: (response: any) => {
                this.authService.clearLocalStorageAndRedirect();
            },
            error: (error: any) => {
                this.authService.clearLocalStorageAndRedirect();
            },
        });
    }

    private loadUserInfo(): void {
        const userID: number = this.usersService.getCurrentUserID();
        this.usersService.getUserByID(userID).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.userInfo = {
                        id: response.data[0].id,
                        avatar: response.data[0].avatar,
                        firstName: response.data[0].first_name,
                        lastName: response.data[0].last_name,
                        userName: "",
                        password: "",
                        role: "staff",
                        email: response.data[0].email,
                        phoneNumber: response.data[0].phone_number,
                        gender: response.data[0].gender,
                        birthDay: response.data[0].birth_day,
                        address: response.data[0].address,
                    }
                }
            },
            error: (error: any) => {
                console.log(">>> error when fetching user info:", error);
            }
        });
    }

    private loadNumberOfCartProduct(): void {
        const userID: number = this.usersService.getCurrentUserID();
        this.cartService.getNumberOfCartProduct(userID).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.cartItemCount = response.data;
                    return;
                }

                this.cartItemCount = 0;
            },
            error: (error: any) => {
                this.cartItemCount = 0;
            }
        })
    }

    private loadTopSearchKeywords(): void {
        this.productsService.getTopSearches(10).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.topSearchKeywords = response.data;
                }
            },
            error: (error: any) => {
                console.log(">>> error when fetching top search keywords:", error);
            },
        });
    }

    private loadSearchHistory(): void {
        this.productsService.getSearchHistory(10).subscribe({
            next: (response: any) => {
                if (response && response.code === 1) {
                    this.searchHistory = [...new Set(response.data as string[])];
                }
            },
            error: (error: any) => {
                console.log(">>> error when fetching search history:", error);
            }
        });
    }
}