import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'app';
  username = '';

  constructor(
    private router: Router, 
    public snackBar: MatSnackBar, 
    private translate: TranslateService,
    private cookieService: CookieService) {
        let langCookie = 'ui-lang';
        let defaultLang = 'en';
        if(cookieService.check(langCookie) || this.cookieService.get(langCookie) != undefined)
          defaultLang = this.cookieService.get(langCookie);
        translate.addLangs(['en', 'mn']);
        translate.setDefaultLang(defaultLang);
        translate.use(defaultLang);
  }

  changeLang(lang: string) {
    this.translate.use(lang);
    this.cookieService.set('ui-lang', lang);
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
