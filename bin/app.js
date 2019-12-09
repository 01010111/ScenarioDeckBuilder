"use strict";
var App = /** @class */ (function () {
    function App(deck) {
        deck ? App.load_deck(deck) : App.load_deck(App.get_default_deck());
    }
    App.unload_deck = function () {
        if (this.sidebar)
            this.sidebar.unload();
        if (this.workarea)
            this.workarea.unload();
    };
    App.load_deck = function (deck) {
        this.unload_deck();
        // init deck
        App.deck = deck;
        // init app
        if (!App.topbar)
            App.topbar = new TopBar();
        if (!App.sidebar)
            App.sidebar = new SideBar();
        if (!App.workarea)
            App.workarea = new WorkArea();
        App.topbar.load();
        // add existing cards
        for (var _i = 0, _a = App.deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            App.sidebar.add_new_card(card);
        }
        if (App.sidebar.all_tabs.length > 0)
            App.sidebar.all_tabs[0].select();
    };
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
        return JSON.stringify(App.deck, null, 4);
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
    }
    CardTab.prototype.add = function () {
        App.sidebar.element.insertBefore(this.element, App.sidebar.add_card);
        return this;
    };
    CardTab.prototype.select = function () {
        var card = Util.get_card(this.title);
        if (!card)
            return;
        App.current_card = card;
        for (var _i = 0, _a = App.sidebar.all_tabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            tab.element.classList.remove('selected', 'end');
        }
        this.element.classList.add('selected');
        for (var _b = 0, _c = card.content; _b < _c.length; _b++) {
            var c = _c[_b];
            if (c.end)
                this.element.classList.add('end');
        }
        App.workarea.load_card(card);
        App.workarea.current_card_tab = this;
    };
    CardTab.prototype.rename = function (title) {
        this.title = title;
        this.element.innerText = title;
    };
    return CardTab;
}());
var Modal = /** @class */ (function () {
    function Modal(options) {
        var _this = this;
        // options
        if (!options.cancel)
            options.cancel = 'Cancel';
        // container
        this.container = document.createElement('div');
        this.container.classList.add('modal_container');
        // modal
        var modal = document.createElement('div');
        modal.classList.add('modal');
        this.container.appendChild(modal);
        // title
        var title = document.createElement('h1');
        title.innerText = options.title;
        modal.appendChild(title);
        // content
        modal.appendChild(options.content);
        // buttons
        var cancel = document.createElement('div');
        cancel.classList.add('button', 'bottom', 'secondary');
        cancel.innerText = options.cancel;
        cancel.onclick = function () { return _this.close(); };
        var this_modal = this;
        if (options.confirm && options.on_confirm) {
            var confirm_1 = document.createElement('div');
            confirm_1.classList.add('button', 'bottom');
            confirm_1.innerText = options.confirm;
            confirm_1.onclick = function () {
                if (options.on_confirm())
                    this_modal.close();
            };
            modal.appendChild(confirm_1);
        }
        modal.appendChild(cancel);
        // add to body
        document.body.appendChild(this.container);
    }
    Modal.prototype.close = function () {
        this.container.remove();
    };
    return Modal;
}());
var Settings = /** @class */ (function () {
    function Settings() {
    }
    Settings.make_config_modal = function () {
        var content = document.createElement('div');
        content.classList.add('settings');
        // first card
        content.appendChild(Util.make_label('First Card'));
        var first_card = document.createElement('select');
        for (var _i = 0, _a = App.deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            var opt = document.createElement('option');
            opt.value = opt.text = card.title;
            if (card.title == App.deck.first_card)
                opt.selected = true;
            first_card.add(opt);
        }
        content.appendChild(first_card);
        // theme
        content.appendChild(Util.make_label('Theme'));
        var themes = document.createElement('select');
        for (var _b = 0, _c = ['legacy', 'simple']; _b < _c.length; _b++) {
            var theme = _c[_b];
            var opt = document.createElement('option');
            opt.value = opt.text = theme;
            if (theme == App.deck.theme)
                opt.selected = true;
            themes.add(opt);
        }
        content.appendChild(themes);
        // subtitle
        content.appendChild(Util.make_label('Subtitle'));
        var subtitle = document.createElement('input');
        subtitle.value = App.deck.subtitle;
        content.appendChild(subtitle);
        // description
        content.appendChild(Util.make_label('Description'));
        var description = document.createElement('input');
        description.value = App.deck.description;
        content.appendChild(description);
        // button text
        content.appendChild(Util.make_label('Start Button Text'));
        var button_text = document.createElement('input');
        button_text.value = App.deck.button_text;
        content.appendChild(button_text);
        // bg src
        content.appendChild(Util.make_label('Background Image'));
        var bg_src = document.createElement('input');
        bg_src.placeholder = 'None';
        bg_src.value = App.deck.bg_src ? App.deck.bg_src : '';
        content.appendChild(bg_src);
        // on confirm
        var validate = function () {
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
            return true;
        };
        var save = function () {
            var ok = validate();
            if (!ok)
                return false;
            App.deck.first_card = first_card.value;
            App.deck.theme = themes.value;
            App.deck.subtitle = subtitle.value;
            App.deck.description = description.value;
            App.deck.button_text = button_text.value;
            App.deck.bg_src = (bg_src.value.length == 0 ? undefined : bg_src.value);
            return true;
        };
        new Modal({
            content: content,
            title: App.deck.title + " Config",
            cancel: 'Cancel',
            confirm: 'Save',
            on_confirm: function () { return save(); }
        });
    };
    return Settings;
}());
var SideBar = /** @class */ (function () {
    function SideBar() {
        var _this = this;
        this.all_tabs = [];
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
        this.all_tabs.push(new CardTab(card.title).add());
    };
    SideBar.prototype.delete_card = function (title) {
        for (var _i = 0, _a = this.all_tabs; _i < _a.length; _i++) {
            var tab = _a[_i];
            if (tab.title == title) {
                tab.element.remove();
                this.all_tabs.splice(this.all_tabs.indexOf(tab), 1);
            }
        }
    };
    SideBar.prototype.update_links = function (title) {
        var incoming_links = [];
        var outgoing_links = [];
        for (var _i = 0, _a = App.deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.title == title) {
                for (var _b = 0, _c = card.content; _b < _c.length; _b++) {
                    var content = _c[_b];
                    if (content.url)
                        outgoing_links.push(content.url);
                }
                continue;
            }
            for (var _d = 0, _e = card.content; _d < _e.length; _d++) {
                var content = _e[_d];
                if (!content.url)
                    continue;
                if (content.url == title)
                    incoming_links.push(card.title);
            }
        }
        for (var _f = 0, _g = this.all_tabs; _f < _g.length; _f++) {
            var tab = _g[_f];
            tab.element.classList.remove('outgoing', 'incoming');
            if (incoming_links.indexOf(tab.title) >= 0)
                tab.element.classList.add('incoming');
            if (outgoing_links.indexOf(tab.title) >= 0)
                tab.element.classList.add('outgoing');
        }
    };
    SideBar.prototype.unload = function () {
        this.all_tabs = [];
        while (this.element.firstChild != this.add_card)
            if (this.element.firstChild)
                this.element.firstChild.remove();
    };
    SideBar.get_unused_title = function () {
        var title = 'My Card  ';
        var n = 0;
        while (Util.get_card(title.trim())) {
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
        this.title_input.oninput = function () {
            App.deck.title = _this.title_input.value;
            Util.resize_input(_this.title_input);
        };
        this.config = document.getElementById('config');
        this.config.onclick = function () { return Settings.make_config_modal(); };
        this.import = document.getElementById('import');
        this.import.onclick = function () { return _this.make_import_modal(); };
        this.export = document.getElementById('export');
        this.export.onclick = function () { return _this.make_export_modal(); };
    }
    TopBar.prototype.load = function () {
        this.title_input.value = App.deck.title;
        Util.resize_input(this.title_input);
    };
    TopBar.prototype.make_export_modal = function () {
        var content = document.createElement('div');
        var code = document.createElement('pre');
        code.innerText = App.get_json();
        code.onclick = function () { return Util.select_text(code); };
        content.appendChild(code);
        var instructions = document.createElement('p');
        instructions.innerText = 'Press CTRL+C to copy!';
        content.appendChild(instructions);
        new Modal({ content: content, title: 'Export JSON' });
        Util.select_text(code);
    };
    TopBar.prototype.make_import_modal = function () {
        var content = document.createElement('div');
        var code = document.createElement('textarea');
        content.appendChild(code);
        var error = document.createElement('div');
        error.classList.add('error_info');
        content.appendChild(error);
        var import_json = function (json) {
            try {
                var deck = JSON.parse(json);
                Validation.validate_deck(deck);
                App.load_deck(deck);
                return true;
            }
            catch (e) {
                error.innerText = e;
                return false;
            }
        };
        new Modal({
            content: content,
            title: 'Import JSON',
            confirm: 'Import',
            on_confirm: function () { return import_json(code.value); }
        });
        Util.select_text(code);
    };
    return TopBar;
}());
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.get_card = function (title) {
        for (var _i = 0, _a = App.deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card.title == title)
                return card;
        }
        return null;
    };
    Util.select_text = function (node) {
        var range = document.createRange();
        range.selectNode(node);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    };
    Util.resize_input = function (input) {
        input.setAttribute('size', input.value.length + 1 + '');
    };
    Util.make_label = function (text) {
        var out = document.createElement('label');
        out.innerText = text;
        return out;
    };
    return Util;
}());
var Validation = /** @class */ (function () {
    function Validation() {
    }
    Validation.validate_deck = function (deck) {
        var card_titles = [];
        for (var _i = 0, _a = deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            if (card_titles.indexOf(card.title) == -1)
                card_titles.push(card.title);
            else
                throw "Multiple cards with title \"" + card.title + "!\"";
            this.validate_card(card);
        }
    };
    Validation.validate_card = function (card) {
        if (!card.title)
            throw 'Card must include a title!';
        this.validate_contents(card.content);
    };
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
                    if (!content.url && !content.end)
                        throw 'Button content must include url or end!';
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
        this.delete = document.getElementById('delete');
        this.title.oninput = function () {
            Util.resize_input(_this.title);
            _this.update_card_tab();
        };
        this.contents.oninput = function () { return _this.update_card(); };
        // parse input
        this.contents.onkeydown = function (e) {
            var keycode = e.keyCode || e.which;
            // prevent tab out
            if (keycode == 9) {
                e.preventDefault();
                var start = _this.contents.selectionStart;
                var end = _this.contents.selectionEnd;
                _this.contents.value = _this.contents.value.substring(0, start) + '\t' + _this.contents.value.substring(end);
                _this.contents.selectionStart = _this.contents.selectionEnd = start + 1;
            }
            // insert tabs on enter
            if (keycode == 13) {
                e.preventDefault();
                var start = _this.contents.selectionStart;
                var end = _this.contents.selectionEnd;
                var before = _this.contents.value.substring(0, start);
                var after = _this.contents.value.substring(end);
                var spacing = 0;
                for (var _i = 0, _a = before.split(''); _i < _a.length; _i++) {
                    var char = _a[_i];
                    if (['[', '{'].indexOf(char) >= 0)
                        spacing++;
                    if ([']', '}'].indexOf(char) >= 0)
                        spacing--;
                }
                var input = '\n';
                for (var i = 0; i < spacing; i++)
                    input += '\t';
                if ([']', '}'].indexOf(after.charAt(0)) >= 0) {
                    input += '\n';
                    for (var i = 1; i < spacing; i++)
                        input += '\t';
                }
                _this.contents.value = before + input + after;
                _this.contents.selectionStart = _this.contents.selectionEnd = start + 1 + spacing;
            }
            // Add closing brackets
            if (keycode == 219) {
                e.preventDefault();
                var start = _this.contents.selectionStart;
                var end = _this.contents.selectionEnd;
                var before = _this.contents.value.substring(0, start);
                var after = _this.contents.value.substring(end);
                var openings = 1;
                var closings = 0;
                for (var _b = 0, _c = before.split(''); _b < _c.length; _b++) {
                    var char = _c[_b];
                    if (['[', '{'].indexOf(char) >= 0)
                        openings++;
                    if ([']', '}'].indexOf(char) >= 0)
                        openings--;
                }
                for (var _d = 0, _e = after.split(''); _d < _e.length; _d++) {
                    var char = _e[_d];
                    if (['[', '{'].indexOf(char) >= 0)
                        closings--;
                    if ([']', '}'].indexOf(char) >= 0)
                        closings++;
                }
                var input = e.shiftKey ? '{' : '[';
                if (openings > closings)
                    input += e.shiftKey ? '}' : ']';
                _this.contents.value = before + input + after;
                _this.contents.selectionStart = _this.contents.selectionEnd = start + 1;
            }
            // Ignore brackets if bracket-adjacent
            if (keycode == 221) {
                var start = _this.contents.selectionStart;
                var end = _this.contents.selectionEnd;
                var after = _this.contents.value.substring(end);
                if (after.charAt(0) == (e.shiftKey ? '}' : ']')) {
                    e.preventDefault();
                    _this.contents.selectionStart = _this.contents.selectionEnd = start + 1;
                }
            }
            // quotes
            var cont = false;
            // Ignore quotes if quote-adjacent
            if (keycode == 222) {
                var start = _this.contents.selectionStart;
                var end = _this.contents.selectionEnd;
                var after = _this.contents.value.substring(end);
                if (after.charAt(0) == (e.shiftKey ? '"' : "'")) {
                    e.preventDefault();
                    _this.contents.selectionStart = _this.contents.selectionEnd = start + 1;
                    cont = true;
                }
                _this.check_missing_cards();
                _this.update_card();
            }
            // Add closing quotes
            if (keycode == 222 && !cont) {
                e.preventDefault();
                var start = _this.contents.selectionStart;
                var end = _this.contents.selectionEnd;
                var before = _this.contents.value.substring(0, start);
                var after = _this.contents.value.substring(end);
                var quotes = 1;
                for (var _f = 0, _g = before.split(''); _f < _g.length; _f++) {
                    var char = _g[_f];
                    if (['"', "'"].indexOf(char) >= 0)
                        quotes++;
                }
                var input = e.shiftKey ? '"' : "'";
                if (quotes % 2 == 1)
                    input += e.shiftKey ? '"' : "'";
                _this.contents.value = before + input + after;
                _this.contents.selectionStart = _this.contents.selectionEnd = start + 1;
                _this.update_card();
            }
        };
        this.delete.onclick = function () { return new Modal({
            cancel: 'Keep card',
            confirm: 'Delete card',
            on_confirm: function () {
                _this.delete_card();
                return true;
            },
            content: document.createElement('div'),
            title: 'Delete card?'
        }); };
        this.update_pos_info();
    }
    WorkArea.prototype.load_card = function (card) {
        this.title.value = card.title;
        Util.resize_input(this.title);
        this.contents.value = JSON.stringify(card.content, null, '\t');
        App.sidebar.update_links(card.title);
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
            if (App.deck.first_card == App.current_card.title)
                App.deck.first_card = this.title.value;
            App.current_card.title = this.title.value;
            this.error_info.innerText = '';
            App.sidebar.update_links(this.title.value);
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
    WorkArea.prototype.delete_card = function () {
        if (App.deck.deck.length <= 1)
            return alert('A deck must have at least one card!');
        if (!this.current_card_tab)
            return;
        App.sidebar.delete_card(this.current_card_tab.title);
        App.deck.deck.splice(App.deck.deck.indexOf(Util.get_card(this.current_card_tab.title)), 1);
        App.sidebar.all_tabs[0].select();
    };
    WorkArea.prototype.check_missing_cards = function () {
        for (var _i = 0, _a = App.current_card.content; _i < _a.length; _i++) {
            var content = _a[_i];
            if (!content.url)
                continue;
            if (content.url.length == 0)
                continue;
            if (content.url.indexOf('.') >= 0)
                continue;
            var card_exists = false;
            for (var _b = 0, _c = App.deck.deck; _b < _c.length; _b++) {
                var card_1 = _c[_b];
                if (card_exists)
                    continue;
                if (card_1.title == content.url)
                    card_exists = true;
            }
            if (card_exists)
                continue;
            var card = {
                title: content.url,
                content: []
            };
            App.deck.deck.push(card);
            App.sidebar.add_new_card(card);
        }
        App.sidebar.update_links(App.current_card.title);
    };
    WorkArea.prototype.unload = function () {
        this.title.value = '';
        this.contents.value = '';
    };
    return WorkArea;
}());
