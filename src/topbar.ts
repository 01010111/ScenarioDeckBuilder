class TopBar {
	element:HTMLDivElement;
	title_input:HTMLInputElement;
	//import:HTMLDivElement;
	export:HTMLDivElement;
	constructor() {
		this.element = document.getElementById('top_bar') as HTMLDivElement;
		this.title_input = document.getElementById('title_input') as HTMLInputElement;
		this.title_input.value = App.deck.title;
		Util.resize_input(this.title_input);
		this.title_input.oninput = () => {
			App.deck.title = this.title_input.value;
			Util.resize_input(this.title_input);
		}
		this.export = document.getElementById('export') as HTMLDivElement;
		this.export.onclick = () => this.make_export_modal();
	}
	make_export_modal() {
		let content = document.createElement('div');
		let code = document.createElement('pre');
		code.innerText = App.get_json();
		code.onclick = () => Util.select_text(code);
		content.appendChild(code);
		let instructions = document.createElement('p');
		instructions.innerText = 'Press CTRL+C to copy!';
		content.appendChild(instructions);
		new Modal({ content: content, title: 'Export' });
		Util.select_text(code);
	}
}