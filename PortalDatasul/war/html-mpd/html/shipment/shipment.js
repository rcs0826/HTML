define(['index',

		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/api/fchdis0050.js',
		'/dts/mpd/js/zoom/repres.js'], function (index) {

	index.stateProvider
	.state('dts/mpd/shipment', {
		abstract: true,
		template: '<ui-view/>'
	})
	.state('dts/mpd/shipment.start', {
		url: '/dts/mpd/shipment',
		controller: 'mpd.shipment.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/shipment/shipment.html'
	})
	.state('dts/mpd/shipment.filterShipment', {
		url: '/dts/mpd/shipment/:idShipment',
		controller: 'mpd.shipment.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/shipment/shipment.html'
	})
	.state('dts/mpd/shipment.filterByOrder', {
		url: '/dts/mpd/shipment/:orderId/:nomeAbrev',
		controller: 'mpd.shipment.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/shipment/shipment.html'
	});

	shipmentCtrl.$inject = ['$rootScope',
							'$location',
							'$stateParams',
							'totvs.app-main-view.Service',
							'mpd.shipment.Factory',
							'userPreference',
							'portal.generic.Controller',
							'portal.getUserData.factory',
							'$filter',
							'$modal',
							'mpd.companyChange.Factory',
							'$q'];

	function shipmentCtrl($rootScope, $location, $stateParams, appViewService, shipmentResource, userPreference,
						  genericController, userdata, $filter, $modal, companyChange, $q) {

		var controller = this;
		this.listResult = [];

		controller.date = $filter('date');
		controller.i18n = $filter('i18n');

		genericController.decorate(controller, shipmentResource);

		controller.advancedSearch = {model: {}};

		controller.search = function() {
			controller.clearDefaultData(true);
			controller.clearFilter();
			controller.addFilters();
			controller.loadData();
		}

		$q.all([userPreference.getPreference('dtIniEmbarque'),
				userPreference.getPreference('dtFimEmbarque')])
				.then(function (data) {

					var dt = controller.advancedSearch.model.dtEmbarqueIni;
					var dt2 = controller.advancedSearch.model.dtEmbarqueFim;

					if (data[0].prefValue && data[0].prefValue != "undefined") {
						dt = new Date(parseFloat(data[0].prefValue)).getTime();
					}
					if (data[1].prefValue && data[1].prefValue != "undefined") {
						dt2 = new Date(parseFloat(data[1].prefValue)).getTime();
					}

					if(!(dt > 0)){
						dt = new Date().setMonth(new Date().getMonth() - 1);
					}

					if(!(dt2 > 0)){
						dt2 = new Date().setMonth(new Date().getMonth());
					}

					controller.advancedSearch.model.dtEmbarqueIni = dt;
					controller.advancedSearch.model.dtEmbarqueFim = dt2;

					controller.search();

				});

		controller.removeSelectedFilter = function(filter) {

			controller.removeFilter(filter);
			if (filter.property == "simpleFilter") {
				controller.quickSearchText = '';
			}

			if (filter.property == "representatives") {
				controller.advancedSearch.listRepres = '';
			}

			delete controller.advancedSearch.model[filter.property];
			controller.loadData();
		}

		controller.setQuickFilter = function(value) {

			controller.clearFilter();

			if(value == '1'){
				controller.addFilter("codSitPre", "1", '', controller.i18n('l-emb-alocado'));
			}
			if(value == '2'){
				controller.addFilter("codSitPre", "2", '', controller.i18n('l-emb-calculado'));
			}
			if(value == '3'){
				controller.addFilter("codSitPre", "3", '', controller.i18n('l-confirmed'));
			}

			controller.addFilters();

			controller.loadData();
		}

		controller.addFilters = function(){
			if (controller.advancedSearch.model.cddEmbarqIni) {
				controller.addFilter("cddEmbarqIni", controller.advancedSearch.model.cddEmbarqIni, '', controller.i18n('l-shipment-start') + ':' + controller.advancedSearch.model.cddEmbarqIni);
			}
			if (controller.advancedSearch.model.cddEmbarqFim) {
				controller.addFilter("cddEmbarqFim", controller.advancedSearch.model.cddEmbarqFim, '', controller.i18n('l-shipment-end') + ':' + controller.advancedSearch.model.cddEmbarqFim);
			}

			if (controller.advancedSearch.model.nomeAbrevIni) {
				controller.addFilter("nomeAbrevIni", controller.advancedSearch.model.nomeAbrevIni, '', controller.i18n('l-initial-short-name') + ':' + controller.advancedSearch.model.nomeAbrevIni);
			}

			if (controller.advancedSearch.model.nomeAbrevFim) {
				controller.addFilter("nomeAbrevFim", controller.advancedSearch.model.nomeAbrevFim, '', controller.i18n('l-final-short-name') + ':' + controller.advancedSearch.model.nomeAbrevFim);
			}

			if (controller.advancedSearch.model.nrPedcliIni) {
				controller.addFilter("nrPedcliIni", controller.advancedSearch.model.nrPedcliIni, '', controller.i18n('l-nr-customer-order-start') + ':' + controller.advancedSearch.model.nrPedcliIni);
			}

			if (controller.advancedSearch.model.nrPedcliFim) {
				controller.addFilter("nrPedcliFim", controller.advancedSearch.model.nrPedcliFim, '', controller.i18n('l-nr-customer-order-end') + ':' + controller.advancedSearch.model.nrPedcliFim);
			}

			if (controller.advancedSearch.model.dtEmbarqueIni) {
				var vDtEmbarqueIni = controller.date(controller.advancedSearch.model.dtEmbarqueIni, 'shortDate');
				controller.addFilter("dtEmbarqueIni", controller.advancedSearch.model.dtEmbarqueIni, '', controller.i18n('l-dt-shipment-start') + ':' + vDtEmbarqueIni);
			}

			if (controller.advancedSearch.model.dtEmbarqueFim) {
				var vDtEmbarqueFim = controller.date(controller.advancedSearch.model.dtEmbarqueFim, 'shortDate');
				controller.addFilter("dtEmbarqueFim", controller.advancedSearch.model.dtEmbarqueFim, '', controller.i18n('l-dt-shipment-end') + ':' + vDtEmbarqueFim);
			}

			if (controller.quickSearchText) {
				controller.addFilter("simpleFilter", controller.quickSearchText, '', controller.i18n('l-simple-filter') + ':' + controller.quickSearchText);
			}

			if (controller.codeRepresentatives) {
				$rootScope.MPDShipmentCustomRepresentative = true;
				controller.addFilter("representatives", controller.codeRepresentatives, '', controller.i18n('l-representantes') + ": " + controller.representativesNames);
			}
		}

		controller.loadData = function (isMore) {
			var startAt = 0;
			var max = 10;
			var where = "";
			var properties = [];
			var values = [];

			if (isMore) {
				max = controller.listResult.length + 10;
			}

			for (var i = 0; i < controller.filterBy.length; i++) {

				if (controller.filterBy[i].property) {
					properties.push(controller.filterBy[i].property);
					values.push(controller.filterBy[i].value);
				}
			}

			shipmentResource.getShipment({emitente: " ", max: max, properties: properties, values: values}, function(result){

				controller.listResult = [];
				controller.listResult = result;
				controller.totalRecords = result[0].totalRecords;
			});
		}

		controller.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/shipment/shipment-adv-search.html',
			  controller: 'mpd.shipment.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
				model: function () {
				  return controller.advancedSearch;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.codeRepresentatives = controller.advancedSearch.codeRepresentatives;
				controller.representativesNames = controller.advancedSearch.representativesNames;
				controller.search();
			});
		}


		controller.getShipmentItens = function(shipment) {
			var properties = [];
			var values = [];

			for (var i = 0; i < controller.filterBy.length; i++) {

				if (controller.filterBy[i].property) {
					properties.push(controller.filterBy[i].property);
					values.push(controller.filterBy[i].value);
				}
			}

			if (!shipment.shipmentItens) {
				shipmentResource.getShipmentItens({cddEmbarq: shipment['cdd-embarq'], properties: properties, values: values}, function(result) {
					shipment.shipmentItens = result;
				});
			}
		}

		this.removeFilterByProperty =  function (property) {
			angular.forEach(controller.filterBy, function(value) {
				if (value.property === property) {
					var index = controller.filterBy.indexOf(value);
					if (index != -1) {
						controller.filterBy.splice(index, 1);
					}
				}
			});
		};

		controller.applyRepresentativeFilter = function () {

			//Faz o filtro pelos representantes selecionados
			if($rootScope.selectedRepresentatives && $rootScope.MPDShipmentCustomRepresentative === false){
				var codRepList = "";
				var nomeAbrevList = "";
				var icountRepres = 0;
				var disclaimers = [];

				angular.forEach($rootScope.selectedRepresentatives, function (value, key) {

					icountRepres = icountRepres + 1;
					codRepList = codRepList + value['cod-rep'] + '|';
					if (icountRepres < 4) {
						if (nomeAbrevList == "") nomeAbrevList = value['cod-rep'] + ' - ' + value['nome'];
						else nomeAbrevList = nomeAbrevList + ', ' + value['cod-rep'] + ' - ' + value['nome'];
					}
					disclaimers.push({
						property: 'repres',
						value: value['cod-rep'],
						title: value['cod-rep'] + ' - ' + value['nome']
					});
				});

				if (icountRepres > 3) {
					nomeAbrevList = nomeAbrevList + '...';
				}

				controller.codeRepresentatives = codRepList;
				controller.representativesNames = nomeAbrevList;
				controller.advancedSearch.listRepres = disclaimers;

				controller.removeFilterByProperty("representatives");
				// somente re-adiciona o filter caso este foi definido
				if (controller.codeRepresentatives) {
					controller.addFilter("representatives", controller.codeRepresentatives, '', controller.i18n('l-representantes') + ": " + controller.representativesNames);
				}
				// Carrega a tela mesmo que não haja um filter (pode ter sido removido)
				controller.clearDefaultData(true);
				controller.loadData();
			}

		}

		if (appViewService.startView(controller.i18n('l-last-shipments'), 'mpd.shipment.Controller', controller)) {

			// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
			if (companyChange.checkContextData() === false){
				companyChange.getDataCompany(true);
			}

			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.search();
			});

			if ($stateParams.idShipment) {
				controller.advancedSearch.model.cddEmbarqIni = $stateParams.idShipment;
				controller.advancedSearch.model.cddEmbarqFim = $stateParams.idShipment;
			}

			if($stateParams.orderId != undefined && $stateParams.nomeAbrev != undefined){
				controller.advancedSearch.model.nrPedcliIni  = $stateParams.orderId;
				controller.advancedSearch.model.nrPedcliFim  = $stateParams.orderId;
				controller.advancedSearch.model.nomeAbrevIni = $stateParams.nomeAbrev;
				controller.advancedSearch.model.nomeAbrevFim = $stateParams.nomeAbrev;
			}

			//Faz o filtro pelo cliente selecionado
			if($rootScope.selectedcustomer){
				controller.advancedSearch.model.nomeAbrevIni = $rootScope.selectedcustomer['nome-abrev'];
				controller.advancedSearch.model.nomeAbrevFim = $rootScope.selectedcustomer['nome-abrev'];
			}

			controller.applyRepresentativeFilter();

		}else {

			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.search();
				//controller.loadData();
			});

			if ($stateParams.idShipment &&
				(controller.advancedSearch.model.cddEmbarqIni != $stateParams.idShipment ||
					controller.advancedSearch.model.cddEmbarqFim != $stateParams.idShipment)
				)
			{
				controller.advancedSearch.model.cddEmbarqIni = $stateParams.nomAbrev;
				controller.advancedSearch.model.cddEmbarqFim = $stateParams.nomAbrev;
				controller.search();
			}

			if($stateParams.orderId != undefined && $stateParams.nomeAbrev != undefined){
				controller.advancedSearch.model.nrPedcliIni  = $stateParams.orderId;
				controller.advancedSearch.model.nrPedcliFim  = $stateParams.orderId;
				controller.advancedSearch.model.nomeAbrevIni = $stateParams.nomeAbrev;
				controller.advancedSearch.model.nomeAbrevFim = $stateParams.nomeAbrev;
			}

			controller.applyRepresentativeFilter();
		}

	}//function shipmentCtrl()


	index.register.controller('mpd.shipment.Controller', shipmentCtrl);

	shipmentAdvSearchController.$inject = ['$modalInstance', 'model', '$q', 'userPreference'];
	function shipmentAdvSearchController ($modalInstance, model, $q, userPreference) {

		this.advancedSearch = model;
		var controller = this;

		if (this.advancedSearch.listRepres) {
			controller.disclaimers = this.advancedSearch.listRepres;
		}

		this.search = function () {

			this.codeRepresentatives = "";
			this.representativesNames = "";

			controller.icountRepres = 0;

			angular.forEach(controller.disclaimers, function (value, key) {
				if (value.property === "repres") {
					controller.icountRepres = controller.icountRepres + 1;
					controller.codeRepresentatives = controller.codeRepresentatives + value.value + '|';
					if (controller.icountRepres < 4) {
						if (controller.representativesNames == "") controller.representativesNames = value.title;
						else controller.representativesNames = controller.representativesNames + ', ' + value.title;
					}
				}
			});

			if (controller.icountRepres > 3) {
				controller.representativesNames = controller.representativesNames + '...';
			}

			this.advancedSearch.codeRepresentatives = controller.codeRepresentatives;
			this.advancedSearch.representativesNames = controller.representativesNames;
			this.advancedSearch.listRepres = controller.disclaimers;

			$q.all([userPreference.setPreference('dtIniEmbarque', this.advancedSearch.model.dtEmbarqueIni) ,
					userPreference.setPreference('dtFimEmbarque', this.advancedSearch.model.dtEmbarqueFim)])
			$modalInstance.close();
		}

		this.close = function () {
			$modalInstance.dismiss();
		}

		this.onZoomSelectRepresentatives = function () {

			if (!this.selectedRepresentatives) return;

			if (this.selectedRepresentatives.objSelected && this.selectedRepresentatives.size >= 0) {
				this.selectedRepresentatives = this.selectedRepresentatives.objSelected;
			}

			if (!angular.isArray(this.selectedRepresentatives)) {
				this.selectedRepresentatives = [this.selectedRepresentatives];
			}

			var representatives = [];
			this.disclaimers = [];
			for (var i = 0; i < this.selectedRepresentatives.length; i++) {
				var representatives = this.selectedRepresentatives[i];
				controller.addDisclaimer("repres", representatives['cod-rep'], representatives['cod-rep'] + ' - ' + representatives['nome'] + ' ');
			}

			this.allRepresentatives = representatives;
			delete this.selectedRepresentatives;
		}

		// adiciona um objeto na lista de disclaimers
		this.addDisclaimer = function (property, value, label) {
			controller.disclaimers.push({
				property: property,
				value: value,
				title: label
			});
		}

		// remove um disclaimer
		this.removeDisclaimer = function (disclaimer) {
			// pesquisa e remove o disclaimer do array
			var index = controller.disclaimers.indexOf(disclaimer);
			if (index != -1) {
				controller.disclaimers.splice(index, 1);
			}
		}
	}
	index.register.controller('mpd.shipment.adv-search.Controller', shipmentAdvSearchController);
});
