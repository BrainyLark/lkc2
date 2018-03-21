import { Component, OnInit } from '@angular/core';
import { DomainService } from '../domain.service';
import { Router, ActivatedRoute } from '@angular/router';
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
		{ vid: 1, lang: "from.en", isActive: true },
		{ vid: 102, lang: "from.it", isActive: false },
		{ vid: 101, lang: "from.es", isActive: false },
		{ vid: 106, lang: "from.zh", isActive: false },
		{ vid: 401, lang: "from.in", isActive: false }
	];
	domains: Domain[];
	placeholder = [];
	taskType: number;
	loadState: boolean;

	constructor(private domainService: DomainService, 
		private activatedRoute: ActivatedRoute, 
		private router: Router, 
		public dialog: MatDialog) { }

	ngOnInit() {
		this.loadState = true;
		this.taskType = +this.activatedRoute.snapshot.paramMap.get('id');
		this.setDomains();
	}

	setDomains() {
		let jwt_token = localStorage.getItem('jwt_token');
		if (jwt_token) {
			this.domainService.getDomains(jwt_token).subscribe(res => {
				this.domains = res;
				this.loadState = false;
				this.updateLang(this.current_v);
			}, error => { 
				this.router.navigateByUrl('/login');
			}); 
		}
		else {
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
			this.placeholder.push({ 
				availableTrn: domain.availableTrn, 
				availableMod: domain.availableMod,
				availableVal: domain.availableVal,
				globalId: domain.globalId, 
				synset: synset[0] 
			});
		});
	}

}
