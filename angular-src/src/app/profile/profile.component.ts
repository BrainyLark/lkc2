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

  user: User;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit() {
      this.checkAuth();
  }

  checkAuth(): void {
      let jwt_token = localStorage.getItem('jwt_token');
      if (jwt_token) {
          this.loginService.getProfile(jwt_token).subscribe(res => {
              if (res) {
                  this.user = res;
              } else {
                  this.router.navigateByUrl('/login');
              }
          })
      } else {
          this.router.navigateByUrl('/login');
      }
  }

}
