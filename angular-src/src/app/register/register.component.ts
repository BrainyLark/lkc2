import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { RegisterService } from '../register.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

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

  constructor(private registerService: RegisterService, public snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
  }

  getErrorMessage() {
  	return this.email.hasError('required') ? 'Мейл хаягаа оруулахаа мартуузай :)' : 
  		this.email.hasError('email') ? 'Зөв мейл хаяг биш байна даа :(' : '';
  }

  registerUser() {
    if(this.registerService.isValid({ u: this.uname, n: this.name, e: this.email, p: this.password })) {
      this.snackBar.open("Амжилттай бүртгэгдлээ!", "Ойлголоо");
      this.router.navigateByUrl('/login');
    } else {
      this.snackBar.open("Бүртгэл амжилтгүй! Шаардлагатай мэдээллүүдийг оруулна уу!", "За, ойлголоо");
    }
  }

}
