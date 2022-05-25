/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
/*jslint nomen: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/html/script/detour/detour-services.edit.js',
	'/dts/crm/html/script/script-services.edit-status.js',
	'/dts/crm/html/script/page/page-services.tab.js',
	'/dts/crm/html/script/page/question/question-services.tab.js',
	'/dts/crm/js/api/fchcrm1078.js',
	'/dts/crm/html/script/anwser/anwser-services.execution.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $location, $stateParams, TOTVSEvent, appViewService,
							legend, helper, factory, scriptHelper, modalScriptEdit, serviceScriptPageTab,
							serviceScriptPageQuestionTab, modalScriptDetour, modalScriptEditStatus,
							modalAnwserExecution) {

		var CRMControl = this;

		this.model = {};

		this.selectedPage = undefined;

		angular.extend(this, serviceScriptPageTab);
		angular.extend(this, serviceScriptPageQuestionTab);

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.parseScript = function () {
			scriptHelper.parseScriptStatus(CRMControl.model);
			scriptHelper.parseScriptColor(CRMControl.model);
			scriptHelper.parseScriptType(CRMControl.model);
		};

		this.load = function (id) {

			factory.getRecord(id, function (result) {

				if (!CRMUtil.isDefined(result)) { return; }

				CRMControl.model = result;
				CRMControl.parseScript();

				if (CRMControl.model.ttQuestionarioPagina && CRMControl.model.ttQuestionarioPagina.length > 0) {
					CRMControl.selectedPage = CRMControl.model.ttQuestionarioPagina[0];
					CRMControl.selectedPage.$selected = true;
				}
			});
		};

		this.onEdit = function () {

			modalScriptEdit.open({
				script: CRMControl.model
			}).then(function (result) {

				if (!result) { return; }

				CRMControl.model = result;
				CRMControl.parseScript();
			});
		};

		this.duplicate = function () {

			var script = CRMControl.model,
				param = {
					script: script,
					duplicate: true
				},
				isNew = (script === undefined);

			modalScriptEdit.open(param).then(function (result) {
				if (!result) { return; }
			});

		};

		this.updateStatus = function (status) {
			if (status === undefined || CRMUtil.isUndefined(CRMControl.model.num_id)) { return; }

			var param = {
					script: CRMControl.model,
					status: status
				},
				isNew  = false,
				statusName,
				vo;

			if (status === 'development' || status === 'closed') {

				if (status === 'development') {
					statusName = 'l-developing';

					vo = {
						num_id: CRMControl.model.num_id,
						val_inic_valid: 1,
						val_fim_valid: 1,
						num_livre_1: 1
					};
				} else {
					statusName = 'l-script-closed';

					vo = {
						num_id: CRMControl.model.num_id,
						val_fim_valid: (new Date()).getTime(),
						num_livre_1: 3
					};
				}

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-to-update',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-script-confirm-change-status', [
						CRMControl.model.nom_script, ($rootScope.i18n(statusName, [], 'dts/crm'))
					], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }

						factory.updateRecord(CRMControl.model.num_id, vo, function (result) {

							if (result.$hasError === true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-script', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-script', [], 'dts/crm'), CRMControl.model.nom_script], 'dts/crm')
							});

							CRMControl.model.val_inic_valid = result.val_inic_valid;
							CRMControl.model.val_fim_valid = result.val_fim_valid;
							CRMControl.model.num_livre_1 = result.num_livre_1;
							CRMControl.parseScript();

							$rootScope.$broadcast(CRMEvent.scopeSaveScript, result);
						});
					}
				});
			} else {
				modalScriptEditStatus.open(param).then(function (result) {
					if (!result) { return; }
					CRMControl.model = result;
					CRMControl.parseScript();
				});
			}

		};

		this.onRemove = function () {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-script', [
					CRMControl.model.nom_script
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/script/');
					});
				}
			});
		};

		this.openDetourModal = function (model) {
			var i, page;
			if (model === undefined) { return; }

			modalScriptDetour.open({
				script: model
			}).then(function (script) {

				if (script === undefined) { return; }

				CRMControl.model = script;

				if (CRMControl.selectedPage && CRMControl.model.ttQuestionarioPagina) {

					for (i = 0; i < CRMControl.model.ttQuestionarioPagina.length; i++) {

						page = CRMControl.model.ttQuestionarioPagina[i];

						if (page && page.num_id === CRMControl.selectedPage.num_id) {
							CRMControl.selectedPage = page;
							break;
						}
					}
				}
			});

		};

		this.openAnalyzer = function () {
			$location.path('/dts/crm/script/analyzer/' + CRMControl.model.num_id);
		};

		this.print = factory.printScript;

		this.openView = function (script) {
			if (CRMUtil.isUndefined(script)) { return; }

			modalAnwserExecution.open({
				script: script,
				viewMode: true
			});
		};

		// *************************************************************************************
		// *** INIT
		// *************************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-script', [], 'dts/crm'),
				viewController = 'crm.script.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});

		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$location', '$stateParams', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.legend', 'crm.helper', 'crm.crm_script.factory', 'crm.script.helper', 'crm.script.modal.edit',
		'crm.script-page.tab.service', 'crm.script-page-question.tab.service', 'crm.script.modal.detour',
		'crm.script.modal.edit-status', 'crm.script-anwser.modal.execution'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.script.detail.control', controller);

});

