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
		
		// parse input
		this.contents.onkeydown = (e) => {
			let keycode = e.keyCode || e.which;
			// prevent tab out
			if (keycode == 9) {
				e.preventDefault();
				let start = this.contents.selectionStart;
				let end = this.contents.selectionEnd;
				this.contents.value = this.contents.value.substring(0, start) + '\t' + this.contents.value.substring(end);
				this.contents.selectionStart = this.contents.selectionEnd = start + 1;
			}
			// insert tabs on enter
			if (keycode == 13) {
				e.preventDefault();
				let start = this.contents.selectionStart;
				let end = this.contents.selectionEnd;
				let before = this.contents.value.substring(0, start);
				let after = this.contents.value.substring(end);
				let spacing = 0;
				for (let char of before.split('')) {
					if (['[', '{'].indexOf(char) >= 0) spacing++;
					if ([']', '}'].indexOf(char) >= 0) spacing--;
				}
				let input = '\n';
				for (let i = 0; i < spacing; i++) input += '\t';
				if ([']', '}'].indexOf(after.charAt(0)) >= 0) {
					input += '\n';
					for (let i = 1; i < spacing; i++) input += '\t';
				}
				this.contents.value = before + input + after;
				this.contents.selectionStart = this.contents.selectionEnd = start + 1 + spacing;
			}
			// Add closing brackets
			if (keycode == 219) {
				e.preventDefault();
				let start = this.contents.selectionStart;
				let end = this.contents.selectionEnd;
				let before = this.contents.value.substring(0, start);
				let after = this.contents.value.substring(end);
				var openings = 1;
				var closings = 0;
				for (let char of before.split('')) {
					if (['[', '{'].indexOf(char) >= 0) openings++;
					if ([']', '}'].indexOf(char) >= 0) openings--;
				}
				for (let char of after.split('')) {
					if (['[', '{'].indexOf(char) >= 0) closings--;
					if ([']', '}'].indexOf(char) >= 0) closings++;
				}
				let input = e.shiftKey ? '{' : '[';
				if (openings > closings) input += e.shiftKey ? '}' : ']';
				this.contents.value = before + input + after;
				this.contents.selectionStart = this.contents.selectionEnd = start + 1;
			}
			// Ignore brackets if bracket-adjacent
			if (keycode == 221) {
				let start = this.contents.selectionStart;
				let end = this.contents.selectionEnd;
				let after = this.contents.value.substring(end);
				if (after.charAt(0) == (e.shiftKey ? '}' : ']')) {
					e.preventDefault();
					this.contents.selectionStart = this.contents.selectionEnd = start + 1;
				}
			}
			// quotes
			let cont = false;
			// Ignore quotes if quote-adjacent
			if (keycode == 222) {
				let start = this.contents.selectionStart;
				let end = this.contents.selectionEnd;
				let after = this.contents.value.substring(end);
				if (after.charAt(0) == (e.shiftKey ? '"' : "'")) {
					e.preventDefault();
					this.contents.selectionStart = this.contents.selectionEnd = start + 1;
					cont = true;
				}
				this.check_missing_cards();
				this.update_card();
			}
			// Add closing quotes
			if (keycode == 222 && !cont) {
				e.preventDefault();
				let start = this.contents.selectionStart;
				let end = this.contents.selectionEnd;
				let before = this.contents.value.substring(0, start);
				let after = this.contents.value.substring(end);
				var quotes = 1;
				for (let char of before.split('')) {
					if (['"', "'"].indexOf(char) >= 0) quotes++;
				}
				let input = e.shiftKey ? '"' : "'";
				if (quotes % 2 == 1) input += e.shiftKey ? '"' : "'";
				this.contents.value = before + input + after;
				this.contents.selectionStart = this.contents.selectionEnd = start + 1;
				this.update_card();
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
			if (App.deck.first_card == App.current_card.title) App.deck.first_card = this.title.value;
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
	check_missing_cards() {
		for (let content of App.current_card.content) {
			if (!content.url) continue;
			if (content.url.length == 0) continue;
			if (content.url.indexOf('.') >= 0) continue;
			let card_exists = false;
			for (let card of App.deck.deck) {
				if (card_exists) continue;
				if (card.title == content.url) card_exists = true;
			}
			if (card_exists) continue;
			let card:Card = {
				title: content.url,
				content: []
			}
			App.deck.deck.push(card);
			App.sidebar.add_new_card(card);
		}
		App.sidebar.update_links(App.current_card.title);
	}
	unload () {
		this.title.value = '';
		this.contents.value = '';
	}
}