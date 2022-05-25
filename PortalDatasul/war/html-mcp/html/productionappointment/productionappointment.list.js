define(['index'], function (index) {

	/**
	 * Controller List
	 */
	productionappointmentListCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$modal',
		'$filter',
		'$location',
		'totvs.app-main-view.Service',
		'fchman.fchmanproductionappointment.Factory',
		'TOTVSEvent',
		'totvs.app-notification.Service'
	];

	function productionappointmentListCtrl(
		$rootScope,
		$scope,
		$modal,
		$filter,
		$location,
		appViewService,
		fchmanproductionappointmentFactory,
		TOTVSEvent,
		appNotificationService) {

		/**
		 * Variável Controller
		 */
		var controller = this;

		/**
		 * Variáveis
		 */
		controller.listResult = [];
		this.listResult = [];       // array que mantem a lista de registros
		this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
		this.disclaimers = [];      // array que mantem a lista de filtros aplicados
		this.logHasMore = "";
		this.alert = {};
		var quickSearchText = "";   // atributo que contem o valor da pesquisa rápida
		var createTab;
		var previousView;
		var today = new Date();
		var lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		var nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
		var isDetailed = false;
		
		this.advancedSearch = {
			prodOrderCodeIni: 0,
			prodOrderCodeFin: 999999999,
			siteCode: "",
			itemCodeIni: "",
			itemCodeFin: "ZZZZZZZZZZZZZZZZ",
			statusNotStart: true,
			statusReleased: true,
			statusReserved: true,
			statusKitted: true,
			statusIssued: true,
			statusStarted: true,
			plannerUserIni: "",
			plannerUserFin: "ZZZZZZZZZZZZ",
			nrProdLineIni: 0,
			nrProdLineFin: 99999,
			iniDate: lastWeek,
			endDate: nextWeek,
			emissionDateIni: lastWeek,
			emissionDateFin: nextWeek,
			customerCodeIni: "",
			customerCodeFin: "ZZZZZZZZZZZZ",
			customerGroupIni: 0,
			customerGroupFin: 99,
			customerOrderIni: "",
			customerOrderFin: "ZZZZZZZZZZZZ",
			customerSequenceIni: 0,
			customerSequenceFin: 99999,
			customerDeliveryIni: 0,
			customerDeliveryFin: 99999,
			machineCodeIni: "",
			machineCodeFin: "ZZZZZZZZZZZZZZZZ", 
			ordenation: "1",
			iListType: "1"
		}    // objeto para manter as informações do filtro avançado

		var filter = "";

		this.ttAppointmentParam = {
			prodOrderCodeIni: 0,
			prodOrderCodeFin: 999999999,
			siteCode: "",
			itemCodeIni: "",
			itemCodeFin: "ZZZZZZZZZZZZZZZZ",
			statusNotStart: true,
			statusReleased: true,
			statusReserved: true,
			statusKitted: true,
			statusIssued: true,
			statusStarted: true,
			plannerUserIni: "",
			plannerUserFin: "ZZZZZZZZZZZZ",
			nrProdLineIni: 0,
			nrProdLineFin: 99999,
			iniDate: lastWeek,
			endDate: nextWeek,
			emissionDateIni: lastWeek,
			emissionDateFin: nextWeek,
			customerCodeIni: "",
			customerCodeFin: "ZZZZZZZZZZZZ",
			customerGroupIni: 0,
			customerGroupFin: 99,
			customerOrderIni: "",
			customerOrderFin: "ZZZZZZZZZZZZ",
			customerSequenceIni: 0,
			customerSequenceFin: 99999,
			customerDeliveryIni: 0,
			customerDeliveryFin: 99999,
			machineCodeIni: "",
			machineCodeFin: "ZZZZZZZZZZZZZZZZ", 
			ordenation: "1",
			iListType: "1"
		};

		// *************************************************************************************
		// *** Functions
		// *************************************************************************************

		/**
		 * Abertura da tela de pesquisa avançada
		 */
		this.openAdvancedSearch = function () {
			controller.quickSearchText = "";

			angular.copy(controller.ttAppointmentParam, controller.advancedSearch);

			var modalInstance = $modal.open({
				templateUrl: '/dts/mcp/html/productionappointment/productionappointment.advanced.search.html',
				controller: 'mcp.productionappointment.SearchCtrl as controller',
				size: 'lg',
				resolve: {
					model: function () {
						//passa o objeto com os dados da pesquisa avançada para o modal
						return controller.advancedSearch;
					}
				}
			});

			// quando o usuario clicar em pesquisar:
			modalInstance.result.then(function () {
				// copia seleção dos filtros
				angular.copy(controller.advancedSearch, controller.ttAppointmentParam);

				// e chama o busca dos dados
				controller.loadData();
			});
		}

		this.openDetail = function(ordem,opSfc,splitCode,machineCode,machineGroup) {
			
			var path = "/dts/mcp/productionappointmentadd/" + ordem;

			if(opSfc != 0 && splitCode != 0){
				path += "/" + opSfc + "/" + splitCode;
				if(machineCode != ""){
					path += "/" + machineCode;
				}else{
					fchmanproductionappointmentFactory.buscaCtrab(machineGroup, function (result) {
						if(result){
							if(result.length > 1){
								var modalInstance = $modal.open({
									templateUrl: '/dts/mcp/html/productionappointment/productionappointment.ctrabList.html',
									controller: 'mcp.productionappointment.CtrabListCtrl as controller',
									size: 'lg',
									resolve: {
										model: function () {
											var modelControllers = [result,path];
											//passa o objeto com os dados da pesquisa avançada para o modal
											return modelControllers;
										}
									}
								});
							}else{
								path += "/" + result[0].codCtrab;
							}
						}
					});
				}
			}
			
			this.isDetailed = true;
			$location.path(path);
		}


		/**
	     * Método para adicionar os disclaimers relativos a tela de pesquisa avançada
	     */
		this.addDisclaimers = function () {
			// reinicia os disclaimers
			controller.disclaimers = [];

			// Ordem de Produção
			if (controller.advancedSearch.prodOrderCodeIni != 0 
				|| controller.advancedSearch.prodOrderCodeFin != 999999999) {

				var deate = controller.advancedSearch.prodOrderCodeIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.prodOrderCodeFin;
				
				controller.addDisclaimer('ordem', deate, $rootScope.i18n('l-production-order') + ": " + deate);
			}

			// Estabelecimento
			if (controller.advancedSearch.siteCode != ""
				&& controller.advancedSearch.siteCode != undefined) {

				controller.addDisclaimer('cod-estabel', controller.advancedSearch.siteCode, $rootScope.i18n('l-site') + ": " + controller.advancedSearch.siteCode);
			} else {
				controller.addDisclaimer('cod-estabel', controller.advancedSearch.siteCode, $rootScope.i18n('l-site') + ": "+ $rootScope.i18n('l-all-gen'));
			}

			// Item
			if (controller.advancedSearch.itemCodeIni != ""
				|| controller.advancedSearch.itemCodeFin != "ZZZZZZZZZZZZZZZZ") {

				var deate = controller.advancedSearch.itemCodeIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.itemCodeFin;
				
				controller.addDisclaimer('item', deate, $rootScope.i18n('l-item') + ": " + deate);
			}

	        // Data de produção
	        if (controller.advancedSearch.iniDate && controller.advancedSearch.endDate) {  
				var deateOrdem = this.formatDate(controller.advancedSearch.iniDate);
				deateOrdem = deateOrdem + " " + $rootScope.i18n('l-to') + " ";
				deateOrdem = deateOrdem + this.formatDate(controller.advancedSearch.endDate);
	            
	            controller.addDisclaimer('data-inicio', deateOrdem, $rootScope.i18n('l-production-date') + ": " + deateOrdem);
			}
			
	        // Data de emissão
	        if (controller.advancedSearch.emissionDateIni && controller.advancedSearch.emissionDateFin) {  
				var deateEmissao = this.formatDate(controller.advancedSearch.emissionDateIni);
				deateEmissao = deateEmissao + " " + $rootScope.i18n('l-to') + " ";
				deateEmissao = deateEmissao + this.formatDate(controller.advancedSearch.emissionDateFin);
	            
	            controller.addDisclaimer('data-emissao', deateEmissao, $rootScope.i18n('l-emission-date') + ": " + deateEmissao);
			}

			// Planejador
			if (controller.advancedSearch.plannerUserIni != ""
				|| controller.advancedSearch.plannerUserFin != "ZZZZZZZZZZZZ") {

				var deate = controller.advancedSearch.plannerUserIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.plannerUserFin;
				
				controller.addDisclaimer('planejador', deate, $rootScope.i18n('l-planner') + ": " + deate);
			}

			// Planejador
			if (controller.advancedSearch.nrProdLineIni != 0
				|| controller.advancedSearch.nrProdLineFin != 99999) {

				var deate = controller.advancedSearch.nrProdLineIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.nrProdLineFin;
				
				controller.addDisclaimer('linha', deate, $rootScope.i18n('l-production-line') + ": " + deate);
			}

			// Centro de Trabalho
			if (controller.advancedSearch.machineCodeIni != ""
				|| controller.advancedSearch.machineCodeFin != "ZZZZZZZZZZZZZZZZ") {

				var deate = controller.advancedSearch.machineCodeIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.machineCodeFin;
				
				controller.addDisclaimer('maquina', deate, $rootScope.i18n('l-workcenter') + ": " + deate);
			}

			// Cliente
			if (controller.advancedSearch.customerCodeIni != ""
				|| controller.advancedSearch.customerCodeFin != "ZZZZZZZZZZZZ") {

				var deate = controller.advancedSearch.customerCodeIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.customerCodeFin;
				
				controller.addDisclaimer('cliente', deate, $rootScope.i18n('l-customer') + ": " + deate);
			}

			// Grupo Cliente
			if (controller.advancedSearch.customerGroupIni != 0
				|| controller.advancedSearch.customerGroupFin != 99) {

				var deate = controller.advancedSearch.customerGroupIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.customerGroupFin;
				
				controller.addDisclaimer('grupo-cliente', deate, $rootScope.i18n('l-customer-group') + ": " + deate);
			}

			// Pedido
			if (controller.advancedSearch.customerOrderIni != ""
				|| controller.advancedSearch.customerOrderFin != "ZZZZZZZZZZZZ") {

				var deate = controller.advancedSearch.customerOrderIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.customerOrderFin;
				
				controller.addDisclaimer('pedido', deate, $rootScope.i18n('l-order') + ": " + deate);
			}

			// Sequencia
			if (controller.advancedSearch.customerSequenceIni != 0
				|| controller.advancedSearch.customerSequenceFin != 99999) {

				var deate = controller.advancedSearch.customerSequenceIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.customerSequenceFin;
				
				controller.addDisclaimer('sequencia', deate, $rootScope.i18n('l-seq') + ": " + deate);
			}

			// Entrega
			if (controller.advancedSearch.customerDeliveryIni != 0
				|| controller.advancedSearch.customerDeliveryFin != 99999) {

				var deate = controller.advancedSearch.customerDeliveryIni;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.customerDeliveryFin;
				
				controller.addDisclaimer('entrega', deate, $rootScope.i18n('l-delivery') + ": " + deate);
			}

		}

	    /**
	     * Adiciona um objeto na lista de disclaimers
	     */
		this.addDisclaimer = function (property, value, label) {
			controller.disclaimers.push({
				property: property,
				value: value,
				title: label
			});
		}

		/**
	     * Remove um disclaimer
	     */
	    this.removeDisclaimer = function(disclaimer) {
	        // pesquisa e remove o disclaimer do array
	        var index = controller.disclaimers.indexOf(disclaimer);
	        if (index != -1) {
	            controller.disclaimers.splice(index, 1);
	        }
	        
	        // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
	        if (disclaimer.property == null)
	            controller.quickSearchText = '';
	        if (disclaimer.property == 'cod-estabel') {
				controller.advancedSearch.siteCode = '';
				controller.ttAppointmentParam.siteCode = '';
			}
			
			if (disclaimer.property == 'data-inicio') {
				controller.advancedSearch.iniDate = lastWeek;
				controller.advancedSearch.endDate = nextWeek;
				controller.ttAppointmentParam.iniDate = lastWeek;
				controller.ttAppointmentParam.endDate = nextWeek;
			}
			
			if (disclaimer.property == 'data-emissao') {
				controller.advancedSearch.emissionDateIni = lastWeek;
				controller.advancedSearch.emissionDateFin = nextWeek;
				controller.ttAppointmentParam.emissionDateIni = lastWeek;
				controller.ttAppointmentParam.emissionDateFin = nextWeek;
			}
			
			if (disclaimer.property == 'ordem') {
				controller.advancedSearch.prodOrderCodeIni = 0;
				controller.advancedSearch.prodOrderCodeFin = 999999999;
				controller.ttAppointmentParam.prodOrderCodeIni = 0;
				controller.ttAppointmentParam.prodOrderCodeFin = 999999999;
			}
			
			if (disclaimer.property == 'item') {
				controller.advancedSearch.itemCodeIni = "";
				controller.advancedSearch.itemCodeFin = "ZZZZZZZZZZZZZZZZ";
				controller.ttAppointmentParam.itemCodeIni = "";
				controller.ttAppointmentParam.itemCodeFin = "ZZZZZZZZZZZZZZZZ";
			}
			
			if (disclaimer.property == 'planejador') {
				controller.advancedSearch.plannerUserIni = "";
				controller.advancedSearch.plannerUserFin = "ZZZZZZZZZZZZ";
				controller.ttAppointmentParam.plannerUserIni = "";
				controller.ttAppointmentParam.plannerUserFin = "ZZZZZZZZZZZZ";
			}
			
			if (disclaimer.property == 'linha') {
				controller.advancedSearch.nrProdLineIni = 0;
				controller.advancedSearch.nrProdLineFin = 99999;
				controller.ttAppointmentParam.nrProdLineIni = 0;
				controller.ttAppointmentParam.nrProdLineFin = 99999;
	        }
			
			if (disclaimer.property == 'maquina') {
				controller.advancedSearch.machineCodeIni = "";
				controller.advancedSearch.machineCodeFin = "ZZZZZZZZZZZZZZZZ";
				controller.ttAppointmentParam.machineCodeIni = "";
				controller.ttAppointmentParam.machineCodeFin = "ZZZZZZZZZZZZZZZZ";
			}
			
			if (disclaimer.property == 'cliente') {
				controller.advancedSearch.customerCodeIni = "";
				controller.advancedSearch.customerCodeFin = "ZZZZZZZZZZZZ";
				controller.ttAppointmentParam.customerCodeIni = "";
				controller.ttAppointmentParam.customerCodeFin = "ZZZZZZZZZZZZ";
			}
			
			if (disclaimer.property == 'grupo-cliente') {
				controller.advancedSearch.customerGroupIni = 0;
				controller.advancedSearch.customerGroupFin = 99;
				controller.ttAppointmentParam.customerGroupIni = 0;
				controller.ttAppointmentParam.customerGroupFin = 99;
			}
			
			if (disclaimer.property == 'pedido') {
				controller.advancedSearch.customerOrderIni = "";
				controller.advancedSearch.customerOrderFin = "ZZZZZZZZZZZZ";
				controller.ttAppointmentParam.customerOrderIni = "";
				controller.ttAppointmentParam.customerOrderFin = "ZZZZZZZZZZZZ";
			}
			
			if (disclaimer.property == 'sequencia') {
				controller.advancedSearch.customerSequenceIni = 0;
				controller.advancedSearch.customerSequenceFin = 99999;
				controller.ttAppointmentParam.customerSequenceIni = 0;
				controller.ttAppointmentParam.customerSequenceFin = 99999;
			}
			
			if (disclaimer.property == 'entrega') {
				controller.advancedSearch.customerDeliveryIni = 0;
				controller.advancedSearch.customerDeliveryFin = 99999;
				controller.ttAppointmentParam.customerDeliveryIni = 0;
				controller.ttAppointmentParam.customerDeliveryFin = 99999;
			}
			

	        // limpa texto da pesquisa rápida
	        if (controller.quickSearchText) {
	        	controller.quickSearchText = "";
	        }
	        // recarrega os dados quando remove um disclaimer
	        controller.loadData();
	    }

		/** 
		 * formatação de data 
		 * */
		this.formatDate = function (data) {
			myDate = new Date(data);
			dia = myDate.getDate();
			mes = myDate.getMonth() + 1;
			ano = myDate.getFullYear();

			var myNumber = 7;
			var formattedDia = ("0" + dia).slice(-2);
			var formattedMes = ("0" + mes).slice(-2);
			

			return formattedDia + '/' + formattedMes + '/' + ano;
		}

		this.formatDateChar = function (data) {
			dia = data.slice(0,2);
			mes = data.slice(2,4);
			ano = data.slice(4,8);
			return dia + '/' + mes + '/' + ano;
		}

		/** 
		 * pesquisa rápida 
		 * */
		this.search = function () {
			this.loadData();
		}
		/**
		 * 
		 */
		this.formatItemCode = function (item, referencia) {
			if (referencia != "") {
				return item + " / " + referencia;
			} {
				return item;
			}
		}

		/**
		 * 
		 */
		this.formatItemLabel = function (referencia) {
			if (referencia != "") {
				return $rootScope.i18n('l-item-refer');
			} {
				return $rootScope.i18n('l-item');
			}
		}

		/**
		 * 
		 */
		this.formatOrdemLabel = function (logSFC) {
			if (logSFC == true) {
				return $rootScope.i18n('l-productionorder-oper-split');
			} {
				return $rootScope.i18n('l-requisition');
			}
		}

		/**
		 * 
		 */
		this.formatCT = function (ct) {
			if (ct == "") {
				return "-";
			} {
				return ct;
			}
		}

		/**
		 * formartNumber
		 */
		this.formartNumber = function (num, decimals) {
			return num.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits:decimals});
		}
		/**
		 * Método de leitura dos dados
		 */
		controller.loadData = function () {

			if (controller.quickSearchText == undefined) {
				controller.quickSearchText = "";
			}


			// valores default para o inicio e pesquisa
			var startAt = 0;
			var where = '';

			// se não é busca de mais dados, inicializa o array de resultado
			
			controller.listResult = [];
			controller.totalRecords = 0;

			parameters = {
				"quickSearchText": controller.quickSearchText,
				"ttAppointmentParam": controller.ttAppointmentParam
			}

			fchmanproductionappointmentFactory.getListOrdProd(parameters, function (result) {
				if (result) {
					// para cada item do result
					angular.forEach(result.ttOrdProdVO, function (value) {
						// se tiver o atributo $length e popula o totalRecords
						if (value && value.$length) {
							controller.totalRecords = value.$length;
						} else {
							controller.totalRecords++;
						}
						// adicionar o item na lista de resultado
						controller.listResult.push(value);
					});
					controller.logHasMore = result.logHasMore;
					if(controller.logHasMore){
						controller.totalRecords += "+";
						
						appNotificationService.notify({
							type: 'info',
							title: ""+ $rootScope.i18n('l-attention') +"",
							size: 'md',  //opicional
							detail: "" + $rootScope.i18n('l-alert50plus') +""
						});
					}
				}
			});
			controller.addDisclaimers();
		}

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			createTab = appViewService.startView($rootScope.i18n('l-production-appointment'), 'mcp.productionappointment.ListCtrl', controller);
			previousView = appViewService.previousView;

			if (previousView.controller) {
				// Validação para não recarregar os dados ao trocar de aba
				if (this.isDetailed === false && createTab === false && previousView.controller !== "mcp.productionappointment.DetailCtrl" && previousView.controller !== "mcp.productionappointment.EditCtrl") {
					return;
				}
			}
			
		    if (this.isDetailed) {
				this.isDetailed = false;
			}
			controller.loadData();
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			controller = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

	}

	// *********************************************************************************
	// *** Controller Pesquisa Avançada
	// *********************************************************************************

	productionappointmentSearchCtrl.$inject = [
		'$modalInstance',
		'$rootScope',
		'$scope',
		'model',
		'$filter',
		'fchman.fchmanproductionappointment.Factory'];


	function productionappointmentSearchCtrl($modalInstance,$rootScope, $scope, model, $filter, fchmanproductionappointmentFactory) {

		var today = new Date();
		var lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
		var nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
		
		this.ttAppointmentParamDefaults = {
			prodOrderCodeIni: 0,
			prodOrderCodeFin: 999999999,
			siteCode: "",
			itemCodeIni: "",
			itemCodeFin: "ZZZZZZZZZZZZZZZZ",
			statusNotStart: true,
			statusReleased: true,
			statusReserved: true,
			statusKitted: true,
			statusIssued: true,
			statusStarted: true,
			plannerUserIni: "",
			plannerUserFin: "ZZZZZZZZZZZZ",
			nrProdLineIni: 0,
			nrProdLineFin: 99999,
			iniDate: lastWeek,
			endDate: nextWeek,
			emissionDateIni: lastWeek,
			emissionDateFin: nextWeek,
			customerCodeIni: "",
			customerCodeFin: "ZZZZZZZZZZZZ",
			customerGroupIni: 0,
			customerGroupFin: 99,
			customerOrderIni: "",
			customerOrderFin: "ZZZZZZZZZZZZ",
			customerSequenceIni: 0,
			customerSequenceFin: 99999,
			customerDeliveryIni: 0,
			customerDeliveryFin: 99999,
			machineCodeIni: "",
			machineCodeFin: "ZZZZZZZZZZZZZZZZ",
			ordenation: "1",
			iListType: "1"
		};

		// recebe os dados de pesquisa atuais e coloca no controller
		this.advancedSearch = model;

		this.closeOther = false;
		$scope.oneAtATime = true;

		$scope.status = {
			isFirstOpen: true,
			isFirstDisabled: false
		};

		// ação de pesquisar
		this.search = function () {
			// close é o fechamento positivo
			$modalInstance.close();
		}

		this.restoreDefaults = function () {
			// restaura valores padroes do filtro avancado
			angular.copy(this.ttAppointmentParamDefaults, this.advancedSearch);
		}
		

		// ação de fechar
		this.close = function () {
			// dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
			$modalInstance.dismiss();
		}

	}

	
	productionappointmentCtrabListCtrl.$inject = [
		'$modalInstance',
		'$rootScope',
		'$scope',
		'model',
		'$filter',
		'fchman.fchmanproductionappointment.Factory',
		'$location'];


	function productionappointmentCtrabListCtrl(
		$modalInstance,
		$rootScope, 
		$scope, 
		model, 
		$filter, 
		fchmanproductionappointmentFactory,
		$location) {

		var controller = this;

		controller.products = model[0];
		controller.path = model[1];

		controller.selectedCtrab;



		this.confirm = function () {
			if(controller.selectedCtrab != "" || controller.selectedCtrab != undefined){
				controller.ctrab = controller.selectedCtrab.codCtrab;
				controller.path += "/" + controller.selectedCtrab.codCtrab;
				

 	        	// close é o fechamento positivo
				$modalInstance.close();
				
				$location.path(controller.path);
			}
		}
		
		// ação de fechar
		this.close = function () {
			// dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
			$modalInstance.dismiss();
		}

	}

	index.register.controller('mcp.productionappointment.CtrabListCtrl', productionappointmentCtrabListCtrl);
	index.register.controller('mcp.productionappointment.ListCtrl', productionappointmentListCtrl);
	index.register.controller('mcp.productionappointment.SearchCtrl', productionappointmentSearchCtrl);

});