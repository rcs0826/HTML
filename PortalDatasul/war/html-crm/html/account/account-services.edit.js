/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1008.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1010.js',
	'/dts/crm/js/api/fchcrm1011.js',
	'/dts/crm/js/api/fchcrm1012.js',
	'/dts/crm/js/api/fchcrm1013.js',
	'/dts/crm/js/api/fchcrm1014.js',
	'/dts/crm/js/api/fchcrm1015.js',
	'/dts/crm/js/api/fchcrm1016.js',
	'/dts/crm/js/api/fchcrm1017.js',
	'/dts/crm/js/api/fchcrm1018.js',
	'/dts/crm/js/api/fchcrm1023.js',
	'/dts/crm/js/api/fchcrm1024.js',
	'/dts/crm/js/api/fchcrm1025.js',
	'/dts/crm/js/api/fchcrm1026.js',
	'/dts/crm/js/api/fchcrm1027.js',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/js/api/fchcrm1038.js',
	'/dts/crm/js/api/fchcrm1039.js',
	'/dts/crm/js/api/fchcrm1040.js',
	'/dts/crm/js/api/fchcrm1041.js',
	'/dts/crm/js/api/fchcrm1042.js',
	'/dts/crm/js/api/fchcrm1043.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1049.js',
	'/dts/crm/js/api/fchcrm1059.js',
	'/dts/crm/js/api/fchcrm1063.js',
	'/dts/crm/js/api/fchcrm1064.js',
	'/dts/crm/js/api/fchcrm1065.js',
	'/dts/crm/js/api/fchcrm1066.js',
	'/dts/crm/js/api/fchcrm1067.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_repres.js',
	'/dts/crm/js/zoom/crm_regiao.js',
	'/dts/crm/js/zoom/crm_erp_portad.js',
	'/dts/crm/js/zoom/crm_transpdor.js',
	'/dts/crm/js/zoom/crm_erp_cond_pagto.js',
	'/dts/crm/js/zoom/crm_erp_natur_operac.js',
	'/dts/crm/html/prfv/prfv-services.list.js',
	'/dts/crm/html/prfv/prfv-services.summary.js',
	'/dts/crm/html/prfv/prfv-services.advanced-search.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/ticket/ticket-services.list.js',
	'/dts/crm/html/ticket/ticket-services.detail.js',
	'/dts/crm/html/ticket/ticket-services.edit.js',
	'/dts/crm/html/ticket/ticket-services.advanced-search.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/opportunity/opportunity-services.list.js',
	'/dts/crm/html/opportunity/opportunity-services.edit.js',
	'/dts/crm/html/opportunity/opportunity-services.detail.js',
	'/dts/crm/html/opportunity/opportunity-services.advanced-search.js',
	'/dts/crm/html/account/phone/phone-services.js',
	'/dts/crm/html/account/style/style-services.tab.js',
	'/dts/crm/html/account/style/style-services.selection.js',
	'/dts/crm/html/account/address/address-services.js',
	'/dts/crm/html/account/contact/contact-services.tab.js',
	'/dts/crm/html/account/contact/contact-services.edit.js',
	'/dts/crm/html/account/potential/potential-services.js',
	'/dts/crm/html/account/observation/observation-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/account/document/document-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalAccountEdit,
		controllerAccountEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalAccountEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			params = params || {};

			template = '/dts/crm/html/account/account.edit.html';

			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.account.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modalAccountEdit.$inject = ['$modal'];
	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************
	controllerAccountEdit = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters, legend,
									helper, accountHelper, preferenceFactory, accountFactory,
									clientTypeFactory, clientGroupFactory, sourceFactory,
									representativeFactory, timeFactory, carrierFactory,
									bearerFactory, paymentConditionFactory, phoneTypeFactory,
									bondTypeFactory, departmentFactory, modalAddressEdit,
									contactFactory, decisionLevelFactory, $location,
									userFactory, cfopFactory, helperAddress, documentFactory,
										educationalLevelFactory, treatmentFactory, activityLineFactory,
									maritalStatusFactory, regionFactory, customizationFactory, attributeFactory, attributeHelper, ratingFactory, accessRestrictionFactory
									) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountEdit = this;

		this.accessRestriction = undefined;
		this.accessRestrictionAddress = undefined;
		this.accessRestrictionContactEdit = undefined;

		this.model = undefined;
		this.defaults = undefined;
		this.related = undefined;

		this.editMode = false;
		this.isContact = false;
		this.isConvert = false;
		this.isToLoadComplementPF = false;
		this.isSourceMpd = false;

		this.clientGroups = [];
		this.clientTypes = [];
		this.sources = [];
		this.users = [];
		this.times = [];
		this.representatives = [];
		this.carriers = [];
		this.bearers = [];
		this.stateCfops = [];
		this.interstateCfops = [];
		this.paymentConditions = [];

		this.regions = [];
		this.activities = [];
		this.maritalStatus = [];
		this.educationalLevels = [];
		this.treatments = [];
		this.ratings = [];

		this.phoneTypes	= [];

		this.bondTypes = [];
		this.departments = [];
		this.decisionLevels	= [];

		this.customFields = [];
		this.contacts = [];

		this.isDisableRepresentative = false;

		this.personTypes = [
			{num_id: 1, nom_tipo: legend.personalType.NAME(1)},
			{num_id: 2, nom_tipo: legend.personalType.NAME(2)},
			{num_id: 3, nom_tipo: legend.personalType.NAME(3)},
			{num_id: 4, nom_tipo: legend.personalType.NAME(4)}
		];

		this.sexs = [
			{num_id: 1, nom_sex: $rootScope.i18n('l-male', [], 'dts/crm')},
			{num_id: 2, nom_sex: $rootScope.i18n('l-female', [], 'dts/crm')}
		];

		this.accesses = [
			{num_id: 1, nom_niv_aces: $rootScope.i18n('l-access-general', [], 'dts/crm')},
			{num_id: 2, nom_niv_aces: $rootScope.i18n('l-access-limited', [], 'dts/crm')}
		];

		this.addressTypes = helperAddress.types;

		this.isResponsibleEnabled  = undefined;
		this.isIntegratedWithGP    = undefined;
		this.isToValidateEMSOnConversion = false;

		this.group = {
			complement : { open : false },
			addresses : { open : false },
			contact : { open : false },
			phones : { open : false },
			obs : { open : false },
			custom: {open: true}
		};

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			var vo,
				title,
				detail,
				message;

			if (this.isInvalidForm()) {
				return;
			}

			vo = this.convertToSave();

			if (!vo) {
				return;
			}

			title = $rootScope.i18n(this.isContact ? 'l-contact' : (this.isAccount ? 'l-account' : 'l-lead'), [], 'dts/crm');

			message = this.editMode ? 'msg-update-account' : 'msg-save-account';

			if (this.isContact) {
				message = this.editMode ? 'msg-update-related-generic' : 'msg-save-related-generic';
			}
			if (this.isContact && CRMUtil.isUndefined(this.related)) {
				message = this.editMode ? 'msg-update-generic' : 'msg-save-generic';
			}
			if (this.isConvert) {
				vo.ttContaVO.log_convert = true;
			}

			if (this.editMode) {

				accountFactory.updateRecord(vo.ttContaVO.num_id, vo, function (result) {

					if (!result) {
						return;
					}

					//result.isToLoadHistory = CRMControlAccountEdit.isConvert;
					CRMControlAccountEdit.afterSave(result);

					detail = $rootScope.i18n(message, [
						title, result.nom_razao_social, (CRMControlAccountEdit.related ? CRMControlAccountEdit.related.nom_razao_social : undefined)
					], 'dts/crm');

					$rootScope.$broadcast(TOTVSEvent.showNotification, { type : 'success', title : title, detail : detail });
				});
			} else {

				accountFactory.saveRecord(vo, function (result) {

					if (!result) {
						return;
					}

					CRMControlAccountEdit.afterSave(result);

					detail = $rootScope.i18n(message, [
						title, result.nom_razao_social, (CRMControlAccountEdit.related ? CRMControlAccountEdit.related.nom_razao_social : undefined)
					], 'dts/crm');

					$rootScope.$broadcast(TOTVSEvent.showNotification, { type : 'success', title : title, detail : detail });
				});
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.getAccountEdit = function (act, callback) {
			var i,
				type,
				phones,
				phoneToAdd;

			if (!act || !act.num_id) {
				return;
			}

			type = 6; // edicao

			if (CRMControlAccountEdit.isConvert) {
				type = 5; // converter lead
			}

			accountFactory.getEdit(act.num_id, type, function (result) {

				if (result && result.length) {
					act = angular.copy(result[0]);
				}

				if (type === 5) {
					act.log_in_clien     = true;
					//act.idi_tip_cta_ant  = 1;
					act.idi_tip_cta      = 2;
				}

				// telefones
				if (act.ttTelefone) {
					phoneToAdd = {};
					phones     = [];

					for (i = 0; i < act.ttTelefone.length; i++) {

						phoneToAdd = {
							nom_telefone	: act.ttTelefone[i].nom_telefone,
							num_tip_telef	: act.ttTelefone[i].num_tip_telef,
							ttTipo			: {
								num_id : act.ttTelefone[i].num_tip_telef,
								nom_tip_telef : act.ttTelefone[i].nom_tip_telef
							}
						};

						accountHelper.parsePhoneIcon(phoneToAdd);
						phoneToAdd.num_id = act.ttTelefone[i].num_id;
						phones.push(phoneToAdd);
					}

					act.ttTelefone = angular.copy(phones);
				}
				//fim telefones

				//enderecos
				if (act.ttEndereco) {
					for (i = 0; i < act.ttEndereco.length; i++) {
						act.ttEndereco[i].ttTipo = CRMControlAccountEdit.addressTypes[act.ttEndereco[i].idi_tip_ender - 1];

						act.ttEndereco[i].ttCep  = {
							num_id  : act.ttEndereco[i].num_id_cep,
							cod_cep : act.ttEndereco[i].cod_cep,
							ttCidade: {
								nom_cidade: act.ttEndereco[i].nom_cidade
							}
						};

						act.ttEndereco[i].ttBairro = {
							num_id       : act.ttEndereco[i].num_id_bairro,
							nom_bairro   : act.ttEndereco[i].nom_bairro
						};

						act.ttEndereco[i].ttCidade = {
							num_id       : act.ttEndereco[i].num_id_cidad,
							nom_cidade   : act.ttEndereco[i].nom_cidade
						};

						act.ttEndereco[i].ttEstado = {
							num_id       : act.ttEndereco[i].num_id_uf,
							nom_complet_uf	 : act.ttEndereco[i].nom_complet_uf,
							nom_unid_federac : act.ttEndereco[i].nom_unid_federac
						};

						act.ttEndereco[i].ttPais = {
							num_id       : act.ttEndereco[i].num_id_pais,
							nom_pais     : act.ttEndereco[i].nom_pais
						};
					}
				}
				//fim enderecos

				if (callback) {
					callback(act);
				}

			});
		};

		this.validateParameterModel = function (callback) {

			var account = this.model || {};

			this.editMode = (account.num_id > 0);

			if (this.editMode === true) {

				CRMControlAccountEdit.getAccountEdit(account, function (result) {
					if (CRMUtil.isUndefined(result.idi_niv_aces) || result.idi_niv_aces <= 0) {
						result.idi_niv_aces = 1;
					}

					if (CRMControlAccountEdit.isContact === true && CRMControlAccountEdit.related) {

						if (account.num_id_tip_vinc > 0) {
							result.ttVinculo = {
								num_id : account.num_id_tip_vinc,
								nom_tip_vinc : account.nom_tip_vinc
							};
						}

						if (account.num_id_depto > 0) {
							result.ttDepartamento = {
								num_id : account.num_id_depto,
								nom_departamento : account.nom_departamento
							};
						}

						if (account.num_id_niv_decis > 0) {
							result.ttNivelDecisao = {
								num_id : account.num_id_niv_decis,
								nom_niv_decis : account.nom_niv_decis
							};
						}

						if (callback) {
							callback(result);
						}

					}					

					if (callback) {
						callback(result);
					}
				});

			} else {

				if (this.isContact === true) {
					account.idi_tip_cta = 3;
				} else {
					account.idi_tip_cta = this.isAccount ? 2 : 1;
				}

				account.idi_tip_pessoa = 1;
				account.idi_niv_aces   = 1;

				account.ttResponsavel = {
					num_id: $rootScope.currentuser.idCRM,
					nom_usuar: $rootScope.currentuser['user-desc']
				};

				if (callback) {
					callback(account);
				}
			}
		};

		this.isInvalidForm = function () {

			var i,
				hasPhone,
				hasEmail,
				hasAddress,
				hasAddressMailing,
				hasAddressBilling,
				hasAddressDeliveryDefault,
				addressMessagesAux,
				addressMessages = [],
				messages = [],
				isInvalidForm = false,
				j;

			if (!this.model.ttTipoConta) {
				isInvalidForm = true;
				messages.push('l-type-account');
			}

			if (!this.model.ttTipoPessoa) {
				isInvalidForm = true;
				messages.push('l-nature');
			}

			if (this.model.ttTipoCliente && this.model.ttTipoCliente.log_require_erp_field === true) {

				if ($('field[id="controller_model.nom_abrev"]').length > 0) {
					if (!this.model.nom_abrev || this.model.nom_abrev.trim().length === 0) {
						isInvalidForm = true;
						messages.push('l-nick-name');
					}
				}

				if ($('field[id="controller_model.ttgrupocliente"]').length > 0) {
					if (!this.model.ttGrupoCliente) {
						isInvalidForm = true;
						messages.push('l-group-client');
					}
				}

				if ($('field[id="controller_model.ttportador"]').length > 0) {
					if (!this.model.ttPortador) {
						isInvalidForm = true;
						messages.push('l-bearer');
					}
				}

				if ($('field[id="controller_model.ttrepresentante"]').length > 0) {
					if (!this.model.ttRepresentante) {
						isInvalidForm = true;
						messages.push('l-seller');
					}
				}

				if ($('field[id="controller_model.tttransportadora"]').length > 0) {
					if (!this.model.ttTransportadora) {
						isInvalidForm = true;
						messages.push('l-carrier');
					}
				}

				if ($('field[id="controller_model.ttcondicaopagamento"]').length > 0) {
					if (!this.model.ttCondicaoPagamento) {
						isInvalidForm = true;
						messages.push('l-payment-condition');
					}
				}

				if ($('#panel-address').length > 0) {
					if (this.model.ttEndereco && this.model.ttEndereco.length > 0) {

						for (i = 0; i < this.model.ttEndereco.length; i++) {

							if (this.model.ttEndereco[i].idi_tip_ender === 1) {
								hasAddressMailing = true;
							}

							if (this.model.ttEndereco[i].idi_tip_ender === 3) {
								hasAddressBilling = true;
							}

							if (this.model.ttEndereco[i].idi_tip_ender === 4) {
								hasAddressDeliveryDefault = true;
							}
						}

						if (hasAddressMailing !== true) {
							addressMessages.push(legend.addressType.NAME(1));
						}

						if (hasAddressBilling !== true) {
							addressMessages.push(legend.addressType.NAME(3));
						}

						if (hasAddressDeliveryDefault !== true) {
							addressMessages.push(legend.addressType.NAME(4));
						}

						if (addressMessages && addressMessages.length > 0) {

							isInvalidForm = true;

							addressMessagesAux = $rootScope.i18n('l-addresses', [], 'dts/crm') + ': ';

							for (i = 0; i < addressMessages.length; i++) {
								if (i === 0) {
									addressMessagesAux += addressMessages[i];
								} else {
									addressMessagesAux += ', ' + addressMessages[i];
								}
							}

							messages.push(addressMessagesAux);
						}

					} else {
						isInvalidForm = true;
						messages.push('l-address');
					}
				}
			}

			if (this.isContact === true && CRMUtil.isDefined(this.related)) {
				if (CRMUtil.isUndefined(this.model.ttContatoZoom)) {
					if (!this.model.nom_razao_social || this.model.nom_razao_social.trim().length === 0) {
						isInvalidForm = true;
						messages.push('l-name');
					}
				}

				if (!this.model.ttVinculo) {
					isInvalidForm = true;
					messages.push('l-bond');
				}
			} else {
				if (!this.model.nom_razao_social || this.model.nom_razao_social.trim().length === 0) {
					isInvalidForm = true;
					messages.push('l-name');
				}
			}

			if (!this.isContact) {
				attributeHelper.isInvalidForm(this.customFields, function (result) {
					for (j = 0; j < result.length; j++) {
						if (CRMUtil.isDefined(result[j])) {
							messages.push(result[j]);
							isInvalidForm = true;
						}
					}
				});
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage(this.isContact ? 'l-contact' : 'l-account', messages);
			}

			if (!isInvalidForm && CRMUtil.isUndefined(this.model.ttContatoZoom)) {

				hasPhone   = (this.model.ttTelefone && this.model.ttTelefone.length > 0);
				hasAddress = (this.model.ttEndereco && this.model.ttEndereco.length > 0);
				hasEmail   = (this.model.nom_email_1 || this.model.nom_email_2);

				if (hasEmail && hasEmail.trim().length > 0) {
					hasEmail = true;
				}

				if (hasPhone !== true && hasAddress !== true && hasEmail !== true) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n(this.isContact ? 'l-contact' : 'l-account', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-form-validate-account-form-contacts', [], 'dts/crm')
					});
					isInvalidForm = true;
				}
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var i,
				vo = { ttContaVO : {}, ttTelefoneVO : [], ttEnderecoVO : [], ttContatoVO : [], ttVinculoVO: {}, ttAtributoVO: [] };

			if (this.model.num_id && this.model.num_id > 0) {
				vo.ttContaVO.num_id = this.model.num_id;
			} else {
				vo.ttContaVO.num_id = 0;
			}


			if (this.model.ttTipoConta) {
				vo.ttContaVO.idi_tip_cta = this.model.ttTipoConta.num_id;
			}

			if (this.model.ttTipoPessoa) {
				vo.ttContaVO.idi_tip_pessoa = this.model.ttTipoPessoa.num_id;
			}

			if (this.isContact === true && CRMUtil.isDefined(this.related)) {

				vo.ttVinculoVO.log_update = this.editMode;

				if (this.model.ttVinculo) {
					vo.ttVinculoVO.num_id_tip_vinc = this.model.ttVinculo.num_id;
				}

				if (this.model.ttDepartamento) {
					vo.ttVinculoVO.num_id_depto = this.model.ttDepartamento.num_id;
				}

				if (this.model.ttNivelDecisao) {
					vo.ttVinculoVO.num_id_niv_decis = this.model.ttNivelDecisao.num_id;
				}

				vo.ttVinculoVO.num_id_pessoa = this.related.num_id;

				if (this.model.ttContatoZoom) {

					vo.ttVinculoVO.num_id_contat = this.model.ttContatoZoom.num_id;

					vo.ttContatoVO = {};
					vo.ttContaVO = {};
					vo.ttEnderecoVO = {};
					vo.ttTelefoneVO = {};
					return vo;
				}
			}

			vo.ttContaVO.idi_niv_aces = this.model.idi_niv_aces;
			vo.ttContaVO.nom_razao_social = this.model.nom_razao_social;
			vo.ttContaVO.nom_infml = this.model.nom_infml;
			vo.ttContaVO.nom_abrev = this.model.nom_abrev;

			vo.ttContaVO.nom_email_1 = this.model.nom_email_1;
			vo.ttContaVO.nom_email_2 = this.model.nom_email_2;
			vo.ttContaVO.nom_home_page = this.model.nom_home_page;

			vo.ttContaVO.dsl_texto = this.model.dsl_texto;
			vo.ttContaVO.log_integrad_outlook = this.model.log_integrad_outlook;

			if (this.model.ttResponsavel) {
				vo.ttContaVO.num_id_usuar_respons = this.model.ttResponsavel.num_id;
			}

			if (this.model.ttGrupoCliente) {
				vo.ttContaVO.num_id_grp_clien = this.model.ttGrupoCliente.num_id;
			}

			if (this.model.ttTipoCliente) {
				vo.ttContaVO.num_id_tip_clien = this.model.ttTipoCliente.num_id;
			}

			if (this.model.ttFonte) {
				vo.ttContaVO.num_id_fonte = this.model.ttFonte.num_id;
			}

			if (this.model.ttClassificacao) {
				vo.ttContaVO.num_id_classif = this.model.ttClassificacao.num_id;
			}

			if (this.model.ttRepresentante) {
				vo.ttContaVO.num_id_repres = this.model.ttRepresentante.num_id;
			}

			if (this.model.ttTransportadora) {
				vo.ttContaVO.num_id_transport = this.model.ttTransportadora.num_id;
			}

			if (this.model.ttPortador) {
				vo.ttContaVO.num_id_erp_portad = this.model.ttPortador.num_id;
			}

			if (this.model.ttcfopEstad) {
				vo.ttContaVO.num_id_erp_natur_operac_estad = this.model.ttcfopEstad.num_id;
			}

			if (this.model.ttcfopInterest) {
				vo.ttContaVO.num_id_erp_natur_operac_interest = this.model.ttcfopInterest.num_id;
			}

			if (this.model.ttCondicaoPagamento) {
				vo.ttContaVO.num_id_erp_cond_pagto = this.model.ttCondicaoPagamento.num_id;
			}

			if (this.model.ttHorario) {
				vo.ttContaVO.num_id_horar = this.model.ttHorario.num_id;
			}

			if (this.model.ttRegiao) {
				vo.ttContaVO.num_id_regiao = this.model.ttRegiao.num_id;
			}

			if (this.model.ttRamoAtividade) {
				vo.ttContaVO.num_id_ramo_ativid = this.model.ttRamoAtividade.num_id;
			}

			if (this.model.ttEstadoCivil) {
				vo.ttContaVO.num_id_estado_civil = this.model.ttEstadoCivil.num_id;
			}

			if (this.model.ttGrauInstrucao) {
				vo.ttContaVO.num_id_instruc = this.model.ttGrauInstrucao.num_id;
			}

			if (this.model.ttTratamento) {
				vo.ttContaVO.num_id_tratam = this.model.ttTratamento.num_id;
			}

			if (this.model.idi_tip_pessoa > 1) {
				vo.ttContaVO.nom_cnpj = this.model.nom_cnpj;
				vo.ttContaVO.nom_inscr_estad = this.model.nom_inscr_estad;
				vo.ttContaVO.nom_inscr_munic = this.model.nom_inscr_munic;
				vo.ttContaVO.log_estrang = this.model.log_estrang;
				vo.ttContaVO.log_concorrente = this.model.log_concorrente;
				vo.ttContaVO.log_trading = this.model.log_trading;
				vo.ttContaVO.log_reven = this.model.log_reven;
			} else {
				vo.ttContaVO.nom_cpf = this.model.nom_cpf;
				vo.ttContaVO.nom_reg_geral = this.model.nom_reg_geral;
				vo.ttContaVO.nom_orgao_emissor_identde = this.model.nom_orgao_emissor_identde;
				vo.ttContaVO.qti_depend = (this.model.qti_depend ? parseInt(this.model.qti_depend, 10) : 0);
				vo.ttContaVO.dat_nascimento = this.model.dat_nascimento;
				vo.ttContaVO.nom_mae_pessoa_fisic = this.model.nom_mae_pessoa_fisic;

				if (this.model.ttSexo) { vo.ttContaVO.idi_sexo = this.model.ttSexo.num_id; }
			}

			if (this.editMode === true) {
				if (this.model.ttEnderecoDelete) {
					for (i = 0; i < this.model.ttEnderecoDelete.length; i++) {
						vo.ttEnderecoVO.push(this.model.ttEnderecoDelete[i]);
					}
				}

				if (this.model.ttTelefoneDelete) {
					for (i = 0; i < this.model.ttTelefoneDelete.length; i++) {
						vo.ttTelefoneVO.push(this.model.ttTelefoneDelete[i]);
					}
				}
			}

			if (this.model.ttEndereco) {
				for (i = 0; i < this.model.ttEndereco.length; i++) {
					if (this.model.ttEndereco[i].vo) { // se nao tem vo, entao nao teve alteracao no endereco
						vo.ttEnderecoVO.push(this.model.ttEndereco[i].vo);
					}
				}
			}

			if (this.model.ttTelefone) {
				for (i = 0; i < this.model.ttTelefone.length; i++) {
					if (this.model.ttTelefone[i].vo) { // se nao tem vo, entao nao teve alteracao no endereco
						vo.ttTelefoneVO.push(this.model.ttTelefone[i].vo);
					}
				}
			}

			if (this.editMode !== true) {
				if (this.contact) {

					vo.ttContatoVO = {};
					vo.ttContatoVO.idi_tip_cta = 3;
					vo.ttContatoVO.nom_razao_social = this.contact.nom_razao_social;
					vo.ttContatoVO.nom_email_1 = this.contact.nom_email_1;

					if (this.contact.ttVinculo) {
						vo.ttVinculoVO.num_id_tip_vinc = this.contact.ttVinculo.num_id;
					}

					if (this.contact.ttDepartamento) {
						vo.ttVinculoVO.num_id_depto = this.contact.ttDepartamento.num_id;
					}

					if (this.contact.ttNivelDecisao) {
						vo.ttVinculoVO.num_id_niv_decis = this.contact.ttNivelDecisao.num_id;
					}

					if (this.contact.log_integrad_outlook) {
						vo.ttContatoVO.log_integrad_outlook = this.contact.log_integrad_outlook;
					}

					if (this.contact.phone) {

						if (this.contact.phone.ttTipo) {
							vo.ttContatoVO.num_tip_telef = this.contact.phone.ttTipo.num_id;
						}

						vo.ttContatoVO.nom_telefone = this.contact.phone.nom_telefone;
					}
				}
			}

			if (this.model.ttNivelAcesso) {
				vo.ttContaVO.idi_niv_aces = this.model.ttNivelAcesso.num_id;
			}

			if (vo.ttContaVO.idi_tip_cta !== 3) {
				attributeHelper.convertToSave(this.customFields, vo.ttContaVO.num_id, 1, /* Conta*/ function (result) {
					vo.ttAtributoVO = result;
				});
			}

			if (this.model.nom_categ_clien) {
				vo.ttContaVO.nom_categ_clien = this.model.nom_categ_clien;
			}

			return vo;
		};

		this.afterSave = function (account) {
			var integratedWith = CRMControlAccountEdit.isIntegratedWithGP === true ? 'GP' : 'ERP';

			accountHelper.parseSex(account);
			accountHelper.parsePersonType(account);
			accountHelper.parseAccountType(account);
			accountHelper.parseAccessLevel(account);
			accountHelper.parseStatus(account, integratedWith);

			if (this.editMode) {
				$rootScope.$broadcast(CRMEvent.scopeSaveAccount, account);
			}

			$modalInstance.close(account);

			if ((CRMControlAccountEdit.isContact === false && CRMUtil.isUndefined(CRMControlAccountEdit.related)) && (!CRMControlAccountEdit.isSourceMpd)) {
				$location.path('/dts/crm/account/detail/' + account.num_id);
			}
		};

		// *********************************************************************************

		this.loadPreferences = function (callback) {

			var total,
				count,
				account = this.model;

			count = 0;
			total = this.editMode ? 2 : 1;

			if (this.isAccount === true) {
				total++;
			}

			accountFactory.isResponsibleEnabled(function (result) {
				CRMControlAccountEdit.isResponsibleEnabled = result;
				if (++count === total && callback) {
					callback();
				}
			});

			if (this.editMode) {
				preferenceFactory.isIntegratedWithGP(function (result) {
					CRMControlAccountEdit.isIntegratedWithGP = result;
					if (++count === total && callback) {
						callback();
					}
				});
			}

			if (this.isAccount === true) {
				accountFactory.isToValidateEMSOnConversion(function (result) {
					CRMControlAccountEdit.isToValidateEMSOnConversion = result;
					if (++count === total && callback) {
						callback();
					}
				});
			}
		};

		this.loadDefaults = function () {

			this.getClientGroups();
			this.getClientTypes();
			this.getSources();

			if (this.isSourceMpd === true && this.isConvert == false) {
				this.getRepresentativeByUserProfile();
			}

			if (this.isContact === true && this.related) {
				this.getBondTypes();
				this.getDepartaments();
				this.getDecisionLevels();
			}
			this.getRatings();
		};

		this.checkDuplicated = function (type) {

			var value = type === 1 ? this.model.nom_cnpj : this.model.nom_cpf,
				registry = this.model.num_id;

			if (!value || value.trim().length === 0) {
				return;
			}

			accountFactory.checkDuplicated(type, value, registry, function (result) {
				if (result === true) {
					$rootScope.$broadcast(TOTVSEvent.showMessage, {
						title: $rootScope.i18n('l-attention', [], 'dts/crm'),
						text: $rootScope.i18n('msg-duplicate-item', [
							$rootScope.i18n(type === 1 ? 'l-cnpj' : 'l-cpf', [], 'dts/crm'), value
						], 'dts/crm')
					});
				}
			});
		};

		// *********************************************************************************

		this.getClientGroups = function () {
			clientGroupFactory.getAll(function (result) {
				CRMControlAccountEdit.clientGroups = result;
			});
		};

		this.getClientTypes = function () {

			var type = this.model.ttTipoConta ? this.model.ttTipoConta.num_id : this.model.idi_tip_cta;

			clientTypeFactory.getAll(type, function (result) {
				CRMControlAccountEdit.clientTypes = result;
			});
		};

		this.getSources = function () {
			sourceFactory.getAll(function (result) {
				CRMControlAccountEdit.sources = result;
			});
		};

		this.getRepresentatives = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_repres', value: helper.parseStrictValue(value) };

			representativeFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountEdit.representatives = result;
			});
		};

		this.getTimes = function () {
			timeFactory.getAll(function (result) {
				CRMControlAccountEdit.times = result;
			});
		};

		this.getRepresentativeByUserProfile = function () {
			representativeFactory.getRepresentativeByUserProfile(function (result) {
				CRMControlAccountEdit.representatives = result || [];
				CRMControlAccountEdit.model.ttRepresentante = CRMControlAccountEdit.representatives[0];
				CRMControlAccountEdit.isDisableRepresentative = true;
			});
		};

		this.getCarriers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_transpdor', value: helper.parseStrictValue(value) };

			carrierFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountEdit.carriers = result;
			});
		};

		this.getBearers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_portador', value: helper.parseStrictValue(value) };

			bearerFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountEdit.bearers = result;
			});
		};

		this.getCfops = function (value, type) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_natur_operac', value: helper.parseStrictValue(value) };

			cfopFactory.typeahead(filter, undefined, function (result) {
				if (type === 'interstate') {
					CRMControlAccountEdit.interstateCfops = result;
				} else {
					CRMControlAccountEdit.stateCfops = result;
				}
			});
		};

		this.getPaymentConditions = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_cond_pagto', value: helper.parseStrictValue(value) };

			paymentConditionFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountEdit.paymentConditions = result;
			});
		};

		this.getPhoneTypes = function () {
			phoneTypeFactory.getAll(true, function (result) {
				CRMControlAccountEdit.phoneTypes = result;
			});
		};

		this.getBondTypes = function () {
			var active = true;

			if (this.editMode === true && this.isContact === true) {
				bondTypeFactory.getAll(function (result) {
					CRMControlAccountEdit.bondTypes = result;
				});
			} else {
				bondTypeFactory.getBondTypes(active, function (result) {
					CRMControlAccountEdit.bondTypes = result;

					// Carrega o Vinculo padrão cadastrado no parâmetros do CRM
					for (var i = 0; i < result.length; i++) {
						if (result[i].log_type_vinc_deft === true){
							CRMControlAccountEdit.model.ttVinculo = {
								num_id : result[i].num_id,
								nom_tip_vinc : result[i].nom_tip_vinc
							};
						}
					}
				});				
			}
		};

		this.getDepartaments = function () {
			departmentFactory.getAll(true, function (result) {
				CRMControlAccountEdit.departments = result;
			});
		};

		this.getDecisionLevels = function () {
			decisionLevelFactory.getAll(function (result) {
				CRMControlAccountEdit.decisionLevels = result;
			});
		};

		this.getUsers = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };

			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountEdit.users = result;
			});
		};

		this.getContacts = function (value) {

			CRMControlAccountEdit.contacts = [];

			if (!value || value === '') {
				return [];
			}

			var name = helper.parseStrictValue(value),
				filter = [{property: 'nom_razao_social', value: name}];

			return contactFactory.typeahead(filter, {entity: 3}, function (result) {
				CRMControlAccountEdit.contacts = result;
			});

		};

		this.getRegions = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_regiao_atendim',  value: helper.parseStrictValue(value) };

			regionFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountEdit.regions = result;
			});
		};

		this.getActivities = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_ramo_ativid',  value: helper.parseStrictValue(value) };

			activityLineFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountEdit.activities = result;
			});
		};

		this.getTreatments = function () {
			treatmentFactory.getAll(function (result) {
				CRMControlAccountEdit.treatments = result;
			}, true);
		};

		this.getRatings = function () {
			ratingFactory.getAll(function (result) {
				CRMControlAccountEdit.ratings = result;
			}, true);
		};

		this.getEducationalLevels = function () {
			educationalLevelFactory.getAll(function (result) {
				CRMControlAccountEdit.educationalLevels = result;
			}, true);
		};

		this.getMaritalStatus = function () {
			maritalStatusFactory.getAll(function (result) {
				CRMControlAccountEdit.maritalStatus = result;
			}, true);
		};

		this.getCustomFields = function (accountId) {
			attributeFactory.getCustomFields(1, accountId, function (result) {
				angular.forEach(result, function (data) {
					attributeHelper.parseAttribute(data, CRMControlAccountEdit.editMode);
					attributeHelper.parseAttributeType(data);
					data.dsl_atrib_json = JSON.parse(data.dsl_atrib_json);

					CRMControlAccountEdit.customFields.push(data);
				});
				attributeHelper.isClearfixNeeded(result, false);
			});
		};

		// *********************************************************************************

		this.onChangeAccountType = function () {

			if (this.model.ttTipoConta) {
				this.model.idi_tip_cta = this.model.ttTipoConta.num_id;
			} else {
				this.model.idi_tip_cta = undefined;
			}

			this.model.ttTipoCliente = undefined;

			this.getClientTypes();
		};

		this.onChangePersonType = function () {

			if (this.model.ttTipoPessoa) {
				this.model.idi_tip_pessoa = this.model.ttTipoPessoa.num_id;
			} else {
				this.model.idi_tip_pessoa = undefined;
			}

			if (this.model.idi_tip_pessoa > 1) {
				this.model.nom_cpf = undefined;
				this.model.ttSexo = undefined;
			} else {
				this.contact = undefined;

				this.model.nom_cnpj = undefined;
				this.model.nom_inscr_estad = undefined;
				this.model.nom_inscr_munic = undefined;
				this.model.ttHorario = undefined;

				if (CRMControlAccountEdit.isToLoadComplementPF === false) {
					CRMControlAccountEdit.getTreatments();
					CRMControlAccountEdit.getEducationalLevels();
					CRMControlAccountEdit.getMaritalStatus();
				}
			}
		};

		this.onChangeClientGroup = function () {

			if (!this.model.ttGrupoCliente) {
				return;
			}

			var id = this.model.ttGrupoCliente.num_id,
				positiveResultCallback,
				idi_niv_aces;

			positiveResultCallback = function (isPositiveResult) {

				if (isPositiveResult !== true) {
					return;
				}

				CRMControlAccountEdit.model.ttPortador			= undefined;
				CRMControlAccountEdit.model.ttTransportadora	= undefined;
				CRMControlAccountEdit.model.ttCondicaoPagamento = undefined;

				if (CRMControlAccountEdit.isDisableRepresentative === false && !CRMControlAccountEdit.isSourceMPD) {
					CRMControlAccountEdit.model.ttRepresentante		= undefined;
				}

				clientGroupFactory.getRecord(id, function (result) {

					if (!result) {
						return;
					}

					CRMControlAccountEdit.model.ttPortador = result.ttPortador;
					CRMControlAccountEdit.model.ttTransportadora = result.ttTransportadora;
					CRMControlAccountEdit.model.ttCondicaoPagamento	= result.ttCondicaoPagamento;

					if (CRMControlAccountEdit.isDisableRepresentative === false && !CRMControlAccountEdit.isSourceMPD) {
						CRMControlAccountEdit.model.ttRepresentante	= result.ttRepresentante;
					}

					idi_niv_aces = result.num_livre_1 > 0 ? result.num_livre_1 : 1;
					CRMControlAccountEdit.model.idi_niv_aces = idi_niv_aces;
					CRMControlAccountEdit.model.ttNivelAcesso.num_id = idi_niv_aces;
					CRMControlAccountEdit.model.ttNivelAcesso.nom_niv_aces = legend.accountAccessLevel.NAME(idi_niv_aces);

				});
			};

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-client-group-load-information', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-client-group-load-information', [], 'dts/crm'),
				callback: positiveResultCallback
			});
		};

		this.onOpenComplementPanel = function () {

			if (CRMControlAccountEdit.isAccount) {
				CRMControlAccountEdit.getTimes();
			}

			if (CRMControlAccountEdit.isToLoadComplementPF === false) {
				if (CRMControlAccountEdit.model.ttTipoPessoa && CRMControlAccountEdit.model.ttTipoPessoa.num_id === 1) {
					CRMControlAccountEdit.getTreatments();
					CRMControlAccountEdit.getEducationalLevels();
					CRMControlAccountEdit.getMaritalStatus();
				}
			}
		};

		this.onOpenPhonePanel = function () {
			this.getPhoneTypes();
		};

		this.onOpenContactPanel = function () {
			if (CRMControlAccountEdit.bondTypes.length > 0
					|| CRMControlAccountEdit.phoneTypes > 0
					|| CRMControlAccountEdit.departments > 0
					|| CRMControlAccountEdit.decisionLevels > 0) {
				return;
			}

			this.getBondTypes();
			this.getPhoneTypes();
			this.getDepartaments();
			this.getDecisionLevels();
		};

		this.onChangeName = function () {
			if (CRMUtil.isDefined(this.model.nom_razao_social) && this.model.nom_razao_social.trim().length > 0) {
				this.model.ttContatoZoom = undefined;
			}
		};

		this.onZoomSelectContact = function (selected, oldValue) {
			if (selected && CRMUtil.isDefined(selected.nom_razao_social)) {
				CRMControlAccountEdit.model.nom_razao_social = undefined;
				CRMControlAccountEdit.model.ttContatoZoom = selected;
			}
		};

		this.onChangeClientType = function () {

			var type = this.model.ttTipoCliente;

			if (!type) { return; }

			if (type && type.log_integrad_erp === true) {
				type.log_require_erp_field = CRMControlAccountEdit.isToValidateEMSOnConversion;
			} else {
				type.log_require_erp_field = false;
			}
		};

		// *********************************************************************************

		this.addPhone = function () {

			var i,
				phoneToAdd,
				isDuplicate;

			if (!this.phone) {
				return;
			}

			if (!this.phone.ttTipo) {
				helper.showInvalidFormMessage('l-phones', 'l-phone');
				return;
			}

			if (!this.phone.nom_telefone || this.phone.nom_telefone.trim().length === 0) {
				helper.showInvalidFormMessage('l-phones', 'l-phone');
				return;
			}

			this.model.ttTelefone = this.model.ttTelefone || [];

			isDuplicate = false;

			for (i = 0; i < this.model.ttTelefone.length; i++) {
				if (this.model.ttTelefone[i].nom_telefone === this.phone.nom_telefone && this.model.ttTelefone[i].num_tip_telef === this.phone.ttTipo.num_id) {
					isDuplicate = true;
					break;
				}
			}

			if (isDuplicate !== true) {

				if (!this.phone.type_oper) {
					this.phone.type_oper = 'CREATE';
				}

				if (!this.phone.num_id) {
					this.phone.num_id = 0;
				}

				phoneToAdd = {
					nom_telefone	: this.phone.nom_telefone,
					num_tip_telef	: this.phone.ttTipo.num_id,
					ttTipo			: this.phone.ttTipo,
					index           : this.phone.index
				};

				accountHelper.parsePhoneIcon(phoneToAdd);

				phoneToAdd.vo = {
					nom_telefone	: this.phone.nom_telefone,
					num_tip_telef	: this.phone.ttTipo.num_id,
					type_oper       : this.phone.type_oper,
					num_id          : this.phone.num_id
				};

				if (phoneToAdd.vo.type_oper === 'UPDATE') {
					if (this.model.ttTelefone[phoneToAdd.index]) {
						this.model.ttTelefone[phoneToAdd.index] = phoneToAdd;
					}
				} else {
					this.model.ttTelefone.push(phoneToAdd);
				}

				this.phone = undefined;

			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-phones', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-duplicate-phone', [
						this.phone.nom_telefone + ' (' + this.phone.ttTipo.nom_tip_telef + ')'
					], 'dts/crm')
				});
			}
		};

		this.removePhone = function ($index) {
			if ($index >= 0) {
				if (CRMControlAccountEdit.model.ttTelefone[$index].num_id && CRMControlAccountEdit.model.ttTelefone[$index].num_id > 0) {

					var vo = {
						nom_telefone	: CRMControlAccountEdit.model.ttTelefone[$index].nom_telefone,
						num_tip_telef	: CRMControlAccountEdit.model.ttTelefone[$index].ttTipo.num_id,
						type_oper       : 'DELETE',
						num_id          : CRMControlAccountEdit.model.ttTelefone[$index].num_id
					};

					if (!CRMControlAccountEdit.model.ttTelefoneDelete) {
						CRMControlAccountEdit.model.ttTelefoneDelete = [];
					}

					CRMControlAccountEdit.model.ttTelefoneDelete.push(vo);
				}

				CRMControlAccountEdit.model.ttTelefone.splice($index, 1);
			}
		};

		this.editPhone = function ($index) {
			var phone;

			if ($index >= 0) {
				phone = CRMControlAccountEdit.model.ttTelefone[$index];

				CRMControlAccountEdit.phone = {
					nom_telefone : phone.nom_telefone,
					num_id : phone.num_id,
					type_oper : 'UPDATE',
					ttTipo : phone.ttTipo,
					index  : $index
				};
			}
		};

		this.cancelEdit = function () {
			CRMControlAccountEdit.phone = undefined;
		};

		// *********************************************************************************

		this.addAddress = function () {
			CRMControlAccountEdit.model.ttEndereco = CRMControlAccountEdit.model.ttEndereco || [];

			var address = angular.copy(CRMControlAccountEdit.model.ttEndereco),
				i,
				j,
				addressVO;

			if (address && address.cod_cep) {
				address.cod_cep = address.cod_cep.replace(/d+/, '');
			}

			modalAddressEdit.open({
				typesToRemove: CRMControlAccountEdit.model.ttEndereco,
				accountType: CRMControlAccountEdit.model.idi_tip_pessoa
			}).then(function (result) {
				if (!result) {
					return;
				}

				for (i = 0; i < result.length; i++) {

					if (result[i].idi_tip_ender.length > 1) {
						for (j = 0; j < result[i].idi_tip_ender.length; j++) {
							addressVO = angular.copy(result[i]);

							addressVO.idi_tip_ender = result[i].idi_tip_ender[j];
							helperAddress.parseType(addressVO);

							if (result[i].vo) {
								addressVO.vo.idi_tip_ender = result[i].idi_tip_ender[j];
							}

							CRMControlAccountEdit.model.ttEndereco.push(addressVO);
						}

					} else {
						addressVO = angular.copy(result[i]);

						addressVO.idi_tip_ender = result[i].idi_tip_ender[0];
						helperAddress.parseType(addressVO);


						if (result[i].vo) {
							addressVO.vo.idi_tip_ender = result[i].idi_tip_ender[0];
						}

						CRMControlAccountEdit.model.ttEndereco.push(addressVO);
					}
				}
			});
		};

		this.removeAddress = function ($index) {
			if ($index >= 0) {
				if (CRMControlAccountEdit.model.ttEndereco[$index].num_id && CRMControlAccountEdit.model.ttEndereco[$index].num_id > 0) {

					var vo = {
						type_oper       : 'DELETE',
						num_id_pessoa	: CRMControlAccountEdit.model.num_id,
						num_id          : CRMControlAccountEdit.model.ttEndereco[$index].num_id
						/*
						nom_lograd_ender: CRMControlAccountEdit.model.ttEndereco[$index].nom_lograd_ender,
						nom_compl_ender : CRMControlAccountEdit.model.ttEndereco[$index].nom_compl_ender,
						num_lograd_ender: CRMControlAccountEdit.model.ttEndereco[$index].num_lograd_ender,
						idi_tip_ender   : CRMControlAccountEdit.model.ttEndereco[$index].idi_tip_ender,
						num_id_cep      : CRMControlAccountEdit.model.ttEndereco[$index].num_id_cep,
						cod_cep         : CRMControlAccountEdit.model.ttEndereco[$index].cod_cep,
						num_id_bairro   : CRMControlAccountEdit.model.ttEndereco[$index].num_id_bairro,
						num_id_cidad    : CRMControlAccountEdit.model.ttEndereco[$index].num_id_cidad,
						num_id_uf       : CRMControlAccountEdit.model.ttEndereco[$index].num_id_uf,
						num_id_pais     : CRMControlAccountEdit.model.ttEndereco[$index].num_id_pais */
					};

					if (!CRMControlAccountEdit.model.ttEnderecoDelete) {
						CRMControlAccountEdit.model.ttEnderecoDelete = [];
					}

					CRMControlAccountEdit.model.ttEnderecoDelete.push(vo);
				}

				CRMControlAccountEdit.model.ttEndereco.splice($index, 1);
			}
		};

		this.editAddress = function ($index) {
			var addressVO;

			if ($index >= 0) {
				modalAddressEdit.open({
					address: CRMControlAccountEdit.model.ttEndereco[$index],
					account: CRMControlAccountEdit.model,
					typesToRemove: CRMControlAccountEdit.model.ttEndereco,
					isPersist: false, /* n persiste na base, faz somente junto com a conta */
					accountType: CRMControlAccountEdit.model.idi_tip_pessoa
				}).then(function (result) {
					if (!result || result.length === 0) {
						return;
					}

					addressVO = angular.copy(result[0]);
					addressVO.idi_tip_ender = result[0].idi_tip_ender[0];
					helperAddress.parseType(addressVO);

					if (result[0].vo) {
						addressVO.vo.idi_tip_ender = result[0].idi_tip_ender[0];
					}

					addressVO.num_id = CRMControlAccountEdit.model.ttEndereco[$index].num_id;
					CRMControlAccountEdit.model.ttEndereco[$index] = addressVO;
				});
			}
		};

		this.init = function () {
			helper.loadCRMContext(function () {
				var param = 'account.edit.account';

				if (CRMControlAccountEdit.isAccount !== true) { // é lead?
					param = 'account.edit.lead';
				}

				accessRestrictionFactory.getUserRestrictions(param, $rootScope.currentuser.login, function (result) {
					CRMControlAccountEdit.accessRestriction = result || {};
				});

				accessRestrictionFactory.getUserRestrictions('account.contact.edit', $rootScope.currentuser.login, function (result) {
					CRMControlAccountEdit.accessRestrictionContactEdit = result || {};
				});

				accessRestrictionFactory.getUserRestrictions('account.address.tab', $rootScope.currentuser.login, function (result) {
					CRMControlAccountEdit.accessRestrictionAddress = result || {};
				});

				CRMControlAccountEdit.validateParameterModel(function (result) {
					accountHelper.parseSex(result);
					accountHelper.parsePersonType(result);
					accountHelper.parseAccountType(result);
					accountHelper.parseAccessLevel(result);

					CRMControlAccountEdit.model = result;

					CRMControlAccountEdit.loadPreferences(function () {
						CRMControlAccountEdit.onChangeClientType();
					});

					CRMControlAccountEdit.loadDefaults();
					CRMControlAccountEdit.getCustomFields(result.num_id);

					customizationFactory.callEvent('dts.crm.account', 'afterInitializeAccountEdit', this);
				});
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.account ? angular.copy(parameters.account) : {};

		this.defaults = parameters.defaults || {};
		this.related = parameters.related || undefined;

		this.isAccount = CRMUtil.isDefined(parameters.isAccount) ? parameters.isAccount : false;
		this.isContact = CRMUtil.isDefined(parameters.isContact) ? parameters.isContact : false;
		this.isToLoad  = CRMUtil.isDefined(parameters.isToLoad)  ? parameters.isToLoad  : false;
		this.isConvert = CRMUtil.isDefined(parameters.isConvert) ? parameters.isConvert : false;
		this.isSourceMpd = parameters.isSourceMpd || false;

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerAccountEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters', 'crm.legend', 'crm.helper',
		'crm.account.helper', 'crm.crm_param.factory', 'crm.crm_pessoa.conta.factory',
		'crm.crm_tip_clien.factory', 'crm.crm_grp_clien.factory', 'crm.crm_fonte.factory',
		'crm.crm_repres.factory', 'crm.crm_horar.factory', 'crm.crm_transpdor.factory',
		'crm.crm_erp_portad.factory', 'crm.crm_erp_cond_pagto.factory', 'crm.crm_tip_telef.factory',
		'crm.crm_tip_vinc.factory', 'crm.crm_depto.factory', 'crm.account-address.modal.edit',
		'crm.crm_pessoa.contato.factory', 'crm.crm_niv_decis.factory', '$location',
		'crm.crm_usuar.factory', 'crm.crm_erp_natur_operac.factory', 'crm.account-address.helper',
		'crm.crm_docto_ident.factory', 'crm.crm_instruc.factory', 'crm.crm_tratam.factory', 'crm.crm_ramo_ativid.factory',
		'crm.crm_estado_civil.factory', 'crm.crm_regiao.factory', 'customization.generic.Factory',
		'crm.crm_atrib.factory', 'crm.attribute.helper', 'crm.crm_clas.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account.modal.edit', modalAccountEdit);
	index.register.controller('crm.account.edit.control', controllerAccountEdit);
});
