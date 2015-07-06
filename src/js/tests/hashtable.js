describe('Init hashtable class', function(){
	beforeAll(function(){
		var DOM = {height:449, width:1916};
		this.hashtable = new Hashtable(DOM, {blockWidth: 80, blockHeight: 80, marginHeight: 20, marginWidth: 20});
		this.properties = this.hashtable.properties;
	});

	it('check instantiation hashtable', function(){
		expect(this.hashtable).toEqual(jasmine.any(Object));
	});

	it('check properties are well calculated', function(){
		expect(this.properties.nHorizontal).toBe(19);
		expect(this.properties.nVertical).toBe(4);
	});

	it('should impact the hashtable and putting some true ..', function(){
		var height = 2;
		var width = 2;
		this.hashtable.update({height:height, width:width, x:0, y:0});
		var table = this.hashtable.table;
		for (var i = 0; i < height; i++) {
			for (var j = 0; j < width; j++) {
				var row = table.get(i);
				expect(row).toBeDefined();
				var square = row.get(j);
				expect(square).toBe(true);
			}
		}
	});
});