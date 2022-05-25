/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/media/media-services.edit.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL SELECT MEDIA
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/campaign/action/media/media.select.html',
				controller: 'crm.campaign-action-media.selection.control as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECT MEDIA
	// *************************************************************************************

	controller = function ($rootScope, $scope, $modalInstance, $filter, parameters, factory, modalAdd) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.items = undefined;
		this.action = undefined;
		this.actionMedias = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {

			var i,
				item,
				selecteds = [];

			for (i = 0; i < this.items.length; i++) {

				item = this.items[i];

				if (item.$selected === true) {
					selecteds.push(item.num_id);
				}
			}

			if (selecteds.length > 0) {
				factory.addCampaignActionMedias(this.action, selecteds, function (result) {
					if (!result || result.length === 0) { return; }
					$modalInstance.close(result);
				});
			} else {
				this.cancel();
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.load = function () {

			this.items = [];

			factory.getAllMedias(undefined, undefined, function (result) {

				result = result || [];

				var i, j, item, selected, isFound;

				for (i = 0; i < result.length; i++) {

					item = result[i];
					isFound = false;

					for (j = 0; j < CRMControl.actionMedias.length; j++) {

						selected = CRMControl.actionMedias[j];

						if (item.num_id === selected.num_id_mid) {
							isFound = true;
							break;
						}
					}

					if (isFound === false) {
						CRMControl.items.push(item);
					}
				}
			}, false);
		};

		this.add = function () {
			modalAdd.open(undefined).then(function (results) {
				
				results = results || [];
				
				var i, result;
				
				for (i = 0; i < results.length; i++) {
				
					result = results[i];
					
					if (CRMUtil.isUndefined(result)) { continue; }
					
					result.$selected = true;
					CRMControl.items.unshift(result);
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.action = parameters.action ? angular.copy(parameters.action) : undefined;
		this.actionMedias = parameters.actionMedias ? angular.copy(parameters.actionMedias) : [];

		this.load();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_campanha.factory',
		'crm.media.modal.edit'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign-action-media.modal.selection', modal);
	index.register.controller('crm.campaign-action-media.selection.control', controller);
});
