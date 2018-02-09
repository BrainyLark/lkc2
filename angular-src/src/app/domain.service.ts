import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomainRes } from './model/response';

@Injectable()
export class DomainService {
  
  apiRoot: string = 'http://localhost:3000';
  res: DomainRes[];

  constructor(private http: HttpClient) { }

  getDomains(jwt_token) {
	const httpOptions = {
	  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	};
	const url = this.apiRoot + '/domain';
	return this.http.get<DomainRes[]>(url, httpOptions);
  }

}
