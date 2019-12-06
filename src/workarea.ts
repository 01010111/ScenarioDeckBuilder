class WorkArea {
	element:HTMLDivElement;
	title:HTMLInputElement;
	contents:HTMLTextAreaElement;
	error_info:HTMLDivElement;
	pos_info:HTMLDivElement;
	delete:HTMLDivElement;
	current_card_tab:CardTab | null = null;
	constructor() {
		this.element = document.getElementById('workarea') as HTMLDivElement;
		this.title = document.getElementById('card_title') as HTMLInputElement;
		this.contents = document.getElementById('card_contents') as HTMLTextAreaElement;
		this.error_info = document.getElementById('error_info') as HTMLDivElement;
		this.pos_info = document.getElementById('pos_info') as HTMLDivElement;
		this.delete = document.getElementById('delete') as HTMLDivElement;

		this.title.oninput = () => {
			Util.resize_input(this.title);
			this.update_card_tab();
		}
		this.contents.oninput = () => this.update_card();
		
		// prevent tab out
		this.contents.onkeydown = (e) => {
			let keycode = e.keyCode || e.which;
			if (keycode == 9) {
				e.preventDefault();
				let start = this.contents.selectionStart;
				let end = this.contents.selectionEnd;
				this.contents.value = this.contents.value.substring(0, start) + '\t' + this.contents.value.substring(end);
				this.contents.selectionStart = this.contents.selectionEnd = start + 1;
			}
		}

		this.delete.onclick = () => new Modal({
			cancel: 'Keep card',
			confirm: 'Delete card',
			on_confirm: () => {
				this.delete_card();
				return true;
			},
			content: document.createElement('div'),
			title: 'Delete card?'
		});
		
		this.update_pos_info();
	}
	load_card(card:Card) {
		this.title.value = card.title;
		Util.resize_input(this.title);
		this.contents.value = JSON.stringify(card.content, null, '\t');
		App.sidebar.update_links(card.title);
	}
	update_card_tab() {
		if (!this.current_card_tab) return;
		this.current_card_tab.rename(this.title.value);
		this.update_card();
	}
	update_card() {
		try {
			let content = JSON.parse(this.contents.value);
			Validation.validate_contents(content);
			App.current_card.content = content;
			App.current_card.title = this.title.value;
			this.error_info.innerText = '';
			App.sidebar.update_links(this.title.value);
		} catch(e) {
			this.error_info.innerText = e;
		}
	}
	update_pos_info() {
		this.pos_info.innerText = this.contents.selectionStart + '';
		requestAnimationFrame(() => this.update_pos_info());
	}
	delete_card() {
		if (App.deck.deck.length <= 1) return alert('A deck must have at least one card!');
		if (!this.current_card_tab) return;
		App.sidebar.delete_card(this.current_card_tab.title);
		App.deck.deck.splice(App.deck.deck.indexOf(Util.get_card(this.current_card_tab.title) as Card), 1);
		App.sidebar.all_tabs[0].select();
	}
	unload () {
		this.title.value = '';
		this.contents.value = '';
	}
}