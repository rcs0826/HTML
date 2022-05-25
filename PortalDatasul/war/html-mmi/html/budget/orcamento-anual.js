define(['index',
        '/dts/mpd/js/zoom/estabelec.js',
        '/dts/mmi/js/api/fch/fchmip/fchmiporcamento.js'], function(index) {

	orcamentoCtrl.$inject = [
		'$rootScope',
        '$scope',
        'TOTVSEvent',
        'totvs.app-main-view.Service',
        '$timeout',
        'fchmip.orcamento.Factory'
	];

	function orcamentoCtrl($rootScope,
                            $scope,
                            TOTVSEvent,
                            appViewService,
                            $timeout,
                            orcamentoMiFactory) {
		
       var orcamentoCtrl = this;      

        orcamentoCtrl.init = function() {
            var novaAba = appViewService.startView($rootScope.i18n('l-industrial-maintenance-budget'),'mmi.budget.OrcamentoCtrl', orcamentoCtrl);
            if(novaAba){
                iniciaVariaveis();
                buscaMoedas();
                iniciaDatas();
                iniciaComboPreco();
                inicializaCheckboxImpressaoCsv();
                orcamentoCtrl.sugereFinal(1);
                setFocus();
            }
        }
            
        var iniciaDatas = function(){
            orcamentoCtrl.model.ttParamOrcamento.dtCorte = new Date((new Date().getFullYear() + 1), 11, 31);
            orcamentoCtrl.model.ttParamOrcamento.maoDeObra = new Date();
            orcamentoCtrl.model.ttParamOrcamento.dataRpw = new Date();
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
            orcamentoCtrl.model.accord = {};
            orcamentoCtrl.model.accord.impressao = true;
        }
      
        var buscaMoedas = function(){
            orcamentoMiFactory.buscaMoedas(function(result){
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
                                'cProgramName' : 'miorcamentorpw',                               
                                'cRpFile' : 'mip/miorcamentorpw.p',  
                                'lAgendaRpw' : false,                                    
                                'cDataExec' :  orcamentoCtrl.model.ttParamOrcamento.dataRpw,
                                'cHoraExec' :  orcamentoCtrl.model.ttParamOrcamento.horaRpw,                               
                                'cServidor' :  !orcamentoCtrl.model.ttParamOrcamento.rpwServer ? '' :orcamentoCtrl.model.ttParamOrcamento.rpwServer['cod_servid_exec']
                                }                                   
            };
            orcamentoMiFactory.parametrosRpwOrcamento(parametros, execucaoRPWCallback);
                           
        }

        var execucaoRPWCallback = function(result){           
            
            if (!result.hasError  && result["tt-pedido-execucao"].length > 0) {					
                numPedExec = result["tt-pedido-execucao"] == undefined ? 0 : result["tt-pedido-execucao"]["0"]["num-ped-exec"];

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
                    title: $rootScope.i18n('l-request-success', [],'dts/mmi'),
					detail: $rootScope.i18n('msg-request-success', numPedExec, 'dts/mmi')
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
                    if(orcamentoCtrl.model.ttParamOrcamento.estabelecIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.estabelecFim){
                        orcamentoCtrl.model.ttParamOrcamento.estabelecFim = orcamentoCtrl.model.ttParamOrcamento.estabelecIni;
                }break;	
                case 2: 
                if(orcamentoCtrl.model.ttParamOrcamento.equipamentoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.equipamentoFim){
                    orcamentoCtrl.model.ttParamOrcamento.equipamentoFim = orcamentoCtrl.model.ttParamOrcamento.equipamentoIni;
                }break;	
                 case 3: 
                    if(orcamentoCtrl.model.ttParamOrcamento.familiaIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.familiaFim){
                        orcamentoCtrl.model.ttParamOrcamento.familiaFim = orcamentoCtrl.model.ttParamOrcamento.familiaIni;
                }break;
                case 4: 
                if(orcamentoCtrl.model.ttParamOrcamento.tagIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.tagFim){
                    orcamentoCtrl.model.ttParamOrcamento.tagFim = orcamentoCtrl.model.ttParamOrcamento.tagIni;
                }break;
                case 5: 
                if(orcamentoCtrl.model.ttParamOrcamento.ccCustoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.ccCustoFim){
                    orcamentoCtrl.model.ttParamOrcamento.ccCustoFim = orcamentoCtrl.model.ttParamOrcamento.ccCustoIni;
                }break;
                case 6: 
                if(orcamentoCtrl.model.ttParamOrcamento.unIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.unFim){
                    orcamentoCtrl.model.ttParamOrcamento.unFim = orcamentoCtrl.model.ttParamOrcamento.unIni;
                }break;
                case 7: 
                if(orcamentoCtrl.model.ttParamOrcamento.planejadorIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.planejadorFim){
                    orcamentoCtrl.model.ttParamOrcamento.planejadorFim = orcamentoCtrl.model.ttParamOrcamento.planejadorIni;
                }break;	 
                case 8: 
                if(orcamentoCtrl.model.ttParamOrcamento.equipeIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.equipeFim){
                    orcamentoCtrl.model.ttParamOrcamento.equipeFim = orcamentoCtrl.model.ttParamOrcamento.equipeIni;
                }break;
                case 9: 
                if(orcamentoCtrl.model.ttParamOrcamento.tipoManutencaoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.tipoManutencaoFim){
                    orcamentoCtrl.model.ttParamOrcamento.tipoManutencaoFim = orcamentoCtrl.model.ttParamOrcamento.tipoManutencaoIni;
                }break;
                case 10: 
                if(orcamentoCtrl.model.ttParamOrcamento.manutencaoIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.manutencaoFim){
                    orcamentoCtrl.model.ttParamOrcamento.manutencaoFim = orcamentoCtrl.model.ttParamOrcamento.manutencaoIni;
                }break;
                case 11:
                if(orcamentoCtrl.model.ttParamOrcamento.paradaIni !== "" && !orcamentoCtrl.model.ttParamOrcamento.paradaFim){
                    orcamentoCtrl.model.ttParamOrcamento.paradaFim = orcamentoCtrl.model.ttParamOrcamento.paradaIni;
                }break;
            }
        };

        if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			orcamentoCtrl.init();
		});
	}

	index.register.controller("mmi.budget.OrcamentoCtrl", orcamentoCtrl);
   
});
