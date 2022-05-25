define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

  // *************************************************************************************
  // *** FACTORIES
  // *************************************************************************************
  demographicFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
  function demographicFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaudemographic/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.prepareDataToDemographicWindow = function (idPessoa, callback) {
            factory.TOTVSGet({method: 'prepareDataToDemographicWindow', idPessoa : idPessoa},
                callback);
        }; 

        factory.saveDemographic = function (demographic, callback) {
            var progressTables = {tmpConfigFileAuditory : [],
                                  tmpContact: demographic.contatos,
                                  tmpAddress: demographic.enderecos,
                                  tmpDemographic: demographic};
            //TOTVSPost
            factory.postWithArray({method: 'saveDemographic'}, progressTables, callback);
        };
        
        return factory;
  }

  index.register.factory('hvp.demographic.Factory', demographicFactory);    
});