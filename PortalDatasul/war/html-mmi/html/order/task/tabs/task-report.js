define(['index'], function(index) {

    reportListCtrl.$inject = [
        '$rootScope',	                          
        '$filter',
        '$scope',
        'TOTVSEvent',
        'fchmip.fchmip0066.Factory',
        'helperOrder'];
  
    function reportListCtrl($rootScope,
                            $filter,
                            $scope,
                            TOTVSEvent,
                            fchmip0066Factory,
                            helperOrder) {

        var reportCtrl = this;
        reportCtrl.report = [];
         	
        this.loadReport = function(task) {
            reportCtrl.pointingFilterVO = {
                nrOrdManut: task ? task['nr-ord-produ'] : helperOrder.data['nr-ord-produ'],
                initialTask: task ? task['cd-tarefa'] : helperOrder.data['current-task'],
                finalTask: task ? task['cd-tarefa'] : helperOrder.data['current-task'],
                initialSpeciality: "",
                finalSpeciality: "ZZZ",
                initialPointingCostCenter : "",   
                finalPointingCostCenter : "ZZZZZZZZ",                    
                showNotStartedTasks : true,            
                showStartedTasks : true,                 
                showStoppedTasks : true,                 
                showFinishedTasks : true,                
                showClusteredTasks : true,
                showClosedTasks : true
            }                

            fchmip0066Factory.loadLaborMaintenanceOrderRecord(reportCtrl.pointingFilterVO, function(result){
                
                if (result) {
                    angular.forEach(result, function (value) {
                        
                        value.initialHour = value.initialHour.split(':');
                        value.finishHour  = value.finishHour.split(':');
        
                        value.initialHour = value.initialHour[0] + ':' + value.initialHour[1];
                        value.finishHour  = value.finishHour[0] + ':' + value.finishHour[1];
                        
                        if (value.transactionType == 1) {
                            reportCtrl.transaction = $rootScope.i18n('l-report');
                        } else {
                            reportCtrl.transaction = $rootScope.i18n('l-reversal');
                        }
                        
                        reportCtrl.report.push({
                            cdTecnico    : $filter('tecnicoMask')(value.technicalCode),
                            nomeCompl    : value.technicalName,
                            cdEspecial   : value.specialityType,
                            ccCodigo     : value.costsCenter,
                            dataTrans    : $filter('date')(value.transactionDate, 'dd/MM/yyyy'),
                            hraInicio    : value.initialHour,
                            hraFinal     : value.finishHour,
                            horas        : $filter('number')(value.reportedHours, 4),
                            tipoTrans    : reportCtrl.transaction,
                            dataTransStr : value.transactionDateStr
                        });	                    
                    });	 
                }
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
            
        this.init = function() {
            reportCtrl.loadReport();
        }
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { 
            this.init(); 
        }
            
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
            
        // cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        });    
    }

    index.register.controller('mmi.order.task.tabs.reportListCtrl', reportListCtrl);
});