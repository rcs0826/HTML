define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/enumeration/billingValidationEnumeration.js',
    '/dts/hgp/html/enumeration/paymentValidationEnumeration.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/movementRestrictionsController.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    restrictionValidationController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                               'hrc.document.Factory', 'hrc.movement.Factory' , 'disclaimers', 
                                               'document', 'movementsList', 'movementsNumbers', 'tmpUnselectedDocuments', 'TOTVSEvent', '$modal']
    function restrictionValidationController($rootScope, $scope, $modalInstance, documentFactory, 
                                             movementFactory, disclaimers, document, movementsList,
                                             movementsNumbers, tmpUnselectedDocuments, TOTVSEvent) {

        var _self = this;
        this.model = {};
        this.model.documentKey = null;
        _self.model.lgConsideraOutrasGlosas = false;
        _self.model.lgRevalidacao = false;
        _self.hasSelectedRestricion = false;
        _self.restrictionDocuments = [];
        _self.restrictionMovements = [];
        _self.modalTitle = undefined;
        _self.movementsList = movementsList;
        _self.movementsNumbers = movementsNumbers;


        $scope.BILLING_VALIDATION_ENUM = BILLING_VALIDATION_ENUM;
        $scope.PAYMENT_VALIDATION_ENUM = PAYMENT_VALIDATION_ENUM;

        _self.billingValidationValues = BILLING_VALIDATION_ENUM.ENUMERATION_VALUES;
        _self.paymentValidationValues = PAYMENT_VALIDATION_ENUM.ENUMERATION_VALUES;

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
            
            _self.model.validationBilling = 0;
            _self.model.validationPayment = 0;
            
            if(angular.isUndefined(document) === false){
                _self.model.documentKey =  "Unidade Prestadora " + StringTools.fill(document.cdUnidadePrestadora, '0', 4) 
                                    + " | Transação "  + StringTools.fill(document.cdTransacao, '0', 4) 
                                    + " | Série "      + document.nrSerieDocOriginal
                                    + " | Número "     + StringTools.fill(document.nrDocOriginal, '0', 8)
                                    + " | Sequência "  + StringTools.fill(document.nrDocSistema, '0', 9);
            }

            if (angular.isUndefined(movementsList) == true){
                var disclaimersAux = angular.copy(disclaimers);
                //Filtro para buscar todos os movimentos não validados
                disclaimersAux.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'NotValidatedMovements'});

                documentFactory.getDocumentsRestrictions(disclaimersAux, tmpUnselectedDocuments, function(result){
                    //Ordena a lista de glosas
                    _self.restrictionsList = result.sort(function(a, b) {
                                                return a.cdClasseErro - b.cdClasseErro;
                                            });
                });
            }
        };        

        this.save = function () {
            if (angular.isUndefined(movementsList) == false){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Validação de Glosas',
                    text: 'Confirma a VALIDAÇÃO dos movimentos selecionados?',
                    cancelLabel: 'Cancelar',
                    confirmLabel: 'Confirmar',
                    callback: function(lgConfirmar) {
                        if(lgConfirmar){
                            movementFactory.applyRestrictionValidationMultiple(document.cdUnidade, document.cdUnidadePrestadora,
                                document.cdTransacao, document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema,
                                _self.model.validationBilling, _self.model.validationPayment, movementsList,
                            function (result) {
                                if(result.$hasError == true){
                                    return;
                                }

                                $modalInstance.close(result);    
                            });
                        }
                    }
                });
            }else{
                var tmpRestriction = [];
                var message = "";

                for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                    if( _self.restrictionsList[i].$selected == true){
                        tmpRestriction.push(_self.restrictionsList[i]);
                    }
                }

                if(_self.model.lgRevalidacao == false){
                    message = 'Confirma a VALIDAÇÃO dos documentos selecionados?';
                }else{
                    message = 'Confirma a REVALIDAÇÃO e VALIDAÇÃO dos documentos selecionados?';
                }

                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Validação de Glosas',
                    text: message,
                    cancelLabel: 'Cancelar',
                    confirmLabel: 'Confirmar',
                    callback: function(lgConfirmar) {
                        if(lgConfirmar){
                            documentFactory.applyRestrictionValidationMultiple(disclaimers,
                                _self.model.lgConsideraOutrasGlosas, _self.model.lgRevalidacao,
                                _self.model.validationBilling, _self.model.validationPayment,
                                tmpRestriction, tmpUnselectedDocuments,
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

        this.onMovementsRevalidationChange = function () {
            var disclaimersAux = angular.copy(disclaimers);

            if(_self.model.lgRevalidacao == true){
                //Filtro para buscar todos os movimentos validados
                disclaimersAux.push({property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'ValidatedMovements'});

                documentFactory.getDocumentsRestrictions(disclaimersAux, tmpUnselectedDocuments, function(result){
                    //Adiciona os movimentos ja validados na lista dos nao validados
                    _self.restrictionsList = _self.restrictionsList.concat(result);
                    //Ordena a lista de glosas
                    _self.restrictionsList.sort(function(a, b) {
                                                   return a.cdClasseErro - b.cdClasseErro;
                                                });
                });
            }else{
                //Remove os movimentos validados da lista.
                for (var i = _self.restrictionsList.length - 1; i >= 0; i--) {
                    if(_self.restrictionsList[i].lgValidada == true){
                        _self.restrictionsList.splice(i, 1);
                    }
                }
            }
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hrc.restrictionValidation.Control', restrictionValidationController);
});
