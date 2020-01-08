class Settings {
	static make_config_modal() {
		let content = document.createElement('div');
		content.classList.add('settings');
		// first card
		content.appendChild(Util.make_label('First Card'));
		let first_card = document.createElement('select');
		for (let card of App.deck.deck) {
			let opt = document.createElement('option');
			opt.value = opt.text = card.title;
			if (card.title == App.deck.first_card) opt.selected = true;
			first_card.add(opt);
		}
		content.appendChild(first_card);
		// theme
		content.appendChild(Util.make_label('Theme'));
		let themes = document.createElement('select');
		for (let theme of ['legacy', 'simple']) {
			let opt = document.createElement('option');
			opt.value = opt.text = theme;
			if (theme == App.deck.theme) opt.selected = true;
			themes.add(opt);
		}
		content.appendChild(themes);
		// subtitle
		content.appendChild(Util.make_label('Subtitle'));
		let subtitle = document.createElement('input');
		subtitle.value = App.deck.subtitle;
		content.appendChild(subtitle);
		// description
		content.appendChild(Util.make_label('Description'));
		let description = document.createElement('input');
		description.value = App.deck.description;
		content.appendChild(description);
		// button text
		content.appendChild(Util.make_label('Start Button Text'));
		let button_text = document.createElement('input');
		button_text.value = App.deck.button_text;
		content.appendChild(button_text);
		// bg src
		content.appendChild(Util.make_label('Background Image'));
		let bg_src = document.createElement('input');
		bg_src.placeholder = 'None';
		bg_src.value = App.deck.bg_src ? App.deck.bg_src : '';
		content.appendChild(bg_src);
		// content links
		content.appendChild(Util.make_label('Content Links'));
		let content_links = document.createElement('textarea');
		content_links.classList.add('content_link_area');
		content_links.value = App.deck.content_links ? JSON.stringify(App.deck.content_links, null, '\t') : '[]';
		content_links.onkeydown = (e) => Util.parse_code_input(content_links, e);
		content.appendChild(content_links);
		// on confirm
		let validate = () => {
			if (subtitle.value.length == 0) {
				alert('Please enter a subtitle!');
				return false;
			}
			if (description.value.length == 0) {
				alert('Please enter a description!');
				return false;
			}
			if (button_text.value.length == 0) {
				alert('Please enter start button text!');
				return false;
			}
			try {
				JSON.parse(content_links.value);
			} catch(e) {
				alert(e);
				return false;
			}
			let content_link_data = JSON.parse(content_links.value);
			for (let link of content_link_data) {
				if (!link.image) {
					alert('Content link must include image!');
					return false;
				}
				if (!link.title) {
					alert('Content link must include title!');
					return false;
				}
				if (!link.url) {
					alert('Content link must include url!');
					return false;
				}
			}
			return true;
		}
		let save = () => {
			let ok = validate();
			if (!ok) return false;
			App.deck.first_card = first_card.value;
			App.deck.theme = themes.value;
			App.deck.subtitle = subtitle.value;
			App.deck.description = description.value;
			App.deck.button_text = button_text.value;
			App.deck.bg_src = (bg_src.value.length == 0 ? undefined : bg_src.value);
			var content_link_data = JSON.parse(content_links.value);
			App.deck.content_links = (content_link_data && content_link_data.length > 0) ? content_link_data : null;
			return true;
		}
		new Modal({
			content: content,
			title: `${App.deck.title} Config`,
			cancel: 'Cancel',
			confirm: 'Save',
			on_confirm: () => save()
		});
	}
}