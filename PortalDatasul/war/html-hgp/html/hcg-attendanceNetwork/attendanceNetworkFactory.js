define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	attendanceNetworkFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function attendanceNetworkFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauattendancenetwork/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getAttendanceNetworkByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getAttendanceNetworkByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.getProviderAttendanceNetworkByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getProviderAttendanceNetworkByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveAttendanceNetwork = function (tmpRedeAtendim, tmpAddedRedeAtendimPrestdor,
                                tmpRemovedRedeAtendimPrestdor, callback) {   
            factory.TOTVSPost({method: 'saveAttendanceNetwork'},
                              {tmpRedeAtendim: tmpRedeAtendim, tmpAddedRedeAtendimPrestdor: tmpAddedRedeAtendimPrestdor,
                               tmpRemovedRedeAtendimPrestdor: tmpRemovedRedeAtendimPrestdor}, 
                               function(result){
                                    if(result && result.tmpRedeAtendim){
                                        result.tmpRedeAtendim[0].$hasError = result.$hasError;
                                        callback(result.tmpRedeAtendim[0]);
                                        return;
                                    }
                                    
                                    callback(result);
                               });
        }

        factory.removeAttendanceNetwork = function (tmpRedeAtendim,callback) {   
            factory.TOTVSPost({method: 'removeAttendanceNetwork'},
                              {tmpRedeAtendim: tmpRedeAtendim},
                               callback);
        }

        factory.prepDataToAttendNetworkWindow = function (cdnRede, callback) {   
            factory.TOTVSPost({method: 'prepDataToAttendNetworkWindow', cdnRede: cdnRede},
                              {}, callback);
        }
                
        return factory;
    }

    index.register.factory('hcg.attendanceNetwork.Factory', attendanceNetworkFactory);	
});


