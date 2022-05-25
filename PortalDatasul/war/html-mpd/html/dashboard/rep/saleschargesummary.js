define(['index',  '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/userpreference.js', '/dts/mpd/js/mpd-factories.js'], function (index) {

	salesChargeSummaryCtrl.$inject = ['$rootScope', 'salesorder.salescharge.Factory', 'userPreference', '$q', 'mpd.companyChange.Factory'];

	function salesChargeSummaryCtrl($rootScope, service, userPreference, $q, companyChange) {

		var controller = this;

		controller.codEmitente = " ";
		controller.repres = " ";
		controller.dataini = new Date().getTime();
		controller.datafim = new Date().getTime();

		// Busca todas as empresas vinculadas ao usuario logado | Metodo getDataCompany presente na fchdis0035api.js |
		if (companyChange.checkContextData() === false){
			companyChange.getDataCompany(true);
		}

		$q.all([userPreference.getPreference('salescharge.dataini'),
				userPreference.getPreference('salescharge.datafim')])
				.then(function (data) {

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

					controller.previsto = undefined;
					controller.realizado = undefined;
					controller.loadData();
				});

		controller.loadData = function () {

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

			service.getSalesChargeSummary(
					{emitente: controller.codEmitente,
					 repres: controller.repres,
					 dataini: controller.dataini,
					 datafim: controller.datafim}, function (data) {
				controller.previsto = data[0]['val-tot-nao-realiz'];
				controller.realizado = data[0]['val-tot-realiz'];
			});

		};

		this.applyConfig = function () {

			var dtApply = new Date(controller.dataini).getTime();
			var dt2Apply = new Date(controller.datafim).getTime();

			if((dtApply > 0)&&(dt2Apply > 0)){
				$q.all([userPreference.setPreference('salescharge.dataini', new Date(controller.dataini).getTime()),
						userPreference.setPreference('salescharge.datafim', new Date(controller.datafim).getTime())])
						.then(function () {
							controller.previsto = undefined;
							controller.realizado = undefined;
							controller.loadData();
							controller.summaryShow = true;
						});
			}

		};

		/* initialize */
		this.summaryShow = true;

		/* events */
		$rootScope.$on('selectedcustomer', function(event) {
			controller.previsto = undefined;
			controller.realizado = undefined;
			controller.loadData();
		});

		$rootScope.$on('selectedRepresentatives', function(event) {
			controller.previsto = undefined;
			controller.realizado = undefined;
			controller.loadData();
		});

		// busca os dados novamente quando feita a troca de empresa
		//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
					controller.previsto = undefined;
					controller.realizado = undefined;
			controller.loadData();
		});

	}//function customerBillsSummaryCtrl(loadedModules, userMessages)

	index.register.controller('salesorder.dashboard.salesChargeSummary.Controller', salesChargeSummaryCtrl);
});
