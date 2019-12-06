class TopBar {
	element:HTMLDivElement;
	title_input:HTMLInputElement;
	constructor() {
		this.element = document.getElementById('top_bar') as HTMLDivElement;
		this.title_input = document.getElementById('title_input') as HTMLInputElement;
		this.title_input.value = App.deck.title;
		this.title_input.oninput = () => App.deck.title = this.title_input.value;
	}
}