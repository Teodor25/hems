import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IAssignment } from '@hems/interfaces';
import { AssignmentsService } from '../../services/assignments.service';
import { CreateAssignmentDialogComponent } from './createAssignmentDialog/create-assignment-dialog.component';
import { UpdateAssignmentDialogComponent } from './updateAssignmentDialog/update-assignment-dialog.component';

@Component({
  selector: 'hems-assignments-page',
  templateUrl: './assignments-page.component.html',
  styleUrls: ['./assignments-page.component.scss'],
})
export class AssignmentsPageComponent implements OnInit {
  assignmentList: IAssignment[] = [];

  assignmentColumns = [
    'room',
    'task',
    'comments',
    'receivedBy',
    'receivedAt',
    'performedBy',
    'completedAt'
  ]

  constructor(
    private assignmentsService: AssignmentsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.fetchAssignments();
  }

  fetchAssignments(): void {
    this.assignmentsService.getAssignments(new Date()).subscribe({
      next: (assignments) => {
        this.assignmentList = assignments;
        console.log('checkin', assignments);
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open(
          'Check In data have failed to load',
          'Imma try again later',
          {
            duration: 10000,
          }
        );
      },
    });
  }

  createAssignment(): void {
    this.dialog.open(CreateAssignmentDialogComponent, { width: '500px' });
  }

  editAssignment(assignmentId: string): void {
    this.dialog.open(UpdateAssignmentDialogComponent, {
      width: '500px',
      data: this.assignmentList.find((assignment) => assignment.assignmentId === assignmentId),
    });
  }
}
