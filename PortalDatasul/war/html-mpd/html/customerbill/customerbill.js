define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/zoom/repres.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js'], function (index) {

	index.stateProvider

	.state('dts/mpd/customerbill', {
		abstract: true,
		template: '<ui-view/>'
	})
	.state('dts/mpd/customerbill.start', {
	  url:'/dts/mpd/customerbill',
	  controller:'salesorder.customerbill.Controller',
	  controllerAs: 'controller',
	  templateUrl:'/dts/mpd/html/customerbill/customerbill.html'
	});


	customerBillcontroller.$inject = ['$rootScope',
									  'salesorder.customerbill.Factory',
									  'userPreference',
									  'totvs.app-main-view.Service',
									  'portal.generic.Controller',
									  'portal.getUserData.factory',
									  '$filter',
									  '$q',
									  '$modal',
									  'mpd.companyChange.Factory',
									  'mpd.fchdis0035.factory'];

	function customerBillcontroller($rootScope,
									customerbill,
									userPreference,
									appViewService,
									genericController,
									userdata,
									$filter,
									$q,
									$modal,
									companyChange,
									fchdis0035) {

		var controller = this;
		var i18n = $filter('i18n');
		var date = $filter('date');

		genericController.decorate(this, customerbill);

		this.advancedSearch = {model: {}};

		controller.advancedSearch.model.periodoVenc = 0;
		controller.advancedSearch.periodoVencimento = [
				{codPeriodVenc: 0, desPeriodVenc: i18n('l-filter-bill-all')},
				{codPeriodVenc: 1, desPeriodVenc: i18n('l-filter-bill-30-days')},
				{codPeriodVenc: 2, desPeriodVenc: i18n('l-filter-bill-31-to-60')},
				{codPeriodVenc: 3, desPeriodVenc: i18n('l-filter-bill-61-to-90')},
				{codPeriodVenc: 4, desPeriodVenc: i18n('l-filter-bill-91-to-120')},
				{codPeriodVenc: 5, desPeriodVenc: i18n('l-filter-bill-more-than-120')}
			];

		this.loadMore = function() {
			this.findRecords(controller.listResult.length, controller.filterBy);
		};


		this.search = function() {
			this.clearDefaultData(true, this);
			this.addFilters();
			this.loadData();
		}

		this.removeSelectedFilter = function(filter) {

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

		controller.addFilters = function() {

			controller.clearFilter();

			if(controller.advancedSearch.model.dtEmis) {
				controller.addFilter('dtEmis',controller.advancedSearch.model.dtEmis, '', i18n('l-dt-emissao') + ':' + date(controller.advancedSearch.model.dtEmis, 'shortDate'));
			}
			if(controller.advancedSearch.model.dtVenc) {
				controller.addFilter('dtVenc',controller.advancedSearch.model.dtVenc, '',i18n('l-dt-vencimento') + ':' +  date(controller.advancedSearch.model.dtVenc, 'shortDate'));
			}
			if(controller.advancedSearch.model.codEmitenteIni){
				controller.addFilter('codEmitenteIni',controller.advancedSearch.model.codEmitenteIni, '',i18n('l-customer') + ' ' + i18n('l-from') + ':' +  controller.advancedSearch.model.codEmitenteIni);
			}
			if(controller.advancedSearch.model.codEmitenteFim){
				controller.addFilter('codEmitenteFim',controller.advancedSearch.model.codEmitenteFim, '',i18n('l-customer') + ' ' + i18n('l-to') + ':' +  controller.advancedSearch.model.codEmitenteFim);
			}
			if(controller.advancedSearch.model.nomeAbrevIni){
				controller.addFilter('nomeAbrevIni',controller.advancedSearch.model.nomeAbrevIni, '',i18n('l-nome-abrev') + ' ' + i18n('l-from') + ':' +  controller.advancedSearch.model.nomeAbrevIni);
			}
			if(controller.advancedSearch.model.nomeAbrevFim){
				controller.addFilter('nomeAbrevFim',controller.advancedSearch.model.nomeAbrevFim, '',i18n('l-nome-abrev') + ' ' + i18n('l-to') + ':' +  controller.advancedSearch.model.nomeAbrevFim);
			}
			if(controller.advancedSearch.model.periodoVenc){
				controller.addFilter('periodoVenc',controller.advancedSearch.model.periodoVenc, '',i18n('l-due-date-period') + ':' +  controller.advancedSearch.periodoVencimento[controller.advancedSearch.model.periodoVenc].desPeriodVenc);
			}

			if(controller.quickSearchText) {
				controller.addFilter('simpleFilter',controller.quickSearchText, '',i18n('l-code'), controller.quickSearchText);
			}

			if (controller.codeRepresentatives) {
				$rootScope.MPDCustomerBillCustomRepresentative = true;
				controller.addFilter("representatives", controller.codeRepresentatives, '', i18n('l-representantes') + ": " + controller.representativesNames);
			}
		}

		this.loadData = function () {
			this.findRecords(null, controller.filterBy);
		}

		this.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/customerbill/customerbill-adv-search.html',
			  controller: 'salesorder.customerbill.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
				model: function () {
				  return controller.advancedSearch;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.codeRepresentatives = controller.advancedSearch.codeRepresentatives;
				controller.representativesNames = controller.advancedSearch.representativesNames
				controller.addFilters();
				controller.loadData();
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
				if($rootScope.selectedRepresentatives && $rootScope.MPDCustomerBillCustomRepresentative === false){
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
						controller.addFilter("representatives", controller.codeRepresentatives, '', i18n('l-representantes') + ": " + controller.representativesNames);
					}
					// Carrega a tela mesmo que não haja um filter (pode ter sido removido)
					controller.clearDefaultData(true);
					controller.loadData();
				}

		};


		if (appViewService.startView(i18n('l-customer-bills'), 'salesorder.customerbill.Controller', this)) {

			var paramVisibleFieldsTitulosRepres = {cTable: "titulos-repres"};

			fchdis0035.getVisibleFields(paramVisibleFieldsTitulosRepres, function(result) {

				controller.titulosRepresVisibleFields = result;

				// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
				if (companyChange.checkContextData() === false){
					companyChange.getDataCompany(true);
				}

				// busca os dados novamente quando feita a troca de empresa
				$rootScope.$$listeners['mpd.selectCompany.event'] = [];
				$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
					controller.loadData();
				});

				//Faz o filtro pelo cliente selecionado
				if($rootScope.selectedcustomer){
					controller.advancedSearch.model.nomeAbrevIni = $rootScope.selectedcustomer['nome-abrev'];
					controller.advancedSearch.model.nomeAbrevFim = $rootScope.selectedcustomer['nome-abrev'];
					controller.addFilters();
				}

				controller.applyRepresentativeFilter();

				$q.all([userPreference.getPreference('customerBill.dataini'),
						userPreference.getPreference('customerBill.datafim')]).then(function (results) {

						var dtIni = new Date();
						var dtFim = new Date();

						if (results && results[0].prefValue) {
							dtIni = new Date(parseFloat(results[0].prefValue));
						} else {
							dtIni.setMonth(dtIni.getMonth() - 1);
						}

						if (results && results[1].prefValue) {
							dtFim = new Date(parseFloat(results[1].prefValue));
						}

						controller.advancedSearch.model.dtEmis = dtIni.getTime();
						controller.advancedSearch.model.dtVenc = dtFim.getTime();
						controller.addFilters();
						controller.loadData();

				});
			});
		}else {
			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.loadData();
			});

			controller.applyRepresentativeFilter();
		}

		controller.setQuickFilter  = function(key){
			controller.addFilters();
			switch(key) {
				case "ANTECIPADOS":
					controller.addFilter("antecipados", true, "", i18n('l-antecipation') + " " + i18n('l-yes'));
					controller.addFilter("vencidos", false, "", i18n('l-overdue') + " " + i18n('l-no'));
					controller.addFilter("aVencer", false, "", i18n('l-ondue') + " " + i18n('l-no'));
				break;
				case "VENCIDOS":
					controller.addFilter("antecipados", false, "", i18n('l-antecipation') + " " + i18n('l-no'));
					controller.addFilter("vencidos", true, "", i18n('l-overdue') + " " + i18n('l-yes'));
					controller.addFilter("aVencer", false, "", i18n('l-ondue') + " " + i18n('l-no'));
				break;
				case "AVENCER":
					controller.addFilter("antecipados", false, "", i18n('l-antecipation') + " " + i18n('l-no'));
					controller.addFilter("vencidos", false, "", i18n('l-overdue') + " " + i18n('l-no'));
					controller.addFilter("aVencer", true, "", i18n('l-ondue') + " " + i18n('l-yes'));
				break;
			}
			controller.loadData();
		}

	} // function customerBillcontroller(loadedModules)

	index.register.controller('salesorder.customerbill.Controller', customerBillcontroller);

	customerbillAdvSearchController.$inject = ['$modalInstance', 'model'];
	function customerbillAdvSearchController ($modalInstance, model) {

		this.advancedSearch = model;
		var ctrl = this;

		if (this.advancedSearch.listRepres) {
			ctrl.disclaimers = this.advancedSearch.listRepres;
		}

		this.search = function () {
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
			this.advancedSearch.codeRepresentatives = ctrl.codeRepresentatives;
			this.advancedSearch.representativesNames = ctrl.representativesNames;
			this.advancedSearch.listRepres = ctrl.disclaimers;

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
				ctrl.addDisclaimer("repres", representatives['cod-rep'], representatives['cod-rep'] + ' - ' + representatives['nome'] + ' ');
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
	index.register.controller('salesorder.customerbill.adv-search.Controller', customerbillAdvSearchController);


});
