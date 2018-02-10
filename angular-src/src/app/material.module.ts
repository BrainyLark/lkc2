import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule } from '@angular/material';

@NgModule({
	imports: [MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule],
	exports: [MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule],
})

export class MaterialModule { }
