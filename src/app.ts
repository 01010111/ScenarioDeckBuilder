class App {
	static deck:Deck;
	static topbar:TopBar;
	static sidebar:SideBar;
	static workarea:WorkArea;
	static current_card:Card;
	constructor(deck?:Deck) {
		deck ? App.load_deck(deck) : App.load_deck(App.get_default_deck());
	}
	static unload_deck() {
		if (this.sidebar) this.sidebar.unload();
		if (this.workarea) this.workarea.unload();
	}
	static load_deck(deck:Deck) {
		this.unload_deck();
		// init deck
		App.deck = deck;
		// init app
		if (!App.topbar) App.topbar = new TopBar();
		if (!App.sidebar) App.sidebar = new SideBar();
		if (!App.workarea) App.workarea = new WorkArea();
		App.topbar.load();
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
		return JSON.stringify(App.deck, null, 4);
	}
}