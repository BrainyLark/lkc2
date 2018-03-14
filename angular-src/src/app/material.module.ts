import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatRadioModule, MatChipsModule, MatTooltipModule, MatSelectModule, MatListModule, MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatCardModule, MatInputModule, MatIconModule, MatProgressSpinnerModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule } from '@angular/material';

@NgModule({
	imports: [MatExpansionModule, MatRadioModule, MatChipsModule, MatTooltipModule, MatSelectModule, MatListModule, MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule],
	exports: [MatExpansionModule, MatRadioModule, MatChipsModule, MatTooltipModule, MatSelectModule, MatListModule, MatDialogModule, MatTabsModule, MatGridListModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatInputModule, MatCardModule, MatStepperModule, MatFormFieldModule, MatSnackBarModule, MatMenuModule],
})

export class MaterialModule { }
