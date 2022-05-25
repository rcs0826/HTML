define(['index',
        '/dts/hgp/html/util/dts-utils.js'],
function(index) {

    gruFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];

    function gruFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaugru/:method/:id',
                                          {},
                                          {'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}});

        factory.getGruByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {

            factory.postWithArray({method: 'getGruByFilter',
                                   simpleFilterValue: simpleFilterValue,
                                   pageOffset: pageOffset,
                                   limit: limit,
                                   loadNumRegisters: loadNumRegisters},
                                  {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                  callback);
        };

        factory.saveGru = function (novoRegistro, tmpRessusAbiGru, callback) {
            factory.TOTVSPost({method: 'saveGru',
                               novoRegistro: novoRegistro},
                               {tmpRessusAbiGru: tmpRessusAbiGru},
            function(result){
                callback(result);
            });
        }

        factory.removeGru = function (tmpRessusAbiGru, callback) {

            factory.TOTVSPost({method: 'removeGru'},
                              {tmpRessusAbiGru: tmpRessusAbiGru},
                              callback);
        }

        factory.prepareDataToMaintenanceWindow = function (cddRessusAbiGru, callback) {
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow',
                                   cddRessusAbiGru: cddRessusAbiGru},
                                  {},
                                  callback);
        }

        return factory;
    }

    index.register.factory('hrs.gru.Factory', gruFactory);
});