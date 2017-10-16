import { Component, OnInit } from '@angular/core';
import {TaskService} from '../../services/task.service';
import { Router } from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
	selector: 'app-domains',
	templateUrl: './domains.component.html',
	styleUrls: ['./domains.component.css']
})
export class DomainsComponent implements OnInit {

	uniqueBeginners: Object;

	constructor(
		private taskService: TaskService,
		private router: Router,
		private flashMessagesService: FlashMessagesService
		) { }

	ngOnInit() {
		this.taskService.getDomains().subscribe(domains => {
			this.uniqueBeginners = domains;
		});
	}

	goToTranslate(conceptId) {
		this.router.navigate(['translate',conceptId]);
	}

	generateTask(id){
		console.log("I will create this task ", id);
	}

}
