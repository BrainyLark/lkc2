import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule, MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule, MatChipsModule } from '@angular/material';

@NgModule({
	imports: [MatListModule, MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule, MatChipsModule],
	exports: [MatListModule, MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule, MatChipsModule],
})

export class MaterialModule { }
