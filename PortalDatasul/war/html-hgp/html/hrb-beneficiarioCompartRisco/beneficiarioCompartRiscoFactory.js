define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	beneficiarioCompartRiscoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function beneficiarioCompartRiscoFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsaubeneficiariocompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});	


        factory.getBeneficiarioCompartRiscoByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getBeneficiarioCompartRiscoByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        factory.saveBeneficiarioCompartRisco = function (novoRegistro, tmpBeneficiariocompartrisco,callback) {   
            factory.TOTVSPost({method: 'saveBeneficiarioCompartRisco'},
                              {novoRegistro: novoRegistro,
                                tmpBeneficiariocompartrisco: tmpBeneficiariocompartrisco},
            function(result){ 
                if(result && result.tmpRegraInclExc){
                    result.tmpRegraInclExc.$hasError = result.$hasError;
                    callback(result.tmpRegraInclExc);
                    return;
                }
                
                callback(result);
            });
        };

        factory.removeBeneficiarioCompartRisco = function (tmpBeneficiariocompartrisco,callback) {   

            factory.TOTVSPost({method: 'removeBeneficiarioCompartRisco'},
                              {tmpBeneficiariocompartrisco: tmpBeneficiariocompartrisco},
                               callback);
        };

        factory.removeSelectedBenefCompartRisco = function(tmpBenefsNaoSelecionados,disclaimers,callback){
            factory.TOTVSPost({method: 'removeSelectedBenefCompartRisco'},
                    {tmpBenefsNaoSelecionados:tmpBenefsNaoSelecionados,
                     tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                     callback);   
        }

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

    index.register.factory('hrb.beneficiarioCompartRisco.Factory', beneficiarioCompartRiscoFactory);	
});


