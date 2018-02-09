import { Component, OnInit } from '@angular/core';
import { DomainService } from '../domain.service';
import { Router } from '@angular/router';
import { DomainRes } from '../model/response';

@Component({
  selector: 'app-domain',
  templateUrl: './domain.component.html',
  styleUrls: ['./domain.component.css']
})
export class DomainComponent implements OnInit {
  
  domains: DomainRes[];

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

}
