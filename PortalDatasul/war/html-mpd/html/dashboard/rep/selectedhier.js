/*global angular */
define(['index', '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/zoom/repres.js', '/dts/mpd/js/api/fchdis0048.js'], function(index) {

	selectedHierCtrl.$inject = ['$rootScope', 'mpd.customerapd.Factory'];

	function selectedHierCtrl($rootScope, factory) {
		ctrl = this;
		ctrl.selectedRepresentatives;
		ctrl.allRepresentatives = [];
		ctrl.disclaimers = [];
		ctrl.selectedRep = false;

		ctrl.onZoomSelectRepresentatives = function () {

			ctrl.allRepresentatives = [];

			if (!ctrl.selectedRepresentatives) return;

			if (ctrl.selectedRepresentatives.objSelected && ctrl.selectedRepresentatives.size >= 0) {
				ctrl.selectedRepresentatives = ctrl.selectedRepresentatives.objSelected;
			}

			if (!angular.isArray(ctrl.selectedRepresentatives)) {
				ctrl.selectedRepresentatives = [ctrl.selectedRepresentatives];
			}

			var representatives = [];
			this.disclaimers = [];
			for (var i = 0; i < ctrl.selectedRepresentatives.length; i++) {
				var representatives = ctrl.selectedRepresentatives[i];
				ctrl.addDisclaimer("repres", representatives['cod-rep'], representatives['cod-rep'] + ' - ' + representatives['nome'] + ' ');
				ctrl.allRepresentatives.push(representatives);
			}

			$rootScope.selectedRepresentatives = ctrl.allRepresentatives;
			$rootScope.$broadcast('selectedRepresentatives');

			$rootScope.MPDSalesOrderCustomRepresentative = false;
			$rootScope.MPDCustomersCustomRepresentative = false;
			$rootScope.MPDInvoicesCustomRepresentative = false;
			$rootScope.MPDShipmentCustomRepresentative = false;
			$rootScope.MPDCustomerBillCustomRepresentative = false;

			delete ctrl.selectedRepresentatives;
		}

		// adiciona um objeto na lista de disclaimers
		ctrl.addDisclaimer = function (property, value, label) {
		   ctrl.disclaimers.push({
				property: property,
				value: value,
				title: label
			});

			ctrl.selectedRep = false;

			angular.forEach(ctrl.disclaimers, function (value, key) {
				ctrl.selectedRep = true;
			});
		}

		ctrl.removeDisclaimer = function(filter) {
			var index = ctrl.disclaimers.indexOf(filter);
			if (index != -1) {
				ctrl.allRepresentatives.splice(index,1);
				ctrl.disclaimers.splice(index, 1);
			}

			ctrl.selectedRep = false;

			angular.forEach(ctrl.allRepresentatives, function (value, key) {
				ctrl.selectedRep = true;
			});

			if (!ctrl.selectedRep) {
				$rootScope.selectedRepresentatives = "";
			} else {
				$rootScope.selectedRepresentatives = ctrl.allRepresentatives;
			}

			$rootScope.MPDSalesOrderCustomRepresentative = false;
			$rootScope.MPDCustomersCustomRepresentative = false;
			$rootScope.MPDInvoicesCustomRepresentative = false;
			$rootScope.MPDShipmentCustomRepresentative = false;
			$rootScope.MPDCustomerBillCustomRepresentative = false;

			$rootScope.$broadcast('selectedRepresentatives');
		};

		ctrl.clearDisclaimer = function(filter) {

			ctrl.disclaimers = [];
			ctrl.allRepresentatives = [];

			ctrl.selectedRep = false;

			angular.forEach(ctrl.allRepresentatives, function (value, key) {
				ctrl.selectedRep = true;
			});

			if (ctrl.selectedRep) {
				$rootScope.selectedRepresentatives = "";
			} else {
				$rootScope.selectedRepresentatives = ctrl.allRepresentatives;
			}

			$rootScope.$broadcast('selectedRepresentatives');
		};

		//Recarrega os disclaimers quando volta para o dashboard
		if($rootScope.selectedRepresentatives){
			angular.forEach($rootScope.selectedRepresentatives, function (value, key) {
				ctrl.addDisclaimer("repres", value['cod-rep'], value['cod-rep'] + ' - ' + value['nome'] + ' ');
				ctrl.allRepresentatives.push(value);
			});
		}
	}

	index.register.controller('rep.dashboard.selectedhier.Controller', selectedHierCtrl);

});
