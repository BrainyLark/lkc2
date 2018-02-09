import { User } from './User';

export class SignRes {
	success: boolean;
	message: string;
}

export class LoginRes {
	success: boolean;
	msg: string;
	token: string;
	user: User;
}