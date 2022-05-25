define(['index',
        '/dts/mpd/js/zoom/estabelec.js',
        '/dts/mmv/js/api/fch/fchmvp/fchmvporcamento.js'], function(index) {

	orcamentoCtrl.$inject = [
		'$rootScope',
        '$scope',
        'TOTVSEvent',
        'totvs.app-main-view.Service',
        '$timeout',
        'fchmvp.orcamento.Factory'
	];

	function orcamentoCtrl($rootScope,
                            $scope,
                            TOTVSEvent,
                            appViewService,
                            $timeout,
                            orcamentoFactory) {
		
       var orcamentoCtrl = this;
      

        orcamentoCtrl.init = function() {
            var novaAba = appViewService.startView($rootScope.i18n('l-fleet-budget'),'mmv.budget.OrcamentoCtrl', orcamentoCtrl);
            if(novaAba){
                iniciaVariaveis();
                buscaMoedas();
                iniciaDatas();
                iniciaComboPreco();
                iniciaCheckboxEquipamento();
                iniciaCheckboxTipoEvento();
                inicializaCheckboxImpressaoCsv();
                orcamentoCtrl.sugereFinal(1);
                setFocus();
            }
        }
            
        var iniciaDatas = function(){
            orcamentoCtrl.model.ttParamOrcamento.dtCorte = new Date((new Date().getFullYear() + 1), 11, 31);
            orcamentoCtrl.dtInicial = new Date();
            orcamentoCtrl.dtInicial.setMonth(orcamentoCtrl.dtInicial.getMonth() - 1);
            orcamentoCtrl.model.ttParamOrcamento.dtPercurso.startDate = orcamentoCtrl.dtInicial;
            orcamentoCtrl.model.ttParamOrcamento.dtPercurso.endDate = new Date();
            orcamentoCtrl.model.ttParamOrcamento.maoDeObra = new Date();
            orcamentoCtrl.model.ttParamOrcamento.dataRpw = new Date();
        }
          
        var iniciaCheckboxEquipamento = function(){
            orcamentoCtrl.model.ttParamOrcamento.motorizado = true;
            orcamentoCtrl.model.ttParamOrcamento.naoMotorizado = true;
            orcamentoCtrl.model.ttParamOrcamento.proprio = true;
            orcamentoCtrl.model.ttParamOrcamento.terceiro = false;
        }

        var inicializaCheckboxImpressaoCsv = function(){
            orcamentoCtrl.model.ttParamOrcamento.materialDiario = true;
            orcamentoCtrl.model.ttParamOrcamento.materialSemanal = false;
            orcamentoCtrl.model.ttParamOrcamento.materialMensal = false;
            orcamentoCtrl.model.ttParamOrcamento.especialidadeDiaria = true;
            orcamentoCtrl.model.ttParamOrcamento.especialidadeSemanal = false;
            orcamentoCtrl.model.ttParamOrcamento.especialidadeMensal = false;
            orcamentoCtrl.model.ttParamOrcamento.simulacaoPlanos = true;
        }
       
        var iniciaVariaveis = function(){
            orcamentoCtrl.model = {};
            orcamentoCtrl.model.ttParamOrcamento = {};
            orcamentoCtrl.model.ttParamOrcamento.dtPercurso ={};
            orcamentoCtrl.model.accord = {};
            orcamentoCtrl.model.accord.impressao = true;
            orcamentoCtrl.model.ttParamOrcamento.empresaIni = $rootScope.currentcompany.companycode;            
        }

        var iniciaCheckboxTipoEvento = function(){
            orcamentoCtrl.model.ttParamOrcamento.planoComponente = true;
            orcamentoCtrl.model.ttParamOrcamento.manutencaoMecanica = true;
        }

        var buscaMoedas = function(){
            orcamentoFactory.buscaMoedas(function(result){
                orcamentoCtrl.moeda = [{value:0, label:result[0].currency1}, 
                                       {value:1, label:result[0].currency2},
                                       {value:2, label:result[0].currency3},];

                orcamentoCtrl.model.ttParamOrcamento.moeda = 0;
            }) 
        };
      
        orcamentoCtrl.executaRpw = function(){

            var parametros = {'ttParamOrcamento' : orcamentoCtrl.model.ttParamOrcamento,                                
                                'tt-param-rpw' : {
                                'cArquivo' :  $rootScope.i18n('l-annual-budget'),
                                'cProgramName' : 'mvorcamentorpw',                                
                                'cRpFile' : 'mvp/mvorcamentorpw.p', 
                                'lAgendaRpw' : false,                                    
                                'cDataExec' :  orcamentoCtrl.model.ttParamOrcamento.dataRpw,
                                'cHoraExec' :  orcamentoCtrl.model.ttParamOrcamento.horaRpw,                               
                                'cServidor' :  !orcamentoCtrl.model.ttParamOrcamento.rpwServer ? '' :orcamentoCtrl.model.ttParamOrcamento.rpwServer['cod_servid_exec']
                                }                                   
            };
            parametros.ttParamOrcamento.dtPercursoIni = orcamentoCtrl.model.ttParamOrcamento.dtPercurso.startDate;
            parametros.ttParamOrcamento.dtPercursoFim = orcamentoCtrl.model.ttParamOrcamento.dtPercurso.endDate;
            orcamentoFactory.parametrosRpwOrcamento(parametros, execucaoRPWCallback);
        }

        var execucaoRPWCallback = function(result){           
            
            if (!result.hasError  && result["tt-pedido-execucao"].length > 0) {					
                numPedExec = result["tt-pedido-execucao"] == undefined ? 0 : result["tt-pedido-execucao"]["0"]["num-ped-exec"];

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
                    title: $rootScope.i18n('l-request-success', [],'dts/mmv'),
					detail: $rootScope.i18n('msg-request-success', numPedExec, 'dts/mmv')
                });
                
			}	
        }

        var setFocus = function() {
	    	$timeout(function() {
	    		$('#empresa').find('*').filter(':input:visible:first').focus();
	        },500);
		} 


        var iniciaComboPreco = function(){
            orcamentoCtrl.preco = [{value: 1, label: $rootScope.i18n('l-batch')}, 
                                   {value: 2, label: $rootScope.i18n('l-online')},
                                   {value: 3, label: $rootScope.i18n('l-base')},
                                   {value: 4, label: $rootScope.i18n('l-replacement')},
                                   {value: 5, label: $rootScope.i18n('l-last-entry')}];
            orcamentoCtrl.model.ttParamOrcamento.tipoPreco = 1;
        }

        orcamentoCtrl.sugereFinal = function(campo){
		
            switch (campo) {
                case 1: 
                    if(orcamentoCtrl.model.ttParamOrcamento.empresaIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.empresaFim){
                        orcamentoCtrl.model.ttParamOrcamento.empresaFim = orcamentoCtrl.model.ttParamOrcamento.empresaIni;
                }break;
                case 2: 
                    if(orcamentoCtrl.model.ttParamOrcamento.estabelecIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.estabelecFim){
                        orcamentoCtrl.model.ttParamOrcamento.estabelecFim = orcamentoCtrl.model.ttParamOrcamento.estabelecIni;
                }break;	
                 case 3: 
                    if(orcamentoCtrl.model.ttParamOrcamento.oficinaIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.oficinaFim){
                        orcamentoCtrl.model.ttParamOrcamento.oficinaFim = orcamentoCtrl.model.ttParamOrcamento.oficinaIni;
                }break;
                case 4: 
                if(orcamentoCtrl.model.ttParamOrcamento.setorIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.setorFim){
                    orcamentoCtrl.model.ttParamOrcamento.setorFim = orcamentoCtrl.model.ttParamOrcamento.setorIni;
                }break;
                case 5: 
                if(orcamentoCtrl.model.ttParamOrcamento.tagIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.tagFim){
                    orcamentoCtrl.model.ttParamOrcamento.tagFim = orcamentoCtrl.model.ttParamOrcamento.tagIni;
                }break;
                case 6: 
                if(orcamentoCtrl.model.ttParamOrcamento.ccCustoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.ccCustoFim){
                    orcamentoCtrl.model.ttParamOrcamento.ccCustoFim = orcamentoCtrl.model.ttParamOrcamento.ccCustoIni;
                }break;
                case 7: 
                if(orcamentoCtrl.model.ttParamOrcamento.equipamentoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.equipamentoFim){
                    orcamentoCtrl.model.ttParamOrcamento.equipamentoFim = orcamentoCtrl.model.ttParamOrcamento.equipamentoIni;
                }break;	
                case 8: 
                if(orcamentoCtrl.model.ttParamOrcamento.grupoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.grupoFim){
                    orcamentoCtrl.model.ttParamOrcamento.grupoFim = orcamentoCtrl.model.ttParamOrcamento.grupoIni;
                }break;	 
                case 9: 
                if(orcamentoCtrl.model.ttParamOrcamento.modeloIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.modeloFim){
                    orcamentoCtrl.model.ttParamOrcamento.modeloFim = orcamentoCtrl.model.ttParamOrcamento.modeloIni;
                }break;
                case 10: 
                if(orcamentoCtrl.model.ttParamOrcamento.planoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.planoFim){
                    orcamentoCtrl.model.ttParamOrcamento.planoFim = orcamentoCtrl.model.ttParamOrcamento.planoIni;
                }break;
                case 11: 
                if(orcamentoCtrl.model.ttParamOrcamento.eventoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.eventoFim){
                    orcamentoCtrl.model.ttParamOrcamento.eventoFim = orcamentoCtrl.model.ttParamOrcamento.eventoIni;
                }break;
                case 12:
                if(orcamentoCtrl.model.ttParamOrcamento.subSistemaIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.subSistemaFim){
                    orcamentoCtrl.model.ttParamOrcamento.subSistemaFim = orcamentoCtrl.model.ttParamOrcamento.subSistemaIni;
                }break;
            }
        };

        if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			orcamentoCtrl.init();
		});
	}

	index.register.controller("mmv.budget.OrcamentoCtrl", orcamentoCtrl);
   
});
