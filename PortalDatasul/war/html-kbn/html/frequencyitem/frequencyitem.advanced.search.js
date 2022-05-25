define([
	'index'
], function (index) {

	modalMappingAdvancedSearch.$inject = ['$modal'];
	function modalMappingAdvancedSearch($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/frequencyitem/frequencyitem.advanced.search.html',
				controller: 'ekanban.frequencyitem.advanced.search.ctrl as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};

	};

	mappingAdvancedSearchCtrl.$inject = [ 'parameters', '$modalInstance', '$rootScope' ];
	function mappingAdvancedSearchCtrl( parameters, $modalInstance, $rootScope ) {

		_self = this;
        
        _self.init = function(){
            _self.classifierSelected = parameters.classifierSelected;
            _self.dateRange = parameters.date;
            _self.accordionGeral = true;
            _self.accordionClassifier = false;
        }

		_self.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		_self.apply = function() {            
            var filtros = [];
            
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
				$modalInstance.close({classifiers: _self.classifierSelected,data:_self.dateRange, estab: _self.estabDirective});
			}
		};
        
        _self.init();

	};

	index.register.controller('ekanban.frequencyitem.advanced.search.ctrl', mappingAdvancedSearchCtrl);
	index.register.service('ekanban.frequencyitem.advanced.search.modal', modalMappingAdvancedSearch);
});