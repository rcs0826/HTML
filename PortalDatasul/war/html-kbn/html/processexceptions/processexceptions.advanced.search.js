define([
    'index',
], function (index) {

    modalProcessExceptionsAdvancedSearch.$inject = ['$modal'];
    function modalProcessExceptionsAdvancedSearch($modal) {

        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/kbn/html/processexceptions/processexceptions.advanced.search.html',
                controller: 'ekanban.processexceptions.advanced.search.ctrl as controller',
                backdrop: 'static',
                keyprocessExceptions: false,
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };

    }

    processExceptionsSearchCtrl.$inject = [ 'parameters', '$modalInstance', '$rootScope', 'kbn.data.Factory', 'TOTVSEvent' ];
    function processExceptionsSearchCtrl( parameters, $modalInstance, $rootScope, dataFactory, TOTVSEvent ) {

        _self = this;

        _self.init = function(){
			_self.classfierSelected = parameters.classfierSelected;
            _self.accordionEstab = true;
            _self.accordionClassifier = false;
			_self.dateRange = parameters.dateRange;
            _self.param = parameters.param;

            if (parameters.estab.cod_estab_erp){
                _self.establishmentChanged = parameters.estab;
            }
        };

        _self.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        _self.apply = function () {
			if(_self.dateRange.start == null || _self.dateRange.end == null){
				_self.dateRange.$invalid = true;
				_self.mensagem = $rootScope.i18n('l-title-missing-fields',[],'dts/kbn');
			}else if(_self.dateRange.end > (new Date()).getTime() ){
                _self.dateRange.$invalid = true;
				_self.mensagem = $rootScope.i18n('l-cannot-select-future-date',[],'dts/kbn');
            }else if(!_self.param.bloqFila && !_self.param.bloqProducao && !_self.param.bloqTransporte && !_self.param.ajusteSaldo && !_self.param.emissaoExtra){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'error',
                        title:  $rootScope.i18n('l-parameters-error'),
                        detail: $rootScope.i18n('l-must-select-exception-params'),
                    });
            }else{
                _self.dateRange.$invalid = false;
				var filtros = [];

				if (_self.establishmentChanged) {

					_self.estabDirective = _self.establishmentChanged;

					filtros.push({
						property: 'cod_estab_erp',
						title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
						value: _self.estabDirective.cod_estab_erp,
						fixed: true,
						isParam: false
					});

				}

				$modalInstance.close({param: _self.param,
                                      classifiers: _self.classfierSelected,
                                      estab:_self.estabDirective, 
                                      filtro: filtros, 
                                      dateRange: _self.dateRange});
			}
			
        };

        _self.init();
    }

    index.register.controller('ekanban.processexceptions.advanced.search.ctrl', processExceptionsSearchCtrl);
    index.register.service('ekanban.processexceptions.advanced.search.modal', modalProcessExceptionsAdvancedSearch);
});
