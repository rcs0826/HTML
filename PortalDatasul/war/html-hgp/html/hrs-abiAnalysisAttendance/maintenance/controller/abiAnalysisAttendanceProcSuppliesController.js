define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/procedureEditionController.js',
], function (index) {

    abiAnalysisAttendanceProcSuppliesController.$inject = ['$rootScope', '$scope','$modalInstance', '$state',  '$location', '$modal',
                                                           'TOTVSEvent', 
                                                           'hrs.abiAnalysisAttendance.Factory',
                                                           'cdProtocoloAbi', 'cdProtocoloAih', 'analisysAttendance','abiAnalysis', 'idPermissao'];
    function abiAnalysisAttendanceProcSuppliesController($rootScope, $scope, $modalInstance, $state,  $location, $modal,
                                                         TOTVSEvent,  
                                                         abiAnalysisAttendanceFactory,
                                                         cdProtocoloAbi, cdProtocoloAih, analisysAttendance, abiAnalysis, idPermissao) {

        var _self = this;
        _self.model = {}; 
        _self.abiAnalysisAttendanceProcedures = [];
        _self.idPermissao = idPermissao;
        
        $scope.StringTools = StringTools;
        
        _self.listItemInfoClasses2col = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.listItemInfoClasses3col = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClasses4col = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.listItemInfoClasses6col = "col-sm-2 col-md-2 col-lg-2 col-sm-height";
        
        
        //_self.abiAnalysisAttendance = {}; 
        //_self.abiAnalysis = {}; 

        this.cdProtocoloAbi = cdProtocoloAbi;
        this.cdProtocoloAih = cdProtocoloAih;
        _self.abiAnalisysAtendance = analisysAttendance;
        _self.abiAnalysis = abiAnalysis;


        
        this.cleanModel = function (){
            _self.abiAnalysisAttendance = {};           
            _self.abiAnalysis = {};  
        } 
        

        this.save = function () {
            abiAnalysisAttendanceFactory.saveAbiAnalysisAttendanceProcedures(this.cdProtocoloAbi, 
                                                                             this.cdProtocoloAih,
                                                                             _self.abiAnalysisAttendanceProcedures);

            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success', title: 'Dados salvos com sucesso'});

            $modalInstance.dismiss('cancel');
        };
        
        

        this.cancel = function () {

            $modalInstance.dismiss('cancel');
            
        };

        this.init = function () {

            var sVar = "";

            _self.cleanModel(); 
            
            _self.currentUrl = $location.$$path;
            
            _self.abiAnalisysAtendance = analisysAttendance;
            _self.abiAnalysis = abiAnalysis;
            
                
            if (!angular.isUndefined(this.cdProtocoloAbi) 
            &&  !angular.isUndefined(this.cdProtocoloAih)){
                
                abiAnalysisAttendanceFactory.getAbiAnalysisAttendanceProcedures(this.cdProtocoloAbi, this.cdProtocoloAih,
                    function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                sVar = value.dsProcedure;
                                value.dsProcedureReduz = sVar.substring(0, 25);

                                _self.abiAnalysisAttendanceProcedures.push(value);
                            });
                        }
                    });
            }
            
        };
        
        this.atualizaNomeTab = function(){
            if (!angular.isUndefined(_self.abiAnalysisAttendance.dsTipo)){
                _self.nomeTab = _self.abiAnalysisAttendance.dsTipo;
            }
        };

        /*
         *  É recebido da tela o registro do procedimento ==> backdrop: 'static',
         */
        this.editProcedure = function(procedure){
            var EditProcedure = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/procedureEdition.html', 
                size: 'lg',
                
                controller: 'hrs.procedureEdition.control as controller',
                resolve: {
                    procedure : function(){
                        return procedure;
                    },
                    procedureList :function(){
                        return _self.abiAnalysisAttendanceProcedures;
                    }
                }
            });
            
            EditProcedure.result.then(function (proceduresList) {
                 _self.abiAnalysisAttendanceProcedures = proceduresList;
            });
        }

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceProcSuppliesController);
    }

    index.register.controller('hrs.abiAnalysisAttendanceProcSupplies.control', abiAnalysisAttendanceProcSuppliesController);
});


