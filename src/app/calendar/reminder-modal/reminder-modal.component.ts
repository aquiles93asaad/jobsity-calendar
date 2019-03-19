import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { setHours, setMinutes, format } from 'date-fns';
import { Reminder } from '../../core/models';

@Component({
    selector: 'app-reminder-modal',
    templateUrl: './reminder-modal.component.html',
    styleUrls: ['./reminder-modal.component.scss']
})
export class ReminderModalComponent implements OnInit {

    title: string;
    reminderForm: FormGroup;

    colors: any = [
        {
            value: '#D50000',
            // primary: '#D50000',
            // secondary: '#D50000',
            label: 'Red'
        },
        {
            value: '#E67C73',
            // primary: '#E67C73',
            // secondary: '#E67C73',
            label: 'Pink'
        },
        {
            value: '#F4511E',
            // primary: '#F4511E',
            // secondary: '#F4511E',
            label: 'Orange'
        },
        {
            value: '#F6BF26',
            // primary: '#F6BF26',
            // secondary: '#F6BF26',
            label: 'Yellow'
        },
        {
            value: '#0B8043',
            // primary: '#0B8043',
            // secondary: '#0B8043',
            label: 'Green'
        },
        {
            value: '#33B679',
            // primary: '#33B679',
            // secondary: '#33B679',
            label: 'Emerald'
        },
        {
            value: '#039BE5',
            // primary: '#039BE5',
            // secondary: '#039BE5',
            label: 'Light Blue'
        },
        {
            value: '#3F51B5',
            // primary: '#3F51B5',
            // secondary: '#3F51B5',
            label: 'Blueberry'
        }
    ];

    constructor(
        public dialogRef: MatDialogRef<ReminderModalComponent>,
        private fb: FormBuilder,
        @Optional() @Inject(MAT_DIALOG_DATA) public reminder: Reminder
    ) { }

    ngOnInit() {
        (this.reminder) ? this.title = 'Edit Reminder' : this.title = 'Add Reminder';
        this.reminderForm = this.fb.group({
            title: [(this.reminder) ? this.reminder.title : '', [Validators.required, Validators.maxLength(30)]],
            color: [(this.reminder) ? this.reminder.color : '', Validators.required],
            startDate: [(this.reminder) ? this.reminder.startDate : '', Validators.required],
            startDateTime: [(this.reminder) ? format(this.reminder.startDate, 'HH:mm') : '', Validators.required]
        });
    }

    closeDialog() {
        this.dialogRef.close(this.reminder);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    save() {
        let formReminder = this.reminderForm.value;
        if(this.reminder)
            formReminder['id'] = this.reminder.id;
        const time = formReminder.startDateTime.split(':');
        formReminder.startDate = setHours(formReminder.startDate, time[0]);
        formReminder.startDate = setMinutes(formReminder.startDate, time[1]);
        delete formReminder.startDateTime;
        this.reminder = formReminder;
        this.closeDialog();
    }

    get form() { return this.reminderForm.controls; }
}
