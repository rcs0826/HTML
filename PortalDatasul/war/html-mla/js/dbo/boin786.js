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
             * Objetivo: Salvar o registro do usuário alternativo criado
             * Parâmetros: 
             * Observações:
             */
            'saveRecord':{
            	method: 'POST',
                isArray: true,
                url: '/dts/datasul-rest/resources/dbo/inbo/boin786/',
                params: {}
            },
            /* 
             * Objetivo: Buscar um determinado usuário alternativo
             * Parâmetros: -Entrada:    pCodUsuar: código do usuário referência
                                        pCodUsuarAlternativo: código do usuário alternativo
             * Observações:
             */
            'getRecord': {
        		method: 'GET',
        		isArray: false,
        		url: '/dts/datasul-rest/resources/dbo/inbo/boin786//:pCodUsuar//:pCodUsuarAltern',
        		params: { pCodUsuar: '@pCodUsuar', pCodUsuarAltern: '@pCodUsuarAltern' }
    		},
            /* 
             * Objetivo: Salvar o registro do usuário alternativo editado
             * Parâmetros: -Entrada:    pCodUsuar: código do usuário referência
                                        pCodUsuarAltern: código do usuário alternativo
             * Observações:
             */
            'updateRecord': {
        		method: 'PUT',
        		isArray: true,
        		url: '/dts/datasul-rest/resources/dbo/inbo/boin786//:pCodUsuar//:pCodUsuarAltern',
        		params: { pCodUsuar: '@pCodUsuar', pCodUsuarAltern: '@pCodUsuarAltern' }
    		},
            /* 
             * Objetivo: remover um registro usuário alternativo
             * Parâmetros: -Entrada:    pCodUsuar: código do usuário referência
                                        pCodUsuarAltern: código do usuário alternativo
             * Observações:
             */
            'deleteRecord': {
        		method: 'DELETE',
        		isArray: true,
        		url: '/dts/datasul-rest/resources/dbo/inbo/boin786//:pCodUsuar//:pCodUsuarAltern',
        		params: { pCodUsuar: '@pCodUsuar', pCodUsuarAltern: '@pCodUsuarAltern' }
    		}
		};
        factory = $totvsresource.REST('/dts/datasul-rest/resources/api/lap/mla0010', {}, specificResources);

		return factory;
	}
	
	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.factory('mla.boin786.Factory', factoryAlternativeUser);
});
