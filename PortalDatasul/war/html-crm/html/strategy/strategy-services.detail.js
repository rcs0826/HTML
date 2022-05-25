/*globals index, define, angular, TOTVSEvent, console */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/html/strategy/goal/goal-services.tab.js',
	'/dts/crm/html/strategy/phase/phase-services.tab.js',
	'/dts/crm/html/strategy/transition/transition-services.tab.js',
	'/dts/crm/html/strategy/goal/phase/phase-services.tab.js',
	'/dts/crm/html/strategy/goal/phase/user/user-services.item-content.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, serviceStrategyGoalTab, serviceStrategyPhaseTab,
							serviceStrategyTransitionTab, serviceStrategyGoalPhaseTab,
							serviceStrategyGoalPhaseUserItemContent, preferenceFactory) {

		var CRMControl = this;

		this.model = undefined;
        this.isIntegratedWithGP = undefined;

		angular.extend(this, serviceStrategyGoalTab);
		angular.extend(this, serviceStrategyPhaseTab);
		angular.extend(this, serviceStrategyGoalPhaseTab);
		angular.extend(this, serviceStrategyTransitionTab);
		angular.extend(this, serviceStrategyGoalPhaseUserItemContent);

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {

			factory.getRecord(id, function (result) {

				CRMControl.model = result;

                if (CRMControl.model.ttMeta && CRMControl.model.ttMeta.length > 0) {
					CRMControl.selectedGoal = CRMControl.model.ttMeta[0];
					CRMControl.selectedGoal.$selected = true;
				}
			});
		};

		this.onEdit = function () {
			modalEdit.open({
				strategy: CRMControl.model
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
					$rootScope.i18n('nav-strategy', [], 'dts/crm').toLowerCase(), CRMControl.model.des_estrateg_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-strategy', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/strategy/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-strategy', [], 'dts/crm'),
				viewController = 'crm.strategy.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
            
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControl.isIntegratedWithGP = result;
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
		'crm.crm_estrateg_vda.factory', 'crm.strategy.modal.edit', 'crm.strategy-goal.tab.service',
		'crm.strategy-phase.tab.service', 'crm.strategy-transition.tab.service',
		'crm.strategy-goal-phase.tab.service', 'crm.strategy-goal-phase-user.item-content.service', 'crm.crm_param.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.strategy.detail.control', controller);

});
