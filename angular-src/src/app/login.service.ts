import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginRes, ResetPasswordRes } from './model/response';
import { User } from './model/User';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { config } from './config';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class LoginService {

  apiRoot: string = config.apiRoot + 'user/';

  constructor(private http: HttpClient) { }

  signIn(data) {
  	let url = this.apiRoot + 'authenticate';
  	let payload_data = { username: data.u, password: data.p };
  	return this.http.post<LoginRes>(url, payload_data, httpOptions);
  }

  getProfile(jwt_token) {
  	let url = this.apiRoot + 'profile';
  	let httpOptions = {
  		headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': jwt_token })
  	};
  	return this.http.get<User>(url, httpOptions);
  }

  resetPass(username) {
    let url = this.apiRoot + 'reset';
    let payload_data = { username: username };
    return this.http.post<ResetPasswordRes>(url, payload_data, httpOptions);
  }

  checkToken(username, resetCode) {
    let url = this.apiRoot + 'checkreset';
    let payload_data = { username: username, resetCode: resetCode };
    return this.http.post<ResetPasswordRes>(url, payload_data, httpOptions);
  }

  updatePass(username, resetCode, password) {
    let url = this.apiRoot + 'updatepass';
    let payload_data = { username: username, resetCode: resetCode, password: password };
    return this.http.post<ResetPasswordRes>(url, payload_data, httpOptions);
  }

}
