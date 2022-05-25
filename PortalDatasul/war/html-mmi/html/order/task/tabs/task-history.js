define(['index'], function(index) {

    historyListCtrl.$inject = [
        '$rootScope',	                          
        '$filter',
        '$scope',
        'TOTVSEvent',
        'fchmip.fchmip0066.Factory',
        'fchmip.fchmiporder.Factory'];
  
    function historyListCtrl($rootScope,
                             $filter,
                             $scope,
                             TOTVSEvent,
                             fchmip0066Factory,
                             fchmiporderFactory) {

        var historyCtrl = this;

        historyCtrl.history = [];
        
        this.openSupendHistory = function(task) {

            if (historyCtrl.history.length > 0){
                return;
            }

            var params = {'pNrOrdProdu': task['nr-ord-produ'],
                          'CodTarefa':   task['cd-tarefa']
            };

            fchmiporderFactory.getTarefaHistorico(params, function(result){

                if (result){
                    angular.forEach(result, function (value) {
                        value.data = $filter('date')(value.data, 'dd/MM/yyyy'); 
                        
                    });
                    historyCtrl.history = result;
                }
            });  
        }

        this.init = function() {
        }
        
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }    
        
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        
        // cria um listerner de evento para inicializar o toolListController somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });                   
    }

    index.register.controller('mmi.order.task.tabs.historyListCtrl', historyListCtrl);
});