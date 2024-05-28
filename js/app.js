jQuery(function() {
	initAccordion();
	initTabs();
	initOpenClose();
	initMobileNav();
	initAnchors();
	initPopups();
	initCustomForms();
});

var swiper = new Swiper(".thumb-slider", {
	spaceBetween: 16,
	loop: true,
	slidesPerView: 4,
	freeMode: false,
	watchSlidesProgress: true,
	breakpoints: {
		320: {
			slidesPerView: 5,
		},
		768: {
			slidesPerView: 4,
			direction: "vertical",
		}
	}
});

var swiper2 = new Swiper(".main-slider", {
	loop: true,
	effect: "fade",
	thumbs: {
		swiper: swiper,
	},
});

// initialize custom form elements
function initCustomForms() {
	jcf.setOptions('Select', {
		wrapNative: false,
		wrapNativeOnMobile: false
	});

	jcf.replaceAll();
}

// popups init
function initPopups() {
	jQuery('.comments-holder').contentPopup({
		popup: '.textarea-popup',
		btnOpen: '.open-textarea',
		openClass: 'popup-active',
		mode: 'click'
	});
}

// initialize smooth anchor links
function initAnchors() {
	new SmoothScroll({
		anchorLinks: 'a.scroll-bottom',
		extraOffset: 25,
		wheelBehavior: 'none'
	});
}

// mobile menu init
function initMobileNav() {
	jQuery('body').mobileNav({
		menuActiveClass: 'nav-active',
		menuOpener: '.nav-opener',
		menuDrop: '.navigation',
		hideOnClickOutside: true
	});

	jQuery('body').mobileNav({
		menuActiveClass: 'sidebar-active',
		menuOpener: '.btn-buy, .sidebar-order .close',
		menuDrop: '.sidebar-order',
		hideOnClickOutside: true
	});
}

// accordion menu init
function initAccordion() {
	jQuery('.accordion').slideAccordion({
		opener: '.opener',
		slider: '.slide',
		animSpeed: 300
	});
}

// content tabs init
function initTabs() {
	jQuery('.tabset').tabset({
		tabLinks: 'a',
		defaultTab: true
	});
}

// open-close init
function initOpenClose() {
	jQuery('.open-close').openClose({
		activeClass: 'active',
		opener: '.opener',
		slider: '.slide',
		animSpeed: 400,
		effect: 'slide'
	});
}

/*!
 * JavaScript Custom Forms
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function(root, factory) {

	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['modules/archive/jcf/demo/js/jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('modules/archive/jcf/demo/js/jquery'));
	} else {
		root.jcf = factory(jQuery);
	}
}(window, function($) {

	'use strict';

	// define version
	var version = '1.1.3';

	// private variables
	var customInstances = [];

	// default global options
	var commonOptions = {
		optionsKey: 'jcf',
		dataKey: 'jcf-instance',
		rtlClass: 'jcf-rtl',
		focusClass: 'jcf-focus',
		pressedClass: 'jcf-pressed',
		disabledClass: 'jcf-disabled',
		hiddenClass: 'jcf-hidden',
		resetAppearanceClass: 'jcf-reset-appearance',
		unselectableClass: 'jcf-unselectable'
	};

	// detect device type
	var isTouchDevice = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
		isWinPhoneDevice = /Windows Phone/.test(navigator.userAgent);
	commonOptions.isMobileDevice = !!(isTouchDevice || isWinPhoneDevice);

	var isIOS = /(iPad|iPhone).*OS ([0-9_]*) .*/.exec(navigator.userAgent);
	if(isIOS) isIOS = parseFloat(isIOS[2].replace(/_/g, '.'));
	commonOptions.ios = isIOS;

	// create global stylesheet if custom forms are used
	var createStyleSheet = function() {
		var styleTag = $('<style>').appendTo('head'),
			styleSheet = styleTag.prop('sheet') || styleTag.prop('styleSheet');

		// crossbrowser style handling
		var addCSSRule = function(selector, rules, index) {
			if (styleSheet.insertRule) {
				styleSheet.insertRule(selector + '{' + rules + '}', index);
			} else {
				styleSheet.addRule(selector, rules, index);
			}
		};

		// add special rules
		addCSSRule('.' + commonOptions.hiddenClass, 'position:absolute !important;left:-9999px !important;height:1px !important;width:1px !important;margin:0 !important;border-width:0 !important;-webkit-appearance:none;-moz-appearance:none;appearance:none');
		addCSSRule('.' + commonOptions.rtlClass + ' .' + commonOptions.hiddenClass, 'right:-9999px !important; left: auto !important');
		addCSSRule('.' + commonOptions.unselectableClass, '-webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-tap-highlight-color: rgba(0,0,0,0);');
		addCSSRule('.' + commonOptions.resetAppearanceClass, 'background: none; border: none; -webkit-appearance: none; appearance: none; opacity: 0; filter: alpha(opacity=0);');

		// detect rtl pages
		var html = $('html'), body = $('body');
		if (html.css('direction') === 'rtl' || body.css('direction') === 'rtl') {
			html.addClass(commonOptions.rtlClass);
		}

		// handle form reset event
		html.on('reset', function() {
			setTimeout(function() {
				api.refreshAll();
			}, 0);
		});

		// mark stylesheet as created
		commonOptions.styleSheetCreated = true;
	};

	// simplified pointer events handler
	(function() {
		var pointerEventsSupported = navigator.pointerEnabled || navigator.msPointerEnabled,
			touchEventsSupported = ('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch,
			eventList, eventMap = {}, eventPrefix = 'jcf-';

		// detect events to attach
		if (pointerEventsSupported) {
			eventList = {
				pointerover: navigator.pointerEnabled ? 'pointerover' : 'MSPointerOver',
				pointerdown: navigator.pointerEnabled ? 'pointerdown' : 'MSPointerDown',
				pointermove: navigator.pointerEnabled ? 'pointermove' : 'MSPointerMove',
				pointerup: navigator.pointerEnabled ? 'pointerup' : 'MSPointerUp'
			};
		} else {
			eventList = {
				pointerover: 'mouseover',
				pointerdown: 'mousedown' + (touchEventsSupported ? ' touchstart' : ''),
				pointermove: 'mousemove' + (touchEventsSupported ? ' touchmove' : ''),
				pointerup: 'mouseup' + (touchEventsSupported ? ' touchend' : '')
			};
		}

		// create event map
		$.each(eventList, function(targetEventName, fakeEventList) {
			$.each(fakeEventList.split(' '), function(index, fakeEventName) {
				eventMap[fakeEventName] = targetEventName;
			});
		});

		// jQuery event hooks
		$.each(eventList, function(eventName, eventHandlers) {
			eventHandlers = eventHandlers.split(' ');
			$.event.special[eventPrefix + eventName] = {
				setup: function() {
					var self = this;
					$.each(eventHandlers, function(index, fallbackEvent) {
						if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
						else self['on' + fallbackEvent] = fixEvent;
					});
				},
				teardown: function() {
					var self = this;
					$.each(eventHandlers, function(index, fallbackEvent) {
						if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
						else self['on' + fallbackEvent] = null;
					});
				}
			};
		});

		// check that mouse event are not simulated by mobile browsers
		var lastTouch = null;
		var mouseEventSimulated = function(e) {
			var dx = Math.abs(e.pageX - lastTouch.x),
				dy = Math.abs(e.pageY - lastTouch.y),
				rangeDistance = 25;

			if (dx <= rangeDistance && dy <= rangeDistance) {
				return true;
			}
		};

		// normalize event
		var fixEvent = function(e) {
			var origEvent = e || window.event,
				touchEventData = null,
				targetEventName = eventMap[origEvent.type];

			e = $.event.fix(origEvent);
			e.type = eventPrefix + targetEventName;

			if (origEvent.pointerType) {
				switch (origEvent.pointerType) {
					case 2: e.pointerType = 'touch'; break;
					case 3: e.pointerType = 'pen'; break;
					case 4: e.pointerType = 'mouse'; break;
					default: e.pointerType = origEvent.pointerType;
				}
			} else {
				e.pointerType = origEvent.type.substr(0, 5); // "mouse" or "touch" word length
			}

			if (!e.pageX && !e.pageY) {
				touchEventData = origEvent.changedTouches ? origEvent.changedTouches[0] : origEvent;
				e.pageX = touchEventData.pageX;
				e.pageY = touchEventData.pageY;
			}

			if (origEvent.type === 'touchend') {
				lastTouch = { x: e.pageX, y: e.pageY };
			}
			if (e.pointerType === 'mouse' && lastTouch && mouseEventSimulated(e)) {
				return;
			} else {
				return ($.event.dispatch || $.event.handle).call(this, e);
			}
		};
	}());

	// custom mousewheel/trackpad handler
	(function() {
		var wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll').split(' '),
			shimEventName = 'jcf-mousewheel';

		$.event.special[shimEventName] = {
			setup: function() {
				var self = this;
				$.each(wheelEvents, function(index, fallbackEvent) {
					if (self.addEventListener) self.addEventListener(fallbackEvent, fixEvent, false);
					else self['on' + fallbackEvent] = fixEvent;
				});
			},
			teardown: function() {
				var self = this;
				$.each(wheelEvents, function(index, fallbackEvent) {
					if (self.addEventListener) self.removeEventListener(fallbackEvent, fixEvent, false);
					else self['on' + fallbackEvent] = null;
				});
			}
		};

		var fixEvent = function(e) {
			var origEvent = e || window.event;
			e = $.event.fix(origEvent);
			e.type = shimEventName;

			// old wheel events handler
			if ('detail'      in origEvent) { e.deltaY = -origEvent.detail;      }
			if ('wheelDelta'  in origEvent) { e.deltaY = -origEvent.wheelDelta;  }
			if ('wheelDeltaY' in origEvent) { e.deltaY = -origEvent.wheelDeltaY; }
			if ('wheelDeltaX' in origEvent) { e.deltaX = -origEvent.wheelDeltaX; }

			// modern wheel event handler
			if ('deltaY' in origEvent) {
				e.deltaY = origEvent.deltaY;
			}
			if ('deltaX' in origEvent) {
				e.deltaX = origEvent.deltaX;
			}

			// handle deltaMode for mouse wheel
			e.delta = e.deltaY || e.deltaX;
			if (origEvent.deltaMode === 1) {
				var lineHeight = 16;
				e.delta *= lineHeight;
				e.deltaY *= lineHeight;
				e.deltaX *= lineHeight;
			}

			return ($.event.dispatch || $.event.handle).call(this, e);
		};
	}());

	// extra module methods
	var moduleMixin = {
		// provide function for firing native events
		fireNativeEvent: function(elements, eventName) {
			$(elements).each(function() {
				var element = this, eventObject;
				if (element.dispatchEvent) {
					eventObject = document.createEvent('HTMLEvents');
					eventObject.initEvent(eventName, true, true);
					element.dispatchEvent(eventObject);
				} else if (document.createEventObject) {
					eventObject = document.createEventObject();
					eventObject.target = element;
					element.fireEvent('on' + eventName, eventObject);
				}
			});
		},
		// bind event handlers for module instance (functions beggining with "on")
		bindHandlers: function() {
			var self = this;
			$.each(self, function(propName, propValue) {
				if (propName.indexOf('on') === 0 && $.isFunction(propValue)) {
					// dont use $.proxy here because it doesn't create unique handler
					self[propName] = function() {
						return propValue.apply(self, arguments);
					};
				}
			});
		}
	};

	// public API
	var api = {
		version: version,
		modules: {},
		getOptions: function() {
			return $.extend({}, commonOptions);
		},
		setOptions: function(moduleName, moduleOptions) {
			if (arguments.length > 1) {
				// set module options
				if (this.modules[moduleName]) {
					$.extend(this.modules[moduleName].prototype.options, moduleOptions);
				}
			} else {
				// set common options
				$.extend(commonOptions, moduleName);
			}
		},
		addModule: function(proto) {
			// add module to list
			var Module = function(options) {
				// save instance to collection
				if (!options.element.data(commonOptions.dataKey)) {
					options.element.data(commonOptions.dataKey, this);
				}
				customInstances.push(this);

				// save options
				this.options = $.extend({}, commonOptions, this.options, getInlineOptions(options.element), options);

				// bind event handlers to instance
				this.bindHandlers();

				// call constructor
				this.init.apply(this, arguments);
			};

			// parse options from HTML attribute
			var getInlineOptions = function(element) {
				var dataOptions = element.data(commonOptions.optionsKey),
					attrOptions = element.attr(commonOptions.optionsKey);

				if (dataOptions) {
					return dataOptions;
				} else if (attrOptions) {
					try {
						return $.parseJSON(attrOptions);
					} catch (e) {
						// ignore invalid attributes
					}
				}
			};

			// set proto as prototype for new module
			Module.prototype = proto;

			// add mixin methods to module proto
			$.extend(proto, moduleMixin);
			if (proto.plugins) {
				$.each(proto.plugins, function(pluginName, plugin) {
					$.extend(plugin.prototype, moduleMixin);
				});
			}

			// override destroy method
			var originalDestroy = Module.prototype.destroy;
			Module.prototype.destroy = function() {
				this.options.element.removeData(this.options.dataKey);

				for (var i = customInstances.length - 1; i >= 0; i--) {
					if (customInstances[i] === this) {
						customInstances.splice(i, 1);
						break;
					}
				}

				if (originalDestroy) {
					originalDestroy.apply(this, arguments);
				}
			};

			// save module to list
			this.modules[proto.name] = Module;
		},
		getInstance: function(element) {
			return $(element).data(commonOptions.dataKey);
		},
		replace: function(elements, moduleName, customOptions) {
			var self = this,
				instance;

			if (!commonOptions.styleSheetCreated) {
				createStyleSheet();
			}

			$(elements).each(function() {
				var moduleOptions,
					element = $(this);

				instance = element.data(commonOptions.dataKey);
				if (instance) {
					instance.refresh();
				} else {
					if (!moduleName) {
						$.each(self.modules, function(currentModuleName, module) {
							if (module.prototype.matchElement.call(module.prototype, element)) {
								moduleName = currentModuleName;
								return false;
							}
						});
					}
					if (moduleName) {
						moduleOptions = $.extend({ element: element }, customOptions);
						instance = new self.modules[moduleName](moduleOptions);
					}
				}
			});
			return instance;
		},
		refresh: function(elements) {
			$(elements).each(function() {
				var instance = $(this).data(commonOptions.dataKey);
				if (instance) {
					instance.refresh();
				}
			});
		},
		destroy: function(elements) {
			$(elements).each(function() {
				var instance = $(this).data(commonOptions.dataKey);
				if (instance) {
					instance.destroy();
				}
			});
		},
		replaceAll: function(context) {
			var self = this;
			$.each(this.modules, function(moduleName, module) {
				$(module.prototype.selector, context).each(function() {
					if (this.className.indexOf('jcf-ignore') < 0) {
						self.replace(this, moduleName);
					}
				});
			});
		},
		refreshAll: function(context) {
			if (context) {
				$.each(this.modules, function(moduleName, module) {
					$(module.prototype.selector, context).each(function() {
						var instance = $(this).data(commonOptions.dataKey);
						if (instance) {
							instance.refresh();
						}
					});
				});
			} else {
				for (var i = customInstances.length - 1; i >= 0; i--) {
					customInstances[i].refresh();
				}
			}
		},
		destroyAll: function(context) {
			if (context) {
				$.each(this.modules, function(moduleName, module) {
					$(module.prototype.selector, context).each(function(index, element) {
						var instance = $(element).data(commonOptions.dataKey);
						if (instance) {
							instance.destroy();
						}
					});
				});
			} else {
				while (customInstances.length) {
					customInstances[0].destroy();
				}
			}
		}
	};

	// always export API to the global window object
	window.jcf = api;

	return api;
}));
 

 /*!
 * JavaScript Custom Forms : Select Module
 *
 * Copyright 2014-2015 PSD2HTML - http://psd2html.com/jcf
 * Released under the MIT license (LICENSE.txt)
 *
 * Version: 1.1.3
 */
