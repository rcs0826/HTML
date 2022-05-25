/*globals index, define, angular, TOTVSEvent, CRMControl, CRMUtil */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1068.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** SCRIPT > PAGE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, TOTVSEvent, factory) {

		this.showChart = function (question) {

			var CRMControl = this;

			if (question.$tab === 1) { return; }

			CRMControl.parseChart(question);
			question.$tab = 1;
		};

		this.parseChart = function (question) {
			var CRMControl = this;

			if (question.idi_tip_quest === 8 || question.idi_tip_quest === 12 || question.idi_tip_quest === 13 || question.idi_tip_quest === 14) {
				CRMControl.parseChartMatrix(question);
			} else {
				CRMControl.parseChartSimple(question);
			}
		};

		this.parseChartMatrix = function (question) {
			var i, j, k, categories = [], series = [], attribute, option, optionAttribute;


			if (question.hasOwnProperty("ttOpcao")) {

				if (question.hasOwnProperty("ttAtributo")) {
					for (i = 0; i < question.ttAtributo.length; i++) {
						attribute = question.ttAtributo[i];
						series.push({ id: attribute.num_id, name: attribute.nom_atrib, data: [] });
					}
				}

				for (i = 0; i < question.ttOpcao.length; i++) {

					option = question.ttOpcao[i];

					categories.push(option.nom_atrib);

					if (option.hasOwnProperty("ttOpcaoAtributo")) {

						for (j = 0; j < option.ttOpcaoAtributo.length; j++) {

							optionAttribute = option.ttOpcaoAtributo[j];

							for (k = 0; k < series.length; k++) {
								if (series[k].id === optionAttribute.num_id_atrib) {
									series[k].data.push(optionAttribute.num_total_respostas);
									break;
								}
							}

						}
					}
				}
			}

			question.options = {
				categoryAxis: {
					categories: categories,
					labels: {
						position: "center"
					}
				},
				valueAxis: {
					majorUnit: 1
				},
				legend: {
					position: "top"
				},
				tooltip: {
					visible: true,
					format: "{0}%",
					template: "#= series.name #: #= value #"
				},
				seriesDefaults: {
					type: "column"
				},
				series: series
			};
		};

		this.parseChartSimple = function (question) {
			var i, j, categories = [], series = [], sum = 0;

			question.options = {
				dataSource: question.ttAtributo,
				legend: {
					position: "bottom"
				},
				valueAxis: {
					majorUnit: 1
				},
				series: [{
					field: "num_total_respostas",
					categoryField: "nom_atrib",
					labels: {
						visible: false,
						template: "#= category #: \n #= value#",
						position: "center"
					},
					tooltip: {
						visible: true,
						template: function (dataItem) {
							if (dataItem.dataItem.num_total_respostas > 0) {
								return dataItem.dataItem.nom_atrib + " (" + (dataItem.dataItem.num_total_respostas / question.num_total_respostas * 100).toFixed(2) + "%)";
							} else {
								return dataItem.dataItem.nom_atrib;
							}
						}
					},
					type: "bar"
				}]
			};
		};

		this.showList = function (question) {
			var CRMControl = this;

			if (question.$tab === 0) { return; }

			CRMControl.parseList(question);
			question.$tab = 0;

		};

		this.showMatrix = function (question) {

			if (question.$tab === 2) { return; }

			question.$tab = 2;

		};

		this.parseList = function (question) {

			var CRMControl = this;

			if (question.idi_tip_quest === 8 || question.idi_tip_quest === 12 || question.idi_tip_quest === 13 || question.idi_tip_quest === 14) {
				CRMControl.parseMultiAnwserGrid(question);
			} else {
				CRMControl.parseSingleAnwserGrid(question);
			}

		};

		this.parseMultiAnwserGrid = function (question) {

			var CRMControl = this, colunms = [], i, j, anwserTemp;

			colunms = [
				{
					field: 'nom_usuar',
					title: $rootScope.i18n('l-user', [], 'dts/crm'),
					editable: false
				}, {
					field: 'nom_razao_social',
					title: $rootScope.i18n('l-account', [], 'dts/crm'),
					editable: false
				}
			];

			if (question.hasOwnProperty("ttOpcao")) {

				for (i = 0; i < question.ttOpcao.length; i++) {

					colunms.push({
						field: "opt_" + i,
						title: question.ttOpcao[i].nom_atrib,
						editable: false
					});

				}

			}

			if (question.hasOwnProperty("ttResposta")) {

				for (i = 0; i < question.ttResposta.length; i++) {

					anwserTemp = question.ttResposta[i].dsl_respos.split(",");

					for (j = 0; j < anwserTemp.length; j++) {

						question.ttResposta[i]["opt_" + j] = anwserTemp[j];

					}

				}

			}

			question.gridOptions = {
				sortable: true,
				autoResizeColumn: true,
				dataSource: {
					data: angular.copy(question.ttResposta)
				},
				columns: colunms
			};


		};

		this.parseSingleAnwserGrid = function (question) {

			var CRMControl = this,
				i;

			question.gridOptions = {
				sortable: true,
				autoResizeColumn: true,
				dataSource: {
					data: angular.copy(question.ttResposta)
				},
				columns: [
					{
						field: 'nom_usuar',
						title: $rootScope.i18n('l-user', [], 'dts/crm'),
						editable: false
					}, {
						field: 'nom_razao_social',
						title: $rootScope.i18n('l-account', [], 'dts/crm'),
						editable: false
					}, {
						field: 'dsl_respos',
						title: $rootScope.i18n('l-anwser', [], 'dts/crm'),
						editable: false
					}
				]
			};

		};

	};

	service.$inject = [
		'$rootScope', 'TOTVSEvent', 'crm.crm_script.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.script-analyzer-page-question.tab.service', service);

});
