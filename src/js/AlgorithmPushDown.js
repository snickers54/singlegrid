
/**
* Algorithm class
* The one who will decide who is going where when you drop an element on the grid..
*/

class AlgorithmPushDown extends Algorithm {
  constructor(grid, hashtable, drawer, config) {
    super(grid, hashtable, drawer, config);
  }
  run(event, element) {
    let positions = this.drawer.pxToPos(event.x, event.y);
    console.log("start collideElements");
    let collides = this.hashtable.collideElements(positions.col, positions.row, element.width, element.height);
    this.pushDown(collides, element, positions);
    //console.log(event.x, event.y, positions);
  }

  calculatePositions(element, positions, collide) {
    var row;
    if (collide.row > positions.row) {
      row = collide.row + ((positions.row + element.height) - collide.row);
    } else if (collide.row == positions.row) {
      row = collide.row + element.height;
    } else {
      row = (positions.row + element.height) + (collide.row + collide.height - element.row);
    }

    return {col:collide.col, row:Math.abs(row)};
  }

  pushDown(collides, element, positions) {
    console.log("pushDown : ", collides, element, positions);
    for (let i = 0; i < collides.length; i++) {
      let collide = collides[i];
      let newPos = this.calculatePositions(element, positions, collide);
      let array = this.hashtable.collideElements(newPos.col, newPos.row, collide.width, collide.height);
      this.pushDown(array, collide, newPos);
    }
    this.grid.setNewPosition(element, positions);
    this.hashtable.update(element);8
    this.drawer.draw(element);
  }
}
