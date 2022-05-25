/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL SELECT OBJECTIVE
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/campaign/action/result/action/action.edit.html',
				controller: 'crm.campaign-action-result-action.edit.control as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECT OBJECTIVE
	// *************************************************************************************

	controller = function ($rootScope, $scope, $modalInstance, $filter, parameters, factory,
		helper, TOTVSEvent) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.actions = undefined;
		this.model = undefined;
		this.optionsTime = [
			{id: 1, value: $rootScope.i18n('l-minutes', [], 'dts/crm')},
			{id: 2, value: $rootScope.i18n('l-hours', [], 'dts/crm')},
			{id: 3, value: $rootScope.i18n('l-days', [], 'dts/crm')},
			{id: 4, value: $rootScope.i18n('l-months', [], 'dts/crm')}
		]

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.close = function (item, isToContinue) {
			var i;

			CRMControl.ttProximaAcao = CRMControl.ttProximaAcao || [];		

			if (CRMUtil.isDefined(item)) {
				CRMControl.ttProximaAcao.push(item);
			}

			if (isToContinue === true) {

				for (i=0; i < this.actions.length; i++) {
					if (this.actions[i].num_id_acao === this.model.ttAcao.num_id_acao) {
						this.actions.splice(i, 1);
						break;
					}
				}

				delete CRMControl.model.ttAcao;
				delete CRMControl.model.ttInitialTime;
				delete CRMControl.model.ttFinalTime;

				CRMControl.model.log_livre_1 = false;
				CRMControl.model.log_livre_2 = false;
				CRMControl.model.idi_medid_tempo = 0; // default hora
				CRMControl.model.idi_medid_tempo_durac = 0; // default hora
				CRMControl.model.val_tempo_apos = 0;
				CRMControl.model.val_tempo_durac = 0;

			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.ttProximaAcao);
			}
		};

		this.beforeClose = function (item, isToContinue, message) {

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-next-action', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-action', [], 'dts/crm'),
					CRMControl.model.ttAcao.nom_acao
				], 'dts/crm')
			});

			CRMControl.close(item, isToContinue);
		};	
		
		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model || {};

			if (!model.ttAcao || model.ttAcao.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-action');
			}

			if (!model.num_id_acao_restdo || model.num_id_acao_restdo < 1) {
				isInvalidForm = true;
				messages.push('l-result');
			}	
			
			if (CRMControl.model.log_livre_2 == true) {

				if (CRMControl.model.val_tempo_apos && CRMControl.model.val_tempo_apos > 0) {
					if (!CRMControl.model.ttInitialTime || CRMControl.model.ttInitialTime.id < 1) {

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-next-action', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-form-validation-time-measure', [$rootScope.i18n('l-start-after', [], 'dts/crm')], 'dts/crm')
						});

						isInvalidForm = true;	

					}
				}

				if (CRMControl.model.val_tempo_durac && CRMControl.model.val_tempo_durac > 0) {
					if (!CRMControl.model.ttFinalTime || CRMControl.model.ttFinalTime.id < 1) {

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-next-action', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-form-validation-time-measure', [$rootScope.i18n('l-duration', [], 'dts/crm')], 'dts/crm')
						});

						isInvalidForm = true;

					}
				}				

			}

			if (isInvalidForm) {
				if (messages.length > 0) {
					helper.showInvalidFormMessage('l-next-action', messages);
				}
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {}, model = CRMControl.model || {};

			vo.num_id = model.num_id;
			vo.num_id_acao = model.ttAcao.num_id_acao;
			vo.log_livre_1 = model.log_livre_1;
			vo.log_livre_2 = model.log_livre_2;
			vo.val_tempo_apos = model.val_tempo_apos;
			vo.val_tempo_durac = model.val_tempo_durac;
			vo.num_id_acao_restdo = model.num_id_acao_restdo;

			if (vo.log_livre_2 == true) {
				if (vo.val_tempo_apos && vo.val_tempo_apos > 0) {
					vo.idi_medid_tempo = (model.ttInitialTime && model.ttInitialTime.id) ? model.ttInitialTime.id : 2;
				}

				if (vo.val_tempo_durac && vo.val_tempo_durac > 0) {
					vo.idi_medid_tempo_durac = (model.ttFinalTime && model.ttFinalTime.id) ? model.ttFinalTime.id : 2;
				}
			} else {
				vo.val_tempo_apos  = 0;
				vo.val_tempo_durac = 0;	
				vo.idi_medid_tempo = 0;
				vo.idi_medid_tempo_durac = 0;								
			}		

			return vo;
		};		
		
		this.save = function (isToContinue) {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave(),
				message,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {

				if (!item) { return; }

				if (CRMControl.editMode) {
					CRMControl.beforeClose(item, isToContinue, message);
				} else {
					CRMControl.beforeClose(item, isToContinue, message);
				}

			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateActionResultAction(vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addActionResultAction(vo, fnAfterSave);
			}

		};		

		this.load = function () {
			var i;

			CRMControl.editMode = (this.model.num_id && this.model.num_id > 0) ? true : false;

			if (CRMControl.editMode == true) {

				if (this.actions && this.actions.length > 0) {
					for (i=0; i < this.actions.length; i++) {
						if (this.actions[i].num_id_acao === this.model.num_id_acao) {
							this.model.ttAcao = this.actions[i];
						}
					}
				}

				for (i=0; i < this.optionsTime.length; i++) {
					if (this.optionsTime[i].id === this.model.idi_medid_tempo) {
						this.model.ttInitialTime = this.optionsTime[i];
					}

					if (this.optionsTime[i].id === this.model.idi_medid_tempo_durac) {
						this.model.ttFinalTime = this.optionsTime[i];
					}					
				}

			} else {
				if (this.actions && this.actions.length > 0) {
					this.model.ttAcao = this.actions[0]; // posiciona no primeiro
				}
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.actions = parameters.actions ? angular.copy(parameters.actions) : [];
		this.model = parameters.model ? angular.copy(parameters.model) : {};
		this.model.num_id_acao_restdo = parameters.num_id_acao_restdo || undefined;

		this.load();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_campanha.factory',
		'crm.helper', 'TOTVSEvent'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign-action-result-action.modal.edit', modal);
	index.register.controller('crm.campaign-action-result-action.edit.control', controller);
});
