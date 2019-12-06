class DeckUtil {
	static get_card(title:string) {
		for (let card of App.deck.deck) if (card.title == title) return card;
		return null;
	}
}