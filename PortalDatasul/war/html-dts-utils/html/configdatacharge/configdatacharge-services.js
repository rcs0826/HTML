define([
	'index',
	'/dts/dts-utils/js/api/fchutils0003.js',	
	
], function(index) {
	'use strict';

	configDataChargeController.$inject = [
		'$scope',
		'$rootScope',
		'dts-utils.appsinteg.Factory',
		'$filter',
		'$totvsprofile',
		'totvs.app-main-view.Service',
		'$stateParams',
		'$q',		
		'$location',
		'TOTVSEvent',
		'dts-utils.configdatacharge.helper',
		'$modal',
		'$timeout',
	];
	function configDataChargeController($scope,
										$rootScope,
										appsintegFactory,
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
			
		vm.apps = [];
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

			vm.appsCount = 0;
			if (!isMore) {
				vm.apps = [];
			}
			
			options = {
				page: vm.apps.length,
				pageSize: 50
			};			

			if(vm.searchValue){
				options.searchValue = vm.searchValue
			}

			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));
						
			appsintegFactory.getAppsIntegList(options, function(result) {																	
				vm.hasNext = result.hasNext;				
				vm.apps = vm.apps.concat(result.data).reverse();				
			});
			
			appsintegFactory.getSettings(function(result) {									
				vm.settings = result;
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
		
		vm.deleteAppInteg = function(app){
			
			if(app != undefined){

				var modalInstance = $modal.open({
					templateUrl: '/dts/dts-utils/html/configdatacharge/configdatacharge.confirm.html',
					controller: 'configdatacharge.confirm.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md'
				});

				modalInstance.result.then(function (data) {
					if (data.confirm) {																						
						appsintegFactory.deleteIntegration({integrationId: app['idIntegr']}, {}, function(result) {							
							vm.search(false);
						});								
					}
				});
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-app')
				});
			}
			
		}
				
		vm.columnSelected = function(){
			$timeout(function(){				
				vm.applications = vm.appListSelected['quantityApplic'];
			}, 100)
		}

		vm.addAppInteg = function(){
			
			var modalInstance = $modal.open({
				templateUrl: '/dts/dts-utils/html/configdatacharge/configdatacharge.add.html',
				controller: 'configdatacharge.add.control as controller',
				backdrop: 'static',
                keyboard: false,
				size: 'md',
				resolve: {
					modalParams: function() {
						return {
							settings: vm.settings
						}
					}
				}
			});

			modalInstance.result.then(function(data) {
				vm.search(false);
			});			
		}

		
		vm.updateAppInteg = function (app) {

			if (app != undefined) {

				var modalInstance = $modal.open({
					templateUrl: '/dts/dts-utils/html/configdatacharge/configdatacharge.update.html',
					controller: 'configdatacharge.update.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md',
					resolve: {
						modalParams: function () {
							return {
								IntegToEdit: app
							}
						}
					}
				});

				modalInstance.result.then(function (data) {
					vm.search(false);
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-app')
				});
			}

		}		

		vm.listApps = function(appSelected){
			/* dts/dts-utils/applicationdatacharge/[integrationId]/[defaultIntegrationId]/[integrationType] */			
			if(appSelected != undefined){
				$location.url('/dts/dts-utils/applicationdatacharge/'+appSelected['idIntegr']+'/'+appSelected['idIntegrPadr']+'/'+appSelected['tipo']);
			}						
		}

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		//if ($rootScope.currentuserLoaded) { vm.init(); }
		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			vm = undefined;
		});

		if (appViewService.startView(vm.i18n('l-integrations'), this)) {
			vm.init();
		}else{
			vm.init();
		}
				
	}
	
	// *************************************************************************************
	// ***  CONTROLLER BOTAO ADICIONAR
	// *************************************************************************************
	appAddController.$inject = ['$scope', 'modalParams', '$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', '$timeout', 'dts-utils.appsinteg.Factory'];
	function appAddController($scope, modalParams, $modalInstance, $rootScope, $modal, TOTVSEvent, $timeout, appsintegFactory) {		
		
		var controller = this;
		controller.canSave = true;
		controller.model = {};
		controller.newIntegrationObject = {};
		this.integDesc = { model: {} };
		this.integType = { model: {} };

		controller.integDesc.types = [{codName: $rootScope.i18n('l-new'), idDefaultIntegration: 0}];		
		controller.integType.types = [{descType: "EAI", type:1},
		 							  {descType: "Web Service",type:2}];				
				
		controller.integDesc.model.idDefaultIntegration = 0;		
		controller.integType.model.type = 1;
							
		for (var i = 0; i < modalParams.settings.integrationSettings.length; i++) {			
			controller.integDesc.types.push(modalParams.settings.integrationSettings[i]['integrationSetting']);
		};			
		
		controller.selectedInteg = function (selectedTypeInteg) {
			if (selectedTypeInteg === 0) {
				controller.disableCodName  = false;
				controller.disableDescName = false;
				controller.disableType     = false;				
			} else {
				for (var i = 0; i < modalParams.settings.integrationSettings.length; i++) {
					if (modalParams.settings.integrationSettings[i]['integrationSetting']['idDefaultIntegration'] === selectedTypeInteg) {

						// Atualiza valores 
						controller.integType.model.type = modalParams.settings.integrationSettings[i]['integrationSetting']['type'];
						controller.integName = modalParams.settings.integrationSettings[i]['integrationSetting']['codName'];
						controller.descInteg = modalParams.settings.integrationSettings[i]['integrationSetting']['codDesc'];

						// Habilita/Desabilita campos
						controller.disableCodName = modalParams.settings.integrationSettings[i]['integrationSettingDisabled']['codName'];
						controller.disableDescName = modalParams.settings.integrationSettings[i]['integrationSettingDisabled']['codDesc'];
						controller.disableType = modalParams.settings.integrationSettings[i]['integrationSettingDisabled']['type'];
					}
				};
			}
		}
											
		controller.save = function (idDefaultIntegration) {			

			if (controller.descInteg === undefined || controller.descInteg === "") { controller.canSave = false; }
			if (controller.integName === undefined || controller.integName === "") { controller.canSave = false; }

			controller.newIntegrationObject = {
				'idIntegrPadr': idDefaultIntegration,
				'tipo': controller.integType.model.type,
				'desc': controller.descInteg,
				'nome': controller.integName
			};

			if (!controller.canSave) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				controller.canSave = true;
			} else {
				appsintegFactory.newIntegration(controller.newIntegrationObject, function (result) {					
					$modalInstance.close();
				});
				
			}
		}

		controller.close = function () {
			$modalInstance.dismiss();
		}

	}
	
	// *************************************************************************************
	// ***  CONTROLLER BOTAO ALTERAR
	// *************************************************************************************
	appUpdateController.$inject = ['$scope', 'modalParams', '$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', '$timeout', 'dts-utils.appsinteg.Factory'];
	function appUpdateController($scope, modalParams, $modalInstance, $rootScope, $modal, TOTVSEvent, $timeout, appsintegFactory) {		

		var controller = this;
		controller.canSave = true;
		controller.model = {};
						
		controller.integName = modalParams.IntegToEdit['nome'];
		controller.descInteg = modalParams.IntegToEdit['desc'];
		controller.integType = modalParams.IntegToEdit['descTipo'];
				
		this.save = function () {

			if (controller.descInteg === undefined || controller.descInteg === "") { controller.canSave = false; }
			if (controller.integName === undefined || controller.integName === "") { controller.canSave = false; }

			controller.newIntegrationObject = {
				'idIntegrPadr': modalParams.IntegToEdit['idIntegrPadr'],
				'tipo': modalParams.IntegToEdit['tipo'],
				'desc': controller.descInteg,
				'nome': controller.integName,
				'descTipo': modalParams.IntegToEdit['descTipo'],
				'idIntegr': modalParams.IntegToEdit['idIntegr']
			};

			if (!controller.canSave) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				controller.canSave = true;
			} else {
				appsintegFactory.updateIntegration(controller.newIntegrationObject, function (result) {
					$modalInstance.close();
				});
			}
		}

		this.close = function () {
			$modalInstance.dismiss('cancel');
		}
	}
		
	// *************************************************************************************
	// ***  CONTROLLER MENSAGEM DE EXCLUSÃO DE RELACIONAMENTO
	// *************************************************************************************
	appDeleteController.$inject = ['$modalInstance'];
	function appDeleteController($modalInstance) {

		var controller = this;

		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}

		controller.confirm = function(){
			$modalInstance.close({
				confirm: true
			});
		}
	}
	
	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	configDataChargeHelper.$inject = ['$filter'];
	function configDataChargeHelper($filter) {
		
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
		
	index.register.controller('configdatacharge.confirm.control', appDeleteController);
	index.register.controller('configdatacharge.add.control', appAddController);
	index.register.controller('configdatacharge.update.control', appUpdateController);	
	index.register.service('dts-utils.configdatacharge.helper', configDataChargeHelper);
	index.register.controller('dts-utils.configdatacharge.list.control', configDataChargeController);
	
});
