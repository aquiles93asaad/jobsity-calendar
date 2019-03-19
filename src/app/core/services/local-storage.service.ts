import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorage {

    constructor() { }

    /**
     * Saves a pair of (key, value) in the window local storage
     */
    save(key: string, value: string) {
        window.localStorage.removeItem(key);
        window.localStorage.setItem(key, value);
    }

    /**
     * Looks for the value of the provided key in the window local storage
     */
    get(key: string): string {
        return localStorage.getItem(key);
    }

    /**
     * removes and item with the provided key in the window local storage
     */
    remove(key: string) {
        localStorage.removeItem(key);
    }
}