/**
* Drawer class
* HTML Handler class
*/
class Drawer {
	constructor(config){
		console.info('Loading Drawer');
		this.config = config;
	}

	init(struct) {
		this.generateCSS(struct);
	}

	generateCSS(struct) {
      let styles = '[sg-col="null"] { display:none;}\n[sg-row="null"] { display:none;}';
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
  static generateDOM(element, DOM) {
  	var newDiv = document.createElement("div");
  	newDiv.setAttribute('id', element.id);
  	DOM.ref.appendChild(newDiv);
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

	addDragDropAttributes(element, EVENTS) {
			element.dom.addEventListener('dragstart', function(event) {
				EVENTS.dragstart(event, element);
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
