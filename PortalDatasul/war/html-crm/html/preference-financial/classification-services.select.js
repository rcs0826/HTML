/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
    '/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1015.js'
], function (index) {

    'use strict';

	var modal,
		controller;
    
    // *************************************************************************************
	// *** MODAL
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/preference-financial/classification.select.html',
				controller: 'crm.classification.selection.control as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
    
	modal.$inject = ['$modal'];
    
    // *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************

	controller = function ($rootScope, $scope, $modalInstance, $filter, parameters, factoryAccountRating) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlClassSelection = this;
		this.listOfClassifications = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {
            var i,
				classification,
				selecteds = [];

			for (i = 0; i < this.listOfClassifications.length; i++) {

				classification = this.listOfClassifications[i];

				if (classification.$selected === true) {
					selecteds.push({
                        num_id: classification.num_id,
                        nom_clas_clien: classification.nom_clas_clien
                    });
				}
			}

			if (selecteds.length > 0) {
                $modalInstance.close(selecteds);
			} else {
				this.cancel();
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.loadClassifications = function () {
            factoryAccountRating.getByFinantialParam(function (result) {
                if (result) {
                    CRMControlClassSelection.listOfClassifications = result;
                }
            });
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
        this.loadClassifications();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlClassSelection = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});

    };

    controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_clas.factory'
	];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.classification.modal.selection', modal);
	index.register.controller('crm.classification.selection.control', controller);
});