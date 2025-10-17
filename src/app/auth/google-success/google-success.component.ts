import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-google-success',
    standalone: true,
    template: `<p>Handling Google sign-in...</p>`,
})
export class GoogleSuccessComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    constructor() {
        this.route.queryParams.subscribe(params => {
            const token = params['access_token'];
            const role = params['role'];
            const user_id = params['user_id'];

            if (!token) {
                this.router.navigate(['/login']);
                return;
            }

            // if opened in popup -> post message to opener
            if (window.opener && !window.opener.closed) {
                try {
                    window.opener.postMessage({ provider: 'google', access_token: token, role, user_id }, window.location.origin);
                } catch (e) { }
                window.close();
            } else {
                // direct navigation: store token and redirect
                try { localStorage.setItem('access_token', token); } catch (e) { }
                if (role) try { localStorage.setItem('role', role); } catch (e) { }
                if (user_id) try { localStorage.setItem('user_id', user_id); } catch (e) { }

                if (role === 'admin') this.router.navigate(['/admin']);
                else if (role === 'staff') this.router.navigate(['/staff']);
                else this.router.navigate(['/']);
            }
        });
    }
}
