define(['index', 
    '/dts/cmg/js/cmg-components.js',
    '/dts/cmg/js/api/keeptrackofbalances.js'
], function (index) {

	dashboardKeepTrackOfBalancesByBankCtrl.$inject = ['$rootScope', '$filter', 'cmg.keeptrackofbalances.Factory', 'TOTVSEvent'];

	function dashboardKeepTrackOfBalancesByBankCtrl($rootScope, $filter, service, TOTVSEvent) {
        	
        var controller = this;
        
        controller.seriesCompany = [];
        controller.seriesBank = [];
        controller.listResult = [];
        controller.listOfBanks = [];
        controller.model = undefined;
        controller.categories = [];
        controller.options = [];
        controller.typeChart = 1;        

        controller.options = [{value: 1, label: $rootScope.i18n('l-company-value', [], 'dts/cmg')},
                              {value: 2, label: $rootScope.i18n('l-bank-value', [], 'dts/cmg')}];

        controller.tamDiv = undefined;
        controller.tamGrafico = 500;

        controller.tamDiv = document.getElementById('keeptrackofbalancesbybank_div').offsetWidth;
        
        if (controller.tamDiv >= 920) {
            controller.tamGrafico = 900;
        }
        
        controller.loadData = function() {

            service.getBalancesByBank( function(result){
                if (result) {

                    angular.forEach(result, function (value) {
                        controller.listOfBanks.push(value);
                        controller.listResult.push(value);
                    });
                    controller.createData(result);

                }
            });
        };

        this.createData = function (result) {

            var i,
            series1 = [],
            series2 = [];

            controller.categories = [];

            for (i = 0; i < result.length; i += 1) {

                series1.push(result[i].companyAmt);
                
                series2.push(result[i].bankAmt);

                controller.seriesCompany = [
                    {
                        data: series1,
                        tooltip: {
                            visible: true,
                            template: "${category}: $ ${value}"
                        }
                    }
                ];

                controller.seriesBank = [
                    {
                        data: series2,
                        tooltip: {
                            visible: true,
                            template: "${category}: $ ${value}"
                        }
                    }
                ];

                controller.categories.push(result[i].bankName);

            }
        };
        
        this.openCMG707 = function () {
            openProgressCMG707();
        };

        this.openCMG203 = function () {
            openProgressCMG203();
        };

        var openProgressCMG707 = function(){
	 
			var params = [];
				cProgram = "";
				cProgram = "fch/fchcmg/fchcmg707.p";
				msgAux = "";
				msgAux = $rootScope.i18n('l-cash-closing', [], 'dts/cmg') + ' - CMG707';
				controller.openProgress(cProgram, "fchcmg707.p", params, msgAux);
			
        };

        var openProgressCMG203 = function(){
	 
			var params = [];
				cProgram = "";
				cProgram = "fch/fchcmg/fchcmg203.p";
				msgAux = "";
				msgAux = $rootScope.i18n('l-bank-transition', [], 'dts/cmg') + ' - CMG203';
				controller.openProgress(cProgram, "fchcmg203.p", params, msgAux);
			
        };
        
        controller.openProgress  = function (path, program, param, msgAux) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('msg-opening-program', [msgAux], 'dts/cmg')
			});
			$rootScope.openProgramProgress(path, program, param);

		}
                
        this.applyConfig = function () {

            var result = [];
            controller.listResult = [];
            result = controller.selectedItems.getSelectedItems();
            
            angular.forEach(result, function (value) {
                controller.listResult.push(value);
            });

            controller.createData(controller.listResult);
            controller.listShow = true;
            controller.chartsShow = false;
							
        };
        
        this.showConfig = function () {
			
            this.listShow = false;
            this.chartsShow = false;
				
        };
        
        this.showList = function () {
			
            this.listShow = true;
            this.chartsShow = false;
				
        };
        
        this.showCharts = function () {
			
            this.chartsShow = true;
            this.listShow = false;
				
		};
		
        this.listShow = true;
        this.chartsShow = false;

        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			controller.loadData();
		};

		if ($rootScope.currentuserLoaded) { controller.init(); }
		
	}//function dashboardKeepTrackOfBalancesByBankCtrl(loadedModules, userMessages)

	index.register.controller('cmg.dashboard.keeptrackofbalancesbybank.Controller', dashboardKeepTrackOfBalancesByBankCtrl);
});