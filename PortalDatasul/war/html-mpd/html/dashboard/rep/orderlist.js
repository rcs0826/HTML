define(['index',
	'/dts/mpd/js/userpreference.js',
	'/dts/mpd/js/portal-factories.js',
	'/dts/mpd/js/mpd-factories.js',
	'/dts/dts-utils/js/lodash-angular.js',
	'/dts/mpd/js/api/fchdis0035api.js',
	'/dts/mpd/html/dashboard/rep/defaultLodash.js'], function (index) {

		orderListCtrl.$inject = ['$rootScope',
			'salesorder.salesorders.Factory',
			'userPreference',
			'customization.generic.Factory',
			'$filter',
			'mpd.companyChange.Factory',
			'mpd.fchdis0035.factory',
			'portal.getUserData.factory'];

		function orderListCtrl($rootScope, orderList, userPreference, customService, $filter, companyChange, fchdis0035, userdata) {

			var listCtrl = this;
			listCtrl.nomeAbrev = " ";
			listCtrl.repres = " ";
			var currency = $filter('currency');
			var date = $filter('date');
			var i18n = $filter('i18n');

			this.listShow = true;

			// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
			if (companyChange.checkContextData() === false) {
				companyChange.getDataCompany(true);
			}

			listCtrl.gridOptions = {
				columns: [
					{ title: i18n('l-customer', [], 'dts/mpd'), field: "nome-abrev", width: 170, template: "<a href='\\#/dts/mpd/customer/#= data['cod-emitente'] #/'>#= data['nome-abrev'] #</a>", hidden: true },
					{ title: i18n('nr-pedcli', [], 'dts/mpd'), field: "nr-pedcli", width: 130, template: "<a href='\\#/dts/mpd/orderdetail/#= data['nr-pedido'] #/'>#= data['nr-pedcli'] #</a>" },
					{ title: i18n('l-status', [], 'dts/mpd'), field: "desc-cod-sit-ped-portal", width: 150 },
					{ title: i18n('l-dt-emissao', [], 'dts/mpd'), field: "dt-emissao", width: 130 },
					{ title: i18n('l-dt-entrega', [], 'dts/mpd'), field: "dt-entrega", width: 130 },
					{ title: i18n('l-vl-tot-ped', [], 'dts/mpd'), field: "vl-tot-ped", width: 130, template: "{{#=data['vl-tot-ped']# | currency}}" }
				]
			};

			this.addCustomerColumn = function () {
				listCtrl.gridOptions.columns[0].hidden = false;
			}

			this.orderListSize = 10;

			this.loadData = function () {

				if ($rootScope.selectedcustomer) {
					listCtrl.nomeAbrev = $rootScope.selectedcustomer['nome-abrev'];
				} else {
					listCtrl.nomeAbrev = " ";
				}
				if ($rootScope.selectedRepresentatives) {
					listCtrl.repres = " ";
					angular.forEach($rootScope.selectedRepresentatives, function (value, key) {
						listCtrl.repres = listCtrl.repres + value['nome-abrev'] + '|';
					});
				} else {
					listCtrl.repres = " ";
				}

				orderList.TOTVSQuery({
					max: listCtrl.orderListSize,
					properties: ['nomAbrevIni', 'nomAbrevFim', 'representatives'],
					values: [listCtrl.nomeAbrev, listCtrl.nomeAbrev, listCtrl.repres],
				}, function (result) {

					result.forEach(function (order) {
						order['dt-emissao'] = date(order['dt-emissao'], 'shortDate');
						order['dt-entrega'] = date(order['dt-entrega'], 'shortDate');
					}); 

					listCtrl.gridOptions.rowData = result;
					listCtrl.listShow = true;
				}, { noCountRequest: true });
			};

			this.applyConfig = function () {
				if ((listCtrl.orderListSize != 0) && (listCtrl.orderListSize != undefined)) {
					userPreference.setPreference('nrOrderListSize', listCtrl.orderListSize).then(function () {
						listCtrl.listShow = true;
						listCtrl.gridOptions.rowData = undefined;
						listCtrl.loadData();
					});
				}
			};

			userPreference.getPreference('nrOrderListSize').then(function (data) {

				if (data.prefValue != "") {
					listCtrl.orderListSize = parseInt(data.prefValue);
				}

				if (listCtrl.orderListSize > 0) {
					listCtrl.gridOptions.rowData = undefined;
					listCtrl.loadData();
				} else {
					listCtrl.orderListSize = 5;
					listCtrl.gridOptions.rowData = undefined;
					listCtrl.loadData();
				}
			});

			
			/* events */
			$rootScope.$on('selectedcustomer', function (event) {
				listCtrl.gridOptions.rowData = undefined;
				listCtrl.loadData();
			});

			$rootScope.$on('selectedRepresentatives', function (event) {
				listCtrl.gridOptions.rowData = undefined;
				listCtrl.loadData();
			});

			// busca os dados novamente quando feita a troca de empresa
			//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				listCtrl.gridOptions.rowData = undefined;
				listCtrl.loadData();
			});


		} //function orderListCtrl(loadedModules, userMessages)

		index.register.controller('salesorder.dashboard.orderList.Controller', orderListCtrl);
	});
