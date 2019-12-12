class Nodemap {
	element:HTMLDivElement;
	canvas:HTMLCanvasElement;
	context:CanvasRenderingContext2D;
	nodes:DeckNode[] = [];
	node_width:number = 128;
	node_height:number = 64;
	node_padding_v = 32;
	node_padding_h = 32;
	node_cascade = 32;
	selected:string;
	constructor(title:string) {
		this.selected = title;
		this.element = document.createElement('div');
		this.element.classList.add('modal_container', 'nodemap');
		this.canvas = document.createElement('canvas');
		this.canvas.width = document.body.clientWidth;
		this.canvas.height = document.body.clientHeight;
		this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
		this.context.lineWidth = 2;
		this.context.font = '14px sans-serif';
		this.element.appendChild(this.canvas);
		document.body.appendChild(this.element);
		this.canvas.onclick = (e) => this.click_node(e);
		this.make_nodes();
	}
	click_node(e:MouseEvent) {
		let clicked_node:DeckNode | undefined = undefined;
		for (let node of this.nodes) {
			if (
				e.x > node.p.x &&
				e.x < node.p.x + this.node_width &&
				e.y > node.p.y &&
				e.y < node.p.y + this.node_height
			) clicked_node = node;
		}
		this.element.remove();
		if (clicked_node != undefined) for (let tab of App.sidebar.all_tabs) {
			if (tab.title == clicked_node.name) tab.select();
		}
	}
	make_nodes() {
		for (let card of App.deck.deck) {
			let node:DeckNode = {
				p: { x: 0, y: 0 },
				name: card.title,
				to: [],
				color:['red', 'blue', 'orange', 'green', 'purple'][this.nodes.length % 5]
			}
			this.nodes.push(node);
		}
		let x = 0;
		let y = 0;
		for (let node of this.nodes) {
			let card = Util.get_card(node.name) as Card;
			for (let c of card.content) {
				if (c.url) {
					let to = this.get_node_from_name(this.nodes, c.url);
					if (to) node.to.push(to);
				}
				if (c.end) node.exit = true;
			}
		}
		(this.get_node_from_name(this.nodes, App.deck.first_card) as DeckNode).p = { x: this.node_padding_h, y: this.node_padding_v };
		for (let node of this.nodes) this.draw_node_lines(node);
		for (let node of this.nodes) this.draw_node(node);
	}
	get_node_from_name(nodes:DeckNode[], name:string):DeckNode | null {
		for (let node of nodes) if (node.name == name) return node;
		return null;
	}
	get_node_out(node:DeckNode):Point {
		return { x: node.p.x + this.node_width, y: node.p.y + this.node_height/2 };
	}
	get_node_in(node:DeckNode):Point {
		return { x: node.p.x, y: node.p.y + this.node_height/2 };
	}
	draw_node(node:DeckNode) {
		this.context.beginPath();
		this.context.fillStyle = 'white';
		this.context.fillRect(node.p.x, node.p.y, this.node_width, this.node_height);
		this.context.fillStyle = node.color;
		this.context.fillText(node.name, node.p.x + 24, node.p.y + this.node_height/2 + 3);
		this.context.rect(node.p.x, node.p.y, this.node_width, this.node_height);
		this.context.strokeStyle = node.color;
		if (node.name == this.selected) this.context.lineWidth = 4;
		this.context.stroke();
		this.context.lineWidth = 2;
		if (node.exit) this.draw_exit(node);
	}
	draw_node_lines(node:DeckNode) {
		this.context.strokeStyle = node.color;
		let y = node.p.y + this.node_cascade;
		for (let n of node.to) {
			if (n.p.x == 0) {
				n.p.x = node.p.x + this.node_width + this.node_padding_h;
				n.p.y = y;
				y += this.node_height + this.node_padding_v;
			}
			this.context.lineWidth = n.name == this.selected || node.name == this.selected ? 4 : 2;
			node.p.x < n.p.x ? this.draw_line(this.get_node_out(node), this.get_node_in(n)) : this.draw_line(this.get_node_out(n), this.get_node_in(node), true);
			this.context.lineWidth = 2;
		}
	}
	draw_line(p1:Point, p2:Point, dashed:boolean = false) {
		this.context.beginPath();
		this.context.moveTo(p1.x, p1.y);
		let midx = p1.x + (p2.x - p1.x)/2;
		this.context.bezierCurveTo(midx, p1.y, midx, p2.y, p2.x, p2.y);
		!dashed ? this.context.setLineDash([]) : this.context.setLineDash([8, 8]);
		this.context.stroke();
		this.context.setLineDash([])
	}
	draw_exit(node:DeckNode) {
		this.context.moveTo(node.p.x + this.node_width, node.p.y + this.node_height/2);
		this.context.lineTo(node.p.x + this.node_width + this.node_padding_h/2, node.p.y + this.node_height/2);
		this.context.stroke();
		this.context.fillRect(node.p.x + this.node_width + this.node_padding_h/2, node.p.y + this.node_height/2 - 8, 4, 16);
	}
}
type DeckNode = {
	p :Point,
	name: string,
	to: DeckNode[],
	color:string,
	exit?:boolean
}
type Point = {
	x: number,
	y: number
}