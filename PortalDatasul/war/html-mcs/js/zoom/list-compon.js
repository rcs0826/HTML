define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmfg
     # Table...: lista-compon-item
     # Service.: serviceZoomListCompon
     # Register: mcs.listaCompon.zoom
     ####################################################################################################*/
    serviceZoomListCompon.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomListCompon($timeout, $totvsresource, $rootScope, $filter, zoomService){

        var service = {};

        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin482/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-lista-compon', undefined, 'dts/mcs');
        service.configuration  = true;
        service.advancedSearch = false;

        service.propertyFields = [
            {label: $rootScope.i18n('l-lista-compon', undefined, 'dts/mcs'), property: 'cod-lista-compon', type: 'string', maxlength: '16', default: true},
            {label: $rootScope.i18n('l-sequence', undefined, 'dts/mcs'), property: 'sequencia', type: 'integer', maxlength: '5'}
        ];

        service.columnDefs = [
            {headerName: $rootScope.i18n('l-sequence', undefined, 'dts/mcs'), field: 'sequencia', width: 150, minWidth: 80},
            {headerName: $rootScope.i18n('l-lista-compon', undefined, 'dts/mcs'), field: 'cod-lista-compon', width: 400, minWidth: 100}
        ];

		service.beforeQuery = function (queryproperties, parameters) {
			if(parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];

				if(parameters.init.filter) {
					for (var property in parameters.init.filter) {
						// Verifica se o usu�rio informou algum valor para a propriedade, se n�o, utiliza o valor padr�o (init)
						if(queryproperties.property.indexOf(property) < 0) {
							queryproperties.property.push(property);
							queryproperties.value.push(parameters.init.filter[property]);
						}
					}
				}
			}
		};

        /*
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao
         */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };

        service.getObjectFromValue =  function (value) {
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };


        return service;
    }

    index.register.service('mcs.listaCompon.zoom', serviceZoomListCompon);
});