/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js'
], function (index) {
 
	'use strict';

	var modalScriptSelection,
		controllerScriptSelection;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalScriptSelection = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/script/script.selection.html',
				controller: 'crm.script.selection.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalScriptSelection.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECTION
	// *************************************************************************************

	controllerScriptSelection = function ($rootScope, $scope, parameters, legend, $modalInstance,
									 scriptFactory, TOTVSEvent, helper, scriptHelper) {

		var CRMControlScriptSelection = this;

		this.filterScript = '';

		this.types = angular.copy(scriptHelper.types);

		this.scripts = [];

		this.disclaimers = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.select = function (script) {
			if (!script) { return; }

			$modalInstance.close(script);
		};

		this.search = function (isMore) {
			var filters = [],
				options;

			CRMControlScriptSelection.isPendingListSearch = true;

			options = {
				type: 1
			};

			filters = filters.concat(CRMControlScriptSelection.disclaimers);

			scriptFactory.findRecords(filters, options, function (results) {

				if (results === undefined) {
					return;
				}
				var i, j;

				CRMControlScriptSelection.scripts = results;

				for (j = 0; j < CRMControlScriptSelection.types.length; j++) {

					for (i = 0; i < results.length; i++) {

						if (results[i].idi_tip_script === CRMControlScriptSelection.types[j].num_id) {

							if (CRMControlScriptSelection.types[j].ttQuestionario === undefined) {
								CRMControlScriptSelection.types[j].ttQuestionario = [];
							}

							CRMControlScriptSelection.types[j].ttQuestionario.push(results[i]);
						}
					}
				}

			});

		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		CRMControlScriptSelection.typeScript = angular.copy(parameters.typeScript);

		this.init = function () {
			var today = new Date();
			
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);
			today = today.getTime();
			
			this.disclaimers = [{
				property: 'idi_tip_script',
				value: CRMControlScriptSelection.typeScript + "|7",
				title: $rootScope.i18n('l-script-type', [], 'dts/crm') + ': ' + $rootScope.i18n(legend.scriptTypes.NAME(CRMControlScriptSelection.typeScript), [], 'dts/crm') + ' ' + $rootScope.i18n('l-and') + ' ' + $rootScope.i18n(legend.scriptTypes.NAME(7))
			}, {
				property: 'custom.status',
				value: 2,
				title: $rootScope.i18n('l-status', [], 'dts/crm') + ': ' + $rootScope.i18n('l-script-published', [], 'dts/crm'),
				fixed: false
			}];

			CRMControlScriptSelection.search(false);
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlScriptSelection = undefined;
		});

	};

	controllerScriptSelection.$inject = ['$rootScope', '$scope', 'parameters', 'crm.legend', '$modalInstance', 'crm.crm_script.factory', 'TOTVSEvent', 'crm.helper', 'crm.script.helper'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************


	index.register.service('crm.script.modal.selection', modalScriptSelection);
	index.register.controller('crm.script.selection.control', controllerScriptSelection);

});
