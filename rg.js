riot.tag('rg-alert', '<div each="{ opts.alerts }" class="alert { type }"> <a class="close" aria-label="Close" onclick="{ parent.remove }"> <span aria-hidden="true">&times;</span> </a> <div class="body"> { msg } </div> </div>', 'rg-alert { font-size: 0.9em; position: relative; top: 0; right: 0; left: 0; width: 100%; } rg-alert .alert { position: relative; margin-bottom: 15px; } rg-alert .body { padding: 15px 35px 15px 15px; } rg-alert .close { position: absolute; top: 50%; right: 20px; line-height: 12px; margin-top: -6px; font-size: 18px; border: 0; background-color: transparent; color: rgba(0, 0, 0, 0.5); cursor: pointer; outline: none; } rg-alert .danger { color: #8f1d2e; background-color: #ffced8; } rg-alert .information { color: #31708f; background-color: #d9edf7; } rg-alert .success { color: #2d8f40; background-color: #ccf7d4; } rg-alert .warning { color: #c06329; background-color: #f7dfd0; }', function (opts) {
		var _this = this;
		_this.remove = function (e) {
			var index = opts.alerts.indexOf(e.item);
			opts.alerts.splice(index, 1);
			if (e.item.onclose) {
				e.item.onclose(e);
			}
		};
	
});
riot.tag('rg-autocomplete', '<div class="container { open: opened }" riot-style="width: { width }"> <input type="{ opts.type || \'text\' }" name="textbox" placeholder="{ opts.placeholder }" onkeydown="{ handleKeys }" oninput="{ filterItems }" onfocus="{ filterItems }"> <div class="dropdown { open: opened }" show="{ opened }"> <div class="list"> <ul> <li each="{ filteredItems }" onclick="{ parent.select }" class="item { active: active }"> { text } </li> </ul> </div> </div> </div>', 'rg-autocomplete .container, [riot-tag="rg-autocomplete"] .container{ position: relative; display: inline-block; cursor: pointer; } rg-autocomplete .container.open, [riot-tag="rg-autocomplete"] .container.open{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-autocomplete input, [riot-tag="rg-autocomplete"] input{ font-size: 1em; padding: 10px; border: 1px solid #D3D3D3; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; outline: none; } rg-autocomplete .container.open input, [riot-tag="rg-autocomplete"] .container.open input{ } rg-autocomplete .dropdown, [riot-tag="rg-autocomplete"] .dropdown{ position: relative; background-color: white; border: 1px solid #D3D3D3; border-top: 0; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; overflow-y: auto; overflow-x: hidden; } rg-autocomplete .dropdown.open, [riot-tag="rg-autocomplete"] .dropdown.open{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-autocomplete ul, [riot-tag="rg-autocomplete"] ul,rg-autocomplete li, [riot-tag="rg-autocomplete"] li{ list-style: none; padding: 0; margin: 0; } rg-autocomplete li, [riot-tag="rg-autocomplete"] li{ padding: 10px; border-top: 1px solid #E8E8E8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rg-autocomplete li:first-child, [riot-tag="rg-autocomplete"] li:first-child{ border-top: 0; } rg-autocomplete li:hover, [riot-tag="rg-autocomplete"] li:hover{ background-color: #f3f3f3; } rg-autocomplete li.active, [riot-tag="rg-autocomplete"] li.active,rg-autocomplete li:hover.active, [riot-tag="rg-autocomplete"] li:hover.active{ background-color: #ededed; }', function(opts) {
		var _this = this;
		_this.opened = true;
		_this.textbox.value = opts.value || '';

		_this.filterItems = function () {
			_this.filteredItems = opts.items.filter(function (item) {
				item.active = false;
				if (_this.textbox.value.length == 0 ||
					item.text.toString().toLowerCase().indexOf(_this.textbox.value.toString().toLowerCase()) > -1) {
					return true;
				}
			});
			if (_this.filteredItems.length > 0) {
				_this.opened = true;
			}
			if (opts.onfilter) {
				opts.onfilter();
			}
			_this.update();
		};

		_this.handleKeys = function (e) {
			var length = _this.filteredItems.length;
			if (length > 0 && [13, 38, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();

				var activeIndex = null;
				for (var i = 0; i < length; i++) {
					var item = _this.filteredItems[i];
					if (item.active) {
						activeIndex = i;
						break;
					}
				}

				if (activeIndex != null) {
					_this.filteredItems[activeIndex].active = false;
				}

				if (e.keyCode == 38) {

					if (activeIndex == null || activeIndex == 0) {
						_this.filteredItems[length - 1].active = true;
					} else {
						_this.filteredItems[activeIndex - 1].active = true;
					}
				} else if (e.keyCode == 40) {

					if (activeIndex == null || activeIndex == length - 1) {
						_this.filteredItems[0].active = true;
					} else {
						_this.filteredItems[activeIndex + 1].active = true;
					}
				} else if (e.keyCode == 13 && activeIndex != null) {
					_this.select({ item: _this.filteredItems[activeIndex] });
				}
			}
			return true;
		};

		_this.select = function (item) {
			item = item.item;
			if (opts.onselect) {
				opts.onselect(item);
			}
			_this.textbox.value = item.text;
			_this.opened = false;
		};

		_this.closeDropdown = function (e) {
			if (!_this.root.contains(e.target)) {
				if (opts.onclose && _this.opened) {
					opts.onclose();
				}
				_this.opened = false;
				_this.update();
			}
		};

		_this.on('mount', function () {
			document.addEventListener('click', _this.closeDropdown);
			document.addEventListener('focus', _this.closeDropdown, true);
			_this.width = _this.textbox.getBoundingClientRect().width + 'px';
			var dd = _this.root.querySelector('.dropdown');
			dd.style.width = _this.width;
			dd.style.position = 'absolute';
			_this.opened = opts.opened;
			_this.update();
		});

		_this.on('unmount', function () {
			document.removeEventListener('click', _this.closeDropdown);
			document.removeEventListener('focus', _this.closeDropdown, true);
		});
	
});
riot.tag('rg-bubble', '<div class="context"> <div class="bubble { visible: visible }"> { text } </div> <div class="content" onmouseover="{ showBubble }" onmouseout="{ hideBubble }" onclick="{ toggleBubble }"> <yield></yield> </div> </div>', 'rg-bubble .context, [riot-tag="rg-bubble"] .context,rg-bubble .content, [riot-tag="rg-bubble"] .content{ display: inline-block; position: relative; } rg-bubble .bubble, [riot-tag="rg-bubble"] .bubble{ position: absolute; display: block; top: -27px; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); padding: 5px 10px; background-color: rgba(0, 0, 0, 0.8); color: white; text-align: center; font-size: 12px; line-height: 1; white-space: nowrap; opacity: 0; transition: opacity 0.1s, top 0.1s; } rg-bubble .visible, [riot-tag="rg-bubble"] .visible{ top: -30px; opacity: 1; } rg-bubble .bubble:after, [riot-tag="rg-bubble"] .bubble:after{ content: \'\'; position: absolute; display: block; bottom: -10px; left: 50%; -webkit-transform: translate3d(-50%, 0, 0); transform: translate3d(-50%, 0, 0); width: 0; height: 0; border: 5px solid rgba(0, 0, 0, 0); border-top-color: rgba(0, 0, 0, 0.9); }', function (opts) {

	var _this = this;
	_this.text = opts.text;
		_this.visible = false;
	_this.showBubble = function () {
		clearTimeout(_this.timer);
		_this.visible = true;
	};
	_this.hideBubble = function () {
		_this.timer = setTimeout(function () {
			_this.visible = false;
			_this.update();
		}, 1000);
	};
	_this.toggleBubble = function () {
		_this.visible = !_this.visible;
	};


});
riot.tag('rg-ga', '', function(opts) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

		ga('create', opts.property, 'auto');
		ga('send', 'pageview');

	
});riot.tag('rg-include', '{{ responseText }}', function(opts) {
		var _this = this;

		var oReq = new XMLHttpRequest();
		oReq.onload = function () {
			if (opts.unsafe) {
				_this.root.innerHTML = oReq.responseText;
			} else {
				_this.responseText = oReq.responseText;
			}
			_this.update();
		};
		oReq.open("get", opts.src, opts.async || true);
		oReq.send();
	
});riot.tag('rg-loading', '<div class="overlay"></div> <div class="loading"> <div> <yield></yield> </div> <div if="{ opts.spinner == \'true\' }"> <svg width="80px" height="80px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default"> <rect x="0" y="0" width="80" height="80" fill="none" class="bk"></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(0 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(45 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.0625s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(90 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.125s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(135 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.1875s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(180 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.25s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(225 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.3125s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(270 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.375s" repeatCount="indefinite"></animate></rect> <rect x="48.5" y="47" width="3" height="6" rx="0" ry="0" fill="#ffffff" transform="rotate(315 50 50) translate(0 -10)"><animate attributeName="opacity" from="1" to="0" dur="0.5s" begin="0.4375s" repeatCount="indefinite"></animate></rect> </svg> </div> </div>', 'rg-loading .overlay, [riot-tag="rg-loading"] .overlay{ position: absolute; width: 100%; height: 100%; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0, 0, 0, 0.8); z-index: 200; } rg-loading .loading, [riot-tag="rg-loading"] .loading{ position: absolute; width: 95%; max-width: 420px; top: 50%; left: 50%; -webkit-transform: translate3d(-50%, -50%, 0); -moz-transform: translate3d(-50%, -50%, 0); -ms-transform: translate3d(-50%, -50%, 0); -o-transform: translate3d(-50%, -50%, 0); transform: translate3d(-50%, -50%, 0); background-color: transparent; color: #fff; text-align: center; z-index: 201; }', function(opts) {


});
var RgMap = riot.observable();

