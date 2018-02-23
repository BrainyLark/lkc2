import { Component, OnInit, Input } from '@angular/core';
import { TranslationService } from '../translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Translation } from '../model/Task';
import { LoginService } from '../login.service';
import { language } from '../meta';
import 'rxjs/add/operator/catch';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css'],
  animations: [
    trigger('prevCardPosition', [
      state('active', style({
        width: '40%',
        cursor: 'default'
      })),
      state('inactive', style({
        width: '20%',
        cursor: 'pointer'
      })),
      transition('* => *', animate('200ms ease'))
    ]),
    trigger('mainCardPosition', [
      state('active', style({
        width: '50%',
        cursor: 'default'
      })),
      state('inactive', style({
        width: '30%',
        cursor: 'pointer'
      })),
      transition('* => *', animate('200ms ease'))
    ])
  ]
})
export class TranslationComponent implements OnInit {
  
  jwt_token: string;
  gid: string;
  statusCode: number = 2;
  statusMsg: string = '';
  currentTask: Translation;
  rates = [1, 2, 3, 4, 5];
  alert:string = '';
  isSpinning: boolean = false;
  regex = /^[А-Я а-я\u04E9\u04AF\u0451\u04AE\u04E8\u0401]+$/i;
  language = language;
  selectedInd = 0;

  taskRun = [{ lemma: "", rating: 3 }];
  start_date;
  end_date;

  prevState = 'inactive';
  mainState = 'active';

  constructor(
  	private translationService: TranslationService, 
  	public router: Router, 
  	private activatedRoute: ActivatedRoute,
    private loginService: LoginService) { }

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
        this.currentTask.synset.forEach(s => { if (s.vocabularyId == 1) this.selectedInd = cnt; cnt++; });
      }
      else if (!res.statusCode) {
  			this.statusMsg = res.statusMsg;
  		}
  	}, error => { if (error.status == 401) {this.router.navigateByUrl('/login'); return;} })
  }

  addForm(): void {
    let formData = this.taskRun[this.taskRun.length - 1];
    if (!formData.lemma.trim().length) {
      this.alert = 'Орчуулах үгээ оруулна уу!';
      return;
    }
    formData.lemma = formData.lemma.trim();
    if (!this.regex.test(formData.lemma)) {
      this.alert = 'Тэмдэгт орсон байна, зөвхөн монгол үсэг ашиглана уу!';
      return;
    }
    this.alert = '';
    this.taskRun.push({ lemma: "", rating: 3 });
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
      this.alert = 'Илгээх өгөгдөл байхгүй байна!';
      this.taskRun.push({ lemma: "", rating: 3 });
      return;
    }
    this.statusCode = 2;
    this.statusMsg = '';
    this.isSpinning = true;
    let payload = {
      taskId: this.currentTask._id,
      domainId: this.currentTask.domainId,
      translation: this.taskRun,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.translationService.sendTranslation(this.jwt_token, payload).subscribe(res => {
      if (res.statusSuccess) {
        this.taskRun = [{ lemma: "", rating: 3 }];
        this.prepareData();
      }
    }, error => { 
      alert("Орчуулгыг хадгалахад алдаа гарлаа, та дахин оролдоно уу!");
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
    this.mainState = 'inactive';
  }

  setMainState() {
    this.mainState = 'active';
    this.prevState = 'inactive';
  }

}
