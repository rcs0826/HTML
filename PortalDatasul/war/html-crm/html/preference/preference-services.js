/*global $, index, define, angular, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1010.js',
	'/dts/crm/js/api/fchcrm1015.js',
	'/dts/crm/js/api/fchcrm1018.js',
	'/dts/crm/js/api/fchcrm1033.js',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/api/fchcrm1047.js',
	'/dts/crm/js/api/fchcrm1042.js',
	'/dts/crm/js/api/fchcrm1059.js',
	'/dts/crm/js/api/fchcrm1060.js',
	'/dts/crm/js/api/fchcrm1061.js',
	'/dts/crm/js/api/fchcrm1062.js',
	'/dts/hub/js/api/fchhub0002.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/html/wizard/wizard-services.js'
], function (index) {

	'use strict';

	var controllerPreferenceList;


	// *************************************************************************************
	// *** Controller Listagem de parâmetros CRM
	// *************************************************************************************

	controllerPreferenceList = function ($scope, $rootScope, TOTVSEvent, paramFactory, filterHelper,
								  campaignFactory, accountRatingFactory, currencyFactory, clientTypeFactory,
								  clientGroupFactory, documentTypeFactory, userFactory, countryFactory,
								  publicLayoutFactory, bondTypeFactory, templateFactory,
								  ticketRatingFactory, informationGroupFactory, dataSegmentationFactory,
								  hierarchyTeamFactory, helper, modalWizard) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlParam = this;

		this.listOfParam = [];
		this.disclaimers = [];
		this.paramCount = 0;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		/**
		* Busca os parâmetros do CRM
		* @param  {Boolean} isMore Se é uma busca feita a partir do botão "buscar mais" (paginação)
		* @return {}
		*/
		this.search = function search(isMore) {

			paramFactory.getAll(CRMControlParam.afterSearch, false);

		};

		/**
		* Caso o parâmetro a ser editado seja do tipo "Select", monta os "options" de acordo com o campo des_legenda_param
		* @param  {String} options Lista de opçãoes disponíveis no select
		* @return {}
		*/
		this.fillSelectOptionsData = function (options, callback) {
			var selectItems = [],
				i,
				option;

			options = options.split(',');

			for (i = 0; i < options.length; i++) {
				option = options[i].split('-');
				selectItems.push({
					'value': option[0].trim(),
					'label': option[1].trim()
				});
			}

			if (callback) { callback(selectItems); }
		};


		/**
		 * Busca as ações de campanhas
		 * @param  {number} campaign ID da campanha (opcional)
		 * @param  {number} user     ID do usuário (opcional)
		 * @return {}
		 */
		this.getActions = function (campaign, user, callback) {
			campaignFactory.getAllActions(campaign, user, function (result) {
				if (callback) { callback(result); }
			});
		};

		this.getObjectives = function (campaign, action, callback) {
			campaignFactory.getAllObjectives(campaign, action, function (result) {
				if (callback) { callback(result); }
			}, false);
		};

		this.getResults = function (campaign, action, callback) {
			campaignFactory.getAllResults(campaign, action, function (result) {
				if (callback) { callback(result); }
			}, false);
		};

		this.getZoomData = function (parameter, defaultValue) {

			var i,
				z,
				value = false,
				afterSearchActions,
				afterSearchObjective,
				afterSearchRestdo;

			if (parameter.isOpen === true && defaultValue !== true) {
				return;
			} else {
				for (i = 0; i < CRMControlParam.listOfParam.length; i++) {
					if (CRMControlParam.listOfParam[i].nom_grp_param === parameter.nom_grp_param) {
						for (z = 0; z < CRMControlParam.listOfParam[i].ttParameter.length; z++) {
							if (CRMControlParam.listOfParam[i].ttParameter[z].nom_param_crm !== parameter.nom_param_crm) {
								CRMControlParam.listOfParam[i].ttParameter[z].isOpen = false;
							}
						}
						break;
					}
				}
			}



			afterSearchActions = function (result) {
				CRMControlParam.setDataZoom(result,
											{idName : 'num_id', labelName : 'nom_acao'},
											parameter);
			};
			afterSearchObjective = function (result) {
				CRMControlParam.setDataZoom(result,
											{idName : 'num_id', labelName : 'nom_objet_acao'},
											parameter);
			};
			afterSearchRestdo = function (result) {
				CRMControlParam.setDataZoom(result,
											{idName : 'num_id', labelName : 'nom_restdo'},
											parameter);
			};

			if (parameter.idi_campo_compon !== 2) {
				if (parameter.idi_campo_compon === 4) {
					if (parameter && parameter.dsl_param_crm) {
						value = (parameter.dsl_param_crm.trim().toLowerCase() === 'true');
					}
					parameter.value = value;
				} else if (parameter.idi_campo_compon === 3) {

					parameter.value = {
						'value': undefined,
						'label': undefined
					};

					CRMControlParam.fillSelectOptionsData(parameter.des_legenda_param, function (retorno) {
						for (i = 0; i < retorno.length; i++) {
							if (parseInt(parameter.dsl_param_crm, 10) === parseInt(retorno[i].value, 10)) {
								parameter.value.value = retorno[i].value;
								parameter.value.label = retorno[i].label;
							}
						}
					});
				} else {
					parameter.value = parameter.dsl_param_crm;
				}
				return;
			}

			parameter.ttResultZoom = [];
			parameter.value = undefined;

			if (parameter.dsl_param_crm.trim().length > 0) {
				parameter.value = {num_id : 0,
								   nom_valor : '** ! Valor Obsoleto, Atualize o registro!'};
			}

			/* jshint indent: 4 */
			switch (parameter.nom_tab_referada.toLowerCase()) {

			case 'crm_campanha':
				campaignFactory.getAllCampaigns(true, 0, function (result) {

					CRMControlParam.setDataZoom(result,
													{idName : 'num_id', labelName : 'nom_campanha'},
													parameter);
				});

				break;

			case 'crm_acao':

			case 'crm_campanha_acao':

				if (parameter.nom_param_crm.toLowerCase() === 'acao_trans_clas') {
					paramFactory.getPreferenceAsInteger('camp_trans_clas', function (result) {
						CRMControlParam.getActions(result, 0, function (actions) {
							afterSearchActions(actions);
						});
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'acao_camp_unific_gp') {
					paramFactory.getPreferenceAsInteger('camp_unific_gp', function (result) {
						CRMControlParam.getActions(result, 0, function (actions) {
							afterSearchActions(actions);
						});
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'acao_camp_def_tar') {
					paramFactory.getPreferenceAsInteger('camp_def_tar', function (result) {
						CRMControlParam.getActions(result, 0, function (actions) {
							afterSearchActions(actions);
						});
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'acao_camp_lead') {
					paramFactory.getPreferenceAsInteger('campanha_lead', function (result) {
						CRMControlParam.getActions(result, 0, function (actions) {
							afterSearchActions(actions);
						});
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'acao_df_mso') {
					paramFactory.getPreferenceAsInteger('camp_df_mso', function (result) {
						CRMControlParam.getActions(result, 0, function (actions) {
							afterSearchActions(actions);
						});
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'acao_camp_def_email') {
					paramFactory.getPreferenceAsInteger('camp_def_email', function (result) {
						CRMControlParam.getActions(result, 0, function (actions) {
							afterSearchActions(actions);
						});
					}, true);
				} else {
					CRMControlParam.getActions(0, 0, function (actions) {
						afterSearchActions(actions);
					});
				}

				break;

			case 'crm_objet':



				if (parameter.nom_param_crm.toLowerCase() === 'objt_acao_unific_gp') {
					paramFactory.getPreferenceAsInteger('camp_unific_gp', function (campUnifGP) {
						paramFactory.getPreferenceAsInteger('acao_camp_unific_gp', function (actionUnifGP) {

							CRMControlParam.getObjectives(campUnifGP, actionUnifGP, function (objectives) {
								afterSearchObjective(objectives);
							});
						}, true);
					}, true);
				} else {
					CRMControlParam.getObjectives(0, 0, afterSearchObjective);
				}

				break;

			case 'crm_restdo':
			case 'crm_acao_restdo':

				if (parameter.nom_param_crm.toLowerCase() === 'restdo_trans_clas') {
					paramFactory.getPreferenceAsInteger('camp_trans_clas', function (camps) {
						paramFactory.getPreferenceAsInteger('acao_trans_clas', function (actions) {

							CRMControlParam.getResults(camps, actions, function (results) {
								afterSearchRestdo(results);

							});
						}, true);
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'restdo_def_tar') {
					paramFactory.getPreferenceAsInteger('camp_def_tar', function (camps) {
						paramFactory.getPreferenceAsInteger('acao_camp_def_tar', function (actions) {

							CRMControlParam.getResults(camps, actions, function (results) {
								afterSearchRestdo(results);

							});
						}, true);
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'result_acao_camp_lead') {
					paramFactory.getPreferenceAsInteger('campanha_lead', function (camps) {
						paramFactory.getPreferenceAsInteger('acao_camp_lead', function (actions) {

							CRMControlParam.getResults(camps, actions, function (results) {
								afterSearchRestdo(results);

							});
						}, true);
					}, true);
				} else if (parameter.nom_param_crm.toLowerCase() === 'restdo_def_email') {
					paramFactory.getPreferenceAsInteger('camp_def_email', function (camps) {
						paramFactory.getPreferenceAsInteger('acao_camp_def_email', function (actions) {

							CRMControlParam.getResults(camps, actions, function (results) {
								afterSearchRestdo(results);

							});
						}, true);
					}, true);
				} else {
					CRMControlParam.getResults(0, 0, afterSearchRestdo);
				}

				break;

			case 'crm_clas':
				accountRatingFactory.getAll(function (ratings) {
					CRMControlParam.setDataZoom(ratings,
												{idName : 'num_id', labelName : 'nom_clas_clien'},
												parameter);
				}, true);

				break;

			case 'crm_erp_moed':
				currencyFactory.getAll(function (currencys) {
					CRMControlParam.setDataZoom(currencys,
												{idName : 'num_id', labelName : 'nom_moeda'},
												parameter);
				}, true);

				break;

			case 'crm_tip_clien':
				clientTypeFactory.getAll(undefined, function (clientTypes) {
					CRMControlParam.setDataZoom(clientTypes,
												{idName : 'num_id', labelName : 'nom_tip_clien'},
												parameter);
				}, true);

				break;

			case 'crm_grp_clien':
				clientGroupFactory.getAll(function (clientGroups) {
					CRMControlParam.setDataZoom(clientGroups,
												{idName : 'num_id', labelName : 'nom_grp_clien'},
												parameter);
				}, true);

				break;

			case 'crm_tip_docto':
				documentTypeFactory.getAll(function (clientGroups) {
					CRMControlParam.setDataZoom(clientGroups,
												{idName : 'num_id', labelName : 'nom_tip_docto'},
												parameter);
				}, true);

				break;

			case 'crm_usuar':
				userFactory.getAll(function (users) {
					CRMControlParam.setDataZoom(users,
												{idName : 'num_id', labelName : 'nom_usuar'},
												parameter);
				}, true);

				break;

			case 'crm_pais':
				countryFactory.getAll(function (countries) {
                    CRMControlParam.setDataZoom(countries,
												{idName : 'num_id', labelName : 'nom_pais'},
												parameter);
				}, true);
				break;

			case 'crm_public_layout':
				publicLayoutFactory.getAll(function (users) {
					CRMControlParam.setDataZoom(users,
												{idName : 'num_id', labelName : 'nom_layout'},
												parameter);
				}, true);
				break;

			case 'crm_tip_vinc':
				bondTypeFactory.getAll(function (result) {
					CRMControlParam.setDataZoom(result,
												{idName : 'num_id', labelName : 'nom_tip_vinc'},
												parameter);
				});
				break;

			case 'crm_template':
				templateFactory.getAll(undefined, function (result) {
					CRMControlParam.setDataZoom(result,
												{idName : 'num_id', labelName : 'nom_apel_template'},
												parameter);
				});
				break;

			case 'crm_classif_ocor':
				ticketRatingFactory.getAll(function (result) {
					CRMControlParam.setDataZoom(result,
												{idName : 'num_id', labelName : 'nom_classif_ocor'},
												parameter);
				});
				break;

			case 'crm_segmtcao_dados':
				dataSegmentationFactory.getAll(function (result) {
					CRMControlParam.setDataZoom(result,
												{idName : 'num_id', labelName : 'nom_grp_inform'},
												parameter);
				});
				break;

			case 'hier_time':
				hierarchyTeamFactory.getAll(undefined, undefined, function (result) {
					CRMControlParam.setDataZoom(result,
												{idName : 'num_id', labelName : 'nom_hier_time'},
												parameter);
				});
				break;
			}
		};

		this.getDataTypeHead = function (value, parameter) {

			if (!value || value === '') { return []; }

			if (parameter.nom_tab_referada.toLowerCase() === 'crm_pais') {

				var filter = [
					{ property: 'nom_pais', value: helper.parseStrictValue(value) }
				];

				countryFactory.typeahead(filter, undefined, function (result) {

					parameter.ttResultZoom = [];

					CRMControlParam.setDataZoom(result,
												{idName : 'num_id', labelName : 'nom_pais'},
												parameter);
				});
			}
		};

		this.setDataZoom = function (data, field, parameter) {
			var i;
			for (i = 0; i < data.length; i++) {
				parameter.ttResultZoom.push({
					num_id : data[i][field.idName],
					nom_valor :	data[i][field.labelName]
				});

				if (data[i].num_id === parseInt(parameter.dsl_param_crm, 10)) {
					parameter.value.num_id = data[i][field.idName];
					parameter.value.nom_valor =	data[i][field.labelName];
				}
			}
		};

		/**
		* Função de callback. Executada após a busca dos registros
		* @param  {Array} result Parâmetros do CRM
		* @return {}
		*/
		this.afterSearch = function (result) {

			var i,
				j,
				group = [],
				hasGroup,
				afterFillSelectOptionsData;

			CRMControlParam.paramCount = 0;

			afterFillSelectOptionsData = function (legendList) {
				result[i].selectList = legendList;
			};


			for (i = 0; i < result.length; i++) {

				if (result[i].idi_campo_compon === 3) {
					CRMControlParam.fillSelectOptionsData(result[i].des_legenda_param, afterFillSelectOptionsData);
				}


				hasGroup = false;
				for (j = 0; j < group.length; j++) {
					if (group[j].nom_grp_param === result[i].nom_grp_param) {
						group[j].itensLength = group[j].itensLength + 1;
						group[j].ttParameter.push({	dsl_descr_param			: result[i].dsl_descr_param,
													dsl_param_crm			: result[i].dsl_param_crm,
													dsl_param_crm_default	: result[i].dsl_param_crm_default,
													idi_campo_compon		: result[i].idi_campo_compon,
													isOpen					: false,
													nom_grp_param			: result[i].nom_grp_param,
													nom_tit_param			: result[i].nom_tit_param,
													nom_tab_referada		: result[i].nom_tab_referada,
													nom_param_crm			: result[i].nom_param_crm,
													des_legenda_param		: result[i].des_legenda_param,
													selectList				: result[i].selectList,
													num_id					: result[i].num_id
												   });
						hasGroup = true;
						break;
					}
				}
				if (hasGroup === false) {
					group.push({
						itensLength   : 1,
						nom_grp_param : result[i].nom_grp_param,
						ttParameter : [{ dsl_descr_param		: result[i].dsl_descr_param,
										 dsl_param_crm			: result[i].dsl_param_crm,
										 dsl_param_crm_default	: result[i].dsl_param_crm_default,
										 idi_campo_compon		: result[i].idi_campo_compon,
										 isOpen					: false,
										 nom_grp_param			: result[i].nom_grp_param,
										 nom_tit_param			: result[i].nom_tit_param,
										 nom_tab_referada		: result[i].nom_tab_referada,
										 nom_param_crm			: result[i].nom_param_crm,
										 des_legenda_param		: result[i].des_legenda_param,
										 selectList				: result[i].selectList,
										 num_id					: result[i].num_id
										}],
						isOpen : false
					});
				}
			}


			CRMControlParam.listOfParam = [];
			CRMControlParam.listOfParam = group;
			if (result && result.length) {
				CRMControlParam.paramCount = result.length;
			}
		};

		this.restoreDefault = function (parameter) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-to-restore',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-restore-preference', [
					parameter.nom_tit_param
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }
					paramFactory.restorePreference(parameter.nom_param_crm, function (result) {

						if (result && result.hasOwnProperty('$hasError') && result.$hasError === true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-parameter', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-restore-preference', [result.nom_tit_param], 'dts/crm')
						});

						parameter.dsl_param_crm = result.dsl_param_crm;
						CRMControlParam.getZoomData(parameter, true);

					});
				}
			});
		};

		this.onChangeParameter = function (parameter) {

			var i,
				param,
				isActive,
				changeValue,
				validateChangeValue;


			validateChangeValue = function (isPositiveResult, param) {
				if (!isPositiveResult) {
					parameter.dsl_param_crm = 'false';
					parameter.value = false;
					return;
				}

				var ttParameter = [],
					group = param === 'INTEGR_GP' ? 'Gestão de Planos' : 'Integração';

				CRMControlParam.updateParameter(parameter);

				for (i = 0; i < CRMControlParam.listOfParam.length; i++) {
					if (CRMControlParam.listOfParam[i].nom_grp_param === group) {
						ttParameter = CRMControlParam.listOfParam[i].ttParameter;
						break;
					}
				}

				if (ttParameter && ttParameter.length > 0) {
					for (i = 0; i < ttParameter.length; i++) {
						if (ttParameter[i].nom_param_crm === param) {
							ttParameter[i].dsl_param_crm = 'false';
							ttParameter[i].value = false;
							break;
						}
					}
				}

			};

			if (parameter.idi_campo_compon === 2) {
				if (parameter.value.num_id === parseInt(parameter.dsl_param_crm, 10)) {
					return;
				}
				changeValue = parameter.value.num_id;
			} else if (parameter.idi_campo_compon === 3) {
				if (parameter.value.value === parseInt(parameter.dsl_param_crm, 10)) {
					return;
				}
				changeValue = parameter.value.value;
			} else {
				if (parameter.value.toString() === parameter.dsl_param_crm) {
					return;
				}
				changeValue = parameter.value;
			}

			parameter.dsl_param_crm = changeValue;

			if (parameter.nom_param_crm === 'LOG_TAR_GRP_USUAR' && parameter.dsl_param_crm) {
				CRMControlParam.openWizard(parameter, 'activeUserGroupTask', function (result) {

					if (result && result === 'success') {
						CRMControlParam.updateParameter(parameter, function (result) {
							if (result) {
								param = CRMControlParam.getParameterInList('Tarefa', 'LOG_RESP_EXEC_TAR');
								param.dsl_param_crm = 'false';
							}
						});
					} else {
						parameter.dsl_param_crm = 'false';
						parameter.value = false;
					}

				});
			} else if (parameter.nom_param_crm === 'LOG_RESP_EXEC_TAR' && parameter.dsl_param_crm) {

				param = CRMControlParam.getParameterInList('Tarefa', 'LOG_TAR_GRP_USUAR');

				if (param.dsl_param_crm.trim().toLowerCase() === 'true') {
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: 'l-confirm-disable',
						cancelLabel: 'btn-cancel',
						confirmLabel: 'btn-confirm',
						text: $rootScope.i18n('msg-confirm-disable-user-group-task', [], 'dts/crm'),
						callback: function (isPositiveResult) {
							if (!isPositiveResult) {
								parameter.dsl_param_crm = 'false';
								parameter.value = false;
								return;
							}

							CRMControlParam.updateParameter(parameter, function (result) {
								if (result) { param.dsl_param_crm = 'false'; }
							});
						}
					});
				} else {
					CRMControlParam.updateParameter(parameter);
				}

			} else if (parameter.nom_param_crm === 'INTEGR_ERP_EMS' && parameter.value === true) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-disable',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-disable-gp', [], 'dts/crm'),
					callback: function (isPositiveResult) {
						validateChangeValue(isPositiveResult, 'INTEGR_GP');
					}
				});

			} else if (parameter.nom_param_crm === 'INTEGR_GP' && parameter.value === true) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-disable',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-disable-erp', [], 'dts/crm'),
					callback: function (isPositiveResult) {
						validateChangeValue(isPositiveResult, 'INTEGR_ERP_EMS');
					}
				});

			} else {
				CRMControlParam.updateParameter(parameter);
			}
		};

		this.getParameterInList = function (group, key) {
			var i,
				j,
				param,
				parameters;

			for (i = 0; i < CRMControlParam.listOfParam.length; i++) {

				if (CRMControlParam.listOfParam[i].nom_grp_param === group) {
					parameters = CRMControlParam.listOfParam[i];

					for (i = 0; i < parameters.ttParameter.length; i++) {
						if (parameters.ttParameter[i].nom_param_crm === key) {
							param = parameters.ttParameter[i];
							break;
						}
					}

					break;
				}
			}

			return param;

		};

		this.updateParameter = function (parameter, callback) {
			if (!parameter || !parameter.num_id) { return; }

			paramFactory.updateRecord(parameter.num_id, parameter, function (result) {
				if (!result) {
					if (callback) { callback(); } else { return; }
                }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-parameter', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-record-success-preference', [result.nom_tit_param], 'dts/crm')
				});

				parameter.dsl_param_crm = result.dsl_param_crm;
				CRMControlParam.getZoomData(parameter);
				if (callback) { callback(parameter); }
			});
		};

		this.openWizard = function (preference, wizardTo, callback) {
			modalWizard.open({
				preference: preference,
				wizardTo: wizardTo
			}).then(function (result) {
				if (callback) { callback(result); }
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		/**
		* Inicialização do controller. Executa as lógicas iniciais necessárias.
		* @return {}
		*/
		this.init = function init() {

			var viewName = $rootScope.i18n('nav-preference', [], 'dts/crm'),
				viewController = 'crm.preference.list.control';

			helper.startView(viewName, viewController, CRMControlParam);

			CRMControlParam.search(false);
		};

		if ($rootScope.currentuserLoaded) { CRMControlParam.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlParam.init();
		});

		$scope.$on('$destroy', function () {
			CRMControlParam = undefined;
		});
	};

	controllerPreferenceList.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.crm_param.factory', 'crm.filter.helper',
		'crm.crm_campanha.factory', 'crm.crm_clas.factory', 'crm.crm_erp_moed.factory', 'crm.crm_tip_clien.factory',
		'crm.crm_grp_clien.factory', 'crm.crm_tip_docto.factory', 'crm.crm_usuar.factory', 'crm.crm_pais.factory',
		'crm.crm_public_layout.factory', 'crm.crm_tip_vinc.factory', 'crm.crm_template.factory',
		'crm.crm_classificacao_ocor.factory', 'crm.crm_segmtcao_dados.factory', 'crm.crm_segmtcao_dados.factory',
		'hub.hier_time.factory', 'crm.helper', 'crm.wizard.modal'
	];


	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.preference.list.control', controllerPreferenceList);
});
