define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	natureFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function natureFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaunature/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getNatureByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getNatureByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveNature = function (novoRegistro, tmpAbiNature,callback) {   

            factory.TOTVSPost({method: 'saveNature'},
                                  {novoRegistro: novoRegistro,
                                   tmpAbiNature: tmpAbiNature},
            function(result){ 
                if(result && result.tmpAbiNature){
                    result.tmpAbiNature.$hasError = result.$hasError;
                    callback(result.tmpAbiNature);
                    return;
                }
                
                callback(result);
            });
        };

        factory.removeNature = function (tmpAbiNature,callback) {   

            factory.TOTVSPost({method: 'removeNature'},
                              {tmpAbiNature: tmpAbiNature},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (idNatureza,callback) {   
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                              {idNatureza: idNatureza},
                              callback);
        };
                
        return factory;
    }

    index.register.factory('hrs.nature.Factory', natureFactory);	
});


