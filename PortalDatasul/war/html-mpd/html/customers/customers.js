define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/zoom/grupo-cli.js',
		'/dts/mpd/js/zoom/repres.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/js/api/fchcrm1003api.js',
		'/dts/crm/html/account/account-services.edit.js'], function (index) {

	index.stateProvider
		.state('dts/mpd/customers', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/customers.start', {
			url: '/dts/mpd/customers',
			controller: 'salesorder.customers.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/customers/customers.html'
		})
		.state('dts/mpd/customers.search', {
			url: '/dts/mpd/customers/:search',
			controller: 'salesorder.customers.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/customers/customers.html'
		});

	customersCtrl.$inject = ['$rootScope',
							 '$state',
							 '$stateParams',
							 'totvs.app-main-view.Service',
							 'salesorder.customer.Factory',
							 'userPreference',
							 'portal.generic.Controller',
							 'customization.generic.Factory',
							 '$modal',
							 'salesorder.model.Factory',
							 '$filter',
							 'portal.getUserData.factory',
							 'mpd.companyChange.Factory',
							 'mpd.fchdis0035.factory',
							 'crm.account.modal.edit',
							 'crm.crm_lead.factory',
							 'TOTVSEvent',
							 '$location',
							 '$http',
							 '$q'];

	function customersCtrl($rootScope,
						   $state,
						   $stateParams,
						   appViewService,
						   customerResource,
						   userPreference,
						   genericController,
						   customService,
						   $modal,
						   modelResource,
						   $filter,
						   userdata,
						   companyChange,
						   fchdis0035,
						   modalAccountEdit,
						   leadFactory,
						   TOTVSEvent,
						   $location,
						   $http,
						   $q) {

		var ctrl = this;

		var i18n = $filter('i18n');

		this.news = [];

		genericController.decorate(this, customerResource);
		this.currentUserRoles  = [];

		this.canAddLead = false;
		this.isCRMActive = false;
		this.listLeads = [];
		this.totalLeadRecords = 0;
		this.maxLead = 10;
		this.newOrderInclusionFlow = false;
		this.logPermiteCotac = false;
                this.showTabLead = false;

		this.pageLead = false;
		this.pageCustomer = true;

		// CONSTANTES
		this.ACTIVECUSTOMERS = 'ACTIVECUSTOMERS';
		this.INACTIVECUSTOMERS = 'INACTIVECUSTOMERS';

		this.advancedSearch = {
			model: {}
		};

		this.setQuickFilter = function (opt) {
			if (opt === this.ACTIVECUSTOMERS) {
				ctrl.clearDefaultData(true);
				this.addFilters();
				ctrl.addFilter("activecustomers", "yes", '', i18n('l-active-customers'));
				this.loadData();
			} else if (opt === this.INACTIVECUSTOMERS) {
				ctrl.clearDefaultData(true);
				this.addFilters();
				ctrl.addFilter("inactivecustomers", "yes", '', i18n('l-inactive-customers'));
				this.loadData();
			}
		}

		this.addFilters = function () {
			ctrl.clearFilter();
			if (ctrl.quickSearchText) {
				ctrl.addFilter("simpleFilter", ctrl.quickSearchText, '', i18n('l-simple-filter') + ": " + ctrl.quickSearchText);
			}
			if (ctrl.advancedSearch.model.codemitente) {
				ctrl.addFilter("cod-emitente", ctrl.advancedSearch.model.codemitente, '', i18n('l-cod-customer') + ": " + ctrl.advancedSearch.model.codemitente);
			}
			if (ctrl.advancedSearch.model.cnpj) {
				ctrl.addFilter("cnpj", ctrl.advancedSearch.model.cnpj, '', i18n('l-cgc-cli') + ": " + ctrl.advancedSearch.model.cnpj);
			}
			if (ctrl.advancedSearch.model.contact) {
				ctrl.addFilter("contact", ctrl.advancedSearch.model.contact, '', i18n('l-contato') + ": " + ctrl.advancedSearch.model.contact);
			}
			if (ctrl.advancedSearch.model.city) {
				ctrl.addFilter("city", ctrl.advancedSearch.model.city, '', i18n('l-cidade') + ": " + ctrl.advancedSearch.model.city);
			}
			if (ctrl.codeCustomerGroups) {
				ctrl.addFilter("customerGroups", ctrl.codeCustomerGroups, '', i18n('l-groups') + ": " + ctrl.titleCustomerGroups);
			}
			if (ctrl.codeRepresentatives) {
				$rootScope.MPDCustomersCustomRepresentative = true;
				ctrl.addFilter("representatives", ctrl.codeRepresentatives, '', i18n('l-representantes') + ": " + ctrl.representativesNames);
			}
		}

		this.removeSelectedFilter = function (filter) {
			ctrl.removeFilter(filter);
			if (filter.property == "simpleFilter") {
				ctrl.quickSearchText = '';
				$state.go('dts/mpd/customers.start', {}, {
					notify: false
				}) // vai para o state da URL de lista sem pesquisa
			}

			if (filter.property == "representatives") {
				ctrl.advancedSearch.listRepres = '';
			}

			delete ctrl.advancedSearch.model[filter.property];
			ctrl.loadData();
		}

		this.search = function () {
			this.clearDefaultData(true, this);
			this.addFilters();
			this.loadData();
		}

		this.getProfileConfig = function(){

			ctrl.isRepresentative = false;
			ctrl.isCustomer = false;

			for (var i = ctrl.currentUserRoles.length - 1; i >= 0; i--) {
				if(ctrl.currentUserRoles[i] == "representative"){
					ctrl.isRepresentative = true;
				}

				if(ctrl.currentUserRoles[i] == "customer"){
					ctrl.isCustomer = true;
				}
			}

			ctrl.customerListProfileConfig = {fields: ctrl.carteiraClienteRepresVisibleFields,
											  isRepresentative: ctrl.isRepresentative,
											  isCustomer: ctrl.isCustomer
											};

		};

		this.validateResultToSelectPage = function (count) {
			if (count !== 2) { return; }

			if (ctrl.pageCustomer === true && ctrl.listResult.length < 1 && ctrl.listLeads.length > 0) {
				ctrl.pageLead = true;
				ctrl.pageCustomer = false;
			} else if (ctrl.pageLead === true && ctrl.listLeads.length < 1 && ctrl.listResult.length > 0) {
				ctrl.pageLead = false;
				ctrl.pageCustomer = true;
			}
		};

		this.loadData = function (loadMore) {
			var i = 0,
				paramVisibleFieldsCarteiraClienteRepres = {cTable: "carteira-cliente-repres"};

			fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){
				ctrl.currentUserRoles = result.out.split(",");

				fchdis0035.getVisibleFields(paramVisibleFieldsCarteiraClienteRepres, function(resultCustomerFields) {
					
					angular.forEach(resultCustomerFields, function(value) {
						if (value.fieldName === "novo-fluxo-inclusao-pedido") {
							ctrl.newOrderInclusionFlow = value.fieldEnabled; 
						} else if (value.fieldName === "log-permite-cotac") {
							ctrl.logPermiteCotac = value.fieldEnabled;
						} else if (value.fieldName === "tab-lead") {
                            ctrl.showTabLead =  value.fieldEnabled;     
                        }
					});

					
					if (ctrl.logPermiteCotac) {	
						// Cotação disponível no portal
						$http({url: '/dts/mpd/html/customers/customers.news-02.json', method: 'GET'}).success(function (json) {
							// Adiciona apenas se não estiver no array de novidades.							
							if (!(ctrl.news.filter(function(e) { e.uniqueId === json.uniqueId}).length > 0)) {
								ctrl.news.push(json);
							};
						});
					} else {
						// Se a função de cotações for desligada do portal, remove a novidade do array.
						ctrl.news = ctrl.news.filter(function(e) { e.uniqueId !== 'learning-portal-customers-new-quotation'});
					}

					ctrl.startNews();

					ctrl.carteiraClienteRepresVisibleFields = resultCustomerFields;
					ctrl.getProfileConfig();

					ctrl.findRecords(null, ctrl.filterBy).then( function(customers) {
						i++;
						ctrl.validateResultToSelectPage(i);
					});

					if (loadMore!== true && ctrl.isCRMActive === true && ctrl.showTabLead  === true) {

						ctrl.searchLeads(false, function (leads) {
							i++;
							ctrl.validateResultToSelectPage(i);
						});
					}

				});
			});
		};

		this.searchLeads = function (loadMore, callback) {

			if (loadMore !== true) {
				ctrl.listLeads = [];
			}

			var parameters = {
					properties: ["custom.mpdAcessRule"],
					values: [true]
				},
				options = {
					start: loadMore === true ? ctrl.listLeads.length : 0,
					end: ctrl.maxLead,
					entity: 4 // somente leads
				},
				filters = [],
				value,
				property;

			if (filters instanceof Array) {
				filters = angular.copy(ctrl.filterBy);
			} else {
				filters.push({
					property: ctrl.filterBy.property,
					value: ctrl.filterBy.value
				});
			}

			angular.forEach(filters, function (param) {

				if (param.property && param.property !== "activecustomers") {

					value = param.value;

					switch(param.property) {
					  /* desconsiderado, lead n tem status ativo ou inativo e sim nao integrado
					  case "activecustomers":
						property = 'log_livre_1';
						break;
					  */
					  case "representatives":
						property = 'custom.cod_repres_erp';
						value = value.slice(0, -1);
						break;
					  case "cod-emitente": //Lead nao integra com ERP, tem q pesquisar pelo id no crm
						property = 'num_id';
						break;
					  case "contact":
						property = 'custom.nom_contato';
						break;
					  case "cnpj":
						property = 'custom.nom_cnpj_cpf';
						break;
					  case "city":
						property = 'custom.nom_cidad';
						break;
					  case "customerGroups":
						property = 'custom.cod_grp_clien_erp';
						value = value.slice(0, -1);
						break;
					  case "simpleFilter":
						property = 'custom.quick_search_mpd';
						break;
					  default:
						property = param.property;
					}

					parameters.properties.push(property);
					parameters.values.push(value);
				}

			});


			leadFactory.findLeads(parameters, options, function (leads) {
				ctrl.listLeads = ctrl.listLeads.concat(leads);
				ctrl.totalLeadRecords = (leads.length > 0 && leads[0].$length) ? leads[0].$length : leads.length;
				if (callback) { callback(ctrl.listLeads); }
			});

		};


		this.loadMore = function () {
			this.findRecords(ctrl.listResult.length, ctrl.filterBy);
		};

		this.openAdvancedSearch = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/customers/customers-adv-search.html',
				controller: 'salesorder.customers.adv-search.Controller as controller',
				size: 'lg',
				resolve: {
					model: function () {
						return ctrl.advancedSearch;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				ctrl.codeCustomerGroups = ctrl.advancedSearch.codeCustomerGroups;
				ctrl.titleCustomerGroups = ctrl.advancedSearch.titleCustomerGroups;
				ctrl.codeRepresentatives = ctrl.advancedSearch.codeRepresentatives;
				ctrl.representativesNames = ctrl.advancedSearch.representativesNames
				ctrl.addFilters();
				ctrl.loadData();
			});
		};

		this.addLeadInList = function (accountId) {

			var parameters = {
					properties: ['num_id'],
					values: [accountId]
				},
				options = {
					start: 0,
					end: 1,
					entity: 4 // somente leads
				};

			leadFactory.findLeads(parameters, options, function (lead) {
				if (lead && lead.length === 1) {
					ctrl.totalLeadRecords++;
					ctrl.listLeads.unshift(lead[0]);
				}
			});
		};

		this.addLead = function () {

			modalAccountEdit.open({
				account		: undefined,
				isAccount	: false,
				isConvert	: false,
				isToLoad	: false,
				isSourceMpd : true
			}).then(function (result) {

				if (result && result.num_id) {

					ctrl.pageLead = true;
					ctrl.pageCustomer = false;

					ctrl.addLeadInList(result.num_id);

					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: 'l-customer-portfolio',
						cancelLabel: 'l-cancel',
						confirmLabel: 'l-confirmar',
						text: $rootScope.i18n('msg-question-open-new-order', [result.nom_razao_social], 'dts/mpd'),
						callback: function (isPositiveResult) {
							if (!isPositiveResult) { return; }

							ctrl.openSalesOrder(ctrl.listLeads[0]);
						}
					});

				}

			});

		};

		this.openSalesOrder = function (lead) {
			leadFactory.canOpenSalesOrder(lead['cod-emitente'], function (result) {
				if (result === undefined || result === false){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-customer-portfolio', [], 'dts/mpd'),
						detail: $rootScope.i18n('msg-form-validate-open-sales-order-to-lead', [lead['nome-emit']], 'dts/mpd')
					});
				} else {
					$location.url("/dts/mpd/model/" + lead['cod-emitente'].toString() + "?isLead=true");
				}
			});
		};


		this.openSalesOrder2 = function (isLead , customer ,lead) {
			
			if(isLead){
				leadFactory.canOpenSalesOrder(lead['cod-emitente'], function (result) {
					if (result === undefined || result === false){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-customer-portfolio', [], 'dts/mpd'),
							detail: $rootScope.i18n('msg-form-validate-open-sales-order-to-lead', [lead['nome-emit']], 'dts/mpd')
						});
					} else {
						$location.url("/dts/mpd/order2/new/" + lead['cod-emitente'] + "?isLead=true");
					}
				});

			} else {
				$location.url("/dts/mpd/order2/new/" + customer['cod-emitente']);
			}
		};


		this.getCRMIsActive = function () {
			fchdis0035.isCRMActive(function(result) {
				ctrl.isCRMActive =  (result && result.isActive) ? result.isActive : false;
				ctrl.canAddLead = ctrl.isCRMActive;
			});
		};

		this.applyRepresentativeFilter = function () {

			// Faz o filtro pelos representantes selecionados
			if($rootScope.selectedRepresentatives && $rootScope.MPDCustomersCustomRepresentative === false){
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

				ctrl.codeRepresentatives = codRepList;
				ctrl.representativesNames = nomeAbrevList;
				ctrl.advancedSearch.listRepres = disclaimers;

				ctrl.removeFilterByProperty("representatives");
				// somente re-adiciona o filter caso este foi definido
				if (ctrl.codeRepresentatives) {
					ctrl.addFilter("representatives", ctrl.codeRepresentatives, '', i18n('l-representantes') + ": " + ctrl.representativesNames);
				}
				// Carrega a tela mesmo que não haja um filter (pode ter sido removido)
				this.clearDefaultData(true);
				this.loadData();
			}

		};

		this.removeFilterByProperty =  function (property) {
			angular.forEach(ctrl.filterBy, function(value) {
				if (value.property === property) {
					var index = ctrl.filterBy.indexOf(value);
					if (index != -1) {
						ctrl.filterBy.splice(index, 1);
					}
				}
			});
		};

		this.startNews = function () {
			// Array de scripts no formato json (https://github.com/xbsoftware/enjoyhint)
			$rootScope.$emit("totvs.portal.startNews", ctrl.news);
		}

		this.init = function() {
			
			if (appViewService.startView(i18n('l-customer-portfolio'), "salesorder.customers.Controller", this)) {

				// Novidades 
				ctrl.news = [];

				// Conhecendo a interface
				$http({url: '/dts/mpd/html/customers/customers.news-01.json', method: 'GET'}).success(function (json) {
					ctrl.news.push(json);
				});

				ctrl.clearFilter();

				ctrl.getCRMIsActive();

				// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
				if (companyChange.checkContextData() === false) {
					companyChange.getDataCompany(true);
				}

				// busca os dados novamente quando feita a troca de empresa
				$rootScope.$$listeners['mpd.selectCompany.event'] = [];
				$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
					ctrl.search();
					ctrl.getCRMIsActive();
				});

				// Faz o filtro pelos representantes selecionados
				ctrl.applyRepresentativeFilter();

				userPreference.getPreference('custSummaryRepGroups').then(function (data) {
					//ctrl.clearFilter();
					ctrl.addFilter("activecustomers", "yes", '', i18n('l-active-customers'));
					if (data.prefValue) {
						ctrl.jsonCustomerGroups = angular.fromJson(data.prefValue);
						ctrl.titleCustomerGroups = "";
						ctrl.codeCustomerGroups = "";
						ctrl.icountGroups = 0;
						angular.forEach(ctrl.jsonCustomerGroups, function (value, key) {
							ctrl.icountGroups = ctrl.icountGroups + 1;
							if (ctrl.icountGroups < 4) {
								var arrayGroup = value.title.split(' - ');
								ctrl.codeCustomerGroups = ctrl.codeCustomerGroups + arrayGroup[0] + '|';

								if (ctrl.titleCustomerGroups == "") ctrl.titleCustomerGroups = value.title;
								else ctrl.titleCustomerGroups = ctrl.titleCustomerGroups + ', ' + value.title;
							}
						});

						if (ctrl.icountGroups > 3) {
							ctrl.titleCustomerGroups = ctrl.titleCustomerGroups + '...';
						}
						if ($stateParams.search) {
							ctrl.quickSearchText = $stateParams.search;
							ctrl.search();
						} else {
							if (ctrl.codeCustomerGroups) {
								ctrl.addFilter("customerGroups", ctrl.codeCustomerGroups, '', "Grupos: " + ctrl.titleCustomerGroups);
							}
							ctrl.loadData();
						}
					} else {
						ctrl.loadData();
					}
				});

			} else {
				userPreference.getPreference('custSummaryRepGroups').then(function (data) {
					// busca os dados novamente quando feita a troca de empresa
					$rootScope.$$listeners['mpd.selectCompany.event'] = [];
					$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
						ctrl.search();
					});

					if ($stateParams.search && ctrl.quickSearchText != $stateParams.search) {
						ctrl.quickSearchText = $stateParams.search;
						ctrl.search();
					}

					ctrl.applyRepresentativeFilter();

				});

			}

		};

		this.init();

	} // function customersCtrl(loadedModules)

	index.register.controller('salesorder.customers.Controller', customersCtrl);


	customersAdvSearchController.$inject = ['$modalInstance', 'model'];

	function customersAdvSearchController($modalInstance, model) {

		this.advancedSearch = model;
		var ctrl = this;

		if (this.advancedSearch.listRepres) {
			ctrl.disclaimers = this.advancedSearch.listRepres;
		}

		this.search = function () {
			this.codeCustomerGroups = "";
			this.titleCustomerGroups = "";
			this.codeRepresentatives = "";
			this.representativesNames = "";

			ctrl.icountGroups = 0;
			ctrl.icountRepres = 0;
			angular.forEach(ctrl.disclaimers, function (value, key) {
				if (value.property === "grp-cli") {
					ctrl.icountGroups = ctrl.icountGroups + 1;
					if (ctrl.icountGroups < 4) {
						ctrl.codeCustomerGroups = ctrl.codeCustomerGroups + value.value + '|';
						if (ctrl.titleCustomerGroups == "") ctrl.titleCustomerGroups = value.title;
						else ctrl.titleCustomerGroups = ctrl.titleCustomerGroups + ', ' + value.title;
					}
				} else {
					ctrl.icountRepres = ctrl.icountRepres + 1;
					ctrl.codeRepresentatives = ctrl.codeRepresentatives + value.value + '|';
					if (ctrl.icountRepres < 4) {
						if (ctrl.representativesNames == "") ctrl.representativesNames = value.title;
						else ctrl.representativesNames = ctrl.representativesNames + ', ' + value.title;
					}
				}
			});

			if (ctrl.icountGroups > 3) {
				ctrl.titleCustomerGroups = ctrl.titleCustomerGroups + '...';
			}
			if (ctrl.icountRepres > 3) {
				ctrl.representativesNames = ctrl.representativesNames + '...';
			}
			this.advancedSearch.codeCustomerGroups = ctrl.codeCustomerGroups;
			this.advancedSearch.titleCustomerGroups = ctrl.titleCustomerGroups;
			this.advancedSearch.codeRepresentatives = ctrl.codeRepresentatives;
			this.advancedSearch.representativesNames = ctrl.representativesNames;
			this.advancedSearch.listRepres = ctrl.disclaimers;

			$modalInstance.close();
		}

		this.close = function () {
			$modalInstance.dismiss();
		}

		this.onZoomSelectUsersOrGroups = function () {

			if (!this.selectedUsersOrGroups) return;

			if (this.selectedUsersOrGroups.objSelected && this.selectedUsersOrGroups.size >= 0) {
				this.selectedUsersOrGroups = this.selectedUsersOrGroups.objSelected;
			}

			if (!angular.isArray(this.selectedUsersOrGroups)) {
				this.selectedUsersOrGroups = [this.selectedUsersOrGroups];
			}

			var userGroups = [];
			this.disclaimers = [];
			for (var i = 0; i < this.selectedUsersOrGroups.length; i++) {
				var userGroup = this.selectedUsersOrGroups[i];
				ctrl.addDisclaimer("grp-cli", userGroup['cod-gr-cli'], userGroup['cod-gr-cli'] + ' - ' + userGroup['descricao'] + ' ');
			}

			this.allUserGroups = userGroups;
			delete this.selectedUsersOrGroups;
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
	index.register.controller('salesorder.customers.adv-search.Controller', customersAdvSearchController);


});
