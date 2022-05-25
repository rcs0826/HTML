define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

        tituPrestZoomController.$inject = ['$rootScope', '$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
        function tituPrestZoomController($rootScope, $injector, $totvsresource, zoomService, dtsUtils) {

            var service = {};
            
            angular.extend(service, zoomService);

            service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsauhppglobal/:method/:id');
            service.zoomName       = 'Títulos dos Prestadores';
            service.setConfiguration('hpp.tituPrestZoomController');
            service.applyFilterMethod = 'getTituPrestForZoom';
            service.idSearchMethod = 'getTituPrestByZoomId';
            service.useCache = false;
            service.isAdvanced = true;
            service.isSelectValue = true;
            //service.useSearchMethod = true;

            service.propertyFields = [
                {
                    label: 'Código Inicial do Prestador',
                    property: 'cdPrestadorIni',
                    type: 'integer',
                    default: true,
                    value: "1"
                },
                {
                    label: 'Código do Prestador',
                    property: 'cdPrestador',
                    type: 'integer',
                    value: ""
                },
                {
                    label: 'Espécie',
                    property: 'codEsp',
                    type: 'string',
                    value: ""
                },
                {
                    label: 'Título',
                    property: 'codDoctoAp',
                    type: 'integer',
                    value: ""
                }
            ];
        
            service.columnDefs = [
                {   headerName: 'Unidade', 
                    field: 'cdUnidade', 
                    width: 30
                },
                {
                    headerName: 'Cód. Prestador', 
                    field: 'cdUnidCdPrestador', 
                    width: 100
                },
                /*{
                    headerName: 'Data Produção', 
                    field: 'dtProducao',
                    width: 60, 
                    minWidth: 100,
                    valueGetter: function(params) {
                        return (new Date(params.data.dtProducao)).toLocaleDateString();
                    }
                },*/
                {
                    headerName: 'Espécie', 
                    field: 'codEsp', 
                    width: 30
                },
                {
                    headerName: 'Título', 
                    field: 'codDoctoAp', 
                    width: 100
                },
                {
                    headerName: 'Parc.', 
                    field: 'parcela', 
                    width: 30
                }
            ];

            // Buscar descrições (input)
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
                
                return this.resource.TOTVSGet(params, undefined, {noErrorMessage: false}, true);
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

    index.register.factory('hpp.tituPrestZoomController', tituPrestZoomController);

});

