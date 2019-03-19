import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HeaderComponent } from './header/header.component';
import { ReminderModalComponent } from './calendar/reminder-modal/reminder-modal.component';

import { 
    AuthService,
    LocalStorage,
    ReminderService,
    UserService
} from './core/services';



@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        CalendarComponent,
        HeaderComponent,
        ReminderModalComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        AppRoutingModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        })
    ],
    providers: [
        AuthService,
        LocalStorage,
        ReminderService,
        UserService
    ],
    entryComponents: [
        ReminderModalComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
