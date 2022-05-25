define(['index',
    '/dts/hgp/html/util/dts-utils.js'
], function (index) {

    financialDocumentKindFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];

    function financialDocumentKindFactory($totvsresource, dtsUtils) {

        var specificResources = {'postWithArray': {method: 'POST',
                params: {method: '@method'},
                isArray: true}};

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsaufinancialdocumentkind/:method?:param', {}, specificResources);

        factory.getFinancialDocumentKindByFilter = function(simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback){
            factory.postWithArray({method: 'getFinancialDocumentKindByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters:loadNumRegisters}, 
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };

        factory.getFinancialDocumentKindByKey = function (financialDocumentKindCode, disclaimers, callback) {
            factory.getFinancialDocumentKindByFilter(financialDocumentKindCode, 0, 1, false,
                disclaimers, function(result){
                    callback(result[0]);
                });
        };

        return factory;
    }

    index.register.factory('global.financialDocumentKind.Factory', financialDocumentKindFactory);

});
    