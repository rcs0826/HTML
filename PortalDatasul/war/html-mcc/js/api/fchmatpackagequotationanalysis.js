define([
	'index',
	'/dts/mcc/js/mcc-utils.js'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
    factoryFchmatpackagequotationanalysis.$inject = ['$totvsresource'];
    function factoryFchmatpackagequotationanalysis($totvsresource) {        
        var specificResources = {
            'getLastPurchaseOfItemVendor': { // Retorna os dados da última compra do item do fornecedor
                method: 'GET',
                isArray: true,
                params: {purchaseRequisitionId: '@purchaseRequisitionId', // Número da ordem de compra
                         siteId: '@siteId', // Código do estabelecimento
                         itemId: '@itemId', // Código do item
                         unitOfMeasure: '@unitOfMeasure', //Unidade de medida
                         vendorId: '@vendorId'}, // Código do fornecedor
                url: '/dts/datasul-rest/resources/api/fch/fchmat/fchmatpackagequotationanalysis/getLastPurchaseOfItemVendor/'
            }
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatpackagequotationanalysis', {}, specificResources);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################	
    index.register.factory('mcc.fchmatpackagequotationanalysis.Factory', factoryFchmatpackagequotationanalysis);
});

