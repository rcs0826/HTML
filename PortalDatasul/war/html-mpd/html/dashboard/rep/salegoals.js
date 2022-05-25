define(['index',  '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/userpreference.js','/dts/mpd/js/zoom/estabelec.js', '/dts/mpd/js/mpd-factories.js'], function (index) {

	saleGoalsCtrl.$inject = ['$rootScope', 'salesorder.salesgoals.Factory', 'userPreference', '$q', '$filter', 'mpd.companyChange.Factory'];

	function saleGoalsCtrl($rootScope, saleGoals, userPreference, $q, $filter, companyChange) {

		var controller = this;

		var i18n = $filter('i18n');

		this.goalsData = [];

		// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
		if (companyChange.checkContextData() === false){
			companyChange.getDataCompany(true);
		}

		this.goalsOptions = {

			xaxis: {
				mode: null,
				ticks: []
			},
			grid: { hoverable: true},
			tooltip: true,
			tooltipOpts: {
				content: function(label, x, y, item) {
					return label.split('&')[0] + " " + y;
				}
			},
			series: {
				bars: {
					show: true,
					barWidth: 0.8,
					align: "center"
				}
			}
		};


		this.loadData  = function () {
			saleGoals.getSalesGoalsSummary(
					{siteId: controller.codEstabel,
					 refdate: controller.refDate}, function(result){
				if (result.length > 0) {

					controller.goalsData = [];
					controller.goalsData.push(
					{
						label: i18n( 'l-forecast', [], 'dts/mpd') + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + result[0].planned,
						data: [[1, result[0].planned]]
					});
					controller.goalsData.push(
					{
						label: i18n( 'l-order-accomp', [], 'dts/mpd') + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + result[0].order,
						data: [[2, result[0].order]]
					});
					controller.goalsData.push(
					{
						label: i18n( 'l-invoice-accomp', [], 'dts/mpd') + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + result[0].realBilled,
						data: [[3, result[0].realBilled]]
					});
					controller.goalsData.push(
					{
						label: i18n( 'l-disapproved', [], 'dts/mpd') + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + result[0].orderDisapproved,
						data: [[4, result[0].orderDisapproved]]
					});
					controller.goalsData.push(
					{
						label: i18n( 'l-cancelled', [], 'dts/mpd') + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + result[0].orderCanceled,
						data: [[5, result[0].orderCanceled]]
					});
					controller.goalsData.push(
					{
						label: i18n( 'l-suspended', [], 'dts/mpd') + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + result[0].orderSuspend,
						data: [[6, result[0].orderSuspend]]
					});
					controller.goalsData.push(
					{
						label: i18n( 'l-cancelled-invoice', [], 'dts/mpd') + '&nbsp;</td><td class="legendLabel" style="text-align: right;">' + result[0].billedCanceled,
						data: [[7, result[0].billedCanceled]]
					});
				}


				controller.showConfig = false;
			});
		};

		this.applyConfig = function () {

			var dtApply = new Date(controller.refDate).getTime();
			if((dtApply > 0)&&(controller.codEstabel != "")){
				$q.all([userPreference.setPreference('salesGoals.refDate', controller.refDate),
						userPreference.setPreference('salesGoals.codEstabel', controller.codEstabel)])
					.then(function () {
											controller.goalsData = undefined;
											controller.showConfig = true;
											controller.loadData();
					});
			}

		};


		$q.all([userPreference.getPreference('salesGoals.refDate'),
				userPreference.getPreference('salesGoals.codEstabel')]).then(function (results) {

			controller.refDate = "";
			controller.codEstabel = "";
			if (results[0].prefValue) controller.refDate = new Date(Number(results[0].prefValue)).getTime();
			if (results[1].prefValue) controller.codEstabel = results[1].prefValue;

			if (controller.refDate === "") controller.refDate = new Date().getTime();
			if (controller.codEstabel === "") controller.codEstabel = " ";

			var dt = new Date(parseFloat(controller.refDate)).getTime();

			if(!(dt > 0)){
				controller.refDate = new Date().getTime();
			}
			controller.goalsData = undefined;
			controller.loadData();
		});

		/* events */

		// busca os dados novamente quando feita a troca de empresa
		//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
					controller.goalsData = undefined;
			controller.loadData();
		});

	}//function saleGoalsCtrl(loadedModules, userMessages)

	index.register.controller('salesorder.dashboard.salegoals.Controller', saleGoalsCtrl);

});
