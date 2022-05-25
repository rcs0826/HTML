/*globals angular, index, define, TOTVSEvent, CRMURL, CRMEvent*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/attachment/attachment-type-services.select.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	// *************************************************************************************
	// *** CONTROLLER TAB
	// *************************************************************************************

	var controllerAttachmentTab = function ($rootScope, $scope, TOTVSEvent, attachmentFactory, helper, modalAttachmentTypeSelect, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAttachmentTab = this;

		this.listOfAttachment = [];
		this.listOfAttachmentCount = 0;

		this.type		= undefined;
		this.idRecord	= undefined;

		this.isEnabled = true;
		this.isBlock   = false;

		this.isAttachmentType = false;

		this.fileSizeLimit = 0;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.addAttachmentInList = function (attachments, isNew) {

			if (!attachments) { return; }

			var attachment, i;

			if (!angular.isArray(attachments)) {
				attachments = [attachments];
				CRMControlAttachmentTab.listOfAttachmentCount += 1;
			}

			for (i = 0; i < attachments.length; i += 1) {

				attachment = attachments[i];

				if (attachment && attachment.$length) {
					CRMControlAttachmentTab.listOfAttachmentCount = attachment.$length;
				}

				attachment.idi_status = (attachment.log_existe ? 4 : 3);
				attachment.nom_progresso = '100%';

				CRMControlAttachmentTab.parseDownloadURL(attachment);

				if (isNew !== true) {
					CRMControlAttachmentTab.listOfAttachment.push(attachment);
				} else {
					CRMControlAttachmentTab.listOfAttachment.unshift(attachment);
				}
			}
		};

		this.search = function (isMore) {

			var filters,
				options;

			CRMControlAttachmentTab.listOfAttachmentCount = 0;

			if (!isMore) {
				CRMControlAttachmentTab.listOfAttachment = [];
			}

			options = { start: CRMControlAttachmentTab.listOfAttachment.length, end: 50};

			//if (!this.type || !this.idRecord) {
			//	console.erro('Os filtros obrigatórios não foram informados.');
			//}

			filters = [
				{ property: 'idi_tip_anexo',	value: this.type},
				{ property: 'num_id_reg',		value: this.idRecord}
			];

			attachmentFactory.findRecords(filters, options, CRMControlAttachmentTab.addAttachmentInList);
		};

		this.onSelectFiles = function ($files, onProgress) {

			var successCallback,
				progressCallback,
				errorCallback,
				attachment,
				addAttachment,
				file,
				i,
				canUpload,
				selectedFiles = [];

			/*
				idi_status : 0 - em espera
							 1 - enviando
							 2 - enviado
							 3 - erro
							 4 - processado
			*/

			successCallback = function (result, attachmentInstance) {

				if (result) {

					CRMControlAttachmentTab.parseDownloadURL(result);

					result.idi_status = 2;
					result.nom_progresso = '100%';

					CRMControlAttachmentTab.updateAttachmentInList(attachmentInstance, result);

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-attachment', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-file-success', [result.nom_arq], 'dts/crm')
					});
				}
			};

			progressCallback = function (progress, event, attachmentInstance) {
				attachmentInstance.idi_status    = 1;
				attachmentInstance.nom_progresso = progress;
			};

			errorCallback = function (result, status, headers, config, attachmentInstance) {

				attachmentInstance.idi_status = 3;
				attachmentInstance.nom_progresso = '100%';

				CRMControlAttachmentTab.updateAttachmentInList(attachmentInstance);

				CRMControlAttachmentTab.remove(attachmentInstance);

				var message = (status === 0 ? $rootScope.i18n('msg-request-aborted', [], 'dts/crm') : status + ' - ' + result);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: (status === 0 ? 'info' : 'error'),
					title: $rootScope.i18n('nav-attachment', [], 'dts/crm'),
					detail: message
				});
			};

			addAttachment = function (file) {
				attachment = {
					idi_status : 0,
					log_existe : true,
					nom_arq	: file.name,
					nom_progresso : '0%',
					idi_tip_anexo: CRMControlAttachmentTab.type
				};

				CRMControlAttachmentTab.listOfAttachmentCount += 1;
				CRMControlAttachmentTab.listOfAttachment.unshift(attachment);

				attachment.promise = attachmentFactory.upload(CRMControlAttachmentTab.type, CRMControlAttachmentTab.idRecord, file, attachment, successCallback, progressCallback, errorCallback);
			};

			for (i = 0; i < $files.length; i += 1) {

				file = $files[i];

				canUpload = true;
				if (CRMControlAttachmentTab.fileSizeLimit > 0) {
					canUpload = helper.validateUploadLimitFileSize('nav-attachment', file.name, file.size, CRMControlAttachmentTab.fileSizeLimit);
				}

				if (canUpload && !this.fileAlreadyExist(file.name)) {

					if (CRMControlAttachmentTab.isAttachmentType) {

						selectedFiles.push(file);

					} else {
						addAttachment(file);
					}

				}

			}

			if (CRMControlAttachmentTab.isAttachmentType && selectedFiles.length > 0) {
				modalAttachmentTypeSelect.open(
					selectedFiles
				).then(function (result) {
					for (i = 0; i < result.selectedFiles.length; i += 1) {
						addAttachment(result.selectedFiles[i]);
					}
				});
			}

		};

		this.updateAttachmentInList = function (oldAttachment, newAttachment) {

			var index = this.listOfAttachment.indexOf(oldAttachment);

			if (index >= 0) {
				this.listOfAttachment[index] = newAttachment || oldAttachment;
			}
		};

		this.fileAlreadyExist = function (fileName, showMessage) {

			var inList = false,
				attachment,
				j;

			for (j = 0; j < this.listOfAttachment.length; j += 1) {

				attachment = this.listOfAttachment[j];

				if (fileName === attachment.nom_arq) {
					inList = true;
					break;
				}
			}

			if (inList === true && showMessage !== false) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('nav-attachment', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-file-already-exist', [fileName], 'dts/crm')
				});
			}

			return inList;
		};

		this.remove = function (attachment) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-attachment', [], 'dts/crm').toLowerCase(), attachment.nom_arq
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					if (attachment.num_id) {

						attachmentFactory.deleteRecord(attachment.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							CRMControlAttachmentTab.removeFromList(attachment);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-attachment', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-file-success-removed', [
									attachment.nom_arq
								], 'dts/crm')
							});
						});
					} else {

						attachmentFactory.deleteRecordAborted(attachment.idi_tip_anexo, attachment.num_id_reg, attachment.nom_arq, function (result) {

							if (!result || result.l_ok !== true) { return; }

							CRMControlAttachmentTab.removeFromList(attachment);
						});
					}
				}
			});
		};

		this.removeFromList = function (attachment) {

			var index = this.listOfAttachment.indexOf(attachment);

			if (index !== -1) {
				this.listOfAttachment.splice(index, 1);
				this.listOfAttachmentCount -= 1;
			}
		};

		this.cancel = function (attachment) {
			if (attachment.promise) {
				attachment.promise.abort();
				attachment.log_cancelada = true;
			}
		};

		this.parseDownloadURL = function (attachment) {
			attachment.nom_url = CRMURL.downloadService + attachment.num_id;
		};

		this.loadPreferences = function (callback) {
			var count = 0, total = 2;

			attachmentFactory.getParamSizeLimit(function (result) {
				CRMControlAttachmentTab.fileSizeLimit = result || 0;
				if (++count === total && callback) { callback(); }
			});

			attachmentFactory.isAttachmentType(function (result) {
				CRMControlAttachmentTab.isAttachmentType = result;
				if (++count === total && callback) { callback(); }
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (type, idRecord, hasAttachment, isEnabled, isBlock) {

			this.type		= type;
			this.idRecord	= idRecord;

			CRMControlAttachmentTab.loadPreferences();

			accessRestrictionFactory.getUserRestrictions('attachment.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAttachmentTab.accessRestriction = result || {};
			});

			if (hasAttachment !== false) {
				CRMControlAttachmentTab.search(false);
			}

			if (isEnabled !== false) {
				this.isEnabled = true;
			} else {
				this.isEnabled = false;
			}

			if (isBlock !== true) {
				this.isBlock = false;
			} else {
				this.isBlock = true;
			}
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAttachmentTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAttachmentTab.init(1, account.num_id, account.log_anexo, account.log_acesso);
		});

		$scope.$on(CRMEvent.scopeLoadCampaign, function (event, campaign) {
			CRMControlAttachmentTab.init(2, campaign.num_id, campaign.log_anexo);
		});

		/*$scope.$on(CRMEvent.scopeLoadEmail, function (event, email) {
			CRMControlAttachmentTab.init(3, email.num_id, email.log_anexo);
		});*/

		$scope.$on(CRMEvent.scopeLoadTask, function (event, task) {
			CRMControlAttachmentTab.init(4, task.num_id, task.log_anexo, (task.idi_status_tar === 1), false);
		});

		$scope.$on(CRMEvent.scopeLoadHistory, function (event, history) {
			CRMControlAttachmentTab.init(5, history.num_id, history.log_anexo);
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlAttachmentTab.init(6, opportunity.num_id, opportunity.log_anexo, (opportunity.ttFaseDesenvolvimento ? opportunity.ttFaseDesenvolvimento.log_permite_alter : false));
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			CRMControlAttachmentTab.init(7, ticket.num_id, ticket.log_anexo);
		});

		$scope.$on(CRMEvent.scopeUploadAttachment, function (event, attachment) {
			if (attachment && CRMControlAttachmentTab.type === attachment.idi_tip_anexo && CRMControlAttachmentTab.idRecord === attachment.num_id_reg) {

				var alreadyInList = CRMControlAttachmentTab.fileAlreadyExist(attachment.nom_arq, false);

				if (alreadyInList === true) { return; }

				CRMControlAttachmentTab.addAttachmentInList(attachment, true);
			}
		});

		$scope.$on(CRMEvent.scopeDeleteAttachmentRemoveProcess, function (event, listProcess) {
			if (!listProcess || !angular.isArray(listProcess)) { return; }

			var i;
			for (i = 0; i < listProcess.length; i++) {
				if (listProcess[i].processo === 'attachment') {
					CRMControlAttachmentTab.removeFromList(listProcess[i]);
				}
			}
		});

		$scope.$on(CRMEvent.scopeFileSelectAddUpdOpportunity, function (event, enabledFileSelect) {
			CRMControlAttachmentTab.isEnabled = enabledFileSelect;
		});

		$scope.$on(CRMEvent.scopeFileSelectAddUpdHistory, function (event, enabledFileSelect) {
			CRMControlAttachmentTab.isEnabled = enabledFileSelect;
		});

		$scope.$on(CRMEvent.scopeFileSelectAddUpdTask, function (event, enabledFileSelect) {
			CRMControlAttachmentTab.isEnabled = enabledFileSelect;
		});

		$scope.$on(CRMEvent.scopeFileSelectAddUpdTicket, function (event, enabledFileSelect) {
			CRMControlAttachmentTab.isEnabled = enabledFileSelect;
		});

	};

	controllerAttachmentTab.$inject = ['$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_anexo.factory', 'crm.helper', 'crm.attachment-type.select.modal.control', 'crm.crm_acess_portal.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.attachment.tab.control', controllerAttachmentTab);

});
