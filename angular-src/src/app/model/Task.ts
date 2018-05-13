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
		}],
		targetWords: string
	}
}

export class Modification {
	statusCode: number;
	statusMsg: string;
	task: {
		_id: string,
		conceptId: number,
		domainId: number,
		_translationTaskId: string,
		synset: [{
			languageCode: string,
			vocabularyId: number,
			concept: string,
			gloss: string,
			lemma: string,
			_id: string
		}],
		translatedWords: [{
			word: string,
			_id: string
		}],
		targetWords: string,
		translatedGlosses: [{ gloss: string }]
	}
}

export class Validation {
	statusCode: number;
	statusMsg: string;
	task: {
		_id: string,
		conceptId: number,
		domainId: number,
		_modificationTaskId: string,
		synset: [{
			languageCode: string,
			vocabularyId: number,
			concept: string,
			gloss: string,
			lemma: string,
			_id: string
		}],
		modifiedWords: [{
			word: string,
			_id: string
		}],
		targetWords: string,
		modifiedGlosses: [{ gloss: string, _id: number }]
	}
}