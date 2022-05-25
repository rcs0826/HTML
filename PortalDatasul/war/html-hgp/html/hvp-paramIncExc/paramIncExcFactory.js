define(['index', 
        '/dts/hgp/html/util/dts-utils.js',
        'ng-load!ui-file-upload'
       ], function(index) {

	paramIncExcFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service', 'Upload'];
	function paramIncExcFactory($totvsresource, dtsUtils, Upload) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauparamincexc/:method/:id', {},{ 
                      'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}, headers: {enctype:'multipart/form-data'}},
                      'post': { method: 'POST', params: {method:'@method'}, headers: {enctype:'multipart/form-data', 'noCountRequest': 'true'}}
		});	


        factory.getParamIncExcByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getParamIncExcByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveParamIncExc = function (novoRegistro, tmpRegraInclExc,callback) {   

            factory.TOTVSPost({method: 'saveParamIncExc'},
                              {novoRegistro: novoRegistro,
                               tmpRegraInclExc: tmpRegraInclExc},
            function(result){ 
                if(result && result.tmpRegraInclExc){
                    result.tmpRegraInclExc.$hasError = result.$hasError;
                    callback(result.tmpRegraInclExc);
                    return;
                }
                
                callback(result);
            });
        };

        factory.removeParamIncExc = function (tmpRegraInclExc,callback) {   

            factory.TOTVSPost({method: 'removeParamIncExc'},
                              {tmpRegraInclExc: tmpRegraInclExc},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (cddRegra,callback) {   
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                                  {cddRegra: cddRegra},
                                   callback);
        };

        factory.searchImportParam = function (callback) {
            factory.postWithArray({method: 'searchImportParam'},
                                   {},
                                   callback);
        };

        factory.upload = function(file, name, successCallback, progressCallback, errorCallback){		

            /*
            factory.postWithArray({method: 'uploadfile', nomeArquivo: name},
                              {file: file},
                               successCallback);
            */

            return Upload.upload({
				url: '/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauparamincexc/uploadfile?nomeArquivo=' + name,
				headers: {'noCountRequest': 'true'},
				file: file

			}).success(function (result, status, headers,   config) {
               
				if (successCallback) {
					successCallback(result);
				}

			}).progress(function (evt) {
                if (progressCallback) {
					progressCallback(parseInt(100.0 * evt.loaded / evt.total, 10) + '%');
				}
			}).error(function (result, status, headers, config) {
                if (errorCallback) {
					errorCallback(result, status, headers, config);
				}

            });
        };
        factory.saveImportParam = function (fileTempName, tmpGridParam, callback) {
            factory.TOTVSPost({method: 'saveImportParam'},
                              {fileTempName: fileTempName,
                               tmpGridParam: tmpGridParam},
                              callback);
        };
        
        return factory;
    }

    index.register.factory('hvp.paramIncExc.Factory', paramIncExcFactory);	
});


