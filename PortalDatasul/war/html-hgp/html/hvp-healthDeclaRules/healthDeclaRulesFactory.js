define(['index',
    'ng-load!ui-file-upload'
], function (index) {

    healthDeclaRulesFactory.$inject = ['$totvsresource' , 'dts-utils.utils.Service','Upload','$rootScope'];
    function healthDeclaRulesFactory($totvsresource, dtsUtils,Upload,$rootScope) {

	
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhealthdeclaration/:method/:id', {}, {
					  'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'},headers: {enctype:'multipart/form-data'}},
					  'post':{method: 'POST',params: {method:'@method'}}                    
			
		});	

        factory.postTeste = 
		function(teste,callback){			
			factory.TOTVSPost(
			    {method: 'postTeste',
				teste: teste},{},callback);
		};       
	
        factory.getHealthDeclaRulesByFilter = 
		function (searchByid,startAt,pageOffset, disclaimers,searchGrup,callback) {			
			tmpFilterValue = dtsUtils.mountTmpFilterValue(disclaimers);

			factory.parseHeaders(true);
            factory.TOTVSPost(
			    {method: 'healthDeclaRules', 
                 searchByid: searchByid,startAt:startAt,pageOffset:pageOffset,searchGrup:searchGrup},tmpFilterValue,
            callback);				
        };		

		factory.removeDeclaSaude = function(idHealthDeclaSaude,callback){
			factory.TOTVSPost(
			    {method: 'removeDeclaSaude',
				idHealthDeclaSaude: idHealthDeclaSaude},{},callback);
		};
		
        factory.saveHealthDeclaRules = function(tmpRegraDeclaSaude,tmpPropostDeclaSaude, callback){
            factory.TOTVSPost({method: 'postSaveHealthAudit'},
                                {tmpRegraDeclaSaude: [tmpRegraDeclaSaude], tmpPropostDeclaSaude: tmpPropostDeclaSaude},
                                callback);
        };
        factory.updateHealthDeclaRules = function(tmpRegraDeclaSaude,tmpPropostDeclaSaude, callback){
            factory.TOTVSPost({method: 'postUpdateHealthDeclaRules'},
                                {tmpRegraDeclaSaude: [tmpRegraDeclaSaude], tmpPropostDeclaSaude: tmpPropostDeclaSaude},
                                callback);
        };		
		
        factory.postValidatePropost = function(tmpRegraDeclaSaude,tmpPropostDeclaSaude, callback){	
            factory.TOTVSPost({method: 'postValidatePropost'},
                                {tmpRegraDeclaSaude: [tmpRegraDeclaSaude], tmpPropostDeclaSaude: tmpPropostDeclaSaude},
                                callback);
        };		
		
		factory.upload = function(file,name,media,dsMensagem,callback,callbackProgress, callbackError){		
			return Upload.upload({
				url: '/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhealthdeclaration/upload?nomeArquivo=' + file.name,
				headers: {'noCountRequest': 'true'},
				file: file

			}).success(function (result, status, headers, config) {
               
				if (callback) {
					callback(result,dsMensagem);
				}

				//$rootScope.$broadcast(CRMEvent.scopeUploadAttachment, (result && result.length > 0 ? result[0] : undefined));

			}).progress(function (evt) {

				if (callbackProgress) {
					callbackProgress(parseInt(100.0 * evt.loaded / evt.total, 10) + '%', evt,dsMensagem);
				}
			}).error(function (result, status, headers, config) {

				if (callbackError) {
					callbackError(result, status, headers, config);
				}

			});
		/*	this.parseHeaders({'Content-Type': 'multipart/form-data' });
            factory.postWithArray({method: 'upload',file,name,media},{} ,callback);*/
		};


		
        return factory;
    }

    index.register.factory('hvp.healthDeclaRulesFactory', healthDeclaRulesFactory)          ;
});
