define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
	factoryDocumentApproval.$inject = ['$totvsresource'];
	function factoryDocumentApproval($totvsresource) {
        var specificResources = {
            /* 
             * Objetivo: Aprovar Documento
             * Parâmetros: 
             * Observações:
             */
            'approveDocument': {
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchlap/fchlapdocumentapproval/approveDocument/',
                params: {}
            },

             /* 
             * Objetivo: Rejeitar Documento
             * Parâmetros: 
             * Observações:
             */
            'rejectDocument': {
                method: 'POST',
                isArray: false,
                url: '/dts/datasul-rest/resources/api/fch/fchlap/fchlapdocumentapproval/rejectDocument/',
                params: {}
            },
		};
        factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchlap/fchlapdocumentapproval', {}, specificResources);

		return factory;
	}
	
	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mla.fchlapdocumentapproval.factory', factoryDocumentApproval);
});
