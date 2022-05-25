define([
    "index",
    "/dts/kbn/js/factories/mappingErp-factories.js"
],
function(index) {
    modalManualItemsService.$inject = [ "$modal" ];
    function modalManualItemsService($modal) {
        this.open = function(params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/board/board.manualItems.modal.html',
                controller: 'kbn.board.manualItems.controller as controller',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });

            return instance.result;
        };
    }

    modalManualItemsController.$inject = ['$filter', '$modalInstance', 'parameters', "kbn.helper.Service", 'kbn.mappingErp.Factory'];
    function modalManualItemsController($filter, $modalInstance, parameters, kbnHelper, factoryMappingErp) {
        var _self = this;

        _self.items = [];

		var init = function() {
			_self.items = parameters.items;

			_self.items.forEach(function(single){
				single.quantity = "0";
			});

			_self.workcenters = parameters.workcenters;
        };

        _self.close = function() {
        	_self.items = [];
            $modalInstance.close();
        };

		_self.quantityValidationError = function(item){
			return (_self.fieldHasValidValue(item, 'quantity') ? (item.quantity > item.totalKanbans) : true);
		}

		_self.workCenterValidationError = function(item){
			var qtyValidation = _self.quantityValidationError(item);
			if(_self.fieldHasValidValue(item, 'quantity') && item.quantity > 0 ){
				return (qtyValidation == false ? !_self.fieldHasValidValue(item, 'workcenter') : false);
			}else{
				return false;
			}
		}
		_self.validateInfo = function(items) {
			/*
			para cada linha
			se quantitdade é valida (!= null !=undefined menor igual que o disponivel)
			e centro de trabalho preenchido
			a linha está ok e já habiltia o botão
			*/
			var stop = false;
			for(var i= 0; i < items.length && stop == false ; i++){
		 		stop = (_self.workCenterValidationError(items[i]) || _self.quantityValidationError(items[i]));
			}
			return stop;
		}
		
		_self.fieldHasValidValue = function(row, field){
			return (row[field] !== undefined && row[field] != null);
		}
		
        _self.validNumbers = function(obj,field){
            obj[field] = $filter('numberOnly')(obj[field]);
            return true;
        };

        _self.save = function(listItems){

            produceCard = listItems.filter(function(item) {
                return item.itemManual && item.quantity && (_self.fieldHasValidValue(item, 'workcenter'));
            })
            .map(function(item){
                return {
                    numIdItemDet: item.itemId,
                    qtdDesejada: parseInt(item.quantity),
                    workcenter: item.workcenter.num_id_ct_mestre
                };
            });

            factoryMappingErp.ProduceCards(produceCard, function(){
                $modalInstance.close(true);
            });

        }

        _self.updateItemTotal = function(item) {
            item.total = item.quantity * item.kanbanSize;
        };

        _self.colorTag = function(item) {
			return kbnHelper.getTagByColor(item.totalKanbans, item.totalGreenZone, item.totalYellowZone);
        }

        init();
    }

    index.register.service('kbn.board.manualItems.service', modalManualItemsService);
    index.register.controller('kbn.board.manualItems.controller', modalManualItemsController);
});
