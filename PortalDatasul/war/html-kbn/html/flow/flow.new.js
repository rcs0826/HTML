define(['index',
		'/dts/kbn/js/helpers.js',
		'/dts/kbn/js/factories/mappingErp-factories.js',
		'/dts/kbn/js/filters.js'
], function (index) {

	modalFlowNew.$inject = ['$modal'];
	function modalFlowNew($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/flow/flow.new.html',
				controller: 'ekanban.flow.new.ctrl as controller',
				backdrop: 'static',
				keyboard: true,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	}
	flowNewCtrl.$inject = ['parameters', '$modalInstance', 'kbn.mappingErp.Factory', 'kbn.helper.Service', '$rootScope', 'TOTVSEvent'];
	function flowNewCtrl(parameters, $modalInstance, mappingErpFactory, serviceHelper, $rootScope, TOTVSEvent) {

		var _self = this;

		_self.init = function(){
			_self.params = angular.copy(parameters);
			_self.items = [];
		}		

		_self.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		_self.createFlow = function(){

			var objValid = serviceHelper.validateMissingFields($('#flowForm'));

			if(objValid.isValid()){

				mappingErpFactory.createFlowAtMapping({
					mapId: _self.params.num_id_mapeamento,
					sku: _self.selected.cod_chave_erp,
					refer: _self.selected.cod_refer
				},{},function(result){

					if(!result.$hasError){
						$modalInstance.close();

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'info',
							title:  $rootScope.i18n('l-new-flow'),
							detail: $rootScope.i18n('l-success-transaction'),
						});
					}

				});

			}else{
				objValid.showDefaultMessage();
			}

		};

		_self.getItensFromERP = function(search){
			if(search){
				mappingErpFactory.getItens({
					num_id_estab: _self.params.num_id_estab,
					dat_corte: _self.params.dat_corte,
					zoomItem: search
				},{},function(result){
					_self.items = result;
				});

			}

		}

		_self.init();

	}

	index.register.controller('ekanban.flow.new.ctrl', flowNewCtrl);
	index.register.service('ekanban.flow.new.modal', modalFlowNew);
});
