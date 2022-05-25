define(['index'], function(index) {

    historyListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
    	'TOTVSEvent',
    	'fchmip.fchmiporder.Factory',
    	'helperHistory'
    ];

    function historyListController ($rootScope, 
    				 			    $scope,    	
    				 			    $filter,
    							    TOTVSEvent,
    							    fchmiporderFactory,
    							    helperHistory) {

    	var historyCtrl = this;
    	
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        /**
         * Lista histórico da ordem
         */
        historyCtrl.loadDataGridHistory = function() {
        	
        	if (detailOrderCtrl.reloadHistory) {
        		$scope.listOfHistory = undefined;
                detailOrderCtrl.reloadHistory = false;
        	}
        	
        	if ($scope.listOfHistory) return;
        	
        	$scope.listOfHistory = [];
        	
        	fchmiporderFactory.getOrderHistory(detailOrderCtrl.model['nr-ord-produ'], function(result){
        		
        		$scope.listOfHistory = helperHistory.data;
        		$scope.listOfHistory.length = 0;
        		        		
        		if (result) {
                    angular.forEach(result, function (value) {
                    	value.data = $filter('date')(value.data, 'dd/MM/yyyy'),
                    	$scope.listOfHistory.push(value);
                    });
                    detailOrderCtrl.reloadHistory = false;                    
        		}
        	});           
        }       
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         
        this.init = function() {
        }
         
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }    
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }

    index.register.controller('mmi.order.history.HistoryListCtrl', historyListController);
});