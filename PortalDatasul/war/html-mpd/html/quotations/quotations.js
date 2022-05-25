define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/api/fchdis0051.js',
		'/dts/mpd/js/zoom/emitente.js',
		'/dts/mpd/js/zoom/transporte.js',
		'/dts/mpd/js/zoom/cond-pagto-inter.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/zoom/repres.js',
		'/dts/dts-utils/js/lodash-angular.js'
	], function(index) {

	index.stateProvider
		.state('dts/mpd/quotations', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/quotations.start', {
			url: '/dts/mpd/quotations',
			controller: 'quotation.quotations.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/quotations/quotations.html'
		})
		.state({
			name: 'dts/mpd/quotations.filterNomAbrev',
			url: '/dts/mpd/quotations/:codEmitente?nomAbrev&isLead',
			controller: 'quotation.quotations.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/quotations/quotations.html'
		})
		.state('dts/mpd/quotations.copy', {
			url: '/dts/mpd/quotations/:orderId/copy',
			controller: 'quotation.quotations.CopyController',
			controllerAs: 'copyController',
			templateUrl: '/dts/mpd/html/quotations/quotations.copy.html'
		});

	quotationsCtrl.$inject = ['$rootScope', '$window', 'totvs.app-main-view.Service', 'quotation.quotations.Factory', 'userPreference', '$filter', '$q', '$modal', '$stateParams', 'customization.generic.Factory', 'portal.generic.Controller', 'portal.getUserData.factory', 'mpd.companyChange.Factory', 'mpd.fchdis0051.Factory', '$state', 'mpd.fchdis0035.factory', '$scope', '$location'];

	function quotationsCtrl($rootScope, $window, appViewService, quotationsResource, userPreference, $filter, $q, $modal, $stateParams, customService, genericController, userdata, companyChange, fchdis0051, $state, fchdis0035, $scope, $location) {

		var quotationsCtrl = this;
		quotationsCtrl.currentUser = [];
		quotationsCtrl.customerUser = null;

		var paramVisibleFieldsPedVendaLista = {cTable: "cotac-ped-venda-lista"};

		genericController.decorate(this, quotationsResource);

		this.i18n = $filter('i18n');

		quotationsCtrl.statusPortalQuotation1 = 1;
		quotationsCtrl.statusPortalQuotation2 = 2;
		quotationsCtrl.statusPortalQuotation3 = 3;
		quotationsCtrl.statusPortalQuotation4 = 4;
		quotationsCtrl.statusPortalQuotation5 = 5;
		quotationsCtrl.statusPortalQuotation6 = 6;
		quotationsCtrl.statusPortalQuotation7 = 7;
		quotationsCtrl.statusPortalQuotation8 = 8;

		this.advancedSearch = {model: {}};

		quotationsCtrl.getBoolean = function (value){
		   switch(value){
				case true:
				case "true":
				case 1:
				case "1":
				case "yes":
					return true;
				default:
					return false;
			}
		}

		quotationsCtrl.isLead = this.getBoolean($stateParams.isLead);
		quotationsCtrl.codEmitente = $stateParams.codEmitente || undefined;

		this.optionFieldsStatus = [
			{
				label: this.i18n('l-status-quotation-1'), //Abertos
				value: '1'
			}, {
				label: this.i18n('l-status-quotation-2'), //Atendido Parcial
				value: '2'
			}, {
				label: this.i18n('l-status-quotation-3'), //'Atendido Total
				value: '3'
			}, {
				label: this.i18n('l-status-quotation-4'), //Pendente
				value: '4'
			}, {
				label: this.i18n('l-status-quotation-5'), //Suspenso
				value: '5'
			}, {
				label: this.i18n('l-status-quotation-6'), //Cancelado
				value: '6'
			}, {
				label: this.i18n('l-status-quotation-7'), //Fatur Balcão
				value: '7'
			}
		];

		this.selectedOptionStatus = this.optionFieldsStatus[0];

		this.showSelectSearchField = false;
		this.showDateSearchField = false;

		this.canCreateModel = false;

		this.callEpc = function(item, index) {
			// chamada de ponto de customização
			customService.callEvent('quotation.quotations', 'afterLoadQuotations', {controller: quotationsCtrl, item: item, index: index});
		};

		this.loadQuotations = function() {
			this.findRecords(null, quotationsCtrl.filterBy);
		};

		this.applySimpleFilter = function() {
			quotationsCtrl.clearFilter();
			quotationsCtrl.setAdvancedFilterValues();
			if(quotationsCtrl.quickSearchText){
				quotationsCtrl.addFilter("simpleFilter", quotationsCtrl.quickSearchText, quotationsCtrl.i18n('l-simple-filter'), quotationsCtrl.i18n('l-simple-filter') + ': ' + quotationsCtrl.quickSearchText, quotationsCtrl);
			}
			quotationsCtrl.loadQuotations();
		};

		this.setQuickFilter = function(value) {

			quotationsCtrl.clearFilter();

			if (value == quotationsCtrl.statusPortalQuotation1) {
				quotationsCtrl.addFilter("statusPortalQuotation1", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-1'), quotationsCtrl);
			}
			if (value == quotationsCtrl.statusPortalQuotation2) {
				quotationsCtrl.addFilter("statusPortalQuotation2", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-2'), quotationsCtrl);
			}
			if (value == quotationsCtrl.statusPortalQuotation3) {
				quotationsCtrl.addFilter("statusPortalQuotation3", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-3'), quotationsCtrl);
			}
			if (value == quotationsCtrl.statusPortalQuotation4) {
				quotationsCtrl.addFilter("statusPortalQuotation4", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-4'), quotationsCtrl);
			}
			if (value == quotationsCtrl.statusPortalQuotation5) {
				quotationsCtrl.addFilter("statusPortalQuotation5", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-5'), quotationsCtrl);
			}
			if (value == quotationsCtrl.statusPortalQuotation6) {
				quotationsCtrl.addFilter("statusPortalQuotation6", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-6'), quotationsCtrl);
			}
			if (value == quotationsCtrl.statusPortalQuotation7) {
				quotationsCtrl.addFilter("statusPortalQuotation7", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-7'), quotationsCtrl);
			}
			if (value == quotationsCtrl.statusPortalQuotation8) {
				quotationsCtrl.addFilter("statusPortalQuotation8", value, 'l-status', quotationsCtrl.i18n('l-status-quotation-8'), quotationsCtrl);
			}

			quotationsCtrl.setAdvancedFilterValues();

			quotationsCtrl.loadQuotations();
		};

		this.searchAdvancedFilter = function() {
			quotationsCtrl.clearFilter();
			quotationsCtrl.setAdvancedFilterValues();
			quotationsCtrl.loadQuotations();
		};

		this.setAdvancedFilterValues = function() {

			var cStatusQuotation = "";

			if (quotationsCtrl.advancedSearch.model.codCotacCliIni) {
				quotationsCtrl.addFilter("codCotacCliIni", quotationsCtrl.advancedSearch.model.codCotacCliIni, "", quotationsCtrl.i18n('l-quotation-client') + ":" + quotationsCtrl.advancedSearch.model.codCotacCliIni, quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.codCotacCliFim) {
				quotationsCtrl.addFilter("codCotacCliFim", quotationsCtrl.advancedSearch.model.codCotacCliFim, "", quotationsCtrl.i18n('l-filter-to-generic') + ":" + quotationsCtrl.advancedSearch.model.codCotacCliFim, quotationsCtrl);
			}

			if (quotationsCtrl.advancedSearch.model.nomeAbrevIni) {
				quotationsCtrl.addFilter("nomeAbrevIni", quotationsCtrl.advancedSearch.model.nomeAbrevIni, "", quotationsCtrl.i18n('l-nome-abrev-start') + ":" + quotationsCtrl.advancedSearch.model.nomeAbrevIni, quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.nomeAbrevFim) {
				quotationsCtrl.addFilter("nomeAbrevFim", quotationsCtrl.advancedSearch.model.nomeAbrevFim, "", quotationsCtrl.i18n('l-filter-to-generic') + ":" + quotationsCtrl.advancedSearch.model.nomeAbrevFim, quotationsCtrl);
			}

			if (quotationsCtrl.advancedSearch.model.codCotacIni) {
				quotationsCtrl.addFilter("codCotacIni", quotationsCtrl.advancedSearch.model.codCotacIni, "", quotationsCtrl.i18n('l-nr-cotac-start') + ":" + quotationsCtrl.advancedSearch.model.codCotacIni, quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.codCotacFim) {
				quotationsCtrl.addFilter("codCotacFim", quotationsCtrl.advancedSearch.model.codCotacFim, "", quotationsCtrl.i18n('l-filter-to-generic') + ":" + quotationsCtrl.advancedSearch.model.codCotacFim, quotationsCtrl);
			}

			if (quotationsCtrl.advancedSearch.model.dtImplIni) {
				var vDtImplIni = $filter('date')(quotationsCtrl.advancedSearch.model.dtImplIni, 'shortDate');

				quotationsCtrl.addFilter("dtImplIni", vDtImplIni, '', quotationsCtrl.i18n('l-initial-dt-emiss') + ":" + vDtImplIni, quotationsCtrl);
				userPreference.setPreference('summaryInitDate', quotationsCtrl.advancedSearch.model.dtImplIni);
			}
			if (quotationsCtrl.advancedSearch.model.dtImplFim) {
				var vDtImplFim = $filter('date')(quotationsCtrl.advancedSearch.model.dtImplFim, 'shortDate');
				quotationsCtrl.addFilter("dtImplFim", vDtImplFim, '', quotationsCtrl.i18n('l-final-dt-emiss') + ":" + vDtImplFim, quotationsCtrl);
			}

			if (quotationsCtrl.codeRepresentatives) {
				$rootScope.MPDSalesOrderCustomRepresentative = true;
				quotationsCtrl.addFilter("representatives", quotationsCtrl.codeRepresentatives, '', quotationsCtrl.i18n('l-representantes') + ": " + quotationsCtrl.representativesNames);
			}

			angular.forEach(quotationsCtrl.filterBy, function(value, key){
				switch(value.property){
					case "statusPortalQuotation1":
						cStatusQuotation = "statusPortalQuotation1";
						break;
					case "statusPortalQuotation2":
						cStatusQuotation = "statusPortalQuotation2";
						break;
					case "statusPortalQuotation3":
						cStatusQuotation = "statusPortalQuotation3";
						break;
					case "statusPortalQuotation4":
						cStatusQuotation = "statusPortalQuotation4";
						break;
					case "statusPortalQuotation5":
						cStatusQuotation = "statusPortalQuotation5";
						break;
					case "statusPortalQuotation6":
						cStatusQuotation = "statusPortalQuotation6";
						break;
					case "statusPortalQuotation7":
						cStatusQuotation = "statusPortalQuotation7";
						break;
					case "statusPortalQuotation8":
						cStatusQuotation = "statusPortalQuotation8";
						break;
				}

			});
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation1 && cStatusQuotation != "statusPortalQuotation1") {
				quotationsCtrl.addFilter("statusPortalQuotation1", quotationsCtrl.advancedSearch.model.statusPortalQuotation1, 'l-status-1', quotationsCtrl.i18n('l-status-quotation-1'), quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation2 && cStatusQuotation != "statusPortalQuotation2") {
				quotationsCtrl.addFilter("statusPortalQuotation2", quotationsCtrl.advancedSearch.model.statusPortalQuotation2, 'l-status-2', quotationsCtrl.i18n('l-status-quotation-2'), quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation3 && cStatusQuotation != "statusPortalQuotation3") {
				quotationsCtrl.addFilter("statusPortalQuotation3", quotationsCtrl.advancedSearch.model.statusPortalQuotation3, 'l-status-3', quotationsCtrl.i18n('l-status-quotation-3'), quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation4 && cStatusQuotation != "statusPortalQuotation4") {
				quotationsCtrl.addFilter("statusPortalQuotation4", quotationsCtrl.advancedSearch.model.statusPortalQuotation4, 'l-status-4', quotationsCtrl.i18n('l-status-quotation-4'), quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation5 && cStatusQuotation != "statusPortalQuotation5") {
				quotationsCtrl.addFilter("statusPortalQuotation5", quotationsCtrl.advancedSearch.model.statusPortalQuotation5, 'l-status-5', quotationsCtrl.i18n('l-status-quotation-5'), quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation6 && cStatusQuotation != "statusPortalQuotation6") {
				quotationsCtrl.addFilter("statusPortalQuotation6", quotationsCtrl.advancedSearch.model.statusPortalQuotation6, 'l-status-6', quotationsCtrl.i18n('l-status-quotation-6'), quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation7 && cStatusQuotation != "statusPortalQuotation7") {
				quotationsCtrl.addFilter("statusPortalQuotation7", quotationsCtrl.advancedSearch.model.statusPortalQuotation7, 'l-status-7', quotationsCtrl.i18n('l-status-quotation-7'), quotationsCtrl);
			}
			if (quotationsCtrl.advancedSearch.model.statusPortalQuotation8 && cStatusQuotation != "statusPortalQuotation8") {
				quotationsCtrl.addFilter("statusPortalQuotation8", quotationsCtrl.advancedSearch.model.statusPortalQuotation8, 'l-status-8', quotationsCtrl.i18n('l-status-quotation-8'), quotationsCtrl);
			}
		};

		this.removeSelectedFilter = function(filter) {

			if (filter.property == "representatives") {
				quotationsCtrl.codeRepresentatives = undefined;
				quotationsCtrl.advancedSearch.listRepres = '';
			}

			quotationsCtrl.removeFilterByProperty(filter.property);
			delete quotationsCtrl.advancedSearch.model[filter.property];
			quotationsCtrl.loadQuotations();
		};

		this.getQuotationsItens = function(quotation) {
			if (!quotation.quotationItens) {
				quotationsResource.getQuotation({nrPedido: quotation['nr-pedido']}, function(result) {
					quotation.quotationItens = result.ttQuotationItem;
				});
			}
		};

		this.removeFilterByProperty =  function (property) {
			angular.forEach(quotationsCtrl.filterBy, function(value) {
				if (value.property === property) {
					var index = quotationsCtrl.filterBy.indexOf(value);
					if (index != -1) {
						quotationsCtrl.filterBy.splice(index, 1);
					}
				}
			});
		};


		this.applyRepresentativeFilter = function() {
			//Faz o filtro pelos representantes selecionados
			if($rootScope.selectedRepresentatives && $rootScope.MPDSalesOrderCustomRepresentative === false) {
				var codRepList = "";
				var nomeAbrevList = "";
				var icountRepres = 0;
				var disclaimers = [];

				angular.forEach($rootScope.selectedRepresentatives, function (value, key) {

					icountRepres = icountRepres + 1;
					codRepList = codRepList + value['nome-abrev'] + '|';
					if (icountRepres < 4) {
						if (nomeAbrevList == "") nomeAbrevList = value['cod-rep'] + ' - ' + value['nome'];
						else nomeAbrevList = nomeAbrevList + ', ' + value['cod-rep'] + ' - ' + value['nome'];
					}
					disclaimers.push({
						property: 'repres',
						value: value['nome-abrev'],
						title: value['cod-rep'] + ' - ' + value['nome']
					});
				});

				if (icountRepres > 3) {
					nomeAbrevList = nomeAbrevList + '...';
				}

				quotationsCtrl.codeRepresentatives = codRepList;
				quotationsCtrl.representativesNames = nomeAbrevList;
				quotationsCtrl.advancedSearch.listRepres = disclaimers;

				quotationsCtrl.removeFilterByProperty("representatives");
				// somente re-adiciona o filter caso este foi definido
				if (quotationsCtrl.codeRepresentatives) {
					quotationsCtrl.addFilter("representatives", quotationsCtrl.codeRepresentatives, '', quotationsCtrl.i18n('l-representantes') + ": " + quotationsCtrl.representativesNames);
				}
				// Carrega a tela mesmo que não haja um filter (pode ter sido removido)
				quotationsCtrl.clearDefaultData(true);
				quotationsCtrl.loadQuotations();
			}
		}

		this.openAdvancedSearch = function() {

			quotationsCtrl.advancedSearch.model.isRepresentative = quotationsCtrl.quotationsProfileConfig.isRepresentative;

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/quotations/quotations-adv-search.html',
				controller: 'quotation.quotations.adv-search.Controller as controller',
				size: 'lg',
				resolve: {
					model: function() {
						return quotationsCtrl.advancedSearch;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				quotationsCtrl.codeRepresentatives = quotationsCtrl.advancedSearch.codeRepresentatives;
				quotationsCtrl.representativesNames = quotationsCtrl.advancedSearch.representativesNames;
				quotationsCtrl.searchAdvancedFilter();
			});
		};

		this.getProfileConfig = function(){

			quotationsCtrl.isRepresentative = false;
			quotationsCtrl.isCustomer = false;

			for (var i = quotationsCtrl.currentUser.length - 1; i >= 0; i--) {
				if(quotationsCtrl.currentUser[i] == "representative"){
					quotationsCtrl.isRepresentative = true;
				}

				if(quotationsCtrl.currentUser[i] == "customer"){
					quotationsCtrl.isCustomer = true;
				}
			}

			quotationsCtrl.quotationsProfileConfig = {
				fields: quotationsCtrl.pedVendaListaVisibleFields,
				isRepresentative: quotationsCtrl.isRepresentative,
				isCustomer: quotationsCtrl.isCustomer
			};

		}

		if (appViewService.startView( quotationsCtrl.i18n('l-quotation-portfolio'), 'quotation.quotations.Controller', this)) {

			// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
			if (companyChange.checkContextData() === false){
				companyChange.getDataCompany(true);
			}

			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				quotationsCtrl.searchAdvancedFilter();
			});

			quotationsResource.getQuotationParam(function(ttPortalParam){
				for (var i = 0; i < ttPortalParam.length; i++) {
					if (ttPortalParam[i]['cod-param'] == 'createOrderModel') {
						quotationsCtrl.canCreateModel = true;
					}
				}
			});

			//Faz o filtro pelo cliente selecionado
			if($rootScope.selectedcustomer){
				quotationsCtrl.advancedSearch.model.nomAbrevIni = $rootScope.selectedcustomer['nome-abrev'];
				quotationsCtrl.advancedSearch.model.nomAbrevFim = $rootScope.selectedcustomer['nome-abrev'];
			}

			quotationsCtrl.applyRepresentativeFilter();

			$q.all([userPreference.getPreference('summaryInitDate')])
					.then(function(data) {
						var dt = new Date();
						if (data && data[0].prefValue) {
							dt = new Date(parseFloat(data[0].prefValue));
						} else {
							dt.setMonth(dt.getMonth() - 1);
						}
						if ( isNaN(dt.getTime())) {
							dt = new Date();
							dt.setMonth(dt.getMonth() - 1);
						}

						quotationsCtrl.advancedSearch.model.dtEmissIni = dt.getTime();

						if (quotationsCtrl.isLead === true && quotationsCtrl.codEmitente) {
							//quotationsCtrl.advancedSearch.model.isLead = true;
							quotationsCtrl.advancedSearch.model.codIdProsp = quotationsCtrl.codEmitente;
						} else if ($stateParams.nomAbrev) {
							quotationsCtrl.advancedSearch.model.nomAbrevIni = $stateParams.nomAbrev;
							quotationsCtrl.advancedSearch.model.nomAbrevFim = $stateParams.nomAbrev;
						}
						quotationsCtrl.searchAdvancedFilter();
			});


			fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){
				quotationsCtrl.currentUser = result.out.split(",");

				fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaLista, function(result) {
					quotationsCtrl.pedVendaListaVisibleFields = result;
					quotationsCtrl.getProfileConfig();
				});
			});


		} else {

			quotationsCtrl.applyRepresentativeFilter();

			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				quotationsCtrl.searchAdvancedFilter();
			});

			quotationsResource.getQuotationParam(function(ttPortalParam){
				for (var i = 0; i < ttPortalParam.length; i++) {
					if (ttPortalParam[i]['cod-param'] == 'createOrderModel') {
						quotationsCtrl.canCreateModel = true;
					}
				}
			});


			if ((quotationsCtrl.isLead === true && quotationsCtrl.codEmitente) && (quotationsCtrl.codEmitente !== quotationsCtrl.advancedSearch.model.codIdProsp)) {
				quotationsCtrl.advancedSearch.model.codIdProsp = quotationsCtrl.codEmitente;
			} else if ($stateParams.nomAbrev &&
					(quotationsCtrl.advancedSearch.model.nomAbrevIni != $stateParams.nomAbrev ||
							quotationsCtrl.advancedSearch.model.nomAbrevFim != $stateParams.nomAbrev)
					)
			{
				quotationsCtrl.advancedSearch.model.nomAbrevIni = $stateParams.nomAbrev;
				quotationsCtrl.advancedSearch.model.nomAbrevFim = $stateParams.nomAbrev;

				quotationsCtrl.searchAdvancedFilter();
			}
		}

		this.loadMore = function () {
			this.findRecords(quotationsCtrl.listResult.length, quotationsCtrl.filterBy);
		};

		quotationsCtrl.quickSearchText = '';

		this.openModalCopy = function(nrPedidoOriginal) {

			for (var i = 0; i < quotationsCtrl.currentUser.length; i++) {
				if (quotationsCtrl.currentUser[i] == "customer") {
					quotationsCtrl.customerUser = true;
				}
			};

			// Caso perfil do usuario seja cliente faz a copia simples
			if(quotationsCtrl.customerUser){
				quotationsResource.newCopy({}, function(data) {
					$modal.open({
						templateUrl: '/dts/mpd/html/ordercopy/ordercopy.html',
						controller: 'quotation.modalQuotationCopy.Controller as controller',
						size: 'lg',
						resolve: {
							modalParams: function() {
								return {
									nrPedidoNovo: data.nrPedido,
									nrPedidoOriginal: nrPedidoOriginal,
									nrPedidoClienteNovo: data.nrPedido
								};
							}
						}
					});
				});
			// Caso perfil do usuario seja representante faz a copia customizada
			}else{
				fchdis0051.cancopyorder ({nrPedido: nrPedidoOriginal} , function (result) {
					customService.callCustomEvent("canCopyOrder", {
						controller:quotationsCtrl,
						result: result
					});
					if (result.canCopy) {
						$state.go('dts/mpd/quotations.copy', {orderId: nrPedidoOriginal});
					}
				});
			}

		};

		this.print = function(orderId) {
			quotationsResource.getPrintUrl(orderId, function(url) {
				$window.open(url);
			});
		};

	}//function quotationsCtrl()

	modalQuotationCopyCtrl.$inject = ['$location', 'quotation.quotations.Factory', 'modalParams', '$modalInstance'];

	function modalQuotationCopyCtrl($location, quotationsResource, modalParams, $modalInstance) {

		var _self = this;

		this.nrPedidoNovo = parseInt(modalParams.nrPedidoNovo);
		this.nrPedidoOriginal = parseInt(modalParams.nrPedidoOriginal);
		this.nrPedidoClienteNovo = parseInt(modalParams.nrPedidoClienteNovo);

		this.close = function() {
			$modalInstance.dismiss('cancel');
		};

		this.confirm = function() {

			if((_self.nrPedidoNovo == undefined) || (_self.nrPedidoClienteNovo == undefined)) return;

			quotationsResource.copy({nrPedido: _self.nrPedidoOriginal, newNrPedido: _self.nrPedidoNovo, newNrPedcli: _self.nrPedidoClienteNovo}, function(result) {
				$modalInstance.dismiss('confirm');
				$location.path('/dts/mpd/order/' + result.nrPedido);
			});
		};
	}

	quotationAdvSearchController.$inject = ['$modalInstance', 'model'];
	function quotationAdvSearchController($modalInstance, model) {
		this.advancedSearch = model;

		var ctrl = this;

		if (this.advancedSearch.listRepres) {
			ctrl.disclaimers = this.advancedSearch.listRepres;
		}

		this.search = function() {

			this.codeRepresentatives = "";
			this.representativesNames = "";

			ctrl.icountRepres = 0;
			angular.forEach(ctrl.disclaimers, function (value, key) {

				ctrl.icountRepres = ctrl.icountRepres + 1;
				ctrl.codeRepresentatives = ctrl.codeRepresentatives + value.value + '|';
				if (ctrl.icountRepres < 4) {
					if (ctrl.representativesNames == "") ctrl.representativesNames = value.title;
					else ctrl.representativesNames = ctrl.representativesNames + ', ' + value.title;
				}
			});

			if (ctrl.icountRepres > 3) {
				ctrl.representativesNames = ctrl.representativesNames + '...';
			}
			ctrl.advancedSearch.codeRepresentatives = ctrl.codeRepresentatives;
			ctrl.advancedSearch.representativesNames = ctrl.representativesNames;
			ctrl.advancedSearch.listRepres = ctrl.disclaimers;

			$modalInstance.close();
		};

		this.clear = function() {
			ctrl.advancedSearch.model.nomeAbrevIni = undefined;
			ctrl.advancedSearch.model.nomeAbrevFim = undefined;
			ctrl.advancedSearch.model.codCotacCliIni = undefined;
			ctrl.advancedSearch.model.codCotacCliFim = undefined;
			ctrl.advancedSearch.model.codCotacIni = undefined;
			ctrl.advancedSearch.model.codCotacFim = undefined;
			ctrl.advancedSearch.model.dtImplIni = undefined;
			ctrl.advancedSearch.model.dtImplFim = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation1 = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation2 = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation3 = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation4 = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation5 = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation6 = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation7 = undefined;
			ctrl.advancedSearch.model.statusPortalQuotation8 = undefined;
		};

		this.close = function() {
			$modalInstance.dismiss();
		};

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
				ctrl.addDisclaimer("repres", representatives['nome-abrev'], representatives['cod-rep'] + ' - ' + representatives['nome'] + ' ');
			}

			this.allRepresentatives = representatives;
			delete this.selectedRepresentatives;
		}

		// adiciona um objeto na lista de disclaimers
		this.addDisclaimer = function (property, value, label) {
			ctrl.disclaimers.push({
				property: property,
				value: value,
				title: label
			});
		}

		// remove um disclaimer
		this.removeDisclaimer = function (disclaimer) {
			// pesquisa e remove o disclaimer do array
			var index = ctrl.disclaimers.indexOf(disclaimer);
			if (index != -1) {
				ctrl.disclaimers.splice(index, 1);
			}
		}
	}


	copyController.$inject = [
		'$rootScope',
		'$filter',
		'$stateParams',
		'$modal',
		'mpd.fchdis0051.Factory',
		'totvs.app-main-view.Service',
		'customization.generic.Factory',
		'TOTVSEvent'];
	function copyController (
		$rootScope,
		$filter,
		$stateParams,
		$modal,
		fchdis0051,
		appViewService,
		customService,
		TOTVSEvent) {

		var copyController = this;

		copyController.copyParams = {

			'i-situacao'       : '1',
			'i-natur-oper'     : '1',
			'l-exp-dt-entrega' : false,
			'i-qtde-item'      : '1',
			'i-origem'         : '2' /* Portal de Vendas */
		}

		var i18n = $filter('i18n');
		var currency = $filter('currency');
		var number = $filter('number');

		copyController.orderId = $stateParams.orderId;

		copyController.selectEmitente = function (copy) {
			copy['cod-emitente'] = copy['emitente']['cod-emitente'];
			copy['nome-abrev']   = copy['emitente']['nome-abrev'];

			fchdis0051.changeemitentecopyorder ({nrPedido: copyController.orderId}, copy,function (result) {

				customService.callCustomEvent("changeEmitenteCopyOrder", {
					controller:copyController,
					result: result
				});

				copy['nome-transp'] = result['tt-ped-copia'][0]['nome-transp'];
				copy['cod-entrega'] = result['tt-ped-copia'][0]['cod-entrega'];
			})
		}

		copyController.orderCopies = [];
		copyController.newCopy = function () {

			copyController.copyResult = [];

			fchdis0051.newcopyorder({nrPedido: copyController.orderId} , function (result) {

				customService.callCustomEvent("newCopyOrder", {
					controller:copyController,
					result: result
				});

				copyController.orderCopies.push(result['tt-ped-copia'][0]);
			});

		}

		copyController.removeCopy = function ($index) {
			copyController.orderCopies.splice($index,1);
		}

		copyController.parameters = function () {

			var modalInstance = $modal.open({

				templateUrl: '/dts/mpd/html/quotations/quotations.copy.params.html',
				controller: 'quotation.quotationsCopyParams.Controller as copyParamscontroller',
				size: 'lg',
				resolve: {
					copyParameters: function() {
						return copyController.copyParams;
					}
				}
			});

			modalInstance.result.then(function (data) {
				copyController.copyParams = data;
			});

		}

		copyController.updateItems = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/quotations/quotations.copy.items.html',
				controller: 'quotation.quotationsCopyItems.Controller as copyItemsController',
				size: 'lg',
				resolve: {
					copyItems: function() {
						return copyController.copyItems;
					}
				}
			});

			modalInstance.result.then(function (data) {
				copyController.copyItems = data;
			});
		}

		copyController.executeCopy = function () {

			/* Determina a origem da cópia como Portal de Vendas */
			copyController.copyParams['i-origem'] = 2.

			fchdis0051.copyorder({nrPedido: copyController.orderId}, {'tt-copy-params':copyController.copyParams, 'tt-ped-copia':copyController.orderCopies, 'tt-item-copia':copyController.copyItems}, function (result) {

				customService.callCustomEvent("copyOrder", {controller:copyController,result: result });
				copyController.copyResult = result['tt-pedidos-criados'];

				if (result['tt-pedidos-criados'].length) {

					var lista = "";
					for(var i = 0; i < result['tt-pedidos-criados'].length; i++) {
						if (i > 0) lista = lista + ", ";
						lista = lista + result['tt-pedidos-criados'][i].nrPedido;
					}

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: i18n('Cópia de Pedidos', [], 'dts/mpd/'),
						detail: i18n('Os pedidos foram copiados:', [], 'dts/mpd/') + ": " + lista
					});

					copyController.orderCopies = [];
				}

			});
		}

		appViewService.startView(i18n('Cópia de Pedido',[],'dts/mpd') + " " + copyController.orderId,'quotation.quotations.CopyController', copyController);

		fchdis0051.cancopyorder ({nrPedido: copyController.orderId} , function (result) {

			customService.callCustomEvent("checkCanCopyOrder", {
				controller:copyController,
				result: result
			});

			if (!result.canCopy) {
				var views = appViewService.openViews;
				var i, len = views.length, view;

				for (i = 0; i < len; i += 1) {
					if (views[i].url === "/dts/mpd/quotations/" + copyController.orderId + "/copy") {
						view = views[i];
						break;
					}
				}

				if (view)
					appViewService.removeView(view);

			} else {

				fchdis0051.itemcopyorder({nrPedido: copyController.orderId}, copyController.copyParams , function (result) {

					customService.callCustomEvent("itemCopyOrder", {
						controller:copyController,
						result: result
					});
					 copyController.copyItems = result['tt-item-copia'];
				});
			}
		});
	}

	copyItemsController.$inject = ['$modalInstance','copyItems'];
	function copyItemsController ($modalInstance,copyItems) {

		var copyItemsController = this;

		for(var i = 0; i < copyItems.length; i++) {
			copyItems[i].$selected = copyItems[i].selecionado;
		}

		copyItemsController.copyItems = copyItems;

		copyItemsController.confirm = function() {
			for(var i = 0; i < copyItemsController.copyItems.length; i++) {
				copyItemsController.copyItems[i].selecionado = copyItemsController.copyItems[i].$selected;
			}
			$modalInstance.close(copyItemsController.copyItems);
		}

		copyItemsController.close = function() {
			$modalInstance.dismiss('cancel');
		}

	}

	copyParamscontroller.$inject = ['$modalInstance','copyParameters'];
	function copyParamscontroller ($modalInstance,copyParameters) {
		var copyParamscontroller = this;

		copyParamscontroller.copyParameters = copyParameters;

		copyParamscontroller.confirm = function() {
			$modalInstance.close(copyParamscontroller.copyParameters);
		}

		copyParamscontroller.close = function() {
			$modalInstance.dismiss('cancel');
		}

	}

	/* Registro dos controllers */
	index.register.controller('quotation.quotationsCopyParams.Controller', copyParamscontroller);
	index.register.controller('quotation.quotationsCopyItems.Controller', copyItemsController);
	index.register.controller('quotation.quotations.Controller', quotationsCtrl);
	index.register.controller('quotation.quotations.CopyController', copyController);
	index.register.controller('quotation.modalQuotationCopy.Controller', modalQuotationCopyCtrl);
	index.register.controller('quotation.quotations.adv-search.Controller', quotationAdvSearchController);
});
