define([
    'index',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/js/factories/board-factory.js',
    '/dts/kbn/js/enumkbn.js'
], function(index) {

    cellProgrammingViewController.$inject = [
        '$scope',
        '$q',
        '$stateParams',
        'kbn.boards.Factory',
        'kbn.filters.service',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.helper.Service',
        'messageHolder',
        'enumkbn'
    ];

    function cellProgrammingViewController(
        $scope,
        $q,
        $stateParams,
        boardsFactory,
        filtersService,
        appViewService,
        $rootScope,
        kbnHelper,
        messageHolder,
        enumkbn
    ) {
        var _self = this;
            

        _self.init = function(byAutoRefresh) {

            createTab = appViewService.startView($rootScope.i18n('l-cell-programming'), 'kbn.cellProgramming.ViewController', cellProgrammingViewController);
            
            _self.id = $stateParams.id;

            if(_self.id){
                _self.loadData();
                _self.loadDataProd();
            };
        };

        _self.loadDataFila = function(){
            boardsFactory.filaProgramacao({celIdMaster:_self.id}, function(retorno){
                _self.ttItemDet = retorno;
            })
        };
            
        _self.loadDataProd = function(){
            boardsFactory.producaoCelula({celIdMaster:_self.id}, function(retorno){
                _self.ttCt = retorno;
            })
        };
            
        _self.loadData = function(){
            boardsFactory.infoCelula({celIdMaster:_self.id}, function(retorno){
                _self.descCell = retorno.descricao;
                _self.codigoCell = retorno.codigo;
            })
        };

        _self.init();
    }

    index.register.controller('kbn.cellProgramming.ViewController', cellProgrammingViewController);
});
