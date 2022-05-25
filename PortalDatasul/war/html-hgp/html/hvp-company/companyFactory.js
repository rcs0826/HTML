define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

  // *************************************************************************************
  // *** FACTORIES
  // *************************************************************************************
  companyFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
  function companyFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaucompany/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.prepareDataToCompanyWindow = function (idPessoa, callback) {
            factory.TOTVSGet({method: 'prepareDataToCompanyWindow', idPessoa: idPessoa},
                callback);
        }; 

        factory.saveCompany = function (company, callback) {
            var progressTables = {tmpContact: company.contatos,
                                  tmpAddress: company.enderecos,
                                  tmpCompany: company};
            //TOTVSPost
            factory.postWithArray({method: 'saveCompany'}, progressTables, callback);
        };
        
        return factory;
  }

  index.register.factory('hvp.company.Factory', companyFactory);    
});