define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
    # Database: mgind
    # Table...: tipo-per
    # Service.: serviceTipoPerZoom
    # Register: mpl.tipo-per.zoom
    ####################################################################################################*/
	serviceTipoPerZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceTipoPerZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var service = {};

		angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin436/:method/:id', {}, {});
		service.zoomName = "l-type-plan";
		service.configuration = false;
		service.propertyFields = [

          	{label: 'l-type', property: 'cd-tipo', type:'integerrange',  default: true},
          	{label: 'l-description', property: 'descricao', type:'stringextend'},
          	{label: 'l-days',property: 'nr-dia', type:'integerrange'},
          	{label: 'l-periodicity',property: 'int-1', type:'integerrange'},
          	{label: 'l-type-management-period', property: 'log-periodo-gerc',
          		propertyList: [
  		               {id: 1, name: $rootScope.i18n('l-yes', undefined, 'dts/mpl'), value: true},
          	           {id: 0, name: $rootScope.i18n('l-no', undefined, 'dts/mpl'), value: false}
  		        ]
          	}
        ];

		service.columnDefs = [

            {headerName: $rootScope.i18n('l-type', undefined, 'dts/mpl'), field: 'cd-tipo'},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mpl'),field: 'descricao'},
            {headerName: $rootScope.i18n('l-days', undefined, 'dts/mpl'), field: 'nr-dia'},
            {headerName: $rootScope.i18n('l-periodicity', undefined, 'dts/mpl'),field: 'int-1'},
            {headerName: $rootScope.i18n('l-type-management-period', undefined, 'dts/mpl'), field: 'log-periodo-gerc',
            	valueGetter: function(params){
            		return service.legend.logical(params.data['log-periodo-gerc']);
            	}
            }
    	];


        service.getObjectFromValue = function (value) {

        	if (isNaN(intValue)) return undefined;

            return this.resource.TOTVSGet({
            	id: value
        	}, undefined , {
        		noErrorMessage: true
        	}, true);
        };

        service.periodTypeList = [];
        service.getPeriodType = function (value, init) {
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (init) {
                parameters.init = init;

                if (parameters.init.noCount === undefined) {
                   parameters.init.noCount = false;
              }
            }

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "cd-tipo",
                type: "integer",
                extend: 1,
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.periodTypeList = result;

            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
        };

		return service;

	}
	index.register.service('mpl.tipo-per.zoom', serviceTipoPerZoom);

});