define(['index',
    '/dts/hgp/html/hrc-transactionVsUserAssociative/transactionVsUserAssociativeFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',    
    '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/controller/userCopyController.js',    
    '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/controller/transactionCopyController.js',    
    '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/controller/transactionVsUserAssociativeMaintenanceController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    transactionVsUserAssociativeListController.$inject = ['$rootScope', '$scope', '$modal','totvs.app-main-view.Service', 'hrc.transactionVsUserAssociative.Factory', 'TOTVSEvent'];
    function transactionVsUserAssociativeListController($rootScope, $scope, $modal, appViewService, transactionVsUserAssociativeFactory, TOTVSEvent) {

        $scope.StringTools = StringTools;

        var _self = this;

        this.init = function(){
            appViewService.startView("Manutenção Associativa Transações x Usuários", 'hrc.transactionVsUserAssociativeList.Control', _self);
            
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
            _self.listOftransactionVsUserAssociativeCount = 0;

            if (isMore) {
                startAt = _self.listOftransactionVsUserAssociative.length + 1;
            } else {
                _self.listOftransactionVsUserAssociative = [];
            }                

            //Testa se foi preenchido o campo de busca
            if (!angular.isUndefined(this.searchInputText)
            && this.searchInputText != ''){ 

                    //Remove todos os disclaimers
                    var arrayLength = this.disclaimers.length - 1;
                    for (var i = arrayLength ; i >= 0 ; i--) {
                        
                        this.disclaimers.splice(i, 1);                    
                    }     

                    if(this.searchInputText.length < 5 && StringTools.hasOnlyNumbers(this.searchInputText)){
                        _self.disclaimers.push({property:'cdTransacao',title: 'Código do Transação' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});
                    }else if(this.searchInputText.length <= 12){
                        _self.disclaimers.push({property:'cdUseridTransacao',title: 'Código do Usuário' + ': ' 
                            + this.searchInputText,
                            value:this.searchInputText, priority:1});             
                    }else{
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'warning', title: 'Valor informado excede o limite permitido no campo'
                        });   
                    }
           }         


            //Limpa o campo de busca 
            this.searchInputText = '';

            /* função que chama o método do factory para buscar os dados no progress */
            transactionVsUserAssociativeFactory.getTransactionVsUserAssociativeByFilter('', startAt, 20, true, _self.disclaimers,
                function (result) {


                    if (result) {
                        angular.forEach(result, function (value) {
                            if (value && value.$length) {
                                _self.listOftransactionVsUserAssociativeCount = value.$length;
                            }

                            value.$selected = true;
                            _self.listOftransactionVsUserAssociative.push(value);  
                        });

                        for (var i = _self.listOftransactionVsUserAssociative.length - 1; i >= 0; i--) {                        

                            urlChave = _self.listOftransactionVsUserAssociative[i].cdTransacao + "/" 
                                     + _self.listOftransactionVsUserAssociative[i].cdUseridTransacao

                            _self.listOftransactionVsUserAssociative[i].urlChave = urlChave;                                                     
                        }  

                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }                            
                    }     
                });
        };

        this.userCopy = function (){
            
            var modalVar = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/ui/userCopy.html',
                size: 'md',
                backdrop: 'static',
                controller: 'hrc.userCopyController as controller',
                resolve: {}
            });
        };

        this.transactionCopy = function (){        

            var modalVar = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/ui/transactionCopy.html',
                size: 'md',
                backdrop: 'static',
                controller: 'hrc.transactionCopyController as controller',
                resolve: {}
            });        
        };        

        this.removeTransactionVsUserAssociative = function (argumento) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Deseja remover o registro?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    transactionVsUserAssociativeFactory.removeTransactionVsUserAssociative(argumento,
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
    index.register.controller('hrc.transactionVsUserAssociativeList.Control', transactionVsUserAssociativeListController);
});

