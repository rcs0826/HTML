define(['index',
    '/dts/hgp/html/hrs-assocvaConverMovto/assocvaConverMovtoFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/hrs-assocvaConverMovto/maintenance/controller/assocvaConverMovtoMaintenanceController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    assocvaConverMovtoListController.$inject = ['$rootScope', '$scope',  'totvs.app-main-view.Service', 
                                                'hrs.assocvaConverMovto.Factory', 'global.userConfigs.Factory','TOTVSEvent'];
    function assocvaConverMovtoListController($rootScope, $scope, appViewService,
                                              assocvaConverMovtoFactory, userConfigsFactory, TOTVSEvent) {

        var _self = this;
        _self.cdProgramaCorrente = 'hrs.assocvaConverMovtoList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfAssocvaConverMovto = [];
        _self.listOfAssocvaConverMovtoCount = 0;

        this.init = function(){
            appViewService.startView("Associativa de Procedimento SUS x GPS", 'hrs.assocvaConverMovtoList.Control', _self);
            
            if(appViewService.lastAction != 'newtab')
                return;

            _self.config = {lgBuscarAoAbrirTela : true,
                            qtdRegistrosBusca   : "20"};
            _self.search(false);    
        };

        this.removeDisclaimer = function (disclaimer) {

            // percorre os disclaimers até encontrar o disclaimer passado na função e o remove
            // obs.: Não funciona para mais de um disclaimer quando são apenas 2, 
            //       pois o length dos disclaimers usado no for é modificado assim
            //       que é removido o primeiro disclaimer

            for (var i = 0; i < _self.disclaimers.length; i++) {
                if (_self.disclaimers[i].property === disclaimer.property) {
                    _self.disclaimers.splice(i, 1);
                }
            }

            _self.search(false);
       };


       this.search = function (isMore) {

            var startAt = 0;
            _self.listOfAssocvaConverMovtoCount = 0;

            if (isMore) {
                startAt = _self.listOfAssocvaConverMovto.length + 1;
            } else {
                _self.listOfAssocvaConverMovto = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){

                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }   

                _self.disclaimers = [{property: 'cddMovtoExt', value: _self.searchInputText, title: 'Procedimento SUS: ' + _self.searchInputText}];
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            assocvaConverMovtoFactory.getAssocvaConverMovtoByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers,
                function (result) {                
                    //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                    if (result) {
                        angular.forEach(result, function (value) {

                            if (value && value.$length) {
                               _self.listOfAssocvaConverMovtoCount = value.$length;
                            }
                            _self.listOfAssocvaConverMovto.push(value);


                        });
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
            });
        };    

        this.removeAssocvaConverMovto = function (argumento) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Deseja remover o registro?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    assocvaConverMovtoFactory.removeAssocvaConverMovto(argumento,
                        function (result) {
                            if(result.$hasError == true){
                                return;
                            }

                            _self.search();                                  
                        });
                }
            });            
        };

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-assocvaConverMovto/ui/assocvaConverMovtoListConfiguration.html',
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

        this.fillInteger = function(source,size){
            return StringTools.fill(source,'0',size);
        }

        if ($rootScope.currentuserLoaded) {
            _self.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('hrs.assocvaConverMovtoList.Control', assocvaConverMovtoListController);

});