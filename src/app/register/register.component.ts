import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomValidators } from '../core/validators/match-input.validator';
import { AuthService } from '../core/services';

import { User } from '../core/models';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    registerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) { }

    ngOnInit() {
        this.registerForm = this.fb.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            passwords: this.fb.group({
                password: ['', Validators.required],
                repeat: ['', Validators.required]
            }, {
                validator: CustomValidators.Match('password', 'repeat')
            }),
            
        });
    }

    register() {
        let user: User = this.registerForm.value;
        const password = this.registerForm.get('passwords').get('password').value;
        delete user['passwords'];
        user.password = password;
        this.authService.register(user)
        .subscribe(
            data => {
                if(data.userError)
                    this.registerForm.get('username').setErrors({ userExists: true });

                if(data.passwordError)
                    this.registerForm.get('email').setErrors({ emailExists: true });

                if(data.user)
                    this.router.navigate([''], { queryParams: { user: JSON.stringify(data.user) }});
            }
        )
    }

    get form() { return this.registerForm.controls; }
    get passwords() { return this.registerForm.get('passwords')['controls']; }
}
