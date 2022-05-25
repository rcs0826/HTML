define([
	'index',
	'/dts/mcd/js/api/fch/fchdis/fchdis0062.js',
	
], function(index) {
	'use strict';

	relatPriceTableEstabController.$inject = [
		'$scope',
		'$rootScope',		
		'mcd.relatpricetableestab.Factory',
		'$filter',
		'$totvsprofile',
		'totvs.app-main-view.Service',
		'$stateParams',
		'$q',		
		'$location',
		'TOTVSEvent',
		'mcd.relatpricetableestab.helper',
		'$modal',
		'$timeout',
	];
	function relatPriceTableEstabController($scope,
										$rootScope,
										relatPricerTableEstabFactory,
										$filter,
										$totvsprofile,
										appViewService,
										$stateParams,
										$q,										
										$location,
										TOTVSEvent,
										helper,
										$modal,
										$timeout) {			

		var vm = this;

		vm.i18n = $filter('i18n');
							
		vm.disclaimers = [];
		vm.applications = 0;
		vm.settings;				
		
		this.init = function init() {			
			vm.search(false);
		};
				
		this.init = function init() {
			
			var hasError = false;
			            
            if (!hasError) {
                vm.search(false);
			} 
			           
		};

		vm.search = function search(isMore) {
			
			var options, filters = [];

			vm.listResultCount = 0;
			if (!isMore) {
				vm.listResult = [];
			}
			
			options = {
				page: vm.listResult.length,
				pageSize: 50
			};			
			
			if(vm.searchValue){
				options.searchValue = vm.searchValue
			}

			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));					
			
			relatPricerTableEstabFactory.getRelatPricerTableEstab(options, function(result) {										
				
				if(result.data != undefined){
					vm.hasNext = result.hasNext;				
					vm.listResult = vm.listResult.concat(result.data).reverse();
				}else{
					$timeout(function(){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'warning',
							title: $rootScope.i18n('Atenção'),
							detail: $rootScope.i18n('O parêmetro Segurança por Estabelecimento deve ser habilitado no programa CD0101', [], 'dts/mpd/')
						});
						var pageActive = appViewService.getPageActive();
							appViewService.releaseConsume(pageActive);
							appViewService.removeView(pageActive);				   					

					}, 500)					
				}
			});
		};
		
		vm.applySimpleFilter = function applySimpleFilter() {
			if (vm.searchValue && vm.searchValue.trim().length > 0) {
				var searchValue = $.grep(vm.disclaimers, function(filter){ return filter.property.indexOf('searchValue') >= 0; });
				var disclaimer = helper.addFilter('searchValue', vm.searchValue, $rootScope.i18n('l-simple-filter'));
				if(searchValue.length > 0) {
					var index = vm.disclaimers.indexOf(searchValue[0]);
					vm.disclaimers[index] = disclaimer;
				} else {
					vm.disclaimers.push(disclaimer);
				}

			}else{
				vm.disclaimers.forEach(function(tag) {
					var index = tag.property.indexOf('searchValue');
					if (index >= 0) {
						vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
					}
				});
			}
			vm.search(false);
		};

		vm.removeDisclaimer = function removeDisclaimer(disclaimer) {
			var index = vm.disclaimers.indexOf(disclaimer);
			if(index >= 0) {
				vm.disclaimers.splice(index,1);
			}

			if(disclaimer.property == "searchValue"){
				vm.searchValue = "";	
			}
			vm.search(false);
		};

		vm.removeSimpleFilter = function removeSimpleFilter() {
			vm.searchValue = "";
			vm.disclaimers.forEach(function (tag) {
				var index = tag.property.indexOf('searchValue');
				if (index >= 0) {
					vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
				}
			});

			vm.search();
		};

		vm.removeCustomFilter = function removeCustomFilter(filter) {
			$totvsprofile.remote.remove('dts.dts-utils.configdatacharge.filters', filter.title, function(result) {
				if(!result.$hasError) {
					var index = vm.listOfCustomFilters.indexOf(filter);
					vm.listOfCustomFilters.splice(index, 1);
				}
			});
		};

		vm.setQuickFilter = function setQuickFilter(filter) {
			vm.disclaimers = [].concat(filter.value);
			vm.search(false);
		};
								
		$scope.$on('$destroy', function () {
			vm = undefined;
		});
		
		if (appViewService.startView(vm.i18n('l-relac-estab-tab-preco'), this)) {
			vm.init();
		}else{
			vm.init();
		}				
	}
	
	// *************************************************************************************
	// ***  CONTROLLER RELACIONAR TABELA DE PREÇO X ESTABELECIMENTO
	// *************************************************************************************
	relatPriceTableEstabEditController.$inject = [
		'$rootScope',
		'$scope',
		'$modal',
		'$state',
		'totvs.app-main-view.Service',
		'customization.generic.Factory',
		'mcd.relatpricetableestab.Factory',
		'$stateParams',
		'$filter',
		'$timeout',
		'TOTVSEvent'
	];

	function relatPriceTableEstabEditController($rootScope,
		$scope,
		$modal,
		$state,
		appViewService,
		customizationService,
		relatPricerTableEstabFactory,
		$stateParams,
		$filter,
		$timeout,
		TOTVSEvent) {

		var controller = this;
		controller.estabel = $stateParams.estabel;				

		this.model = {};

		this.disabledKeyField = $state.is('dts/mcd/relatpricetableestab.edit');		
		
		if (this.disabledKeyField) {
			this.title = $rootScope.i18n('l-editar');
		} else {
			this.title = $rootScope.i18n('l-novo-registro');
		}

		this.redirectList = function () {
            $state.go('dts/mcd/relatpricetableestab.start');
		}
		

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {
			this.disabledKeyField = $state.is('dts/mcd/relatpricetableestab.edit');
						
			relatPricerTableEstabFactory.getTableEstab({estabelecId: controller.estabel}, function(result) {												
				controller.listResult     = result.data[0];
				controller.listResultAux  = result.data[0];
				controller.listResult2    = result.data[1];
				controller.listResultAux2 = result.data[1];				
			});
		}
		
		controller.applyTablesFilter = function (screenValue) {

			$rootScope.pendingRequests += 1;
																					
			if (screenValue === "" || screenValue === undefined) {
				controller.removeTableFilter();
			} else {

				$timeout(function () {

					var res = controller.listResult.filter(function (el) {
						return (el['nr_tabpre'].match(screenValue.toLowerCase()) || el['nr_tabpre'].match(screenValue.toUpperCase()) || el['descricao'].match(screenValue.toLowerCase()) || el['descricao'].match(screenValue.toUpperCase()));
					});

					if (res.length > 0) {
						controller.listResult = res;
					} else {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'info',
							title: $rootScope.i18n('l-attention'),
							detail: $rootScope.i18n('l-table-not-found')
						});
					}

					$rootScope.pendingRequests--;

				}, 100);
			}																
		};

		controller.applyRelacFilter = function (screenValue) {
			
			if (screenValue === "" || screenValue === undefined) {
				controller.removeRelacFilter();
			} else {
					
				var res = controller.listResult2.filter(function (el) {
					return (el['nr_tabpre'].match(screenValue.toLowerCase()) || el['nr_tabpre'].match(screenValue.toUpperCase()) || el['descricao'].match(screenValue.toLowerCase()) || el['descricao'].match(screenValue.toUpperCase()));					
				});

				if (res.length > 0) {
					controller.listResult2 = res;
				} else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-table-not-found')
					});
				}				
			}
		};
		

		controller.insertTablePrice = function(){

			let precoToRelac = [];

			for (var i = 0; i < controller.selectedItems.getSelectedItems().length; i++) {				
				var obj = {
					nr_tabpre: controller.selectedItems.getSelectedItems()[i]['nr_tabpre']
				}
				precoToRelac.push(obj);
			};

			let options = {                
                ttPrecoToRelac: precoToRelac
			};
						
			if (precoToRelac.length > 0) {
				relatPricerTableEstabFactory.postTableEstab({estabelecId: controller.estabel}, options, function(result) {				
					controller.init();
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('Nenhuma tabela selecionada')
				});
			}
									
		}

		controller.deleteTablePrice = function(){

			let precoToDel = [];

			for (var i = 0; i < controller.selectedItems2.getSelectedItems().length; i++) {				
				var obj = {
					nr_tabpre: controller.selectedItems2.getSelectedItems()[i]['nr_tabpre']
				}
				precoToDel.push(obj);
			};

			let options = {                
                ttPrecoToDel: precoToDel
			};						

			if (precoToDel.length > 0) {
				relatPricerTableEstabFactory.deleteTableEstab({ estabelecId: controller.estabel }, options, function (result) {
					controller.init();
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('Nenhuma tabela selecionada')
				});
			}															
		}

		controller.removeTableFilter = function () {
			$rootScope.pendingRequests += 1;
			controller.tableTerm = "";

			$timeout(function () {				
				controller.listResult = controller.listResultAux;
				$rootScope.pendingRequests--;
			}, 100);
		};

		controller.removeRelacFilter = function() {
			controller.relacTerm = "";
			controller.listResult2 = controller.listResultAux2;
		};

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) {
            controller.init();
        }
        
        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });

	}

	
	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	relatPriceTableEstabHelper.$inject = ['$filter'];
	function relatPriceTableEstabHelper($filter) {
		
		return {

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

			parseDisclaimersToFilter: function(disclaimers) {
				disclaimers = disclaimers || [];
				var filters = {};
				disclaimers.forEach(function(disclaimer) {
					filters[disclaimer.property] = disclaimer.value;
				});
				return filters;
			},

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

				
	index.register.controller('mcd.relatpricetableestab.edit.control', relatPriceTableEstabEditController);	
	index.register.service('mcd.relatpricetableestab.helper', relatPriceTableEstabHelper);
	index.register.controller('mcd.relatpricetableestab.list.control', relatPriceTableEstabController);
	
});
