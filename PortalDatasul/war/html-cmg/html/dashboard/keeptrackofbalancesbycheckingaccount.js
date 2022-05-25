define(['index', 
    '/dts/cmg/js/cmg-components.js',
    '/dts/cmg/js/api/keeptrackofbalances.js'
], function (index) {

	dashboardKeepTrackOfBalancesByCheckingAccountCtrl.$inject = ['$rootScope', '$filter', 'cmg.keeptrackofbalances.Factory', 'TOTVSEvent'];

	function dashboardKeepTrackOfBalancesByCheckingAccountCtrl($rootScope, $filter, service, TOTVSEvent) {
        	
        var controller = this;
        
        controller.seriesCompany = [];
        controller.seriesBank = [];
        controller.listResult = [];
        controller.listaBancaria = [];
        controller.listaCaixa = [];
        controller.listaAtivo = [];
        controller.listaPassivo = [];
        controller.listaGarantida = [];
        controller.model = undefined;
        controller.categories = [];
        controller.options = [];
        controller.typeChart = 1;        

        controller.options = [{value: 1, label: $rootScope.i18n('l-company-value', [], 'dts/cmg')},
                              {value: 2, label: $rootScope.i18n('l-bank-value', [], 'dts/cmg')}];

        controller.tamDiv = undefined;
        controller.tamGrafico = 500;

        controller.tamDiv = document.getElementById('keeptrackofbalancesbycheckingaccount_div').offsetWidth;
        
        if (controller.tamDiv >= 920) {
            controller.tamGrafico = 900;
        }

        controller.loadData = function() {

            service.getBalancesByCheckingAccount( function(result){
                if (result) {

                    angular.forEach(result, function (value) {
                        
                        switch (value.chkAccountType) {
                            case "Bancária":
                                controller.listaBancaria.push(value);
                                break;
                            case "Caixa":
                                controller.listaCaixa.push(value);
                                break;
                            case "Mútuo Ativo":
                                controller.listaAtivo.push(value);
                                break;
                            case "Mútuo Passivo":
                                controller.listaPassivo.push(value);
                                break;
                            case "Garantida":
                                controller.listaGarantida.push(value);
                                break;
                        }
        
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

                controller.categories.push(result[i].shortName);

            }
        };
        
        this.openCMG706 = function () {
            openProgressCMG706();
        };

        this.openCMG700 = function () {
            openProgressCMG700();
        };

        var openProgressCMG706 = function(){
	 
			var params = [];
				cProgram = "";
				cProgram = "fch/fchcmg/fchcmg706.p";
				msgAux = "";
				msgAux = $rootScope.i18n('l-reconcile', [], 'dts/cmg') + ' - CMG706';
				controller.openProgress(cProgram, "fchcmg706.p", params, msgAux);
			
        };

        var openProgressCMG700 = function(){
	 
			var params = [];
				cProgram = "";
				cProgram = "fch/fchcmg/fchcmg700.p";
				msgAux = "";
				msgAux = $rootScope.i18n('l-to-move', [], 'dts/cmg') + ' - CMG700';
				controller.openProgress(cProgram, "fchcmg700.p", params, msgAux);
			
        };
        
        controller.openProgress  = function (path, program, param, msgAux) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('msg-opening-program', [msgAux], 'dts/cmg')
			});
			$rootScope.openProgramProgress(path, program, param);

		}
                
        this.applyConfig = function () {

            var resultBancaria = [];
            var resultCaixa = [];
            var resultAtivo = [];
            var resultPassivo = [];
            var resultGarantida = [];

            controller.listResult = [];

            resultBancaria = controller.selectedBancaria.getSelectedItems();
            resultCaixa = controller.selectedCaixa.getSelectedItems();
            resultAtivo = controller.selectedAtivo.getSelectedItems();
            resultPassivo = controller.selectedPassivo.getSelectedItems();
            resultGarantida = controller.selectedGarantida.getSelectedItems();

            if (resultBancaria.length > 0) {
                angular.forEach(resultBancaria, function (value) {
                    controller.listResult.push(value);
                });
            }
            if (resultCaixa.length > 0) {
                angular.forEach(resultCaixa, function (value) {
                    controller.listResult.push(value);
                });
            }
            if (resultAtivo.length > 0) {
                angular.forEach(resultAtivo, function (value) {
                    controller.listResult.push(value);
                });
            }
            if (resultPassivo.length > 0) {
                angular.forEach(resultPassivo, function (value) {
                    controller.listResult.push(value);
                });
            }
            if (resultGarantida.length > 0) {
                angular.forEach(resultGarantida, function (value) {
                    controller.listResult.push(value);
                });
            }

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
		
	}//function dashboardKeepTrackOfBalancesByCheckingAccountCtrl(loadedModules, userMessages)

	index.register.controller('cmg.dashboard.keeptrackofbalancesbycheckingaccount.Controller', dashboardKeepTrackOfBalancesByCheckingAccountCtrl);
});