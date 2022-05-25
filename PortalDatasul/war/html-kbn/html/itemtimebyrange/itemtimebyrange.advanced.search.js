define([
	'index'
], function (index) {

	modalItemTimeByRangeAdvancedSearch.$inject = ['$modal'];
	function modalItemTimeByRangeAdvancedSearch($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/kbn/html/itemtimebyrange/itemtimebyrange.advanced.search.html',
				controller: 'ekanban.itemtimebyrange.advanced.search.ctrl as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};

	};

	itemTimeByRangeAdvancedSearchCtrl.$inject = [ 'parameters', '$modalInstance', '$rootScope' ];
	function itemTimeByRangeAdvancedSearchCtrl( parameters, $modalInstance, $rootScope ) {

		_self = this;
        
        _self.init = function(){
            _self.accordionGeral = true;
            _self.accordionClassifier = false;
            _self.dateRange = parameters.date;
            _self.classifierSelected = parameters.classifierSelected;
            
            if (_self.establishmentChanged) {
                _self.estabDirective = _self.establishmentChanged;
            }
        }

		_self.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		_self.apply = function() {
            
            if (_self.establishmentChanged) {
                _self.estabDirective = _self.establishmentChanged;
            }

            if(_self.dateRange.end > (new Date()).getTime() ){
                _self.dateRange.$invalid = true;
            }else{
                _self.dateRange.$invalid = false;
                
                $modalInstance.close({data: _self.dateRange, estab: _self.estabDirective, classifiers: _self.classifierSelected});
			}
		};
        
        _self.init();

	};

	index.register.controller('ekanban.itemtimebyrange.advanced.search.ctrl', itemTimeByRangeAdvancedSearchCtrl);
	index.register.service('ekanban.itemtimebyrange.advanced.search.modal', modalItemTimeByRangeAdvancedSearch);
});