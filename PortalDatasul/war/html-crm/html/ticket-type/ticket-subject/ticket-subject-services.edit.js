/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, helper*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
    '/dts/crm/js/api/fchcrm1004.js',
    '/dts/crm/js/api/fchcrm1031.js',
    '/dts/crm/js/api/fchcrm1032.js',
    '/dts/crm/js/api/fchcrm1034.js'

], function (index) {

	'use strict';
	var controllerResourceEdit,
		modalTicketSubjecEdit;

	controllerResourceEdit = function ($rootScope, $scope, $modalInstance, $filter, helper, parameters, TOTVSEvent, factory, ticketPriorityFactory, subjectFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var ctrl = this;

		this.model = {};

		this.listOfSubjects = [];
		this.listOfPriorities = [];
		this.editMode = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
        
		this.getSubjects = function (callback) {

            subjectFactory.getSubjects(function (result) {
                if (!result || result.length < 1) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning',
                        title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
                        detail: $rootScope.i18n('msg-not-found-subject', [], 'dts/crm')
                    });
                }

                ctrl.listOfSubjects = result || [];
                if (ctrl.listOfSubjects.length >= 1 && !ctrl.editMode) {
                    ctrl.model.ttAssunto = ctrl.listOfSubjects[0];
                }
                
                if (callback) {
                   callback(result);
                }                 

            }, false, false);

		};        
        
		this.getPriorities = function (callback) {
			ticketPriorityFactory.getAll(function (result) {
				ctrl.listOfPriorities = result || [];
                
				if (ctrl.listOfPriorities.length >= 1 && !ctrl.editMode) {
					ctrl.model.ttPrioridade = ctrl.listOfPriorities[0];
				}
                
                if (callback) {
                   callback(result);
                } 
			});
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
					title: $rootScope.i18n('l-subject', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-subject', [], 'dts/crm'),
						ctrl.model.ttAssunto.nom_assunto_ocor
					], 'dts/crm')
				});

				ctrl.close(item, isToContinue);
			};

			if (ctrl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateSubject(vo.num_id_tip_ocor, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.saveSubject(vo.num_id_tip_ocor, vo, fnAfterSave);
			}
            
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = ctrl.model;            

			if (!model.ttAssunto || model.ttAssunto.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-subject');
			}

			if (!model.ttPrioridade || model.ttPrioridade.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-priority');
			}
            
            if (!model.qtd_tempo_previs_atendim || model.qtd_tempo_previs_atendim <= 0) {
				isInvalidForm = true;
				messages.push('l-sla-minute');                
            }

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-sla-minute', messages);
			}            

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = ctrl.model;

			vo.num_id = model.num_id;
			vo.qtd_tempo_previs_atendim = model.qtd_tempo_previs_atendim;
			vo.num_id_tip_ocor = ctrl.idTicketType;

			if (model.ttAssunto) {
				vo.num_id_assunto_ocor = model.ttAssunto.num_id;
			}

			if (model.ttPrioridade) {
				vo.num_id_priorid_ocor = model.ttPrioridade.num_id;
			}

			return vo;
		};

		this.validadeParameterModel = function (isToContinue) {

			var i, model = ctrl.model || {};

			if (ctrl.editMode === true) {

				if (model.num_id_assunto_ocor > 0) {
                    for (i = 0; i < ctrl.listOfSubjects.length; i++) {
                        if (ctrl.listOfSubjects[i].num_id === ctrl.model.num_id_assunto_ocor) {
                            ctrl.model.ttAssunto = ctrl.listOfSubjects[i];
                            break;
                        }
                    }
				}
                
				if (model.num_id_priorid_ocor > 0) {
                    for (i = 0; i < ctrl.listOfPriorities.length; i++) {
                        if (ctrl.listOfPriorities[i].num_id === ctrl.model.num_id_priorid_ocor) {
                            ctrl.model.ttPrioridade = ctrl.listOfPriorities[i];
                            break;
                        }
                    }
				}                
                
			} else {
                
                if (!isToContinue) {
                    if(ctrl.listOfSubjects.length > 0) {
                        ctrl.model.ttAssunto = ctrl.listOfSubjects[0];
                    }
                    if(ctrl.listOfPriorities.length > 0) {
                        ctrl.model.ttPrioridade = ctrl.listOfPriorities[0];
                    }
                }
                
            }          

		};      

		this.load = function (callback) {
            var total = 2;
            
            ctrl.getPriorities(function (priorities){
                total--;
                if (total <= 0) {
                    if (callback) {
                       callback();
                    }                    
                }
            });
            
            ctrl.getSubjects(function(subjects){
                total--;
                if (total <= 0) {
                    if (callback) {
                       callback();
                    }                    
                }                
            });
		};

		this.close = function (item, isToContinue) {

			if (isToContinue === true) {
				delete ctrl.model.ttAssunto;
				delete ctrl.model.ttPrioridade;
				ctrl.model.qtd_tempo_previs_atendim = 0;
				ctrl.model.num_id = undefined;
				ctrl.validadeParameterModel(isToContinue);
			} else if ($modalInstance) {
				$modalInstance.close(item);
			}

		};

		this.cancel = function () {
			//$modalInstance.dismiss('cancel');
            $modalInstance.close();
		};

		this.init = function () {
            ctrl.editMode = (this.model.num_id && this.model.num_id > 0);

            ctrl.load(function () {
                ctrl.validadeParameterModel();
            });
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.idTicketType = parameters.idTicketType || 0;
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
		'$rootScope', '$scope', '$modalInstance', '$filter', 'crm.helper', 'parameters', 'TOTVSEvent', 'crm.crm_tip_ocor.factory', 'crm.crm_priorid_ocor.factory', 'crm.crm_assunto_ocor.factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT STYLE TO ACCOUNT
	// *************************************************************************************
	modalTicketSubjecEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-type/ticket-subject/ticket-subject.edit.html',
				controller: 'crm.ticket-subject.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTicketSubjecEdit.$inject = ['$modal'];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-subject.modal', modalTicketSubjecEdit);

	index.register.controller('crm.ticket-subject.edit.control', controllerResourceEdit);

});
