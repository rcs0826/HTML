define(['index', 
        '/dts/hgp/html/util/dts-utils.js',
       ], function(index) {

	eSocialDomainTypeFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function eSocialDomainTypeFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauesocialdomain/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });


        factory.getDomainType = function (callback) {
            factory.postWithArray({method: 'getDomainType'},
                                   {},
                                   callback);
        };
        factory.getDomainTypeById = function (idiTipDomin, callback) {
            factory.postWithArray({method: 'getDomainTypeById'},
                                  {idiTipDominPar: idiTipDomin},
                                  callback);
        };

        factory.getDomainByFilter = function (idiTipDomin, simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getDomainByFilter',
                    idiTipDomin: idiTipDomin,
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.prepareDataToMaintenanceWindow = function (cdnDomin,callback) {   
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                                  {cdnDomin: cdnDomin},
                                   callback);
        };

        factory.saveESocialDomain = function (novoRegistro, eSocialDomain,callback) {   
            factory.TOTVSPost({method: 'saveESocialDomain'},
                              {novoRegistro: novoRegistro,
                              tmpDominESocial: eSocialDomain},
                              function(result){ 
                                    if(result && result.tmpDominESocial){
                                        result.tmpDominESocial.$hasError = result.$hasError;
                                        callback(result.tmpDominESocial);
                                        return;
                                    }
                                    callback(result);
                              });
        };                    
                            
        factory.removeESocialDomain = function (eSocialDomain,callback) {   
            factory.TOTVSPost({method: 'removeDomain'},
                              {tmpDominESocial: eSocialDomain},
                               callback);
        };
        return factory;
    }

    index.register.factory('hcg.eSocialDomainType.Factory', eSocialDomainTypeFactory);	
});


