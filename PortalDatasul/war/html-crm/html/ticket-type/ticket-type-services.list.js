/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/ticket-type/ticket-subject/ticket-subject-services.selection.js',
	'/dts/crm/html/ticket-type/ticket-subject/ticket-subject-services.tab.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketTypeList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controllerTicketTypeList = function ($rootScope, $scope, TOTVSEvent, ticketTypeFactory, modalAdvancedSearch, modalEdit, $location, helper, userPreferenceModal, accessRestrictionFactory, preferenceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketTypeList = this;

		this.listOfTicketType = [];
		this.listOfTicketTypeCount = 0;

		this.disclaimers = [];
		this.isIntegratedWithGP = false;
		this.isActiveRestrictSubject = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.search = function (isMore) {

			if (CRMControlTicketTypeList.isPendingListSearch === true) {
				return;
			}

			CRMControlTicketTypeList.listOfTicketTypeCount = 0;

			if (!isMore) {
				CRMControlTicketTypeList.listOfTicketType = [];
			}

			var i,
				options = { start: CRMControlTicketTypeList.listOfTicketType.length, end: 50},
				filters = [];

			if (CRMControlTicketTypeList.quickSearchText
					&& CRMControlTicketTypeList.quickSearchText.trim().length > 0) {
				this.disclaimers = [];
				filters.push({ property: 'nom_tip_ocor', value: helper.parseStrictValue(CRMControlTicketTypeList.quickSearchText) });
			}

			filters = filters.concat(this.disclaimers);

			CRMControlTicketTypeList.isPendingListSearch = true;

			ticketTypeFactory.findRecords(filters, options, function (result) {

				for (i = 0; i < result.length; i++) {

					var ticketType = result[i];

					if (ticketType && ticketType.$length) {
						CRMControlTicketTypeList.listOfTicketTypeCount = ticketType.$length;
					}

					if (ticketType && ticketType.log_suspenso && ticketType.log_suspenso === true) {
						ticketType.nom_cor = "crm-default-suspended-dark";
					} else {
						ticketType.nom_cor = "crm-default-suspended-blue";
					}

					CRMControlTicketTypeList.listOfTicketType.push(ticketType);
				}
				CRMControlTicketTypeList.isPendingListSearch = false;
			});
		};

		this.removeDisclaimer = function (disclaimer) {
			var index = CRMControlTicketTypeList.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControlTicketTypeList.disclaimers.splice(index, 1);
				CRMControlTicketTypeList.search(false);
			}
		};

		this.addEditTicketType = function (ticketTypes, isNew) {

			var i,
				ticketType;

			if (!ticketTypes) { return; }

			if (!angular.isArray(ticketTypes)) {
				ticketTypes = [ticketTypes];
				CRMControlTicketTypeList.listOfTicketTypeCount++;
			}

			for (i = 0; i < ticketTypes.length; i++) {

				ticketType = ticketTypes[i];

				if (ticketType && ticketType.$length) {
					CRMControlTicketTypeList.listOfTicketTypeCount = ticketType.$length;
				}

				if (isNew === true) {
					CRMControlTicketTypeList.listOfTicketType.unshift(ticketType);
				} else {
					if (ticketType && ticketType.log_suspenso && ticketType.log_suspenso === true) {
						ticketType.nom_cor = "crm-default-suspended-dark";
					} else {
						ticketType.nom_cor = "crm-default-suspended-blue";
					}

					CRMControlTicketTypeList.listOfTicketType.push(ticketType);
				}
			}
		};

		this.onReactivate = function (ticketType, reactivate) {

			if (!ticketType || !ticketType.num_id) { return; }

			var vo = {
					num_id : ticketType.num_id,
					log_suspenso : !reactivate
				},
				persist;

			persist = function (callback) {
				ticketTypeFactory.updateRecord(vo.num_id, vo, function (result) {

					if (!result || !result.num_id) { return; }

					$rootScope.$broadcast(
						TOTVSEvent.showNotification,
						{
							type: 'success',
							title: $rootScope.i18n('l-ticket-type', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-ticket-type', [], 'dts/crm'), ticketType.nom_tip_ocor], 'dts/crm')
						}
					);

					var index = CRMControlTicketTypeList.listOfTicketType.indexOf(ticketType);

					if (index !== -1) {
						CRMControlTicketTypeList.listOfTicketType[index].log_suspenso = result.log_suspenso;
						CRMControlTicketTypeList.listOfTicketType[index].nom_cor = (result.log_suspenso ? "crm-default-suspended-dark" : "crm-default-suspended-blue");
					}

					if (callback) { callback(result); }
				});
			};

			if (!reactivate) { //suspender

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-suspend',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text:  $rootScope.i18n('msg-confirm-suspend-ticket-type', [ticketType.nom_tip_ocor], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							persist();
						}
					}
				});

			} else { //reativar

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-reactivate',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text:  $rootScope.i18n('msg-confirm-reactivate-ticket-type', [ticketType.nom_tip_ocor], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							persist();
						}
					}
				});
			}

		};

		this.openAdvancedSearch = function () {
			modalAdvancedSearch.open({
				disclaimers: CRMControlTicketTypeList.disclaimers
			}).then(function (result) {
				CRMControlTicketTypeList.quickSearchText = undefined;
				CRMControlTicketTypeList.disclaimers = result.disclaimers || [];
				CRMControlTicketTypeList.search(false);
			});
		};

		this.addEdit = function (ticketType) {
			modalEdit.open({
				ticketType: ticketType
			}).then(function (result) {
				if (result !== undefined) {
					CRMControlTicketTypeList.addEditTicketType(result, true);
					$location.path('/dts/crm/ticket-type/detail/' + result.num_id);
				}
			});
		};

		this.remove = function (ticketType) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text:  $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-ticket-type', [], 'dts/crm').toLowerCase(), ticketType.nom_tip_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					ticketTypeFactory.deleteRecord(ticketType.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-ticket-type', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var index = CRMControlTicketTypeList.listOfTicketType.indexOf(ticketType);

						if (index > -1) {
							CRMControlTicketTypeList.listOfTicketType.splice(index, 1);
							CRMControlTicketTypeList.listOfTicketTypeCount--;
						}
					});
				}
			});
		};
		
		this.exportSearch = function () {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-attention',
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				text: $rootScope.i18n('msg-export-report', [], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }
					var filters = [];
					CRMControlTicketTypeList.parseQuickFilters(filters);
					filters = filters.concat(CRMControlTicketTypeList.disclaimers);
					ticketTypeFactory.exportSearch(CRMControlTicketTypeList.isIntegratedWithGP, CRMControlTicketTypeList.isActiveRestrictSubject, filters, isPositiveResult);
				}
			});
		};
		
		this.parseQuickFilters = function (filters) {
			if (CRMControlTicketTypeList.quickSearchText && CRMControlTicketTypeList.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlTicketTypeList.quickSearchText)
				});
			}
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'ticket-type.list' });
		};
		
		this.loadPreferences = function () {
			var total = 2;

            preferenceFactory.isIntegratedWithGP(function (result) {
                total--;
                CRMControlTicketTypeList.isIntegratedWithGP = result;
                if (total <= 0 && callback) {
                    callback();
                }
            });
            
			preferenceFactory.getPreferenceAsBoolean('LOG_RESTR_ASSUNTO', function (result) {
                total--;
				CRMControlTicketTypeList.isActiveRestrictSubject = result || false;
                if (total <= 0 && callback) {
                    callback();
                }
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('ticket-type.list', $rootScope.currentuser.login, function (result) {
					CRMControlTicketTypeList.accessRestriction = result || {};
				});

				var viewName = $rootScope.i18n('nav-ticket-type', [], 'dts/crm'),
					startView,
					viewController = 'crm.ticket-type.list.control';

				startView = helper.startView(viewName, viewController, CRMControlTicketTypeList);

				if (startView.isNewContext) {
					CRMControlTicketTypeList.search(false);
				}
				CRMControlTicketTypeList.loadPreferences();
			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketTypeList = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlTicketTypeList.init();
		});
	}; // controllerTicketTypeList
	controllerTicketTypeList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_tip_ocor.factory', 'crm.ticket-type.modal.advanced.search',
		'crm.ticket-type.modal.edit', '$location', 'crm.helper', 'crm.user.modal.preference', 'crm.crm_acess_portal.factory', 'crm.crm_param.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.ticket-type.list.control', controllerTicketTypeList);
});
