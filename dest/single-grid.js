/**
* Hashtable class 
* Optimization to get quickly a good position
*/

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Hashtable = (function () {
	function Hashtable(DOM, config) {
		_classCallCheck(this, Hashtable);

		console.log('Initialized Hashtable');
		this.DOM = DOM;
		this.hashtable = new Map();
		this.config = config;
		this.struct = {};
		this.init();
	}

	_createClass(Hashtable, [{
		key: 'init',
		value: function init() {
			if (!this.config.hasOwnProperty('blockWidth') || !this.config.hasOwnProperty('blockHeight') || !this.config.hasOwnProperty('marginWidth') || !this.config.hasOwnProperty('marginHeight')) {
				return false;
			}
			this.struct.nHorizontal = Math.floor(this.DOM.width / (this.config.blockWidth + this.config.marginWidth));
			this.struct.nVertical = Math.floor(this.DOM.height / (this.config.blockHeight + this.config.marginHeight));
			console.info(this.struct.nVertical, 'blocks vertically', this.struct.nHorizontal, 'blocks horizontally.');

			for (var i = 0; i < this.struct.nVertical; i++) {
				var space = new Map();
				for (var j = 0; j < this.struct.nHorizontal; j++) {
					space.set(j, false);
				}
				this.hashtable.set(i, space);
			}
			console.info('Hashtable : ', this.hashtable);
			return true;
		}
	}, {
		key: 'update',
		value: function update(element) {
			if (!element.hasOwnProperty('x') || !element.hasOwnProperty('y')) {
				console.warn('Element', element, 'has no correct coordinates.');
			}
			for (var y = element.y; y < element.y + element.height; y++) {
				var row = this.hashtable.get(y);
				if (row) {
					for (var x = element.x; x < element.x + element.width; x++) {
						var col = row.get(x);
						row.set(x, true);
					}
				}
			}
		}
	}, {
		key: 'findPosition',
		value: function findPosition() {}
	}, {
		key: 'properties',
		get: function get() {
			return this.struct;
		}
	}, {
		key: 'table',
		get: function get() {
			return this.hashtable;
		}
	}]);

	return Hashtable;
})();

/**
* Grid class 
* Main class of single grid ..
*/

var Grid = (function () {
	function Grid(DOMId, config) {
		_classCallCheck(this, Grid);

		console.info('Loading singleGrid on', DOMId);
		this.DOM = { ref: document.getElementById(DOMId) };
		this.grid = [];
		this.config = config || { blockWidth: 80, blockHeight: 80, marginHeight: 20, marginWidth: 20 };
		this.init();
	}

	_createClass(Grid, [{
		key: 'add',
		value: function add(element) {
			if (!element.hasOwnProperty('width') || !element.hasOwnProperty('height')) {
				console.warn('Element', element, 'has no correct size.');
				return false;
			}
			this.grid.push(element);
			this.hashtable.update(element);
			console.info('Element', element, 'has been injected into the grid.');
			return true;
		}
	}, {
		key: 'init',
		value: function init() {
			var element = this.DOM.ref;
			this.DOM.height = element.offsetHeight;
			this.DOM.width = element.offsetWidth;
			this.hashtable = new Hashtable(this.DOM, this.config);
			console.info(this.DOM.ref, 'is like this :', this.DOM);
		}
	}]);

	return Grid;
})();

(function (window, document, undefined) {
	window.onload = function () {
		var grid = new Grid('singlegrid');
		grid.add({ height: 5, width: 10, x: 0, y: 0 });
		grid.add({ height: 5, width: 10, x: 0, y: 6 });
	};
})(window, document, undefined);