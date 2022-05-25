define(['index',  '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/userpreference.js', '/dts/mpd/js/mpd-factories.js'], function (index) {

	customerBillsSummaryCtrl.$inject = ['$rootScope', 'salesorder.customerbill.Factory', 'userPreference', '$q', 'mpd.companyChange.Factory'];

	function customerBillsSummaryCtrl($rootScope, service, userPreference, $q, companyChange) {
        	
		var controller = this;
		
		// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
		if (companyChange.checkContextData() === false){
			companyChange.getDataCompany(true);
		}

		// busca os dados novamente quando feita a troca de empresa
		//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
                        controller.vencidos = undefined;
                        controller.aVencer = undefined;                    
			controller.loadData();
        });
        
        controller.codEmitente = " ";
        controller.repres = " ";
    
        controller.dataini = new Date().getTime();
        controller.datafim = new Date().getTime();		
    
        $q.all([userPreference.getPreference('customerbill.dataini'),
                userPreference.getPreference('customerbill.datafim')])
            .then(function(data) {
                                
                var dt = controller.dataini;
                var dt2 = controller.datafim;
                                    
                if (data[0].prefValue && data[0].prefValue != "undefined") {
                    dt = new Date(parseFloat(data[0].prefValue)).getTime();
                }					
                if (data[1].prefValue && data[1].prefValue != "undefined") {
                    dt2 = new Date(parseFloat(data[1].prefValue)).getTime();
                }				
                
                if(!(dt > 0)){
                    dt = new Date().getTime(); 
                }
                
                if(!(dt2 > 0)){
                    dt2 = new Date().getTime(); 
                }           
                                                            
                controller.dataini = dt;
                controller.datafim = dt2;
                
                controller.vencidos = undefined;
                controller.aVencer = undefined;                     
                controller.loadData();
            });
		
		controller.loadData = function() {

            if($rootScope.selectedcustomer){
                controller.codEmitente = $rootScope.selectedcustomer['cod-emitente'];
            }else{
                controller.codEmitente = " ";
            }

            if ($rootScope.selectedRepresentatives){
                controller.repres = " ";
                angular.forEach($rootScope.selectedRepresentatives, function (value, key) {			
                    controller.repres = controller.repres + value['cod-rep'] + '|';					
                });
            } else {
                controller.repres = " ";
            }
            
            service.getCustomerBillSummary({emitente: controller.codEmitente,
                                            repres: controller.repres,
                                            dataini: controller.dataini,
                                            datafim: controller.datafim}, function(data){

                controller.vencidos = data[0].totTitVencidos;
                controller.aVencer = data[0].totTitAVencer;															
            });
		};
				
		this.applyConfig = function () {
			
			$q.all([userPreference.setPreference('customerbill.dataini', new Date(controller.dataini).getTime()),
			        userPreference.setPreference('customerbill.datafim', new Date(controller.datafim).getTime())])
				.then(function () {
                                        controller.vencidos = undefined;
                                        controller.aVencer = undefined; 
					controller.loadData();					
					controller.summaryShow = true;
				});
				
		};
		
		$rootScope.$on('selectedcustomer', function(event) {
            controller.vencidos = undefined;
            controller.aVencer = undefined;
            controller.loadData();
        });		

        $rootScope.$on('selectedRepresentatives', function(event) {
			controller.vencidos = undefined;
            controller.aVencer = undefined;
            controller.loadData();
		});
		
		this.summaryShow = true;
		
	}//function customerBillsSummaryCtrl(loadedModules, userMessages)

	index.register.controller('salesorder.dashboard.customerBillsSummary.Controller', customerBillsSummaryCtrl);
});