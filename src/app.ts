class App {
	static deck:Deck;
	static topbar:TopBar;
	static sidebar:SideBar;
	static workarea:WorkArea;
	static current_card:Card;
	constructor(deck?:Deck) {
		// init deck
		App.deck = deck ? deck : App.get_default_deck();
		// init app
		App.topbar = new TopBar();
		App.sidebar = new SideBar();
		App.workarea = new WorkArea();
		// add existing cards
		for (let card of App.deck.deck) App.sidebar.add_new_card(card);
		if (CardTab.all.length > 0) CardTab.all[0].select();
	}
	static get_default_deck():Deck {
		return {
			theme: 'legacy',
			title: 'New Deck',
			subtitle: 'Situation Deck',
			button_text: 'Begin',
			description: 'New Situation Deck',
			first_card: 'My Card',
			deck: [
				{
					title: 'My Card',
					content: [
						{
							type: 'paragraph',
							text: 'Hello world!'
						}
					]
				}
			]
		}
	}
	static get_json() {
		return JSON.stringify(App.deck, null, 2);
	}
}