define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	contingAuditPosFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function contingAuditPosFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaucontingauditpos/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getContingAuditPosByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'searchFCHRecords',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };
        
        factory.removeContingAuditPos = function (tmpSelecionados, callback) {   
            factory.TOTVSPost({method: 'removeContingAuditPos'},
                              {tmpFilterValue: tmpSelecionados},
                               callback);
        }

        factory.sendContingAuditPos = function (tmpSelecionados, callback) {   
            factory.postWithArray({method: 'sendContingAuditPos'},
								  {tmpFilterValue: tmpSelecionados},
								  callback); 
        }

        factory.prepareDataToMaintenanceWindow = function (cdnRegraDescFatur,callback) {   

            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {cdnRegraDescFatur: cdnRegraDescFatur},
                               callback);
        }
                
        return factory;
    }

    index.register.factory('hrc.contingAuditPos.Factory', contingAuditPosFactory);	
});


