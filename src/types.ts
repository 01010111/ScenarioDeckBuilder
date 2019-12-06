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
	type:String,
	text?:String,
	src?:String,
	display?:String,
	url?:String,
	amt?:number,
	flag?:String,
	value?:boolean,
	end?:boolean,
}
type ContentLink = {
	image:string,
	title:string,
	url:string,
}