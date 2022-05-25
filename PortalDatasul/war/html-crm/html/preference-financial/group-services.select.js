/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
    '/dts/crm/js/crm-components.js',
    '/dts/crm/js/api/fchcrm1037.js'
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
				templateUrl: '/dts/crm/html/preference-financial/group.select.html',
				controller: 'crm.group.selection.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, $filter, parameters, factoryClientGroup) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlGroupSelection = this;
		this.listOfGroups = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.select = function () {
            var i,
				group,
				selecteds = [];

			for (i = 0; i < this.listOfGroups.length; i++) {

				group = this.listOfGroups[i];

				if (group.$selected === true) {
					selecteds.push({
                        num_id: group.num_id,
                        nom_grp_clien: group.nom_grp_clien
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

		this.loadGroups = function () {
            factoryClientGroup.getByFinantialParam(function (result) {
                if (result) {
                    CRMControlGroupSelection.listOfGroups = result;
                }
            });
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
        this.loadGroups();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlGroupSelection = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});

    };

    controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters', 'crm.crm_grp_clien.factory'
	];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.group.modal.selection', modal);
	index.register.controller('crm.group.selection.control', controller);
});