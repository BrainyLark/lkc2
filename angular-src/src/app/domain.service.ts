import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Domain } from './model/Domain';
import { config } from './config';

@Injectable()
export class DomainService {
  
  apiRoot: string = config.apiRoot;
  res: Domain[];

  constructor(private http: HttpClient) { }

  getDomains(jwt_token, taskType) {
	const httpOptions = {
	  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	};
	const url = this.apiRoot + 'domain?taskType=' + taskType;
	return this.http.get<Domain[]>(url, httpOptions);
  }

}
