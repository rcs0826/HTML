define(['index',  '/dts/mpd/js/userpreference.js', '/dts/mpd/js/portal-factories.js','/dts/mpd/js/zoom/estabelec.js','/dts/mpd/js/mpd-factories.js','/dts/mpd/js/zoom/repres.js', '/dts/mpd/js/api/fchdis0035api.js'], function (index) {

	index.stateProvider
	.state('dts/mpd/invoices', {
		abstract: true,
		template: '<ui-view/>'
	})
	.state('dts/mpd/invoices.start', {
		url: '/dts/mpd/invoices',
		controller: 'salesorder.invoices.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/invoices/invoices.html'
	})
	.state('dts/mpd/invoices.startfromsalesorder', {
		url: '/dts/mpd/invoices/:orderId/:nomeAbrev',
		controller: 'salesorder.invoices.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/invoices/invoices.html'
	});

	invoicesCtrl.$inject = ['$http','$rootScope', '$location', 'TOTVSEvent', 'totvs.app-main-view.Service', 'salesorder.invoices.Factory', 'userPreference', 'portal.generic.Controller','portal.getUserData.factory', '$filter', '$modal', 'mpd.companyChange.Factory', '$stateParams'];

	function invoicesCtrl($http, $rootScope, $location, TOTVSEvent, appViewService, invoicesResource, userPreference, genericController, userdata, $filter, $modal, companyChange, $stateParams) {

		var controller = this;

		controller.date = $filter('date');
		controller.i18n = $filter('i18n');

		genericController.decorate(controller, invoicesResource);

		controller.advancedSearch = {model: {}};

		controller.loadMore = function() {
			controller.findRecords(controller.listResult.length, controller.filterBy);
		};


		controller.search = function() {
			controller.clearDefaultData(true);
			controller.clearFilter();
			controller.addFilters();
			controller.loadData();
		}

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

			if(value == 'FATURADAS'){
				controller.addFilter("faturadas", true, 'l-status', controller.i18n('l-nota-faturadas'));
			}
			if(value == 'CANCELADAS'){
				controller.addFilter("canceladas", true, 'l-status', controller.i18n('l-nota-canceladas'));
			}

			controller.addFilters();

			controller.loadData();
		}

		controller.addFilters = function(){

			if (controller.advancedSearch.model.codCliIni) {
				controller.addFilter("codCliIni", controller.advancedSearch.model.codCliIni, '', controller.i18n('l-cod-emitente-inicial') + ':' + controller.advancedSearch.model.codCliIni);
			}
			if (controller.advancedSearch.model.codCliFim) {
				controller.addFilter("codCliFim", controller.advancedSearch.model.codCliFim, '', controller.i18n('l-cod-emitente-final') + ':' + controller.advancedSearch.model.codCliFim);
			}

			if (controller.advancedSearch.model.nrPedCliIni) {
				controller.addFilter("nrPedCliIni", controller.advancedSearch.model.nrPedCliIni, '', controller.i18n('l-nr-pedcli-ini') + ':' + controller.advancedSearch.model.nrPedCliIni);
			}
			if (controller.advancedSearch.model.nrPedCliFim) {
				controller.addFilter("nrPedCliFim", controller.advancedSearch.model.nrPedCliFim, '', controller.i18n('l-nr-pedcli-fim') + ':' + controller.advancedSearch.model.nrPedCliFim);
			}

			if (controller.advancedSearch.model.codEstabel) {
				controller.addFilter("codEstabel", controller.advancedSearch.model.codEstabel, '', controller.i18n('l-estabel') + ':' + controller.advancedSearch.model.codEstabel);
			}

			if (controller.advancedSearch.model.nrNotaIni) {
				controller.addFilter("nrNotaIni", controller.advancedSearch.model.nrNotaIni, '', controller.i18n('nrNotaIni') + ':' + controller.advancedSearch.model.nrNotaIni);
			}

			if (controller.advancedSearch.model.nrNotaFim) {
				controller.addFilter("nrNotaFim", controller.advancedSearch.model.nrNotaFim, '', controller.i18n('nrNotaFim') + ':' + controller.advancedSearch.model.nrNotaFim);
			}

			if (controller.advancedSearch.model.nomAbrev) {
				controller.addFilter("nomAbrev", controller.advancedSearch.model.nomAbrev, '', controller.i18n('l-nome-abrev') + ':' + controller.advancedSearch.model.nomAbrev);
			}

			if (controller.advancedSearch.model.dtEmissIni) {
				var vDtEmissIni = controller.date(controller.advancedSearch.model.dtEmissIni, 'shortDate');
				controller.addFilter("dtEmissIni", controller.advancedSearch.model.dtEmissIni, '', controller.i18n('l-initial-dt-emiss') + ':' + vDtEmissIni);
			}

			if (controller.advancedSearch.model.dtEmissFim) {
				var vDtEmissFim = controller.date(controller.advancedSearch.model.dtEmissFim, 'shortDate');
				controller.addFilter("dtEmissFim", controller.advancedSearch.model.dtEmissFim, '', controller.i18n('l-final-dt-emiss') + ':' + vDtEmissFim);
			}

			if (controller.quickSearchText) {
				controller.addFilter("simpleFilter", controller.quickSearchText, '', controller.i18n('l-simple-filter') + ':' + controller.quickSearchText);
			}

			if (controller.codeRepresentatives) {
				$rootScope.MPDInvoicesCustomRepresentative = true;
				controller.addFilter("representatives", controller.codeRepresentatives, '', controller.i18n('l-representantes') + ": " + controller.representativesNames);
			}

		}

		controller.loadData = function () {
			controller.findRecords(null, controller.filterBy);
		}

		controller.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/invoices/invoices-adv-search.html',
			  controller: 'salesorder.invoices.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
				model: function () {
				  return controller.advancedSearch;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.codeRepresentatives  = controller.advancedSearch.codeRepresentatives;
				controller.representativesNames = controller.advancedSearch.representativesNames;
				controller.search();
			});
		}


		controller.getInvoiceItens = function(invoice) {
			if (!invoice.invoiceItens) {

				if (invoice.serie == "") {
					invoice.serie = " ";
				}

				invoicesResource.getInvoiceItems({siteid: invoice['cod-estabel'], series: invoice.serie, invoiceNumber: invoice['nr-nota-fis']}, function(result) {
					invoice.invoiceItens = result;
				});
			}
		}

		controller.sendTicket = function(invoice) {
			if (invoice.serie == "") {
				invoice.serie = " ";
			}

			invoicesResource.sendTicket({site: invoice['cod-estabel'], serie: invoice['serie'], invoiceNumber: invoice['nr-nota-fis']}, function(result) {
			});
		}

		controller.downloadTicket = function (invoice) {
			if (invoice.serie == "") {
				invoice.serie = " ";
			}

			var downloadUrl = "/dts/datasul-rest/resources/api/fch/fchdis/fchdis0043/downloadTicket?site="+ invoice['cod-estabel'] + "&serie=" + invoice['serie'] + "&invoiceNumber=" + invoice['nr-nota-fis'];
			var a = document.createElement("a");

			$http.get(downloadUrl).
			success(function () {
				a.target="_blank";
				a.href = downloadUrl;
				a.target = 'hiddenIframe';
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}).
			error(function (data, status) {
				var msgTitle = controller.i18n('error-download-file');
				var msgDesc = controller.i18n('error-download-file-desc');
				var msgDetail = 'HTTP Status error: ' + status;

				$rootScope.$broadcast(TOTVSEvent.showMessage, {
					title: msgTitle,
					text: msgDesc + " | " + msgDetail
				});
			});
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

		this.applyRepresentativeFilter = function () {
			//Faz o filtro pelos representantes selecionados
			if($rootScope.selectedRepresentatives && $rootScope.MPDInvoicesCustomRepresentative === false){
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
		};

		if (appViewService.startView(controller.i18n('l-invoices'), 'salesorder.invoices.Controller', controller)) {
			controller.clearFilter();

			if($stateParams.orderId != undefined && $stateParams.nomeAbrev != undefined){
				controller.clearFilter();
				controller.addFilter("nrPedCliIni", decodeURIComponent($stateParams.orderId),   '', controller.i18n('l-nr-pedcli-ini') + ':' + decodeURIComponent($stateParams.orderId));
				controller.addFilter("nrPedCliFim", decodeURIComponent($stateParams.orderId),   '', controller.i18n('l-nr-pedcli-fim') + ':' + decodeURIComponent($stateParams.orderId));
				controller.addFilter("nomAbrev",    decodeURIComponent($stateParams.nomeAbrev), '', controller.i18n('l-nome-abrev')    + ':' + decodeURIComponent($stateParams.nomeAbrev));
			}else{

				//Faz o filtro pelo cliente selecionado
				if($rootScope.selectedcustomer){
					controller.addFilter("nomAbrev", $rootScope.selectedcustomer['nome-abrev'], '', controller.i18n('l-nome-abrev')    + ':' + $rootScope.selectedcustomer['nome-abrev']);
				}

				controller.applyRepresentativeFilter();

			}

			// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
			if (companyChange.checkContextData() === false){
				companyChange.getDataCompany(true);
			}

			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.loadData();
			});

			controller.loadData();
		}else {

			if($stateParams.orderId != undefined && $stateParams.nomeAbrev != undefined){
				controller.clearFilter();
				controller.addFilter("nrPedCliIni", decodeURIComponent($stateParams.orderId),   '', controller.i18n('l-nr-pedcli-ini') + ':' + decodeURIComponent($stateParams.orderId));
				controller.addFilter("nrPedCliFim", decodeURIComponent($stateParams.orderId),   '', controller.i18n('l-nr-pedcli-fim') + ':' + decodeURIComponent($stateParams.orderId));
				controller.addFilter("nomAbrev",    decodeURIComponent($stateParams.nomeAbrev), '', controller.i18n('l-nome-abrev')    + ':' + decodeURIComponent($stateParams.nomeAbrev));
				controller.loadData();
			}

			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.loadData();
			});

			controller.applyRepresentativeFilter();
		}

	}//function invoicesCtrl()


	index.register.controller('salesorder.invoices.Controller', invoicesCtrl);

	invoicesAdvSearchController.$inject = ['$modalInstance', 'model', 'mpd.fchdis0035.factory', 'portal.getUserData.factory',];
	function invoicesAdvSearchController ($modalInstance, model, fchdis0035, userdata) {

		this.advancedSearch = model;
		this.currentUserRoles  = [];

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

		this.getProfileConfig = function(){

			controller.isRepresentative = false;
			controller.isCustomer = false;


			for (var i = controller.currentUserRoles.length - 1; i >= 0; i--) {
				if(controller.currentUserRoles[i] == "representative"){
					controller.isRepresentative = true;
				}

				if(controller.currentUserRoles[i] == "customer"){
					controller.isCustomer = true;
				}
			}

			controller.mainOrderProfileConfig = {isRepresentative: controller.isRepresentative,
												 isCustomer: controller.isCustomer
												};

		}
		
		fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){
			controller.currentUserRoles = result.out.split(",");
			controller.getProfileConfig();
		});
	}
	index.register.controller('salesorder.invoices.adv-search.Controller', invoicesAdvSearchController);




});
