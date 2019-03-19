import { Reminder } from './reminder.model';

export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    reminders: Reminder[]
}
