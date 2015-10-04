describe('Init hashtable class', function(){
	beforeAll(function(){
		var DOM = {height:449, width:1916};
		this.hashtable = new Hashtable(DOM, {blockWidth: 80, blockHeight: 80, marginHeight: 20, marginWidth: 20});
		this.properties = this.hashtable.properties;
		this.height = 2;
		this.width = 2;
		this.x = 0;
		this.y = 0;
	});

	it('check instantiation hashtable', function(){
		expect(this.hashtable).toEqual(jasmine.any(Object));
	});

	it('check properties are well calculated', function(){
		expect(this.properties.nHorizontal).toBe(19);
		expect(this.properties.nVertical).toBe(4);
	});

	it('should impact the hashtable and putting some true ..', function(){
		this.hashtable.update({height:this.height, width:this.width, x:this.x, y:this.y, id:"1"});
		var table = this.hashtable.table;
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				var row = table.get(i);
				expect(row).toBeDefined();
				var square = row.get(j);
				expect(square).toBe(true);
			}
		}
	});
	it('should see there is no place', function(){
		var line = this.hashtable.table[this.y];
		var bool = this.hashtable.testLine(this.width, line, this.x);
		expect(bool).toBe(false);
	});
});