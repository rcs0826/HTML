define(['index',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',    
    '/dts/hgp/html/hrc-transaction/transactionZoomController.js',
    '/dts/hgp/html/hcg-unit/unitZoomController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    //advancedFilterController.$inject = ['AbstractAdvancedFilterController'];
    function advancedFilterController($rootScope, $scope, $modalInstance, $timeout, disclaimers, AbstractAdvancedFilterController, TOTVSEvent) {

        var _self = this;
        this.model = {};

        this.disclaimers = disclaimers;
        $scope.DOCUMENTOS_AVISOS_STATUS_EXP_ENUM = DOCUMENTOS_AVISOS_STATUS_EXP_ENUM;
        _self.today = new Date();        
        _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};
        _self.disabledFieldUnidade = false;
        _self.disabledFieldBenef = false;
        /*Metodo para buscar o label do status que foi selecionado na busca avancada*/
        this.getLabelStatusByKey = function(value){
            return DOCUMENTOS_AVISOS_STATUS_EXP_ENUM.getLabelByKey(value);
        };

        this.changeCdUnidade = function(){
            if (this.model.cdUnidade  == ""
            || this.model.cdUnidade == null){
                _self.disabledFieldBenef = false;
            }else{
                _self.disabledFieldBenef = true;
            }
        }

        this.changeCarteira = function(){
            if (this.model.cdUnidCdCarteiraUsuario == ""){
                _self.disabledFieldUnidade = false;
            }else{
                _self.disabledFieldUnidade = true;
            }
        }

        this.filtersConfig = [
            {property: 'numLote',        title: 'Numero Lote', modelVar: 'numLote'},
            {property: 'datGeracIni',    title: 'Data Geracao Inicial', modelVar: 'datGeracIni', isDate: true},
            {property: 'datGeracFim',    title: 'Data Geracao Final', modelVar: 'datGeracFim', isDate: true},
            {property: 'datConhectoIni', title: 'Data Conhecimento Inicial', modelVar: 'datConhectoIni', isDate: true},
            {property: 'datConhectoFim', title: 'Data Conhecimento Final', modelVar: 'datConhectoFim', isDate: true},            
            {property: 'cdUnidCdCarteiraUsuario',  title: 'Carteira Beneficiario', modelVar: 'cdUnidCdCarteiraUsuario'},            
            {property: 'cdUnidade',       title: 'Unidade Carteira', modelVar: 'cdUnidade'},   
            {property: 'cdnUnidPrestdra', title: 'Unidade Prestadora', modelVar: 'cdnUnidPrestdra'}, 
            {property: 'cdTransacao',     title: 'Transação', modelVar: 'cdTransacao'}, 
            {property: 'nrSerieDocOriginal', title: 'Série', modelVar: 'nrSerieDocOriginal'}, 
            {property: 'nrDocOriginal',   title: 'Documento', modelVar: 'nrDocOriginal'},
            {property: 'nrCPF',           title: 'Código do Prestador', modelVar: 'nrCPF'},
            {property: 'nrGuiaPrestador', title: 'Numero Guia Prestador', modelVar: 'nrGuiaPrestador'},            
            {property: 'nrSituacao', title: 'Situacao', modelVar: 'nrSituacao', defaultValue: 0, 
                labelFunction: _self.getLabelStatusByKey} 
        ];
        

        this.search = function () {            
            /* GERACAO */ 
            if ((!angular.isUndefined(_self.model.datGeracIni) && _self.model.datGeracIni !== null)
             && (!angular.isUndefined(_self.model.datGeracFim) && _self.model.datGeracFim !== null)
             && (_self.model.datGeracFim < _self.model.datGeracIni)) {
                
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data Final da Geração deve ser maior que a Data Inicial'
                });
                return;
            };
            /* Conhecimento */
            if ((!angular.isUndefined(_self.model.datConhectoIni) && _self.model.datConhectoIni !== null)
             && (!angular.isUndefined(_self.model.datConhectoFim) && _self.model.datConhectoFim !== null)
             && (_self.model.datConhectoFim < _self.model.datConhectoIni)) {
                
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data Final de Conhecimento deve ser maior que a Data Inicial de Digitação'
                });
                return;
            };

            this.constructDisclaimers();
            $modalInstance.close(this.disclaimers);            
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            this.initialize();
        };

        $scope.$watch('$viewContentLoaded', function () {            
            _self.init();
        });

        $.extend(this, AbstractAdvancedFilterController);
    }

    index.register.controller('hrc.documentosExportAvisosCob-advfil.Control', advancedFilterController);
});

