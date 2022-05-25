/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/api/fchcrm1029.js',
	'/dts/crm/js/api/fchcrm1030.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1047.js',
	'/dts/crm/js/api/fchcrm1086.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_produt.js',
	'/dts/crm/js/zoom/crm_tab_preco.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-type-services.select.js',
	'/dts/crm/html/opportunity/product/product-services.js',
	'/dts/crm/html/opportunity/gain-loss/gain-loss-services.js',
	'/dts/crm/html/opportunity/sales-order/sales-order-services.js',
	'/dts/crm/html/opportunity/strong-weak/strong-weak-services.js',
	'/dts/crm/html/opportunity/resale/resale-services.js',
	'/dts/crm/html/opportunity/competitor/competitor-services.js',
	'/dts/crm/html/opportunity/contact/contact-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/js/api/fchdis0051.js',
	'/dts/crm/html/opportunity/sales-order/sales-order.cancel.js',
	'/dts/dts-utils/js/lodash-angular.js'

], function (index) {

	'use strict';

	var modalOpportunityEdit,
		controllerOpportunityEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalOpportunityEdit = function ($modal) {
		this.open = function (params) {

			params = params || {};

			var template = '/dts/crm/html/opportunity/opportunity.edit.html',
				instance = $modal.open({
					templateUrl: template,
					controller: 'crm.opportunity.edit.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'lg',
					resolve: { parameters: function () { return params; } }
				});

			return instance.result;
		};
	};
	modalOpportunityEdit.$inject = ['$modal'];
	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerOpportunityEdit = function ($rootScope, $scope, $location, $timeout, $modalInstance,
		TOTVSEvent, parameters, legend, helper, preferenceFactory,
		opportunityFactory, currencyFactory, campaignFactory,
		accountFactory, contactFactory, userFactory, attachmentFactory,
		modalHistoryEdit, modalContactEdit, attributeHelper, attributeFactory,
		modalAttachmentTypeSelect, attachmentHelper, fchdis0051Factory, modalCancelSalesOrder,
		establishmentFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityEdit = this;

		this.accessRestriction = undefined;

		this.model = undefined;
		this.defaults = undefined;
		this.related = undefined;
		this.contactToSelect = undefined;

		this.canOverrideAccount = true;
		this.canOverrideAccountContact = true;

		this.editMode = false;

		this.users = [];
		this.establishments = [];
		this.listOfAccountContacts = [];
		this.products = [];

		this.isResponsibleEnabled = undefined;
		this.isIntegratedWithGP = undefined;
		this.isIntegratedWithEMS = false;
		this.isControlCifFobEnable = false;
		this.selectionEstablishmentType = 1;
		this.defaultEstablishmentUser = undefined;
		this.isClosedPhase = false;
		this.isLostPhase = false;
		this.currentCIFCity = undefined;
		this.currentEstablishment = undefined;

		this.group = {
			complement: { open: false },
			gpinformation: { open: true },
			custom: { open: true }
		};

		this.customFields = [];
		this.files = [];
		this.fileSizeLimit = 0;
		this.isAttachmentType = false;

		CRMControlOpportunityEdit.isEnableAttachment = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validateParameterModel = function () {

			var opportunity = this.model || {};

			this.editMode = (opportunity.num_id > 0);

			if (this.editMode === true) {
				this.getPhases(opportunity.num_id_estrateg_vda);
			}

			if (CRMUtil.isUndefined(parameters.canOverrideAccount)) {
				parameters.canOverrideAccount = !(opportunity.ttConta && opportunity.ttConta.num_id);
			}
		};

		this.validateParameters = function () {

			var defaults = this.defaults;

			if (CRMUtil.isDefined(parameters.canOverrideAccount)) {
				this.canOverrideAccount = parameters.canOverrideAccount === true;
			} else {
				this.canOverrideAccount = false;
			}
		};

		this.save = function () {

			$timeout(function () {

				if (CRMControlOpportunityEdit.isInvalidForm()) { return; }

				var i,
					vo = CRMControlOpportunityEdit.convertToSave(),
					opportunityAttachment;

				if (!vo) { return; }

				opportunityAttachment = function (result) {

					if (CRMControlOpportunityEdit.model.files) {

						if (CRMControlOpportunityEdit.model.files.length > 0) {

							result.log_anexo = true;

							for (i = 0; i < CRMControlOpportunityEdit.model.files.length; i++) {
								attachmentFactory.upload(6, result.num_id, CRMControlOpportunityEdit.model.files[i]);
							}
						}
					}
				};

				if (CRMControlOpportunityEdit.editMode) {

					opportunityFactory.updateRecord(vo.num_id, vo, function (result) {

						if (!result) { return; }

						if ((vo.num_id_contat && CRMUtil.isUndefined(CRMControlOpportunityEdit.contactToSelect))
							|| (CRMControlOpportunityEdit.contactToSelect && CRMControlOpportunityEdit.contactToSelect.num_id !== vo.num_id_contat)) {

							var i,
								opportunityId = result.num_id,
								addContactCallback;

							addContactCallback = function (resultContact) {

								if (!resultContact) { return; }

								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success',
									title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
									detail: $rootScope.i18n('msg-save-opportunity-contact', [], 'dts/crm')
								});

								$rootScope.$broadcast(CRMEvent.scopeSaveOpportunityContact, opportunityId);
							};

							opportunityFactory.getContacts(opportunityId, function (resultOppContact) {
								var voContato;

								if (resultOppContact) {
									for (i = 0; i < resultOppContact.length; i++) {
										if (vo.num_id_contat === resultOppContact[i].num_id) {
											break;
										} else if (i === (resultOppContact.length - 1)) {

											voContato = {};
											voContato.num_id_pessoa = vo.num_id_contat;
											voContato.num_id_niv_decis = 10;
											voContato.num_id_oportun = opportunityId;

											opportunityFactory.addContact(opportunityId, voContato, addContactCallback);
										}
									}
								} else {

									voContato = {};
									voContato.num_id_pessoa = vo.num_id_contat;
									voContato.num_id_niv_decis = 10;
									voContato.num_id_oportun = opportunityId;

									opportunityFactory.addContact(opportunityId, voContato, function (resultContact) {

										if (!resultContact) { return; }

										$rootScope.$broadcast(TOTVSEvent.showNotification, {
											type: 'success',
											title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
											detail: $rootScope.i18n('msg-save-opportunity-contact', [], 'dts/crm')
										});

										$rootScope.$broadcast(CRMEvent.scopeSaveOpportunityContact, opportunityId);
									});
								}
							});
						}

						CRMControlOpportunityEdit.afterSave(result);
						opportunityAttachment(result);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-update-opportunity', [
								CRMControlOpportunityEdit.model.des_oportun_vda
							], 'dts/crm')
						});

						if (CRMControlOpportunityEdit.isControlCifFobEnable === true
							&& CRMControlOpportunityEdit.products
							&& CRMControlOpportunityEdit.products.length > 0
							&& (vo.nom_cidad_cif !== CRMControlOpportunityEdit.currentCIFCity || vo.num_id_estab !== CRMControlOpportunityEdit.currentEstablishment)) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'information',
								title: $rootScope.i18n('nav-opportunity', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-cif-city-changed', [], 'dts/crm')
							});
						}
					});
				} else {

					opportunityFactory.saveRecord(vo, function (result) {

						if (!result) { return; }

						var voContato,
							opportunityId = result.num_id;

						if (vo.num_id_contat) {
							voContato = {};
							voContato.num_id_pessoa = vo.num_id_contat;
							voContato.num_id_niv_decis = 10;
							voContato.num_id_oportun = opportunityId;

							opportunityFactory.addContact(opportunityId, voContato, function (resultContact) {

								if (!resultContact) { return; }

								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success',
									title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
									detail: $rootScope.i18n('msg-save-opportunity-contact', [], 'dts/crm')
								});

								$rootScope.$broadcast(CRMEvent.scopeSaveOpportunityContact, opportunityId);
							});
						}

						CRMControlOpportunityEdit.afterSave(result);
						opportunityAttachment(result);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-save-opportunity', [
								CRMControlOpportunityEdit.model.des_oportun_vda
							], 'dts/crm')
						});

					});
				}
			}, 500);
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.isInvalidForm = function () {

			var i, fields, isPlural, message,
				messages = [],
				isInvalidForm = false;

			if (!this.model.ttConta) {
				isInvalidForm = true;
				messages.push('l-account');
			}

			if (!this.model.des_oportun_vda || this.model.des_oportun_vda.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (!this.model.ttEstrategia) {
				isInvalidForm = true;
				messages.push('l-sales-strategy');
			}

			if (!this.model.ttFaseDesenvolvimento) {
				isInvalidForm = true;
				messages.push('l-phase');
			}

			if (!this.model.ttResponsavel) {
				isInvalidForm = true;
				messages.push('l-user-responsible');
			}

			if ((this.model.ttFaseDesenvolvimento) && (this.model.ttFaseDesenvolvimento.log_fechto_fase === true && !this.model.dat_fechto_oportun)) {
				isInvalidForm = true;
				messages.push('l-date-close');
			}

			attributeHelper.isInvalidForm(this.customFields, function (result) {
				for (i = 0; i < result.length; i++) {
					if (CRMUtil.isDefined(result[i])) {
						messages.push(result[i]);
						isInvalidForm = true;
					}
				}
			});

			if (!isInvalidForm) {
				if (this.isEditMode === true
					&& this.isControlCifFobEnable === true
					&& this.products
					&& this.products.length > 0
					&& (this.model.ttEstabelecimento === undefined)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('nav-opportunity', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-opportunity-establishment-validation', [], 'dts/crm')
					});
					isInvalidForm = true;
					return isInvalidForm;
				}
			}

			if (isInvalidForm) {

				fields = '';
				isPlural = messages.length > 1;
				message = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i++) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {};

			if (!CRMControlOpportunityEdit.editMode) {
				vo.num_id_usuar = $rootScope.currentuser.idCRM;
			}

			vo.num_id = this.model.num_id;
			vo.des_oportun_vda = this.model.des_oportun_vda;
			vo.dsl_oportun_vda = this.model.dsl_oportun_vda || "";
			vo.dat_fechto_oportun = this.model.dat_fechto_oportun;
			vo.dat_prev_fechto = this.model.dat_prev_fechto;
			vo.log_suspenso = this.model.log_suspenso;

			if (this.model.ttConta) {
				vo.num_id_pessoa = this.model.ttConta.num_id;
			}

			if (this.model.ttContato) {
				vo.num_id_contat = this.model.ttContato.num_id;
			}

			if (this.model.ttResponsavel) {
				vo.num_id_usuar_respons = this.model.ttResponsavel.num_id;
			}

			if (this.model.ttEstrategia) {
				vo.num_id_estrateg_vda = this.model.ttEstrategia.num_id;
			}

			if (this.model.ttFaseDesenvolvimento) {
				vo.num_id_fase = this.model.ttFaseDesenvolvimento.num_id;
			}

			if (this.model.ttProbabilidade) {
				vo.num_id_probab = this.model.ttProbabilidade.num_id;
			}

			if (this.model.ttMoeda) {
				vo.num_id_moed = this.model.ttMoeda.num_id;
			}

			if (this.model.ttCampanha) {
				vo.num_id_campanha = this.model.ttCampanha.num_id;
			}

			if (this.model.val_oportun_vda !== undefined
				&& this.model.val_oportun_vda.toString().trim().length > 0) {
				vo.val_oportun_vda = this.model.val_oportun_vda;
			} else {
				vo.val_oportun_vda = 0;
			}

			if (this.model.val_bgc !== undefined
				&& this.model.val_bgc.toString().trim().length > 0) {
				vo.val_bgc = this.model.val_bgc;
			} else {
				vo.val_bgc = 0;
			}

			if (this.model.val_realzdo_simul !== undefined
				&& this.model.val_realzdo_simul.toString().trim().length > 0) {
				vo.val_realzdo_simul = this.model.val_realzdo_simul;
			} else {
				vo.val_realzdo_simul = 0;
			}

			if (this.model.val_med_vida !== undefined
				&& this.model.val_med_vida.toString().trim().length > 0) {
				vo.val_med_vida = this.model.val_med_vida;
			} else {
				vo.val_med_vida = 0;
			}

			if (this.model.qti_nume_vida !== undefined) {
				if (parseInt(this.model.qti_nume_vida, 10) >= 0) {
					vo.qti_nume_vida = parseInt(this.model.qti_nume_vida, 10);
				}
			} else {
				vo.qti_nume_vida = 0;
			}

			if (this.model.qti_nume_vida_realzdo !== undefined) {
				if (parseInt(this.model.qti_nume_vida_realzdo, 10) >= 0) {
					vo.qti_nume_vida_realzdo = parseInt(this.model.qti_nume_vida_realzdo, 10);
				}
			} else {
				vo.qti_nume_vida_realzdo = 0;
			}

			if (this.isControlCifFobEnable === true) {

				if (CRMUtil.isDefined(this.model.nom_cidad_cif) && this.model.nom_cidad_cif.trim().length > 0) {
					vo.nom_cidad_cif = this.model.nom_cidad_cif;
				} else {
					vo.nom_cidad_cif = undefined;
				}

				if (this.model.ttEstabelecimento) {
					vo.num_id_estab = this.model.ttEstabelecimento.num_id;
				} else {
					vo.num_id_estab = undefined;
				}
			}

			attributeHelper.convertToSave(this.customFields, vo.num_id, 4, function (result) {
				vo.ttAtributoVO = result;
			});

			return vo;
		};

		this.afterSave = function (opportunity) {

			/* gambita para funcionar corretamente o anexo ao registrar uma ação após salvar a oportunidade */
			CRMControlOpportunityEdit.isEnableAttachment = false;
			/**/

			var isAddHistory = function () {
				if (opportunity.ttEstrategia) {
					if (opportunity.ttEstrategia.log_inclui_acao === true) {
						CRMControlOpportunityEdit.registerHistory(opportunity, true);
					} else {
						CRMControlOpportunityEdit.close(opportunity);
					}
				} else {
					var filter = { property: 'num_id', value: opportunity.num_id };
					opportunityFactory.findRecords(filter, undefined, function (result) {
						if (!result) { return; }
						var opp = result[0];
						if (opp.ttEstrategia.log_inclui_acao === true) {
							CRMControlOpportunityEdit.registerHistory(opp, false);
						} else {
							CRMControlOpportunityEdit.close(opportunity);
						}
					});
				}
			};

			if ((CRMControlOpportunityEdit.isLostPhase !== true) && (opportunity.ttFaseDesenvolvimento && opportunity.ttFaseDesenvolvimento.log_fase_perdido === true)) {
				CRMControlOpportunityEdit.cancelQuotationAndSalesOrder(opportunity, isAddHistory);
			} else {
				isAddHistory();
			}

			$scope.$broadcast(CRMEvent.scopeSaveOpportunity, opportunity);
		};

		this.cancelQuotationAndSalesOrder = function (opp, callback) {
			if (CRMUtil.isUndefined(opp)) { callback(); }

			if (CRMControlOpportunityEdit.isIntegratedWithEMS !== true) { callback(); }

			var fnConfirmCancel;

			fnConfirmCancel = function (result) {
				// se tiver cotações ou pedidos abertos então questiona se deseja cancelar
				if (result && result.isOK === true) {

					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: $rootScope.i18n('l-confirm-cancellation', [], 'dts/crm'),
						cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
						confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
						text: $rootScope.i18n('msg-confirm-cancellation-quotation-and-orders', [], 'dts/crm'),
						callback: function (isPositiveResult) {

							if (!isPositiveResult) { return; }

							CRMControlOpportunityEdit.openCancelQuotationAndSalesOrder(opp, function () {
								callback();
							});
						}
					});

				} else {
					callback();
				}
			};

			fchdis0051Factory.hasOpenQuotationOrOrderForOpportunity(opp.num_id, fnConfirmCancel);
		};

		this.openCancelQuotationAndSalesOrder = function (opp, callback) {
			modalCancelSalesOrder.open({
				opportunity: opp,
				allOpenQuotationAndOrderForOpportunity: true
			}).then(function (result) {
				if (callback) { callback(result); }
			});
		};

		this.close = function (opportunity) {

			if (CRMUtil.isUndefined(opportunity)) { return; }

			$modalInstance.close(opportunity);

			if (CRMControlOpportunityEdit.editMode === false) {
				CRMControlOpportunityEdit.relocateToDetail(opportunity);
			}
		};

		this.relocateToDetail = function (opportunity) {
			$location.path('/dts/crm/opportunity/detail/' + opportunity.num_id);
		};

		this.registerHistory = function (opportunity, isToDetail) {

			var relocateToDetail = CRMControlOpportunityEdit.relocateToDetail;

			modalHistoryEdit.open({
				history: {
					ttOportunidadeOrigem: opportunity
				},
				canOverrideCampaign: angular.isDefined(opportunity.ttCampanha)
			}).then(function () {

				/* gambita para funcionar corretamente o anexo ao registrar uma ação após salvar a oportunidade */
				$modalInstance.close(opportunity);
				/**/

				if (isToDetail === true) {
					relocateToDetail(opportunity);
				}
			}, function () {
				/* gambita para funcionar corretamente o anexo ao registrar uma ação após salvar a oportunidade */
				$modalInstance.close(opportunity);
				/**/

				if (isToDetail === true) {
					relocateToDetail(opportunity);
				}
			});


		};

		// *********************************************************************************

		this.loadPreferences = function (callback) {
			var count = 0, total = 6;

			preferenceFactory.getPreferenceAsBoolean('LOG_CONTROL_CIF_FOB', function (result) {
				CRMControlOpportunityEdit.isControlCifFobEnable = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlOpportunityEdit.isIntegratedWithGP = result;
				if (++count === total && callback) { callback(); }
			});

			attachmentFactory.getParamSizeLimit(function (result) {
				CRMControlOpportunityEdit.fileSizeLimit = result || 0;
				if (++count === total && callback) { callback(); }
			});

			attachmentFactory.isAttachmentType(function (result) {
				CRMControlOpportunityEdit.isAttachmentType = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControlOpportunityEdit.isIntegratedWithEMS = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.getPreferenceAsInteger('ESTAB_COTAC_PED_VDA', function (result) {
				CRMControlOpportunityEdit.selectionEstablishmentType = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.loadDefaults = function () {

			this.getCurrencies();
			this.getProbabilities();
			this.getUsers();
			if (this.isControlCifFobEnable === true) {
				this.getEstablishments();
				this.getProducts();
			}

			this.getCustomFields(CRMControlOpportunityEdit.model.num_id);

			if (CRMControlOpportunityEdit.model.ttConta) {
				this.getContacts();
				if (this.editMode === false) {
					this.getResponsible();
				}
			}

			if (CRMControlOpportunityEdit.model.ttFaseDesenvolvimento) {
				this.isClosedPhase = CRMControlOpportunityEdit.model.ttFaseDesenvolvimento.log_fechto_fase;
				this.isLostPhase = CRMControlOpportunityEdit.model.ttFaseDesenvolvimento.log_fase_perdido;
			}

			if (CRMControlOpportunityEdit.model.ttEstabelecimento === undefined && this.isControlCifFobEnable === true) {
				if (CRMControlOpportunityEdit.selectionEstablishmentType === 1) {
					this.getDefaultEstablishmentPD0301();
				} else if (CRMControlOpportunityEdit.selectionEstablishmentType === 2) {
					this.getDefaultUserEstablishment();
				}
			}

			if (CRMControlOpportunityEdit.isIntegratedWithEMS === true && CRMControlOpportunityEdit.isControlCifFobEnable) {
				if (this.model.ttConta && this.model.ttConta.nom_abrev) {
					opportunityFactory.getDefaultCityCif(this.model.ttConta.nom_abrev, function (result) {
						if (result)
							CRMControlOpportunityEdit.model.nom_cidad_cif = result;
					});
				}
			}
		};

		// *********************************************************************************

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'custom.quick_search_account', value: helper.parseStrictValue(value) }

			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityEdit.accounts = result;
			});
		};

		this.onChangeAccount = function (selected) {

			if (selected || CRMControlOpportunityEdit.model.ttConta) {
				CRMControlOpportunityEdit.model.ttConta = selected ? selected : CRMControlOpportunityEdit.model.ttConta;

				if (CRMControlOpportunityEdit.model.ttConta.nom_abrev) {
					opportunityFactory.getDefaultCityCif(CRMControlOpportunityEdit.model.ttConta.nom_abrev, function (result) {
						if (result)
							CRMControlOpportunityEdit.model.nom_cidad_cif = result;
					});
				}
			}
			this.getContacts();
			this.getResponsible();
		};

		this.getContacts = function () {

			var model = this.model;

			model.ttContato = undefined;

			if (!model.ttConta) { return []; }

			accountFactory.getContacts(model.ttConta.num_id, function (result) {

				CRMControlOpportunityEdit.listOfAccountContacts = result || [];

				var i, contact, contactDefault, contactToSelect;

				for (i = 0; i < CRMControlOpportunityEdit.listOfAccountContacts.length; i++) {

					contact = CRMControlOpportunityEdit.listOfAccountContacts[i];

					if (CRMControlOpportunityEdit.defaults.num_id_contat > 0
						&& CRMControlOpportunityEdit.defaults.num_id_contat === contact.num_id) {
						contactToSelect = contact;
						break;
					}

					if (CRMControlOpportunityEdit.editMode === false) {

						if (CRMControlOpportunityEdit.listOfAccountContacts.length === 1) {
							contactToSelect = contact;
							break;
						}

						if (contact.log_default === true) {
							contactDefault = contact;
						}
					}
				}

				CRMControlOpportunityEdit.model.ttContato = contactToSelect || contactDefault;
				CRMControlOpportunityEdit.contactToSelect = contactToSelect || contactDefault;
			});
		};

		this.getResponsible = function () {
			if (!this.model.ttConta) { return []; }

			var accountId = this.model.ttConta.num_id;

			opportunityFactory.getResponsible(accountId, function (result) {
				CRMControlOpportunityEdit.model.ttResponsavel = result;
			});

		};

		this.getProducts = function () {
			opportunityFactory.getProducts(this.model.num_id, function (result) {
				if (!result) { return; }
				CRMControlOpportunityEdit.products = result;
			}, true);
		};

		this.getStrategies = function () {
			opportunityFactory.getAllValidStrategies(function (result) {
				if (!result) { return; }
				CRMControlOpportunityEdit.strategies = result;
			}, true);
		};

		this.onChangeStrategy = function (strategy) {
			this.model.num_id_fase = undefined;
			this.model.ttFaseDesenvolvimento = undefined;
			if (CRMUtil.isUndefined(strategy)) {
				this.getPhases(undefined);
			} else {
				this.getPhases(strategy.num_id);
			}
		};

		this.onChangePhase = function (phase) {
			if (phase.log_fechto_fase === true) {
				this.isClosedPhase = true;
				this.model.dat_fechto_oportun = new Date();
			} else {
				this.isClosedPhase = false;
				this.model.dat_fechto_oportun = undefined;
			}
		};

		this.getPhases = function (strategyId) {
			CRMControlOpportunityEdit.phases = undefined;
			opportunityFactory.getAllPhases(strategyId, function (result) {
				var i;
				if (!result) { return; }

				CRMControlOpportunityEdit.phases = result;

				if (!CRMControlOpportunityEdit.editMode) {
					CRMControlOpportunityEdit.model.ttFaseDesenvolvimento = CRMControlOpportunityEdit.phases[0];
				}
				for (i = 0; i < CRMControlOpportunityEdit.phases.length; i++) {
					if ((CRMControlOpportunityEdit.phases[i].num_order < CRMControlOpportunityEdit.model.ttFaseDesenvolvimento.num_order)
						&& (!CRMControlOpportunityEdit.editMode)) {
						CRMControlOpportunityEdit.model.ttFaseDesenvolvimento = CRMControlOpportunityEdit.phases[i];
					}
				}
			}, true);
		};

		this.getProbabilities = function () {
			opportunityFactory.getAllProbabilities(function (result) {
				if (!result) { return; }

				CRMControlOpportunityEdit.probabilities = result;

			}, true);
		};

		this.getCurrencies = function () {

			currencyFactory.getAll(function (result) {
				CRMControlOpportunityEdit.currencies = result;
			});

			if (CRMUtil.isUndefined(CRMControlOpportunityEdit.model.ttMoeda)) {
				opportunityFactory.getCurrencyDefault(function (result) {
					if (CRMUtil.isUndefined(result)) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'info',
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-default-currency-not-found', [], 'dts/crm')
						});
						return;
					}
					CRMControlOpportunityEdit.model.ttMoeda = result[0];
				});
			}
		};

		this.getUsers = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_usuar', value: helper.parseStrictValue(value) };
			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityEdit.users = result;
			});
		};

		this.getDefaultUserEstablishment = function () {
			var filter = { property: 'num_id', value: $rootScope.currentuser.idCRM };
			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityEdit.getEstablishment(result[0].num_id_estab);
			});
		};

		this.getDefaultEstablishmentPD0301 = function () {

			opportunityFactory.getDefaultEstablishmentPD0301(function (result) {
				CRMControlOpportunityEdit.getEstablishment(result);
			});

		};

		this.getEstablishments = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'type_ahead', value: helper.parseStrictValue(value) };

			establishmentFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityEdit.establishments = result;
			});

		};

		this.getEstablishment = function (id) {

			var filter = { property: 'num_id', value: id };
			establishmentFactory.typeahead(filter, undefined, function (result) {
				CRMControlOpportunityEdit.model.ttEstabelecimento = result[0];
			});

		};

		this.getCampaigns = function () {
			if ((CRMControlOpportunityEdit.accessRestriction) && (CRMControlOpportunityEdit.accessRestriction["l-campaign"])
				&& (!CRMControlOpportunityEdit.accessRestriction["l-campaign"].log_visivel))
				return;

			campaignFactory.getAllCampaigns(true, $rootScope.currentuser.idCRM, function (result) {

				CRMControlOpportunityEdit.campaigns = result || [];

				if (!result || result.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
						detail: 'Usuário não possui acesso a nehuma campanha!'
					});
					return;
				}

				var i, campaign, campaignToSelect;

				for (i = 0; i < CRMControlOpportunityEdit.campaigns.length; i++) {

					campaign = CRMControlOpportunityEdit.campaigns[i];

					if (CRMControlOpportunityEdit.defaults.num_id_campanha > 0) {
						if (CRMControlOpportunityEdit.defaults.num_id_campanha === campaign.num_id) {
							campaignToSelect = campaign;
							break;
						}
					} else if (CRMControlOpportunityEdit.campaigns.length === 1) {
						campaignToSelect = campaign;
						break;
					}
				}

				if (campaignToSelect) {
					CRMControlOpportunityEdit.model.ttCampanha = campaignToSelect;
				} else if (CRMControlOpportunityEdit.defaults.num_id_campanha > 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-campaign-user', [], 'dts/crm')
					});
					return;
				}
			});
		};

		this.newAccountContact = function () {
			modalContactEdit.open({
				related: CRMControlOpportunityEdit.model.ttConta
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlOpportunityEdit.listOfAccountContacts.push(result);
					CRMControlOpportunityEdit.model.ttContato = result;
				}
			});
		};

		this.getCustomFields = function (oppId) {
			if (oppId && oppId <= 0) {
				return;
			}

			attributeFactory.getCustomFields(4, oppId, function (result) {
				angular.forEach(result, function (data) {
					attributeHelper.parseAttribute(data, CRMControlOpportunityEdit.editMode);
					attributeHelper.parseAttributeType(data);
					data.dsl_atrib_json = JSON.parse(data.dsl_atrib_json);

					CRMControlOpportunityEdit.customFields.push(data);
				});
			});
		};

		this.onSelectFiles = function ($files) {

			var file,
				i,
				canUpload;

			if (!CRMControlOpportunityEdit.model.files) {
				CRMControlOpportunityEdit.model.files = [];
			}

			for (i = 0; i < $files.length; i += 1) {
				file = $files[i];
				canUpload = true;
				if (attachmentHelper.fileAlreadyExistInSelectedList(CRMControlOpportunityEdit.model.files, file.name)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-opportunity', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-file-already-exist', [file.name], 'dts/crm')
					});
					canUpload = false;
				} else if (CRMControlOpportunityEdit.fileSizeLimit > 0) {
					canUpload = helper.validateUploadLimitFileSize('nav-opportunity', file.name, file.size, CRMControlOpportunityEdit.fileSizeLimit);
				}
				if (canUpload) {
					CRMControlOpportunityEdit.model.files.push(file);
				} else {
					CRMControlOpportunityEdit.model.file = null;
				}
			}

			if (CRMControlOpportunityEdit.isAttachmentType && $files.length > 0) {
				modalAttachmentTypeSelect.open(
					CRMControlOpportunityEdit.model.files
				).then(function (result) {

					CRMControlOpportunityEdit.model.files = result.selectedFiles;

				});
			}
		};

		// *********************************************************************************

		this.onOpenComplementPanel = function () {

			this.getCampaigns();
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('opportunity.edit', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityEdit.accessRestriction = result || {};
			});

			this.loadPreferences();
			this.validateParameterModel();
			this.validateParameters();

			$timeout(function () {
				CRMControlOpportunityEdit.loadDefaults();
			}, 800);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.opportunity ? angular.copy(parameters.opportunity) : {};
		this.defaults = parameters.defaults || {};
		this.currentCIFCity = this.model.nom_cidad_cif;
		this.currentEstablishment = this.model.num_id_estab;

		$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdOpportunity, false);

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdOpportunity, true);
			CRMControlOpportunityEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerOpportunityEdit.$inject = [
		'$rootScope',
		'$scope',
		'$location',
		'$timeout',
		'$modalInstance',
		'TOTVSEvent',
		'parameters',
		'crm.legend',
		'crm.helper',
		'crm.crm_param.factory',
		'crm.crm_oportun_vda.factory',
		'crm.crm_erp_moed.factory',
		'crm.crm_campanha.factory',
		'crm.crm_pessoa.conta.factory',
		'crm.crm_pessoa.contato.factory',
		'crm.crm_usuar.factory',
		'crm.crm_anexo.factory',
		'crm.history.modal.edit',
		'crm.account-contact.modal.edit',
		'crm.attribute.helper',
		'crm.crm_atrib.factory',
		'crm.attachment-type.select.modal.control',
		'crm.attachment.helper',
		'crm.mpd_fchdis0051.factory',
		'crm.sales-order-cancel.modal',
		'crm.crm_estab.factory',
		'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.opportunity.modal.edit', modalOpportunityEdit);

	index.register.controller('crm.opportunity.edit.control', controllerOpportunityEdit);
});
