class SideBar {
	element:HTMLDivElement;
	add_card:HTMLDivElement;
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
		new CardTab(card.title).add();
	}
	unload() {
		for (let i = this.element.children.length - 1; i > 0; i--) {
			this.element.children[i].remove();
		}  
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