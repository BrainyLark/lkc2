import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material';
import { LoginRes } from '../model/response';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  isSpinning: boolean = false;

  constructor(private translate: TranslateService, 
    private loginService: LoginService, 
    public snackBar: MatSnackBar, 
    private router: Router) { }

  ngOnInit() {
    this.checkAuth();
  }

  login() {
  	this.isSpinning = true;
  	if(!this.username.length || !this.password.length) {
      this.translate.get(["login.msg.ok", "login.msg.invalid"]).subscribe(msg => {
        this.snackBar.open(msg['login.msg.invalid'], msg['login.msg.ok'], { duration: 3000 });
      })
  		this.isSpinning = false;
  		return;
  	}
    this.loginService.signIn({ u: this.username, p: this.password }).subscribe(res => {
    	if (res.success) {
    		localStorage.setItem('jwt_token', res.token);
    		localStorage.setItem('user', JSON.stringify(res.user));
    		this.isSpinning = false;
    		this.translate.get(["login.msg.ok", "login.msg.welcome"]).subscribe(msg => {
          this.snackBar.open(msg['login.msg.welcome'], msg['login.msg.ok'], { duration: 3000 });
        })
    		this.router.navigateByUrl('/task');
    	} else {
    		this.translate.get([res.msg, 'register.msg.ok']).subscribe(msg => {
          this.snackBar.open(msg[res.msg], msg['register.msg.ok'], {duration: 3000});
        })
    		this.isSpinning = false;
    	}
    });
  }

  checkAuth() {
  	let jwt_token = localStorage.getItem('jwt_token');
  	if (jwt_token) {
  		this.loginService.getProfile(jwt_token).subscribe(res => { if(res) this.router.navigateByUrl('/') });
  	}
  }

}
