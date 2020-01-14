class Modal {
	container:HTMLDivElement;
	constructor(options:ModalOptions) {
		// options
		if (!options.cancel) options.cancel = 'Cancel';
		// container
		this.container = document.createElement('div');
		this.container.classList.add('modal_container');
		// modal
		let modal = document.createElement('div');
		modal.classList.add('modal');
		this.container.appendChild(modal);
		// title
		let title = document.createElement('h1');
		title.innerText = options.title;
		modal.appendChild(title);
		// content
		modal.appendChild(options.content);
		// buttons
		let cancel = document.createElement('div');
		cancel.classList.add('button', 'right', 'secondary');
		cancel.innerText = options.cancel as string;
		cancel.onclick = () => this.close();
		let this_modal = this;
		if (options.confirm && options.on_confirm) {
			let confirm = document.createElement('div');
			confirm.classList.add('button', 'right');
			confirm.innerText = options.confirm as string;
			confirm.onclick = () => {
				if ((options.on_confirm as () => boolean)()) this_modal.close();
			}
			modal.appendChild(confirm);
		}
		modal.appendChild(cancel);
		// add to body
		document.body.appendChild(this.container);
	}
	close() {
		this.container.remove();
	}
}

type ModalOptions = {
	content:HTMLElement,
	title:string,
	on_confirm?:() => boolean,
	confirm?:string,
	cancel?:string,
}