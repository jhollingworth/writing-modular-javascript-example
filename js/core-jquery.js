var core = (function() {
	var moduleData = {},
		toStr = function(o) { return Object.prototype.toString.call(e); },
		debug = true;
		
	return {
		debug: function(on) {
			debug = on ? true : false;
		},
		
		createModule: function(moduleId, creator) { 
			var temp;
			if(typeof moduleId === 'string' && typeof creator === 'function') {
				temp = creator(Sandbox.create(this, moduleId));
				
				if(temp.init && typeof temp.init === 'function' && temp.destroy && typeof temp.destroy === 'function') {
					temp = null;
					moduleData[moduleId] = {
						create: creator,
						instance: null
					};
				} else {
					this.log(1, "Module '" + moduleId + "' registration failed because instance has no init or destroy");
				}
			} else {
				this.log(1, "Module '" + toStr(moduleId) + "' registration failed because one or more arguments are on an invalid type");
			}
		},
		
		start: function(moduleId) {
			var mod = moduleData[moduleId];
			
			if(mod) { 
				mod.instance = mod.create(Sandbox.create(this, moduleId));
				mod.init();
			} else {
				this.log(1, "Module '" + moduleId + "' has not been registered");
			}
		},
		
		startAll: function() { 
			var moduleId;
			for(moduleId in moduleData) {
				if(moduleData.hasOwnProperty(moduleId)) {
					this.start(moduleId);
				}
			}
		},
		
		stop: function(moduleId) { 
			var data;
			if(data = moduleData[moduleId] && data.instance) {
				data.instance.destory();
				data.instance = null;
			} else {
				this.log(1, "Failed stopping module, '" + moduleId + "' has not been started");				
			}
		},
		
		stopAll: function() { 
			var moduleId;
			for(moduleId in moduleData) {
				if(moduleData.hasOwnProperty(moduleId)) {
					this.stop(moduleId);
				}
			}
		},
		
		registerEvents: function(evts, mod) { 
			if(this.isObj(evts) && mod) {
				if(moduleData[mod]) {
					moduleData[mod].events = evts;
				} else {
					this.log(1, "Failed to register events, '" + moduleId + "' has not been started");				
				}
			}
		},
		
		triggerEvents: function(evt, mod) {
			var mod;
			for(mod in moduleData){
				if(moduleData.hasOwnProperty(mod)) {
					mod = moduleData[mod];
					if(mod.events && mod.events[evt.type]) {
						mod.events[evt.type](evt.data);
					}
				}
			}
		},
		
		remoteEvents: function(evts, mod) {
			if(this.isObj(evts) && mod && (mod = moduleData) && mod.events) {
				delete mod.events;
			}
		},
		
		log: function(severity, message) { 
			if(debug) { 
				console[severity == 1 ? 'log' : 'warn'](message);
			}
		},
		
		dom: {
			query: function(selector, context) { 
				var ret = {}, that = this, jqEls, i = 0;
				
				if(context && context.find) {
					jqEls = context.find(selector);
				} else {
					jqEls = jQuery(selector)
				}
				
				ret = jqEls.get();
				ret.length = jqEls.length;
				ret.query = function(sel) {
					return that.query(sel, jqEls);
				}
				return ret;
			},
			
			bind: function(element, evt, fn) { 
				if(element && evt) {
					if(typeof evt === 'function') {
						fn = evt;
						evt = 'click';			
					}
					jQuery(element).bind(evt, fn);
				} 
			}, 
			
			unbind: function(element, evt, fn) { 
				if(element && evt) {
					if(typeof evt === 'function') {
						fn = evt;
						evt = 'click';			
					}
					jQuery(element).unbind(evt, fn);
				} 
			},
			
			create: function(el) {
				return document.createElement(el)
			},
			
			applyAttributes: function(el, attrs) {
				jQuery(el).attr(attrs);
			}
		},
		
		isArray: function(arr) {
			return jQuery.isArray(arr);
		},
		
		isObj: function(obj) { 
			return jQuery.isPlainObject(obj);
		}
	};
}());