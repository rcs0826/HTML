define(['index',
		'/dts/kbn/js/helpers.js',
		'/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

	linkItemClassifierModal.$inject = ['$modal'];
	function linkItemClassifierModal($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/relationcategoryclassifier/linkitemclassifier.modal.html',
				controller: 'ekanban.linkitemclassifier.modal.ctrl as controller',
				backdrop: 'static',
				keyboard: true,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	}
	linkItemClassifierModalCtrl.$inject = ['parameters', '$modalInstance', 'kbn.mappingErp.Factory', 'kbn.helper.Service', '$rootScope', 'TOTVSEvent'];
	function linkItemClassifierModalCtrl(parameters, $modalInstance, mappingErpFactory, serviceHelper, $rootScope, TOTVSEvent) {

        var _self = this;

        _self.init = function() {
            _self.params = angular.copy(parameters);
            _self.listItems = [];

            _self.getItems();
        };

        _self.getItems = function() {
            mappingErpFactory.ItemsEstab({cod_estab_erp : _self.params.establishment}, {}, function(result) {
                _self.listItems = result;
            });
        };

        _self.createLink = function() {

			var objValid = serviceHelper.validateMissingFields($('#linkitemclassifierForm'));

			if(!objValid.isValid()) {
				objValid.showDefaultMessage();
				return;
			}

            mappingErpFactory.CreateKbnRelacItemClassif({
                num_id_item: _self.itemERP.num_id_item,
                cod_estab_erp: _self.params.establishment,
                num_id_clasdor: _self.params.num_id_clasdor
            }, {}, function(result){
				if (!result.$hasError){
                	$modalInstance.close();
				}
            });
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.init();
    }
	index.register.controller('ekanban.linkitemclassifier.modal.ctrl', linkItemClassifierModalCtrl);
	index.register.service('ekanban.linkitemclassifier.modal', linkItemClassifierModal);
});
