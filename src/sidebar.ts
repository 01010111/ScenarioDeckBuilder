class SideBar {
	element:HTMLDivElement;
	add_card:HTMLDivElement;
	all_tabs:CardTab[] = [];
	constructor() {
		this.element = document.getElementById('sidebar') as HTMLDivElement;
		this.add_card = document.getElementById('add_card') as HTMLDivElement;
		this.element.appendChild(this.add_card);
		this.add_card.onclick = () => {
			var card:Card = {
				title: SideBar.get_unused_title(),
				content: []
			};
			App.deck.deck.push(card);
			this.add_new_card(card);
		}
	}
	add_new_card(card:Card) {
		this.all_tabs.push(new CardTab(card.title).add());
	}
	unload() {
		this.all_tabs = [];
		while(this.element.firstChild != this.add_card) if (this.element.firstChild) this.element.firstChild.remove();
	}
	static get_unused_title():string {
		let title = 'My Card  ';
		let n = 0;
		while (Util.get_card(title.trim())) {
			n++;
			title = title.substring(0, 8) + n;
		}
		return title;
	}
}