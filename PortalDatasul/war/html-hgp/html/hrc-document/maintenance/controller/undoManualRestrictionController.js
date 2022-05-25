define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/enumeration/billingValidationEnumeration.js',
    '/dts/hgp/html/enumeration/paymentValidationEnumeration.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    undoManualRestrictionController.$inject = ['$rootScope', '$scope', '$modalInstance', '$modal', 'hrc.document.Factory', 
                                               'disclaimers', 'document',  'movementsList', 'movementsNumbers', 'tmpUnselectedDocuments',
                                               'hrc.movement.Factory', 'TOTVSEvent']
    function undoManualRestrictionController($rootScope, $scope, $modalInstance, $modal, documentFactory, 
                                             disclaimers, document, movementsList, movementsNumbers, tmpUnselectedDocuments,
                                             movementFactory, TOTVSEvent) {

        var _self = this;
        this.model = {};
        this.model.documentKey = null;
        _self.hasSelectedRestricion = false;
        _self.restrictionDocuments = [];
        _self.restrictionMovements = [];
        _self.modalTitle = undefined;

        $scope.BILLING_VALIDATION_ENUM = BILLING_VALIDATION_ENUM;
        $scope.PAYMENT_VALIDATION_ENUM = PAYMENT_VALIDATION_ENUM;

        _self.billingValidationValues = BILLING_VALIDATION_ENUM.ENUMERATION_VALUES;
        _self.paymentValidationValues = PAYMENT_VALIDATION_ENUM.ENUMERATION_VALUES;

        _self.movementsNumbers = movementsNumbers;

        _self.restrictionsList = [];

        this.onRestricionSelect = function () {
            _self.hasSelectedRestricion = false;
            for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                if( _self.restrictionsList[i].$selected == true){
                    _self.hasSelectedRestricion = true;
                    break;
                }
            }
        };     

        this.openDocumentsRestrictions = function(restriction){
            if(angular.isUndefined(document) === false){
                _self.modalTitle = "Movimentos";
                _self.restrictionMovements = restriction.documentos[0].movimentos;
            }else{
                 _self.modalTitle = "Documentos";
                _self.restrictionDocuments = restriction.documentos;    
            }

            $(' .restrictionDiv').slideToggle();
        };    

        this.closeDocumentsRestriction = function(){
            $(' .restrictionDiv').slideToggle();
            _self.restrictionDocuments = [];
            _self.restrictionMovements = [];
        };

        this.init = function () {
            $(' .restrictionDiv').slideToggle();

            _self.cdTipoCob = 0;
            _self.cdTipoPagamento = 0;
            _self.lgValidacaoPosterior = false;

            if(angular.isUndefined(document) === false){
                _self.model.documentKey =  "Unidade Prestadora " + StringTools.fill(document.cdUnidadePrestadora, '0', 4) 
                                    + " | Transação "  + StringTools.fill(document.cdTransacao, '0', 4) 
                                    + " | Série "      + document.nrSerieDocOriginal
                                    + " | Número "     + StringTools.fill(document.nrDocOriginal, '0', 8)
                                    + " | Sequência "  + StringTools.fill(document.nrDocSistema, '0', 9);
            }

            if (angular.isUndefined(movementsList) == false){
                var disclaimersAux = [{property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'OnlyManualRestriction'}];

                movementFactory.getMultipleMovementsRestrictions(document.cdUnidade, document.cdUnidadePrestadora,
                        document.cdTransacao, document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema,
                        disclaimersAux, movementsList, function(result){
                            //Ordena a lista de glosas
                            _self.restrictionsList = result.sort(function(a, b) {
                                                        return a.cdClasseErro - b.cdClasseErro;
                                                     });
                });
            }else{
                var disclaimersAux = angular.copy(disclaimers);

                //Filtro para buscar as glosas validadas e nao validadas
                disclaimersAux.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'ValidatedMovements'});
                disclaimersAux.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'NotValidatedMovements'});

                //Filtro para buscar somente as glosas manuais
                disclaimersAux.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'OnlyManualRestriction'});

                documentFactory.getDocumentsRestrictions(disclaimersAux, tmpUnselectedDocuments, function(result){
                    //Ordena a lista de glosas
                    _self.restrictionsList = result.sort(function(a, b) {
                                                return a.cdClasseErro - b.cdClasseErro;
                                            });
                });
            }
        };        

        this.undoManualRestriction = function () {
            var tmpRestriction = [];

            for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                if( _self.restrictionsList[i].$selected == true){
                    tmpRestriction.push(_self.restrictionsList[i]);
                }
            }

            if(angular.isUndefined(movementsList) == false){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Desfazer a Glosa Manual',
                    text: 'Confirma Desfazer a Glosa Manual dos movimentos selecionados?',
                    cancelLabel: 'Cancelar',
                    confirmLabel: 'Confirmar',
                    callback: function(lgConfirmar) {
                        if(lgConfirmar){
                            movementFactory.processRestrictionsMultiple(document.cdUnidade, document.cdUnidadePrestadora,
                                document.cdTransacao, document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema,
                                _self.cdTipoCob, _self.cdTipoPagamento, _self.lgValidacaoPosterior, 
                                movementsList, tmpRestriction,
                                function (result) {
                                    $modalInstance.close(result);    
                                });
                        }
                    }
                });
                
            }else{
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Desfazer a Glosa Manual',
                    text: 'Confirma Desfazer a Glosa Manual dos documentos selecionados?',
                    cancelLabel: 'Cancelar',
                    confirmLabel: 'Confirmar',
                    callback: function(lgConfirmar) {
                        if(lgConfirmar){
                            documentFactory.undoManualRestriction(_self.lgValidacaoPosterior, _self.cdTipoCob, 
                                _self.cdTipoPagamento, disclaimers, tmpRestriction, tmpUnselectedDocuments,
                                function (result) {
                                    if(result.$hasError == true){
                                        return;
                                    }

                                    $modalInstance.close(result);    
                                });
                        }
                    }
                });
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hrc.undoManualRestriction.Control', undoManualRestrictionController);
});
