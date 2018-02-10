import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule } from '@angular/material';

@NgModule({
	imports: [MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule],
	exports: [MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule],
})

export class MaterialModule { }
