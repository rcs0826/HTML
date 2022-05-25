define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFchmatenterquotations.$inject = ['$totvsresource'];
    function factoryFchmatenterquotations($totvsresource) {        
        var specificResources = {
            'setDefaultsQuotation': { // executa o método progress setDefaultsQuotation que preenhce as informações padrões
                method: 'POST',
                isArray: false,
                params: {pType: '@pType', // 
                         pFieldName: '@pFieldName', // 
                         ttQuotations: '@ttQuotations'}, // 
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/setDefaultsQuotation/'
            },
            'getSummaryPurchRequisition': { // Retorna as informações da ordem de compra
                method: 'GET',
                isArray: true,
                params: {pNrOrdem: '@pNrOrdem'}, // 
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/getSummaryPurchRequisition/'
            },
            'getTypeInformationDelivery': { // Retorna o que deve ser informado em tela quando o módulo de importação está implantado 
                method: 'GET',
                isArray: false,
                params: {nrRequisition: '@nrRequisition',
                         vendor: '@vendor'},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/getTypeInformationDelivery/'
            },
            'getDeliverySchedule': { //Buscar entregas de uma ordem de compra 
                method: 'GET',
                isArray: true,
                params: {pNrOrdem: '@pNrOrdem'},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/getDeliverySchedule/'
            },
            'getDeliveryScheduleList': { //Buscar entregas de várias ordens de compra 
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/getDeliveryScheduleList/'
            },
            'getMultipleRequisitions': { //Buscar múltiplas ordens
                method: 'GET',
                isArray: true,
                params: {pItCodigo: '@pItCodigo'},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/getMultipleRequisitions/'
            },
            'saveQuotation': { //salvar cotação
                method: 'POST',
                isArray: false,
                params: {   pType: '@pType', 
                            cCodEstabel: '@cCodEstabel', 
                            iNumPedido: '@iNumPedido'
                        },
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/saveQuotation/'
            },
            'getQuotationUpdate': { //busca as informações da tela quando for atualização de cotação
                method: 'GET',
                isArray: false,
                params: {   pNrOrdem: '@pNrOrdem',
                            pCodEmitente: '@pCodEmitente',
                            pItCodigo: '@pItCodigo',
                            pSeqCotac: '@pSeqCotac',
                            pAction: '@pAction'
                        },
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/getQuotationUpdate/'
            },
            'updateDeliverySchedule': { //busca as informações atualizadas das entregas
                method: 'POST',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/updateDeliverySchedule/'
            },
            'copyQuotation': { //busca as informações para tela quando for cópia de cotação
                method: 'GET',
                isArray: false,
                params: {   pNrOrdem: '@pNrOrdem',
                            pCodEmitente: '@pCodEmitente',
                            pItCodigo: '@pItCodigo',
                            pSeqCotac: '@pSeqCotac'
                        },
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/copyQuotation/'
            },
            'removeQuotations': { //Elimina cotações
                method: 'POST',
                isArray: true,
                params: {   ttDeleteQuotations: '@ttDeleteQuotations'},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/removeQuotations/'
            },
            'aproveQuotation': { //Aprova cotação
                method: 'POST',
                isArray: false,
                params: {ttQuotations: '@ttQuotations',
                         ttDeliverySchedule: '@ttDeliverySchedule'},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/aproveQuotation/'
            },
            'aproveMultipleQuotations': { //Aprova cotação em lote
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations/aproveMultipleQuotations/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatenterquotations', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.fchmatenterquotations.Factory', factoryFchmatenterquotations);
});

