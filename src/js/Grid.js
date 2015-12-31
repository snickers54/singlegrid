

/**
* Grid class
* Main class of single grid ..
*/

class Grid {

	constructor(DOMId, config) {
		console.info('Loading singleGrid on', DOMId);
		this.grid = [];
		this.stackId = 0;
		this.config = config || {blockWidth: 80, blockHeight: 80, marginHeight: 20, marginWidth: 20};
		this.drawer = new Drawer(this.config, {ref: document.getElementById(DOMId), id:DOMId});
		this.hashtable = new Hashtable(this.config, this.drawer.getDOM());
		this.drawer.init(this.hashtable.properties);
		this.DOM = this.drawer.getDOM();
		let context = this;
		window.addEventListener('resize', debounce(function(){context.resizing(context);}, 250));
		console.info(this.drawer.getDOM().ref, 'is like this :', this.drawer.getDOM());

		this.EVENTS = {
			drag: function(event, element, self) {
				if (element._dragging == true) return ;
				element._dragging = true;
				self.hashtable.remove(element);
				element.x = element.y = null;
				self.drawer.draw(element);
				if (typeof element.drag === 'function') {
					element.drag(event);
				}
			},
			drop: function(event, element, self) {
				element._dragging = false;
				if (typeof element.drop === 'function') {
					element.drop(event);
				}
			}
		};


	}

	resizing(context) {
		let element = context.drawer.getDOM().ref;
		context.drawer.getDOM().height = element.offsetHeight;
		context.drawer.getDOM().width = element.offsetWidth;
		context.hashtable.calculateGridSize();
		context.hashtable.updateHashtableSize();
		console.info('Hashtable : ', context.hashtable);

		for (let i = 0; i < context.grid.length; i++) {
			let element = context.grid[i];
			if (context.isOutOfGrid(element) || element.x == null) {
				this.remove(element);
				if (context.setNewPosition(element)) {
					context.hashtable.update(element);
				}
				context.drawer.draw(element);
			} else {
				let pos = context.hashtable.findPosition(element.width, element.height);
				if (pos != null &&
						pos.y < element.y) {
						this.remove(element);
						if (context.setNewPosition(element, pos)) {
							context.hashtable.update(element);
						}
						context.drawer.draw(element);
				}
			}
		}
	}

	isOutOfGrid(element) {
		let struct = this.hashtable.properties;
		if (element.x + element.width > struct.nHorizontal ||
			element.y + element.height > struct.nVertical) {
			return true;
		}
		return false;
	}

	add(element) {
		this.stackId++;
		if (!element.hasOwnProperty('width') || !element.hasOwnProperty('height')) {
			console.warn('Element', element, 'has no correct size.');
			return false;
		}
		this.grid.push(element);
		element.dom = document.getElementById(element.id);
		if (element.dom === null) {
			if (!element.id) {
				element.id = "sg-widget-" + (this.stackId);
			}
			element.dom = Drawer.generateDOM(element, this.DOM);
		}
		this.manageDragDropCallBacks(element);
		if (element.dom.parentNode.id != this.DOMId) {
			console.warn('You are trying to use elements outside the parent DOM element : #' + this.DOMId);
		}
		if (!element.dom) {
			console.warn('An Unknown problem appeared when trying to get or create the DOM on '+element.id);
			return false;
		}
		// the order over here is important, If this element has no valid starting positions OR there is no space on its current coordinates..
		if ((element.x == null && element.y == null) ||
			(element.x === undefined || element.y === undefined)){
			// let's bruteforce our hashmap to find something interesting
			this.setNewPosition(element);
		}
		this.hashtable.update(element);
		this.drawer.draw(element);

		console.info('Element', element, 'has been injected into the grid.');
		return true;
	}

  manageDragDropCallBacks(element) {
		this.drawer.removeDragDropAttributes(element);
		this.drawer.addDragDropAttributes(element, this.EVENTS, this);
		//
	}

	remove(element) {
		this.hashtable.remove(element);
		element.x = null;
		element.y = null;
		this.drawer.draw(element);
	}

	setNewPosition(element, pos) {
		let positions;
		if (typeof pos !== "undefined") {
			positions = pos;
		} else {
			positions = this.hashtable.findPosition(element.width, element.height);
		}
		if (!positions) {
			console.warn('There is no valid emplacement for this element');
			this.hashtable.remove(element);
			element.x = null;
			element.y = null;
			return false;
		}
		element.x = positions.x;
		element.y = positions.y;
		return true;
	}
}
