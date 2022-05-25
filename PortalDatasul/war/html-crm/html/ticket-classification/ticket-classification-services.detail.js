/*globals index, define, angular, TOTVSEvent, console, CRMEvent */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1111.js',
    '/dts/crm/html/ticket-classification/products/ticket-classification-product-services.list.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit) {

		var CRMControl = this;

		this.model = undefined;

		//angular.extend(this, serviceTicketFlowStatusTab);

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {
			factory.getTicketClassification(id, function (result) {
				CRMControl.model = result;
                
                $rootScope.$broadcast(CRMEvent.scopeLoadTicketClassification, CRMControl.model);
			});
		};

		this.onEdit = function () {
			modalEdit.open({
				ticketClassification: CRMControl.model
			}).then(function (result) {
				if (result) {
					CRMControl.model = result;
				}
			});
		};


		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-ticket-classification', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_classif_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-ticket-classification', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/ticket-classification/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-ticket-classification', [], 'dts/crm'),
				viewController = 'crm.ticket-classification.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'crm.helper',
		'crm.crm_classif_ocor.factory', 'crm.ticket-classification.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.ticket-classification.detail.control', controller);

});
