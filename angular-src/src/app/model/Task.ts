export class Translation {
	statusCode: number;
	statusMsg: string;
	_id: string;
	domainId: number;
	synset: [{
		languageCode: string;
		vocabularyId: number;
		concept: string;
		gloss: string;
		lemma: string;
		_id: string;
	}];
}