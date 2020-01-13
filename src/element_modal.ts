class ElementModal {
	paragraph_options:HTMLDivElement;
	button_options:HTMLDivElement;
	image_options:HTMLDivElement;
	textbox_options:HTMLDivElement;
	article_options:HTMLDivElement;
	flag_options:HTMLDivElement;
	points_options:HTMLDivElement;

	constructor(old_content?:Content) {
		let content = document.createElement('div');
		content.classList.add('settings');
		new Modal({
			title: old_content ? 'Edit Element' : 'New Element',
			confirm: old_content ? 'Save Changes' : 'Add New Element',
			cancel: 'Cancel',
			content: content,
			on_confirm: () => this.add_element()
		});
		content.appendChild(this.make_selector());
		content.appendChild(this.paragraph_options = document.createElement('div'));
		content.appendChild(this.button_options = document.createElement('div'));
		content.appendChild(this.image_options = document.createElement('div'));
		content.appendChild(this.textbox_options = document.createElement('div'));
		content.appendChild(this.article_options = document.createElement('div'));
		content.appendChild(this.flag_options = document.createElement('div'));
		content.appendChild(this.points_options = document.createElement('div'));
		//this.make_input(content, 'content_flag', 'Check if this flag is true to create');
		this.add_content();
		this.hide_all();
	}

	add_content() {
		// paragraph
		this.make_input(this.paragraph_options, 'p_text', 'Paragraph Text');
		// button
		this.make_input(this.button_options, 'b_text', 'Button Text');
		this.make_input(this.button_options, 'b_url', 'Button URL');
		this.make_checkbox(this.button_options, 'b_end', 'End Scenario?');
		// image
		this.make_input(this.image_options, 'i_url', 'Image URL');
		this.make_dropdown(this.image_options, 'i_display', ['padded', 'full-width'], 'Image Display');
		// textbox
		this.make_input(this.textbox_options, 'tb_text', 'Textbox Text');
		// article
		this.make_input(this.article_options, 'a_text', 'Article Title');
		this.make_input(this.article_options, 'a_src', 'Article Image URL');
		this.make_input(this.article_options, 'a_url', 'Article URL');
		// flag
		this.make_input(this.flag_options, 'f_text', 'Flag Name');
		this.make_checkbox(this.flag_options, 'f_bool', 'Set Flag to True?');
		// points
		this.make_input(this.points_options, 'p_amt', 'Amount of Points');
	}

	make_input(container:HTMLElement, id:string, label:string, text:string = '') {
		container.appendChild(Util.make_label(label));
		let input = document.createElement('input');
		input.id = id;
		if (text.length > 0) input.value = text;
		container.appendChild(input);
	}

	make_checkbox(container:HTMLElement, id:string, label:string) {
		let input = document.createElement('input');
		input.classList.add('checkbox');
		input.id = id;
		input.setAttribute('type', 'checkbox');
		container.appendChild(input);
		container.appendChild(Util.make_label(label));
	}

	make_dropdown(container:HTMLElement, id:string, options:string[], label:string) {
		let dropdown = document.createElement('select');
		dropdown.id = id;
		for (let el of options) {
			let opt = document.createElement('option');
			opt.value = opt.innerText = el;
			dropdown.options.add(opt);
		}
		this.image_options.appendChild(Util.make_label(label));
		this.image_options.appendChild(dropdown);
	}

	hide_all() {
		for (let el of [
			this.paragraph_options,
			this.button_options,
			this.image_options,
			this.textbox_options,
			this.article_options,
			this.flag_options,
			this.points_options
		]) el.classList.add('hidden');
	}

	make_selector():HTMLElement {
		let out = document.createElement('select');
		out.id = 'element_selector';
		for (let el of ['Choose Element Type', 'paragraph', 'button', 'image', 'textbox', 'article', 'flag', 'points']) {
			var el_option = document.createElement('option');
			el_option.value = el;
			el_option.innerText = el;
			out.options.add(el_option);
		}
		out.onchange = (e) => this.make_selection();
		return out;
	}

	make_selection() {
		this.hide_all();
		let selection = (document.getElementById('element_selector') as HTMLSelectElement).value;
		switch (selection) {
			case 'paragraph': this.paragraph_options.classList.remove('hidden'); break;
			case 'button': this.button_options.classList.remove('hidden'); break;
			case 'image': this.image_options.classList.remove('hidden'); break;
			case 'textbox': this.textbox_options.classList.remove('hidden'); break;
			case 'article': this.article_options.classList.remove('hidden'); break;
			case 'flag': this.flag_options.classList.remove('hidden'); break;
			case 'points': this.points_options.classList.remove('hidden'); break;
			default: break;
		}
	}

	add_element():boolean {
		let selection = (document.getElementById('element_selector') as HTMLSelectElement).value;
		switch (selection) {
			case 'paragraph': return this.validate_paragraph();
			case 'button': return this.validate_button();
			case 'image': return this.validate_image();
			case 'textbox': return this.validate_textbox();
			case 'article': return this.validate_article();
			case 'flag': return this.validate_flag();
			case 'points': return this.validate_points();
			default: return false;
		}
	}

	validate_paragraph():boolean {
		let p_text = (document.getElementById('p_text') as HTMLInputElement).value;
		if (p_text.length == 0) {
			alert('Paragraph must have text!');
			return false;
		}
		this.add_new_content({
			type: 'paragraph',
			text: p_text
		});
		return true;
	}

	validate_button():boolean {
		let b_text = (document.getElementById('b_text') as HTMLInputElement).value;
		if (b_text.length == 0) {
			alert('Button must have text!');
			return false;
		}
		let b_url = (document.getElementById('b_url') as HTMLInputElement).value;
		let b_end = (document.getElementById('b_end') as HTMLInputElement).checked;
		if (b_url.length == 0 && !b_end) {
			alert('Button must have a URL or End the Scenario!');
			return false;
		}
		this.add_new_content({
			type: 'button',
			text: b_text,
			url: b_url,
			end: b_end
		});
		return true;
	}

	validate_image():boolean {
		let i_url = (document.getElementById('i_url') as HTMLInputElement).value;
		if (i_url.length == 0) {
			alert('Image must have a URL!');
			return false;
		}
		let i_display = (document.getElementById('i_display') as HTMLSelectElement).value;
		this.add_new_content({
			type: 'image',
			url: i_url,
			display: i_display
		});
		return true;
	}

	validate_textbox():boolean {
		let tb_text = (document.getElementById('tb_text') as HTMLInputElement).value;
		if (tb_text.length == 0) {
			alert('Textbox must have text!');
			return false;
		}
		this.add_new_content({
			type: 'textbox',
			text: tb_text
		});
		return true;
	}

	validate_article():boolean {
		let a_text = (document.getElementById('a_text') as HTMLInputElement).value;
		let a_src = (document.getElementById('a_src') as HTMLInputElement).value;
		let a_url = (document.getElementById('a_url') as HTMLInputElement).value;
		if (a_text.length == 0) {
			alert('Article must have text!');
			return false;
		}
		if (a_src.length == 0) {
			alert('Article must have Image URL!');
			return false;
		}
		if (a_url.length == 0) {
			alert('Article must have URL!');
			return false;
		}
		this.add_new_content({
			type: 'article',
			text: a_text,
			src: a_src,
			url: a_url
		});
		return true;
	}

	validate_flag():boolean {
		let f_text = (document.getElementById('f_text') as HTMLInputElement).value;
		let f_bool = (document.getElementById('f_bool') as HTMLInputElement).checked;
		if (f_text.length == 0) {
			alert('Flag must have text!');
			return false;
		}
		this.add_new_content({
			type: 'flag',
			text: f_text,
			value: f_bool
		});
		return true;
	}

	validate_points():boolean {
		let p_amt = (document.getElementById('p_amt') as HTMLInputElement).value;
		if (p_amt.length == 0) {
			alert('Points must have an Amount!');
			return false;
		}
		if (isNaN(parseInt(p_amt))) {
			alert('Points amount must be a number!');
			return false;
		}
		this.add_new_content({
			type: 'points',
			amt: parseInt(p_amt)
		});
		return true;
	}

	add_new_content(content:Content) {
		//let flag = (document.getElementById('content_flag') as HTMLInputElement).value;
		//if (flag.length > 0) content.flag = flag;
		App.current_card.content.push(content);
		App.workarea.load_card(App.current_card);
	}
}