define(['index',
    '/dts/hgp/html/hrc-pooler/poolerFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/hrc-pooler/maintenance/controller/poolerMaintenanceController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    poolerListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'hrc.pooler.Factory'];
    function poolerListController($rootScope, $scope, appViewService, poolerFactory) {

        var _self = this;

        this.init = function(){
            appViewService.startView("Manutenção Agrupadores Regras Coparticipação", 'hrc.poolerList.Control', _self);
            
            if(appViewService.lastAction != 'newtab'){
                return;
            }
            
             _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
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
            this.listOfpoolerCount = 0;

            if (isMore) {
                startAt = this.listOfpooler.length + 1;
            } else {
                this.listOfpooler = [];
            }                

            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(this.searchInputText))
                && this.searchInputText !== ''){


                //Remove todos os disclaimers
                var arrayLength = this.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    
                    this.disclaimers.splice(i, 1);
                    
                }     

                if(this.searchInputText.length > 200){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning', title: 'Valor informado excede o limite permitido no campo'
                    });  
                }
                else{
                    _self.disclaimers.push({property:'desAgrupRegraFaturam',title: 'Descrição' + ': ' 
                        + this.searchInputText,
                        value:this.searchInputText, priority:1});                       
                }
            }

            //Limpa o campo de busca 
            this.searchInputText = '';

            /* função que chama o método do factory para buscar os dados no progress */
            poolerFactory.getPoolerByFilter('', 0, 0, true, _self.disclaimers,
                function (result) {
                    _self.listOfpooler = [];

                    angular.forEach(result, function (value) {
                        if (value && value.$length) {
                            _self.listOfpoolerCount = value.$length;
                        }
                        console.log('value', value);
                        _self.listOfpooler.push(value);  
                    });

                    for (var i = _self.listOfpooler.length - 1; i >= 0; i--) {                        

                        urlChave = _self.listOfpooler[i].cdnAgrupRegraFaturam;

                        _self.listOfpooler[i].urlChave = urlChave;                                                     
                    }                                   
                });             
        };

        this.removePooler = function (argumento) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Deseja remover o registro?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    poolerFactory.removePooler(argumento,
                        function (result) {
                            if(result.$hasError == true){
                                return;
                            }

                            _self.search();                                  
                        });
                }
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
    index.register.controller('hrc.poolerList.Control', poolerListController);

});