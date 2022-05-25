/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1005.js'
], function (index) {

	'use strict';

	var controllerRecipientProcessEmail,
		modalRecipientProcessEmail;


	// *************************************************************************************
	// *** MODAL SELECT MAIL TO PROCESS
	// *************************************************************************************

	modalRecipientProcessEmail = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/history/history.e-mail.recipient.select.html',
				controller: 'crm.recipient-process-email.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalRecipientProcessEmail.$inject = ['$modal'];

	/*
	function modalRecipientProcessEmail($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/e-mail/e-mail.recipient.select.html',
				controller: 'crm.recipient-process-email.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	}
	modalRecipientProcessEmail.$inject = ['$modal'];
	*/

	// *************************************************************************************
	// *** CONTROLLER SELECT FORM TO ACCESS RESTRICTION
	// *************************************************************************************
	controllerRecipientProcessEmail = function ($rootScope, $scope, $modalInstance, $filter, helper, legend, TOTVSEvent, parameters, factoryHistory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlRecipientProcessEmail = this;
		this.historyModel = undefined;
		this.listOfEMails = [];
		this.listOfEMailsSelected = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {
			var local = this,
				listaSelecionada = [],
				listaFiltrada = [];

			//deixa apenas os selecionados
			this.listaSelecionada = CRMControlRecipientProcessEmail.listOfEMails.filter(function (item) {
				return (item.selecionado || false);
			});

			// remove os emails repetidos
			this.listaSelecionada.map(function (item) {
				if (listaFiltrada.length === 0) {
					listaFiltrada.push(item);
				} else {
					if (listaFiltrada.filter(function (data) {
							return data.nom_email === item.nom_email;
						}).length === 0) {
						listaFiltrada.push(item);
					}
				}
			});

			if (CRMControlRecipientProcessEmail.listOfEMailsSelected) {
				listaFiltrada = listaFiltrada.concat(CRMControlRecipientProcessEmail.listOfEMailsSelected);
			}

			$modalInstance.close(listaFiltrada);

			/*
			$modalInstance.close(
				listaFiltrada = CRMControlRecipientProcessEmail.listOfEMails.filter(function (item) {
					return item.$selected ? item.$selected : false;
				})
			);
			*/
		};

		this.onSelected = function (item) {

			if (item.selecionado === true) {  // está invertido pq o modelo nao chega atualizado
				return;
			}

			if (CRMControlRecipientProcessEmail.listOfEMails.filter(function (data) {

					if (data.num_id === item.num_id) {
						return false;
					}

					if (data.nom_email !== item.nom_email) {
						return false;
					}

					if (data.selecionado === true) {
						return true;
					}

				}).length >= 1) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'info',
					title:  $rootScope.i18n('l-email', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-duplicate-email', [item.nom_email], 'dts/crm')
				});
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.loadEmails = function () {

			var idAccount = this.historyModel.ttConta ? this.historyModel.ttConta.num_id : 0,
				idContact = this.historyModel.ttContato ? this.historyModel.ttContato.num_id : 0,
				idTask    = this.historyModel.ttTarefaOrigem ? this.historyModel.ttTarefaOrigem.num_id : 0;

			factoryHistory.getEmailsByProcess(idAccount, idContact, idTask, function (result) {

				if (!result) { return; }

				CRMControlRecipientProcessEmail.parseEmailSource(result);

				var i,
					j,
					email,
					selectedEmail,
					alreadySelected,
					selectedEmails = CRMControlRecipientProcessEmail.listOfEMailsSelected;

				if (selectedEmails) {

					for (i = 0; i < result.length; i++) {

						email = result[i];

						email.selecionado = false;

						alreadySelected = false;

						for (j = 0; j < selectedEmails.length; j++) {

							selectedEmail = selectedEmails[j];

							if (email.nom_email === selectedEmail.nom_email) {
								alreadySelected = true;
								break;
							}
						}

						if (!alreadySelected) {
							CRMControlRecipientProcessEmail.listOfEMails.push(email);
						}
					}

				} else {
					CRMControlRecipientProcessEmail.listOfEMails = result;
				}

				//parseEmailSource(CRMControlRecipientProcessEmail.listOfEMails);
			});
		};

		this.parseEmailSource = function (emails) {
			var i;
			if (!angular.isArray(emails)) {
				emails = [emails];
			}
			for (i = 0; emails.length > i; i++) {
				emails[i].nom_origem = legend.emailSource.NAME(emails[i].idi_origem);
				emails[i].selecionado = false;
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.listOfEMailsSelected = parameters.model.to ? angular.copy(parameters.model.to) : undefined;
		this.historyModel = parameters.model ? angular.copy(parameters.model) : undefined;

		this.loadEmails();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlRecipientProcessEmail = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerRecipientProcessEmail.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter', 'crm.helper', 'crm.legend', 'TOTVSEvent', 'parameters',
		'crm.crm_histor_acao.factory'];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.recipient-process-email.modal', modalRecipientProcessEmail);
	index.register.controller('crm.recipient-process-email.control', controllerRecipientProcessEmail);
});
