import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { SignRes } from './model/response';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RegisterService {

  apiRoot: string = 'http://localhost:3000/user';

  constructor(private http: HttpClient) { }

  isValid(data): boolean {
  	return (data.u.length >= 4 && data.n.length >= 2 && !data.e.hasError('required') && !data.e.hasError('email') && data.p.length >= 6)
  }

  signUp(data) {
  	let url = this.apiRoot + '/register';
  	let payload_data = {
  		username: data.u,
  		name: data.n,
  		email: data.e.value,
  		password: data.p
  	};
  	return this.http.post<SignRes>(url, payload_data, httpOptions);
  }

}
