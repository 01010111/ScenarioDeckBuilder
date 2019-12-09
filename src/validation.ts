class Validation {
	static validate_deck(deck:Deck) {
		let card_titles:string[] = [];
		for (let card of deck.deck) {
			if (card_titles.indexOf(card.title) == -1) card_titles.push(card.title);
			else throw `Multiple cards with title "${card.title}!"`;
			this.validate_card(card);
		}
	}
	static validate_card(card:Card) {
		if (!card.title) throw 'Card must include a title!';
		this.validate_contents(card.content);
	}
	static validate_contents(contents:Content[]) {
		for (let content of contents) {
			if (!content.type) throw 'Content block must include type!';
			switch (content.type) {
				case 'paragraph': 
					if (!content.text) throw 'Paragraph content must include text!';
					break;
				case 'image':
					if (!content.src) throw 'Image content must include src!';
					break;
				case 'textbox':
					if (!content.text) throw 'Textbox content must include text!';
					break;
				case 'button':
					if (!content.text) throw 'Button content must include text!';
					if (!content.url && !content.end) throw 'Button content must include url or end!';
					break;
				case 'article':
					if (!content.text) throw 'Article content must include text!';
					if (!content.src) throw 'Article content must include src!';
					if (!content.url) throw 'Article content must include url!';
					break;
				case 'flag':
					if (!content.text) throw 'Flag content must include text!';
					if (content.value && typeof content.value == 'boolean') throw 'Flag value must be true or false!';
					break;
				case 'points':
					if (!content.amt) throw 'Points content must include amt!';
					break;
				default: throw `"${content.type}" is not a valid type!`;
			}
		}
	}
}