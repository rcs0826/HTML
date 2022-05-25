define(['index',
'/dts/hgp/html/hcm-calculo_comis_agenc/calculo_comis_agencFactory.js',
'/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
'/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
'/dts/hgp/html/global-provider/providerZoomController.js',
'/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
'/dts/hgp/html/global-parameters/parametersFactory.js',
], function (index) {

// *************************************************************************************
// *** CONTROLLER - LIST
// *************************************************************************************

calculo_comis_agencMainController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service',
                                              'hcm.calculo_comis_agenc.Factory','global.userConfigs.Factory',
                                              '$modal','AbstractAdvancedFilterController','TOTVSEvent', '$location', '$timeout'];
function calculo_comis_agencMainController($rootScope, $scope, $state, $stateParams,  appViewService, calculo_comis_agencFactory,
                                            userConfigsFactory, $modal,AbstractAdvancedFilterController, 
                                            TOTVSEvent, $location, $timeout) {

    var _self = this;

    _self.cdProgramaCorrente = 'hcm.calculo_comis_agencMain';
    _self.config = [];
    _self.listItemInfoClasses = "col-sm-12 col-md-12 col-lg-12 col-sm-height";

    this.init = function(){
        appViewService.startView("Cálculo\Previsão de Comissões\Agenciamento", 'hcm.calculo_comis_agencMain.Control', _self);
                    
        if(appViewService.lastAction != 'newtab'
        && _self.currentUrl == $location.$$path){
            return;
        }

        _self.parametros = [];
        _self.dadosTela = {};
        _self.providerFixedFilters = {};

        _self.currentUrl = $location.$$path;    
        
        _self.listComissAgenc = [{'value': 1, 'label': 'Comissão'}
        ,{'value': 2, 'label': 'Agenciamento'}];

        _self.listPrevisaoCalculo = [{'value': 1, 'label': 'Previsão'}
        ,{'value': 2, 'label': 'Cálculo'}];

        _self.dadosTela.dtGeracao = new Date();
        _self.dadosTela.inComissaoAgenciamento = 1;
        _self.dadosTela.inPrevisaoCalculo = 1;
        _self.dadosTela.dtCompetencia = new Date();
        _self.dadosTela.rangeVigencia = {startDate : new Date(), endDate : new Date()};
        _self.dadosTela.rangeVigenciaMod = {startDate : new Date(), endDate : new Date()};
        _self.dadosTela.rangeFuncao = {start: 1, end: 999};
        _self.dadosTela.rangeRepresentante = {start: 1, end: 999999};
        _self.dadosTela.rangeModalidade = {start: 1, end: 99};
        _self.dadosTela.rangeContratante = {start: 1, end: 99999999};        
		_self.dadosTela.lgVigenciaContrato = true;	
        _self.dadosTela.lgSeparaRepresentante = true;

        calculo_comis_agencFactory.getParametros(function (result) {
            if (result) {
                _self.tmpModalidade = result;                
            }
        });

        calculo_comis_agencFactory.getLayouts(function (result) {
            if (result) {
                _self.tmpLayouts = result;
            }
        });
    };

    // grava o lgSelecionado conforme a selecao de tela
    this.markSelectedRows = function (tmp){
        for (var i = 0, len = tmp.length; i < len; i++) {
            tmp[i].lgSelecionado = tmp[i].$selected;
        }
        return tmp;
    };

    this.realizarCalculo = function(){
        
        if (!_self.checkFields()){
            return;
        }
        
        _self.parametros = {};
        _self.parametros.dtGeracao = _self.dadosTela.dtGeracao;
        _self.parametros.inComissaoAgenciamento = _self.dadosTela.inComissaoAgenciamento;
        _self.parametros.inPrevisaoCalculo = _self.dadosTela.inPrevisaoCalculo;
        _self.parametros.dtPerCompetenciaIni = _self.dadosTela.dtCompetencia;
        _self.parametros.lgNovosContratantes = _self.dadosTela.lgNovosContratantes;
        _self.parametros.lgSeparaRepresentante = _self.dadosTela.lgSeparaRepresentante;
        _self.parametros.cdFuncaoIni = _self.dadosTela.rangeFuncao.start;
        _self.parametros.cdFuncaoFim = _self.dadosTela.rangeFuncao.end;
        _self.parametros.cdRepresentanteIni = _self.dadosTela.rangeRepresentante.start;
        _self.parametros.cdRepresentanteFim = _self.dadosTela.rangeRepresentante.end;
        _self.parametros.cdModalidadeIni = _self.dadosTela.rangeModalidade.start;
        _self.parametros.cdModalidadeFim = _self.dadosTela.rangeModalidade.end;
        _self.parametros.cdContratanteIni = _self.dadosTela.rangeContratante.start;
        _self.parametros.cdContratanteFim = _self.dadosTela.rangeContratante.end;
        _self.parametros.dtPerVigenciaIni = _self.dadosTela.rangeVigencia.startDate;
        _self.parametros.dtPerVigenciaFim = _self.dadosTela.rangeVigencia.endDate; 
        _self.parametros.lgVigenciaContrato = _self.dadosTela.lgVigenciaContrato; 		
        _self.parametros.lgVigenciaModulos = _self.dadosTela.lgVigenciaModulos; 		

        
        _self.parametros.codLayout = _self.tmpLayouts.filter(function(element) {return element.selected} )[0].cdLayout;
        
        

        _self.tmpModalidade   = this.markSelectedRows(_self.tmpModalidade);                    
                 
        calculo_comis_agencFactory.geraCalculoComissAgenc(_self.parametros, _self.tmpModalidade, function (result) {
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

    this.onLayoutChanged = function(layout){
        for (var i = _self.tmpLayouts.length - 1; i >= 0; i--) {
            _self.tmpLayouts[i].selected = false;
        }
        layout.selected = true;
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
        
        if (_self.dadosTela.rangeVigencia.startDate > _self.dadosTela.rangeVigencia.endDate){
            camposOk = false;
            mensagem.push('Data de vigência Proposta final menor que inicial');
        }                
        
        if (_self.dadosTela.rangeVigenciaMod.startDate > _self.dadosTela.rangeVigenciaMod.endDate){
            camposOk = false;
            mensagem.push('Data de vigência Modulo final menor que inicial');
        }        
        
        
        
        if (_self.dadosTela.rangeFuncao.start > _self.dadosTela.rangeFuncao.end){
            camposOk = false;
            mensagem.push('Função final menor que inicial');
        }
        if (_self.dadosTela.rangeRepresentante.start > _self.dadosTela.rangeRepresentante.end){
            camposOk = false;
            mensagem.push('Representante final menor que inicial');
        }
        if (_self.dadosTela.rangeModalidade.start > _self.dadosTela.rangeModalidade.end){
            camposOk = false;
            mensagem.push('Modalidade final menor que inicial');
        }
        if (_self.dadosTela.rangeContratante.start > _self.dadosTela.rangeContratante.end){
            camposOk = false;
            mensagem.push('Contratante final menor que inicial');
        }

        if (_self.tmpLayouts.filter(function(element) {return element.selected})[0] === undefined) {
            camposOk = false;
            mensagem.push('Selecione um layout para geração');
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
index.register.controller('hcm.calculo_comis_agencMain.Control', calculo_comis_agencMainController);

});


