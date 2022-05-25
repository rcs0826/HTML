define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
	zoomMpdFactory.$inject = ['$totvsresource'];
	function zoomMpdFactory($totvsresource) {
         
		var specificResources = {

			/*Serviço para retornar a definição de um zoom especifico*/
			'getZoomMpdDefinitions': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0056/zoomMpdDefinitions/:database/:table/:fieldcode/:fielddescription',
				params: {database: '@database', table: '@table', fieldcode: '@fieldcode', fielddescription: '@fielddescription'}
			},

			/*Serviço para retornar uma lista de dados para um zoom especifico*/
			'getZoomMpdData': {
				method: 'GET',
				isArray: true,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0056/zoomMpdData',
				params: {}
			},

			/*Serviço para retornar descrição de um valor informado no campo de um zoom especifico*/
			'getZoomMpdDescriptionValue': {
				method: 'GET',
				isArray: false,
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0056/zoomMpdDescriptionValue',
				params: {database: '@database', table: '@table', fieldcode: '@fieldcode', fielddescription: '@fielddescription', valuecode: '@valuecode'},
				headers: {noCountRequest: false }
			}

		}

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0056', {}, specificResources);
         
        return factory;
    }


	function getUrlEncode (value) {

		if(value != true || value != false){
			value = window.encodeURIComponent(value);
			value = replaceAllString(value, '.', '%2E');
		}

		console.log('value: ', value);

		return value;
	};

	function replaceAllString(str, find, replace) {
		return str.replace(find, replace);
	}
         
	index.register.factory('mpd.fchdis0056.Factory', zoomMpdFactory);

});



