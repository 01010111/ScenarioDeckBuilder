class Util {
	static get_card(title:string) {
		for (let card of App.deck.deck) if (card.title == title) return card;
		return null;
	}
	static select_text(node:Node) {
		let range = document.createRange();
		range.selectNode(node);
		(window.getSelection as () => Selection)().removeAllRanges();
		(window.getSelection as () => Selection)().addRange(range);
	}
	static resize_input(input:HTMLInputElement) {
		input.setAttribute('size', input.value.length + 1 + '');
	}
}