define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	beneficiarioCompartRiscoIntercamFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function beneficiarioCompartRiscoIntercamFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsaubeneficiariocompartriscointercam/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});	


        factory.getBeneficiarioCompartRiscoIntercamByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getBeneficiarioCompartRiscoIntercamByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        factory.prepareDataToMaintenanceWindow = function (cdUnidade, cdModalidade, cdContrato, cdBeneficiario, dtInicio, callback) {   
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                                  {cdUnidade: cdUnidade,
                                   cdModalidade: cdModalidade,
                                   cdContrato: cdContrato,
                                   cdBeneficiario: cdBeneficiario,
                                   dtInicio: dtInicio},
                                   callback);
        };

        return factory;
    }
                            
    index.register.factory('hrb.beneficiarioCompartRiscoIntercam.Factory',  beneficiarioCompartRiscoIntercamFactory);	
});


