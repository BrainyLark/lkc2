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

export class DomainRes {
	_id: string;
	conceptId: string;
	posTag: string;
	globalId: number;
	synset: [{
		languageCode: string;
		vocabularyId: number;
		concept: string;
		gloss: string;
		lemma: string;
	}];
}
