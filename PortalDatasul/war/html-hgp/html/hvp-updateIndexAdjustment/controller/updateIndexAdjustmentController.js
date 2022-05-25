/* global angular */
/* global $ */
define(['index',
    '/dts/hgp/html/hvp-updateIndexAdjustment/updateIndexAdjustmentFactory.js',
    '/dts/hgp/html/hvp-updateIndexAdjustment/controller/contractingPartyZoomController.js',
    '/dts/hgp/html/hvp-updateIndexAdjustment/controller/proposalZoomController.js',
    '/dts/hgp/html/hpr-modality/modalityFactory.js',
    '/dts/hgp/html/global/hvpGlobalFactory.js'],
    function (index) {

        updateIndexAdjustmentGenerationController.$inject =
        ['$rootScope',
            '$scope',
            '$stateParams',
            'totvs.app-main-view.Service',
            'healthcare.hvp.updateindexadjustment.factory',
            'customization.generic.Factory',
            '$location',
            'totvs.app-notification.Service',
            'hpr.modality.Factory',
            'hvp.global.Factory'];

        function updateIndexAdjustmentGenerationController(
            $rootScope,
            $scope,
            $stateParams,
            appViewService,
            updateIndexAdjustmentFactory,
            customizationService,
            $location,
            appNotificationService,
            modalityFactory,
            hvpGlobalFactory) {

            var _self = this;
            this.defaultContractSelection = [{
            	  id: 1,
            	  label: 'Considera contratro vigente mais antigo',
            	}, {
            	  id: 2,
            	  label: 'Considera contratro vigente mais novo',
            	}];
            
            this.defaultFileType = [{
          	  id: 1,
          	  label: 'CSV',
          	}, {
          	  id: 2,
          	  label: 'PDF',
          	}, {
          	  id: 3,
          	  label: 'Ambos',
            }];

            $scope.IndexTypeFirstList = [];
            $scope.IndexTypeSecondList = [];
            $scope.IndexTypeThirdList = [];
            $scope.IndexTypeFourthList = [];
            $scope.IndexTypeFifthList = [];
            $scope.ModalityList = [];
            $scope.ReportModalityList = [];
            $scope.AllIndexType = true;
            $scope.AllIndexTypeReport = true;
            $scope.AllModality = false;
            $scope.AllModalityReport = false;
            $scope.CpcAtiva = false;
            
            // -----------------------------------------------------------------
            // Funções que utilizam a factory
            // -----------------------------------------------------------------
            // ----------------------------------------------------------------- function getAllIndexType()
            // getAllIndexType - Busca os tipos de índice cadastrados no sistema para preenchimento da tela
            this.getAllIndexType = function () {

                // Reseta as listas utilizadas na tela
                $scope.IndexTypeFirstList = [];
                $scope.IndexTypeSecondList = [];
                $scope.IndexTypeThirdList = [];
                $scope.IndexTypeFourthList = [];
                $scope.IndexTypeFifthList = [];
            
                // Executa a função localizada na factory
                hvpGlobalFactory.getAllReajustmentIndexType('', 0, 
                        0,
                        {},
                    function (result) {

                    if (result) {

                        // Monta as listas com o retorno da consulta
                        for (var index = 0; index < result.length; index++) {

                            var element = result[index];
                            
                            $scope.IndexTypeFirstList.push({ 
                                indexTypeCode: element.cdnTipIdx, 
                                indexTypeDescription: element.codTipIdx });
                                
                            $scope.IndexTypeSecondList.push({ 
                                indexTypeCode: element.cdnTipIdx, 
                                indexTypeDescription: element.codTipIdx });
                                
                            $scope.IndexTypeThirdList.push({ 
                                indexTypeCode: element.cdnTipIdx, 
                                indexTypeDescription: element.codTipIdx });
                                
                            $scope.IndexTypeFourthList.push({ 
                                indexTypeCode: element.cdnTipIdx, 
                                indexTypeDescription: element.codTipIdx });
                                
                            $scope.IndexTypeFifthList.push({ 
                                indexTypeCode: element.cdnTipIdx, 
                                indexTypeDescription: element.codTipIdx });
                        }
                    }
                });
            };
           
            // ----------------------------------------------------------------- function getAllModality()
            // getAllModality - Busca as modalidades cadastradas no sistema para preenchimento da tela
            this.getAllModality = function () {

                // Reseta as listas utilizadas na tela
                $scope.ModalityList = [];
                $scope.ReportModalityList = [];
                
                // Executa a função localizada na factory
                modalityFactory.getAllModality('', 0, 0, {},
                    function (result) {
    
                        if (result) {
    
                            // Monta as listas com o retorno da consulta
                            for (var index = 0; index < result.length; index++) {
    
                                var element = result[index];
                                
                                if (element.cdModalidade != 0)
                                {
                                	$scope.ModalityList.push({ 
                                    	modalityCode: element.cdModalidade, 
                                    	modalityDescription: element.dsModalidade });
                                    
                                	$scope.ReportModalityList.push({ 
                                    	modalityCode: element.cdModalidade, 
                                    	modalityDescription: element.dsModalidade });
                                }
                            }
                        }
                });
            };
            
            // ----------------------------------------------------------------- function updateIndexAdjustment()
            // updateIndexAdjustment - Realiza a geração/simulação/impressão
            // ----- Parâmetros
            // ---------- processType - Indica o tipo de processo que esta sendo executado pela tela [1 - Geracao | 2 - Simulacao | 3 - Relatorio]
            this.updateIndexAdjustment = function (processType) {

                // Monta as variaveis derivadas de listas                
                $scope.controller.model.IndexTypeList = this.buildParameterIndexList(processType, $scope.IndexTypeFirstList);
                $scope.controller.model.IndexTypeListReport = this.buildParameterIndexList(processType, $scope.IndexTypeFifthList);
                $scope.controller.model.ModalityList = this.buildParameterModalityList(processType, $scope.ModalityList);
                $scope.controller.model.ModalityListReport = this.buildParameterModalityList(processType, $scope.ReportModalityList);

            	
                $scope.controller.model.PoolIndexType = this.buildSingleElement($scope.IndexTypeSecondList);
                $scope.controller.model.OldIndexType = this.buildSingleElement($scope.IndexTypeThirdList);
                $scope.controller.model.NewIndexType = this.buildSingleElement($scope.IndexTypeFourthList);

                // Valida o formulário para gravação
                var formularioValido = _self.formValidation(processType);

                if (formularioValido) {
                    
                    // Verifica se a CPC esta ativa e realiza o tratamento específica de geração/simulação/impressão
                    if ($scope.cpcAtiva != undefined && $scope.cpcAtiva == true) {
                        _self.cpcUpdateIndexAdjustment($scope.controller, processType);
                    }
                    else {
                        // Realiza a geração/simulação/impressão
                        updateIndexAdjustmentFactory.updateIndexAdjustment(
                            processType,
                            $scope.controller,
                            this.buildPreselectField(processType), function (result) {

                                if (result) {
                                    _self.returnUpdateIndexAdjustment(processType, result);
                                }
                            });
                    }
                }
            };
            
            // -----------------------------------------------------------------
            // Funções utilizadas nas tratativas da tela
            // -----------------------------------------------------------------
            // ----------------------------------------------------------------- function changeIndexTypeFirstList()
            // changeIndexTypeFirstList - Desabilita a seleção do registro na terceira lista quando o registro da primeira lista é desmarcado
            // ----- Parâmetros
            // ---------- index - Índice do registro alterado
            $scope.changeIndexTypeFirstList = function (index) {
                $scope.IndexTypeThirdList[index].value = false;
            };
            
            // ----------------------------------------------------------------- function changeIndexTypeSecondList()
            // changeIndexTypeSecondList - Realiza a validação de que somente um registro estará selecionado nesta lista
            // ----- Parâmetros
            // ---------- index - Índice do registro alterado
            $scope.changeIndexTypeSecondList = function (index) {

                for (var newIndex = 0; newIndex < $scope.IndexTypeSecondList.length; newIndex++) {
                    $scope.IndexTypeSecondList[newIndex].value = false;
                }

                $scope.IndexTypeSecondList[index].value = true;
            };
            
            // ----------------------------------------------------------------- function changeIndexTypeThirdList()
            // changeIndexTypeThirdList - Realiza a validação de que somente um registro estará selecionado nesta lista
            // ----- Parâmetros
            // ---------- index - Índice do registro alterado
            $scope.changeIndexTypeThirdList = function (index) {

                for (var newIndex = 0; newIndex < $scope.IndexTypeThirdList.length; newIndex++) {
                    $scope.IndexTypeThirdList[newIndex].value = false;
                }

                $scope.IndexTypeThirdList[index].value = true;
            };
            
            // ----------------------------------------------------------------- function changeIndexTypeFourthList()
            // changeIndexTypeFourthList - Realiza a validação de que somente um registro estará selecionado nesta lista
            // ----- Parâmetros
            // ---------- index - Índice do registro alterado
            $scope.changeIndexTypeFourthList = function (index) {

                for (var newIndex = 0; newIndex < $scope.IndexTypeFourthList.length; newIndex++) {
                    $scope.IndexTypeFourthList[newIndex].value = false;
                }

                $scope.IndexTypeFourthList[index].value = true;
            };
            
            // ----------------------------------------------------------------- function ChangeAllIndexType()
            // ChangeAllIndexType - Marca/Desmarca todos os registros da lista de tipos de índice
            $scope.ChangeAllIndexType = function () {

                $scope.AllIndexType.value = !$scope.AllIndexType;

                for (var index = 0; index < $scope.IndexTypeFirstList.length; index++) {
                    $scope.IndexTypeFirstList[index].value = $scope.AllIndexType;
                }
            };
            
            // ----------------------------------------------------------------- function ChangeAllIndexTypeReport()
            // ChangeAllIndexTypeReport - Marca/Desmarca todos os registros da lista de tipos de índice da aba Relatório
            $scope.ChangeAllIndexTypeReport = function () {

                $scope.AllIndexTypeReport.value = !$scope.AllIndexTypeReport;

                for (var index = 0; index < $scope.IndexTypeFifthList.length; index++) {
                    $scope.IndexTypeFifthList[index].value = $scope.AllIndexTypeReport;
                }
            };
            
            // ----------------------------------------------------------------- function ChangeAllModality()
            // ChangeAllModality - Marca/Desmarca todos os registros da lista de modalidades
            $scope.ChangeAllModality = function () {

                $scope.AllModality.value = !$scope.AllModality;

                for (var index = 0; index < $scope.ModalityList.length; index++) {
                    $scope.ModalityList[index].value = $scope.AllModality;
                }
            };
            
            // ----------------------------------------------------------------- function ChangeAllModalityReport()
            // ChangeAllModalityReport - Marca/Desmarca todos os registros da lista de modalidades da aba relatório
            $scope.ChangeAllModalityReport = function () {

                $scope.AllModalityReport.value = !$scope.AllModalityReport;
                
                for (var index = 0; index < $scope.ReportModalityList.length; index++) {
                    $scope.ReportModalityList[index].value = $scope.AllModalityReport;
                }
            };
            
            // -----------------------------------------------------------------
            // Funções utilizadas para a montagem dos filtros para geração/simulação/impressão
            // -----------------------------------------------------------------
            // ----------------------------------------------------------------- function buildParameterIndex()
            // buildParameterIndex - Monta a lista de tipos de índice selecionados
            // ----- Parâmetros
            // ---------- processType - Indica o tipo de processo que esta sendo executado pela tela [1 - Geracao | 2 - Simulacao | 3 - Relatorio]
            this.buildParameterIndexList = function (processType, list) {

                var stringReturn = '';
                var newlist = [];
                
                for (var i = 0; i < list.length; i++) {
                    if (list[i].value) {
                    	var parameter = {cdTipoIndice:0};
                    	parameter.cdTipoIndice = list[i].indexTypeCode;
                    	newlist.push(parameter);

                    }
                }

                return newlist;
            }
            
            // ----------------------------------------------------------------- function buildParameterModality()
            // buildParameterModalityList - Monta a lista de modalidades selecionadas
            // ----- Parâmetros
            // ---------- processType - Indica o tipo de processo que esta sendo executado pela tela [1 - Geracao | 2 - Simulacao | 3 - Relatorio]
            this.buildParameterModalityList = function (processType, list) {

                var stringReturn = '';
                var newlist = [];
                
                for (var i = 0; i < list.length; i++) {
                    if (list[i].value) {
                    	var modality = {cdModalidade:0, dsModalidade:""};
                    	modality.cdModalidade = list[i].modalityCode;
                        newlist.push(modality);

                    }
                }

                return newlist;
            }
            
            // ----------------------------------------------------------------- function buildSingleElement()
            // buildSingleElement - Monta o elemento selecionado das listas de tipo de índice
            // ----- Parâmetros
            // ---------- list - Lista da qual o elemento será processado
            this.buildSingleElement = function (list) {

                var retorno = 0;

                if (list != undefined && list != null && list.length > 0) {
                    for (var index = 0; index < list.length; index++) {
                        if (list[index].value) {
                            retorno = list[index].indexTypeCode;
                        }
                    }
                }

                return retorno;
            }
            
            // ----------------------------------------------------------------- function selectionValidation()
            // selectionValidation - Realiza a validação da seleção das listas
            // ----- Parâmetros
            // ---------- processType - Indica o tipo de processo que esta sendo executado pela tela [1 - Geracao | 2 - Simulacao | 3 - Relatorio]
            this.formValidation = function (processType) {
                var retorno = true;

                var alert = {
                    type: 'error',
                    title: 'Atenção',
                    detail: ''
                };

                if (processType != 3) {

                    if ($scope.controller.model.IndexTypeList == null ||
                        $scope.controller.model.IndexTypeList == undefined ||
                        $scope.controller.model.IndexTypeList == '') {

                        retorno = false;
                        alert['detail'] = 'Você deve selecionar ao menos um Tipo de Índice da Lista';
                        appNotificationService.notify(alert);
                    }

                    if ($scope.controller.model.PoolIndexType == null ||
                        $scope.controller.model.PoolIndexType == undefined ||
                        $scope.controller.model.PoolIndexType == '') {

                        retorno = false;
                        alert['detail'] = 'Você deve selecionar o Tipo de Índice do Pool';
                        appNotificationService.notify(alert);
                    }

                    if ($scope.controller.model.OldIndexType == null ||
                        $scope.controller.model.OldIndexType == undefined ||
                        $scope.controller.model.OldIndexType == '') {

                        retorno = false;
                        alert['detail'] = 'Você deve selecionar o Tipo de Índice Antigo';
                        appNotificationService.notify(alert);
                    }

                    if ($scope.controller.model.NewIndexType == null ||
                        $scope.controller.model.NewIndexType == undefined ||
                        $scope.controller.model.NewIndexType == '') {

                        retorno = false;
                        alert['detail'] = 'Você deve selecionar o Tipo de Índice Novo';
                        appNotificationService.notify(alert);
                    }

                    if ($scope.controller.model.ModalityList == null ||
                        $scope.controller.model.ModalityList == undefined ||
                        $scope.controller.model.ModalityList == '') {

                        retorno = false;
                        alert['detail'] = 'Você deve selecionar ao menos uma Modalidade da Lista';
                        appNotificationService.notify(alert);
                    }
                }
                else {
                    if ($scope.controller.model.ModalityListReport == null ||
                        $scope.controller.model.ModalityListReport == undefined ||
                        $scope.controller.model.ModalityListReport == '') {

                        retorno = false;
                        alert['detail'] = 'Você deve selecionar ao menos uma Modalidade da Lista';
                        appNotificationService.notify(alert);
                    }

                    if ($scope.controller.model.IndexTypeListReport == null ||
                        $scope.controller.model.IndexTypeListReport == undefined ||
                        $scope.controller.model.IndexTypeListReport == '') {

                        retorno = false;
                        alert['detail'] = 'Você deve selecionar ao menos um Tipo de Índice da Lista';
                        appNotificationService.notify(alert);
                    }
                }

                return retorno;
            }
            
            // ----------------------------------------------------------------- function returnUpdateIndexAdjustment()
            // returnUpdateIndexAdjustment - Monta o retorno da geração/simulação/impressão
            // ----- Parâmetros
            // ---------- processType - Indica o tipo de processo que esta sendo executado pela tela [1 - Geracao | 2 - Simulacao | 3 - Relatorio]
            // ---------- result - Resultado do processamento
            this.returnUpdateIndexAdjustment = function(
                processType,
                result)
            {
                var mensagem = '';
                var operacao = '';
                
                switch (processType) {
                    
                    case 1: 
                        operacao = 'Geração';
                        break;
                    case 2:
                        operacao = 'Simulação';
                        break;
                    case 3:
                        operacao = 'Impressão';
                        break;
                
                    default:
                        break;
                }
                
                if (result.message != '') {
                    mensagem = 'Ocorreu um erro na ' + operacao + '. Mensagem: ' + result.message + '.';
                }
                
                if(result.reportPath)
                {
                    mensagem = operacao + ' realizada com sucesso. Arquivo em: ' + result.reportPath + '.';
                }    
                
                // Exemplo de chamada direta ao sistema de notificação:
                appNotificationService.message({
                    title: 'Gera/Simula - Tipo de Índice de Reajuste',
                    text: mensagem,
                    callback: function() {
                    }});
            }
            
            // ----------------------------------------------------------------- function buildPreselectField()
            // buildPreselectField - Monta o campo preselect que será usado na query no progress
            // ----- Parâmetros
            // ---------- processType - Indica o tipo de processo que esta sendo executado pela tela [1 - Geracao | 2 - Simulacao | 3 - Relatorio]
            this.buildPreselectField = function(processType)
            {
                return 'preselect each modalid ' +
                    ' where modalid.cd-modalidade = &modalid no-lock, ' +
                    ' each propost ' +
                    ' where propost.cd-modalidade = modalid.cd-modalidade ' + 
                    ' and propost.nr-proposta >= ' + (processType != 3 ? $scope.controller.model.StartingProposal : $scope.controller.model.StartingProposalReport) +
                    ' and propost.nr-proposta <= ' + (processType != 3 ? $scope.controller.model.EndingProposal : $scope.controller.model.EndingProposalReport) +
                    ' and propost.dt-aprovacao <> ? no-lock, ' +
                    ' each contrat ' +
                    ' where contrat.cd-contratante = propost.cd-contratante ' +
                    ' and contrat.cd-contratante >= ' + (processType != 3 ? $scope.controller.model.StartingContractor : $scope.controller.model.StartingContractorReport) +
                    ' and contrat.cd-contratante <= ' + (processType != 3 ? $scope.controller.model.EndingContractor : $scope.controller.model.EndingContractorReport) + ' no-lock';
            };
            
            // -----------------------------------------------------------------
            this.init = function () {

                if (appViewService.startView('Tipo de Índice de Reajuste', 'healthcare.hvp.updateindexadjustment.Control', this)) {
                }

                this.model = { 
                    FileType: 3,
                    FileErrorType: 1,
                    ContractSelection: 1,
                    AmountLifes: 30,
                    IndexTypeList: '',
                    PoolIndexType: '',
                    OldIndexType: '',
                    NewIndexType: '',
                    ModalityList: '',
                    StartingContractor: 1,
                    EndingContractor: 99999,
                    StartingProposal: 1,
                    EndingProposal: 99999,
                    FileTypeReport: 3,
                    FileErrorTypeReport: 1,
                    ModalityListReport: '',
                    StartingContractorReport: 1,
                    EndingContractorReport: 99999,
                    IndexTypeListReport: '',
                    StartingProposalReport: 1,
                    EndingProposalReport: 99999,
                    AmountLifesReport: 30};
                
                
                    
                this.getAllIndexType();
                this.getAllModality();
                
                var controllerAtualizado = 
                    customizationService.callEvent('healthcare.hvp.updateindexadjustment', 'cpc', _self, $("#customPage"));
                    
                if (controllerAtualizado != undefined && controllerAtualizado != null) {
                    
                    _self = controllerAtualizado;
                    
                    // Indica que a CPC esta ativa
                    $scope.cpcAtiva = true;
                }
            };

            // $scope.$on('$viewContentLoaded', function () { 
            // _self.init();
            // });
             
            if ($rootScope.currentuserLoaded) { this.init(); }
        }

        index.register.controller('healthcare.hvp.updateindexadjustment.Control', updateIndexAdjustmentGenerationController);
    });
    
    var parametersPanel;
    var selectionPanel;
    
    $(document).ready($(function () {
    
        parametersPanel = true;
        selectionPanel = false;
    
        $('#parametersPanel').collapse({ toggle: true });
        $('#selectionPanel').collapse({ toggle: true });
    
        $(document).on('click', '#btnParametersPanel', function (e) {
            exibirPainel('parametersPanel');
        });
    
        $(document).on('click', '#btnselectionPanel', function (e) {
            exibirPainel('selectionPanel');
        });
    
        $(document).on('click', '#reportLink', function (e) {
            trocarAba('report');
        });
    
        $(document).on('click', '#generationLink', function (e) {
            trocarAba('generation');
        });
    
        $('#infoContratantes').popover();
        $(document).on('click', '#infoContratantes', function () { popOver('infoContratantes'); });
    
        $('#infoGrupoPool').popover();
        $(document).on('click', '#infoGrupoPool', function () { popOver('infoGrupoPool'); });
    
        $('#infoOutrosGruposPool').popover();
        $(document).on('click', '#infoOutrosGruposPool', function () { popOver('infoOutrosGruposPool'); });
    }));
    
    function popOver(elemento) {
    
        $('#' + elemento).popover('destroy');
        $('#' + elemento).popover('toggle');
    }
    
    function trocarAba(aba) {
    
        if (aba == 'report') {
            $("#reportTab").addClass("active");
            $("#generationTab").removeClass("active");
        }
        else {
            $("#generationTab").addClass("active");
            $("#reportTab").removeClass("active");
        }
    }
    
    function exibirPainel(painel) {
    
        if (painel == 'parametersPanel') {
    
            if (parametersPanel) {
                $('#parametersPanel').collapse('hide');
                parametersPanel = false;
            }
            else {
                $('#parametersPanel').collapse('show');
                parametersPanel = true;
            }
        }
        else {
            if (selectionPanel) {
                $('#selectionPanel').collapse('hide');
                selectionPanel = false;
            }
            else {
                $('#selectionPanel').collapse('show');
                selectionPanel = true;
            }
        }
    }