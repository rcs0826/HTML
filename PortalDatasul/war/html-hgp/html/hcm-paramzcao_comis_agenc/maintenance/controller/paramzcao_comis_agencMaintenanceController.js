define(['index',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hcm-paramzcao_comis_agenc/paramzcao_comis_agencFactory.js',        
    ], function(index) {

    paramzcao_comis_agencMaintenanceController.$inject = ['$rootScope', '$scope','$state',
        '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service',
        '$location','hcm.paramzcao_comis_agenc.Factory','TOTVSEvent' ];

    function paramzcao_comis_agencMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService,
        appViewService, $location, paramzcao_comis_agencFactory , TOTVSEvent 
    ) {

        var _self = this;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.paramzcao_comis_agenc = {};
        _self.refresh = false;

        //campos para alteracao do evento
        _self.editingEvent = null; //evento em edicao
        _self.lgEventoUtilizaPctComis = false;
        _self.vlEventoComis = 0;
        _self.lgEventoUtilizaPctAgenc = false;
        _self.vlEventoAgenc = 0;
        _self.listComissAgenc = [{'value': "COMISSAO", 'label': 'Comissão'},
                                 {'value': "AGENCIAMENTO", 'label': 'Agenciamento'},
                                 {'value': "AMBOS", 'label': 'Ambos'}];
        

        this.cleanModel = function (){
            _self.paramzcao_comis_agenc = {};
            _self.tmpFuncao = [];
            _self.tmpTipoProposta = [];
            _self.tmpConvenio = [];
            _self.tmpModalidade = [];
            _self.tmpEvento = [];
        }

        this.init = function(){
            appViewService.startView("Manutenção de Regra de Comissão\Agenciamento",
                                     'hcm.paramzcao_comis_agencMaintenance.Control',
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path
            && !_self.refresh){
                return;
            }
            _self.refresh = false;

            _self.cleanModel();

            _self.currentUrl = $location.$$path;

            _self.listConsidParamzcaoAgenc = [{'value': 1, 'label': 'Vidas Novas'}
                                             ,{'value': 2, 'label': 'Vidas Existentes'}
                                             ,{'value': 3, 'label': 'Vidas Titular Novo'}
                                             ,{'value': 4, 'label': 'Vidas Totais'}];

            _self.listConsidParamzcaoBenefPagto = [{'value': 1, 'label': 'Vidas Novas'}
                                                  ,{'value': 2, 'label': 'Vidas Existentes'}
                                                  ,{'value': 3, 'label': 'Vidas Titular Novo'}
                                                  ,{'value': 4, 'label': 'Vidas Totais'}];

            _self.listContagComisAgenc = [{'value': 1, 'label': 'Grupo contratante'}
                                         ,{'value': 2, 'label': 'Contratante'}
                                         ,{'value': 3, 'label': 'Termo'}
                                         ,{'value': 4, 'label': 'Termo/Evento'}];

            _self.listinVigPropMod = [{'value': 1, 'label': 'Vigencia proposta'}
                                     ,{'value': 2, 'label': 'Vigencia modulo'}];										 
										 
            if($state.current.name === 'dts/hgp/hcm-paramzcao_comis_agenc.new'){
                _self.tmpCondPagto = {};
                _self.action = 'INSERT';

            }else if($state.current.name === 'dts/hgp/hcm-paramzcao_comis_agenc.detail'){
                _self.action = 'DETAIL';
            }else{
                _self.action = 'EDIT';
            }

            var idRegraAux = 0;
            if (_self.action != 'INSERT')
              idRegraAux = $stateParams.idRegra;


            var disclaimersAux = [];
                disclaimersAux.push({property: 'idRegra', value: idRegraAux, priority:1});


            paramzcao_comis_agencFactory.prepareDataToMaintenanceWindow(idRegraAux,
                function (result) {
                    if (result) {                            
                          _self.paramzcao_comis_agenc = result.tmpParamzcao_comis_agenc[0];

                          for (var i = 0, len = result.tmpCondPagto.length; i < len; i++) {
                              result.tmpCondPagto[i].value = result.tmpCondPagto[i].cdCondicao;
                              result.tmpCondPagto[i].label = result.tmpCondPagto[i].dsCondicao;
                          }
                          _self.listCdnCondPagto = result.tmpCondPagto;

                          _self.tmpFuncao = _self.selectMarkedRows(result.tmpFuncao);
                          _self.tmpTipoProposta = _self.selectMarkedRows(result.tmpTipoProposta);
                          _self.tmpConvenio = _self.selectMarkedRows(result.tmpConvenio);
                          _self.tmpModalidade = _self.selectMarkedRows(result.tmpModalidade);
                          _self.tmpEvento = _self.selectMarkedRows(result.tmpEvento);

                          if (_self.action == 'INSERT'){
                            _self.cleanparamzcao_comis_agencInputFields();
                          }
                    }
                });
        };

        // marca os registros conforme estao salvos no progress
        this.selectMarkedRows = function (tmp){
          for (var i = 0, len = tmp.length; i < len; i++) {
            tmp[i].$selected = tmp[i].lgSelecionado;
          }
          return tmp;
        };

        // grava o lgSelecionado conforme a selecao de tela
        this.markSelectedRows = function (tmp){
          for (var i = 0, len = tmp.length; i < len; i++) {
            tmp[i].lgSelecionado = tmp[i].$selected;
          }
          return tmp;
        };

        this.onChangeTable = function (event) {
            // nao permite alteracao
            if (_self.action == 'DETAIL'){
                for (var i = 0, len = event.selectedItems.length; i < len; i++) {
                    event.selectedItems[i].$selected = !event.selectedItems[i].$selected;
                }
                for (var i = 0, len = event.unselectedItems.length; i < len; i++) {
                    event.unselectedItems[i].$selected = !event.unselectedItems[i].$selected;
                }
            }
        };

        this.onChangeEvents = function() {

          _self.lgEventoUtilizaPctComis = false;
          _self.vlEventoComis = 0;
          _self.lgEventoUtilizaPctAgenc = false;
          _self.vlEventoAgenc = 0;

          _self.editingEvent = null;
          for (var i = 0, len = _self.tmpEvento.length; i < len; i++) {
            if (_self.tmpEvento[i].$selected){
              _self.editingEvent = _self.tmpEvento[i];

              if (_self.tmpEvento[i].percentComis > 0){
                _self.lgEventoUtilizaPctComis = true;
                _self.vlEventoComis = _self.tmpEvento[i].percentComis;
              } else {
                _self.vlEventoComis = _self.tmpEvento[i].valComis;
              }

              if (_self.tmpEvento[i].percentAgenc > 0){
                _self.lgEventoUtilizaPctAgenc = true;
                _self.vlEventoAgenc = _self.tmpEvento[i].percentAgenc;
              } else {
                _self.vlEventoAgenc = _self.tmpEvento[i].valAgenc;
              }

            }
          }
		    setTimeout(function (){
										$("#controller_vleventocomis").keypress(function (e) { 
									     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which != 46)) { 		
									         return false; 
									    } 
		     });$("#controller_vleventoagenc").keypress(function (e) { 
									     if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57) && (e.which != 46)) { 		
									         return false; 
									    } 
		     }); }, 1000);
        };
        this.saveEvent = function() {
          if (_self.lgEventoUtilizaPctComis){
            _self.editingEvent.percentComis = _self.vlEventoComis;
            _self.editingEvent.valComis = 0;
          } else {
            _self.editingEvent.valComis = _self.vlEventoComis;
            _self.editingEvent.percentComis = 0;
          }

          if (_self.lgEventoUtilizaPctAgenc){
            _self.editingEvent.percentAgenc = _self.vlEventoAgenc;
            _self.editingEvent.valAgenc = 0;
          } else {
            _self.editingEvent.valAgenc = _self.vlEventoAgenc;
            _self.editingEvent.percentAgenc = 0;
          }
        };

        this.cleanparamzcao_comis_agencInputFields = function (){

            //default values
            _self.paramzcao_comis_agenc.desParamzcaoAgenc = "";
            _self.paramzcao_comis_agenc.considParamzcaoAgenc = 0;
            _self.paramzcao_comis_agenc.contagComisAgenc = 0;
            _self.paramzcao_comis_agenc.cdnCondPagto = 0;
            _self.paramzcao_comis_agenc.dsComissaoAgenciamento = "COMISSAO";
            _self.paramzcao_comis_agenc.numLivre1 = 30;
            _self.paramzcao_comis_agenc.cdModalidadeIni = 1;
            _self.paramzcao_comis_agenc.cdModalidadeFim = 99;
            _self.paramzcao_comis_agenc.cdPlanoIni = 1;
            _self.paramzcao_comis_agenc.cdPlanoFim = 99;
            _self.paramzcao_comis_agenc.cdTipoPlanoIni = 1;
            _self.paramzcao_comis_agenc.cdTipoPlanoFim = 99;
            _self.paramzcao_comis_agenc.contagComisAgenc = 1;
            _self.paramzcao_comis_agenc.idiQuantBeneficInic = 1;
            _self.paramzcao_comis_agenc.qtBeneficiarios = 999999;
            _self.paramzcao_comis_agenc.dtInicial = new Date();
            _self.paramzcao_comis_agenc.dtFinal = new Date(2050, 11, 1);
            _self.paramzcao_comis_agenc.inVigPropMod = 0;
            _self.paramzcao_comis_agenc.idiConsidParamzcaoBenefPagto = 0;
        };

        this.saveNew = function(){
            _self.save(true, false);
        };

        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {

            var novoRegistro = true;
            if (_self.action != 'INSERT') {
                novoRegistro = false;
            }            

            _self.tmpFuncao       = this.markSelectedRows(_self.tmpFuncao);
            _self.tmpTipoProposta = this.markSelectedRows(_self.tmpTipoProposta);
            _self.tmpConvenio     = this.markSelectedRows(_self.tmpConvenio);
            _self.tmpModalidade   = this.markSelectedRows(_self.tmpModalidade);

            if (!_self.permiteSalvar()){
                return;
            }

            paramzcao_comis_agencFactory.saveParamzcao_comis_agenc(novoRegistro, _self.paramzcao_comis_agenc,
                _self.tmpFuncao, _self.tmpTipoProposta, _self.tmpConvenio, _self.tmpModalidade, _self.tmpEvento,

                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    result = result[0];

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Regra de Comissão\Agenciamentos salva com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.cleanparamzcao_comis_agencInputFields();
                        if(_self.action != 'INSERT'){
                            $state.go($state.get('dts/hgp/hcm-paramzcao_comis_agenc.new'));
                        } else {
                          _self.refresh = true;
                          _self.init();
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção de Regras de Comissão\Agenciamentos',
                                                   url   : _self.currentUrl});
                        $state.go($state.get('dts/hgp/hcm-paramzcao_comis_agenc.start'))
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hcm-paramzcao_comis_agenc.edit'),
                                             {idRegra: result.idRegra});
                    }
            });
        };

        this.existeRegistroSelecionado = function (tmp) {
            var existeRegistro = false;
            for (var i = 0, len = tmp.length; i < len; i++) {
                if (tmp[i].lgSelecionado)
                    existeRegistro = true;
            }
            return existeRegistro;
        };

        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];

            if (_self.paramzcao_comis_agencForm.$invalid){
                permiteSalvarAux = false;
                _self.paramzcao_comis_agencForm.$setDirty();              
                angular.forEach(_self.paramzcao_comis_agencForm, function(value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')){
                        value.$setDirty(); 
                        value.$setTouched(); 
                    }
                }); 
                
                mensagem.push('Existem campos com valor inválido ou não informado. Revise as informações.');
            }

            if (!_self.existeRegistroSelecionado(_self.tmpFuncao)){
                permiteSalvarAux = false;
                mensagem.push('Ao menos uma função deve ser selecionada.');
            }
            if (!_self.existeRegistroSelecionado(_self.tmpTipoProposta)){
                permiteSalvarAux = false;
                mensagem.push('Ao menos um tipo de proposta deve ser selecionado.');
            }
            if (!_self.existeRegistroSelecionado(_self.tmpConvenio)){
                permiteSalvarAux = false;
                mensagem.push('Ao menos um convênio deve ser selecionado.');
            }
            if (!_self.existeRegistroSelecionado(_self.tmpModalidade)){
                permiteSalvarAux = false;
                mensagem.push('Ao menos uma modalidade deve ser selecionada.');
            }        

            if (!permiteSalvarAux){
                mensagem.forEach(function(element) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: element
                    });
                }, this);
                
                return false;
            }
            return true;
        }

        this.isSelectComisAgenc = function(){
            
            if (this.paramzcao_comis_agenc.dsComissaoAgenciamento == "Agenciamento"){
                _self.lgEventoUtilizaPctComis  = false;
                _self.vlEventoComis  = 0;                
            }else if (paramzcao_comis_agenc.dsComissaoAgenciamento == "Comissao"){
                _self.lgEventoUtilizaPctAgenc  = false;
                _self.vlEventoAgenc = 0;
            }

        }


        this.onCancel = function(){
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção de Regras de Comissão/Agenciamento',
                                           url   : _self.currentUrl});
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você deseja cancelar e descartar os dados não salvos?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true)
                        return;

                    appViewService.removeView({active: true,
                                               name  : 'Manutenção de Regras de Comissão/Agenciamento',
                                               url   : _self.currentUrl});
                }
            });

        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });
	}

	index.register.controller('hcm.paramzcao_comis_agencMaintenance.Control', paramzcao_comis_agencMaintenanceController);
});



