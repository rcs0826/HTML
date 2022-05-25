define(['index',
'/dts/hgp/html/hcg-eSocialExportaXML/eSocialExportaXMLFactory.js',
'/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
'/dts/hgp/html/util/customFilters.js',
'/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
'/dts/hgp/html/global-provider/providerZoomController.js',
'/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
'/dts/hgp/html/global-parameters/parametersFactory.js',
], function (index) {

// *************************************************************************************
// *** CONTROLLER - LIST
// *************************************************************************************

eSocialeSocialEventDeleteController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                              'hcg.eSocialExportaXML.Factory','global.userConfigs.Factory', 'global.parameters.Factory',
                                              '$modal','AbstractAdvancedFilterController','TOTVSEvent', '$location', '$timeout'];
function eSocialeSocialEventDeleteController($rootScope, $scope, $state, $stateParams,  appViewService, eSocialExportaXMLFactory,
                                            userConfigsFactory, parametersFactory, $modal,AbstractAdvancedFilterController, 
                                            TOTVSEvent, $location, $timeout) {
    
    var _self = this;                                                

    _self.cdProgramaCorrente = 'hcg.eSocialExportaXMLList';
    _self.config = [];
    _self.listItemInfoClasses = "col-sm-12 col-md-12 col-lg-12 col-sm-height";        
    _self.openMode = "search";
    _self.regRepetidos = 0;

    this.cleanModel = function(){
        
        _self.disclaimers = [];
        _self.dadosTela = [];
        _self.parametros = [];
        _self.envioEsocial = [];
        _self.layoutsESocial = [];
        _self.providerFixedFilters = {};

    }

    this.openCloseParamFields = function(fieldsDivId){             
        $('#' + fieldsDivId).slideToggle();            
    };

    this.changeMode = function(fieldsDivId){

        if (_self.openMode == fieldsDivId) return;

        this.openCloseParamFields(_self.openMode);
        this.openCloseParamFields(fieldsDivId);

        _self.openMode = fieldsDivId;        
    }

    this.init = function(){
        appViewService.startView("Consulta Mensagens Enviadas eSocial", 'hcg.eSocialEventDelete.Control', _self);        

        $timeout(function(){            
            if (_self.openMode != "search"){
                _self.openCloseParamFields("search");
                _self.openCloseParamFields(_self.openMode);
            }            
            $('#'+ _self.openMode + 'Btn').click();                    
        });          

        if(appViewService.lastAction != 'newtab'
        && _self.currentUrl == $location.$$path){
            return;
        }       
                
        _self.cleanModel();

        _self.currentUrl = $location.$$path;        

        parametersFactory.getParamecp(function(result){
            _self.paramecp = result;
            _self.providerFixedFilters['cdUnidade'] = _self.paramecp.cdUnimed;            
        });        

        eSocialExportaXMLFactory.getParametrosHtmlExportacao(function (result) {
            if (result) {
                angular.forEach(result, function (value) {
                    _self.parametros.push(value);
                });
            }
        });

        eSocialExportaXMLFactory.getEventosESocial(false, function(result){
            _self.eventosESocial = [];
            _self.eventosESocial.push({
                value: "0",
                label: "Todos os Layouts"
            });
            if (result) {
                angular.forEach(result, function (value) {
                    value.value = value.cdEvento;
                    value.label = value.cdEvento + " - " + value.dsEvento;  
                    _self.eventosESocial.push(value);
                })
            }
            _self.dadosTela.cdEvento = "0";

        });

        eSocialExportaXMLFactory.getEventosESocial(true, function(result){
            _self.eventosPeriodicosESocial = [];
            _self.eventosPeriodicosESocial.push({
                value: "0",
                label: "Todos os Layouts Periódicos"
            });
            if (result) {
                angular.forEach(result, function (value) {
                    value.value = value.cdEvento;
                    value.label = value.cdEvento + " - " + value.dsEvento;                    
                    _self.eventosPeriodicosESocial.push(value);
                })
            }
            _self.dadosTela.cdEventoPeriodo = "0";

        });
    };

    this.buscarEnvios = function(isMore){

        if (!_self.checkFields()){
            return;
        }

        var startAt = 0;
        _self.envioEsocialCount = 0;             

        if (isMore) {
            startAt = _self.envioEsocial.length + 1 + _self.regRepetidos;            
        } else {
            _self.envioEsocial = [];
            _self.regRepetidos = 0;
        }

        var disclaimersAux = [];
        
        if (_self.dadosTela.dtInicial){
            disclaimersAux.push({property: 'dtInicial',
                                 value: _self.dadosTela.dtInicial,
                                 priority: 12});
        }
        if (_self.dadosTela.dtFinal){
            disclaimersAux.push({property: 'dtFinal',
                                 value: _self.dadosTela.dtFinal,
                                 priority: 11});
        }
        if (_self.dadosTela.dtPeriodoInicial){
            disclaimersAux.push({property: 'dtPeriodoInicial',
                                 value: _self.dadosTela.dtPeriodoInicial,
                                 priority: 10});
        }
        if (_self.dadosTela.dtPeriodoFinal){
            disclaimersAux.push({property: 'dtPeriodoFinal',
                                 value: _self.dadosTela.dtPeriodoFinal,
                                 priority: 9});
        }
        if (_self.dadosTela.cdGrupoPrestIni){
            disclaimersAux.push({property: 'cdGrupoPrestIni',
                                 value: _self.dadosTela.cdGrupoPrestIni,
                                 priority: 8
            });
        }
        if (_self.dadosTela.cdGrupoPrestFim){
            disclaimersAux.push({property: 'cdGrupoPrestFim',
                                 value: _self.dadosTela.cdGrupoPrestFim,
                                 priority: 7
            });
        }
        if (_self.dadosTela.cdPrestIni){
            disclaimersAux.push({property: 'cdPrestIni',
                                 value: _self.dadosTela.cdPrestIni,
                                 priority: 6});
        }
        if (_self.dadosTela.cdPrestFim){
            disclaimersAux.push({property: 'cdPrestFim',
                                 value: _self.dadosTela.cdPrestFim,
                                 priority: 5});
        }        
        
        disclaimersAux.push({property: 'codEvento',
                            value: _self.dadosTela.cdEvento,
                            priority: 3});

        eSocialExportaXMLFactory.getEnvioEsocialByFilter('', startAt, 50, true, disclaimersAux, function (result) {
            if (result) {
                angular.forEach(result.tmpEnvioESocial, function (value) {                    
                    _self.envioEsocial.push(value);
                });
                _self.envioEsocialCount = result.numRegisters;                
                _self.regRepetidos = _self.regRepetidos + result.regRepetidos;                
            }
        });        
    }

    this.retificarRegistros = function() {

        var enviosSelecionados = [];        
      
        if (_self.openMode == "period"){
            if (!_self.checkFields()){
                return;
            }

            _self.parametros[0].lgBuscaPeriodo = true;
            _self.parametros[0].codEvento      = _self.dadosTela.cdEventoPeriodo;   
            _self.parametros[0].dtPeriod       = _self.dadosTela.dtPeriod;          
        }else{            
            _self.parametros[0].lgBuscaPeriodo = false;

            angular.forEach(_self.envioEsocial, function(value, key) {
                if (value.$selected){    
                    enviosSelecionados.push(value);               
                }
            });       
            
            if(enviosSelecionados.length == 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: "Nenhum envio selecionado para retificação!"
                });
                return;
            }
        }              
         
        _self.parametros[0].lgRetifica    = true;  
        _self.parametros[0].lgExporta3000 = false;

        eSocialExportaXMLFactory.executaRetificacaoESocial(_self.parametros, enviosSelecionados, function (result) {
            if (result) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'info', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                }); 
                return;
            }
        });

    }

    this.exportarRegistros = function(){

        var enviosSelecionados = [];

        if (_self.openMode == "period"){
            if (!_self.checkFields()){
                return;
            }

            _self.parametros[0].lgBuscaPeriodo = true;
            _self.parametros[0].codEvento      = _self.dadosTela.cdEventoPeriodo;
            _self.parametros[0].dtPeriod       = _self.dadosTela.dtPeriod;
        }else{            
            _self.parametros[0].lgBuscaPeriodo = false;

            angular.forEach(_self.envioEsocial, function(value, key) {
                if (value.$selected){
                    enviosSelecionados.push(value);               
                }
            });      
    
            if(enviosSelecionados.length == 0){            
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: "Nenhum envio selecionado para exclusão"
                });
                return;
            }
        }

        _self.parametros[0].lgExporta1200 = false;
        _self.parametros[0].lgExporta1210 = false;
        _self.parametros[0].lgExporta2205 = false;
        _self.parametros[0].lgExporta2230 = false;
        _self.parametros[0].lgExporta2300 = false;
        _self.parametros[0].lgExporta2306 = false;
        _self.parametros[0].lgExporta2399 = false;
        _self.parametros[0].lgRetifica    = false;  
        _self.parametros[0].lgExporta3000 = true;      

        eSocialExportaXMLFactory.executaExclusao(_self.parametros, enviosSelecionados, function (result) {
            if (result) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'info', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                }); 
                return;
            }
        });
    }

    this.onGrupoPrestIniChanged = function(){
        $timeout(function(){            
            if (_self.dadosTela.cdGrupoPrestFim == 0 || _self.dadosTela.cdGrupoPrestFim == undefined){
                _self.dadosTela.cdGrupoPrestFim = _self.dadosTela.cdGrupoPrestIni;
            }            
            _self.dadosTela.cdPrestIni = 0;
            _self.dadosTela.cdPrestFim = 0;            
        });
    };

    this.onGrupoPrestFimChanged = function(){
        $timeout(function(){
            if (_self.dadosTela.cdGrupoPrestIni == 0 || _self.dadosTela.cdGrupoPrestIni == undefined){
                _self.dadosTela.cdGrupoPrestIni = _self.dadosTela.cdGrupoPrestFim;                            
            }            
            _self.dadosTela.cdPrestIni = 0;
            _self.dadosTela.cdPrestFim = 0;            
        });
    };

    this.onPrestIniChanged = function(){
        $timeout(function(){
            if (_self.dadosTela.cdPrestFim == 0 || _self.dadosTela.cdPrestFim == undefined){
                _self.dadosTela.cdPrestFim = _self.dadosTela.cdPrestIni;
            }            
            _self.dadosTela.cdGrupoPrestIni = 0;
            _self.dadosTela.cdGrupoPrestFim = 0;            
        });
    };

    this.onPrestFimChanged = function(){
        $timeout(function(){
            if (_self.dadosTela.cdPrestIni == 0 || _self.dadosTela.cdPrestIni == undefined){
                _self.dadosTela.cdPrestIni = _self.dadosTela.cdPrestFim;
            }            
            _self.dadosTela.cdGrupoPrestIni = 0;
            _self.dadosTela.cdGrupoPrestFim = 0;            
        });
    };

    this.checkFields = function(){        
        var camposOk = true;
        var mensagem = [];

        if (_self.filtersForm.$invalid){
            camposOk = false;
            _self.filtersForm.$setDirty();              
            angular.forEach(_self.filtersForm, function(value, key) {
                if (typeof value === 'object' && value.hasOwnProperty('$modelValue')){
                    value.$setDirty();                    
                }
            });             
            mensagem.push('Existem campos com valor inválido ou nao informado. Revise as informações.');
        }                  

        if (_self.openMode == "search"){
            camposOk = _self.checkFieldsSearch(mensagem);
        }else{
            camposOk = _self.checkFieldsPeriod(mensagem);
        }
               
        if (!camposOk){
            mensagem.forEach(function(element) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: element
                });
            }, this);            
        }
        return camposOk;
    }

    this.checkFieldsSearch = function(mensagem){

        var camposOk = true;

        if (_self.dadosTela.dtInicial &&
            _self.dadosTela.dtFinal   &&
            _self.dadosTela.dtInicial > _self.dadosTela.dtFinal){                
                camposOk = false;
                mensagem.push('Data final menor que a inicial');
                       
        }

        if (_self.dadosTela.dtPeriodoInicial &&
            _self.dadosTela.dtPeriodoFinal   &&
            _self.dadosTela.dtPeriodoInicial > _self.dadosTela.dtPeriodoFinal){                
                camposOk = false;
                mensagem.push('Período de apuração final menor que a inicial');
                       
        }

        if (_self.dadosTela.cdGrupoPrestIni != 0 &&
            _self.dadosTela.cdGrupoPrestFim != 0 &&
            _self.dadosTela.cdGrupoPrestIni > _self.dadosTela.cdGrupoPrestFim){
                camposOk = false;
                mensagem.push('Código do Grupo de Prestadores final menor que o inicial');
        }

        if (_self.dadosTela.cdPrestIni != 0 &&
            _self.dadosTela.cdPrestFim != 0 &&
            _self.dadosTela.cdPrestIni > _self.dadosTela.cdPrestFim){
                camposOk = false;
                mensagem.push('Código do Prestador final menor que o inicial');
        }

        return camposOk;
    }

    this.checkFieldsPeriod = function(mensagem){
        
        var camposOk = true;

        if (!_self.dadosTela.dtPeriod){            
            camposOk = false;
            mensagem.push('Informe o período a ser retificado/excluído');            
        }
        return camposOk;
    }

    if ($rootScope.currentuserLoaded) {        
        this.init();
    } else {
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            _self.init();
        });
    }
}
index.register.controller('hcg.eSocialEventDelete.Control', eSocialeSocialEventDeleteController);

});


