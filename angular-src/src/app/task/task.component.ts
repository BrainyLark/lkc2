import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
import { PerformanceRes } from '../model/response';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  performance: PerformanceRes = new PerformanceRes();
  jwt_token: string;

  constructor(private taskService: TaskService, private router: Router, private loginService: LoginService) { }

  ngOnInit() {
    this.checkAuth();
  }

  showPerformance() {
  	this.taskService.getPerformance(this.jwt_token).subscribe(res => this.performance = res);
  }

  checkAuth() {
    this.jwt_token = localStorage.getItem('jwt_token');
    if (this.jwt_token) {
      this.loginService.getProfile(this.jwt_token).subscribe(
        user => { this.showPerformance(); }, 
        error => {
        if (error.status == 401) {
          this.router.navigateByUrl('/login');
          return;
        }
      });
    } else {
      this.router.navigateByUrl('/login');
      return;
    }
  }

}
