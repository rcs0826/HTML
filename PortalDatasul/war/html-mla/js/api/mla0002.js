define([
	'index'
], function(index) {
	
	// ########################################################
	// ### Services
	// ########################################################

    mla0002.$inject = ['$totvsresource'];
    function mla0002($totvsresource) {
        /*
         * Objetivo: Fazer o encapsulamento do atributo companyId (empresa) para efetuar a troca de empresa.
         * Método:  setCompanyId -> seta a empresa selecionada
         *          getCompanyId -> retorna a empresa selecionada
         */
        var factoryCompany = {
            companyId: undefined,
            setCompanyId: function (cid) {
                factoryCompany.companyId = cid;
            },
            getCompanyId: function () {
                return factoryCompany.companyId;
            }
        };
        
        var specificResources = {
            /* 
             * Objetivo: Retorna informações da empresa logada e lista de empresas do usuário
             * Parâmetros:  Saída:  ttEmpresasUsuar: lista de empresas do usuário
                                    p-cod-empresa: código da empresa logada
                                    p-razao-social: razão social da empresa logada
             * Observações:
             */
            'trocaEmpresa':{
                method: 'POST',
                isArray: false,
                params: {"p-cod-empresa":"@pCodEmpresa"},
                url: '/dts/datasul-rest/resources/api/lap/mla0002/trocaEmpresa/'
            },
            'trocaEmpresa_portal':{
                method: 'POST',
                isArray: false,
                params: {"p-cod-empresa":"@pCodEmpresa"},
                url: '/dts/datasul-rest/resources/api/lap/mla0002/trocaEmpresa_portal/',
                headers:{'companyId':factoryCompany.getCompanyId}
            },
        }

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/lap/:method', {}, specificResources);
        angular.extend(factory, factoryCompany);
        return factory;
    };
	

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.mla0002.factory', mla0002);
});
