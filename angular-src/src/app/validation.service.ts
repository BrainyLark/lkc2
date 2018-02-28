import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from './config';
import { Validation } from './model/Task';
import { TaskrunRes } from './model/response';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ValidationService {

	apiRoot:string = config.apiRoot;

	constructor(private http: HttpClient) { }

	getTask(jwt_token:string, gid:string) {
    	let url = this.apiRoot + '/task/3/' + gid;
    	let httpOptions = {
  	  		headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	  	};
	  	return this.http.get<Validation>(url, httpOptions);
    }

}
