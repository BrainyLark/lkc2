import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Domain } from './model/Domain';

@Injectable()
export class DomainService {
  
  apiRoot: string = 'http://localhost:3000';
  res: Domain[];

  constructor(private http: HttpClient) { }

  getDomains(jwt_token) {
	const httpOptions = {
	  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	};
	const url = this.apiRoot + '/domain';
	return this.http.get<Domain[]>(url, httpOptions);
  }

}
