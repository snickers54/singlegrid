
/**
* Algorithm class
* The one who will decide who is going where when you drop an element on the grid..
*/

const __ctors = {};

// abstract class, we don't anybody to instantiate this one ..
class Algorithm {
  constructor(grid, hashtable, drawer, config) {
    // so we tricks the best we can to avoid it :D Because real abstract pattern doesn't even exists in this language.
    if (new.target === Algorithm) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
    this.grid = grid;
    this.hashtable = hashtable;
    this.config = config;
    this.drawer = drawer;
  }

  static add(name, ctor) {
    __ctors[name] = ctor;
  }

  static init(name) {
    return __ctors[name];
  }

  run() {
    console.warn("Unfortunately, I won't do anything .. Please implement an algorithm to move objects the way you want");
  }
}
__ctors["Algorithm"] = Algorithm;
