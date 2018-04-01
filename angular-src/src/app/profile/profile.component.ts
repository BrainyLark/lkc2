import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { User } from '../model/User';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User = new User();
  jwt_token: string;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
      // this.checkAuth();
  }

  checkAuth() {
    this.jwt_token = localStorage.getItem('jwt_token');
    if (!this.jwt_token) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.loginService.getProfile(this.jwt_token).subscribe(
      user => { this.user = user },
      error => {
      if (error.status == 401) {
        this.router.navigateByUrl('/login');
        return;
      }
    });
  }

}
