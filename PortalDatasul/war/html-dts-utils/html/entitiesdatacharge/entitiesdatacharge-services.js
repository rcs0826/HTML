define([
	'index',
	'/dts/dts-utils/js/api/fchutils0003.js',
	'/dts/dts-utils/js/msg-utils.js',	
	'/dts/mpd/js/mpd-components/mpd-components.js'
], function(index) {
	'use strict';

	entitiesDataChargeController.$inject = [
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
		'dts-utils.entitiesdatacharge.helper',
		'$modal',
		'$timeout',
		'dts-utils.message.Service'
	];
	function entitiesDataChargeController($scope,
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
										$timeout,
										messageUtils) {			
		var vm = this;

		vm.i18n = $filter('i18n');
			
		vm.entities = [];
		vm.disclaimers = [];
		vm.applications = 0;
		vm.settings;				
		vm.integEai = false;
		vm.integWebService = false;
		
		vm.integrationId = $stateParams.integrationId; //Id da Integração
		vm.defaultIntegrationId = $stateParams.defaultIntegrationId; //Id da integração default exemplo: 1 - MasterSales
		vm.integrationType = $stateParams.integrationType; // 1 - EAI2    2 - Webservice
		vm.applicationId = $stateParams.applicationId; // Id da aplicação
				
		this.init = function init() {

			appsintegFactory.getSettings(function(result) {									
				vm.settings = result;

				if(vm.integrationId  > 0 ){
					for (var i = 0; i < result.integrationSettings.length; i++) {
						if(result.integrationSettings[i]['integrationSetting']['idDefaultIntegration'] == vm.defaultIntegrationId){
							vm.applicationSetting = result.integrationSettings[i]['applicationSetting'];
							vm.applicationSettingExtraFields = result.integrationSettings[i]['applicationExtraFieldsSetting'];
							vm.entitiesSetting = result.integrationSettings[i]['entitiesSetting'];
						}
					}
				}	
			

				appsintegFactory.detailApplicationParameters({applicationId: vm.applicationId}, function(result) {	
					if(result.data){
						vm.applicationDetail =  result.data[0];
					}
				});

				var hasError = false;
							
				if (!hasError) {
					vm.search(false);
				} 

			});	
			           
		};

		vm.search = function search(isMore) {
			
			var options, filters = [];

			vm.entitiesCount = 0;
			if (!isMore) {
				vm.entities = [];
			}
			
			options = {
				page: vm.entities.length,
				pageSize: 100,
				integrationId: vm.integrationId,
				applicationId: vm.applicationId
			};	
			
			if(vm.searchValue){
				options.searchValue = vm.searchValue
			}

			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));

			appsintegFactory.getEntityApplication(options, function(result){	
				
				vm.hasNext = result.hasNext;								
				vm.entities = vm.entities.concat(result.data).reverse();				
				
				for (var i = 0; i < vm.entities.length; i++) {

					if(vm.integrationType == 1){ //EAI

						switch (vm.entities[i]['mode']){
							case 1:
								vm.entities[i]['modeSupportedDesc'] = $rootScope.i18n('l-send');
								break;
							case 2:
								vm.entities[i]['modeSupportedDesc'] = $rootScope.i18n('l-receive');
								break;
							case 3:
								vm.entities[i]['modeSupportedDesc'] = $rootScope.i18n('l-both');
								break;
						}
											
						switch (vm.entities[i]['modeEnabled']){
							case 0:
								vm.entities[i]['modeEnabledDesc'] = $rootScope.i18n('l-disabled');
								break;
							case 1:
								vm.entities[i]['modeEnabledDesc'] = $rootScope.i18n('l-send');
								break;
							case 2:
								vm.entities[i]['modeEnabledDesc'] = $rootScope.i18n('l-receive');
								break;
							case 3:
								vm.entities[i]['modeEnabledDesc'] = $rootScope.i18n('l-both');
								break;							
						}

					}else{

						switch (vm.entities[i]['mode']){
							case 0:
								vm.entities[i]['modeSupportedDesc'] = $rootScope.i18n('l-both');
								break;
						}
											
						switch (vm.entities[i]['modeEnabled']){
							case 0:
								vm.entities[i]['modeEnabledDesc'] = 'GET';
								break;
							case 1:
								vm.entities[i]['modeEnabledDesc'] = 'POST';
								break;
							case 2:
								vm.entities[i]['modeEnabledDesc'] = 'PUT';
								break;
							case 3:
								vm.entities[i]['modeEnabledDesc'] = 'PATCH';
								break;
							case 4:
								vm.entities[i]['modeEnabledDesc'] = 'DELETE';
								break;		
						}						

					}	

					vm.entities[i].showUpdateOption = true;
					vm.entities[i].showDeleteOption = true;
					vm.entities[i].showCopyOption   = true;

					if(vm.entitiesSetting){
						for (var y = 0; y < vm.entitiesSetting.length; y++) {
							
							if(vm.entitiesSetting[y].table == vm.entities[i].table &&
								vm.entities[i].transactionVersion ==  vm.entities[i].transactionVersion &&
								vm.entitiesSetting[y].idDefaultIntegration > 0){
									
								vm.entities[i].showUpdateOption = vm.entitiesSetting[y].editable;	
								vm.entities[i].showDeleteOption = vm.entitiesSetting[y].showDeleteOption;	
								vm.entities[i].showCopyOption = vm.entitiesSetting[y].showCopyOption;
										
							}
						}
					}
				};

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

		vm.lineSelected = function(lineSelected){
			/*$timeout(function(){
				if(vm.entityListSelected['idDefaultIntegration'] < 1){
					vm.showDeleteOption = true;
					vm.showUpdateOption = true;
				}else{
					vm.showDeleteOption = false;
					vm.showUpdateOption = false;
				}
			}, 100)*/
		}

		vm.enableActive = function (active) {			
			let updateActiveObject = {};			
			if (active != undefined) {				
				updateActiveObject = {
					'idEntityAplic': active['entityAplic'],
					'idAplic': active['aplic'],
					'idIntegr': active['idIntegr'],
					'table': active['table'],
					'database': active['database'],
					'transaction': active['transaction'],
					'transactionVers': active['transactionVers'],
					'modeSupported': active['mode'],
					'modeEnabled': active['modeEnabled'],
					'apiExec': active['apiExec'],
					'entityEnabled': active['entityEnabled'],
					'idDefaultIntegration': active['idDefaultIntegration'],
				};				
				appsintegFactory.updateEntity(updateActiveObject, function (result) {					
					//vm.search(false);
				});
			}
		}

		/*vm.copyEntity = function(lineSelected){
			if(lineSelected != undefined){				
				appsintegFactory.copyEntityApplication({applicationId: lineSelected['aplic'], entityId: lineSelected['entityAplic']}, {}, function(result){
					vm.search(false);
				});
			}			
		}*/


		vm.copyEntity = function (lineSelected) {		

			if (lineSelected != undefined) {

				var modalInstance = $modal.open({
					templateUrl: '/dts/dts-utils/html/entitiesdatacharge/entitiesdatacharge.copy.html',
					controller: 'entitiesdatacharge.copy.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md',
					resolve: {
						modalParams: function () {
							return {
								entityToCopy: lineSelected,
								integrationType: vm.integrationType
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

		
		vm.deleteEntity = function(lineSelected){
			
			if(lineSelected != undefined){

				var modalInstance = $modal.open({
					templateUrl: '/dts/dts-utils/html/entitiesdatacharge/entitiesdatacharge.confirm.html',
					controller: 'entitiesdatacharge.delete.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md'
				});

				modalInstance.result.then(function (data) {
					if (data.confirm) {																																		
						appsintegFactory.deleteEntityApplication({entityId: lineSelected['entityAplic']}, {}, function(result) {							
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
						
		vm.newEntity = function(){		

			var modalInstance = $modal.open({
				templateUrl: '/dts/dts-utils/html/entitiesdatacharge/entitiesdatacharge.add.html',
				controller: 'entitiesdatacharge.add.control as controller',
				backdrop: 'static',
                keyboard: false,
				size: 'md',
				resolve: {
					modalParams: function () {
						return {
							integrationType: vm.integrationType,
							applicationId: vm.applicationId,
							integrationId: vm.integrationId
						}
					}
				}
			});

			modalInstance.result.then(function(data) {
				vm.search(false);
			});						
		}
		
		vm.updateEntity = function (lineSelected) {	
			
			if (lineSelected != undefined) {

				var modalInstance = $modal.open({
					templateUrl: '/dts/dts-utils/html/entitiesdatacharge/entitiesdatacharge.update.html',
					controller: 'entitiesdatacharge.update.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md',
					resolve: {
						modalParams: function () {
							return {
								entityToEdit: lineSelected,
								integrationType: vm.integrationType,
								defaultIntegrationId: vm.defaultIntegrationId,
								integrationId: vm.integrationId,
								applicationId: vm.applicationId
							}
						}
					}
				});

				modalInstance.result.then(function (data) {

					lineSelected.apiExec        	   = data.apiExec;
					lineSelected.aplic          	   = data.idAplic;
					lineSelected.database       	   = data.database;
					lineSelected.entityAplic    	   = data.idEntityAplic;
					lineSelected.entityEnabled  	   = data.entityEnabled;
					lineSelected.idDefaultIntegration  = data.idDefaultIntegration;
					lineSelected.idIntegr 			   = data.idIntegr;
					lineSelected.mode 				   = data.modeSupported;
					lineSelected.modeEnabled 	       = data.modeEnabled;
					lineSelected.table 				   = data.table;
					lineSelected.transaction 		   = data.transaction;
					lineSelected.transactionVers       = data.transactionVers;

					if(vm.integrationType == 1){ //EAI

						if(lineSelected.mode  == 1){
							lineSelected.modeSupportedDesc = $rootScope.i18n('l-send'); 
						}

						if(lineSelected.mode  == 2){
							lineSelected.modeSupportedDesc = $rootScope.i18n('l-receive');
						}

						if(lineSelected.mode  == 3){
							lineSelected.modeSupportedDesc = $rootScope.i18n('l-both');
						}

						if(lineSelected.modeEnabled  == 0){
							lineSelected.modeEnabledDesc = $rootScope.i18n('l-disabled');
						}

						if(lineSelected.modeEnabled  == 1){
							lineSelected.modeEnabledDesc = $rootScope.i18n('l-send'); 
						}

						if(lineSelected.modeEnabled  == 2){
							lineSelected.modeEnabledDesc = $rootScope.i18n('l-receive');
						}

						if(lineSelected.modeEnabled  == 3){
							lineSelected.modeEnabledDesc = $rootScope.i18n('l-both');
						}
					}
			
					if(vm.integrationType == 2){ //Web Service

						if(lineSelected.mode  == 0){
							lineSelected.modeSupportedDesc = $rootScope.i18n('l-both'); 
						}
					
						if(lineSelected.modeEnabled  == 0){
							lineSelected.modeEnabledDesc = 'GET'; 
						}

						if(lineSelected.modeEnabled  == 1){
							lineSelected.modeEnabledDesc = 'POST';
						}

						if(lineSelected.modeEnabled  == 2){
							lineSelected.modeEnabledDesc = 'PUT';
						}
						
						if(lineSelected.modeEnabled  == 3){
							lineSelected.modeEnabledDesc = 'PATCH';
						}
						
						if(lineSelected.modeEnabled  == 4){
							lineSelected.modeEnabledDesc = 'DELETE';
						}	
					}

				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-app')
				});
			}			
		}
		
		vm.executeIntegration = function executeIntegration() {	

			appsintegFactory.applicationValidation(
				{},{'integrationType': String(vm.integrationType), 'validationName': 'execute-integration', 'validationType': 'ERROR', 'validationValue': vm.applicationDetail.schedulerServer}, function(result) {

				if(!vm.applicationDetail.enabled){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-application-disabled') + "."
					});
				}else{

					if(!vm.applicationDetail.schedulerServer){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-attention'),
							detail: $rootScope.i18n('l-no-scheduler-server') + "."
						});
					}else{

						if(vm.applicationId){

							messageUtils.question( {
								title: $rootScope.i18n('l-execute'),
								text: $rootScope.i18n('l-execute-integration-message') + "?",
								cancelLabel: $rootScope.i18n('l-no'),
								confirmLabel: $rootScope.i18n('l-yes'),
								callback: function(isPositiveResult) {
									if (isPositiveResult) {
										vm.confirmExecuteIntegration(vm.applicationId);
									}
								}
							});

						}else{
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-attention'),
								detail: $rootScope.i18n('l-select-application') + '.'
							});	
						}
					}	
				}	
			});		

		};

		vm.confirmExecuteIntegration = function confirmExecuteIntegration(selectedApplicationId){
			appsintegFactory.applicationValidation(
				{},{'integrationType': String(vm.integrationType), 'validationName': 'active-server-rpw', 'validationType': 'QUESTION', 'validationValue': vm.applicationDetail.schedulerServer }, function(result) {

				if(result[0].message == 'disabled-server-rpw'){
					messageUtils.question( {
						title: $rootScope.i18n('l-alert'),
						text: $rootScope.i18n('l-rpw-server') + ' (' + vm.applicationDetail.schedulerServer + ') ' + $rootScope.i18n('l-rpw-server-question') +  "?",
						cancelLabel: $rootScope.i18n('l-no'),
						confirmLabel: $rootScope.i18n('l-yes'),
						callback: function(isPositiveResult) {
							if (isPositiveResult) {
								vm.executeIntegrationServer(selectedApplicationId);
							}
						}
					});
				}else{
					vm.executeIntegrationServer(selectedApplicationId);
				}

			});	
		}		

		vm.executeIntegrationServer = function executeIntegrationServer(selectedApplicationId){
			appsintegFactory.applicationParametersDataCharge({applicationId: selectedApplicationId},{}, function(result) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'alert',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-executed-integration') + ": " + vm.applicationDetail.schedulerServer 
				});

				vm.search();						
			});	
		};
		

		vm.executeSingleEntity = function executeSingleEntity(){
			
			if(!vm.entityListSelected){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-entity') + "."
				});
			}else{					
				if(!vm.entityListSelected.entityEnabled){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-entity-disabled') + "."
					});
				}else{
					appsintegFactory.applicationValidation(
						{},{'integrationType': String(vm.integrationType), 'validationName': 'execute-integration', 'validationType': 'ERROR', 'validationValue': vm.applicationDetail.schedulerServer}, function(result) {

						if(!vm.applicationDetail.enabled){
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-attention'),
								detail: $rootScope.i18n('l-application-disabled') + "."
							});
						}else{			
							if(!vm.applicationDetail.schedulerServer){
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'error',
									title: $rootScope.i18n('l-attention'),
									detail: $rootScope.i18n('l-no-scheduler-server') + "."
								});
							}else{
								vm.confirmExecuteSingleIntegration();
							}
						}
					});
				}	
			}	
		}

		vm.confirmExecuteSingleIntegration = function confirmExecuteIntegration(){
			appsintegFactory.applicationValidation(
				{},{'integrationType': String(vm.integrationType), 'validationName': 'active-server-rpw', 'validationType': 'QUESTION', 'validationValue': vm.applicationDetail.schedulerServer }, function(result) {

				if(result[0].message == 'disabled-server-rpw'){
					messageUtils.question( {
						title: $rootScope.i18n('l-alert'),
						text: $rootScope.i18n('l-rpw-server') + ' (' + vm.applicationDetail.schedulerServer + ') ' + $rootScope.i18n('l-rpw-server-question') +  "?",
						cancelLabel: $rootScope.i18n('l-no'),
						confirmLabel: $rootScope.i18n('l-yes'),
						callback: function(isPositiveResult) {
							if (isPositiveResult) {
								vm.executeSingleIntegrationServer();
							}
						}
					});
				}else{
					vm.executeSingleIntegrationServer();
				}

			});	
		}			

		vm.executeSingleIntegrationServer = function executeIntegrationServer(){
			appsintegFactory.dataChargeSingleEntity({applicationId: vm.applicationId, entityId: vm.entityListSelected.entityAplic},{}, function(result) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'alert',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-executed-entity') + ": " + vm.applicationDetail.schedulerServer 
				});
				vm.search();						
			});
		};		

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

		if (appViewService.startView(vm.i18n('Entidades'), this)) {
			vm.init();
		}else{
			vm.init();
		}
				
	}
	
	// *************************************************************************************
	// ***  CONTROLLER BOTAO ADICIONAR
	// *************************************************************************************
	newEntityController.$inject = ['$scope', 'modalParams','$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', '$timeout', 'dts-utils.appsinteg.Factory'];
	function newEntityController($scope, modalParams, $modalInstance, $rootScope, $modal, TOTVSEvent, $timeout, appsintegFactory) {		

		var controller = this;
		controller.canSave = true;
		controller.model = {};
		controller.newEntityObject = {};
		controller.modesupported  = {model: {}};
		controller.modeenabled  = {model: {}};	
		
		controller.integrationType = modalParams.integrationType;
		controller.integrationId   = modalParams.integrationId;
		controller.applicationId   = modalParams.applicationId;	

		if(controller.integrationType == 1){ //EAI

			controller.modesupported.types = [
				{typeId: 1, descMode: $rootScope.i18n('l-send')},
				{typeId: 2, descMode: $rootScope.i18n('l-receive')},
				{typeId: 3, descMode: $rootScope.i18n('l-both')},
			];

			controller.modeenabled.types = [
				{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
				{typeId: 1, descEnabled: $rootScope.i18n('l-send')},				
			];

		}

		if(controller.integrationType == 2){ //Web Service
			controller.modesupported.types = [
				{typeId: 0, descMode: $rootScope.i18n('l-both')}
			];

			controller.modeenabled.types = [
				{typeId: 0, descEnabled: 'GET'},
				{typeId: 1, descEnabled: 'POST'},
				{typeId: 2, descEnabled: 'PUT'},
				{typeId: 3, descEnabled: 'PATCH'},
				{typeId: 4, descEnabled: 'DELETE'}
			];			
		}	

		controller.modesupported.model.typeId = 0;
		controller.modeenabled.model.typeId   = 3;		
		controller.activeEntity			      = false;
					
		controller.changeModeSupported = function changeModeSupported(){

			if(controller.integrationType == 1){ //EAI
				if(controller.modesupported.model.typeId == 1){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 1, descEnabled: $rootScope.i18n('l-send')},						
					];
				}
		
				if(controller.modesupported.model.typeId == 2){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},						
					];
				}
		
				if(controller.modesupported.model.typeId == 3){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 1, descEnabled: $rootScope.i18n('l-send')},
						{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},
						{typeId: 3, descEnabled: $rootScope.i18n('l-both')},
					];
				}
			}
		}

		controller.save = function (idDefaultIntegration) {			

			if (controller.entityName === undefined || controller.entityName === "") { controller.canSave = false; }
			if (controller.entityTransaction === undefined || controller.entityTransaction === "") { controller.canSave = false; }
			if (controller.entityTransactionversion === undefined || controller.entityTransactionversion === "") { controller.canSave = false; }
			if (controller.entityApiExec === undefined || controller.entityApiExec === "") { controller.canSave = false; }
						
			controller.newEntityObject = {
				'idAplic': parseInt(modalParams['applicationId']),
				'idIntegr': parseInt(modalParams['integrationId']),
				'table': controller.entityName,
				'database': controller.database,
				'transaction': controller.entityTransaction,
				'transactionVers': controller.entityTransactionversion,
				'modeSupported': controller.modesupported.model.typeId,
				'modeEnabled': controller.modeenabled.model.typeId,
				'apiExec': controller.entityApiExec,
				'entityEnabled': controller.activeEntity,
				'idDefaultIntegration': 0,
			};
						
			if (!controller.canSave) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-required-fields')
				});
				controller.canSave = true;
			} else {						
				appsintegFactory.newEntity(controller.newEntityObject, function (result) {					
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
	updateEntityController.$inject = ['$scope', 'modalParams', '$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', '$timeout', 'dts-utils.appsinteg.Factory', 'dts-utils.message.Service'];
	function updateEntityController($scope, modalParams, $modalInstance, $rootScope, $modal, TOTVSEvent, $timeout, appsintegFactory, messageUtils) {		
		
		var controller = this;
		controller.canSave = true;
		controller.updateEntityObject = {};	
		controller.model = {};	
		controller.modesupported  = {model: {}};
		controller.modeenabled  = {model: {}};		

		controller.integrationType      = modalParams.integrationType;
		controller.integrationId        = modalParams.integrationId;
		controller.applicationId        = modalParams.applicationId;
		controller.entityId             = modalParams.entityToEdit['entityAplic'];
		controller.defaultIntegrationId = modalParams.entityToEdit.idDefaultIntegration;

		controller.entityName                 = modalParams.entityToEdit['table'];
		controller.entityTransaction          = modalParams.entityToEdit['transaction'];
		controller.entityTransactionversion   = modalParams.entityToEdit['transactionVers'];
		controller.entityApiExec              = modalParams.entityToEdit['apiExec'];
		controller.database                   = modalParams.entityToEdit['database'];
		controller.activeEntity               = modalParams.entityToEdit['entityEnabled'];		
		controller.modeenabled.model.typeId   = modalParams.entityToEdit['modeEnabled'];
		controller.modesupported.model.typeId = modalParams.entityToEdit['mode'];

		controller.help = $rootScope.i18n('l-eai');	

		if(controller.integrationType == 1){ //EAI

			controller.modesupported.types = [
				{typeId: 1, descMode: $rootScope.i18n('l-send')},
				{typeId: 2, descMode: $rootScope.i18n('l-receive')},
				{typeId: 3, descMode: $rootScope.i18n('l-both')},
			];
			
			if(modalParams.entityToEdit['mode'] == 1){
				controller.modeenabled.types = [
					{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
					{typeId: 1, descEnabled: $rootScope.i18n('l-send')}					
				];
			}

			if(modalParams.entityToEdit['mode'] == 2){
				controller.modeenabled.types = [
					{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
					{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},					
				];
			}

			if(modalParams.entityToEdit['mode'] == 3){
				controller.modeenabled.types = [
					{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
					{typeId: 1, descEnabled: $rootScope.i18n('l-send')},
					{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},
					{typeId: 3, descEnabled: $rootScope.i18n('l-both')},					
				];
			}

		}

		if(controller.integrationType == 2){ //Web Service
			controller.modesupported.types = [
				{typeId: 0, descMode: $rootScope.i18n('l-both')}
			];

			controller.modeenabled.types = [
				{typeId: 0, descEnabled: 'GET'},
				{typeId: 1, descEnabled: 'POST'},
				{typeId: 2, descEnabled: 'PUT'},
				{typeId: 3, descEnabled: 'PATCH'},
				{typeId: 4, descEnabled: 'DELETE'}
			];			
		}	
		
		controller.changeModeSupported = function changeModeSupported(){

			if(controller.integrationType == 1){ //EAI

				if(controller.modesupported.model.typeId == 1){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 1, descEnabled: $rootScope.i18n('l-send')},						
					];
					controller.modeenabled.model.typeId = 1;
				}
		
				if(controller.modesupported.model.typeId == 2){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},						
					];
					controller.modeenabled.model.typeId = 2;
				}
		
				if(controller.modesupported.model.typeId == 3){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 1, descEnabled: $rootScope.i18n('l-send')},
						{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},
						{typeId: 3, descEnabled: $rootScope.i18n('l-both')},						
					];
					controller.modeenabled.model.typeId = 1;
				}

			}
		}		
				
		this.save = function () {

			if (controller.entityName === undefined || controller.entityName === "") { controller.canSave = false; }
			if (controller.entityTransaction === undefined || controller.entityTransaction === "") { controller.canSave = false; }
			if (controller.entityTransactionversion === undefined || controller.entityTransactionversion === "") { controller.canSave = false; }
			if (controller.entityApiExec === undefined || controller.entityApiExec === "") { controller.canSave = false; }

			controller.updateEntityObject = {
				'idEntityAplic': modalParams.entityToEdit['entityAplic'],
				'idAplic': modalParams.entityToEdit['aplic'],
				'idIntegr': modalParams.entityToEdit['idIntegr'],
				'table': controller.entityName,
				'database': controller.database,
				'transaction': controller.entityTransaction,
				'transactionVers': controller.entityTransactionversion,
				'modeSupported': controller.modesupported.model.typeId,
				'modeEnabled': controller.modeenabled.model.typeId,
				'apiExec': controller.entityApiExec,
				'entityEnabled': controller.activeEntity,
				'idDefaultIntegration': modalParams.entityToEdit.idDefaultIntegration,
			};

			if (!controller.canSave) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				controller.canSave = true;
			} else {								
				appsintegFactory.updateEntity(controller.updateEntityObject, function (result) {
					controller.saveExtraFields(result[0].aplic, result[0].entityAplic);
				});				
			}
		}

		this.close = function () {
			$modalInstance.dismiss('cancel');
		}

		this.getExtraFields = function getExtraFields(integrationId, applicationId, entityId){
			var options, filters = [];

			options = {
				page: 1,
				pageSize: 99999,
				integrationId: integrationId,
				applicationId: applicationId,
				entityId: entityId //Define que busca apenas os campos da entidade
			};
			
			appsintegFactory.getExtraFields(options, function(result) {
				controller.entityExtraFields = result.data;

				for (var i = 0; i < controller.entityExtraFields.length; i++) {
					controller.entityExtraFields[i].operation = "update";

					if(controller.entityExtraFields[i].fieldType == 4){
						var arrayDate = controller.entityExtraFields[i].value.split('/'); 
						controller.entityExtraFields[i].value = arrayDate[1] + '/' + arrayDate[0] + '/' + arrayDate[2];
						var date = new Date(controller.entityExtraFields[i].value);
						controller.entityExtraFields[i].value = date.getTime();
					}

					if(controller.entityExtraFields[i].fieldType == 5){
						if(controller.entityExtraFields[i].value == "true"){
							controller.entityExtraFields[i].value = true;
						}else{
							controller.entityExtraFields[i].value = false;
						}
					}

				}

			});
		}
		
		this.removeExtraField = function removeExtraField(extraField, index){

			messageUtils.question( {
				title: $rootScope.i18n('l-remove-extra-field'),
				text: $rootScope.i18n('l-remove-extra-field-message') + ": " + extraField.label  + "?",
				cancelLabel: $rootScope.i18n('l-no'),
				confirmLabel: $rootScope.i18n('l-yes'),
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						controller.doRemoveExtraField(index, extraField);
					}
				}
			});
		}	
		
		this.doRemoveExtraField = function removeExtraField(index, extraField){
			if(extraField.extraConfigurId){
				appsintegFactory.deleteExtraField({extraFieldId: extraField.extraConfigurId}, {}, function(result) {
					controller.entityExtraFields.splice(index, 1);
				});	
			}else{
				controller.entityExtraFields.splice(index, 1);
			}			
		}		
		
		this.saveExtraFields = function saveExtraFields(applicationId, entityId){
			
			var contResult = 0;	

			for (var i = 0; i < controller.entityExtraFields.length; i++) {
				if(controller.entityExtraFields[i].fieldType == 4){
					var date = new Date(controller.entityExtraFields[i].value);
					var day = controller.addZero(date.getDate());
					var month = controller.addZero((date.getMonth() + 1));
					var year = date.getFullYear();
					controller.entityExtraFields[i].value = day + "/" + month  + "/" + year;
				}	
				
				controller.entityExtraFields[i].value = String(controller.entityExtraFields[i].value);

				if(controller.entityExtraFields[i].operation == "new"){					
					//remove campo operation, usado apenas para controle de tela
					//delete controller.entityExtraFields[i].operation;

					controller.entityExtraFields[i].applicationId = applicationId;
					controller.entityExtraFields[i].entityId = entityId;
					appsintegFactory.newExtraField(controller.entityExtraFields[i], function (result) {
						contResult ++;

						//fecha o modal somente se a quantidade de resultados está igual a quantidades de extrafilds enviados para a api
						if (controller.entityExtraFields.length == contResult){
							$modalInstance.close(controller.updateEntityObject);
						}
					});	
				}	

				if(controller.entityExtraFields[i].operation == "update"){					
					//remove campo operation, usado apenas para controle de tela
					//delete controller.entityExtraFields[i].operation;
					appsintegFactory.updateExtraField(controller.entityExtraFields[i], function (result) {
						contResult ++;

						//fecha o modal somente se a quantidade de resultados está igual a quantidades de extrafilds enviados para a api						
						if (controller.entityExtraFields.length == contResult){
							$modalInstance.close(controller.updateEntityObject);
						}
					});	
				}
			}

			if (controller.entityExtraFields.length == 0){
				$modalInstance.close(controller.updateEntityObject);
			}
		}

		this.addExtraField = function addExtraField() {

			var modalInstance = $modal.open({
				templateUrl: '/dts/dts-utils/html/entitiesdatacharge/entitydatacharge.add.extrafield.html',
				controller: 'dts-utils.entitydatacharge.add.extrafield.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				resolve: {
					modalParams: function () {
						return {
							integrationId: controller.integrationId,
							defaultIntegrationId: controller.defaultIntegrationId,
							entityExtraFields: controller.entityExtraFields,
							entityId: controller.entityId
						}
					}
				}
			});

			modalInstance.result.then(function (data) {
				//define que o campo deve ser cadastrado ao salvar a aplicação no formulário
				data.extraField.operation = "new";
				controller.entityExtraFields.push(data.extraField);
			});
		}


		controller.getExtraFields(controller.integrationId, controller.applicationId, controller.entityId);

	}


	// *************************************************************************************
	// ***  CONTROLLER BOTAO COPIAR
	// *************************************************************************************
	copyEntityController.$inject = ['$scope', 'modalParams', '$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', '$timeout', 'dts-utils.appsinteg.Factory', 'dts-utils.message.Service'];
	function copyEntityController($scope, modalParams, $modalInstance, $rootScope, $modal, TOTVSEvent, $timeout, appsintegFactory, messageUtils) {		
		
		var controller = this;
		controller.canSave = true;
		controller.updateEntityObject = {};	
		controller.model = {};	
		controller.modesupported  = {model: {}};
		controller.modeenabled  = {model: {}};		

		controller.defaultIntegrationId = modalParams.entityToCopy.idDefaultIntegration;
		controller.integrationType      = modalParams.integrationType;
		controller.integrationId        = modalParams.integrationId;
		controller.applicationId        = modalParams.applicationId;
		controller.entityId             = modalParams.entityToCopy['entityAplic'];

		controller.entityName = modalParams.entityToCopy['table'];
		controller.entityTransaction = modalParams.entityToCopy['transaction'];
		controller.entityTransactionversion = modalParams.entityToCopy['transactionVers'];
		controller.entityApiExec = modalParams.entityToCopy['apiExec'];
		controller.database = modalParams.entityToCopy['database'];
		controller.activeEntity = modalParams.entityToCopy['entityEnabled'];		
		controller.modeenabled.model.typeId = modalParams.entityToCopy['modeEnabled'];
		controller.modesupported.model.typeId = modalParams.entityToCopy['mode'];		
		
		if(controller.integrationType == 1){ //EAI

			controller.modesupported.types = [
				{typeId: 1, descMode: $rootScope.i18n('l-send')},
				{typeId: 2, descMode: $rootScope.i18n('l-receive')},
				{typeId: 3, descMode: $rootScope.i18n('l-both')}
			];

			if(modalParams.entityToCopy['mode'] == 1){
				controller.modeenabled.types = [
					{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
					{typeId: 1, descEnabled: $rootScope.i18n('l-send')},
				];
			}

			if(modalParams.entityToCopy['mode'] == 2){
				controller.modeenabled.types = [
					{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
					{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},
				];
			}

			if(modalParams.entityToCopy['mode'] == 3){
				controller.modeenabled.types = [
					{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
					{typeId: 1, descEnabled: $rootScope.i18n('l-send')},
					{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},
					{typeId: 3, descEnabled: $rootScope.i18n('l-both')},
				];
			}

		}
		
		if(controller.integrationType == 2){ //Web Service
			controller.modesupported.types = [
				{typeId: 0, descMode: $rootScope.i18n('l-both')}
			];

			controller.modeenabled.types = [
				{typeId: 0, descEnabled: 'GET'},
				{typeId: 1, descEnabled: 'POST'},
				{typeId: 2, descEnabled: 'PUT'},
				{typeId: 3, descEnabled: 'PATCH'},
				{typeId: 4, descEnabled: 'DELETE'}
			];			
		}
		
		
		controller.changeModeSupported = function changeModeSupported(){

			if(controller.integrationType == 1){ //EAI

				if(controller.modesupported.model.typeId == 1){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 1, descEnabled: $rootScope.i18n('l-send')},						
					];
					controller.modeenabled.model.typeId = 1;
				}
		
				if(controller.modesupported.model.typeId == 2){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},						
					];
					controller.modeenabled.model.typeId = 2;
				}
		
				if(controller.modesupported.model.typeId == 3){
					controller.modeenabled.types = [
						{typeId: 0, descEnabled: $rootScope.i18n('l-disabled')},
						{typeId: 1, descEnabled: $rootScope.i18n('l-send')},
						{typeId: 2, descEnabled: $rootScope.i18n('l-receive')},
						{typeId: 3, descEnabled: $rootScope.i18n('l-both')},						
					];
					controller.modeenabled.model.typeId = 1;
				}

			}
		}		
		

		this.save = function () {

			if (controller.entityName === undefined || controller.entityName === "") { controller.canSave = false; }
			if (controller.entityTransaction === undefined || controller.entityTransaction === "") { controller.canSave = false; }
			if (controller.entityTransactionversion === undefined || controller.entityTransactionversion === "") { controller.canSave = false; }
			if (controller.entityApiExec === undefined || controller.entityApiExec === "") { controller.canSave = false; }

			controller.updateEntityObject = {
				'idEntityAplic': modalParams.entityToCopy['entityAplic'],
				'idAplic': modalParams.entityToCopy['aplic'],
				'idIntegr': modalParams.entityToCopy['idIntegr'],
				'table': controller.entityName,
				'database': controller.database,
				'transaction': controller.entityTransaction,
				'transactionVers': controller.entityTransactionversion,
				'modeSupported': controller.modesupported.model.typeId,
				'modeEnabled': controller.modeenabled.model.typeId,
				'apiExec': controller.entityApiExec,
				'entityEnabled': controller.activeEntity,
				'idDefaultIntegration': 0,
			};

			if (!controller.canSave) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				controller.canSave = true;
			} else {								
				appsintegFactory.newEntity(controller.updateEntityObject, function (result) {
					controller.saveExtraFields(result[0].aplic, result[0].entityAplic);
				});					
			}
		}

		this.close = function () {
			$modalInstance.dismiss('cancel');
		}

		this.getExtraFields = function getExtraFields(integrationId, applicationId, entityId){
			var options, filters = [];

			options = {
				page: 1,
				pageSize: 99999,
				integrationId: integrationId,
				applicationId: applicationId,
				entityId: entityId //Define que busca apenas os campos da entidade
			};
			
			appsintegFactory.getExtraFields(options, function(result) {
				controller.entityExtraFields = result.data;

				for (var i = 0; i < controller.entityExtraFields.length; i++) {

					if(controller.entityExtraFields[i].fieldType == 4){
						var arrayDate = controller.entityExtraFields[i].value.split('/'); 
						controller.entityExtraFields[i].value = arrayDate[1] + '/' + arrayDate[0] + '/' + arrayDate[2];
						var date = new Date(controller.entityExtraFields[i].value);
						controller.entityExtraFields[i].value = date.getTime();
					}

					if(controller.entityExtraFields[i].fieldType == 5){
						if(controller.entityExtraFields[i].value == "true"){
							controller.entityExtraFields[i].value = true;
						}else{
							controller.entityExtraFields[i].value = false;
						}
					}
				}

			});
		}
		
		
		this.saveExtraFields = function saveExtraFields(applicationId, entityId){
			for (var i = 0; i < controller.entityExtraFields.length; i++) {
					controller.entityExtraFields[i].applicationId = applicationId;
					controller.entityExtraFields[i].entityId = entityId;

					if(controller.entityExtraFields[i].fieldType == 4){
						var date = new Date(controller.entityExtraFields[i].value);
						var day = controller.addZero(date.getDate());
						var month = controller.addZero((date.getMonth() + 1));
						var year = date.getFullYear();
						controller.entityExtraFields[i].value = day + "/" + month  + "/" + year;
					}	

					controller.entityExtraFields[i].value = String(controller.entityExtraFields[i].value);

					appsintegFactory.newExtraField(controller.entityExtraFields[i], function (result) {});		
			}	
			
			$modalInstance.close();
		}


		this.removeExtraField = function removeExtraField(extraField, index){

			messageUtils.question( {
				title: $rootScope.i18n('l-remove-extra-field'),
				text: $rootScope.i18n('l-remove-extra-field-message') + ": " + extraField.label  + "?",
				cancelLabel: $rootScope.i18n('l-no'),
				confirmLabel: $rootScope.i18n('l-yes'),
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						controller.doRemoveExtraField(index, extraField);
					}
				}
			});
		}
		
		this.doRemoveExtraField = function removeExtraField(index, extraField){
			if(extraField.extraConfigurId){
				appsintegFactory.deleteExtraField({extraFieldId: extraField.extraConfigurId}, {}, function(result) {
					controller.entityExtraFields.splice(index, 1);
				});
			}else{
				controller.entityExtraFields.splice(index, 1);
			}				
		}
		
		this.addExtraField = function addExtraField() {

			var modalInstance = $modal.open({
				templateUrl: '/dts/dts-utils/html/entitiesdatacharge/entitydatacharge.add.extrafield.html',
				controller: 'dts-utils.entitydatacharge.add.extrafield.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				resolve: {
					modalParams: function () {
						return {
							integrationId: controller.integrationId,
							defaultIntegrationId: controller.defaultIntegrationId,
							entityExtraFields: controller.entityExtraFields,
							entityId: controller.entityId
						}
					}
				}
			});

			modalInstance.result.then(function (data) {
				//define que o campo deve ser cadastrado ao salvar a aplicação no formulário
				data.extraField.operation = "new";
				controller.entityExtraFields.push(data.extraField);
			});
		}		

		
		controller.getExtraFields(controller.integrationId, controller.applicationId, controller.entityId);		
		
	}


		
	// *************************************************************************************
	// ***  CONTROLLER MENSAGEM DE EXCLUSÃO DE RELACIONAMENTO
	// *************************************************************************************
	deleteEntityController.$inject = ['$modalInstance'];
	function deleteEntityController($modalInstance) {

		
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
	entityDataChargeHelper.$inject = ['$filter'];
	function entityDataChargeHelper($filter) {
		
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


	// *************************************************************************************
	// ***  CONTROLLER - INCLUSÃO DE CAMPO EXTRA
	// *************************************************************************************
	entityDataChargeAddExtraFieldController.$inject = ['$scope', 'modalParams', '$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', '$timeout', 'dts-utils.appsinteg.Factory'];

	function entityDataChargeAddExtraFieldController($scope, modalParams, $modalInstance, $rootScope, $modal, TOTVSEvent, $timeout, appsintegFactory) {

		var controller = this;
		
		controller.model = {
			disabled: false,
			field: "",
			fieldType: 0,
			hidden: false,
			idDefaultIntegration: 0,
			integrationId: parseInt(modalParams.integrationId),			
			label: "",
			sequence: 0,
			value:"",
			zoomDataBase: "",			
			zoomDescription: "",
			zoomTable: "",
			entityId: parseInt(modalParams.entityId),		
		};

		controller.fieldstype  = {model: {}};
		controller.fieldstype.model.typeId = 1;

		controller.fieldstype.types = [
			{typeId: 1, descType: $rootScope.i18n('l-character')},
			{typeId: 2, descType: $rootScope.i18n('l-search-zoom')},
			{typeId: 3, descType: $rootScope.i18n('l-number')},
			{typeId: 4, descType: $rootScope.i18n('l-date')},
			{typeId: 5, descType: $rootScope.i18n('l-checkbox')}
		];

		controller.hasSearch = false;

		this.changeHasSearch = function changeHasSearch() {
			controller.hasSearch = !controller.hasSearch;
		}

		this.changeFieldType = function changeFieldType() {
			if(controller.fieldstype.model.typeId == 2){
				controller.hasSearch = true;
			}else{
				controller.hasSearch = false;
			}
		}

		this.save = function () {

			if(!controller.model.field){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-extra-field-validation') + '.'
				});
				return;
			}

			if(!controller.model.label){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-extra-field-label-validation') + '.'
				});
				return;
			}
	
			if(controller.model.sequence < 1){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-extra-field-sequence-validation') + '.'
				});
				return;
			}			
			
			// Atualiza o objecto com o tipo do campo - 1 Normal , 2 Zoom
			controller.model.fieldType = controller.fieldstype.model.typeId;

			for (var i = 0; i < modalParams.entityExtraFields.length; i++) {
				if(modalParams.entityExtraFields[i].field == controller.model.field){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-duplicate-extra-field') + ': ' +  modalParams.entityExtraFields[i].field + ' (' + modalParams.entityExtraFields[i].label +  ').'
					});
					return;
				}
			}

			controller.model.sequence = parseInt(controller.model.sequence);

			if(controller.model.fieldType == 2){ 
				controller.validateFieldZoom = angular.copy(controller.model);
				
				appsintegFactory.zoomValidateExtraField(controller.validateFieldZoom, function (result) {
					if (!result.hasOwnProperty('message')) {
						$modalInstance.close({
							extraField: controller.model
						});
					}
				})

			}else{
				$modalInstance.close({
					extraField: controller.model
				});
			}		
		}

		this.close = function () {
			$modalInstance.dismiss('cancel');
		}
	}	
				
	index.register.controller('entitiesdatacharge.update.control', updateEntityController);
	index.register.controller('entitiesdatacharge.delete.control', deleteEntityController);
	index.register.controller('entitiesdatacharge.add.control', newEntityController);
	index.register.controller('entitiesdatacharge.copy.control', copyEntityController);
	index.register.service('dts-utils.entitiesdatacharge.helper', entityDataChargeHelper);
	index.register.controller('dts-utils.entitiesdatacharge.list.control', entitiesDataChargeController);
	index.register.controller('dts-utils.entitydatacharge.add.extrafield.control', entityDataChargeAddExtraFieldController);

	
});
