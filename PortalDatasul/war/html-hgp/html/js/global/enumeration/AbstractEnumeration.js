
var AbstractEnumeration = {

	/* getLabelByKey */
	getLabelByKey : function(key){
		var label = "";
		
		angular.forEach(this.ENUMERATION_VALUES, function(item) {
			if(key === item.data){
				label =  item.label;
			}
		});
		
		return label;
	},

	/* getIndexByKey */
	getIndexByKey : function (key) {
		for(var i = 0; i < this.ENUMERATION_VALUES.length; i++){
			if(this.ENUMERATION_VALUES[i].data == key){
				return i;
			}
		}
		return -1;
	}
	

};