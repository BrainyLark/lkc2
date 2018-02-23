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

export class PerformanceRes {
	translation: number;
	modification: number;
	validation: number;
}

export class TaskrunRes {
	statusSuccess: boolean;
	statusMsg: string;
}

export class TranslationRes {
	success: boolean;
	data: {
		taskId: string,
		translation: [{
			lemma: string,
			rating: number,
			_id: string
		}],
		synset: [{
			languageCode: string,
			vocabularyId: number,
			concept: string,
			gloss: string,
			lemma: string,
			_id: string
		}]
	}
}