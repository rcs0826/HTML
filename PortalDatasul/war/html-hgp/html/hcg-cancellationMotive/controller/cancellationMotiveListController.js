define(['index',
    '/dts/hgp/html/hcg-cancellationMotive/cancellationMotiveFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hcg-cancellationMotive/maintenance/controller/cancellationMotiveMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    cancellationMotiveListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hcg.cancellationMotive.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function cancellationMotiveListController($rootScope, $scope, appViewService,cancellationMotiveFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hcg.cancellationMotiveList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfcancellationMotive = [];
        _self.listOfcancellationMotiveCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfcancellationMotiveCount = 0;

            if (isMore) {
                startAt = _self.listOfcancellationMotive.length + 1;
            } else {
                _self.listOfcancellationMotive = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){
                
                //Remove todos os disclaimers
                _self.disclaimers = [];
                
                var filtro = this.searchInputText;
                if (filtro.indexOf('/') > 0){
                    var keyArray = filtro.split('/');
                    if (keyArray.length != 2) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Formato do filtro inválido. Informe [Entidade]/[Código].'
                        });
                        return;
                    }
                    if (isNaN(keyArray[1])){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Formato do filtro inválido. Informe [Entidade]/[Código].'
                        });
                        return;
                    }
                    _self.disclaimers.push({property: 'inEntidade',
                                            value: keyArray[0],
                                            title: 'Entidade: ' + keyArray[0],
                                            priority: 2});
                    _self.disclaimers.push({property: 'cdMotivo',
                                            value: keyArray[1],
                                            title: 'ID Motivo: ' + keyArray[1],
                                            priority: 1});
                }else if (isNaN(filtro)) {     
                    if (filtro.length <= 2){
                        _self.disclaimers.push({property: 'inEntidade',
                                                value: filtro,
                                                title: 'Entidade: ' + filtro,
                                                priority: 1});
                    } else {
                        _self.disclaimers.push({property: 'dsMotivo',
                                                value: filtro,
                                                title: 'Descriçao do motivo: ' + filtro,
                                                priority: 1});
                    }
                }
                else {
                    _self.disclaimers.push({property: 'cdMotivo',
                                            value: filtro,
                                            title: 'ID Motivo: ' + filtro,
                                            priority: 1});
                } 
            }


            //Limpa o campo de busca 
            _self.searchInputText = '';

            /*
            //Caso nao possua disclaimers nao realiza a busca
            if(_self.disclaimers.length == 0){
                return;
            }
            */

            //Busca os periodos com os filtros informados, retornando o numero de registros configurados apos o campo startAt
            cancellationMotiveFactory.getCancellationMotiveByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfcancellationMotiveCount = value.$length;
                        }
                        value.rotulo = value.inEntidade + " - " + value.cdMotivo + " - " + value.dsMotivo;
                        _self.listOfcancellationMotive.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateCancellationMotive',function(event, inEntidade, cdMotivo){

                if(!_self.listOfcancellationMotive 
                || _self.listOfcancellationMotive.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfcancellationMotive.length; i++) {
                    var cancellationMotive = _self.listOfcancellationMotive[i];
                    var indAux = i;
                    
                    if(cancellationMotive.inEntidade == inEntidade &&
                        cancellationMotive.cdMotivo   == cdMotivo ){
                        cancellationMotiveFactory.getCancellationMotiveByFilter('', 0, 0, false,[
                                {property:'inEntidade', value: inEntidade, priority:1},
                                {property:'cdMotivo',   value: cdMotivo,   priority:2}
                            ],function(result){
                                if(result){
                                    var cancellationMotiveAux = result[0];
                                    _self.listOfcancellationMotive[indAux] = cancellationMotiveAux;
                                    _self.listOfcancellationMotive[indAux].rotulo = _self.listOfcancellationMotive[indAux].inEntidade + " - " + _self.listOfcancellationMotive[indAux].cdMotivo + " - " + _self.listOfcancellationMotive[indAux].dsMotivo;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };

        this.removeCancellationMotive = function (selectedCancellationMotive) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   cancellationMotiveFactory.removeCancellationMotive(selectedCancellationMotive,
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
                templateUrl: '/dts/hgp/html/hcg-cancellationMotive/ui/cancellationMotiveListConfiguration.html',
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

        this.init = function(){
            appViewService.startView("Motivos de Cancelamento Genéricos", 'hcg.cancellationMotiveList.Control', _self);
                        
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
            // obs.: Nao funciona para mais de um disclaimer quando sao apenas 2, 
            //       pois o length dos disclaimers usado no for e modificado assim
            //       que e removido o primeiro disclaimer
            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
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
    index.register.controller('hcg.cancellationMotiveList.Control', cancellationMotiveListController);

});


