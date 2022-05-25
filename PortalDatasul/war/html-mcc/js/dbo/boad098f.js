define([
	'index'
], function(index) {
	boad098fFactory.$inject = ['$totvsresource'];
	function boad098fFactory($totvsresource) {
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad098f/:method/:id',{}, {});

		factory.getRecord = function (id, callback) {
			return this.TOTVSGet({method:'gotocodemitente', id: id}, callback);
		};
		return factory;
	}
	index.register.factory('mcc.boad098f.Factory', boad098fFactory); 
});