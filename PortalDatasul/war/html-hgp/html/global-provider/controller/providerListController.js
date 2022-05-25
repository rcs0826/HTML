define(['index',
    '/dts/hgp/html/global-provider/providerFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/global-provider/maintenance/controller/providerMaintenanceController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    providerListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'global.provider.Factory', 'TOTVSEvent'];
    function providerListController($rootScope, $scope, appViewService,
                                    providerFactory, TOTVSEvent) {

        $scope.StringTools = StringTools;

        var _self = this;
        _self.disclaimers = [];


        this.init = function(){
            appViewService.startView("Manutenção de Prestadores", 'global.providerList.Control', _self);
            
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
            this.listOfproviderCount = 0;

            if (isMore) {
                startAt = this.listOfprovider.length + 1;
            } else {
                this.listOfprovider = [];
            }                

            //Testa se foi preenchido o campo de busca
            if (!angular.isUndefined(this.searchInputText)){ 

                if (StringTools.hasOnlyNumbers(this.searchInputText)) {

                    //Remove todos os disclaimers
                    var arrayLength = this.disclaimers.length - 1;
                    for (var i = arrayLength ; i >= 0 ; i--) {
                        
                        this.disclaimers.splice(i, 1);                    
                    }     

                    if(this.searchInputText.length > 4 && this.searchInputText.length < 9){

                        _self.disclaimers.push({property:'cdPrestador',title: 'Prestador' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});
                        
                    }else if(this.searchInputText.length < 5){
                        _self.disclaimers.push({property:'cdUnidade',title: 'Unidade' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});
                    }else{
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'warning', title: 'Valor informado excede o limite permitido no campo'
                        });   
                    } 
                }
                else if (this.searchInputText != '') {

                    _self.disclaimers.push({property:'nmPartePrestador',title: 'Parte do Nome do Prestador' + ': ' 
                        + this.searchInputText,
                        value:this.searchInputText, priority:1});

                    this.listOfprovider = [];
                    _self.listOfproviderCount = 0;

                    //Limpa o campo de busca 
                    this.searchInputText = '';

                    return;
                }
            }    

            //Limpa o campo de busca 
            this.searchInputText = '';

            var filters = [];
            filters = this.disclaimers.slice();

            filters.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'});

            /* função que chama o método do factory para buscar os dados no progress */
            providerFactory.getProviderByFilterNew('', 0, 20, true, filters,
                function (result) {
                    _self.listOfprovider = [];

                    angular.forEach(result, function (value) {
                        if (value && value.$length) {
                            _self.listOfproviderCount = value.$length;
                        }

                        _self.listOfprovider.push(value);  
                    });

                    for (var i = _self.listOfprovider.length - 1; i >= 0; i--) {                        

                        urlChave = _self.listOfprovider[i].cdUnidade + "/" 
                                 + _self.listOfprovider[i].cdPrestador;

                        _self.listOfprovider[i].urlChave = urlChave;                                                     
                    }           
                });             
        };

        this.removeProvider = function (argumento) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Deseja remover o registro?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    providerFactory.removeProvider(argumento,
                        function (result) {
                            if(result.$hasError == true){
                                return;
                            }

                            _self.search();                                  
                        });
                }
            });            
        };   

        /* executado quando inicializa a pagina  */
        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
    }
    index.register.controller('global.providerList.Control', providerListController);
});
