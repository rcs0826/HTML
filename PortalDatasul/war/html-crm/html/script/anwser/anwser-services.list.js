/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1078.js',
	'/dts/crm/html/script/script-services.selection.js',
	'/dts/crm/html/script/anwser/anwser-services.execution.js'
], function (index) {

	'use strict';

	var controllerAnwserList;

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerAnwserList = function ($rootScope, $scope, $stateParams, $filter, TOTVSEvent, legend,
									 $location, helper, scriptAnwserFactory, scriptAnwserHelper, modalScriptSelection, modalAnwserExecution, modalUserSummary) {

		var CRMControlAnwserList = this;

		this.listOfAnwser = [];
		this.listOfAnwserCount = 0;

		this.disclaimers = [];
		this.fixedDisclaimers = [];

		this.model = undefined;

		// *************************************************************************************
		// *** FUNCTIONS
		// *************************************************************************************

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

		this.search = function (isMore) {
			var filters,
				options;

			if (CRMControlAnwserList.isPendingListSearch === true) {
				return;
			}

			CRMControlAnwserList.listOfAnwserCount = 0;

			if (!isMore) {
				CRMControlAnwserList.listOfAnwser = [];
			}

			options = {
				start: CRMControlAnwserList.listOfAnwser.length,
				end: 10
			};

			if (CRMControlAnwserList.selectedOrderBy) {
				options.orderBy = CRMControlAnwserList.selectedOrderBy.property;
				options.asc = CRMControlAnwserList.selectedOrderBy.asc;
			}

			filters = [];

			if (CRMControlAnwserList.quickSearchText
					&& CRMControlAnwserList.quickSearchText.trim().length > 0) {

				CRMControlAnwserList.loadDefaults();

				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlAnwserList.quickSearchText)
				});
			}


			filters = filters.concat(CRMControlAnwserList.disclaimers);

			CRMControlAnwserList.isPendingListSearch = true;

			scriptAnwserFactory.findRecords(filters, options, function (result) {
				CRMControlAnwserList.addAnwserInList(result, false);
				CRMControlAnwserList.isPendingListSearch = false;
			});

		};

		this.addAnwserInList = function (anwsers, isNew) {
			var i,
				anwser;

			if (!anwsers) { return; }

			if (!angular.isArray(anwsers)) {
				anwsers = [anwsers];
			}

			for (i = 0; i < anwsers.length; i++) {

				anwser = anwsers[i];

				if (anwser && anwser.$length) {
					CRMControlAnwserList.listOfAnwserCount = anwser.$length;
				}

				scriptAnwserHelper.parseAnwserStatus(anwser);

				if (isNew === true) {
					CRMControlAnwserList.listOfAnwser.unshift(anwser);
					CRMControlAnwserList.listOfAnwserCount++;
				} else {
					CRMControlAnwserList.listOfAnwser.push(anwser);
				}
			}

		};

		this.updateAnwserInList = function (anwser, oldAnwser) {

			var i;

			scriptAnwserHelper.parseAnwserStatus(anwser);

			for (i = 0; i < CRMControlAnwserList.listOfAnwser.length; i++) {

				if (CRMControlAnwserList.listOfAnwser[i].nom_id === anwser.nom_id) {
					CRMControlAnwserList.listOfAnwser[i] = angular.copy(anwser);
					break;
				}
			}

		};

		this.openModalExecution = function (script, relational, anwser) {

			if (script === undefined || relational === undefined) {
				return;
			}

			modalAnwserExecution.open({
				script: script,
				relationalType: CRMControlAnwserList.typeScript,
				relational: relational,
				anwser: anwser
			}).then(function (obj) {
				if (obj === undefined) { return; }

				if (obj.isNew === true) {
					CRMControlAnwserList.addAnwserInList(obj.anwser, true);
				} else {
					CRMControlAnwserList.updateAnwserInList(obj.anwser);
				}

				CRMControlAnwserList.listOfAnwser.sort(function (item1, item2) {
					return item2.val_dat_atualiz - item1.val_dat_atualiz;
				});

			});
		};

		this.openUserSummary = function (id) {
			if (!id) { return; }

			modalUserSummary.open({
				model: {num_id: id}
			});
		};

		this.openSelection = function () {

			modalScriptSelection.open({
				typeScript: CRMControlAnwserList.typeScript
			}).then(function (script) {
				CRMControlAnwserList.openModalExecution(script, CRMControlAnwserList.model);
			});
		};

		this.openExecution = function (anwser) {

			if (anwser === undefined || anwser.ttQuestionario === undefined) {
				return;
			}

			CRMControlAnwserList.openModalExecution(anwser.ttQuestionario, CRMControlAnwserList.model, anwser);
		};

		this.print = function (script) {
			scriptAnwserFactory.printScript(script.ttQuestionario.num_id, script.nom_id, script.ttQuestionario.nom_script, script.num_id_reg);
		};

		// *************************************************************************************
		// *** INIT
		// *************************************************************************************

		this.init = function (disclaimers, typeScript, model) {

			helper.loadCRMContext(function () {

				if (disclaimers) {
					CRMControlAnwserList.disclaimers = disclaimers;
				}

				if (typeScript) {
					CRMControlAnwserList.typeScript = typeScript;
				}

				if (model) {
					CRMControlAnwserList.model = model;
				}


				CRMControlAnwserList.search(false);
			});

		};


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAnwserList = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			var typeScript = 1;
			CRMControlAnwserList.init([{
				property: 'idi_tip_script',
				value: typeScript + '|7',
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(typeScript), [], 'dts/crm') +
					' ' + $rootScope.i18n('l-or', [], 'dts/crm') + ' ' + $rootScope.i18n(legend.scriptTypes.NAME(7), [], 'dts/crm'),
				fixed: true
			}, {
				property: 'num_id_reg',
				value: account.num_id,
				title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + account.num_id,
				fixed: true
			}], typeScript, account, true);
		});

		$scope.$on(CRMEvent.scopeLoadCampaign, function (event, campaign) {
			var typeScript = 2;
			CRMControlAnwserList.init([{
				property: 'idi_tip_script',
				value: typeScript + '|7',
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(typeScript), [], 'dts/crm') +
					' ' + $rootScope.i18n('l-or', [], 'dts/crm') + ' ' + $rootScope.i18n(legend.scriptTypes.NAME(7), [], 'dts/crm'),
				fixed: true
			}, {
				property: 'num_id_reg',
				value: campaign.num_id,
				title: $rootScope.i18n('l-campaign', [], 'dts/crm') + ': ' + campaign.num_id,
				fixed: true
			}], typeScript, campaign, true);
		});

		$scope.$on(CRMEvent.scopeLoadTask, function (event, task) {
			var typeScript = 3;
			CRMControlAnwserList.init([{
				property: 'idi_tip_script',
				value: typeScript + '|7',
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(typeScript), [], 'dts/crm') +
					' ' + $rootScope.i18n('l-or', [], 'dts/crm') + ' ' + $rootScope.i18n(legend.scriptTypes.NAME(7), [], 'dts/crm'),
				fixed: true
			}, {
				property: 'num_id_reg',
				value: task.num_id,
				title: $rootScope.i18n('l-task', [], 'dts/crm') + ': ' + task.num_id,
				fixed: true
			}], typeScript, task, (task.idi_status_tar === 1));
		});

		$scope.$on(CRMEvent.scopeLoadHistory, function (event, history) {
			var typeScript = 4;
			CRMControlAnwserList.init([{
				property: 'idi_tip_script',
				value: typeScript + '|7',
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(typeScript), [], 'dts/crm') +
					' ' + $rootScope.i18n('l-or', [], 'dts/crm') + ' ' + $rootScope.i18n(legend.scriptTypes.NAME(7), [], 'dts/crm'),
				fixed: true
			}, {
				property: 'num_id_reg',
				value: history.num_id,
				title: $rootScope.i18n('l-history', [], 'dts/crm') + ': ' + history.num_id,
				fixed: true
			}], typeScript, history, true);
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opp) {
			var typeScript = 5;
			CRMControlAnwserList.init([{
				property: 'idi_tip_script',
				value: typeScript + '|7',
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(typeScript), [], 'dts/crm') +
					' ' + $rootScope.i18n('l-or', [], 'dts/crm') + ' ' + $rootScope.i18n(legend.scriptTypes.NAME(7), [], 'dts/crm'),
				fixed: true
			}, {
				property: 'num_id_reg',
				value: opp.num_id,
				title: $rootScope.i18n('l-opportunity', [], 'dts/crm') + ': ' + opp.num_id,
				fixed: true
			}], typeScript, opp, (opp.ttFaseDesenvolvimento ? (opp.ttFaseDesenvolvimento.log_fechto_fase === false && opp.ttFaseDesenvolvimento.log_permite_alter === true) : false));
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			var typeScript = 6;
			CRMControlAnwserList.init([{
				property: 'idi_tip_script',
				value: typeScript + '|7',
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(typeScript), [], 'dts/crm') +
					' ' + $rootScope.i18n('l-or', [], 'dts/crm') + ' ' + $rootScope.i18n(legend.scriptTypes.NAME(7), [], 'dts/crm'),
				fixed: true
			}, {
				property: 'num_id_reg',
				value: ticket.num_id,
				title: $rootScope.i18n('l-ticket', [], 'dts/crm') + ': ' + ticket.num_id,
				fixed: true
			}], typeScript, ticket, (ticket.ttStatus.log_encerra_ocor === false));
		});

	};


	controllerAnwserList.$inject = ['$rootScope', '$scope', '$stateParams', '$filter', 'TOTVSEvent', 'crm.legend', '$location', 'crm.helper', 'crm.crm_script_respos.factory', 'crm.script-anwser.helper', 'crm.script.modal.selection', 'crm.script-anwser.modal.execution', 'crm.user.modal.summary'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.script-anwser.list.control', controllerAnwserList);
});
