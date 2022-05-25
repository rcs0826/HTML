define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hat-guide/guideFactory.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/hat-guide/guideZoomController.js',
    '/dts/hgp/html/hrc-document/documentZoomController.js',    
    '/dts/hgp/html/global-provider/providerZoomController.js',
    '/dts/hgp/html/hrc-providerBillet/notapresZoomController.js',            
    '/dts/hgp/html/hrc-importBatch/loteimpZoomController.js',    
    '/dts/hgp/html/hrc-transaction/transactionZoomController.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/HibernateTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    documentCopyController.$inject = ['$rootScope', '$scope', '$modalInstance', 
                                      '$state','hrc.document.Factory', 'disclaimers', 
                                      'document', 'global.parameters.Factory', 
                                      'hrc.global.Factory', 'hat.guide.Factory', 
                                      'hvp.beneficiary.Factory', 'dts-utils.utils.Service',
                                      'hrc.movement.Factory', 'TOTVSEvent']
    function documentCopyController($rootScope, $scope, $modalInstance, 
                                    $state, documentFactory, disclaimers, 
                                    document, parametersFactory,
                                    hrcGlobalFactory, guideFactory, 
                                    beneficiaryFactory, dtsUtils,
                                    movementFactory, TOTVSEvent) {

        var _self = this;
        this.model = {};
        _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};
        _self.guideSelectFixedFilters = {};
        _self.invoiceFixedFilters = {};
        _self.batchFixedFilters = {};   
        _self.lgExchangeBeneficiary = false;     
        _self.lgPossuiLoteExp = false;
        _self.lgPossuiLoteImp = (document.nrLoteImp > 0);
        _self.lgPossuiFatura = (document.urlFatura.length > 0);        

        _self.model.tipoCopiaDocumento = 0;
        _self.model.lgLote = false;
        _self.model.cdUnidCdCarteiraUsuario = "";
        _self.model.aaNrGuiaAtendimento = "";
        _self.model.cdChaveDocAnterior = "";
        _self.model.cdUnidadeAnt = 0;
        _self.model.cdUnidadePrestadoraAnt = 0;
        _self.model.cdTransacaoAnt = 0;
        _self.model.nrSerieDocOriginalAnt = ""; 
        _self.model.nrDocOriginalAnt = 0;
        _self.model.nrDocSistemaAnt = 0;
        _self.model.lgVinculoFaturaLote = false;
        _self.model.lgReapresentacaoIntercambio = false;
        _self.model.inMovimentos = "";
        _self.model.cdUnidCdPrestador = "";
        _self.model.aaFaturaCdSerieNfCodFaturAp = "";
        _self.model.nrLoteNrSequencia = "";
        _self.model.cdUnidadeCarteira = 0;
        _self.model.cdCarteiraUsuario = 0;
        _self.model.nrCarteira = 0;
        _self.model.aaGuiaAtendimento = 0;
        _self.model.nrGuiaAtendimento = 0;
        _self.model.aaGuiaOrigem = 0;
        _self.model.nrGuiaOrigem = 0;
        _self.model.cdUnidadePrincipal = 0;
        _self.model.cdPrestadorPrincipal = 0;     
        _self.model.cdTransacao = 0;
        _self.paramecp = {};
        _self.contadorRequisicoes = 4; 

        this.init = function () {          
            parametersFactory.getParamecp(_self.callbackParamecp);
    
            hrcGlobalFactory.getActivePeriods(_self.callbackPeriods); 
    
            movementFactory.getDocumentInputsByFilter(
                        document.cdUnidade,
                        document.cdUnidadePrestadora,
                        document.cdTransacao,
                        document.nrSerieDocOriginal,
                        document.nrDocOriginal,
                        document.nrDocSistema,
                        999, {}, [], 0, [],
                        _self.callbackInputs);  
    
            movementFactory.getDocumentProceduresByFilter(
                        document.cdUnidade,
                        document.cdUnidadePrestadora,
                        document.cdTransacao,
                        document.nrSerieDocOriginal,
                        document.nrDocOriginal,
                        document.nrDocSistema,
                        999, {}, [], 0, [],
                        _self.callbackProcedures);                          
        };

        this.callbackParamecp = function(result){
            _self.paramecp = result;      
                
            _self.contadorRequisicoes--;
            if(_self.contadorRequisicoes == 0)
                _self.prepareDataToWindow();
        }

        this.callbackPeriods = function(result){
            if(result.$hasError){
                return;
            }
            _self.periodsList = result;  

            _self.contadorRequisicoes--;
            if(_self.contadorRequisicoes == 0)
                _self.prepareDataToWindow(); 
        }

        this.callbackInputs = function(result){
            angular.forEach(result.tmpMovementInput, function(inputAux){
                angular.forEach(inputAux.providers, function(providerAux){
                    movementFactory.getLotesInsumo(document.cdUnidade, document.cdUnidadePrestadora, 
                        document.cdTransacao, document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema,
                        providerAux.nrProcesso, providerAux.nrSeqDigitacao, 
                        inputAux.movementObject.cdTipoInsumo, inputAux.movementObject.cdInsumo,
                        function(result){                                        
                            if(result.tmpMovementLoteExp.length > 0){
                                _self.lgPossuiLoteExp = true;                                        
                            }
                        }); 
                });
            });                       
            _self.contadorRequisicoes--;
            if(_self.contadorRequisicoes == 0)
                _self.prepareDataToWindow(); 
        }

        this.callbackProcedures = function(result){
            angular.forEach(result.tmpMovementProvider, function(providerAux){
                movementFactory.getLotesProcedimento(document.cdUnidade, document.cdUnidadePrestadora, 
                    document.cdTransacao, document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema,
                    providerAux.nrProcesso, providerAux.nrSeqDigitacao, 
                    function(result){                                
                        if(result.tmpMovementLoteExp.length > 0){
                            _self.lgPossuiLoteExp = true;
                        }
                    });                                                                    
            });
            _self.contadorRequisicoes--;   
            if(_self.contadorRequisicoes == 0)
                _self.prepareDataToWindow();    
        }

        this.prepareDataToWindow = function() {     
            
            _self.model.dtAnoNrPerRef = StringTools.fill(document.dtAnoref,"0",4) + '/' 
                                        + StringTools.fill(document.nrPerref,"0",3);
            _self.model.dtAnoref = document.dtAnoref;
            _self.model.nrPerref = document.nrPerref;                

            _self.lgExchangeBeneficiary = (document.cdUnidadeCarteira != _self.paramecp.cdUnimed);          
            _self.model.lgReapresentacaoIntercambio = _self.lgExchangeBeneficiary && _self.lgPossuiLoteExp && _self.model.tipoCopiaDocumento == 0;            

            _self.model.cdUnidCdCarteiraUsuario = StringTools.fill(document.cdUnidadeCarteira,'0',4) + StringTools.fill(document.cdCarteiraUsuario,'0', 13);
            _self.model.cdUnidadeCarteira = document.cdUnidadeCarteira;
            _self.model.cdCarteiraUsuario = document.cdCarteiraUsuario;

            _self.model.cdChaveDocAnterior = document.cdUnidadePrestadora + "/" +
                                             document.cdTransacao + "/" +
                                             document.nrSerieDocOriginal + "/" +
                                             document.nrDocOriginal + "/" +
                                             document.nrDocSistema;
            _self.model.cdUnidadeAnt = _self.paramecp.cdUnimed;
            _self.model.cdUnidadePrestadoraAnt = document.cdUnidadePrestadora;
            _self.model.cdTransacaoAnt = document.cdTransacao;
            _self.model.nrSerieDocOriginalAnt = document.nrSerieDocOriginal; 
            _self.model.nrDocOriginalAnt = document.nrDocOriginal;
            _self.model.nrDocSistemaAnt = document.nrDocSistema;                                            

            if(document.nrGuiaAtendimento > 0){
                _self.model.aaNrGuiaAtendimento = StringTools.fill(document.aaGuiaAtendimento,"0",4) 
                                                + StringTools.fill(document.nrGuiaAtendimento,"0",8);
                _self.model.aaGuiaAtendimento = document.aaGuiaAtendimento;
                _self.model.nrGuiaAtendimento = document.nrGuiaAtendimento;
            }                

            if(document.cdPrestadorPrincipal > 0){
                _self.model.cdUnidCdPrestador = StringTools.fill(document.cdUnidadePrincipal, "0", 4)
                                              + StringTools.fill(document.cdPrestadorPrincipal, "0", 8);
                _self.model.cdUnidadePrincipal = document.cdUnidadePrincipal;
                _self.model.cdPrestadorPrincipal = document.cdPrestadorPrincipal;                                              
            }
            
            _self.model.lgVinculoFaturaLote = (_self.lgPossuiFatura || _self.lgPossuiLoteImp);

            _self.onReapresentacaoIntercambioChanged();
            _self.onBeneficiarySelect();
            _self.onVinculoFaturaLoteChanged();
            _self.onDocumentoAnteriorChanged();
            _self.onTransactionSelect();
        }

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.save = function () {
            if(_self.validate()){
                documentFactory.copyDocument(document, _self.model,
                    function (result) {                    
                        if(!result){
                            return;
                        }

                        if(result.$hasError == true){
                            return;
                        }                        
                        
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

                        _self.redirectToEdit(returnDocument);

                        $modalInstance.close();
                    });
            }            
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

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.onReapresentacaoIntercambioChanged = function() {
            if(_self.model.lgReapresentacaoIntercambio)
                _self.model.inMovimentos = "0";
            else
                _self.model.inMovimentos = "";
        }

        this.onTipoCopiaChanged = function() {
            if(_self.model.tipoCopiaDocumento == 0){
                _self.prepareDataToWindow();
            }
            else{
                _self.model.dtAnoNrPerRef = _self.periodsList[0].dtAnoNrPerRef;
                _self.model.dtAnoref = _self.periodsList[0].dtAnoref;
                _self.model.nrPerref = _self.periodsList[0].nrPerref;
                _self.model.aaNrGuiaAtendimento = "";
                _self.model.cdChaveDocAnterior = "";
                _self.model.lgVinculoFaturaLote = false;
                _self.model.lgReapresentacaoIntercambio = false;
                _self.model.inMovimentos = "";
                _self.model.aaFaturaCdSerieNfCodFaturAp = "";
                _self.model.nrLoteNrSequencia = "";
                _self.model.aaGuiaAtendimento = 0;
                _self.model.nrGuiaAtendimento = 0;
            }
        }

        this.onVinculoFaturaLoteChanged = function() {
            if(_self.model.lgVinculoFaturaLote){
                if(_self.lgPossuiFatura)
                    _self.model.aaFaturaCdSerieNfCodFaturAp = document.urlFatura;
                if(_self.lgPossuiLoteImp)
                    _self.model.nrLoteNrSequencia = StringTools.fill(document.nrLoteImp,"0",8) + "/"
                                                  + StringTools.fill(document.nrSequenciaImp,"0",3);
                _self.model.cdTransacao = 0;
            }
            else{
                _self.model.aaFaturaCdSerieNfCodFaturAp = "";
                _self.model.nrLoteNrSequencia = "";
            }
        }

        this.onGuideSelect = function(){
            
            if(!_self.model.aaNrGuiaAtendimento){
                _self.guide = {};
                _self.model.aaGuiaAtendimento = 0;
                _self.model.nrGuiaAtendimento = 0;

                return;
            }
            
            guideFactory.getGuideByKey(_self.model.aaNrGuiaAtendimento, 
                [{property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'DataFromComplemTable'},
                 {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'Descriptions'}],
                function (val) {
                    if(!(val)
                    || val.length == 0){
                        return;
                    }
                    _self.guide = val[0];
                    _self.model.aaGuiaAtendimento = _self.guide.aaGuiaAtendimento;
                    _self.model.nrGuiaAtendimento = _self.guide.nrGuiaAtendimento;
                    _self.model.aaGuiaOrigem = _self.guide.aaGuiaAtendOrigem;
                    _self.model.nrGuiaOrigem = _self.guide.nrGuiaAtendOrigem;

                    //Verifica se a transação da guia é a mesma do documento
                    if(_self.guide.cdTransacao !== document.cdTransacao) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'warning', title: 'Transação da autorização informada difere da transação do documento.'
                        });
                    }

                    //Valida o beneficiário
                    var cdUnidCdCarteiraUsuarioGuia = StringTools.fill(_self.guide.cdUnidadeCarteira,"0",4)
                                                    + StringTools.fill(_self.guide.cdCarteiraUsuario,"0",13);
                    if((cdUnidCdCarteiraUsuarioGuia !== _self.model.cdUnidCdCarteiraUsuario)
                    && (_self.guide.cdCarteiraUsuario !== _self.beneficiary.carteiraPrinc.cdCarteiraAntiga)) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Beneficiário da autorização informada difere do beneficiário do documento.'
                        });

                        _self.model.aaNrGuiaAtendimento = "";
                    }

                    return;                               

                }); 
        };

        this.onBeneficiarySelect = function(){
            if(!_self.model.cdUnidCdCarteiraUsuario){
                _self.beneficiary = {};
                return;
            }  
            
            var filtersAux = dtsUtils.mountDisclaimers(_self.benefFixedFilters);
            
            beneficiaryFactory.getBenefByCard(_self.model.cdUnidCdCarteiraUsuario,
                filtersAux,
                function (val) {
                    _self.beneficiary = val;  
                    _self.model.cdUnidadeCarteira = val.cdUnimed;
                    _self.model.cdCarteiraUsuario = val.carteiraPrinc.cdCarteiraInteira;
                    _self.model.nrCarteira = val.carteiraPrinc.nrCarteira;
                });
        };

        this.onDocumentoAnteriorChanged = function(){
            if(angular.isUndefined(_self.model.cdChaveDocAnterior) == false
            && _self.model.cdChaveDocAnterior != ""
            && _self.model.cdChaveDocAnterior != "0/0//0/0"){
                var arrayChave = _self.model.cdChaveDocAnterior.split("/");
                _self.model.cdUnidadeAnt = _self.paramecp.cdUnimed;
                _self.model.cdUnidadePrestadoraAnt = parseInt(arrayChave[0]);
                _self.model.cdTransacaoAnt = parseInt(arrayChave[1]);
                _self.model.nrSerieDocOriginalAnt = arrayChave[2]; 
                _self.model.nrDocOriginalAnt = parseInt(arrayChave[3]);
                _self.model.nrDocSistemaAnt = parseInt(arrayChave[4]);

                if(_self.model.cdChaveDocAnterior != document.cdChaveDocumento){
                    documentFactory.getDocumentsByFilter('', 0, 0, false,[
                            {property:'cdUnidade'           , value: _self.model.cdUnidadeAnt             , priority:9},
                            {property:'cdUnidadePrestadora' , value: _self.model.cdUnidadePrestadoraAnt   , priority:8},
                            {property:'cdTransacao'         , value: _self.model.cdTransacaoAnt           , priority:7},
                            {property:'nrSerieDocOriginal'  , value: _self.model.nrSerieDocOriginalAnt    , priority:6},
                            {property:'nrDocOriginal'       , value: _self.model.nrDocOriginalAnt         , priority:5},
                            {property:'nrDocSistema'        , value: _self.model.nrDocSistemaAnt          , priority:4}
                        ],[], function(result){
                        if(result){
                            var docAux = result.tmpDocrecon[0];
                            
                            var cdUnidCdCarteiraUsuarioDocAnt = StringTools.fill(docAux.cdUnidadeCarteira,"0",4)
                                                            + StringTools.fill(docAux.cdCarteiraUsuario,"0",13);
                            if((cdUnidCdCarteiraUsuarioDocAnt !== _self.model.cdUnidCdCarteiraUsuario)
                            && (docAux.cdCarteiraUsuario !== _self.beneficiary.carteiraPrinc.cdCarteiraAntiga)) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'error', title: 'Beneficiário da guia principal informada difere do beneficiário do documento.'
                                });

                                _self.model.cdChaveDocAnterior = "";
                                _self.model.cdUnidadeAnt = 0;
                                _self.model.cdUnidadePrestadoraAnt = 0;
                                _self.model.cdTransacaoAnt = 0;
                                _self.model.nrSerieDocOriginalAnt = ""; 
                                _self.model.nrDocOriginalAnt = 0;
                                _self.model.nrDocSistemaAnt = 0;                             
                            }                        
                        }
                    },[]);
                }
            }
            else{
                _self.model.cdUnidadeAnt = 0;
                _self.model.cdUnidadePrestadoraAnt = 0;
                _self.model.cdTransacaoAnt = 0;
                _self.model.nrSerieDocOriginalAnt = ""; 
                _self.model.nrDocOriginalAnt = 0;
                _self.model.nrDocSistemaAnt = 0;                
            }
        }

        this.onTransactionSelect = function(){
                                
            if(!_self.model.cdTransacao){
                return;
            }
            
            hrcGlobalFactory.getTransactionByKey(_self.model.cdTransacao, [],
                function (val) {                    
                    if(val.lgControleFatura) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Selecione uma Transação sem controle por fatura.'
                        });

                        _self.model.cdTransacao = 0;
                    }                                        
                    else{
                        _self.model.cdTransacao = val.cdTransacao;                        
                    }
                });
        };        

        this.onChangeAnoPeriodo = function(){
            if(_self.model.dtAnoNrPerRef != ""){
                var arrayAnoPeriodo = _self.model.dtAnoNrPerRef.split("/");
                _self.model.dtAnoref = parseInt(arrayAnoPeriodo[0]);
                _self.model.nrPerref = parseInt(arrayAnoPeriodo[1]);
            }
        }

        this.validate = function(){
            if(_self.model.cdUnidCdCarteiraUsuario == ""
            || _self.model.cdUnidCdCarteiraUsuario == undefined){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Selecione um Beneficiário.'
                });                
                return false;
            }
            if(_self.model.dtAnoNrPerRef == ""
            || _self.model.dtAnoNrPerRef == undefined){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Selecione um Ano/Período.'
                });                
                return false;
            }
            if (_self.lgPossuiFatura
             && (!_self.model.lgVinculoFaturaLote)
             && (_self.model.cdTransacao == 0 || _self.model.cdTransacao == undefined)){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Selecione uma Transação sem controle por fatura.'
                });                
                return false;            
            }
            return true;
        }

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    
    index.register.controller('hrc.documentCopy.Control', documentCopyController);
});
