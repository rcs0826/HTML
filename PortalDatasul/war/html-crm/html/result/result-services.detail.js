/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1074.js',
	'/dts/crm/js/zoom/crm_detmnto.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, appViewService,
							 helper, factory,  modalEdit) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.selectedDetails = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {
			factory.getRecord(id, function (result) {
				if (result) {
					CRMControl.model = result;
				}
			});
		};

		this.onEdit = function () {
			modalEdit.open({
				result: CRMControl.model
			}).then(function (results) {
				
				results = results || [];
				
				var i;
				
				for (i = 0; i < results.length; i++) {
					if (CRMUtil.isDefined(results[i])) {
						CRMControl.model = results[i];
					}
				}
			});
		};

		this.onRemove = function () {

			var item = CRMControl.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-result', [], 'dts/crm').toLowerCase(), item.nom_restdo
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-result', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/result/');
					});
				}
			});
		};

		this.onZoomSelectDetails = function () {

			if (!this.selectedDetails) { return; }

			if (this.selectedDetails.objSelected && this.selectedDetails.size >= 0) {
				this.selectedDetails = this.selectedDetails.objSelected;
			}

			if (!angular.isArray(this.selectedDetails)) {
				this.selectedDetails = [this.selectedDetails];
			}

			var i,
				names,
				details = [],
				model = CRMControl.model;

			for (i = 0; i < this.selectedDetails.length; i++) {
				details.push({ num_id_detmnto: this.selectedDetails[i].num_id });
			}

			this.selectedDetails = undefined;

			factory.addDetails(model.num_id, details, function (result) {

				if (!result || result.length === 0) { return; }

				model.ttDetalhamento = model.ttDetalhamento || [];

				for (i = 0; i < result.length; i++) {

					if (i === 0) {
						names = result[i].num_id_detmnto;
					} else {
						names += ', ' + result[i].num_id_detmnto;
					}

					model.ttDetalhamento.push(result[i]);
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-result', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n((result.length > 0 ? 'nav-detail' : 'l-detail'), [], 'dts/crm'),
						names, model.nom_restdo
					], 'dts/crm')
				});
			});
		};

		this.removeDetail = function (detail, index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-detail', [], 'dts/crm').toLowerCase(), detail.nom_detmnto_restdo
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteDetail(detail.num_id_restdo, detail.num_id_detmnto, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-result', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControl.model.ttDetalhamento.splice(index, 1);
					});
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-result', [], 'dts/crm'),
				viewController = 'crm.result.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.helper', 'crm.crm_restdo.factory', 'crm.result.modal.edit'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.result.detail.control', controller);
});
