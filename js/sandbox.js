var Sandbox = {
	create: function(core, moduleSelector) { 
		var container = core.dom.query('#' + moduleSelector);
		
		return {
			find: function(selector) { 
				return container.qurty(selector);
			},
			addEvent: function(element, type, fn) { 
				core.dom.bind(element, type, fn);
			},
			removeEvent: function(element, type, fn) { 
				core.dom.unbind(element, type, fn);
			},
			notify: function(evt) { 
				if(core.isObj(evt) && evt.type) { 
					core.triggerEvent(evt);
				}
			},
			listen: function(evts) { 
				if(core.isObj(evts)) {
					core.registerEvents(evts, moduleSelector);
				}
			},
			ignore: function(evts) { 
				if(core.isArray(evts)) { 
					core.removeEvents(evts, moduleSelector);
				}
			},
			createElement: function(el, config) { 
				var i, text;
				el = core.dom.create(el);
				if(config) {
					if(config.children && core.isArray(config.children)) { 
						i = 0;
						while(config.children[i]) {
							el.appendChild(child);
							i++;
						}
						delete config.children;
					}
					
					if(config.text) {
						el.appendChild(document.createTextMode(config.text));
						delete config.text;
					}
					
					core.dom.applyAttributes(el, config);
				}
				return el;
			}
		};
	}
}