define(['index'], function(index) {
	
	historicoCtrl.$inject = [
        '$rootScope',
        'totvs.app-main-view.Service',
        'fchmip.programacao.Factory',
        'TOTVSEvent'  
	];

    function historicoCtrl($rootScope,
                           appViewService,
                           programacaoFactory,
                           TOTVSEvent){
        
        historicoCtrl = this;
        
        historicoCtrl.init = function(){
            var createTab = appViewService.startView($rootScope.i18n("l-history-om-programming"), "mmi.sprint.history.HistoricoCtrl", historicoCtrl);
            
            if (createTab === true) {
                historicoCtrl.param = {origem: 1,
                                       lNaoIniciada : true,
                                       lIniciada : true,
                                       lTerminada: false};
            }

            historicoCtrl.executionType = '1';
            historicoCtrl.options = [{value: 1, label: $rootScope.i18n("l-online"), disabled: false},
                                     {value: 2, label: $rootScope.i18n("l-batch"), disabled: false}];
        }
        
        historicoCtrl.sugereFinal = function(campo){
		
            switch (campo) {
                case 1: 
                    if(historicoCtrl.param.ordemInicial !== "" && !historicoCtrl.param.ordemFinal){
                        historicoCtrl.param.ordemFinal = historicoCtrl.param.ordemInicial}
                    break;
                case 2: 
                    if(historicoCtrl.param.empresaInicial !== "" && !historicoCtrl.param.empresaFinal){
                        historicoCtrl.param.empresaFinal = historicoCtrl.param.empresaInicial}
                    break;
                case 3: 
                    if(historicoCtrl.param.estabelInicial !== "" && !historicoCtrl.param.estabelFinal){
                        historicoCtrl.param.estabelFinal = historicoCtrl.param.estabelInicial}
                    break;
                case 4:
                    if(historicoCtrl.param.oficinaInicial !== "" && !historicoCtrl.param.oficinaFinal){
                        historicoCtrl.param.oficinaFinal = historicoCtrl.param.oficinaInicial}
                    break;
                case 5: 
                    if(historicoCtrl.param.planejadorInicial !== "" && !historicoCtrl.param.planejadorFinal){
                        historicoCtrl.param.planejadorFinal = historicoCtrl.param.planejadorInicial}
                    break;
                case 6: 
                    if(historicoCtrl.param.equipamentoInicial !== "" && !historicoCtrl.param.equipamentoFinal){
                        historicoCtrl.param.equipamentoFinal = historicoCtrl.param.equipamentoInicial}
                    break;
                case 7:
                    if(historicoCtrl.param.tagInicial !== "" && !historicoCtrl.param.tagFinal){
                        historicoCtrl.param.tagFinal = historicoCtrl.param.tagInicial}
                    break;
                case 8:
                    if(historicoCtrl.param.planoInicial !== "" && !historicoCtrl.param.planoFinal){
                        historicoCtrl.param.planoFinal = historicoCtrl.param.planoInicial}
                    break;
            }
        }
        
        historicoCtrl.exportaHistImpedimento = function(){
            historicoCtrl.param.tipoRelatorio = 1;

            if(historicoCtrl.param.periodo){
                historicoCtrl.param.dataInicial = historicoCtrl.param.periodo.startDate;
                historicoCtrl.param.dataFinal = historicoCtrl.param.periodo.endDate;
            }
            
            var parameters = historicoCtrl.param;
            historicoCtrl.filename = 'historico_imped_OM.csv';

            if (historicoCtrl.executionType === '1') {
                programacaoFactory.exportaHistImpedimentos(parameters, exportaCSVCallback);
            } else {
                historicoCtrl.execucaoRPW();
            }
                                          
        }
        
        historicoCtrl.exportaHistProgramacao = function(){
            historicoCtrl.param.tipoRelatorio = 2;

            if(historicoCtrl.param.periodo){
                historicoCtrl.param.dataInicial = historicoCtrl.param.periodo.startDate;
                historicoCtrl.param.dataFinal = historicoCtrl.param.periodo.endDate;
            }
            
            var parameters = historicoCtrl.param;
            historicoCtrl.filename = 'historico_prog_OM.csv';

            if (historicoCtrl.executionType === '1') {
                programacaoFactory.exportaHistProgramacao(parameters, exportaCSVCallback);
            } else {
                historicoCtrl.execucaoRPW();
            }
								
        }
        
        var exportaCSVCallback = function(result){

			var universalBOM = "\uFEFF"; /* força codificação UTF-8*/

			if (result && result.csv != "") {
				var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
					ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
					ieEDGE = navigator.userAgent.match(/Edge/g),
					ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

				if (ie && ieVer<10) {
					console.log("No blobs on IE ver<10");
					return;
				}
	
				var textFileAsBlob = new Blob([result.csv], {type: 'text/plain'});
				var fileName = historicoCtrl.filename;

				if (ieVer>-1) {
					window.navigator.msSaveBlob(textFileAsBlob, fileName);
				} else {
					var a         = document.createElement('a');
					a.href        = 'data:attachment/csv;charset=utf-8,' +  encodeURIComponent(universalBOM+result.csv);
					a.target      = '_blank';
					a.download    = fileName;

					document.body.appendChild(a);
					a.click();
				}
			}
        }
        
        historicoCtrl.execucaoRPW = function(){

            if(validaCampos()){
                return;
            }

            if(historicoCtrl.param.periodo){
                historicoCtrl.param.dataInicial = historicoCtrl.param.periodo.startDate;
                historicoCtrl.param.dataFinal = historicoCtrl.param.periodo.endDate;
            }

            var parametros =    {'ttParamRelatorio' : historicoCtrl.param,                                
                                 'tt-param-rpw' : {
                                    'cArquivo' :  historicoCtrl.filename,
                                    'cProgramName' : 'mvapi012rpw',                                 
                                    'cRpFile' : 'mvp/mvapi012rpw.p',    
                                    'lAgendaRpw' : false,                                    
                                    'cDataExec' :  historicoCtrl.execution.date == undefined ? 0 : new Date(historicoCtrl.execution.date),
                                    'cHoraExec' :  historicoCtrl.execution.time,                                 
                                    'cServidor' :  historicoCtrl.execution.rpwServer == undefined ? '' : historicoCtrl.execution.rpwServer.cod_servid_exec
                                    }                                   
                                };

            parametros.ttParamRelatorio.destino = 2;                                                  
            parametros.ttParamRelatorio.arquivo = historicoCtrl.filename;                                
            parametros.ttParamRelatorio.usuario = $rootScope.currentuser.login;                                                                                                                                       
        
            programacaoFactory.piRecebeParametrosRPW(parametros, execucaoRPWCallback);
        }

        var validaCampos = function(){
            var isInvalidForm = false;

            if (historicoCtrl.executionType === '2'){
                if (!historicoCtrl.execution.date || !historicoCtrl.execution.rpwServer){
                    isInvalidForm = true;
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('msg-fill-in-blank', [],'dts/mmi')
                    });
                    return isInvalidForm;
                } 
            }        
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

        historicoCtrl.init();
    }

    index.register.controller('mmi.sprint.history.HistoricoCtrl', historicoCtrl);
  
});
