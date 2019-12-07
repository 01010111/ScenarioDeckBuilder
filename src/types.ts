type Deck = {
	deck:Card[],
	first_card:string,
	theme: string,
	title:string,
	subtitle:string,
	description:string,
	button_text:string,
	bg_src?:string,
	content_links?: ContentLink[],
}
type Card = {
	title:string,
	content:Content[],
}
type Content = {
	type:string,
	text?:string,
	src?:string,
	display?:string,
	url?:string,
	amt?:number,
	flag?:string,
	value?:boolean,
	end?:boolean,
}
type ContentLink = {
	image:string,
	title:string,
	url:string,
}