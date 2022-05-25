define(['index',
    '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/associativaUnidadeAreaAcaoFactory.js',
    '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/controller/associativaUnidadeAreaAcaoAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/maintenance/controller/associativaUnidadeAreaAcaoMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    associativaUnidadeAreaAcaoListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hcg.associativaUnidadeAreaAcao.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function associativaUnidadeAreaAcaoListController($rootScope, $scope, appViewService,associativaUnidadeAreaAcaoFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hcg.associativaUnidadeAreaAcaoList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfAssociativaUnidadeAreaAcao = [];
        _self.listOfAssociativaUnidadeAreaAcaoCount = 0;

        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfAssociativaUnidadeAreaAcaoCount = 0;

            if (isMore) {
                startAt = _self.listOfAssociativaUnidadeAreaAcao.length + 1;
            } else {
                _self.listOfAssociativaUnidadeAreaAcao = [];
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
                    _self.disclaimers.push({property: 'cdnUnid',
                        value: filtro,
                        title: 'Unidade: ' + filtro,
                        priority: 1});
                }
                                       
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';
            
            //Caso nao possua disclaimers nao realiza a busca
            if(_self.disclaimers.length == 0){
                return;
            }            

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados apos o campo startAt
            associativaUnidadeAreaAcaoFactory.getAssociativaUnidadeAreaAcaoByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfAssociativaUnidadeAreaAcaoCount = value.$length;
                        }
                        _self.listOfAssociativaUnidadeAreaAcao.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateAssociativaUnidadeAreaAcao',function(event, cdnUnid, cdnCidade){

                if(!_self.listOfAssociativaUnidadeAreaAcao 
                || _self.listOfAssociativaUnidadeAreaAcao.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfAssociativaUnidadeAreaAcao.length; i++) {
                    var associativaUnidadeAreaAcao = _self.listOfAssociativaUnidadeAreaAcao[i];
                    var indAux = i;
                    
                    if(associativaUnidadeAreaAcao.cdnUnid == cdnUnid 
                    && associativaUnidadeAreaAcao.cdnCidade == cdnCidade){
                        associativaUnidadeAreaAcaoFactory.getAssociativaUnidadeAreaAcaoByFilter('', 0, 0, false,[
                                {property:'cdnUnid', value: cdnUnid, priority:1},
                                {property:'cdnCidade',  value: cdnCidade, priority:2}
                            ],function(result){
                                if(result){
                                    var associativaUnidadeAreaAcaoAux = result[0];
                                    _self.listOfAssociativaUnidadeAreaAcao[indAux] = associativaUnidadeAreaAcaoAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };        

        this.removeAssociativaUnidadeAreaAcao = function (selectedassociativaUnidadeAreaAcao) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                    associativaUnidadeAreaAcaoFactory.removeAssociativaUnidadeAreaAcao(selectedassociativaUnidadeAreaAcao,
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
                templateUrl: '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/ui/associativaUnidadeAreaAcaoListConfiguration.html',
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
                templateUrl: '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/ui/associativaUnidadeAreaAcaoAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hcg.associativaUnidadeAreaAcaoAdvFilter.Control as afController',
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
            appViewService.startView("Manutenção Associativa Unidade x Área de Ação", 'hcg.associativaUnidadeAreaAcaoList.Control', _self);
                        
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

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hcg.associativaUnidadeAreaAcaoList.Control', associativaUnidadeAreaAcaoListController);

});


