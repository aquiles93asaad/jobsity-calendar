import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { LocalStorage } from './local-storage.service';
import { User } from '../models';
import { UserService } from './user.service';

@Injectable()
export class AuthService {

    constructor(
        private localStorage: LocalStorage,
        private userService: UserService
    ) { }

    login(username: string, password: string): Observable<any> {
        return Observable.create(
            observer => {
                let users = JSON.parse(this.localStorage.get('users'));
                const user = this.userService.findUser(users, username);

                if(!user) {
                    observer.next({ userError: true });
                    observer.complete();
                } else {
                    if(user.password != password) {
                        observer.next({ passwordError: true });
                        observer.complete();
                    }
                }

                observer.next({ user: user });
                this.setUser(user);
                observer.complete();
            }
        );
    }

    register(user: User): Observable<any> {
        return Observable.create(observer => {
            let users = JSON.parse(this.localStorage.get('users'));
            let counter: number;
            const checkedUser = this.userService.findUser(users, user.username, user.email);

            if(checkedUser) {
                const error = {};
                (user.username == checkedUser.username) ? error['userError'] = true : error['emailError'] = true;
                observer.next(error);
                observer.complete();
            }

            if(!users) {
                users = [];
                counter = 0;
            } else {
                counter = users[users.length - 1].id; 
            }
            user.id = counter + 1;
            users.push(user);
            this.localStorage.save('users', JSON.stringify(users));
            observer.next({ user: user });
            this.setUser(user);
            observer.complete();
        });
    }

    setUser(user): void {
        this.localStorage.save('logged-user', user.id);
        (<any>window).user = user;
    }

    getUser(): User {
        const users = JSON.parse(this.localStorage.get('users'));
        const user = this.userService.findUser(users, null, null, this.localStorage.get('logged-user'));
        if(!(<any>window).user && user) {
            this.setUser(user);
        }
        return user;
    }

    signOut(): void {
        this.localStorage.remove('logged-user');
    }
}
