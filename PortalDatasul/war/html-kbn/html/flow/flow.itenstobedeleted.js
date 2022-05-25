define([
    'index'
], function (index) {

	modalItensToBeDeleted.$inject = ['$modal'];
	function modalItensToBeDeleted($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/flow/flow.itenstobedeleted.html',
				controller: 'ekanban.flow.itenstobedeleted.ctrl as controller',
				backdrop: 'static',
				keyboard: true,
				size: 'md',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		}

	};

	itensToBeDeletedCtrl.$inject = ['parameters', '$modalInstance', '$rootScope'];
	function itensToBeDeletedCtrl(parameters, $modalInstance, $rootScope){

		var _self = this;

		_self.itens = parameters;

		_self.confirm = function(){
			$modalInstance.close(true);
		};

		_self.cancel = function(){
			$modalInstance.dismiss('cancel');
		};

	};

	index.register.controller('ekanban.flow.itenstobedeleted.ctrl', itensToBeDeletedCtrl);
	index.register.service('ekanban.flow.itenstobedeleted.modal', modalItensToBeDeleted);
});
