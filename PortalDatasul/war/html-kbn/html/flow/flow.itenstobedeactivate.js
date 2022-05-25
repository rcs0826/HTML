define([
    'index'
], function (index) {

	modalItensToBeDeactivate.$inject = ['$modal'];
	function modalItensToBeDeactivate($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/flow/flow.itenstobedeactivate.html',
				controller: 'ekanban.flow.itenstobedeactivate.ctrl as controller',
				backdrop: 'static',
				keyboard: true,
				size: 'md',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		}

	};

	itensToBeDeactivateCtrl.$inject = ['parameters', '$modalInstance', '$rootScope'];
	function itensToBeDeactivateCtrl(parameters, $modalInstance, $rootScope){

		var _self = this;

		_self.itens = parameters;

		_self.confirm = function(){
			$modalInstance.close(true);
		};

		_self.cancel = function(){
			$modalInstance.dismiss('cancel');
		};

	};

	index.register.controller('ekanban.flow.itenstobedeactivate.ctrl', itensToBeDeactivateCtrl);
	index.register.service('ekanban.flow.itenstobedeactivate.modal', modalItensToBeDeactivate);
});
