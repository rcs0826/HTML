define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	noticeBillingImportFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function noticeBillingImportFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrc/fchsaunoticebillingimport/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getNoticeBillingImportByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getNoticeBillingImportByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.getProceduresNoticeBillingImportByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getProceduresNoticeBillingImportByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.getInputsNoticeBillingImportByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getInputsNoticeBillingImportByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveNoticeBillingImport = function (tmpDoctoAvisoCobImp, callback) {   
            factory.TOTVSPost({method: 'saveNoticeBillingImport'},
                              {tmpDoctoAvisoCobImp: tmpDoctoAvisoCobImp}, 
            function(result){
                if(result && result.tmpDoctoAvisoCobImp){
                    result.tmpDoctoAvisoCobImp[0].$hasError = result.$hasError;
                    callback(result.tmpDoctoAvisoCobImp[0]);
                    return;
                }
                
                callback(result);
            });
        }

        factory.prepareDataToMaintenanceWindow = function (cddSeq, callback) {   
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {cddSeq: cddSeq},
                              callback);
        }

        factory.getBuscaHistSitDoc = function (cddSeq,callback ){
            factory.TOTVSGet({method: 'getBuscaHistSitDoc',cddSeq:cddSeq},callback);
        }

        factory.getErrorMessages = function (cddSeq,callback ){
            factory.TOTVSGet({method: 'getErrorMessages',cddSeq:cddSeq},callback);
        }

        return factory;
    }

    index.register.factory('hrc.noticeBillingImport.Factory', noticeBillingImportFactory);	
});


