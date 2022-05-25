define(['index', 
    '/dts/hgp/html/hcg-associativeProcessAttachments/associativeProcessAttachmentsFactory.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/hcg-associativeProcessAttachments/maintenance/controller/associativeProcessAttachmentsMaintenanceController.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    associativeProcessAttachmentsListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'hcg.associativeProcessAttachments.Factory', 'TOTVSEvent'];
    function associativeProcessAttachmentsListController($rootScope, $scope, appViewService, associativeProcessAttachmentsFactory,TOTVSEvent) {

        var _self = this;

        this.init = function(){
            appViewService.startView("Manutenção Manutencao Associativa Processos x Anexos HTML", 'hcg.associativeProcessAttachmentsList.Control', _self);
            
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
            this.listOfassociativeProcessAttachmentsCount = 0;

            if (isMore) {
                startAt = this.listOfassociativeProcessAttachments.length + 1;
            } else {
                this.listOfassociativeProcessAttachments = [];
            }

            var filters = [];

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
                    _self.disclaimers.push({property:'desProces',title: 'Descrição' + ': ' 
                        + this.searchInputText,
                        value:this.searchInputText, priority:1, operator:'begins'});                       
                }
            }

             //Limpa o campo de busca 
            this.searchInputText = '';
  				
			/* função que chama o método do factory para buscar os dados no progress */
            associativeProcessAttachmentsFactory.getAssociativeProcessAttachmentsByFilter('', 0, 0, true, _self.disclaimers,
                function (result) {
                    _self.listOfassociativeProcessAttachments = [];

                    angular.forEach(result, function (value) {
                        if (value && value.$length) {
                            _self.listOfassociativeProcessAttachmentsCount = value.$length;
                        }
                       
                        _self.listOfassociativeProcessAttachments.push(value);  
                    });
                                                     
                });             
        };

		$scope.$on('atualizaGrid', this.search());
				
        this.removeAssociativeProcessAttachments = function (argumento) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Deseja remover o registro?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    associativeProcessAttachmentsFactory.removeAssociativeProcessAttachments(argumento,
                        function (result) {
                            if(result.$hasError == true){
                                return;
                            }

                            _self.search();                                  

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', title: 'Registro excluido com sucesso'
                            });
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
    index.register.controller('hcg.associativeProcessAttachmentsList.Control', associativeProcessAttachmentsListController);

});