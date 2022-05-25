define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/hrc-document/maintenance/controller/restrictionZoomController.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js',
    '/dts/hgp/html/enumeration/billingValidationEnumeration.js',
    '/dts/hgp/html/enumeration/paymentValidationEnumeration.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    manualRestrictionController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                           'hrc.document.Factory', 'hrc.movement.Factory', 'disclaimers', 
                                           'document', 'movementsList', 'movementsNumbers', 'tmpUnselectedDocuments',
                                           'hrc.global.Factory', 'TOTVSEvent']
    function manualRestrictionController($rootScope, $scope, $modalInstance, documentFactory, 
                                          movementFactory, disclaimers, document, movementsList, 
                                          movementsNumbers, tmpUnselectedDocuments, hrcGlobalFactory, TOTVSEvent) {

        var _self = this;
        _self.documentKey = null;
        _self.manualRestriction = {};
        _self.movementsNumbers = movementsNumbers;
        $scope.BILLING_VALIDATION_ENUM = BILLING_VALIDATION_ENUM;
        $scope.PAYMENT_VALIDATION_ENUM = PAYMENT_VALIDATION_ENUM;

        _self.filters = {dtLimite     : new Date().getTime(),
                        lgGlosaFracionamento : false,
                        lgCancelado: false,
                        lgGlosaManual: true,
                        SEARCH_OPTION: "canGenerateRestriction"};

        _self.billingValidationValues = BILLING_VALIDATION_ENUM.ENUMERATION_VALUES;
        _self.paymentValidationValues = PAYMENT_VALIDATION_ENUM.ENUMERATION_VALUES;

        this.init = function () {
            _self.cdTipoCob = 0;
            _self.cdTipoPagamento = 0;
            _self.lgValidacaoPosterior = false;
            
            if(angular.isUndefined(document) === false){
                _self.documentKey = "Unidade Prestadora " + StringTools.fill(document.cdUnidadePrestadora, '0', 4) 
                                  + " | Transação "       + StringTools.fill(document.cdTransacao, '0', 4) 
                                  + " | Série "           + document.nrSerieDocOriginal
                                  + " | Número "          + StringTools.fill(document.nrDocOriginal, '0', 8)
                                  + " | Sequência "       + StringTools.fill(document.nrDocSistema, '0', 9);
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        //Chama ao selecionar uma glosa manual no zoom
        this.onSelectRestriction = function (){
			if (_self.manualRestriction === null) {
				_self.manualRestriction = {};
			}
			
			hrcGlobalFactory.getRestrictionByFilter(_self.manualRestriction.cdCodGlo, 0, 0, false,
			[{property: 'cdClasseErro', value: _self.manualRestriction.cdClasseErro, priority: 1}],
                  function(result){
                    if(result[0]){
                        _self.selectedRestriction = result[0];
    
                    }
                });
        };

        this.save = function () {
            if (angular.isUndefined(_self.manualRestriction.cdCodGlo)) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title:  'Glosa não informada'
                });
                return;
            }

            if(angular.isUndefined(movementsList) == true){
                documentFactory.applyManualRestriction(disclaimers, _self.cdTipoCob, _self.cdTipoPagamento,
                    _self.lgValidacaoPosterior, _self.manualRestriction, tmpUnselectedDocuments,
                    function (result) {
                        $modalInstance.close(result);
                });
            }else{
                _self.manualRestriction.lgGlosaPrincipal = true; //Trocar pelo Parametro de Tornar Glosa Manual Principal

                movementFactory.applyManualRestrictionMultipleMovements(document.cdUnidade, document.cdUnidadePrestadora,
                                 document.cdTransacao, document.nrSerieDocOriginal, document.nrDocOriginal, document.nrDocSistema, 
                                 _self.cdTipoCob, _self.cdTipoPagamento, _self.lgValidacaoPosterior, 
                                 movementsList, _self.manualRestriction, 
                    function (result) {
                       $modalInstance.close(result);     
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
    
    index.register.controller('hrc.manualRestriction.Control', manualRestrictionController);
});
