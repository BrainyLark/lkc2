import { Component, OnInit } from '@angular/core';
import { Validation } from '../model/Task';
import { LoginService } from '../login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { language } from '../meta';
import { ValidationService } from '../validation.service';

@Component({
  selector: 'app-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.css']
})
export class ValidationComponent implements OnInit {

  jwt_token: string;
  gid: string;
  statusCode: number = 2;
  regex = /^[А-Я а-я\u04E9\u04AF\u0451\u04AE\u04E8\u0401]+$/i;
  startDate: Date;
  endDate: Date;

  currentTask: Validation;
  language = language;
  isSpinning: boolean = false;
  selectedInd = 0;
  statusMsg = '';

  validations = [];

  constructor(
  	private loginService: LoginService, 
  	private router: Router,
  	private activatedRoute: ActivatedRoute,
    private validationService: ValidationService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  	this.checkAuth();
  	this.gid = this.activatedRoute.snapshot.paramMap.get('gid');
  	this.isSpinning = true;
  	this.prepareData();
  }

  prepareData() {
  	this.validationService.getTask(this.jwt_token, this.gid).subscribe(res => {
      this.isSpinning = false;
      this.statusCode = res.statusCode;
      if (this.statusCode) {
        this.startDate = new Date();
        this.currentTask = res;
        this.currentTask.task.modifiedWords.forEach( w => this.validations.push({ word: w.word, rating: -1 }) );
        let cnt = 0;
        this.currentTask.task.synset.forEach(s => { if (s.vocabularyId == 1) this.selectedInd = cnt; cnt ++; });
        this.currentTask.task.synset.forEach(s => { if (s.gloss == 'NO_GLOSS' || s.gloss == 'no_gloss') s.gloss =  '' });
      }
      else if (!res.statusCode) {
        this.statusMsg = res.statusMsg;
      }
    }, error => { if (error.status == 401) {this.router.navigateByUrl('/login'); return;} })
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

  isComplete() {
    for (let i = 0; i < this.validations.length; i ++) {
      if (this.validations[i].rating == -1) {
        return false;
      }
    }
    return true;
  }

  sendData() {
    this.endDate = new Date();

    //validation process
    if (!this.isComplete()) {
      this.snackBar.open("Шаардлагатай талбаруудыг бүрэн бөглөөрэй.", "ok", {duration:3000});
      return;
    }

    this.statusCode = 2;
    this.statusMsg = '';
    this.isSpinning = true;

    let payload = {
      taskId: this.currentTask.task._id,
      domainId: this.gid,
      validations: this.validations,
      start_date: this.startDate,
      end_date: this.endDate
    };

    this.validationService.sendValidation(this.jwt_token, payload).subscribe(res => {
      if (res.statusSuccess) {
        this.validations = [];
        this.prepareData();
      }
    }, error => {
      this.snackBar.open("Орчуулгыг хадгалахад алдаа гарлаа, та дахин оролдоно уу!", "ok", {duration:3000});
      if (error.status == 401) this.router.navigateByUrl('/login');
      return;
    })

  }

}
