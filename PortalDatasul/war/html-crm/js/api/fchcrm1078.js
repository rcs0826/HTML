/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService*/
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
	var helperAnwser,
		factoryAnwser;

	helperAnwser = function (helper, legend, $rootScope) {

		var CRMAnwserHelper = this;

		this.filtersGroup = 'totvs.crm.portal.scripts.anwser.filters';

		this.parseAnwserStatus = function (anwser) {
			if (anwser) {
				if (anwser.idi_status === 1) {
					anwser.nom_cor = 'crm-anwser-blue';
				} else if (anwser.idi_status === 2) {
					anwser.nom_cor = 'crm-anwser-yellow';
				} else {
					anwser.nom_cor = 'crm-anwser-green';
				}
			}
		};

	};
	helperAnwser.$inject = ['crm.helper', 'crm.legend', '$rootScope'];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************


	factoryAnwser = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericCreateUpdate,
						 factoryGenericDetail, factoryGenericDelete, ReportService) {

		var factory;


		factory = $totvsresource.REST(CRMRestService + '1078/:method/:id/:anwser',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['val_dat_cadastro']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.save = function (model, callback) {
			return this.DTSPost(undefined, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.update = function (id, model, callback) {
			return this.DTSPut({id: id}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.getState = function (scriptId, anwserId, callback) {
			while (anwserId.indexOf('%') > 0) {
				anwserId = decodeURIComponent(anwserId);
			}

			return this.TOTVSQuery({method: 'state', id: scriptId, anwser: anwserId}, function (result) {
				if (result && result.length > 0) {

					var i, j, page, question;

					result = result[0];

					if (result.hasOwnProperty("ttRespostaR")) {
						if (result.ttRespostaR.hasOwnProperty("ttPessoaR")) {
							result.ttRespostaR.ttPessoa = angular.copy(result.ttRespostaR.ttPessoaR);
							delete result.ttRespostaR.ttPessoaR;
						}
						if (result.ttRespostaR.hasOwnProperty("ttUsuarioR")) {
							result.ttRespostaR.ttUsuario = angular.copy(result.ttRespostaR.ttUsuarioR);
							delete result.ttRespostaR.ttUsuarioR;
						}
						result.ttResposta = angular.copy(result.ttRespostaR);
						delete result.ttRespostaR;
					}

					if (result.hasOwnProperty("ttQuestionarioPagina")) {
						for (i = 0; i < result.ttQuestionarioPagina.length; i++) {

							page = result.ttQuestionarioPagina[i];

							if (page.hasOwnProperty("ttQuestionarioQuestao")) {

								for (j = 0; j < page.ttQuestionarioQuestao.length; j++) {

									question = page.ttQuestionarioQuestao[j];

									if (question.hasOwnProperty("ttRespostaQuestaoR")) {
										question.ttRespostaQuestao = angular.copy(question.ttRespostaQuestaoR);
										delete question.ttRespostaQuestaoR;
									}
								}
							}
						}
					}

				} else {
					result = undefined;
				}

				if (callback) { callback(result); }
			});
		};

		factory.printScript = function (numIdScript, nomIdAnwser, desScript, numIdRegScript, callback) {
			return ReportService.run('crm/rel_questionario', {
				format: 'HTML',
				program: '/report/crm/crm0008',
				resultFileName: numIdRegScript + '_' + desScript,
				num_id_script: numIdScript,
				nom_id_respos: nomIdAnwser
			}, {}, callback);
		};

		return factory;
	};
	// factoryAnwser
	factoryAnwser.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory',
		'crm.generic.detail.factory', 'crm.generic.delete.factory', 'ReportService'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.script-anwser.helper', helperAnwser);

	index.register.factory('crm.crm_script_respos.factory', factoryAnwser);

});
