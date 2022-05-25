define([
	'index'
], function(index) {	
	
    fchdis0035.$inject = ['$totvsresource'];
    function fchdis0035($totvsresource) {     
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
             *  Objetivo:  Efetuar a troca de empresa                
             *  Parametros: Entrada: companyCode - código da empresa   
             *                  
             */          
            'changeCompany': {
                method: 'POST',
                isArray: false,
                params: {"codempresa":"@pCodEmpresa"},
                url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/changeCompany/',
                headers:{'companyId':factoryCompany.getCompanyId}
            },
            'getDataCompany':{
				method: 'GET',
				isArray: false,
				params: {},
				url: '/dts/datasul-rest/resources/api/fch/fchdis/fchdis0035/dataCompany/'
			},           
        }    

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchdis/:method', {}, specificResources);
        angular.extend(factory, factoryCompany);
        return factory;
    };

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.fchdis0035.factory', fchdis0035);
});
