export class Domain {
	_id: string;
	conceptId: string;
	posTag: string;
	globalId: number;
	availableTrn: number;
	availableMod: number;
	availableVal: number;
	synset: [{
		languageCode: string;
		vocabularyId: number;
		concept: string;
		gloss: string;
		lemma: string;
	}];
}
