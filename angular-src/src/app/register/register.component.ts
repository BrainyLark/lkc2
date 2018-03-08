import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  uname: string = '';
  name: string = '';
  password: string = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  isSpinning = false;

  constructor(private translate: TranslateService,
    private registerService: RegisterService, 
    public snackBar: MatSnackBar, 
    private router: Router, 
    private loginService: LoginService) { }

  ngOnInit() {
    this.checkAuth();
  }

  getErrorMessage() {
  	return this.email.hasError('required') ? 'register.err.supply_mail' :
  		this.email.hasError('email') ? 'register.err.invalid_mail' : '';
  }

  registerUser() {
    let form_data = { u: this.uname, n: this.name, e: this.email, p: this.password };
    if(this.registerService.isValid(form_data)) {
      this.isSpinning = true;
      this.registerService.signUp(form_data).subscribe(res => {
        this.isSpinning = false;
        if (res.success) {
          this.translate.get([res.message, 'register.msg.ok']).subscribe(msg => {
            this.snackBar.open(msg[res.message], msg['register.msg.ok'], {duration: 3000});
          })
          this.router.navigateByUrl('/login');
        } else {
          this.translate.get([res.message, 'register.msg.ok']).subscribe(msg => {
            this.snackBar.open(msg[res.message], msg['register.msg.ok'], {duration: 3000});
          })
        }
      });
    } else {
      this.translate.get(['register.msg.invalid', 'register.msg.ok']).subscribe(msg => {
        this.snackBar.open(msg['register.msg.invalid'], msg['register.msg.ok'], {duration: 3000});
      })
    }
  }

  checkAuth() {
    let jwt_token = localStorage.getItem('jwt_token');
    if (jwt_token) {
      this.loginService.getProfile(jwt_token).subscribe(res => { if(res) this.router.navigateByUrl('/') });
    }
  }

}
