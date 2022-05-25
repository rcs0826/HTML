define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	restrictionClassZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service', 'TOTVSEvent'];
	function restrictionClassZoomController($injector, $totvsresource, zoomService, dtsUtils, TOTVSEvent) {

		var service = {};
        
        angular.extend(service, zoomService);
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaurestrictionclass/:method/:id');
        service.zoomName = 'Classe Erro';
        service.setConfiguration('hrc.restrictionClassZoomController');
        service.idSearchMethod = 'getRestrictionClassByZoomId';
        service.applyFilterMethod = 'getRestrictionClassForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdClasseErro',
                type: 'integer',
                operator: '>='
            },{
                label: 'Descrição',
                property: 'dsClasseErro',
                type: 'string',
                default: true,
                operator: 'begins'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdClasseErro',
                width: 50,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsClasseErro',
                width: 200,
                minWidth: 100
            }
        ];

        service.validateSelectedValue = function(value){
            return true;
        };
        
        service.getObjectFromValue = function (value, fixedFilters) {     
            
            if(!value) return;
            
            var params = {};
            
            if(fixedFilters){
                var conversionParams = {};
                if(fixedFilters.hasOwnProperty('filters')){
                    conversionParams = {parameters: {init: fixedFilters}};
            	}else{
                    conversionParams = {parameters: {init: { filters : fixedFilters}}};
            	}
                
                params = dtsUtils.mountQueryProperties(conversionParams);
            }
            
            params.id = value;
            params.method = this.idSearchMethod;
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('hrc.restrictionClassZoomController', restrictionClassZoomController);

});