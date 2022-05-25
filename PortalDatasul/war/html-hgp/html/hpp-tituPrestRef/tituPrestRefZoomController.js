define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

        tituPrestRefZoomController.$inject = ['$rootScope', '$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
        function tituPrestRefZoomController($rootScope, $injector, $totvsresource, zoomService, dtsUtils) {

            var service = {};
            
            angular.extend(service, zoomService);

            service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsauhppglobal/:method/:id');
            service.zoomName       = 'Referência dos Títulos do Prestador';
            service.setConfiguration('hpp.tituPrestRefZoomController');
            service.applyFilterMethod = 'getTituPrestRefForZoom';
            service.idSearchMethod = 'getTituPrestRefByZoomId';
            service.useCache = false;
            service.advancedSearch = true;
            service.isAdvanced = true;
            service.isAdvancedSearchOpen = false;

            service.propertyFields = [
                {   label: 'Unidade',
                    property: 'cdUnidade',
                    type: 'integer',
                    isAvaiableInSimpleSearch: true,
                    isAvaiableInAdvancedSearch: false,
                    default: true,
                    value: ""
                }, {
                    label: 'Unidade',
                    property: 'cdUnidade',
                    type: 'string',
                    isAvaiableInSimpleSearch: false,
                    value: ""
                }, {
                    label: 'Unidade da Prestadora',
                    property: 'cdUnidadePrestador',
                    type: 'string',
                    isAvaiableInSimpleSearch: false,
                    value: ""
                }, {
                    label: 'Tipo de Medicina',
                    property: 'cdTipoMedicina',
                    type: 'string',
                    isAvaiableInSimpleSearch: false,
                    value: ""
                }, {
                    label: 'Código do Prestador',
                    property: 'cdPrestador',
                    type: 'integer',
                    isAvaiableInSimpleSearch: true,
                    isAvaiableInAdvancedSearch: false,
                    value: ""
                }, {
                    label: 'Código do Prestador',
                    property: 'cdPrestador',
                    type: 'string',
                    isAvaiableInSimpleSearch: false,
                    value: ""
                }, {
                    label: 'Ano',
                    property: 'dtAnoref',
                    type: 'string',
                    isAvaiableInSimpleSearch: false,
                    value: ""
                }, {
                    label: 'Mês',
                    property: 'nrPerref',
                    type: 'string',
                    isAvaiableInSimpleSearch: false,
                    value: ""
                }, {
                    label: 'Referência Inicial',
                    property: 'referencia',
                    type: 'string',
                    isAvaiableInSimpleSearch: false,
                    value: ""
                }
            ];
        
            service.columnDefs = [
                {   headerName: 'Unidade', 
                    field: 'cdUnidade', 
                    width: 50, 
                    minWidth: 100
                }, {
                    headerName: 'Referência', 
                    field: 'referencia', 
                    width: 150, 
                    minWidth: 100
                }, {
                    headerName: 'Data Produção', 
                    field: 'dtProducao',
                    width: 60, 
                    minWidth: 100,
                    valueGetter: function(params) {
                        return (new Date(params.data.dtProducao)).toLocaleDateString();
                    }
                }, {
                    headerName: 'Ano Período', 
                    field: 'dtAnoref', 
                    width: 60, 
                    minWidth: 100
                }, {
                    headerName: 'Período', 
                    field: 'nrPerref', 
                    width: 60, 
                    minWidth: 100
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

        return service;
    }

    index.register.factory('hpp.tituPrestRefZoomController', tituPrestRefZoomController);

});

/*
 * Esta função foi criada pois o filtro da busca avançada do THF não funciona se o type dos propertyFields for inteiro, 
 * sendo assim, o bloqueio de caracteres não numérico na entrada dos dados é feito manualmente
 */
function validateInput() {
    if ($(".zoom-advanced-search a").length == 0) {
        setTimeout(function() {
            validateInput() }, 100
        );
    }
    $(".zoom-advanced-search a").click(
        function () {
            var inputs = $("input[name=filter_value]");
            angular.forEach(inputs, function (input) {
                if (input.getAttribute('placeholder') != "Referência Inicial") {
                    $(input).keypress(
                        function (event) { 
                            onlyNumbers(event);
                        }
                    );
                }
            });
        }
    );
}

function onlyNumbers (event) {
    var key = event.keyCode || event.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if(!regex.test(key)) {
        event.returnValue = false;
        if(event.preventDefault) event.preventDefault();
    }
}
