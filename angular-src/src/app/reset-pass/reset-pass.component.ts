import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {

	username: string = "";
	token: string = "";
	password: string = "";
	repassword: string = "";

	isUserfieldAllowed: boolean = true;
	isTokenAllowed: boolean = false;
	isResetAllowed: boolean = false;
	isSuccess: boolean = false;
	isFailure: boolean = false;

	isSendingEmail: boolean = false;
	isSendingToken: boolean = false;
	isSendingPass: boolean = false;

	constructor(private loginService: LoginService, public snackBar: MatSnackBar) { }

	ngOnInit() {

	}

	sendEmail() {
		if (!this.username.trim().length) {
			this.snackBar.open("Хэрэглэгчийн нэрээ оруулна уу!", "За", {duration: 3000})
			return;
		}
		this.isSendingEmail = true;
		this.loginService.resetPass(this.username).subscribe(status => {
			this.isSendingEmail = false;
			if (status.success) {
				this.isUserfieldAllowed = false;
				this.isTokenAllowed = true;
			} else {
				this.snackBar.open('Хэрэглэгч олдсонгүй!', "Ok", {duration: 3000});
			}
		})
	}

	checkToken() {
		if (!this.token.trim().length) {
			this.snackBar.open("Баталгаажуулалтын кодоо оруулна уу!", "За", {duration: 3000})
			return;
		}

		this.isSendingToken = true;

		this.loginService.checkToken(this.username, this.token).subscribe(res => {
			this.isSendingToken = false;
			if (res.success) {
				this.isTokenAllowed = false;
				this.isResetAllowed = true;
			} else {
				this.snackBar.open("Баталгаажуулалтын код буруу байна, та дахин оролдоно уу!", "За", {duration: 3000});
			}
		})
	}

	resetPass() {
		if (this.password.trim().length < 6) {
			this.snackBar.open("Дор хаяж 6 тэмдэгт оруулна уу!", "За", {duration: 3000});
			return
		}
		if (this.password != this.repassword) {
			this.snackBar.open("Дахин оруулсан нууц үг тань тохирохгүй байна!", "За", {duration: 3000});
			return;
		}
		this.isSendingPass = true;
		this.loginService.updatePass(this.username, this.token, this.password).subscribe(res => {
			this.isSendingPass = false;
			if (res.success) {
				this.isResetAllowed = false;
				this.isSuccess = true;
			} else {
				this.isFailure = true;
			}
		})
	}

}
