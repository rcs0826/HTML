define(['index'], function(index) {
	
	/**
	 * Controller List
	 */
	ggfbycostcenterCtrl.$inject = [
		'$rootScope', 
		'$scope', 
        '$filter',
        '$location',
        'i18nFilter',        
        'totvs.app-main-view.Service',
        'fchmcs.fchmcs0002.Factory',
        'fchmcs.fchmcs0004.Factory',
        '$modal',
        'helperGgfByCostCenter'
        
	];
	
	function ggfbycostcenterCtrl($rootScope,
								$scope,										  
                                $filter,
                                $location,
								i18n,
                                appViewService,
                                fchmcs0002Factory,
                                fchmcs0004Factory,
                                $modal,
                                helperGgfByCostCenter) {

        var controller = this; 

        controller.ttctlist = [];
        controller.quickSearchTextCCCode = "";
        controller.columns = [];
        		
		controller.advancedSearch = {
			site: {
				start: "",
				end: "ZZZZZ"},
			costcenterrange: {
				start: "",
				end: "ZZZZZZZZZZZZZZZZZZZZ"},
			variation: {
				start: -999.99,
				end: 999.99},
            period: {
				startDate: new Date().setMonth(new Date().getMonth() - 3),
                endDate: new Date().setMonth(new Date().getMonth() - 1)
            },
            showItemsWithoutVariation: true,
            resultType: '1',
            valueType: '1',
            currency: 0,
            currencies: [],
            managerialCurrencies: [],
            managerialPeriods: [],
            managerialYear: "",
            showDetailToClass: true
        }            

        controller.init = function() {
            createTab = appViewService.startView(i18n('l-ggf-by-cost-center', [], 'dts/mcs'), 'mcs.ggfbycostcenter-list.controller', controller);
            previousView = appViewService.previousView;

            if (helperGgfByCostCenter.data.currencies){
                controller.advancedSearch = helperGgfByCostCenter.data;
            }

            if (controller.advancedSearch.currencies.length == 0){
                fchmcs0002Factory.currencies(function(result){
                    angular.forEach(result, function (moeda){
                        
                        if (moeda.tipo === 1) {
                            controller.advancedSearch.currencies.push({
                                value: moeda.valor,
                                label: moeda.descricao
                            });
                        }
                        else {
                            controller.advancedSearch.managerialCurrencies.push({
                                value: moeda.valor,
                                label: moeda.descricao
                            });
                        }
                    })
                });
            }

            controller.listcostcenter();
        }

        controller.listcostcenter = function () {
           
            if (controller.advancedSearch.managerialPeriods !== undefined) {
                var periodos = Array.prototype.map.call(controller.advancedSearch.managerialPeriods, function(item) {
                     return item.id; 
                    }
                ).join();
            }

            parameters = {
                cccodigo: controller.quickSearchTextCCCode,
                ccsiteini: (controller.advancedSearch.site.start === undefined) ? '': controller.advancedSearch.site.start,
                ccsitefim: (controller.advancedSearch.site.end === undefined) ? '': controller.advancedSearch.site.end,                
                cccodigoini: (controller.advancedSearch.costcenterrange.start === undefined) ? '': controller.advancedSearch.costcenterrange.start,
                cccodigofim: (controller.advancedSearch.costcenterrange.end === undefined) ? '': controller.advancedSearch.costcenterrange.end,
                variacmin: (controller.advancedSearch.variation.start === undefined) ? 0 : controller.advancedSearch.variation.start,
                variacmax: (controller.advancedSearch.variation.end === undefined) ? 0 : controller.advancedSearch.variation.end,
                periodoini: (controller.advancedSearch.period.startDate === undefined) ? '': controller.advancedSearch.period.startDate,
                periodofim: (controller.advancedSearch.period.endDate === undefined) ? '': controller.advancedSearch.period.endDate,                          
                variaczero: controller.advancedSearch.showItemsWithoutVariation,
                tiporesult: controller.advancedSearch.resultType,
                tipovalor:  controller.advancedSearch.valueType,
                moeda:  controller.advancedSearch.currency,
                anoGerenc: (controller.advancedSearch.managerialYear === undefined) ? '' : controller.advancedSearch.managerialYear, //Math.floor(controller.advancedSearch.managerialYear / 31536000000),
                periodosGerenc: (periodos === undefined) ? '' : periodos,
                lDetalhe: false
            };

            controller.ttctlist = [];
            controller.gridggfOptions = {};
            controller.gridOptions = {};

            fchmcs0004Factory.listcostcenter (parameters, function(result) {                
                
                var tempList = result['dsCCusto'];
                var listperiodo = result['ttPeriodo']; 
                var listEspecies = result['ttespecies'];                

                var columnsggf = [
                    { field: 'periodo', title: i18n('l-period', [], 'dts/mcs'), width: 120 },
                    { field: 'horasreport', title: i18n('l-horas-rep', [], 'dts/mcs'), width: 100, format: "{0:n4}", attributes: {style: "text-align: right"} },
                    { field: 'taxahoraria', title: i18n('l-taxa-hora', [], 'dts/mcs'), width: 100, format: "{0:n4}", attributes: {style: "text-align: right;"} }
                ];
                
                listEspecies.forEach(function(esp) {                        
                    var afield = "especie" + esp["sequencia"];                   

                    columnsggf.push(
                        {field: afield, title: esp["descricao"], width: 140, format: "{0:n4}", attributes: {style: "text-align: right"}}                        
                    );                   
                });

                controller.gridggfOptions = {
                    reorderable: true,
                    resizable: true,
                    columns: columnsggf                   
                };

                controller.columns = [
                    { field: 'codEstab', title: i18n('l-site-short', [], 'dts/mcs'), width: 80 },
                    { field: 'ccCodigo', title: i18n('l-cc-codigo', [], 'dts/mcs'), width: 170 },
                    { field: 'descricao', title: i18n('l-description', [], 'dts/mcs'), width: 250 },
                    { field: 'maxVariacao', title: i18n('l-perc-max-var', [], 'dts/mcs'), width: 160, format: "{0:n2}", attributes: {style: "text-align: right"},  }                    
                ];

                listperiodo.forEach(function(per) {
                    var afield = "valorPeriodo" + (per["cont"] - 1);

                    controller.columns.push({
                        field: afield, title: per["ctitleper"], width: 160, format: "{0:n4}", attributes: {style: "text-align: right"}
                    });
                });
                
                controller.gridOptions = {
                        reorderable: true,
                        resizable: true,
                        columns: controller.columns
                }; 

                tempList.forEach(function(cc) {

                     ccObj = {ccCodigo: cc['ccCodigo'],
                            descricao: cc['descricao'],
                            codEstab: cc['codEstab'],
                            maxVariacao: cc['maxVariacao']}

                    listperiodo.forEach(function(per) {
                       ccObj['valorPeriodo' + (per['cont'] - 1)] = cc['valorPeriodo'][per['cont'] - 1];                        
                    });

                    if ( cc['ttextper'] != undefined) {
                        ccObj['ttDetalheGGF'] = cc['ttextper'];

                        ccObj['gridggfOptions'] = controller.gridggfOptions;
                    }

                    controller.ttctlist.push(ccObj);                    
                });

           });
        }

        controller.openCcustoDetail = function() {
        
			if (controller.selectedItem){

                var path = "dts/mcs/ggfbycostcenter/detail/" +
                    controller.selectedItem.ccCodigo + "/" +
                    controller.selectedItem.codEstab;

                helperGgfByCostCenter.data = controller.advancedSearch;

                $location.path(path);
            }
			
	    }
	
		controller.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-advancedsearch.html',
				controller: 'mcs.ggfbycostcenter.advancedsearch.controller as controller',
				size: 'md',
				resolve: {
				  model: function () {
					// passa o objeto com os dados da pesquisa avançada para o modal
					return controller.advancedSearch;
				  }
				}
			});
			
			modalInstance.result.then(function (model) {
                
                controller.advancedSearch = model;				
				controller.listcostcenter();
			});
        }

        /* Método que gera arquivo CSV */
        controller.exportListCsv = function() {
			
            parameters = {
                cccodigo: controller.quickSearchTextCCCode,
                ccsiteini: (controller.advancedSearch.site.start === undefined) ? '': controller.advancedSearch.site.start,
                ccsitefim: (controller.advancedSearch.site.end === undefined) ? '': controller.advancedSearch.site.end,                
                cccodigoini: (controller.advancedSearch.costcenterrange.start === undefined) ? '': controller.advancedSearch.costcenterrange.start,
                cccodigofim: (controller.advancedSearch.costcenterrange.end === undefined) ? '': controller.advancedSearch.costcenterrange.end,
                variacmin: (controller.advancedSearch.variation.start === undefined) ? 0 : controller.advancedSearch.variation.start,
                variacmax: (controller.advancedSearch.variation.end === undefined) ? 0 : controller.advancedSearch.variation.end,
                periodoini: (controller.advancedSearch.period.startDate === undefined) ? '': controller.advancedSearch.period.startDate,
                periodofim: (controller.advancedSearch.period.endDate === undefined) ? '': controller.advancedSearch.period.endDate,                          
                variaczero: controller.advancedSearch.showItemsWithoutVariation,
                tiporesult: controller.advancedSearch.resultType,
                tipovalor:  controller.advancedSearch.valueType,
                moeda:  controller.advancedSearch.currency,
                lDetalhe: false
            };

            fchmcs0004Factory.listItemscsv(parameters, function(result) {   

				if (result && result.csv != "") {
					var ie = navigator.userAgent.match(/MSIE\s([\d.]+)/),
						ie11 = navigator.userAgent.match(/Trident\/7.0/) && navigator.userAgent.match(/rv:11/),
						ieEDGE = navigator.userAgent.match(/Edge/g),
						ieVer=(ie ? ie[1] : (ie11 ? 11 : (ieEDGE ? 12 : -1)));

					if (ie && ieVer<10) {
						console.log("No blobs on IE ver<10");
						return;
					}
		
					var textFileAsBlob = new Blob([result.csv], {type: 'text/plain'});
                    var fileName = 
                        i18n('l-ggf-by-cost-center', [], 'dts/mcs') + ".csv";
                    
					if (ieVer>-1) {
						window.navigator.msSaveBlob(textFileAsBlob, fileName);
					} else {
						var alink         = document.createElement('a');
						alink.href        = 'data:attachment/csv,' +  encodeURIComponent(result.csv);
						alink.target      = '_blank';
						alink.download    = fileName;

						document.body.appendChild(alink);

						setTimeout(function() {
							alink.click();	
						}, 100);							
						
					}
				}
			});
		}   
                
        controller.init();
    }
    
    index.register.service('helperGgfByCostCenter', function() {
        return {
            data: {}
        };
    });

    index.register.controller('mcs.ggfbycostcenter-list.controller', ggfbycostcenterCtrl);            
    
});                                            