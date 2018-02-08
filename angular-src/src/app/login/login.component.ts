import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material';
import { LoginRes } from '../model/response';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';
  isSpinning: boolean = false;

  constructor(private loginService: LoginService, public snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
  	this.checkAuth();
  }

  login() {
  	this.isSpinning = true;
  	if(!this.username.length || !this.password.length) {
  		this.snackBar.open("Шаардлагатай талбаруудыг бүрэн бөглөнө үү!", "За, ойлголоо", { duration: 5000 });
  		this.isSpinning = false;
  		return;
  	}
    this.loginService.signIn({ u: this.username, p: this.password }).subscribe(res => {
    	if (res.success) {
    		localStorage.setItem('jwt_token', res.token);
    		localStorage.setItem('user', JSON.stringify(res.user));
    		this.isSpinning = false;
    		this.snackBar.open("Амжилттай нэвтэрлээ~! Хөгжилтэй цагийг өнгөрүүлээрэй! xD", "За тэгье өө ^_^", { duration: 5000 });
    		this.router.navigateByUrl('/');
    	} else {
    		this.snackBar.open(res.msg, "За", { duration: 5000 });
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
