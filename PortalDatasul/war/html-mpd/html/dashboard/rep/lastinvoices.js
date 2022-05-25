define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/zoom/emitente.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/html/dashboard/rep/defaultLodash.js'], function (index) {


	lastInvoicesCtrl.$inject = ['$rootScope', 'salesorder.invoices.Factory', 'userPreference', '$filter', 'mpd.emitente.zoom', 'mpd.companyChange.Factory', 'mpd.fchdis0035.factory', 'portal.getUserData.factory', '$timeout'];

	function lastInvoicesCtrl($rootScope, lastInvoices, userPreference, $filter, zoomEmitente, companyChange, fchdis0035, userdata, $timeout) {

		var listCtrl = this;
		listCtrl.nomeAbrev = " ";
		listCtrl.repres = " ";
		listCtrl.currentUserRoles = [];

		var currency = $filter('currency');
		var i18n = $filter('i18n');

		this.listShow = true;

		this.invoiceListSize = 10;

		// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
		if (companyChange.checkContextData() === false){
			companyChange.getDataCompany(true);
		}

		listCtrl.gridOptions = {
			columns: [
				{title: i18n('l-customer', [], 'dts/mpd'), field: "nome-ab-cli", width: 170, template: "<a href='\\#/dts/mpd/customer/#= data['cod-emitente'] #/'>#= data['nome-ab-cli'] #</a>", hidden: true},
				{title: i18n('l-invoice-number', [], 'dts/mpd'), field: "nr-nota-fis", width: 160},
				{title: i18n('l-invoice-value', [], 'dts/mpd'), field: "vl-tot-nota", template: "{{#=data['vl-tot-nota']# | currency}}"}
			]
		};

		this.addCustomerColumn = function () {
			listCtrl.gridOptions.columns[0].hidden = false;
		}

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

				lastInvoices.TOTVSQuery({max: listCtrl.invoiceListSize,
											properties: ['nomAbrev', 'representatives'],
											values: [listCtrl.nomeAbrev, listCtrl.repres]}, function(result){
						listCtrl.gridOptions.rowData = result;
						listCtrl.listShow = true;

				}, {noCountRequest: true });



		};

		this.applyConfig = function () {
			if ((listCtrl.invoiceListSize != 0) && (listCtrl.invoiceListSize != undefined)) {
				userPreference.setPreference('nrInvoiceListSize', listCtrl.invoiceListSize).then(function () {
										listCtrl.listShow = true;
										listCtrl.gridOptions.rowData = undefined;
					listCtrl.loadData();
				});
			}
		};


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

		userPreference.getPreference('nrInvoiceListSize').then(function (data) {

					if (data != "") {
						listCtrl.invoiceListSize = parseInt(data.prefValue);
					}

					if(listCtrl.invoiceListSize > 0){
						listCtrl.gridOptions.rowData = undefined;
						listCtrl.loadData();
					}else{
						listCtrl.invoiceListSize = 5;
						listCtrl.gridOptions.rowData = undefined;
						listCtrl.loadData();
					}

		});

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

	}//function lastInvoicesCtrl(loadedModules, userMessages)

	index.register.controller('salesorder.dashboard.lastinvoices.Controller', lastInvoicesCtrl);
});
