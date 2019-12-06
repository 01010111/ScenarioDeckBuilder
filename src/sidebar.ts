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
	delete_card(title:string) {
		for (let tab of this.all_tabs) {
			if (tab.title == title) {
				tab.element.remove();
				this.all_tabs.splice(this.all_tabs.indexOf(tab), 1);
			}
		}
	}
	update_links(title:string) {
		let incoming_links = [];
		let outgoing_links = [];
		for (let card of App.deck.deck) {
			if (card.title == title) {
				for (let content of card.content) {
					if (content.url) outgoing_links.push(content.url);
				}
				continue;
			}
			for (let content of card.content) {
				if (!content.url) continue;
				if (content.url == title) incoming_links.push(card.title);
			}
		}
		for (let tab of this.all_tabs) {
			tab.element.classList.remove('outgoing', 'incoming');
			if (incoming_links.indexOf(tab.title) >= 0) tab.element.classList.add('incoming');
			if (outgoing_links.indexOf(tab.title) >= 0) tab.element.classList.add('outgoing');
		}
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