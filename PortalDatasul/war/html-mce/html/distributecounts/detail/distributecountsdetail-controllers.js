define([
	'index',
	'angularAMD',	 
    '/dts/mce/js/mce-utils.js'  
], function (index) {

    distributeCountsDetailCtrl.$inject = ['$rootScope', '$scope','$scope', 'totvs.app-main-view.Service', '$filter', '$stateParams','mce.fchmatdistributecounts.factory','$location','mce.utils.Service','TOTVSEvent'];

    function distributeCountsDetailCtrl($rootScope, $scope, $state, appViewService, $filter, $stateParams,fchmatDistributeCounts,$location,mceUtils, TOTVSEvent){
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
    	
    	var controller = this;
        controller.fchmatDistributeCounts = fchmatDistributeCounts;
        controller.inventoryDetail = {};
        controller.mceUtils = mceUtils;   
        
        controller.conferente = [];
        controller.contagem = []
        
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************
    
        
        // Retorna para a página anterior
           this.cancel = function () {            
            // Volta para o contexto raiz
            appViewService.removeView({
                active: true,
                name: $rootScope.i18n('l-distribute-counts-detail'),
                url: $location.url('/dts/mce/distributecounts')
            });            
        };
            
        
        this.loadinventory = function(){            
            controller.fchmatDistributeCounts.findInventarioDetalhe({rRowid:$stateParams.rRowid},
                                                                    {},
                                                                    function(result){                 
                 controller.inventoryDetail = result[0];                
                
            });
        };       
        

        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        // *********************************************************************************
        
        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function(){
            createTab = appViewService.startView($rootScope.i18n('l-distribute-counts-detail'),
                                                 'mce.distributecounts.detailCtrl', 
                                                 controller); 
            
            previousView = appViewService.previousView;            
            
            // Se for troca entre abas, retorna e mantém o controller 
            if(createTab === false && previousView.controller != "mce.distributecounts.ListCtrl") {  
                return;
            }
            
           controller.loadinventory();
            
        };
      

        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        	controller.init();
        });
    }

 
    index.register.controller('mce.distributecounts.detailCtrl', distributeCountsDetailCtrl);

});


