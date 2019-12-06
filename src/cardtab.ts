class CardTab {
	static all:CardTab[] = [];
	element:HTMLDivElement;
	title:string;
	constructor(title:string) {
		this.title = title;
		this.element = document.createElement('div');
		this.element.classList.add('card_tab');
		this.element.onclick = () => this.select();
		this.rename(title);
		CardTab.all.push(this);
	}
	add() {
		App.sidebar.element.insertBefore(this.element, App.sidebar.add_card);
		return this;
	}
	select() {
		let card = DeckUtil.get_card(this.title);
		if (!card) return;
		App.current_card = card;
		for (let tab of CardTab.all) tab.element.classList.remove('selected');
		this.element.classList.add('selected');
		App.workarea.load_card(card);
		App.workarea.current_card_tab = this;
	}
	rename(title:string) {
		this.title = title;
		this.element.innerText = title;
	}
}