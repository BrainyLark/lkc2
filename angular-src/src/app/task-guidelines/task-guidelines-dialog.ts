import { Injectable } from "@angular/core";
import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  guidelines: {
    title: String,
    task_description: String,
    guide_label: String,
    guides: [String],
    remark_label: String,
    remarks: [String],
    okbtn: String,
  };
}

/**
 * @title Task guideline dialog
 */
@Injectable()
export class TaskGuidelinesDialog {

  constructor(public dialog: MatDialog) {}

  openDialog(guidelines): void {
    const dialogRef = this.dialog.open(TaskGuidelinesDialogWindow, {
      width: '650px',
      data: {guidelines: guidelines}
    });
  }
}

@Component({
  selector: 'task-guidelines-dialog-content',
  templateUrl: './task-guidelines-dialog-content.html',
  styleUrls: ['./task-guidelines-dialog.css'],
})
export class TaskGuidelinesDialogWindow {

  constructor(
    public dialogRef: MatDialogRef<TaskGuidelinesDialogWindow>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}