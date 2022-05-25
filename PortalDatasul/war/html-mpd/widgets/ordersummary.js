define(['index',  '/dts/mpd/widgets/preferenceservice.js'], function(index) {
	
    orderSummaryCtrl.$inject = ['$http', 'userPreference', '$filter', '$q', '$scope', '$rootScope', 'TOTVSEvent'];

    function orderSummaryCtrl($http, userPreference, $filter, $q, $scope, $rootScope, TOTVSEvent) {

        var summaryCtrl = this;

        this.tooltip = "<b><i>Em Digitação</i></b>: são pedidos disponíveis para alteração e cancelamento<br/>" +
                "<b><i>Em An&aacute;lise</i></b>: são pedidos que foram liberados e estão sendo avaliados pelo setor comercial<br/>" +
                "<b><i>Em processamento</i></b>: são pedidos que foram aprovados pelo setor comercial e entraram no processo de atendimento<br/>" +
                "<b><i>Atend Parcial</i></b>: são pedidos que foram faturados parcialmente<br/>" +
                "<b><i>Atend Total</i></b>: são pedidos que foram faturados completamente<br/>" +
                "<b><i>Suspensos</i></b>: são pedidos que foram suspensos no processo de atendimento<br/>" +
                "<b><i>Cancelados</i></b>: são pedidos que foram cancelados<br/>" +
                "<b><i>Reprovados</i></b>: são pedidos que foram reprovados na análise de crédito, entre em contato com o setor comercial para esclarecimentos";
        this.noResults = false;
		
		this.init = function () {
			summaryCtrl.loading = true;
			$q.all([userPreference.get('summaryInitDate')])
					.then(function(data) {
						var dt = new Date();
						if (data[0].prefValue && data[0].prefValue != "undefined") {
							dt = new Date(parseFloat(data[0].prefValue));
						} else {
							dt.setMonth(dt.getMonth() - 1);
						}
						if ( isNaN(dt.getTime())) {
							dt = new Date();
							dt.setMonth(dt.getMonth() - 1);
						}
						summaryCtrl.iniDate = dt.getTime();
						summaryCtrl.loading = false;
						summaryCtrl.loadData();
					});
		}

        this.applyConfig = function(data) {
            userPreference
                    .set('summaryInitDate', summaryCtrl.iniDate)
                    .success(function() {
                        summaryCtrl.loadData();
                    });
        };

        this.loadData = function() {
            var queryParams = {iniDate: summaryCtrl.iniDate};
			summaryCtrl.loading = true;
			$http.get('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0039/ordersummary?iniDate=' + summaryCtrl.iniDate, {}).
			success( function( data) {

                var s = new Array();
                var i = 0;

                angular.forEach(data, function(value, key) {

                    var chartLabel = value.summaryType + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + value.summaryValue;

                    s.push({label: chartLabel, data: value.summaryValue});
                    if (parseInt(value.summaryValue))
                        i++;
                });

                summaryCtrl.summaryData = s;

                if (i == 0) {
                    summaryCtrl.noResults = true;
                    summaryCtrl.summaryShow = false;
                } else {
                    summaryCtrl.noResults = false;
                    summaryCtrl.summaryShow = true;
                }
            }).
			finally(function () {
				summaryCtrl.loading = false;
			});
        };

        this.summaryOptions = {
            tooltip: true,
            tooltipOpts: {
                content: function(label, x, y, item) {
                    return label.split('&')[0] + " " + y;
                }
            },
            grid: {hoverable: true},
            series: {
                pie: {
                    show: true
                }
            }
        };

        this.applyConfig = function(data) {
            userPreference.set('summaryInitDate', summaryCtrl.iniDate)
                    .success(function() {
                        summaryCtrl.loadData();
                    });

        };

        this.summaryShow = true;
		
		if ($rootScope.currentuserLoaded) { 
			this.init(); 
		}
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			summaryCtrl.init();
		});
		

    }//function orderSummaryCtrl(loadedModules, userMessages)

    index.register.controller('salesorder.dashboard.orderSummary.Controller', orderSummaryCtrl);

	return 'salesorder.dashboard.orderSummary.Controller';
});