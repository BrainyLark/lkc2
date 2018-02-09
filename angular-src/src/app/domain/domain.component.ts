import { Component, OnInit } from '@angular/core';
import { DomainService } from '../domain.service';
import { Router } from '@angular/router';
import { Domain } from '../model/Domain';

@Component({
	selector: 'app-domain',
	templateUrl: './domain.component.html',
	styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
	
	domains: Domain[];
	placeholder = [];

	constructor(private domainService: DomainService, private router: Router) { }

	ngOnInit() {
		let jwt_token = localStorage.getItem('jwt_token');
		if (jwt_token) {
			this.domainService.getDomains(jwt_token).subscribe(res => {
				if (res) this.domains = res;
				else this.router.navigateByUrl('/');
			})
		} else {
			this.router.navigateByUrl('/');
		}
	}

	updateSynsetLanguage(requestedCode) {
		this.placeholder = [];
		const defaultCode = 1;
		let counter = 0;
		this.domains.forEach(domain => {
			let synset = domain.synset.filter((s) => s.vocabularyId == requestedCode);
			if (!synset.length) {
				synset = domain.synset.filter((s) => s.vocabularyId == defaultCode);
			}
			this.placeholder.push(synset[0]);
		});
	}

}
