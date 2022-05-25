/*globals index, define, angular, TOTVSEvent, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1072.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controller = function ($scope, $rootScope, TOTVSEvent, helper, factory, modalEdit, userPreferenceModal) {

		var CRMControl = this;

		this.list = [];
		this.listCount = 0;

		this.isPendingListSearch = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControl.isPendingListSearch === true) {
				return;
			}

			CRMControl.listCount = 0;

			if (!isMore) {
				CRMControl.list = [];
			}

			options = {
				start: CRMControl.list.length,
				end: 50
			};

			if (CRMControl.quickSearchText && CRMControl.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControl.quickSearchText)
				});
			}

			CRMControl.isPendingListSearch = true;

			factory.findRecords(filters, options, function (result) {
				CRMControl.addInList(result);
				CRMControl.isPendingListSearch = false;
			});
		};

		this.updateInList = function (result, old) {

			old = old || result;

			var index = this.list.indexOf(old);

			this.list[index] = result;
		};

		this.addInList = function (itens, isNew) {

			var i, item;

			if (!itens) { return; }

			if (!angular.isArray(itens)) {
				itens = [itens];
				CRMControl.listCount += 1;
			}

			for (i = 0; i < itens.length; i += 1) {

				item = itens[i];

				if (item && item.$length) {
					CRMControl.listCount = item.$length;
				}

				if (isNew !== true) {
					CRMControl.list.push(item);
				} else {
					CRMControl.list.unshift(item);
				}
			}
		};

		this.addEdit = function (item) {
			modalEdit.open({
				media: item
			}).then(function (results) {
				
				results = results || [];
				
				var i, result;
				
				for (i = 0; i < results.length; i++) {
					
					result = results[i];
					
					if (CRMUtil.isUndefined(result)) { continue; }
					
					if (CRMUtil.isDefined(item) && item.num_id === result.num_id) {
						CRMControl.updateInList(result, item);
					} else {
						CRMControl.addInList(result, true);
					}
				}
			});
		};

		this.remove = function (item) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-media', [], 'dts/crm').toLowerCase(), item.nom_mid_relacto
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControl.list.indexOf(item);

						if (index !== -1) {
							CRMControl.list.splice(index, 1);
							CRMControl.listCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-media', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'media.list' });
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-media', [], 'dts/crm'),
				viewController = 'crm.media.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.search();
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});
	};

	controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_mid.factory',
		'crm.media.modal.edit', 'crm.user.modal.preference'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.media.list.control', controller);
});
