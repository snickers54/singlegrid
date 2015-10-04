(function(window, document, undefined){
	window.onload = function () {
		var grid = new Grid('singlegrid');
		for (let i = 0; i < 10; i++) {
			grid.add({height:2, width:2});
		}

	};

})(window, document, undefined);

