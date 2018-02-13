import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Translation } from '../model/Task';

@Component({
  selector: 'app-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.css']
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

  taskRun = [{ lemma: "", rating: -1 }];
  start_date;
  end_date;

  constructor(
  	private translationService: TranslationService, 
  	public router: Router, 
  	private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.jwt_token = localStorage.getItem('jwt_token');
    if (!this.jwt_token) {
      this.router.navigateByUrl('/');
      return;
    }
    this.gid = this.activatedRoute.snapshot.paramMap.get('gid');
    this.isSpinning = true;
  	this.prepareData();
  }

  prepareData() {
  	this.translationService.getTask(this.jwt_token, this.gid).subscribe(res => {
      this.isSpinning = false;
  		if (res.statusCode == 1) {	
        this.start_date = new Date();
        this.statusCode = res.statusCode;
  			this.currentTask = res;
      }
      else if (res.statusCode == 0) {
        this.statusCode = res.statusCode;
  			this.statusMsg = res.statusMsg;
  		}
      else {
        this.statusCode = 0;
        this.statusMsg = "Серверээс алдаа ирлээ! Та дахин нэвтрэх шаардлагатай байж магадгүй!";
      }
  	})
  }

  addForm(): void {
    let formData = this.taskRun[this.taskRun.length - 1];
    if (formData.lemma.length == 0 || formData.rating == -1) {
      this.alert = 'Эхлээд үгээ нэмэх эсвэл оруулсан үгээ үнэлнэ үү!';
      return;
    }
    this.alert = '';
    this.taskRun.push({ lemma: "", rating: -1 });
  }

  clearForm(index): void {
    this.taskRun.splice(index, 1);
  }

  sendData() {
    this.statusCode = 2;
    this.statusMsg = '';
    this.isSpinning = true;
    this.end_date = new Date();
    this.taskRun.pop();
    let payload = {
      taskId: this.currentTask._id,
      domainId: this.currentTask.domainId,
      translation: this.taskRun,
      start_date: this.start_date,
      end_date: this.end_date
    };
    this.translationService.sendTranslation(this.jwt_token, payload).subscribe(res => {
      if (res.statusSuccess) {
        this.taskRun = [{ lemma: "", rating: -1 }];
        this.prepareData();
      }
    })
  }

}
