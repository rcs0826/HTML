define(['index',    
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
    '/dts/hgp/html/enumeration/documentosImportAvisosCobStatusEnumeration.js',
    '/dts/hgp/html/hrc-transaction/transactionZoomController.js',
    '/dts/hgp/html/hcg-unit/unitZoomController.js',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js'
], function (index) {

    noticeBillingImportAdvancedFilterController.$inject = ['$rootScope', '$scope','$modalInstance','disclaimers', 'AbstractAdvancedFilterController','TOTVSEvent'];
    function noticeBillingImportAdvancedFilterController($rootScope, $scope, $modalInstance, disclaimers, AbstractAdvancedFilterController,TOTVSEvent) {

        var _self = this;
        this.model = {}; 
        
        this.disclaimers = disclaimers;
        $scope.DOCUMENTOS_AVISOS_STATUS_IMP_ENUM = DOCUMENTOS_AVISOS_STATUS_IMP_ENUM;

        _self.today = new Date();
        _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};

        this.filtersConfig = [
            {property: 'datConhectoInic', title: 'Data de Conhecimento Inicial', modelVar: 'datConhectoInic', isDate: true},
            {property: 'datConhectoFim', title: 'Data de Conhecimento Final', modelVar: 'datConhectoFim', isDate: true},
            {property: 'cdnUnidOrig', title: 'Unidade', modelVar: 'cdnUnidOrig'},
            {property: 'codPrestdorExecut', title: 'Prestador', modelVar: 'codPrestdorExecut'},
            {property: 'codLotePrestdor', title: 'Lote Prestador', modelVar: 'codLotePrestdor'},
            {property: 'codGuiaPrestdor', title: 'Guia Prestador', modelVar: 'codGuiaPrestdor'},    
            {property: 'cdUnidCdCarteiraUsuario',  title: 'Carteira Beneficiario', modelVar: 'cdUnidCdCarteiraUsuario'},  
            {property: 'numLote', title: 'Número do Lote GPS', modelVar: 'numLote'}, 
            {property: 'cdnUnidPrestdra', title: 'Unidade Prestadora', modelVar: 'cdnUnidPrestdra'}, 
            {property: 'cdnTrans', title: 'Transação', modelVar: 'cdnTrans'}, 
            {property: 'codSerDoctoOrigin', title: 'Série', modelVar: 'codSerDoctoOrigin'}, 
            {property: 'numDoctoOrigin', title: 'Documento', modelVar: 'numDoctoOrigin'},
            {property: 'indSit', title: 'Situação do Aviso', modelVar: 'indSit', defaultValue: 0},
        ];

        this.search = function () {

            var isValid = true;    

            if (   (!angular.isUndefined(_self.model.datConhectoInic) && _self.model.datConhectoInic !=='')
                && (!angular.isUndefined(_self.model.datConhectoFim) && _self.model.datConhectoFim !=='')
                && (_self.model.datConhectoInic > _self.model.datConhectoFim) ){
                
                isValid = false;
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Data de Conhecimento final deve ser maior que inicial'
                });
            }         

            if (isValid === true) {          

                var arrayLength = this.disclaimers.length - 1;
                for (var i = arrayLength ; i >= 0 ; i--) {
                    this.disclaimers.splice(i, 1);
                }      
                this.constructDisclaimers();
                $modalInstance.close(this.disclaimers);
            }
        };

        this.changeRange = function (sourceField,observerField) {            

            if (angular.isUndefined(_self.model[observerField]) 
            || _self.model[observerField] == ''
            || _self.model[observerField] == _self.model[sourceField]){
                _self.model[observerField] = _self.model[sourceField];        
            }
        };

        // cleanFields
        this.cleanFields = function () {
            var _self = this;
            angular.forEach(this.filtersConfig, function (conf) {
                if (angular.isUndefined(conf.defaultValue) == true) {
                    if(conf.isDate == true){
                        _self.model[conf.modelVar] = undefined;
                    }else{
                        _self.model[conf.modelVar] = '';
                    }
                } else {
                    _self.model[conf.modelVar] = conf.defaultValue;
                }
            });
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

    index.register.controller('hrc.noticeBillingImportAdvFilter.Control', noticeBillingImportAdvancedFilterController);
});


