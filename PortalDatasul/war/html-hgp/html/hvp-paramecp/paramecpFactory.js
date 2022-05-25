define(['index',
    'totvs-custom',
    'ng-load!totvs-resource'
], function (index) {

    paramecpFactory.$inject = ['$totvsresource'];
    function paramecpFactory($totvsresource) {

        var factory = $totvsresource.REST('/healthmanagementwebservices/rest/hvp/paramecp/:method', {}, {});

        factory.getParamecp = function (callback) {
            this.TOTVSGet({method: 'getParamecp'}, callback);
        };

        return factory;
    }

    index.register.factory('hvp.paramecp.Factory', paramecpFactory);
});
