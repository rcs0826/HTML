define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {
    financialDocumentKindZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function financialDocumentKindZoomController($injector, $totvsresource, zoomService, dtsUtils) {
        var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsaufinancialdocumentkind/:method/:id');
        service.zoomName = 'Espécie Financeira';
        service.setConfiguration('global.financialDocumentKindZoomController');
        service.idSearchMethod = 'getFinancialDocumentKindByZoomId';
        service.applyFilterMethod = 'getFinancialDocumentKindForZoom';
        service.useCache = false;        

        service.propertyFields = [
            {
                label: 'Código',
                property: 'codEspecDocto',
                type: 'string',
                operator: 'begins',
                default: true
            },            
            {
                label: 'Descrição',
                property: 'desEspecDocto',
                type: 'string',
                operator: 'begins'
            },
            {
                label: 'Tipo',
                property: 'indTipEspecDocto',
                type: 'string',
                operator: 'begins'
            }            
        ];        

        service.columnDefs = [
            {   
                headerName: 'Código',
                field: 'financialDocumentKindCode',
                width: 80,
                minWidth: 80
            },
            {
                headerName: 'Descrição',
                field: 'financialDocumentKindDescription',
                width: 150,
                minWidth: 150
            },
            {
                headerName: 'Tipo',
                field: 'financialDocumentKindType',
                width: 80,
                minWidth: 80
            }
        ];        

        // Buscar descricoes (input)
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
            
            params.id = encodeURIComponent(value);
            params.method = this.idSearchMethod;

            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };

        service.getSelectResultList = function (value, fixedFilters, callback) {     
                
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
            
            params.id = encodeURIComponent(value);
            params.method = this.idSearchMethod;

            return this.resource.TOTVSGet(params, function(result) {
                if (callback && angular.isFunction(callback)) {
                    callback(result);
                }
            }, {
                noErrorMessage: service.noErrorMessage
            }, service.useCache);
        };

        return service;
    }

    index.register.factory('global.financialDocumentKindZoomController', financialDocumentKindZoomController);

});