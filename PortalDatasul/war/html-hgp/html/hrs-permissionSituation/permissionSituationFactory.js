define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	permissionSituationFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function permissionSituationFactory($totvsresource, dtsUtils) {
	    var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaupermissionsituation/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        
        factory.getPermissionSituationByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, groupedRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getPermissionSituationByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters, 
                    groupedRegisters: groupedRegisters}, 
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.getPermissionSituationSecurityByUser = function (callback) {
            factory.postWithArray({method: 'getPermissionSituationSecurityByUser'},callback);
        };

        factory.savePermissionSituation = function (codGrp, tmpPermissionSituation, callback) {   
            factory.TOTVSPost({method: 'savePermissionSituation', 
                               codGrp: codGrp},
                              {tmpPermissionSituation: tmpPermissionSituation},
            function(result){ 
                if(result && result.tmpPermissionSituation){
                    result.tmpPermissionSituation.$hasError = result.$hasError;
                    callback(result.tmpPermissionSituation);
                    return;
                }
                
                callback(result);
            });
        }        

        factory.removePermissionSituation = function (tmpPermissionSituation,callback) {   

            factory.TOTVSPost({method: 'removePermissionSituation'},
                              {tmpPermissionSituation: tmpPermissionSituation},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (codGrp,callback) { 
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                              {codGrp: codGrp},
                              callback);
        }

        factory.listOffAllPermissionSituationGroup = function (codGrp,callback) { 
            factory.postWithArray({method: 'GetAllPermissionSituationGroup'},
                                  {codGrp: codGrp},
                                  callback);
        }
                        
        return factory;
    }

    index.register.factory('hrs.permissionSituation.Factory', permissionSituationFactory);	
});


