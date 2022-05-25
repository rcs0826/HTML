define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
	factoryFluigMonitor.$inject = ['$totvsresource'];
	function factoryFluigMonitor($totvsresource) {
        var specificResources = {
            /* 
             * Objetivo: Buscar os erros na integração com o FLuig
             * Parâmetros: 
             * Observações:
             */
            'getListIntegrationErrors': {
                method: 'POST',
                isArray: false,
                params: {},
                url: '/dts/datasul-rest/resources/api/lap/mlaapi016/getListIntegrationErrors'
                
            },
            /* 
             * Objetivo: Buscar a composição da chave do documento
             * Parâmetros: -Entrada: pDocumentCode: código do documento
             * Observações:
             */
            'getDocumentKeyComposition':{
                method: 'GET',
                isArray: true,
                params: {pDocumentCode: '@pDocumentCode'},
                url: '/dts/datasul-rest/resources/api/lap/mlaapi016/getDocumentKeyComposition'
            },
             /* 
             * Objetivo: Executa o reprocessamento
             * Parâmetros: -Entrada: pProcessRelatedErrors: Array com as pendências para reprocessamento
             * Observações:
             */
            'executeFluigIntegration': {
                method: 'POST',
                isArray: false,
                params: {ttIntegrateTransactionFluig: '@ttIntegrateTransactionFluig', lUnintegrated: '@lUnintegrated'},
                url: '/dts/datasul-rest/resources/api/lap/mlaapi016/executeFluigIntegration'
                
            }
		};
        factory = $totvsresource.REST('/dts/datasul-rest/resources/api/lap/mlaapi016', {}, specificResources);

		return factory;
	}
	
	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mla.mlaapi016.Factory', factoryFluigMonitor);
});
