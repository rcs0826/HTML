define([
	'index',
	'/dts/dts-utils/js/api/fchutils0003.js',
	'/dts/dts-utils/js/msg-utils.js',	
	'/dts/dts-utils/js/lodash-angular.js',
	'/dts/mpd/js/mpd-components/mpd-components.js',
	'/dts/dts-utils/js/zoom/servid-exec.js'			
], function(index) {
	'use strict';

	applicationDataChargeController.$inject = [
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
		'dts-utils.applicationdatacharge.helper',
		'$modal',
		'$timeout',
		'dts-utils.message.Service',
		'$http',
	];
	function applicationDataChargeController($scope,
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
										messageUtils,
										$http) {			
		var vm = this;

		vm.i18n = $filter('i18n');
			
		vm.apps = [];
		vm.disclaimers = [];
		vm.applications = 0;
		vm.settings;
		vm.hasNext = true;
		vm.pageSize = 50;
		vm.page = 1;
		vm.entitiesQuantity = 0;

		vm.integrationId = $stateParams.integrationId;
		vm.defaultIntegrationId = $stateParams.defaultIntegrationId;
		vm.integrationType = $stateParams.integrationType; // 1 - EAI2    2 - Webservice

		this.init = function init(openNow) {

			appsintegFactory.detailIntegration({integrationId: vm.integrationId}, function(result) {	
				if(result.data){
					vm.integrationDetail =  result.data[0];
				}
			});	

			appsintegFactory.getSettings(function(result) {									
				vm.settings = result;
				
				if(vm.integrationId  > 0 ){
					for (var i = 0; i < result.integrationSettings.length; i++) {
						if(result.integrationSettings[i]['integrationSetting']['idDefaultIntegration'] == vm.defaultIntegrationId){
							vm.applicationSetting = result.integrationSettings[i]['applicationSetting'];
							vm.applicationSettingExtraFields = result.integrationSettings[i]['applicationExtraFieldsSetting'];
							vm.applicationSettingDisabled = result.integrationSettings[i]['applicationSettingDisabled'];
							vm.applicationSettingHidden = result.integrationSettings[i]['applicationSettingHidden'];
						}
					}


					vm.search();

				}else{
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-open-with-integrations-view') + '.'
					});
				}

			});							
		};

		vm.nextPage = function nextPage(){
			vm.page = vm.page + 1;
			vm.getApplications();
		}
		
		vm.search = function search() {
			vm.page = 1;
			vm.apps = [];
			vm.entitiesQuantity = 0;
			vm.getApplications();
		};

		vm.getApplications = function getApplications(){
			var options, filters = [];

			options = {
				page: vm.page,
				pageSize: vm.pageSize,
				integrationId: vm.integrationId
			};
			
			if(vm.searchValue){
				options.searchValue = vm.searchValue
			}

			angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));

			//Busca Registros da grade
			appsintegFactory.getApplicationParameters(options, function(result) {
				vm.hasNext = result.hasNext;
				vm.apps = vm.apps.concat(result.data);				
			});
		}

		vm.executeIntegration = function executeIntegration(selectedApplications) {	

			appsintegFactory.applicationValidation(
				{},{'integrationType': String(vm.integrationType), 'validationName': 'execute-integration', 'validationType': 'ERROR', 'validationValue': selectedApplications.schedulerServer}, function(result) {

				if(!selectedApplications.enabled){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-application-disabled') + "."
					});
				}else{

					if(!selectedApplications.schedulerServer){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-attention'),
							detail: $rootScope.i18n('l-no-scheduler-server') + "."
						});
					}else{
						
						if(selectedApplications){
							messageUtils.question( {
							title: $rootScope.i18n('l-execute'),
							text: $rootScope.i18n('l-execute-integration-message') + "?",
							cancelLabel: $rootScope.i18n('l-no'),
							confirmLabel: $rootScope.i18n('l-yes'),
							callback: function(isPositiveResult) {
								if (isPositiveResult) {
									vm.confirmExecuteIntegration(selectedApplications);
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

		vm.confirmExecuteIntegration = function confirmExecuteIntegration(selectedApplications){

			appsintegFactory.applicationValidation(
				{},{'integrationType': String(vm.integrationType), 'validationName': 'active-server-rpw', 'validationType': 'QUESTION', 'validationValue': selectedApplications.schedulerServer }, function(result) {
				

				if(result[0].message == 'disabled-server-rpw'){
					messageUtils.question( {
						title: $rootScope.i18n('l-alert'),
						text: $rootScope.i18n('l-rpw-server') + ' (' + selectedApplications.schedulerServer + ') ' + $rootScope.i18n('l-rpw-server-question') +  "?",
						cancelLabel: $rootScope.i18n('l-no'),
						confirmLabel: $rootScope.i18n('l-yes'),
						callback: function(isPositiveResult) {
							if (isPositiveResult) {
								vm.executeIntegrationServer(selectedApplications);
							}
						}
					});
				}else{
					vm.executeIntegrationServer(selectedApplications);
				}

			});								
		}

		vm.executeIntegrationServer = function executeIntegrationServer(selectedApplications){
			appsintegFactory.applicationParametersDataCharge(
				{applicationId: selectedApplications.applicationId},{}, function(result) {

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'alert',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-executed-integration') + ": " + selectedApplications.schedulerServer 
					});

					vm.search();						
			});	
		};

		vm.deleteApplication = function deleteApplication(selectedApplication){

			if(selectedApplication){
				messageUtils.question( {
					title: $rootScope.i18n('l-delete'),
					text: $rootScope.i18n('l-delete-application-confirm') + "?",
					cancelLabel: $rootScope.i18n('l-no'),
					confirmLabel: $rootScope.i18n('l-yes'),
					callback: function(isPositiveResult) {
						if (isPositiveResult) {
							vm.confirmDelete(selectedApplication);
						}
					}
				});
					
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-delete-application-message') + '.'
				});
			}

		}

		vm.confirmDelete = function confirmDelete(selectedApplicationDelete){
			appsintegFactory.deleteApplicationParameters({applicationId: selectedApplicationDelete.applicationId}, {}, function(result) {
				vm.search();
			});		
		};


		vm.copyApplication = function copyApplication(selectedApplicationCopy){
			/*if(selectedApplicationCopy){
				appsintegFactory.copyApplicationParameters({applicationId: selectedApplicationCopy.applicationId}, {}, function(result) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-application-copy-message') + '.'
					});		
					vm.search();
				});
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-application-message-to-copy') + '.'
				});	
			}*/					
		}		


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
			vm.search();
		};

		vm.removeDisclaimer = function removeDisclaimer(disclaimer) {
			var index = vm.disclaimers.indexOf(disclaimer);
			if(index >= 0) {
				vm.disclaimers.splice(index,1);
			}

			if(disclaimer.property == "searchValue"){
				vm.searchValue = "";	
			}

			vm.search();
		};

		vm.removeSimpleFilter = function removeSimpleFilter() {
			vm.searchValue = "";

			vm.disclaimers.forEach(function(tag) {
				var index = tag.property.indexOf('searchValue');
				if (index >= 0) {
					vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
				}
			});

			vm.search();
		};

		vm.removeCustomFilter = function removeCustomFilter(filter) {
			$totvsprofile.remote.remove('dts.dts-utils.applicationdatacharge.filters', filter.title, function(result) {
				if(!result.$hasError) {
					var index = vm.listOfCustomFilters.indexOf(filter);
					vm.listOfCustomFilters.splice(index, 1);
				}
			});
		};

		vm.setQuickFilter = function setQuickFilter(filter) {
			vm.disclaimers = [].concat(filter.value);
			vm.search();
		};
		
			
		vm.addAppInteg = function(){
			
		}

		
		vm.addOrUpdateApplication = function addOrUpdateApplication(mode, applicationSelected) {
			//mode = 1 - add   2 - update   3 - copy
			
			if(mode == 1){ //add
				vm.applicationToForm = {};
			}

			if(mode == 2){ //update
				vm.applicationToForm = angular.copy(applicationSelected);
			}

			if(mode == 3){ //copy
				vm.applicationToForm = angular.copy(applicationSelected);
			}

			var modalInstance = $modal.open({
				templateUrl: '/dts/dts-utils/html/applicationdatacharge/applicationdatacharge.update.html',
				controller: 'dts-utils.applicationdatacharge.update.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				resolve: {
					modalParams: function () {
						return {
							integrationId: vm.integrationId,
							defaultIntegrationId: vm.defaultIntegrationId,
							integrationType: vm.integrationType,
							modeOperation: mode,
							applicationToEdit: vm.applicationToForm,
							applicationSettingDisabled: vm.applicationSettingDisabled,
							applicationSettingHidden: vm.applicationSettingHidden,
							applicationSettingExtraFields: vm.applicationSettingExtraFields,
						}
					}
				}
			});

			modalInstance.result.then(function (data) {
				vm.search(false);
			});

		}


		vm.entitiesApplication = function entitiesApplication(selectedApplication){
			
			if(!selectedApplication){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-application-to-show-entities') + '.'
				});

				return;
			}

			/*Abre interface de Entidades*/
			$location.url('/dts/dts-utils/entitiesdatacharge/'+ vm.integrationId +  '/' + vm.defaultIntegrationId +'/'+ vm.integrationType + '/' + selectedApplication.applicationId);
			     
		}

		vm.updateApplicationEntityAndExtraFields = function(object){

			if(object != undefined){
				appsintegFactory.updateApplicationEntityAndExtraFields(object, function(result) {
					vm.search();
				});
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-app')
				});
			}								
		}

		vm.toggleShowPassword = function toggleShowPassword(application) {
			application.showPassword = !application.showPassword;
		}		


		this.getExtraFieldsApplication = function getExtraFieldsApplication(application){
			var options, filters = [];

			options = {
				page: 1,
				pageSize: 99999,
				integrationId: application.integrationId,
				applicationId: application.applicationId,
				entityId: 0 //0 define que retornarão Apenas campos da aplicação
			};
			
			if(!application.returnedExtraFields){
				appsintegFactory.getExtraFields(options, function(result) {
					application.returnedExtraFields = true;
					application.applicationExtraFields = result.data;

					for (var i = 0; i < application.applicationExtraFields.length; i++) {
						if(application.applicationExtraFields[i].fieldType == 5){
							if(application.applicationExtraFields[i].value == "true"){
								application.applicationExtraFields[i].value = true;
							}else{
								application.applicationExtraFields[i].value = false;
							}
						}
					}

				});
			}

		}		
		
		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			vm = undefined;
		});

		
		if (appViewService.startView(vm.i18n('l-configuration-applications'), this)) {
			vm.init(true);
		}else{
			vm.init(false);
		}
				
	}
	


	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************
	applicationDataChargeHelper.$inject = ['$filter'];
	function applicationDataChargeHelper($filter) {
		
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
	// ***  CONTROLLER BOTAO INCLUIR/ALTERAR
	// *************************************************************************************
	applicationDataChargeUpdateController.$inject = ['$scope', 
		'$compile', 
		'modalParams', 
		'$modalInstance', 
		'$rootScope', 
		'$modal', 
		'TOTVSEvent', 
		'$timeout', 
		'dts-utils.appsinteg.Factory', 
		'$templateRequest',
		'dts-utils.message.Service'];
	function applicationDataChargeUpdateController($scope, 
		$compile, 
		modalParams, 
		$modalInstance, 
		$rootScope, 
		$modal, 
		TOTVSEvent, 
		$timeout, 
		appsintegFactory, 
		$templateRequest,
		messageUtils) {		

		var controller = this;
		controller.canSave = true;
		controller.model = {};

		controller.integrationId = modalParams.integrationId,
		controller.defaultIntegrationId = modalParams.defaultIntegrationId,
		controller.integrationType = modalParams.integrationType,		
		controller.modeOperation = modalParams.modeOperation;
		controller.applicationUpdate = modalParams.applicationToEdit;
		controller.applicationDisabled = modalParams.applicationSettingDisabled;
		controller.applicationHidden = modalParams.applicationSettingHidden;
		controller.applicationSettingExtraFields = modalParams.applicationSettingExtraFields;

		controller.applicationExtraFields = [];	
		
		if(controller.modeOperation == 1){ //ADD
			controller.applicationUpdate.enabled = 'false';
		}

		if(controller.modeOperation == 2){ //UPDATE
			if(controller.applicationUpdate.enabled == true){
				controller.applicationUpdate.enabled = 'true';
			}else{
				controller.applicationUpdate.enabled  = 'false';
			}
		}

		if(controller.modeOperation == 3){ //COPY
			controller.applicationUpdate.defaultApplication = false;
		}
		
		this.maxValueLength = function maxValueLength(max){
			if(controller.applicationUpdate.desc){
				if(controller.applicationUpdate.desc.length > max){
					controller.applicationUpdate.desc = controller.applicationUpdate.desc.slice(0,  max - 1);
				}
			}
		}

		this.save = function () {

			if(controller.applicationUpdate.enabled == 'true'){
				controller.applicationUpdate.enabled = true;
			}else{
				controller.applicationUpdate.enabled  = false;
			}

			controller.newApplicationObject = {
				'integrationId': parseInt(controller.integrationId),
				'enabled': controller.applicationUpdate.enabled,
				'host': controller.applicationUpdate.host,
				'door': controller.applicationUpdate.door,
				'requestTimeout': parseInt(controller.applicationUpdate.requestTimeout),
				'recordsByRequest': parseInt(controller.applicationUpdate.recordsByRequest),
				'user': controller.applicationUpdate.user,
				'userPassword': controller.applicationUpdate.userPassword,
				'token': controller.applicationUpdate.token,
				'schedulerServer': controller.applicationUpdate.schedulerServer,
				'idDefaultIntegration': parseInt(controller.defaultIntegrationId),
				'desc': controller.applicationUpdate.desc,
				'executed': controller.applicationUpdate.executed,
				'defaultApplication': controller.applicationUpdate.defaultApplication
			}


			

			if(!controller.applicationUpdate.desc){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-application-description-required') + '.'
				});

				return;
			}

			if(controller.applicationHidden){
				if(!controller.applicationHidden.schedulerServer){
					if(!controller.applicationUpdate.schedulerServer){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-attention'),
							detail: $rootScope.i18n('l-application-scheduler-server-required') + '.'
						});
						return;
					}	
				}
			}else{
				if(!controller.applicationUpdate.schedulerServer){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-application-scheduler-server-required') + '.'
					});
					return;
				}				
			}

			if(controller.modeOperation == 1){ //ADD
				appsintegFactory.createApplicationParameters(controller.newApplicationObject, function (result) {
					controller.saveExtraFields(result[0].applicationId);
				});
			}

			if(controller.modeOperation == 2){ //UPDATE
				controller.newApplicationObject.applicationId = controller.applicationUpdate.applicationId; 
				appsintegFactory.updateApplicationParameters(controller.newApplicationObject, function (result) {
					controller.saveExtraFields(controller.newApplicationObject.applicationId);
				});
			}

			if(controller.modeOperation ==  3){ //copy
				appsintegFactory.copyApplicationParameters({applicationId: controller.applicationUpdate.applicationId}, controller.newApplicationObject, function (result) {
					controller.saveExtraFields(result[0].applicationId);
				});
			}

		}

		this.addZero = function addZero(number){
			if (number < 10){
				return '0' + String(number);
			}else{
				return String(number);
			}
		}

		this.saveExtraFields = function saveExtraFields(applicationId){
			for (var i = 0; i < controller.applicationExtraFields.length; i++) {

				if(controller.applicationExtraFields[i].fieldType == 4){
					var date = new Date(controller.applicationExtraFields[i].value);
					var day = controller.addZero(date.getDate());
					var month = controller.addZero((date.getMonth() + 1));
					var year = date.getFullYear();
					controller.applicationExtraFields[i].value = day + "/" + month  + "/" + year;
				}	

				controller.applicationExtraFields[i].value = String(controller.applicationExtraFields[i].value);

				if(controller.applicationExtraFields[i].operation == "new"){
					//remove campo operation, usado apenas para controle de tela
					delete controller.applicationExtraFields[i].operation;

					controller.applicationExtraFields[i].applicationId = applicationId;
					appsintegFactory.newExtraField(controller.applicationExtraFields[i], function (result) {});	
				}	

				if(controller.applicationExtraFields[i].operation == "update"){
					//remove campo operation, usado apenas para controle de tela
					delete controller.applicationExtraFields[i].operation;
					appsintegFactory.updateExtraField(controller.applicationExtraFields[i], function (result) {});	
				}
				
			}	
			
			$modalInstance.close();
		}

		this.addExtraField = function addExtraField() {

			var modalInstance = $modal.open({
				templateUrl: '/dts/dts-utils/html/applicationdatacharge/applicationdatacharge.add.extrafield.html',
				controller: 'dts-utils.applicationdatacharge.add.extrafield.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				resolve: {
					modalParams: function () {
						return {
							integrationId: controller.integrationId,
							defaultIntegrationId: controller.defaultIntegrationId,
							applicationExtraFields: controller.applicationExtraFields
						}
					}
				}
			});

			modalInstance.result.then(function (data) {
				//define que o campo deve ser cadastrado ao salvar a aplicação no formulário
				data.extraField.operation = "new";
				controller.applicationExtraFields.push(data.extraField);
			});
		}
		
		this.close = function () {
			$modalInstance.dismiss('cancel');
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
					controller.applicationExtraFields.splice(index, 1);
				});
			}else{
				controller.applicationExtraFields.splice(index, 1);
			}	
		}

		this.getExtraFields = function getExtraFields(integrationId, applicationId, modeOperation){
			var options, filters = [];

			options = {
				page: 1,
				pageSize: 99999,
				integrationId: integrationId,
				applicationId: applicationId,
				entityId: 0 //0 define que retornarão Apenas campos da aplicação
			};
			
			appsintegFactory.getExtraFields(options, function(result) {
				controller.applicationExtraFields = result.data;

				for (var i = 0; i < controller.applicationExtraFields.length; i++) {
					//define que os campos já cadastrados para aplicação serão atualizados ao salvar a aplicação no formulário
					if(modeOperation == 2){ //UPDATE
						controller.applicationExtraFields[i].operation = "update";
					}

					if(modeOperation == 3){ //COPY
						controller.applicationExtraFields[i].operation = "new";
					}

					if(controller.applicationExtraFields[i].fieldType == 4){
						var arrayDate = controller.applicationExtraFields[i].value.split('/'); 
						controller.applicationExtraFields[i].value = arrayDate[1] + '/' + arrayDate[0] + '/' + arrayDate[2];
						var date = new Date(controller.applicationExtraFields[i].value);
						controller.applicationExtraFields[i].value = date.getTime();
					}
					
					if(controller.applicationExtraFields[i].fieldType == 5){
						if(controller.applicationExtraFields[i].value == "true"){
							controller.applicationExtraFields[i].value = true;
						}else{
							controller.applicationExtraFields[i].value = false;
						}
					}
				}



			});
		}
		
		if(controller.modeOperation == 2 || controller.modeOperation == 3){ //UPDATE or COPY
			if(controller.applicationUpdate){
				controller.getExtraFields(controller.integrationId, controller.applicationUpdate.applicationId, controller.modeOperation);
			}	
		}

		controller.toggleShowPassword = function toggleShowPassword() {
			controller.showPassword = !controller.showPassword;
		}		
	}

	// *************************************************************************************
	// ***  CONTROLLER - INCLUSÃO DE CAMPO EXTRA
	// *************************************************************************************
	applicationDataChargeAddExtraFieldController.$inject = ['$scope', 'modalParams', '$modalInstance', '$rootScope', '$modal', 'TOTVSEvent', '$timeout', 'dts-utils.appsinteg.Factory'];

	function applicationDataChargeAddExtraFieldController($scope, modalParams, $modalInstance, $rootScope, $modal, TOTVSEvent, $timeout, appsintegFactory) {

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
			zoomTable: ""		
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

			for (var i = 0; i < modalParams.applicationExtraFields.length; i++) {
				if(modalParams.applicationExtraFields[i].field == controller.model.field){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('l-duplicate-extra-field') + ': ' +  modalParams.applicationExtraFields[i].field + ' (' + modalParams.applicationExtraFields[i].label +  ').'
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
	
	index.register.service('dts-utils.applicationdatacharge.helper', applicationDataChargeHelper);
	index.register.controller('dts-utils.applicationdatacharge.list.control', applicationDataChargeController);
	index.register.controller('dts-utils.applicationdatacharge.update.control', applicationDataChargeUpdateController);
	index.register.controller('dts-utils.applicationdatacharge.add.extrafield.control', applicationDataChargeAddExtraFieldController);
});
