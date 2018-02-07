import { Injectable } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Injectable()
export class RegisterService {

  constructor() { }

  isValid(data): boolean {
  	if (data.u.length >= 4 && data.n.length >= 2 && !data.e.hasError('required') && !data.e.hasError('email') && data.p.length >= 6) {
  		return true;
  	} else {
  		return false;
  	}
  }

}
