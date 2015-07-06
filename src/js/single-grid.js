/**
* Hashtable class 
* Optimization to get quickly a good position
*/

class Hashtable {
	constructor(DOM, config) {
		console.log('Initialized Hashtable');
		this.DOM = DOM;
		this.hashtable = new Map();
		this.config = config;
		this.struct = {};
		this.init();
	}

	get properties(){
		return this.struct;
	}

	get table(){
		return this.hashtable;
	}

	init() {
		if (!this.config.hasOwnProperty('blockWidth') || !this.config.hasOwnProperty('blockHeight') || 
			!this.config.hasOwnProperty('marginWidth') || !this.config.hasOwnProperty('marginHeight'))
		{
			return false;
		}
		this.struct.nHorizontal = Math.floor(this.DOM.width / (this.config.blockWidth + this.config.marginWidth));
		this.struct.nVertical = Math.floor(this.DOM.height / (this.config.blockHeight + this.config.marginHeight));
		console.info(this.struct.nVertical, 'blocks vertically', this.struct.nHorizontal, 'blocks horizontally.');

		for (let i = 0; i < this.struct.nVertical; i++) {
			let space = new Map();
			for (let j = 0; j < this.struct.nHorizontal; j++) {
				space.set(j, false);
			}
			this.hashtable.set(i, space);
		}
		console.info('Hashtable : ', this.hashtable);
		return true;
	}

	update(element) {
		if (!element.hasOwnProperty('x') || !element.hasOwnProperty('y')) {
			console.warn('Element', element, 'has no correct coordinates.');
		}
		for (let y = element.y; y < element.y + element.height; y++) {
			let row = this.hashtable.get(y);
			if (row) {
				for (let x = element.x; x < element.x + element.width; x++) {
					let col = row.get(x);
					row.set(x, true);
				}
			}
		}
	}

	findPosition() {
	}

}

/**
* Grid class 
* Main class of single grid ..
*/

class Grid {

	constructor(DOMId, config) {
		console.info('Loading singleGrid on', DOMId);
		this.DOM = {ref: document.getElementById(DOMId)};
		this.grid = [];
		this.config = config || {blockWidth: 80, blockHeight: 80, marginHeight: 20, marginWidth: 20};
		this.init();
	}

	add(element) {
		if (!element.hasOwnProperty('width') || !element.hasOwnProperty('height')) {
			console.warn('Element', element, 'has no correct size.');
			return false;
		}
		this.grid.push(element);
		this.hashtable.update(element);
		console.info('Element', element, 'has been injected into the grid.');
		return true;
	}

	init() {
		let element = this.DOM.ref;
		this.DOM.height = element.offsetHeight;
		this.DOM.width = element.offsetWidth;
		this.hashtable = new Hashtable(this.DOM, this.config);
		console.info(this.DOM.ref, 'is like this :', this.DOM);
	}
}



(function(window, document, undefined){
	window.onload = function () {
		var grid = new Grid('singlegrid');
		grid.add({height:5, width:10, x:0, y:0});
		grid.add({height:5, width:10, x:0, y:6});
	};

})(window, document, undefined);

