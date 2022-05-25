define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	beneficiaryLotationFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function beneficiaryLotationFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaubeneficiarylotation/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getBeneficiaryLotationByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getBeneficiaryLotationByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveBeneficiaryLotation = function (tmpLotac, action, callback) {   

            factory.TOTVSPost({method: 'saveBeneficiaryLotation', action: action}, 
                              {tmpLotac: tmpLotac},
            function(result){
                if(result && result.tmpLotac){
                    result.tmpLotac.$hasError = result.$hasError;
                    callback(result.tmpLotac);
                    return;                               
                }                
                callback(result);
            });
        }

        factory.removeBeneficiaryLotation = function (tmpLotac,callback) {   

            factory.TOTVSPost({method: 'removeBeneficiaryLotation'},{tmpLotac: tmpLotac},                               
                function(result){
                    if(result && result.tmpLotac){
                        result.tmpLotac.$hasError = result.$hasError;
                        callback(result.tmpLotac);
                        return;
                    }
                    callback(result);
                });            
        }

        factory.prepareDataToMaintenanceWindow = function (cdnRegraDescFatur,callback) {   

            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {cdnRegraDescFatur: cdnRegraDescFatur},
                               callback);
        }
                             
        return factory;
    }

    index.register.factory('hvp.beneficiaryLotation.Factory', beneficiaryLotationFactory);	
});


