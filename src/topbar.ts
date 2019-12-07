class TopBar {
	element:HTMLDivElement;
	title_input:HTMLInputElement;
	config:HTMLDivElement;
	import:HTMLDivElement;
	export:HTMLDivElement;
	constructor() {
		this.element = document.getElementById('top_bar') as HTMLDivElement;
		this.title_input = document.getElementById('title_input') as HTMLInputElement;
		this.title_input.oninput = () => {
			App.deck.title = this.title_input.value;
			Util.resize_input(this.title_input);
		}
		this.config = document.getElementById('config') as HTMLDivElement;
		this.config.onclick = () => Settings.make_config_modal();
		this.import = document.getElementById('import') as HTMLDivElement;
		this.import.onclick = () => this.make_import_modal();
		this.export = document.getElementById('export') as HTMLDivElement;
		this.export.onclick = () => this.make_export_modal();
	}
	load() {
		this.title_input.value = App.deck.title;
		Util.resize_input(this.title_input);
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
		new Modal({ content: content, title: 'Export JSON' });
		Util.select_text(code);
	}
	make_import_modal() {
		let content = document.createElement('div');
		let code = document.createElement('textarea');
		content.appendChild(code);
		let error = document.createElement('div');
		error.classList.add('error_info');
		content.appendChild(error);
		let import_json = (json:string) => {
			try {
				let deck:Deck = JSON.parse(json);
				Validation.validate_deck(deck);
				App.load_deck(deck);
				return true;
			} catch(e) {
				error.innerText = e;
				return false;
			}
		}
		new Modal({
			content: content,
			title: 'Import JSON',
			confirm: 'Import',
			on_confirm: () => import_json(code.value)
		});
		Util.select_text(code);
	}

}