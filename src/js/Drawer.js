/**
* Drawer class
* HTML Handler class
*/

class Drawer {
	constructor(config, DOM){
		console.info('Loading Drawer');
		this.config = config;
		this.DOM = DOM;
		let element = this.DOM.ref;
		// this.DOM.height = element.offsetHeight;
		// this.DOM.width = element.offsetWidth;
		this.DOM.DOMrect = this.DOM.ref.getBoundingClientRect();
		this.preview = undefined;
		this.hiddenDragImage = undefined;
		// console.log(this.DOM.DOMrect);
	}

	init(struct) {
		this.generateCSS(struct);
	}
	getDOM() {
		return this.DOM;
	}
	getHiddenDragImage() {
		if (typeof this.hiddenDragImage === "undefined") {
			this.hiddenDragImage = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
			this.hiddenDragImage.height = this.hiddenDragImage.width = 1;
			document.body.appendChild(this.hiddenDragImage);
		}
		return this.hiddenDragImage;
	}
	getPreview() {
		if (typeof this.preview === "undefined") {
			this.preview = {dom: document.createElementNS("http://www.w3.org/1999/xhtml", "canvas")};
			this.preview.height = this.preview.width = 0;
			this.preview.dom.addClass("preview");
			this.preview.dom.setAttribute("id", "preview-opacity");
			this.getDOM().ref.appendChild(this.preview.dom);
		}
		return this.preview;
	}
	generateCSS(struct) {
      let styles = '[sg-col="null"] { display:none;}\n[sg-row="null"] {display:none;}';
      /* generate CSS styles for cols */
      for (let i = struct.nHorizontal + 20; i >= 0; i--) {
          let col = ((i * this.config.blockWidth) + (i * this.config.marginWidth));
          styles += ('[sg-col="' + i + '"] { left:' +
              col + 'px; }\n');
      }
      /* generate CSS styles for rows */
      for (let i = struct.nVertical + 20; i >= 0; i--) {
          let row = ((i * this.config.blockHeight) + (i * this.config.marginHeight));
          styles += ('[sg-row="' + i + '"] { top:' +
              row + 'px; }\n');
      }

      for (let y = 1; y <= struct.nVertical + 20; y++) {
          styles += ('[sg-height="' + y + '"] { height:' +
              (y * this.config.blockHeight +
                  (y - 1) * (this.config.marginHeight)) + 'px; }\n');
      }

      for (let x = 1; x <= struct.nHorizontal + 20; x++) {
          styles += ('[sg-width="' + x + '"] { width:' +
              (x * this.config.blockWidth +
                  (x - 1) * (this.config.marginWidth)) + 'px; }\n');
      }
      //console.log(styles, 'calculated.');
      this.addStyleTag(styles);
  };
  static generateDOM(element, dom) {
  	var newDiv = document.createElement("div");
  	newDiv.setAttribute('id', element.id);
  	dom.ref.appendChild(newDiv);
  	return newDiv;
  }

	removeDragDropAttributes(element) {
		// check if this callbacks are available as attributes.
		// if yes, remove them .. we don't want any interference !
		element.dom.removeAttribute('ondragstart');
		element.dom.removeAttribute('ondrop');
		element.dom.removeAttribute('ondrag');
		element.dom.removeAttribute('ondragover');
		element.dom.removeAttribute('ondragexit');
		element.dom.removeAttribute('ondragend');
		element.dom.removeAttribute('ondragenter');
		element.dom.removeAttribute('ondragleave');
	}

	addDragDropAttributes(element, EVENTS, self) {
		var lastTime = 0;
		element.dom.addEventListener('drag', function(event) {
			// avoid to get too many events, because each time we modify DOM attributes
			if (Date.now() - lastTime > 50) {
				EVENTS.drag(self, event, element);
				lastTime = Date.now();
			}
		});
		element.dom.addEventListener('dragstart', function(event) {
			element.dom.addClass("dragging");
			EVENTS.dragstart(self, event, element);
		});
		element.dom.addEventListener('dragend', function(event) {
			element.dom.removeClass("dragging");
			EVENTS.dragend(self, event, element);
		});
	}

  draw(element) {
 //  	console.log('Adding attributes on element : ', element);
  	element.dom.setAttribute('sg-col', element.col);
  	element.dom.setAttribute('sg-row', element.row);
  	element.dom.setAttribute('sg-width', element.width);
  	element.dom.setAttribute('sg-height', element.height);
  	element.dom.setAttribute('class', 'sg-widget');
		if (element.hasOwnProperty('draggable') && element.draggable == true) {
			element.dom.setAttribute('draggable', true);
		}
  }

	posToPx(col, row) {
		// config = {blockWidth: 80, blockHeight: 80, marginHeight: 20, marginWidth: 20};
		// position {0, 0}u equals {0, 0}px
		let i = 0;
		var x, y;
		x = (col * this.config.blockWidth) + (Math.max(col - 1, 0) * this.config.marginWidth);
		y = (row * this.config.blockHeight) + (Math.max(row - 1, 0) * this.config.marginHeight);
		return {x:x, y:y};
	}

	pxToPos(x, y) {
		var col, row;

		col = (x - this.DOM.DOMrect.left) / (this.config.marginWidth + this.config.blockWidth);
		row = (y - this.DOM.DOMrect.top) / (this.config.marginHeight + this.config.blockHeight);
		// console.log("pxToPos : col=", Math.floor(col), "row=",Math.floor(row));
		return {col:Math.trunc(col), row:Math.trunc(row)};
	}

	addStyleTag(css) {
        let d = document;
        let tag = d.createElement('style');

        d.getElementsByTagName('head')[0].appendChild(tag);
        tag.setAttribute('type', 'text/css');
        if (tag.styleSheet) {
            tag.styleSheet.cssText = css;
        } else {
            tag.appendChild(document.createTextNode(css));
        }
    };
}
