define(['index',
    '/dts/hgp/html/hvp-beneficiaryLotation/beneficiaryLotationFactory.js',
    '/dts/hgp/html/hvp-beneficiaryLotation/controller/beneficiaryLotationAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hvp-beneficiaryLotation/maintenance/controller/beneficiaryLotationMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    beneficiaryLotationListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                                  'hvp.beneficiaryLotation.Factory','global.userConfigs.Factory',
                                                  '$modal','AbstractAdvancedFilterController', 'TOTVSEvent'];
    function beneficiaryLotationListController($rootScope, $scope, appViewService,beneficiaryLotationFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController, TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hvp.beneficiaryLotationList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfBeneficiaryLotation = [];
        _self.listOfBeneficiaryLotationCount = 0;
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfBeneficiaryLotationCount = 0;

            _self.addEventListeners(); 

            if (isMore) {
                startAt = _self.listOfBeneficiaryLotation.length + 1;
            } else {
                _self.listOfBeneficiaryLotation = [];
            }
            
            //Testa se foi preenchido o campo de busca
            if ((!angular.isUndefined(_self.searchInputText))
                && _self.searchInputText !== ''){
                //Remove todos os disclaimers
                var arrayLength = _self.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    _self.disclaimers.splice(i, 1);
                }  
                // Filtro de busca
                if(this.searchInputText.length <= 6 && StringTools.hasOnlyNumbers(this.searchInputText)){
                    _self.disclaimers.push({property:'cdnLotac',title: 'Código' + ': ' 
                        + this.searchInputText,
                        value:this.searchInputText, priority:1});
                }else if(this.searchInputText.length < 101){
                    _self.disclaimers.push({property:'desLotac',title: 'Descrição' + ': ' 
                        + this.searchInputText,
                        value: this.searchInputText, priority:1, operator:'begins'});             
                }else{
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning', title: 'Valor informado não respeita o formato dos filtros de busca'
                    });   
                }
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';
           
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados após o campo startAt
            beneficiaryLotationFactory.getBeneficiaryLotationByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, 
                function (result) {
                    _self.hasDoneSearch = true;
                
                    //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                    if (result) {
                        angular.forEach(result, function (value) {

                            if (value && value.$length) {
                               _self.listOfBeneficiaryLotationCount = value.$length;
                            }

                            _self.listOfBeneficiaryLotation.push(value);
                        });
                        if (isMore === false) {
                            $('.page-wrapper').scrollTop(0);
                        }
                    }
                });
        };    

        this.removeBeneficiaryLotation = function (selectedBeneficiaryLotation) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atenção!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Não',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                   beneficiaryLotationFactory.removeBeneficiaryLotation(selectedBeneficiaryLotation,
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

        this.openAdvancedSearch = function () {
        };

        this.openConfigWindow = function () {
        };

        this.init = function(){
        
            appViewService.startView("Lotação do Beneficiário HTML", 'hvp.beneficiaryLotationList.Control', _self);
            

            if(appViewService.lastAction != 'newtab'){
                return;
            }                               

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

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateLotation',function(event, changedLot){

                if(!_self.listOfBeneficiaryLotation
                || _self.listOfBeneficiaryLotation.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfBeneficiaryLotation.length; i++) {
                    var lotation = _self.listOfBeneficiaryLotation[i];
                    var indAux = i;

                    if(lotation.cdnLotac == changedLot.cdnLotac){
                
                        beneficiaryLotationFactory.getBeneficiaryLotationByFilter('', 0, 0, false,[
                                {property:'cdnLotac', value: lotation.cdnLotac, priority:9}
                            ],function(result){                                

                                if(result){
                                    var lotAux = result[0];
                                    lotAux.$selected = lotation.$selected;
                                    _self.listOfBeneficiaryLotation[indAux] = lotAux;
                                }
                        }, {noCountRequest: true});
                        break;
                    }
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
    index.register.controller('hvp.beneficiaryLotationList.Control', beneficiaryLotationListController);

});


