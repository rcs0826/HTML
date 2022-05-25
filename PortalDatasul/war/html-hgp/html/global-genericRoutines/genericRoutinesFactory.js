define(['index',
    'totvs-custom',
    'ng-load!totvs-resource'
], function (index) {

    genericRoutines.$inject = ['$totvsresource'];
    function genericRoutines($totvsresource) {

        var factory = $totvsresource.REST('/healthmanagementwebservices/rest/global/genericRoutines/:method', {}, {});

        factory.getConfigByKey = function (cdUserid, cdPrograma, callback) {
            this.TOTVSGet({method: 'getConfigByKey', cdUserid: cdUserid, cdPrograma: cdPrograma}, 
                function(result){
                    if(result){
                        result.desConfig = angular.fromJson(result.desConfig);
                    }
                    callback(result);
                });
        };
        
        factory.saveUserConfiguration = function (config, callback) {
            factory.TOTVSSave({method: 'saveUserConfiguration'},
                           config, callback);
        };

        return factory;
    }

    index.register.factory('global.genericRoutines.Factory', genericRoutines);
});
