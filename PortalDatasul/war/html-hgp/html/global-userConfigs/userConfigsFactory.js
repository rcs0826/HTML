define(['index'
], function (index) {

    userConfigs.$inject = ['$totvsresource'];
    function userConfigs($totvsresource) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsauuserconfigs/:method', {}, {});

        factory.getConfigByKey = function (cdUserid, cdPrograma, callback) {
            this.TOTVSQuery({method: 'getConfigByKey', cdUserid: cdUserid, cdPrograma: cdPrograma}, 
                function(result){
                    if(result && result.length > 0){
                        result[0].desConfig = angular.fromJson(result[0].desConfig);
                        callback(result[0]);
                    }else{
                        callback();
                    }
                });
        };
        
        factory.saveUserConfiguration = function (cdUserid, cdPrograma, config, callback, headers) {
            factory.TOTVSSave({method: 'saveUserConfiguration'},
                            {cdUserid: cdUserid,
                             cdPrograma: cdPrograma,
                             desConfig: angular.toJson(config)}, 
                            callback, headers);
        };

        return factory;
    }

    index.register.factory('global.userConfigs.Factory', userConfigs);
});
