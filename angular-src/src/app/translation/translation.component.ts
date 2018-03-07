import { Component, OnInit, Input } from '@angular/core';
import { TranslationService } from '../translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Translation } from '../model/Task';
import { TranslationRes } from '../model/response';
import { LoginService } from '../login.service';
import { language } from '../meta';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import 'rxjs/add/operator/catch';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css'],
  animations: [
    trigger('prevCardPosition', [
      state('active', style({
        width: '45%',
        height: '100%',
        cursor: 'default',
      })),
      state('inactive', style({
        width: '15%',
        height: '50%',
        cursor: 'zoom-in',
        'transform': 'translateY(7em) rotateZ(-10deg)',
      })),
      transition('* => *', animate('250ms ease-out'))
    ]),
    trigger('mainCardPosition', [
      state('active', style({
        cursor: 'default',
        float: 'right'
      })),
      state('inactive', style({
        cursor: 'pointer',
      })),
      transition('* => *', animate('250ms ease-out'))
    ])
  ]
})
export class TranslationComponent implements OnInit {
  
  jwt_token: string;
  gid: string;
  statusCode: number = 2;
  statusMsg: string = '';
  
  currentTask: Translation;
  currentPrevTask: TranslationRes = new TranslationRes();

  rates = [1, 2, 3, 4, 5];
  alert:string = '';
  isSpinning: boolean = false;
  isPrevSpinning: boolean = false;
  regex = /^[А-Я а-я\u04E9\u04AF\u0451\u04AE\u04E8\u0401]+$/i;
  language = language;
  selectedInd = 0;
  prevSelectedInd = 0;
  isPrevExpanded = false;

  taskRun = [{ lemma: "", rating: -1 }];
  start_date;
  end_date;

  prevState = 'inactive';
  mainState = 'active';

  isGapActivated = false;

  constructor(
  	private translationService: TranslationService, 
  	public router: Router, 
  	private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private loginService: LoginService,
    private translate: TranslateService) { }

  ngOnInit() {
    this.checkAuth();
    this.gid = this.activatedRoute.snapshot.paramMap.get('gid');
    this.isSpinning = true;
  	this.prepareData();
  }

  prepareData() {
    this.selectedInd = 0;
  	this.translationService.getTask(this.jwt_token, this.gid).subscribe(res => {
      this.isSpinning = false;
      this.statusCode = res.statusCode;
  		if (res.statusCode) {	
        this.start_date = new Date();
  			this.currentTask = res;
        let cnt = 0;
        this.currentTask.task.synset.forEach(s => { if (s.vocabularyId == 1) this.selectedInd = cnt; cnt++; });
        this.currentTask.task.synset.forEach(s => { if (s.gloss == 'NO_GLOSS' || s.gloss == 'no_gloss') s.gloss =  '' });
        this.getPrevious(this.currentTask.task._id);
      }
      else if (!res.statusCode) {
  			this.statusMsg = res.statusMsg;
  		}
  	}, error => { if (error.status == 401) {this.router.navigateByUrl('/login'); return;} })
  }

  addForm(): void {
    let formData = this.taskRun[this.taskRun.length - 1];
    if (!formData.lemma.trim().length) {
      this.translate.get("tr_alerts.no_word").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
      })
      return;
    }
    if (formData.rating == -1) {
      this.translate.get("tr_alerts.no_rating").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
      })
      return;
    }
    formData.lemma = formData.lemma.trim();
    if (!this.regex.test(formData.lemma)) {
      this.translate.get("tr_alerts.no_char").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
      })
      return;
    }
    this.alert = '';
    this.taskRun.push({ lemma: "", rating: -1 });
  }

  clearForm(index): void {
    this.taskRun.splice(index, 1);
  }

  sendData() {
    this.end_date = new Date();
    let i = this.taskRun.length - 1;
    while (!this.taskRun[i].lemma.trim().length) {
      this.taskRun.pop();
      i --;
      if (i < 0) break;
    }
    if (!this.taskRun.length) {
      this.translate.get("tr_alerts.no_data").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
        })
      this.taskRun.push({ lemma: "", rating: -1 });
      return;
    }
    if (this.taskRun[i].rating == -1) {
      this.translate.get("tr_alerts.no_rating").subscribe(msg => {
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
      translation: this.taskRun,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.translationService.sendTranslation(this.jwt_token, payload).subscribe(res => {
      if (res.statusSuccess) {
        this.taskRun = [{ lemma: "", rating: -1 }];
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
    });
  }

  setPrevState() {
    this.prevState = 'active';
    this.isPrevExpanded = true;
    this.mainState = 'inactive';
  }

  setMainState() {
    this.mainState = 'active';
    this.isPrevExpanded = false;
    this.prevState = 'inactive';
  }

  getPrevious(boundaryTask) {
    this.isPrevSpinning = true;
    this.translationService.getPrevious(this.jwt_token, this.currentTask.task.domainId, boundaryTask).subscribe(run => {
      if(run.success) {
        this.currentPrevTask = run;
        let cnt = 0;
        this.currentPrevTask.data.synset.forEach(s => { if (s.vocabularyId == 1) this.prevSelectedInd = cnt; cnt ++; });
        this.currentPrevTask.data.synset.forEach(s => { if (s.gloss == 'NO_GLOSS' || s.gloss == 'no_gloss') s.gloss =  '' });
      } else {
        this.translate.get("tr_alerts.no_prev").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
        })
      }
      this.isPrevSpinning = false;
    }, error => {
      if (error.status == 401) {
        this.router.navigateByUrl('/login');
      }
      return;
    });
  }

  getNext(boundaryTask) {
    this.isPrevSpinning = true;
    this.translationService.getNext(this.jwt_token, this.currentTask.task.domainId, boundaryTask).subscribe(run => {
      if (run.success) {
        this.currentPrevTask = run;
        let cnt = 0;
        this.currentPrevTask.data.synset.forEach(s => { if (s.vocabularyId == 1) this.prevSelectedInd = cnt; cnt ++; });
        this.currentPrevTask.data.synset.forEach(s => { if (s.gloss == 'NO_GLOSS' || s.gloss == 'no_gloss') s.gloss =  '' });
      } else {
        this.translate.get("tr_alerts.no_next").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
        })
      }
      this.isPrevSpinning = false;
    }, error => {
      if (error.status == 401) {
        this.router.navigateByUrl('/login');
      }
      return;
    });
  }

  skip() {
    this.end_date = new Date();
    this.statusCode = 2;
    this.statusMsg = '';
    this.isSpinning = true;
    let payload = {
      taskId: this.currentTask.task._id,
      domainId: this.currentTask.task.domainId,
      start_date: this.start_date,
      end_date: this.end_date,
      skip: true
    };
    this.translationService.sendTranslation(this.jwt_token, payload).subscribe(res => {
      if (res.statusSuccess) {
        this.taskRun = [{ lemma: "", rating: -1 }];
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

  activateGap() {
    this.isGapActivated = !this.isGapActivated;
  }

}
