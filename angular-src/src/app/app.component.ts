import { Component } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  username = '';

  isAuth(): any {
  	var user = JSON.parse(localStorage.getItem('user'));
  	if (user) {
  		this.username = user.username;
  		return true;
  	} else {
  		return false;
  	}
  }
}
