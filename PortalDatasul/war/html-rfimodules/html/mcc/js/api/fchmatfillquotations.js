define([
	'index'
], function(index) {
    
    fchmatfillquotations.$inject = ['$totvsresource'];
    function fchmatfillquotations($totvsresource) {
        var specificResources = {
            // # Purpose: Busca as informações utilizadas na tela inicial (Empresa e fornecedor)
		    // # Parameters: guid - Token do RFI
		    // # Notes: 
            'homeInfo': {
                method: 'GET',
                isArray: false,
                params: {"guid":"@guid"},
                url: (rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/homeInfo')
            },
            // # Purpose: Busca as informações de detalhes de uma ordem de compra.
		    // # Parameters: guid - Token do RFI
		    // # Notes:
            'getRequisitions': {
                method: 'GET',
                isArray: true,
                params: {"guid":"@guid"},
                url: (rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getRequisitions')
            },
            // # Purpose: Busca as informações de entregas de uma ordem de compras.
		    // # Parameters: numeroOrdem - Número da ordem de compra.
		    // # Notes:
            'getDeliverySchedule': {
                method: 'GET',
                isArray: true,
                params: {'numeroOrdem':'@numeroOrdem'},
                url: (rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getDeliverySchedule')
            },
            // # Purpose: Busca as informações de cotações de uma ordem de compra.
            // # Parameters: numeroOrdem - Número da ordem de compra.
            //               date        - Data
            //               currency    - Moeda corrente
            //               vendor      - Código do estabelecimento
		    // # Notes:
            'getFillQuotes': {
                method: 'GET',
                isArray: true,
                params: {
                    'numeroOrdem':'@numeroOrdem',
                    'date':'@date',
                    'currency':'@currency',
                    'vendor':'@vendor',
                },
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getFillQuotes'
            },
            // # Purpose: Retornar a lista de unidade de medida por fornecedor
            // # Parameters: 
		    // # Notes:
            'getItemVendorUnits': {
                method: 'POST',
                isArray: true,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getItemVendorUnits'
            },
            // # Purpose: Retornar a lista de condições de pagamentos
            // # Parameters: 
		    // # Notes:
            'getPaymentTerms': {
                method: 'GET',
                isArray: true,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getPaymentTerms'
            },
            // # Purpose: Retornar a lista de fabricantes
            // # Parameters: stringName - Código do item.
		    // # Notes:
            'getItemManufacturers': {
                method: 'POST',
                isArray: true,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getItemManufacturers'
            },
            // # Purpose: Retornar a lista de tranportadoras
            // # Parameters: 
		    // # Notes:
            'getCarriers': {
                method: 'GET',
                isArray: true,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getCarriers'
            },
            // # Purpose: Retornar a lista de moedas
            // # Parameters: 
		    // # Notes:
            'getCurrencies': {
                method: 'GET',
                isArray: true,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getCurrencies'
            },
			// # Purpose: Retornar as listas
            // # Parameters: 
		    // # Notes:
            'getLists': {
                method: 'POST',
                isArray: false,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/getLists'
            },
            // # Purpose: Calcula os dados da tela de inserção de cotação
            // # Parameters: 
		    // # Notes:
            'setDefaultsQuotation': {
                method: 'POST',
                isArray: false,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/setDefaultsQuotation'

            },
            // # Purpose: Persiste uma cotação na base de dados.
            // # Parameters: 
		    // # Notes:
            'addUpdateQuotation': {
                method: 'POST',
                isArray: false,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/addUpdateQuotation'

            },
            // # Purpose: Invalida o link do RFI.
            // # Parameters: 
		    // # Notes:
            'invalidateRfiLink': {
                method: 'POST',
                isArray: false,
                params: {"guid":"@guid"},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/invalidateRfiLink'

            },
            // # Purpose: Remove uma cotação.
            // # Parameters: 
		    // # Notes:
            'removeQuotation': {
                method: 'POST',
                isArray: false,
                params: {},
                url: rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/removeQuotation'

            }
        }

        var factory = $totvsresource.REST(rfiRestDir + '/resources/api/fch/fchmat/fchmatfillquotations/:method', {}, specificResources);
        return factory;
    };
	
    index.register.factory('rfi.mcc.fchmatfillquotations.factory', fchmatfillquotations);
});
