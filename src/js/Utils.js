// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

function objectExists(array, object) {
	for (let i = 0; i < array.length; i++) {
		if (array[i] == object) return true;
	}
	return false;
}

function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last,
      deferTimer;
  return function () {
    var context = scope || this;

    var now = +new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

HTMLElement.prototype.addClass = function(newClass) {
	var classes = this.className.split(" ");
	for (var i = 0; i < classes.length; i++) {
		if (classes[i] == newClass) {
			return;
		}
	}
	this.className += " " + newClass;
};

HTMLElement.prototype.removeClass = function(remove) {
    var newClassName = "";
	var classes = this.className.split(" ");
	for (var i = 0; i < classes.length; i++) {
        if (classes[i] !== remove) {
            newClassName += classes[i] + ((i < classes.length - 1) ? "" : " ");
        }
    }
    this.className = newClassName;
};
