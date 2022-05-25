define(['index'], function(index) {
	
	/**
	 * Controller Detail
	 */
 	agendaDetailLaborReportCtrl.$inject = ['$modalInstance', 
 	                                       '$scope',
 	                                       '$rootScope',
 	                                       '$filter',
 	                                       'model',
 	                                       'fchmip.fchmip0066.Factory'];
	
 	function agendaDetailLaborReportCtrl ($modalInstance,$scope,$rootScope,$filter,model,fchmip0066Factory) {
 		
		controller = this;
		controller.ttParamLoadPointing = model;
		controller.rows = [];
		
		// Definição das colunas do grid
		var columnDefs = [
          	{headerName: $rootScope.i18n('l-technician'), field: "cdTecnico", width: 70},
		 	{headerName: $rootScope.i18n('l-name'), field: "nomeCompl", width: 215},
		 	{headerName: $rootScope.i18n('l-specialty'), field: "cdEspecial", width: 130},
		 	{headerName: $rootScope.i18n('l-cost-center'), field: "ccCodigo", width: 135},		
		 	{headerName: $rootScope.i18n('l-date'), field: "DatTrans", width: 100},
		 	{headerName: $rootScope.i18n('l-initial-hour'), field: "HraInicio", width: 85},
		 	{headerName: $rootScope.i18n('l-final-hour'), field: "HraFinal", width: 85}
		];

 		// Métotodo que faz a busca de dados para alimentar a grid
		this.createRowData = function() {
			
			fchmip0066Factory.loadLaborMaintenanceOrderRecord(controller.ttParamLoadPointing, function(result){
				
				if (result) {
	                // para cada item do result
	                angular.forEach(result, function (value) {
	                    
	                	value.initialHour = value.initialHour.split(':');
	                	value.finishHour  = value.finishHour.split(':');

	    		    	value.initialHour = value.initialHour[0] + ':' + value.initialHour[1];
	    		    	value.finishHour  = value.finishHour[0] + ':' + value.finishHour[1];
	                	
	                    // adicionar o item na lista de resultado
	                    controller.rows.push({
	                        cdTecnico  : $filter('tecnicoMask')(value.technicalCode),
				            nomeCompl  : value.technicalName,
				            cdEspecial : value.specialityType,
				            ccCodigo   : value.costsCenter,
				            DatTrans   : $filter('date')(value.transactionDate, 'dd/MM/yyyy'),
				            HraInicio  : value.initialHour,
				            HraFinal   : value.finishHour	                   
	                    });	                    
	                });
	                controller.listSelectTecnicoAux = controller.listSelectTecnico;
	            }
			});		
	
 	        return controller.rows;
	    }

		// Objeto padrão do grid onde se encontram propriedades do grid assim como as colunas e dados das mesmas
 		this.gridOptions = {
 		        columnDefs: columnDefs,
 		        rowData: controller.createRowData(),
 		        rowSelection: 'single',
 		        suppressRowClickSelection : false,
 		        enableColumnResize : true,
 		        resizable : true
	    };

		
 	    //$modalInstance.close();
 	     
 	    // ação de fechar
 	    this.close = function () {
 	        // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    }
 	}
	
	index.register.controller('mpo.agenda.DetailLaborReportCtrl', agendaDetailLaborReportCtrl);
	
});
