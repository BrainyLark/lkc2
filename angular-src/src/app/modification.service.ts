import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { config } from './config';
import { Modification } from './model/Task';
import { TaskrunRes } from './model/response';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ModificationService {

	apiRoot:string = config.apiRoot;

    constructor(private http: HttpClient) { }

    getTask(jwt_token:string, gid:string) {
    	let url = this.apiRoot + '/task/2/' + gid;
    	let httpOptions = {
  	  		headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
	  	};
	  	return this.http.get<Modification>(url, httpOptions);
    }

    sendModification(jwt_token:string, payload) {
    	let url = this.apiRoot + '/modification';
    	let httpOptions = {
    		headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
    	};
    	return this.http.post<TaskrunRes>(url, payload, httpOptions);
    }

}