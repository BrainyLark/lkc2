import { Component, OnInit } from '@angular/core';
import { TranslationService } from '../translation.service';
import { Router, ActivatedRoute } from '@angular/router';

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
  synsets = [];
  rates = [1, 2, 3, 4, 5];
  taskRun = [{ word: "", score: -1 }];
  alert:string = '';
  isSpinning: boolean = false;

  constructor(
  	private translationService: TranslationService, 
  	public router: Router, 
  	private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  	this.prepareData();
  }

  prepareData() {
    this.isSpinning = true;
  	this.jwt_token = localStorage.getItem('jwt_token');
  	if (!this.jwt_token) {
  		this.router.navigateByUrl('/');
  		return;
  	}
  	this.gid = this.activatedRoute.snapshot.paramMap.get('gid');
  	this.translationService.getTask(this.jwt_token, this.gid).subscribe(res => {
      this.isSpinning = false;
  		if (res.statusCode == 1) {	
        this.statusCode = res.statusCode;
  			this.synsets = res.synset;
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
    if (formData.word.length == 0 || formData.score == -1) {
      this.alert = 'Эхлээд үгээ нэмэх эсвэл оруулсан үгээ үнэлнэ үү!';
      return;
    }
    this.alert = '';
    this.taskRun.push({ word: "", score: -1 });
  }

  clearForm(index): void {
    this.taskRun.splice(index, 1);
  }

}
