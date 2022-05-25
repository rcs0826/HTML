define(['index', '/dts/hgp/html/util/dts-utils.js'], function (index) {

    assocvaConverMovtoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function assocvaConverMovtoFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauassocvaconvermovtosuss/:method/:id', {}, {
            'postWithArray': { method: 'POST', isArray: true, params: { method: '@method' } }
        });

        factory.getAssocvaConverMovtoByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {

            factory.postWithArray({
                method: 'getAssocvaConverMovtoByFilter',
                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset,
                limit: limit, loadNumRegisters: loadNumRegisters
            },
                { tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                callback);
        };

        factory.saveAssocvaConverMovto = function (tmpAssocvaConverMovtoSuss, callback) {
            factory.TOTVSPost({ method: 'saveAssocvaConverMovto' }, { tmpAssocvaConverMovtoSuss: tmpAssocvaConverMovtoSuss },
                function (result) {
                    if (result && result.tmpAssocvaConverMovtoSuss) {
                        result.tmpAssocvaConverMovtoSuss.$hasError = result.$hasError;
                        callback(result.tmpAssocvaConverMovtoSuss);
                        return;
                    }
                    callback(result);
                });
        };

        factory.removeAssocvaConverMovto = function (tmpAssocvaConverMovtoSuss, callback) {
            factory.TOTVSPost({ method: 'removeAssocvaConverMovto' }, { tmpAssocvaConverMovtoSuss: tmpAssocvaConverMovtoSuss },
                function (result) {
                    if (result && result.tmpAssocvaConverMovtoSuss) {
                        result.tmpAssocvaConverMovtoSuss.$hasError = result.$hasError;
                        callback(result.tmpAssocvaConverMovtoSuss);
                        return;
                    }
                    callback(result);
                });
        };

        return factory;
    }

    index.register.factory('hrs.assocvaConverMovto.Factory', assocvaConverMovtoFactory);
});