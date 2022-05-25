/*globals index, define, angular, CRMURL, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	var helperScript,
		factoryScript;

	helperScript = function (helper, legend, $rootScope) {

		var i, CRMScriptHelper = this;

		this.types = [
			{num_id: legend.scriptTypes.ID.ACCOUNT,     nom_tip_script: legend.scriptTypes.NAME(1)},
			{num_id: legend.scriptTypes.ID.CAMPAING,    nom_tip_script: legend.scriptTypes.NAME(2)},
			{num_id: legend.scriptTypes.ID.TASK,        nom_tip_script: legend.scriptTypes.NAME(3)},
			{num_id: legend.scriptTypes.ID.HISTORY,     nom_tip_script: legend.scriptTypes.NAME(4)},
			{num_id: legend.scriptTypes.ID.OPPORTUNITY, nom_tip_script: legend.scriptTypes.NAME(5)},
			{num_id: legend.scriptTypes.ID.SUPPORT,     nom_tip_script: legend.scriptTypes.NAME(6)},
			{num_id: legend.scriptTypes.ID.GENERAL,     nom_tip_script: legend.scriptTypes.NAME(7)}
		];

		this.questionTypes = [
			{num_id: 1, nom_component: $rootScope.i18n('l-text', [], 'dts/crm'),            is_weight: true,  is_multi_value: false, is_allow_detour: false},
			{num_id: 2, nom_component: $rootScope.i18n('l-multi-select', [], 'dts/crm'),    is_weight: true,  is_multi_value: true,  is_allow_detour: false},
			{num_id: 3, nom_component: $rootScope.i18n('l-select', [], 'dts/crm'),          is_weight: true,  is_multi_value: true,  is_allow_detour: true},
			{num_id: 4, nom_component: $rootScope.i18n('l-radio', [], 'dts/crm'),           is_weight: true,  is_multi_value: true,  is_allow_detour: true},
			{num_id: 5, nom_component: $rootScope.i18n('l-checkbox', [], 'dts/crm'),        is_weight: true,  is_multi_value: true,  is_allow_detour: false},
			{num_id: 6, nom_component: $rootScope.i18n('l-date', [], 'dts/crm'),            is_weight: true,  is_multi_value: false, is_allow_detour: false},
			{num_id: 7, nom_component: $rootScope.i18n('l-time', [], 'dts/crm'),            is_weight: true,  is_multi_value: false, is_allow_detour: false},
			{num_id: 8, nom_component: $rootScope.i18n('l-matriz-boolean', [], 'dts/crm'),  is_weight: true,  is_multi_value: true,  is_allow_detour: false},
			{num_id: 12, nom_component: $rootScope.i18n('l-matriz-integer', [], 'dts/crm'), is_weight: true,  is_multi_value: true,  is_allow_detour: false},
			{num_id: 13, nom_component: $rootScope.i18n('l-matriz-decimal', [], 'dts/crm'), is_weight: true,  is_multi_value: true,  is_allow_detour: false},
			{num_id: 14, nom_component: $rootScope.i18n('l-matriz-string', [], 'dts/crm'),  is_weight: true,  is_multi_value: true,  is_allow_detour: false},
			{num_id: 9,  nom_component: $rootScope.i18n('l-introduction', [], 'dts/crm'),   is_weight: false, is_multi_value: false, is_allow_detour: false},
			{num_id: 10, nom_component: $rootScope.i18n('l-integer', [], 'dts/crm'),        is_weight: true,  is_multi_value: false, is_allow_detour: false},
			{num_id: 11, nom_component: $rootScope.i18n('l-decimal', [], 'dts/crm'),        is_weight: true,  is_multi_value: false, is_allow_detour: false}
		];

		this.status = [
			{num_id: 1, nom_status: $rootScope.i18n('l-developing', [], 'dts/crm')},
			{num_id: 2, nom_status: $rootScope.i18n('l-script-published', [], 'dts/crm')},
			{num_id: 3, nom_status: $rootScope.i18n('l-script-closed', [], 'dts/crm')}
		];

		this.parseScriptType = function (script) {
			if (script) {
				script.nom_tip_script = legend.scriptTypes.NAME(script.idi_tip_script);
			}
		};

		this.parseScriptQuestType = function (question) {
			if (question.idi_tip_quest >= 0) {
				for (i = 0; i < this.questionTypes.length; i++) {
					if (this.questionTypes[i].num_id === question.idi_tip_quest) {
						question.ttTipo = this.questionTypes[i];
						break;
					}

				}
			} else {
				question.ttTipo = this.questionTypes[0];
			}
		};

		this.parseScriptStatus = function (script) {
			var status = script.num_livre_1 || 1;

			if (status === 1) {
				script.nom_status = $rootScope.i18n('l-developing', [], 'dts/crm');
			} else if (status === 2) {
				script.nom_status = $rootScope.i18n('l-script-published', [], 'dts/crm');
			} else if (status === 3) {
				script.nom_status = $rootScope.i18n('l-script-closed', [], 'dts/crm');
			}

			this.parseScriptColor(script);
		};

		this.parseScriptColor = function (script) {
			script.nom_cor = 'crm-script-yellow';

			if (script.num_livre_1 === 2) {
				script.nom_cor = 'crm-script-green';
			} else if (script.num_livre_1 === 3) {
				script.nom_cor = 'crm-script-dark';
			}
		};

		this.isRowFilter = function (item) {
			return item.log_atrib === false || item.log_atrib === undefined;
		};

		this.isColunmFilter = function (item) {
			return item.log_atrib === true;
		};
	};

	helperScript.$inject = ['crm.helper', 'crm.legend', '$rootScope'];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************


	factoryScript = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericCreateUpdate,
						 factoryGenericDetail, factoryGenericDelete, ReportService) {

		var factory,
			cache = $cacheFactory('crm.script.Cache');

		factory = $totvsresource.REST(CRMURL.scriptService + ':method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['nom_script']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [true]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.reorderPages = function (script, pages, callback) {
			return this.TOTVSUpdate({method: 'page_order', id: script, pages: pages}, {}, callback);
		};

		factory.changeQuestionPage = function (pageId, questionId, callback) {
			return this.TOTVSUpdate({method: 'change_question_page', pageId: pageId, questionId: questionId}, {}, callback);
		};

		factory.removePage = function (id, callback) {
			return this.TOTVSRemove({method: 'page', id: id}, callback);
		};

		factory.savePage = function (id, model, callback) {
			return this.DTSPost({ method: 'page', script: id }, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updatePage = function (id, idPage, model, callback) {
			return this.DTSPut({method: 'page', id: idPage}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.reorderQuestions = function (page, quests, callback) {
			return this.TOTVSUpdate({method: 'questions_order', id: page, quests: quests}, {}, callback);
		};

		factory.saveQuestion = function (idPage, model, callback) {
			return this.DTSPost({method: 'question'}, model, function (result) {
				if (result && result.length > 0) {
					result = result[0];
					if (result.hasOwnProperty("ttQuestaoAtributo")) {
						result.ttQuestionarioQuestaoAtributo = angular.copy(result.ttQuestaoAtributo);
						delete result.ttQuestaoAtributo;
					}
				} else {
					result = undefined;
				}

				if (callback) { callback(result); }
			});
		};

		factory.updateQuestion = function (idPage, idQuestion, model, callback) {
			return this.DTSPut({method: 'question', id: idQuestion}, model, function (result) {
				if (result && result.length > 0) {
					result = result[0];
					if (result.hasOwnProperty("ttQuestaoAtributo")) {
						result.ttQuestionarioQuestaoAtributo = angular.copy(result.ttQuestaoAtributo);
						delete result.ttQuestaoAtributo;
					}
				} else {
					result = undefined;
				}

				if (callback) { callback(result); }
			});
		};

		factory.removeQuestion = function (id, callback) {
			return this.TOTVSRemove({method: 'question', id: id}, callback);
		};

		factory.saveAttribute = function (idQuestion, model, callback) {
			return this.DTSPost({method: 'attribute', id: idQuestion}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateAttribute = function (idQuestion, idAttribute, model, callback) {
			return this.DTSPut({method: 'attribute', id: idQuestion}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.removeAttribute = function (id, callback) {
			return this.TOTVSRemove({method: 'attribute', id: id}, callback);
		};

		factory.removeAllAttributes = function (id, callback) {
			return this.TOTVSRemove({method: 'all_attributes', id: id}, callback);
		};

		factory.addDetour = function (id, idPage, callback) {
			return this.DTSPost({method: 'add_detour', id: id, page: idPage}, {}, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.removeDetour = function (id, callback) {
			return this.TOTVSPost({method: 'remove_detour', id: id}, {}, callback);
		};

		factory.printScript = function (script, callback) {
			return ReportService.run('crm/rel_questionario', {
				format: 'HTML',
				program: '/report/crm/crm0003',
				resultFileName: script.nom_script,
				num_id_script: script.num_id
			}, {}, callback);
		};

		factory.duplicateRecord = function (script, model, callback) {
			return this.DTSPost({method: 'duplicate', id: script}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		return factory;
	};

	factoryScript.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory', 'ReportService'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.script.helper', helperScript);

	index.register.factory('crm.crm_script.factory', factoryScript);

});
