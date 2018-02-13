import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Translation } from './model/Task';
import { TaskrunRes } from './model/response';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class TranslationService {

  apiRoot: string = 'http://localhost:3000/';

  constructor(private http: HttpClient) { }

  getTask(jwt_token, gid) {
  	let url = this.apiRoot + 'task/1/' + gid;
  	let httpOptions = {
  	  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	};
	  return this.http.get<Translation>(url, httpOptions);
  }

  errorHandler(e) {
    console.log(e);
  }

  sendTranslation(jwt_token, payload) {
  	let url = this.apiRoot + 'translation';
  	let httpOptions = {
  	  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	};
	return this.http.post<TaskrunRes>(url, payload, httpOptions);
  }

}
