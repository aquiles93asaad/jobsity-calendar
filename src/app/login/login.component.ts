import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../core/services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    login(): void {
        this.authService.login(this.loginForm.get('username').value, this.loginForm.get('password').value)
        .subscribe(
            data => {
                if(data.userError)
                    this.loginForm.get('username').setErrors({ userExists: true });

                if(data.passwordError)
                    this.loginForm.get('password').setErrors({ wrongPass: true });

                if(data.user)
                    this.router.navigate([''], { queryParams: { user: JSON.stringify(data.user) }});
            }
        )
    }

    get form() { return this.loginForm.controls; }
}