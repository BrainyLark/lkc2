import { Component, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { TaskService } from '../../services/task.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-translate',
	templateUrl: './translate.component.html',
	styleUrls: ['./translate.component.css']
})
export class TranslateComponent implements OnInit {
	conceptId: number;

	task: any;
	lemma: string;
	rating: number;
	lemmas: Array<Object>;
	numbers: Array<number>;

	errLemma: string;
	errRating: string;

	start_date: any;

	regexp: any;

	constructor(
		private http:Http,
		private taskService: TaskService,
		private route: ActivatedRoute
		) {}

	ngOnInit() {
		this.numbers = [0,1,2,3,4];
		this.conceptId = this.route.snapshot.params['conceptId'];
		this.regexp = new RegExp('[^\u0410\u0430\u0411\u0431\u0412\u0432\u0413\u0433\u0414\u0434\u0415\u0435\u0401\u0451\u0416\u0436\u0417\u0437\u0418\u0438\u0419\u0439\u041a\u043a\u041b\u043b\u041c\u043c\u041d\u043d\u041e\u043e\u04e8\u04e9\u041f\u043f\u0420\u0440\u0421\u0441\u0422\u0442\u0423\u0443\u04ae\u04af\u0424\u0444\u0425\u0445\u0426\u0446\u0427\u0447\u0428\u0448\u0429\u0449\u042a\u044a\u042b\u044b\u042c\u044c\u042d\u044d\u042e\u044e\u042f\u044f ]');
		this.task = {
			lemma: '',
			gloss: '',
			label: '',
		}
//		console.log(this.conceptId);
		this.initializer();
		
	}

	initializer() {

		this.start_date = new Date();
		this.lemmas = [];
		this.lemma = '';
		this.rating = 0;
		this.taskService.getTask(this.conceptId).subscribe( taskData => {
			this.task = taskData.data;	
		});
	}

	setRating(num) {
		this.rating = num+1;
	}

	addLemma() {	
		if(this.lemma === '' || this.lemma === ' '|| this.regexp.test(this.lemma)) {
			this.errLemma = 'Үг алдаатай бичигдсэн байна!';
			return;
		}	
		this.errLemma = undefined;
		if(this.rating === 0) {
			this.errRating = 'Үгэнд өөрийн үнэлгээгээ өгнө үү!';
			return;
		}
		this.errRating = undefined;
		this.lemmas.push({
			'lemma': this.lemma,
			'rating': this.rating
		});
		this.lemma = '';
		this.rating = 0;
	}

	deleteLemma(index) {
		this.lemmas.splice(index, 1);
	}

	sendData() {
		var postData = {
 			taskid: this.task.id,
 			domainid: this.task.domainid,
 			translation: this.lemmas,
 			start_date: this.start_date,
 			end_date: new Date()
 		};
 		this.taskService.postTranslation(postData).subscribe();
  		this.initializer();
	}

	skipTask() {

	}
}
