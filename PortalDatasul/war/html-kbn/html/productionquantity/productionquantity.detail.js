define(['index'], function (index) {

	modalItemProductionDetail.$inject = ['$modal'];
	function modalItemProductionDetail($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/productionquantity/productionquantity.detail.html',
				controller: 'ekanban.productionquantity.DetailCtrl as controller',
				backdrop: 'static',
				keyboard: true,
                resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		}
	}
	itemProductionDetailCtrl.$inject = ['$modalInstance', 'parameters'];
	function itemProductionDetailCtrl($modalInstance, parameters) {
		var _self = this;
		_self.detailItems = [];

		_self.detailItems = parameters.data.ttDetailItemMovementsBuffer;
		_self.item = parameters.data;

		this.close = function () {
			$modalInstance.close(true);
		};
	}

	index.register.controller('ekanban.productionquantity.DetailCtrl', itemProductionDetailCtrl);
	index.register.service('ekanban.productionquantity.DetailModal', modalItemProductionDetail);
});