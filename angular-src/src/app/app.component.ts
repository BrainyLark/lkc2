import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  username = '';

  constructor(private router: Router, public snackBar: MatSnackBar) {}

  isAuth(): boolean {
  	var user = JSON.parse(localStorage.getItem('user'));
  	if (user) {
  		this.username = user.username;
  		return true;
  	} else {
  		return false;
  	}
  }

  ngOnInit() {
    document.body.classList.add('bg-img');
  }

  exit(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    this.snackBar.open("Баярлалаа, дараа дахин орж ирээрэй!", "Тэгнэ ээ", { duration: 5000 });
    this.router.navigateByUrl('/login');
  }
}
