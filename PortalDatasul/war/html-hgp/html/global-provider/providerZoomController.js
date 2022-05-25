define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	providerZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function providerZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsauprovider/:method/:id');
        service.zoomName = 'Prestadores';
        service.setConfiguration('global.providerZoomController');
        service.idSearchMethod = 'getProviderByZoomId';
        service.applyFilterMethod = 'getProvidersForZoom';
        service.useCache = false;

        service.propertyFields = [
            {   label: 'Unidade',
                property: 'cdUnidade',
                type: 'integer'
            },{
                label: 'Código',
                property: 'cdUnidCdPrestador',
                type: 'integer'
            },{
                label: 'Código Inicial',
                property: 'cdPrestadorIni',
                type: 'integer'
            },{
                label: 'Nome',
                property: 'nmPrestador',
                type: 'string',
                operator: 'begins',
                default: true
            },{
                label: 'CPF ou CNPJ',
                property: 'nrCgcCpf',
                type: 'string'
                /*operator: '>='*/
           /*},{
                label: 'Especialidade',
                property: 'cdEspecialid',
                type: 'integer'*/
            },{
                label: 'Por Nome Abreviado',
                property: 'nomeAbrev',
                type: 'string',
                operator: 'begins'
            } ,{
                label: 'Conselho/Registro',
                property: 'cdConselho',
                type: 'string',
                operator: '>='
             },{
                label: 'Parte do Nome do Prestador',
                property: 'nmPartePrestador',
                type: 'string'          
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdUnidCdPrestador',
                width: 80,
                minWidth: 80
            },{
                headerName: 'Nome',
                field: 'nmPrestador',
                width: 150,
                minWidth: 100
            },{
                headerName: 'CPF / CNPJ',
                field: 'nrCgcCpf',
                width: 150,
                minWidth: 100
            } /*,{
                headerName: 'Conselho/Registro',
                field: 'cdConselho',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Parte do Nome',
                field: 'parteNmPrestador',
                width: 150,
                minWidth: 100
            }*/
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

    index.register.factory('global.providerZoomController', providerZoomController);

});
