define([
	'index',
	'/dts/mpd/js/api/fchdis0054.js',
	'/dts/mpd/js/userpreference.js',
	'ng-load!/dts/mpd/js/ng-draggable.js',
	'ng-load!/dts/mpd/js/mpd-utils.js',
	'less!/dts/mpd/assets/css/crm.less',
], function(index) {
	'use strict';

	rulesListController.$inject = [
		'$scope', '$rootScope', 'mpd.rulesoperationtype.Factory', '$filter', '$totvsprofile', 'totvs.app-main-view.Service', '$stateParams', '$q', 'userPreference', '$location', 'TOTVSEvent', '$modal',  '$timeout',
	];
	function rulesListController($scope, $rootScope, rulesOperationTypeFactory, $filter, $totvsprofile, appViewService, $stateParams, $q, userPreference, $location, TOTVSEvent, $modal,  $timeout) {

		var controller = this;

		controller.i18n = $filter('i18n');
		controller.fieldsOperationType       = [];
		controller.fieldsOperationTypeCopy   = [];
		controller.orderSaved = [];
		controller.indiceInicial;
		controller.cvavailable = false;

		controller.helpvisible = "<ul style='padding-left: 15px'>" +
									"<li>" + $rootScope.i18n('l-considera-regra-help-todos') + "</li>" +
									  "<li>" + $rootScope.i18n('l-considera-regra-help-yes') + "</li>" +
									  "<li>" + $rootScope.i18n('l-considera-regra-help-no') + "</li>" +
									  "<li>" + $rootScope.i18n('l-campos-excluir-help') + "</li>" +
									  "<li>" + $rootScope.i18n('l-campos-editar-help') + "</li>" +
									"</ul>";

		controller.helpdefault = "<ul style='padding-left: 15px'>" +
									  "<li>" + $rootScope.i18n('l-field-default-help-yes') + "</li>" +
									  "<li>" + $rootScope.i18n('l-field-default-help-no') + "</li>" +
									"</ul>";

		controller.helppriori = "<ul style='padding-left: 15px'>" +
									  "<li>" + $rootScope.i18n('l-help-priori') + "</li>" +
									  "<li>" + $rootScope.i18n('l-ajuda-peso') + "</li>" +
									"</ul>";

		controller.helprule = "<p style='padding-left: 5px'>" + $rootScope.i18n('l-campos-rule-help') + "</p>";

		this.init = function init() {
			var hasError = false;
			
			$timeout(function () {
				
				rulesOperationTypeFactory.getParameters(function(result) {					
					angular.forEach(result, function(parameter, key) {
                        if(parameter['cod-param'] == 'sugestao-natureza') {
                           if (parameter['val-param']  == 'N'){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'warning',
                                    title: $rootScope.i18n('l-warning'),
                                    detail: $rootScope.i18n('l-rules-operations-msg-12', [], 'dts/mpd/')
                                });

                                var pageActive = appViewService.getPageActive();
                                appViewService.releaseConsume(pageActive);
                                appViewService.removeView(pageActive);			
                                
                           } 
						}
					});                 
				});				
			}, 500);			
            
            if (!hasError) {
                controller.search();
            }            
		};

		controller.search = function search() {

			var field;
			controller.filtered = "";

			controller.fieldsOperationType = [];

			rulesOperationTypeFactory.getParameters(function(resultparameters) {

				angular.forEach(resultparameters, function(parameter, key) {
					if(parameter['cod-param'] == 'central-vendas'){
						if(parameter['val-param'] == 'S'){
							controller.cvavailable = true;
						}else{
							controller.cvavailable = false;
						}
					}
				});

				rulesOperationTypeFactory.getRulesOperationType(function(result) {
					controller.fieldsOperationType     = controller.fieldsOperationType.concat(result);
					controller.fieldsOperationTypeCopy = controller.fieldsOperationTypeCopy.concat(result);										

					for (var i = 0; i < controller.fieldsOperationType.length; i++) {

						field = controller.fieldsOperationType[i];
						controller.orderSaved.push(field.val_peso);
						//controller.fieldsOperationTypeCopy.push(field.val_peso);

					}
				});				

			});
		};

		controller.onPageDropComplete = function ($to, $data, $event) {

			var i,
				$from,
				field,
				newOrder = [],
				controller = this,
				reorderLogic,

			reorderLogic = function () {

				var total = controller.fieldsOperationType.length;

				for (i = 0; i < controller.fieldsOperationType.length; i++) {
					field = controller.fieldsOperationType[i];

					if ($data.val_peso === field.val_peso) {
						$from = i;
						break;
					}
				}

				controller.fieldsOperationType.move($from, $to);

				for (i = 0; i < controller.fieldsOperationType.length; i++) {
					field = controller.fieldsOperationType[i];

					field.new_value = total - i;
					controller.fieldsOperationType[i]['val_peso'] = field.new_value;
				}

			};

			reorderLogic();

		};

		controller.postNewPrior = function(){

			controller.filtered = "";

			var i, field, total = controller.fieldsOperationType.length;

			for (i = 0; i < controller.fieldsOperationType.length; i++) {
				field = controller.fieldsOperationType[i];
				if(field.val_peso > total){
					controller.fieldsOperationType[i]['val_peso'] = total;
				}
			}

			rulesOperationTypeFactory.postNewPrior(controller.fieldsOperationType, function(response) {
				if(!response.$hasError){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-success'),
						detail: $rootScope.i18n('l-new-prior-defined')
					});
				}
			});

		}

		controller.addNewRule = function(option){

			var params = {};
            params = {
                option: option,                
            };

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/rulesoperationtype/rulesoperationtype.newrule.html',
				controller: 'rulesoperationtype.newrule.control as controller',
				size: 'lg',
				resolve: {
					modalParams: function() {
						return {
							option: option 
						}
					}
				}
			});

			modalInstance.result.then(function() {
				controller.search();
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-success'),
					detail: $rootScope.i18n('l-new-rule-add')
				});
			});
		}
		
		controller.editField = function(field){
						
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/rulesoperationtype/rulesoperationtype.editfield.html',
				controller: 'rulesoperationtype.editfield.control as controller',
				size: 'lg',
				resolve: {
					modalParams: function() {
						return {
							currentField: field 
						}
					}
				}
			});

			modalInstance.result.then(function() {
				controller.search();
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-success'),
					detail: $rootScope.i18n('l-field-updated')
				});
			});
		}

		controller.setFocusInputClick = function($to, $data, $event){

			var timer  = null;

			var i,
				$from,
				field,
				allFields = [],
				controller = this,
				reorderLogic
				;

			var para;

			var tag = true;

			$event.currentTarget.focus();
			$event.currentTarget.setSelectionRange(0, 99);


			if(controller.filtered != ""){

				//

			}else{

				$($event.currentTarget).keydown(function(){
					if(tag){
						clearTimeout(timer);
						timer = setTimeout(doStuff, 1000);
						tag = false;
					}
				});

				function doStuff() {

					$timeout(function(){
						$rootScope.pendingRequests += 1;
					}, 500);

					$timeout(function(){
						$event.currentTarget.blur();
						$rootScope.pendingRequests --;
						if($event.currentTarget.value > total){
							$event.currentTarget.value = total;
						}else if($event.currentTarget.value < 1){
							$event.currentTarget.value = 1;
						}
					}, 1000);

					var total = controller.fieldsOperationType.length;

					for (i = 0; i < controller.fieldsOperationType.length; i++) {
						field = controller.fieldsOperationType[i];
						if ($data.val_peso === field.val_peso) {
							$from = i;
							break;
						}
					}

					for (var j = 0; j < controller.fieldsOperationType.length; j++) {
						allFields.push(controller.fieldsOperationType[j]);
					}

					for (var j = 0; j < allFields.length; j++) {
						if(allFields[j]['val_peso'] == $event.currentTarget.value && j != $to){
							para = j
						};
					}



					if(para != undefined){
						controller.fieldsOperationType.move($from, para);
					}else{
						if($event.currentTarget.value > controller.fieldsOperationType.length){
							controller.fieldsOperationType.move($from, 0);
						}else if($event.currentTarget.value < 1){
							controller.fieldsOperationType.move($from, controller.fieldsOperationType.length - 1);
						}
					}

					for (i = 0; i < controller.fieldsOperationType.length; i++) {
						field = controller.fieldsOperationType[i];

						field.new_value = total - i;
						controller.fieldsOperationType[i]['val_peso'] = field.new_value;
					}

					allFields = [];
					$from = null;
					para = null;

				}
			}
		}

		controller.keydownInput = function($event){

			if(controller.filtered != ""){
				$timeout(function(){
					if($event.currentTarget.value > controller.fieldsOperationType.length){
						$event.currentTarget.value = controller.fieldsOperationType.length;
					}else if($event.currentTarget.value < 0){
						$event.currentTarget.value = 1;
					}
				}, 1000);
			}
		}

		controller.applyWeightToLeave = function($to, $data, $event, modefilter, fields){

			if(modefilter != ""){
				
				var timer  = null;

				var i,
					$from,
					field,
					allFields = [],
					controller = this,
					reorderLogic
					;

				var para;

				var tag = true;

				function doStuff() {

					$rootScope.pendingRequests += 1;

					$timeout(function(){
						$rootScope.pendingRequests --;
						if($event.currentTarget.value > total){
							$event.currentTarget.value = total;
						}else if($event.currentTarget.value < 1){
							$event.currentTarget.value = 1;
						}
					}, 100);

					var total = controller.fieldsOperationType.length;


					for (i = 0; i < controller.fieldsOperationType.length; i++) {
						field = controller.fieldsOperationType[i];
						if ($data.val_peso === field.val_peso) {
							$from = i;
							break;
						}
					}

					for (var j = 0; j < controller.fieldsOperationType.length; j++) {
						allFields.push(controller.fieldsOperationType[j]);
					}

					for (var j = 0; j < allFields.length; j++) {
						if(allFields[j]['val_peso'] == $event.currentTarget.value && j != $to){
							para = j
						};
					}

					if(para != undefined){
						controller.fieldsOperationType.move($from, para);
					}else{
						if($event.currentTarget.value > controller.fieldsOperationType.length){
							controller.fieldsOperationType.move($from, 0);
						}else if($event.currentTarget.value < 1){
							controller.fieldsOperationType.move($from, controller.fieldsOperationType.length - 1);
						}
					}

					for (i = 0; i < controller.fieldsOperationType.length; i++) {
						field = controller.fieldsOperationType[i];

						field.new_value = total - i;
						controller.fieldsOperationType[i]['val_peso'] = field.new_value;
					}

					allFields = [];
					$from = null;
					para = null;

				}

				doStuff();

			}else{

				var i,
					$from,
					field,
					newOrder = [],
					controller = this,
					reorderLogic,

				reorderLogic = function () {

					var total = controller.fieldsOperationType.length;

					for (i = 0; i < controller.fieldsOperationType.length; i++) {
						field = controller.fieldsOperationType[i];

						if ($data.val_peso === field.val_peso) {
							$from = i;
							break;
						}
					}

					controller.fieldsOperationType.move($from, $to);

					for (i = 0; i < controller.fieldsOperationType.length; i++) {
						field = controller.fieldsOperationType[i];

						field.new_value = total - i;
						controller.fieldsOperationType[i]['val_peso'] = field.new_value;
					}

				};

				reorderLogic();

			}

		}

		controller.deleteField = function(fieldDefault, codParamChave){

			if(fieldDefault === "Não"){


				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/rulesoperationtype/rulesoperationtype.confirm.html',
					controller: 'rulesoperationtype.confirm.control as controller',
					size: 'md'
				});

				modalInstance.result.then(function(data) {
					if(data.confirm){
						rulesOperationTypeFactory.deleteRulesOperationType({codParam: codParamChave}, function(response){
							if(!response.$hasError){
								controller.search();
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success',
									title: $rootScope.i18n('l-success'),
									detail: $rootScope.i18n('l-success-del-rule')
								});
							}
						})
					}
				});

			}else{
				return;
			}

		}

		controller.removeMethodFiltered = function() {
			controller.filtered = "";
		};

		controller.setQuickAllFields = function(){
			var i = 0;

			for (i = 0; i < controller.fieldsOperationType.length; i++) {
				if(controller.showAllFields){
					controller.fieldsOperationType[i].i_visible = 1;
				}else{
					controller.fieldsOperationType[i].i_visible = 0;
				}

				//Não permite considerar na regra o campo estabelecimento de atendimento quando central de vendas estiver desabilitado
				if(controller.cvavailable == false &&
				   controller.fieldsOperationType[i]['nom_tabela'] == 'ped-item' &&
				   controller.fieldsOperationType[i]['nom_campo'] == 'char-1,80,5'){

					//Se central de vendas desabilitado não sera considerado na regra
					controller.fieldsOperationType[i].i_visible = 0;
				}
			}
		}

		$scope.$on('$destroy', function () {
			controller = undefined;
		});

		if (appViewService.startView(controller.i18n('l-rules-operation'), this)) {
			controller.init();
		}else{
			controller.init();
		}

	}

	// *************************************************************************************
	// ***  CONTROLLER PARA INCLUSÃO DO CAMPO DA REGRA
	// *************************************************************************************
	newRuleController.$inject = ['$rootScope', 'modalParams', '$modalInstance', 'mpd.rulesoperationtype.Factory', 'TOTVSEvent'];
	function newRuleController($rootScope, modalParams, $modalInstance, rulesOperationTypeFactory, TOTVSEvent) {

		var controller = this;
		let canSave    = true;

		this.tabledesc = {model: {}};

		controller.tabledesc.types = [
			{typeId: 0, descType: 'ped-venda'},
			{typeId: 1, descType: 'ped-item'},
		];

		controller.tabledesc.model.typeId = 0;

		this.typeFieldCustom = {model: {}};
		
		controller.typeFieldCustom.types = [
			{typeId: 0, descType: 'Lógico (Campo limitado à "Sim", "Não" e "?")'},
			{typeId: 1, descType: 'Sem validação (O valor do campo não será validado contra uma tabela)' },
			{typeId: 2, descType: 'Com validação (O valor do campo será validado contra uma tabela)'}
		];

		controller.typeFieldCustom.model.typeId = 0;

		controller.option = modalParams.option;		

		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}

		controller.setFocusInputDatabase = function($event){
			if($event.currentTarget.value.indexOf('.') > -1){
				$event.currentTarget.focus();
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-no-allow-dots')
				});
			}
		}

		controller.confirm = function(){

			let descTable,
			idTable;
			
			if (controller.option) {

				// Campo Padrão				
				idTable	= controller.tabledesc.model.typeId;
				for (var i = 0; i < controller.tabledesc.types.length; i++) {
					if (controller.tabledesc.types[i].typeId == idTable) {
						descTable = controller.tabledesc.types[i].descType;
					}
				};

				if (controller.database === undefined) { canSave = false; }
				if (controller.table === undefined) { canSave = false; }
				if (controller.field === undefined) { canSave = false; }
				if (controller.orderdatabase === undefined) { canSave = false; }
				if (controller.orderfield === undefined) { canSave = false; }

				controller.newrule = {
					'nom-banco': controller.database,
					'nom-tabela': controller.table,
					'nom-campo': controller.field,
					'log-livre-1': controller.hassearch,
					'nom-campo-descr': controller.searchdescription,
					'nom-bco-corresp': controller.orderdatabase,
					'nom-tab-corresp': descTable,
					'nom-campo-corresp': controller.orderfield
				};
			} else {
				// Campo com Regra Customizada
				if (controller.idCustomField === undefined) { canSave = false; }
				if (controller.nameCustomField === undefined) { canSave = false; }
				if (controller.typeCustomField == 2) {
					if (controller.databaseCustom === undefined) { canSave = false; }
					if (controller.tableCustom === undefined) { canSave = false; }
					if (controller.fieldCustom === undefined) { canSave = false; }
					if (controller.hassearchCustom && controller.searchdescriptionCustom === undefined) { canSave = false; }
				}

				controller.newrule = {
					'nom-banco': controller.databaseCustom,
					'nom-tabela': controller.tableCustom,
					'nom-campo': controller.fieldCustom,
					'log-livre-1': controller.hassearchCustom,
					'nom-campo-descr': controller.searchdescriptionCustom,
					'cod-id-custom': controller.idCustomField,
					'cod-nom-custom': controller.nameCustomField,
					'cdn-tip-custom': controller.typeFieldCustom.model.typeId,					
					'log-livre-2': true,				
				};
			}		
			
			if(!canSave){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				canSave = true;
			}else{
				rulesOperationTypeFactory.putRulesOperationType(controller.newrule, function(response){
					if(!response.$hasError){
						$modalInstance.close();
					}
				})
			}
		}

		controller.checkAvailableSearchDescription = function(){
			if (controller.option) {
				if (!controller.hassearch){
					controller.searchdescription = "";
				}
			} else {
				if (!controller.hassearchCustom){
					controller.searchdescriptionCustom = "";
				}
			}
		} 	

	}
	
	// *************************************************************************************
	// ***  CONTROLLER PARA EDIÇÃO DO CAMPO DA REGRA
	// *************************************************************************************
	editFieldController.$inject = ['$rootScope', 'modalParams','$modalInstance', 'mpd.rulesoperationtype.Factory', 'TOTVSEvent'];
	function editFieldController($rootScope, modalParams, $modalInstance, rulesOperationTypeFactory, TOTVSEvent) {
				
		var controller = this;
		let canSave    = true;

		controller.tabledesc = {model: {}};
		controller.typeFieldCustom = {model: {}};

		controller.tabledesc.types = [
			{typeId: 0, descType: 'ped-venda'},
			{typeId: 1, descType: 'ped-item'},
		];

		controller.typeFieldCustom.types = [
			{typeId: 0, descType: 'Lógico (Campo limitado à "Sim", "Não" e "?")'},
			{typeId: 1, descType: 'Sem validação (O valor do campo não será validado contra uma tabela)' },
			{typeId: 2, descType: 'Com validação (O valor do campo será validado contra uma tabela)'}
		];

		if(modalParams.currentField['c_trad_padrao'] === "Sim"){
			controller.canedit = true;
		}else{
			controller.canedit = false;
		}
		
		// Campo Padrão
		controller.database 	 	 = modalParams.currentField['nom_banco'];
		controller.table    	 	 = modalParams.currentField['nom_tabela'];
		controller.field    	 	 = modalParams.currentField['nom_campo'];		
		controller.hassearch         = modalParams.currentField['log_livre_1'];
		controller.searchdescription = modalParams.currentField['nom_campo_descr'];
		controller.orderdatabase 	 = modalParams.currentField['nom_bco_corresp'];
		controller.orderfield    	 = modalParams.currentField['nom_campo_corresp'];

		if(modalParams.currentField['nom_tab_corresp'] === "ped-venda")		
			controller.tabledesc.model.typeId = 0;
		else
			controller.tabledesc.model.typeId = 1;	

		// Campo Customizado	
		controller.databaseCustom 	   = modalParams.currentField['nom_banco'];
		controller.tableCustom    	   = modalParams.currentField['nom_tabela'];
		controller.fieldCustom    	   = modalParams.currentField['nom_campo'];		
		controller.hassearchCustom         = modalParams.currentField['log_livre_1'];
		controller.searchdescriptionCustom = modalParams.currentField['nom_campo_descr'];
		controller.idCustomField           = modalParams.currentField['cod_id_custom'];
		controller.nameCustomField         = modalParams.currentField['cod_nom_custom'];
		controller.typeCustomField         = modalParams.currentField['cdn_tip_custom'];
		controller.customField             = modalParams.currentField['log_livre_2'];
		controller.typeFieldCustom.model.typeId = parseInt(controller.typeCustomField);	

		controller.confirm = function(){
			
			let descTable,
				idTable;
				
			if (!controller.customField) {
				// Campo Padrão

				idTable	= controller.tabledesc.model.typeId;
				for (var i = 0; i < controller.tabledesc.types.length; i++) {
					if (controller.tabledesc.types[i].typeId == idTable) {
						descTable = controller.tabledesc.types[i].descType;
					}
				};

				if (controller.database === undefined) { canSave = false; }
				if (controller.table === undefined) { canSave = false; }
				if (controller.field === undefined) { canSave = false; }
				if (controller.orderdatabase === undefined) { canSave = false; }
				if (controller.orderfield === undefined) { canSave = false; }

				controller.newrule = {
					'cdd-id-campo': modalParams.currentField['cdd_id_campo'],
					'nom-banco': controller.database,
					'nom-tabela': controller.table,
					'nom-campo': controller.field,
					'log-livre-1': controller.hassearch,
					'nom-campo-descr': controller.searchdescription,
					'nom-bco-corresp': controller.orderdatabase,
					'nom-tab-corresp': descTable,
					'nom-campo-corresp': controller.orderfield
				};
			} else {
				// Campo com Regra Customizada
				
				if (controller.idCustomField === undefined) { canSave = false; }
				if (controller.nameCustomField === undefined) { canSave = false; }
				if (controller.typeCustomField == 2) {
					if (controller.databaseCustom === undefined) { canSave = false; }
					if (controller.tableCustom === undefined) { canSave = false; }
					if (controller.fieldCustom === undefined) { canSave = false; }
					if (controller.hassearchCustom && controller.searchdescriptionCustom === undefined) { canSave = false; }
				}

				controller.newrule = {
					'cdd-id-campo': modalParams.currentField['cdd_id_campo'],
					'nom-banco': controller.databaseCustom,
					'nom-tabela': controller.tableCustom,
					'nom-campo': controller.fieldCustom,
					'log-livre-1': controller.hassearchCustom,
					'nom-campo-descr': controller.searchdescriptionCustom,
					'cod-id-custom': controller.idCustomField,
					'cod-nom-custom': controller.nameCustomField,
					'cdn-tip-custom': controller.typeFieldCustom.model.typeId,					
					'log-livre-2': true,
				};	
			}			

			if(!canSave){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-missing-fields')
				});
				canSave = true;
			}else{												
				rulesOperationTypeFactory.putRulesOperationType(controller.newrule, function(response){
					if(!response.$hasError){
						$modalInstance.close();
					}
				})
			}			
		}

		controller.checkAvailableSearchDescription = function(){
			if (!controller.customField) {
				if (!controller.hassearch){
					controller.searchdescription = "";
				}
			} else {
				if (!controller.hassearchCustom){
					controller.searchdescriptionCustom = "";
				}
			}
		} 	

		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}	
				
	}

	// *************************************************************************************
	// ***  CONTROLLER MENSAGEM DE EXCLUSÃO DA REGRA
	// *************************************************************************************
	rulesDeleteController.$inject = ['$modalInstance'];
	function rulesDeleteController($modalInstance) {

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

	index.register.controller('rulesoperationtype.confirm.control', rulesDeleteController);
	index.register.controller('rulesoperationtype.newrule.control', newRuleController);
	index.register.controller('rulesoperationtype.editfield.control', editFieldController);
	index.register.controller('mpd.rulesoperationtype.list.control', rulesListController);

});