RgMap.initialize = function () {
	RgMap.trigger('initializeRgMap');
};riot.tag('rg-map', '<div class="rg-map"></div>', 'rg-map .rg-map, [riot-tag="rg-map"] .rg-map{ margin: 0; padding: 0; width: 100%; height: 100%; } rg-map .rg-map img, [riot-tag="rg-map"] .rg-map img{ max-width: inherit; }', function(opts) {
		var _this = this;

		var defaultOptions = {
			center: { lat: 53.806, lng: -1.535 },
			zoom: 5
		};
		var mapOptions = opts.map || defaultOptions;

		RgMap.on('initializeRgMap', function () {
			var map = new google.maps.Map(_this.root.querySelector('.rg-map'), mapOptions);
		});

		function loadScript() {
			if (!document.getElementById('gmap_script')) {
				var script = document.createElement('script');
				script.setAttribute('id', 'gmap_script');
				script.type = 'text/javascript';
				script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&callback=RgMap.initialize';
				document.body.appendChild(script);
			}
		}

		loadScript();
	
});
riot.tag('rg-markdown', '<div class="markdown"></div>', function(opts) {
		var _this = this;
		var reader = new commonmark.Parser();
		var writer = new commonmark.HtmlRenderer();

		if (opts.src) {
			var oReq = new XMLHttpRequest();
			oReq.onload = function () {
				markItDown(oReq.responseText);
				_this.update();
			};
			oReq.open('get', opts.src, opts.async || true);
			oReq.send();
		} else {
			markItDown(opts.content);
		}

		function markItDown(content) {
			var parsed = reader.parse(content);
			_this.root.innerHTML = writer.render(parsed);
		}
	
});
riot.tag('rg-modal', '<div class="overlay" if="{ opts.modal.visible }" onclick="{ close }"></div> <div class="modal" if="{ opts.modal.visible }"> <header class="header"> <button type="button" class="close" aria-label="Close" onclick="{ close }"> <span aria-hidden="true">&times;</span> </button> <h3 class="heading">{ opts.modal.heading }</h3> </header> <div class="body"> <yield></yield> </div> <footer class="footer"> <button class="button" each="{ opts.modal.buttons }" type="button" onclick="{ action }" riot-style="{ style }"> { text } </button> </footer> </div>', 'rg-modal .overlay, [riot-tag="rg-modal"] .overlay{ position: fixed; width: 100%; height: 100%; top: 0; right: 0; bottom: 0; left: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 100; } rg-modal .modal, [riot-tag="rg-modal"] .modal{ position: fixed; width: 95%; max-width: 420px; top: 50%; left: 50%; -webkit-transform: translate3d(-50%, -75%, 0); -moz-transform: translate3d(-50%, -75%, 0); -ms-transform: translate3d(-50%, -75%, 0); -o-transform: translate3d(-50%, -75%, 0); transform: translate3d(-50%, -75%, 0); background-color: white; color: #252519; z-index: 101; } rg-modal .header, [riot-tag="rg-modal"] .header{ position: relative; text-align: center; } rg-modal .heading, [riot-tag="rg-modal"] .heading{ padding: 20px 20px 0 20px; margin: 0; font-size: 18px; } rg-modal .close, [riot-tag="rg-modal"] .close{ position: absolute; top: 5px; right: 5px; padding: 0; height: 20px; width: 20px; line-height: 20px; font-size: 20px; border: 0; background-color: transparent; color: #ef424d; cursor: pointer; outline: none; } rg-modal .body, [riot-tag="rg-modal"] .body{ padding: 20px; } rg-modal .footer, [riot-tag="rg-modal"] .footer{ padding: 0 20px 20px 20px; } rg-modal .footer .button, [riot-tag="rg-modal"] .footer .button{ padding: 10px; margin: 0 5px 0 0; border: none; text-transform: uppercase; cursor: pointer; outline: none; background-color: white; }', function (opts) {
	var _this = this;
	_this.close = function (e) {
		opts.modal.visible = false;
		if (opts.modal.onclose) {
			opts.modal.onclose(e);
		}
	};
	
});
riot.tag('rg-select', '<div class="container { open: opened }" riot-style="width: { width }"> <input type="text" class="field { open: opened}" onkeydown="{ handleKeys }" onclick="{ toggle }" value="{ fieldText || opts.placeholder }" readonly> <div class="dropdown" show="{ opened }"> <div class="filter"> <input type="text" name="filter" class="filter-box" placeholder="{ opts[\'filter-placeholder\'] || \'Filter\' }" onkeydown="{ handleKeys }" oninput="{ filterItems }"> </div> <div class="list"> <ul> <li each="{ filteredItems }" onclick="{ parent.select }" class="item { selected: selected, disabled: disabled, active: active }"> { text } </li> </ul> </div> </div> </div>', 'rg-select .container, [riot-tag="rg-select"] .container{ position: relative; display: inline-block; cursor: pointer; } rg-select .container.open, [riot-tag="rg-select"] .container.open{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-select .field, [riot-tag="rg-select"] .field{ width: 100%; padding: 10px; background-color: white; border: 1px solid #D3D3D3; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 1em; line-height: normal; outline: 0; } rg-select .down-arrow, [riot-tag="rg-select"] .down-arrow{ float: right; } rg-select .dropdown, [riot-tag="rg-select"] .dropdown{ position: relative; width: 100%; background-color: white; border: 1px solid #D3D3D3; border-top: 0; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; } rg-select .container.open .dropdown, [riot-tag="rg-select"] .container.open .dropdown{ -webkit-box-shadow: 0 2px 10px -4px #444; -moz-box-shadow: 0 2px 10px -4px #444; box-shadow: 0 2px 10px -4px #444; } rg-select .filter-box, [riot-tag="rg-select"] .filter-box{ -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box; width: 100%; padding: 10px; font-size: 0.9rem; border: 0; outline: none; color: #555; } rg-select ul, [riot-tag="rg-select"] ul,rg-select li, [riot-tag="rg-select"] li{ list-style: none; padding: 0; margin: 0; } rg-select li, [riot-tag="rg-select"] li{ padding: 10px; border-top: 1px solid #E8E8E8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } rg-select .selected, [riot-tag="rg-select"] .selected{ font-weight: bold; background-color: #f8f8f8; } rg-select li:hover, [riot-tag="rg-select"] li:hover{ background-color: #f3f3f3; } rg-select li.active, [riot-tag="rg-select"] li.active,rg-select li:hover.active, [riot-tag="rg-select"] li:hover.active{ background-color: #ededed; }', function(opts) {
		var _this = this;
		_this.opened = true;

		function handleClickOutside(e) {
			if (!_this.root.contains(e.target)) {
				if (opts.onclose && _this.opened) {
					opts.onclose();
				}
				_this.opened = false;
				_this.update();
			}
		}

		_this.handleKeys = function (e) {
			if (e.keyCode == 13 && !_this.opened) {
				_this.toggle();
				return true;
			}
			var length = _this.filteredItems.length;
			if (length > 0 && [13, 38, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault();

				var activeIndex = null;
				for (var i = 0; i < length; i++) {
					var item = _this.filteredItems[i];
					if (item.active) {
						activeIndex = i;
						break;
					}
				}

				if (activeIndex != null) {
					_this.filteredItems[activeIndex].active = false;
				}

				if (e.keyCode == 38) {

					if (activeIndex == null || activeIndex == 0) {
						_this.filteredItems[length - 1].active = true;
					} else {
						_this.filteredItems[activeIndex - 1].active = true;
					}
				} else if (e.keyCode == 40) {

					if (activeIndex == null || activeIndex == length - 1) {
						_this.filteredItems[0].active = true;
					} else {
						_this.filteredItems[activeIndex + 1].active = true;
					}
				} else if (e.keyCode == 13 && activeIndex != null) {
					_this.select({ item: _this.filteredItems[activeIndex] });
				}
			}
			return true;
		};

		_this.toggle = function () {
			_this.opened = !_this.opened;
			if (opts.onopen && _this.opened) {
				opts.onopen();
			} else if (opts.onclose && !_this.opened) {
				opts.onclose();
			}
		};

		_this.filterItems = function () {
			_this.filteredItems = opts.options.filter(function (item) {
				item.active = false;
				var filterField = item[opts['filter-on'] || 'text'];
				if (_this.filter.value.length == 0 ||
					filterField.toString().toLowerCase().indexOf(_this.filter.value.toString().toLowerCase()) > -1) {
					return true;
				}
			});
			if (opts.onfilter) {
				opts.onfilter();
			}
			_this.update();
		};

		_this.select = function (item) {
			item = item.item;
			opts.options.forEach(function (item) {
				item.selected = false;
			});
			item.selected = true;
			if (opts.onselect) {
				opts.onselect(item);
			}
			_this.fieldText = item.text;
			_this.opened = false;
		};

		_this.on('mount', function () {

			_this.filterItems();

			opts.options.forEach(function (option, i) {
				option.index = i;
				if (option.selected) {
					_this.select({ item: option });
				}
			});

			document.addEventListener('click', handleClickOutside);
			var dd = _this.root.querySelector('.dropdown');
			_this.width = dd.getBoundingClientRect().width + 20 + 'px';
			dd.style.position = 'absolute';

			_this.opened = opts.opened;

			_this.update();
		});

		_this.on('unmount', function () {
			document.removeEventListener('click', handleClickOutside);
		});

	
});
riot.tag('rg-sidemenu', '<div class="overlay { expanded: opts.sidemenu.expanded }" onclick="{ close }"></div> <div class="sidemenu { expanded: opts.sidemenu.expanded }"> <h4 class="header">{ opts.sidemenu.header }</h4> <ul class="items"> <li class="item { active: active }" each="{ opts.sidemenu.items }" onclick="{ selected }"> { text } </li> </ul> <div class="body"> <yield></yield> </div> </div>', 'rg-sidemenu .overlay, [riot-tag="rg-sidemenu"] .overlay{ position: fixed; top: 0; left: -100%; right: 0; bottom: 0; width: 100%; height: 100%; background-color: transparent; cursor: pointer; -webkit-transition: background-color 0.8s ease; -moz-transition: background-color 0.8s ease; -ms-transition: background-color 0.8s ease; -o-transition: background-color 0.8s ease; transition: background-color 0.8s ease; z-index: 50; } rg-sidemenu .overlay.expanded, [riot-tag="rg-sidemenu"] .overlay.expanded{ left: 0; background-color: rgba(0, 0, 0, 0.5); } rg-sidemenu .sidemenu, [riot-tag="rg-sidemenu"] .sidemenu{ position: fixed; top: 0; left: 0; height: 100%; width: 260px; overflow-y: auto; overflow-x: hidden; -webkit-overflow-scrolling: touch; background-color: black; color: white; -webkit-transform: translate3d(-100%, 0, 0); -moz-transform: translate3d(-100%, 0, 0); -ms-transform: translate3d(-100%, 0, 0); -o-transform: translate3d(-100%, 0, 0); transform: translate3d(-100%, 0, 0); -webkit-transition: -webkit-transform 0.5s ease; -moz-transition: -moz-transform 0.5s ease; -ms-transition: -ms-transform 0.5s ease; -o-transition: -o-transform 0.5s ease; transition: transform 0.5s ease; z-index: 51; } rg-sidemenu .sidemenu.expanded, [riot-tag="rg-sidemenu"] .sidemenu.expanded{ -webkit-transform: translate3d(0, 0, 0); -moz-transform: translate3d(0, 0, 0); -ms-transform: translate3d(0, 0, 0); -o-transform: translate3d(0, 0, 0); transform: translate3d(0, 0, 0); } rg-sidemenu .header, [riot-tag="rg-sidemenu"] .header{ padding: 1.2rem; margin: 0; text-align: center; color: white; } rg-sidemenu .items, [riot-tag="rg-sidemenu"] .items{ padding: 0; margin: 0; list-style: none; } rg-sidemenu .item, [riot-tag="rg-sidemenu"] .item{ padding: 1rem 0.5rem; box-sizing: border-box; border-top: 1px solid #1a1a1a; color: white; } rg-sidemenu .item:last-child, [riot-tag="rg-sidemenu"] .item:last-child{ border-bottom: 1px solid #1a1a1a; } rg-sidemenu .item:hover, [riot-tag="rg-sidemenu"] .item:hover{ cursor: pointer; background-color: #2a2a2a; } rg-sidemenu .item.active, [riot-tag="rg-sidemenu"] .item.active{ cursor: pointer; background-color: #444; }', function(opts) {
		var _this = this;
		_this.close = function () {
			opts.sidemenu.expanded = false;
		};

		_this.selected = function (item) {
			item = item.item;
			clearActiveStates();
			item.active = true;
			if (item.action) {
				item.action();
			}
		};

		function clearActiveStates() {
			opts.sidemenu.items.forEach(function (item) {
				item.active = false;
			});
		}
	
});
riot.tag('rg-tab', '<div show="{ active }" class="tab"> <yield></yield> </div>', '.tab { padding: 10px; }', function (opts) {
	var _this = this;
	_this.active = opts.active;
	_this.disabled = opts.disabled;
	
});

riot.tag('rg-tabs', '<div class="tabs"> <div class="headers"> <div each="{ tabs }" class="header { active: active, disabled: disabled }" onclick="{ parent.activate }"> <h4 class="heading">{ opts.heading }</h4> </div> </div> <yield></yield> </div>', 'rg-tabs .tabs, [riot-tag="rg-tabs"] .tabs{ background-color: white; } rg-tabs .headers, [riot-tag="rg-tabs"] .headers{ display: -webkit-flex; display: -ms-flexbox; display: flex; } rg-tabs .header, [riot-tag="rg-tabs"] .header{ -webkit-flex: 1; -ms-flex: 1; flex: 1; box-sizing: border-box; text-align: center; cursor: pointer; box-shadow: 0 -1px 0 0 #404040 inset; } rg-tabs .heading, [riot-tag="rg-tabs"] .heading{ padding: 10px; margin: 0; } rg-tabs .header.active, [riot-tag="rg-tabs"] .header.active{ background-color: #404040; } rg-tabs .header.active .heading, [riot-tag="rg-tabs"] .header.active .heading{ color: white; } rg-tabs .header.disabled .heading, [riot-tag="rg-tabs"] .header.disabled .heading{ color: #888; }', function (opts) {
	var _this = this;
	_this.onopen = opts.onopen;
	_this.tabs = _this.tags['rg-tab'];

	_this.tabs.forEach(function (tab, i) {
		tab.index = i;
		});

	_this.on('mount', function () {
		var activeTab = false;
		_this.tabs.forEach(function (tab) {
			if (activeTab) {
				tab.active = false;
			}
			if (tab.active) {
				activeTab = true;
			}
		});
		});

	_this.activate = function (tab) {
		tab = tab.item;
		if (!tab.disabled) {
			deselectTabs();
			if (_this.onopen) {
				_this.onopen(tab);
			}
			tab.active = true;
			}
	};

	function deselectTabs() {
		_this.tabs.forEach(function (tab) {
			tab.active = false;
		});
	}
	
});
riot.tag('rg-toast', '<div class="toasts { opts.position }" if="{ opts.toasts.length > 0 }"> <div class="toast" each="{ opts.toasts }" onclick="{ parent.toastClicked }"> { text } </div> </div>', 'rg-toast .toasts, [riot-tag="rg-toast"] .toasts{ position: fixed; width: 250px; max-height: 100%; overflow-y: auto; background-color: transparent; z-index: 101; } rg-toast .toasts.topleft, [riot-tag="rg-toast"] .toasts.topleft{ top: 0; left: 0; } rg-toast .toasts.topright, [riot-tag="rg-toast"] .toasts.topright{ top: 0; right: 0; } rg-toast .toasts.bottomleft, [riot-tag="rg-toast"] .toasts.bottomleft{ bottom: 0; left: 0; } rg-toast .toasts.bottomright, [riot-tag="rg-toast"] .toasts.bottomright{ bottom: 0; right: 0; } rg-toast .toast, [riot-tag="rg-toast"] .toast{ padding: 20px; margin: 20px; background-color: rgba(0, 0, 0, 0.8); color: white; font-size: 13px; cursor: pointer; }', function(opts) {

		var _this = this;

		_this.on('update', function () {
			opts.toasts.forEach(function (toast, i) {
				if (!toast.startTimer) {
					toast.startTimer = function () {
						window.setTimeout(function () {
							opts.toasts.splice(opts.toasts.indexOf(toast), 1);
							_this.update();
						}, 6000);
					};
					toast.startTimer();
				}
			});
		});

		if (!opts.position) {
			opts.position = 'topright';
		}

		_this.toastClicked = function (e) {
			if (e.item.onclick) {
				e.item.onclick(e);
			}
			opts.toasts.splice(opts.toasts.indexOf(e.item), 1);
		};

	
});
riot.tag('rg-toggle', '<div class="wrapper"> <label class="toggle"> <input type="checkbox" __checked="{ opts.toggle.checked }" onclick="{ toggle }"> <div class="track"> <div class="handle"></div> </div> </label> </div>', 'rg-toggle .wrapper, [riot-tag="rg-toggle"] .wrapper{ width: 60px; height: 20px; margin: 0 auto; display: block; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } rg-toggle .toggle, [riot-tag="rg-toggle"] .toggle{ position: absolute; cursor: pointer; } rg-toggle input[type=checkbox], [riot-tag="rg-toggle"] input[type=checkbox]{ display: none; } rg-toggle .track, [riot-tag="rg-toggle"] .track{ position: absolute; top: 0; bottom: 0; left: 0; right: 0; width: 60px; height: 20px; padding: 2px; background-color: #b6c0c7; -webkit-transition: background-color 0.1s linear; transition: background-color 0.1s linear; box-sizing: border-box; } rg-toggle input[type=checkbox]:checked + .track, [riot-tag="rg-toggle"] input[type=checkbox]:checked + .track{ background-color: #2db2c8; } rg-toggle .handle, [riot-tag="rg-toggle"] .handle{ position: relative; left: 0; width: 50%; height: 100%; background-color: white; -webkit-transition: transform 0.1s linear; transition: transform 0.1s linear; } rg-toggle input[type=checkbox]:checked + .track .handle, [riot-tag="rg-toggle"] input[type=checkbox]:checked + .track .handle{ -webkit-transform: translate3d(100%, 0, 0); transform: translate3d(100%, 0, 0); }', function(opts) {

		var _this = this;
		opts.toggle = opts.toggle ? opts.toggle : {};

		_this.toggle = function (e) {
			opts.toggle.checked = !opts.toggle.checked;
			if (opts.toggle.ontoggle) {
				opts.toggle.ontoggle(e);
			}
		};

	
});
