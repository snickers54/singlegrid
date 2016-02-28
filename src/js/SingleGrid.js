(function(window, document, undefined){
	window.onload = function () {
		var grid;
		window.grid = grid = new Grid('singlegrid');
		grid.add({height:1, width:1, draggable:true, id:"1", drag:function(event){console.log("mydragstart", event);}})
		for (let i = 0; i < 10; i++) {
			grid.add({height:2, width:2, draggable:true});
		}

	};

})(window, document, undefined);
