import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ITask } from '@hems/interfaces';
import { DisplayDateService } from '../../services/display-date.service';
import { TasksService } from '../../services/tasks.service';
import { EditTaskDialogComponent } from './editTaskDialog/editTaskDialog.component';

@Component({
  selector: 'hems-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  morningTasks: ITask[] = [];
  eveningTasks: ITask[] = [];
  displayDate = new Date();

  isLoading = false;

  morningColumns = ['time', 'task', 'done', 'initials', 'actions'];

  eveningColumns = ['time', 'task', 'done', 'initials', 'actions'];

  constructor(
    private readonly tasksService: TasksService,
    private snackBar: MatSnackBar,
    private displayDateService: DisplayDateService,
    private dialog: MatDialog
  ) {
    this.displayDateService.getDisplayDateSubject().subscribe((date) => {
      this.displayDate = new Date(date);
      this.fetchTasks();
    });
  }

  ngOnInit(): void {
    this.fetchTasks();
  }

  fetchTasks(): void {
    this.isLoading = true;
    this.tasksService.get(this.displayDate).subscribe({
      next: (tasks) => {
        this.morningTasks = tasks.tasks.filter(
          (task) => task.listName === 'Morning'
        );
        this.eveningTasks = tasks.tasks.filter(
          (task) => task.listName === 'Evening'
        );
        console.log(this.morningTasks);
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
        this.snackBar.open(
          'Tasks have failed to load',
          'Imma try again later',
          {
            duration: 10000,
          }
        );
      },
    });
  }

  onSubmit(): void {
    return;
  }

  openEditTaskDialog(task: ITask): void {
    this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      data: task,
    });
  }
}
