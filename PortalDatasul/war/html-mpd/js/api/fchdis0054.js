define(['index',
		'less!/dts/mpd/assets/css/rulesoperationtype.less'
       ], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
	rulesoperationtypeFactory.$inject = ['$totvsresource'];
	function rulesoperationtypeFactory($totvsresource) {
         
		var specificResources = {
			'getRulesOperationType': {
				method: 'GET',
				isArray: true,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0054/rulesOperationType'
			},
			'putRulesOperationType': {
				method: 'PUT',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0054/updateRulesOperationType'
			},
			'deleteRulesOperationType': {
				method: 'PUT',
				isArray: false,
				params: {codParam: '@codParam'},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0054/delRulesOperationType/:codParam'
			},
			'postNewPrior': {
				method: 'POST',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0054/saveNewPrior'
			},
			'getParameters': {
				method: 'GET',
				isArray: true,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0054/getParameters'
			}
		}

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0054', {}, specificResources);
         
        return factory;
    }
         
	index.register.factory('mpd.rulesoperationtype.Factory', rulesoperationtypeFactory);


});