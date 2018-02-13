import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { PerformanceRes } from '../model/response';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  performance: PerformanceRes;

  constructor(private taskService: TaskService) { }

  ngOnInit() {
  	this.showPerformance();
  }

  showPerformance() {
  	let jwt_token = localStorage.getItem('jwt_token');
  	this.taskService.getPerformance(jwt_token).subscribe(res => this.performance = res);
  }

}
