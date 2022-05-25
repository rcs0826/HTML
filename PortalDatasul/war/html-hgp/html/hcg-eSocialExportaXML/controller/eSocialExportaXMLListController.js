define(['index',
'/dts/hgp/html/hcg-eSocialExportaXML/eSocialExportaXMLFactory.js',
'/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
'/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
'/dts/hgp/html/global-provider/providerZoomController.js',
'/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
'/dts/hgp/html/global-parameters/parametersFactory.js',
], function (index) {

// *************************************************************************************
// *** CONTROLLER - LIST
// *************************************************************************************

eSocialExportaXMLListController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                              'hcg.eSocialExportaXML.Factory','global.userConfigs.Factory', 'global.parameters.Factory',
                                              '$modal','AbstractAdvancedFilterController','TOTVSEvent', '$location', '$timeout'];
function eSocialExportaXMLListController($rootScope, $scope, $state, $stateParams,  appViewService, eSocialExportaXMLFactory,
                                            userConfigsFactory, parametersFactory, $modal,AbstractAdvancedFilterController, 
                                            TOTVSEvent, $location, $timeout) {

    var _self = this;

    _self.cdProgramaCorrente = 'hcg.eSocialExportaXMLList';
    _self.config = [];
    _self.listItemInfoClasses = "col-sm-12 col-md-12 col-lg-12 col-sm-height";

    this.init = function(){
        appViewService.startView("Central de Exportações eSocial", 'hcg.eSocialExportaXMLList.Control', _self);
                    
        if(appViewService.lastAction != 'newtab'
        && _self.currentUrl == $location.$$path){
            return;
        }

        _self.disclaimers = [];
        _self.parametros = [];
        _self.dadosTela = [];
        _self.providerFixedFilters = {};
        _self.dadosTAF = {};

        _self.currentUrl = $location.$$path;        

        parametersFactory.getParamecp(function(result){
            _self.paramecp = result;
            _self.providerFixedFilters['cdUnidade'] = _self.paramecp.cdUnimed;            
        });        

        eSocialExportaXMLFactory.getParametrosHtmlExportacao(function (result) {
            if (result) {
                angular.forEach(result, function (value) {
                    _self.parametros.push(value);
                })
                _self.dadosTela = {                   
                    dtInicial: _self.parametros[0].dtRefIni,
                    dtFinal: _self.parametros[0].dtRefFim,
                    cdGrupoPrestIni: _self.parametros[0].cdGrupoPrestIni,
                    cdGrupoPrestFim: _self.parametros[0].cdGrupoPrestFim,
                    cdPrestIni: _self.parametros[0].cdPrestIni,
                    cdPrestFim: _self.parametros[0].cdPrestFim,
                    registros: []
                }
                
                if (_self.parametros[0].lgExporta1200){
                    _self.dadosTela.registros.push({tpRegistro: '1200',
                                                    $selected: _self.parametros[0].lgExporta1200,
                                                    dsRegistro: _self.parametros[0].dsRegistro1200})
                }
                
                if (_self.parametros[0].lgExporta1210){
                    _self.dadosTela.registros.push({tpRegistro: '1210',
                                                    $selected: _self.parametros[0].lgExporta1210,
                                                    dsRegistro: _self.parametros[0].dsRegistro1210})
                }

                if (_self.parametros[0].lgExporta2205){
                    _self.dadosTela.registros.push({tpRegistro: '2205',
                                                    $selected: _self.parametros[0].lgExporta2205,
                                                    dsRegistro: _self.parametros[0].dsRegistro2205})
                }

                if (_self.parametros[0].lgExporta2230){
                    _self.dadosTela.registros.push({tpRegistro: '2230',
                                                    $selected: _self.parametros[0].lgExporta2230,
                                                    dsRegistro: _self.parametros[0].dsRegistro2230})
                }

                if (_self.parametros[0].lgExporta2300){
                    _self.dadosTela.registros.push({tpRegistro: '2300',
                                                    $selected: _self.parametros[0].lgExporta2300,
                                                    dsRegistro: _self.parametros[0].dsRegistro2300})
                }

                if (_self.parametros[0].lgExporta2306){
                    _self.dadosTela.registros.push({tpRegistro: '2306',
                                                    $selected: _self.parametros[0].lgExporta2306,
                                                    dsRegistro: _self.parametros[0].dsRegistro2306})
                }

                if (_self.parametros[0].lgExporta2399){
                    _self.dadosTela.registros.push({tpRegistro: '2399',
                                                    $selected: _self.parametros[0].lgExporta2399,
                                                    dsRegistro: _self.parametros[0].dsRegistro2399})
                }
                
                $('.page-wrapper').scrollTop(0);
            }
        });

        this.verificarStatusTAF();
    };

    this.verificarStatusTAF = function() {
        parametersFactory.getDadosIntegracaoTAF(function (result) {
            if (result) {
                _self.dadosTAF = result[0];
                if (_self.dadosTAF.possuiConexao) {
                    _self.dadosTAF.statusServico = "Ativo";
                    _self.dadosTAF.styleClass = "infoTaf on";
                } else {
                    _self.dadosTAF.statusServico = "Inativo";
                    _self.dadosTAF.styleClass = "infoTaf off";
                }
            }
        });
    }

    this.exportarRegistros = function(){
        
        if (!_self.checkFields()){
            return;
        }

        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1200"){ return r; }})[0] != undefined)
            _self.parametros[0].lgExporta1200 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1200"){ return r; }})[0].$selected;
        
        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1210"){ return r; }})[0] != undefined)
            _self.parametros[0].lgExporta1210 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1210"){ return r; }})[0].$selected;

        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2205"){ return r; }})[0] != undefined)
            _self.parametros[0].lgExporta2205 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2205"){ return r; }})[0].$selected;

        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2230"){ return r; }})[0] != undefined)
            _self.parametros[0].lgExporta2230 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2230"){ return r; }})[0].$selected;

        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2300"){ return r; }})[0] != undefined)
            _self.parametros[0].lgExporta2300 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2300"){ return r; }})[0].$selected;

        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2306"){ return r; }})[0] != undefined)
            _self.parametros[0].lgExporta2306 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2306"){ return r; }})[0].$selected;

        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2399"){ return r; }})[0] != undefined)
            _self.parametros[0].lgExporta2399 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "2399"){ return r; }})[0].$selected;

        _self.parametros[0].dtRefIni         = _self.dadosTela.dtInicial;
        _self.parametros[0].dtRefFim         = _self.dadosTela.dtFinal;
        _self.parametros[0].cdGrupoPrestIni  = _self.dadosTela.cdGrupoPrestIni;     
        _self.parametros[0].cdGrupoPrestFim  = _self.dadosTela.cdGrupoPrestFim;      
        _self.parametros[0].cdPrestIni       = _self.dadosTela.cdPrestIni; 
        _self.parametros[0].cdPrestFim       = _self.dadosTela.cdPrestFim; 
        _self.parametros[0].lgReenvio        = _self.dadosTela.reenvio;    
                 
        eSocialExportaXMLFactory.executaExportacao(_self.parametros, function (result) {
            if (result) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'info', title: 'Gerado pedido RPW Nº: ' + result.nrPedido
                }); 
                return;
            }
        });
    }

    this.excluirEventos = function(){
        $state.go($state.get('dts/hgp/hcg-eSocialExportaXML.delete'));
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
        var lgExporta1200;
        var lgExporta1210;
        
        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1200"){ return r; }})[0] != undefined)
            lgExporta1200 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1200"){ return r; }})[0].$selected;
        else lgExporta1200 = false;

        if(_self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1210"){ return r; }})[0] != undefined)
            lgExporta1210 = _self.dadosTela.registros.filter(function(r){ if(r.tpRegistro == "1210"){ return r; }})[0].$selected;
        else lgExporta1210 = false;

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
        
        if (_self.dadosTela.dtInicial > _self.dadosTela.dtFinal){
            camposOk = false;
            mensagem.push('Data final menor que a inicial');
        }   
        myDateIni = new Date(_self.dadosTela.dtInicial);   
        myDateFim = new Date(_self.dadosTela.dtFinal);   
        
        if(lgExporta1200 || lgExporta1210){
            if (myDateIni.getFullYear() != myDateFim.getFullYear()
             || myDateIni.getMonth() != myDateFim.getMonth()){
                camposOk = false;
                mensagem.push('O mes e ano do periodo de exportacao deve ser o mesmo');
            }
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
        
        if (!camposOk){
                mensagem.forEach(function(element) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: element
                    });
                }, this);            
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
index.register.controller('hcg.eSocialExportaXMLList.Control', eSocialExportaXMLListController);

});


