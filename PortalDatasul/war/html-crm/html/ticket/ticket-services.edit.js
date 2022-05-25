/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1021.js',
	'/dts/crm/js/api/fchcrm1022.js',
	'/dts/crm/js/api/fchcrm1028.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1033.js',
	'/dts/crm/js/api/fchcrm1034.js',
	'/dts/crm/js/api/fchcrm1035.js',
	'/dts/crm/js/api/fchcrm1036.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1084.js',
	'/dts/crm/js/api/fchcrm1085.js',
	'/dts/crm/js/api/fchcrm1075.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'/dts/crm/js/api/fchcrm1088.js',
	'/dts/crm/js/zoom/crm_causa_ocor.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_classif_ocor_item.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-type-services.select.js',
	'/dts/crm/html/ticket/tag/tag-services.js',
	'/dts/crm/html/ticket/symptom/symptom-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/js/zoom/nota_fiscal.js',
	'/dts/crm/js/zoom/ped_venda.js',
	'/dts/crm/html/ticket/product/ticket-product-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'


], function (index) {

	'use strict';

	var modalTicketEdit,
		controllerTicketEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalTicketEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket/ticket.edit.html',
				controller: 'crm.ticket.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalTicketEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************
	controllerTicketEdit = function ($rootScope, $scope, $modalInstance, $filter, TOTVSEvent,
									  parameters, legend, ticketFactory, helper, ticketHelper,
									  attachmentFactory, subjectFactory, accountFactory,
									  ticketRatingFactory, ticketPriorityFactory, ticketTypeFactory,
									  ticketOriginFactory, ticketFlowFactory, referenceFactory,
									  modalTicketEdit, productFactory, preferenceFactory, causeFactory, $timeout,
									  modalHistoryEdit, modalContactEdit, $location, attributeFactory, attributeHelper, salesOrderFactory, invoiceFactory,
									  modalAttachmentTypeSelect, attachmentHelper, modalTicketProductEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketEdit = this;

		this.model = {};
		this.defaults = undefined;
		this.editMode = false;
		this.duplicateMode = false;

		this.canChangeClosingForecast = true;

		this.canOverrideAccount = true;
		this.canOverrideAccountContact = true;
		this.canSetPreviousDate = false; // PARAM: REG_OCOR_DAT_RETRO
		//this.isSubjectAsText = undefined; // PARAM: LOG_OCCURRENCE_SUBJECT
		this.isActiveRestrictSubject = false;
		this.isChangePriority = false;

		this.listOfSubjects = [];
		this.listOfAccounts = [];
		this.listOfAccountContacts = [];
		this.listOfTicketsType = [];
		this.listOfPriorities = [];
		this.listOfOrigins = [];
		this.listOfRatings = [];
		this.listOfProducts = [];
		this.listOfReferences = [];
		this.listOfVersions = [];
		this.listOfFlows = [];
		this.listOfStatus = [];
		this.listOfResponsibles = [];
		this.listOfComponents = [];
		this.listOfCauses = [];
		this.listOfSalesOrder = [];
		this.listOfInvoices = [];
		this.customFields = [];
		this.files = [];
		this.fileSizeLimit = 0;
		this.isAttachmentType = false;
		this.representativeCode = 0;
		this.listOfProducts = [];
		this.productQuantity = undefined;
		this.isEnableAttachment = true;

		this.group = {
			custom: { open: true },
			products: { open: false }

		};
		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.convertToSave = function () {
			var i,
				vo = { ttAtributoVO: [], ttProdutosVO: []};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
				vo.cod_livre_1 = this.model.num_id.toString();
			}

			vo.dat_abert = this.model.dat_abert;

			vo.dat_prev_fechto = angular.isDate(this.model.dat_prev_fechto) ?  this.model.dat_prev_fechto.getTime() : this.model.dat_prev_fechto;

			vo.hra_prev_fechto = this.model.hra_prev_fechto;

			vo.num_id_usuar_abert = $rootScope.currentuser.idCRM;

			vo.dsl_sit = this.model.dsl_sit;

			if (this.model.ttStatus && this.model.ttStatus.log_encerra_ocor === true) {
				vo.dsl_soluc = this.model.dsl_soluc;
			}

			if (this.isSubjectAsText === true) {

				if (this.model.ttAssunto) {
					vo.nom_ocor = this.model.ttAssunto.nom_assunto_ocor;

					if (this.isActiveRestrictSubject === false) {
						vo.num_id_assunto_ocor = this.model.ttAssunto.num_id;
					} else {
						vo.num_id_assunto_ocor = this.model.ttAssunto.num_id_assunto_ocor;
					}
				}
			} else {
				vo.num_id_assunto_ocor = 0;
				vo.nom_ocor = this.model.nom_ocor;
			}

			if (this.model.ttConta) {
				vo.num_id_pessoa = this.model.ttConta.num_id;
			}

			if (this.model.ttContato) {
				vo.num_id_contat = this.model.ttContato.num_id;
			}

			if (this.model.ttTipo) {
				vo.num_id_tip_ocor = this.model.ttTipo.num_id;
			}

			if (this.model.ttPrioridade) {
				vo.num_id_priorid_ocor = this.model.ttPrioridade.num_id;
			}

			if (this.model.ttOrigem) {
				vo.num_id_orig = this.model.ttOrigem.num_id;
			}

			if (this.model.ttFluxo) {
				vo.num_id_ocor_fluxo = this.model.ttFluxo.num_id;
			}

			if (this.model.ttStatus) {
				vo.num_id_status_ocor = this.model.ttStatus.num_id;
			}

			if (this.model.ttRecurso) {
				vo.num_id_recur = this.model.ttRecurso.num_id;
			}

			if (this.model.ttOcorrenciaOrigem) {
				vo.num_id_ocor_orig = this.model.ttOcorrenciaOrigem.num_id;
			}

			if (this.model.ttCausa) {
				vo.num_id_causa_ocor = this.model.ttCausa.num_id;
			}

			if (this.model.ttPedVenda) {
				vo.num_ped_vda   = this.model.ttPedVenda['nr-pedido'];
				vo.cod_ped_clien = this.model.ttPedVenda['nr-pedcli'];
			}

			if (this.model.ttNotaFiscal) {
				vo.cod_estab     = this.model.ttNotaFiscal['cod-estabel'];
				vo.cod_nota_fisc = this.model.ttNotaFiscal['nr-nota-fis'];
				vo.cod_ser       = this.model.ttNotaFiscal.serie;
			}

			attributeHelper.convertToSave(this.customFields, vo.num_id, 3, /* Ocorrência*/ function (result) {
				vo.ttAtributoVO = result;
			});

			for (i = 0; i < this.listOfProducts.length; i++) {
				vo.ttProdutosVO.push({
					"num_id_classif_ocor_item": this.listOfProducts[i].ttProduto.num_id_classif_ocor_item || this.listOfProducts[i].ttProduto.num_id,
					"num_id_classif_ocor": this.listOfProducts[i].ttProduto.num_id_classif_ocor,
					"num_id_produt_filho": this.listOfProducts[i].ttComponente ? this.listOfProducts[i].ttComponente.num_id : 0,
					"num_id_refer": this.listOfProducts[i].ttReferencia ? this.listOfProducts[i].ttReferencia.num_id : 0,
					"num_id_vers": this.listOfProducts[i].ttVersao ? this.listOfProducts[i].ttVersao.num_id : 0,
					"cod_lote": this.listOfProducts[i].cod_lote,
					"qtd_analis": this.listOfProducts[i].qtd_analis,
					"qtd_devolvid": this.listOfProducts[i].qtd_devolvid,
					"dat_valid": this.listOfProducts[i].dat_valid
				});
			}


			return vo;
		};

		this.save = function () {

			if (this.isInvalidForm()) { return; }

			var i,
				vo = this.convertToSave(),
				ticketPostPersist;

			if (!vo) { return; }

			ticketPostPersist = function (result) {

				if (!result) { return; }

				result.dsl_sit = vo.dsl_sit;
				result.dsl_soluc = vo.dsl_soluc;

				if (CRMControlTicketEdit.model.files) {

					if (CRMControlTicketEdit.model.files.length > 0) {

						result.log_anexo = true;

						for (i = 0; i < CRMControlTicketEdit.model.files.length; i++) {
							attachmentFactory.upload(7, result.num_id, CRMControlTicketEdit.model.files[i]);
						}
					}
				}

				CRMControlTicketEdit.afterSave(result);
			};

			if (this.editMode === true) {
				ticketFactory.updateRecord(vo.num_id, vo, function (result) {
					ticketPostPersist(result);
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-update-ticket', [
							result.num_id, result.nom_ocor
						], 'dts/crm')
					});
				});
			} else {
				ticketFactory.saveRecord(vo, function (result) {
					result.isNew = true;
					ticketPostPersist(result);
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-ticket', [
							result.num_id, result.nom_ocor
						], 'dts/crm')
					});
				});
			}

		};

		this.generateId = function () {
			ticketFactory.genarateId(function (result) {
				if (!result) { return; }
				CRMControlTicketEdit.model.num_id = result.num_id;
				CRMControlTicketEdit.model.cod_livre_1 = result.num_id;
				CRMControlTicketEdit.generateModalTitle();
			});
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.validadeParameterModel = function () {

			var model = CRMControlTicketEdit.model,
				related;

			if (CRMControlTicketEdit.canSetPreviousDate === true) {
				model.dateTimeBase = new Date();
				model.dateTimeBase.setDate(model.dateTimeBase.getDate() - CRMControlTicketEdit.daysToOpenPreviously);
			}

			if (CRMControlTicketEdit.editMode === true || CRMControlTicketEdit.duplicateMode === true) {

				CRMControlTicketEdit.listOfAccountContacts = [];

				ticketFactory.getSituation(model.num_id, function (result) {
					if (result) { model.dsl_sit = result.dsl_sit; }
				});

				CRMControlTicketEdit.generateModalTitle();
			}

			if (CRMControlTicketEdit.editMode === true) {
				ticketFactory.getSolution(model.num_id, function (result) {
					if (result) { model.dsl_soluc = result.dsl_soluc; }
				});
			}

			if (CRMControlTicketEdit.editMode !== true) {
				model.dat_abert = new Date();
				model.dat_prev_fechto = new Date().setDate(new Date().getDate() + 1);
				CRMControlTicketEdit.generateId();
			}

			related = model.ttOcorrenciaOrigem;

			if (related) {

				if (!(model.ttConta && model.ttConta.num_id)) {
					model.ttConta = related.ttConta;
				}

				model.ttContato = related.ttContato;

				if (CRMUtil.isUndefined(parameters.canOverrideAccount)) {
					parameters.canOverrideAccount = !(model.ttConta && model.ttConta.num_id);
				}

			} else {

				if (model.ttConta && model.ttConta.num_id) {
					CRMControlTicketEdit.defaults.num_id_pessoa = model.ttConta.num_id;
				}

				if (model.ttContato && model.ttContato.num_id) {
					CRMControlTicketEdit.defaults.num_id_contat = model.ttContato.num_id;
				}

			}

			if (model.ttProduto && model.ttProduto.num_id) {
				CRMControlTicketEdit.defaults.num_id_produt = model.ttProduto.num_id;
			}
			if (model.ttReferencia && model.ttReferencia.num_id) {
				CRMControlTicketEdit.defaults.num_id_refer = model.ttReferencia.num_id;
			}
			if (model.ttVersao && model.ttVersao.num_id) {
				CRMControlTicketEdit.defaults.num_id_vers = model.ttVersao.num_id;
			}
			if (model.ttComponente && model.ttComponente.num_id) {
				CRMControlTicketEdit.defaults.num_id_produt_filho = model.ttComponente.num_id;
			}

		};

		this.validateParameters = function () {

			if (CRMControlTicketEdit.editMode === true) {
				if (CRMUtil.isDefined(parameters.canOverrideAccount)) {
					CRMControlTicketEdit.canOverrideAccount = parameters.canOverrideAccount === true;
				} else {
					CRMControlTicketEdit.canOverrideAccount = false;
				}
			} else {
				if (CRMControlTicketEdit.defaults.num_id_pessoa) {
					CRMControlTicketEdit.canOverrideAccount = CRMControlTicketEdit.defaults.num_id_pessoa <= 0;
				} else {
					CRMControlTicketEdit.canOverrideAccount = parameters.canOverrideAccount || true;
				}
			}

			if (CRMControlTicketEdit.duplicateMode === true) {
				CRMControlTicketEdit.canOverrideAccount = true;
			}
		};

		this.loadPreferences = function (callback) {

			var count = 0,
				total = 7;

			preferenceFactory.getPreferenceAsInteger('DIAS_OCO', function (result) {
				CRMControlTicketEdit.daysToOpenPreviously = result || 0;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsBoolean('REG_OCOR_DAT_RETRO', function (result) {
				CRMControlTicketEdit.canSetPreviousDate = result || false;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsBoolean('LOG_OCCURRENCE_SUBJECT', function (result) {
				CRMControlTicketEdit.isSubjectAsText = result || false;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsBoolean('LOG_RESTR_ASSUNTO', function (result) {
				CRMControlTicketEdit.isActiveRestrictSubject = result || false;
				if (++count === total && callback) { callback(); }
			});
			preferenceFactory.getPreferenceAsInteger('QTD_PROD_OCOR', function (result) {
				CRMControlTicketEdit.productQuantity = result || 0;
				if (++count === total && callback) { callback(); }
			});
			attachmentFactory.getParamSizeLimit(function (result) {
				CRMControlTicketEdit.fileSizeLimit = result || 0;
				if (++count === total && callback) { callback(); }
			});
			attachmentFactory.isAttachmentType(function (result) {
				CRMControlTicketEdit.isAttachmentType = result;
				if (++count === total && callback) { callback(); }
			});
		};

		CRMControlTicketEdit.onSelectFiles = function ($files) {

			var	file,
				i,
				canUpload;

			if (!CRMControlTicketEdit.model.files) {
				CRMControlTicketEdit.model.files = [];
			}

			for (i = 0; i < $files.length; i += 1) {
				file = $files[i];
				canUpload = true;

				if (attachmentHelper.fileAlreadyExistInSelectedList(CRMControlTicketEdit.model.files, file.name)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-file-already-exist', [file.name], 'dts/crm')
					});
					canUpload = false;
				} else if (CRMControlTicketEdit.fileSizeLimit > 0) {
					canUpload = helper.validateUploadLimitFileSize('nav-ticket', file.name, file.size, CRMControlTicketEdit.fileSizeLimit);
				}
				if (canUpload) {
					CRMControlTicketEdit.model.files.push(file);
				} else {
					CRMControlTicketEdit.model.file = null;
				}
			}

			if (CRMControlTicketEdit.isAttachmentType && $files.length > 0) {
				modalAttachmentTypeSelect.open(
					CRMControlTicketEdit.model.files
				).then(function (result) {

					CRMControlTicketEdit.model.files = result.selectedFiles;

				});
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				fields,
				isPlural,
				message,
				isValidDate,
				i,
				j;

			if (this.editMode === false) {
				if (this.isSubjectAsText === true) {
					if (!this.model.ttAssunto || !this.model.ttAssunto.num_id) {
						isInvalidForm = true;
						messages.push('l-subject');
					}
				} else {
					if (!this.model.nom_ocor || this.model.nom_ocor.trim().length === 0) {
						isInvalidForm = true;
						messages.push('l-subject');
					}
				}
			}

			if (!this.model.ttConta || !this.model.ttConta.num_id) {
				isInvalidForm = true;
				messages.push('l-account');
			}

			if (!this.model.ttTipo || !this.model.ttTipo.num_id) {
				isInvalidForm = true;
				messages.push('l-type');
			}

			if (!this.model.ttPrioridade || !this.model.ttPrioridade.num_id) {
				isInvalidForm = true;
				messages.push('l-priority');
			}

			if (!this.model.ttOrigem || !this.model.ttOrigem.num_id) {
				isInvalidForm = true;
				messages.push('l-origin');
			}

			if (!this.model.ttFluxo || !this.model.ttFluxo.num_id) {
				isInvalidForm = true;
				messages.push('l-flow');
			}

			if (!this.model.ttStatus || !this.model.ttStatus.num_id) {
				isInvalidForm = true;
				messages.push('l-status');
			}

			if (!this.model.ttRecurso || !this.model.ttRecurso.num_id) {
				isInvalidForm = true;
				messages.push('l-user-responsible');
			}

			if (!this.model.dsl_sit || this.model.dsl_sit.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-situation');
			}

			if (!this.model.dat_prev_fechto) {
				isInvalidForm = true;
				messages.push('l-closing-forecast');
			}

			if (this.editMode === true && this.model.ttStatus && this.model.ttStatus.log_encerra_ocor === true) {

				if (!this.model.dsl_soluc || this.model.dsl_soluc.trim().length === 0) {
					isInvalidForm = true;
					messages.push('l-solution');
				}
			}
			attributeHelper.isInvalidForm(this.customFields, function (result) {
				for (j = 0; j < result.length; j++) {
					if (CRMUtil.isDefined(result[j])) {
						messages.push(result[j]);
						isInvalidForm = true;
					}
				}
			});

			if (isInvalidForm) {

				fields = '';
				isPlural = messages.length > 1;
				message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i++) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			if (!isInvalidForm) {

				isValidDate = helper.equalsDate(new Date(this.model.dat_prev_fechto), new Date(), true);

				if (isValidDate < 0) {

					isInvalidForm = true;

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-ticket-close-before-record', [], 'dts/crm')
					});
				}
			}

			if (!isInvalidForm) {

				if (CRMControlTicketEdit.canSetPreviousDate === true && CRMControlTicketEdit.editMode !== true) {

					isValidDate = helper.equalsDate(new Date(CRMControlTicketEdit.model.dat_abert), CRMControlTicketEdit.model.dateTimeBase, true);

					if (isValidDate < 0) {

						isInvalidForm = true;

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-ticket-start-less-previous-date', [
								CRMControlTicketEdit.daysToOpenPreviously,
								$filter('date')(
									CRMControlTicketEdit.model.dateTimeBase,
									$rootScope.i18n('l-date-format', [], 'dts/crm')
								)
							], 'dts/crm')
						});

					}
				}
			}
			return isInvalidForm;
		};

		this.afterSave = function (ticket) {
			var fnAfter;

			fnAfter = function () {
				/* gambita para funcionar corretamente o anexo ao registrar uma ação após salvar a oportunidade */
				CRMControlTicketEdit.close(ticket);
				/**/
			};

			if (ticket) {

				$rootScope.$broadcast(CRMEvent.scopeSaveTicket, ticket);

				ticketFactory.getHistoryActionDefaults(ticket.num_id, (this.editMode === true ? true : false), function (result) {

					if (!result) {
						fnAfter();
						return;
					}

					result = result[0];

					if (result.log_reg_acao === false) {
					    fnAfter();
					    return;
					}

					var defaults = {},
						history;
					if (result.dsl_histor_acao && result.dsl_histor_acao.length > 0) {
						defaults.dsl_histor_acao = result.dsl_histor_acao + "\n" + "-" + "\n" + ticket.dsl_sit;
					}
					if (result.num_id_acao && result.num_id_acao > 0) {
						defaults.num_id_acao = result.num_id_acao;
					}
					if (result.num_id_campanha && result.num_id_acao > 0) {
						defaults.num_id_campanha = result.num_id_campanha;
					}
					if (result.num_id_mid && result.num_id_acao > 0) {
						defaults.num_id_mid = result.num_id_mid;
					}
					if (result.num_id_restdo && result.num_id_acao > 0) {
						defaults.num_id_restdo = result.num_id_restdo;
					}

					history = {
						ttOcorrenciaOrigem: ticket
					};

					/* gambita para funcionar corretamente o anexo ao registrar uma ação após salvar a oportunidade */
					CRMControlTicketEdit.isEnableAttachment = false;
					/**/

					modalHistoryEdit.open({
						defaults: defaults,
						history: history
					}).then(function () {
						fnAfter();
					}, function () {
						fnAfter();
					});


				});

			}
		};

		this.close = function (ticket) {

			if (CRMUtil.isUndefined(ticket)) { return; }

			$modalInstance.close(ticket);

			if (CRMControlTicketEdit.editMode === false || CRMControlTicketEdit.duplicateMode === true) {
				CRMControlTicketEdit.relocateToDetail(ticket);
			}
		};

		this.relocateToDetail = function (ticket) {
			$location.path('/dts/crm/ticket/detail/' + ticket.num_id);
		};

		/* Load data from webservice */

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: '*' + value + '*' };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlTicketEdit.listOfAccounts = result;
			});
		};

		this.getAccountByErpCode = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'cod_pessoa_erp', value: value };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlTicketEdit.listOfAccounts = result;
				if (CRMControlTicketEdit.listOfAccounts.length === 1) {
					CRMControlTicketEdit.model.ttConta = CRMControlTicketEdit.listOfAccounts[0];
				}
			});
		};
		this.getCauses = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_causa', value: '*' + value + '*' };
			causeFactory.typeahead(filter, undefined, function (result) {
				CRMControlTicketEdit.listOfCauses = result;
				if (CRMControlTicketEdit.listOfCauses.length === 1) {
					CRMControlTicketEdit.model.ttCausa = CRMControlTicketEdit.listOfCauses[0];
				}
			});
		};

		this.getSalesOrder = function (value) {
			if (!value || value === '') { return []; }

			var filters = [];

			filters.push(
				{ property: 'nr_ped_cli', value: value },
				{ property: 'nome_abrev', value: CRMControlTicketEdit.model.ttConta.nom_abrev }
			);

			if (CRMControlTicketEdit.representativeCode > 0) {
				filters.push({ property: 'num_id_repres', value: CRMControlTicketEdit.representativeCode });
			}

			salesOrderFactory.typeahead(filters, undefined, function (result) {
				CRMControlTicketEdit.listOfSalesOrder = result;
				if (CRMControlTicketEdit.listOfSalesOrder.length === 1) {
					CRMControlTicketEdit.model.ttPedVenda = CRMControlTicketEdit.listOfSalesOrder[0];
				}
			});
		};

		this.parseSalesOrder = function (value) {
			CRMControlTicketEdit.model.ttPedVenda = {
				"nr-pedcli": value
			};
		};

		this.getInvoices = function (value) {
			if (!value || value === '') { return []; }
			var filters = [];
			if (CRMControlTicketEdit.model.ttConta && CRMControlTicketEdit.model.ttConta.cod_pessoa_erp) {
				filters.push({property: 'cod_pessoa_erp', value: CRMControlTicketEdit.model.ttConta.cod_pessoa_erp });
			}
			if (value && CRMUtil.isDefined(value)) {
				filters.push({property: 'cod_nota_fis', value: value});
			}
			invoiceFactory.typeahead(filters, undefined, function (result) {
				CRMControlTicketEdit.listOfInvoices = result;
				if (CRMControlTicketEdit.listOfInvoices.length === 1) {
					CRMControlTicketEdit.model.ttNotaFiscal = CRMControlTicketEdit.listOfInvoices[0];
				}
			});
		};
		this.getInvoice = function (cod_nota_fis, cod_estab, cod_ser) {
			var filters = [];
			filters.push({property: 'cod_nota_fis', value: cod_nota_fis },
						 {property: 'cod_estab', value: cod_estab },
						 {property: 'cod_ser', value: cod_ser });
			invoiceFactory.typeahead(filters, undefined, function (result) {
				CRMControlTicketEdit.listOfInvoices = result;
				if (CRMControlTicketEdit.listOfInvoices.length === 1) {
					CRMControlTicketEdit.model.ttNotaFiscal = CRMControlTicketEdit.listOfInvoices[0];
				}
			});
		};
		this.getAccountsContacts = function () {

			var model = CRMControlTicketEdit.model;

			if (model && model.ttConta && model.ttConta.num_id > 0) {

				accountFactory.getContacts(model.ttConta.num_id, function (result) {

					CRMControlTicketEdit.listOfAccountContacts = result || [];

					var i, contact, contactDefault, contactToSelect;

					for (i = 0; i < CRMControlTicketEdit.listOfAccountContacts.length; i++) {

						contact = CRMControlTicketEdit.listOfAccountContacts[i];

						if (CRMControlTicketEdit.defaults.num_id_contat > 0 && CRMControlTicketEdit.defaults.num_id_contat === contact.num_id) {
							contactToSelect = contact;
							break;
						}

						if (model.num_id_contat === contact.num_id) {
							contactToSelect = contact;
							break;
						}

						if (CRMControlTicketEdit.editMode === false) {

							if (CRMControlTicketEdit.listOfAccountContacts.length === 1) {
								contactToSelect = contact;
								break;
							}

							if (contact.log_default === true) {
								contactDefault = contact;
							}
						}
					}

					model.ttContato = contactToSelect || contactDefault;
				});
			}
		};

		this.getSubjects = function () {
			if (this.isSubjectAsText === true) {

				if (this.isActiveRestrictSubject === true) { // assuntos do tipo de ocorrencia
					this.listOfSubjects = [];

					if (!this.model.ttTipo || !this.model.ttTipo.num_id) {
						return;
					}

					if (!this.editMode) { // somente assuntos ativos para o tipo da ocorrencia
						ticketTypeFactory.getSubjectsByTicketType(this.model.ttTipo.num_id, function (result) {
							if (!result || result.length < 1) {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'warning',
									title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
									detail: $rootScope.i18n('msg-not-found-subject-active-by-ticket-type', [], 'dts/crm')
								});
							}

							CRMControlTicketEdit.listOfSubjects = result || [];

							if (CRMControlTicketEdit.listOfSubjects.length >= 1) {
								CRMControlTicketEdit.model.ttAssunto = CRMControlTicketEdit.listOfSubjects[0];
							}
						}, 1);
					} else { // todos os assuntos por tipo da ocorrencia
						ticketTypeFactory.getSubjectsByTicketType(this.model.ttTipo.num_id, function (result) {

							if (!result || result.length < 1) {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'warning',
									title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
									detail: $rootScope.i18n('msg-not-found-subject-by-ticket-type', [], 'dts/crm')
								});
							}

							CRMControlTicketEdit.listOfSubjects = result || [];

							if (CRMControlTicketEdit.listOfSubjects.length >= 1) {
								CRMControlTicketEdit.model.ttAssunto = CRMControlTicketEdit.listOfSubjects[0];
							}
						}, 0);
					}

				} else { // todos os assuntos
					subjectFactory.getSubjects(function (result) {
						if (!result || result.length < 1) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'warning',
								title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-not-found-subject', [], 'dts/crm')
							});
						}

						CRMControlTicketEdit.listOfSubjects = result || [];
						if (CRMControlTicketEdit.listOfSubjects.length >= 1) {
							CRMControlTicketEdit.model.ttAssunto = CRMControlTicketEdit.listOfSubjects[0];
						}

					}, false, false);

				}
			}
		};

		this.getOrigins = function () {
			ticketOriginFactory.getAll(function (result) {
				CRMControlTicketEdit.listOfOrigins = result || [];
				if (CRMControlTicketEdit.listOfOrigins.length === 1) {
					CRMControlTicketEdit.model.ttOrigem = CRMControlTicketEdit.listOfOrigins[0];
					CRMControlTicketEdit.onChangeFlowDependencies();
				}
			});
		};

		this.getPriorities = function () {
			ticketPriorityFactory.getAll(function (result) {
				CRMControlTicketEdit.listOfPriorities = result || [];
				if (CRMControlTicketEdit.listOfPriorities.length === 1) {
					CRMControlTicketEdit.model.ttPrioridade = CRMControlTicketEdit.listOfPriorities[0];
					CRMControlTicketEdit.onChangeFlowDependencies();
				}

			});
		};

		this.getTicketsType = function (callback) {

			if (this.isActiveRestrictSubject === true && this.isSubjectAsText === true && this.editMode === true) {
				ticketTypeFactory.getTypesBySubject(this.model.num_id_assunto_ocor, function (result) {
					CRMControlTicketEdit.listOfTicketsType = result || [];
					if (CRMControlTicketEdit.listOfTicketsType.length === 1) {
						CRMControlTicketEdit.model.ttTipo = CRMControlTicketEdit.listOfTicketsType[0];
						CRMControlTicketEdit.onChangeFlowDependencies();
					}

					if (callback) { callback(); }
				});
			} else {
				if (this.editMode === true) {
					ticketTypeFactory.getAll(function (result) {
						CRMControlTicketEdit.listOfTicketsType = result || [];
						if (CRMControlTicketEdit.listOfTicketsType.length === 1) {
							CRMControlTicketEdit.model.ttTipo = CRMControlTicketEdit.listOfTicketsType[0];
							CRMControlTicketEdit.onChangeFlowDependencies();
						}

						if (callback) { callback(); }
					});
				} else {
					ticketTypeFactory.getTicketTypes(true, function (result) {
						CRMControlTicketEdit.listOfTicketsType = result || [];
						if (CRMControlTicketEdit.listOfTicketsType.length === 1) {
							CRMControlTicketEdit.model.ttTipo = CRMControlTicketEdit.listOfTicketsType[0];
							CRMControlTicketEdit.onChangeFlowDependencies();
						}

						if (callback) { callback(); }
					});
				}
			}

		};

		this.getResponsibles = function (isInit) {

			var i,
				model = CRMControlTicketEdit.model,
				account;

			this.listOfResponsibles	 = [];

			if (CRMControlTicketEdit.editMode !== true) {
				model.ttRecurso = undefined;
			}

			if (model.ttFluxo && model.ttFluxo.num_id && model.ttStatus && model.ttStatus.num_id) {

				account = model.ttConta ? model.ttConta.num_id : undefined;

				ticketFlowFactory.getResponsible(model.ttFluxo.num_id, model.ttStatus.num_id, account, function (result) {

					if (!result) { return; }

					if (result.length <= 0) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'warning',
							title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-not-found-responsibles', [], 'dts/crm')
						});
					}

					CRMControlTicketEdit.listOfResponsibles = result;

					if (!model.ttRecurso) {
						for (i = 0; i < result.length; i++) {

							if ($rootScope.currentuser['user-name'] === result[i].cod_usuario) {
								model.ttRecurso = CRMControlTicketEdit.listOfResponsibles[i];
								break;
							}
							if (result[i].log_livre_1 === true) {
								model.ttRecurso = CRMControlTicketEdit.listOfResponsibles[i];
							}
						}
					}

					if (CRMControlTicketEdit.listOfResponsibles.length === 1 && !model.ttRecurso) {
						model.ttRecurso = CRMControlTicketEdit.listOfResponsibles[0];
					}

					if (isInit !== true) {
						CRMControlTicketEdit.onChangeResponsible();
					}


				}, true);
			}
		};

		this.getStatus = function () {

			var i,
				model = CRMControlTicketEdit.model,
				idStatus;

			this.listOfStatus = [];

			if (model.ttFluxo && model.ttFluxo.num_id) {

				idStatus = model.ttStatus && model.ttStatus.num_id ? model.ttStatus.num_id : undefined;

				ticketFlowFactory.getStatus(model.ttFluxo.num_id, idStatus, function (result) {

					if (!result) { return; }

					CRMControlTicketEdit.listOfStatus = result;
					if (!model.ttStatus) {

						if (CRMControlTicketEdit.listOfStatus.length > 1) {
							/* TODO: (Lucas) Trazer o fluxo sempre ordenado pela sequencia. */
							var lowestSequence = { sequence: undefined, index: undefined };

							for (i = 0; i < CRMControlTicketEdit.listOfStatus.length; i++) {
								if (i === 0) {
									lowestSequence.sequence = CRMControlTicketEdit.listOfStatus[i].num_seq;
									lowestSequence.index = i;
								}

								if (lowestSequence.sequence > CRMControlTicketEdit.listOfStatus[i].num_seq) {
									lowestSequence.sequence = CRMControlTicketEdit.listOfStatus[i].num_seq;
									lowestSequence.index = i;
								}
							}
							model.ttStatus = CRMControlTicketEdit.listOfStatus[lowestSequence.index];
							CRMControlTicketEdit.onChangeStatus();
						} else if (CRMControlTicketEdit.listOfStatus.length === 1 && !CRMControlTicketEdit.ttStatus) {

							model.ttStatus = CRMControlTicketEdit.listOfStatus[0];
							CRMControlTicketEdit.onChangeStatus();
						} else if (CRMControlTicketEdit.listOfStatus.length <= 0) {

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type:   'warning',
								title:  $rootScope.i18n('nav-ticket', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-not-found-status', [], 'dts/crm')
							});
						}
					}

				}, true);
			}
		};

		/* Load data from webservice */

		/* On Events */

		this.onChangeAccount = function (selected) {

			if (selected) {
				CRMControlTicketEdit.model.ttConta = selected;
			}
			this.listOfAccountContacts = [];
			this.listOfSalesOrder = [];
			this.model.ttPedVenda = undefined;
			this.model.ttContato = undefined;
			if (CRMControlTicketEdit.model.ttConta && CRMControlTicketEdit.model.ttConta.num_id) {
				this.getAccountsContacts(CRMControlTicketEdit.model.ttConta);
			}
			/* Os posiveis responsaveis devem ter acesso a conta. */
			this.getResponsibles();
		};

		this.onChangeCause = function (selected) {
			if (selected) {
				CRMControlTicketEdit.model.ttCausa = selected;
			}
		};

		this.onChangeSalesOrder = function (selected) {
			if (selected) {
				CRMControlTicketEdit.model.ttPedVenda = selected;
			}
		};
		this.onChangeInvoice = function (selected) {
			if (selected) {
				CRMControlTicketEdit.model.ttNotaFiscal = selected;
				if (!CRMControlTicketEdit.model.ttConta) {
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: $rootScope.i18n('l-select-account', [], 'dts/crm'),
						cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
						confirmLabel: $rootScope.i18n('btn-select', [], 'dts/crm'),
						text: $rootScope.i18n('msg-confirm-change-account', [
							selected['nome-ab-cli']
						], 'dts/crm'),
						callback: function (isPositiveResult) {
							if (!isPositiveResult) {
								return;
							} else {
								CRMControlTicketEdit.getAccountByErpCode(selected['cod-emitente']);
							}
						}
					});
				}
			}
		};

		this.onChangeRating = function (isInit) {

			if (!isInit) {
				delete this.model.ttReferencia;
				delete this.model.ttComponente;
				delete this.model.ttVersao;
				delete this.model.ttComponente;
				delete this.model.ttProduto;
				delete this.model.cod_livre_2;
				delete this.model.val_livre_1;
				delete this.model.val_livre_2;
				delete this.model.dat_livre_1;
				this.listOfProducts = [];
			}
		};

		this.onChangeFlow = function () {
			if (this.duplicateMode !== true) {
				this.model.ttStatus		 = undefined;
			}
			this.model.ttRecurso = undefined;
			this.getStatus(); // -> onChangeStatus
		};

		this.onChangeStatus = function () {
			this.model.ttRecurso = undefined;
			this.getResponsibles(); // -> onChangeResponsible
		};

		this.onChangeResponsible = function () {
			CRMControlTicketEdit.getForecastClosingTicket();
			this.isChangePriority = false;
		};

		this.onChangePriority = function () {
			this.isChangePriority = true;
			CRMControlTicketEdit.getForecastClosingTicket();
		};

		this.onChangeClosingForecast = function (e) {
			CRMControlTicketEdit.canChangeClosingForecast = false;
		};

		this.getForecastClosingTicket = function () {

			var priority = CRMControlTicketEdit.model.ttPrioridade,
				flow = CRMControlTicketEdit.model.ttFluxo,
				status = CRMControlTicketEdit.model.ttStatus,
				resource = CRMControlTicketEdit.model.ttRecurso;

			if (flow && priority && status && resource) {
				if (CRMControlTicketEdit.canChangeClosingForecast && CRMControlTicketEdit.editMode === false) {
					CRMControlTicketEdit.loadClosingForecast(priority.num_id,
															flow.num_id,
															status.num_id,
															resource.num_id);
				} else {
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
						confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
						text: $rootScope.i18n('msg-confirm-change-closing-forecast', [], 'dts/crm'),
						callback: function (positiveResultCallback) {

							if (positiveResultCallback) {
								CRMControlTicketEdit.loadClosingForecast(priority.num_id,
																		flow.num_id,
																		status.num_id,
																		resource.num_id);
							}
						}
					});
				}
			}
		};

		this.loadClosingForecast = function (priority, flow, flowStatus, resource) {
            var now = new Date();
            
            /* contornar situacao onde o componente em tela aplica o timezone, e apos determinado horario altera o dia */
            now.setHours(0);
            now.setMinutes(0);
            now.setSeconds(0);
            now.setMilliseconds(0);

			ticketFactory.getForecastClosingTicket(priority, flow, flowStatus, resource, function (result) {
                
				CRMControlTicketEdit.model.dat_prev_fechto = now.setDate(now.getDate() + parseInt(result.previsao, 10));
				CRMControlTicketEdit.canChangeClosingForecast = true;
			});
		};

		this.getCustomFields = function (ticketId) {
			attributeFactory.getCustomFields(3, ticketId, function (result) {
				angular.forEach(result, function (data) {
					attributeHelper.parseAttribute(data, CRMControlTicketEdit.editMode);
					attributeHelper.parseAttributeType(data);
					data.dsl_atrib_json = JSON.parse(data.dsl_atrib_json);

					CRMControlTicketEdit.customFields.push(data);
				});
			});
		};

		this.onChangeType = function (isInit) {

			if (this.isSubjectAsText === true && this.isActiveRestrictSubject === true && this.editMode === false) {
				this.model.ttAssunto = undefined;
				this.getSubjects(function (result) {

				});
			}

			this.onChangeFlowDependencies(isInit);
		};

		this.onChangeFlowDependencies = function (isInit) {

			CRMControlTicketEdit.listOfFlows = [];

			var model = this.model,
				isTipo,
				isVersao,
				isOrigem,
				isSubject,
				isPrioridade;

			if (isInit !== true) {
				model.ttFluxo = undefined;
				model.ttStatus = undefined;
				model.ttResponsavel = undefined;
			}

			if (angular.isUndefined(model.ttOrigem) || angular.isUndefined(model.ttOrigem.num_id)) {
				isOrigem = false;
			} else {
				isOrigem = true;
			}

			if (angular.isUndefined(model.ttPrioridade) || angular.isUndefined(model.ttPrioridade.num_id)) {
				isPrioridade = false;
			} else {
				isPrioridade = true;
			}

			if (angular.isUndefined(model.ttTipo) || angular.isUndefined(model.ttTipo.num_id)) {
				isTipo = false;
			} else {
				isTipo = true;
			}

			if (angular.isUndefined(model.ttVersao) || angular.isUndefined(model.ttVersao.num_id)) {
				isVersao = false;
			} else {
				isVersao = true;
			}

			if (isOrigem && isPrioridade && isTipo) {
				ticketFlowFactory.getFlow(
					model.ttOrigem.num_id,
					model.ttTipo.num_id,
					model.ttPrioridade.num_id,
					isVersao ? model.ttVersao.num_id : undefined,
					function (result) {

						if (result && result.length > 0) {
							CRMControlTicketEdit.listOfFlows = result;

							if (CRMControlTicketEdit.listOfFlows.length === 1 && !model.ttFluxo) {

								model.ttFluxo = CRMControlTicketEdit.listOfFlows[0];
								CRMControlTicketEdit.onChangeFlow();
							}

						} else {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'warning',
								title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-not-found-flow', [], 'dts/crm')
							});
						}

					}
				);
			}
		};

		this.addEditProduct = function () {
			var i;

			if (this.listOfProducts.length >= this.productQuantity) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-max-product-quantity', [
						this.productQuantity
					], 'dts/crm')
				});

				return;
			}

			modalTicketProductEdit.open({
				isAddTicket: true,
				productsCount: this.listOfProducts ? this.listOfProducts.length : 0
			}).then(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControlTicketEdit.listOfProducts.push(result[i]);
					}
				}
			});
		};

		this.editProduct  = function (index) {
			var i,
				product;

			if (index >= 0) {
				product = angular.copy(this.listOfProducts[index]);
			}

			modalTicketProductEdit.open({
				isAddTicket: true,
				isEditMode: true,
				product: product
			}).then(function (result) {
				if (result && result.length) {
					CRMControlTicketEdit.listOfProducts[index] = result[0];
				}
			});
		};

		this.removeProduct = function (index) {
			this.listOfProducts.splice(index, 1);
		};

		this.newAccountContact = function () {
			modalContactEdit.open({
				related: CRMControlTicketEdit.model.ttConta
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlTicketEdit.contacts = CRMControlTicketEdit.listOfAccountContacts || [];
					CRMControlTicketEdit.listOfAccountContacts.push(result);
					CRMControlTicketEdit.model.ttContato = result;
				}
			});
		};

		this.getRepresentative = function () {
			salesOrderFactory.getRepresentativeCode(function (result) {
				if (result && result[0] && result[0].num_id) {
					CRMControlTicketEdit.representativeCode = result[0].num_id;
				}
			});
		};

		/* Others */
		this.generateModalTitle = function () {
			CRMControlTicketEdit.modalTitle = "";
			if (CRMControlTicketEdit.editMode === true) {
				CRMControlTicketEdit.modalTitle = CRMControlTicketEdit.model.cod_livre_1 + " - " + CRMControlTicketEdit.model.nom_ocor;
			} else if (CRMControlTicketEdit.duplicateMode === true) {
				CRMControlTicketEdit.modalTitle = CRMControlTicketEdit.model.cod_livre_1 + " - " + $rootScope.i18n('btn-duplicate', [], 'dts/crm');
			} else {
				CRMControlTicketEdit.modalTitle = CRMControlTicketEdit.model.cod_livre_1 + " - " + $rootScope.i18n('btn-new-ticket', [], 'dts/crm');
			}
		};
		/* Others */

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket.edit', $rootScope.currentuser.login, function (result) {
				CRMControlTicketEdit.accessRestriction = result || {};
			});

			this.loadPreferences(function () {

				CRMControlTicketEdit.validadeParameterModel();
				CRMControlTicketEdit.validateParameters();

				CRMControlTicketEdit.getAccountsContacts();

				CRMControlTicketEdit.getPriorities();

				CRMControlTicketEdit.getTicketsType(function (result) {
					CRMControlTicketEdit.getSubjects();
				});

				CRMControlTicketEdit.getOrigins();
				CRMControlTicketEdit.onChangeFlowDependencies(true);


				CRMControlTicketEdit.getStatus();
				CRMControlTicketEdit.getResponsibles(true);
				CRMControlTicketEdit.getCustomFields(CRMControlTicketEdit.model.num_id);
				CRMControlTicketEdit.getRepresentative();

				if (CRMControlTicketEdit.model.cod_ped_clien) {
					CRMControlTicketEdit.parseSalesOrder(CRMControlTicketEdit.model.cod_ped_clien);
				}
				if (CRMControlTicketEdit.model.cod_nota_fisc) {
					CRMControlTicketEdit.getInvoice(CRMControlTicketEdit.model.cod_nota_fisc, CRMControlTicketEdit.model.cod_estab, CRMControlTicketEdit.model.cod_ser);
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.ticket ? angular.copy(parameters.ticket) : {};

		this.isReopen = CRMUtil.isDefined(parameters.isReopen) ? parameters.isReopen : false;
		this.duplicateMode = CRMUtil.isDefined(parameters.duplicateMode) ? parameters.duplicateMode : false;
		this.editMode = CRMUtil.isDefined(parameters.editMode) ? parameters.editMode : false;
		this.defaults = CRMUtil.isDefined(parameters.defaults) ? parameters.defaults : {};

		$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdTicket, false);

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			$rootScope.$broadcast(CRMEvent.scopeFileSelectAddUpdTicket, true);
			CRMControlTicketEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerTicketEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'TOTVSEvent', 'parameters',
		'crm.legend', 'crm.crm_ocor.factory', 'crm.helper', 'crm.ticket.helper',
		'crm.crm_anexo.factory', 'crm.crm_assunto_ocor.factory', 'crm.crm_pessoa.conta.factory',
		'crm.crm_classificacao_ocor.factory', 'crm.crm_priorid_ocor.factory', 'crm.crm_tip_ocor.factory',
		'crm.crm_orig_ocor.factory', 'crm.crm_ocor_fluxo.factory', 'crm.crm_refer.factory',
		'crm.ticket.modal.edit', 'crm.crm_produt.factory', 'crm.crm_param.factory', 'crm.crm_causa_ocor.factory', '$timeout', 'crm.history.modal.edit', 'crm.account-contact.modal.edit', '$location', 'crm.crm_atrib.factory', 'crm.attribute.helper', 'crm.mpd_pedvenda.factory', 'crm.nota_fiscal.factory',
		'crm.attachment-type.select.modal.control', 'crm.attachment.helper', 'crm.ticket.product.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket.modal.edit', modalTicketEdit);
	index.register.controller('crm.ticket.edit.control', controllerTicketEdit);

});
