define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
	'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    documentZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service', '$rootScope'];
    function documentZoomController($injector, $totvsresource, zoomService, dtsUtils, $rootScope) {

	var service = {};
        
        angular.extend(service, zoomService);

        service.resource =  $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaudocuments/:method/:id');
        service.zoomName = 'Documentos';
        service.setConfiguration('hrc.documentZoomController');
        service.idSearchMethod = 'getDocumentByZoomId';
        service.applyFilterMethod = 'getDocumentsForZoom';
        service.useCache = false;
        service.advancedSearch = true;
        service.isAdvanced = true;
        service.isAdvancedSearchOpen = false;

        service.propertyFields = [
            {   label: 'Unid. Prest/Trans/Série/Número/Seq',
                property: 'cdChaveDocumento',
                type: 'string',
                default: true,
                isAvaiableInAdvancedSearch: false
            },{
                label: 'Beneficiário',
                property: 'cdUnidCdCarteiraUsuarioZoom',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Prestador',
                property: 'cdUnidCdPrestadorPrincipalZoom',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Fatura (Ano/Série/Número)',
                property: 'aaFaturaCdSerieNfCodFaturAp',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Lote de Importação (Lote/Sequência)',
                property: 'nrLoteNrSequencia',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Ano',
                property: 'dtAnoref',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Período',
                property: 'nrPerref',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Data Inicial Emissão',
                property: 'dtInicioDigitacao',
                type: 'date',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Data Final Emissão',
                property: 'dtFimDigitacao',
                type: 'date',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Data Inicial Internação',
                property: 'dtInicioInternacao',
                type: 'date',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Data Final Internação',
                property: 'dtFimInternacao',
                type: 'date',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Unidade Prestadora',
                property: 'cdUnidadePrestadora',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Transação',
                property: 'cdTransacao',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Série',
                property: 'nrSerieDocOriginal',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Documento',
                property: 'nrDocOriginal',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Sequência',
                property: 'nrDocSistema',
                type: 'string',
                isAvaiableInSimpleSearch: false
            },{
                label: 'Autorização (Ano/Número)',
                property: 'aaNrGuiaAtendimentoZoom',
                type: 'string',
                isAvaiableInSimpleSearch: false
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Unidade Prestadora',
                field: 'cdUnidadePrestadora',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Transação',
                field: 'cdTransacao',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Série',
                field: 'nrSerieDocOriginal',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Número',
                field: 'nrDocOriginal',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Sequência',
                field: 'nrDocSistema',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Período',
                field: 'rotuloPeriodo',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Beneficiário',
                field: 'rotuloBenef',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Prestador Principal',
                field: 'rotuloPrestador',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Internação',
                field: 'rotuloInternacao',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Autorização',
                field: 'rotuloAutorizacao',
                width: 150,
                minWidth: 100
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

        if ($rootScope.currentuserLoaded) {
            validateInput();
        };
            
        return service;
    }

    index.register.factory('hrc.documentZoomController', documentZoomController);

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
                if (input.getAttribute('placeholder') != "Fatura (Ano/Série/Número)"
                 && input.getAttribute('placeholder') != "Lote de Importação (Lote/Sequência)"
                 && input.getAttribute('placeholder') != "Série"
                 && input.getAttribute('placeholder') != "Autorização (Ano/Número)") {
                    $(input).keypress(
                        function (event) { 
                            hasOnlyNumbers(event);
                        }
                    );
                }
                if(input.getAttribute('placeholder') == "Autorização (Ano/Número)"){
                    $(input).keypress(
                        function (event) { 
                            hasOnlyNumbersOrBar(event);
                        }
                    );
                }
            });
        }
    );
}

function hasOnlyNumbers (event) {
    var key = event.keyCode || event.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\./;
    if(!regex.test(key)) {
        event.returnValue = false;
        if(event.preventDefault) event.preventDefault();
    }
}

function hasOnlyNumbersOrBar (event) {
    var key = event.keyCode || event.which;
    key = String.fromCharCode(key);
    var regex = /[0-9]|\//;
    if(!regex.test(key)) {
        event.returnValue = false;
        if(event.preventDefault) event.preventDefault();
    }
}