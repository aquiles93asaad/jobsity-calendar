import { Injectable } from '@angular/core';
import { User } from '../models';

@Injectable()
export class UserService {

    constructor() { }

    /**
     * Finds a user by email, username, or userId in the array provided
     */
    findUser(users, username?, email?, userId?): User {
        let user = null;
        if(users)
            for (let i = 0; i < users.length; i++) {
                if(users[i].username == username || users[i].id == userId || users[i].email == email) {
                    user = users[i];
                    break;
                }
            }
        return user;
    }

    /**
     * Finds and updates a user in the users array and returns the updates array
     */
    updateUser(users, user): User[] {
        if(users)
            for (let i = 0; i < users.length; i++) {
                if(users[i].id == user.id) {
                    users[i] = user;
                    break;
                }
            }
            
        return users;
    }
}