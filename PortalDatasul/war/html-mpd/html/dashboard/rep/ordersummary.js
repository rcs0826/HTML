/*global angular */
define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/html/dashboard/rep/defaultLodash.js'], function(index) {


	orderSummaryCtrl.$inject = ['$rootScope',
								'salesorder.salesorders.Factory',
								'userPreference',
								'$filter',
								'$q',
								'mpd.companyChange.Factory',
								'mpd.fchdis0035.factory',
								'portal.getUserData.factory'];

	function orderSummaryCtrl($rootScope, orderSummary, userPreference, $filter, $q, companyChange, fchdis0035, userdata) {

		var summaryCtrl = this;
		summaryCtrl.codEmitente = " ";
		summaryCtrl.repres = " ";
		summaryCtrl.currentUserRoles = [];
		var i18n = $filter('i18n');
		summaryCtrl.newOrderInclusionFlow = false;

		// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
		if (companyChange.checkContextData() === false){
			companyChange.getDataCompany(true);
		}

		this.tooltip = "<b><i>" + i18n('l-status-order-1', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-1', [], 'dts/mpd/') + "<br/>" +
					   "<b><i>" + i18n('l-status-order-4', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-4', [], 'dts/mpd/') + "<br/>" +
					   "<b><i>" + i18n('l-status-order-2', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-2', [], 'dts/mpd/') + "<br/>" +
					   "<b><i>" + i18n('l-status-order-5', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-5', [], 'dts/mpd/') + "<br/>" +
					   "<b><i>" + i18n('l-status-order-6', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-6', [], 'dts/mpd/') + "<br/>" +
					   "<b><i>" + i18n('l-status-order-7', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-7', [], 'dts/mpd/') + "<br/>" +
					   "<b><i>" + i18n('l-status-order-8', [], 'dts/mpd/') + "</i></b>: " + i18n('l-exp-status-order-8', [], 'dts/mpd/');

		this.noResults = false;

					
		$q.all([userPreference.getPreference('summaryInitDate')])
				.then(function(results) {

					if (results[0].prefValue) summaryCtrl.iniDate  = new Date(Number(results[0].prefValue)).getTime();

					var dt = new Date(parseFloat(summaryCtrl.iniDate)).getTime();

					if(!(dt > 0)){
						summaryCtrl.iniDate = new Date().getTime();
					}
					summaryCtrl.summaryData = undefined;
					summaryCtrl.loadData();

				}, {noCountRequest: true });


		this.applyConfig = function(data) {
			$q.all([userPreference.setPreference('summaryInitDate', summaryCtrl.iniDate)])
					.then(function() {
						summaryCtrl.summaryData = undefined;
						summaryCtrl.summaryShow = true;
						summaryCtrl.loadData();
					});
		};

		this.loadData = function() {

			if($rootScope.selectedcustomer){
				summaryCtrl.codEmitente = $rootScope.selectedcustomer['cod-emitente'];
			}else{
				summaryCtrl.codEmitente = " ";
			}

			if ($rootScope.selectedRepresentatives){
				summaryCtrl.repres = " ";
				angular.forEach($rootScope.selectedRepresentatives, function (value, key) {
					summaryCtrl.repres = summaryCtrl.repres + value['nome-abrev'] + '|';
				});
			} else {
				summaryCtrl.repres = " ";
			}

			var queryParams = {emitente: summaryCtrl.codEmitente, repres: summaryCtrl.repres, iniDate: summaryCtrl.iniDate};


			paramVisibleFieldsCarteiraClienteRepres = {cTable: "ped-venda-cadastro"};

			fchdis0035.getVisibleFields(paramVisibleFieldsCarteiraClienteRepres, function(result) {

				angular.forEach(result, function(value) {
					if (value.fieldName === "novo-fluxo-inclusao-pedido") {
						summaryCtrl.newOrderInclusionFlow = value.fieldEnabled; 
					}
				});


				var summary = orderSummary.getOrderSummary(queryParams, function() {

					var s = new Array();
					var i = 0;

					angular.forEach(summary, function(value, key) {

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
				});

			})


			
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

		this.getProfileConfig = function(){

			summaryCtrl.isRepresentative = false;
			summaryCtrl.isCustomer = false;

			for (var i = summaryCtrl.currentUserRoles.length - 1; i >= 0; i--) {

				if(summaryCtrl.currentUserRoles[i] == "representative"){
					summaryCtrl.isRepresentative = true;
				}

				if(summaryCtrl.currentUserRoles[i] == "customer"){
					summaryCtrl.isCustomer = true;
				}

				if(summaryCtrl.currentUserRoles[i] == "newordernotallowed"){
					summaryCtrl.isNewordernotallowed = true;
				}

				if(summaryCtrl.currentUserRoles[i] == "newordersuspended"){
					summaryCtrl.isNewordersuspended = true;
				}
			}

			summaryCtrl.profileConfig = {
				isRepresentative: summaryCtrl.isRepresentative,
				isCustomer: summaryCtrl.isCustomer,
				isNewordernotallowed: summaryCtrl.isNewordernotallowed,
				isNewordersuspended: summaryCtrl.isNewordersuspended
			}

		}

		/* initialize */
		fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){
			summaryCtrl.currentUserRoles = result.out.split(",");
			summaryCtrl.getProfileConfig();
		}, true);

		this.summaryShow = true;

		/* events */
		$rootScope.$on('selectedcustomer', function(event) {
			summaryCtrl.summaryData = undefined;
			summaryCtrl.loadData();
		});

		$rootScope.$on('selectedRepresentatives', function(event) {
			summaryCtrl.summaryData = undefined;
			summaryCtrl.loadData();
		});

		// busca os dados novamente quando feita a troca de empresa
		//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
						summaryCtrl.summaryData = undefined;
			summaryCtrl.loadData();
		});


	}//function orderSummaryCtrl(loadedModules, userMessages)

	index.register.controller('salesorder.dashboard.orderSummary.Controller', orderSummaryCtrl);

});
