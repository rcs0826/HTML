define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	transactionVsUserAssociativeFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function transactionVsUserAssociativeFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsautransactionvsuserassociative/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getTransactionVsUserAssociativeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getTransactionVsUserAssociativeByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };
         
        factory.saveTransactionVsUserAssociative = function (tmpTranusua, action, callback) {   

            factory.TOTVSPost({method: 'saveTransactionVsUserAssociative', action: action}, {tmpTranusua: tmpTranusua}, 
                function(result){
                    if(result && result.tmpTranusua){
                        result.tmpTranusua.$hasError = result.$hasError;
                        callback(result.tmpTranusua);
                        return;
                    }
                    callback(result);
                });
        }; 
                
        factory.removeTransactionVsUserAssociative = function (tmpTranusua,  callback) {            
            factory.TOTVSPost({method: 'removeTransactionVsUserAssociative'},{tmpTranusua: tmpTranusua}, 
                function(result){
                    if(result && result.tmpTranusua){
                        result.tmpTranusua.$hasError = result.$hasError;
                        callback(result.tmpTranusua);
                        return;
                    }
                    callback(result);
                });
        }; 
              
        factory.userCopy = function (excludeTransaction,idFromUser, idToUser, callback) {    

            factory.TOTVSGet({method: 'userCopy',
                             excludeTransaction : excludeTransaction,
                             idFromUser: idFromUser, 
                             idToUser: idToUser},
                             callback);
        };

        factory.transactionCopy = function (excludeUsers,fromCdTransaction, toCdTransaction, callback) {    

            factory.TOTVSGet({method: 'transactionCopy',
                             excludeUsers : excludeUsers,
                             fromCdTransaction: fromCdTransaction, 
                             toCdTransaction: toCdTransaction},
                             callback);
        };        

        return factory;
    }

    index.register.factory('hrc.transactionVsUserAssociative.Factory', transactionVsUserAssociativeFactory);	
});

