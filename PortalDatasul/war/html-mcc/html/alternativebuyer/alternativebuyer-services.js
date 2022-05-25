define([
	'index',
	'/dts/mcc/js/api/ccapi360.js',
	'/dts/mcc/js/zoom/comprador.js'
], function(index) {
	'use strict';
	/* jshint validthis: true */

	// ########################################################
	// ### CONTROLLER LISTAGEM
	// #######################################a#################
	alternativeBuyerController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'mcc.ccapi360.Factory', 'mcc.alternativebuyer.helper', 'mcc.alternativebuyer.modal.advanced.search.Service', 'TOTVSEvent'];
	function alternativeBuyerController($rootScope, $scope, appViewService, ccapi360, helper, modalAdvancedSearch, TOTVSEvent) {
		var alternativeBuyerControl = this;

		/**
		 * Inicialização do controller
		 * @return {}
		 */
		function initialize() {
			var createTab = appViewService.startView($rootScope.i18n('l-alternative-buyers', [], 'dts/mcc'), 'mcc.alternativebuyer.ListCtrl', alternativeBuyerControl);
			/*Impede o carregamento da tela ao trocar de abas*/
            if(appViewService.lastAction == "changetab")
				return;

			alternativeBuyerControl.load(false);
		}

		/**
		 * Busca os registros (compradores alternativos)
		 * @param  {Boolean} isMore Identifica se a chamada foi feita a partir do botão de paginação
		 * @return {}
		 */
		alternativeBuyerControl.load = function load(isMore) {
			var options = [];
			var filters = [];

			if(!isMore) {
				alternativeBuyerControl.buyers = [];
			}

			options = {
                start: alternativeBuyerControl.buyers.length,
                max: 50
            };

			angular.extend(options, helper.parseDisclaimersToParameters(alternativeBuyerControl.disclaimers));
			ccapi360.query(options, afterLoad);
		};

		/**
		 * Remover um comprador alternativo
		 * @param  {Object} buyer Comprador que será removido
		 * @return {}
		 */
		alternativeBuyerControl.remove = function remove(buyer) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
                		ccapi360.delete({'buyer': buyer['cod-comprado']}, afterRemove);
	                }
	            }
	        });
		};

		/**
		 * Exibe a modal de pesquisa avançada e após a confirmação aplica os filtros avançados
		 * @return {}
		 */
		alternativeBuyerControl.openAdvancedSearch = function openAdvancedSearch() {
			var instance = modalAdvancedSearch.open({
                'filters': alternativeBuyerControl.disclaimers
            });
			instance.then(function(parameters) {
                alternativeBuyerControl.disclaimers = angular.copy(parameters.filters);
				alternativeBuyerControl.load();
            });
		};

		/**
		 * Aplica o filtro simples de acordo com o conteúdo no input da tela
		 * @return {}
		 */
        alternativeBuyerControl.applySimpleFilter = function applySimpleFilter() {
			var quickSearch = $.grep(alternativeBuyerControl.disclaimers, function(filter) { return filter.property.indexOf('quickSearch') >= 0; })[0];
			var index = alternativeBuyerControl.disclaimers.indexOf(quickSearch);

			if(alternativeBuyerControl.quickSearch && alternativeBuyerControl.quickSearch.length > 0) {
				var disclaimer = helper.addFilter('quickSearch', alternativeBuyerControl.quickSearch, $rootScope.i18n('l-quick-search', [], 'dts/mcc'));

	            if(quickSearch) {
					alternativeBuyerControl.disclaimers[index] = disclaimer;
	            } else {
	                alternativeBuyerControl.disclaimers.push(disclaimer);
	            }
			} else if(index >= 0){
				alternativeBuyerControl.disclaimers.splice(index, 1);
			}
            alternativeBuyerControl.load(false);
        };

		/**
         * Remove um filtro (disclaimer)
         * @param  {Object} disclaimer Disclaimer que será removido
         * @return {}
         */
        alternativeBuyerControl.removeDisclaimer = function removeDisclaimer(disclaimer) {
            var index = alternativeBuyerControl.disclaimers.indexOf(disclaimer);
            if(index >= 0) {
                alternativeBuyerControl.disclaimers.splice(index, 1);
            }
            alternativeBuyerControl.load(false);
        };

		/**
		 * Função callback executada após o corregamento de registros
		 * @param  {Object} result Resultado da requisição, contém os compradores
		 * @return {}
		 */
		function afterLoad(result) {
			if(result && result.length > 0) {
				alternativeBuyerControl.buyersCount = result[0].$length;
				alternativeBuyerControl.buyers = alternativeBuyerControl.buyers.concat(result);
			}
		}

		/**
		 * Função callback executada após uma remoção de compradore
		 * @param  {Object} result Resultado da requisição
		 * @return {}
		 */
		function afterRemove(result) {
			if(!result.$hasError) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
		            detail: $rootScope.i18n('l-alternative-buyer', [], 'dts/mcc') + ' ' + $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
		        });
				alternativeBuyerControl.load();
			}
		}

	    if ($rootScope.currentuserLoaded) { initialize(); }
	    // *********************************************************************************
	    // *** Events Listners
	    // *********************************************************************************
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        initialize();
	    });
    }

	// ########################################################
	// ### CONTROLLER EDIÇÃO
	// #######################################a#################
	alternativeBuyerEditController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'mcc.ccapi360.Factory', 'TOTVSEvent'];
	function alternativeBuyerEditController($rootScope, $scope, $state, $stateParams, appViewService, ccapi360, TOTVSEvent) {
		var alternativeBuyerEditControl = this;

		alternativeBuyerEditControl.model = {};
		var isSaveNew = false;
		var page;

		/**
		 * Inicialização do controller
		 * @return {}
		 */
		function initialize() {
			alternativeBuyerEditControl.isUpdate = $state.is('dts/mcc/alternativebuyer.edit');
		
			var createTab = appViewService.startView($rootScope.i18n('l-alternative-buyers', [], 'dts/mcc'),'mcc.alternativebuyer.EditCtrl', alternativeBuyerEditControl);
			
			alternativeBuyerEditControl.isUpdate = $state.is('dts/mcc/alternativebuyer.edit');			

			/*Impede o carregamento da tela ao trocar de abas*/
			if(appViewService.lastAction == "changetab")
				return;

			if(alternativeBuyerEditControl.isUpdate) {
				loadBuyer();
			}else{
				alternativeBuyerEditControl.model = {};
				alternativeBuyerEditControl.validity = null;
			}
		}

		/**
		 * Salva um comprador alternativo
		 * @return {}
		 */
		alternativeBuyerEditControl.save = function save() {
			alternativeBuyerEditControl.model['dat-valid-ini'] = alternativeBuyerEditControl.validity ? alternativeBuyerEditControl.validity.start : null;
			alternativeBuyerEditControl.model['dat-valid-fim'] = alternativeBuyerEditControl.validity ? alternativeBuyerEditControl.validity.end : null;
			if(alternativeBuyerEditControl.isUpdate) {
				ccapi360.update({}, alternativeBuyerEditControl.model, afterUpdateBuyer);
			} else {
				ccapi360.save({}, alternativeBuyerEditControl.model, afterSaveBuyer);
			}
		};

		/**
		 * Salva um comprador alternativo, executada no clique do botão "Salvar e Novo" da tela
		 * @return {}
		 */
		alternativeBuyerEditControl.saveNew = function saveNew() {
			isSaveNew = true;
			alternativeBuyerEditControl.save();
		};

		/**
		 * Cancela a inserção ou edição
		 * @return {}
		 */
		alternativeBuyerEditControl.cancel = function cancel() {
			$state.go('dts/mcc/alternativebuyer.start');
		};

		/**
		 * Função callback executada após salvar um comprador
		 * @param  {Object} result Resultado da requisição
		 * @return {}
		 */
		function afterSaveBuyer(result) {
			if(!result.$hasError) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
		            detail: $rootScope.i18n('l-alternative-buyer', [], 'dts/mcc') + ' ' + $rootScope.i18n('l-success-created', [], 'dts/mcc') + '!'
		        });

				if(!isSaveNew) {
					$state.go('dts/mcc/alternativebuyer.start');
				} else {
					alternativeBuyerEditControl.model = {};
					alternativeBuyerEditControl.validity = {};
				}
				isSaveNew = false;
			}
		}

		/**
		 * Função callback executada após editar um comprador
		 * @param  {Object} result Resultado da requisição
		 * @return {}
		 */
		function afterUpdateBuyer(result) {
			if(!result.$hasError) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
		            detail: $rootScope.i18n('l-alternative-buyer', [], 'dts/mcc') + ' ' + $rootScope.i18n('l-success-updated', [], 'dts/mcc') + '!'
		        });
				$state.go('dts/mcc/alternativebuyer.start');
			}
		}

		/**
		 * Busca um comprador para ser editado
		 * @return {}
		 */
		function loadBuyer() {
			ccapi360.query({'path': 'buyer', 'buyer': $stateParams.buyer}, afterLoadBuyer);
		}

		/**
		 * Função callback executa após buscar um comprador para edição, seta o valor dos campos em tela
		 * @param  {Object} result Resultado da requisição, contém os dados do comprador
		 * @return {}
		 */
		function afterLoadBuyer(result) {
			var buyer = result[0];
			alternativeBuyerEditControl.model = angular.copy(buyer);
			alternativeBuyerEditControl.validity = {
				'start': buyer['dat-valid-ini'],
				'end': buyer['dat-valid-fim']
			};
		}

		if ($rootScope.currentuserLoaded) { initialize(); }
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			initialize();
		});
	}

	// ########################################################
	// ### CONTROLLER DETALHE
	// #######################################a#################
	alternativeBuyerDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'mcc.ccapi360.Factory', 'TOTVSEvent'];
	function alternativeBuyerDetailController($rootScope, $scope, $state, $stateParams, appViewService, ccapi360, TOTVSEvent) {
		var alternativeBuyerDetailControl = this;

		alternativeBuyerDetailControl.model = {};
		var page;

		/**
		 * Inicialização do controller
		 * @return {}
		 */
		function initialize() {
			var createTab = appViewService.startView($rootScope.i18n('l-alternative-buyers', [], 'dts/mcc'), 'mcc.alternativebuyer.DetailCtrl', alternativeBuyerDetailControl);
			page = appViewService.getPageActive();
			/*Impede o carregamento da tela ao trocar de abas*/
			if(appViewService.lastAction == "changetab")
				return;

			loadBuyer();
		}

		/**
		 * Volta para a tela anterior
		 * @return {}
		 */
		alternativeBuyerDetailControl.back = function back() {
			$state.go('dts/mcc/alternativebuyer.start');
		};

		/**
		 * Remove o comprador detalhado no momento
		 * @return {}
		 */
		alternativeBuyerDetailControl.remove = function remove() {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						ccapi360.delete({'buyer': alternativeBuyerDetailControl.model['cod-comprado']}, afterRemove);
					}
				}
			});
		};

		/**
		 * Função callback executa após a remoção de um comprador
		 * @param  {Object} result Resultado da requisição
		 * @return {}
		 */
		function afterRemove(result) {
			if(!result.$hasError) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					detail: $rootScope.i18n('l-alternative-buyer', [], 'dts/mcc') + ' ' + $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
				});
				$state.go('dts/mcc/alternativebuyer.start');
			}
		}

		/**
		 * Busca um comprador de acordo com os parâmetros da URL
		 * @return {}
		 */
		function loadBuyer() {
			ccapi360.query({'path': 'buyer', 'buyer': $stateParams.buyer}, afterLoadBuyer);
		}

		/**
		 * Função callback executada após a busca de um comprador, preenche os dados em tela.
		 * @param  {Object} result Resultado da requisição, contém os dados de um comprador
		 * @return {}
		 */
		function afterLoadBuyer(result) {
			alternativeBuyerDetailControl.model = angular.copy(result[0]);
		}

		if ($rootScope.currentuserLoaded) { initialize(); }
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			initialize();
		});
	}

	// *************************************************************************************
	// *** ADVANCED SEARCH
	// *************************************************************************************
	modalAdvancedSearchService.$inject = ['$modal'];
	function modalAdvancedSearchService($modal) {
		/**
		 * Abre a modal de pesquisa avançada
		 * @param  {Object} params Parâmetros que deverão ser passados para o controller da modal
		 * @return {Promise} instance Retorna a instância da modal
		 */
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/alternativebuyer/list/alternativebuyer.advanced.search.html',
				controller: 'mcc.alternativebuyer.modal.advanced.search.Ctrl as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	}

	modalAdvancedSearchController.$inject = ['$scope', '$rootScope', '$modalInstance', 'parameters', 'mcc.alternativebuyer.helper'];
	function modalAdvancedSearchController($scope, $rootScope, $modalInstance, parameters, helper) {
		var modalAdvancedSearchControl = this;

		/**
		 * Inicialização do controller
		 * @return {}
		 */
		function initialize() {
			modalAdvancedSearchControl.model = helper.parseDisclaimersToFilter(parameters.filters);
		}

		/**
		 * Aplica os filtros e fecha a modal
		 * @return {}
		 */
		modalAdvancedSearchControl.apply = function apply() {
			$modalInstance.close({
                'filters': parseFiltersToDisclaimers()
            });
		};

		/**
		 * Limpa os campos de pesquisa
		 * @return {}
		 */
		modalAdvancedSearchControl.clear = function clear() {
			modalAdvancedSearchControl.model = {};
		};

		/**
		 * Cancela a pesquisa e fecha a modal
		 * @return {}
		 */
		modalAdvancedSearchControl.cancel = function cancel() {
			$modalInstance.dismiss();
		};

		/**
		 * Converte os campos de filtro (inputs) para o padrão de objeto de um disclaimer.
		 * @return {Array} Disclaimers
		 */
		function parseFiltersToDisclaimers() {
			var filters = [];

			for (var property in modalAdvancedSearchControl.model) {
				if (modalAdvancedSearchControl.model.hasOwnProperty(property) && modalAdvancedSearchControl.model[property]) {
					switch (property) {
						case 'initialBuyer':
							filters.push(helper.addFilter(property, modalAdvancedSearchControl.model[property], $rootScope.i18n('l-initial-buyer')));
						break;
						case 'finalBuyer':
							filters.push(helper.addFilter(property, modalAdvancedSearchControl.model[property], $rootScope.i18n('l-final-buyer')));
						break;
						case 'initialAlternativeBuyer':
							filters.push(helper.addFilter(property, modalAdvancedSearchControl.model[property], $rootScope.i18n('l-initial-alternative-buyer')));
						break;
						case 'finalAlternativeBuyer':
							filters.push(helper.addFilter(property, modalAdvancedSearchControl.model[property], $rootScope.i18n('l-final-alternative-buyer')));
						break;
						case 'initialValidity':
							filters.push(helper.addFilter(property, modalAdvancedSearchControl.model[property], $rootScope.i18n('l-initial-validity'), 'date'));
						break;
						case 'finalValidity':
							filters.push(helper.addFilter(property, modalAdvancedSearchControl.model[property], $rootScope.i18n('l-final-validity'), 'date'));
						break;
					}
				}
			}

			return filters;
		}

		initialize();
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		    		 
		    $modalInstance.dismiss('cancel');
		});
	}

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
    alternativeBuyerHelper.$inject = ['$filter'];
    function alternativeBuyerHelper($filter) {
        return {
            /**
             * Cria um filtro (padrão de um disclaimer).
             * @param {string} property property do disclaimer
             * @param {string} value    valor do campo
             * @param {string} title    título do disclaimer
             * @param {string} type     tipo de campo (string, boolean, date). default: string
             * @param {boolean} hide    identifica se o disclaimer deve ficar escondido
             * @return {object} filter  disclaimer
             */
            addFilter: function (property, value, title, type, hide) {
                var filter = {
                    'property': property,
                    'value': value,
                    'type': type ? type : 'string',
                    'hide': hide === true
                };

                switch (type) {
                    case 'date':
                        filter.title = title + ': ' + $filter('date')(value, 'shortDate');
                    break;
                    case 'boolean':
                        filter.title = title;
                    break;
                    default:
                        filter.title = title + ': ' + value;
                    break;
                }
                return filter;
            },
            /**
             * Converte os disclaimers para um objeto contendo os respectivos valores.
             * @param  {Array} disclaimers Disclaimers que serão convertidos
             * @return {object} filters Objeto contendo os disclaimers convertidos da seguinte forma: object[disclaimer.property] = disclaimer.value
             */
            parseDisclaimersToFilter: function(disclaimers) {
                disclaimers = disclaimers || [];
                var filters = {};
                disclaimers.forEach(function(disclaimer) {
                    filters[disclaimer.property] = disclaimer.value;
                });
                return filters;
            },
            /**
             * Transforma os disclaimers em parâmetros para a API
             * @param  {array} disclaimers Disclaimers que serão convertidos em filtros para a API
             * @return {object} options filtros para a API
             */
            parseDisclaimersToParameters: function(disclaimers) {
                disclaimers = disclaimers || [];
                var options = {
                    properties: [],
                    values: []
                };
                disclaimers.forEach(function(filter) {
                    if (filter.property) {
                        options.properties.push(filter.property);
                        switch (filter.type) {
                            case 'date':
                                options.values.push($filter('date')(filter.value, 'shortDate'));
                            break;
                            default:
                                options.values.push(filter.value);
                            break;
                        }
                    }
                });
                return options;
            }
        };
    }

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.service('mcc.alternativebuyer.helper', alternativeBuyerHelper);
	index.register.service('mcc.alternativebuyer.modal.advanced.search.Service', modalAdvancedSearchService);
	index.register.controller('mcc.alternativebuyer.modal.advanced.search.Ctrl', modalAdvancedSearchController);

	index.register.controller('mcc.alternativebuyer.ListCtrl', alternativeBuyerController);
	index.register.controller('mcc.alternativebuyer.DetailCtrl', alternativeBuyerDetailController);
	index.register.controller('mcc.alternativebuyer.EditCtrl', alternativeBuyerEditController);
});
