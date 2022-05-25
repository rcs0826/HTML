define(['index'], function (index) {

	modalFlowAdvancedSearch.$inject = ['$modal'];
	function modalFlowAdvancedSearch($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/flow/flow.advancedsearch.html',
				controller: 'ekanban.flow.advancedsearch.ctrl as controller',
				backdrop: 'static',
				keyboard: true,
                resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		}
	}
	FlowAdvancedSearchCtrl.$inject = [
		'$modalInstance',
		'parameters'
	];
	function FlowAdvancedSearchCtrl(
		$modalInstance,
		parameters
	) {

		this.values = {};

		this.values.refer = '';
		this.values.item  = '';
		this.values.mostraInativo = parameters.mostraInativo;
		this.mapping = parameters.mapping;

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
		this.search = function(){

			$modalInstance.close(this.values);
        
		};
	}

	index.register.controller('ekanban.flow.advancedsearch.ctrl', FlowAdvancedSearchCtrl);
	index.register.service('ekanban.flow.advancedsearch.modal', modalFlowAdvancedSearch);
});