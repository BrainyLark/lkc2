import { Component, OnInit } from '@angular/core';
import { ModificationService } from '../modification.service';
import { Modification } from '../model/Task';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { language } from '../meta';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.component.html',
  styleUrls: ['./modification.component.css']
})
export class ModificationComponent implements OnInit {

  jwt_token: string;
  gid: string;
  statusCode: number = 2;
  regex = /^[А-Я а-я\u04E9\u04AF\u0451\u04AE\u04E8\u0401]+$/i;
  startDate: Date;
  endDate: Date;

  currentTask: Modification;
  language = language;
  isSpinning: boolean = false;
  selectedInd = 0;
  statusMsg = '';

  modifications = [];

  constructor(
  	private modificationService: ModificationService, 
  	private router: Router, 
  	private loginService: LoginService,
  	private activatedRoute: ActivatedRoute,
  	private snackBar: MatSnackBar,
    private translate: TranslateService) { }

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
    });
  }

  prepareData() {
  	this.modificationService.getTask(this.jwt_token, this.gid).subscribe(res => {
  		this.isSpinning = false;
  		this.statusCode = res.statusCode;
  		if (this.statusCode) {
  			this.startDate = new Date();
  			this.currentTask = res;
  			this.currentTask.task.translatedWords.forEach(w => this.modifications.push({ preWord: w.word, postWord: '' }));
  			let cnt = 0;
        this.currentTask.task.synset.forEach(s => { if (s.vocabularyId == 1) this.selectedInd = cnt; cnt++; });
        this.currentTask.task.synset.forEach(s => { if (s.gloss == 'NO_GLOSS' || s.gloss == 'no_gloss') s.gloss =  '' });
  		}
  		else if (!res.statusCode) {
  			this.statusMsg = res.statusMsg;
  		}
  	}, error => { if (error.status == 401) {this.router.navigateByUrl('/login'); return;} })
  }

  sendData() {
    this.endDate = new Date();

    // forum validation process
    for(let w = 0; w < this.modifications.length; w++) {
      let cWord = this.modifications[w].postWord;
      if (!cWord.trim().length || !this.regex.test(cWord)) {
        this.translate.get("md_alerts.invalid").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
      })
        return;
      }
    }

    this.statusCode = 2;
    this.statusMsg = '';
    this.isSpinning = true;

    let payload = {
      taskId: this.currentTask.task._id,
      domainId: this.gid,
      modifiedWords: this.modifications,
      start_date: this.startDate,
      end_date: this.endDate
    }

    this.modificationService.sendModification(this.jwt_token, payload).subscribe(res => {
      if (res.statusSuccess) {
        this.modifications = [];
        this.prepareData();
      }
    }, error => {
      this.translate.get("md_alerts.save_err").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
      })
      if (error.status == 401) this.router.navigateByUrl('/login');
      return;
    });
  }

  clearForm(index):void {
  	if (this.modifications.length == 1) {
  		this.translate.get("md_alerts.last").subscribe(msg => {
          this.snackBar.open(msg, "Ok", {duration:3000});
      })
  		return;
  	}
  	this.modifications.splice(index, 1)
  }

  copyPreword(index):void {
  	this.modifications[index].postWord = this.modifications[index].preWord;
  }

}
