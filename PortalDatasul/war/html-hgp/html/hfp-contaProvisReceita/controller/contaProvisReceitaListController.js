define(['index',
    '/dts/hgp/html/hfp-contaProvisReceita/contaProvisReceitaFactory.js',
    '/dts/hgp/html/hfp-contaProvisReceita/controller/contaProvisReceitaAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hfp-contaProvisReceita/maintenance/controller/contaProvisReceitaMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    contaProvisReceitaListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hfp.contaProvisReceita.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];

    function contaProvisReceitaListController($rootScope, $scope, appViewService,contaProvisReceitaFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        $scope.StringTools = StringTools;

        _self.cdProgramaCorrente = 'hfp.contaProvisReceitaList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfContaProvisReceita = [];
        _self.listOfContaProvisReceitaCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfContaProvisReceitaCount = 0;

            if (isMore) {
                startAt = _self.listOfContaProvisReceita.length + 1;
            } else {
                _self.listOfContaProvisReceita = [];
            } 
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){
                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = this.searchInputText;
                if (isNaN(filtro)) {     
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Formato do filtro inválido.'
                    });
                    return;
                } else {
                    _self.disclaimers.push({property: 'cdEvento',
                    value: filtro,
                    title: 'Evento: ' + filtro,
                    priority: 1});
                }                                       
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';

            contaProvisReceitaFactory.getContaProvisReceitaByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                if (result) {
                    angular.forEach(result, function (value) {                       

                        if (value && value.$length) {
                            _self.listOfContaProvisReceitaCount = value.$length;
                        }
                        
                        _self.listOfContaProvisReceita.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateContaProvisReceita',function(event, inEntidade, inTipoConta, cdModalidade, cdPlano, cdTipoPlano, cdModulo, cdFormaPagto, cdGrupoPrestador, cdEvento, inMovto, inTipoAto, cdGrupoTipo, cdProcInsu, aaValidade, mmValidade){

                if(!_self.listOfContaProvisReceita 
                || _self.listOfContaProvisReceita.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfContaProvisReceita.length; i++) {
                    var contaProvisReceita = _self.listOfContaProvisReceita[i];
                    var indAux = i;
                    
                    if(contaProvisReceita.inEntidade       == inEntidade 
                    && contaProvisReceita.inTipoConta      == inTipoConta 
                    && contaProvisReceita.cdModalidade     == cdModalidade 
                    && contaProvisReceita.cdPlano          == cdPlano 
                    && contaProvisReceita.cdTipoPlano      == cdTipoPlano
                    && contaProvisReceita.cdModulo         == cdModulo 
                    && contaProvisReceita.cdFormaPagto     == cdFormaPagto 
                    && contaProvisReceita.cdGrupoPrestador == cdGrupoPrestador 
                    && contaProvisReceita.cdEvento         == cdEvento
                    && contaProvisReceita.inMovto          == inMovto 
                    && contaProvisReceita.inTipoAto        == inTipoAto 
                    && contaProvisReceita.cdGrupoTipo      == cdGrupoTipo 
                    && contaProvisReceita.cdProcInsu       == cdProcInsu
                    && contaProvisReceita.aaValidade       == aaValidade 
                    && contaProvisReceita.mmValidade       == mmValidade){
                        contaProvisReceitaFactory.getContaProvisReceitaByFilter('', 0, 0, false,[
                                {property:'inEntidade'      , value: inEntidade, priority:1},
                                {property:'inTipoConta'     , value: inTipoConta, priority:2},
                                {property:'cdModalidade'    , value: cdModalidade, priority:3},
                                {property:'cdPlano'         , value: cdPlano, priority:4},
                                {property:'cdTipoPlano'     , value: cdTipoPlano, priority:5},
                                {property:'cdModulo'        , value: cdModulo, priority:6},
                                {property:'cdFormaPagto'    , value: cdFormaPagto, priority:7},
                                {property:'cdGrupoPrestador', value: cdGrupoPrestador, priority:8},
                                {property:'cdEvento'        , value: cdEvento, priority:9},
                                {property:'inMovto'         , value: inMovto, priority:10},
                                {property:'inTipoAto'       , value: inTipoAto, priority:11},
                                {property:'cdGrupoTipo'     , value: cdGrupoTipo, priority:12},
                                {property:'cdProcInsu'      , value: cdProcInsu, priority:13},
                                {property:'aaValidade'      , value: aaValidade, priority:14},
                                {property:'mmValidade'      , value: mmValidade, priority:15}
                            ],function(result){
                                if(result){
                                    var contaProvisReceitaAux = result[0];
                                    _self.listOfContaProvisReceita[indAux] = contaProvisReceitaAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };        

        this.removeContaProvisReceita = function (selectedcontaProvisReceita) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   contaProvisReceitaFactory.removeContaProvisReceita(selectedcontaProvisReceita,
                   function (result) {

                       if(result.$hasError == true){
                           return;
                       }
                       
                       $rootScope.$broadcast(TOTVSEvent.showNotification, {
                           type: 'success', title: 'Registro removido com sucesso'
                       });
                       _self.search(false);
                   }); 
               }
            }); 
        };   

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hfp-contaProvisReceita/ui/contaProvisReceitaListConfiguration.html',
                size: 'sm',
                backdrop: 'static',
                controller: 'global.genericConfigController as controller',
                resolve: {
                    config: function () {
                        return angular.copy(_self.config);
                    },
                    programName: function(){
                        return _self.cdProgramaCorrente;
                    },
                    extensionFunctions: function(){
                        var funcs = {};
                        funcs.setCurrentFilterAsDefault = function(){
                            this.config.disclaimers = angular.copy(_self.disclaimers);
                        };     
                        return funcs;
                    }
                }
            });

            configWindow.result.then(function (config) {
                _self.config = angular.copy(config);
            });
        };

        this.openAdvancedSearch = function () {
            
            var advancedFilter = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hfp-contaProvisReceita/ui/contaProvisReceitaAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hfp.contaProvisReceitaAdvFilter.Control as afController',
                resolve: {
                    disclaimers: function () {
                        return _self.disclaimers;
                    },
                    AbstractAdvancedFilterController : function(){
                        return AbstractAdvancedFilterController;
                    }
                }
            });

            advancedFilter.result.then(function (disclaimers) {
                _self.search(false);
            });
        };

        this.init = function(){
            appViewService.startView("Contas de Provisionamento de Receita", 'hfp.contaProvisReceitaList.Control', _self);

            if(appViewService.lastAction != 'newtab'){
                return;
            }
            
            _self.addEventListeners();
            
            userConfigsFactory.getConfigByKey(
                $rootScope.currentuser.login, 
                _self.cdProgramaCorrente,
            function(result){
               if(angular.isUndefined(result) == true){
                    _self.config = {lgBuscarAoAbrirTela : true,
                                    qtdRegistrosBusca   : "20"};
                    _self.search(false);            
               }else{
                    _self.config = result.desConfig;
                    
                    if(_self.config.disclaimers){
                        _self.disclaimers = angular.copy(_self.config.disclaimers);
                    }
                    
                    if(_self.config.lgBuscarAoAbrirTela == true){
                        _self.search(false);
                   }
               }
            });         
        };

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers ate encontrar o disclaimer passado na funçao e o remove
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                    i--;
                }
            }

            _self.search(false);
        };

        this.export = function () {
            if(!_self.listOfContaProvisReceita 
             || _self.listOfContaProvisReceita.length == 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Não foram encontrados dados à exportar'
                });
                return;
            }

            contaProvisReceitaFactory.exportContaProvisReceita(_self.disclaimers,
                function (result) {

                    if(result.$hasError == true){
                        return;
                    }
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Dados enviados para a Central de Documentos'
                    });
                });
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hfp.contaProvisReceitaList.Control', contaProvisReceitaListController);

});


