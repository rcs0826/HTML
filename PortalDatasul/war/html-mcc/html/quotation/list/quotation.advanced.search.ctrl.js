define([
	'index',
	'/dts/mcc/js/api/fchmatpricetable.js',
	'/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	advancedSearchModal.$inject = ['$modal'];
	function advancedSearchModal($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/quotation/list/quotation.advanced.search.html',
				controller: 'mcc.quotation.advancedSearchCtrl as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { 
					parameters: function () { return params; } 
				}
			});
			return instance.result;
		}
	}

	advancedSearchController.$inject = ['$rootScope','$scope', '$modalInstance', 'parameters','toaster', 'mcc.fchmatpricetable.Factory', 'mcc.zoom.serviceLegend'];
	function advancedSearchController($rootScope, $scope, $modalInstance, parameters, toaster, fchmatpricetable, serviceLegend) {
		var advancedSearchControl = this;
		advancedSearchControl.priceTableList = [];

		/*
         * Objetivo: método de inicialização da tela
         * Parâmetros: 
         * Observações: 
         */
		advancedSearchControl.init = function(){
			if(advancedSearchControl.model == undefined)
				advancedSearchControl.model = [];			
			if(parameters.disclaimers) {
				advancedSearchControl.disclaimers             = parameters.disclaimers;
                advancedSearchControl.currencies              = parameters.currencies;
                advancedSearchControl.model.currency          = parameters.currency;
                advancedSearchControl.model.dateOptionConvert = parameters.dateOptionConvert;
                advancedSearchControl.model.dateConvert       = parameters.dateConvert;
            } else {
				advancedSearchControl.disclaimers             = [];
                advancedSearchControl.currencies              = [];
                advancedSearchControl.model.currency          = 0;
                advancedSearchControl.model.dateOptionConvert = 1;
                advancedSearchControl.model.dateConvert       = null;
            }
			advancedSearchControl.parseDisclaimerToModel(advancedSearchControl.disclaimers);

			//seta padrão do parâmetro tipo do preço de referência caso não tenha sido informado
			if(!advancedSearchControl.model['referencePriceType'])
				advancedSearchControl.model['referencePriceType'] = 1; //Última Compra

			/* Atualiza a variável usada para controlar os campos desabilitados */
			if(advancedSearchControl.model['unlinked'])
				advancedSearchControl.model.unlinked2 = advancedSearchControl.model['unlinked'];
		
			//Busca lista de tabelas de preço
			fchmatpricetable.getPriceTableList({},function(result){
				if(result && result.length > 0){
					for (let index = 0; index < result.length; index++) {
						var element = result[index];
						element = {value: element['tableRowid'], label: element['tableName'] + " - " + element['tableDescription']};
						advancedSearchControl.priceTableList.push(element);
					}
				}
			})
		}

		/*
         * Objetivo: método que transforma os disclaimers em valores em variáveis do model.
         * Parâmetros: disclaimers: filtros ativos na busca
         * Observações: 
         */
		advancedSearchControl.parseDisclaimerToModel = function(disclaimers){
			// Transforma os disclaimers em parâmetros para a api
			angular.forEach(advancedSearchControl.disclaimers, function(disclaimer) {
				if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1){ /* Ranges */
					parameter = advancedSearchControl.getParameterFromDisclaimer(disclaimer.property);
					if(parameter){
						if(disclaimer.property.match(/Date*/)){ // Se for do tipo date converte para integer                            
                            advancedSearchControl.model[disclaimer.property] = {start: (parameter[0])?parseInt(parameter[0],10):undefined, end: (parameter[1])?parseInt(parameter[1],10):undefined};
                        }else{
							advancedSearchControl.model[disclaimer.property] = {};
							if(parameter[0]) 
								advancedSearchControl.model[disclaimer.property].start = parameter[0];
							if(parameter[1]) 
								advancedSearchControl.model[disclaimer.property].end = parameter[1];
						}
					}
				}else { /* Campos normais */
					if(disclaimer.property == "referencePriceType")
						advancedSearchControl.model[disclaimer.property] = serviceLegend.referencePriceType.ID(disclaimer.value);
					else
						advancedSearchControl.model[disclaimer.property] = disclaimer.value;
				}
			});
		}

		/*
		 * Objetivo: Retorna um objeto da lista de disclaimers recebidos de acordo com o nome da propriedade
		 * Parâmetros: property: nome da propriedade
		 */
		advancedSearchControl.getParameterFromDisclaimer = function(property){
			var value = undefined;
			$.grep(advancedSearchControl.disclaimers, function(e){
				if(e.property === property){
				value = e.value.split("&nbsp;");
				return;
				}
			});

			if(value[0] == 'undefined') value[0] = undefined;
			if(value[1] == 'undefined') value[1] = undefined;

			return value;
		};

		/*
		 * Objetivo: Habilita/Desabilita campos conforme parâmetros de Cotação Desvinculada
		 * Parâmetros:
		*/
		advancedSearchControl.changeUnlinked = function(){
			setTimeout(function(){
				if(advancedSearchControl.model.unlinked){
					advancedSearchControl.model.orderline = null;
					advancedSearchControl.model.requestQuotation = null;
					advancedSearchControl.model.site = null;

					advancedSearchControl.model.withoutAnswer = false;
					advancedSearchControl.model.withAnswer = false;
					advancedSearchControl.model.notConfirmed = false;
					advancedSearchControl.model.inQuotation = false;
					advancedSearchControl.model.quoted = false;
					advancedSearchControl.model.confirmed = false;
					advancedSearchControl.model.received = false;
					advancedSearchControl.model.deleted = false;
					advancedSearchControl.model.approved = false;
					advancedSearchControl.model.rejected = false;
					advancedSearchControl.model.withPendency = false;
					advancedSearchControl.model.withoutPendency = false;

					advancedSearchControl.model.unlinked2 = true;
				}else{
					advancedSearchControl.model.unlinked2 = false;

					$scope.$digest(); //força o angular atualizar a view para habilitar os campos para setá-los como true.
					advancedSearchControl.model.withoutAnswer = true;
					advancedSearchControl.model.withAnswer = true;
					$scope.$digest(); //atualiza a view para que os campos que dependam dos campos acima atualizem corretamente.
					advancedSearchControl.model.rejected = true;
					advancedSearchControl.model.withPendency = true;
					advancedSearchControl.model.withoutPendency = true;					
					advancedSearchControl.model.notConfirmed = true;
					advancedSearchControl.model.inQuotation = true;
				}
				
				$scope.$digest(); //atualiza a view
			},10);
		}

        /*
		 * Objetivo: Limpa a data de conversão
		 * Parâmetros:
		*/
		advancedSearchControl.changeDateOptionConvert = function() {
            if (advancedSearchControl.model.dateOptionConvert == 1) {
                advancedSearchControl.model.dateConvert = null;
            }
		}

		/*
		 * Objetivo: Limpa tabela de preço
		 * Parâmetros:
		*/
		advancedSearchControl.changeReferencePriceType = function(){
			if (advancedSearchControl.model.referencePriceType < 3) {
                advancedSearchControl.model.priceTableRowid = undefined;
            }
		}
				
		/*
		 * Objetivo: Cancelar ação / Fechar modal
		 * Parâmetros:
		 */
		advancedSearchControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		/*
		 * Objetivo: Retorna as informações informadas na pesquisa avançada e fecha a modal.
		 * Parâmetros:
		 */
		advancedSearchControl.apply = function(){
			//Repassa o label da tabela de preço para o model
			if(advancedSearchControl.model.priceTableRowid && advancedSearchControl.priceTableList && advancedSearchControl.priceTableList.length > 0){
				for (let i = 0; i < advancedSearchControl.priceTableList.length; i++) {
					if(advancedSearchControl.priceTableList[i].value === advancedSearchControl.model.priceTableRowid){
						advancedSearchControl.model.priceTableName = advancedSearchControl.priceTableList[i].label;
						break;
					}
				}
			}

            if (advancedSearchControl.model.dateOptionConvert == 2 &&
                advancedSearchControl.model.dateConvert == null) {
                toaster.pop('warning', $rootScope.i18n('msg-invalid-date', undefined, 'dts/mcc'));
            } else {            
                $modalInstance.close(advancedSearchControl.model);
            }
		}

		advancedSearchControl.init(); // busca as informações default da tela

		$scope.$on('$destroy', function () {
			followupListControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});
	}

	index.register.controller('mcc.quotation.advancedSearchCtrl', advancedSearchController);
	index.register.service('mcc.quotation.advancedSearchModal',advancedSearchModal);
});
