define(['index',
        '/dts/mmi/js/api/fch/fchmip/fchmipservicerequest.js',
        '/dts/mmi/js/utils/filters.js',
        '/dts/mmi/html/servicerequest/servicerequest-detail.js',
        '/dts/mmi/js/utils/mmi-utils.js',
        '/dts/mmi/html/generateorder/generateorder.cancel.order.js',
        '/dts/mmi/html/generateorder/generateorder.generate.order.js'
], function(index) {

    generateOrderListCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$modal',
        '$filter',
        '$location',
        'totvs.app-main-view.Service',
        'fchmip.fchmipservicerequest.Factory',
        'helperServiceRequest',
        'TOTVSEvent'
    ];

    function generateOrderListCtrl(
        $rootScope,
        $scope,
        $modal,
        $filter,
        $location,
        appViewService,
        fchmipservicerequest,
        helperServiceRequest,
        TOTVSEvent) {

        var _self = this;
        _self.model = [];
        this.listOrder = [];
        this.searchSelect = [];
        this.paramSearchSelect = [];
        
        _self.init = function(){
            _self.listSS = [];
            montaParams();
            _self.createTab = appViewService.startView($rootScope.i18n('l-generate-order-solic'), 'mmi.generateorder.ListCtrl', _self);
            
            _self.paramSearch = _self.arrayParam();
            if (_self.createTab) {
                _self.labelTotalRecords = 0;
                _self.paramSearchSelect = {
                    cdparam: 1,
                    nmParam: $rootScope.i18n('l-user-opening')
                };
                _self.quickSearchText = $rootScope.currentuser.login;
                _self.quickSearch();
            }
        };

        _self.doSearch = function(maisResultados) {
            if(!maisResultados) {
                _self.listOrder = [];
                _self.totalRecords = 0;
            };

            var params = {
                startAt: _self.totalRecords + 1,
                lPending: false,
                lApproved: true,
                lOpenOrder: false,
                lCanceled: false,
                lInmate: false,
                usuarioAlt: _self.searchSelect.usuarioAlt,
                cdEquipto: _self.searchSelect.cdEquipto,
                cdPlanejado: _self.searchSelect.cdPlanejado,
                nrSoliServ: _self.searchSelect.nrSoliServ,
                cdTag: _self.searchSelect.cdTag,
                cdEquipRes: _self.searchSelect.cdEquipRes,
                dataInicio: _self.advancedSearch.dateRange.startDate,
                dataTermino: _self.advancedSearch.dateRange.endDate,
                codEquipamentoIni: _self.advancedSearch.codEquipamentoIni,
                codEquipamentoFim: _self.advancedSearch.codEquipamentoFim,
                codTagIni: _self.advancedSearch.codTagIni,
                codTagFim: _self.advancedSearch.codTagFim,
                codCentroCustoIni: _self.advancedSearch.codCentroCustoIni,
                codCentroCustoFim: _self.advancedSearch.codCentroCustoFim,
                codUsuarioIni: _self.advancedSearch.codUsuarioIni,
                codUsuarioFim: _self.advancedSearch.codUsuarioFim,
                codEquipeIni: _self.advancedSearch.codEquipeIni,
                codEquipeFim: _self.advancedSearch.codEquipeFim,
                codPlanejadorIni: _self.advancedSearch.codPlanejadorIni,
                codPlanejadorFim: _self.advancedSearch.codPlanejadorFim,
                codUnidadeNegocioIni: _self.advancedSearch.codUnidadeNegocioIni,
                codUnidadeNegocioFim: _self.advancedSearch.codUnidadeNegocioFim,
                type: 2,
                ordination: ' '
            };
            fchmipservicerequest.getListServiceRequest(params, getListServiceRequestCallback);
        };
            
        var montaParams = function(){
            _self.initialDate = new Date();
            _self.initialDate.setDate(_self.initialDate.getDate() - 90);

            _self.advancedSearch = {
                            agrupamento: 3,
                             dateRange: {startDate: _self.initialDate,
                            endDate: new Date(9999,11,31)},
                            codEquipamentoIni : '',
                            codEquipamentoFim : 'ZZZZZZZZZZZZZZZZ',
                            codTagIni : '',
                            codTagFim : 'ZZZZZZZZZZZZZZZZ',
                            codCentroCustoIni : '',
                            codCentroCustoFim : 'ZZZZZZZZZZZZZZZZZZZZ',
                            codUsuarioIni : '',
                            codUsuarioFim : 'ZZZZZZZZZZZZZZZZZZZZ',
                            codEquipeIni : '',
                            codEquipeFim : 'ZZZZZZZZ',
                            codPlanejadorIni : '',
                            codPlanejadorFim : 'ZZZZZZZZZZZZ',
                            codUnidadeNegocioIni : '',
                            codUnidadeNegocioFim : 'ZZZ'
            }; 
        };
            
        _self.arrayParam = function() {
            return [{
                cdparam: 1,
                nmParam: $rootScope.i18n('l-user-opening')
            }, {
                cdparam: 2,
                nmParam: $rootScope.i18n('l-equipment')
            }, {
                cdparam: 3,
                nmParam: $rootScope.i18n('l-team')
            }, {
                cdparam: 4,
                nmParam: $rootScope.i18n('l-planner')
            }, {
                cdparam: 5,
                nmParam: $rootScope.i18n('l-service-request')
            }, {
                cdparam: 6,
                nmParam: $rootScope.i18n('l-tag')
            }];
        };

        var getListServiceRequestCallback = function(result){
            var hoje = new Date();
            _self.labelTotalRecords = 0;
            
            if(result.totalRecords) {
                _self.paginate = result.paginate;
                if (result)
                    _self.totalRecords = _self.totalRecords + result['tt-solic-serv-retorno'].length;
                else
                    _self.totalRecords = result.totalRecords;
                
                result['tt-solic-serv-retorno'].forEach(function(obj){
                    obj.nrSoliServ = $filter('number')(obj['nr-soli-serv']);
                    _self.listOrder.push(obj);
                });

                _self.listOrder.forEach(function(order){
                    if (order['dt-inicio'] < hoje) {
                        order['da-manut'] = hoje;
                    } else {
                        order['da-manut'] = order['dt-inicio'];
                    }

                    order.data = $filter('date')(order.data, 'dd/MM/yyyy');
                    order.dtInicio = $filter('date')(order['dt-inicio'], 'dd/MM/yyyy');
                    order.dtTermino = $filter('date')(order['dt-termino'], 'dd/MM/yyyy');
                });

                _self.labelTotalRecords = _self.totalRecords;
                if (_self.paginate)
                    _self.labelTotalRecords = _self.totalRecords + "+";
            };
        };
    
        _self.clickParam = function() {
            _self.quickSearchText = undefined;
        };

        _self.quickSearch = function() {
            _self.searchSelect = [];
            _self.listSS = [];

            if(_self.paramSearchSelect.cdparam === 1) 
                _self.searchSelect.usuarioAlt = _self.quickSearchText;
            if(_self.paramSearchSelect.cdparam === 2) 
                _self.searchSelect.cdEquipto = _self.quickSearchText;
            if(_self.paramSearchSelect.cdparam === 3) 
                _self.searchSelect.cdEquipRes = _self.quickSearchText;
            if(_self.paramSearchSelect.cdparam === 4) 
                _self.searchSelect.cdPlanejado = _self.quickSearchText;
            if(_self.paramSearchSelect.cdparam === 5) {
                if(_self.quickSearchText)
                    _self.quickSearchText = _self.quickSearchText.replace(/\./g,'');
                _self.searchSelect.nrSoliServ = _self.quickSearchText;
            }
            if(_self.paramSearchSelect.cdparam === 6) 
                _self.searchSelect.cdTag = _self.quickSearchText;

            _self.doSearch();
        };

        _self.openDetail = function(soliServ) {
            var params = [{"type": "integer", "value": soliServ['nr-soli-serv']}];
            cProgram = "fch/fchmip/fchmipopenprogramconsultass.p";
            msgAux = $rootScope.i18n('l-service-request-inquiry') + ' - MI0610';
            _self.openProgress(cProgram, "fchmipopenprogramconsultass.p", params, msgAux);
        };

        _self.openProgress  = function (path, program, param, msgAux) {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'info',
                title: $rootScope.i18n('msg-opening-program', [msgAux])
            });
            $rootScope.openProgramProgress(path, program, param);
        };

        _self.openEdit = function(data) {
            helperServiceRequest.data = data;
            $location.path('/dts/mmi/servicerequest/detail/');
        };

        _self.alturaGrid = function() {
            return {height: window.innerHeight - 333 + 'px'};
		};

        _self.openAdvancedSearch = function() {
            _self.quickSearchText = "";

            var modalInstance = $modal.open({
              templateUrl: '/dts/mmi/html/generateorder/generateorder.advanced.search.html',
              controller: 'mmi.generateorder.SearchCtrl as controller',
              size: 'lg',
              backdrop: 'static',
              keyboard: true,
              resolve: {
                model: function () {
                  // passa o objeto com os dados da pesquisa avançada para o modal
                  return _self.advancedSearch;
                }
              }
            });

            // quando o usuario clicar em pesquisar:
            modalInstance.result.then(function (result) {
                _self.advancedSearch = result;
                _self.searchSelect = [];
                _self.labelTotalRecords = 0;
                _self.listSS = [];
                
                _self.doSearch();
            });
        }
        
        _self.seleciona = function(event){
            var item = event.sender;
            var valido = true;
            
            index = _self.listSS.indexOf(item.dataItem(item.select()));

            if(item.dataItem(item.select()).$selected){
                if (_self.advancedSearch.agrupamento != 3 && item.dataItem(item.select())['cd-equipto'] == ""){
                    item.dataItem(item.select()).$selected = false;
                    valido = false;
                } else if(_self.advancedSearch.agrupamento == 1 && _self.listSS.length > 0 ){
                    if(_self.listSS[_self.listSS.length - 1]["cd-equipto"] != item.dataItem(item.select())['cd-equipto']) {
                        item.dataItem(item.select()).$selected = false;
                        valido = false;
                    }
                }
                
                if(valido){
                    if(index === -1) _self.listSS.push(item.dataItem(item.select()));
                }
            } else {
                if(index != -1) _self.listSS.splice(index, 1);
            }
        }

        _self.cancelar = function() {
            if(_self.listSS.length === 0) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-no-selected-record-txt')
               });
               return;
            } else {
                _self.model = _self.listSS;
                var modalInstance = $modal.open({
                    templateUrl: '/dts/mmi/html/generateorder/generateorder.cancel.order.html',
                    controller: 'mmi.generateorder.CancelCtrl as controller',
                    size: 'md',
                    backdrop: 'static',
                    keyboard: true,
                    resolve: { 
                        model: function () {
                            return _self.model;
                        }
                    }
                });

                modalInstance.result.then(function() {
                    _self.listSS = [];
                    _self.doSearch();
                });
            }
        };

        _self.generateOM = function() {
            if(_self.listSS.length === 0) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-no-selected-record-txt')
               });
               return;
            } else {
                _self.model = {
                    agrupamento : _self.advancedSearch.agrupamento,
                    listSS : _self.listSS
                }

                var modalInstance = $modal.open({
                    templateUrl: '/dts/mmi/html/generateorder/generateorder.generate.order.html',
                    controller: 'mmi.generateorder.GenerateCtrl as controller',
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: true,
                    resolve: { 
                        model: function () {
                            return _self.model;
                        }
                    }
                });

                modalInstance.result.then(function() {
                    _self.listSS = [];
                    _self.doSearch();
                });
            }
        };

        if ($rootScope.currentuserLoaded) { _self.init(); }

        $scope.$on('$destroy', function () {
            _self = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            _self.init();
        });
        
     
    }
    
    generateOrderSearchCtrl.$inject = [
        '$modalInstance', 
        'model', 
        '$rootScope', 
        'TOTVSEvent'];

    function generateOrderSearchCtrl (
        $modalInstance, 
        model, 
        $rootScope, 
        TOTVSEvent) {

        var controller = this;
        controller.advancedSearch = {};
        
        controller.init = function() {
            angular.copy(model, controller.advancedSearch);
        
            controller.tipo = [{value: 1, label: $rootScope.i18n('l-one-equipment')},
                               {value: 2, label: $rootScope.i18n('l-by-equipment')},
                               {value: 3, label: $rootScope.i18n('l-do-not-group')}];
        }

        controller.search = function () {
            var close = true;
            
            if (controller.advancedSearch.dateRange) {
                if (controller.advancedSearch.dateRange.startDate && !controller.advancedSearch.dateRange.endDate) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('msg-valid-range-open-date')
                    });            	
                    close = false;
                } else if (!controller.advancedSearch.dateRange.startDate && controller.advancedSearch.dateRange.endDate) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('msg-valid-range-open-date')
                    });
                    close = false;
                }
            }

            if (close == true) {
                $modalInstance.close(controller.advancedSearch);
            }
        }

        this.close = function () {
            $modalInstance.dismiss();
        }

        if ($rootScope.currentuserLoaded) { 
            this.init();
        }
    }

    index.register.controller('mmi.generateorder.ListCtrl', generateOrderListCtrl);
    index.register.controller('mmi.generateorder.SearchCtrl', generateOrderSearchCtrl);
    index.register.service('helperServiceRequest', function(){
        return {
            data :{}
        };
    });
});
