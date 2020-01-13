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
            bg_src: 'assets/business.png',
            first_card: 'My Card',
            deck: [
                {
                    title: 'My Card',
                    content: []
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
    CardTab.prototype.refresh = function () {
        for (var _i = 0, _a = App.current_card.content; _i < _a.length; _i++) {
            var c = _a[_i];
            if (c.end)
                this.element.classList.add('end');
        }
    };
    CardTab.prototype.rename = function (title) {
        this.title = title;
        this.element.innerText = title;
    };
    return CardTab;
}());
var ElementModal = /** @class */ (function () {
    function ElementModal(old_content) {
        var _this = this;
        var content = document.createElement('div');
        content.classList.add('settings');
        new Modal({
            title: old_content ? 'Edit Element' : 'New Element',
            confirm: old_content ? 'Save Changes' : 'Add New Element',
            cancel: 'Cancel',
            content: content,
            on_confirm: function () { return _this.add_element(); }
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
    ElementModal.prototype.add_content = function () {
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
    };
    ElementModal.prototype.make_input = function (container, id, label, text) {
        if (text === void 0) { text = ''; }
        container.appendChild(Util.make_label(label));
        var input = document.createElement('input');
        input.id = id;
        if (text.length > 0)
            input.value = text;
        container.appendChild(input);
    };
    ElementModal.prototype.make_checkbox = function (container, id, label) {
        var input = document.createElement('input');
        input.classList.add('checkbox');
        input.id = id;
        input.setAttribute('type', 'checkbox');
        container.appendChild(input);
        container.appendChild(Util.make_label(label));
    };
    ElementModal.prototype.make_dropdown = function (container, id, options, label) {
        var dropdown = document.createElement('select');
        dropdown.id = id;
        for (var _i = 0, options_1 = options; _i < options_1.length; _i++) {
            var el = options_1[_i];
            var opt = document.createElement('option');
            opt.value = opt.innerText = el;
            dropdown.options.add(opt);
        }
        this.image_options.appendChild(Util.make_label(label));
        this.image_options.appendChild(dropdown);
    };
    ElementModal.prototype.hide_all = function () {
        for (var _i = 0, _a = [
            this.paragraph_options,
            this.button_options,
            this.image_options,
            this.textbox_options,
            this.article_options,
            this.flag_options,
            this.points_options
        ]; _i < _a.length; _i++) {
            var el = _a[_i];
            el.classList.add('hidden');
        }
    };
    ElementModal.prototype.make_selector = function () {
        var _this = this;
        var out = document.createElement('select');
        out.id = 'element_selector';
        for (var _i = 0, _a = ['Choose Element Type', 'paragraph', 'button', 'image', 'textbox', 'article', 'flag', 'points']; _i < _a.length; _i++) {
            var el = _a[_i];
            var el_option = document.createElement('option');
            el_option.value = el;
            el_option.innerText = el;
            out.options.add(el_option);
        }
        out.onchange = function (e) { return _this.make_selection(); };
        return out;
    };
    ElementModal.prototype.make_selection = function () {
        this.hide_all();
        var selection = document.getElementById('element_selector').value;
        switch (selection) {
            case 'paragraph':
                this.paragraph_options.classList.remove('hidden');
                break;
            case 'button':
                this.button_options.classList.remove('hidden');
                break;
            case 'image':
                this.image_options.classList.remove('hidden');
                break;
            case 'textbox':
                this.textbox_options.classList.remove('hidden');
                break;
            case 'article':
                this.article_options.classList.remove('hidden');
                break;
            case 'flag':
                this.flag_options.classList.remove('hidden');
                break;
            case 'points':
                this.points_options.classList.remove('hidden');
                break;
            default: break;
        }
    };
    ElementModal.prototype.add_element = function () {
        var selection = document.getElementById('element_selector').value;
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
    };
    ElementModal.prototype.validate_paragraph = function () {
        var p_text = document.getElementById('p_text').value;
        if (p_text.length == 0) {
            alert('Paragraph must have text!');
            return false;
        }
        this.add_new_content({
            type: 'paragraph',
            text: p_text
        });
        return true;
    };
    ElementModal.prototype.validate_button = function () {
        var b_text = document.getElementById('b_text').value;
        if (b_text.length == 0) {
            alert('Button must have text!');
            return false;
        }
        var b_url = document.getElementById('b_url').value;
        var b_end = document.getElementById('b_end').checked;
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
    };
    ElementModal.prototype.validate_image = function () {
        var i_url = document.getElementById('i_url').value;
        if (i_url.length == 0) {
            alert('Image must have a URL!');
            return false;
        }
        var i_display = document.getElementById('i_display').value;
        this.add_new_content({
            type: 'image',
            src: i_url,
            display: i_display
        });
        return true;
    };
    ElementModal.prototype.validate_textbox = function () {
        var tb_text = document.getElementById('tb_text').value;
        if (tb_text.length == 0) {
            alert('Textbox must have text!');
            return false;
        }
        this.add_new_content({
            type: 'textbox',
            text: tb_text
        });
        return true;
    };
    ElementModal.prototype.validate_article = function () {
        var a_text = document.getElementById('a_text').value;
        var a_src = document.getElementById('a_src').value;
        var a_url = document.getElementById('a_url').value;
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
    };
    ElementModal.prototype.validate_flag = function () {
        var f_text = document.getElementById('f_text').value;
        var f_bool = document.getElementById('f_bool').checked;
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
    };
    ElementModal.prototype.validate_points = function () {
        var p_amt = document.getElementById('p_amt').value;
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
    };
    ElementModal.prototype.add_new_content = function (content) {
        //let flag = (document.getElementById('content_flag') as HTMLInputElement).value;
        //if (flag.length > 0) content.flag = flag;
        App.current_card.content.push(content);
        App.workarea.load_card(App.current_card);
    };
    return ElementModal;
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
var Nodemap = /** @class */ (function () {
    function Nodemap(title) {
        var _this = this;
        this.nodes = [];
        this.node_width = 128;
        this.node_height = 64;
        this.node_padding_v = 32;
        this.node_padding_h = 32;
        this.node_cascade = 32;
        this.selected = title;
        this.element = document.createElement('div');
        this.element.classList.add('modal_container', 'nodemap');
        this.canvas = document.createElement('canvas');
        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.context = this.canvas.getContext('2d');
        this.context.lineWidth = 2;
        this.context.font = '14px sans-serif';
        this.element.appendChild(this.canvas);
        document.body.appendChild(this.element);
        this.canvas.onclick = function (e) { return _this.click_node(e); };
        this.make_nodes();
    }
    Nodemap.prototype.click_node = function (e) {
        var clicked_node = undefined;
        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
            var node = _a[_i];
            if (e.x > node.p.x &&
                e.x < node.p.x + this.node_width &&
                e.y > node.p.y &&
                e.y < node.p.y + this.node_height)
                clicked_node = node;
        }
        this.element.remove();
        if (clicked_node != undefined)
            for (var _b = 0, _c = App.sidebar.all_tabs; _b < _c.length; _b++) {
                var tab = _c[_b];
                if (tab.title == clicked_node.name)
                    tab.select();
            }
    };
    Nodemap.prototype.make_nodes = function () {
        for (var _i = 0, _a = App.deck.deck; _i < _a.length; _i++) {
            var card = _a[_i];
            var node = {
                p: { x: 0, y: 0 },
                name: card.title,
                to: [],
                color: ['red', 'blue', 'orange', 'green', 'purple'][this.nodes.length % 5]
            };
            this.nodes.push(node);
        }
        var x = 0;
        var y = 0;
        for (var _b = 0, _c = this.nodes; _b < _c.length; _b++) {
            var node = _c[_b];
            var card = Util.get_card(node.name);
            for (var _d = 0, _e = card.content; _d < _e.length; _d++) {
                var c = _e[_d];
                if (c.url) {
                    var to = this.get_node_from_name(this.nodes, c.url);
                    if (to)
                        node.to.push(to);
                }
                if (c.end)
                    node.exit = true;
            }
        }
        this.get_node_from_name(this.nodes, App.deck.first_card).p = { x: this.node_padding_h, y: this.node_padding_v };
        for (var _f = 0, _g = this.nodes; _f < _g.length; _f++) {
            var node = _g[_f];
            this.draw_node_lines(node);
        }
        for (var _h = 0, _j = this.nodes; _h < _j.length; _h++) {
            var node = _j[_h];
            this.draw_node(node);
        }
    };
    Nodemap.prototype.get_node_from_name = function (nodes, name) {
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node.name == name)
                return node;
        }
        return null;
    };
    Nodemap.prototype.get_node_out = function (node) {
        return { x: node.p.x + this.node_width, y: node.p.y + this.node_height / 2 };
    };
    Nodemap.prototype.get_node_in = function (node) {
        return { x: node.p.x, y: node.p.y + this.node_height / 2 };
    };
    Nodemap.prototype.draw_node = function (node) {
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.fillRect(node.p.x, node.p.y, this.node_width, this.node_height);
        this.context.fillStyle = node.color;
        this.context.fillText(node.name, node.p.x + 24, node.p.y + this.node_height / 2 + 3);
        this.context.rect(node.p.x, node.p.y, this.node_width, this.node_height);
        this.context.strokeStyle = node.color;
        if (node.name == this.selected)
            this.context.lineWidth = 4;
        this.context.stroke();
        this.context.lineWidth = 2;
        if (node.exit)
            this.draw_exit(node);
    };
    Nodemap.prototype.draw_node_lines = function (node) {
        this.context.strokeStyle = node.color;
        var y = node.p.y + this.node_cascade;
        for (var _i = 0, _a = node.to; _i < _a.length; _i++) {
            var n = _a[_i];
            if (n.p.x == 0) {
                n.p.x = node.p.x + this.node_width + this.node_padding_h;
                n.p.y = y;
                y += this.node_height + this.node_padding_v;
            }
            this.context.lineWidth = n.name == this.selected || node.name == this.selected ? 4 : 2;
            node.p.x < n.p.x ? this.draw_line(this.get_node_out(node), this.get_node_in(n)) : this.draw_line(this.get_node_out(n), this.get_node_in(node), true);
            this.context.lineWidth = 2;
        }
    };
    Nodemap.prototype.draw_line = function (p1, p2, dashed) {
        if (dashed === void 0) { dashed = false; }
        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        var midx = p1.x + (p2.x - p1.x) / 2;
        this.context.bezierCurveTo(midx, p1.y, midx, p2.y, p2.x, p2.y);
        !dashed ? this.context.setLineDash([]) : this.context.setLineDash([8, 8]);
        this.context.stroke();
        this.context.setLineDash([]);
    };
    Nodemap.prototype.draw_exit = function (node) {
        this.context.moveTo(node.p.x + this.node_width, node.p.y + this.node_height / 2);
        this.context.lineTo(node.p.x + this.node_width + this.node_padding_h / 2, node.p.y + this.node_height / 2);
        this.context.stroke();
        this.context.fillRect(node.p.x + this.node_width + this.node_padding_h / 2, node.p.y + this.node_height / 2 - 8, 4, 16);
    };
    return Nodemap;
}());
var Preview = /** @class */ (function () {
    function Preview() {
        var _this = this;
        // container
        this.container = document.createElement('div');
        this.container.classList.add('modal_container');
        // close btn
        var close_btn = document.createElement('div');
        close_btn.classList.add('preview', 'close_btn');
        close_btn.onclick = function () { return _this.close(); };
        // preview
        var preview = document.createElement('iframe');
        preview.classList.add('preview');
        this.container.appendChild(preview);
        preview.src = 'sd/app.html';
        preview.onload = function () {
            var app_window = preview.contentWindow;
            app_window.init(App.deck);
            _this.container.appendChild(close_btn);
        };
        // add to body
        document.body.appendChild(this.container);
    }
    Preview.prototype.close = function () {
        this.container.remove();
    };
    return Preview;
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
        // content links
        content.appendChild(Util.make_label('Content Links'));
        var content_links = document.createElement('textarea');
        content_links.classList.add('content_link_area');
        content_links.value = App.deck.content_links ? JSON.stringify(App.deck.content_links, null, '\t') : '[]';
        content_links.onkeydown = function (e) { return Util.parse_code_input(content_links, e); };
        content.appendChild(content_links);
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
            try {
                JSON.parse(content_links.value);
            }
            catch (e) {
                alert(e);
                return false;
            }
            var content_link_data = JSON.parse(content_links.value);
            for (var _i = 0, content_link_data_1 = content_link_data; _i < content_link_data_1.length; _i++) {
                var link = content_link_data_1[_i];
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
            var content_link_data = JSON.parse(content_links.value);
            App.deck.content_links = (content_link_data && content_link_data.length > 0) ? content_link_data : null;
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
        this.preview = document.getElementById('preview_btn');
        this.preview.onclick = function () { return new Preview(); };
        this.nodes = document.getElementById('node_btn');
        this.nodes.onclick = function () { return new Nodemap(App.current_card.title); };
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
    Util.parse_code_input = function (c, e) {
        var keycode = e.keyCode || e.which;
        // prevent tab out
        if (keycode == 9) {
            e.preventDefault();
            var start = c.selectionStart;
            var end = c.selectionEnd;
            c.value = c.value.substring(0, start) + '\t' + c.value.substring(end);
            c.selectionStart = c.selectionEnd = start + 1;
        }
        // insert tabs on enter
        if (keycode == 13) {
            e.preventDefault();
            var start = c.selectionStart;
            var end = c.selectionEnd;
            var before = c.value.substring(0, start);
            var after = c.value.substring(end);
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
            c.value = before + input + after;
            c.selectionStart = c.selectionEnd = start + 1 + spacing;
        }
        // Add closing brackets
        if (keycode == 219) {
            e.preventDefault();
            var start = c.selectionStart;
            var end = c.selectionEnd;
            var before = c.value.substring(0, start);
            var after = c.value.substring(end);
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
            c.value = before + input + after;
            c.selectionStart = c.selectionEnd = start + 1;
        }
        // Ignore brackets if bracket-adjacent
        if (keycode == 221) {
            var start = c.selectionStart;
            var end = c.selectionEnd;
            var after = c.value.substring(end);
            if (after.charAt(0) == (e.shiftKey ? '}' : ']')) {
                e.preventDefault();
                c.selectionStart = c.selectionEnd = start + 1;
            }
        }
        // quotes
        var cont = false;
        // Ignore quotes if quote-adjacent
        if (keycode == 222) {
            var start = c.selectionStart;
            var end = c.selectionEnd;
            var after = c.value.substring(end);
            if (after.charAt(0) == (e.shiftKey ? '"' : "'")) {
                e.preventDefault();
                c.selectionStart = c.selectionEnd = start + 1;
                cont = true;
            }
        }
        // Add closing quotes
        if (keycode == 222 && !cont) {
            e.preventDefault();
            var start = c.selectionStart;
            var end = c.selectionEnd;
            var before = c.value.substring(0, start);
            var after = c.value.substring(end);
            var quotes = 1;
            for (var _f = 0, _g = before.split(''); _f < _g.length; _f++) {
                var char = _g[_f];
                if (['"', "'"].indexOf(char) >= 0)
                    quotes++;
            }
            var input = e.shiftKey ? '"' : "'";
            if (quotes % 2 == 1)
                input += e.shiftKey ? '"' : "'";
            c.value = before + input + after;
            c.selectionStart = c.selectionEnd = start + 1;
        }
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
        this.new_element = document.getElementById('new_element');
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
        this.new_element.onclick = function () { return new ElementModal(); };
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
            if (this.current_card_tab)
                this.current_card_tab.refresh();
        }
        catch (e) {
            this.error_info.innerText = e;
        }
    };
    WorkArea.prototype.update_pos_info = function () {
        var _this = this;
        this.pos_info.innerText = 'Cursor position: ' + this.contents.selectionStart;
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
