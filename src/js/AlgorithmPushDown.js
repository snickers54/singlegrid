
/**
* Algorithm class
* The one who will decide who is going where when you drop an element on the grid..
*/

class AlgorithmPushDown extends Algorithm {
  constructor(grid, hashtable, drawer, config) {
    super(grid, hashtable, drawer, config);
  }
  run(event, element) {
    let positions = this.drawer.pxToPos(event.pageX, event.pageY);
    console.log("start collideElements");
    let collides = this.hashtable.collideElements(positions.col, positions.row, element.width, element.height);
    this.pushDown(collides, element, positions);
    this.stretchUp();
    //console.log(event.x, event.y, positions);
  }

  stretchUp() {
      console.log("start stretchup");
      let bool = false;
      for (let i = 0; i < this.grid.get().length; i++) {
          let obj = this.grid.get()[i];
          if (obj.row > 0 && !this.hashtable.collide(obj.col, obj.row - 1, obj.width, 1)) {
              console.log("CHECKING OBJECT POSITION : ", obj);
              this.hashtable.remove(obj);
              this.grid.setNewPosition(obj, {col:obj.col, row:obj.row - 1});
              this.hashtable.update(obj);
              this.drawer.draw(obj);
              bool = true;
          }
      }
      if (bool === true) {
          this.stretchUp();
      }
  }

  calculatePositions(collide, element, positions) {
    var row;
    row = positions.row + element.height;
    // if there is not enough place vertically, we add it, we don't care if there is scroll ..
    if (this.grid.isOutOfGrid({width:collide.width, height:collide.height, col:collide.col, row:row})) {
        this.hashtable.addRows(collide.height);
    }
    return {col:collide.col, row:row};
  }

  pushDown(collides, element, positions) {
    for (let i = 0; i < collides.length; i++) {
      let collide = collides[i];
      if (collide.dom == element.dom) {
          continue;
      }
      let newPos = this.calculatePositions(collide, element, positions);
      let array = this.hashtable.collideElements(newPos.col, newPos.row, collide.width, collide.height);
      this.hashtable.remove(collide);
      this.pushDown(array, collide, newPos);
    }
    this.grid.setNewPosition(element, positions);
    this.hashtable.update(element);
    this.drawer.draw(element);
  }
}
