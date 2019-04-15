import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(
    private translate: TranslateService, 
    private cookieService: CookieService) { }

  ngOnInit() {
    
  }

  changeLang(language: string) {
    this.translate.use(language);
    this.cookieService.set('ui-lang', language);
  }

}
