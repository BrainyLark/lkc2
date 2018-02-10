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
	
	current_v: number = 1;
	navLinks = [
		{ vid: 1, lang: "Англи", isActive: true },
		{ vid: 102, lang: "Итали", isActive: false },
		{ vid: 101, lang: "Испани", isActive: false },
		{ vid: 106, lang: "Хятад", isActive: false },
		{ vid: 401, lang: "Индонез", isActive: false }
	];
	domains: Domain[];
	placeholder = [];

	constructor(private domainService: DomainService, private router: Router) { }

	ngOnInit() {
		let jwt_token = localStorage.getItem('jwt_token');
		if (jwt_token) {
			this.domainService.getDomains(jwt_token).subscribe(res => {
				if (res) { 
					this.domains = res;
					this.updateLang(this.current_v);
				}
				else { 
					this.router.navigateByUrl('/');
				}
			})
		} else {
			this.router.navigateByUrl('/');
		}
	}

	updateLang(requestedCode) {
		this.placeholder = [];
		const defaultCode = 1;
		this.navLinks.filter(link => link.vid == this.current_v)[0].isActive = false;
		this.navLinks.filter(link => link.vid == requestedCode)[0].isActive = true;
		this.current_v = requestedCode;
		this.domains.forEach(domain => {
			let synset = domain.synset.filter((s) => s.vocabularyId == requestedCode);
			if (synset.length == 0) {
				synset = domain.synset.filter((s) => s.vocabularyId == defaultCode);
			}
			this.placeholder.push(synset[0]);
		});
	}

}
