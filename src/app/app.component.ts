import { Component, OnInit } from '@angular/core';

import { AuthService } from './core/services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    user: any;

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.user = this.authService.getUser();
    }
}
