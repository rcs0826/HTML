define(['index',       
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	kinshipDegreeFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function kinshipDegreeFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsaugrauparentesco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getKinshipDegreeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getGrauParentescoByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.createKinshipDegree = function (tmpGraPar,callback) {   

            factory.TOTVSPost({method: 'createGrauParentesco'},
                                  {tmpGraPar: tmpGraPar},
            function(result){

                if(result && result.tmpGraPar){
                    result.tmpGraPar.$hasError = result.$hasError;
                    callback(result.tmpGraPar);
                    return;
                }
                
                callback(result);
            });
        }

        factory.editKinshipDegree = function (tmpGraPar,callback) {   

            factory.TOTVSPost({method: 'editGrauParentesco'},
                              {tmpGraPar: tmpGraPar}, 
            function(result){

                if(result && result.tmpGraPar){
                    result.tmpGraPar.$hasError = result.$hasError;
                    callback(result.tmpGraPar);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removeKinshipDegree = function (tmpGraPar,callback) {   

            factory.TOTVSPost({method: 'removeGrauParentesco'},
                              {tmpGraPar: tmpGraPar},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (cdGrauParentesco, callback) {   
             factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                                   {cdGrauParentesco: cdGrauParentesco},
                                    callback);
        }

        factory.getTiposDependencia = function (callback) {   
            factory.postWithArray({method: 'getTiposDependencia'},
                                   {},
                                   callback);
        }; 

        factory.getNiveisDependencia = function (callback) {   
            factory.postWithArray({method: 'getNiveisDependencia'},
                                   {},
                                   callback);
        };
                
        return factory;
    }

    index.register.factory('hpr.kinshipDegree.Factory', kinshipDegreeFactory);	
});


