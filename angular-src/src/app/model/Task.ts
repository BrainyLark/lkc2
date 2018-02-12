export class Translation {
	statusCode: number;
	statusMsg: string;
	synset: [{
		languageCode: string;
		vocabularyId: number;
		concept: string;
		gloss: string;
		lemma: string;
		_id: string;
	}];
}