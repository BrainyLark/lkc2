import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  username = '';

  constructor(private router: Router, public snackBar: MatSnackBar, private translate: TranslateService) {
    translate.addLangs(['en', 'mn']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

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
    this.snackBar.open("Bye", "Ok", { duration: 5000 });
    this.router.navigateByUrl('/login');
  }

}
