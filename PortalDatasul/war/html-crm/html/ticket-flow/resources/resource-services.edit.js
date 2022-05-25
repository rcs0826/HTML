/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, helper*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1098.js',
	'/dts/crm/js/api/fchcrm1100.js',
    '/dts/crm/js/api/fchcrm1108.js'

], function (index) {

	'use strict';
	var controllerResourceEdit,
		modalResourceEdit;

	controllerResourceEdit = function ($rootScope, $scope, $modalInstance, $filter, helper, parameters, TOTVSEvent, factory, resourceLevelFactory, resourceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var ctrl = this;

		this.model = {};

		this.resourceList = [];
		this.resourceLevelList = [];
		this.editMode = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
        
		this.getResources = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };

			resourceFactory.typeahead(filter, undefined, function (result) {
				ctrl.resourceList = result;
			});
		};        

		this.getAllResourceLevel = function (callback) {
			resourceLevelFactory.getAll(function (result) {
                ctrl.resourceLevelList = result || [];
                if (callback) {
                   callback(result);
                }                 
            }, true);
            
		};

		this.save = function (isToContinue) {

			if (ctrl.isInvalidForm()) { return; }

			var vo = ctrl.convertToSave(),
				message,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {

				if (!item || !item.num_id || item.num_id <= 0) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-flow-resource', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-resource', [], 'dts/crm'),
						ctrl.model.ttRecurso.nom_usuar
					], 'dts/crm')
				});

				ctrl.close(item, isToContinue);
			};

			if (ctrl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateRecord(vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.saveRecord(vo, fnAfterSave);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = ctrl.model;

			if (!model.ttRecurso || model.ttRecurso.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-resource');
			}

			if (!model.ttNivelRecurso || model.ttNivelRecurso.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-resource-level');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-flow-resource', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = ctrl.model;

			vo.num_id = model.num_id;
			vo.log_padr = model.log_padr || false;

			vo.num_id_ocor_fluxo = ctrl.flowId;

			if (model.ttRecurso) {
				vo.num_id_recur = model.ttRecurso.num_id_recur;
			}

			if (model.ttNivelRecurso) {
				vo.num_id_niv_recur = model.ttNivelRecurso.num_id;
			}

			return vo;
		};

		this.validadeParameterModel = function () {

			var i, model = ctrl.model || {};

			ctrl.editMode = (model.num_id && model.num_id > 0);

			if (ctrl.editMode === true) {

                model.ttRecurso = {
                    num_id: model.num_id_recur,
                    num_id_recur: model.num_id_recur,
                    nom_usuar: model.nom_usuar,
                    cod_usuario: model.cod_usuario
                };

                ctrl.resourceList.push(model.ttRecurso);

				if (model.num_id_niv_recur > 0) {
                    for (i = 0; i < ctrl.resourceLevelList.length; i++) {
                        if (ctrl.resourceLevelList[i].num_id === ctrl.model.num_id_niv_recur) {
                            ctrl.model.ttNivelRecurso = ctrl.resourceLevelList[i];
                            break;
                        }
                    }
				} else if(ctrl.resourceLevelList.length > 0) {
                    ctrl.model.ttNivelRecurso = ctrl.resourceLevelList[0];
                }
			}            

		};

		this.load = function (callback) {
            ctrl.getAllResourceLevel(function (resourceLevel){
               if (callback) {
                   callback(resourceLevel);
               } 
            });
		};

		this.close = function (item, isToContinue) {

			if (isToContinue === true) {
				delete ctrl.model.ttRecurso;
				delete ctrl.model.ttNivelRecurso;
				ctrl.model.log_padr = false;
				ctrl.model.num_id = undefined;
				ctrl.validadeParameterModel();
			} else if ($modalInstance) {
				$modalInstance.close(item);
			}

		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.init = function () {
			ctrl.load(function () {
                ctrl.validadeParameterModel();
            });			
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.flowId = parameters.flowId ? parameters.flowId : 0;
		this.model  = parameters.model ? angular.copy(parameters.model) : {};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			ctrl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});

	}; // controllerResourceEdit
	controllerResourceEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'crm.helper', 'parameters', 'TOTVSEvent', 'crm.crm_ocor_fluxo_recur.factory', 'crm.crm_niv_recur.factory', 'crm.crm_recur.factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT STYLE TO ACCOUNT
	// *************************************************************************************
	modalResourceEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-flow/resources/resource.edit.html',
				controller: 'crm.ticket-flow-resource.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalResourceEdit.$inject = ['$modal'];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-flow-resource.modal.selection', modalResourceEdit);

	index.register.controller('crm.ticket-flow-resource.edit.control', controllerResourceEdit);

});
