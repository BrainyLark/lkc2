import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TaskService {

  constructor(private http:Http) {  }

  getDomains() {
      return this.http.get('http://localhost:3000/tasks').map(res => res.json());
  }

}
