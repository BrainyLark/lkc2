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
  statusMsg: string = '';
  synsets = [];
  rates = [1, 2, 3, 4, 5];
  taskRun = [{ index: 0, str: "", score: -1 }];

  constructor(
  	private translationService: TranslationService, 
  	public router: Router, 
  	private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
  	this.prepareData();
  }

  prepareData() {
  	this.jwt_token = localStorage.getItem('jwt_token');
  	if (!this.jwt_token.length) {
  		this.router.navigateByUrl('/');
  		return;
  	}
  	this.gid = this.activatedRoute.snapshot.paramMap.get('gid');
  	this.translationService.getTask(this.jwt_token, this.gid).subscribe(res => {
  		if (res.statusCode) {	
  			this.synsets = res.synset;
  		} else {
  			this.statusMsg = res.statusMsg;
  		}
  	})
  }

  addForm(): void {
    this.taskRun.push({ index: this.taskRun.length, str: "", score: -1 });
  }

}
