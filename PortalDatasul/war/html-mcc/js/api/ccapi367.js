define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
	factoryListQuotations.$inject = ['$totvsresource'];
	function factoryListQuotations($totvsresource) {        
		var specificResources = {
			/*
				Objetivo: Retornar uma lista de cotações conforme parâmetros estabelecidos
				Parâmetros: ttListParametersQuotation (input): Contém os filtros a serem utilizados na montagem da query (temp-table)
            				currentTTQuotationList (input): Temp-table contendo os registros já retornados anteriormente (utilizado para evitar duplicatas) (temp-table)
			*/
			'getListQuotations': {
				method: 'POST',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/ccp/ccapi367/getListQuotations/'
			},
            /*
				Objetivo: Retorna a lista dos campos disponíveis para exibição nas colunas
				Parâmetros: ttFieldsReportConfigDefault (output): Contém os campos a serem apresentados em colunas
			*/
            'getFieldsColumnsConfigDefault': { 
                method: 'GET',
                isArray: true,
                params: {},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi367/getFieldsColumnsConfigDefault/'
			},
            /*
				Objetivo: Retorna dados da última compra do item x fornecedor
				Parâmetros: purchaseRequisitionId: Número da ordem de compra
                            cItem: Código do item
                            unitOfMeasure: Unidade de medida
                            vendorId: Código do fornecedor
			*/
            'getLastPurchaseOfItemVendor': { 
                method: 'GET',
                isArray: true,
                params: {purchaseRequisitionId: '@purchaseRequisitionId', // Número da ordem de compra
                         cItem: '@cItem', // Código do item
                         unitOfMeasure: '@unitOfMeasure', //Unidade de medida
                         vendorId: '@vendorId'}, // Código do fornecedor
                url: '/dts/datasul-rest/resources/api/ccp/ccapi367/getLastPurchaseOfItemVendor/'
			},
            /*
				Objetivo: Retorna dados da última compra do item 
				Parâmetros: purchaseRequisitionId: Número da ordem de compra
				            site: Código do Estabelecimento
							cItem: Código do item
                
			*/
            'getLastPurchaseOfItem': { 
                method: 'GET',
                isArray: true,
                params: {purchaseRequisitionId: '@purchaseRequisitionId', // Número da ordem de compra
                         site: '@site', // Código do estabelecimento
                         cItem: '@cItem'}, // Código do fornecedor
                url: '/dts/datasul-rest/resources/api/ccp/ccapi367/getLastPurchaseOfItem/'
			},
            /*
				Objetivo: Validar cotações para aprovação
				Parâmetros: ttQuotationsApprove: Lista de cotações selecionadas para aprovação
			*/
            'validateApproveQuotations': { 
                method: 'POST',
                isArray: true,
                params: {   ttQuotationsApprove: '@ttQuotationsApprove'},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi367/validateApproveQuotations/'
			},
			/*
				Objetivo: Validar cotações em lote para aprovação
				Parâmetros: ttQuotationsApprove: Lista de cotações selecionadas para aprovação
			*/
			'validateApproveLotQuotations': { 
                method: 'POST',
                isArray: false,
                params: {ttQuotationsApprove: '@ttQuotationsApprove'},
                url: '/dts/datasul-rest/resources/api/ccp/ccapi367/validateApproveLotQuotations/'
			}
		}

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi367', {}, specificResources);
		return factory;
	};

	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mcc.ccapi367.Factory', factoryListQuotations);
});
