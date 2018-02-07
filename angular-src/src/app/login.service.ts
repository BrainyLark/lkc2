import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginRes } from './model/response';
import { User } from './model/User';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LoginService {

  apiRoot: string = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  signIn(data) {
  	let url = this.apiRoot + '/authenticate';
  	let payload_data = { username: data.u, password: data.p };
  	return this.http.post<LoginRes>(url, payload_data, httpOptions);
  }

  getProfile(jwt_token) {
  	let url = this.apiRoot + '/profile';
  	let httpOptions = {
  		headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
  	};
  	return this.http.get<User>(url, httpOptions);
  }

}
