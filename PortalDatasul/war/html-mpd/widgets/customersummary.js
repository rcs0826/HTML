define(['index'], function(index) {

    customerSummaryCtrl.$inject = ['$rootScope', '$http', '$filter', '$q', '$scope', 'TOTVSEvent'];

    function customerSummaryCtrl($rootScope, $http, $filter, $q, $scope, TOTVSEvent) {

        var customerCtrl = this;
        this.summaryShow = true;

        this.loadData = function() {
            var params = {};
			customerCtrl.loading = true;
			$http.get('/dts/datasul-rest/resources/api/fch/fchdis/fchdis0036/summary', {}).
			success( function(summary) {			
                customerCtrl.customerData = [];
                angular.forEach(summary, function(value) {
                    customerCtrl.customerData.push(
                            {
                                label: value.categoria + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + value.quantidade,
                                data: value.quantidade
                            });
                });
                customerCtrl.summaryShow = true;
            }).
			finally(function () {
				customerCtrl.loading = false;
			});
        };

        this.customerOptions = {
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

		if ($rootScope.currentuserLoaded) { customerCtrl.loadData(); }
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			customerCtrl.loadData();
		});

    }//function customerSummaryCtrl(loadedModules, userMessages)

    index.register.controller('salesorder.dashboard.customerSummary.Controller', customerSummaryCtrl);
	
	return 'salesorder.dashboard.customerSummary.Controller';
});