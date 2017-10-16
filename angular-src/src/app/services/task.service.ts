import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {
	authToken: any;

	constructor(private http:Http) {  }

	getDomains() {
		let headers = new Headers();
		this.loadToken();
		headers.append('Authorization', this.authToken);
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/domain', {headers: headers}).map(res => res.json());
	}


	loadToken(){
		const token = localStorage.getItem('id_token');
		this.authToken = token;
	}

	getTask(id) {
		let headers = new Headers();
		this.loadToken();
		headers.append('Authorization', this.authToken);
		headers.append('Content-Type', 'application/json');
		return this.http.get('http://localhost:3000/translation/' + id, {headers: headers}).map(res => res.json());
	}
	postTranslation(data) {
		let headers = new Headers();
		this.loadToken();
		headers.append('Authorization', this.authToken);
		headers.append('Content-Type', 'application/json');
		return this.http.post('http://localhost:3000/translation', data, {headers: headers});
	}
}
