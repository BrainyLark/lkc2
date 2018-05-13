import { Component, OnInit, Input } from '@angular/core';
import { ValidationService } from '../validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Validation } from '../model/Task';
import { LoginService } from '../login.service';
import { language } from '../meta';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-gloss-validation',
  templateUrl: './gloss-validation.component.html',
  styleUrls: ['./gloss-validation.component.css']
})
export class GlossValidationComponent implements OnInit {
  
  jwt_token: string;
  gid: string;
  statusCode: number = 2;
  startDate: Date;
  endDate: Date;

  currentTask: Validation;
  language = language;
  isSpinning: boolean = false;
  selectedInd = 0;
  statusMsg = "";

  sortedGlosses:any[];

  constructor(
  	private validationService: ValidationService,
	  private router: Router,
	  private loginService: LoginService,
	  private activatedRoute: ActivatedRoute,
  	private snackBar: MatSnackBar,
	  private translate: TranslateService) { 
  }

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
   	this.validationService.getTask(this.jwt_token, this.gid, 6).subscribe(res => {
   		this.isSpinning = false;
   		this.statusCode = res.statusCode;
      	if (this.statusCode) {
    			this.startDate = new Date();
    			this.currentTask = res;
    			let cnt = 1;
      		this.currentTask.task.synset.forEach(s => { if (s.vocabularyId == 1) this.selectedInd = cnt; cnt++; });
      		this.currentTask.task.synset.forEach(s => { if (s.gloss == 'NO_GLOSS' || s.gloss == 'no_gloss') s.gloss =  '' });
      		this.sortedGlosses = this.currentTask.task.modifiedGlosses;
    		}
    		else if (!res.statusCode) {
    			this.statusMsg = res.statusMsg;
      	}
  	}, error => { if (error.status == 401) {this.router.navigateByUrl('/login'); return;} })
  }

  swapPosition(id:number, upDownIndex:number) : void
  {
    var x = this.sortedGlosses.map(e => { return e._id }).indexOf(id);
    var y = x + upDownIndex;
    if (y < 0 || y > 2) {
      return;
    }
    var temp = this.sortedGlosses[x];
    this.sortedGlosses[x] = this.sortedGlosses[y];
    this.sortedGlosses[y] = temp;
  }

}
