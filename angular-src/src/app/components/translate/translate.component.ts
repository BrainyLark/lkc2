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
	constructor(
		private http:Http,
		private taskService: TaskService,
		private route: ActivatedRoute
		) {}

	ngOnInit() {
		this.conceptId = this.route.snapshot.params['conceptId'];
//		console.log(this.conceptId);
		this.initializer();
		this.task = {
			lemma: '',
			gloss: '',
			label: '',
		}
	}

	initializer() {
		this.lemmas = [];
		this.taskService.getTask(this.conceptId).subscribe( taskData => {
			this.task = taskData;	
		});
	}

	addLemma() {
		this.lemmas.push({
			'lemma': this.lemma,
			'rating': this.rating
		});
		this.lemma = '';
		this.rating = undefined;
	}

	deleteLemma(index) {
		this.lemmas.splice(index, 1);
	}

	sendData() {
		this.taskService.postTranslation(this.lemmas).subscribe();
		this.initializer();
	}
}
