import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Translation } from './model/Task';

@Injectable()
export class TranslationService {

  apiRoot: string = 'http://localhost:3000/task/1/';

  constructor(private http: HttpClient) { }

  getTask(jwt_token, gid) {
  	let url = this.apiRoot + gid;
  	let httpOptions = {
  	  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	};
	return this.http.get<Translation>(url, httpOptions);
  }

}
