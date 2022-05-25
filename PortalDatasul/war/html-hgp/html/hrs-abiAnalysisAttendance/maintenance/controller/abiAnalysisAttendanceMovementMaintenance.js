define(['index', 
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-assocvaConverMovto/assocvaConverMovtoFactory.js',
    '/dts/hgp/html/js/util/StringTools.js',
], function (index) {

    abiAnalysisAttendanceMovementMaintenanceController.$inject = ['$rootScope', '$scope','$modalInstance', '$state',  '$location',
                                          'TOTVSEvent', 
                                          '$timeout',
                                          'hrs.abiAnalysisAttendance.Factory',
                                          'hrs.assocvaConverMovto.Factory',
                                          'movement', 'action','abiAnalysisAttendanceMaintenanceController'];
    function abiAnalysisAttendanceMovementMaintenanceController($rootScope, $scope, $modalInstance, $state,  $location,
                                        TOTVSEvent,  
                                        $timeout,
                                        abiAnalysisAttendanceFactory,
                                        assocvaConverMovtoFactory,
                                        movement, action,abiAnalysisAttendanceMaintenanceController) {

        var _self = this;
        
        _self.movement = angular.copy(movement);
        _self.action = action;
        _self.abiAnalysisAttendanceMaintenanceController = abiAnalysisAttendanceMaintenanceController;
        _self.indTipServRessus = "";
        _self.listOfAssocvaConverMovto = [];
        _self.selectedMovement = {};
        
        $scope.StringTools = StringTools;
        
        _self.listItemInfoClasses2col = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.listItemInfoClasses3col = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClasses4col = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.listItemInfoClasses6col = "col-sm-2 col-md-2 col-lg-2 col-sm-height";

        this.save = function () {

            abiAnalysisAttendanceFactory.editMovement(_self.movement,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Dados salvos com sucesso'
                    });            

                    $modalInstance.dismiss('cancel');
                    _self.abiAnalysisAttendanceMaintenanceController.init();


            });
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {            
            _self.indTipMovtoAux = _self.movement.indTipMovto;
            _self.cddMovtoAux     = _self.movement.cddMovto;

            _self.currentUrl = $location.$$path;
            _self.indTipServRessus = (movement.indTipServRessus === 'P' ? 'Principal'  :
                                     (movement.indTipServRessus === 'S' ? 'Secundário' :
                                     (movement.indTipServRessus === 'E' ? 'Especial'   :
                                      movement.indTipServRessus)));
            
            disclaimers = [];
            filter = {};

            filter.property = 'cddMovtoExt';
            filter.value = _self.movement.cddServRessus;
            disclaimers.push(filter);

            assocvaConverMovtoFactory.getAssocvaConverMovtoByFilter('', 0, 0, true, disclaimers,
                function (result) { 

                    if (result) {

                        angular.forEach(result, function (value) {

                            assocvaConverMovto = {};

                            if(value.codIndicador === '1'){
                                assocvaConverMovto.value = "00" + StringTools.fill(value.cdProcedimentoCompleto,0,8);
                                assocvaConverMovto.label = StringTools.fill(value.cdProcedimentoCompleto,0,8) + ' - ' + value.rotuloGPS;
                            }else{
                                assocvaConverMovto.value = StringTools.fill(value.cdTipoInsumo,0,2) + StringTools.fill(value.cdInsumo,0,8) ;
                                assocvaConverMovto.label = StringTools.fill(value.cdTipoInsumo,0,2) + ' ' + StringTools.fill(value.cdInsumo,0,8) + ' - ' + value.rotuloGPS;
                            }

                            _self.listOfAssocvaConverMovto.push(assocvaConverMovto);

                        }); 

                        _self.selectedMovement = StringTools.fill(_self.movement.indTipMovto,0,2) 
                                               + StringTools.fill(_self.movement.cddMovto,0,8);
                    }
                    if(_self.action == 'EDIT'){
                        _self.action = _self.listOfAssocvaConverMovto.length > 0 ? 'EDIT' : 'DETAIL';
                    }
            });
        }; 

        this.onCalculateRestrictionValue = function () {
            _self.movement.valGlosado = _self.movement.valProcedimento - _self.movement.valDeferido;

            if(_self.movement.valGlosado < 0){
                _self.movement.valGlosado = 0;
            }
        };

        this.onSelectedMovement = function(){
            $timeout(function(){
                if (angular.isUndefined(_self.selectedMovement) || _self.selectedMovement == null){
                    _self.movement.indTipMovto = _self.indTipMovtoAux;
                    _self.movement.cddMovto = _self.cddMovtoAux;
                } else {
                    _self.movement.indTipMovto = _self.selectedMovement.substring(0,2);
                    _self.movement.cddMovto = _self.selectedMovement.substring(2,10);
                }
            });
        };


        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceMovementMaintenanceController);
    }

    index.register.controller('hrs.abiAnalysisAttendanceMovementMaintenance.control', abiAnalysisAttendanceMovementMaintenanceController);
});


