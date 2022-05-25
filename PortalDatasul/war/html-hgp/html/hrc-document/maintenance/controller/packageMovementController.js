define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrc-movement/movementFactory.js'
], function (index) {

    packageMovementController.$inject = ['$scope', '$filter', 'hrc.movement.Factory', '$modalInstance', '$timeout' ,
                                         'selectedPackage', 'documentController', 'hrc.document.Factory', 
                                         'isEditable', 'TOTVSEvent'];
    function packageMovementController($scope, $filter, movementFactory, $modalInstance, $timeout,
                                       selectedPackage, documentController, documentFactory, 
                                       isEditable, TOTVSEvent) {
        
        var _self = this;
        $scope.StringTools = StringTools;
        this.package = {};
        this.documentController = documentController;
        this.isEditable = isEditable;

        this.init = function () {
           if((angular.isUndefined(selectedPackage.packageInputs) == true
            || selectedPackage.packageInputs == null)
            && (angular.isUndefined(selectedPackage.packageProcedures) == true
            || selectedPackage.packageProcedures == null)){

                movementFactory.getPackageWithMovements(selectedPackage,
                    function(result){
                        if(result){
                            _self.package = result;

                            if(angular.isUndefined(_self.documentController.movement.qtMovimento) == false){
                                _self.package.qtMovimento = _self.documentController.movement.qtMovimento; 
                            }
                            
                            _self.setValueLabels(_self.package.movementObject.nmTipoValorizacao, true);

                            documentController.setMovementsPercentages(_self.package.movementObject.dtLimite, 
                                _self.package.packageProcedures,
                                function(result){
                                    _self.package.packageProcedures = result;

                                    angular.forEach(_self.package.packageProcedures, 
                                        function(proc){
                                            proc.fatoresRedAcres.unshift(
                                                    {cdTipoPercentual: 0, rotuloTipPerc: '0 - Não Informado'});
                                            
                                            proc.providers = angular.copy(selectedPackage.providers);
                                    });

                                    angular.forEach(_self.package.packageInputs, 
                                        function(input){
                                            input.providers = angular.copy(selectedPackage.providers);
                                    });                                           
                                });  
                        }
                    });
            }else{
                _self.package = selectedPackage;

                _self.setValueLabels(_self.package.movementObject.nmTipoValorizacao, true);

                if (!_self.package.movementObject.lgPacoteIntercambio){
                    _self.documentController.syncPackageProviders(_self.package);
                }
            }

            documentController.setAccessWaysList();
            documentController.setTissTechniques();
        };

        this.setValueLabels = function(nmTipoValorizacao, isInit){
            if(angular.isUndefined(isInit) == true){
                for (var i = _self.package.packageProcedures.length - 1; i >= 0; i--) {
                    _self.package.packageProcedures[i].vlMovimento = undefined;
                }

                for (var i = _self.package.packageInputs.length - 1; i >= 0; i--) {
                    _self.package.packageInputs[i].vlMovimento = undefined;
                }
            }

            $timeout(function(){            
                var qtMovimentoAux = 1;
                if (!_self.package.movementObject.lgPacoteIntercambio){
                    qtMovimentoAux = _self.package.qtMovimento;
                }

                switch (nmTipoValorizacao){
                    case "Pagamento" :                        
                        _self.package.paymentTotalValueLabel  = $filter('currency')((_self.package.vlPagamento * qtMovimentoAux), 'R$');
                        _self.package.chargingTotalValueLabel = 'Sistema';
                        break;
                    case "Cobranca":
                        _self.package.paymentTotalValueLabel  = 'Sistema';
                        _self.package.chargingTotalValueLabel = $filter('currency')((_self.package.vlCobranca * qtMovimentoAux), 'R$');
                        break;
                    default :
                        _self.package.paymentTotalValueLabel  = $filter('currency')((_self.package.vlPagamento * qtMovimentoAux), 'R$'); 
                        _self.package.chargingTotalValueLabel = $filter('currency')((_self.package.vlCobranca * qtMovimentoAux), 'R$');
                        break;
                }
            });
        };

        this.onDivisionProviderSelect = function(prov){
            $timeout(function(){
                documentController.onDivisionProviderSelect(prov);
            },600);
        };

        this.getCbosSpecialtiesLabel = function (prov) {
            var label = 'Não Informado';

            angular.forEach(prov.honoProvCbosSpecialties, function(cbosSpecialties){
                if(cbosSpecialties.cdCboEspecialid == prov.cdCboEspecialidHono){
                    label = cbosSpecialties.dsCboEspecialid;
                }
            }); 

            return label;
        };

        this.openMovementDetails = function (movement) {
            documentController.openMovementDetails(movement, movement.providers[0]);
        };
        
        this.openMovementRestrictions = function (movement) {
            documentController.openMovementRestrictions(movement, movement.providers[0]);
        };

        this.cancel = function () {
            $modalInstance.close(_self.package);
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
        
        return this;
    }
    index.register.controller('hrc.packageMovementController', packageMovementController);
});
