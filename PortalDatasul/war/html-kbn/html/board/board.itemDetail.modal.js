	define([
    "index",
    "/dts/kbn/js/factories/mappingErp-factories.js",
	"/dts/kbn/js/time-cast.js"
],
function(index) {
    modalItemDetailService.$inject = [ "$modal" ];
    function modalItemDetailService($modal) {
        this.open = function(params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/board/board.itemDetail.modal.html',
                controller: 'kbn.board.itemDetail.controller as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }
    modalitemDetailController.$inject = ['$filter',
										 '$modalInstance',
										 'parameters',
										 'kbn.mappingErp.Factory',
										 'kbn.timeCast.Service'];
    function modalitemDetailController($filter,
									   $modalInstance,
									   parameters,
									   factoryMappingErp,
									   timeCastService) {
        var _self = this;

        _self.init = function() {
            _self.items = parameters.items;
            _self.cellId = parameters.id;
            _self.loadTools(_self.items);
            _self.loadInputs(_self.items);
            
			_self.tempoCiclo = timeCastService.milisecondsToHour(_self.items.tempoCiclo);
			_self.tempoSetup = timeCastService.milisecondsToHour(_self.items.tempoSetup);
        };

        _self.close = function() {
            $modalInstance.close();
        };

        _self.loadInputs = function(items){
            factoryMappingErp.getItensFlow({num_id_item_det_pai: _self.items.itemId},{},
				function(result){
					if(result){
						_self.items.inputs = result;
						_self.items.inputs.forEach(function(inputs){
							inputs.qtdItem = inputs.qtdItem/_self.items.kanbanSize;	
						});
					}
						
			});
        };

        _self.loadTools = function(items){
            factoryMappingErp.getKbnItemferam({num_id_item_det: items.itemId},{},
				function(result){
					if(result)
						_self.items.tools = result;
				});
        };

        _self.init();

    }

    index.register.service('kbn.board.itemDetail.service', modalItemDetailService);
    index.register.controller('kbn.board.itemDetail.controller', modalitemDetailController);
});
