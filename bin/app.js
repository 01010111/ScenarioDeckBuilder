"use strict";
var App = /** @class */ (function () {
    function App(deck) {
        // init deck
        App.deck = deck ? deck : App.get_default_deck();
        // init app
        App.topbar = new TopBar();
        App.sidebar = new SideBar();
        App.workarea = new WorkArea();
        // add existing cards
        for (var _i = 0, _a = App.deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            App.sidebar.add_new_card(card);
        }
        if (CardTab.all.length > 0)
            CardTab.all[0].select();
    }
    App.get_default_deck = function () {
        return {
            theme: 'legacy',
            title: 'New Deck',
            subtitle: 'Situation Deck',
            button_text: 'Begin',
            description: 'New Situation Deck',
            first_card: 'My Card',
            deck: [
                {
                    title: 'My Card',
                    content: [
                        {
                            type: 'paragraph',
                            text: 'Hello world!'
                        }
                    ]
                }
            ]
        };
    };
    App.get_json = function () {
        return JSON.stringify(App.deck, null, 2);
    };
    return App;
}());
var CardTab = /** @class */ (function () {
    function CardTab(title) {
        var _this = this;
        this.title = title;
        this.element = document.createElement('div');
        this.element.classList.add('card_tab');
        this.element.onclick = function () { return _this.select(); };
        this.rename(title);
        CardTab.all.push(this);
    }
    CardTab.prototype.add = function () {
        App.sidebar.element.insertBefore(this.element, App.sidebar.add_card);
        return this;
    };
    CardTab.prototype.select = function () {
        var card = DeckUtil.get_card(this.title);
        if (!card)
            return;
        App.current_card = card;
        for (var _i = 0, _a = CardTab.all; _i < _a.length; _i++) {
            var tab = _a[_i];
            tab.element.classList.remove('selected');
        }
        this.element.classList.add('selected');
        App.workarea.load_card(card);
        App.workarea.current_card_tab = this;
    };
    CardTab.prototype.rename = function (title) {
        this.title = title;
        this.element.innerText = title;
    };
    CardTab.all = [];
    return CardTab;
}());
var DeckUtil = /** @class */ (function () {
    function DeckUtil() {
    }
    DeckUtil.get_card = function (title) {
        for (var _i = 0, _a = App.deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.title == title)
                return card;
        }
        return null;
    };
    return DeckUtil;
}());
var SideBar = /** @class */ (function () {
    function SideBar() {
        var _this = this;
        this.element = document.getElementById('sidebar');
        this.add_card = document.getElementById('add_card');
        this.element.appendChild(this.add_card);
        this.add_card.onclick = function () {
            var card = {
                title: SideBar.get_unused_title(),
                content: []
            };
            App.deck.deck.push(card);
            _this.add_new_card(card);
        };
    }
    SideBar.prototype.add_new_card = function (card) {
        new CardTab(card.title).add();
    };
    SideBar.get_unused_title = function () {
        var title = 'My Card  ';
        var n = 0;
        while (DeckUtil.get_card(title.trim())) {
            n++;
            title = title.substring(0, 8) + n;
        }
        return title;
    };
    return SideBar;
}());
var TopBar = /** @class */ (function () {
    function TopBar() {
        var _this = this;
        this.element = document.getElementById('top_bar');
        this.title_input = document.getElementById('title_input');
        this.title_input.value = App.deck.title;
        this.title_input.oninput = function () { return App.deck.title = _this.title_input.value; };
    }
    return TopBar;
}());
var Validation = /** @class */ (function () {
    function Validation() {
    }
    Validation.validate_contents = function (contents) {
        for (var _i = 0, contents_1 = contents; _i < contents_1.length; _i++) {
            var content = contents_1[_i];
            if (!content.type)
                throw 'Content block must include type!';
            switch (content.type) {
                case 'paragraph':
                    if (!content.text)
                        throw 'Paragraph content must include text!';
                    break;
                case 'image':
                    if (!content.src)
                        throw 'Image content must include src!';
                    break;
                case 'textbox':
                    if (!content.text)
                        throw 'Textbox content must include text!';
                    break;
                case 'button':
                    if (!content.text)
                        throw 'Button content must include text!';
                    if (!content.url)
                        throw 'Button content must include url!';
                    break;
                case 'article':
                    if (!content.text)
                        throw 'Article content must include text!';
                    if (!content.src)
                        throw 'Article content must include src!';
                    if (!content.url)
                        throw 'Article content must include url!';
                    break;
                case 'flag':
                    if (!content.text)
                        throw 'Flag content must include text!';
                    if (content.value && typeof content.value == 'boolean')
                        throw 'Flag value must be true or false!';
                    break;
                case 'points':
                    if (!content.amt)
                        throw 'Points content must include amt!';
                    break;
                default: throw "\"" + content.type + "\" is not a valid type!";
            }
        }
    };
    return Validation;
}());
var WorkArea = /** @class */ (function () {
    function WorkArea() {
        var _this = this;
        this.current_card_tab = null;
        this.element = document.getElementById('workarea');
        this.title = document.getElementById('card_title');
        this.contents = document.getElementById('card_contents');
        this.error_info = document.getElementById('error_info');
        this.pos_info = document.getElementById('pos_info');
        this.title.oninput = function () { return _this.update_card_tab(); };
        this.contents.oninput = function () { return _this.update_card(); };
        // prevent tab out
        this.contents.onkeydown = function (e) {
            var keycode = e.keyCode || e.which;
            if (keycode == 9) {
                e.preventDefault();
                var start = _this.contents.selectionStart;
                var end = _this.contents.selectionEnd;
                _this.contents.value = _this.contents.value.substring(0, start) + '\t' + _this.contents.value.substring(end);
                _this.contents.selectionStart = _this.contents.selectionEnd = start + 1;
            }
        };
        this.update_pos_info();
    }
    WorkArea.prototype.load_card = function (card) {
        this.title.value = card.title;
        this.contents.value = JSON.stringify(card.content, null, '\t');
    };
    WorkArea.prototype.update_card_tab = function () {
        if (!this.current_card_tab)
            return;
        this.current_card_tab.rename(this.title.value);
        this.update_card();
    };
    WorkArea.prototype.update_card = function () {
        try {
            var content = JSON.parse(this.contents.value);
            Validation.validate_contents(content);
            App.current_card.content = content;
            App.current_card.title = this.title.value;
            this.error_info.innerText = '';
        }
        catch (e) {
            this.error_info.innerText = e;
        }
    };
    WorkArea.prototype.update_pos_info = function () {
        var _this = this;
        this.pos_info.innerText = this.contents.selectionStart + '';
        requestAnimationFrame(function () { return _this.update_pos_info(); });
    };
    return WorkArea;
}());
