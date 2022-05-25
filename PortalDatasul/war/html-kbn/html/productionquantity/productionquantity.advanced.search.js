define([
	'index'
], function (index) {

	modalProductionquantityAdvancedSearch.$inject = ['$modal'];
	function modalProductionquantityAdvancedSearch($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/productionquantity/productionquantity.advanced.search.html',
				controller: 'ekanban.productionquantity.advanced.search.ctrl as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};

	};

	productionquantityAdvancedSearchCtrl.$inject = [ 'parameters', '$modalInstance', '$rootScope' ];
	function productionquantityAdvancedSearchCtrl( parameters, $modalInstance, $rootScope ) {

		_self = this;
        
        _self.init = function(){
            _self.accordionGeral = true;
            _self.accordionClassifier = false;
            
            _self.dateRange = parameters.date;
            _self.classifierSelected = parameters.classifierSelected;
        }

		_self.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		_self.apply = function() {
            
            if (_self.establishmentChanged) {
                _self.estabDirective = _self.establishmentChanged;
            }
			
			if(_self.dateRange.start == null || _self.dateRange.end == null){
				_self.dateRange.$invalid = true;
				_self.mensagem = $rootScope.i18n('l-title-missing-fields',[],'dts/kbn');
			}else if(_self.dateRange.end > (new Date()).getTime() ){
                _self.dateRange.$invalid = true;
				_self.mensagem = $rootScope.i18n('l-cannot-select-future-date',[],'dts/kbn');
            }else{
                _self.dateRange.$invalid = false;
                
				$modalInstance.close({data: _self.dateRange, estab: _self.estabDirective, classifiers: _self.classifierSelected});
			}             
		};
        
        _self.init();
	};

	index.register.controller('ekanban.productionquantity.advanced.search.ctrl', productionquantityAdvancedSearchCtrl);
	index.register.service('ekanban.productionquantity.advanced.search.modal', modalProductionquantityAdvancedSearch);
});
