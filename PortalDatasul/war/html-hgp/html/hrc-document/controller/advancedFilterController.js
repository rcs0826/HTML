define(['index',
    '/dts/hgp/html/hvp-contractingparty/contractingPartyCodeZoomController.js',
    '/dts/hgp/html/hpr-modality/modalityZoomController.js',
    '/dts/hgp/html/global-adhesionContract/adhesionContractZoomController.js',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/global-provider/providerZoomController.js',
    '/dts/hgp/html/hac-clinic/clinicZoomController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/global-parameters/parametersFactory.js',
    '/dts/hgp/html/global/hrcGlobalFactory.js',     
    '/dts/hgp/html/hrc-transaction/transactionZoomController.js',
    '/dts/hgp/html/hrc-providerBillet/notapresZoomController.js',
    '/dts/hgp/html/hrc-importBatch/loteimpZoomController.js',
    '/dts/hgp/html/hat-guide/guideZoomController.js',
    '/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
    '/dts/hgp/html/hrc-restrictionClass/restrictionClassZoomController.js',
    '/dts/hgp/html/hrc-movement/movementZoomController.js',     
    '/dts/hgp/html/js/util/HibernateTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    advancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance', '$timeout', 'disclaimers',
                                                    'AbstractAdvancedFilterController','listaPorMovimento',
                                                    'global.parameters.Factory', 'hrc.global.Factory', 'TOTVSEvent'];

    function advancedFilterController($rootScope, $scope, $modalInstance, $timeout, disclaimers,
                                      AbstractAdvancedFilterController,listaPorMovimento,
                                       parametersFactory, hrcGlobalFactory, TOTVSEvent) {

        var _self = this;
        this.model = {};

        this.disclaimers = disclaimers;

        _self.listaPorMovimento = listaPorMovimento;
        $scope.DOCUMENT_STATUS_ENUM = DOCUMENT_STATUS_ENUM;
        $scope.BENEFICIARY_TYPE_ENUM = BENEFICIARY_TYPE_ENUM;
        $scope.SERVICE_TYPE_ENUM = SERVICE_TYPE_ENUM;

        _self.today = new Date();

        _self.invoiceFixedFilters = {};
        _self.batchFixedFilters = {};
        _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};
        _self.adhesionContractFixedFilters = {};
        _self.movementFixedFilters = {};

        parametersFactory.getParamecp(function(result){
            _self.paramecp = result;
        });

        /*Metodo para buscar o label do status que foi selecionado na busca avancada*/
        this.getLabelStatusByKey = function(value){
            return DOCUMENT_STATUS_ENUM.getLabelByKey(value);
        };

        /*Metodo para buscar o label do tipo de beneficiario que foi selecionado na busca avancada*/
        this.getLabelBeneficiaryTypeByKey = function(value){
            return BENEFICIARY_TYPE_ENUM.getLabelByKey(value);
        };

        this.getLabelServiceTypeByKey = function(value){
            return SERVICE_TYPE_ENUM.getLabelByKey(value);
        }

        this.cleanFieldsAdvancedFilter = function(){
            _self.model.adhesionContractReturnObject = undefined;
            _self.model.restrictionClassReturnObject = undefined;
            _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};
            _self.adhesionContractFixedFilters = {};
            this.cleanFields();
        }

        this.filtersConfig = [
            {property: 'cdUnidCdCarteiraUsuario', title: 'Beneficiário', modelVar: 'cdUnidCdCarteiraUsuario'},
            {property: 'cdUnidCdPrestadorPrincipal', title: 'Prestador', modelVar: 'cdUnidCdPrestador'},
            {property: 'dtAnoref', title: 'Ano', modelVar: 'periodYear'},
            {property: 'nrPerref', title: 'Período', modelVar: 'periodNumber'},
            {property: 'dtInicioDigitacao', title: 'Data Inicial', modelVar: 'dtStartDigitation', isDate: true},
            {property: 'dtFimDigitacao', title: 'Data Final', modelVar: 'dtEndDigitation', isDate: true},
            {property: 'cdUnidadePrestadora', title: 'Unidade Prestadora', modelVar: 'documentProviderUnit'},
            {property: 'cdTransacao', title: 'Transação', modelVar: 'documentTransaction'},
            {property: 'nrSerieDocOriginal', title: 'Série', modelVar: 'documentSerie'},
            {property: 'nrDocOriginal', title: 'Documento', modelVar: 'document'},
            {property: 'cdClinica', title: 'Clinica', modelVar: 'clinic'},
            {property: 'aaNrGuiaAtendimento', title: 'Autorização', modelVar: 'nrAutorizacao'},
            {property: 'nrGuiaPrestador', title: 'Guia do Prestador', modelVar: 'providerGuide'},
            {property: 'inStatus', title: 'Status', modelVar: 'documentStatus', defaultValue: 0, 
                labelFunction: _self.getLabelStatusByKey},
            {property: 'cdUserid', title: 'Usuário Digitação', modelVar: 'userDigitation'},
            {property: 'aaFaturaCdSerieNfCodFaturAp', title: 'Fatura', modelVar: 'aaFaturaCdSerieNfCodFaturAp'},
            {property: 'nrLoteNrSequencia', title: 'Lote de Importação', modelVar: 'nrLoteNrSequencia', isZoom: true, defaultValue: undefined},
            {property: 'inTipoBeneficiario', title: 'Tipo Beneficiário', modelVar: 'beneficiaryType', defaultValue: 0, 
                labelFunction: _self.getLabelBeneficiaryTypeByKey},
            {property: 'nrUnidadeCarteira', title: 'Unidade Carteira', modelVar: 'beneficiaryUnit'},
            {property: 'cdContratante', title: 'Contratante', modelVar: 'contractingPartyCode'},
            {property: 'cdModalidade', title: 'Modalidade', modelVar: 'modalityCode'},
            {property: 'nrTerAdesao', title: 'Termo Adesão', modelVar: 'adhesionContractCode'},
            {property: 'cdGrupoPrestador', title: 'Grupo Prestador', modelVar: 'providerGroupCode'},
            {property: 'cdUnidCdPrestadorExecutante', title: 'Prestador Executante', modelVar: 'cdUnidCdPrestadorExecutante'},
            {property: 'cdClasseErro', title: 'Classe de Erro', modelVar: 'restrictionClassCode'},
            {property: 'dtRealizacaoInicial', title: 'Data Inicial Realização', modelVar: 'initialPerformDate', isDate: true},
            {property: 'dtRealizacaoFinal', title: 'Data Final Realização', modelVar: 'finalPerformDate', isDate: true},
            {property: 'inStatusMovto', title: 'Status do Movimento', modelVar: 'movementStatus', defaultValue: 0, 
                labelFunction: _self.getLabelStatusByKey},            
            {property: 'inTipoServico', title: 'Tipo do Serviço', modelVar: 'serviceType', defaultValue: 0, 
                labelFunction: _self.getLabelServiceTypeByKey},                            
            {property: 'cdProcedimento', title: 'Procedimento', modelVar: 'cdProcedimento'},
            {property: 'cdTipoInsumo', title: 'Tipo de Insumo', modelVar: 'cdTipoInsumo', defaultValue: 0},        
            {property: 'cdInsumo', title: 'Insumo', modelVar: 'cdInsumo'},
            {property: 'cdPacote', title: 'Pacote', modelVar: 'cdPacote'},  
            ];
        
        /*this.invoiceTypeValues = [
            {value: 0, label: 'Ambos'},
            {value: 1, label: 'Fatura'},
            {value: 2, label: 'NDR'}
        ];*/

        this.search = function () {
            _self.model.listaPorMovimento = _self.listaPorMovimento;

            var isValid = true;

            if ((!angular.isUndefined(_self.model.dtStartDigitation) && _self.model.dtStartDigitation !== null)
             && (!angular.isUndefined(_self.model.dtEndDigitation) && _self.model.dtEndDigitation !== null)
             && (_self.model.dtEndDigitation < _self.model.dtStartDigitation)) {
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data Final de Digitação deve ser maior que a Data Inicial de Digitação'
                });
                return;
            };

            if (_self.model.beneficiaryType == BENEFICIARY_TYPE_ENUM.EXCHANGE &&
                _self.model.beneficiaryUnit == _self.paramecp.cdUnimed){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Unidade da carteira do beneficiário deve ser diferente da unidade do sistema. ' 
                                            + ' Unidade: ' + _self.paramecp.cdUnimed
                    });
                    return;
                }                

            if (_self.model.beneficiaryType >= BENEFICIARY_TYPE_ENUM.BASE
            && _self.model.cdUnidCdCarteiraUsuario > 0
            && _self.model.beneficiaryUnit != parseInt(_self.model.cdUnidCdCarteiraUsuario.substring(0, 4))){
                if (_self.model.beneficiaryType == BENEFICIARY_TYPE_ENUM.EXCHANGE){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Unidade da carteira do Beneficiário não é a mesma que a informada no campo ' 
                                            + ' Unidade Carteira '
                    });
                }else{
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Unidade da carteira do Beneficiário não é a mesma que a unidade do sistema. ' 
                                            + ' Unidade: ' + _self.paramecp.cdUnimed
                    });
                }
                return;
            }

            if ((!angular.isUndefined(_self.model.initialPerformDate) && _self.model.initialPerformDate !== null)
             && (!angular.isUndefined(_self.model.finalPerformDate) && _self.model.finalPerformDate !== null)
             && (_self.model.finalPerformDate < _self.model.initialPerformDate)) {
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data Final de Realização deve ser maior que a Data Inicial de Realização'
                });
                return;
            };
            
            _self.model.filtroPorMovimento = false;
            if(((!angular.isUndefined(_self.model.providerGroupCode)) && (_self.model.providerGroupCode != null) && (_self.model.providerGroupCode != ''))
            || ((!angular.isUndefined(_self.model.cdUnidCdPrestadorExecutante)) && (_self.model.cdUnidCdPrestadorExecutante != null) && (_self.model.cdUnidCdPrestadorExecutante != ''))
            || ((!angular.isUndefined(_self.model.restrictionClassCode)) && (_self.model.restrictionClassCode != null) && (_self.model.restrictionClassCode != ''))
            || ((!angular.isUndefined(_self.model.initialPerformDate)) && (_self.model.initialPerformDate != null) && (_self.model.initialPerformDate != ''))
            || ((!angular.isUndefined(_self.model.finalPerformDate)) && (_self.model.finalPerformDate != null) && (_self.model.finalPerformDate != ''))
            || ((!angular.isUndefined(_self.model.movementStatus)) && (_self.model.movementStatus != null) && (_self.model.movementStatus != 0))
            || ((!angular.isUndefined(_self.model.serviceType)) && (_self.model.serviceType != null) && (_self.model.serviceType != 0))
            || ((!angular.isUndefined(_self.model.cdProcedimento)) && (_self.model.cdProcedimento != null) && (_self.model.cdProcedimento != ''))
            || ((!angular.isUndefined(_self.model.cdPacote)) && (_self.model.cdPacote != null) && (_self.model.cdPacote != ''))
            || ((!angular.isUndefined(_self.model.cdInsumo)) && (_self.model.cdInsumo != null) && (_self.model.cdInsumo != ''))
            || ((!angular.isUndefined(_self.model.cdTipoInsumo)) && (_self.model.cdTipoInsumo != null) && (_self.model.cdTipoInsumo != 0))
            ){
                _self.model.filtroPorMovimento = true;
            }

            isValid = _self.validateFields();

            if (isValid === true) {                
                this.constructDisclaimers();
                $modalInstance.close(this.disclaimers);
            }else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Parâmetros de Busca Avançada insuficientes. Favor preencher mais informações.'
                });
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            this.initialize();            

            if(_self.model.cdUnidCdPrestador > 0){
                _self.onProviderSelect();
            }
        };

        this.onProviderSelect = function(){
            if(!_self.model.cdUnidCdPrestador){
                _self.model.aaFaturaCdSerieNfCodFaturAp = undefined;
                _self.model.nrLoteNrSequencia = undefined;
                _self.invoiceFixedFilters = {};
                _self.batchFixedFilters = {};
                return;
            }

            _self.invoiceFixedFilters['cdUnidadePrestadora']  = _self.model.cdUnidCdPrestador.substring(0, 4);
            _self.invoiceFixedFilters['cdPrestador']          = _self.model.cdUnidCdPrestador.substring(4);
            _self.invoiceFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT]  = "groupInvoiceByNumber";
            _self.invoiceFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT]  = "advancedSearch";

            _self.batchFixedFilters['cdUnidade']  = _self.model.cdUnidCdPrestador.substring(0, 4);
            _self.batchFixedFilters['cdPrestador']          = _self.model.cdUnidCdPrestador.substring(4);
        };

        this.onBeneficiaryTypeSelect = function(){
            if (_self.model.beneficiaryType === BENEFICIARY_TYPE_ENUM.BASE)
                _self.model.beneficiaryUnit = _self.paramecp.cdUnimed;
            else _self.model.beneficiaryUnit = "";
        }

        this.onLoteSelect = function () {
            $timeout(function(){
                if(_self.model.nrLoteNrSequencia == undefined){
                    _self.model.nrLoteNrSequencia = "";
                }
            });
        };

        this.setListVisualization = function (option){
            _self.model.listaPorMovimento = option;            
        }

        this.adhesionContractChanged = function(){
            if (angular.isUndefined(_self.model.adhesionContractReturnObject) ||
                _self.model.adhesionContractReturnObject.nrTerAdesao == 0){
                _self.model.adhesionContractReturnObject = undefined;
                _self.model.adhesionContractCode = "";
                _self.benefFixedFilters['nrTerAdesao'] = undefined;
            }
            else {                
                _self.model.adhesionContractCode = _self.model.adhesionContractReturnObject.nrTerAdesao;
                _self.benefFixedFilters['nrTerAdesao'] = _self.model.adhesionContractReturnObject.nrTerAdesao;
            }
        }
        
        this.onModalityChanged = function(){
            _self.model.cdUnidCdCarteiraUsuario = undefined;
            _self.model.adhesionContractReturnObject = undefined;
            _self.model.adhesionContractCode = undefined;
            _self.adhesionContractFixedFilters['cdModalidade'] = _self.model.modalityCode;
            _self.benefFixedFilters['cdModalidade'] = _self.model.modalityCode;
            _self.adhesionContractChanged();
        };

        this.onContractingPartyChanged = function()
        {
            _self.model.cdUnidCdCarteiraUsuario = undefined;

            if (_self.model.contractingPartyCode > 0){
                _self.benefFixedFilters['cdContratante'] = _self.model.contractingPartyCode;
            }
            else {
                _self.benefFixedFilters['cdContratante'] = undefined;
            }
        };
        
        this.restrictionClassChanged = function(){
            if(angular.isUndefined(_self.model.restrictionClassReturnObject)
            || (_self.model.restrictionClassReturnObject.cdClasseErro == 0)){
                _self.model.restrictionClassReturnObject = undefined;
                _self.model.restrictionClassCode = "";
            }
            else{
                _self.model.restrictionClassCode = _self.model.restrictionClassReturnObject.cdClasseErro;
            }
        }

        this.onServiceTypeChanged = function (event) {
            _self.model.cdProcedimento = '';
            _self.model.cdPacote = '';
            _self.model.cdInsumo = '';
            _self.model.cdTipoInsumo = 0;

            _self.setMovementFixedFilters();
        };

        this.onInputTypeChange = function(){
            _self.movementFixedFilters.cdTipoInsumo = _self.model.cdTipoInsumo;
            _self.model.cdInsumo = '';
        };

        this.validateFields = function () {
            var retorno = false;
            if(_self.model.clinic > 0){
                retorno = _self.validateFieldsCombination('CLINICA');
            }else{
                if(_self.model.userDigitation != ""
                && _self.model.userDigitation != null){
                    retorno = _self.validateFieldsCombination('USUARIO');
                }else{
                    if(_self.model.dtStartDigitation > 0
                    || _self.model.dtEndDigitation   > 0){
                        retorno = _self.validateFieldsCombination('DATA_DIGITACAO');
                    }else{
                        if(_self.model.documentStatus >= 0){
                            retorno = _self.validateFieldsCombination('STATUS');
                        }
                    }
                }
            }
            
            if (retorno){
                return retorno;
            }

            if(_self.model.cdContratante > 0){
                if (_self.validateFieldsCombination('CD_CONTRATANTE')){
                    return true;
                }
            }
            if(_self.model.cdModalidade > 0){
                if (_self.validateFieldsCombination('CD_MODALIDADE')){
                    return true;
                }
            }
            if(_self.model.nrTerAdesao > 0){
                if (_self.validateFieldsCombination('NR_TER_ADESAO')){
                    return true;
                }
            }

            if(_self.model.documentProviderUnit > 0){
                if (_self.validateFieldsCombination('UNIDADE_PRESTADORA')){
                    return true;
                }
            }

            if(_self.model.documentTransaction > 0){
                retorno = _self.validateFieldsCombination('TRANSACAO');
            }

            return retorno;
        };

        this.validateFieldsCombination = function (dsFilter) {
            switch(dsFilter){
                case 'CLINICA':
                case 'USUARIO':
                case 'DATA_DIGITACAO':
                case 'STATUS':
                    if(_self.model.cdUnidCdCarteiraUsuario > 0
                    || _self.model.cdUnidCdPrestador > 0
                    || (   _self.model.periodYear   > 0
                        && _self.model.periodNumber != "")
                    || _self.model.nrAutorizacao > 0
                    || (   _self.model.documentProviderUnit > 0
                        && _self.model.documentTransaction > 0)){
                        return true;
                    }
                    break;
                case 'UNIDADE_PRESTADORA':
                    if(_self.model.cdUnidCdCarteiraUsuario > 0
                    || _self.model.cdUnidCdPrestador > 0
                    || (   _self.model.periodYear   > 0
                        && _self.model.periodNumber != "")
                    || _self.model.nrAutorizacao > 0
                    || _self.model.documentTransaction > 0){
                        return true;
                    }
                    break;
                case 'TRANSACAO':
                    if(_self.model.cdUnidCdCarteiraUsuario > 0
                    || _self.model.cdUnidCdPrestador > 0
                    || (   _self.model.periodYear   > 0
                        && _self.model.periodNumber != "")
                    || _self.model.nrAutorizacao > 0
                    || (_self.model.documentSerie != ""
                     && _self.model.documentSerie != null)){
                        return true;
                    }
                    break;
                case 'CD_CONTRATANTE':
                case 'CD_MODALIDADE':
                    if (_self.model.cdUnidCdCarteiraUsuario > 0
                    ||  _self.model.cdUnidCdPrestador > 0
                    ||  (   _self.model.periodYear   > 0
                        && _self.model.periodNumber != "")
                    || _self.model.nrAutorizacao > 0
                    || (   _self.model.documentProviderUnit > 0 
                        && _self.model.documentTransaction))
                    return true;
            }

            return false;
            
        };

        this.fillInputTypes = function() {
            _self.inputTypesArray = [];
                    
            hrcGlobalFactory.getInputTypeByFilter('', 0, 0, '', false, [],
                function (result) {
                if(!result || result.$hasError == true) { 
                    return;
                }

                _self.inputTypesArray.push({ 
                    cdTipoInsumo: 0,
                    rotulo: "0 - TODOS"
                });

                angular.forEach(result, function(inputType) {
                    _self.inputTypesArray.push({ 
                        cdTipoInsumo: inputType.cdTipoInsumo,
                        rotulo: inputType.cdTipoInsumo + " - " + inputType.dsTipoInsumo
                    });
                });
                
                if (_self.model.cdTipoInsumo == 0
                || angular.isUndefined(_self.model.cdTipoInsumo)){
                    _self.model.cdTipoInsumo = 0;
                }
            });
        };        

        this.setMovementFixedFilters = function () {
            if((!angular.isUndefined(_self.model.serviceType)) && (_self.model.serviceType != undefined) && (_self.model.serviceType != 0)){
                if (_self.model.serviceType == 1) {
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'PROCEDIMENTOS'
                }

                if (_self.model.serviceType == 2) {
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'INSUMOS';
                }

                if (_self.model.serviceType == 3) {
                    _self.movementFixedFilters[HibernateTools.SEARCH_OPTION_CONSTANT] = 'PACOTES';
                }                           
            }

            if((!angular.isUndefined(_self.model.cdTipoInsumo)) && (_self.model.cdTipoInsumo != undefined) && (_self.model.cdTipoInsumo != 0)){
                _self.movementFixedFilters.cdTipoInsumo = _self.model.cdTipoInsumo;                           
            }                            
        }

        $scope.$watch('$viewContentLoaded', function () {
            
            _self.init();

            _self.fillInputTypes();           

            _self.setMovementFixedFilters();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }

    index.register.controller('hrc.document-advfil.Control', advancedFilterController);
});