;(function($, window) {

	'use strict';

	jcf.addModule({
		name: 'Select',
		selector: 'select',
		options: {
			element: null,
			multipleCompactStyle: false
		},
		plugins: {
			ListBox: ListBox,
			ComboBox: ComboBox,
			SelectList: SelectList
		},
		matchElement: function(element) {
			return element.is('select');
		},
		init: function() {
			this.element = $(this.options.element);
			this.createInstance();
		},
		isListBox: function() {
			return this.element.is('[size]:not([jcf-size]), [multiple]');
		},
		createInstance: function() {
			if (this.instance) {
				this.instance.destroy();
			}
			if (this.isListBox() && !this.options.multipleCompactStyle) {
				this.instance = new ListBox(this.options);
			} else {
				this.instance = new ComboBox(this.options);
			}
		},
		refresh: function() {
			var typeMismatch = (this.isListBox() && this.instance instanceof ComboBox) ||
								(!this.isListBox() && this.instance instanceof ListBox);

			if (typeMismatch) {
				this.createInstance();
			} else {
				this.instance.refresh();
			}
		},
		destroy: function() {
			this.instance.destroy();
		}
	});

	// combobox module
	function ComboBox(options) {
		this.options = $.extend({
			wrapNative: true,
			wrapNativeOnMobile: true,
			fakeDropInBody: true,
			useCustomScroll: true,
			flipDropToFit: true,
			maxVisibleItems: 10,
			fakeAreaStructure: '<span class="jcf-select"><span class="jcf-select-text"></span><span class="jcf-select-opener"></span></span>',
			fakeDropStructure: '<div class="jcf-select-drop"><div class="jcf-select-drop-content"></div></div>',
			optionClassPrefix: 'jcf-option-',
			selectClassPrefix: 'jcf-select-',
			dropContentSelector: '.jcf-select-drop-content',
			selectTextSelector: '.jcf-select-text',
			dropActiveClass: 'jcf-drop-active',
			flipDropClass: 'jcf-drop-flipped'
		}, options);
		this.init();
	}
	$.extend(ComboBox.prototype, {
		init: function() {
			this.initStructure();
			this.bindHandlers();
			this.attachEvents();
			this.refresh();
		},
		initStructure: function() {
			// prepare structure
			this.win = $(window);
			this.doc = $(document);
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeAreaStructure).insertAfter(this.realElement);
			this.selectTextContainer = this.fakeElement.find(this.options.selectTextSelector);
			this.selectText = $('<span></span>').appendTo(this.selectTextContainer);
			makeUnselectable(this.fakeElement);

			// copy classes from original select
			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));

			// handle compact multiple style
			if (this.realElement.prop('multiple')) {
				this.fakeElement.addClass('jcf-compact-multiple');
			}

			// detect device type and dropdown behavior
			if (this.options.isMobileDevice && this.options.wrapNativeOnMobile && !this.options.wrapNative) {
				this.options.wrapNative = true;
			}

			if (this.options.wrapNative) {
				// wrap native select inside fake block
				this.realElement.prependTo(this.fakeElement).css({
					position: 'absolute',
					height: '100%',
					width: '100%'
				}).addClass(this.options.resetAppearanceClass);
			} else {
				// just hide native select
				this.realElement.addClass(this.options.hiddenClass);
				this.fakeElement.attr('title', this.realElement.attr('title'));
				this.fakeDropTarget = this.options.fakeDropInBody ? $('body') : this.fakeElement;
			}
		},
		attachEvents: function() {
			// delayed refresh handler
			var self = this;
			this.delayedRefresh = function() {
				setTimeout(function() {
					self.refresh();
					if (self.list) {
						self.list.refresh();
						self.list.scrollToActiveOption();
					}
				}, 1);
			};

			// native dropdown event handlers
			if (this.options.wrapNative) {
				this.realElement.on({
					focus: this.onFocus,
					change: this.onChange,
					click: this.onChange,
					keydown: this.onChange
				});
			} else {
				// custom dropdown event handlers
				this.realElement.on({
					focus: this.onFocus,
					change: this.onChange,
					keydown: this.onKeyDown
				});
				this.fakeElement.on({
					'jcf-pointerdown': this.onSelectAreaPress
				});
			}
		},
		onKeyDown: function(e) {
			if (e.which === 13) {
				this.toggleDropdown();
			} else if (this.dropActive) {
				this.delayedRefresh();
			}
		},
		onChange: function() {
			this.refresh();
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
				this.toggleListMode(true);
				this.focusedFlag = true;
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
				this.toggleListMode(false);
				this.focusedFlag = false;
			}
		},
		onResize: function() {
			if (this.dropActive) {
				this.hideDropdown();
			}
		},
		onSelectDropPress: function() {
			this.pressedFlag = true;
		},
		onSelectDropRelease: function(e, pointerEvent) {
			this.pressedFlag = false;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onSelectAreaPress: function(e) {
			// skip click if drop inside fake element or real select is disabled
			var dropClickedInsideFakeElement = !this.options.fakeDropInBody && $(e.target).closest(this.dropdown).length;
			if (dropClickedInsideFakeElement || e.button > 1 || this.realElement.is(':disabled')) {
				return;
			}

			// toggle dropdown visibility
			this.selectOpenedByEvent = e.pointerType;
			this.toggleDropdown();

			// misc handlers
			if (!this.focusedFlag) {
				if (e.pointerType === 'mouse') {
					this.realElement.focus();
				} else {
					this.onFocus(e);
				}
			}
			this.pressedFlag = true;
			this.fakeElement.addClass(this.options.pressedClass);
			this.doc.on('jcf-pointerup', this.onSelectAreaRelease);
		},
		onSelectAreaRelease: function(e) {
			if (this.focusedFlag && e.pointerType === 'mouse') {
				this.realElement.focus();
			}
			this.pressedFlag = false;
			this.fakeElement.removeClass(this.options.pressedClass);
			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
		},
		onOutsideClick: function(e) {
			var target = $(e.target),
				clickedInsideSelect = target.closest(this.fakeElement).length || target.closest(this.dropdown).length;

			if (!clickedInsideSelect) {
				this.hideDropdown();
			}
		},
		onSelect: function() {
			this.refresh();

			if (this.realElement.prop('multiple')) {
				this.repositionDropdown();
			} else {
				this.hideDropdown();
			}

			this.fireNativeEvent(this.realElement, 'change');
		},
		toggleListMode: function(state) {
			if (!this.options.wrapNative) {
				if (state) {
					// temporary change select to list to avoid appearing of native dropdown
					this.realElement.attr({
						size: 4,
						'jcf-size': ''
					});
				} else {
					// restore select from list mode to dropdown select
					if (!this.options.wrapNative) {
						this.realElement.removeAttr('size jcf-size');
					}
				}
			}
		},
		createDropdown: function() {
			// destroy previous dropdown if needed
			if (this.dropdown) {
				this.list.destroy();
				this.dropdown.remove();
			}

			// create new drop container
			this.dropdown = $(this.options.fakeDropStructure).appendTo(this.fakeDropTarget);
			this.dropdown.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
			makeUnselectable(this.dropdown);

			// handle compact multiple style
			if (this.realElement.prop('multiple')) {
				this.dropdown.addClass('jcf-compact-multiple');
			}

			// set initial styles for dropdown in body
			if (this.options.fakeDropInBody) {
				this.dropdown.css({
					position: 'absolute',
					top: -9999
				});
			}

			// create new select list instance
			this.list = new SelectList({
				useHoverClass: true,
				handleResize: false,
				alwaysPreventMouseWheel: true,
				maxVisibleItems: this.options.maxVisibleItems,
				useCustomScroll: this.options.useCustomScroll,
				holder: this.dropdown.find(this.options.dropContentSelector),
				multipleSelectWithoutKey: this.realElement.prop('multiple'),
				element: this.realElement
			});
			$(this.list).on({
				select: this.onSelect,
				press: this.onSelectDropPress,
				release: this.onSelectDropRelease
			});
		},
		repositionDropdown: function() {
			var selectOffset = this.fakeElement.offset(),
				selectWidth = this.fakeElement.outerWidth(),
				selectHeight = this.fakeElement.outerHeight(),
				dropHeight = this.dropdown.css('width', selectWidth).outerHeight(),
				winScrollTop = this.win.scrollTop(),
				winHeight = this.win.height(),
				calcTop, calcLeft, bodyOffset, needFlipDrop = false;

			// check flip drop position
			if (selectOffset.top + selectHeight + dropHeight > winScrollTop + winHeight && selectOffset.top - dropHeight > winScrollTop) {
				needFlipDrop = true;
			}

			if (this.options.fakeDropInBody) {
				bodyOffset = this.fakeDropTarget.css('position') !== 'static' ? this.fakeDropTarget.offset().top : 0;
				if (this.options.flipDropToFit && needFlipDrop) {
					// calculate flipped dropdown position
					calcLeft = selectOffset.left;
					calcTop = selectOffset.top - dropHeight - bodyOffset;
				} else {
					// calculate default drop position
					calcLeft = selectOffset.left;
					calcTop = selectOffset.top + selectHeight - bodyOffset;
				}

				// update drop styles
				this.dropdown.css({
					width: selectWidth,
					left: calcLeft,
					top: calcTop
				});
			}

			// refresh flipped class
			this.dropdown.add(this.fakeElement).toggleClass(this.options.flipDropClass, this.options.flipDropToFit && needFlipDrop);
		},
		showDropdown: function() {
			// do not show empty custom dropdown
			if (!this.realElement.prop('options').length) {
				return;
			}

			// create options list if not created
			if (!this.dropdown) {
				this.createDropdown();
			}

			// show dropdown
			this.dropActive = true;
			this.dropdown.appendTo(this.fakeDropTarget);
			this.fakeElement.addClass(this.options.dropActiveClass);
			this.refreshSelectedText();
			this.repositionDropdown();
			this.list.setScrollTop(this.savedScrollTop);
			this.list.refresh();

			// add temporary event handlers
			this.win.on('resize', this.onResize);
			this.doc.on('jcf-pointerdown', this.onOutsideClick);
		},
		hideDropdown: function() {
			if (this.dropdown) {
				this.savedScrollTop = this.list.getScrollTop();
				this.fakeElement.removeClass(this.options.dropActiveClass + ' ' + this.options.flipDropClass);
				this.dropdown.removeClass(this.options.flipDropClass).detach();
				this.doc.off('jcf-pointerdown', this.onOutsideClick);
				this.win.off('resize', this.onResize);
				this.dropActive = false;
				if (this.selectOpenedByEvent === 'touch') {
					this.onBlur();
				}
			}
		},
		toggleDropdown: function() {
			if (this.dropActive) {
				this.hideDropdown();
			} else {
				this.showDropdown();
			}
		},
		refreshSelectedText: function() {
			// redraw selected area
			var selectedIndex = this.realElement.prop('selectedIndex'),
				selectedOption = this.realElement.prop('options')[selectedIndex],
				selectedOptionImage = selectedOption ? selectedOption.getAttribute('data-image') : null,
				selectedOptionText = '',
				selectedOptionClasses,
				self = this;

			if (this.realElement.prop('multiple')) {
				$.each(this.realElement.prop('options'), function(index, option) {
					if (option.selected) {
						selectedOptionText += (selectedOptionText ? ', ' : '') + option.innerHTML;
					}
				});
				if (!selectedOptionText) {
					selectedOptionText = self.realElement.attr('placeholder') || '';
				}
				this.selectText.removeAttr('class').html(selectedOptionText);
			} else if (!selectedOption) {
				if (this.selectImage) {
					this.selectImage.hide();
				}
				this.selectText.removeAttr('class').empty();
			} else if (this.currentSelectedText !== selectedOption.innerHTML || this.currentSelectedImage !== selectedOptionImage) {
				selectedOptionClasses = getPrefixedClasses(selectedOption.className, this.options.optionClassPrefix);
				this.selectText.attr('class', selectedOptionClasses).html(selectedOption.innerHTML);

				if (selectedOptionImage) {
					if (!this.selectImage) {
						this.selectImage = $('<img>').prependTo(this.selectTextContainer).hide();
					}
					this.selectImage.attr('src', selectedOptionImage).show();
				} else if (this.selectImage) {
					this.selectImage.hide();
				}

				this.currentSelectedText = selectedOption.innerHTML;
				this.currentSelectedImage = selectedOptionImage;
			}
		},
		refresh: function() {
			// refresh fake select visibility
			if (this.realElement.prop('style').display === 'none') {
				this.fakeElement.hide();
			} else {
				this.fakeElement.show();
			}

			// refresh selected text
			this.refreshSelectedText();

			// handle disabled state
			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
		},
		destroy: function() {
			// restore structure
			if (this.options.wrapNative) {
				this.realElement.insertBefore(this.fakeElement).css({
					position: '',
					height: '',
					width: ''
				}).removeClass(this.options.resetAppearanceClass);
			} else {
				this.realElement.removeClass(this.options.hiddenClass);
				if (this.realElement.is('[jcf-size]')) {
					this.realElement.removeAttr('size jcf-size');
				}
			}

			// removing element will also remove its event handlers
			this.fakeElement.remove();

			// remove other event handlers
			this.doc.off('jcf-pointerup', this.onSelectAreaRelease);
			this.realElement.off({
				focus: this.onFocus
			});
		}
	});

	// listbox module
	function ListBox(options) {
		this.options = $.extend({
			wrapNative: true,
			useCustomScroll: true,
			fakeStructure: '<span class="jcf-list-box"><span class="jcf-list-wrapper"></span></span>',
			selectClassPrefix: 'jcf-select-',
			listHolder: '.jcf-list-wrapper'
		}, options);
		this.init();
	}
	$.extend(ListBox.prototype, {
		init: function() {
			this.bindHandlers();
			this.initStructure();
			this.attachEvents();
		},
		initStructure: function() {
			this.realElement = $(this.options.element);
			this.fakeElement = $(this.options.fakeStructure).insertAfter(this.realElement);
			this.listHolder = this.fakeElement.find(this.options.listHolder);
			makeUnselectable(this.fakeElement);

			// copy classes from original select
			this.fakeElement.addClass(getPrefixedClasses(this.realElement.prop('className'), this.options.selectClassPrefix));
			this.realElement.addClass(this.options.hiddenClass);

			this.list = new SelectList({
				useCustomScroll: this.options.useCustomScroll,
				holder: this.listHolder,
				selectOnClick: false,
				element: this.realElement
			});
		},
		attachEvents: function() {
			// delayed refresh handler
			var self = this;
			this.delayedRefresh = function(e) {
				if (e && e.which === 16) {
					// ignore SHIFT key
					return;
				} else {
					clearTimeout(self.refreshTimer);
					self.refreshTimer = setTimeout(function() {
						self.refresh();
						self.list.scrollToActiveOption();
					}, 1);
				}
			};

			// other event handlers
			this.realElement.on({
				focus: this.onFocus,
				click: this.delayedRefresh,
				keydown: this.delayedRefresh
			});

			// select list event handlers
			$(this.list).on({
				select: this.onSelect,
				press: this.onFakeOptionsPress,
				release: this.onFakeOptionsRelease
			});
		},
		onFakeOptionsPress: function(e, pointerEvent) {
			this.pressedFlag = true;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onFakeOptionsRelease: function(e, pointerEvent) {
			this.pressedFlag = false;
			if (pointerEvent.pointerType === 'mouse') {
				this.realElement.focus();
			}
		},
		onSelect: function() {
			this.fireNativeEvent(this.realElement, 'change');
			this.fireNativeEvent(this.realElement, 'click');
		},
		onFocus: function() {
			if (!this.pressedFlag || !this.focusedFlag) {
				this.fakeElement.addClass(this.options.focusClass);
				this.realElement.on('blur', this.onBlur);
				this.focusedFlag = true;
			}
		},
		onBlur: function() {
			if (!this.pressedFlag) {
				this.fakeElement.removeClass(this.options.focusClass);
				this.realElement.off('blur', this.onBlur);
				this.focusedFlag = false;
			}
		},
		refresh: function() {
			this.fakeElement.toggleClass(this.options.disabledClass, this.realElement.is(':disabled'));
			this.list.refresh();
		},
		destroy: function() {
			this.list.destroy();
			this.realElement.insertBefore(this.fakeElement).removeClass(this.options.hiddenClass);
			this.fakeElement.remove();
		}
	});

	// options list module
	function SelectList(options) {
		this.options = $.extend({
			holder: null,
			maxVisibleItems: 10,
			selectOnClick: true,
			useHoverClass: false,
			useCustomScroll: false,
			handleResize: true,
			multipleSelectWithoutKey: false,
			alwaysPreventMouseWheel: false,
			indexAttribute: 'data-index',
			cloneClassPrefix: 'jcf-option-',
			containerStructure: '<span class="jcf-list"><span class="jcf-list-content"></span></span>',
			containerSelector: '.jcf-list-content',
			captionClass: 'jcf-optgroup-caption',
			disabledClass: 'jcf-disabled',
			optionClass: 'jcf-option',
			groupClass: 'jcf-optgroup',
			hoverClass: 'jcf-hover',
			selectedClass: 'jcf-selected',
			scrollClass: 'jcf-scroll-active'
		}, options);
		this.init();
	}
	$.extend(SelectList.prototype, {
		init: function() {
			this.initStructure();
			this.refreshSelectedClass();
			this.attachEvents();
		},
		initStructure: function() {
			this.element = $(this.options.element);
			this.indexSelector = '[' + this.options.indexAttribute + ']';
			this.container = $(this.options.containerStructure).appendTo(this.options.holder);
			this.listHolder = this.container.find(this.options.containerSelector);
			this.lastClickedIndex = this.element.prop('selectedIndex');
			this.rebuildList();
		},
		attachEvents: function() {
			this.bindHandlers();
			this.listHolder.on('jcf-pointerdown', this.indexSelector, this.onItemPress);
			this.listHolder.on('jcf-pointerdown', this.onPress);

			if (this.options.useHoverClass) {
				this.listHolder.on('jcf-pointerover', this.indexSelector, this.onHoverItem);
			}
		},
		onPress: function(e) {
			$(this).trigger('press', e);
			this.listHolder.on('jcf-pointerup', this.onRelease);
		},
		onRelease: function(e) {
			$(this).trigger('release', e);
			this.listHolder.off('jcf-pointerup', this.onRelease);
		},
		onHoverItem: function(e) {
			var hoverIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute));
			this.fakeOptions.removeClass(this.options.hoverClass).eq(hoverIndex).addClass(this.options.hoverClass);
		},
		onItemPress: function(e) {
			if (e.pointerType === 'touch' || this.options.selectOnClick) {
				// select option after "click"
				this.tmpListOffsetTop = this.list.offset().top;
				this.listHolder.on('jcf-pointerup', this.indexSelector, this.onItemRelease);
			} else {
				// select option immediately
				this.onSelectItem(e);
			}
		},
		onItemRelease: function(e) {
			// remove event handlers and temporary data
			this.listHolder.off('jcf-pointerup', this.indexSelector, this.onItemRelease);

			// simulate item selection
			if (this.tmpListOffsetTop === this.list.offset().top) {
				this.listHolder.on('click', this.indexSelector, { savedPointerType: e.pointerType }, this.onSelectItem);
			}
			delete this.tmpListOffsetTop;
		},
		onSelectItem: function(e) {
			var clickedIndex = parseFloat(e.currentTarget.getAttribute(this.options.indexAttribute)),
				pointerType = e.data && e.data.savedPointerType || e.pointerType || 'mouse',
				range;

			// remove click event handler
			this.listHolder.off('click', this.indexSelector, this.onSelectItem);

			// ignore clicks on disabled options
			if (e.button > 1 || this.realOptions[clickedIndex].disabled) {
				return;
			}

			if (this.element.prop('multiple')) {
				if (e.metaKey || e.ctrlKey || pointerType === 'touch' || this.options.multipleSelectWithoutKey) {
					// if CTRL/CMD pressed or touch devices - toggle selected option
					this.realOptions[clickedIndex].selected = !this.realOptions[clickedIndex].selected;
				} else if (e.shiftKey) {
					// if SHIFT pressed - update selection
					range = [this.lastClickedIndex, clickedIndex].sort(function(a, b) {
						return a - b;
					});
					this.realOptions.each(function(index, option) {
						option.selected = (index >= range[0] && index <= range[1]);
					});
				} else {
					// set single selected index
					this.element.prop('selectedIndex', clickedIndex);
				}
			} else {
				this.element.prop('selectedIndex', clickedIndex);
			}

			// save last clicked option
			if (!e.shiftKey) {
				this.lastClickedIndex = clickedIndex;
			}

			// refresh classes
			this.refreshSelectedClass();

			// scroll to active item in desktop browsers
			if (pointerType === 'mouse') {
				this.scrollToActiveOption();
			}

			// make callback when item selected
			$(this).trigger('select');
		},
		rebuildList: function() {
			// rebuild options
			var self = this,
				rootElement = this.element[0];

			// recursively create fake options
			this.storedSelectHTML = rootElement.innerHTML;
			this.optionIndex = 0;
			this.list = $(this.createOptionsList(rootElement));
			this.listHolder.empty().append(this.list);
			this.realOptions = this.element.find('option');
			this.fakeOptions = this.list.find(this.indexSelector);
			this.fakeListItems = this.list.find('.' + this.options.captionClass + ',' + this.indexSelector);
			delete this.optionIndex;

			// detect max visible items
			var maxCount = this.options.maxVisibleItems,
				sizeValue = this.element.prop('size');
			if (sizeValue > 1 && !this.element.is('[jcf-size]')) {
				maxCount = sizeValue;
			}

			// handle scrollbar
			var needScrollBar = this.fakeOptions.length > maxCount;
			this.container.toggleClass(this.options.scrollClass, needScrollBar);
			if (needScrollBar) {
				// change max-height
				this.listHolder.css({
					maxHeight: this.getOverflowHeight(maxCount),
					overflow: 'auto'
				});

				if (this.options.useCustomScroll && jcf.modules.Scrollable) {
					// add custom scrollbar if specified in options
					jcf.replace(this.listHolder, 'Scrollable', {
						handleResize: this.options.handleResize,
						alwaysPreventMouseWheel: this.options.alwaysPreventMouseWheel
					});
					return;
				}
			}

			// disable edge wheel scrolling
			if (this.options.alwaysPreventMouseWheel) {
				this.preventWheelHandler = function(e) {
					var currentScrollTop = self.listHolder.scrollTop(),
						maxScrollTop = self.listHolder.prop('scrollHeight') - self.listHolder.innerHeight();

					// check edge cases
					if ((currentScrollTop <= 0 && e.deltaY < 0) || (currentScrollTop >= maxScrollTop && e.deltaY > 0)) {
						e.preventDefault();
					}
				};
				this.listHolder.on('jcf-mousewheel', this.preventWheelHandler);
			}
		},
		refreshSelectedClass: function() {
			var self = this,
				selectedItem,
				isMultiple = this.element.prop('multiple'),
				selectedIndex = this.element.prop('selectedIndex');

			if (isMultiple) {
				this.realOptions.each(function(index, option) {
					self.fakeOptions.eq(index).toggleClass(self.options.selectedClass, !!option.selected);
				});
			} else {
				this.fakeOptions.removeClass(this.options.selectedClass + ' ' + this.options.hoverClass);
				selectedItem = this.fakeOptions.eq(selectedIndex).addClass(this.options.selectedClass);
				if (this.options.useHoverClass) {
					selectedItem.addClass(this.options.hoverClass);
				}
			}
		},
		scrollToActiveOption: function() {
			// scroll to target option
			var targetOffset = this.getActiveOptionOffset();
			if (typeof targetOffset === 'number') {
				this.listHolder.prop('scrollTop', targetOffset);
			}
		},
		getSelectedIndexRange: function() {
			var firstSelected = -1, lastSelected = -1;
			this.realOptions.each(function(index, option) {
				if (option.selected) {
					if (firstSelected < 0) {
						firstSelected = index;
					}
					lastSelected = index;
				}
			});
			return [firstSelected, lastSelected];
		},
		getChangedSelectedIndex: function() {
			var selectedIndex = this.element.prop('selectedIndex'),
				targetIndex;

			if (this.element.prop('multiple')) {
				// multiple selects handling
				if (!this.previousRange) {
					this.previousRange = [selectedIndex, selectedIndex];
				}
				this.currentRange = this.getSelectedIndexRange();
				targetIndex = this.currentRange[this.currentRange[0] !== this.previousRange[0] ? 0 : 1];
				this.previousRange = this.currentRange;
				return targetIndex;
			} else {
				// single choice selects handling
				return selectedIndex;
			}
		},
		getActiveOptionOffset: function() {
			// calc values
			var dropHeight = this.listHolder.height(),
				dropScrollTop = this.listHolder.prop('scrollTop'),
				currentIndex = this.getChangedSelectedIndex(),
				fakeOption = this.fakeOptions.eq(currentIndex),
				fakeOptionOffset = fakeOption.offset().top - this.list.offset().top,
				fakeOptionHeight = fakeOption.innerHeight();

			// scroll list
			if (fakeOptionOffset + fakeOptionHeight >= dropScrollTop + dropHeight) {
				// scroll down (always scroll to option)
				return fakeOptionOffset - dropHeight + fakeOptionHeight;
			} else if (fakeOptionOffset < dropScrollTop) {
				// scroll up to option
				return fakeOptionOffset;
			}
		},
		getOverflowHeight: function(sizeValue) {
			var item = this.fakeListItems.eq(sizeValue - 1),
				listOffset = this.list.offset().top,
				itemOffset = item.offset().top,
				itemHeight = item.innerHeight();

			return itemOffset + itemHeight - listOffset;
		},
		getScrollTop: function() {
			return this.listHolder.scrollTop();
		},
		setScrollTop: function(value) {
			this.listHolder.scrollTop(value);
		},
		createOption: function(option) {
			var newOption = document.createElement('span');
			newOption.className = this.options.optionClass;
			newOption.innerHTML = option.innerHTML;
			newOption.setAttribute(this.options.indexAttribute, this.optionIndex++);

			var optionImage, optionImageSrc = option.getAttribute('data-image');
			if (optionImageSrc) {
				optionImage = document.createElement('img');
				optionImage.src = optionImageSrc;
				newOption.insertBefore(optionImage, newOption.childNodes[0]);
			}
			if (option.disabled) {
				newOption.className += ' ' + this.options.disabledClass;
			}
			if (option.className) {
				newOption.className += ' ' + getPrefixedClasses(option.className, this.options.cloneClassPrefix);
			}
			return newOption;
		},
		createOptGroup: function(optgroup) {
			var optGroupContainer = document.createElement('span'),
				optGroupName = optgroup.getAttribute('label'),
				optGroupCaption, optGroupList;

			// create caption
			optGroupCaption = document.createElement('span');
			optGroupCaption.className = this.options.captionClass;
			optGroupCaption.innerHTML = optGroupName;
			optGroupContainer.appendChild(optGroupCaption);

			// create list of options
			if (optgroup.children.length) {
				optGroupList = this.createOptionsList(optgroup);
				optGroupContainer.appendChild(optGroupList);
			}

			optGroupContainer.className = this.options.groupClass;
			return optGroupContainer;
		},
		createOptionContainer: function() {
			var optionContainer = document.createElement('li');
			return optionContainer;
		},
		createOptionsList: function(container) {
			var self = this,
				list = document.createElement('ul');

			$.each(container.children, function(index, currentNode) {
				var item = self.createOptionContainer(currentNode),
					newNode;

				switch (currentNode.tagName.toLowerCase()) {
					case 'option': newNode = self.createOption(currentNode); break;
					case 'optgroup': newNode = self.createOptGroup(currentNode); break;
				}
				list.appendChild(item).appendChild(newNode);
			});
			return list;
		},
		refresh: function() {
			// check for select innerHTML changes
			if (this.storedSelectHTML !== this.element.prop('innerHTML')) {
				this.rebuildList();
			}

			// refresh custom scrollbar
			var scrollInstance = jcf.getInstance(this.listHolder);
			if (scrollInstance) {
				scrollInstance.refresh();
			}

			// refresh selectes classes
			this.refreshSelectedClass();
		},
		destroy: function() {
			this.listHolder.off('jcf-mousewheel', this.preventWheelHandler);
			this.listHolder.off('jcf-pointerdown', this.indexSelector, this.onSelectItem);
			this.listHolder.off('jcf-pointerover', this.indexSelector, this.onHoverItem);
			this.listHolder.off('jcf-pointerdown', this.onPress);
		}
	});

	// helper functions
	var getPrefixedClasses = function(className, prefixToAdd) {
		return className ? className.replace(/[\s]*([\S]+)+[\s]*/gi, prefixToAdd + '$1 ') : '';
	};
	var makeUnselectable = (function() {
		var unselectableClass = jcf.getOptions().unselectableClass;
		function preventHandler(e) {
			e.preventDefault();
		}
		return function(node) {
			node.addClass(unselectableClass).on('selectstart', preventHandler);
		};
	}());

}(jQuery, window));

