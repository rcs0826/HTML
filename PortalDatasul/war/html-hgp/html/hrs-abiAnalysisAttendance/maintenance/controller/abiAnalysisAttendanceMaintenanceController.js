define(['index',  
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',  
        '/dts/hgp/html/hrs-situation/situationFactory.js',    
        '/dts/hgp/html/hrs-permissionSituation/permissionSituationFactory.js',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceMovementRestrictionsController.js',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/impugnationMotiveModalController.js',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/attendanceErrors/controller/attendanceErrorsModalController.js',
        '/dts/hgp/html/js/util/StringTools.js',      
        '/dts/hgp/html/util/customFilters.js',       
        '/dts/hgp/html/enumeration/attendanceStatusEnumeration.js',
    ], function(index) {

    abiAnalysisAttendanceMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', '$modal',
                                                         'totvs.utils.Service', 'totvs.app-main-view.Service',
                                                         '$location',
                                                         'hrs.abiAnalysisAttendance.Factory',
                                                         'hrs.situation.Factory',        
                                                         'hrs.permissionSituation.Factory',
                                                         'TOTVSEvent'];
    function abiAnalysisAttendanceMaintenanceController($rootScope, $scope, $state, $stateParams,$modal,
                                                     totvsUtilsService, appViewService,
                                                      $location, 
                                                      abiAnalysisAttendanceFactory,
                                                      situationFactory, 
                                                      permissionSituationFactory,
                                                       TOTVSEvent) {
        
        $scope.ATTENDANCE_STATUS_ENUM = ATTENDANCE_STATUS_ENUM;

        var _self = this;        

        _self.abiAnalysisAttendance = {};
        _self.abiAnalysisAttendance.cddAtendim = 0;
        _self.cddRessusAbiAtendim   = 0;
        _self.codProcesso           = "";
        _self.codAbi                = "";
        _self.listOfPermissionSituation = [];
        _self.abiAnalysisAttendanceProcedures = []; 

        _self.tmpRessusAbiPrestdor = {};
        _self.tmpRessusAbiProced   = [];
        _self.tmpRessusAbiBenef    = {};


        _self.listOfMovements        = [];
        _self.listOfProcedimentos  = [];
        _self.listOfInsumos        = [];
        _self.listOfPrimaryMovements = [];
        _self.listOfSecondaryMovements = [];
        _self.listOfSpecialMovements = [];


        _self.procInsu = false;
        _self.princSec = false;

        _self.radio = 1;
        _self.options = [{value: 1, label: '1', disabled: false},
                         {value: 2, label: '2', disabled: false},
                         {value: 3, label: '3', disabled: false},
                         {value: 4, label: '4', disabled: false}];


        this.cleanModel = function (){                  
            _self.listOfPermissionSituation = [];
            _self.abiAnalysisAttendance = {};
            _self.abiAnalysisAttendance.cddAtendim = 0;
            _self.codProcesso           = "";
            _self.codAbi                = "";
            _self.cddRessusAbiAtendim   = 0;
            _self.tmpRessusAbiPrestdor = {};
            _self.tmpRessusAbiProced   = [];
            _self.tmpRessusAbiBenef    = {};
            

            _self.listOfMovements        = [];
            _self.listOfProcedimentos  = [];
            _self.listOfInsumos        = [];
            _self.listOfPrimaryMovements = [];
            _self.listOfSecondaryMovements = [];
            _self.listOfSpecialMovements = [];

        };

        this.init = function(){
            appViewService.startView("Manutenção de Atendimento",
                                     'hrs.ressusAbiImportationMaintenance.Control', 
                                     _self); 

            this.cleanModel();
            _self.cddRessusAbiAtendim   = $stateParams.cddRessusAbiAtendim;
            _self.codProcesso           = $stateParams.codProcesso.replace('.','/');
            _self.codAbi                = $stateParams.codAbi;

            _self.currentUrl = $location.$$path;

            situationFactory.getSituationByFilter('', 0, 0, true, [], function (result) {                    
                _self.listOfSituation = result;
                for(var i = 0; i < _self.listOfSituation.length; i++){
                    var situation = _self.listOfSituation[i];
                    situation.value = situation.idSituacao;
                    situation.label = situation.nmSituacao;
                }
            });

            permissionSituationFactory.getPermissionSituationSecurityByUser(function (result) { 
                angular.forEach(result, function (value) {
                    if (value.cdnPermis > 0){ 
                        _self.listOfPermissionSituation.push(value);                        
                    }
                });
            });

            abiAnalysisAttendanceFactory.getRessusAbiAtendimData(_self.cddRessusAbiAtendim, function (result) {
                if (result) {  
                    _self.tmpRessusAbiPrestdor  = result.tmpRessusAbiPrestdor[0];                            
                    _self.tmpRessusAbiBenef     = result.tmpRessusAbiBenef[0];
                    _self.abiAnalysisAttendance = result.tmpRessusAbiAtendim[0];

                    angular.forEach(result.tmpRessusAbiProced, function (movtoSUS) {   

                        angular.forEach(result.tmpMovementRessus, function (movtoRC) {  
                     
                            if(movtoRC.cddRessusAbiProced === movtoSUS.cddRessusAbiProced){
                                movtoSUS.movtoRC = movtoRC;
                            }
                            
                        });

                        if(angular.isUndefined(movtoSUS.movtoRC)
                        || movtoSUS.movtoRC == null){ 
                            movtoRC = {};
                            movtoRC.codMovimento = 0;
                            movtoRC.dsMovimento = "Sem conversão"
                            movtoSUS.movtoRC = movtoRC;
                        }

                        _self.listOfMovements.push(movtoSUS);

                        if(movtoSUS.indTipMovto !== "0"){
                            _self.listOfInsumos.push(movtoSUS);      
                        }else{
                            _self.listOfProcedimentos.push(movtoSUS);      
                        }


                        if(movtoSUS.indTipServRessus === "P"){
                            _self.listOfPrimaryMovements.push(movtoSUS);      
                        }else if(movtoSUS.indTipServRessus === "S"){
                            _self.listOfSecondaryMovements.push(movtoSUS);    
                        }else{
                            _self.listOfSpecialMovements.push(movtoSUS);      
                        }
                    });
                }
            });
        };

        this.editMovement = function(movement){
            var action = _self.abiAnalysisAttendance.idiStatus < ATTENDANCE_STATUS_ENUM.AGUARDANDO_PAGAMENTO 
                         && _self.abiAnalysisAttendance.documentKey != '' ? 'EDIT' : 'DETAIL';

            var editMovementModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceMovementMaintenance.html', 
                size: 'lg',
                controller: 'hrs.abiAnalysisAttendanceMovementMaintenance.control as controller',
                resolve: {
                    movement : function(){
                        return movement;
                    },
                    action: function(){
                        return action;
                    },
                    abiAnalysisAttendanceMaintenanceController: function(){
                        return _self;
                    },
                }
            });
        };
        
        this.buscaPermissao = function(){

            var cdnPermisAux = false;

            angular.forEach(_self.listOfPermissionSituation, function (item) {
                if (item.idiStatus ==  _self.abiAnalysisAttendance.idiStatus 
                    && (item.idiSubStatus * 1) ==  _self.abiAnalysisAttendance.idiSubStatus
                    && item.cdnPermis == 2){

                    cdnPermisAux = true;
                }
            });

            return cdnPermisAux;
        };

        this.onCancel = function(){                    
            appViewService.removeView({active: true,
                                        name  : _self.nomeTab,
                                        url   : _self.currentUrl}); 
            
        };

        this.save = function(){

            return;
            abiAnalysisAttendanceFactory.saveAttendanceData(true, _self.abiAnalysisAttendance,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Dados salvos com sucesso'
                    });            
            });

        };

        this.saveClose = function(){
            abiAnalysisAttendanceFactory.saveAttendanceData(true, _self.abiAnalysisAttendance,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Dados salvos com sucesso'
                    });       
                    
                     appViewService.removeView({active: true,
                                                name  : _self.nomeTab,
                                                url   : _self.currentUrl});                     
            });
        };

        this.openMovementRestrictions = function(movto){

            var movementRestriction = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiAnalysisAttendanceMovementRestrictions.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiAnalysisAttendanceMovementRestrictions.Control as controller',
                resolve: {
                            movto: function () {
                                return movto;
                         }
                }

            });
        };

        this.openMovementImpugnationMotive = function(movto){

            var movementImpugnationMotive = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/impugnationMotiveModal.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.impugnationMotiveModalController.Control as controller',
                resolve: {
                            movto: function () {
                                return movto;
                            },
                            attendance: function(){
                                return undefined;
                            },
                            cddRessusAbiDados : function(){
                                return undefined;
                            }
                         }   

            });
        };

        this.openMovementErrors = function(cddRessusAbiProced){
             abiAnalysisAttendanceFactory.getErrors(0,cddRessusAbiProced,
                function (result) {

                    if(result.$hasError == true){
                        return;
                    }

                    if (result) {
                         var attendanceErrors = $modal.open({
                            animation: true,
                            templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/attendanceErrors/ui/attendanceErrorsModal.html',
                            size: 'lg',
                            backdrop: 'static',
                            controller: 'hrs.attendanceErrorsModal.Control as controller',
                            resolve: {
                                        errorList: function () {
                                            return result;
                                     }
                            }

                        });
                    }
            });
        }

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
    }
    
    index.register.controller('hrs.abiAnalysisAttendanceMaintenance.Control', abiAnalysisAttendanceMaintenanceController);    
});


