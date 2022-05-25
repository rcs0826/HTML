define(['index',
        'filter-i18n'], function(index) {

    // *********************************************************************************
    // *** Controller Detalhe
    // *********************************************************************************
    ggfbycostcenterdetailCtrl.$inject = [
        '$scope',
        '$modal',
        '$filter',
        'i18nFilter',
        '$stateParams',
        'fchmcs.fchmcs0002.Factory',
        'fchmcs.fchmcs0004.Factory',
        'totvs.app-main-view.Service',
        'helperGgfByCostCenter'];

    function ggfbycostcenterdetailCtrl ($scope,        
                                        $modal,
                                        $filter,
                                        i18n,   
                                        $stateParams, 
                                        fchmcs0002Factory,
                                        fchmcs0004Factory,
                                        appViewService,
                                        helperGgfByCostCenter) {

        var controller = this; 



		var parameters = {
			site: {
				start: "",
				end: "ZZZZZ"},            
			costcenterrange: {
				start: "",
				end: "ZZZZZZZZ"},
			variation: {
				start: -999.99,
				end: 999.99},
            period: {
				startDate: new Date().setFullYear(new Date().getFullYear() - 1),
                endDate: new Date().setMonth(new Date().getMonth() - 1)
            },
            managerialPeriods: [],
            showItemsWithoutVariation: true,
            resultType: '1',
            valueType: '1',
            currency: 0,
            currencies: [],
            managerialCurrencies: [],
            showDetailToClass: true
        }   

        controller.init = function() {       
            createTab = appViewService.startView(i18n('l-ggf-by-cost-center', [], 'dts/mcs'), 'mcs.ggfbycostcenter-detail.controller', controller);
            previousView = appViewService.previousView;

            if(helperGgfByCostCenter.data.currencies){           
                parameters = JSON.parse(JSON.stringify(helperGgfByCostCenter.data));
            }else{
                helperGgfByCostCenter.data = parameters;
            }

            if (parameters.resultType == 3) {
                parameters.showDetailToClass = false;
            }  
                

            if (parameters.currencies.length == 0){
                fchmcs0002Factory.currencies(function(result){
                    angular.forEach(result, function (moeda){
                        parameters.currencies.push({
                            value: moeda.valor,
                            label: moeda.descricao
                        })
                    })
                });
            }

            controller.listcostcenter();            

        }        

        controller.updateChart = function(dsCCusto, ttespecies) {

            controller.categories = [];
            
            controller.series = [];

            if (parameters.showDetailToClass == true) {
                ttespecies.forEach(function (especie) {
                    controller.series.push({
                        name: especie.descricao, 
                        data: [],
                        seq: especie.sequencia
                    });
                });
            }


            controller.series.push({
                name: i18n('l-total', [], 'dts/mcs'), 
                data: []
            }); 

            dsCCusto[0].ttextper.forEach(function (periodo) {
                controller.categories.push(periodo.periodo);
                
                switch (parameters.resultType) {
                    case '1':
                        for (var index = 0; index < controller.series.length; index++) {
                            var element = controller.series[index];

                            if (index == controller.series.length - 1) {
                                controller.series[index].data.push(periodo.taxahoraria);
                            } else {
                                var taxahorariaespecie = periodo['taxahorariaespecie' + element.seq];
                                controller.series[index].data.push(taxahorariaespecie);
                            }
                        }

                        break;
                
                    case '2':
                        for (var index = 0; index < controller.series.length; index++) {
                            var element = controller.series[index];

                            if (index == controller.series.length - 1) {
                                controller.series[index].data.push(periodo.valtotal);
                            } else {
                                var totalEspecie = periodo['especie' + element.seq]; 
                                controller.series[index].data.push(totalEspecie);
                            }
                        }

                        break;
                
                    case '3':
                        controller.series[0].data.push(periodo.horasreport);                        
                        break;
                }
            });      
                  
        }

		controller.openParameters = function() {            
			var modalInstance = $modal.open({
				templateUrl: '/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-parameters.html',
                controller: 'mcs.ggfbycostcenter-parameters.controller as controller',
				size: 'md',
				resolve: {
				  model: function () {
					// passa o objeto com os dados da pesquisa avan�ada para o modal
					return parameters;
				  }
				}
			});
            
            
			modalInstance.result.then(function (model) {
                
                parameters = model;				
                controller.listcostcenter();
                
                helperGgfByCostCenter.data = model;

            });
                        
        }
        
        controller.listcostcenter = function () {

            controller.categories = [];
            controller.series = [];

            if (parameters.managerialPeriods !== undefined && parameters.managerialPeriods.length > 0) {
                var periodos = Array.prototype.map.call(parameters.managerialPeriods, function(item) {
                     return item.id; 
                    }
                ).join();
            }

            paramChart = {
                cccodigo: $stateParams.ccusto,
                ccsiteini: (parameters.site.start === undefined) ? '': parameters.site.start,
                ccsitefim: (parameters.site.end === undefined) ? '': parameters.site.end,
                cccodigoini: (parameters.costcenterrange.start === undefined) ? '': parameters.costcenterrange.start,
                cccodigofim: (parameters.costcenterrange.end === undefined) ? '': parameters.costcenterrange.end,
                variacmin: (parameters.variation.start === undefined) ? 0 : parameters.variation.start,
                variacmax: (parameters.variation.end === undefined) ? 0 : parameters.variation.end,
                periodoini: (parameters.period.startDate === undefined) ? '': parameters.period.startDate,
                periodofim: (parameters.period.endDate === undefined) ? '': parameters.period.endDate,                          
                variaczero: parameters.showItemsWithoutVariation,
                tiporesult: parameters.resultType,
                tipovalor:  parameters.valueType,
                moeda:  parameters.currency,
                lDetalhe: true,
                codEstab: $stateParams.codestab,
                anoGerenc: (parameters.managerialYear === undefined) ? '' : parameters.managerialYear,
                periodosGerenc: (periodos === undefined) ? '' : periodos,
            };

            fchmcs0004Factory.listcostcenter (paramChart, function(result) {  
                
                if(result && result.dsCCusto && result.dsCCusto[0]) {
                    controller.ccCodigo = result.dsCCusto[0].ccCodigo;
                    controller.ccDesc  = result.dsCCusto[0].descricao;
                    controller.codEstab = result.dsCCusto[0].codEstab;

                    if (result.dsCCusto[0].ttextper) {
                        controller.updateChart(result.dsCCusto, result.ttespecies);
                    }
                    
                }
            })

        }        

        controller.init();

    }
    
    index.register.service('helperGgfByCostCenter', function() {
        return {
            data: {}
        };
    });
    
    index.register.controller('mcs.ggfbycostcenter-detail.controller', ggfbycostcenterdetailCtrl);
});