/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1021.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketTagTab,
		modalTicketTagSelection,
		controllerTicketTagSelection;

	controllerTicketTagTab = function ($rootScope, $scope, TOTVSEvent, helper, ticketFactory,
									 modalTicketTagSelection, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketTagTab = this;

		this.listOfTag = [];
		this.listOfTagCount = 0;

		this.ticket = undefined;

		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.openSelection = function () {
			modalTicketTagSelection.open({
				idTicket: this.ticket.num_id,
				listOfTicketTags: this.listOfTag
			}).then(function (result) {

				if (!result) { return; }

				var i,
					tags = '';

				for (i = 0; i < result.length; i++) {

					if (i === 0) {
						tags = result[i].nom_palavra_chave;
					} else {
						tags += ', ' + result[i].nom_palavra_chave;
					}

					CRMControlTicketTagTab.listOfTagCount++;
					CRMControlTicketTagTab.listOfTag.unshift(result[i]);
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-tag', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n((result.length > 1 ? 'nav-tag' : 'l-tag'), [], 'dts/crm'),
						tags,
						CRMControlTicketTagTab.ticket.nom_ocor
					], 'dts/crm')
				});
			});
		};

		this.load = function () {
			ticketFactory.getTags(this.ticket.num_id, function (result) {

				if (!result) { return; }

				CRMControlTicketTagTab.listOfTag = result;
				CRMControlTicketTagTab.listOfTagCount = result.length;
			});
		};

		this.remove = function (tag) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-tag', [], 'dts/crm').toLowerCase(), tag.nom_palavra_chave
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						ticketFactory.removeTag(tag.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-tag', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlTicketTagTab.listOfTag.indexOf(tag);

							if (index !== -1) {
								CRMControlTicketTagTab.listOfTag.splice(index, 1);
								CRMControlTicketTagTab.listOfTagCount--;
							}
						});
					}
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (ticket, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('ticket.tag.tab', $rootScope.currentuser.login, function (result) {
				CRMControlTicketTagTab.accessRestriction = result || {};
			});

			this.ticket = ticket;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketTagTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			CRMControlTicketTagTab.init(ticket, ticket.log_acesso);
		});

	}; // controllerAttachmentTab
	controllerTicketTagTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_ocor.factory',
		'crm.ticket-tag.modal.selection', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** MODAL SELECT TAG TO ACCOUNT
	// *************************************************************************************
	modalTicketTagSelection = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket/tag/tag.select.html',
				controller: 'crm.ticket-tag.selection.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTicketTagSelection.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECT TAG TO ACCOUNT
	// *************************************************************************************

	controllerTicketTagSelection = function ($rootScope, $scope, $modalInstance, $filter, parameters,
									  tagFactory, ticketFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTagSelection = this;

		this.idTicket = undefined;

		this.listOfTag = [];
		this.listOfTicketTags = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {

			var i,
				tag,
				selecteds = [];

			for (i = 0; i < this.listOfTag.length; i++) {

				tag = this.listOfTag[i];

				if (tag.$selected === true) {
					selecteds.push({num_id_palavra_chave: tag.num_id});
				}
			}

			if (selecteds.length > 0) {
				ticketFactory.addTags(this.idTicket, selecteds, function (result) {
					if (!result) { return; }
					$modalInstance.close(result);
				});

			} else {
				this.cancel();
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.loadTags = function () {

			var i, j,
				tag,
				ticketTag,
				alreadySelected;

			tagFactory.getAll(function (result) {

				if (!result) { return; }

				if (CRMControlTagSelection.listOfTicketTags) {

					for (i = 0; i < result.length; i++) {

						tag = result[i];

						tag.$selected = false;

						alreadySelected = false;

						for (j = 0; j < CRMControlTagSelection.listOfTicketTags.length; j++) {

							ticketTag = CRMControlTagSelection.listOfTicketTags[j];

							if (tag.num_id === ticketTag.num_id_palavra_chave) {
								alreadySelected = true;
								break;
							}
						}

						if (!alreadySelected) {
							CRMControlTagSelection.listOfTag.push(tag);
						}
					}

				} else {
					CRMControlTagSelection.listOfTag = result;
				}
			});
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket.tag.select', $rootScope.currentuser.login, function (result) {
				CRMControlTagSelection.accessRestriction = result || {};
			});

			this.loadTags();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.idTicket = parameters.idTicket ? angular.copy(parameters.idTicket) : undefined;
		this.listOfTicketTags = parameters.listOfTicketTags ? angular.copy(parameters.listOfTicketTags) : [];

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTagSelection = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerTicketTagSelection.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_palavra_chave.factory',
		'crm.crm_ocor.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-tag.modal.selection', modalTicketTagSelection);

	index.register.controller('crm.ticket-tag.tab.control', controllerTicketTagTab);
	index.register.controller('crm.ticket-tag.selection.control', controllerTicketTagSelection);

});
