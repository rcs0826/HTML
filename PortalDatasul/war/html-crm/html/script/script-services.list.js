/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/html/script/script-services.edit.js',
	'/dts/crm/html/script/script-services.edit-status.js',
	'/dts/crm/html/script/script-services.detail.js',
	'/dts/crm/html/script/script-services.advanced-search.js',
	'/dts/crm/js/api/fchcrm1078.js',
	'/dts/crm/html/script/anwser/anwser-services.execution.js'
], function (index) {

	'use strict';

	var controllerScriptList;

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerScriptList = function ($rootScope, $scope, $stateParams, $filter, TOTVSEvent, legend,
									 $location, helper, modalScriptEdit, scriptFactory, userSummaryModal,
									 scriptHelper, modalScriptAdvancedSearch, filterHelper, userPreferenceModal,
									 modalScriptEditStatus, modalAnwserExecution) {

		var CRMControlScriptList = this;

		this.listOfScript = [];
		this.listOfScriptCount = 0;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.quickFilters = [];

		// *************************************************************************************
		// *** FUNCTIONS
		// *************************************************************************************

		this.parseScript = function (script) {
			scriptHelper.parseScriptStatus(script);
			scriptHelper.parseScriptColor(script);
			scriptHelper.parseScriptType(script);
		};

		this.loadDefaults = function (disclaimers) {

			var i;

			if (!disclaimers) { return; }

			if (!angular.isArray(disclaimers)) {
				disclaimers = [disclaimers];
			}

			this.disclaimers = [];

			for (i = 0; i < disclaimers.length; i++) {
				if (disclaimers[i].fixed === true) {
					this.fixedDisclaimers.push(disclaimers[i]);
				} else {
					this.disclaimers.push(disclaimers[i]);
				}
			}

			this.disclaimers = this.fixedDisclaimers.concat(this.disclaimers);
		};

		this.remove = function (script) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-script', [
					script.nom_script
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }

					scriptFactory.deleteRecord(script.num_id, function (result) {

						if (result.$hasError === true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControlScriptList.removeScriptInList(script);
					});
				}
			});
		};

		this.search = function (isMore) {
			var filters,
				options;

			if (CRMControlScriptList.isPendingListSearch === true) {
				return;
			}

			CRMControlScriptList.listOfScriptCount = 0;

			if (!isMore) {
				CRMControlScriptList.listOfScript = [];
			}

			options = {
				start: CRMControlScriptList.listOfScript.length,
				end: (CRMControlScriptList.isChild === true ? 10 : 50)
			};

			if (CRMControlScriptList.selectedOrderBy) {
				options.orderBy = CRMControlScriptList.selectedOrderBy.property;
				options.asc = CRMControlScriptList.selectedOrderBy.asc;
			}

			filters = [];

			if (CRMControlScriptList.quickSearchText
					&& CRMControlScriptList.quickSearchText.trim().length > 0) {

				CRMControlScriptList.loadDefaults();

				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlScriptList.quickSearchText)
				});
			}


			filters = filters.concat(CRMControlScriptList.disclaimers);

			CRMControlScriptList.isPendingListSearch = true;

			scriptFactory.findRecords(filters, options, function (result) {
				CRMControlScriptList.addScriptInList(result, false);
				CRMControlScriptList.isPendingListSearch = false;
			});

		};

		this.duplicate = function (script) {

			var param = {
					script: script,
					duplicate: true
				},
				isNew = (script === undefined);

			modalScriptEdit.open(param).then(function (result) {
				if (!result) { return; }

				if (isNew) {
					CRMControlScriptList.addScriptInList(result, isNew);
				} else {
					CRMControlScriptList.updateScriptInList(result, script);
				}

			});

		};

		this.addEdit = function (script) {

			var param = {
					script: script
				},
				isNew = (script === undefined);

			modalScriptEdit.open(param).then(function (result) {
				if (!result) { return; }

				if (isNew) {
					CRMControlScriptList.addScriptInList(result, isNew);
				} else {
					CRMControlScriptList.updateScriptInList(result, script);
				}

			});
		};

		this.updateStatus = function (status, script) {
			if (status === undefined || script === undefined || CRMUtil.isUndefined(script.num_id)) { return; }

			var param = {
					script: script,
					status: status
				},
				isNew  = false,
				statusName,
				vo;

			if (status === 'development' || status === 'closed') {

				if (status === 'development') {
					statusName = 'l-developing';

					vo = {
						num_id: script.num_id,
						val_inic_valid: 1,
						val_fim_valid: 1,
						num_livre_1: 1
					};
				} else {
					statusName = 'l-script-closed';

					vo = {
						num_id: script.num_id,
						val_fim_valid: (new Date()).getTime(),
						num_livre_1: 3
					};
				}

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-to-update',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-script-confirm-change-status', [
						script.nom_script, ($rootScope.i18n(statusName, [], 'dts/crm'))
					], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }

						scriptFactory.updateRecord(script.num_id, vo, function (result) {

							if (result.$hasError === true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-script', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-script', [], 'dts/crm'), script.nom_script], 'dts/crm')
							});

							CRMControlScriptList.updateScriptInList(result, script);
							$rootScope.$broadcast(CRMEvent.scopeSaveScript, result);
						});
					}
				});
			} else {
				modalScriptEditStatus.open(param).then(function (result) {
					if (!result) { return; }
					CRMControlScriptList.updateScriptInList(result, script);
				});
			}

		};

		this.addScriptInList = function (scripts, isNew) {
			var i,
				script;


			if (!scripts) { return; }

			if (!angular.isArray(scripts)) {
				scripts = [scripts];
			}

			for (i = 0; i < scripts.length; i++) {

				script = scripts[i];

				if (script && script.$length) {
					CRMControlScriptList.listOfScriptCount = script.$length;
				}

				CRMControlScriptList.parseScript(script);

				if (isNew === true) {
					CRMControlScriptList.listOfScript.unshift(script);
					CRMControlScriptList.listOfScriptCount++;
				} else {
					CRMControlScriptList.listOfScript.push(script);
				}

			}

		};

		this.updateScriptInList = function (script, oldScript) {
			CRMControlScriptList.parseScript(script);

			var index = this.listOfScript.indexOf(oldScript);

			this.listOfScript[index] = script;
		};

		this.removeScriptInList = function (script) {
			var idx = CRMControlScriptList.listOfScript.indexOf(script);
			CRMControlScriptList.listOfScript.splice(idx, 1);
			CRMControlScriptList.listOfScriptCount--;
		};

		this.openUserSummary = function (id) {
			if (!id) { return; }

			userSummaryModal.open({
				model: {num_id: id}
			});
		};

		this.openAdvancedSearch = function () {
			modalScriptAdvancedSearch.open({
				disclaimers: CRMControlScriptList.disclaimers,
				fixedDisclaimers: CRMControlScriptList.fixedDisclaimers
			}).then(function (result) {
				CRMControlScriptList.quickSearchText = undefined;
				CRMControlScriptList.disclaimers = result.disclaimers;
				CRMControlScriptList.fixedDisclaimers = result.fixedDisclaimers;
				CRMControlScriptList.search(false);
			});

		};

		this.removeDisclaimer = function (disclaimer) {
			var i,
				index = CRMControlScriptList.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControlScriptList.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControlScriptList.fixedDisclaimers.length; i++) {
					if (CRMControlScriptList.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControlScriptList.disclaimers.push(CRMControlScriptList.fixedDisclaimers[i]);
						break;
					}
				}
				CRMControlScriptList.search(false);
			}
		};

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(
				filters,
				CRMControlScriptList.disclaimers,
				CRMControlScriptList.fixedDisclaimers,
				function (newDisclaimers) {
					CRMControlScriptList.disclaimers = angular.copy(newDisclaimers.disclaimers);
					CRMControlScriptList.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControlScriptList.quickSearchText = undefined;
					CRMControlScriptList.search(false);

					if (CRMControlScriptList.disclaimers[0].property === 'custom.status') {
						CRMControlScriptList.disclaimers[0].title = $rootScope.i18n('l-status') + ': ' + CRMControlScriptList.disclaimers[0].title;
					}
				}
			);
		};

		this.print = scriptFactory.printScript;

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'script.list' });
		};

		this.openAnalyzer = function (script) {
			if (CRMUtil.isUndefined(script)) { return; }

			$location.path('/dts/crm/script/analyzer/' + script);
		};

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

		this.init = function (disclaimers) {

			var viewName = $rootScope.i18n('nav-script', [], 'dts/crm'),
				startView,
				viewController = 'crm.script.list.control';


			helper.loadCRMContext(function () {

				var today = new Date();
				today.setHours(0);
				today.setMinutes(0);
				today.setSeconds(0);
				today.setMilliseconds(0);
				today = today.getTime();

				CRMControlScriptList.quickFilters = [{
					property: 'num_id_usuar',
					value: $rootScope.currentuser.idCRM,
					title: $rootScope.i18n('l-script-filter-mine', [], 'dts/crm'),
					fixed: false,
					model: {
						value : {
							num_id: $rootScope.currentuser.idCRM,
							nom_usuar: $rootScope.currentuser['user-desc']
						}
					}
				}, {
					property: 'custom.status',
					value: 1,
					title: $rootScope.i18n('l-developing', [], 'dts/crm'),
					fixed: false,
					model : {
						property: "custom.status",
						value: 1
					}
				}, {
					property: 'custom.status',
					value: 2,
					title: $rootScope.i18n('l-script-published', [], 'dts/crm'),
					fixed: false,
					model : {
						property: "custom.status",
						value: 2
					}
				}, {
					property: 'custom.status',
					value: 3,
					title: $rootScope.i18n('l-script-closed', [], 'dts/crm'),
					fixed: false,
					model : {
						property: "custom.status",
						value: 3
					}
				}];

				startView = helper.startView(viewName, viewController, CRMControlScriptList);

				if (disclaimers) {
					CRMControlScriptList.disclaimers = disclaimers;
				}

				if (startView.isNewTab === true) {
					CRMControlScriptList.loadDefaults();
				}

				if (startView.isNewContext === true) {
					CRMControlScriptList.search(false);
				}
			});

		};

		if ($rootScope.currentuserLoaded) { this.init(); }


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlScriptList = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			CRMControlScriptList.init([{
				property: 'idi_tip_script',
				value: 6,
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(6), [], 'dts/crm'),
				fixed: true
			}, {
				property: 'idi_tip_script',
				value: 7,
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(7), [], 'dts/crm'),
				fixed: true
			}]);
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlScriptList.init();
		});

	};

	controllerScriptList.$inject = ['$rootScope', '$scope', '$stateParams', '$filter', 'TOTVSEvent', 'crm.legend',
									'$location', 'crm.helper', 'crm.script.modal.edit', 'crm.crm_script.factory',
									'crm.user.modal.summary', 'crm.script.helper', 'crm.script.modal.advanced.search',
									'crm.filter.helper', 'crm.user.modal.preference', 'crm.script.modal.edit-status', 'crm.script-anwser.modal.execution'];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.script.list.control', controllerScriptList);

});
