
define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',      
        '/dts/hgp/html/hrs-abiAnalysis/abiAnalysisFactory.js'
    ], function(index) {

    abiAnalysisAttendanceDetailController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 
                                                     'totvs.utils.Service', 'totvs.app-main-view.Service','$location',
                                                     'hrs.abiAnalysisAttendance.Factory', 'hrs.abiAnalysis.Factory',
                                                     'TOTVSEvent'];
    function abiAnalysisAttendanceDetailController($rootScope, $scope, $state, $stateParams,
                                                   totvsUtilsService, appViewService, $location, 
                                                   abiAnalysisAttendanceFactory, abiAnalysisFactory,
                                                   TOTVSEvent) {

        var _self = this;
        _self.abiAnalysisAttendance = {};  
        _self.abiAnalysis = {};  

        this.cleanModel = function (){
            _self.abiAnalysisAttendance = {};           
            _self.abiAnalysis = {};  
        }       

        this.init = function(){
            appViewService.startView("Análise do atendimento da ABI",
                                     'hrs.abiAnalysisAttendanceDetail.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            
            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.cdProtocoloAbi) 
            &&  !angular.isUndefined($stateParams.cdProtocoloAih)){
                abiAnalysisAttendanceFactory.prepareDataToMaintenanceWindow($stateParams.cdProtocoloAbi, $stateParams.cdProtocoloAih,             
                    function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.abiAnalysisAttendance = value;
                            });
                        }
                        _self.atualizaNomeTab();
                    });
                
                abiAnalysisFactory.prepareDataToMaintenanceWindow($stateParams.cdProtocoloAbi, 
                    function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.abiAnalysis = value;
                            });
                        }
                        _self.atualizaNomeTab();
                    });
            } 
        };

        this.atualizaNomeTab = function(){
            if (!angular.isUndefined(_self.abiAnalysisAttendance.dsTipo)){
                _self.nomeTab = _self.abiAnalysisAttendance.dsTipo;
                _self.nomeTab = _self.nomeTab + " ";
                _self.nomeTab = _self.nomeTab + _self.abiAnalysisAttendance.cdProtocoloAih;
            }
        };
        
        this.onCancel = function(){                    
            appViewService.removeView({active: true,
                                        name  : _self.nomeTab,
                                        url   : _self.currentUrl}); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
    }
    
    index.register.controller('hrs.abiAnalysisAttendanceDetail.Control', abiAnalysisAttendanceDetailController);    
});


