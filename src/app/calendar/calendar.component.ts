import { MatDialog } from '@angular/material';
import { Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { isSameDay, isSameMonth } from 'date-fns';

import {
    Component,
    ChangeDetectionStrategy,
    ViewChild,
    TemplateRef,
    OnInit
} from '@angular/core';

import {
    CalendarEvent,
    CalendarEventAction,
    CalendarEventTimesChangedEvent,
    CalendarView
} from 'angular-calendar';

import { ReminderModalComponent } from './reminder-modal/reminder-modal.component';
import { Reminder } from '../core/models';
import { ReminderService } from '../core/services';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
    @ViewChild('modalContent') modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();

    actions: CalendarEventAction[] = [
        {
            label: '<i class="material-icons">clear</i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Delete', event);
            }
        },
        {
            label: '<i class="material-icons">create</i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edit', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];

    activeDayIsOpen: boolean = false;

    constructor(
        private matDialog: MatDialog,
        private snackBar: MatSnackBar,
        private reminderService: ReminderService
    ) { }
    
    ngOnInit(): void {
        this.reminderService.getUserReminders()
        .subscribe(
            data => {
                this.handleReminders(data.reminders);
                this.refresh.next();
            }
        )
    }

    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map(iEvent => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        if(action == 'Delete') {
            this.reminderService.remove(event.id)
            .subscribe(
                data => {
                    if(data) {
                        this.openSnackBar('Reminder Deleted');
                    } else {
                        this.openSnackBar("Action couldn't be completed");
                    }
                }
            )
        }

        if(action == 'Edit') {
            const reminder: Reminder = {
                id: event.id,
                title: event.title,
                color: event.color.primary,
                startDate: event.start
            }
            this.openDialog(reminder)
        }
    }

    addEvent(reminder: Reminder) {
        this.events = [
            ...this.events,
            {
                id: reminder.id,
                start: reminder.startDate,
                end: reminder.startDate,
                title: reminder.title,
                color: {
                    primary: reminder.color,
                    secondary: '#fff'
                },
                actions: this.actions,
                allDay: false,
                resizable: {
                    beforeStart: false,
                    afterEnd: false
                },
                draggable: false
            }
        ];
    }

    updateEvent(reminder: Reminder) {
        for (let i = 0; i < this.events.length; i++) {
            if(reminder.id == this.events[i].id) {
                this.events[i].start = reminder.startDate;
                this.events[i].end = reminder.startDate;
                this.events[i].title = reminder.title;
                this.events[i].color.primary = reminder.color;
            }
        }
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    openDialog(reminder?: Reminder) {
        const dialogRef = this.matDialog.open(ReminderModalComponent, {
            height: (window.innerHeight <= 600) ? '90%' : (window.innerHeight <= 700) ? '80%' : (window.innerHeight <= 800) ? '70%' : (window.innerHeight <= 900) ? '60%' : '50%',
            width: (window.innerWidth <= 600) ? '80%' : (window.innerWidth <= 992) ? '70%' : (window.innerWidth <= 1400) ? '60%' : (window.innerWidth > 1400) ? '50%' : '50%',
            panelClass: 'p-3',
            data: reminder
        });
        dialogRef.afterClosed().subscribe(
            result => {
                if(result) {
                    if(result.id) {
                        this.reminderService.update(result)
                        .subscribe(
                            data => {
                                this.openSnackBar('Reminder Updated');
                                this.updateEvent(data.reminder);
                                this.refresh.next();
                            }
                        );
                    } else {
                        this.reminderService.create(result)
                        .subscribe(
                            data => {
                                this.openSnackBar('Reminder Saved');
                                this.addEvent(data.reminder);
                                this.refresh.next();
                            }
                        );                  
                    }
                }
            }
        );
    }

    openSnackBar(message: string) {
        this.snackBar.open(message, '', {
            duration: 2000,
            panelClass: ['justify-content-center', 'd-flex']
        });
    }

    handleReminders(reminders){
        this.events = [];
        if(reminders)
            for (let i = 0; i < reminders.length; i++) {
                const reminder: CalendarEvent = {
                    id: reminders[i].id,
                    start: new Date(reminders[i].startDate),
                    end: new Date(reminders[i].startDate),
                    title: reminders[i].title,
                    color: {
                        primary: reminders[i].color,
                        secondary: '#fff'
                    },
                    actions: this.actions,
                    allDay: false,
                    resizable: {
                        beforeStart: false,
                        afterEnd: false
                    },
                    draggable: false
                };
                this.events.push(reminder);
            }
    }
}