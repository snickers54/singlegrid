

/**
* Grid class
* Main class of single grid ..
*/

class Grid {

	constructor(DOMId, config) {
		console.info('Loading singleGrid on', DOMId);
		this.grid = [];
		this.stackId = 0;
		this.config = config || {blockWidth: 80, blockHeight: 80, marginHeight: 20, marginWidth: 20, algorithm:"AlgorithmPushDown", algorithmParams:[]};
		this.drawer = new Drawer(this.config, {ref: document.getElementById(DOMId), id:DOMId});
		this.hashtable = new Hashtable(this.config, this.drawer.getDOM());

		// Algorithm part :D
		Algorithm.add("AlgorithmPushDown", AlgorithmPushDown);
		let instance = Algorithm.init(this.config.algorithm);
		// like these varargs
		this.algorithm = new instance(this, this.hashtable, this.drawer, this.config, ...this.config.algorithmParams);
		this.drawer.init(this.hashtable.properties);
		this.DOM = this.drawer.getDOM();
		let context = this;
		window.addEventListener('resize', debounce(function(){context._resizing(context);}, 250));
		// console.info(this.drawer.getDOM().ref, 'is like this :', this.drawer.getDOM());

		this.EVENTS = {
			drag: this._drag,
			dragstart: this._dragstart,
			dragend: this._dragend,
		};
	}
	get() {
		return this.grid;
	}
	_drag(self, event, element) {
		// console.log(event);
		if (event.x != 0 && event.y != 0) {
			element.dom.style.top = (event.pageY  - element.mouse.y) + "px";
			element.dom.style.left = (event.pageX - element.mouse.x) + "px";

			let preview = self.drawer.getPreview();
			let positions = self.drawer.pxToPos(event.pageX, event.pageY);
			preview.col = positions.col;
			preview.row = positions.row;
			self.drawer.draw(preview);

			var collided = self.hashtable.collideElements(positions.col, positions.row, element.width, element.height);
			var old = document.getElementsByClassName("collide");
			// Don't forget getElementsByClassName return a LIVE collection, which means, when I'm removing the class collide, my collection changes ..
			// That's why I'm not using a basic for (var i =0; i < ...
			while (old.item(0) !== null) {old.item(0).removeClass("collide");}
			var toto = document.getElementsByClassName("collide");
			for (var i = 0; i < collided.length; i++) {
				var value = collided[i];
				value.dom.addClass("collide");
			}
			// Here we call our developer callback
			if (typeof element.drag === 'function') {
				element.drag(event);
			}
		}
	}

	_dragend(self, event, element) {
		element.dom.style.top = "";
		element.dom.style.left = "";

		let preview = self.drawer.getPreview();
		preview.col = null;
		preview.row = null;
		self.drawer.draw(preview);

		self.algorithm.run(event, element);

		// Here we call our developer callback
		if (typeof element.drop === 'function') {
			element.drop(event);
		}
	}

	_dragstart(self, event, element) {
		element.mouse = {x: event.layerX, y: event.layerY};
		event.dataTransfer.setDragImage(self.drawer.getHiddenDragImage(), 0, 0);
		self.hashtable.remove(element);

		let preview = self.drawer.getPreview();
		preview.width = element.width;
		preview.height = element.height;
		self.drawer.draw(preview);

		// Here we call our developer callback
		if (typeof element.dragstart === 'function') {
			element.dragstart(event);
		}
	}
	_resizing(context) {
		let element = context.drawer.getDOM().ref;
		context.drawer.getDOM().height = element.offsetHeight;
		context.drawer.getDOM().width = element.offsetWidth;
		context.hashtable.calculateGridSize();
		context.hashtable.updateSize();
		// console.info('Hashtable : ', context.hashtable);

		for (let i = 0; i < context.grid.length; i++) {
			let element = context.grid[i];
			if (context.isOutOfGrid(element) || element.col == null) {
				this.remove(element);
				if (context.setNewPosition(element)) {
					context.hashtable.update(element);
				}
				context.drawer.draw(element);
			} else {
				let pos = context.hashtable.findPosition(element.width, element.height);
				if (pos != null &&
						pos.col < element.row) {
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
		if (element.col + element.width > struct.nHorizontal ||
			element.row + element.height > struct.nVertical) {
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
		if (element.dom.parentNode.id != this.DOM.id) {
			console.warn('You are trying to use elements outside the parent DOM element : #' + this.DOM.id);
		}
		if (!element.dom) {
			console.warn('An Unknown problem appeared when trying to get or create the DOM on '+element.id);
			return false;
		}
		// the order over here is important, If this element has no valid starting positions OR there is no space on its current coordinates..
		if ((element.col == null && element.row == null) ||
			(element.col === undefined || element.row === undefined)){
			// let's bruteforce our hashmap to find something interesting
			this.setNewPosition(element);
		}
		this.hashtable.update(element);
		this.drawer.draw(element);

		// console.info('Element', element, 'has been injected into the grid.');
		return true;
	}

  	manageDragDropCallBacks(element) {
		this.drawer.removeDragDropAttributes(element);
		this.drawer.addDragDropAttributes(element, this.EVENTS, this);
		//
	}

	remove(element) {
		this.hashtable.remove(element);
		element.col = null;
		element.row = null;
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
			element.col = null;
			element.row = null;
			return false;
		}
		element.col = positions.col;
		element.row = positions.row;
		return true;
	}
}
