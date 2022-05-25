define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Factories
	// ########################################################
	factoryAlternativeUser.$inject = ['$totvsresource'];
	function factoryAlternativeUser($totvsresource) {
        var specificResources = {
            /* 
             * Objetivo: Buscar os usuários alternativos
             * Parâmetros: -Entrada: pCodUsuar: código do usuário referência
             * Observações:
             */
            'getAlternatives': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/lap/mla0010/getAlternatives/',
                params: {pCodUsuar: '@pCodUsuar'}
            },
            /* 
             * Objetivo: Buscar um determinado usuário alternativo
             * Parâmetros: -Entrada:    pCodUsuar: código do usuário referência
                                        pCodUsuarAlternativo: código do usuário alternativo
             * Observações:
             */
            'getAlternative': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/lap/mla0010/getAlternatives/',
                params: { pCodUsuar: '@pCodUsuar', pCodUsuarAlternativo: '@pCodUsuarAlternativo' }
            }
		};
        factory = $totvsresource.REST('/dts/datasul-rest/resources/api/lap/mla0010', {}, specificResources);

		return factory;
	}
	
	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mla.mla0010.Factory', factoryAlternativeUser);
});
