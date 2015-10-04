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

	calculateGridSize() {
		this.struct.nHorizontal = Math.floor(this.DOM.width / (this.config.blockWidth + this.config.marginWidth));
		this.struct.nVertical = Math.floor(this.DOM.height / (this.config.blockHeight + this.config.marginHeight));
		console.info(this.struct.nVertical, 'blocks vertically', this.struct.nHorizontal, 'blocks horizontally.');
	}

	init() {
		if (!this.config.hasOwnProperty('blockWidth') || !this.config.hasOwnProperty('blockHeight') || 
			!this.config.hasOwnProperty('marginWidth') || !this.config.hasOwnProperty('marginHeight')) {
			return false;
		}
		this.calculateGridSize();

		this.updateHashtableSize();

		console.info('Hashtable : ', this.hashtable);
		return true;
	}

	updateHashtableSize() {
		// removing exceeding lines : 
		for (let y = 0; y < this.hashtable.size; y++) {
			if (this.hashtable.has(y)) {
				let size = this.hashtable.get(y).size;
				for (let x = this.struct.nHorizontal; x < size; x++) {
					let line = this.hashtable.get(y);
					line.set(x, false);
				}
			}
		}
		// starting to fill if necessary..
		for (let i = 0; i < this.struct.nVertical; i++) {
			let space = this.hashtable.get(i);
			if (!this.hashtable.has(i)) {
				space = new Map();
			}
			for (let j = 0; j < this.struct.nHorizontal; j++) {
				if (!space.has(j)) {
					space.set(j, false);
				}
			}
			let size = 0;
			for (let j = 0; j < space.size; j++) {
				if (space.get(j) == false) {size++;}
			}
			this.hashtable.set(i, space);
		}
	}


	update(element) {
		console.log("UPDATE ELEMENTS");
		if (!element.hasOwnProperty('x') || !element.hasOwnProperty('y')) {
			console.warn('Element', element, 'has no correct coordinates.');
			return false;
		}
		for (let y = element.y; y < element.y + element.height; y++) {
			let row = this.hashtable.get(y);
			let count = 0;
			if (row) {
				for (let x = element.x; x < element.x + element.width; x++) {
					count++;
					row.set(x, true);
				}
				console.log("row : ", y, row);
			}
		}
		console.log(this.hashtable);
		return true;
	}

	remove(element) {
		if (element.x == null || element.y == null) {
			return;
		}
		for (let y = element.y; y < element.y + element.height; y++) {
			let row = this.hashtable.get(y)
			if (!row) {continue;}
			for (let x = element.x; x < element.x + element.width; x++) {
				if (!row.get(x)) {continue;}
				row.set(x, false);
			}
		}
	}

	/*testSpace(element) {
		for (let y = element.y; y < element.y + element.height - 1; y++) {
			let line = this.hashtable.get(y);
			if (!line) {
				return false;
			}
			for (let x = element.x; x < element.x + element.width - 1; x++) {
				let col = line.get(x);
				if (col === true) {
					return false;
				}
			}
		}
		return true;
	}*/

	testLine(width, line, position) {
		let consecutiveCols = 0;
		for (let y = position; y < this.struct.nHorizontal; y++) {
			let col = line.get(y);
			consecutiveCols += 1;
			if (col === true) {
				consecutiveCols = 0;
				break;
			}
		}
		return (consecutiveCols >= width);
	}

	findPosition(width, height) {
		console.log("FIND POSITIONS");
		if (height > this.hashtable.size) {
			console.warn('The asked height is bigger than the grid height ..');
			return false;
		}
		let heightMax = height;
		// this while is a fucking trick, because I'm checking for x before y, which means it was going to fill from top to bottom instead of left to right
		// with this trick, I'm limiting my for with y, this is particularly ugly but working for now .. I don't want to reverse my hashtable (y / x)
		while (heightMax < this.struct.nVertical){
			for (let x = 0; x < this.struct.nHorizontal; x++) {
				let countLines = 0;
				for (let y = 0; y < heightMax; y++) {
					//console.log("SEARCHIN ON x:", x, "y:", y, "height:", height, "nVertical:",this.struct.nVertical, "sum : ", (y + height));
					let line = this.hashtable.get(y);
					if (!line) {
						continue;
					}
					if (this.testLine(width, line, x)) {
						countLines += 1;
					}
					if (countLines == height) {
						console.log("Found appropriate positon : ", x, y - (height - 1));
						return {x:x, y:y - (height - 1)};
					}
				}
			}
			heightMax++;
		}
		return null;
	}

}
