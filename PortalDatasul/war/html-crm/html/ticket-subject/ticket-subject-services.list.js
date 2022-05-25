/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
    '/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketSubjectList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controllerTicketSubjectList = function ($rootScope, $scope, TOTVSEvent, ticketSubjectFactory, modalEdit, $location, helper, legend, userPreferenceModal, accessRestrictionFactory, preferenceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTicketSubjectList = this;

		this.listOfSubject = [];
		this.listOfSubjectCount = 0;

		this.disclaimers = [];
        this.isIntegratedWithGP = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.search = function (isMore) {

			if (CRMControlTicketSubjectList.isPendingListSearch === true) {
				return;
			}

			CRMControlTicketSubjectList.listOfSubjectCount = 0;

			if (!isMore) {
				CRMControlTicketSubjectList.listOfSubject = [];
			}

			var i,
				options = { start: CRMControlTicketSubjectList.listOfSubject.length, end: 50},
				filters = [];

			if (CRMControlTicketSubjectList.quickSearchText
					&& CRMControlTicketSubjectList.quickSearchText.trim().length > 0) {
				this.disclaimers = [];

				filters.push({ property: 'nom_assunto_ocor', value: helper.parseStrictValue(CRMControlTicketSubjectList.quickSearchText) });
			}

			filters = filters.concat(this.disclaimers);

			CRMControlTicketSubjectList.isPendingListSearch = true;

			ticketSubjectFactory.findRecords(filters, options, function (result) {

				for (i = 0; i < result.length; i++) {

					var subject = result[i];

					if (subject && subject.$length) {
						CRMControlTicketSubjectList.listOfSubjectCount = subject.$length;
					}

					if (subject && subject.log_suspenso && subject.log_suspenso === true) {
						subject.nom_cor = "crm-default-suspended-dark";
					} else {
						subject.nom_cor = "crm-default-suspended-blue";
					}

					CRMControlTicketSubjectList.listOfSubject.push(subject);
				}

				CRMControlTicketSubjectList.isPendingListSearch = false;
			});
		};

		this.removeDisclaimer = function (disclaimer) {
			var index = CRMControlTicketSubjectList.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlTicketSubjectList.disclaimers.splice(index, 1);
				CRMControlTicketSubjectList.search(false);
			}
		};

		this.addEdit = function (subjects, isNew) {
			var i,
				subject;

			if (!subjects) { return; }

			if (!angular.isArray(subjects)) {
				subjects = [subjects];
				CRMControlTicketSubjectList.listOfSubjectCount++;
			}

			for (i = 0; i < subjects.length; i++) {

				subject = subjects[i];

				if (subject && subject.$length) {
					CRMControlTicketSubjectList.listOfSubjectCount = subject.$length;
				}

				if (isNew === true) {
					CRMControlTicketSubjectList.listOfSubject.unshift(subject);
				} else {
					if (subject && subject.log_suspenso && subject.log_suspenso === true) {
						subject.nom_cor = "crm-default-suspended-dark";
					} else {
						subject.nom_cor = "crm-default-suspended-blue";
					}

					CRMControlTicketSubjectList.listOfSubject.push(subject);
				}
			}
		};

		this.onReactivate = function (subject, reactivate) {

			if (!subject || !subject.num_id) { return; }

			var vo = {
					num_id : subject.num_id,
					nom_assunto_ocor : subject.nom_assunto_ocor,
					idi_tip_assunto_ocor : subject.idi_tip_assunto_ocor,
					log_suspenso : !reactivate
				},
				persist;

			persist = function (callback) {
				ticketSubjectFactory.updateRecord(vo.num_id, vo, function (result) {

					if (!result || !result.num_id) { return; }

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-subject', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-update-generic',
							[$rootScope.i18n('l-subject'), subject.nom_assunto_ocor], 'dts/crm')
					});

					var index = CRMControlTicketSubjectList.listOfSubject.indexOf(subject);

					if (index !== -1) {
						CRMControlTicketSubjectList.listOfSubject[index].log_suspenso = result.log_suspenso;
						CRMControlTicketSubjectList.listOfSubject[index].nom_cor = (result.log_suspenso ? "crm-default-suspended-dark" : "crm-default-suspended-blue");
					}

					if (callback) { callback(result); }
				});
			};

			if (!reactivate) { //suspender

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-suspend',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text:   $rootScope.i18n('msg-confirm-suspend-subject', [subject.nom_assunto_ocor], 'dts/crm'),
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
					text:   $rootScope.i18n('msg-confirm-reactivate-subject', [subject.nom_assunto_ocor], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							persist();
						}
					}
				});

			}

		};

		this.addEdit = function (subject) {
			modalEdit.open({
				subject: subject
			}).then(function (result) {
				if (result !== undefined) {
					CRMControlTicketSubjectList.addEdit(result, true);
					$location.path('/dts/crm/ticket-subject/detail/' + result.num_id);
				}
			});
		};

		this.remove = function (subject) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text:  $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-subject', [], 'dts/crm').toLowerCase(), subject.nom_assunto_ocor
				]),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					ticketSubjectFactory.deleteRecord(subject.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-subject', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var index = CRMControlTicketSubjectList.listOfSubject.indexOf(subject);

						if (index > -1) {
							CRMControlTicketSubjectList.listOfSubject.splice(index, 1);
							CRMControlTicketSubjectList.listOfSubjectCount--;
						}
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'ticket-subject.list' });
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
					CRMControlTicketSubjectList.parseQuickFilters(filters);
					filters = filters.concat(CRMControlTicketSubjectList.disclaimers);
					ticketSubjectFactory.exportSearch(filters, isPositiveResult);
				}
			});
		};
		
		this.parseQuickFilters = function (filters) {
			if (CRMControlTicketSubjectList.quickSearchText && CRMControlTicketSubjectList.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlTicketSubjectList.quickSearchText)
				});
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket-subject.list', $rootScope.currentuser.login, function (result) {
				CRMControlTicketSubjectList.accessRestriction = result || {};
			});
            
            preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlTicketSubjectList.isIntegratedWithGP = result;
			});

			helper.loadCRMContext(function () {

				var viewName = $rootScope.i18n('nav-ticket-subject', [], 'dts/crm'),
					startView,
					viewController = 'crm.ticket-subject.list.control';

				startView = helper.startView(viewName, viewController, CRMControlTicketSubjectList);

				if (startView.isNewContext) {
					CRMControlTicketSubjectList.search(false);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlTicketSubjectList = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlTicketSubjectList.init();
		});
	}; // controllerTicketSubjectList

	controllerTicketSubjectList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_assunto_ocor.factory', 'crm.ticket-subject.modal.edit', '$location', 'crm.helper', 'crm.legend', 'crm.user.modal.preference', 'crm.crm_acess_portal.factory', 'crm.crm_param.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.ticket-subject.list.control', controllerTicketSubjectList);
});
