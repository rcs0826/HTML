define([
	'index'
], function(index) {
	boun005naFactory.$inject = ['$totvsresource'];
	function boun005naFactory($totvsresource) {
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun005na/:method/:id',{}, {});

		factory.getRecord = function (id, callback) {
			return this.TOTVSGet({id: id}, callback);
		};

		factory.getAllRecords = function(callback){
			return this.TOTVSQuery({limit:100},callback,{noErrorMessage: true});
		}
		return factory;
	}
	index.register.factory('mcc.boun005na.Factory', boun005naFactory); 
});
