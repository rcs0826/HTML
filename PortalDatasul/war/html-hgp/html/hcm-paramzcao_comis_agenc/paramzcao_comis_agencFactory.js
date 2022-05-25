define(['index',         
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	paramzcao_comis_agencFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function paramzcao_comis_agencFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hcm/fchsauparamzcao_comis_agenc/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getParamzcao_comis_agencByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getParamzcao_comis_agencByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveParamzcao_comis_agenc = function (novoRegistro, tmpParamzcao_comis_agenc,
            tmpFuncao, tmpTipoProposta, tmpConvenio, tmpModalidade, tmpEvento, callback) {   

            factory.TOTVSPost({method: 'saveParamzcao_comis_agenc'},
                                {   
                                    novoRegistro: novoRegistro, 
                                    tmpParamzcao_comis_agenc: tmpParamzcao_comis_agenc,
                                    tmpFuncao: tmpFuncao,
                                    tmpTipoProposta: tmpTipoProposta,
                                    tmpConvenio: tmpConvenio,
                                    tmpModalidade: tmpModalidade,
                                    tmpEvento: tmpEvento
                                },
            function(result){ 

                if(result && result.tmpParamzcao_comis_agenc){
                    result.tmpParamzcao_comis_agenc.$hasError = result.$hasError;
                    callback(result.tmpParamzcao_comis_agenc);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removeParamzcao_comis_agenc = function (tmpParamzcao_comis_agenc,callback) {   

            factory.TOTVSPost({method: 'removeParamzcao_comis_agenc'},
                              {tmpParamzcao_comis_agenc: tmpParamzcao_comis_agenc},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (idRegra, callback) {               
            var par = {};
            par.idRegra = idRegra;
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                                par,
                                callback);
        }
                
        return factory;
    }

    index.register.factory('hcm.paramzcao_comis_agenc.Factory', paramzcao_comis_agencFactory);	
});