/*
 * Popups plugin
 */
;(function($) {
	function ContentPopup(opt) {
		this.options = $.extend({
			holder: null,
			popup: '.popup',
			btnOpen: '.open',
			btnClose: '.close',
			openClass: 'popup-active',
			clickEvent: 'click',
			mode: 'click',
			hideOnClickLink: true,
			hideOnClickOutside: true,
			delay: 50
		}, opt);
		if (this.options.holder) {
			this.holder = $(this.options.holder);
			this.init();
		}
	}
	ContentPopup.prototype = {
		init: function() {
			this.findElements();
			this.attachEvents();
		},
		findElements: function() {
			this.popup = this.holder.find(this.options.popup);
			this.btnOpen = this.holder.find(this.options.btnOpen);
			this.btnClose = this.holder.find(this.options.btnClose);
		},
		attachEvents: function() {
			// handle popup openers
			var self = this;
			this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

			if (this.clickMode) {
				// handle click mode
				this.btnOpen.bind(self.options.clickEvent + '.popup', function(e) {
					if (self.holder.hasClass(self.options.openClass)) {
						if (self.options.hideOnClickLink) {
							self.hidePopup();
						}
					} else {
						self.showPopup();
					}
					e.preventDefault();
				});

				// prepare outside click handler
				this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
			} else {
				// handle hover mode
				var timer, delayedFunc = function(func) {
					clearTimeout(timer);
					timer = setTimeout(function() {
						func.call(self);
					}, self.options.delay);
				};
				this.btnOpen.on('mouseover.popup', function() {
					delayedFunc(self.showPopup);
				}).on('mouseout.popup', function() {
					delayedFunc(self.hidePopup);
				});
				this.popup.on('mouseover.popup', function() {
					delayedFunc(self.showPopup);
				}).on('mouseout.popup', function() {
					delayedFunc(self.hidePopup);
				});
			}

			// handle close buttons
			this.btnClose.on(self.options.clickEvent + '.popup', function(e) {
				self.hidePopup();
				e.preventDefault();
			});
		},
		outsideClickHandler: function(e) {
			// hide popup if clicked outside
			var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
			if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
				this.hidePopup();
			}
		},
		showPopup: function() {
			// reveal popup
			this.holder.addClass(this.options.openClass);
			this.popup.css({
				display: 'block'
			});

			// outside click handler
			if (this.clickMode && this.options.hideOnClickOutside && !this.outsideHandlerActive) {
				this.outsideHandlerActive = true;
				$(document).on('click touchstart', this.outsideClickHandler);
			}
		},
		hidePopup: function() {
			// hide popup
			this.holder.removeClass(this.options.openClass);
			this.popup.css({
				display: 'none'
			});

			// outside click handler
			if (this.clickMode && this.options.hideOnClickOutside && this.outsideHandlerActive) {
				this.outsideHandlerActive = false;
				$(document).off('click touchstart', this.outsideClickHandler);
			}
		},
		bind: function(f, scope, forceArgs) {
			return function() {
				return f.apply(scope, forceArgs ? [forceArgs] : arguments);
			};
		},
		destroy: function() {
			this.popup.removeAttr('style');
			this.holder.removeClass(this.options.openClass);
			this.btnOpen.add(this.btnClose).add(this.popup).off('.popup');
			$(document).off('click touchstart', this.outsideClickHandler);
		}
	};

	// detect touch devices
	var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

	// jQuery plugin interface
	$.fn.contentPopup = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('ContentPopup');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('ContentPopup', new ContentPopup($.extend({
					holder: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));

/*!
 * SmoothScroll module
 */
;(function($, exports) {
	// private variables
	var page,
		win = $(window),
		activeBlock, activeWheelHandler,
		wheelEvents = ('onwheel' in document || document.documentMode >= 9 ? 'wheel' : 'mousewheel DOMMouseScroll');

	// animation handlers
	function scrollTo(offset, options, callback) {
		// initialize variables
		var scrollBlock;
		if (document.body) {
			if (typeof options === 'number') {
				options = {
					duration: options
				};
			} else {
				options = options || {};
			}
			page = page || $('html, body');
			scrollBlock = options.container || page;
		} else {
			return;
		}

		// treat single number as scrollTop
		if (typeof offset === 'number') {
			offset = {
				top: offset
			};
		}

		// handle mousewheel/trackpad while animation is active
		if (activeBlock && activeWheelHandler) {
			activeBlock.off(wheelEvents, activeWheelHandler);
		}
		if (options.wheelBehavior && options.wheelBehavior !== 'none') {
			activeWheelHandler = function(e) {
				if (options.wheelBehavior === 'stop') {
					scrollBlock.off(wheelEvents, activeWheelHandler);
					scrollBlock.stop();
				} else if (options.wheelBehavior === 'ignore') {
					e.preventDefault();
				}
			};
			activeBlock = scrollBlock.on(wheelEvents, activeWheelHandler);
		}

		// start scrolling animation
		scrollBlock.stop().animate({
			scrollLeft: offset.left,
			scrollTop: offset.top
		}, options.duration, function() {
			if (activeWheelHandler) {
				scrollBlock.off(wheelEvents, activeWheelHandler);
			}
			if ($.isFunction(callback)) {
				callback();
			}
		});
	}

	// smooth scroll contstructor
	function SmoothScroll(options) {
		this.options = $.extend({
			anchorLinks: 'a[href^="#"]', // selector or jQuery object
			container: null, // specify container for scrolling (default - whole page)
			extraOffset: null, // function or fixed number
			activeClasses: null, // null, "link", "parent"
			easing: 'swing', // easing of scrolling
			animMode: 'duration', // or "speed" mode
			animDuration: 800, // total duration for scroll (any distance)
			animSpeed: 1500, // pixels per second
			anchorActiveClass: 'anchor-active',
			sectionActiveClass: 'section-active',
			wheelBehavior: 'stop', // "stop", "ignore" or "none"
			useNativeAnchorScrolling: false // do not handle click in devices with native smooth scrolling
		}, options);
		this.init();
	}
	SmoothScroll.prototype = {
		init: function() {
			this.initStructure();
			this.attachEvents();
			this.isInit = true;
		},
		initStructure: function() {
			var self = this;

			this.container = this.options.container ? $(this.options.container) : $('html,body');
			this.scrollContainer = this.options.container ? this.container : win;
			this.anchorLinks = jQuery(this.options.anchorLinks).filter(function() {
				return jQuery(self.getAnchorTarget(jQuery(this))).length;
			});
		},
		getId: function(str) {
			try {
				return '#' + str.replace(/^.*?(#|$)/, '');
			} catch (err) {
				return null;
			}
		},
		getAnchorTarget: function(link) {
			// get target block from link href
			var targetId = this.getId($(link).attr('href'));
			return $(targetId.length > 1 ? targetId : 'html');
		},
		getTargetOffset: function(block) {
			// get target offset
			var blockOffset = block.offset().top;
			if (this.options.container) {
				blockOffset -= this.container.offset().top - this.container.prop('scrollTop');
			}

			// handle extra offset
			if (typeof this.options.extraOffset === 'number') {
				blockOffset -= this.options.extraOffset;
			} else if (typeof this.options.extraOffset === 'function') {
				blockOffset -= this.options.extraOffset(block);
			}
			return {
				top: blockOffset
			};
		},
		attachEvents: function() {
			var self = this;

			// handle active classes
			if (this.options.activeClasses && this.anchorLinks.length) {
				// cache structure
				this.anchorData = [];

				for (var i = 0; i < this.anchorLinks.length; i++) {
					var link = jQuery(this.anchorLinks[i]),
						targetBlock = self.getAnchorTarget(link),
						anchorDataItem = null;

					$.each(self.anchorData, function(index, item) {
						if (item.block[0] === targetBlock[0]) {
							anchorDataItem = item;
						}
					});

					if (anchorDataItem) {
						anchorDataItem.link = anchorDataItem.link.add(link);
					} else {
						self.anchorData.push({
							link: link,
							block: targetBlock
						});
					}
				};

				// add additional event handlers
				this.resizeHandler = function() {
					if (!self.isInit) return;
					self.recalculateOffsets();
				};
				this.scrollHandler = function() {
					self.refreshActiveClass();
				};

				this.recalculateOffsets();
				this.scrollContainer.on('scroll', this.scrollHandler);
				win.on('resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll', this.resizeHandler);
			}

			// handle click event
			this.clickHandler = function(e) {
				self.onClick(e);
			};
			if (!this.options.useNativeAnchorScrolling) {
				this.anchorLinks.on('click', this.clickHandler);
			}
		},
		recalculateOffsets: function() {
			var self = this;
			$.each(this.anchorData, function(index, data) {
				data.offset = self.getTargetOffset(data.block);
				data.height = data.block.outerHeight();
			});
			this.refreshActiveClass();
		},
		toggleActiveClass: function(anchor, block, state) {
			anchor.toggleClass(this.options.anchorActiveClass, state);
			block.toggleClass(this.options.sectionActiveClass, state);
		},
		refreshActiveClass: function() {
			var self = this,
				foundFlag = false,
				containerHeight = this.container.prop('scrollHeight'),
				viewPortHeight = this.scrollContainer.height(),
				scrollTop = this.options.container ? this.container.prop('scrollTop') : win.scrollTop();

			// user function instead of default handler
			if (this.options.customScrollHandler) {
				this.options.customScrollHandler.call(this, scrollTop, this.anchorData);
				return;
			}

			// sort anchor data by offsets
			this.anchorData.sort(function(a, b) {
				return a.offset.top - b.offset.top;
			});

			// default active class handler
			$.each(this.anchorData, function(index) {
				var reverseIndex = self.anchorData.length - index - 1,
					data = self.anchorData[reverseIndex],
					anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

				if (scrollTop >= containerHeight - viewPortHeight) {
					// handle last section
					if (reverseIndex === self.anchorData.length - 1) {
						self.toggleActiveClass(anchorElement, data.block, true);
					} else {
						self.toggleActiveClass(anchorElement, data.block, false);
					}
				} else {
					// handle other sections
					if (!foundFlag && (scrollTop >= data.offset.top - 1 || reverseIndex === 0)) {
						foundFlag = true;
						self.toggleActiveClass(anchorElement, data.block, true);
					} else {
						self.toggleActiveClass(anchorElement, data.block, false);
					}
				}
			});
		},
		calculateScrollDuration: function(offset) {
			var distance;
			if (this.options.animMode === 'speed') {
				distance = Math.abs(this.scrollContainer.scrollTop() - offset.top);
				return (distance / this.options.animSpeed) * 1000;
			} else {
				return this.options.animDuration;
			}
		},
		onClick: function(e) {
			var targetBlock = this.getAnchorTarget(e.currentTarget),
				targetOffset = this.getTargetOffset(targetBlock);

			e.preventDefault();
			scrollTo(targetOffset, {
				container: this.container,
				wheelBehavior: this.options.wheelBehavior,
				duration: this.calculateScrollDuration(targetOffset)
			});
			this.makeCallback('onBeforeScroll', e.currentTarget);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},
		destroy: function() {
			var self = this;

			this.isInit = false;
			if (this.options.activeClasses) {
				win.off('resize.SmoothScroll load.SmoothScroll orientationchange.SmoothScroll refreshAnchor.SmoothScroll', this.resizeHandler);
				this.scrollContainer.off('scroll', this.scrollHandler);
				$.each(this.anchorData, function(index) {
					var reverseIndex = self.anchorData.length - index - 1,
						data = self.anchorData[reverseIndex],
						anchorElement = (self.options.activeClasses === 'parent' ? data.link.parent() : data.link);

					self.toggleActiveClass(anchorElement, data.block, false);
				});
			}
			this.anchorLinks.off('click', this.clickHandler);
		}
	};

	// public API
	$.extend(SmoothScroll, {
		scrollTo: function(blockOrOffset, durationOrOptions, callback) {
			scrollTo(blockOrOffset, durationOrOptions, callback);
		}
	});

	// export module
	exports.SmoothScroll = SmoothScroll;
}(jQuery, window));

/*
 * Simple Mobile Navigation
 */
;(function($) {
	function MobileNav(options) {
		this.options = $.extend({
			container: null,
			hideOnClickOutside: false,
			menuActiveClass: 'nav-active',
			menuOpener: '.nav-opener',
			menuDrop: '.nav-drop',
			toggleEvent: 'click',
			outsideClickEvent: 'click touchstart pointerdown MSPointerDown'
		}, options);
		this.initStructure();
		this.attachEvents();
	}
	MobileNav.prototype = {
		initStructure: function() {
			this.page = $('html');
			this.container = $(this.options.container);
			this.opener = this.container.find(this.options.menuOpener);
			this.drop = this.container.find(this.options.menuDrop);
		},
		attachEvents: function() {
			var self = this;

			if(activateResizeHandler) {
				activateResizeHandler();
				activateResizeHandler = null;
			}

			this.outsideClickHandler = function(e) {
				if(self.isOpened()) {
					var target = $(e.target);
					if(!target.closest(self.opener).length && !target.closest(self.drop).length) {
						self.hide();
					}
				}
			};

			this.openerClickHandler = function(e) {
				e.preventDefault();
				self.toggle();
			};

			this.opener.on(this.options.toggleEvent, this.openerClickHandler);
		},
		isOpened: function() {
			return this.container.hasClass(this.options.menuActiveClass);
		},
		show: function() {
			this.container.addClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.on(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		hide: function() {
			this.container.removeClass(this.options.menuActiveClass);
			if(this.options.hideOnClickOutside) {
				this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
			}
		},
		toggle: function() {
			if(this.isOpened()) {
				this.hide();
			} else {
				this.show();
			}
		},
		destroy: function() {
			this.container.removeClass(this.options.menuActiveClass);
			this.opener.off(this.options.toggleEvent, this.clickHandler);
			this.page.off(this.options.outsideClickEvent, this.outsideClickHandler);
		}
	};

	var activateResizeHandler = function() {
		var win = $(window),
			doc = $('html'),
			resizeClass = 'resize-active',
			flag, timer;
		var removeClassHandler = function() {
			flag = false;
			doc.removeClass(resizeClass);
		};
		var resizeHandler = function() {
			if(!flag) {
				flag = true;
				doc.addClass(resizeClass);
			}
			clearTimeout(timer);
			timer = setTimeout(removeClassHandler, 500);
		};
		win.on('resize orientationchange', resizeHandler);
	};

	$.fn.mobileNav = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $container = jQuery(this);
			var instance = $container.data('MobileNav');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$container.data('MobileNav', new MobileNav($.extend({
					container: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));

/*
 * jQuery Open/Close plugin
 */
;(function($) {
	function OpenClose(options) {
		this.options = $.extend({
			addClassBeforeAnimation: true,
			hideOnClickOutside: false,
			activeClass: 'active',
			opener: '.opener',
			slider: '.slide',
			animSpeed: 400,
			effect: 'fade',
			event: 'click'
		}, options);
		this.init();
	}
	OpenClose.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.attachEvents();
				this.makeCallback('onInit', this);
			}
		},
		findElements: function() {
			this.holder = $(this.options.holder);
			this.opener = this.holder.find(this.options.opener);
			this.slider = this.holder.find(this.options.slider);
		},
		attachEvents: function() {
			// add handler
			var self = this;
			this.eventHandler = function(e) {
				e.preventDefault();
				if (self.slider.hasClass(slideHiddenClass)) {
					self.showSlide();
				} else {
					self.hideSlide();
				}
			};
      self.slider.attr('aria-hidden', 'true');
      self.opener.attr('aria-expanded', 'false');
			self.opener.on(self.options.event, this.eventHandler);

			// hover mode handler
			if (self.options.event === 'hover') {
				self.opener.on('mouseenter', function() {
					if (!self.holder.hasClass(self.options.activeClass)) {
						self.showSlide();
					}
				});
				self.holder.on('mouseleave', function() {
					self.hideSlide();
				});
			}

			// outside click handler
			self.outsideClickHandler = function(e) {
				if (self.options.hideOnClickOutside) {
					var target = $(e.target);
					if (!target.is(self.holder) && !target.closest(self.holder).length) {
						self.hideSlide();
					}
				}
			};

			// set initial styles
			if (this.holder.hasClass(this.options.activeClass)) {
				$(document).on('click touchstart', self.outsideClickHandler);
			} else {
				this.slider.addClass(slideHiddenClass);
			}
		},
		showSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.addClass(self.options.activeClass);
			}
      self.slider.attr('aria-hidden', 'false');
      self.opener.attr('aria-expanded', 'true');
			self.slider.removeClass(slideHiddenClass);
			$(document).on('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', true);
			toggleEffects[self.options.effect].show({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.addClass(self.options.activeClass);
					}
					self.makeCallback('animEnd', true);
				}
			});
		},
		hideSlide: function() {
			var self = this;
			if (self.options.addClassBeforeAnimation) {
				self.holder.removeClass(self.options.activeClass);
			}
			$(document).off('click touchstart', self.outsideClickHandler);

			self.makeCallback('animStart', false);
			toggleEffects[self.options.effect].hide({
				box: self.slider,
				speed: self.options.animSpeed,
				complete: function() {
					if (!self.options.addClassBeforeAnimation) {
						self.holder.removeClass(self.options.activeClass);
					}
					self.slider.addClass(slideHiddenClass);
          self.slider.attr('aria-hidden', 'true');
          self.opener.attr('aria-expanded', 'false');
					self.makeCallback('animEnd', false);
				}
			});
		},
		destroy: function() {
			this.slider.removeClass(slideHiddenClass).css({
				display: ''
			});
			this.opener.off(this.options.event, this.eventHandler);
			this.holder.removeClass(this.options.activeClass).removeData('OpenClose');
			$(document).off('click touchstart', this.outsideClickHandler);
		},
		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	// add stylesheet for slide on DOMReady
	var slideHiddenClass = 'js-slide-hidden';
	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + slideHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	// animation effects
	var toggleEffects = {
		slide: {
			show: function(o) {
				o.box.stop(true).hide().slideDown(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).slideUp(o.speed, o.complete);
			}
		},
		fade: {
			show: function(o) {
				o.box.stop(true).hide().fadeIn(o.speed, o.complete);
			},
			hide: function(o) {
				o.box.stop(true).fadeOut(o.speed, o.complete);
			}
		},
		none: {
			show: function(o) {
				o.box.hide().show(0, o.complete);
			},
			hide: function(o) {
				o.box.hide(0, o.complete);
			}
		}
	};

	// jQuery plugin interface
	$.fn.openClose = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('OpenClose');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('OpenClose', new OpenClose($.extend({
					holder: this
				}, opt)));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery));

/*
 * jQuery Tabs plugin
 */

;(function($, $win) {
	'use strict';

	function Tabset($holder, options) {
		this.$holder = $holder;
		this.options = options;

		this.init();
	}

	Tabset.prototype = {
		init: function() {
			this.$tabLinks = this.$holder.find(this.options.tabLinks);

			this.setStartActiveIndex();
			this.setActiveTab();

			if (this.options.autoHeight) {
				this.$tabHolder = $(this.$tabLinks.eq(0).attr(this.options.attrib)).parent();
			}

			this.makeCallback('onInit', this);
		},

		setStartActiveIndex: function() {
			var $classTargets = this.getClassTarget(this.$tabLinks);
			var $activeLink = $classTargets.filter('.' + this.options.activeClass);
			var $hashLink = this.$tabLinks.filter('[' + this.options.attrib + '="' + location.hash + '"]');
			var activeIndex;

			if (this.options.checkHash && $hashLink.length) {
				$activeLink = $hashLink;
			}

			activeIndex = $classTargets.index($activeLink);

			this.activeTabIndex = this.prevTabIndex = (activeIndex === -1 ? (this.options.defaultTab ? 0 : null) : activeIndex);
		},

		setActiveTab: function() {
			var self = this;

			this.$tabLinks.each(function(i, link) {
				var $link = $(link);
				var $classTarget = self.getClassTarget($link);
				var $tab = $($link.attr(self.options.attrib));

				if (i !== self.activeTabIndex) {
					$classTarget.removeClass(self.options.activeClass);
					$tab.addClass(self.options.tabHiddenClass).removeClass(self.options.activeClass);
				} else {
					$classTarget.addClass(self.options.activeClass);
					$tab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);
				}

				self.attachTabLink($link, i);
			});
		},

		attachTabLink: function($link, i) {
			var self = this;

			$link.on(this.options.event + '.tabset', function(e) {
				e.preventDefault();

				if (self.activeTabIndex === self.prevTabIndex && self.activeTabIndex !== i) {
					self.activeTabIndex = i;
					self.switchTabs();
				}
				if (self.options.checkHash) {
					location.hash = jQuery(this).attr('href').split('#')[1]
				}
			});
		},

		resizeHolder: function(height) {
			var self = this;

			if (height) {
				this.$tabHolder.height(height);
				setTimeout(function() {
					self.$tabHolder.addClass('transition');
				}, 10);
			} else {
				self.$tabHolder.removeClass('transition').height('');
			}
		},

		switchTabs: function() {
			var self = this;

			var $prevLink = this.$tabLinks.eq(this.prevTabIndex);
			var $nextLink = this.$tabLinks.eq(this.activeTabIndex);

			var $prevTab = this.getTab($prevLink);
			var $nextTab = this.getTab($nextLink);

			$prevTab.removeClass(this.options.activeClass);

			if (self.haveTabHolder()) {
				this.resizeHolder($prevTab.outerHeight());
			}

			setTimeout(function() {
				self.getClassTarget($prevLink).removeClass(self.options.activeClass);

				$prevTab.addClass(self.options.tabHiddenClass);
				$nextTab.removeClass(self.options.tabHiddenClass).addClass(self.options.activeClass);

				self.getClassTarget($nextLink).addClass(self.options.activeClass);

				if (self.haveTabHolder()) {
					self.resizeHolder($nextTab.outerHeight());

					setTimeout(function() {
						self.resizeHolder();
						self.prevTabIndex = self.activeTabIndex;
						self.makeCallback('onChange', self);
					}, self.options.animSpeed);
				} else {
					self.prevTabIndex = self.activeTabIndex;
				}
			}, this.options.autoHeight ? this.options.animSpeed : 1);
		},

		getClassTarget: function($link) {
			return this.options.addToParent ? $link.parent() : $link;
		},

		getActiveTab: function() {
			return this.getTab(this.$tabLinks.eq(this.activeTabIndex));
		},

		getTab: function($link) {
			return $($link.attr(this.options.attrib));
		},

		haveTabHolder: function() {
			return this.$tabHolder && this.$tabHolder.length;
		},

		destroy: function() {
			var self = this;

			this.$tabLinks.off('.tabset').each(function() {
				var $link = $(this);

				self.getClassTarget($link).removeClass(self.options.activeClass);
				$($link.attr(self.options.attrib)).removeClass(self.options.activeClass + ' ' + self.options.tabHiddenClass);
			});

			this.$holder.removeData('Tabset');
		},

		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		}
	};

	$.fn.tabset = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		var options = $.extend({
			activeClass: 'active',
			addToParent: false,
			autoHeight: false,
			checkHash: false,
			defaultTab: true,
			animSpeed: 500,
			tabLinks: 'a',
			attrib: 'href',
			event: 'click',
			tabHiddenClass: 'js-tab-hidden'
		}, opt);
		options.autoHeight = options.autoHeight;

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('Tabset');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				$holder.data('Tabset', new Tabset($holder, options));
			} else if (typeof method === 'string' && instance) {
				if (typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};
}(jQuery, jQuery(window)));

/*
 * jQuery Accordion plugin new
 */
;(function(root, factory) {
	'use strict';
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		module.exports = factory(require('jquery'));
	} else {
		root.SlideAccordion = factory(jQuery);
	}
}(window, function($) {
	'use strict';
	var accHiddenClass = 'js-acc-hidden';

	function SlideAccordion(options) {
		this.options = $.extend(true, {
			allowClickWhenExpanded: false,
			activeClass:'active',
			opener:'.opener',
			slider:'.slide',
			animSpeed: 300,
			collapsible:true,
			event: 'click',
			scrollToActiveItem: {
				enable: false,
				breakpoint: 767, // max-width
				animSpeed: 600,
				extraOffset: null
			}
		}, options);
		this.init();
	}

	SlideAccordion.prototype = {
		init: function() {
			if (this.options.holder) {
				this.findElements();
				this.setStateOnInit();
				this.attachEvents();
				this.makeCallback('onInit');
			}
		},

		findElements: function() {
			this.$holder = $(this.options.holder).data('SlideAccordion', this);
			this.$items = this.$holder.find(':has(' + this.options.slider + ')');
		},

		setStateOnInit: function() {
			var self = this;

			this.$items.each(function() {
				if (!$(this).hasClass(self.options.activeClass)) {
					$(this).find(self.options.slider).addClass(accHiddenClass);
				}
			});
		},

		attachEvents: function() {
			var self = this;

			this.accordionToggle = function(e) {
				var $item = jQuery(this).closest(self.$items);
				var $actiItem = self.getActiveItem($item);

				if (!self.options.allowClickWhenExpanded || !$item.hasClass(self.options.activeClass)) {
					e.preventDefault();
					self.toggle($item, $actiItem);
				}
			};

			this.$items.on(this.options.event, this.options.opener, this.accordionToggle);
		},

		toggle: function($item, $prevItem) {
			if (!$item.hasClass(this.options.activeClass)) {
				this.show($item);
			} else if (this.options.collapsible) {
				this.hide($item);
			}

			if (!$item.is($prevItem) && $prevItem.length) {
				this.hide($prevItem);
			}

			this.makeCallback('beforeToggle');
		},

		show: function($item) {
			var $slider = $item.find(this.options.slider);

			$item.addClass(this.options.activeClass);
			$slider.stop().hide().removeClass(accHiddenClass).slideDown({
				duration: this.options.animSpeed,
				complete: function() {
					$slider.removeAttr('style');
					if (
						this.options.scrollToActiveItem.enable &&
						window.innerWidth <= this.options.scrollToActiveItem.breakpoint
					) {
						this.goToItem($item);
					}
					this.makeCallback('onShow', $item);
				}.bind(this)
			});

			this.makeCallback('beforeShow', $item);
		},

		hide: function($item) {
			var $slider = $item.find(this.options.slider);

			$item.removeClass(this.options.activeClass);
			$slider.stop().show().slideUp({
				duration: this.options.animSpeed,
				complete: function() {
					$slider.addClass(accHiddenClass);
					$slider.removeAttr('style');
					this.makeCallback('onHide', $item);
				}.bind(this)
			});

			this.makeCallback('beforeHide', $item);
		},

		goToItem: function($item) {
			var itemOffset = $item.offset().top;

			if (itemOffset < $(window).scrollTop()) {
				// handle extra offset
				if (typeof this.options.scrollToActiveItem.extraOffset === 'number') {
					itemOffset -= this.options.scrollToActiveItem.extraOffset;
				} else if (typeof this.options.scrollToActiveItem.extraOffset === 'function') {
					itemOffset -= this.options.scrollToActiveItem.extraOffset();
				}

				$('body, html').animate({
					scrollTop: itemOffset
				}, this.options.scrollToActiveItem.animSpeed);
			}
		},

		getActiveItem: function($item) {
			return $item.siblings().filter('.' + this.options.activeClass);
		},

		makeCallback: function(name) {
			if (typeof this.options[name] === 'function') {
				var args = Array.prototype.slice.call(arguments);
				args.shift();
				this.options[name].apply(this, args);
			}
		},

		destroy: function() {
			this.$holder.removeData('SlideAccordion');
			this.$items.off(this.options.event, this.options.opener, this.accordionToggle);
			this.$items.removeClass(this.options.activeClass).each(function(i, item) {
				$(item).find(this.options.slider).removeAttr('style').removeClass(accHiddenClass);
			}.bind(this));
			this.makeCallback('onDestroy');
		}
	};

	$.fn.slideAccordion = function(opt) {
		var args = Array.prototype.slice.call(arguments);
		var method = args[0];

		return this.each(function() {
			var $holder = jQuery(this);
			var instance = $holder.data('SlideAccordion');

			if (typeof opt === 'object' || typeof opt === 'undefined') {
				new SlideAccordion($.extend(true, {
					holder: this
				}, opt));
			} else if (typeof method === 'string' && instance) {
				if(typeof instance[method] === 'function') {
					args.shift();
					instance[method].apply(instance, args);
				}
			}
		});
	};

	(function() {
		var tabStyleSheet = $('<style type="text/css">')[0];
		var tabStyleRule = '.' + accHiddenClass;
		tabStyleRule += '{position:absolute !important;left:-9999px !important;top:-9999px !important;display:block !important; width: 100% !important;}';
		if (tabStyleSheet.styleSheet) {
			tabStyleSheet.styleSheet.cssText = tabStyleRule;
		} else {
			tabStyleSheet.appendChild(document.createTextNode(tabStyleRule));
		}
		$('head').append(tabStyleSheet);
	}());

	return SlideAccordion;
}));