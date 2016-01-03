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
		this.DOM.height = element.offsetHeight;
		this.DOM.width = element.offsetWidth;
		this.DOM.DOMrect = this.DOM.ref.getBoundingClientRect();
		this.preview = undefined;
		console.log(this.DOM.DOMrect);
	}

	init(struct) {
		this.generateCSS(struct);
	}
	getDOM() {
		return this.DOM;
	}
	getPreview() {
		if (typeof this.preview === "undefined") {
			this.preview = document.createElementNS("http://www.w3.org/1999/xhtml", "canvas");
  		this.preview.width = this.preview.height = 1;
			document.body.appendChild(this.preview);
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
			element.dom.addEventListener('drag', function(event) {
				EVENTS.drag(event, element, self);
			});
			element.dom.addEventListener('dragstart', function(event) {
				EVENTS.dragstart(event, element, self);
			});
			element.dom.addEventListener('drop', function(event) {
				EVENTS.drop(event, element, self);
			});
	}

  draw(element) {
  	console.log('Adding attributes on element : ', element);
  	element.dom.setAttribute('sg-col', element.x);
  	element.dom.setAttribute('sg-row', element.y);
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
		console.log("pxToPos : col=", col, "row=",row);
		return {col:col, row:row};
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
