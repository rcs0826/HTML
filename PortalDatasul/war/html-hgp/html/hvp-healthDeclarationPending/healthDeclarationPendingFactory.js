define(['index',
    '/dts/hgp/html/util/dts-utils.js',
    'ng-load!ui-file-upload',
], function (index) {

    healthDeclarationPendingFactory.$inject = ['$totvsresource','dts-utils.utils.Service','Upload'];
	function healthDeclarationPendingFactory($totvsresource, dtsUtils,Upload) {       
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhealthdeclarationpending/:method/:id', {}, {
					  'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}                      
		});			
		
        factory.getAllHealthDeclaPending = 
		function (searchById, pageOffset, limit, tmpDisclaimers,callback) {    
                 
            factory.postWithArray({method: 'getAllHealthDeclaPending' ,
                searchById:searchById,pageOffset:pageOffset,limit:limit},tmpDisclaimers
             ,callback);
        };

        factory.getHealthDeclaPending  = 
        function(id,callback){            
            factory.TOTVSPost({method: 'getHealthDeclaPending',
                idPendentAuditoria: id},{},
            callback);
        };
        
        factory.disapprove = 
        function (tmpPendingDeclaSaude,callback) {
            factory.TOTVSPost({method: 'disapprove'},
            tmpPendingDeclaSaude,
            callback);
        };


        factory.approve = 
        function (tmpPendingDeclaSaude,callback) {
            factory.TOTVSPost({method: 'approve'},
            tmpPendingDeclaSaude,
            callback);
        };


        factory.removeAttachment = 
        function (anexo,callback) {
            factory.TOTVSPost({method: 'removeAttachment',idAnexo:anexo.id},
            {},callback);
        };

        factory.upload = 
        function(file,name,media,idPessoa,tpDocumento,callback,callbackProgress, callbackError){     
            return Upload.upload({
                url: '/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhealthdeclarationpending/upload?nomeArquivo=' + file.name + '&idPessoa=' + idPessoa + '&tpAnexo=' + tpDocumento,
                headers: {'noCountRequest': 'true'},
                file: file

            }).success(function (result, status, headers, config) {
               
                if (callback) {
                    callback(result);
                }
              
            }).progress(function (evt) {

                if (callbackProgress) {
                    callbackProgress(parseInt(100.0 * evt.loaded / evt.total, 10) + '%', evt);
                }
            }).error(function (result, status, headers, config) {

                if (callbackError) {
                    callbackError(result, status, headers, config);
                }

            });
        };


        return factory;
    }

    index.register.factory('hvp.healthDeclarationPendingFactory', healthDeclarationPendingFactory);
});
