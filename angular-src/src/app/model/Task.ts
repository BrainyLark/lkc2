export class Translation {
	statusCode: number;
	statusMsg: string;
	task: {
		_id: string,
		conceptId: number,
		conceptGlobalId: number,
		posTag: string,
		domainId: number,
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