class CardTab {
	element:HTMLDivElement;
	title:string;
	constructor(title:string) {
		this.title = title;
		this.element = document.createElement('div');
		this.element.classList.add('card_tab');
		this.element.onclick = () => this.select();
		this.rename(title);
	}
	add() {
		App.sidebar.element.insertBefore(this.element, App.sidebar.add_card);
		return this;
	}
	select() {
		let card = Util.get_card(this.title);
		if (!card) return;
		App.current_card = card;
		for (let tab of App.sidebar.all_tabs) tab.element.classList.remove('selected', 'end');
		this.element.classList.add('selected');
		for (let c of card.content) if (c.end) this.element.classList.add('end');
		App.workarea.load_card(card);
		App.workarea.current_card_tab = this;
	}
	rename(title:string) {
		this.title = title;
		this.element.innerText = title;
	}
}