define(['index',
    '/dts/hgp/html/hrb-beneficiarioCompartRisco/beneficiarioCompartRiscoFactory.js',
    '/dts/hgp/html/hrb-beneficiarioCompartRisco/controller/beneficiarioCompartRiscoAdvancedFilterController.js',
    '/dts/hgp/html/js/util/HibernateTools.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrb-beneficiarioCompartRisco/maintenance/controller/beneficiarioCompartRiscoMaintenanceController.js',
    '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - LIST
    // *************************************************************************************

    beneficiarioCompartRiscoListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service',
                                      'hrb.beneficiarioCompartRisco.Factory','global.userConfigs.Factory',
                                      '$modal','AbstractAdvancedFilterController','TOTVSEvent'];
    function beneficiarioCompartRiscoListController($rootScope, $scope, appViewService,beneficiarioCompartRiscoFactory,
                                                userConfigsFactory,$modal,AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;

        _self.cdProgramaCorrente = 'hrb.beneficiarioCompartRiscoList';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];
        _self.listOfBeneficiarioCompartRisco = [];
        _self.listOfBeneficiarioCompartRiscoCount = 0;

        this.criaRotulo = function (registro) {
            return "Unidade: " + registro.cdUnidade + " - Modalidade: " + registro.cdModalidade + " - Contrato: " 
                + registro.cdContrato + " - Beneficiário: " + registro.cdBeneficiario + " " + registro.nmBeneficiario;            
        }
        
        this.listStatus = function (inStatus) {
            if (inStatus == 0)
                return "Pendente Envio"       
            if (inStatus == 1)
                return "Aguardando Retorno"     
            if (inStatus == 2)
                return "Confirmado"     
            if (inStatus == 3)
                return "Pendente Reenvio"     
        }   
        
        this.search = function (isMore) {

            var startAt = 0;
            _self.listOfBeneficiarioCompartRiscoCount = 0;

            if (isMore) {
                startAt = _self.listOfBeneficiarioCompartRisco.length + 1;
            } else {
                _self.listOfBeneficiarioCompartRisco = [];
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
                    _self.disclaimers.push({property: 'cdUnidade',
                        value: filtro,
                        title: 'Unidade: ' + filtro,
                        priority: 1});
                }
                                       
            }

            //Limpa o campo de busca 
            _self.searchInputText = '';             
            
            for( var i = 0; i < _self.disclaimers.length; i++){ 
                if ( _self.disclaimers[i].property === 'inStatus') {
                  _self.disclaimers.splice(i, 1); 
                }
             } 
            
            //Busca os periodos com os filtros informados, retornando o numero de registros configurados apos o campo startAt
            beneficiarioCompartRiscoFactory.getBeneficiarioCompartRiscoByFilter('', startAt, parseInt(_self.config.qtdRegistrosBusca), true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {

                        if (value && value.$length) {
                           _self.listOfBeneficiarioCompartRiscoCount = value.$length;
                        }
                        value.rotulo = _self.criaRotulo(value);
                        value.dsStatus = _self.listStatus(value.inStatus);
                        
                        if (value.inStatus == 0) {
                            value.$selected = true;
                        }
                        _self.listOfBeneficiarioCompartRisco.push(value);
                    });
                    if (isMore === false) {
                        $('.page-wrapper').scrollTop(0);
                    }
                }
            });
        };    

        this.addEventListeners = function(){
          
            $rootScope.$on('invalidateBeneficiarioCompartRisco',function(event, cdUnidade, cdModalidade, cdContrato, cdBeneficiario, dtInicio){

                if(!_self.listOfBeneficiarioCompartRisco 
                || _self.listOfBeneficiarioCompartRisco.length == 0){
                    return;
                }

                for (var i=0; i < _self.listOfBeneficiarioCompartRisco.length; i++) {
                    var beneficiarioCompartRisco = _self.listOfBeneficiarioCompartRisco[i];
                    var indAux = i;
                    
                    if(beneficiarioCompartRisco.cdUnidade == cdUnidade 
                    && beneficiarioCompartRisco.cdModalidade == cdModalidade 
                    && beneficiarioCompartRisco.cdContrato == cdContrato 
                    && beneficiarioCompartRisco.cdBeneficiario == cdBeneficiario 
                    && beneficiarioCompartRisco.dtInicio == dtInicio){
                        beneficiarioCompartRiscoFactory.getBeneficiarioCompartRiscoByFilter('', 0, 0, false,[
                                {property:'cdUnidade', value: cdUnidade, priority:1},
                                {property:'cdModalidade',  value: cdModalidade, priority:2},
                                {property:'cdContrato',  value: cdContrato, priority:3},
                                {property:'cdBeneficiario',  value: cdBeneficiario, priority:4},
                                {property:'dtInicio',  value: dtInicio, priority:5}
                            ],function(result){
                                if(result){
                                    var beneficiarioCompartRiscoAux = result[0];
                                    _self.listOfBeneficiarioCompartRisco[indAux] = beneficiarioCompartRiscoAux;
                                    _self.listOfBeneficiarioCompartRisco[indAux].rotulo = _self.criaRotulo(_self.listOfBeneficiarioCompartRisco[indAux]);
                                    _self.listOfBeneficiarioCompartRisco[indAux].dsStatus = _self.listStatus(_self.listOfBeneficiarioCompartRisco[indAux].inStatus);
                                }
                        }, {noCountRequest: true});
                        break;
                    }
                }
            });  
        };        

        this.removeBeneficiarioCompartRisco = function (selectedbeneficiarioCompartRisco) {  

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover o registro selecionado?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;                       

                   beneficiarioCompartRiscoFactory.removeBeneficiarioCompartRisco(selectedbeneficiarioCompartRisco,
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

        this.removerSelecionados = function () {          
            let tmpBenefsNaoSelecionados = [];

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
               title: 'Atençao!',
               text: 'Você realmente deseja remover os registros selecionados?',
               cancelLabel: 'Nao',
               confirmLabel: 'Sim',
               size: 'md',
               callback: function (hasChoosenYes) {
                   if (hasChoosenYes != true) 
                       return;

                    for (var i = 0; i < _self.listOfBeneficiarioCompartRisco.length; i++) {					
                        if (!_self.listOfBeneficiarioCompartRisco[i].$selected){
                            tmpBenefsNaoSelecionados.push(_self.listOfBeneficiarioCompartRisco[i]);
                        }
                    }

                   beneficiarioCompartRiscoFactory.removeSelectedBenefCompartRisco(tmpBenefsNaoSelecionados, _self.disclaimers,
                   function (result) {

                       if(result.$hasError == true){
                           return;
                       }
                       
                       $rootScope.$broadcast(TOTVSEvent.showNotification, {
                           type: 'success', title: 'Registros removidos com sucesso'
                       });
                       _self.search(false);
                   }); 
               }
            }); 
        };           

        this.openConfigWindow = function () {

            var configWindow = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRisco/ui/beneficiarioCompartRiscoListConfiguration.html',
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
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRisco/ui/beneficiarioCompartRiscoAdvancedFilter.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrb.beneficiarioCompartRiscoAdvFilter.Control as afController',
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
            appViewService.startView("Compartilhamento de Riscos de Beneficiário", 'hrb.beneficiarioCompartRiscoList.Control', _self);
                        
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
    index.register.controller('hrb.beneficiarioCompartRiscoList.Control', beneficiarioCompartRiscoListController);

});


