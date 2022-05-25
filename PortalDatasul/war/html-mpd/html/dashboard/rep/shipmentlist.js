define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/api/fchdis0050.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/html/dashboard/rep/defaultLodash.js'], function (index) {

	shipmentListCtrl.$inject = ['$rootScope',
								'mpd.shipment.Factory',
								'userPreference',
								'customization.generic.Factory',
								'$filter',
								'mpd.companyChange.Factory',
								'mpd.fchdis0035.factory',
								'portal.getUserData.factory'];

	function shipmentListCtrl($rootScope, shipmentList, userPreference, customService, $filter, companyChange, fchdis0035, userdata) {

		var listCtrl = this;
		listCtrl.nomeAbrev = " ";
		listCtrl.repres = " ";
		listCtrl.currentUserRoles = [];
		var currency = $filter('currency');
		var date = $filter('date');
		var i18n = $filter('i18n');

		this.listShow = true;

		// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
		if (companyChange.checkContextData() === false){
			companyChange.getDataCompany(true);
		}

		listCtrl.gridOptions = {
			columns: [
				{title: i18n('l-customer', [], 'dts/mpd'), field: "nome-abrev", width: 170, template: "<a href='\\#/dts/mpd/customer/#= data['cod-emitente'] #/'>#= data['nome-abrev'] #</a>", hidden: true},
				{title: i18n('nr-pedcli', [], 'dts/mpd'), field: "nr-pedcli", width: 130, template: "<a href='\\#/dts/mpd/orderdetail/#= data['nr-pedido'] #/'>#= data['nr-pedcli'] #</a>"},
				{title: i18n('l-shipment', [], 'dts/mpd'), field: "cdd-embarq", width: 150},
				{title: i18n('l-dt-shipment', [], 'dts/mpd'), field: "dt-embarque", width: 110},
				{title: i18n('l-status', [], 'dts/mpd'), field: "desc-situacao", width: 100}
			]
		};

		this.addCustomerColumn = function () {
			listCtrl.gridOptions.columns[0].hidden = false;
		}

		this.shipmentListSize = 10;

		this.loadData  = function () {
			if($rootScope.selectedcustomer){
				listCtrl.nomeAbrev = $rootScope.selectedcustomer['nome-abrev'];
			}else{
				listCtrl.nomeAbrev = " " ;
			}
			if ($rootScope.selectedRepresentatives){
				listCtrl.repres = " ";
				angular.forEach($rootScope.selectedRepresentatives, function (value, key) {
					listCtrl.repres = listCtrl.repres + value['cod-rep'] + '|';
				});
			} else {
				listCtrl.repres = " ";
			}

			var queryParams = {max: listCtrl.shipmentListSize, emitente: listCtrl.nomeAbrev, repres: listCtrl.repres};
			shipmentList.getShipmentDashboard(queryParams, function(result){

				result.forEach(function(shipment) {
					shipment['dt-embarque'] = date(shipment['dt-embarque'], 'shortDate');
				});

				listCtrl.gridOptions.rowData = result;
				listCtrl.listShow = true;
			});
		};

		this.applyConfig = function () {
			if ((listCtrl.shipmentListSize != 0) && (listCtrl.shipmentListSize != undefined)) {
				userPreference.setPreference('nrShipmentListSize', listCtrl.ShipmentListSize).then(function () {
					listCtrl.gridOptions.rowData = undefined;
					listCtrl.listShow = true;
					listCtrl.loadData();
				});
			}
		};

		userPreference.getPreference('nrShipmentListSize').then(function (data) {

			if(data.prefValue != ""){
				listCtrl.shipmentListSize = parseInt(data.prefValue);
			}

			if(listCtrl.shipmentListSize > 0){
				listCtrl.gridOptions.rowData = undefined;
				listCtrl.loadData();
			}else{
				listCtrl.shipmentListSize = 10;
				listCtrl.gridOptions.rowData = undefined;
				listCtrl.loadData();
			}

		});

		this.getProfileConfig = function(){

			listCtrl.isRepresentative = false;
			listCtrl.isCustomer = false;

			for (var i = listCtrl.currentUserRoles.length - 1; i >= 0; i--) {

				if(listCtrl.currentUserRoles[i] == "representative"){
					listCtrl.isRepresentative = true;
				}

				if(listCtrl.currentUserRoles[i] == "customer"){
					listCtrl.isCustomer = true;
				}
			}

			listCtrl.profileConfig = {
				isRepresentative: listCtrl.isRepresentative,
				isCustomer: listCtrl.isCustomer
			}

		}

		/* initialize */
		fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){
			listCtrl.currentUserRoles = result.out.split(",");
			listCtrl.getProfileConfig();
		}, true);

		/* events */
		$rootScope.$on('selectedcustomer', function(event) {
			listCtrl.gridOptions.rowData = undefined;
			listCtrl.loadData();
		});

		$rootScope.$on('selectedRepresentatives', function(event) {
			listCtrl.gridOptions.rowData = undefined;
			listCtrl.loadData();
		});

		// busca os dados novamente quando feita a troca de empresa
		//$rootScope.$$listeners['mpd.selectCompany.event'] = [];
		$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
			listCtrl.gridOptions.rowData = undefined;
			listCtrl.loadData();
		});
	}//function shipmentListCtrl(loadedModules, userMessages)

	index.register.controller('salesorder.dashboard.shipmentList.Controller', shipmentListCtrl);
});
