import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from './config';
import { Validation } from './model/Task';
import { TaskrunRes } from './model/response';

import { Observable, of } from 'rxjs';

@Injectable()
export class ValidationService {

	apiRoot:string = config.apiRoot;

	constructor(private http: HttpClient) { }

	getTask(jwt_token:string, gid:string) {
    	let url = this.apiRoot + 'task/3/' + gid;
    	let httpOptions = {
  	  		headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	  	};
	  	return this.http.get<Validation>(url, httpOptions);
    }

    sendValidation(jwt_token:string, payload) {
    	let url = this.apiRoot + 'validation';
    	let httpOptions = {
    		headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
    	};
    	return this.http.post<TaskrunRes>(url, payload, httpOptions);
    }

}
