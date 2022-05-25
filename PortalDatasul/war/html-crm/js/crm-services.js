/*globals index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'totvs-html-framework',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var serviceFilterHelper, serviceHelper, serviceLegend;

	// ########################################################
	// ### Helper Services
	// ########################################################

	serviceFilterHelper = function ($rootScope, $totvsprofile, TOTVSEvent) {

		var service = {

			clearCache: function (group, dataCode) { // dataCode == undefined p/ limpar todos do pageId
				return $totvsprofile.remote.clearCache(group, dataCode);
			},

			remove: function (entityName, group, filter, callback) {

				if (!filter) { return; }

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
					cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
					confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
					text: $rootScope.i18n('msg-confirm-remove-filter', [], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							return $totvsprofile.remote.remove(group, filter.title, function (result) {
								service.clearCache(group, undefined);
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success',
									title: $rootScope.i18n(entityName, [], 'dts/crm'),
									detail: $rootScope.i18n('msg-remove-custom-filter', [], 'dts/crm')
								});

								if (callback) { callback(true); }
							});
						} else {
							if (callback) { callback(false); }
						}
					}
				});
			},

			save: function (entityName, group, filter, callback) {

				if (!filter) { return; }

				service.clearCache(group, undefined);
				return $totvsprofile.remote.set(group, filter, function () {

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n(entityName, [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-custom-filter', [], 'dts/crm')
					});

					if (callback) { callback(service.convertCustomFilterToDirective(filter)); }
				});

			},

			get : function (group, code, callback) {

				return $totvsprofile.remote.get(group, code, function (result) {

					var filters = [], i;

					if (result) {
						for (i = 0; i < result.length; i += 1) {
							filters.push(service.convertCustomFilterToDirective(result[i]));
						}
					}

					if (callback) { callback(filters); }
				});
			},

			parseToDisclaimers : function (value) {
				if (angular.isString(value)) {
					try {
						return angular.fromJson(value);
					} catch (e) {
						return undefined;
					}
				} else {
					return value;
				}
			},

			selectQuickFilter : function (filters, disclaimers, fixedDisclaimers, callback) {

				if (CRMUtil.isUndefined(filters)) { return; }

				if (CRMUtil.isUndefined(filters.property)) {
					/*
					Only use parseToDisclaimers when it not a disclaimer.
					The diference between thoses are the 'property' property.
					*/
					filters = service.parseToDisclaimers(filters.value);
				}

				if (!angular.isArray(filters)) {
					filters = [filters];
				}

				disclaimers = [];

				var i,
					j,
					newDisclaimers,
					hasFilterFixedProperty, //fixedDisclaimers is read only, do not TOUCH;
					fixedOriginal = angular.copy(fixedDisclaimers);

				for (j = 0; j < filters.length; j += 1) {

					hasFilterFixedProperty = false;

					for (i = 0; i < fixedDisclaimers.length; i += 1) {

						if (fixedDisclaimers[i].property === filters[j].property) {
							disclaimers.push(filters[j]);
							hasFilterFixedProperty = true;
							fixedDisclaimers[i].isAlreadyAdded = true;
							break;
						} else if (fixedDisclaimers[i].isAlreadyAdded !== true) {
							disclaimers.push(fixedDisclaimers[i]);
						}

					}

					if (!hasFilterFixedProperty) {
						disclaimers.push(filters[j]);
					}
				}

				newDisclaimers = { disclaimers : disclaimers, fixedDisclaimers: fixedOriginal};

				if (callback) { callback(newDisclaimers); }
			},

			convertToCustomFilter : function (filter) {
				if (!filter) { return; }
				return { dataCode: filter.title, dataValue: filter.value};
			},

			convertCustomFilterToDirective : function (filter) {
				if (!filter) { return; }
				return { title: filter.dataCode, value: filter.dataValue };
			},

			clearDisclaimersModel : function (disclaimers) {

				var disclaimer,
					modelValue,
					property,
					model,
					i;

				for (i = 0; i < disclaimers.length; i += 1) {

					disclaimer = disclaimers[i];

					if (angular.isDefined(disclaimer.model) && angular.isDefined(disclaimer.model.value)) {

						property = disclaimer.property;
						modelValue = disclaimer.model.value;

						if (disclaimer.model.property) {
							property = disclaimer.model.property;
						}

						if (property === 'num_id_campanha') {

							model = {
								num_id: modelValue.num_id,
								nom_campanha: modelValue.nom_campanha
							};

						} else if (property === 'num_id_acao') {

							model = {
								num_id: modelValue.num_id,
								nom_acao: modelValue.nom_acao
							};

						} else if (property === 'num_id_objet') {

							model = {
								num_id: modelValue.num_id,
								nom_objet_acao: modelValue.nom_objet_acao
							};

						} else if (property === 'num_id_mid') {

							model = {
								num_id: modelValue.num_id,
								nom_mid_relacto: modelValue.nom_mid_relacto
							};

						} else if (property === 'num_id_restdo') {

							model = {
								num_id: modelValue.num_id,
								nom_restdo: modelValue.nom_restdo
							};

						} else if (property === 'num_id_detmnto') {

							model = {
								num_id: modelValue.num_id,
								nom_detmnto_restdo: modelValue.nom_detmnto_restdo
							};

						} else if (property === 'num_id_pessoa'
								   || property === 'num_id_contat'
								   || property === 'num_id_pto_focal') {

							model = {
								num_id: modelValue.num_id,
								cod_pessoa_erp: modelValue.cod_pessoa_erp,
								nom_razao_social: modelValue.nom_razao_social,
								log_acesso: modelValue.log_acesso
							};

						} else if (property === 'num_id_usuar'
								   || property === 'num_id_recur'
								   || property === 'num_id_respons'
								   || property === 'num_id_usr_fechto'
								   || property === 'num_id_usuar_abert'
								   || property === 'num_id_usuar_respons'
								   || property === 'num_id_usuar_cadastro') {

							model = {
								num_id: modelValue.num_id,
								nom_usuar: modelValue.nom_usuar,
								num_id_recur: modelValue.num_id_recur
							};

						} else if (property === 'idi_sexo') {

							model = {
								num_id: modelValue.num_id,
								nom_sex: modelValue.nom_sex
							};

						} else if (property === 'num_id_tip_clien') {

							model = {
								num_id: modelValue.num_id,
								nom_tip_clien: modelValue.nom_tip_clien
							};

						} else if (property === 'num_id_repres') {

							model = {
								num_id: modelValue.num_id,
								nom_repres: modelValue.nom_repres,
								nom_abrev_repres_erp: modelValue.nom_abrev_repres_erp,
								cod_repres_erp: modelValue.cod_repres_erp,
								log_integrad_erp: modelValue.log_integrad_erp
							};

						} else if (property === 'num_id_fonte') {

							model = {
								num_id: modelValue.num_id,
								nom_fonte: modelValue.nom_fonte
							};

						} else if (property === 'num_id_uf') {

							model = {
								num_id: modelValue.num_id,
								nom_complet_uf: modelValue.nom_complet_uf,
								nom_unid_federac: modelValue.nom_unid_federac
							};

						} else if (property === 'num_id_cidad') {

							model = {
								num_id: modelValue.num_id,
								nom_cidade: modelValue.nom_cidade
							};

						} else if (property === 'num_id_regiao') {

							model = {
								num_id: modelValue.num_id,
								nom_regiao_atendim: modelValue.nom_regiao_atendim
							};

						} else if (property === 'num_id_classif') {

							model = {
								num_id: modelValue.num_id,
								nom_clas_clien: modelValue.nom_clas_clien
							};

						} else if (property === 'num_id_tip_ocor') {

							model = {
								num_id: modelValue.num_id,
								nom_tip_ocor: modelValue.nom_tip_ocor
							};

						} else if (property === 'num_id_priorid_ocor') {

							model = {
								num_id: modelValue.num_id,
								nom_priorid_ocor: modelValue.nom_priorid_ocor
							};

						} else if (property === 'num_id_orig') {

							model = {
								num_id: modelValue.num_id,
								nom_orig_ocor: modelValue.nom_orig_ocor
							};

						} else if (property === 'num_id_status_ocor') {

							model = {
								num_id: modelValue.num_id,
								nom_status_ocor: modelValue.nom_status_ocor
							};

						} else if (property === 'num_id_palavra_chave') {

							model = {
								num_id: modelValue.num_id,
								nom_palavra_chave: modelValue.nom_palavra_chave
							};

						} else if (property === 'num_id_prfv') {

							model = {
								num_id: modelValue.num_id,
								des_faixa_prfv: modelValue.des_faixa_prfv
							};

						} else if (property === 'num_id_acess_form_portal') {

							model = {
								num_id: modelValue.num_id,
								nom_form: modelValue.nom_form
							};

						} else if (property === 'num_id_grp_usuar') {

							model = {
								num_id: modelValue.num_id,
								nom_grp_usuar: modelValue.nom_grp_usuar
							};

						} else if (property === 'num_id_grp_usuar') {

							model = {
								num_id: modelValue.num_id,
								nom_grp_usuar: modelValue.nom_grp_usuar
							};

						} else if (property === 'num_id_estrateg_vda') {

							model = {
								num_id: modelValue.num_id,
								des_estrateg_vda: modelValue.des_estrateg_vda
							};

						} else if (property === 'num_id_probab') {

							model = {
								num_id: modelValue.num_id,
								des_probab_fechto: modelValue.des_probab_fechto
							};

						} else if (property === 'num_id_tab_preco') {

							model = {
								num_id: modelValue.num_id,
								nom_tab_preco: modelValue.nom_tab_preco
							};

						} else if (property === 'num_id_produt') {

							model = {
								num_id: modelValue.num_id,
								nom_produt: modelValue.nom_produt
							};

						}

						if (model) {
							disclaimer.model.value = angular.copy(model);
							model = undefined;
						}
					}
				}

				return disclaimers;
			}
		};

		return service;
	};

	serviceFilterHelper.$inject = [
		'$rootScope',
		'$totvsprofile',
		'TOTVSEvent'
	];

	serviceHelper = function ($rootScope, $filter, $timeout, TOTVSEvent, appViewService,
							   factoryUser, legend, userPreferenceHelper) {
		return {

			parseCRMModuleByID : function (id) {
				return (id > 0 ? { num_id: id, nom_modul_crm: legend.crmModules.NAME(id) } : undefined);
			},

			getCRMModules : function () {

				return [
					{ num_id: 1, nom_modul_crm: legend.crmModules.NAME(1) },
					{ num_id: 2, nom_modul_crm: legend.crmModules.NAME(2) },
					{ num_id: 3, nom_modul_crm: legend.crmModules.NAME(3) },
					{ num_id: 4, nom_modul_crm: legend.crmModules.NAME(4) },
					{ num_id: 5, nom_modul_crm: legend.crmModules.NAME(5) },
					{ num_id: 6, nom_modul_crm: legend.crmModules.NAME(6) },
					{ num_id: 7, nom_modul_crm: legend.crmModules.NAME(7) },
					{ num_id: 8, nom_modul_crm: legend.crmModules.NAME(8) }
				];

			},

			parseStrictValue: function (value) {

				if (!value) {
					return value;
				}

					if ($rootScope.currentuser.crm.general.isStrictSearch !== true) {
						return '*' + value + '*';
					} else {
						return value;
					}
			},

			loadCRMContext : function (callback) {
				$timeout(function () {

					$rootScope.currentuser = $rootScope.currentuser || {};

					userPreferenceHelper.isStrictSearch(function (result) {
						$rootScope.currentuser.crm = {
							general: {
								isStrictSearch: result
							}
						};
					});

					if ($rootScope.currentuser.idCRM > 0) {
						if (callback) {
							callback($rootScope.currentuser);
						}
					} else {
						factoryUser.getContext(function (result) {

							if (!result) { return; }

							angular.extend($rootScope.currentuser, result);

							$rootScope.currentuser.idCRM = result.idCRM;
							$rootScope.currentuser.idResource = result.idResource;

							if (callback) {
								callback($rootScope.currentuser);
							}
						});
					}
				});
			},

			startView : function (viewName, viewController, controller) {

				var i, openViews, view, isNewTab, isNewContext = true;

				$rootScope.pendingRequests += 1;

				isNewTab = appViewService.startView(viewName, viewController, controller);

				if (isNewTab === false) {

					openViews = appViewService.openViews || [];

					for (i = 0; i < openViews.length; i += 1) {

						view = openViews[i];

						if (view.name === viewName) {

							isNewTab = (view.hasOwnProperty('context') && view.context[viewController]);

							if (CRMUtil.isUndefined(isNewTab)) {
								isNewTab = true;
							}

							break;
						}
					}
				}

				$rootScope.pendingRequests -= 1;

				return {
					isNewTab: isNewTab,
					isNewContext: isNewContext
				};
			},

			parseDisclaimersToModel : function (disclaimers, callback) {

				var searchModel = {}, i, property, disclaimer;

				disclaimers = disclaimers || [];

				for (i = 0; i < disclaimers.length; i += 1) {

					disclaimer = disclaimers[i];

					if (CRMUtil.isDefined(disclaimer.model)) {

						property = disclaimer.property;

						if (CRMUtil.isDefined(disclaimer.model.property)) {
							property = disclaimer.model.property;
						}

						searchModel[property] = disclaimer.model.value;
					} else {
						searchModel[disclaimer.property] = disclaimer.value;
					}
				}

				if (callback) {
					callback(searchModel, disclaimers);
				}
			},

			parseDateRangeToDisclaimer : function (range, property, label, innerLabel) {

				var disclaimer, dateFormatter, dateFormat, startDateLabel = '';

				disclaimer = {
					property: property,
					title: $rootScope.i18n(label, [], 'dts/crm') + ' ',
					model: { property: property, value: range }
				};

				dateFormatter = $filter('date');
				dateFormat = $rootScope.i18n('l-date-format', [], 'dts/crm');

				if (CRMUtil.isDefined(range.start)) {
					startDateLabel = dateFormatter(range.start, dateFormat);
				}

				if (CRMUtil.isDefined(range.end)) {
					disclaimer.title += startDateLabel + ' ' + $rootScope.i18n('l-date-to', [], 'dts/crm') + ' ' + dateFormatter(range.end, dateFormat);
				} else {
					disclaimer.title += $rootScope.i18n((innerLabel || 'l-date-after'), [], 'dts/crm').toLowerCase() + ' ' + startDateLabel;
				}

				disclaimer.value = (range.start || '') + ';' + (range.end || '');

				return disclaimer;
			},

			// -1 less, 0 equals, 1 bigger
			equalsDate: function (date1, date2, onlyDate) {

				if (!date1 || !date2) {
					return undefined;
				}

				var dateCompare1, dateCompare2;

				dateCompare1 = angular.copy(date1);
				dateCompare2 = angular.copy(date2);

				if (onlyDate === true) {
					dateCompare1.setHours(0, 0, 0, 0);
					dateCompare2.setHours(0, 0, 0, 0);
				}

				if (dateCompare1 < dateCompare2) {
					return -1;
				} else if (dateCompare1 > dateCompare2) {
					return 1;
				} else {
					return 0;
				}
			},

			// 0 - período inicial está anterior ao momento de abertura do registro.
			// 1 - período inicial é superior ao período final.
			// 2 - período final é inferior ao período inicial.
			validateTimeRange : function (dateRange, timeRange, dateTimeBase) {

				var	today = new Date(),
					startDate,
					endDate,
					split;

				if (dateRange) {

					if (dateRange.start) {
						startDate = (angular.isDate(dateRange.start) ? dateRange.start : new Date(dateRange.start));
					} else if (dateRange.startDate) {
						startDate = (angular.isDate(dateRange.startDate) ? dateRange.startDate : new Date(dateRange.startDate));
					}

					if (dateRange.end) {
						endDate = (angular.isDate(dateRange.end) ? dateRange.end : new Date(dateRange.end));
					} else if (dateRange.endDate) {
						endDate = (angular.isDate(dateRange.endDate) ? dateRange.endDate : new Date(dateRange.endDate));
					}

				}

				if (timeRange) {

					if (angular.isString(timeRange.start)) {
						split = timeRange.start.split(':');
						startDate.setHours(split[0]);
						startDate.setMinutes(split[1]);
						startDate.setSeconds(0);
						startDate.setMilliseconds(0);
					} else {
						startDate.setHours(0, 0, 0, 0);
					}

					if (angular.isString(timeRange.end)) {
						split = timeRange.end.split(':');
						endDate.setHours(split[0]);
						endDate.setMinutes(split[1]);
						endDate.setSeconds(0);
						endDate.setMilliseconds(0);
					} else {
						endDate.setHours(0, 0, 0, 0);
					}
				}

				if (dateTimeBase) {

					dateTimeBase.setSeconds(0);
					dateTimeBase.setMilliseconds(0);

					if (this.equalsDate(startDate, today, true) < 1) {
						if (startDate < dateTimeBase) {
							return 0;
						}
					}
				}

				if (this.equalsDate(startDate, endDate, true) === 0) {
					if (startDate > endDate) {
						return 1;
					}
				}

				// Hora de término...
				if (this.equalsDate(endDate, startDate, true) === 0) { // equals
					if (endDate < startDate) {
						return 2;
					}
				}

				return -1;
			},

			showInvalidFormMessage : function (title, messages) {

				messages = messages || [];

				if (!angular.isArray(messages)) {
					messages = [messages];
				}

				var i,
					fields = '',
					isPlural,
					message;

				isPlural = messages.length > 1;
				message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i += 1) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n(title, [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			},

			replaceAll : function replaceAll(str, de, para) {
				var pos = str.indexOf(de);
				while (pos > -1) {
					str = str.replace(de, para);
					pos = str.indexOf(de);
				}
				return (str);
			},

			showInvalidFormMessageAtLeastOne : function (title, messages) {

				messages = messages || [];

				if (!angular.isArray(messages)) {
					messages = [messages];
				}

				var i,
					fields = '',
					isPlural,
					message;

				isPlural = messages.length > 1;
				message	 = 'msg-form-validation-at-least-one';

				for (i = 0; i < messages.length; i += 1) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n(title, [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			},

			validateUploadLimitFileSize : function validateUploadLimitFileSize(processName, fileName, fileSize, fileSizeLimit) {
				if (fileSizeLimit > 0 && fileSize / 1024 / 1024 > fileSizeLimit) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n(processName, [], 'dts/crm'),
						detail: $rootScope.i18n('msg-upload-limit-exceeded', [
							fileName,
							fileSizeLimit
						], 'dts/crm')
					});
					return false;
				}
				return true;
			},

			parseValuesToList : function (value, list) {
				var j, k, values = [], result = [];

				if (!value) { return []; }

				values = value.toString().split('|');

				for (k = 0; k < values.length; k++) {
					for (j = 0; j < list.length; j++) {
						if (list[j].value && list[j].value.toString() === values[k]) {
							result.push(list[j]);
						}
					}
				}

				return result;
			},

			parseListToValues : function (list) {
				var i, values;

				for (i = 0; i < list.length; i++) {
					if (!values) {
						values = list[i].value.toString();
					} else {
						values = values + '|' + list[i].value.toString();
					}
				}

				return values;
			},

			isPortalAccessContext : function (appRootContext) {
				return appRootContext === '/portal/menu/';
			}
		};
	};

	serviceHelper.$inject = [
		'$rootScope',
		'$filter',
		'$timeout',
		'TOTVSEvent',
		'totvs.app-main-view.Service',
		'crm.crm_usuar.factory',
		'crm.legend',
		'crm.user.preference.helper'
	];

	serviceLegend = function ($rootScope) {
		return {

			answerStatus: {
				/* 1 - Parcial, 2 - Pendente, 3 - Finalizado*/
				NAME: function (id) {
					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-anwser-parcial';
						break;
					case 2:
						sentence = 'l-anwser-pending';
						break;
					case 3:
						sentence = 'l-anwser-finished';
						break;
					default:
						sentence = '';
					}
					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			scriptTypes: {
				ID : {
					'ACCOUNT'       : 1,
					'CAMPAING'      : 2,
					'TASK'			: 3,
					'HISTORY'		: 4,
					'OPPORTUNITY'	: 5,
					'SUPPORT'		: 6,
					'GENERAL'       : 7
				},
				//1. Gestão de Contas | 2. Campanha | 3. Tarefa | 4. Histórico | 5. Oportunidade | 6. Suporte | 7. Geral
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-account';
						break;
					case 2:
						sentence = 'l-campaign';
						break;
					case 3:
						sentence = 'l-task';
						break;
					case 4:
						sentence = 'l-history';
						break;
					case 5:
						sentence = 'l-opportunity';
						break;
					case 6:
						sentence = 'l-ticket';
						break;
					case 7:
						sentence = 'l-general';
						break;
					default:
						sentence = '';
					}
					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			accountAccessLevel : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-access-level-full';
						break;
					case 2:
						sentence = 'l-access-level-limited';
						break;
					default:
						sentence = '';
					}
					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			userAccessLevel : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-access-general';
						break;
					case 2:
						sentence = 'l-access-limited';
						break;
					default:
						sentence = '';
					}
					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			campaignStatus : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-campaign-opening';
						break;
					case 2:
						sentence = 'l-campaign-expired';
						break;
					case 3:
						sentence = 'l-campaign-closed';
						break;
					default:
						sentence = '';
					}
					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			attachmentType : {
				ID : {
					'ACCOUNT'       : 1,
					'CAMPAING'      : 2,
					'EMAIL'			: 3,
					'TASK'			: 4,
					'ACTION_RECORD'	: 5,
					'OPPORTUNITY'	: 6,
					'SUPPORT'       : 7
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-account';
						break;
					case 2:
						sentence = 'l-campaign';
						break;
					case 3:
						sentence = 'l-email';
						break;
					case 4:
						sentence = 'l-task';
						break;
					case 5:
						sentence = 'l-history';
						break;
					case 6:
						sentence = 'l-opportunity';
						break;
					case 7:
						sentence = 'l-ticket';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			taskStatus : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-task-opening';
						break;
					case 2:
						sentence = 'l-task-suspended';
						break;
					case 3:
						sentence = 'l-task-executed';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				},
				DISPLAY : {
					1 : 'warning',
					2 : 'primary',
					3 : 'success'
				}
			},

			taskVirtualStatus : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-task-on-time';
						break;
					case 2:
						sentence = 'l-task-suspended';
						break;
					case 3:
						sentence = 'l-task-executed';
						break;
					case 4:
						sentence = 'l-task-future';
						break;
					case 5:
						sentence = 'l-task-late';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				},
				DISPLAY : {
					1 : 'warning',
					2 : 'primary',
					3 : 'success'
				}
			},

			accountType : {
				ID : {
					'LEAD'              : 1,
					'CLIENT'            : 2,
					'CONTACT'           : 3,
					'PROVIDER'          : 4,
					'CLIENT_PROVIDER'   : 5,
					'CLIENT_CONTACT'    : 6,
					'PROVIDER_CONTACT'  : 7,
					'CLIENT_PROVIDER_CONTACT' : 8
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-lead';
						break;
					case 2:
						sentence = 'l-client';
						break;
					case 3:
						sentence = 'l-contact';
						break;
					case 4:
						sentence = 'l-provider';
						break;
					case 5:
						sentence = 'l-client-provider';
						break;
					case 6:
						sentence = 'l-client-contact';
						break;
					case 7:
						sentence = 'l-provider-contact';
						break;
					case 8:
						sentence = 'l-client-provider-contact';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			personalType : {
				ID : {
					'person'     : 1,
					'corporate'	 : 2,
					'foreign'    : 3,
					'trading'    : 4
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-type-person-1';
						break;
					case 2:
						sentence = 'l-type-person-2';
						break;
					case 3:
						sentence = 'l-foreign';
						break;
					case 4:
						sentence = 'l-trading';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			addressType : {
				ID : {
					'MAILING'          : 1,
					'DELIVERY'         : 2,
					'BILLING'          : 3,
					'DELIVERY_DEFAULT' : 4,
					'WAREHOUSE'        : 5
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-type-address-mailing';
						break;
					case 2:
						sentence = 'l-type-address-delivery';
						break;
					case 3:
						sentence = 'l-type-address-billing';
						break;
					case 4:
						sentence = 'l-type-address-delivery-default';
						break;
					case 5:
						sentence = 'l-type-address-warehouse';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			costStatus : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-expected';
						break;
					case 2:
						sentence = 'l-realized';
						break;
					default:
						sentence = 'TESTE';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				},
				DISPLAY : {
					1 : 'primary',
					2 : 'success'
				}
			},

			accessLevel : {
				ID : {
					'GENERAL'  : 1,
					'SPECIFIC' : 2
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-general';
						break;
					case 2:
						sentence = 'l-specific';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			sex : {
				ID : {
					'MALE'   : 1,
					'FEMALE' : 2
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-male';
						break;
					case 2:
						sentence = 'l-female';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			accountText : {
				ID : {
					'INTERNAL'    : 1,
					'OTHERS'      : 2,
					'SUPPLIERS'   : 3,
					'DEFAULT'     : 4,
					'INTEGRATION' : 999
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-type-observation-internal';
						break;
					case 2:
						sentence = 'l-type-observation-other';
						break;
					case 3:
						sentence = 'l-type-observation-consultation-suppliers';
						break;
					case 4:
						sentence = 'l-type-observation-default';
						break;
					case 999:
						sentence = 'l-type-observation-integration';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			salesOrderSituation : {
				ID : {
					'open'       : 1,
					'partial'    : 2,
					'total'      : 3,
					'pending'    : 4,
					'suspended'  : 5,
					'canceled'   : 6
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-salesorder-open';
						break;
					case 2:
						sentence = 'l-salesorder-partial-attended';
						break;
					case 3:
						sentence = 'l-salesorder-total-attended';
						break;
					case 4:
						sentence = 'l-salesorder-pending';
						break;
					case 5:
						sentence = 'l-salesorder-suspended';
						break;
					case 6:
						sentence = 'l-salesorder-canceled';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			calculationFrequency : {
				ID : {
					'weekly'    : 1,
					'monthly'   : 2,
					'bimonthly' : 3,
					'quarterly' : 4,
					'biannual'  : 5,
					'yearly'    : 6
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-weekly';
						break;
					case 2:
						sentence = 'l-monthly';
						break;
					case 3:
						sentence = 'l-bimonthly';
						break;
					case 4:
						sentence = 'l-quarterly';
						break;
					case 5:
						sentence = 'l-biannual';
						break;
					case 6:
						sentence = 'l-yearly';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			subjectType : {
				ID : {
					'ERROR'            : 1,
					'DOUBT'            : 2,
					'COMPLIMENT'       : 3,
					'SUGGESTION'       : 4
				},
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-error';
						break;
					case 2:
						sentence = 'l-doubt';
						break;
					case 3:
						sentence = 'l-compliment';
						break;
					case 4:
						sentence = 'l-suggestion';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			crmModules : {
				ID : {
					'NONE'		: 1,
					'CAMPAING'      : 2,
					'ACCOUNT'       : 3,
					'OPPORTUNITY'	: 4,
					'PRODUCT'	: 5,
					'RELATIONSHIP'	: 6,
					'SUPPORT'       : 7,
					'GENERAL'       : 8
				},

				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-none';
						break;
					case 2:
						sentence = 'l-module-campaing';
						break;
					case 3:
						sentence = 'l-module-account';
						break;
					case 4:
						sentence = 'l-module-opportunity';
						break;
					case 5:
						sentence = 'l-module-product';
						break;
					case 6:
						sentence = 'l-module-relationship';
						break;
					case 7:
						sentence = 'l-module-support';
						break;
					case 8:
						sentence = 'l-module-general';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			reportParameterType : {

				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-string';
						break;
					case 2:
						sentence = 'l-numeric';
						break;
					case 3:
						sentence = 'l-zoom';
						break;
					case 4:
						sentence = 'l-time';
						break;
					case 5:
						sentence = 'l-date';
						break;
					case 6:
						sentence = 'l-select';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			campaignClassification : {

				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-campaign-comercial';
						break;
					case 2:
						sentence = 'l-campaign-marketing';
						break;
					case 3:
						sentence = 'l-campaign-relationship';
						break;
					case 4:
						sentence = 'l-campaign-other';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			campaignActionRelatedProcess : {

				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-campaign-action-none';
						break;
					case 2:
						sentence = 'l-campaign-action-trans-account';
						break;
					case 3:
						sentence = 'l-campaign-action-uni-account';
						break;
					case 4:
						sentence = 'l-campaign-action-qual-lead';
						break;
					case 5:
						sentence = 'l-campaign-action-change-task';
						break;
					case 6:
						sentence = 'l-campaign-action-trans-class';
						break;
					case 7:
						sentence = 'l-campaign-action-email';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			emailSource : {

				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-account';
						break;
					case 2:
						sentence = 'l-user-task-responsible';
						break;
					case 3:
						sentence = 'l-user-responsible';
						break;
					case 4:
						sentence = 'l-user-task-create';
						break;
					case 5:
						sentence = 'l-contact';
						break;
					case 6:
						sentence = 'l-user';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},

			classTransitionTrigger: {

				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-sales-order-registered';
						break;
					case 2:
						sentence = 'l-sales-order-billed';
						break;
					case 3:
						sentence = 'l-history-register';
						break;
					case 4:
						sentence = 'l-specific';
						break;
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');

				}
			},
            manifestationType : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-compliment';
						break;
					case 2:
						sentence = 'l-complaint';
						break;
					case 3:
						sentence = 'l-denunciation';
						break;
					case 4:
						sentence = 'l-suggestion';
						break;
                    case 5:
						sentence = 'l-doubt';
						break;
                    case 6:
						sentence = 'l-solicitation';
						break;
                    case 7:
						sentence = 'l-correction-reported';
						break;
                    case 8:
                        sentence = 'l-request-received-by-whatsApp';
                        break;

					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			},
            serviceCategory : {
				NAME : function (id) {

					var sentence = '';

					switch (id) {
					case 1:
						sentence = 'l-cooperated-doctors';
						break;
					case 2:
						sentence = 'l-hospitals-clinics-accredited';
						break;
					case 3:
						sentence = 'l-hospitals-clinics-unimed';
						break;
					case 4:
						sentence = 'l-operator-gp';
						break;
                    case 5:
						sentence = 'l-coverages';
						break;
                    case 6:
						sentence = 'l-grace';
						break;
                    case 7:
						sentence = 'l-invoice-payment-position';
						break;
                    case 8:
						sentence = 'l-registration-changes';
						break;
                    case 9:
                        sentence = 'l-stink';
                        break;
                    case 10:
						sentence = 'l-payment-position';
						break;
                    case 11:
						sentence = 'l-irpf';
						break;
                    case 12:
						sentence = 'l-partnerships-donations';
						break;
                    case 13:
						sentence = 'l-duplicate-invoice';
						break;
                    case 14:
						sentence = 'l-card-submission';
						break;
                    case 15:
						sentence = 'l-documents';
						break;
                    case 16:
						sentence = 'l-medical-guide';
						break;
                    case 17:
						sentence = 'l-authorization-request';
						break;
                    case 18:
						sentence = 'l-incorrect-phone';
						break;
                    case 19:
						sentence = 'l-incorrect-address';
						break;
                    case 20:
                        sentence = 'l-incorrect-specialty-service';
                        break;
                    case 21:
                        sentence = 'l-provider-does-not-meet-the-plan';
                        break;
                    case 22:
                        sentence = 'l-tabs-pending-out-of-response-time';
                        break;
                    case 23:
                        sentence = 'l-authorization-request';
                        break;
                    case 24:
                        sentence = 'l-usage-statement';
                        break;
                    case 25:
                        sentence = 'l-digital-card';
                        break;
                    case 26:
                        sentence = 'l-medical-guide';
                        break;
                    case 27:
                        sentence = 'l-income-tax-statements';
                        break;
                    case 28:
                        sentence = 'l-authorizations';
                        break;
                    case 29:
                        sentence = 'l-plan-information';
                        break;
                    case 30:
                        sentence = 'l-second-copy-of-boleto';
                        break;
                    case 31:
                        sentence = 'l-reimbursement';
                        break;
                    case 32:
                        sentence = 'l-closest-unimed';
                        break;
                    case 33:
                        sentence = 'l-consultation-and-co-participation-statement';
                        break;
                    case 34:
                        sentence = 'l-statement-of-use';
                        break;
                    case 35:
                        sentence = 'l-authorization-solicitation';
                        break;
                    case 36:
                        sentence = 'l-protocol-query';
                        break;
                    case 37:
                        sentence = 'l-2nd-copy-of-card';
                        break;
                    case 38:
                        sentence = 'l-registration-update';
                        break;
                    case 39:
                        sentence = 'l-debit-to-account';
                        break;
                    case 40:
                        sentence = 'l-bills-history';
                        break;
                    case 41:
                        sentence = 'l-cancellation';
                        break;
                    
					default:
						sentence = '';
					}

					return $rootScope.i18n(sentence, [], 'dts/crm');
				}
			}
		};
	};

	serviceLegend.$inject = [
		'$rootScope'
	];

	// ########################################################
	// ### Register
	// ########################################################

	// Helper Services
	index.register.service('crm.legend',        serviceLegend);
	index.register.service('crm.helper',        serviceHelper);
	index.register.service('crm.filter.helper',	serviceFilterHelper);

});
