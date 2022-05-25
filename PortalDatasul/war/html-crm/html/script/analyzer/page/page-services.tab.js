/*globals index, define, TOTVSEvent, CRMControl, CRMUtil, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/js/api/fchcrm1079.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** SCRIPT > ANALYZER > PAGE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory, anwserAnalyzerFactory) {

		this.selectPage = function (page) {

			var CRMControl = this;

			if (CRMUtil.isUndefined(page)) {
				CRMControl.selectedPage = undefined;
				return;
			}

			if (CRMUtil.isDefined(CRMControl.selectedPage)) {
				CRMControl.selectedPage.$selected = false;
				page.$selected = true;
			} else {
				page.$selected = true;
			}

			CRMControl.selectedPage = page;
			CRMControl.loadPageData(page);
		};

		this.loadPageData = function (page) {

			if (CRMUtil.isUndefined(page.num_id)) {
				return;
			}

			var CRMControl = this,
				question,
				filter,
				i = 0;

			filter = {
				page: page.num_id,
				start: undefined,
				end: undefined
			};

			if (CRMUtil.isDefined(CRMControl.filterRange)) {
				filter.start = CRMControl.filterRange.start;
				filter.end = CRMControl.filterRange.end;
			}

			anwserAnalyzerFactory.getDataByPage(page.num_id_script, filter, function (result) {

				angular.extend(CRMControl.selectedPage, result);

				if (CRMControl.selectedPage.hasOwnProperty("ttQuestao")) {

					for (i = 0; i < CRMControl.selectedPage.ttQuestao.length; i++) {

						question = CRMControl.selectedPage.ttQuestao[i];

						if ((question.idi_tip_quest >= 2 && question.idi_tip_quest <= 5) || (question.idi_tip_quest === 8
																							|| question.idi_tip_quest === 12
																							|| question.idi_tip_quest === 13
																							|| question.idi_tip_quest === 14)) {

							CRMControl.showChart(CRMControl.selectedPage.ttQuestao[i]);

						} else {

							CRMControl.showList(CRMControl.selectedPage.ttQuestao[i]);

						}

					}
				}

			});
		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_script.factory', 'crm.crm_script_respos.analyzer.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.script-analyzer-page.tab.service', service);

});
