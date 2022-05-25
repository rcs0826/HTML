
define(['index', 
        '/dts/hgp/html/hrc-transaction/transactionZoomController.js',
        '/dts/hgp/html/hat-guide/guideZoomController.js',
        '/dts/hgp/html/global-provider/providerFactory.js',
        '/dts/hgp/html/global/hcgGlobalFactory.js',
        '/dts/hgp/html/hac-clinic/clinicZoomController.js',
        '/dts/hgp/html/hrc-attendancePlace/attendancePlaceZoomController.js',
        '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
        '/dts/hgp/html/hcg-hospitalClass/hospitalClassZoomController.js',
        '/dts/hgp/html/hcg-medicalSpecialty/medicalSpecialtyZoomController.js',
        '/dts/hgp/html/hcg-providerCouncil/providerCouncilZoomController.js',
        '/dts/hgp/html/enumeration/accommodationTypeEnumeration.js',
        '/dts/hgp/html/enumeration/womanDeathEnumeration.js',
        '/dts/hgp/html/enumeration/diseaseTypeEnumeration.js',
        '/dts/hgp/html/enumeration/billingValidationEnumeration.js',
        '/dts/hgp/html/hcg-cid/cidZoomController.js',
        '/dts/hgp/html/hrc-leaveReason/leaveReasonZoomController.js',
        '/dts/hgp/html/hrc-movement/movementZoomController.js',
        '/dts/hgp/html/global-provider/providerZoomController.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/js/util/HibernateTools.js',
        '/dts/hgp/html/global-parameters/parametersFactory.js',
        '/dts/hgp/html/hvp-beneficiary/hvp-beneficiary.js',
        '/dts/hgp/html/hrc-movement/movementFactory.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/packageMovementController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/restrictionValidationController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/movementExclusionController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/manualRestrictionController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/movementRestrictionsController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/movementDetailsController.js',        
        '/dts/hgp/html/global/hrcGlobalFactory.js',
        '/dts/hgp/html/hrc-providerBillet/notapresZoomController.js',
        '/dts/hgp/html/global/hacGlobalFactory.js',
        '/dts/hgp/html/hat-guide/guideFactory.js',
        '/dts/hgp/html/util/dts-utils.js',
        '/dts/hgp/html/enumeration/fixedProviderLevelEnumeration.js',
        '/dts/hgp/html/hrc-document/documentZoomController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/movementMaintenanceModalController.js',
        '/dts/hgp/html/hrc-anestheticMeasure/anestheticMeasureZoomController.js',
        '/dts/hgp/html/global-provider/providerProfessionalLinkedZoomController.js',
        '/dts/hgp/html/hcg-city/cityZoomController.js',
        '/dts/hgp/html/enumeration/maintenanceTypeEnumeration.js',
        '/dts/hgp/html/hcg-professional/professionalZoomController.js',
        '/dts/hgp/html/hrc-document/maintenance/controller/rpwExecutionDetailsController.js',
	], function(index) {

	documentMaintenanceController.$inject = ['$rootScope', '$scope', '$stateParams', '$location', 
                                      'totvs.app-main-view.Service', 'totvs.utils.Service',
	                                  '$location', 'hrc.document.Factory', '$state',
                                      'global.provider.Factory', 'global.parameters.Factory',
                                      'hrc.movement.Factory', 'hvp.beneficiary.Factory', 
                                      '$modal', '$timeout', '$filter',
                                      'hrc.global.Factory', 'dts-utils.utils.Service', 'hac.global.Factory',
                                      'hcg.global.Factory', 'hat.guide.Factory', 
                                      'global.userConfigs.Factory', 'TOTVSEvent',
                                      'customization.generic.Factory'];
                                      
                                      
	function documentMaintenanceController($rootScope, $scope, $stateParams, $location,
                                                appViewService, totvsUtilsService,
						                        $location, documentFactory, $state,
                                                providerFactory, parametersFactory,
                                                movementFactory, beneficiaryFactory,
                                                $modal, $timeout, $filter,
                                                hrcGlobalFactory, dtsUtils, hacGlobalFactory, 
                                                hcgGlobalFactory, guideFactory,
                                                userConfigsFactory, TOTVSEvent,
                                                customizationService) {

        var _self = this;
        var timer = null;
                
        _self.allProceduresSelected = false;
        _self.allInputsSelected = false;
        _self.allPackagesSelected = false;
        _self.lgErroExecucaoRpw = false;
                
        var dtInternacaoAux = "";
        var hrInternacaoAux = "";
        var dtAltaAux       = "";
        var hrAltaAux       = "";
        var lgControleAbaAux   = false;

                
        $scope.ACCOMMODATION_TYPE_ENUM = ACCOMMODATION_TYPE_ENUM;
        $scope.WOMAN_DEATH_ENUM        = WOMAN_DEATH_ENUM;
        $scope.DISEASE_TYPE_ENUM       = DISEASE_TYPE_ENUM;

        $scope.DOCUMENT_STATUS_ENUM    = DOCUMENT_STATUS_ENUM;
        $scope.BILLING_VALIDATION_ENUM = BILLING_VALIDATION_ENUM;
        $scope.StringTools             = StringTools;
        $scope.cpcAtiva                = false;
        
        var editDocument;
        
        //variavel utilizada para controlar o 'creationComplete' da tela
        var isSettingData = false;
        var receiveInfoDocuments;
        var movementSemaphore = 3;
        var filledGuideFirst = false;

        //variavel utilizada para controlar o sync das datas de emissao e realizacao
        var oldEmissionDate = undefined;
        
        _self.today = new Date();
        _self.movimentosGuiaCarregados = false;
        
        this.movementFixedFilters = {};
        this.invoiceFixedFilters = {};

        this.action = 'INSERT';
                
        this.genderValues = [
            {value: 0, label: 'Masculino'},
            {value: 1, label: 'Feminino'}
        ];                        

        this.movementOrderFieldsPadrao = [
            {
                title: 'Ordem de digitação',
                property: "ordemDigitacao",
                asc: true,
                default:true
            },{
                title: 'Data de Realização',
                property: "dtRealizacao",
                asc: true
            },{
                title: 'Código do Movimento',
                property: "cdMovimento",
                asc: true
            }
        ];

        this.selectedOrderMovField = this.movementOrderFieldsPadrao[0];

        this.movementOrderInputsFields = function(movementOrder) {
            let movementOrderInputs = [];
            movementOrderInputs = angular.copy(movementOrder);

            movementOrderInputs.push({
                title: 'Tipo + Ordem Alfabética',
                property:"dsMovimento",
                asc: true,
            });

            return movementOrderInputs;
        };

        this.createObject = function(property, value){
            var obj = {};
            obj[property] = value;
            
            return obj;
        }; 
        
        this.movStyle= function(isEven){
            if(isEven == true){
                return 'background-color: aliceblue';
            }else{
                return '';
            }
        };
                
                            
        this.receiveInfoDocuments = function receiveInfoDocuments(result){    
            isSettingData = true;
            _self.lgExecutandoViaRpw = result.lgExecutandoRpw;
            _self.lgRpwExecPedido = result.lgRpwExecutandoPedido;

            if(result.tmpConfigurUsuarProg 
            && result.tmpConfigurUsuarProg.length > 0){
                _self.config = angular.fromJson(result.tmpConfigurUsuarProg[0].desConfig);
            }else{
                _self.config = {movementDetailLevel: _self.movementDetailLevel};
            }

            editDocument = result.tmpDocrecon[0];

            _self.document.cdTransacao = editDocument.cdTransacao;
            _self.document.tissProviderBatch = editDocument.codLotePrestadorTiss;
            _self.transaction = result.tmpTranrevi[0];
            _self.afterTransactionSelect();
            _self.beneficiary = result.tmpUsuario[0];
            _self.document.dsIndClinica = editDocument.dsIndClinica;
            
            if(_self.action == 'EDIT'){
                _self.guideSelectFixedFilters['cdUnidCdCarteiraUsuarioZoom'] = _self.beneficiary.cdUnidCdCarteiraInteira;
                _self.guideZoomFixedFilters['cdUnidCdCarteiraUsuarioZoom'] = _self.beneficiary.cdUnidCdCarteiraInteira;
			}

            _self.proceduresPageOffset  = result.proceduresPageOffset;                               
            _self.inputsPageOffset      = result.inputsPageOffset;
            _self.packagesPageOffset    = result.packagesPageOffset;

            if (_self.proceduresPageOffset > 0) {
                _self.procAplliedWithLastFilter = true;
                _self.proceduresMovementKey = result.tmpMovementKey;
                _self.hasLoadedAllProcs     = result.hasLoadedAllMovements; 
            }else if (_self.inputsPageOffset > 0) {
                _self.inputAplliedWithLastFilter = true;
                _self.inputsMovementKey     = result.tmpMovementKey;
                _self.hasLoadedAllInputs    = result.hasLoadedAllMovements;
            }else{
                _self.packageAplliedWithLastFilter = true; 
                _self.packagesMovementKey   = result.tmpMovementKey;
                _self.hasLoadedAllPackages  = result.hasLoadedAllMovements;
            } 

            _self.document.cdLocalAtendimento = editDocument.cdLocalAtendimento;

            _self.document.cdChaveDocAnterior = editDocument.cdChaveDocAnterior;

            _self.document.dtAnoref = editDocument.dtAnoref;
            _self.document.nrPerref = editDocument.nrPerref;
            
            _self.dtAnoNrPerRef = StringTools.fill(_self.document.dtAnoref,"0",4) + '/' 
                                + StringTools.fill(_self.document.nrPerref,"0",3);
                    
            if (_self.action == 'DETAIL') {
                _self.periodsList = [{dtAnoNrPerRef: _self.dtAnoNrPerRef}];
            }

            editDocument.aaNrGuiaAtendimento = 
                    StringTools.fill(editDocument.aaGuiaAtendimento,"0",4) + 
                    StringTools.fill(editDocument.nrGuiaAtendimento,"0",8);

            editDocument.cdUnidCdCarteiraUsuario = 
                    StringTools.fill(editDocument.cdUnidadeCarteira, "0", 4) +
                    StringTools.fill(editDocument.cdCarteiraUsuario, "0", 13);

            editDocument.cdUnidCdPrestPrinc = 
                    StringTools.fill(editDocument.cdUnidadePrincipal, "0", 4) +
                    StringTools.fill(editDocument.cdPrestadorPrincipal, "0", 8);

            editDocument.cdUnidCdPrestSolic = 
                    StringTools.fill(editDocument.cdUnidadeSolicitante, "0", 4) +
                    StringTools.fill(editDocument.cdPrestadorSolicitante, "0", 8);

            if(editDocument.aaNrGuiaAtendimento !== "000000000000"){
                _self.document.aaNrGuiaAtendimento = editDocument.aaNrGuiaAtendimento;
                _self.onGuideSelect(true);
            }

            _self.document.cdUnidade           = editDocument.cdUnidade;
            _self.document.cdUnidadePrestadora = editDocument.cdUnidadePrestadora;
            _self.document.nrSerieDocOriginal  = editDocument.nrSerieDocOriginal;
            _self.document.nrDocOriginal       = editDocument.nrDocOriginal;
            _self.document.nrDocSistema        = editDocument.nrDocSistema;
            _self.document.lgErroExecucaoRpw   = editDocument.lgErroExecucaoRpw;

            _self.document.nrGuiaAtrOperadora  = StringTools.fill(editDocument.nrSerieDocOriginal, " ", 4) 
                                                + "/"
                                                + StringTools.fill(editDocument.nrDocOriginal, "0", 8) 
                                                + "/"
                                                + StringTools.fill(editDocument.nrDocSistema, "0", 9);

            _self.document.lgTemMovtoLiberado  = editDocument.lgTemMovtoLiberado;

            _self.document.dtEmissao               = editDocument.dtEmissao;
            _self.document.cdFaturamento           = editDocument.cdFaturamento;
            _self.onEmissionDateChange();
            _self.document.nrGuiaPrestador         = editDocument.nrGuiaPrestador;
            _self.document.cdUnidCdCarteiraUsuario = editDocument.cdUnidCdCarteiraUsuario;
            _self.afterBeneficiarySelect();
            _self.document.cdClaHos                = editDocument.cdClaHos;
            _self.document.logAtendimRn            = editDocument.logAtendimRn;

            _self.document.cdUnidCdPrestSolic  = editDocument.cdUnidCdPrestSolic;
            _self.onSolicProviderSelect();
            
            _self.document.cdUnidCdPrestExec = editDocument.cdUnidCdPrestExec;
            _self.onExecProviderSelect();

            if (_self.beneficiary.lgUsuarioEventual == true){
                _self.document.nmUsuEvent           = editDocument.nmUsuEvent;
                _self.document.dtNascimentoUsuEvent = editDocument.dtNascimentoUsuEvent;
                _self.document.inSexoUsuEvent       = editDocument.inSexoUsuEvent;
                _self.document.cdnCidadeUsuEvent    = editDocument.cdnCidadeUsuEvent;

                _self.document.carteiraUsuEvent    = editDocument.carteiraUsuEvent;
                _self.document.senhaUsuEvent       = editDocument.senhaUsuEvent;
            }

            if(_self.transaction.lgProcedimentoUnico == true
            || _self.transaction.lgTransacaoConsulta == true){
                _self.isMovementsVisible = true;
                _self.movement.isEditMovement = true;
                _self.isMovementEnabled = false;

                var prest = editDocument.procedimentos[0].providers[0];

                _self.movement.cdMovimento = parseInt(editDocument.procedimentos[0].cdMovimento);
                
                _self.movement.tpMovimento = 'PROC';

                _self.movement.idRegistro = 1;
                _self.movement.vlCobrado = prest.vlCobrado;
                _self.movement.vlMovimento = prest.vlMovimento;
                _self.movement.vlTaxaCobrado = prest.vlTaxaCobrado;
                _self.movement.qtVezesTabelaPag = prest.qtVezesTabelaPag;
                _self.movement.qtVezesTabelaCob = prest.qtVezesTabelaCob;

                prest.idRegistroMovto = 1;
                _self.movement.providers = [prest];

                _self.originalMovement = angular.copy(_self.movement);
                _self.originalMovement.cdMovimento = editDocument.procedimentos[0].cdMovimento;

                _self.movementReturnObject = {formattedCodeWithType: editDocument.procedimentos[0].cdMovimento};

                _self.loadConsultProcs(); 

                /* Carrega Fatura para transacao de consulta */
                _self.document.cdUnidCdPrestPrinc  = editDocument.cdUnidCdPrestPrinc;

                providerFactory.getProviderByKey(_self.document.cdUnidCdPrestPrinc, [],
                    function (val) {
                        _self.document.cdUnidadePrincipal    = val.cdUnidade;
                        _self.document.cdPrestadorPrincipal  = val.cdPrestador;
                        
                        if(_self.transaction.lgControleFatura == true){
                            _self.invoiceFixedFilters['cdUnidadePrestadora']  = _self.document.cdUnidCdPrestPrinc.substring(0, 4);
                            _self.invoiceFixedFilters['cdPrestador']  = _self.document.cdUnidCdPrestPrinc.substring(4);
                            _self.invoice = {};

                            if(editDocument.urlFatura.length > 0){
                                _self.invoiceFixedFilters['codIndicador']  = 1;
                                _self.document.aaFaturaCdSerieNfCodFaturAp = editDocument.urlFatura;
                                _self.invoice.nrFatura = 0;
                            }else{                                                
                                _self.document.aaFaturaCdSerieNfCodFaturAp = undefined;
                                _self.invoiceFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT]  = "groupInvoiceByNumber";
                            }
                        }
                    });

                //_self.onMovementSelect(true);
            }else{
                _self.document.cdUnidCdPrestPrinc  = editDocument.cdUnidCdPrestPrinc;
                _self.onMainProviderSelect();
            }

            if(_self.transaction.lgPedeCid === true
            && editDocument.cdCid !== ''){
                _self.document.cdCid  = editDocument.cdCid;
                _self.onCidSelect(1);
                _self.document.cdCid1 = editDocument.cdCid1;
                _self.onCidSelect(2);
                _self.document.cdCid2 = editDocument.cdCid2;
                _self.onCidSelect(3);
                _self.document.cdCid3 = editDocument.cdCid3;
            }
            
            _self.document.dsObservacao  = editDocument.dsObservacao;

            if((dtInternacaoAux == "") && (angular.isUndefined(_self.document.dtInternacao) === false)){
                dtInternacaoAux = _self.document.dtInternacao;
            }
            if((hrInternacaoAux == "") && (angular.isUndefined(_self.document.hrInternacao) === false)){
                hrInternacaoAux = _self.document.hrInternacao.substring(0, 2) + ":" + _self.document.hrInternacao.substring(2, 4);
            }
            if((dtAltaAux == "") && (angular.isUndefined(_self.document.dtAlta) === false)){
                dtAltaAux       = _self.document.dtAlta;     
            }
            if((hrAltaAux == "") && (angular.isUndefined(_self.document.hrAlta) === false)){
                hrAltaAux       = _self.document.hrAlta.substring(0, 2) + ":" + _self.document.hrAlta.substring(2, 4);
            }
        }

        //funcao utilizada para obter o indice do movimento qdo movementDetailLevel = 0
        this.getMovementIndex = function($event){
            return angular.element($event.target).closest('.list-movto').scope().$index;
        };
                
         this.prepareDataToDocumentWindow = function(cdUnidade, cdUnidadePrestadora,cdTransacao,
                    nrSerieDocOriginal, nrDocOriginal, nrDocSistema){
                    documentFactory.prepareDataToDocumentWindow(cdUnidade,
                    cdUnidadePrestadora, 
                    cdTransacao,
                    nrSerieDocOriginal,
                    nrDocOriginal,
                    nrDocSistema,
                    function (result) {
                    if (!result) 
                        return;
                        _self.receiveInfoDocuments(result);
                        _self.verifyRpwProcessResult(result.tmpDocrecon[0]);
                    });
        };
                
       this.prepareDataToDocumentNoticeEventsWindow = function(idHistorDoc,idNoticeEvent){                    
       		documentFactory.prepareDataToDocumentNoticeEventsWindow(idHistorDoc,idNoticeEvent,                       
                        function (result) {
                            if (!result) 
                                return;
                            _self.receiveInfoDocuments(result);
                            _self.document.nrGuiaAtrOperadora = result.tmpDocrecon[0].urlChave;
                            
                        });
                            
        };  

		this.init = function() {
                    appViewService.startView('Manutenção de Documentos', 'hrc.documentMaintenance.Control', _self);
                 
                    _self.setPageShortcuts();
                 
                    if(appViewService.lastAction != 'newtab'
                    && (_self.currentUrl == $location.$$path
                    || _self.cameFromDetail == true)){
                        _self.cameFromDetail = false;
                        $timeout(function(){
                            _self.setMovementVisualization(_self.movementDetailLevel);
                            _self.verifyRpwProcessResult(_self.document);
                        },100);
                        return;
                    }
                    
                    _self.cdProgramaCorrente = 'hrc.documentMaintenance';
                    _self.movementDetailLevel = 2;
                    
                    _self.action = "INSERT";
                    _self.movementPeriod = {};
                    _self.documentKey = "";
                    _self.isHistorDocument = false;
                    _self.lgExecutandoViaRpw = false;
                    _self.lgRpwExecPedido = false;
                    _self.isNoticeEvent    = false;
                    _self.beneficiaryFixedFilters = _self.createObject(HibernateTools.SEARCH_OPTION_CONSTANT, 'withCard');
                    _self.guideZoomFixedFilters   = _self.createObject(HibernateTools.SEARCH_OPTION_CONSTANT, 'DataFromComplemTable@@descriptions');
                    _self.guideSelectFixedFilters = {};
                    _self.lgErroExecucaoRpw = false;
                    
                    _self.cleanModel();
                    
                    _self.currentUrl = $location.$$path;
                                        
                    if (angular.isUndefined($stateParams.cdUnidade) == false) { 
                        _self.hasLoadedAllProcs = false;
                        _self.hasLoadedAllInputs = false;
                        _self.hasLoadedAllPackages = false;
                        
                        _self.documentKey =   "Série " + $stateParams.nrSerieDocOriginal
                                            + " | Número " + StringTools.fill($stateParams.nrDocOriginal, '0', 8)
                                            + " | Sequência " + StringTools.fill($stateParams.nrDocSistema, '0', 9);
                                    
                        if($state.current.name === 'dts/hgp/hrc-document.detail'){
                            _self.action = "DETAIL";

                            this.prepareDataToDocumentWindow($stateParams.cdUnidade, 
                                                            $stateParams.cdUnidadePrestadora,
                                                            $stateParams.cdTransacao,
                                                            $stateParams.nrSerieDocOriginal,
                                                            $stateParams.nrDocOriginal,
                                                            $stateParams.nrDocSistema);
                        }else{
                            _self.action = "EDIT";
                            
                            documentFactory.verifyDocumentEditPermissions(
                                        $stateParams.cdUnidade, 
                                        $stateParams.cdUnidadePrestadora,
                                        $stateParams.cdTransacao,
                                        $stateParams.nrSerieDocOriginal,
                                        $stateParams.nrDocOriginal,
                                        $stateParams.nrDocSistema,
                                function(result){
                                    if(result.$hasError){
                                        return;
                                    }
                                    
                                    if (result.lgPodeEditar == true) {
                                        _self.periodsList = result.tmpPerimovi;
                                        _self.movementPeriod = _self.periodsList[0];
                                        
                                        _self.prepareDataToDocumentWindow($stateParams.cdUnidade, 
                                                                        $stateParams.cdUnidadePrestadora,
                                                                        $stateParams.cdTransacao,
                                                                        $stateParams.nrSerieDocOriginal,
                                                                        $stateParams.nrDocOriginal,
                                                                        $stateParams.nrDocSistema);
                                        
                                        return;
                                    }
                                    
                                    if(result.lgPodeDetalhar == true
                                    && result.dsMensagem.length > 0){
                                        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                            title: 'Atenção!', size: 'md',
                                            text: result.dsMensagem
                                                 + ' Deseja acessar a tela de detalhe deste documento?',
                                            cancelLabel: 'Não',
                                            confirmLabel: 'Sim',
                                            callback: function(lgContinue) {
                                                if(lgContinue == true){
                                                    $state.go($state.get('dts/hgp/hrc-document.detail'), 
                                                        { cdUnidade:            $stateParams.cdUnidade,
                                                          cdUnidadePrestadora:  $stateParams.cdUnidadePrestadora,
                                                          cdTransacao:          $stateParams.cdTransacao,
                                                          nrSerieDocOriginal:   $stateParams.nrSerieDocOriginal,
                                                          nrDocOriginal:        $stateParams.nrDocOriginal,
                                                          nrDocSistema:         $stateParams.nrDocSistema});
                                                }else{
                                                    _self.closeTab();
                                                }
                                            }
                                        });
                                    };
                                    
                                });
                        }
                    }else if($state.current.name === 'dts/hgp/hrc-document.detailEventNotice'){                                        
                        _self.action = "DETAIL";                        
                        this.prepareDataToDocumentNoticeEventsWindow($stateParams.idSeqHistorDocrecon,$stateParams.idSeqAvisoCob);                        
                        _self.isHistorDocument = true;
                        _self.isNoticeEvent = true;
                        _self.hasLoadedAllProcs = true;
                        _self.hasLoadedAllInputs = true;
                        _self.hasLoadedAllPackages = true;
                                                
                    }else{
                        _self.hasLoadedAllProcs = true;
                        _self.hasLoadedAllInputs = true;
                        _self.hasLoadedAllPackages = true;
                        
                        userConfigsFactory.getConfigByKey(
                                $rootScope.currentuser.login, 
                                _self.cdProgramaCorrente,
                            function(result){
                                if(angular.isUndefined(result) == true){
                                    _self.config = { movementDetailLevel: _self.movementDetailLevel};
                                }else{
                                    _self.config = result.desConfig;
                                }
                            });
                            
                        hrcGlobalFactory.getActivePeriods(function (result) {
                            
                            if(result.$hasError){
                                return;
                            }
                            
                            _self.periodsList = result;
                            
                            _self.movementPeriod = _self.periodsList[0];
                            _self.dtAnoNrPerRef = _self.movementPeriod.dtAnoNrPerRef;
                        });    
                        
                        $timeout(function(){
                            totvsUtilsService.focusOn('transactionZoom');    
                        });
                        
                    }

                    _self.inCaraterSolicitacaoChange();

                    parametersFactory.getParamecp(function(result){
                        _self.paramecp = result;
                    });

                    parametersFactory.getParamrc(function(result){
                        _self.paramrc = result;						
                    });

                    // Dispara o metodo 'cpc' do servico de customizacao do 'custom healthcare.hrc.document' passando o controller como parametro
                    var controllerAtualizado = customizationService.callEvent('healthcare.hrc.document', 'cpc', _self);
                    if (controllerAtualizado != undefined && controllerAtualizado != null && controllerAtualizado != 'ok') {
                        _self = controllerAtualizado;
                        // Indica que a CPC esta ativa
                        $scope.cpcAtiva = true;
                    }
		};
                
        this.onTransactionSelect = function(){
            _self.previousAaGuide = _self.document.aaNrGuiaAtendimento;
            
            _self.cleanModel('TRANSACTION');
            
            _self.document.aaNrGuiaAtendimento = _self.previousAaGuide;                    
            if(!_self.document.cdTransacao){
                return;
            }
            
            hrcGlobalFactory.getTransactionByKey(_self.document.cdTransacao, [],
                function (val) {
                    _self.transaction = val;
                    _self.afterTransactionSelect();
                    _self.onGuideSelect(false);
                });
        };
                
        this.afterTransactionSelect = function(){
            //transacao selecionada invalida
            if(angular.isUndefined(_self.transaction.cdTransacao) === true){
                _self.cleanModel('TRANSACTION');
                return;
            }

            if(_self.transaction.lgTransacaoConsulta == true){
                _self.transaction.lgProcedimentoUnico = true;
            }

            if(_self.action != 'INSERT')
                return;
            
            if(_self.transaction.lgTransacaoOdontologica == true
            || _self.transaction.lgTransacaoReembolso == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Transações Odontológicas e de Reembolso não são'
                                        + ' suportadas nesta manutenção! Favor utilizar o modo clássico!'
                });

                _self.cleanModel('TRANSACTION');
                return;
            }        

            if(!_self.transactionGuidePermission(_self.transaction)){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Transação não permite informar autorizaçao'
                });
                _self.cleanModel('TRANSACTION');
                return;
            }

            hrcGlobalFactory.getTranusuaByFilter('',0,0,false,[
                {property:'cdTransacao'       , value: _self.transaction.cdTransacao , priority:2},
                {property:'cdUseridTransacao' , value: $rootScope.currentuser.login  , priority:1}],
                function(result){
                    if(!result || result.length == 0){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', 
                            title: 'Usuario ' + $rootScope.currentuser.login 
                                    + ' nao pode realizar manutencao nesta transacao!'
                        });
                        _self.cleanModel('TRANSACTION');
                        return;
                    }

                    if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === true
                    && angular.isUndefined(_self.invoice.aaFatura) === true){
                        if(_self.transaction.lgMostraUnidadePadrao === true){
                            if(_self.transaction.lgUnidadePadrao === true){
                                _self.canEditMainProvider = true;
                            }
                        }
                        _self.document.dtEmissao = new Date().getTime();
                        _self.onEmissionDateChange();
                    }

                    if(_self.document.dtEmissao > 0){
                        _self.loadConsultProcs();    
                    }
            });
        };

        this.loadConsultProcs = function () {
            if(_self.transaction.lgProcedimentoUnico != true
            && _self.transaction.lgTransacaoConsulta != true){
                return;
            }

            _self.isMovementsVisible = true;

            hrcGlobalFactory.getTransactionModuleProc('', 0, 0, false,
                [{property: 'cdTransacao'  , value: _self.transaction.cdTransacao},
                    {property: 'dtLimite'   , value: _self.document.dtEmissao, operator: '>='},
                    {property: HibernateTools.SEARCH_OPTION_CONSTANT   , value: 'Ambproce'}],
            function (result) {
                if(!result){
                    return;
                }

                _self.consultationMovementList = [];

                if(result.length == 1){
                    _self.movementReturnObject = {formattedCodeWithType: result[0].procetrmo.cdProcedimentoCompleto};

                    _self.originalMovement = angular.copy(_self.movement);

                    _self.consultationMovementList.push(result[0]);
                    //_self.onMovementSelect();
                }else{
                    //logica para agrupar por codigo do procedimento
                    for (var i=0;i<result.length;i++){
                        resultMovto = result[i];

                        hasMovement = false;
                        for (var j=0;j<_self.consultationMovementList.length;j++){
                            consultMovement = _self.consultationMovementList[j];
                            if(resultMovto.procetrmo.cdProcedimentoCompleto == consultMovement.procetrmo.cdProcedimentoCompleto){
                                hasMovement = true;
                            }
                        }

                        if(hasMovement == false){
                            _self.consultationMovementList.push(resultMovto);
                        }
                    }

                    if(_self.action == 'INSERT'){
                        _self.movement.cdMovimento = _self.consultationMovementList[0].procetrmo.cdProcedimentoCompleto;
                    }

                    _self.originalMovement = angular.copy(_self.movement);
                }

            });
        };
                
        this.onGuideSelect = function(carregaMovimentos){

            _self.movimentosGuiaCarregados = false;
            
            if(_self.action != "EDIT" && isSettingData == false){
                filledGuideFirst = true;
                _self.cleanModel('GUIDE');
            }
            
            if(!_self.document.aaNrGuiaAtendimento){
                _self.guide = {};
                _self.document.aaGuiaAtendimento = 0;
                _self.document.nrGuiaAtendimento = 0;

                return;
            }
            
            guideFactory.getGuideByKey(_self.document.aaNrGuiaAtendimento, 
                [{property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'DataFromComplemTable'},
                    {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'}],
                function (val) {
                    if(!(val)
                    || val.length == 0){
                        return;
                    }

                    _self.guide = val[0];
                    _self.document.aaGuiaAtendimento = _self.guide.aaGuiaAtendimento;
                    _self.document.nrGuiaAtendimento = _self.guide.nrGuiaAtendimento;

                    if(_self.action === "EDIT") {
                        //Verifica se a transação da guia é a mesma do documento
                        if(_self.guide.cdTransacao !== _self.document.cdTransacao) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'warning', title: 'Transação da guia informada difere da transação do documento.'
                            });
                        }

                        //Valida o beneficiário
                        var cdUnidCdCarteiraUsuarioGuia = StringTools.fill(_self.guide.cdUnidadeCarteira,"0",4)
                                                        + StringTools.fill(_self.guide.cdCarteiraUsuario,"0",13);

                        if((cdUnidCdCarteiraUsuarioGuia !== _self.document.cdUnidCdCarteiraUsuario)
                        && (_self.guide.cdCarteiraUsuario !== _self.beneficiary.carteiraPrinc.cdCarteiraAntiga)) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error', title: 'Beneficiário da guia informada difere do beneficiário do documento.'
                            });

                            _self.document.aaNrGuiaAtendimento = "";
                        }

                        return;                               
                    } else {
                        if(angular.isUndefined(_self.document.cdTransacao)){
                            _self.selectGuideTransaction(carregaMovimentos);
                        }else{
	                        _self.afterGuideSelect(carregaMovimentos);
	                    }
                    }
                }); 
        };
                    
        this.selectGuideTransaction = function(carregaMovimentos){
            hrcGlobalFactory.getTransactionByKey(_self.guide.cdTransacao, [],
                function (result) {
                    if(!_self.transactionGuidePermission(result)){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Transação da Guia não permite informar autorizaçao'
                        });
                        _self.document.cdTransacao = "";
                        _self.cleanModel('TRANSACTION');
                        return;
                    }
                    _self.transaction = result;                            
                    _self.document.cdTransacao = _self.transaction.cdTransacao;
                    _self.afterTransactionSelect();
                    _self.afterGuideSelect(carregaMovimentos);
            });
        }
                    
        this.afterGuideSelect = function(carregaMovimentos){
            //guia selecionada invalida
            if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === true
            || isSettingData == true){
                return;
            }
            if(!_self.transactionGuidePermission(_self.transaction)){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Transação não permite informar autorizaçao'
                });

                _self.guide = {};
                _self.document.aaGuiaAtendimento = 0;
                _self.document.nrGuiaAtendimento = 0;
                _self.cleanModel('GUIDE');

                
                return;
            }
                    
            if(_self.transaction.lgDadosGuiaAutomatico === true){
                _self.document.dtEmissao = _self.guide.dtEmissaoGuia;
                _self.onEmissionDateChange();
                _self.document.cdUnidCdPrestSolic = StringTools.fill(_self.guide.cdUnidadeSolicitante,"0",4)
                                                    + StringTools.fill(_self.guide.cdPrestadorSolicitante,"0",8);
                _self.onSolicProviderSelect();
                _self.canEditMainProvider = false;

                if(_self.action == 'INSERT' && carregaMovimentos){ 
                    _self.carregarMovimentos();
                }
            }

            if(_self.transaction.lgPedeClinica === true){
                _self.document.cdClinica = _self.guide.cdClinica;
            }

            if(_self.transaction.lgPedeLocalAtendimento === true){
                _self.document.cdLocalAtendimento = _self.guide.cdLocalAtendimento;
            }
            
            if(_self.transaction.lgPedeCid === true){
                _self.document.cdCid  = _self.guide.cdCid;
                _self.onCidSelect(1);
                _self.document.cdCid1 = _self.guide.cdCid1;
                _self.onCidSelect(2);
                _self.document.cdCid2 = _self.guide.cdCid2;
                _self.onCidSelect(3);
                _self.document.cdCid3 = _self.guide.cdCid3;
                _self.onCidSelect(4);
            }

            //dados da guia
            _self.canEditMainProvider = true;
            _self.setMainProvider(_self.guide.cdUnidadePrincipal, _self.guide.cdPrestadorPrincipal);
            _self.document.cdUnidCdCarteiraUsuario = StringTools.fill(_self.guide.cdUnidadeCarteira,"0",4)
                                                    + StringTools.fill(_self.guide.cdCarteiraUsuario,"0",13);
            _self.onBeneficiarySelect();
            
            //_self.document.logAtendimRn = _self.guide.guiaAutorizComp.logAtendimRn;
            _self.document.dsIndClinica = _self.guide.dsIndClinica;
            _self.document.dtInternacao = _self.guide.dtInternacaoRealiz;
            _self.document.hrInternacao = _self.guide.hrInternacao;
            _self.document.dtAlta       = _self.guide.dtAltaRealiz;
            _self.document.cdMotivoAlta = _self.guide.cdMotivoAlta;

            /*USUARIO EVENTUAL*/
            _self.document.nmUsuEvent           = _self.guide.nmUsuEvent;
            _self.document.dtNascimentoUsuEvent = _self.guide.dtNascimentoUsuEvent;
            _self.document.inSexoUsuEvent       = _self.guide.inSexoUsuEvent;
            _self.document.cdnCidadeUsuEvent    = _self.guide.cdnCidadeUsuEvent;

            _self.document.carteiraUsuEvent     = _self.guide.carteiraUsuEvent;
            _self.document.senhaUsuEvent        = _self.guide.senhaUsuEvent;

            _self.onLeaveReasonSelect();
        };

        this.transactionGuidePermission = function(transaction){

            let transactionTest = transaction;

            if(angular.isUndefined(transactionTest))
                transactionTest = _self.transaction;

            if(angular.isUndefined(_self.document.aaGuiaAtendimento)
            || angular.isUndefined(_self.document.nrGuiaAtendimento)
            || _self.document.aaGuiaAtendimento === 0
            || _self.document.nrGuiaAtendimento === 0)
                return true;

            if(angular.isUndefined(transactionTest)
            || transactionTest.cdTransacao === 0)
                return true;

            if(transactionTest.inAcaoTranGuia === 0){
                return false;
            }

            return true;
        }

        this.carregarMovimentos = function(){
            _self.movimentosGuiaCarregados = true;
            movementFactory.getMovementsFromGuideForRC(
                _self.guide.aaGuiaAtendimento,   
                _self.guide.nrGuiaAtendimento,
                function(result){                                        
                    if(result.$hasError)
                        return;

                    Array.prototype.push.apply(_self.document.procedimentos,
                                                result.tmpMovementProcedure);
                    Array.prototype.push.apply(_self.document.insumos,
                                                result.tmpMovementInput);    
                    Array.prototype.push.apply(_self.document.pacotes,
                                                result.tmpMovementPackage); 
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                            type: 'info',
                                            title: 'Movimentos da guia carregados com sucesso!'
                                            });
                
                });
        }
                
        this.initializeMovements = function(){
            if(_self.transaction.lgProcedimentoUnico == true
            || _self.transaction.lgTransacaoConsulta == true
            || (angular.isUndefined(_self.mainProvider) === false
            && _self.mainProvider.cdPrestador > 0
            && angular.isUndefined(_self.beneficiary) === false
            && angular.isUndefined(_self.beneficiary.propost) === false
            && angular.isUndefined(_self.beneficiary.propost.cdPlano) === false)){
                _self.isMovementsVisible = true;
            }else{
                _self.isMovementsVisible = false;
                return;
            }
            
            if(_self.transaction.lgDataRealizacaoUnica === false){
                _self.movement.dtRealizacao = _self.document.dtEmissao;
            }
            
            _self.fillMovementTypes();
            _self.addMovementFixedFilters();
        };
        
        this.fillMovementTypes = function(){
            if(_self.transaction.lgProcedimentoUnico == true){
                return;
            }
            if(_self.transaction.lgAceitaPacote === true){
                _self.transactionInputTypes = [{cdTipoInsumo: 0, rotulo: '0 - Procedimento ou Pacote'}];
            }else{
                _self.transactionInputTypes = [{cdTipoInsumo: 0, rotulo: '0 - Procedimento'}];
            }

            if(_self.transaction.lgAceitaInsumos === true){
                hrcGlobalFactory.getTratipinByFilter('', 0, 0, false,
                        [{property: 'cdTransacao', value: _self.transaction.cdTransacao}],
                    function (result) {
                        if(!result || result.$hasError == true){
                            return;
                        }
                        angular.forEach(result,function(inputType){
                            _self.transactionInputTypes.push({
                                cdTipoInsumo: inputType.cdTipoInsumo,
                                rotulo: inputType.rotuloTipoInsumo
                            });
                        });
                        
                        _self.inputTypes = _self.transactionInputTypes;
                    });
            };
            
                _self.inputTypes = _self.transactionInputTypes;
            
        };
                
        /**
         * Se recebeu um movimento por parametro adiciona somente o filtro do tipo deste movto
         * senao adiciona todos os filtros permitidos pela transacao
         * @param movement
         */
        this.addMovementFixedFilters = function(movement){
            
            /*limpa as propriedades q serao sobrescritas */
            delete _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT];
            delete _self.movementFixedFilters['cdTipoPlano'];
            delete _self.movementFixedFilters['cdPlano'];
            delete _self.movementFixedFilters['cdModalidade'];
            delete _self.movementFixedFilters['cdPrestador'];
            delete _self.movementFixedFilters['cdUnidade'];
            
            if(angular.isUndefined(movement) == false){
                _self.setFixedFiltersForMovement(movement.tpMovimento, _self.movementFixedFilters);
                return;
            }
            
            if(_self.movement.cdTipoInsumo == 0){
                _self.setFixedFiltersForMovement('PROC', _self.movementFixedFilters);
            }
            
            if(_self.transaction.lgProcedimentoUnico === false){
                if(_self.transaction.lgAceitaPacote === true){
                    if(_self.movement.cdTipoInsumo == 0){
                        _self.setFixedFiltersForMovement('PACOTE', _self.movementFixedFilters);
                    }
                }

                if(_self.transaction.lgAceitaInsumos === true){
                    if(_self.movement.cdTipoInsumo > 0){
                        _self.setFixedFiltersForMovement('INSU', _self.movementFixedFilters);
                    }
                }
            }
        };
        
        this.setFixedFiltersForMovement = function(tpMovimento, fixedFiltersVar){
            switch(tpMovimento) {
                case 'PROC':
                    _self.addSearchOption(fixedFiltersVar, 'PROCEDIMENTOS');
                    break;
                case 'PACOTE':
                    _self.addSearchOption(fixedFiltersVar, 'PACOTES');

                    fixedFiltersVar['cdTipoPlano']  = _self.beneficiary.propost.cdTipoPlano;
                    fixedFiltersVar['cdPlano']      = _self.beneficiary.propost.cdPlano;
                    fixedFiltersVar['cdModalidade'] = _self.beneficiary.cdModalidade;
                    fixedFiltersVar['cdPrestador']  = _self.mainProvider.cdPrestador;
                    fixedFiltersVar['cdUnidade']    = _self.mainProvider.cdUnidade;
                    break;    
                case 'INSU':
                    _self.addSearchOption(fixedFiltersVar, 'INSUMOS');
                    break;
            }
        };
                
        this.addSearchOption = function(obj, option){
            if(angular.isUndefined(obj[HibernateTools.SEARCH_OPTION_CONSTANT]) == true){
                obj[HibernateTools.SEARCH_OPTION_CONSTANT] = option;
            }else{
                obj[HibernateTools.SEARCH_OPTION_CONSTANT] += '@@' + option;
            }                    
        };
        
        /**
         * Adiciona o movimento a lista
         * @returns lgAdicionadoComSucesso
         */

        // Verifica se a CPC esta ativa e realiza o tratamento especifico para adicionar movimentos
        this.addMovement = function(){
            if ($scope.cpcAtiva != undefined && $scope.cpcAtiva == true) {
                _self.cpcAddMovement($scope.controller);
            } else {
                _self.addMovementItem();
            }
        }

        this.addMovementItem = function(){

            var movement = $.extend({}, _self.movement);

            if(_self.transaction.lgProcedimentoUnico === false
            && _self.transaction.lgTransacaoConsulta === false) {
                movement.cdMovimento = movement.cdMovimento
                        .replace(' (A)', '')
                        .replace(' (P)', '');
            }
            
            movement.formattedCodeWithType = _self.selectedMovement.formattedCodeWithType;
            movement.rotulo                = _self.selectedMovement.rotulo;
            
            if(_self.transaction.lgDataRealizacaoUnica === true){
                movement.dtRealizacao     = _self.document.dtRealizacao;
                movement.hrRealizacao     = _self.document.hrRealizacao;
                movement.hrRealizacaoFim  = _self.document.hrRealizacao;
            }
            
            if(_self.transaction.lgProcedimentoUnico == false
            && _self.transaction.lgTransacaoConsulta == false){
                
                var emptyProviderIndex = null;
                var emptyProvQuantityInd = null;
                var emptyDivisionProviderIndex = null;

                var validateDivisionProvider = false;
                if(movement.tpMovimento == 'PACOTE'){
                    if(!(movement.qtMovimento > 0)){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', 
                            title: 'Quantidade não foi informada!'
                        });

                        totvsUtilsService.focusOn('movementZoom');
                        return false;
                    }

                    if(!angular.isUndefined(_self.movement.movementObject.dtLimite) && _self.movement.movementObject.dtLimite < _self.getRealizationDate()){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', 
                            title: 'Data de realização não pode ser maior que a Data Limite do pacote utilizado!'
                        });
    
                        _self.movement.dtRealizacao = _self.movement.movementObject.dtLimite;
                        return;
                    }
                }else if(movement.tpMovimento == 'PROC'
                        && movement.movementObject.gruProDAO.lgCooperado == true){
                            validateDivisionProvider = true;
                        }

                for (var i = 0; i < movement.providers.length; i++) {
                    var provAux = movement.providers[i];
                    if(provAux.cdPrestador == undefined
                    || provAux.cdPrestador == ''){
                        emptyProviderIndex = i;
                        break;
                    }
                    
                    if(movement.tpMovimento == 'PACOTE'){
                        continue;
                    }
                    
                    if(!(provAux.qtCobrado > 0)){
                        emptyProvQuantityInd = i;
                        break;
                    }
                    
                    if(movement.tpMovimento == 'PROC'
                    && _self.paramrc.lgSeparaValoresInterc == true
                    && _self.transaction.lgPedeValorCobradoProced == true
                    && provAux.cdUnidade != _self.paramecp.cdUnimed){
                        provAux.vlCobrado = _self.sumSeparatedValues(
                                                        provAux.valHonorariosCobrado,
                                                        provAux.valOperacionalCobrado,
                                                        provAux.valFilmeCobrado);
                        
                        provAux.vlTaxaCobrado = _self.sumSeparatedValues(
                                                        provAux.valTaxaHonoCobrado,
                                                        provAux.valTaxaOperCobrado,
                                                        provAux.valTaxaFilmeCobrado);
                                                        
                        provAux.vlMovimento = _self.sumSeparatedValues(
                                                        provAux.valHonorariosMovimento,
                                                        provAux.valOperacionalMovimento,
                                                        provAux.valFilmeMovimento);
                                                        
                        provAux.vlTaxaMovimento = _self.sumSeparatedValues(
                                                        provAux.valTaxaHonoMovimento,
                                                        provAux.valTaxaOperMovimento,
                                                        provAux.valTaxaFilmeMovimento);
                    }
                    
                    if(validateDivisionProvider == false){
                        //caso o procedimento nao seja de divisao, limpa as informacoes desse caso
                        //tratativa no caso de o usuario alterar um movimento que tinha divisao de honorario
                        //para um movimento que nao tenha mais divisao de honorarios
                        provAux.cdUnidCdPrestadorHono = undefined;
                        provAux.vlCobradoHono = 0;
                        provAux.valHonorariosCobradoHono = 0;
                        provAux.valOperCobradoHono = 0;
                        provAux.valFilmeCobradoHono = 0;
                        provAux.cdCboEspecialidHono = undefined;
                        provAux.honoProvCbosSpecialties = undefined;
                        provAux.rotuloPrestDivHono = undefined;
                        continue;
                    }
                    
                    if(provAux.preserv.lgDivisaoHonorario == true){
                        if(provAux.cdUnidCdPrestadorHono == undefined
                        || provAux.cdUnidCdPrestadorHono == ''){
                            emptyDivisionProviderIndex = i;
                            break;
                        }
                        
                        if(_self.paramrc.lgSeparaValoresInterc == true
                        && _self.transaction.lgPedeValorCobradoProced == true
                        && _self.getDivisionProviderUnit(provAux) != _self.paramecp.cdUnimed){
                            provAux.vlCobradoHono = _self.sumSeparatedValues(
                                                        provAux.valHonorariosCobradoHono,
                                                        provAux.valOperCobradoHono,
                                                        provAux.valFilmeCobradoHono);
                                    
                            provAux.vlTaxaCobradoHono = _self.sumSeparatedValues(
                                                            provAux.valTaxaHonoCobradoHono,
                                                            provAux.valTaxaOperCobradoHono,
                                                            provAux.valTaxaFilmeCobradoHono);
                                                        
                            provAux.vlMovimentoHono = _self.sumSeparatedValues(
                                                        provAux.valHonorariosMovimHono,
                                                        provAux.valOperacionalMovimHono,
                                                        provAux.valFilmeMovimHono);
                                                        
                            provAux.vlTaxaMovimentoHono = _self.sumSeparatedValues(
                                                                provAux.valTaxaHonoMovimHono,
                                                                provAux.valTaxaOperMovimHono,
                                                                provAux.valTaxaFilmeMovimHono);
                        }
                    }
                };

                if(emptyProviderIndex != null){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', 
                        title: 'Prestador do movimento não foi informado!'
                    });
                    
                    totvsUtilsService.focusOn('movementProvider' + emptyProviderIndex);
                    return false;
                }
                
                if(emptyProvQuantityInd != null){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', 
                        title: 'Quantidade não foi informada!'
                    });
                    
                    totvsUtilsService.focusOn('providerQuantity' + emptyProvQuantityInd);
                    return false;
                }
                
                /* COMENTADO ATÉ VER A VALIDAÇÃO CERTA
                if(emptyDivisionProviderIndex != null){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', 
                        title: 'Prestador da divisao de honorarios não foi informado!'
                    });
                    
                    totvsUtilsService.focusOn('divisionProvider' + emptyDivisionProviderIndex);
                    return false;
                }*/
            }else{

                if(_self.transaction.lgDataRealizacaoUnica === false){
                    movement.dtRealizacao     = _self.document.dtEmissao;
                    movement.hrRealizacao     = _self.document.hrRealizacao;
                    movement.hrRealizacaoFim  = _self.document.hrRealizacao;
                }

                _self.document.procedimentos.unshift(movement);
                _self.afterAddMovement();
                return true;
            }

            // retira da lista de prestRemovidos os prestadores 
            // que continuaram no movto apos a edição
            angular.forEach(movement.providers, function(provider){
                if(provider.nrProcesso > 0
                || provider.nrSeqDigitacao > 0){
                    for (var i = 0; i < _self.document.prestRemovidos.length; i++ ){
                        var removedProvider = _self.document.prestRemovidos[i];
                        if(provider.nrProcesso     == removedProvider.nrProcesso
                        && provider.nrSeqDigitacao == removedProvider.nrSeqDigitacao){
                            _self.document.prestRemovidos.splice(i,1);
                            break;
                        }
                    }
                }else{
                    provider.qtMovimento = provider.qtCobrado;
                }
                
                //limpa o status para mostrar que o movimento nao esta salvo
                provider.inStatus = 0;
            });
            
            switch (movement.tpMovimento){
                case 'PROC':
                    _self.fillCompleteLabelAndTooltip(movement);
                    _self.unsavedProceduresNumber++;
                    _self.document.procedimentos.unshift(movement);
                    break;
                case 'INSU':
                    _self.fillCompleteLabelAndTooltip(movement);
                    _self.unsavedInputsNumber++;
                    _self.document.insumos.unshift(movement);
                    break;
                case 'PACOTE':
                    if((angular.isUndefined(movement.packageProcedures) == true
                        || movement.packageProcedures.length == 0)
                    && (angular.isUndefined(movement.packageInputs) == true
                        || movement.packageInputs.length == 0)){

                        movementFactory.getPackageWithMovements(movement,
                            function(result){
                                if(result){
                                    movement.packageInputs = result.packageInputs;
                                    movement.packageProcedures = result.packageProcedures;
                                    movement.vlPagamento = result.vlPagamento;
                                    movement.vlCobranca = result.vlCobranca;

                                    angular.forEach(movement.packageInputs, 
                                        function(input){
                                            input.providers = angular.copy(movement.providers);
                                    });
                                    
                                    angular.forEach(movement.packageProcedures,
                                        function(procedure){
                                            procedure.providers = angular.copy(movement.providers);

                                    });

                                    _self.afterFillPackageMovements(movement);
                                    
                                }
                            });
                    }else{
                        return $timeout(function(){
                            
                            _self.syncPackageProviders(movement); 
                            
                            return _self.afterFillPackageMovements(movement);
                        });
                    }
                    return true;
            }

            _self.selectMovementTab(movement.tpMovimento);
            _self.afterAddMovement();
            return true;
        };

        this.sumSeparatedValues = function(val1, val2, val3){
            return parseFloat(val1 || 0.00)
                    + parseFloat(val2 || 0.00)      
                    + parseFloat(val3 || 0.00);
        };

        this.fillCompleteLabelAndTooltip = function(mov){
            var movtoLabel = '';
            var movtoTooltip = '';
            
            if(mov.tpMovimento == 'INSU'){
                movtoLabel += StringTools.fill(mov.cdTipoInsumo,'0',2)
                            + StringTools.fill(mov.cdMovimento,'0',10) + ' ';
            }else{
                movtoLabel = mov.cdMovimento + ' ';
            }
            
            if(mov.dsMovimento.length > 25){
                movtoLabel += mov.dsMovimento.substring(0,22) + '... ';
            }else{
                movtoLabel += StringTools.fillRight(mov.dsMovimento,' ',26);
            }
            
            movtoTooltip += 'Movimento: ' + mov.rotulo + '\n';
            
            if(mov.tpMovimento == 'PROC'){
                movtoTooltip += 'Via de Acesso: ' + _self.getAccessWayLabel(mov) + '\n';
            }else if(mov.tpMovimento == 'INSU'){
                if(mov.movementObject.lgGenericoPTU == true){
                    movtoTooltip += 'Descricao de Insumo Generico: ' + mov.dsInsumoGenerico + '\n';                            
                }
                if (mov.movementObject.lgOpme){
                    movtoTooltip += 'Codigo Anvisa: ' + mov.cdAnvisa + '\n';
                    movtoTooltip += 'Nome Fornecedor: ' + mov.nmFornecedor + '\n';
                    movtoTooltip += 'Numero Nota Fornecedor: ' + mov.nrNotaFornecedor + '\n';
                }
            }
            
            strAux = $filter('date')(mov.dtRealizacao,'dd/MM/yyyy');
            movtoTooltip += 'Realizacao: ' + strAux + ' ';
            movtoLabel += strAux + ' ';
            
            if (mov.hrRealizacao == mov.hrRealizacaoFim) {
                movtoTooltip += 'as ' + $filter('time')(mov.hrRealizacao) + 'h';
            }else{
                movtoTooltip += 'das ' + $filter('time')(mov.hrRealizacao) + 'h' 
                                + ' as ' + $filter('time')(mov.hrRealizacaoFim) + 'h';
            }
            
            movtoTooltip += '\n';
                    
            angular.forEach(mov.providers, function(prov){
                prov.rotuloCompleto = movtoLabel;
                prov.tooltipCompleto = movtoTooltip;
                
                switch (mov.tpMovimento){
                    case 'PACOTE':
                        strAux = StringTools.fill(mov.qtMovimento,' ',6) ;
                        break;
                    case 'PROC':
                        strAux = StringTools.fill(prov.qtMovimento,' ',6) ;
                        break;
                    case 'INSU':
                        strAux = StringTools.fill($filter('currency')(prov.qtMovimento,'',4).replace('.',''),' ',9);
                        strAux += " " + mov.movementObject.umInsumo;
                        break;
                }
                
                prov.tooltipCompleto += 'Quantidade: ' + strAux + '\n';     
                prov.rotuloCompleto += strAux + ' ';
                
                if(mov.tpMovimento == 'PACOTE'
                && mov.movementObject.lgPedeViaAcesso == true){
                    prov.tooltipCompleto += 'Via de Acesso: ' + _self.getAccessWayLabel(mov) + '\n';
                }
                
                if(prov.vlCobrado){
                    valorAux = parseFloat(prov.vlCobrado) + parseFloat(prov.vlTaxaCobrado || 0.00);
                    strAux = $filter('currency')(valorAux,'',2).replace(/[.]/g,'');
                }else{
                    strAux = '0,00';
                }
                
                prov.tooltipCompleto += 'Prestador: ' + prov.preserv.rotulo + '\n'
                                        + 'Valor Cobrado: R$ ' + strAux + '\n';
                prov.rotuloCompleto += '   R$ ' + StringTools.fill(strAux,' ',10);
                                
                switch (mov.tpMovimento){
                    case 'PACOTE':
                        prov.tooltipCompleto += 'Valor Pacote: ';
                        break;
                    case 'PROC':
                        prov.tooltipCompleto += 'Valor Procedimento: ';
                        break;
                    case 'INSU':
                        prov.tooltipCompleto += 'Valor Insumo: ';
                        break;
                }
                                
                if(prov.vlMovimento){
                    valorAux = parseFloat(prov.vlMovimento) + parseFloat(prov.vlTaxaMovimento || 0.00);
                    strAux = $filter('currency')(valorAux,'',2).replace(/[.]/g,'');
                    prov.tooltipCompleto += 'R$ ' + strAux + '\n';
                    prov.rotuloCompleto += '    R$ ' + StringTools.fill(strAux,' ',10) + '    ';
                }else{
                    prov.tooltipCompleto += 'Nao Calculado\n';
                    prov.rotuloCompleto += StringTools.fill(' ',' ',21);
                }         
                                        
                if (prov.vlGlosado){
                    prov.tooltipCompleto += 'Valor Glosado: R$ ' + $filter('currency')(prov.vlGlosado,'',2).replace(/[.]/g,'') + '\n';
                } else{
                    prov.tooltipCompleto += 'Valor Glosado: Nao Calculado\n';
                }
                                        
                prov.tooltipCompleto += 'CBO: ' + _self.getProviderCboSpecialty(prov).rotulo + '\n'
                                        + 'Especialidade: ' + _self.getProviderCboSpecialty(prov).rotuloEspecialid + '\n';
                
                prov.rotuloCompleto += prov.cdUnidCdPrestador + ' ';
                    
                if(angular.isUndefined(prov.preserv.nmPrestador) == true){
                    prov.rotuloCompleto += 'Nao Cadastrado           ';
                }else{
                    if(prov.preserv.nmPrestador.length > 25){
                        prov.rotuloCompleto += prov.preserv.nmPrestador.substring(0,22) + '... ';
                    }else{
                        prov.rotuloCompleto += StringTools.fillRight(prov.preserv.nmPrestador,' ',26);
                    }
                }
                
                if(mov.tpMovimento != 'INSU'){
                    prov.tooltipCompleto += 'Grau de Participacao: ';
                    angular.forEach(_self.tissProviderLevels, function(lvl){
                        if(lvl.cdnNivTiss == prov.cdnNivTiss){
                            prov.tooltipCompleto += lvl.rotulo;
                        }
                    });
                    
                    if(mov.tpMovimento == 'PROC'){
                        if(mov.movementObject.gruProDAO.lgCooperado == true
                        && prov.preserv.lgDivisaoHonorario == true){
                            if(prov.vlCobradoHono){
                                valorAux = parseFloat(prov.vlCobradoHono) + parseFloat(prov.vlTaxaCobradoHono || 0.00);
                                strAux = $filter('currency')(valorAux,'',2).replace(/[.]/g,'');
                            }else{
                                strAux = '0,00';
                            }

                            prov.tooltipCompleto += '\nPrestador Divisao: ' + prov.rotuloPrestDivHono + '\n'
                                                    + 'Valor Cobrado Divisao: R$ ' + strAux + '\n';
                            prov.rotuloCompletoHono = '    R$ ' + StringTools.fill(strAux,' ',10);              
                                            
                            if(prov.vlMovimentoHono){
                                valorAux = parseFloat(prov.vlMovimentoHono) + parseFloat(prov.vlTaxaMovimentoHono || 0.00);
                                strAux = $filter('currency')(valorAux,'',2).replace(/[.]/g,'');
                                prov.tooltipCompleto += 'Valor Procedimento Divisao: R$ ' + strAux + '\n';
                                prov.rotuloCompletoHono += '    R$ ' + StringTools.fill(strAux,' ',10) + '    ';
                            }else{
                                prov.tooltipCompleto += 'Valor Procedimento Divisao: Nao Calculado\n';
                                prov.rotuloCompletoHono += StringTools.fill(' ',' ',21);
                            }              
                                    
                            prov.tooltipCompleto += 'CBO Divisao: ' + _self.getHonoraryProviderCboSpec(prov).rotulo + '\n'
                                                    + 'Especialidade Divisao: ' + _self.getHonoraryProviderCboSpec(prov).rotuloEspecialid + '\n';
                            prov.rotuloCompletoHono += prov.cdUnidCdPrestadorHono + ' ';
                            
                            if(angular.isUndefined(prov.rotuloPrestDivHono) === false){
                                strAux = prov.rotuloPrestDivHono.substring(15);

                                if(strAux.length > 25){
                                    prov.rotuloCompletoHono += strAux.substring(0,22) + '... ';
                                }else{
                                    prov.rotuloCompletoHono += StringTools.fillRight(strAux,' ',26);
                                }
                            }
                        }
                    }
                }
            });
        };

        this.afterFillPackageMovements = function(package){

            if(this.validateMovementAdittion(package) == true){                        
                
                if(package.movementObject.lgAgrupador == true){
                    angular.forEach(package.packageProcedures, function(movto){
                        //seta a quantidade dos prestadores de acordo com a quantidade informada no pacote
                        angular.forEach(movto.providers,function(prest){
                            prest.qtMovimento = movto.qtMovimento * package.qtMovimento;
                        });

                        _self.fillCompleteLabelAndTooltip(movto);
                        _self.unsavedProceduresNumber++;
                        _self.document.procedimentos.unshift(movto);
                    });

                    angular.forEach(package.packageInputs, function(movto){
                        //seta a quantidade dos prestadores de acordo com a quantidade informada no pacote
                        angular.forEach(movto.providers,function(prest){
                            prest.qtMovimento = movto.qtMovimento * package.qtMovimento;
                        });

                        _self.fillCompleteLabelAndTooltip(movto);
                        _self.unsavedInputsNumber++;
                        _self.document.insumos.unshift(movto);
                    });

                    _self.selectMovementTabByPriority();
                }else{
                    _self.fillCompleteLabelAndTooltip(package);
                    _self.unsavedPackagesNumber++;
                    _self.document.pacotes.unshift(package);    
                    _self.selectMovementTab(package.tpMovimento);
                }
                _self.afterAddMovement();    
                return true;
            };
            
            return false;
        };

        this.validateMovementAdittion = function(movement) {

            if(movement.packageProcedures) {
                angular.forEach(movement.packageProcedures, function(proc){

                    if(proc.movementObject.gruProDAO.lgCooperado == true) {
                        angular.forEach(proc.providers, function(provider){

                            if(provider.preserv.lgDivisaoHonorario
                                && (angular.isUndefined(provider.cdUnidCdPrestadorHono) === true
                                    || provider.cdUnidCdPrestadorHono === '')) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'error', title: 'Prestador da divisão de honorários não informado nos movimentos. '
                                                        + 'Prestador: ' + provider.cdUnidCdPrestador + ' Procedimento: '
                                                        + proc.cdMovimento + '. Utilize a lista de itens do pacote'
                                });
                                return false;
                            }
                        });
                    }
                });
            }
            
            return true;
        };

        this.afterAddMovement = function(){
            if(_self.isSaving === true){
                _self.isSaving = false; 
            }else{
                _self.movement = {cdTipoInsumo: _self.movement.cdTipoInsumo};
                _self.selectedMovement = {};
                _self.movementReturnObject = undefined;
                
                _self.inputTypes = _self.transactionInputTypes;
                _self.addMovementFixedFilters();
                
                totvsUtilsService.focusOn('movementZoom');
            }
        };
                
        this.editMovement = function(movementToEdit, movtoIndex){
            
            if(movementToEdit.lgSispac)
            {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Pacote de intercâmbio não pode ser editado/removido'
                });
                return false;

            }
            
            if(movementToEdit.inLiberadoContas == "8")
            {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Movimento em Auditoria Externa nao pode ser modificado'
                });
                return false;

            }

            _self.doMovementModification(movementToEdit, /*movtoIndex,*/ function(){
                var movementModal = $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/movementMaintenanceModal.html',
                    backdrop: 'static',
                    controller: 'hrc.movementMaintenanceModalController as modalController',
                    windowClass: 'extra-large',
                    keyboard: false,
                    resolve: {
                        documentMaintenanceController: function () {
                            return _self;
                        },
                        movementToEdit: function(){
                            return movementToEdit;
                        },
                        movtoIndex: function(){
                            return movtoIndex;
                        }
                    }
                });
            });
        };
        
        this.doMovementModification = function(movement, /*movtoIndex,*/ callback){
            
            if(movement.tpMovimento == 'PACOTE'){
                _self.inputTypes = [{cdTipoInsumo: 0, rotulo: '0 - Pacote'}];
                _self.movement = angular.copy(movement);
                
                _self.movement.isEditMovement = true;
                
                _self.onInputTypeChange(_self.movement);
                
                _self.movementReturnObject = {formattedCodeWithType : movement.formattedCodeWithType,
                                                dtInicioVigencia      : movement.dtInicioVigencia,
                                                dtLimite              : movement.dtLimite};

                

                /*_self.onMovementSelect(true);*/
                //_self.doMovementElimination(movement, movtoIndex, true);
            }else{
                //movimento a editar
                var movtoAux = angular.copy(movement);
                
                if(movtoAux.tpMovimento == 'PROC'){
                    _self.inputTypes = [{cdTipoInsumo: 0, rotulo: '0 - Procedimento'}];
                }else{ // insumo
                    _self.inputTypes = angular.copy(_self.transactionInputTypes);
                    _self.inputTypes.splice(0,1); //remove a opcao de proc ou pacote
                }
                
                _self.movement = movtoAux;
                _self.movement.isEditMovement = true;
                movtoAux.providers = [];

                for (var i = 0;i < movement.providers.length;i++){
                    var p = angular.copy(movement.providers[i]);
                    p.detailProfessional = true;
                    p.addProfessional = false;

                    if(p.inStatus >= DOCUMENT_STATUS_ENUM.RELEASED){
                        continue;
                    }

                    movtoAux.providers.push(p);
                    //movement.providers.splice(i,1);
                    _self.processRemovedProvider(p);
                    //i--;

                    if(!p.cbosSpecialties || p.cbosSpecialties.length == 1){
                        _self.setProviderCboSpecialties(p);
                    }

                    if(p.cdUnidCdPrestadorHono > 0){
                        if(!(p.honoProvCbosSpecialties 
                            && p.honoProvCbosSpecialties.length > 1)){
                            //tem que ser outra funcao para que a referencia da variavel p
                            //nao seja alterada para cada prestador
                            _self.setDivisionProviderCbos(p);
                        }
                    }
                };

                _self.onInputTypeChange(movtoAux);
                _self.movementReturnObject = {formattedCodeWithType: movtoAux.formattedCodeWithType}; 
                //_self.onMovementSelect(true);

                if(movement.providers.length != movtoAux.providers.length){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning', 
                        title: 'Alguns prestadores não foram movidos para a área de edição de movimentos,\n\
                                pois já foram liberados e não podem ser modificados!'
                    });
                }

            }
            
            //totvsUtilsService.focusOn('movementZoom');
            
            movement.accessWay = undefined;
            movement.techniqueLabel = undefined;
            movement.percentageType = undefined;
            

            _self.movement.fatoresRedAcres = [];
            _self.setPercentageList(_self.movement, true);
        
            
            if(_self.movement.tpMovimento != 'INSU'){
                _self.loadUfs();
                _self.setTissProviderLevels();
            }
            
            if(callback){
                callback();
            }
        };
                
        this.setDivisionProviderCbos = function(p){
            var honoraryDivisionProv = {cdUnidade: p.cdUnidCdPrestadorHono.substring(0,4),
                                        cdPrestador: p.cdUnidCdPrestadorHono.substring(4)};
                                                
            _self.setProviderCboSpecialties(honoraryDivisionProv, function(){
                p.honoProvCbosSpecialties = honoraryDivisionProv.cbosSpecialties;
            }); 
        };

        this.openMovementRestrictions = function(movto, prov){

            if((_self.transaction.lgProcedimentoUnico == true
                || _self.transaction.lgTransacaoConsulta == true)
            && prov == undefined){

                if(movto.providers[0] != undefined){
                    prov = { nrProcesso: movto.providers[0].nrProcesso,
                                nrSeqDigitacao: movto.providers[0].nrSeqDigitacao}; 
                }else{
                    prov = { nrProcesso: 1,
                                nrSeqDigitacao: 1};    
                } 

                for (var i = _self.consultationMovementList.length - 1; i >= 0; i--) {
                    if(_self.consultationMovementList[i].procetrmo.cdProcedimentoCompleto == movto.cdMovimento){
                        movto.rotulo = _self.consultationMovementList[i].procetrmo.rotuloProcedimento;
                    }
                }
            }

            var movementKey = [];

            if(movto.tpMovimento === 'PACOTE') {
                angular.forEach(movto.packageInputs, function(input){
                    angular.forEach(input.providers, function(prov){
                        movementKey.push({nrProcesso: prov.nrProcesso,
                                            nrSeqDigitacao: prov. nrSeqDigitacao,
                                            cdTipoInsumo: input.cdTipoInsumo,
                                            cdMovimento: input.cdMovimento,
                                            tpMovimento: 'INSU'});
                    });                            
                });

                angular.forEach(movto.packageProcedures, function(proc){
                    angular.forEach(proc.providers, function(prov){
                        movementKey.push({nrProcesso: prov.nrProcesso,
                                            nrSeqDigitacao: prov.nrSeqDigitacao,
                                            tpMovimento: 'PROC'}); 
                    });                            
                });
            }

            var procInsuAux = {cdUnidade : _self.document.cdUnidade,
                                cdUnidadePrestadora : _self.document.cdUnidadePrestadora,
                                cdTransacao : _self.document.cdTransacao,
                                nrSerieDocOriginal : _self.document.nrSerieDocOriginal,
                                nrDocOriginal : _self.document.nrDocOriginal,
                                nrDocSistema : _self.document.nrDocSistema,
                                nrProcesso : prov.nrProcesso,
                                nrSeqDigitacao : prov.nrSeqDigitacao,
                                tpMovimento : movto.tpMovimento,
                                rotuloMovimento: movto.rotulo,
                                cdMovimento: movto.cdMovimento,
                                movementKey: movementKey};
                                
            if(movto.tpMovimento == 'INSU'){
                procInsuAux.cdTipoInsumo = movto.cdTipoInsumo;
                procInsuAux.cdInsumo     = movto.cdMovimento;
            }

            var movementRestriction = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/movementRestrictions.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.movementRestrictions.Control as controller',
                resolve: {
                    disclaimers: function(){
                        return undefined;
                    },
                    document: function(){
                        return _self.document;
                    },
                    procInsu: function(){
                        return procInsuAux;
                    },
                    maintenanceType: function(){
                        return MAINTENANCE_TYPE_ENUM.EDIT_MOVEMENT
                    },
                    action: function() {
                        //movimentos de baixa de aviso
                        //nao podem ser modificados
                        if(movto.lgBaixaAvisoVlZerado)
                            return 'DETAIL';

                        //movimentos do ressus
                        //nao podem ser modificados
                        if(movto.lgRessus)
                            return 'DETAIL';

                        return _self.action;
                    }
                }
            });

            movementRestriction.result.then(function (result) {
                
                //Seta o status do prestador
                if(movto.tpMovimento != 'PACOTE') {     

                    prov.vlGlosado = result.vlGlosado;
                    prov.inStatus = result.cdValidacao;
                }else{
                    prov.inStatus = 99;
                    for (var i = result.length - 1; i >= 0; i--) {
                        
                            angular.forEach(movto.packageProcedures, function(proc){
                                angular.forEach(proc.providers, function(provAux){
                                    if (provAux.nrProcesso     == result[i].nrProcesso
                                        && provAux.nrSeqDigitacao == result[i].nrSeqDigitacao){
                                        provAux.inStatus = result[i].inStatus;

                                        if (prov.inStatus > result[i].inStatus){
                                            prov.vlGlosado = result[i].vlGlosado;
                                            prov.inStatus  = result[i].inStatus;
                                        }

                                        return;
                                    }
                                });                            
                            });
                            
                            angular.forEach(movto.packageInputs, function(input){
                                angular.forEach(input.providers, function(provAux){
                                    if (provAux.nrProcesso     == result[i].nrProcesso
                                        && provAux.nrSeqDigitacao == result[i].nrSeqDigitacao){
                                        provAux.inStatus = result[i].inStatus;

                                        if (prov.inStatus > result[i].inStatus){
                                            prov.vlGlosado = result[i].vlGlosado;
                                            prov.inStatus  = result[i].inStatus;
                                        }

                                        return;
                                    }
                                });
                            });
                    }
                }
                
                _self.invalidateDocument(_self.document);
            });         
        };
        
        this.removeMovement = function(movement, movtoIndex){
            var cdMovimentoAux = movement.cdMovimento;
            
            
            if(movement.lgSispac)
            {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Pacote de intercâmbio não pode ser editado/removido'
                });
                return false;

            }

            if (movement.tpMovimento == 'INSU') {
                cdMovimentoAux = StringTools.fill(movement.cdTipoInsumo,'0',2) + cdMovimentoAux;
            }
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você realmente deseja remover o movimento ' + cdMovimentoAux
                    + ' e todos seus prestadores?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    _self.doMovementElimination(movement, movtoIndex);
                }
            }); 
        };
                
        this.doMovementElimination = function(movement, movtoIndex, isFromEdit){
            
            //coloca na lista de prestadores removidos
            //todos os prestadores do movto sendo excluido
            for(var i = 0; i < movement.providers.length; i++){
                var prov = movement.providers[i];
                
                if(prov.inStatus >= DOCUMENT_STATUS_ENUM.RELEASED){
                    continue;
                }
                
                movement.providers.splice(i,1);
                //se veio do editar nao coloca na temp de prestador removidos 
                if(isFromEdit != true){
                    if(movement.tpMovimento == 'PACOTE'){

                        if(movement.packageInputs != undefined
                        && movement.packageInputs.length > 0){
                            angular.forEach(movement.packageInputs, function(input){
                                _self.processRemovedProvider(input.providers.splice(i, 1)[0]);
                            });
                        }

                        if(movement.packageProcedures != undefined
                        && movement.packageProcedures.length > 0){
                            angular.forEach(movement.packageProcedures, function(proc){
                                _self.processRemovedProvider(proc.providers.splice(i, 1)[0]);
                            });
                        }
                    }else{
                        _self.processRemovedProvider(prov);
                    }
                }
                i--;
            };
            
            if(movement.providers.length > 0){
                return;
            }

            var lengthAux = 0;
            switch (movement.tpMovimento){
                case 'PROC':
                    if(_self.unsavedProceduresNumber > movtoIndex){
                        _self.unsavedProceduresNumber--;
                    }
                    
                    _self.document.procedimentos.splice(movtoIndex,1);
                    lengthAux = _self.document.procedimentos.length;
                    break;
                case 'INSU':
                    if(_self.unsavedInputsNumber > movtoIndex){
                        _self.unsavedInputsNumber--;
                    }
                    
                    _self.document.insumos.splice(movtoIndex,1);
                    lengthAux = _self.document.insumos.length;
                    break;
                case 'PACOTE':
                    if(_self.unsavedPackagesNumber > movtoIndex){
                        _self.unsavedPackagesNumber--;
                    }
                    
                    _self.document.pacotes.splice(movtoIndex,1);
                    lengthAux = _self.document.pacotes.length;
                    break;    
            }

            if(lengthAux == 0){
                _self.selectMovementTabByPriority();
            }
        };
        
        this.cleanMovement = function(){

            if(_self.transaction.lgProcedimentoUnico == true
            || _self.transaction.lgTransacaoConsulta == true){
                /* como o setMovementLists nao sera chamado em
                    * setAccessWaysList e setTissTechniques (chamadas no fim desta procedure)
                    * é feita a logica abaixo que equivale a duas chamadas da proc setMovementLists
                    */
                movementSemaphore--;
                _self.setMovementLists();
                return;
            }

            if(angular.isUndefined(_self.movement.cdTipoInsumo) == true){
                _self.movement = {cdTipoInsumo: 0};
            }else{
                _self.movement = {cdTipoInsumo: _self.movement.cdTipoInsumo};
            }
            _self.selectedMovement = {};
            _self.movementReturnObject = undefined;
            
            _self.initializeMovements();
            
            if(isSettingData === true){
                _self.setAccessWaysList();
                _self.setTissTechniques();
                
            }
        };
                
        this.getAccessWayLabel = function(movement){
            if(movement.cdViaAcesso > 0){
                angular.forEach(_self.accessWays, function(accessWay){
                    if(accessWay.cdViaAcesso == movement.cdViaAcesso){
                        movement.accessWay = accessWay.rotulo;
                    }
                });    
            }else{
                movement.accessWay = 'Não Informada';
            }
            
            return movement.accessWay;
        };
        
        this.getTechniqueLabel = function(movement){
            if(movement.tpTecUtil > 0){
                angular.forEach(_self.tissTechniques, function(tech){
                    if(tech.cdnTec == movement.tpTecUtil){
                        movement.techniqueLabel = tech.rotulo;
                    }
                });
            }else{
                movement.techniqueLabel = 'Não Informada';
            }
            
            return movement.techniqueLabel;
        };
        
        this.getPercentageTypeLabel = function(movement){
            if(movement.cdTipoPercentual > 0){
                movement.percentageType = movement.cdTipoPercentual;
                
                angular.forEach(movement.fatoresRedAcres, function(percent){
                    if(percent.cdTipoPercentual === movement.cdTipoPercentual){
                        movement.percentageType = percent.rotuloTipPerc;
                    }
                });
            }else{
                movement.percentageType = 'Não Informado';
            }
            
            return movement.percentageType;
        };
                
        /* Função responsavel por sincronizar o carregamento da tela no detalhe/edição
            * atraves do movementSemaphore, onde cada chamada ao progress durante o carregamento 
            * incrementa o semaforo, e ao retornar chama esta funcao.
            * Nesta funcao é decrementado o semaforo e caso seu valor se torne 0
            * significa que todos os dados de banco foram carregados
            */
        this.setMovementLists = function(){
            movementSemaphore--;
            if(movementSemaphore > 0){
                return;
            }

            movementSemaphore = 3;
            
            isSettingData     = false;
            
            if(_self.transaction.lgProcedimentoUnico == true
            || _self.transaction.lgTransacaoConsulta == true){
                return;
            }
            
            _self.isMovementsVisible = true;
            
            _self.document.lgTemProcedimento = editDocument.lgTemProcedimento;
            _self.document.lgTemInsumo       = editDocument.lgTemInsumo;
            _self.document.lgTemPacote       = editDocument.lgTemPacote;
            
            _self.document.procedimentos = editDocument.procedimentos;
            _self.document.insumos     = editDocument.insumos;
            _self.document.pacotes   = editDocument.pacotes;
            
            angular.forEach(_self.document.pacotes, function(pack){
                _self.fillCompleteLabelAndTooltip(pack);
            });
            
            $timeout(function (){
                _self.setMovementVisualization(_self.config.movementDetailLevel);
            },100);

            _self.selectMovementTabByPriority();
        };
        
        this.addMovementProvider = function(calledFromScreen, cdnNivTissPar){                    
            if(angular.isUndefined(_self.movement.providers) === true){
                _self.movement.providers = [];
            }
            
            if(_self.movement.providers.length == 0
            && _self.transaction.lgProcedimentoUnico == false){
                var provAux = {cdUnidCdPrestador: _self.document.cdUnidCdPrestPrinc,
                                        cdnNivTiss: _self.tissProviderLevels[0].cdnNivTiss,
                                    oldCdnNivTiss: _self.tissProviderLevels[0].cdnNivTiss};
                        
                _self.movement.providers.push(provAux);
                _self.onMovementProviderSelect(provAux,0);
            }else{
                if(cdnNivTissPar){
                    _self.movement.providers.push({cdnNivTiss: cdnNivTissPar,
                                                oldCdnNivTiss: cdnNivTissPar});
                }else{
                    _self.movement.providers.push({cdnNivTiss: _self.tissProviderLevels[0].cdnNivTiss,
                                                oldCdnNivTiss: _self.tissProviderLevels[0].cdnNivTiss});
                }
            }
            
            //se foi chamado pelo click do botao da tela
            //seta o foco no prestador adicionado
            if(calledFromScreen == true){
                $timeout(function(){
                    //tem que colocar o inteiro em uma variavel
                    //senao a concatenacao com a string nao funciona
                    var indAux = _self.movement.providers.length - 1;
                    totvsUtilsService.focusOn('movementProvider' + indAux);
                });
            }
            

            if(_self.movement.tpMovimento == "PACOTE"){
                if(_self.movement.packageInputs != undefined
                || _self.movement.packageInputs != null){
                    for (var i = 0; i < _self.movement.packageInputs.length; i++) {
                        //adiciona o prestador no final da lista
                        _self.movement.packageInputs[i].providers.push({});
                    }                            
                }

                if(_self.movement.packageProcedures != undefined
                || _self.movement.packageProcedures != null){
                    //adiciona o prestador no final da lista
                    for (var i = 0; i < _self.movement.packageProcedures.length; i++) {
                        _self.movement.packageProcedures[i].providers.push({});
                    }
                }                       
            }
            
        };    
                
        this.onInputTypeChange = function(movement){
            delete _self.movementFixedFilters['cdTipoInsumo'];
            if(_self.movement.cdTipoInsumo > 0){
                _self.movementFixedFilters['cdTipoInsumo'] = _self.movement.cdTipoInsumo;
            }
            
            _self.addMovementFixedFilters(movement);
        };
        
        this.onFilterInputTypeChange = function(){
            delete _self.movementFilterFixedFilters['cdTipoInsumo'];
            if(_self.movementFilters.cdTipoInsumo > 0){
                _self.movementFilterFixedFilters['cdTipoInsumo'] = _self.movementFilters.cdTipoInsumo;
            }
            
            _self.addMovementFilterFixedFilters();
        };
        
        this.onMovementSelect = function(){
            
            var setDefaultMovData = true;
            if(_self.movement.isEditMovement == true){
                setDefaultMovData = false;
                
                // se a descricao o insumo generico foi setada pelo sistema
                // limpa a descricao de insumo generico
                if(_self.selectedMovement.tpMovimento == 'INSU'
                && _self.selectedMovement.movementObject.lgGenericoPTU == true
                && _self.movement.dsInsumoGenerico == _self.selectedMovement.movementObject.dsInsumo){
                    _self.movement.dsInsumoGenerico = '';
                }
                
            }
            
            //testa se limpou o movimento
            if(angular.isUndefined(_self.movementReturnObject) == true
            || _self.movementReturnObject.formattedCodeWithType == ''){
                _self.selectedMovement = {};
                _self.movement.fatoresRedAcres = [];
                _self.fatoresRedAcres = [];
                _self.movementReturnObject = undefined;
                return;
            }
            
            _self.movement.cdMovimento = _self.movementReturnObject.formattedCodeWithType;
            
            var fixedFilters = dtsUtils.mountDisclaimers(_self.movementFixedFilters);

            fixedFilters.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'IsGeneric'});
            fixedFilters.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'GruPro'});
            
            if(_self.movementReturnObject.tpMovimento == 'PACOTE'){
                fixedFilters.push({property: 'dtInicioVigencia', value: _self.movementReturnObject.dtInicioVigencia});
                fixedFilters.push({property: 'dtLimite'        , value: _self.movementReturnObject.dtLimite});
            }

            movementFactory.getMovementByKey(_self.movement.cdMovimento, fixedFilters,
                function (val) {
                    if(_self.selectedMovement.cdMovimento 
                    && _self.selectedMovement.cdMovimento != val.cdMovimento
                    && setDefaultMovData == true){
                        _self.movement.packageProcedures = undefined;
                        _self.movement.packageInputs = undefined;
                        _self.movement.vlPagamento = 0; 
                        _self.movement.vlCobranca = 0;
                    }

                    _self.selectedMovement = val;
                        
                    if (_self.movement.isEditMovement == false){                            
                        _self.movement.packageProcedures = undefined;
                        _self.movement.packageInputs = undefined;
                    }

                    _self.movement.movementObject = _self.selectedMovement.movementObject;
                    _self.movement.tpMovimento    = _self.selectedMovement.tpMovimento;
                    _self.movement.dsMovimento    = _self.selectedMovement.dsMovimento;
                    _self.movement.rotulo         = _self.selectedMovement.rotulo;
             
                    _self.afterMovementSelect(setDefaultMovData);
                });
        };
                
        /* 
            * @param setDefaultMovData - true para que os dados default sejam setados
            */
        this.afterMovementSelect = function(setDefaultMovData){
            //movimento invalido
            if(angular.isUndefined(_self.selectedMovement.cdMovimento) === true){
                return;
            }
            //se deve setar dados default
            if(setDefaultMovData == true){       
                var dtEmissaoAux = _self.document.dtEmissao ? _self.document.dtEmissao : Date.today();

                if(_self.transaction.lgProcedimentoUnico == false
                && _self.transaction.lgTransacaoConsulta == false){
                    if(angular.isUndefined(_self.movement.providers) === true
                    || _self.movement.providers.length == 0){
                        _self.addMovementProvider(false);    
                    }
                    
                    if(_self.selectedMovement.tpMovimento == 'INSU'){
                        if(_self.movement.movementObject.lgGenericoPTU == true){
                            _self.movement.dsInsumoGenerico = _self.movement.movementObject.dsInsumo;
                        }

                        _self.movement.cdAnvisa         = _self.movement.movementObject.cdAnvisa;
                        _self.movement.nmFornecedor     = _self.movement.movementObject.nmFornecedor;
                        _self.movement.desReferMaterFabrican = _self.movement.movementObject.desReferMaterFabrican;
                        _self.movement.nrNotaFornecedor = _self.movement.movementObject.nrNotaFornecedor;
                        _self.movement.dtRealizacao     = dtEmissaoAux;
                        _self.onRealizationDateChange();
                    }else{
                        _self.setAccessWaysList();
                        _self.setTissTechniques();
                        
                        _self.setPercentageList(_self.movement);
                        _self.setTissProviderLevels();

                        if(_self.selectedMovement.tpMovimento == 'PROC'){
                            _self.movement.cdViaAcesso  = _self.selectedMovement.movementObject.cdViaAcesso;
                            _self.movement.dtRealizacao = dtEmissaoAux;
                            _self.onRealizationDateChange();
                        }else{ //PACOTE
                            //deixa somente 1 prestador na lista
                            if(_self.movement.providers.length > 0){
                                _self.movement.providers.splice(1,_self.movement.providers.length - 1);
                            }
                            _self.movement.cdViaAcesso  = 0;
                            _self.movement.dtRealizacao = Math.min(dtEmissaoAux, _self.movement.movementObject.dtLimite);
                            _self.onRealizationDateChange();
                        }
                    } 
                }
                _self.movement.hrRealizacao = new Date().toString('HH:mm');
                _self.onRealizationTimeChange();
            }else{ //se NAO deve setar dados default    
                //converte a tecnica pra int pois no banco é um char
                if(_self.movement.tpTecUtil){
                    _self.movement.tpTecUtil = parseInt(_self.movement.tpTecUtil);
                }
                
                //caso seja insumo generico e nao tem descricao,
                //seta com a descricao do insumo
                if(_self.selectedMovement.tpMovimento == 'INSU'
                && _self.movement.movementObject.lgGenericoPTU == true
                && _self.movement.dsInsumoGenerico == ''){
                    _self.movement.dsInsumoGenerico = _self.movement.movementObject.dsInsumo;
                }
                
                if(_self.transaction.lgProcedimentoUnico == true
                || _self.transaction.lgTransacaoConsulta == true){
                    _self.isMovementEnabled = false;
                    isSettingData = false;
                }
            }
            
            _self.recalculateMovementValues(null, 'cdMovimento');
        };

        this.onMainProviderSelect = function(){   
            if(!_self.document.cdUnidCdPrestPrinc){
                _self.mainProvider = {};
                _self.invoice = {};
                _self.document.aaFaturaCdSerieNfCodFaturAp = undefined;
                return;
            }

            if(isSettingData == true){
                movementSemaphore++;
            }

            providerFactory.getProviderByKey(_self.document.cdUnidCdPrestPrinc, [],
                function (val) {
                    _self.mainProvider = val;
                    _self.document.cdUnidadePrincipal    = _self.mainProvider.cdUnidade;
                    _self.document.cdPrestadorPrincipal  = _self.mainProvider.cdPrestador;
                    _self.afterMainProviderSelect();
                });
            
        };
                
        this.afterMainProviderSelect = function(){
            if(angular.isUndefined(_self.mainProvider.cdPrestador) === true){
                return;
            }

            if(_self.transaction.lgControleFatura == true){
                _self.invoiceFixedFilters['cdUnidadePrestadora']  = _self.document.cdUnidCdPrestPrinc.substring(0, 4);
                _self.invoiceFixedFilters['cdPrestador']  = _self.document.cdUnidCdPrestPrinc.substring(4);
                _self.invoice = {};

                if(isSettingData == true){
                    if(editDocument.urlFatura.length > 0){
                        _self.invoiceFixedFilters['codIndicador']  = 1;
                        _self.document.aaFaturaCdSerieNfCodFaturAp = editDocument.urlFatura;
                        _self.invoice.nrFatura = 0;
                    }
                }else{
                    
                    _self.document.aaFaturaCdSerieNfCodFaturAp = undefined;
                    _self.invoiceFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT]  = "groupInvoiceByNumber";
                }
            }

            if(isSettingData == true){
                _self.setMovementLists();
            }

            if(_self.document.cdUnidCdPrestSolic === ''
            && angular.isUndefined(_self.guide.nrGuiaAtendimento) === true){
                if(_self.transaction.lgPrestadorUnico === true){
                    _self.document.cdUnidCdPrestSolic = _self.document.cdUnidCdPrestPrinc;
                    _self.onSolicProviderSelect();
                }
            };

            if(_self.transaction.lgGuiaHonorarios == true
            && angular.isUndefined(_self.document.cdUnidCdPrestPrinc) === false
            && _self.document.cdUnidCdPrestExec == undefined){
                
                _self.document.cdUnidCdPrestExec = _self.document.cdUnidCdPrestPrinc; 
                _self.onExecProviderSelect();
            }

            _self.cleanMovement();
        };

        this.onSolicProviderSelect = function(){    
            if(!_self.document.cdUnidCdPrestSolic){
                _self.solicProvider = {};
                _self.solicProvider.especialidades = [];
                _self.solicProvider.cbosSpecialties = [];
                return;
            }

            providerFactory.getProviderByKey(_self.document.cdUnidCdPrestSolic, [],
                function (val) {
                    _self.solicProvider = val;
                    _self.document.cdUnidadeSolicitante   = _self.solicProvider.cdUnidade;
                    _self.document.cdPrestadorSolicitante = _self.solicProvider.cdPrestador;
            
                    _self.afterSolicProviderSelect();
                });
        
        };
                
        this.afterSolicProviderSelect = function(){
            if(angular.isUndefined(_self.solicProvider.cdPrestador) === true){
                _self.solicProvider.especialidades = [];
                _self.solicProvider.cbosSpecialties = [];
                return;
            }
            
            if(isSettingData == true){
                _self.setProviderCboSpecialties(_self.solicProvider, function(){
                    //testa se o prestador nao tem cbo informado
                    if(editDocument.cdCboSolicitante.trim().length == 0
                    && editDocument.cdCboEspecialid.split("@@")[0].length == 0){
                        for(var i = 0; i < _self.solicProvider.especialidades.length; i++){
                            var spec = _self.solicProvider.especialidades[i];
                            if(spec.cdEspecialid == editDocument.cdEspecialid){
                                var cboSpec =  {
                                                cdCboS : '',
                                        cdEspecialid : spec.cdEspecialid,
                                    cdCboEspecialid : '@@' + spec.cdEspecialid,
                                                rotulo : 'CBO Nao Informado',
                                    rotuloEspecialid : spec.rotulo
                                };
                                
                                cboSpec.dsCboEspecialid = cboSpec.rotulo + '   ESP: ' + cboSpec.rotuloEspecialid;
                                _self.solicProvider.cbosSpecialties.unshift(cboSpec);
                                break;
                            }
                        };
                    }
                    
                    _self.document.cdCboEspecialid = editDocument.cdCboEspecialid;

                    var contemEspec = false;

                    if (editDocument.cdCboEspecialid.split("@@")[0].length > 0){
                        for(var i = 0; i < _self.solicProvider.especialidades.length; i++){
                            var spec = _self.solicProvider.especialidades[i];
                            if(spec.cdEspecialid == editDocument.cdEspecialid){
                                for(var j = 0; j < spec.cbos.length; j++)
                                {
                                    var cboS = spec.cbos[j].cdCboS;
                                        if (cboS == editDocument.cdCboEspecialid.split("@@")[0]){
                                        contemEspec = true;
                                        break;
                                    }
                                }
                                if (contemEspec)
                                    break;
                            }
                        }
                    }

                    var messageAux = "";

                    if ((editDocument.cdCboEspecialid.split("@@")[0].length > 0
                        && !contemEspec)
                    || (editDocument.cdCboEspecialid.split("@@")[0].length == 0)){
                        messageAux = 'Associativa CBO X Especialidade não cadastrada ou fora do período de vigência. ';

                        if (editDocument.cdCboSolicitante.length > 0){
                            messageAux += 'CBO: ' + editDocument.cdCboSolicitante;
                        }

                        messageAux += ' Especialidade: ' + editDocument.cdEspecialid;

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'warning', 
                            title: messageAux
                        });
                    }
                    
                });
            }else{
                if((angular.isUndefined(_self.mainProvider.cdPrestador) === true
                    && angular.isUndefined(_self.guide.nrGuiaAtendimento) === true)
                || _self.transaction.lgTransacaoConsulta == true){
                    _self.document.cdUnidCdPrestPrinc = _self.document.cdUnidCdPrestSolic;
                    _self.onMainProviderSelect();
                }

                _self.setProviderCboSpecialties(_self.solicProvider, function(defaultValue){
                    _self.document.cdCboEspecialid = defaultValue;
                });
            }

            //se ja carregou as ufs, so seta os valores default, senao carrega antes
            _self.loadUfs(function(){
                _self.setProfessionalDefaultInfo();
            });
        };
        
        this.setProfessionalDefaultInfo = function(){

            if(isSettingData === true){                        
                _self.document.cdConselhoProfSolic = editDocument.cdConselhoProfSolic;
                _self.document.nrConselhoProfSolic = editDocument.nrConselhoProfSolic;
                _self.document.ufConselhoProfSolic = editDocument.ufConselhoProfSolic;
                _self.document.nmProfSol           = editDocument.nmProfSol;
                _self.setMovementLists();
                return;
            }
            
            if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === false
            && (_self.solicProvider.cdUnidade   == _self.guide.cdUnidadeSolicitante
                && _self.solicProvider.cdPrestador == _self.guide.cdPrestadorSolicitante)){
                _self.document.nmProfSol           = _self.guide.nmProfSol;
                _self.document.cdConselhoProfSolic = _self.guide.cdConselhoProfSolic;
                _self.document.nrConselhoProfSolic = _self.guide.nrConselhoProfSolic;
                _self.document.ufConselhoProfSolic = _self.guide.ufConselhoProfSolic;

                if(_self.guide.cdConselhoProfSolic.trim() === ""
                || angular.isUndefined(_self.guide.cdConselhoProfSolic)
                || _self.guide.cdConselhoProfSolic.trim() === ""
                || angular.isUndefined(_self.guide.cdConselhoProfSolic)
                || _self.guide.ufConselhoProfSolic.trim() === ""
                || angular.isUndefined(_self.guide.ufConselhoProfSolic)){
                    this.setProfessionalDefaultInfoBySolicProvider();
                }
            }else{
                this.setProfessionalDefaultInfoBySolicProvider();
            }
        };

        this.setProfessionalDefaultInfoBySolicProvider = function(){
            //String teste = _self.solicProvider.cdUfConselho.toString().trim()
            if(_self.solicProvider.lgDiretorTecnicoSolic === true){
                _self.document.cdConselhoProfSolic = _self.solicProvider.cdConselhoDiretTecnico;
                //_self.document.nrConselhoProfSolic = _self.solicProvider.nrConselhoDiretTecnicoAsInt;
                _self.document.nrConselhoProfSolic = _self.solicProvider.nrConselhoDiretTecnico;  
                _self.document.ufConselhoProfSolic = _self.solicProvider.ufConselhoDiretTecnico;
                _self.document.nmProfSol = _self.solicProvider.nmDiretorTecnico;
            }else{
                _self.document.cdConselhoProfSolic = _self.solicProvider.cdConselho;
                _self.document.nrConselhoProfSolic = _self.solicProvider.nrRegistro;
                _self.document.ufConselhoProfSolic = "";
                _self.document.ufConselhoProfSolic = _self.solicProvider.cdUfConselho.toString().trim();
                _self.document.nmProfSol           = '';
            }
        }
        
        this.onMedicalSpecialtySelect  = function(){
            angular.forEach(_self.solicProvider.especialidades, function(spec){
                if(spec.cdVinculo === _self.document.cdVinculoSolicitante){
                    _self.cbos = spec.cbos;
                }
            }); 
        };
        
        this.onCidSelect = function(cidIndex){
        
            varIndex = cidIndex - 1;
            if(varIndex === 0){
                varIndex = '';
            }
        
            hcgGlobalFactory.getCidByKey(_self.document['cdCid' + varIndex], [],
            
            function (val) {
                _self['cid' + cidIndex] = val;
                _self.verifiyFilledCids();
            });
        };
                
        this.verifiyFilledCids = function(){
            for (var i = 4; i > 0; i--) {
                if(angular.isUndefined(_self['cid' + i].cdCid) === false){
                    _self.lastCidFilled = i;
                    break;
                }
            }   
        };
        
        this.onInternmentTypeChange = function(){
            _self.document.cdObtMul = 4;
        };

        this.getRealizationDate = function(){
            if(_self.transaction.lgDataRealizacaoUnica === true
            || _self.transaction.lgProcedimentoUnico == true
            || _self.transaction.lgTransacaoConsulta == true)
                return _self.document.dtRealizacao;
            return _self.movement.dtRealizacao;
        };
        
        this.onRealizationDateChange = function(){
            if(angular.isUndefined(_self.getRealizationDate())){
                return;
            }

            if(_self.transaction.lgProcedimentoUnico === false){
                _self.setPercentageList(_self.movement);
                _self.setTissProviderLevels();
                
                if(_self.transaction.lgDataRealizacaoUnica === false){
                    var provider = _self.movement.providers[0];
                    _self.setProviderCboSpecialties(provider,function(defaultValue){
                        provider.cdCboEspecialid = defaultValue;
                    });
                }else{
                    //Sincroniza data e hora unica em todos movimentos
                    _self.syncRealizationInfoOnMovements();
                }
                
                _self.recalculateMovementValues(null, 'dtRealizacao');
            }
            
            if ($scope.cpcAtiva != undefined && $scope.cpcAtiva == true) {
                _self.cpcOnRealizationDateChange($scope.controller);
            }
        };
                
        this.onRealizationTimeChange = function(){ 
            if(angular.isUndefined(_self.movement.hrRealizacaoFim) === true
            || _self.movement.tpMovimento == 'PACOTE'){
                _self.movement.hrRealizacaoFim = _self.movement.hrRealizacao;
            }

            if(_self.transaction.lgProcedimentoUnico == false                    
            && (_self.transaction.lgDataRealizacaoUnica == true
                || _self.transaction.lgTransacaoConsulta == true)){
                //Sincroniza data e hora unica em todos movimentos
                _self.syncRealizationInfoOnMovements();
            }

            _self.recalculateMovementValues(null, 'hrRealizacao');
        };
        
        this.onEmissionDateChange = function(){
            if(angular.isUndefined(_self.document.dtEmissao) === true
            || _self.document.dtEmissao <= 0){
                return;
            }

            //internação e atendimento
            if(_self.transaction.lgTransacaoOdontologica === false){
                if(_self.transaction.lgDataRealizacaoUnica === true){

                    if(oldEmissionDate == _self.document.dtRealizacao
                    || _self.document.dtRealizacao == undefined){
                        _self.document.dtRealizacao = _self.document.dtEmissao; 
                        _self.onRealizationDateChange();       
                    }

                    oldEmissionDate = _self.document.dtEmissao;
                }
                
                // soh atendimento
                if(_self.transaction.lgDadosInternacao === false){
                    if(angular.isUndefined(_self.guide.nrGuiaAtendimento) == false
                    && _self.transaction.lgDadosGuiaAutomatico == false){
                        _self.loadConsultProcs();
                    }
                    
                    if(_self.transaction.lgTransacaoConsulta == true){
                        _self.setTissConsultationTypeList();
                    }else{
                        //Preenche valores de Tipos de Atendimento
                        if(angular.isUndefined(_self.tissAttendanceTypes) === true
                        || _self.tissAttendanceTypes.length === 0){
                            if(isSettingData === true){
                                movementSemaphore++;
                            }
                            hacGlobalFactory.getTissAttendanceTypeByFilter('', 0, 0, false,
                                [{property: 'datInicVigenc'  , value: _self.document.dtEmissao, operator: '<='},
                                    {property: 'datFimVigenc'   , value: _self.document.dtEmissao, operator: '>='}],
                                function (result) {
                                    _self.tissAttendanceTypes = result;
                                    _self.tissAttendanceTypes.splice(0,0,
                                        {cdnTipAtendim: 0,
                                            desTipAtendim: 'Não Informado',
                                            rotulo: '0 - Não Informado'});
                                    if(isSettingData === true){
                                        _self.document.tpAtend = editDocument.tpAtend;
                                        _self.onAttendanceTypeChange();
                                        _self.setMovementLists();
                                    }else{
                                        if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === false){
                                            _self.document.tpAtend = _self.guide.tpAtend;
                                        }else{
                                            _self.document.tpAtend = _self.tissAttendanceTypes[0].cdnTipAtendim;
                                        }
                                    }

                                }); 
                        }
                    }
                }
                
                //Preenche valores de Indicação de Acidente
                if(angular.isUndefined(_self.tissAccidentIndications) === true
                || _self.tissAccidentIndications.length === 0){
                    if(isSettingData === true){
                        movementSemaphore++;
                    }
                    hacGlobalFactory.getTissAccidentIndicationByFilter('', 0, 0, false,
                        [{property: 'datInicVigenc'  , value: _self.document.dtEmissao, operator: '<='},
                            {property: 'datFimVigenc'   , value: _self.document.dtEmissao, operator: '>='}],
                        function (result) {
                            _self.tissAccidentIndications = result;
                            
                            if(isSettingData === true){
                                _self.document.inAcidente = editDocument.inAcidente;
                                _self.setMovementLists();
                            }else{
                                if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === false){
                                    _self.document.inAcidente = _self.guide.inAcidente;
                                }else{
                                    _self.document.inAcidente = 9; //9 - Nao Acidente
                                }
                            }
                        });
                }
            }   
            
            if(_self.transaction.lgDadosInternacao === true
            && _self.transaction.lgGuiaHonorarios === false){
            
                //Preenche valores de Tipo de Faturamento
                if(angular.isUndefined(_self.tissBillingTypes) === true
                || _self.tissBillingTypes.length === 0){
                    if(isSettingData === true){
                        movementSemaphore++;
                    }
                    hacGlobalFactory.getTissBillingTypeByFilter('', 0, 0, false,
                        [{property: 'datInicVigenc'  , value: _self.document.dtEmissao, operator: '<='},
                            {property: 'datFimVigenc'   , value: _self.document.dtEmissao, operator: '>='}],
                        function (result) {
                            _self.tissBillingTypes = result;
                            if(isSettingData === true){
                                _self.document.cdFaturamento = parseInt(editDocument.cdFaturamento);
                                _self.setMovementLists();
                            }else{
                                if(_self.tissBillingTypes.length > 0){
                                        //default (ultimo item da lista)
                                    _self.document.cdFaturamento = _self.tissBillingTypes[_self.tissBillingTypes.length - 1].cdnTipFaturam;
                                }
                            }
                        });
                }
                
                //Preenche valores de Tipo de Internação
                if(angular.isUndefined(_self.tissInternmentTypes) === true
                || _self.tissInternmentTypes.length === 0){
                    if(isSettingData === true){
                        movementSemaphore++;
                    }
                    hacGlobalFactory.getTissInternmentTypeByFilter('', 0, 0, false,
                        [{property: 'datInicVigenc'  , value: _self.document.dtEmissao, operator: '<='},
                            {property: 'datFimVigenc'   , value: _self.document.dtEmissao, operator: '>='}],
                        function (result) {
                            _self.tissInternmentTypes = result;
                            
                            if(isSettingData === true){
                                _self.document.tpInter = editDocument.tpInter;
                                _self.setMovementLists();
                            }else{
                                if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === false){
                                    _self.document.tpInter = _self.guide.tpInter;
                                }else{
                                    _self.document.tpInter = 1; /* 1 - CLINICA */

                                    hrcGlobalFactory.getNoteClassVsTransactionByFilter('', 0, 0, false,
                                        [{property: 'cdTransacao', value: _self.transaction.cdTransacao}],
                                        function (result) {
                                            lgSetouDefault = false;
                                            for (var i = 0; i < result.length; i++) {
                                                assotrcl = result[i];
                                                if(assotrcl.inClasseNota === 4
                                                || assotrcl.inClasseNota === 5
                                                || assotrcl.inClasseNota === 6
                                                || assotrcl.inClasseNota === 11
                                                || assotrcl.inClasseNota === 12){
                                                    lgSetouDefault = true;
                                                    _self.setDefaultInternment(assotrcl.inClasseNota);
                                                    break;
                                                }
                                            };

                                            if(lgSetouDefault === false
                                            && result.length > 0){
                                                _self.setDefaultInternment(result[0].inClasseNota);
                                            };
                                        });        
                                }
                            }
                        });
                }
                
                //Preenche valores de Regime de Internação
                if(angular.isUndefined(_self.tissInternmentRegimes) === true
                || _self.tissInternmentRegimes.length === 0){
                    if(isSettingData === true){
                        movementSemaphore++;
                    }
                    hacGlobalFactory.getTissInternmentRegimeByFilter('', 0, 0, false,
                        [{property: 'datInicVigenc'  , value: _self.document.dtEmissao, operator: '<='},
                            {property: 'datFimVigenc'   , value: _self.document.dtEmissao, operator: '>='}],
                        function (result) {
                            _self.tissInternmentRegimes = result;
                            
                            if(isSettingData === true){
                                _self.document.tpRegimInter = editDocument.tpRegimInter;
                                _self.setMovementLists();
                            }else{
                                if(_self.tissInternmentRegimes.length > 0){
                                    _self.document.tpRegimInter = _self.tissInternmentRegimes[0].cdnMotivo;
                                }
                            }
                        });
                }
            }

            if(_self.transaction.lgTransacaoConsulta == false){
                _self.setPercentageList(_self.movement);
                _self.setTissProviderLevels();
                
                if(isSettingData === true){
                    _self.document.crSolicitacao = editDocument.crSolicitacao;

                    if(_self.transaction.lgGuiaHonorarios === true){
                        _self.document.dtAlta       = editDocument.dtAlta;
                        _self.document.dtInternacao = editDocument.dtInternacao;
                    }

                    if(_self.transaction.lgDadosInternacao === true){
                        _self.document.dtInternacao = editDocument.dtInternacao;
                        _self.document.hrInternacao = editDocument.hrInternacao;
                        _self.document.dtAlta       = editDocument.dtAlta;
                        _self.document.hrAlta       = editDocument.hrAlta;
                        _self.document.cdMotivoAlta = editDocument.cdMotivoAlta;
                        _self.onLeaveReasonSelect();

                        _self.document.nrDeclaracaoObito = editDocument.nrDeclaracaoObito;

                        _self.document.qtNascVivosTermo  = editDocument.qtNascVivosTermo;
                        _self.document.nmDeclNascViv     = editDocument.nmDeclNascViv;
                        _self.document.nmDeclNascViv2    = editDocument.nmDeclNascViv2;
                        _self.document.nmDeclNascViv3    = editDocument.nmDeclNascViv3;
                        _self.document.nmDeclNascViv4    = editDocument.nmDeclNascViv4;
                        _self.document.nmDeclNascViv5    = editDocument.nmDeclNascViv5;

                        _self.document.cdCidObito        = editDocument.cdCidObito;
                        _self.document.qtNascMortos      = editDocument.qtNascMortos;
                        _self.document.cdCidObito1       = editDocument.cdCidObito1;
                        _self.document.cdCidObito2       = editDocument.cdCidObito2;
                        _self.document.cdCidObito3       = editDocument.cdCidObito3;
                        _self.document.cdCidObito4       = editDocument.cdCidObito4;
                        _self.document.cdCidObito5       = editDocument.cdCidObito5;

                        _self.document.nrDeclaracaoObito1 = editDocument.nrDeclaracaoObito1;
                        _self.document.nrDeclaracaoObito2 = editDocument.nrDeclaracaoObito2;
                        _self.document.nrDeclaracaoObito3 = editDocument.nrDeclaracaoObito3;
                        _self.document.nrDeclaracaoObito4 = editDocument.nrDeclaracaoObito4;
                        _self.document.nrDeclaracaoObito5 = editDocument.nrDeclaracaoObito5;

                        _self.document.logDeclaObitRn     = editDocument.logDeclaObitRn;
                        
                        _self.document.nmMedicoAuditor      = editDocument.nmMedicoAuditor;
                        _self.document.cdCrmMedicoAuditor   = editDocument.cdCrmMedicoAuditor;
                        
                        _self.document.nmEnfermAuditor      = editDocument.nmEnfermAuditor;
                        _self.document.cdCorenEnfermAuditor = editDocument.cdCorenEnfermAuditor;
                        
                        _self.loadUfs(function(){
                            _self.document.cdUfEnfermAuditor    = editDocument.cdUfEnfermAuditor;
                            _self.document.cdUfMedicoAuditor    = editDocument.cdUfMedicoAuditor;
                        });
                        
                    }else{
                        _self.document.dsIndClinica       = editDocument.dsIndClinica;
                    }
                    
                    if(_self.transaction.lgTransacaoOdontologica === false){
                        _self.document.cdnMotivEncerra = editDocument.cdnMotivEncerra;
                    }
                    
                }
            }
            
            if(isSettingData === true){
                if(_self.transaction.lgDataRealizacaoUnica == true
                || _self.transaction.lgProcedimentoUnico == true
                || _self.transaction.lgTransacaoConsulta == true){
                    _self.document.dtRealizacao     = editDocument.dtRealizacao;
                    _self.document.hrRealizacao     = editDocument.hrRealizacao;
                }
            }
            
        };
                
        this.onAuditorDoctorChange = function(){
            if(!_self.document.nmMedicoAuditor
            || _self.document.nmMedicoAuditor.length == 0){
                _self.document.cdCrmMedicoAuditor = '';
                _self.document.cdUfMedicoAuditor = '';
            }else{
                _self.loadUfs();
            }
        };
        
        this.onAuditorNurseChange = function(){
            if(!_self.document.nmEnfermAuditor
            || _self.document.nmEnfermAuditor.length == 0){
                _self.document.cdCorenEnfermAuditor = '';
                _self.document.cdUfEnfermAuditor = '';
            }else{
                _self.loadUfs();
            }
        };
        
        this.setTissConsultationTypeList = function(){
            if(angular.isUndefined(_self.tissConsultationTypes) === true
            || _self.tissConsultationTypes.length === 0){
                if(isSettingData === true){
                    movementSemaphore++;
                }
                hacGlobalFactory.getTissConsultationTypeByFilter('', 0, 0, false,
                    [{property: 'datInicVigenc'  , value: _self.document.dtEmissao, operator: '<='},
                        {property: 'datFimVigenc'   , value: _self.document.dtEmissao, operator: '>='}],
                    function (result) {
                        _self.tissConsultationTypes = result;
                        if(isSettingData === true){
                            _self.document.tpConsulta = editDocument.tpConsulta;
                            _self.setMovementLists();
                        }else{
                            _self.document.tpConsulta = _self.tissConsultationTypes[0].cdnTipCon;
                        }
                    });
            }
        };
        
        this.setAccessWaysList = function(){
            if(angular.isUndefined(_self.accessWays) === true
            || _self.accessWays.length === 0){
                hrcGlobalFactory.getAccessWayByFilter('', 0, 0, false, [],
                    function (result) {
                        _self.accessWays = result;
                        _self.accessWaysOptional = angular.copy(_self.accessWays);
                        _self.accessWaysOptional.unshift({cdViaAcesso: 0, dsViaAcesso: "Não Informado", rotulo: '0 - Não Informado'});
                        
                        if(isSettingData === true){
                            _self.setMovementLists();
                        }
                    });
            }
        };
                
        this.setTissTechniques = function(){
            if(angular.isUndefined(_self.tissTechniques) === true
            || _self.tissTechniques.length === 0){
                hacGlobalFactory.getTissTechniqueByFilter('', 0, 0, false,
                    [{property: 'datInicVigenc'  , value: _self.document.dtEmissao, operator: '<='},
                        {property: 'datFimVigenc'   , value: _self.document.dtEmissao, operator: '>='}],
                    function (result) {
                        _self.tissTechniques = result;
                        _self.tissTechniques.unshift({cdnTec: 0, desTec: '', rotulo: ''});
                        
                        if(isSettingData === true){
                            _self.setMovementLists();
                        }
                    });
            }
            
            _self.movement.tpTecUtil = 0;
        };
        
        this.setPercentageList = function(movement, isEdit){
            if(_self.transaction.lgUtilizaPercentual === false
            || angular.isUndefined(_self.movement.cdMovimento) === true 
            || !(_self.movement.cdMovimento > 0) ){
                _self.fatoresRedAcres = [];
                return;
            }
            
            var dtBaseValorAux = undefined;
            
            switch(_self.transaction.inDataBase){
                case 2:
                    dtBaseValorAux = _self.transaction.lgDataRealizacaoUnica === true
                                    ? _self.document.dtRealizacao
                                    : movement.dtRealizacao;
                    break;
                case 4:
                    if(_self.transaction.lgControleFatura === true){
                        dtBaseValorAux = _self.document.dtEmissao;
                    }
                    break;
            }
            
            if(angular.isUndefined(dtBaseValorAux) == true){
                if(angular.isUndefined(_self.movementPeriod.nrPerref) == true){
                    hrcGlobalFactory.getMovementPeriodByFilter('', 0, 0, false, [
                        {property: 'dtAnoref', value: _self.document.dtAnoref, priority: 2},
                        {property: 'nrPerref', value: _self.document.nrPerref, priority: 1}
                        ],function (result) {
                            _self.movementPeriod = result[0];
                            
                            _self.doLoadPercentageList(_self.movementPeriod.dtBaseValor, isEdit);
                        });
                    return;
                }
                
                dtBaseValorAux = _self.movementPeriod.dtBaseValor;
            }
            
            _self.doLoadPercentageList(dtBaseValorAux, isEdit);
        };
        
        this.doLoadPercentageList = function(dtBaseValorAux, isEdit){
            if(angular.isUndefined(_self.movement.fatoresRedAcres) === true
            || _self.movement.fatoresRedAcres.length === 0){
                
                hrcGlobalFactory.getPercentageByFilter('', 0, 0, false, [
                    
                    {property:'cdProcedimentoCompleto', value:_self.movement.cdMovimento},
                    {property:'dtLimite', value:dtBaseValorAux}],
                    function (result) {
                        _self.movement.fatoresRedAcres = result;
                        _self.movement.fatoresRedAcres.unshift({cdTipoPercentual: 0, rotuloTipPerc: '0 - Não Informado'});
                    });
            }
            
            if (!isEdit) {
                _self.movement.cdTipoPercentual = 0;    
            }
            
        };
                
        this.setTissProviderLevels = function(){
            var dtRealizacao = _self.getRealizationDate();
                                            
            if(dtRealizacao === undefined) {
                dtRealizacao = new Date().getTime();
            }

            if(angular.isUndefined(dtRealizacao) === true){
                _self.tissProviderLevels = [];
                return;
            }
            
            if(angular.isUndefined(_self.tissProviderLevels) === true
            || _self.tissProviderLevels.length === 0){
                hacGlobalFactory.getTissProviderLevelByFilter('', 0, 0, false, [
                    {property:'datInicVigenc'   , value:dtRealizacao, operator: '<='},
                    {property:'datFimVigenc'    , value:dtRealizacao, operator: '>='}],
                    function (result) {
                        _self.tissProviderLevels = result;
                        _self.setLevelOnProviders();
                    });
                return;    
            }
            
            _self.setLevelOnProviders();
        };
        
        this.getProviderLevelDescription = function(levelCode){
            var desc = levelCode + ' - Não Cadastrado';
            angular.forEach(_self.tissProviderLevels, function(lvl){
                if(lvl.cdnNivTiss === levelCode){
                    desc = lvl.rotulo;
                }
            });
            return desc;
        };

        this.getProviderCboSpecialty = function(provider){
            
            var descObj = {};
            descObj['rotulo'] = "Não Cadastrado";
            descObj['rotuloEspecialid'] = "Não Cadastrado";

            angular.forEach(provider.cbosSpecialties, function(cboSpec){
                if(cboSpec.cdCboEspecialid === provider.cdCboEspecialid){
                    descObj = cboSpec;
                }
            });

            return descObj;
        };
                
        this.getHonoraryProviderCboSpec = function(provider){
            var descObj = '';
            
            angular.forEach(provider.honoProvCbosSpecialties, function(cboSpec){
                
                if(cboSpec.cdCboEspecialid === provider.cdCboEspecialidHono){
                    descObj = cboSpec;
                }
            });
            
            return descObj;
        };
    
        this.setLevelOnProviders = function(){
            if(isSettingData === true){
                return;
            }
            
            if(angular.isUndefined(_self.tissProviderLevels) === true
            || _self.tissProviderLevels.length === 0){
                return;
            }
            
            angular.forEach(_self.movement.providers, function(prov){
                if(angular.isUndefined(prov.cdnNivTiss) === true
                || !(prov.cdnNivTiss >= 0)){
                    prov.cdnNivTiss = _self.tissProviderLevels[0].cdnNivTiss;
                } 
            });
        };
        
        this.setDefaultInternment = function(inClasseNotaPar){
            switch(inClasseNotaPar) {
                case 4:
                    _self.document.tpInter = 1; //1 - CLINICA
                    break;
                case 5:
                    _self.document.tpInter = 2; //2 - CIRURGICA
                    break;
                case 6:
                    _self.document.tpInter = 3; //3 - OBSTETRICA
                    break;                            
                case 11:
                    _self.document.tpInter = 4; //4 - PEDIATRICA
                    break;
                case 12:
                    _self.document.tpInter = 5; //5 - PSIQUIATRICA
                    break;                        
                default:
                    _self.document.tpInter = 1; //1 - CLINICA
            }
        };
                
        this.onMovementProviderSelect = function(provider, index){
            
            if(!provider.cdUnidCdPrestador){
                if(provider.cdnNivTiss == FIXED_PROVIDER_LEVEL_ENUM.SURGEON){
                    _self.removeBlankProviders(index);
                }
                
                //deve apenas limpar as propriedades do objeto, sem perder a referencia
                for (var prop in provider) delete provider[prop];
                provider.cdnNivTiss = FIXED_PROVIDER_LEVEL_ENUM.SURGEON;
                return;
            }
            
            providerFactory.getProviderByKey(provider.cdUnidCdPrestador, [],
                function (val) {
                    var providerAux = val;
                    
                    if(angular.isUndefined(providerAux.cdPrestador) === true){
                        return;
                    }

                    provider.cdUnidade          = providerAux.cdUnidade;
                    provider.cdPrestador        = providerAux.cdPrestador;
                    provider.cdUnidCdPrestador  = providerAux.cdUnidCdPrestador;
                    provider.preserv            = providerAux;
                    provider.cdUnidCdPrestadorHono = '';
                    provider.cdCboEspecialidHono = '';
                    provider.nmProfissionalExec = '';
                    provider.honoProvCbosSpecialties = undefined;
                    provider.rotuloPrestDivHono = undefined;
                    provider.cdConselho         = '';
                    provider.nrRegistro         = '';
                    provider.cdUfConselho       = '';

                    if(providerAux.inTipoPessoa === "F"){
                        provider.cdConselho         = providerAux.cdConselho;
                        provider.nrRegistro         = providerAux.nrRegistro;
                        provider.cdUfConselho       = providerAux.cdUfConselho;
                    }

                    if(_self.selectedMovement.tpMovimento == 'PROC'){
                        _self.setProviderAssistants(provider);
                    }

                    _self.loadUfs();
                    _self.setProviderCboSpecialties(provider,function(defaultValue){
                        provider.cdCboEspecialid = defaultValue;
                    });
                    
                    _self.recalculateMovementValues(index, 'cdUnidCdPrestador');
                });                                   
        };
        
        this.setProviderAssistants = function(provider){
            if(_self.transaction.lgUtilizaContagem != true
            || provider.cdnNivTiss != FIXED_PROVIDER_LEVEL_ENUM.SURGEON){
                return;
            }
            
            documentFactory.buscaQuantidadeMoedas(
                    _self.beneficiary.cdUnimed,
                    _self.beneficiary.cdModalidade,
                    _self.beneficiary.propost.nrProposta,
                    provider.cdUnidade,
                    provider.cdPrestador,
                    _self.selectedMovement.cdMovimento,
                function(result){
                    if(!result || result.$hasError == true){
                        return;
                    }

                    if(result.cdPorteAnestPar == 0
                    && result.qtAuxiliaresPar){
                        return;
                    }
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'info', 
                        title: 'O Sistema Utilizara a Contagem Automatica de Auxiliares e Anestesistas!'
                    });
                    
                    if(result.cdPorteAnestPar > 0){
                        _self.addMovementProvider(false, FIXED_PROVIDER_LEVEL_ENUM.ANESTHETIST );
                    }
                    
                    var currentNivTiss = FIXED_PROVIDER_LEVEL_ENUM.FIRST_ASSISTANT;
                    while(result.qtAuxiliaresPar > 0){
                        var hasProviderWithLevel = false;
                        
                        angular.forEach(_self.movement.providers,function(provAux){
                            if(provAux.cdnNivTiss == currentNivTiss){
                                hasProviderWithLevel = true;
                            }
                        });
                        
                        if(hasProviderWithLevel == false){
                            _self.addMovementProvider(false, currentNivTiss);
                        }
                        
                        currentNivTiss++;
                        result.qtAuxiliaresPar--;
                    }
                });
        };
                
        this.loadUfs = function(callback){
            if(angular.isUndefined(_self.ufs) === true
            || _self.ufs.length === 0){
                hcgGlobalFactory.getStateByFilter('', 0, 0, false, [],
                    function (result) {
                        _self.ufs = result;
                        _self.ufs.unshift({enUf: '', nmEstado:'', rotulo:' '});
                        
                        if(callback){
                            callback();
                        }
                    });
            }else{
                if(callback){
                    callback();
                }
            } 
        };
        
        this.setProviderCboSpecialties = function(provider, defaultCallbackFunc){
            
            if(angular.isUndefined(provider) === true
            || angular.isUndefined(provider.cdPrestador) === true){
                return;
            }
            
            if(provider === _self.solicProvider
            || _self.transaction.lgTransacaoConsulta === true){
                dateAux = _self.document.dtEmissao;
            }else{
                dateAux = _self.getRealizationDate();
            }
            
            if(angular.isUndefined(dateAux) === true){
                return;
            }
            
            filters = [
                {property: 'cdUnidade', value: provider.cdUnidade, priority: 10},
                {property: 'cdPrestador', value: provider.cdPrestador, priority: 9},
                //vinculo sera adicionado com prioridade 8
                {property: 'dtInicioValidade', value: dateAux, priority: 7},
                {property: 'dtFimValidade', value: dateAux, priority: 6},
                {property: 'lgConsideraQtVinculo', value: true, priority: 5},
                {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Cbos'}];
            
            if(provider === _self.solicProvider
            && _self.transaction.lgTransacaoConsulta === false){
                if(_self.transaction.lgVinculoUnicoSolicitante === true){
                    _self.document.cdVinculoSolicitante = _self.transaction.cdVinculoSolicitante;
                }

                if(angular.isUndefined(_self.document.cdVinculoSolicitante) === true){
                    _self.document.cdVinculoSolicitante = 0;
                }

                if(_self.document.cdVinculoSolicitante > 0){
                    filters.push({property: 'cdVinculo', value: _self.document.cdVinculoSolicitante, priority: 8});
                }   
            }else{
                if(_self.transaction.lgVinculoUnicoExecutante === true){
                    filters.push({property: 'cdVinculo', value: _self.transaction.cdVinculoExecutante, priority: 8});
                }
            }
            
            hcgGlobalFactory.getPreviespByFilter('', 0, 0, false,
                    filters, function (result) {

                if(result){
                    provider.especialidades = result;
                    
                    _self.createCbosSpecialtiesList(provider, defaultCallbackFunc);
                }
                
            });
            
        };
                
        this.createCbosSpecialtiesList = function(provider, defaultCallbackFunc){
            provider.cbosSpecialties = [];
            
            if(provider.especialidades.length === 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title: 'Prestador ' + provider.cdUnidCdPrestador + ' não possui especialidades ativas!'
                });
                return;
            }
            
            mainSpecialty = {};

            //especialidade principal
            angular.forEach(provider.especialidades, function(spec){
                if(spec.lgPrincipal === true
                && angular.isUndefined(mainSpecialty.cdEspecialid) === true){
                    mainSpecialty = spec;
                }
            });
            
            //carrega cbo x espec de acordo com o vinculo selecionado
            angular.forEach(provider.especialidades, function(spec){
                
                if(provider === _self.solicProvider
                && _self.transaction.lgProcedimentoUnico === false
                && _self.transaction.inEspecialidade === 1 /* usar a especialidade principal */
                && spec.lgPrincipal === false){
                    return;
                }

                angular.forEach(spec.cbos, function(cboEsp){
                    var hasCboSpec = false;
                    for (var i = 0; i < provider.cbosSpecialties.length; i++ ) {
                        var cboSpec = provider.cbosSpecialties[i];
                        if(cboSpec.cdCboS       == cboEsp.cdCboS
                        && cboSpec.cdEspecialid == spec.cdEspecialid){
                            hasCboSpec = true;
                            break;
                        }
                    }
                    if(hasCboSpec == true){
                        return;
                    } 

                    provider.cbosSpecialties.push(cboEsp);
                });
            });
            
            if(angular.isUndefined(defaultCallbackFunc) === true){
                return;
            }
            if(defaultCallbackFunc.length == 0){
                defaultCallbackFunc();
                return;
            }
            
            var cdCboEspecialidAux = 0;
            if(provider === _self.solicProvider){
               cdCboEspecialidAux = 0;
               var cdCboSolAux = 0;
               var cdEspAux = 0;
               if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === false
               && _self.transaction.lgDadosGuiaAutomatico === true){
                   if(_self.guide.cdCboSolicitante > 0){
                       cdCboEspecialidAux = _self.guide.cdCboSolicitante + '@@' + _self.guide.cdEspecialid;
                       cdCboSolAux = _self.guide.cdCboSolicitante;
                       cdEspAux = _self.guide.cdEspecialid;
                   }else{ 
                       //se nao tem cbo, seta o primeiro registro com a especialidade de guia
                       for (var i = 0; i < _self.solicProvider.cbosSpecialties.length; i++) {
                           cboSpec = _self.solicProvider.cbosSpecialties[i];
                           if(cboSpec.cdEspecialid === _self.guide.cdEspecialid){
                               cdCboEspecialidAux = cboSpec.cdCboS + '@@' + _self.guide.cdEspecialid;
                               break;
                           }
                       };
                   }
                   var defaultCallback = false;

                   if (cdCboEspecialidAux != 0){
                       angular.forEach(provider.cbosSpecialties, function(cboEsp){
                        
                       if (cboEsp.cdCboS == cdCboSolAux
                           && cboEsp.cdEspecialid == cdEspAux){
                               defaultCallbackFunc(cdCboEspecialidAux);
                               defaultCallback = true;  
                           }
                       });
                   }
                   if (defaultCallback)
                       return;
                       
               }
           }
            
            //caso nao tenha especialidade principal seta o primeiro item da lista
            if(angular.isUndefined(mainSpecialty.cdEspecialid) === true
            || mainSpecialty.cbos.length == 0){
                if(angular.isUndefined(provider.cbosSpecialties) === false
                && provider.cbosSpecialties.length > 0){
                    //seleciona cbo x especialidade default
                    cdCboEspecialidAux = provider.cbosSpecialties[0].cdCboEspecialid;
                }
            }else{
                //seleciona cbo x especialidade default
                cdCboEspecialidAux = mainSpecialty.cbos[0].cdCboS + '@@' + mainSpecialty.cdEspecialid;
            }
            
            defaultCallbackFunc(cdCboEspecialidAux);
        };
        
        this.onAttendanceTypeChange = function(){   
            if(_self.document.tpAtend === 4
            || _self.document.tpAtend === 22 ){
                _self.setTissConsultationTypeList();
            }
        };
                
        this.onLeaveReasonSelect = function(){
            _self.setTissLeaveReason();
        };
        
        this.onLeaveDateChange = function(){
            _self.setTissLeaveReason();

            this.verificaAjusteAutomaticoDados('dtAlta');
        };
        
        this.setTissLeaveReason = function(){
            if(angular.isUndefined(_self.document.cdMotivoAlta)
            || _self.document.cdMotivoAlta === ''){
                _self.tissLeaveReason = {};
                return;
            }
            
            if(angular.isUndefined(_self.document.dtAlta) === true
            || _self.document.dtAlta <= 0){
                _self.tissLeaveReason = {};
                return;
            }
            
            hacGlobalFactory.getTissLeaveReasonByFilter('', 0, 0, false,
                [{property:'cdnMotivAltaGp' , value: _self.document.cdMotivoAlta},
                 {property:'cdnVersao'      , value: 3}, //TISS 3.00.00
                 {property:'datInicVigenc'  , value: _self.document.dtAlta, operator: '<='},
                 {property:'datFimVigenc'   , value: _self.document.dtAlta, operator: '>='}],
                function (result) {
                    if(result.length > 0){
                        _self.tissLeaveReason = result[0];
                        
                        if(_self.tissLeaveReason.cdnMotivAltaTiss < 41 
                        && _self.tissLeaveReason.cdnMotivAltaTiss > 43){
                            _self.document.logDeclaObitRn = false;
                        }
                    }else{
                        _self.tissLeaveReason = {rotulo: '0 - Não Informado'};
                        _self.document.logDeclaObitRn = false;
                    }
            });                    
        };
        
        this.onBeneficiarySelect = function(){
            if(!_self.document.cdUnidCdCarteiraUsuario){
                _self.beneficiary = {};
                return;
            }  
            
            var filtersAux = dtsUtils.mountDisclaimers(_self.beneficiaryFixedFilters);
            filtersAux.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Propost'});

            
            beneficiaryFactory.getBenefByCard(_self.document.cdUnidCdCarteiraUsuario,
                filtersAux,
                function (val) {
                    _self.beneficiary = val;
                    
                    //variaveis preenchidas para mandar as informacoes do benef para o progress
                    _self.document.cdUnidadeCarteira = _self.beneficiary.cdUnimed;
                    _self.document.cdCarteiraUsuario = _self.beneficiary.cdUnidCdCarteiraInteira.substring(4);

                    _self.afterBeneficiarySelect();
                });
        };
                    
        this.afterBeneficiarySelect = function(){
            if(angular.isUndefined(_self.beneficiary.cdUnidCdCarteiraInteira) === true){
                return;
            }

            if(_self.transaction.lgPedeDocOriginal){
                hcgGlobalFactory.getUnitByKey(_self.beneficiary.cdUnimed, [], 
                    function(result){
                        _self.beneficiary.unimed = result;

                        if(isSettingData == true){
                            if(_self.beneficiary.unimed.lgTemSerious == true){
                                if (editDocument.aaGuiaOrigem > 0)
                                    _self.document.aaGuiaOrigem = StringTools.fill(editDocument.aaGuiaOrigem, "0", 4);
                                if (editDocument.nrGuiaOrigem > 0)   
                                    _self.document.nrGuiaOrigem = StringTools.fill(editDocument.nrGuiaOrigem, "0", 8);
                            }else{
                                if (editDocument.aaGuiaOrigem > 0
                                ||  editDocument.nrGuiaOrigem > 0)
                                    _self.document.nrGuiaOrigem = StringTools.fill(editDocument.aaGuiaOrigem, "0", 4).substring(2)
                                                                + StringTools.fill(editDocument.nrGuiaOrigem, "0", 8);
                            }
                            
                            if(_self.document.nrGuiaOrigem > 0){
                                _self.document.dtAutorizacaoOrigem = editDocument.dtAutorizacaoOrigem;
                                _self.document.dtSolicitacaoOrigem = editDocument.dtSolicitacaoOrigem;                                    
                            }

                            return;
                        }                                

                        if(_self.beneficiary.unimed.lgTemSerious == true
                        && angular.isUndefined(_self.guide.nrGuiaAtendimento) === false){
                            _self.document.aaGuiaOrigem = StringTools.fill(_self.guide.aaGuiaAtendOrigem, "0", 4); 
                            _self.document.nrGuiaOrigem = StringTools.fill(_self.guide.nrGuiaAtendOrigem, "0", 8);
                        }else{
                            if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === false){
                                _self.document.nrGuiaOrigem = StringTools.fill(_self.guide.aaGuiaAtendOrigem, "0", 4).substring(2)
                                                            + StringTools.fill(_self.guide.nrGuiaAtendOrigem, "0", 8);
                            }
                        }

                        if(_self.document.nrGuiaOrigem > 0){
                            _self.document.dtSolicitacaoOrigem = _self.guide.dtEmissaoGuia;
                            _self.document.dtAutorizacaoOrigem = _self.guide.dtAutorizacao;
                        }
                });
            }
                    
            if ( _self.guide != null
            &&  _self.guide != undefined
            &&  _self.guide.cdClaHos != 0 
            &&  _self.guide.cdClaHos != undefined){
                _self.document.cdClaHos = _self.guide.cdClaHos;
            }else{
                if(isSettingData === true){
                    _self.document.cdClaHos = editDocument.cdClaHos;
                }else{
                    _self.document.cdClaHos = _self.beneficiary.propost.tipoPlano.clashosp.cdClaHos;
                } 
            }	
                

            _self.cleanMovement();       
            
        };
    
        this.onInvoiceSelect = function(){
            if(angular.isUndefined(_self.document.aaFaturaCdSerieNfCodFaturAp) == true
            || _self.document.aaFaturaCdSerieNfCodFaturAp == null
            || _self.document.aaFaturaCdSerieNfCodFaturAp == ''){
                _self.invoice = {};
                return;
            }

            if(!(  angular.isUndefined(_self.mainProvider) == false
                && angular.isUndefined(_self.mainProvider.cdPrestador) == false
                && _self.mainProvider.cdPrestador > 0)){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Prestador inválido!'
                });
                _self.validateInvoice(false);
                return;
            }
            
            /*hrcGlobalFactory.getNotapresByFilter('',0,0,[
                {property:'cdUnidade'           , value:_self.paramecp.cdUnimed         , priority:10},
                {property:'cdUnidadePrestadora' , value:_self.mainProvider.cdUnidade    , priority:9},
                {property:'cdPrestador'         , value:_self.mainProvider.cdPrestador  , priority:8},
                {property:'aaFatura'            , value:_self.document.aaFatura         , priority:7},
                {property:'cdSerieNf'           , value:_self.document.cdSerieNf        , priority:6},
                {property:'codFaturAp'          , value:_self.document.codFaturAp       , priority:5}],
                function (result) */
            hrcGlobalFactory.getNotapresByFilter('',0,0,false,[
                {property:'cdUnidade'                   , value:_self.paramecp.cdUnimed                    , priority:10},
                {property:'cdUnidadePrestadora'         , value:_self.mainProvider.cdUnidade               , priority:9},
                {property:'cdPrestador'                 , value:_self.mainProvider.cdPrestador             , priority:8},
                {property:'aaFaturaCdSerieNfCodFaturAp' , value:_self.document.aaFaturaCdSerieNfCodFaturAp , priority:7}],
                function (result) {
                    if(result){
                        switch (result.length){
                            case 1:
                                _self.setInvoice(result[0]);
                                _self.document.aaFatura = _self.document.aaFaturaCdSerieNfCodFaturAp.split("/")[0];
                                _self.document.cdSerieNf = _self.document.aaFaturaCdSerieNfCodFaturAp.split("/")[1];
                                _self.document.codFaturAp = _self.document.aaFaturaCdSerieNfCodFaturAp.split("/")[2];
                                break;
                            case 2:
                                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                    title: 'Documentos',
                                    text: 'Foi encontrada uma Fatura e uma NDR para a chave informada.' +
                                            ' Qual você deseja utilizar?',
                                    cancelLabel: 'NDR',
                                    confirmLabel: 'Fatura',
                                    callback: function(lgFatura) {
                                        var nrFaturaAux = 1; //NDR
                                        if(lgFatura){
                                            nrFaturaAux = 0; //Fatura
                                        };
                                        angular.forEach(result, function (fat) {
                                            if(fat.nrFatura === nrFaturaAux){
                                                _self.setInvoice(fat);
                                                _self.document.aaFatura = _self.document.aaFaturaCdSerieNfCodFaturAp.split("/")[0];
                                                _self.document.cdSerieNf = _self.document.aaFaturaCdSerieNfCodFaturAp.split("/")[1];
                                                _self.document.codFaturAp = _self.document.aaFaturaCdSerieNfCodFaturAp.split("/")[2];
                                            }
                                        });
                                    }
                                });
                                break;
                            default:
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'error', title: 'Fatura não encontrada!'
                                });
                                
                        }
                    }
            });
        };
                
        this.setInvoice = function(invoicePar){
            _self.invoice = invoicePar;
            _self.validateInvoice(true);
            if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === true){
                _self.canEditMainProvider = false;
                //_self.setMainProvider(_self.invoice.cdUnidadePrestadora, _self.invoice.cdPrestador); Ver com o Harter
            }
        };
        
        this.validateInvoice = function(isValid){
            if(isValid === true){
                $('#invoiceDiv').querySelectorAll('input').css('border','');
            }else{
                $('#invoiceDiv').querySelectorAll('input').css('border','1px solid #f00');
            }
        };
        
        this.setMainProvider = function(cdUnidade, cdPrestador){
            _self.mainProvider.cdUnidade = cdUnidade;
            _self.mainProvider.cdPrestador = cdPrestador;
            _self.document.cdUnidCdPrestPrinc = StringTools.fill(cdUnidade,'0',4) + StringTools.fill(cdPrestador,'0',8);
            _self.onMainProviderSelect();
            
            if(angular.isUndefined(_self.guide.nrGuiaAtendimento) === true
            && _self.document.cdUnidCdPrestSolic === ''){
                if(_self.transaction.lgPrestadorUnico === true){
                    //seta default o prestador solic igual o princ
                    _self.document.cdUnidCdPrestSolic = _self.document.cdUnidCdPrestPrinc;
                    _self.onSolicProviderSelect();
                }
                /*else{
                    //seta default a unidade solic igual a unidade prestadora
                    _self.document.cdUnidCdPrestSolic = _self.document.cdUnidadePrestadora;
                }*/
            };
        };
                
        this.cleanInvoice = function(){
            if(angular.isUndefined(_self.invoice.codFaturAp) === false 
            && angular.isUndefined(this.guide.nrGuiaAtendimento) === true){
                _self.canEditMainProvider = true;
                _self.cleanMainProvider();
            }
            
            _self.invoice = {};
            _self.document.aaFatura = '';
            _self.document.cdSerieNf = '';
            _self.document.codFaturAp = '';
            _self.validateInvoice(false);
            
        };
    
        this.cleanMainProvider = function(){
            _self.mainProvider = {};
            _self.document.cdUnidCdPrestPrinc = '';
            _self.afterMainProviderSelect();
        };
        
        this.cleanModel = function(fieldChanged){
            
            var cdTransacaoAux = undefined;
            var aaNrGuiaAtendimentoAux = undefined;

            switch (fieldChanged){
                case 'TRANSACTION':
                    if(filledGuideFirst === true
                    && (_self.guide.cdTransacao == _self.document.cdTransacao
                        || angular.isUndefined(_self.document.cdTransacao) == true)){
                        return;
                    }
                    aaNrGuiaAtendimentoAux = _self.document.aaNrGuiaAtendimento;
                    cdTransacaoAux = _self.document.cdTransacao; 
                    _self.transaction = {}; 
                    break;
                case 'GUIDE':
                    if(filledGuideFirst === true){
                        cdTransacaoAux = _self.document.cdTransacao;
                    }
                    aaNrGuiaAtendimentoAux = _self.document.aaNrGuiaAtendimento;
                    _self.guide = {}; 
                    break;
                default:
                    _self.transaction = {};
                    _self.guide = {};  
                    movementSemaphore = 3;
                    isSettingData     = false;
                    break;
            };

            this.invoice = {};
            this.mainProvider = {};
            this.solicProvider = {};
            this.beneficiary = {};
            this.cid1 = {};
            this.cid2 = {};
            this.cid3 = {};
            this.cid4 = {};

            this.document = { cdTransacao    : cdTransacaoAux,
                                aaNrGuiaAtendimento: aaNrGuiaAtendimentoAux,
                                hrRealizacao   : new Date().toString('HH:mm'),
                                crSolicitacao  : 'E',
                                procedimentos : [],
                                insumos     : [],
                                pacotes   : [],
                                prestRemovidos :[]};

            if(!angular.isUndefined(_self.guide)){
                _self.document.aaGuiaAtendimento = _self.guide.aaGuiaAtendimento;
                _self.document.nrGuiaAtendimento = _self.guide.aaGuiaAtendimento;      
            }

            this.movement = {};
            this.movementFilters = {inStatus: 0, 
                                    cdTipoInsumo: -1 /* todos */ };
            this.appliedMovementFilters = {inStatus: 0, 
                                            cdTipoInsumo: -1 /* todos */ };
            
            /* grava os filtros dos movimentos (appliedMovementFilters) sem propriedades em branco ou zeradas
                como por exemplo inStatus =0 ou cdMovimento = undefined */
            this.appliedMovementFiltersParam = {};

            /* variavel para guardar se tem algum campo de filtro preenchido
                * nesse caso a lista nao pode ser escondida caso nao tenha nenhum movimento
                */
            this.hasMovementFilter = false;
            this.isMovementFilterOpen = false;
            this.selectedMovement = {};
            this.movementReturnObject = undefined;
            this.tissLeaveReason = {};
            this.tissAccidentIndications = [];
            this.tissAttendanceTypes = [];
            this.tissBillingTypes = [];
            this.tissInternmentTypes = [];
            this.tissInternmentRegimes = [];
            this.fatoresRedAcres = [];
            this.accessWays = [];
            this.tissTechniques = [];
            this.tissConsultationTypes = [];
            this.tissProviderLevels = [];

            this.canEditMainProvider = true;
            //pode editar vinculo do prestador
            this.canEditMainBond = true;

            this.lastCidFilled = 0;
            this.isMovementsVisible = false;
            this.isSaving = false;
            this.isMovementEnabled = true;
            
            _self.selectMovementTab("PROC");
            
            _self.consultationMovementList = undefined;
            
            _self.proceduresPageOffset  = 0;
            _self.inputsPageOffset      = 0;
            _self.packagesPageOffset    = 0;
            
            _self.proceduresMovementKey  = undefined;
            _self.inputsMovementKey  = undefined;
            _self.packagesMovementKey  = undefined;

            _self.procAplliedWithLastFilter = false;
            _self.inputAplliedWithLastFilter = false;
            _self.packageAplliedWithLastFilter = false;
            
            _self.unsavedProceduresNumber = 0;
            _self.unsavedInputsNumber = 0;
            _self.unsavedPackagesNumber = 0;
            
            _self.movementFilterFixedFilters = undefined;
            _self.movementFilterInputTypes = undefined;

        };

        this.validaUsuarioEventual = function(){

            if(!_self.beneficiary.lgUsuarioEventual)
                return true;

            if(_self.beneficiary.propost.logAutoGestao
            && (   _self.document.carteiraUsuEvent == "" 
                || _self.document.carteiraUsuEvent == null))
                return false;

            return true;
        };
    
        this.save = function(isSaveNew, isSaveClose) {        
            _self.isSaving = true;

            if(!_self.validaUsuarioEventual()){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', 
                    title: 'Carteira é obrigatória para Usuário Eventual em contrato de Auto Gestão!'
                });

                return;
            }
            
            if(_self.transaction.lgProcedimentoUnico == true
            || _self.transaction.lgTransacaoConsulta == true){
                _self.document.procedimentos.length = 0;
                _self.document.insumos.length = 0;
                _self.document.pacotes.length = 0;

                _self.movement.tpMovimento = 'PROC';

                _self.addMovement();

                if(_self.action == 'INSERT'){
                    _self.document.procedimentos[0].providers = [{}];
                }

                _self.doSave(isSaveNew, isSaveClose);
                
            }else{
                if(_self.selectedMovement.cdMovimento > 0){                            
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'Atenção!', size: 'md',
                        text: 'O movimento ' 
                                + (_self.selectedMovement.cdTipoInsumo > 0 ? StringTools.fill(_self.selectedMovement.cdTipoInsumo,'0',2) : '')
                                + _self.selectedMovement.cdMovimento + ' não foi adicionado.' +
                                ' Deseja continuar e descartá-lo?',
                        cancelLabel: 'Não',
                        confirmLabel: 'Sim',
                        callback: function(lgContinue) {
                            if(lgContinue === true){
                                _self.doSave(isSaveNew, isSaveClose);
                            }else{
                                _self.isSaving = false;
                            }
                        }
                    });
                }else{
                    _self.doSave(isSaveNew, isSaveClose);
                }
            }
        };

        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };
        
        this.doSave = function(isSaveNew, isSaveClose){                    
            //seta o periodo selecionado no documento
            if(_self.action != 'DETAIL'){
                _self.document.dtAnoref = parseInt(_self.dtAnoNrPerRef.substring(0,4));
                _self.document.nrPerref = parseInt(_self.dtAnoNrPerRef.substring(5));
            }


            if (_self.beneficiary.unimed !== undefined
            && _self.beneficiary.unimed.lgTemSerious == false
            && _self.document.nrGuiaOrigem !== undefined
            && _self.document.nrGuiaOrigem.length > 8){
                _self.document.aaGuiaOrigem = _self.document.nrGuiaOrigem.substring(0,2);
                _self.document.nrGuiaOrigem = _self.document.nrGuiaOrigem.substring(2);
            }

            documentFactory.saveDocument(_self.document, _self,
                function (result) {
                    _self.isSaving = false;

                    if(result.$hasError == true){
                        return;
                    }
                    
                    if (result.nrPedido !== 0){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'information', 
                            title: 'Criado pedido ' + result.nrPedido + ' para execução batch '
                                + ' da alteração de documento.'
                        });
                    }else{
                        var returnDocument = result.tmpDocrecon[0];
                        
                        var dsDocto = 'Documento '
                                    + StringTools.fill(returnDocument.cdUnidadePrestadora, '0', 4) 
                                    + "/"  + StringTools.fill(returnDocument.cdTransacao, '0', 4) 
                                    + "/"  + returnDocument.nrSerieDocOriginal
                                    + "/"  + StringTools.fill(returnDocument.nrDocOriginal, '0', 8)
                                    + "/"  + StringTools.fill(returnDocument.nrDocSistema, '0', 9)
                                    +' salvo com sucesso';
                        var tpMensagem = 'success';
                        if(result.lgGerouNovasGlosas == true){
                            tpMensagem = 'warning';
                            dsDocto += ' **Novas glosas geradas';
                        }
                    
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: tpMensagem, title: dsDocto
                        });

                        if(_self.action == 'EDIT'){
                            _self.invalidateDocument(returnDocument);
                        }
                    }

                    if(isSaveNew){                        
                        if (_self.action == 'INSERT'){
                            _self.cleanModel();  
                            $timeout(function(){
                                totvsUtilsService.focusOn('transactionZoom');    
                            });
                        } else {
                            $state.go($state.get('dts/hgp/hrc-document.new')); 
                        }
                    } else {
                        if(isSaveClose){
                            appViewService.removeView({active: true,
                                                        name  : 'Manutenção de Documentos',
                                                        url   : _self.currentUrl});
                        }else{
                            if(_self.action == 'INSERT'){
                                _self.redirectToEdit(returnDocument);
                            }else{
                                _self.cleanModel();

                                if (result.nrPedido !== 0){
                                    _self.redirectToDetail($stateParams.cdUnidade, 
                                                            $stateParams.cdUnidadePrestadora,
                                                            $stateParams.cdTransacao,
                                                            $stateParams.nrSerieDocOriginal,
                                                            $stateParams.nrDocOriginal,
                                                            $stateParams.nrDocSistema);  
                                }else{                                        
                                    _self.prepareDataToDocumentWindow($stateParams.cdUnidade, 
                                                                        $stateParams.cdUnidadePrestadora,
                                                                        $stateParams.cdTransacao,
                                                                        $stateParams.nrSerieDocOriginal,
                                                                        $stateParams.nrDocOriginal,
                                                                        $stateParams.nrDocSistema);
                                }
                            }
                        }
                    }

                });
        };
        
        this.cancelaPedidoRpw = function() {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você deseja cancelar o pedido RPW ?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function(lgContinue) {
                    if(lgContinue == true){

                        documentFactory.cancelaPedidoRpw(_self.document.cdUnidade,
                                                         _self.document.cdUnidadePrestadora,
                                                         _self.document.cdTransacao,
                                                         _self.document.nrSerieDocOriginal,
                                                         _self.document.nrDocOriginal,
                                                         _self.document.nrDocSistema, function(result){
                                                            if(result.$hasError){
                                                                return;
                                                            }
                                                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                                                type: 'info', title:  'Pedido cancelado com sucesso!'
                                                            });
                                                            _self.prepareDataToDocumentWindow($stateParams.cdUnidade, 
                                                                                              $stateParams.cdUnidadePrestadora,
                                                                                              $stateParams.cdTransacao,
                                                                                              $stateParams.nrSerieDocOriginal,
                                                                                              $stateParams.nrDocOriginal,
                                                                                              $stateParams.nrDocSistema);
                                                        });
                        
                    }
                }
            });
        }
                
        this.editCurrentDocument = function(){
            documentFactory.verifyDocumentEditPermissions(
                            _self.document.cdUnidade, 
                            _self.document.cdUnidadePrestadora,
                            _self.document.cdTransacao,
                            _self.document.nrSerieDocOriginal,
                            _self.document.nrDocOriginal,
                            _self.document.nrDocSistema,
                    function(result){
                        if(result.$hasError){
                            return;
                        }

                        if (result.lgPodeEditar == true) {
                            _self.periodsList = result.tmpPerimovi;
                            _self.movementPeriod = _self.periodsList[0];

                            _self.cameFromDetail = true;
                            _self.action = 'EDIT';
                            _self.redirectToEdit(_self.document);
                            return;
                        }

                        if(result.lgPodeDetalhar == true
                        && result.dsMensagem.length > 0){
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error', 
                                title: result.dsMensagem
                            });
                        }

                    });
        };
        
        this.redirectToEdit = function(doc){
            $state.go($state.get('dts/hgp/hrc-document.edit'), 
                    {cdUnidade:             doc.cdUnidade,
                        cdUnidadePrestadora:   doc.cdUnidadePrestadora,
                        cdTransacao:           doc.cdTransacao,
                        nrSerieDocOriginal:    doc.nrSerieDocOriginal,
                        nrDocOriginal:         doc.nrDocOriginal,
                        nrDocSistema:          doc.nrDocSistema});
        };

        this.redirectToDetail = function(cdUnidade, cdUnidadePrestadora,cdTransacao,
                                            nrSerieDocOriginal, nrDocOriginal, nrDocSistema){
            $state.go($state.get('dts/hgp/hrc-document.detail'), 
                    {cdUnidade:             cdUnidade,
                        cdUnidadePrestadora:   cdUnidadePrestadora,
                        cdTransacao:           cdTransacao,
                        nrSerieDocOriginal:    nrSerieDocOriginal,
                        nrDocOriginal:         nrDocOriginal,
                        nrDocSistema:          nrDocSistema});
        };
                
        this.invalidateDocument = function(doc){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('documentInvalidation',
                    {cdUnidade:             doc.cdUnidade,
                        cdUnidadePrestadora:   doc.cdUnidadePrestadora,
                        cdTransacao:           doc.cdTransacao,
                        nrSerieDocOriginal:    doc.nrSerieDocOriginal,
                        nrDocOriginal:         doc.nrDocOriginal,
                        nrDocSistema:          doc.nrDocSistema});
        };
        
        this.onDivisionProviderSelect = function(prov, index){
            providerFactory.getProviderByKey(prov.cdUnidCdPrestadorHono, [],
                function (val) {
                    var honoraryDivisionProv = val;
                    
                    _self.setProviderCboSpecialties(honoraryDivisionProv, function(defaultValue){
                        prov.honoProvCbosSpecialties = honoraryDivisionProv.cbosSpecialties;
                        prov.cdCboEspecialidHono = defaultValue;
                        prov.rotuloPrestDivHono = honoraryDivisionProv.rotulo;
                        
                        _self.recalculateMovementValues(index,'cdUnidCdPrestadorHono');
                    });
                });
        };

        this.getDivisionProviderUnit = function(prov){
            if(!(prov.cdUnidCdPrestadorHono > 0)){
                return 0;
            }

            return parseInt(prov.cdUnidCdPrestadorHono.substring(0,4));
        };
        
        this.openInterchangeBenefMaintenance = function(){
            $state.go($state.get('dts/hgp/hvp-beneficiary.new'), { benefCardNumber: _self.document.cdUnidCdCarteiraUsuario});
        };
        
        this.closeTab = function(){
            appViewService.removeView({active: true,
                                        name  : 'Manutenção de Documentos',
                                        url   : _self.currentUrl});
        };
        
        this.onCancel = function(){      
            if(_self.action == 'DETAIL'
            || angular.isUndefined(_self.transaction.cdTransacao) == true){
                _self.closeTab();
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

                    _self.closeTab();
                }
            }); 
            
        };
                
        this.selectMovementTab = function(tabName){
            switch(tabName){
                case 'PROC':
                    _self.movementOrderFields = _self.resetMovementOrderOption();
                    
                    _self.isProcTabSelected = true;
                    _self.isInputTabSelected = false;
                    _self.isPackageTabSelected = false;
                    if (_self.procAplliedWithLastFilter == false
                    && _self.action != 'INSERT' && !_self.isHistorDocument) {
                        _self.loadDocumentProcedures();
                    }
                    break;
                case 'INSU':
                    _self.movementOrderFields = _self.resetMovementOrderOption();

                    _self.movementOrderFields = _self.movementOrderInputsFields(_self.movementOrderFields);

                    _self.isProcTabSelected = false;
                    _self.isInputTabSelected = true;
                    _self.isPackageTabSelected = false;
                    if (_self.inputAplliedWithLastFilter == false
                        && _self.action != 'INSERT' && !_self.isHistorDocument) {
                        _self.loadDocumentInputs();
                    }
                    break;
                case 'PACOTE':
                    _self.movementOrderFields = _self.resetMovementOrderOption();

                    _self.isProcTabSelected = false;
                    _self.isInputTabSelected = false;
                    _self.isPackageTabSelected = true;
                    if (_self.packageAplliedWithLastFilter == false
                    &&  _self.action != 'INSERT' && !_self.isHistorDocument) {
                        _self.loadDocumentPackages();
                    }
                    break;
            }
        };
                
        this.loadDocumentProcedures = function(){
            if(_self.procAplliedWithLastFilter == false){
                _self.proceduresPageOffset = 0;
                _self.proceduresMovementKey  = [];
            }
            
            var movementKeys = [].concat(_self.proceduresMovementKey)
                                    .concat(_self.document.prestRemovidos);
                            
            if(_self.unsavedProceduresNumber > 0){
                for (var i = 0; i < _self.unsavedProceduresNumber; i++) {
                    var movto = _self.document.procedimentos[i];
                    angular.forEach(movto.providers, function(prov){
                        if(prov.nrProcesso && prov.nrProcesso > 0){
                            movementKeys.push({
                                    nrProcesso: prov.nrProcesso,
                                    nrSeqDigitacao: prov.nrSeqDigitacao});
                        }
                    });
                }
            }
                        
            movementFactory.getDocumentProceduresByFilter(
                        _self.document.cdUnidade,
                        _self.document.cdUnidadePrestadora,
                        _self.document.cdTransacao,
                        _self.document.nrSerieDocOriginal,
                        _self.document.nrDocOriginal,
                        _self.document.nrDocSistema,
                        10, dtsUtils.mountDisclaimers(_self.appliedMovementFiltersParam),
                        [_self.selectedOrderMovField],
                        _self.proceduresPageOffset, 
                        movementKeys,
                function(result){
                    _self.hasMovementFilter = !angular.equals({}, _self.appliedMovementFiltersParam);
                    
                    if(_self.procAplliedWithLastFilter == false){
                        _self.document.procedimentos = _self.document.procedimentos.slice(0,_self.unsavedProceduresNumber);
                        _self.procAplliedWithLastFilter = true;
                    }
                    
                    _self.proceduresPageOffset = result.QP_pageOffset;
                    
                    _self.proceduresMovementKey = result.tmpMovementKey;
                    _self.hasLoadedAllProcs     = result.hasLoadedAllRecords; 
                    
                    angular.forEach(result.tmpMovementProcedure,function(movtoAux){
                        _self.document.procedimentos.push(movtoAux);
                    });
                    
                    $timeout(function(){
                        _self.setMovementVisualization(_self.movementDetailLevel);
                    },100);
                });
        };
                
        this.loadDocumentInputs = function(){
            if(_self.inputAplliedWithLastFilter == false){
                _self.inputsPageOffset = 0;
                _self.inputsMovementKey  = [];
            }
            
            var movementKeys = [].concat(_self.inputsMovementKey)
                                    .concat(_self.document.prestRemovidos);
                            
            if(_self.unsavedInputsNumber > 0){
                for (var i = 0; i < _self.unsavedInputsNumber; i++) {
                    var movto = _self.document.insumos[i];
                    angular.forEach(movto.providers, function(prov){
                        if(prov.nrProcesso && prov.nrProcesso > 0){
                            movementKeys.push({
                                    nrProcesso: prov.nrProcesso,
                                    nrSeqDigitacao: prov.nrSeqDigitacao});
                        }
                    });
                }
            }
            
            movementFactory.getDocumentInputsByFilter(
                        _self.document.cdUnidade,
                        _self.document.cdUnidadePrestadora,
                        _self.document.cdTransacao,
                        _self.document.nrSerieDocOriginal,
                        _self.document.nrDocOriginal,
                        _self.document.nrDocSistema,
                        10, dtsUtils.mountDisclaimers(_self.appliedMovementFiltersParam),
                        [_self.selectedOrderMovField],
                        _self.inputsPageOffset, 
                        movementKeys,
                function(result){
                    _self.hasMovementFilter = !angular.equals({}, _self.appliedMovementFiltersParam);
                    
                    if(_self.inputAplliedWithLastFilter == false){
                        _self.document.insumos = _self.document.insumos.slice(0,_self.unsavedInputsNumber);
                        _self.inputAplliedWithLastFilter = true;
                    }
                    
                    _self.inputsPageOffset = result.QP_pageOffset;
                    
                    _self.inputsMovementKey  = result.tmpMovementKey;
                    _self.hasLoadedAllInputs = result.hasLoadedAllRecords; 
                    
                    angular.forEach(result.tmpMovementInput,function(movtoAux){
                        _self.document.insumos.push(movtoAux);
                    });
                    
                    $timeout(function(){
                        _self.setMovementVisualization(_self.movementDetailLevel);
                    },100);
                });
        };
                
        this.loadDocumentPackages = function(){
            if(_self.packageAplliedWithLastFilter == false){
                _self.packagesPageOffset = 0;
                _self.packagesMovementKey  = [];
            }
            
            var movementKeys = [].concat(_self.packagesMovementKey)
                                    .concat(_self.document.prestRemovidos);
                            
            if(_self.unsavedPackagesNumber > 0){
                for (var i = 0; i < _self.unsavedPackagesNumber; i++) {
                    var movto = _self.document.pacotes[i];
                    if(movto.packageProcedures){
                        angular.forEach(movto.packageProcedures, function(prov){
                            if(prov.nrProcesso && prov.nrProcesso > 0){
                                movementKeys.push({
                                        nrProcesso: prov.nrProcesso,
                                        nrSeqDigitacao: prov.nrSeqDigitacao});
                            }
                        });
                    }
                    if(movto.packageInput){
                        angular.forEach(movto.packageInput, function(prov){
                            if(prov.nrProcesso && prov.nrProcesso > 0){
                                movementKeys.push({
                                        nrProcesso: prov.nrProcesso,
                                        nrSeqDigitacao: prov.nrSeqDigitacao});
                            }
                        });
                    }
                }
            }             
            
            movementFactory.getDocumentPackagesByFilter(
                                _self.document.cdUnidade,
                                _self.document.cdUnidadePrestadora,
                                _self.document.cdTransacao,
                                _self.document.nrSerieDocOriginal,
                                _self.document.nrDocOriginal,
                                _self.document.nrDocSistema,
                                _self.mainProvider.cdUnidade,
                                _self.mainProvider.cdPrestador,
                                _self.beneficiary.cdModalidade,
                                _self.beneficiary.propost.cdPlano,
                                _self.beneficiary.propost.cdTipoPlano,
                                10, dtsUtils.mountDisclaimers(_self.appliedMovementFiltersParam),
                                [_self.selectedOrderMovField],
                                _self.packagesPageOffset, 
                                movementKeys,
                function(result){  
                    _self.hasMovementFilter = !angular.equals({}, _self.appliedMovementFiltersParam);
                    
                    if(_self.packageAplliedWithLastFilter == false){
                        _self.document.pacotes = _self.document.pacotes.slice(0,_self.unsavedPackagesNumber);
                        _self.packageAplliedWithLastFilter = true;
                    }
                    
                    _self.packagesPageOffset = result.QP_pageOffset;
                    
                    _self.packagesMovementKey  = result.tmpMovementKey;
                    _self.hasLoadedAllPackages = result.hasLoadedAllRecords; 
                    
                    angular.forEach(result.tmpMovementPackage,function(movtoAux){
                        _self.fillCompleteLabelAndTooltip(movtoAux);
                        _self.document.pacotes.push(movtoAux);
                    });
                    
                    $timeout(function(){
                        _self.setMovementVisualization(_self.movementDetailLevel);
                    },100);
                });
        };
                
        this.selectMovementTabByPriority = function(){
            if(_self.document.procedimentos.length > 0){
                _self.selectMovementTab('PROC');
            }else if(_self.document.insumos.length > 0){
                _self.selectMovementTab('INSU');
            }else{
                if(_self.document.pacotes.length > 0) {
                    _self.selectMovementTab('PACOTE');
                }
            }
        };
        
        this.openPackageMovements = function (pack, isEditable) {
            if(pack.qtMovimento == undefined
            || pack.qtMovimento == '0'){ 
                _self.movement.qtMovimento = 1;
            }

            if(pack.providers[0].cdPrestador == undefined){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', 
                    title: 'Prestador do movimento não foi informado!'
                });
                
                totvsUtilsService.focusOn('movementProvider0');
                return;
            }

            var packageMovements = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/package.movement.html',
                backdrop: 'static',
                controller: 'hrc.packageMovementController as pmController',
                windowClass: 'extra-large',
                keyboard : false,
                resolve: {
                    selectedPackage: function () {
                        return pack;
                    },
                    documentController: function() {
                        return _self;
                    },
                    isEditable: function(){
                        return isEditable;
                    }
                }
            }); 
            
            packageMovements.result.then(function (package) {  
                var inStatusAux = 99; 
                if(isEditable == true){
                    if(angular.isUndefined(package.qtMovimento) == false
                    || package.qtMovimento != null){
                        _self.movement.qtMovimento = package.qtMovimento;    
                    }

                    _self.movement.movementObject = package.movementObject;

                    _self.movement.packageProcedures = package.packageProcedures;
                    _self.movement.packageInputs = package.packageInputs;
                    _self.movement.vlPagamento = package.vlPagamento;
                    _self.movement.vlCobranca = package.vlCobranca;
                }else{
                    for (var i = package.packageProcedures.length - 1; i >= 0; i--) {
                        for (var j = package.packageProcedures[i].providers.length - 1; j >= 0; j--) {
                            if (inStatusAux > package.packageProcedures[i].providers[j].inStatus){
                                inStatusAux = package.packageProcedures[i].providers[j].inStatus;
                            }                            
                        }                        
                    }

                    for (var i = package.packageInputs.length - 1; i >= 0; i--) {
                        for (var j = package.packageInputs[i].providers.length - 1; j >= 0; j--) {
                            if (inStatusAux > package.packageInputs[i].providers[j].inStatus){
                                inStatusAux = package.packageInputs[i].providers[j].inStatus;
                            }                            
                        }                        
                    }

                    pack.providers[0].inStatus = inStatusAux;
                }
            });
        };
                
        this.setMovementsPercentages = function (dtLimite, movements, callback){
            movementFactory.getMovementsPercentages([
                    {property:'dtLimite', value:dtLimite}], movements,
                function (result) {
                    callback(result);
                });
        };

        /**
        * Metodo que sincroniza os prestadores do pacote com os movimentos dentro do pacote
        */
        this.syncPackageProviders = function (pack) {

            if(pack == undefined
            || pack == null){
                return;
            }
            
            for (var i = 0; i < pack.providers.length; i++) {

                for (var j = 0; j < pack.packageProcedures.length; j++) {
                    var movto = pack.packageProcedures[j];
                    var providerBkp = movto.providers[i];

                    var newProvider = angular.copy(pack.providers[i]);
                    newProvider.nrProcesso     = providerBkp.nrProcesso;
                    newProvider.nrSeqDigitacao = providerBkp.nrSeqDigitacao;
                    newProvider.inStatus       = providerBkp.inStatus;
                    newProvider.lgTemGlosa     = providerBkp.lgTemGlosa;

                    //Caso exista divisao de honorarios copia o prestador da divisão para o novo prestador
                    if(providerBkp.preserv.lgDivisaoHonorario == true){
                        newProvider.cdUnidCdPrestadorHono   = providerBkp.cdUnidCdPrestadorHono;
                        newProvider.cdCboEspecialidHono     = providerBkp.cdCboEspecialidHono;
                        newProvider.honoProvCbosSpecialties = providerBkp.honoProvCbosSpecialties;
                        newProvider.rotuloPrestDivHono      = providerBkp.rotuloPrestDivHono;
                    }

                    movto.providers[i] = newProvider;

                } 
                
                for (var j = 0; j < pack.packageInputs.length; j++) {
                    var movto = pack.packageInputs[j];
                    var providerBkp = movto.providers[i];

                    var newProvider = angular.copy(pack.providers[i]);
                    newProvider.nrProcesso     = providerBkp.nrProcesso;
                    newProvider.nrSeqDigitacao = providerBkp.nrSeqDigitacao;
                    newProvider.inStatus       = providerBkp.inStatus;
                    newProvider.lgTemGlosa     = providerBkp.lgTemGlosa;
                    
                    movto.providers[i] = newProvider;

                } 

            }                    
        };
                
        this.processRemovedProvider = function(provider){
            if(provider.nrProcesso > 0
            || provider.nrSeqDigitacao > 0){                        
                _self.document.prestRemovidos.push({ 
                    nrProcesso: provider.nrProcesso,
                    nrSeqDigitacao: provider.nrSeqDigitacao
                });
            }
        };

        this.removeProvider = function (providerIndex, movement, movementIndex) {
            
            if(movement === _self.movement){//movimento da area de edicao
                movement.providers.splice(providerIndex,1)[0];
                if(movement.providers.length > providerIndex){
                    totvsUtilsService.focusOn('movementProvider' + providerIndex);
                }else{
                    $('#addMovementButton').focus();
                }
                return;
            }
            //a partir daqui é o tratamento de movimento da lista

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você realmente deseja remover o prestador ' 
                    + movement.providers[providerIndex].cdUnidCdPrestador 
                    + ' do movimento ' + movement.cdMovimento + '?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    _self.processRemovedProvider(movement.providers.splice(providerIndex,1)[0]);
                    if(movement.providers.length == 0){
                        _self.doMovementElimination(movement, movementIndex);
                    }
                }
            }); 
        };

        //Sincroniza a data e hora dos movimentos
        this.syncRealizationInfoOnMovements = function () {
            
            for (var i = 0; i < _self.document.procedimentos.length; i++) {
                procAux = _self.document.procedimentos[i];
                procAux.dtRealizacao = _self.document.dtRealizacao;
                procAux.hrRealizacao = _self.document.hrRealizacao;
                procAux.hrRealizacaoFim = _self.document.hrRealizacao;
            };

            for (var i = 0; i < _self.document.pacotes.length; i++) {
                pacoteAux = _self.document.pacotes[i];
                pacoteAux.dtRealizacao = _self.document.dtRealizacao;
                pacoteAux.hrRealizacao = _self.document.hrRealizacao;
                pacoteAux.hrRealizacaoFim = _self.document.hrRealizacao;

                //Sincroniza os movtos do pacote
                for (var j = 0; j < pacoteAux.packageProcedures.length; j++) {
                    procAux = pacoteAux.packageProcedures[j];
                    procAux.dtRealizacao = _self.document.dtRealizacao;
                    procAux.hrRealizacao = _self.document.hrRealizacao;
                    procAux.hrRealizacaoFim = _self.document.hrRealizacao;
                };

                for (var j = 0; j < pacoteAux.packageInputs.length; j++) {
                    insumoAux = pacoteAux.packageInputs[j];
                    insumoAux.dtRealizacao = _self.document.dtRealizacao;
                    insumoAux.hrRealizacao = _self.document.hrRealizacao;
                    insumoAux.hrRealizacaoFim = _self.document.hrRealizacao;  
                };
            };

            for (var i = 0; i < _self.document.insumos.length; i++) {
                insumoAux = _self.document.insumos[i];
                insumoAux.dtRealizacao = _self.document.dtRealizacao;
                insumoAux.hrRealizacao = _self.document.hrRealizacao;
                insumoAux.hrRealizacaoFim = _self.document.hrRealizacao;
            };
        };
        
        this.setMovementVisualization = function(level){
            
            _self.movementDetailLevel = level;
            
            $timeout(function(){
                switch(level){
                    /*case 0:
                        $('.movement-details').css('display','none');
                        $('.provider-details').css('display','none');
                        $('.movement-provider').css('display','none');
                        break;*/
                    case 1:
                        $('.movement-details').css('display','none');
                        $('.provider-details').css('display','none');
                        $('.movement-provider').css('display','block');
                        break;
                    case 2:
                        $('.movement-details').css('display','block');
                        $('.provider-details').css('display','block');
                        $('.movement-provider').css('display','block');
                        break;
                }
                if(level == _self.config.movementDetailLevel){
                    return;
                }

                _self.config.movementDetailLevel = level;

                userConfigsFactory.saveUserConfiguration($rootScope.currentuser.login, 
                    _self.cdProgramaCorrente, _self.config, undefined, {noCountRequest: true});
                
            });    
        };
                
        this.openCloseDetail = function(movto, $index){
            
            var id = '#' + movto.tpMovimento + $index;
            if(_self.movementDetailLevel != 2){
                $(id + ' .provider-details').slideToggle();
                $(id + ' .movement-details').slideToggle();
                if(_self.movementDetailLevel != 1){
                    $(id + ' .movement-provider').slideToggle();
                }
            }
        };
        
        this.openCloseMovementFilter = function(){
            $('#movement-filters').slideToggle();
            
            _self.isMovementFilterOpen = !_self.isMovementFilterOpen;
            
            if (angular.isUndefined(_self.movementFilterFixedFilters) == true) {
                _self.movementFilterFixedFilters = {};
                
                _self.addMovementFilterFixedFilters();
            }
            
            if (angular.isUndefined(_self.movementFilterInputTypes) == true) {
                if(_self.document.lgTemInsumo == true){
                    _self.movementFilterInputTypes = angular.copy(_self.transactionInputTypes);
                    _self.movementFilterInputTypes.splice(0,1); //remove a opcao de proc ou pacote
                }else{
                    _self.movementFilterInputTypes = [];
                }
                
                if(_self.document.lgTemProcedimento == true
                && _self.document.lgTemPacote == true){
                    _self.movementFilterInputTypes.unshift({cdTipoInsumo: 0, rotulo: '0 - Procedimento ou Pacote'});                            
                }else{
                    if(_self.document.lgTemProcedimento == true){
                        _self.movementFilterInputTypes.unshift({cdTipoInsumo: 0, rotulo: '0 - Procedimento'});
                    }
                    
                    if(_self.document.lgTemPacote == true){
                        _self.movementFilterInputTypes.unshift({cdTipoInsumo: 0, rotulo: '0 - Pacote'});
                    }
                }
                
                _self.movementFilterInputTypes.unshift({cdTipoInsumo: -1, rotulo: 'Todos'});
                
            }
        };
                
        this.addMovementFilterFixedFilters = function(){
            
            /*limpa as propriedades q serao sobrescritas */
            delete _self.movementFilterFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT];
            delete _self.movementFilterFixedFilters['cdTipoPlano'];
            delete _self.movementFilterFixedFilters['cdPlano'];
            delete _self.movementFilterFixedFilters['cdModalidade'];
            delete _self.movementFilterFixedFilters['cdPrestador'];
            delete _self.movementFilterFixedFilters['cdUnidade'];
            
            if(_self.movementFilters.cdTipoInsumo == 0){
                if(_self.document.lgTemProcedimento == true){
                    _self.setFixedFiltersForMovement('PROC', _self.movementFilterFixedFilters);
                }
            
                if(_self.document.lgTemPacote == true){
                    _self.setFixedFiltersForMovement('PACOTE', _self.movementFilterFixedFilters);
                }
            }else{
                if(_self.document.lgTemInsumo == true){
                    _self.setFixedFiltersForMovement('INSU', _self.movementFilterFixedFilters);
                }
            }
        };
        
        this.applyMovementFilters = function(){
            if(_self.movementFilters.cdTipoInsumo      == _self.appliedMovementFilters.cdTipoInsumo
            && _self.movementFilters.cdMovimento       == _self.appliedMovementFilters.cdMovimento
            && _self.movementFilters.cdUnidCdPrestador == _self.appliedMovementFilters.cdUnidCdPrestador
            && _self.movementFilters.dtRealizacao      == _self.appliedMovementFilters.dtRealizacao
            && _self.movementFilters.inStatus          == _self.appliedMovementFilters.inStatus){
                return;
            }
            
            _self.appliedMovementFilters      = angular.copy(_self.movementFilters);
            _self.appliedMovementFiltersParam = angular.copy(_self.appliedMovementFilters);
            
            angular.forEach(_self.appliedMovementFiltersParam, function(value, key){
                if(value == undefined
                || value == ''
                || parseInt(value) == 0){
                    delete _self.appliedMovementFiltersParam[key];
                }
            });
            
            _self.procAplliedWithLastFilter = false;
            _self.inputAplliedWithLastFilter = false;
            _self.packageAplliedWithLastFilter = false;
            
            if(_self.isProcTabSelected == true){
                _self.loadDocumentProcedures();
            }else if(_self.isInputTabSelected == true){
                    _self.loadDocumentInputs();
                    }else{
                    _self.loadDocumentPackages(); 
                    }
        };

        this.setPageShortcuts = function(){
            $('#pageContent').keydown(function(event) {
                if(_self.action == 'DETAIL'){
                    return;
                }
                
                if(event.ctrlKey && !event.shiftKey && event.keyCode == 83){
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'Atenção!', size: 'md',
                        text: 'Você teclou Ctrl + S. Deseja realmente salvar este documento?',
                        cancelLabel: 'Não',
                        confirmLabel: 'Sim',
                        callback: function(lgContinue) {
                            if(lgContinue == true){
                                _self.save();
                            }
                        }
                    });
                    event.preventDefault();
                }
            });
        };

        this.onProviderLevelChange = function(provider, index){
            _self.recalculateMovementValues(index, 'cdnNivTiss');

            /* Seta a descricao do Porte Anestesico quando e
                alterado o Grau de Participacao */
            if(provider.cdnNivTiss == 6
            || provider.cdnNivTiss == 7){
                _self.onPortanesSelect(provider); 
                _self.onPortanesCobSelect(provider);
            }
            
            if(angular.isUndefined(provider.oldCdnNivTiss) == true){
                return;
            }
            
            if(provider.oldCdnNivTiss == FIXED_PROVIDER_LEVEL_ENUM.SURGEON){
                _self.removeBlankProviders(index);
            }
            
            provider.oldCdnNivTiss = provider.cdnNivTiss;
        };      
        
        this.removeBlankProviders = function(index){
            for(var i = index + 1; i < _self.movement.providers.length;i++){
                var provAux = _self.movement.providers[i];

                if(angular.isUndefined(provAux.cdUnidCdPrestador) == true){
                    _self.movement.providers.splice(i,1);
                    i--;
                }
            }
        };

        this.openMovementDetails = function(movto, prov){

            if((_self.transaction.lgProcedimentoUnico == true
                || _self.transaction.lgTransacaoConsulta == true)
            && prov == undefined){

                if(movto.providers[0] != undefined){
                    prov = { nrProcesso: movto.providers[0].nrProcesso,
                                nrSeqDigitacao: movto.providers[0].nrSeqDigitacao}; 
                }else{
                    prov = { nrProcesso: 1,
                                nrSeqDigitacao: 1};    
                }                    
            }
            
            var procInsuAux = {cdUnidade : _self.document.cdUnidade,
                                cdUnidadePrestadora : _self.document.cdUnidadePrestadora,
                                cdTransacao : _self.document.cdTransacao,
                                nrSerieDocOriginal : _self.document.nrSerieDocOriginal,
                                nrDocOriginal : _self.document.nrDocOriginal,
                                nrDocSistema : _self.document.nrDocSistema,
                                nrProcesso : prov.nrProcesso,
                                nrSeqDigitacao : prov.nrSeqDigitacao,
                                cdMovimento: movto.cdMovimento,
                                tpMovimento : movto.tpMovimento};                   

            if(movto.tpMovimento == 'INSU'){
                procInsuAux.cdTipoInsumo = movto.cdTipoInsumo;
                procInsuAux.cdInsumo     = movto.cdMovimento;
            }

            procInsuAux.tissProviderBatch = _self.document.tissProviderBatch;

            var movementDetails = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/movementDetails.html',
                backdrop: 'static',
                windowClass: 'extra-large',
                controller: 'hrc.movementDetails.Control as controller',
                resolve: {
                    procInsu: function(){
                        return procInsuAux;
                    }
                }
            });
        };

        this.openManualRestrictionMultipleMovements = function () {
            var movementsList = [];
            var movementKey = {};
            var hasInvalidMovto = false;
            var movementsNumbers = {};

            movementsNumbers.procedures = 0;
            movementsNumbers.inputs     = 0;
            movementsNumbers.packages   = 0;

            var returnAux = _self.getSelectedMovements();

            movementsList    = returnAux.movementsList;
            movementsNumbers = returnAux.movementsNumbers;

            if(movementsList.length == 0){
                if(hasInvalidMovto == true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title:  'Os movimentos selecionados não foram salvos, ' +
                                                'portanto não é possivel aplicar a Glosa Manual'
                    });
                    return;
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Não foram selecionados movimentos para aplicar a Glosa Manual'
                });
                return;
            }

            if(hasInvalidMovto == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title:  'Alguns movimentos selecionados não foram salvos, ' +
                                            'portanto a Glosa Manual não será aplicada a estes'
                });
            }

            var manualRestrictionMultipleMovements = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/manual.restriction.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.manualRestriction.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return undefined;
                    },
                    document: function(){
                        return _self.document;
                    },
                    movementsList: function(){
                        return movementsList;
                    },
                    movementsNumbers: function(){
                        return movementsNumbers;  
                    },
                    tmpUnselectedDocuments: function(){
                        return [];
                    }
                }
            }); 

            manualRestrictionMultipleMovements.result.then(function (document) { 
                _self.invalidateDocument(_self.document);
                
                _self.updateMovementInfos(document);

                $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: 'Glosados',
                                actionStr: 'Glosa Manual'
                            };  
                        },
                        resultList: function () {
                            return document;
                        }
                    }
                });
            });  
        };

        this.openUndoManualRestrictionMultipleMovements = function () {
            var movementsList = [];
            var movementKey = {};
            var hasInvalidMovto = false;
            var movementsNumbers = {};

            movementsNumbers.procedures = 0;
            movementsNumbers.inputs     = 0;
            movementsNumbers.packages   = 0;

            var returnAux = _self.getSelectedMovements();

            movementsList    = returnAux.movementsList;
            movementsNumbers = returnAux.movementsNumbers;

            if(movementsList.length == 0){
                if(hasInvalidMovto == true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title:  'Os movimentos selecionados não foram salvos, ' +
                                                'portanto não é possivel Desfazer a Glosa Manual'
                    });
                    return;
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Não foram selecionados movimentos para Desfazer a Glosa Manual'
                });
                return;
            }

            if(hasInvalidMovto == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title:  'Alguns movimentos selecionados não foram salvos, ' +
                                            'portanto não será possível Desfazer a Glosa Manual'
                });
            }

            var undoManualRestrictionMultipleMovements = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/undoManualRestriction.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.undoManualRestriction.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return undefined;
                    },
                    document: function(){
                        return _self.document;
                    },
                    movementsList: function(){
                        return movementsList;
                    },
                    movementsNumbers: function(){
                        return movementsNumbers;  
                    },
                    tmpUnselectedDocuments: function(){
                        return [];
                    }
                }
            }); 

            undoManualRestrictionMultipleMovements.result.then(function (document) { 
                _self.invalidateDocument(_self.document);

                _self.updateMovementInfos(document);

                $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: '',
                                actionStr: 'Desfazer a Glosa Manual'
                            };  
                        },
                        resultList: function () {
                            return document;
                        }
                    }
                });
            });  
        };

        this.openMovementExclusionMultipleMovements = function () {
            var returnAux = _self.getSelectedMovements();

            movementsList    = returnAux.movementsList;
            movementsNumbers = returnAux.movementsNumbers;

            if(movementsList.length == 0){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Não foram selecionados movimentos para exclusão'
                });
                return;
            }
            var movementExclusion = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/movement.exclusion.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.movementExclusion.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return undefined;
                    },
                    document: function(){
                        return _self.document;
                    },
                    movementsList: function(){
                        return movementsList;
                    },
                    movementsNumbers: function(){
                        return movementsNumbers;
                    }
                }
            });
            movementExclusion.result.then(function (confirmAction) {                         
                if(confirmAction == true){
                    _self.removeSelectedProvidersOnMovement(_self.document.procedimentos);
                    _self.removeSelectedProvidersOnMovement(_self.document.insumos);
                    _self.removeSelectedProvidersOnMovement(_self.document.pacotes);

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'info', title:  'Movimentos removidos com sucesso!'
                    });
                }
            });
        }

        this.removeSelectedProvidersOnMovement = function (listOfMovement){
            var movtoIndex = 0;

            for(var movementIndex = 0;movementIndex < listOfMovement.length;movementIndex++){

                var movto = listOfMovement[movementIndex];

                if(movto == undefined)
                    continue;

                for(var providerIndex = 0;providerIndex < movto.providers.length;providerIndex++){
                    var prov = movto.providers[providerIndex];

                    if(prov == undefined)
                        continue;

                    if(prov.$selected){ 
                        _self.processRemovedProvider(movto.providers.splice(providerIndex,1)[0]);
                        providerIndex = providerIndex - 1;
                    }
                }; 

                if(movto.providers == undefined || movto.providers.length == 0){
                    _self.doMovementElimination(movto, movementIndex);
                    movementIndex = movementIndex - 1;
                }
            }
        }

        this.openRestrictionValidationMultipleMovements = function () {
            var movementsList = [];
            var movementKey = {};
            var hasInvalidMovto = false;
            var movementsNumbers = {};

            movementsNumbers.procedures = 0;
            movementsNumbers.inputs     = 0;
            movementsNumbers.packages   = 0;

            var returnAux = _self.getSelectedMovements();

            movementsList    = returnAux.movementsList;
            movementsNumbers = returnAux.movementsNumbers;

            if(movementsList.length == 0){
                if(hasInvalidMovto == true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title:  'Os movimentos selecionados não foram salvos, ' +
                                                'portanto não é possivel Validar as Glosas'
                    });
                    return;
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Não foram selecionados movimentos para Validar as Glosas'
                });
                return;
            }

            if(hasInvalidMovto == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning', title:  'Alguns movimentos selecionados não foram salvos, ' +
                                            'portanto não será possível Validar as Glosas'
                });
            }

            var restrictionValidation = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/restriction.validation.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrc.restrictionValidation.Control as controller',
                resolve: {
                    disclaimers: function () {
                        return undefined;
                    },
                    document: function(){
                        return _self.document;
                    },
                    movementsList: function(){
                        return movementsList;
                    },
                    movementsNumbers: function(){
                        return movementsNumbers;
                    },
                    tmpUnselectedDocuments: function(){
                        return _self.tmpUnselectedDocuments;
                    }
                }
            });
            
            restrictionValidation.result.then(function (document) { 
                _self.invalidateDocument(_self.document);

                _self.updateMovementInfos(document);

                $modal.open({
                    animation: true,
                    templateUrl: '/dts/hgp/html/hrc-document/ui/statusReport.html',
                    size: 'lg',
                    backdrop: 'static',
                    controller: 'hrc.statusReport as controller',
                    resolve: {
                        configs: function(){
                            return {
                                doneStr: 'Validados',
                                actionStr: 'Validação de Glosas'
                            };  
                        },
                        resultList: function () {
                            return document;
                        }
                    }
                });
            });  
        };

        this.updateMovementInfos = function (document) {
            var lgAchouMovimento = false;
            
            angular.forEach(document.tmpMovementResult, function(movement){
                lgAchouMovimento = false;

                if(movement.tpRegistro == 'SUCCESS') {
                    if(movement.tpMovimento == 'P'){
                        angular.forEach(_self.document.procedimentos, function(proc){
                            angular.forEach(proc.providers, function(prov){
                                for (var i = document.tmpMovementProvider.length - 1; i >= 0; i--) {
                                    if(document.tmpMovementProvider[i].nrProcesso     == prov.nrProcesso         
                                    && document.tmpMovementProvider[i].nrSeqDigitacao == prov.nrSeqDigitacao){
                                        //Seta o status do prestador
                                        prov.inStatus = document.tmpMovementProvider[i].inStatus;
                                        prov.vlGlosado = document.tmpMovementProvider[i].vlGlosado;
                                        lgAchouMovimento = true;
                                        break;
                                    }
                                }
                            });
                        });
                    }else{
                        angular.forEach(_self.document.insumos, function(insumo){
                            angular.forEach(insumo.providers, function(prov){
                                if(movement.nrProcesso          == prov.nrProcesso         
                                && movement.nrSeqDigitacao      == prov.nrSeqDigitacao){
                                    for (var i = document.tmpMovementProvider.length - 1; i >= 0; i--) {
                                    if(document.tmpMovementProvider[i].nrProcesso     == prov.nrProcesso         
                                    && document.tmpMovementProvider[i].nrSeqDigitacao == prov.nrSeqDigitacao){
                                            //Seta o status do prestador
                                            prov.inStatus = document.tmpMovementProvider[i].inStatus;
                                            prov.vlGlosado = document.tmpMovementProvider[i].vlGlosado;
                                            lgAchouMovimento = true;
                                            break;
                                        }
                                    }
                                }
                            });
                        });
                    }

                    if (lgAchouMovimento == false){
                        angular.forEach(_self.document.pacotes, function(pacote){

                            angular.forEach(pacote.packageProcedures, function(proc){
                                angular.forEach(proc.providers, function(prov){
                                    for (var i = document.tmpMovementProvider.length - 1; i >= 0; i--) {
                                        if(document.tmpMovementProvider[i].nrProcesso     == prov.nrProcesso         
                                        && document.tmpMovementProvider[i].nrSeqDigitacao == prov.nrSeqDigitacao){
                                            //Seta o status do prestador
                                            pacote.providers[0].inStatus  = document.tmpMovementProvider[i].inStatus;
                                            pacote.providers[0].vlGlosado = document.tmpMovementProvider[i].vlGlosado;
                                            lgAchouMovimento = true;
                                            break;
                                        }
                                    }
                                });
                            });

                            if (lgAchouMovimento == false){
                                angular.forEach(pacote.packageInputs, function(input){
                                    angular.forEach(input.providers, function(prov){
                                        for (var i = document.tmpMovementProvider.length - 1; i >= 0; i--) {
                                            if(document.tmpMovementProvider[i].nrProcesso     == prov.nrProcesso         
                                            && document.tmpMovementProvider[i].nrSeqDigitacao == prov.nrSeqDigitacao){
                                                //Seta o status do prestador
                                                pacote.providers[0].inStatus  = document.tmpMovementProvider[i].inStatus;
                                                pacote.providers[0].vlGlosado = document.tmpMovementProvider[i].vlGlosado;
                                                lgAchouMovimento = true;
                                                break;
                                            }
                                        }
                                    });
                                });
                            }

                            if (lgAchouMovimento == true){
                                return;
                            }
                        });
                    } /* if (lgAchouMovimento == false) */
                } /* if(movement.tpRegistro == 'SUCCESS') */
            });
        };

        this.selectAllMovements = function (){
            this.manageMovementsSelection("ALL",true);
        }

        this.deselectAllMovements = function (){
            this.manageMovementsSelection("ALL",false);
        }

        this.manageMovementsSelection = function (movementType,selectOption){
            if(movementType == "ALL" || movementType == "PROC"){
                angular.forEach(_self.document.procedimentos, function(proc){                        
                    angular.forEach(proc.providers, function(prov){
                        prov.$selected = selectOption;
                    });
                });
            }

            if(movementType == "ALL" || movementType == "INSU"){
                angular.forEach(_self.document.insumos, function(insumo){
                    angular.forEach(insumo.providers, function(prov){
                        prov.$selected = selectOption;
                    });
                });
            }

            if(movementType == "ALL" || movementType == "PACT"){
                angular.forEach(_self.document.pacotes, function(pacote){
                    angular.forEach(pacote.providers, function(prov){
                        prov.$selected = selectOption;
                    });
                });
            }
        }

        this.getSelectedMovements = function () {
            var movements = {};
            var movementsNumbers = {};
            var movementsList = [];

            movements.movementsList    = movementsList;
            movements.movementsNumbers = movementsNumbers;
            movementsNumbers.procedures = 0
            movementsNumbers.inputs     = 0
            movementsNumbers.packages   = 0

            angular.forEach(_self.document.procedimentos, function(proc){                        
                angular.forEach(proc.providers, function(prov){
                    if(prov.$selected == true){
                        if(!(prov.nrProcesso > 0)){
                            hasInvalidMovto = true;
                            return;
                        }

                        movementKey = {};
                        movementKey.nrProcesso = prov.nrProcesso; 
                        movementKey.nrSeqDigitacao = prov.nrSeqDigitacao;
                        movementKey.tpMovimento = 'PROC';
                        movementKey.cdMovimento = proc.cdMovimento;

                        movementsList.push(movementKey);
                        movementsNumbers.procedures ++;
                    }                            
                });
            });

            angular.forEach(_self.document.insumos, function(insumo){
                angular.forEach(insumo.providers, function(prov){
                    if(prov.$selected == true){
                        if(!(prov.nrProcesso > 0)){
                            hasInvalidMovto = true;
                            return;
                        }

                        movementKey = {};
                        movementKey.nrProcesso = prov.nrProcesso; 
                        movementKey.nrSeqDigitacao = prov.nrSeqDigitacao;
                        movementKey.tpMovimento = 'INSU';
                        movementKey.cdTipoInsumo = insumo.cdTipoInsumo;
                        movementKey.cdMovimento = insumo.cdMovimento;

                        movementsList.push(movementKey);
                        movementsNumbers.inputs ++;
                    }
                    
                });
            });

            angular.forEach(_self.document.pacotes, function(pacote){
                angular.forEach(pacote.providers, function(prov){
                    if(prov.$selected == true){
                        if(!(prov.nrProcesso > 0)){
                            hasInvalidMovto = true;
                            return;
                        }

                        movementsNumbers.packages ++;

                        angular.forEach(pacote.packageProcedures, function(proc){
                            angular.forEach(proc.providers, function(prov){
                                movementKey = {};

                                movementKey.nrProcesso = prov.nrProcesso; 
                                movementKey.nrSeqDigitacao = prov.nrSeqDigitacao;
                                movementKey.tpMovimento = 'PROC';
                                movementKey.cdMovimento = proc.cdMovimento;

                                movementsList.push(angular.copy(movementKey));
                            });
                        });

                        angular.forEach(pacote.packageInputs, function(input){
                            angular.forEach(input.providers, function(prov){
                                movementKey = {};

                                movementKey.nrProcesso = prov.nrProcesso; 
                                movementKey.nrSeqDigitacao = prov.nrSeqDigitacao;
                                movementKey.tpMovimento = 'INSU';
                                movementKey.cdTipoInsumo = input.cdTipoInsumo;
                                movementKey.cdMovimento  = input.cdMovimento;

                                movementsList.push(angular.copy(movementKey));
                            });
                        });
                    }
                });
            });

            return movements;
        };

        this.onExecProviderSelect = function(){   
            if(!_self.document.cdUnidCdPrestExec){
                return;
            }

            providerFactory.getProviderByKey(_self.document.cdUnidCdPrestExec, [],
                function (val) {
                    _self.execProvider = val;
                    _self.document.cdUnidadeExecutante    = _self.execProvider.cdUnidade;
                    _self.document.cdPrestadorExecutante  = _self.execProvider.cdPrestador;
                    _self.afterExecProviderSelect();
                });
            
        };

        this.inCaraterSolicitacaoChange = function(){
            var urgencia = _self.document.crSolicitacao == "U";
            angular.forEach(_self.document.procedimentos, function(proc){                        
                angular.forEach(proc.providers, function(prov){
                    prov.lgAdicionalUrgencia = urgencia;
                    prov.lgUrgencia = urgencia;
                });
            });
        }
        
        this.afterExecProviderSelect = function(){
            if(angular.isUndefined(_self.execProvider.cdPrestador) === true){
                return;
            }

            _self.cleanMovement();
        };

        this.onChangeGuiaOrigem = function () {
            if(_self.document.aaGuiaOrigem <= 0
            && _self.beneficiary.unimed.lgTemSerious == true){
                _self.document.nrGuiaOrigem = undefined;
                _self.document.dtSolicitacaoOrigem = undefined;
                _self.document.dtAutorizacaoOrigem = undefined;
            }else if(_self.document.nrGuiaOrigem <= 0){
                        _self.document.dtSolicitacaoOrigem = undefined;
                        _self.document.dtAutorizacaoOrigem = undefined;
            }
        };

        this.keyDownGuiaOrigem = function(){
            clearTimeout(timer); 
            timer = setTimeout(this.guiaOrigemData, 1000);
        }
                
        this.guiaOrigemData = function(){
            if((_self.document.aaGuiaOrigem > 0 || _self.beneficiary.unimed.lgTemSerious == false)
            && _self.document.nrGuiaOrigem > 0){
                    var aaNrGuiaOrigem = "";
                    if(_self.document.aaGuiaOrigem > 0){
                        aaNrGuiaOrigem = _self.document.aaGuiaOrigem + "/" + 
                                            _self.document.nrGuiaOrigem;
                    }
                    else{
                        aaNrGuiaOrigem = _self.document.nrGuiaOrigem;
                    }

                    guideFactory.getGuideByKey(aaNrGuiaOrigem,
                        [{property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'DataFromComplemTable'},
                            {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'}],
                        function (val) {
                            if(!(val)
                            || val.length == 0){
                                return;
                            }

                            _self.document.dtSolicitacaoOrigem = val[0].dtEmissaoGuia;
                            _self.document.dtAutorizacaoOrigem = val[0].dtAutorizacao;
                        });                         
            }
            else{
                _self.document.dtSolicitacaoOrigem = undefined;
                _self.document.dtAutorizacaoOrigem = undefined;                        
                _self.document.aaGuiaOrigem = undefined;
                _self.document.nrGuiaOrigem = undefined;
            }
        };

        this.onMovementOrderChange = function(){
            $timeout(function(){
                _self.procAplliedWithLastFilter = false;
                _self.inputAplliedWithLastFilter = false;
                _self.packageAplliedWithLastFilter = false;

                if(_self.isProcTabSelected == true){
                    _self.loadDocumentProcedures();
                }else if(_self.isInputTabSelected == true){
                    _self.loadDocumentInputs();
                }else{
                    _self.loadDocumentPackages(); 
                }
            });
        };
                
        this.recalculateTaxValue = function(providerIndex, property){
            var prov = _self.movement.providers[providerIndex];
            var valPercentualTaxa = 0;

            if(providerIndex == null)
                return;

            if(!_self.document.lgAlteraValorTaxa)
                return;

            //verifica se foi alterado o valor
            if(_self.originalMovement.providers[providerIndex] == undefined
            || prov[property] == _self.originalMovement.providers[providerIndex][property])
                return;   
                
            //atualiza o valor de comparacao
            _self.originalMovement.providers[providerIndex][property] = prov[property];
            
            if(!angular.isUndefined(prov.valPercentualTaxa))
                valPercentualTaxa = prov.valPercentualTaxa;

            if(valPercentualTaxa == 0){
                documentFactory.simulMovementValorization(property, _self.document, _self.movement, [prov],
                    function(result){
                    if(!result || result.$hasError == true)
                        return;

                    valPercentualTaxa = result.tmpMovementProvider[0].valPercentualTaxa;
                    prov.vlTaxaMovimento   = (prov.vlMovimento * valPercentualTaxa) / 100;
                    prov.valPercentualTaxa = valPercentualTaxa; 
                });
            }else{
                prov.vlTaxaMovimento   = (prov.vlMovimento * valPercentualTaxa) / 100;
                prov.valPercentualTaxa = valPercentualTaxa;
            }

            _self.refreshProviderValues(prov, providerIndex);
        }
                
        /**
         * @param
         * prov - indice do prestador em que o dado foi alterado 
         *        (undefined qdo alterou dado do movimento)
         * property - propriedade que foi alterada
         */
        this.recalculateMovementValues = function(providerIndex, property){
            if(_self.action != 'EDIT'){
                return;
            }

            if(_self.movement.isEditMovement != true
            || _self.movement.tpMovimento == 'PACOTE')
                return;
            
            if(property == 'vlMovimento'){
                _self.recalculateTaxValue(providerIndex, property);
                return;
            }
            
            if(providerIndex == null){ //alterou o movto

                //verifica se foi alterado o valor
                if(_self.originalMovement[property] == _self.movement[property])
                    return;

                //atualiza o valor de comparacao
                _self.originalMovement[property] = _self.movement[property];

                documentFactory.simulMovementValorization(property, _self.document, _self.movement, _self.movement.providers,
                    function(result){
                    if(!result || result.$hasError == true)
                        return;

                    for(var i = 0; i < result.tmpMovementProvider.length; i++){
                        _self.refreshProviderValues(result.tmpMovementProvider[i], i);
                    }
                });
            }else{ //alterou o prestador                 
                var prov = _self.movement.providers[providerIndex];

                //verifica se foi alterado o valor
                if(_self.originalMovement.providers[providerIndex] == undefined
                || prov[property] == _self.originalMovement.providers[providerIndex][property])
                    return;         

                //atualiza o valor de comparacao
                _self.originalMovement.providers[providerIndex][property] = prov[property];

                documentFactory.simulMovementValorization(property, _self.document, _self.movement, [prov],
                    function(result){
                    if(!result || result.$hasError == true)
                        return;

                    _self.refreshProviderValues(result.tmpMovementProvider[0], providerIndex);
                });
            }
            
        };
                
        this.refreshProviderValues = function(provOrig, provDestIndex){
            var provDest = _self.movement.providers[provDestIndex];
            var dsMensagemAux = "Qtd. Vezes Tabela recalculada pelo sistema:";

            if(provDest.qtVezesTabelaPag != provOrig.qtVezesTabelaPag
            || provDest.qtVezesTabelaCob != provOrig.qtVezesTabelaCob){
                if (provDest.qtVezesTabelaPag != provOrig.qtVezesTabelaPag){
                    dsMensagemAux += " Pag. Anterior: " + $filter('currency')(provDest.qtVezesTabelaPag,'',2)
                                    + " Pag. Nova: "     + $filter('currency')(provOrig.qtVezesTabelaPag,'',2)
                }

                if(provDest.qtVezesTabelaCob != provOrig.qtVezesTabelaCob){
                    dsMensagemAux += " Cob. Anterior: " +  $filter('currency')(provDest.qtVezesTabelaCob,'',2)
                                    + " Cob. Nova: "     + $filter('currency')(provOrig.qtVezesTabelaCob,'',2)
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'info', title: dsMensagemAux
                });
            }

            provDest.vlGlosado        = provOrig.vlGlosado;
            provDest.qtVezesTabelaPag    = provOrig.qtVezesTabelaPag;
            provDest.qtVezesTabelaCob    = provOrig.qtVezesTabelaCob;
            
            provDest.vlMovimento      = provOrig.vlMovimento;
            provDest.vlMovimentoHono     = provOrig.vlMovimentoHono;
            provDest.vlTaxaMovimento     = provOrig.vlTaxaMovimento;
            provDest.vlTaxaMovimentoHono = provOrig.vlTaxaMovimentoHono;
            provDest.valPercentualTaxa   = provOrig.valPercentualTaxa;

            if(_self.paramrc.lgSeparaValoresInterc == true){
                /* VALORES SEPARADOS */
                provDest.valHonorariosMovimento  = provOrig.valHonorariosMovimento;
                provDest.valOperacionalMovimento = provOrig.valOperacionalMovimento;
                provDest.valFilmeMovimento       = provOrig.valFilmeMovimento;
                
                provDest.valHonorariosMovimHono  = provOrig.valHonorariosMovimHono;
                provDest.valOperacionalMovimHono = provOrig.valOperacionalMovimHono;
                provDest.valFilmeMovimHono       = provOrig.valFilmeMovimHono;

                /* VALORES TAXAS */                        
                provDest.valTaxaHonoMovimento    = provOrig.valTaxaHonoMovimento;
                provDest.valTaxaOperMovimento    = provOrig.valTaxaOperMovimento;
                provDest.valTaxaFilmeMovimento   = provOrig.valTaxaFilmeMovimento;
            
                provDest.valTaxaHonoMovimHono    = provOrig.valTaxaHonoMovimHono;   
                provDest.valTaxaOperMovimHono    = provOrig.valTaxaOperMovimHono;  
                provDest.valTaxaFilmeMovimHono   = provOrig.valTaxaFilmeMovimHono;                         
            }
            
            if(_self.originalMovement.providers[provDestIndex]){
                //atualiza o valor de comparacao da qtd vezes tabela pagto
                _self.originalMovement.providers[provDestIndex].qtVezesTabelaPag = provDest.qtVezesTabelaPag;
            }

            _self.calculateProviderOtherValues(provDest);
        };
            
        this.onPortanesSelect = function(prov) {
            hrcGlobalFactory.getPortanesByKey(prov.cdPorteAnestesico, function(result){
                prov.portanes = result;
            });
        };

        this.onPortanesCobSelect = function(prov) {
            hrcGlobalFactory.getPortanesByKey(prov.cdPorteAnestesicoCob, function(result){
                prov.portanesCob = result;
            });
        };

        this.cleanMovtoProfessionalInfo = function(prov){
            prov.cdUfConselho = '';
            prov.cdConselho = '';
            prov.nrRegistro = '';
            prov.nmProfissionalExec = '';
            prov.codCPFProfissionalExec = '';
        }

        this.onChangeNmProfissionalExec = function(prov) {

            if(prov.nmProfissionalExec === ''
            || prov.nmProfissionalExec === null
            || prov.professional === undefined
            || prov.professional === null){
                _self.cleanMovtoProfessionalInfo(prov);  
            }
            
            if(prov.professional !== undefined
            && prov.professional !== null){
                this.onProfessionalSelect(prov,prov.professional);
                return;
            }

            if(prov.professional != undefined 
            && prov.nmProfissionalExec != undefined
			&& prov.nmProfissionalExec != prov.professional['nom-profis']){
                prov.cdUfConselho = '';
                prov.cdConselho = '';
                prov.nrRegistro = '';
                prov.codCPFProfissionalExec = '';
            }
        }

        this.onProfessionalSelect = function(prov, provSelected) {
            if(prov.professional === undefined){
                _self.cleanMovtoProfessionalInfo(prov);
                return;
            }                    

            if(prov.professional['cod-uf-cons'] === ''
            && prov.professional['cod-cons-medic']   === ''
            && prov.professional['cod-registro']    === ''){
                return;
            }

            $timeout(function(){  
                prov.cdUfConselho = prov.professional['cod-uf-cons'] ;
                prov.cdConselho = prov.professional['cod-cons-medic'];
                prov.nrRegistro = prov.professional['cod-registro'];
                prov.nmProfissionalExec = prov.professional['nom-profis'];
                prov.codCPFProfissionalExec = prov.professional['cod-cpf'];
            });

        };

        this.calculateProviderOtherValues = function(provider){
            
            if (_self.paramrc.lgSeparaValoresInterc == true
            && provider.cdUnidade != _self.paramecp.cdUnimed) {
                    
                var vlGlosadoHonorarios  = parseFloat(provider.valHonorariosCobrado)  - parseFloat(provider.valHonorariosMovimento);
                var vlGlosadoTaxaHono    = parseFloat(provider.valTaxaHonoCobrado)    - parseFloat(provider.valTaxaHonoMovimento);
                var vlGlosadoOperacional = parseFloat(provider.valOperacionalCobrado) - parseFloat(provider.valOperacionalMovimento);
                var vlGlosadoTaxaOper    = parseFloat(provider.valTaxaOperCobrado)    - parseFloat(provider.valTaxaOperMovimento);
                var vlGlosadoFilme       = parseFloat(provider.valFilmeCobrado)       - parseFloat(provider.valFilmeMovimento);
                var vlGlosadoTaxaFilme   = parseFloat(provider.valTaxaFilmeCobrado)   - parseFloat(provider.valTaxaFilmeMovimento);
                
                if (vlGlosadoHonorarios < 0){ 
                    vlGlosadoHonorarios = 0;
                }
                
                if (vlGlosadoTaxaHono < 0){
                    vlGlosadoTaxaHono = 0;
                }
                
                if (vlGlosadoOperacional < 0){
                    vlGlosadoOperacional = 0;
                }
                
                if (vlGlosadoTaxaOper < 0){
                    vlGlosadoTaxaOper = 0;
                }
                
                if (vlGlosadoFilme < 0){
                    vlGlosadoFilme = 0;
                }

                if (vlGlosadoTaxaFilme < 0){
                    vlGlosadoTaxaFilme = 0;
                }

                provider.vlGlosado = vlGlosadoHonorarios + vlGlosadoTaxaHono + vlGlosadoOperacional 
                                    + vlGlosadoTaxaOper + vlGlosadoFilme + vlGlosadoTaxaFilme;
            }else{
                provider.vlGlosado = (parseFloat(provider.vlCobrado) + parseFloat(provider.vlTaxaCobrado)) 
                                    - (parseFloat(provider.vlMovimento) + parseFloat(provider.vlTaxaMovimento));
                
                if(provider.vlGlosado < 0){
                    provider.vlGlosado = 0;
                }
            }
        }

        this.verificaAjusteAutomaticoDados = function(tipo){

            if((_self.transaction.lgAjustaDadosInter) && (_self.action === "EDIT")){
                switch(tipo) {
                    case 'dtInternacao':
                        if (dtInternacaoAux != _self.document.dtInternacao){
                            this.mostraMensagemAjusteAutomatico(" data de internação ")
                        }
                        break
                    case 'hrInternacao':
                        if (hrInternacaoAux != _self.document.hrInternacao){
                            this.mostraMensagemAjusteAutomatico(" hora de internação ")
                        }
                        break
                    case 'dtAlta':
                        if (dtAltaAux != _self.document.dtAlta){
                            this.mostraMensagemAjusteAutomatico(" data de alta ")
                        }
                        break;
                    case 'hrAlta':
                        if (hrAltaAux != _self.document.hrAlta){
                            this.mostraMensagemAjusteAutomatico(" hora de alta ")
                        }
                        break;
                }
            }
        };

        this.mostraMensagemAjusteAutomatico = function(mesagem){

            $rootScope.$broadcast(TOTVSEvent.showNotification, {

                type: 'warning', title: 'Essa transação possui controle de Ajuste Automático de Dados da Internação ' +
                                        'portanto se a' + mesagem + ' for alterada, todos os documentos associados serão ajustados automaticamente.'
                });
        };

        this.disableMovementPerformerInfo = function(prov){
            
            if(prov.cdPrestador === undefined)
                return true;

            if(prov.preserv.inTipoPessoa === 'F')
                return false;

            if(prov.nmProfissionalExec !== '')
                return false;

            return true;
        }

        this.getProfessionalFixedFilters = function(prov){
            _self.professionalFixedFilters
            var professionalFixedFilters = {};

            professionalFixedFilters['providerCode'] = prov.cdPrestador;
            professionalFixedFilters['providerUnityCode'] = prov.cdUnidade;

            if(prov.professional !== undefined
            && prov.professional !== null){
                professionalFixedFilters['taxPayerNumber'] = prov.professional.codCpf;
                professionalFixedFilters['name'] = prov.professional.nomPrestdor;
            }

            return professionalFixedFilters;
        } 

        this.setProfessionalAction = function(prov,action){
            prov.addProfessional = false;
            this.cleanMovtoProfessionalInfo(prov);

            if(prov.detailProfessional){
                prov.professional = {};
                prov.detailProfessional = false;
                return;
            }

            if(action == 'ADD')
                prov.addProfessional = true;
        }

        this.verifyRpwProcessResult = function(document){
            _self.lgErroExecucaoRpw = false;

            if(_self.action != 'EDIT'
            || angular.isUndefined(document)
            || !document.lgErroExecucaoRpw)
                return;

            _self.lgErroExecucaoRpw = document.lgErroExecucaoRpw;
            
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'warning', 
                title: 'Ocorreram Erros durante o processamento RPW!'
            });
            _self.openRpwExecutionDetails(document);
        }
 
        this.openRpwExecutionDetails = function(document){
            var documentObject = document;

            if(angular.isUndefined(document))
                documentObject = _self.document;

            $modal.open({ 
                animation: true,
                keyboard: false,
                templateUrl: '/dts/hgp/html/hrc-document/maintenance/ui/rpwExecutionDetails.html',
                backdrop: 'static',
                controller: 'hrc.rpwExecutionDetailsController as controller',
                resolve: {
                    documentMaintenanceController: function () {
                        return _self;
                    },
                    document: function(){
                        return documentObject;
                    }
                }
            });
        };

        this.resetMovementOrderOption = function(){
            let movementOrderFields = [];
            movementOrderFields = angular.copy(_self.movementOrderFieldsPadrao);
            _self.selectedOrderMovField = _self.movementOrderFieldsPadrao[0];
            
            return movementOrderFields;
        }

        /*$scope.$watch(*/
        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
    }
    

	
	index.register.controller('hrc.documentMaintenance.Control', documentMaintenanceController);	
});
