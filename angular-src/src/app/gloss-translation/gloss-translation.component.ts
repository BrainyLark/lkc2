import { Component, OnInit, Input } from '@angular/core';
import { TranslationService } from '../translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Translation } from '../model/Task';
import { LoginService } from '../login.service';
import { language } from '../meta';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gloss-translation',
  templateUrl: './gloss-translation.component.html',
  styleUrls: ['./gloss-translation.component.css']
})
export class GlossTranslationComponent implements OnInit {

	jwt_token: string;
	gid: string;
	statusCode: number = 2;
	startDate: Date;
	endDate: Date;

	currentTask: Translation;
	language = language;
	isSpinning: boolean = false;
	selectedInd = 0;
	statusMsg = "";

	translatedGloss = "";

  	constructor(
  		private translationService: TranslationService,
  		private router: Router,
  		private loginService: LoginService,
  		private activatedRoute: ActivatedRoute,
  		private snackBar: MatSnackBar,
  		private translate: TranslateService
  	) { }

  	ngOnInit() {
  		this.checkAuth();
  		this.gid = this.activatedRoute.snapshot.paramMap.get('gid');
  		this.isSpinning = true;
  		this.prepareData();
  	}

  	checkAuth() {
  		this.jwt_token = localStorage.getItem('jwt_token');
  		if (!this.jwt_token) {
  			this.router.navigateByUrl('/login');
  			return;
  		}
  		this.loginService.getProfile(this.jwt_token).subscribe(
  			user => { },
  			error => {
  				if (error.status == 401) {
  					this.router.navigateByUrl('/login');
  				}
  				return;
  			}
  		);
  	}

  	prepareData() {
  		this.translationService.getTask(this.jwt_token, this.gid, 4).subscribe(res => {
  			this.isSpinning = false;
  			this.statusCode = res.statusCode;
  			if (this.statusCode) {
  				this.startDate = new Date();
  				this.currentTask = res;
  				let cnt = 0;
          this.currentTask.task.synset.forEach(s => { if (s.vocabularyId == 1) this.selectedInd = cnt; cnt++; });
        	this.currentTask.task.synset.forEach(s => { if (s.gloss == 'NO_GLOSS' || s.gloss == 'no_gloss') s.gloss =  '' });
  			}
  			else if (!res.statusCode) {
  				this.statusMsg = res.statusMsg;
  			}
  		}, error => { if (error.status == 401) {this.router.navigateByUrl('/login'); return;} })
  	}

    skip() {
      this.endDate = new Date();
      this.statusCode = 2;
      this.statusMsg = '';
      this.isSpinning = true;
      let payload = {
        taskId: this.currentTask.task._id,
        domainId: this.currentTask.task.domainId,
        start_date: this.startDate,
        end_date: this.endDate,
        skip: true,
        translationType: 'GlossTranslation'
      };
      this.translationService.sendTranslation(this.jwt_token, payload).subscribe(res => {
        if (res.statusSuccess) {
          this.translatedGloss = "";
          this.prepareData();
        }
      }, error => {
        this.translate.get("tr_alerts.save_err").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
        })
        if (error.status == 401) this.router.navigateByUrl('/login');
        return;
      });
    }

    sendData() {
      this.endDate = new Date();
      if (!this.translatedGloss.length) {
        this.translate.get("tr_alerts.no_data").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
        })
        return;
      }
      this.statusCode = 2;
      this.statusMsg = '';
      this.isSpinning = true;
      let payload = {
        taskId: this.currentTask.task._id,
        domainId: this.currentTask.task.domainId,
        translation: this.translatedGloss.toLowerCase(),
        start_date: this.startDate,
        end_date: this.endDate,
        translationType: 'GlossTranslation'
      };
      this.translationService.sendTranslation(this.jwt_token, payload).subscribe(res => {
        if (res.statusSuccess) {
          this.translatedGloss = "";
          this.prepareData();
        }
      }, error => { 
        this.translate.get("tr_alerts.save_err").subscribe(msg => {
            this.snackBar.open(msg, "Ok", {duration:3000});
          })
        if (error.status == 401) this.router.navigateByUrl('/login');
        return;
      });
    }

}
