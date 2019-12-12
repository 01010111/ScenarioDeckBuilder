class Preview {
	container:HTMLDivElement;
	constructor() {
		// container
		this.container = document.createElement('div');
		this.container.classList.add('modal_container');
		// close btn
		let close_btn = document.createElement('div');
		close_btn.classList.add('preview', 'close_btn');
		close_btn.onclick = () => this.close();
		// preview
		let preview = document.createElement('iframe');
		preview.classList.add('preview');
		this.container.appendChild(preview);
		preview.src = 'sd/app.html'
		preview.onload = () => {
			let app_window:any = preview.contentWindow;
			app_window.init(App.deck);
			this.container.appendChild(close_btn);
		};
		// add to body
		document.body.appendChild(this.container);
	}
	close() {
		this.container.remove();
	}}