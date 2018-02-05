import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

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

  constructor() { }

  ngOnInit() {
  }

  getErrorMessage() {
  	return this.email.hasError('required') ? 'Мейл хаягаа оруулахаа мартуузай :)' : 
  		this.email.hasError('email') ? 'Зөв мейл хаяг биш байна даа :(' : '';
  }

}
