/**
* Hashtable class
* Optimization to get quickly a good position
*/
class Hashtable {
	constructor(config, DOM) {
		// console.log('Initialized Hashtable');
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
		this.struct.nHorizontal = Math.floor(this.DOM.DOMrect.width / (this.config.blockWidth + this.config.marginWidth));
		this.struct.nVertical = Math.floor(this.DOM.DOMrect.height / (this.config.blockHeight + this.config.marginHeight));
		//console.info(this.struct.nVertical, 'blocks vertically', this.struct.nHorizontal, 'blocks horizontally.');
	}
	addRows(n) {
		this.struct.nVertical += n;
		this.updateSize();
	}
	init() {
		if (!this.config.hasOwnProperty('blockWidth') || !this.config.hasOwnProperty('blockHeight') ||
			!this.config.hasOwnProperty('marginWidth') || !this.config.hasOwnProperty('marginHeight')) {
			return false;
		}
		this.calculateGridSize();

		this.updateSize();

		// console.info('Hashtable : ', this.hashtable);
		return true;
	}

	updateSize() {
		// removing exceeding lines :
		for (let y = 0; y < this.hashtable.size; y++) {
			if (this.hashtable.has(y)) {
				let line = this.hashtable.get(y);
				for (let x = this.struct.nHorizontal; x < line.size; x++) {
					line.set(x, undefined);
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
					space.set(j, undefined);
				}
			}
			let size = 0;
			for (let j = 0; j < space.size; j++) {
				if (space.get(j) == false) {size++;}
			}
			this.hashtable.set(i, space);
		}
	}
  /*return a reference to the object found or undefined :D */
	getElement(x, y) {
		if (!this.hashtable.has(y)) return undefined;
		let row = this.hashtable.get(y);
		return row.get(x);
	}

	update(element) {
		// console.log("UPDATE ELEMENTS");
		if (!element.hasOwnProperty('col') || !element.hasOwnProperty('row')) {
			console.warn('Element', element, 'has no correct coordinates.');
			return false;
		}
		for (let y = element.row; y < element.row + element.height; y++) {
			let row = this.hashtable.get(y);
			let count = 0;
			if (row) {
				for (let x = element.col; x < element.col + element.width; x++) {
					count++;
					row.set(x, element);
				}
				//console.log("row : ", y, row);
			}
		}
		//console.log(this.hashtable);
		return true;
	}

	remove(element) {
		if (element.col == null || element.row == null) {
			return;
		}
		for (let y = element.row; y < element.row + element.height; y++) {
			let row = this.hashtable.get(y)
			if (!row) {continue;}
			for (let x = element.col; x < element.col + element.width; x++) {
				if (!row.get(x)) {continue;}
				row.set(x, undefined);
			}
		}
	}

	collideElements(x, y, width, height) {
		var array = [];
		for (let row = y; row < y + height; row++) {
			let line = this.hashtable.get(row);
			if (!line) {break;}
			//console.log(y, row, line);
			for (let col = x; col < x + width; col++) {
				let element = line.get(col);
				if (element !== undefined && !objectExists(array, element)) {
					array.push(element);
				}
			}
		}
		return array;
	}

	collide(x, y, width, height) {
		for (let row = y; row < y + height; row++) {
			let line = this.hashtable.get(row);
			if (line && this.testLine(width, line, x) == false) {
				return true;
			}
		}
		return false;
	}

	testLine(width, line, position) {
		let consecutiveCols = 0;
		for (let y = position; y < this.struct.nHorizontal && y < position + width; y++) {
			let col = line.get(y);
			consecutiveCols += 1;
			if (col !== undefined) {
				consecutiveCols = 0;
				break;
			}
		}
		return (consecutiveCols >= width);
	}

	findPosition(width, height) {
		if (height > this.hashtable.size) {
			// console.warn('The asked height is bigger than the grid height ..');
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
					if (!line) {continue;}
					if (this.testLine(width, line, x)) {
						countLines += 1;
					}
					if (countLines == height) {
						// console.log("Found appropriate positon : ", x, y - (height - 1));
						return {col:x, row:y - (height - 1)};
					}
				}
			}
			heightMax++;
		}
		return null;
	}

}
