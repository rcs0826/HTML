define(['index',
        'ng-load!ui-file-upload'], function(index) {

	fchmanproductionplanitemFactory.$inject = ['$totvsresource', 'Upload'];
    
    function fchmanproductionplanitemFactory($totvsresource, Upload) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchman/fchmanproductionplanitem/:method/:id', {}, {
			
			postArray: { 
				method: 'POST',
				isArray: true
			}
			
		});
	    
        factory.TOTVSPostArray = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.postArray(parameters, model);
            return this.processPromise(call, callback);
        }; 
        
        /* Função....: getProductionPlanItemsBatch
           Descrição.: busca os itens do plano de produção em lotes
           Parâmetros: productionPlanCode - codigo do plano de producao
                       parameters - ttProductionPlanItemBatchParamVO */
        factory.getProductionPlanItemsBatch = function (productionPlanCode, parameters, callback) {

            return this.TOTVSPost({method:"getProductionPlanItemsBatch", id:productionPlanCode}, parameters, callback);
        };
        
        
        /* Função....: getProductionPlanItemNeedsReference
           Descrição.: busca as necessidades dos itens de acordo com a referência
           Parâmetros: objeto com as propriedades: productionPlanCode, itemCode, reference */
        factory.getProductionPlanItemNeedsReference = function (parameters, callback) {
            
            return this.TOTVSPostArray({method:"getProductionPlanItemNeedsReference"}, parameters, callback);
        };
        
        
        /* Função....: addProductionPlanItem
           Descrição.: adiciona um item no plano de produção
           Parâmetros: ttProductionPlanItem */
        factory.addProductionPlanItem = function (parameters, callback) {

            return this.TOTVSPost({method:"addProductionPlanItem"}, parameters, callback);
        };
        
        
        /* Função....: removeProductionPlanItem
           Descrição.: remove um item do plano de produção
           Parâmetros: objeto com as propriedades: productionPlanCode, itemCode */
        factory.removeProductionPlanItem = function (parameters, callback) {

            return this.TOTVSPost({method:"removeProductionPlanItem"}, parameters, callback);
        };
		
		/* Função....: setProductionPlanItemNeeds
           Descrição.: atualiza as necessidades do item
           Parâmetros: objeto com as propriedades: planCode, ttProductionPlanItemVO,
                                                   isImport, isOverride, importType */
        factory.setProductionPlanItemNeeds = function (parameters, callback) {

            return this.TOTVSPost({method:"setProductionPlanItemNeeds"}, parameters, callback);
        };
        
        
        /* Função....: getDateOfPeriod
           Descrição.: busca a data do periodo
           Parâmetros: parameters: ttPeriodDateVO {period, year, periodType} */
        factory.getDateOfPeriod = function (parameters, callback) {

            return this.TOTVSPostArray({method:"getDateOfPeriod"}, parameters, callback);
        };
        
		
        /* Função....: getPeriodOfDate
           Descrição.: busca o periodo da data informada
           Parâmetros: periodType - tipo do periodo
                       parameters - data */
        factory.getPeriodOfDate = function (periodType, parameters, callback) {
            return this.TOTVSPostArray({method:"getPeriodOfDate", id:periodType}, parameters.date, callback);
        };
        
        
        /* Função....: importItemsFile
           Descrição.: Efetua a importação das necessidades do arquivo
           Parâmetros: parameters - objeto com o codigo do plano, tipo da importação (1 período/ano, 2 data),
                                    flag para sobrescrever necessidades e o arquivo
                       callback - retorno da requisição
                       callbackProgress - não utilizado
                       callbackError - não utilizado */
        factory.importItemsFile = function (parameters, callback, callbackProgress, callbackError) {

			return Upload.upload({

				url: '/dts/datasul-rest/resources/api/fch/fchman/fchmanproductionplanitem/importItemsFile?' +
                     'planCode='        + parameters.planCode +
                     '&importType='     + parameters.importType +
                     '&overrideItems='  + parameters.overrideItems,
				headers: {},
				file: parameters.file

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
        
        factory.getPeriod = function (id, param, callback) {
            return this.TOTVSPostArray({method:"getPeriod", id:id}, param, callback);
        };
        
        return factory;
    }
	
    index.register.factory('fchman.fchmanproductionplanitem.Factory', fchmanproductionplanitemFactory);
});