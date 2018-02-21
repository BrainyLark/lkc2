import { Component, OnInit } from '@angular/core';
import { DomainService } from '../domain.service';
import { Router } from '@angular/router';
import { Domain } from '../model/Domain';
import { MatDialog } from '@angular/material';

@Component({
	selector: 'app-domain',
	templateUrl: './domain.component.html',
	styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
	
	colNum = 5;
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

	constructor(private domainService: DomainService, private router: Router, public dialog: MatDialog) { }

	ngOnInit() {
		this.setDomains();
	}

	setDomains() {
		let jwt_token = localStorage.getItem('jwt_token');
		if (jwt_token) {
			this.domainService.getDomains(jwt_token).subscribe(res => {
<<<<<<< HEAD
				if (res) { 
					this.domains = res;
					this.updateLang(this.current_v);
				}
				else { 
					this.router.navigateByUrl('/login');
				}
			})
=======
				this.domains = res;
				this.updateLang(this.current_v);
			}, error => { 
				this.router.navigateByUrl('/login');
			});
>>>>>>> 75f6f91abeef8015653985c2932b4100352e1727
		} else {
			this.router.navigateByUrl('/login');
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
			this.placeholder.push({ globalId: domain.globalId, synset: synset[0] });
		});
	}

}
