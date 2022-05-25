define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################    
    function factoryOrderDetail($totvsresource) {
        var specificResources = {
            'purchaseOrderDetails': { // Retorna os detalhes de um pedido de compra
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/purchaseOrderDetails/',
                params: {pNrPedido: '@pNrPedido', // Número do pedido
                         pDate: '@pDate',         // Data da cotação para conversão 
                         pCurrency: '@pCurrency'} // Código da moeda para conversão
            },
            /*
				Objetivo: Retorna os valores padrões para tela e executa leave nos campos
				Parâmetros: 
			*/
            'getEmergencyOrderDefaults': { 
                method: 'POST',
                isArray: false,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/getEmergencyOrderDefaults/'
            },
            /*
				Objetivo: Retorna todas os tipos de vias de transportes
				Parâmetros: 
			*/
            'getViaTransporte': {
                method: 'GET',
                isArray: true,
                params: {}, 
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/getViaTransporte/'
            }, 
            /*
                Objetivo: Retorna o formato do documento de acordo com o código do emitente.
                Parametros: pCodEmitente - Código do emitente.
            */
            'getFormatoNumeroDocumento': {
                method: 'GET',
                isArray: false,
                params: {
                    pCodEmitente: '@pCodEmitente'
                },
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/getFormatoNumeroDocumento/'
            },
            /*
                Objetivo: Lista os dados da ordem
            */
            'listPurchaseOrder': {
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/listPurchaseOrder/'
            },
            /*
                Objetivo: Busca os dados do pedido de compras.
                Parametros: numPedido - Número do pedido.
            */
           'getOrderDetails': {
                method: 'GET',
                isArray: false,
                params: {
                    numPedido: '@numPedido'
                },
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/getOrderDetails/'
            },
            /*
                Objetivo: Busca os dados da condição específica.
                Parametros: numPedido - Número do pedido.
            */
            'getPaymentTerms': {
                method: 'GET',
                isArray: true,
                params: {
                    numPedido: '@numPedido'
                },
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/getPaymentTerms/'
            },
            /*
                Objetivo: Busca as ordens de compra passiveis a vincução.
                Parametros: numPedido - Número do pedido.
                            confEstab - Ordens com estabelecimento diferente do pedido
            */
           'requisitionsToLink': {
                method: 'GET',
                isArray: true,
                params: {
                    numPedido: '@numPedido',
                    confEstab: '@confEstab'
                },
                url: '/dts/datasul-rest/resources/api/ccp/ccapi351/requisitionsToLink/'
            }
        };  
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi351', {}, specificResources);
         
        return factory;
    }
 
	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.ccapi351.Factory', factoryOrderDetail);
});
