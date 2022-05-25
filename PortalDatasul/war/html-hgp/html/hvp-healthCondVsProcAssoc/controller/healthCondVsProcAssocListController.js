define(['index',
    '/dts/hgp/html/hvp-healthCondVsProcAssoc/healthCondVsProcAssocFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hvp-healthCondVsProcAssoc/maintenance/controller/healthCondVsProcAssocMaintenanceController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    healthCondVsProcAssocListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'hvp.healthCondVsProcAssoc.Factory', 'TOTVSEvent'];
    function healthCondVsProcAssocListController($rootScope, $scope, appViewService, healthCondVsProcAssocFactory, TOTVSEvent) {

        $scope.StringTools = StringTools;

        var _self = this;


        this.init = function(){
            appViewService.startView("Manutenção Condição Saúde x Procedimento", 'hvp.healthCondVsProcAssocList.Control', _self);
            
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
            this.listOfhealthCondVsProcAssocCount = 0;

            if (isMore) {
                startAt = this.listOfhealthCondVsProcAssoc.length + 1;
            } else {
                this.listOfhealthCondVsProcAssoc = [];
            }                

            //Testa se foi preenchido o campo de busca
            if (!angular.isUndefined(this.searchInputText)){ 

                if (StringTools.hasOnlyNumbers(this.searchInputText)) {

                    //Remove todos os disclaimers
                    var arrayLength = this.disclaimers.length - 1;
                    for (var i = arrayLength ; i >= 0 ; i--) {
                        
                        this.disclaimers.splice(i, 1);                    
                    }     

                    if(this.searchInputText.length > 3 && this.searchInputText.length < 9){

                        _self.disclaimers.push({property:'cdProcedimento',title: 'Procedimento' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});
                    }else if(this.searchInputText.length < 4){
                        _self.disclaimers.push({property:'cdCondicaoSaude',title: 'Condição de Saúde' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});                    
                    }else{
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'warning', title: 'Valor informado excede o limite permitido no campo'
                        });   
                    } 
                }
                else if (this.searchInputText != '') {

                    _self.disclaimers.push({property:'',title: '' 
                        + this.searchInputText,
                        value:this.searchInputText, priority:1});

                    this.listOfhealthCondVsProcAssoc = [];
                    _self.listOfhealthCondVsProcAssocCount = 0;

                    //Limpa o campo de busca 
                    this.searchInputText = '';

                    return;
                }
            }    

            //Limpa o campo de busca 
            this.searchInputText = '';

            /* função que chama o método do factory para buscar os dados no progress */
            healthCondVsProcAssocFactory.getHealthCondVsProcAssocByFilter('', 0, 0, true, _self.disclaimers,
                function (result) {
                    _self.listOfhealthCondVsProcAssoc = [];

                    angular.forEach(result, function (value) {
                        if (value && value.$length) {
                            _self.listOfhealthCondVsProcAssocCount = value.$length;
                        }

                        _self.listOfhealthCondVsProcAssoc.push(value);  
                    });

                    for (var i = _self.listOfhealthCondVsProcAssoc.length - 1; i >= 0; i--) {                        

                        urlChave = _self.listOfhealthCondVsProcAssoc[i].cdCondicaoSaude + "/" 
                                 + _self.listOfhealthCondVsProcAssoc[i].cdProcedimento + "/" 
                                 + (_self.listOfhealthCondVsProcAssoc[i].dtLimite + 43200000);

                        _self.listOfhealthCondVsProcAssoc[i].urlChave = urlChave;                                                     
                    }           
                });             
        };

        this.removeHealthCondVsProcAssoc = function (argumento) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Deseja remover o registro?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    healthCondVsProcAssocFactory.removeHealthCondVsProcAssoc(argumento,
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
    index.register.controller('hvp.healthCondVsProcAssocList.Control', healthCondVsProcAssocListController);
});
