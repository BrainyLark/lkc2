import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PerformanceRes } from './model/response';

@Injectable()
export class TaskService {
  
  apiRoot: string = 'http://localhost:3000/';
  constructor(private http: HttpClient) { }

  getPerformance(jwt_token) {
  	let url = this.apiRoot + 'performance';
  	let httpOptions = {
	  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	};
	return this.http.get<PerformanceRes>(url, httpOptions);
  }

}
