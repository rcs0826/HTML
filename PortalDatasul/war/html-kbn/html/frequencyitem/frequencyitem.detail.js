define(['index','/dts/kbn/js/factories/mappingErp-factories.js'], function (index) {

	modalItemFrequencyDetail.$inject = ['$modal'];
	function modalItemFrequencyDetail($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/frequencyitem/frequencyitem.detail.html',
				controller: 'ekanban.frequencyitem.DetailCtrl as controller',
				backdrop: 'static',
				keyboard: true,
                resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		}

	}

	itemFrequencyDetailCtrl.$inject = ['$modalInstance', 'parameters', 'kbn.mappingErp.Factory'];
	function itemFrequencyDetailCtrl($modalInstance, parameters, factoryMappingErp) {

		var _self = this;
		_self.detailItems = parameters.data;
		_self.item = parameters.item;

		this.close = function () {
			$modalInstance.close(true);
		};

	}

	index.register.controller('ekanban.frequencyitem.DetailCtrl', itemFrequencyDetailCtrl);
	index.register.service('ekanban.frequencyitem.DetailModal', modalItemFrequencyDetail);
});