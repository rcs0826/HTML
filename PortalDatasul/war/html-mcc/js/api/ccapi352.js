define([
	'index',
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################    
    function factoryOrderLineDetail($totvsresource) {
    
        var specificResources = {
            'purchaseOrderLineDetails': { // Retorna os detalhes de uma ordem de compra
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/purchaseOrderLineDetails/',
                params: {pNrOrdem: '@pNrOrdem',   // Número da ordem de compra
                         pDate: '@pDate',         // Data da cotação para conversão
                         pCurrency: '@pCurrency'} // Código da moeda para conversão
            }   ,
            'orderLineQuoteDetail': { // Retorna os detalhes de uma cotação da ordem de compra
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/getQuoteDetail/',
                params: {pNrOrdem: '@pNrOrdem',         // Número da ordem compra
                         pCodEmitente: '@pCodEmitente', // Código do emitente
                         pItCodigo: '@pItCodigo',       // Código do item
                         pSeqCotac: '@pSeqCotac',       // Sequência da cotação
                         pDate: '@pDate',               // Data da cotação para conversão
                         pCurrency: '@pCurrency'}       // Código da moeda para conversão
            },
            'getListOrderlines': { // Retorna a lista de ordens de compra
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/getListOrderlines/',
                params: {}       
            },  
            'getCheckByPurchaseGroup': { // Verifica se configurado para trabalhar por grupo de compra
                method: 'GET',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/getCheckByPurchaseGroup/',
                params: {}      
            },
            'transferAndSetBuyer': { // Transfere ou define comprador da ordem
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/transferAndSetBuyer/',
                params: {}      
            },
            'getDefaultsOrderline':{ // Retorna os valores padrões para a criação de uma ordem de compra
                method:'GET',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/getDefaultsOrderline/'
            },
            'getPurchaseRequisition':{ // Retorna os valores da ordem de compra que está sendo alterada
                method:'GET',
                isArray: false,
                params: {pOrderlineNumber : '@pOrderlineNumber'}, // Número da ordem compra
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/getPurchaseRequisition/'
            },
            'getFieldDefaults':{ // Retorna os valores padrões ao retirar o foco dos campos
                method:'POST',
                isArray: false,
                params: {pType: '@pType', // Indica o tipo de transação (CREATE ou UPDATE)
                         pFieldName: '@pFieldName'},  // Campo em que ocorreu o leave 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/getFieldDefaults/'
            },
            'getCopyRequisition':{ // Retorna os valores para a cópia de uma ordem de compra
                method:'GET',
                isArray: false,
                params: {purchaseRequisition: '@purchaseRequisition'}, // Número da ordem compra
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/getCopyRequisition/'
            },
            'saveRequisition': { // Cria ou edita um item da requisição
                method: 'POST',
                isArray: false,
                params: {pcAction: '@pcAction'},  // Indica a ação, se é Create ou Update
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/saveRequisition'
            },
            'prepareExecuteSplitPurchaseRequisition': { // Prepara e executa o split
                method: 'GET',
                isArray: true,
                params: {purchaseRequisition: '@purchaseRequisition', //Ordem de compra
                        'executeSplit': '@executeSplit'},  //Indica se deve executar o split
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/prepareExecuteSplitPurchaseRequisition'
            },
            'prepareSplitPurchaseRequisition': { // Prepara o split
                method: 'GET',
                isArray: true,
                params: {purchaseRequisition: '@purchaseRequisition', //Ordem de compra
                        'executeSplit': '@executeSplit'},  //Indica se deve executar o split
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/prepareSplitPurchaseRequisition'
            },
            'executeSplitPurchaseRequisition': { // Executa o split
                method: 'POST',
                isArray: true,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/executeSplitPurchaseRequisition'
            },
            'setDefaultsDeliverySchedule' : { // Busca dados default da entrega
                method:'POST',
                isArray: false,
                params: {pType: '@pType', // Indica o tipo de transação (CREATE ou UPDATE)
                         pFieldName: '@pFieldName'},  // Campo em que ocorreu o leave  
                url: '/dts/datasul-rest/resources/api/ccp/ccapi352/setDefaultsDeliverySchedule'
            }
        };  
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi352', {}, specificResources);
        
        factory.deleteRecord = function (id, callback) { // Método padrão para remover um registro
            return this.TOTVSRemove({pNumeroOrdem: id}, callback);
        };

        return factory; 
    }

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.ccapi352.Factory', factoryOrderLineDetail);
});