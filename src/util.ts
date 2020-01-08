class Util {
	static get_card(title:string) {
		for (let card of App.deck.deck) if (card.title == title) return card;
		return null;
	}
	static select_text(node:Node) {
		let range = document.createRange();
		range.selectNode(node);
		(window.getSelection as () => Selection)().removeAllRanges();
		(window.getSelection as () => Selection)().addRange(range);
	}
	static resize_input(input:HTMLInputElement) {
		input.setAttribute('size', input.value.length + 1 + '');
	}
	static make_label(text:string):HTMLLabelElement {
		let out = document.createElement('label');
		out.innerText = text;
		return out;
	}
	static parse_code_input(c:HTMLTextAreaElement, e:KeyboardEvent) {
		let keycode = e.keyCode || e.which;
		// prevent tab out
		if (keycode == 9) {
			e.preventDefault();
			let start = c.selectionStart;
			let end = c.selectionEnd;
			c.value = c.value.substring(0, start) + '\t' + c.value.substring(end);
			c.selectionStart = c.selectionEnd = start + 1;
		}
		// insert tabs on enter
		if (keycode == 13) {
			e.preventDefault();
			let start = c.selectionStart;
			let end = c.selectionEnd;
			let before = c.value.substring(0, start);
			let after = c.value.substring(end);
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
			c.value = before + input + after;
			c.selectionStart = c.selectionEnd = start + 1 + spacing;
		}
		// Add closing brackets
		if (keycode == 219) {
			e.preventDefault();
			let start = c.selectionStart;
			let end = c.selectionEnd;
			let before = c.value.substring(0, start);
			let after = c.value.substring(end);
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
			c.value = before + input + after;
			c.selectionStart = c.selectionEnd = start + 1;
		}
		// Ignore brackets if bracket-adjacent
		if (keycode == 221) {
			let start = c.selectionStart;
			let end = c.selectionEnd;
			let after = c.value.substring(end);
			if (after.charAt(0) == (e.shiftKey ? '}' : ']')) {
				e.preventDefault();
				c.selectionStart = c.selectionEnd = start + 1;
			}
		}
		// quotes
		let cont = false;
		// Ignore quotes if quote-adjacent
		if (keycode == 222) {
			let start = c.selectionStart;
			let end = c.selectionEnd;
			let after = c.value.substring(end);
			if (after.charAt(0) == (e.shiftKey ? '"' : "'")) {
				e.preventDefault();
				c.selectionStart = c.selectionEnd = start + 1;
				cont = true;
			}
		}
		// Add closing quotes
		if (keycode == 222 && !cont) {
			e.preventDefault();
			let start = c.selectionStart;
			let end = c.selectionEnd;
			let before = c.value.substring(0, start);
			let after = c.value.substring(end);
			var quotes = 1;
			for (let char of before.split('')) {
				if (['"', "'"].indexOf(char) >= 0) quotes++;
			}
			let input = e.shiftKey ? '"' : "'";
			if (quotes % 2 == 1) input += e.shiftKey ? '"' : "'";
			c.value = before + input + after;
			c.selectionStart = c.selectionEnd = start + 1;
		}
}
}