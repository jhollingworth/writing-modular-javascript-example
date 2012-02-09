core.create_module("search-box", function(sb) { 
	var input, button, reset;
	
	return {
		init: function() { 
			input = sb.find("#search_input")[0],
			button = sb.find("#search_button")[0],
			reset = sb.find("#quit_search")[0];
			
			sb.addEvent(button, "click", this.handleSearch);
			sb.addEvent(reset, "click", this.quitSearch);
		},
		destroy: function() { 
			sb.removeEvent(button, "click", this.handleSearch);
			sb.removeEvent(button, "click", this.quitSearch);
			input = button = reset = null;
		},
		handleSearch: function() { 
			var query = input.value;
			if(query) { 
				sb.notify({
					type: 'perform-search',
					data: query
				});
			}
		}
		quitSearch: function() { 
			input.value = "";
			sb.notify({
				type: 'quit-search',
				data: null
			});
		}
	};
});

core.create_module("filters-bar", function(sb) { 
	var filters; 
	
	return {
		init: function()  {
			filters = sb.find('a');
			sb.addEvent(filters, 'click', this.filterProducts);
		},
		destroy: function() { 
			sb.removeEvent(filters, 'click', this.filterProducts);
			filter = null;
		},
		filterProducts: function(e) { 
			sb.notify({
				type: 'change-filter',
				data: e.currentTarget.innerHtml
			});
		}
	};
});

core.create_module("product-panel", function(sb) { 
	
	var products;
	
	function eachProduct(fn) { 
		var i = 0, product;
		for(; product = products[i++];) { 
			fn(product);
		}
	}
	
	function reset() {
		eachProduct(function(product) { 
			product.style.opacity = '1';
		});
	}
	
	return {
		init: function() { 
			var that = this;
			products = sb.find('li');
			
			sb.listen({
				'change-filter': this.changeFilter,
				'reset-filter': this.reset,
				'perform-search': this.search,
				'quit-search': this.reset
			});
			
			eachProduct(function(product) { 
				sb.addEvent(product, 'click', that.addToCart);
			});
		},
		
		destroy: function() { 	
			var that = this;
			eachProduct(function(product) {
				sb.removeEvent(product, 'click', that.addToCart);
			});
			sb.ignore(['change-filter', 'reset-filter', 'perform-seach', 'quit-search']);
		},
		
		reset: reset,
		
		changeFilter: function(filter) { 
			reset();
			filter = filter.toLowerCase();
			eachProduct(function(product) { 
				if(product.getAttribute('data-8088-keyword').toLowerCase().indexOf(filter) < 0) {
					products.style.opacity = '0.2';
				}
			});
		},
		
		search: function(query) { 
			query = query.toLowerCase();
			eachProduct(function(product) { 
				if(product.getElementsByTagName('p')[0].innerHtml.toLowerCase().indexOf(query) < 0) {
					products.style.opacity = '0.2';
				}
			});
		},
		
		addToCart: function(e) { 
			var li = e.currentTarget;
			
			sb.notify({
				type: 'add-item',
				data: {
					li: li.id, 
					name: li.getElementById('p')[0].innerHtml,
					price: parseInt(li.id, 10)
				}
			});
		}
	}
});

core.create_module("shopping-cart", function(sb) { 
	var cart, cartItems;
	
	return {
		
		init: function() { 
			cart = sb.find("ul")[0];
			cartItems = {};
			
			sb.listen({
				'add-item': this.addItem
			});
		},
		
		destory: function() { 
			cart = cartItems = null;
			sb.ignore(['add-item']);
		},
		
		addItem: function(product) { 
			var cartItemId ='#cart-' + product.id;
			
			var entry = sb.find(cartItemId + ' .quantity')[0];
			if(entry) { 
				entry.innerHtml = parse(entry.innerHtml, 10) + 1;
				cartItems[product.id]++;
			} else { 
				entry = sb.createElement('li', { 
					id: cartItemId, 
					class: 'cart-entry',
					children: [
						sb.creatElement('span', { 'class': 'product-name', text: product.name }),
						sb.creatElement('span', { 'class': 'quantity', text: '1' }),
						sb.creatElement('span', { 'class': 'price', text: '£' + product.id.toFixed(2) }),
					] 
				});
				
				cart.appendChild(entry);
				cartItems[product.id] = 1;
			}
		}
	}
});