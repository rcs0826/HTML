/*global $, index, angular, define, TOTVSEvent, CRMEvent*/
define([
	'index',
	'/dts/crm/js/api/fchcrm1050.js',
    '/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/crm-services.js',
	'css!/dts/crm/js/libs/3rdparty/ng-tags/ng-tags-input.min.css',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-tags/ng-tags-input.min.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	// *************************************************************************************
	// *** MODAL SEND E-MAIL
	// *************************************************************************************
	modalSendEmail.$inject = ['$modal'];
	function modalSendEmail($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/e-mail/e-mail.edit.html',
				controller: 'crm.email.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	}

	// *************************************************************************************
	// *** MODAL RECIPIENT E-MAIL
	// *************************************************************************************
	modalRecipientEmail.$inject = ['$modal'];
	function modalRecipientEmail($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/e-mail/e-mail.recipient.html',
				controller: 'crm.email.recipient.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	}

	// *************************************************************************************
	// *** CONTROLLER MODAL
	// *************************************************************************************
	controllerSendEmail.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'TOTVSEvent', 'parameters',
		'crm.recipient-email.modal', 'crm.crm_pessoa.conta.factory', 'crm.crm_usuar.factory', 'crm.helper',
		'crm.crm_email.factory', 'crm.crm_param.factory', 'crm.crm_pessoa.contato.factory', 'crm.crm_anexo.factory',
		'crm.crm_tar.factory', 'crm.crm_histor_acao.factory', 'crm.crm_ocor.factory', 'crm.crm_acess_portal.factory'
	];
	function controllerSendEmail($rootScope, $scope, $modalInstance, $filter, TOTVSEvent, parameters,
								 modalRecipientEmail, accountFactory, userFactory, helper,
								 emailFactory, preferenceFactory, contactFactory, attachmentFactory,
								 taskFactory, historyFactory, ticketFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlSendEmail = this;

        this.accessRestriction = undefined;
		this.model             = undefined;
		this.idLayoutDefault   = 0;
		this.notifyResponsible = undefined;
		this.notifyAccount     = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.send = function () {

			if (this.isInvalidForm()) { return; }

			//Anexos
			if (CRMControlSendEmail.model.files && CRMControlSendEmail.model.files.length > 0) {
				var voAttachment = [];
				emailFactory.returnAttachmentSequence(function (result) {
					if (!result) { return; }
					var j = 0;
					for (var i = 0; i < CRMControlSendEmail.model.files.length; i++) {
						var i_sequence = result.i_sequence;
						attachmentFactory.upload(3, result.i_sequence, CRMControlSendEmail.model.files[i], null, function (result) {
							j= j + 1;
							if (i === j) {
								CRMControlSendEmail.sendEmail(i_sequence);
							}
						});
					}
				});
			} else {
				CRMControlSendEmail.sendEmail(0);
			}
		}

		this.sendEmail = function (attachmentSequence) {

			var vo = this.convertToSave();

			if (!vo) { return; }

			vo.id_anexos = attachmentSequence;

			if (ttOportunidadeOrigem) {
				emailFactory.sendEmail(ttOportunidadeOrigem.num_id, "OPORTUN", vo, function (result) {
					if (!result) { return; }
					$modalInstance.close();
				});
			}

			if (ttTarefaOrigem) {
				emailFactory.sendEmail(ttTarefaOrigem.num_id, "TAREFA", vo, function (result) {
					if (!result) { return; }
					$modalInstance.close();
				});
			}

			if (ttOcorrenciaOrigem) {
				emailFactory.sendEmail(ttOcorrenciaOrigem.num_id, "OCOR", vo, function (result) {
					if (!result) { return; }
					$modalInstance.close();
				});
			}

			if (ttAcaoOrigem) {
				emailFactory.sendEmail(ttAcaoOrigem.num_id, "ACAO", vo, function (result) {
					if (!result) { return; }
					$modalInstance.close();
				});
			}

			if (ttContaOrigem) {
				emailFactory.sendEmail(ttContaOrigem.num_id, "CONTA", vo, function (result) {
					if (!result) { return; }
					$modalInstance.close();
				});
			}
		}

		this.convertToSave = function () {

			var vo = {};

			vo.c_para = this.model.recipientTo;
			vo.c_cc = this.model.recipientCopy;
			vo.c_anexos = this.model.files;
			vo.c_assunto = this.model.des_email;
			vo.c_descricao = this.model.dsl_email;
			vo.c_id_layout = this.idLayoutDefault;

			return vo;
		}

		this.isInvalidForm = function () {

			var messages = [];
			var isInvalidForm = false;

			if (!this.model.recipientTo) {
				isInvalidForm = true;
				messages.push('l-email-to');
			}

			if (!this.model.des_email) {
				isInvalidForm = true;
				messages.push('l-subject');
			}

			if (isInvalidForm) {

				var fields 	 = '';

				var isPlural = messages.length > 1;

				var message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (var i = 0; i < messages.length; i++) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-sending-email', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			return isInvalidForm;
		}

		this.openListRecipient = function (recipientType) {
			modalRecipientEmail.open({
				email: {
					type: recipientType
				}
			}).then(function (selectedEmails) {
				if (!selectedEmails) { return; }

				if (recipientType === 1) {
					for (var i = 0; i < selectedEmails.length; i++) {
						CRMControlSendEmail.addRecipientTo();
						if (selectedEmails[i].nom_email_1 !== "") {
							CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + selectedEmails[i].nom_email_1;
						}
						else {
							if (selectedEmails[i].nom_email_2 !== "") {
								CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + selectedEmails[i].nom_email_2;
							}
						}
					}
				}

				if (recipientType === 2) {
					for (var i = 0; i < selectedEmails.length; i++) {
						CRMControlSendEmail.addRecipientCopy();
						if (selectedEmails[i].nom_email_1 !== "") {
							CRMControlSendEmail.model.recipientCopy = CRMControlSendEmail.model.recipientCopy + selectedEmails[i].nom_email_1;
						}
						else {
							if (selectedEmails[i].nom_email_2 !== "") {
								CRMControlSendEmail.model.recipientCopy = CRMControlSendEmail.model.recipientCopy + selectedEmails[i].nom_email_2;
							}
						}
					}
				}

			});
		}

		this.loadPreferences = function () {

			preferenceFactory.getPreferenceAsBoolean('LOG_NOTIFICA_CLIENTE',function (result) {
				CRMControlSendEmail.notifyAccount = result || false;
				if (CRMControlSendEmail.notifyAccount === true) {
					if (ttTarefaOrigem) {
						if ((ttTarefaOrigem.ttConta.nom_email_1 !== "") || (ttTarefaOrigem.ttConta.nom_email_2 !== ""))
							CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo +
							(ttTarefaOrigem.ttConta.nom_email_1 ? ttTarefaOrigem.ttConta.nom_email_1 : ttTarefaOrigem.ttConta.nom_email_2);
					}
					if (ttOportunidadeOrigem) {
						if ((ttOportunidadeOrigem.ttConta.nom_email_1 !== "") || (ttOportunidadeOrigem.ttConta.nom_email_2 !== ""))
							CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo +
							(ttOportunidadeOrigem.ttConta.nom_email_1 ? ttOportunidadeOrigem.ttConta.nom_email_1 : ttOportunidadeOrigem.ttConta.nom_email_2);
					}
					if (ttContaOrigem) {
						if ((ttContaOrigem.nom_email_1 !== "") || (ttContaOrigem.nom_email_2 !== ""))
							CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo +
																  (ttContaOrigem.nom_email_1 ? ttContaOrigem.nom_email_1 : ttContaOrigem.nom_email_2);
					}
					if (ttAcaoOrigem) {
						if ((ttAcaoOrigem.ttConta.nom_email_1 !== "") || (ttAcaoOrigem.ttConta.nom_email_2 !== ""))
							CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo +
							(ttAcaoOrigem.ttConta.nom_email_1 ? ttAcaoOrigem.ttConta.nom_email_1 : ttAcaoOrigem.ttConta.nom_email_2);
					}
					if (ttOcorrenciaOrigem) {
						if ((ttOcorrenciaOrigem.ttConta.nom_email_1 !== "") || (ttOcorrenciaOrigem.ttConta.nom_email_2 !== ""))
							CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo +
							(ttOcorrenciaOrigem.ttConta.nom_email_1 ? ttOcorrenciaOrigem.ttConta.nom_email_1 : ttOcorrenciaOrigem.ttConta.nom_email_2);
					}
				}
			});

			preferenceFactory.getPreferenceAsBoolean('NOTIFICA_RESP',function (result) {
				CRMControlSendEmail.notifyResponsible = result || false;
				if (CRMControlSendEmail.notifyResponsible === true) {
					if (ttTarefaOrigem) {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + ttTarefaOrigem.ttResponsavel.nom_email;
					}
					if (ttOportunidadeOrigem) {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + ttOportunidadeOrigem.ttResponsavel.nom_email;
					}
					if (ttContaOrigem) {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + ttContaOrigem.ttResponsavel.nom_email;
					}
					if (ttAcaoOrigem) {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + ttAcaoOrigem.ttUsuarioAbertura.nom_email;
					}
					if (ttOcorrenciaOrigem) {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + ttOcorrenciaOrigem.ttRecurso.nom_email;
					}
				}
			});

			// Tarefa
			if (ttTarefaOrigem) {
				preferenceFactory.getPreferenceAsInteger('NUM_ID_LAYOUT_MAIL',function (result) {
					CRMControlSendEmail.idLayoutDefault = result || 0;
				});
			}

			// Oportunidade
			if (ttOportunidadeOrigem) {
				preferenceFactory.getPreferenceAsInteger('LAYOUT_EMAIL_OPOR',function (result) {
					CRMControlSendEmail.idLayoutDefault = result || 0;
				});
			}

			// Ocorrencia
			if (ttOcorrenciaOrigem) {
				preferenceFactory.getPreferenceAsInteger('LAYOUT_EMAIL_OCOR',function (result) {
					CRMControlSendEmail.idLayoutDefault = result || 0;
				});
			}

			// Acao
			if (ttAcaoOrigem) {
				preferenceFactory.getPreferenceAsInteger('LAYOUT_EMAIL_RELAC',function (result) {
					CRMControlSendEmail.idLayoutDefault = result || 0;
				});
			}
		}

		this.addRecipientTo = function () {

			if (CRMUtil.isUndefined(CRMControlSendEmail.model.recipientTo)) {
				CRMControlSendEmail.model.recipientTo = "";
			} else {
				if (CRMControlSendEmail.model.recipientTo !== "") {
					CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + ",";
				}
			}
		}

		this.addRecipientCopy = function () {
			if (CRMUtil.isUndefined(CRMControlSendEmail.model.recipientCopy)) {
				CRMControlSendEmail.model.recipientCopy = "";
			} else {
				if (CRMControlSendEmail.model.recipientCopy !== "") {
					CRMControlSendEmail.model.recipientCopy = CRMControlSendEmail.model.recipientCopy + ",";
				}
			}
		}

		this.loadFocalContact = function () {

			// Tarefa
			if (ttTarefaOrigem && ttTarefaOrigem.num_id_contat) {
				var filter = { property: 'num_id', value: ttTarefaOrigem.num_id_contat};
				contactFactory.typeahead(filter, undefined, function (result) {
					var contact = result[0];
					if (!contact) { return; }
					if (contact.nom_email_1 !== "") {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_1;
					}
					else {
						if (contact.nom_email_2 !== "") {
							CRMControlSendEmail.addRecipientTo();
							CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_2;
						}
					}
				});
			}

			// Ocorrencia
			if (ttOcorrenciaOrigem && ttOcorrenciaOrigem.num_id_contat) {
				var filter = { property: 'num_id', value: ttOcorrenciaOrigem.num_id_contat};
				contactFactory.typeahead(filter, undefined, function (result) {
					var contact = result[0];
					if (!contact) { return; }
					if (contact.nom_email_1 !== "") {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_1;
					}
					else {
						if (contact.nom_email_2 !== "") {
							CRMControlSendEmail.addRecipientTo();
							CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_2;
						}
					}
				});
			}

			// Conta
			if (ttContaOrigem && ttContaOrigem.num_id_pto_focal) {
				var filter = { property: 'num_id', value: ttContaOrigem.num_id_pto_focal};
				contactFactory.typeahead(filter, undefined, function (result) {
					var contact = result[0];
					if (!contact) { return; }
					if (contact.nom_email_1 !== "") {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_1;
					}
					else {
						if (contact.nom_email_2 !== "") {
							CRMControlSendEmail.addRecipientTo();
							CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_2;
						}
					}
				});
			}

			// Acao
			if (ttAcaoOrigem && ttAcaoOrigem.num_id_contat) {
				var filter = { property: 'num_id', value: ttAcaoOrigem.num_id_contat};
				contactFactory.typeahead(filter, undefined, function (result) {
					var contact = result[0];
					if (!contact) { return; }
					if (contact.nom_email_1 !== "") {
						CRMControlSendEmail.addRecipientTo();
						CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_1;
					}
					else {
						if (contact.nom_email_2 !== "") {
							CRMControlSendEmail.addRecipientTo();
							CRMControlSendEmail.model.recipientTo = CRMControlSendEmail.model.recipientTo + contact.nom_email_2;
						}
					}
				});
			}
		}

		this.loadSubjectAndDescription = function () {

			var dateFormat = $rootScope.i18n('l-date-format', [], 'dts/crm');

			if (ttTarefaOrigem) {
				taskFactory.getDescription(ttTarefaOrigem.num_id, function (result) {
					ttTarefaOrigem.dsl_motivo = result.dsl_motivo;
					CRMControlSendEmail.model.des_email = "Notificação de Tarefa: " + ttTarefaOrigem.num_id;
					CRMControlSendEmail.model.dsl_email = "Prezado," +
									"\n\nConta: " + ttTarefaOrigem.ttConta.nom_razao_social +
									"\nA tarefa " + ttTarefaOrigem.num_id + " - " + ttTarefaOrigem.ttAcao.nom_acao +
									" foi registrada em nosso sistema." + 
									"\nDescrição da tarefa: " + (ttTarefaOrigem.dsl_motivo ? ttTarefaOrigem.dsl_motivo : '') +
									"\nData: " + $filter('date')(ttTarefaOrigem.dat_inic, dateFormat).toString() +
									" às " + ttTarefaOrigem.hra_inic + 
									"\nResponsável: " + ttTarefaOrigem.ttResponsavel.nom_usuar +
									"\nUsuário de cadastro: " + ttTarefaOrigem.ttUsuarioAbertura.nom_usuar +
									"\nData de cadastro: " + $filter('date')(ttTarefaOrigem.dat_cadastro, dateFormat).toString() +
									" - " + ttTarefaOrigem.hra_cadastro;
				});
			}

			if (ttOcorrenciaOrigem) {
				ticketFactory.getSituation(ttOcorrenciaOrigem.num_id, function(result) {
					ttOcorrenciaOrigem.dsl_sit = result.dsl_sit;
					console.log(ttOcorrenciaOrigem.dsl_sit);
					CRMControlSendEmail.model.des_email = "Notificação de Ocorrência: " + ttOcorrenciaOrigem.num_id + " - " + ttOcorrenciaOrigem.nom_ocor;
					CRMControlSendEmail.model.dsl_email = "Descrição da Ocorrência: " + (ttOcorrenciaOrigem.dsl_sit ? ttOcorrenciaOrigem.dsl_sit : '' ) +
									"\nConta: " + ttOcorrenciaOrigem.ttConta.nom_razao_social +
									"\nStatus: " + ttOcorrenciaOrigem.ttStatus.nom_status_ocor +
									"\nResponsável: " + ttOcorrenciaOrigem.ttRecurso.nom_usuar +
									"\nData de cadastro: " + $filter('date')(ttOcorrenciaOrigem.dat_abert, dateFormat).toString() +
									"\nUsuário de cadastro: " + ttOcorrenciaOrigem.ttUsuarioAbertura.nom_usuar +
									"\nPrevisão de Fechamento: " + $filter('date')(ttOcorrenciaOrigem.dat_prev_fechto, dateFormat).toString();
				});
			}

			if (ttOportunidadeOrigem) {
				CRMControlSendEmail.model.des_email = "Notificação de Oportunidade: " + ttOportunidadeOrigem.num_id + " - " + ttOportunidadeOrigem.des_oportun_vda;
				CRMControlSendEmail.model.dsl_email = "Descrição da Oportunidade: " + (ttOportunidadeOrigem.dsl_oportun_vda ? ttOportunidadeOrigem.dsl_oportun_vda : '') +
								"\nConta: " + ttOportunidadeOrigem.ttConta.nom_razao_social +
								"\nFase: " + ttOportunidadeOrigem.ttFaseDesenvolvimento.des_fase +
								"\nResponsável: " + ttOportunidadeOrigem.ttResponsavel.nom_usuar +
								"\nData de cadastro: " + $filter('date')(ttOportunidadeOrigem.dat_cadastro, dateFormat).toString() +
								"\nUsuário de cadastro: " + ttOportunidadeOrigem.ttUsuarioAbertura.nom_usuar +
								"\nPrevisão de Fechamento: " + (ttOportunidadeOrigem.dat_prev_fechto ? $filter('date')(ttOportunidadeOrigem.dat_prev_fechto, dateFormat).toString() : '') +
								"\nFechamento: " + (ttOportunidadeOrigem.dat_fechto_oportun ? $filter('date')(ttOportunidadeOrigem.dat_fechto_oportun, dateFormat).toString() : '');
			}

			if (ttAcaoOrigem) {
				historyFactory.getDescription(ttAcaoOrigem.num_id, function(result) {
					ttAcaoOrigem.dsl_histor_acao = result.dsl_histor_acao || '';
					CRMControlSendEmail.model.des_email = "Notificação de Ação: " + ttAcaoOrigem.num_id;
					CRMControlSendEmail.model.dsl_email = "Prezado," +
									"\n\nConta: " + ttAcaoOrigem.ttConta.nom_razao_social +
									"\nA ação " + ttAcaoOrigem.num_id + " - " + ttAcaoOrigem.ttAcao.nom_acao +
									" foi registrada em nosso sistema." + 
									"\nDescrição da ação: " + (ttAcaoOrigem.dsl_histor_acao ? ttAcaoOrigem.dsl_histor_acao : '') +
									"\nUsuário de cadastro: " + ttAcaoOrigem.ttUsuarioAbertura.nom_usuar +
									"\nData de cadastro: " + $filter('date')(ttAcaoOrigem.dat_cadastro, dateFormat).toString();
				});
			}

		}

		this.close = function () {
			$modalInstance.dismiss('cancel');
		}

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************


		this.model = parameters.model;

		var ttOcorrenciaOrigem = CRMControlSendEmail.model.ttOcorrenciaOrigem;
		var ttOportunidadeOrigem = CRMControlSendEmail.model.ttOportunidadeOrigem;
		var ttTarefaOrigem = CRMControlSendEmail.model.ttTarefaOrigem;
		var ttContaOrigem = CRMControlSendEmail.model.ttContaOrigem;
		var ttAcaoOrigem = CRMControlSendEmail.model.ttAcaoOrigem;

		if (CRMUtil.isUndefined(CRMControlSendEmail.model.recipientTo) || CRMControlSendEmail.recipientTo === "") {
			CRMControlSendEmail.model.recipientTo = "";
		}

		if (CRMUtil.isUndefined(CRMControlSendEmail.model.recipientCopy) || CRMControlSendEmail.recipientCopy === "") {
			CRMControlSendEmail.model.recipientCopy = "";
		}

		helper.loadCRMContext(function() {
            
            accessRestrictionFactory.getUserRestrictions('e-mail.edit', $rootScope.currentuser.login, function (result) {
                CRMControlSendEmail.accessRestriction = result || {};
            });


			CRMControlSendEmail.loadPreferences();
			CRMControlSendEmail.loadFocalContact();
			CRMControlSendEmail.loadSubjectAndDescription();

		});


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlSendEmail = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	}

	// *************************************************************************************
	// *** CONTROLLER MODAL RECIPIENT
	// *************************************************************************************
	controllerRecipientEmail.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters',
		'crm.crm_pessoa.conta.factory', 'crm.crm_usuar.factory'
	];
	function controllerRecipientEmail($rootScope, $scope, $modalInstance, $filter, parameters,
								 accountFactory, userFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlRecipientEmail = this;

		this.model 		= undefined;
		this.accounts   = [];
		this.leads   = [];
		this.users   = [];
		this.recipientType = {id: 1, name: "Conta"};

		this.listOfRecipient = [];

		this.recipientTypes = [{id: 1, name: "Conta"},
							   {id: 2, name: "Lead"},
							   {id: 3, name: "Usuário"}];


		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {
			$modalInstance.close(CRMControlRecipientEmail.listOfRecipient);
		}

		this.onChangeRecipientType = function () {
			CRMControlRecipientEmail.recipient = undefined;
			CRMControlRecipientEmail.accounts = [];
			CRMControlRecipientEmail.leads = [];
			CRMControlRecipientEmail.users = [];
		}

		this.getAccounts = function (value) {
			if (!value || value == '') return [];
			var filter = [{ property: 'custom.nom_email', value: value },
						  { property: 'log_in_clien', value: true}];
			accountFactory.typeahead(filter, undefined, function (result) {
				var accounts = result;
				var emails = [];
				for (var i = 0; i < accounts.length; i++) {
					if (accounts[i].nom_email_1 !== "") {
						emails.push(accounts[i]);
						CRMControlRecipientEmail.accounts = emails;
					}
					else {
						if (accounts[i].nom_email_2 !== "") {
							emails.push(accounts[i]);
							CRMControlRecipientEmail.accounts = emails;
						}
					}
				}
			});
		}

		this.getLeads = function (value) {
			if (!value || value == '') return [];
			var filter = [{ property: 'custom.nom_email', value: value },
						  { property: 'log_in_clien', value: false},
						  { property: 'idi_tip_cta', value: 1} ];
			accountFactory.typeahead(filter, undefined, function (result) {
				var leads = result;
				var emails = [];
				for (var i = 0; i < leads.length; i++) {
					if (leads[i].nom_email_1 !== "") {
						emails.push(leads[i]);
						CRMControlRecipientEmail.leads = emails;
					}
					else {
						if (leads[i].nom_email_2 !== "") {
							emails.push(leads[i]);
							CRMControlRecipientEmail.leads = emails;
						}
					}
				}
			});
		}

		this.getUsers = function (value) {
			if (!value || value == '') return [];
			var filter = { property: 'custom.nom_email', value: value };
			userFactory.typeahead(filter, undefined, function (result) {
				var users = result;
				var emails = [];
				for (var i = 0; i < users.length; i++) {
					if (users[i].nom_email !== "") {
						emails.push(users[i]);
						CRMControlRecipientEmail.users = emails;
					}
				}
			});
		}

		this.addRecipientToList = function (recipient) {
			if (!recipient || recipient == '') return [];
			if (CRMUtil.isDefined(recipient.nom_razao_social)) {
				var recipientToAdd = {
					nom_razao_social: recipient.nom_razao_social,
					nom_email_1: (recipient.nom_email_1 ? recipient.nom_email_1 : recipient.nom_email_2)
				};
			}
			else {
				var recipientToAdd = {
					nom_razao_social: recipient.nom_usuar,
					nom_email_1: recipient.nom_email
				};
			}
			CRMControlRecipientEmail.listOfRecipient.push(recipientToAdd);
		}

		this.remove = function (recipient) {

			var index = CRMControlRecipientEmail.listOfRecipient.indexOf(recipient);
			if (index != -1) {
				CRMControlRecipientEmail.listOfRecipient.splice(index, 1);
			}

		}

		this.close = function () {
			$modalInstance.dismiss('cancel');
		}

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.model;

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlRecipientEmail = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	}

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.send-email.modal', modalSendEmail);
	index.register.service('crm.recipient-email.modal', modalRecipientEmail);


	index.register.controller('crm.email.control', controllerSendEmail);
	index.register.controller('crm.email.recipient.control', controllerRecipientEmail);
});
