import { NgModule } from '@angular/core';

import { 
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatToolbarModule,
    MatTooltipModule,
    MatDialogModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
} from '@angular/material';

/**
 * NgModule that includes the Material modules we need in this project.
*/
@NgModule({
    exports: [
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule
    ]
})
export class MaterialModule { }
