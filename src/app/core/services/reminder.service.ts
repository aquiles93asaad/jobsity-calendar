import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Reminder } from '../models';
import { LocalStorage } from './local-storage.service';
import { UserService } from './user.service';

@Injectable()
export class ReminderService {

    constructor(
        private localStorage: LocalStorage,
        private userService: UserService
    ) { }

    /**
     * Creates a reminder for the logged user
     */
    create(reminder: Reminder): Observable<any> {
        return Observable.create(
            observer => {
                let user = (<any>window).user;
                let reminders = user.reminders;
                let counter: number;

                if(!reminders) {
                    reminders = [];
                    counter = 0;
                } else {
                    (reminders.length == 0) ? counter = 0 : counter = reminders[reminders.length - 1].id; 
                }

                reminder.id = counter + 1;
                reminders.push(reminder);
                this.updateUserReminders(user, reminders);
                observer.next({ reminder: reminder });
                observer.complete();
            }
        );
    }

    /**
     * Updates an already existing reminder 
     */
    update(reminder: Reminder): Observable<any> {
        return Observable.create(
            observer => {
                let user = (<any>window).user;
                let reminders = user.reminders;

                for (let i = 0; i < reminders.length; i++) {
                    if(reminders[i].id == reminder.id) {
                        reminders[i] = reminder;
                        break;
                    }
                }

                this.updateUserReminders(user, reminders);
                observer.next({ reminder: reminder });
                observer.complete();
            }
        );
    }

    /**
     * removes an already existing reminder 
     */
    remove(reminderId: any): Observable<any> {
        return Observable.create(
            observer => {
                let user = (<any>window).user;
                let reminders = user.reminders;

                for (let i = 0; i < reminders.length; i++) {
                    if(reminders[i].id == reminderId) {
                        reminders.splice(i, 1);
                        break;
                    }
                }

                this.updateUserReminders(user, reminders);
                observer.next(true);
                observer.complete();
            }
        );
    }

    /**
     * Returns all logged user reminders
     */
    getUserReminders(): Observable<any> {
        return Observable.create(
            observer => {
                const user = (<any>window).user;
                observer.next({ reminders: user.reminders });
                observer.complete();
            }
        );
    }

    private updateUserReminders(user, reminders) {
        user.reminders = reminders;
        let users = JSON.parse(this.localStorage.get('users'));
        users = this.userService.updateUser(users, user);
        this.localStorage.save('users', JSON.stringify(users));
        (<any>window).user = user;
    }
}
