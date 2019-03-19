import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../core/services';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    @Input() user: any = {};

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        if(!this.user) {
            this.route.queryParams
            .subscribe(
                params => {
                    if( params['user'] ){
                        this.user = JSON.parse(params['user']);
                    }
                }
            );
        }
    }

    logout(): void {
        this.authService.signOut();
        this.user = null;
        this.navigate('/login');
    }

    navigate(link): void {
        this.router.navigate([link]);
    }
}
