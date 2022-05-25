define([
	'index',
	'/dts/mla/js/api/mla0007.js',
	'/dts/mla/js/api/mla0009.js',
	'/dts/mla/js/api/mlahtml9999p.js',
	'/dts/mla/js/api/mlahtml010p.js',
	'/dts/mla/js/ttService.js',
	'/dts/mla/js/mlaService.js',
	'/dts/mla/js/modalDetailPendingCtrl.js'
], function(index) {
	var documentListCache = undefined;
	var orderbyCache = undefined;
	var disclaimersCache = undefined;
	var limitPag = 50;

	// ########################################################
	// ### CONTROLLER GERAL - Listagem de todos os documentos
	// ########################################################
	historicCtrl.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', '$modal', 'mla.mla0009.factory', 'mla.service.mlaService', '$injector', '$timeout', 'mla.approval.ModalAdvancedSearch', 'TOTVSEvent'];
	function historicCtrl($rootScope, $scope, appViewService, $modal, mla0009, mlaService, $injector, $timeout, modalAdvancedSearch, TOTVSEvent) {
		var HistoricControl = this;
		HistoricControl.historicDocuments = [];
		HistoricControl.quickSearchText = '';

        /*
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 				Cria os filtros padrões.
		 					- dt-requisição: por padrão a faixa da data é 1 mês. (Hoje - 1 mês)
		 */
		HistoricControl.init = function(){
            HistoricControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricControl.estabcode = $rootScope.filtersMLA.selectedEstab;

			/* inicia uma nova aba */
			createTab = appViewService.startView($rootScope.i18n('l-approval-history'), 'mla.historic.Ctrl', HistoricControl);
			previousView = appViewService.previousView;

			/* Lógica de comparação do código da empresa/estabelecimento para a navegação entre abas */
            if(HistoricControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== HistoricControl.companycode){
                    HistoricControl.loadData();
                    HistoricControl.loadDefaults();
                    return;
                }
            }

            if (HistoricControl.estabcode !== undefined) {
                if($rootScope.filtersMLA.selectedEstab !== HistoricControl.estabcode){
                    HistoricControl.loadData();
                    HistoricControl.loadDefaults();
                    return;
                }
            }

	        if(	createTab === false &&
	        	HistoricControl.historicDocuments.length > 0 &&
	        	previousView.controller != 'mla.historic.ListCtrl'){
	        	HistoricControl.loadDefaults();
	        	return;
	    	}
            /* Fim - Navegação entre abas */

            HistoricControl.quickSearchText = '';
            HistoricControl.loadDefaults();
            HistoricControl.loadData();
		};

		/**
 		 * Objetivo: Identificar se a tela está sendo aberta em um dispositivo touch
 		 * Parâmetros: 
 		 * Observações:
 		 */
		HistoricControl.isTouchDevice = function() {
			return 'ontouchstart' in document.documentElement;
		}

		/*
		 * Objetivo: Carregar as informações padrões de inicialização da tela.
		 * Parâmetros:
		 * Observações: Carrega os parâmetros padrões da tela: filros
		 */
		HistoricControl.loadDefaults = function(){
			HistoricControl.isFluig = $rootScope.isFluig;
			reload = false;

			if(disclaimersCache !== undefined && HistoricControl.disclaimers !== undefined){
				for(i = 0; i < disclaimersCache.length; i++){
					if(disclaimersCache[i].property == "dt-geracao"){
						dateDisclaimerCache = disclaimersCache[i].value;
						break;
					}
				}
				for(i = 0; i < HistoricControl.disclaimers.length; i++){
					if(HistoricControl.disclaimers[i].property == "dt-geracao"){
						dateDisclaimers = HistoricControl.disclaimers[i].value;
						break;
					}
				}
				if(dateDisclaimerCache !== dateDisclaimers){
					reload = true;
				}
			}

			HistoricControl.advancedSearch = {};
			HistoricControl.disclaimers = [];

			if(disclaimersCache !== undefined){
				for(i = 0; i < disclaimersCache.length; i++){
					if(disclaimersCache[i].property == "dt-geracao"){
						HistoricControl.disclaimers.push(disclaimersCache[i]);
						dateDisclaimer = disclaimersCache[i]["value"].split(";");
						HistoricControl.advancedSearch.dateStart = parseInt(dateDisclaimer[0]);
						HistoricControl.advancedSearch.dateEnd = parseInt(dateDisclaimer[1]);
						break;
					}
				}
				/* se a data for alterada, deve recarregar a lista*/
				if(reload)
					HistoricControl.loadData();
			}else{
				var dtFim = new Date().getTime();
				var dtIni = dtFim - (30 * 24 * 60 * 60 * 1000);
				var faixa = '0';
	        	var deate = '';

	            HistoricControl.advancedSearch.dateStart = dtIni;
	            faixa = HistoricControl.advancedSearch.dateStart;
	            deate = ' ' + $rootScope.i18n('l-from') + ' ' + mlaService.timestampToDate(HistoricControl.advancedSearch.dateStart);

	            HistoricControl.advancedSearch.dateEnd = dtFim;
	            faixa = faixa + ';' + HistoricControl.advancedSearch.dateEnd;
	            deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + mlaService.timestampToDate(HistoricControl.advancedSearch.dateEnd);

	            HistoricControl.addDisclaimer('dt-geracao', faixa, $rootScope.i18n("l-generation-date") + deate, true);
			}
            HistoricControl.addDisclaimersCompany();
            HistoricControl.addDisclaimerEstab();
		}


		/*
		 * Objetivo: Buscar no ERP os dados das pendências
		 * Parâmetros:
		 * Observações:
		 */
		HistoricControl.loadData = function(){
			var dtIni = null;
			var dtFim = null;

			/* Atualiza código da empresa corrente */
			if ($rootScope.filtersMLA.selectedCompany !== undefined) {
				HistoricControl.companycode = $rootScope.filtersMLA.selectedCompany;
                HistoricControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			}

			for(i = 0; i< HistoricControl.disclaimers.length; i++){
				if(HistoricControl.disclaimers[i].property == "dt-geracao"){
					dateRange = HistoricControl.disclaimers[i].value.split(";");
					dtIni = dateRange[0];
					dtFim = dateRange[1];
					break;
				}
			}

			mla0009.getTotalizadoresPorDocumentoEmpresaEstab({epCodigo:$rootScope.filtersMLA.selectedCompany,
                                                              codEstabel:$rootScope.filtersMLA.selectedEstab,
                                                              iTipo:2,
                                                              dtIni:dtIni,
                                                              dtFim:dtFim},function(result){
				HistoricControl.historicDocuments = result;
				/* ordena os documentos de acordo com a quantidade de pendências */
				HistoricControl.historicDocuments.sort(function(a,b){
					return b['nr-doc-pend-aprov-saida'] - a['nr-doc-pend-aprov-saida'];
				});
			});
		}

		/*
		 * Objetivo: Abrir a tela de seleção do faixa de data; Refazer a busca de acordo com a faixa de data informada
		 * Parâmetros:
		 * Observações:
		 */
		HistoricControl.openAdvancedSearch = function(){
			var modalInstance = $modal.open({
									          templateUrl: '/dts/mla/html/historic/historic.search.html',
									          controller: 'mla.historic.AdvancedSearchCtrl as controller',
									          size: 'lg',
									          resolve: {
									            model: function (){
									            	return HistoricControl.advancedSearch;
									            }
									          }
									        });

			modalInstance.result.then(function () {
				HistoricControl.addDisclaimersAdvancedSearch();
                HistoricControl.addDisclaimersCompany();
                HistoricControl.addDisclaimerEstab();
				HistoricControl.loadData();
			});
		}

        /*
		 * Objetivo: Abre a tela de busca avançada, com empresa, estabelecimento e período
		 * Parâmetros:
		 * Observações:
		 */
        HistoricControl.openAdvancedSearchComplete = function() {
            //Indica que a modal está sendo aberta através do histórico, para mostrar o período
            HistoricControl.advancedSearch.historic = true;
            var modalInstance = modalAdvancedSearch.open(HistoricControl.advancedSearch, function() {});
        }

		/*
		 * Objetivo: Adicionar o filtro da faixa de data informada na modal (openAdvancedSearch())
		 * Parâmetros:
		 * Observações:
		 */
		HistoricControl.addDisclaimersAdvancedSearch = function(){
			HistoricControl.disclaimers = [];

			if (HistoricControl.advancedSearch.dateStart || HistoricControl.advancedSearch.dateEnd) {
            	var faixa = '0';
            	var deate = '';

	            if (!HistoricControl.advancedSearch.dateStart)  {
	            	dataCalc = new Date(new Date(HistoricControl.advancedSearch.dateEnd).getTime() - (30 * 24 * 60 * 60 * 1000));
	            	HistoricControl.advancedSearch.dateStart = dataCalc;
	            }
                faixa = HistoricControl.advancedSearch.dateStart;
                deate = ' ' + $rootScope.i18n('l-from') + ' ' + mlaService.timestampToDate(HistoricControl.advancedSearch.dateStart);

                if (!HistoricControl.advancedSearch.dateEnd) {
                	hoje = new Date();
	                HistoricControl.advancedSearch.dateEnd = hoje;
                }
                faixa = faixa + ';' + HistoricControl.advancedSearch.dateEnd;
                deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + mlaService.timestampToDate(HistoricControl.advancedSearch.dateEnd);

	            HistoricControl.addDisclaimer('dt-geracao', faixa, $rootScope.i18n("l-generation-date") + deate, true);
	        }
		}

		/*
		 * Objetivo: Adicionar um filtro
		 * Parâmetros: 	- property: nome do campo que será filtrado
		 				- value: valor que deverá ser filtrado
	 					- label: descrição do filtro que aparece em tela
	 					- fixed: true: filtro não pode ser removido | false: filtro pode ser removido
		 * Observações:
		 */
		HistoricControl.addDisclaimer = function(property, value, label, fixed) {
			HistoricControl.disclaimers.push({property: property, value: value, title: label, fixed: fixed});
			disclaimersCache = HistoricControl.disclaimers;
		}

        /*
		 * Objetivo: Adicionar disclaimer de empresa conforme a selecionada
		 * Parâmetros:
		 * Observações:
		 */
        HistoricControl.addDisclaimersCompany = function() {
            HistoricControl.disclaimers = mlaService.addDisclaimersCompany(HistoricControl.disclaimers);
            disclaimersCache = HistoricControl.disclaimers;
        }

        /*
		 * Objetivo: Adicionar disclaimer de estabelecimento conforme o selecionado
		 * Parâmetros:
		 * Observações:
		 */
        HistoricControl.addDisclaimerEstab = function() {
            HistoricControl.disclaimers = mlaService.addDisclaimerEstab(HistoricControl.disclaimers);
            disclaimersCache = HistoricControl.disclaimers;
        }

		/*
		 * Objetivo: Remover um filtro
		 * Parâmetros: 	- disclaimer: objeto do filtro que deverá ser removido
		 * Observações:
		 */
		HistoricControl.removeDisclaimer = function(disclaimer) {
            if (disclaimer.property === 'estab') {
                $rootScope.filtersMLA.selectedEstab = '';
                HistoricControl.addDisclaimerEstab();
            } else if (disclaimer.property === 'company') {
                $rootScope.filtersMLA.selectedCompany = '';
                HistoricControl.addDisclaimersCompany();
            } else {
                var index = HistoricControl.disclaimers.indexOf(disclaimer);
                if (index != -1) {
                    HistoricControl.disclaimers.splice(index, 1);
                    disclaimersCache = HistoricControl.disclaimers;
                }

                if (disclaimer.property == 'dt-geracao') {
                    HistoricControl.advancedSearch.dateStart = null;
                    HistoricControl.advancedSearch.dateEnd = null;
                }
            }

			HistoricControl.loadData();
		}

		/*
		 * Objetivo: Refazer a busca dos dados do ERP
		 * Parâmetros:
		 * Observações:
		 */
		HistoricControl.search = function(){
			if(!HistoricControl.quickSearchText)
				HistoricControl.loadData();
		}

		/* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                HistoricControl.init();
            }
		}

        /* Objetivo: Iniciar a tela (executa o método inicial ) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                HistoricControl.init();
            }
		});

		/* busca os dados novamente quando é feita a troca de empresa */
		$scope.$on("mla.selectCompany.event", function (event, currentcompany) {
			//Atualiza rootScope com empresa selecionada
			mlaService.afterSelectCompany(currentcompany);

			documentListCache = undefined;
			HistoricControl.loadData();
            HistoricControl.addDisclaimersCompany();
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
			HistoricControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            HistoricControl.init();
		});

        /* Evento de carregamento de dados do usuário
           (defaults de ordenação, visualização de pendências) */
        $scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});

        /* Busca de dados após cofirmação da tela de busca avançada */
        $scope.$on("mla.advancedsearch.event", function(event, advancedSearch){
			documentListCache = undefined;
			if (advancedSearch.allCompanies) {
				$rootScope.filtersMLA.selectedCompany = '';
			}
            HistoricControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            HistoricControl.advancedSearch.dateStart = advancedSearch.dateStart;
            HistoricControl.advancedSearch.dateEnd = advancedSearch.dateEnd;
            HistoricControl.addDisclaimersAdvancedSearch();
            HistoricControl.addDisclaimersCompany();
            HistoricControl.addDisclaimerEstab();
			HistoricControl.loadData();
		});
	}

	// ################################################################################
	// ### CONTROLLER LISTAGEM DE APROVAÇÕES - Listagem das aprovações de um documento
	// ################################################################################
	historicListCtrl.$inject = ['$stateParams', '$rootScope', '$scope', 'totvs.app-main-view.Service','$modal', 'mla.mla0009.factory', 'mla.mlahtml9999p.factory', 'mla.service.mlaService', 'toaster', '$injector', '$timeout', '$filter', 'mla.approval.ModalAdvancedSearch', 'TOTVSEvent'];
	function historicListCtrl($stateParams, $rootScope, $scope, appViewService, $modal, mla0009, mlahtml9999p, mlaService, toaster, $injector, $timeout, $filter, modalAdvancedSearch, TOTVSEvent) {
		var HistoricListControl = this;
		HistoricListControl.quickSearchText = '';
		HistoricListControl.orderbyList = {};
		HistoricListControl.filters = {};
		HistoricListControl.addQuickFilter = true;
		HistoricListControl.searched = false;


		/*
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 */
		HistoricListControl.init = function(){
            HistoricListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricListControl.estabcode = $rootScope.filtersMLA.selectedEstab;

			createTab = appViewService.startView($rootScope.i18n('l-approval-history'), 'mla.historic.ListCtrl', HistoricListControl);
			previousView = appViewService.previousView;

			/* Lógica de comparação do código da empresa/estabelecimento para a navegação entre abas */
            if(HistoricListControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== HistoricListControl.companycode &&
	        	   HistoricListControl.documentId === $stateParams.documentId){
                    HistoricListControl.loadData();
                    HistoricListControl.loadDefaults();
                    return;
                }
            }

            if (HistoricListControl.estabcode !== undefined) {
                if($rootScope.filtersMLA.selectedEstab !== HistoricListControl.estabcode &&
	        	   HistoricListControl.documentId === $stateParams.documentId){
                    HistoricListControl.loadData();
                    HistoricListControl.loadDefaults();
                    return;
                }
            }

	        if(	createTab === false &&
	        	HistoricListControl.documentId === $stateParams.documentId &&
	        	HistoricListControl.documentRequests &&
	        	previousView.controller != 'mla.historic.DetailCtrl'){
	        	HistoricListControl.loadDefaults();
	        	return;
	    	}
            /* Fim - Navegação entre abas */

	        HistoricListControl.quickSearchText = '';
			HistoricListControl.loadDefaults();
			HistoricListControl.documentId = $stateParams.documentId;
			HistoricListControl.customDocumentId = mlaService.getCustomDocumentId(HistoricListControl.documentId);
			HistoricListControl.pageLink = "historic";

			/* Procura se há arquivo html customizado na pasta custom, caso não houver carrega o template padrão*/
			var nameDoc = "doc-"+HistoricListControl.documentId + ".html";
		    requirejs(['text!/dts/custom/mla/template/list/' + nameDoc], function () {
	    		HistoricListControl.documentListTemplate = '/dts/custom/mla/template/list/' + nameDoc;
			}, function(err){
				HistoricListControl.documentListTemplate = "/dts/mla/html/template/list/" + nameDoc;
			});

		    /*
			 * Procura se há arquivo html customizado para o título, se não achar, procura o arquivo html de
			 *  acordo com o tipo do documento. Se não encontrar, carrega o template default do título
			 */
			requirejs(['text!/dts/custom/mla/template/title/' + nameDoc], function () {
		    	HistoricListControl.documentTitleTemplate = '/dts/custom/mla/template/title/' + nameDoc;
			}, function(err){
				requirejs(['text!/dts/mla/html/template/title/' + nameDoc], function () {
					HistoricListControl.documentTitleTemplate = "/dts/mla/html/template/title/" + nameDoc;
				}, function(err){
					HistoricListControl.documentTitleTemplate = "/dts/mla/html/template/title/default.html";
				});
			});

			HistoricListControl.documentRequests = [];
			HistoricListControl.advancedSearch = {};
			HistoricListControl.addQuickFilter = false;
			HistoricListControl.loadData();
		}

		/**
 		 * Objetivo: Identificar se a tela está sendo aberta em um dispositivo touch
 		 * Parâmetros: 
 		 * Observações:
 		 */
		HistoricListControl.isTouchDevice = function() {
			return 'ontouchstart' in document.documentElement;
		}

		/*
		 * Objetivo: Carregar os dados padrões da tela.
		 * Parâmetros:
		 * Observações: orderbyCache: tenta buscar a ordenação de uma variável local, para manter a ordenação durante a navegação
		 				caso não encontre, busca o valor do ERP (mla0103)
		 */
		HistoricListControl.loadDefaults = function(){
			HistoricListControl.isFluig = $rootScope.isFluig;
			reload = false;

			if(disclaimersCache !== undefined && HistoricListControl.disclaimers !== undefined){
				for(i = 0; i < disclaimersCache.length; i++){
					if(disclaimersCache[i].property == "dt-geracao"){
						dateDisclaimerCache = disclaimersCache[i].value;
						break;
					}
				}
				for(i = 0; i < HistoricListControl.disclaimers.length; i++){
					if(HistoricListControl.disclaimers[i].property == "dt-geracao"){
						dateDisclaimers = HistoricListControl.disclaimers[i].value;
						break;
					}
				}
				if(dateDisclaimerCache !== dateDisclaimers){
					reload = true;
				}
			}

			if(disclaimersCache !== undefined){
				HistoricListControl.disclaimers = disclaimersCache;
				/* se a data for alterada, deve recarregar a lista*/
				if(reload)
					HistoricListControl.loadData();
			}else{
				HistoricListControl.disclaimers = [];
				HistoricListControl.advancedSearch = {};
				var dtFim = new Date().getTime();
				var dtIni = dtFim - (30 * 24 * 60 * 60 * 1000);
				var faixa = '0';
	        	var deate = '';

	            HistoricListControl.advancedSearch.dateStart = dtIni;
	            faixa = HistoricListControl.advancedSearch.dateStart;
	            deate = ' ' + $rootScope.i18n('l-from') + ' ' + mlaService.timestampToDate(HistoricListControl.advancedSearch.dateStart);

	            HistoricListControl.advancedSearch.dateEnd = dtFim;
	            faixa = faixa + ';' + HistoricListControl.advancedSearch.dateEnd;
	            deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + mlaService.timestampToDate(HistoricListControl.advancedSearch.dateEnd);
	            HistoricListControl.addDisclaimer('dt-geracao', faixa, $rootScope.i18n("l-generation-date") + deate, true);
			}

			/* Somente adiciona este filtro se for a primeira visualização (abertura da tab pela 1º vez) */
			if(HistoricListControl.addQuickFilter)
				HistoricListControl.addDisclaimer('quickFilter','saida',$rootScope.i18n('l-all'),true);
			HistoricListControl.filters =  [{title:$rootScope.i18n('l-aprov'),disclaimers:"aprov"},
											{title:$rootScope.i18n('l-reprov'),disclaimers:"reprov"},
											{title:$rootScope.i18n('l-all'),disclaimers:"saida", fixed:true}];
			HistoricListControl.orderbyList =  [{title:$rootScope.i18n('l-date'), property:"nr-trans", asc:false, default:true},
												{title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:false}];

			if(!orderbyCache){
				HistoricListControl.orderbyList = mlaService.attOrderbyList($rootScope.userMLAInformation.sortDefaultUser);
			}else{
				$rootScope.userMLAInformation.sortDefaultUser = orderbyCache;
				HistoricListControl.orderbyList = mlaService.attOrderbyList($rootScope.userMLAInformation.sortDefaultUser);
			}

            HistoricListControl.addDisclaimersCompany();
            HistoricListControl.addDisclaimerEstab();
		}

		/*
		 * Objetivo: ordenar a lista de documentos retornados pelo método listagemDocumentos
		 * Parâmetros: 	Entrada: 	a: documento a
		 							b: documento b
		 * Observações:
		 */
		HistoricListControl.sortTT = function(a,b){
            if (parseInt(a["iRow"]) < parseInt(b["iRow"]))
                return -1;
            else
                return 1;
        }

		/*
		 * Objetivo: buscar os dados do ERP
		 * Parâmetros:
		 * Observações:	-getDocumentosDoUsuario: busca o nome dos documentos disponíveis.
		 					-Obs: só busca se a variável documentListCache não estiver carregada.
		 */
		HistoricListControl.loadData = function(){
			/* Atualiza código da empresa corrente */
			if ($rootScope.filtersMLA.selectedCompany !== undefined) {
				HistoricListControl.companycode = $rootScope.filtersMLA.selectedCompany;
                HistoricListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			}

			if(documentListCache){
				HistoricListControl.documentName = documentListCache[HistoricListControl.documentId];
				if(documentListCache[HistoricListControl.documentId] === undefined){
					HistoricListControl.notFound = true;
					//Documento X não encontrado na empresa Y.  
					toaster.pop('warning', $rootScope.i18n('l-change-company'), $rootScope.i18n('l-document') + " " + 
								HistoricListControl.documentId + " " + $rootScope.i18n('l-not-found-at-company') + " " + HistoricListControl.companycode);
					location.href ="#/dts/mla/historic";
				}else{
					HistoricListControl.loadDocuments();
					HistoricListControl.notFound = false;
				}
			}else{
				mla0009.getDocumentosDoUsuario({epCodigo:$rootScope.filtersMLA.selectedCompany}, function(result){
					documentListCache = [];
					for(var i = 0; i < result.length; i++){
						documentListCache[result[i]["cod-tip-doc"]] = result[i]["desc-tip-doc"];
					}
					HistoricListControl.documentName = documentListCache[HistoricListControl.documentId];
					if(documentListCache[HistoricListControl.documentId] === undefined){
						HistoricListControl.notFound = true;
						//Documento X não encontrado na empresa Y.  
						toaster.pop('warning', $rootScope.i18n('l-change-company'), $rootScope.i18n('l-document') + " " + 
								    HistoricListControl.documentId + " " + $rootScope.i18n('l-not-found-at-company') + " " + HistoricListControl.companycode);
						location.href ="#/dts/mla/historic";
					}else{
						HistoricListControl.loadDocuments();
						HistoricListControl.notFound = false;
					}
				},{});
			}
		}

		/*
		 * Objetivo: buscar os documentos no ERP
		 * Parâmetros:
		 * Observações: - listagemDocumentos - busca as pendências de acordo com o tipo de documento selecionado
		 */
		HistoricListControl.loadDocuments = function(){
			/* monta o nome do programa de acordo com o tipo do documento */
			var codPrograma = 0;
			if(String(HistoricListControl.documentId).length < 3 && String(HistoricListControl.documentId).length >= 1){
				switch(String(HistoricListControl.documentId).length){
					case 1: codPrograma = "00" + String(HistoricListControl.documentId);
							break;
					case 2: codPrograma = "0" + String(HistoricListControl.documentId);
							break;
				}
				codPrograma = 'mlahtml' + codPrograma + 'p';
			}else{
				codPrograma = 'mlahtml' + String(HistoricListControl.documentId) + 'p';
			}

			var dtIni = null;
			var dtFim = null;
			for(i = 0; i< HistoricListControl.disclaimers.length; i++){
				if(HistoricListControl.disclaimers[i].property == "dt-geracao"){
					dateRange = HistoricListControl.disclaimers[i].value.split(";");
					dtIni = dateRange[0];
					dtFim = dateRange[1];
					break;
				}
			}

			quickFilter = "";
			for(i=0;i<HistoricListControl.disclaimers.length;i++){
				if(HistoricListControl.disclaimers[i].property == "quickFilter"){
					quickFilter = HistoricListControl.disclaimers[i].value;
					break;
				}
			}

			mlahtml9999p.listagemDocumentosEmpresaEstab({cEpCodigo:$rootScope.filtersMLA.selectedCompany,
                                                         cCodEstabel:$rootScope.filtersMLA.selectedEstab,
                                                         programcode:codPrograma,
                                                         iCodTipDoc:HistoricListControl.documentId,
                                                         tipoEntrSai:quickFilter,
                                                         dtIni:dtIni,
                                                         dtFim:dtFim}, function(result){
				var lista = [];
				var c = -1;
				var rowant = 0;
				result.sort(HistoricListControl.sortTT);

				for (var i = 0; i < result.length; i++) {
					if (rowant != result[i].iRow) {
						rowant = result[i].iRow;
						c++;
						lista[c] = new Object();
					}
					lista[c][result[i].cField] = result[i].cValue;
				}
				HistoricListControl.allDocuments = lista;
				HistoricListControl.documentRequestsCount = lista.length;
				HistoricListControl.originalList = lista.slice(limitPag);
				HistoricListControl.documentRequests = lista.slice(0,limitPag);
				HistoricListControl.sortList();
				HistoricListControl.selectOrderBy(HistoricListControl.selectedOrderby);
				if(HistoricListControl.quickSearchText !== undefined && HistoricListControl.quickSearchText !== "")
					HistoricListControl.search();
			});
		}

		/*
		 * Objetivo: paginação dos resultados
		 * Parâmetros:
		 * Observações: Este método não está fazendo a páginação dos registros através de consultas ao ERP.
		 				Está apenas fazendo a paginação 'visual' na tela
		 */
		HistoricListControl.loadMore = function(){
			HistoricListControl.documentRequests = HistoricListControl.documentRequests.concat(HistoricListControl.originalList.slice(0,limitPag));
			HistoricListControl.originalList = HistoricListControl.originalList.slice(limitPag);
		}

		/*
		 * Objetivo: efetuar a reaprovação de uma pendência
		 * Parâmetros: nrTrans: número da pendência que será reaprovada
		 * Observações:
		 */
		HistoricListControl.reapprove = function(nrTrans){
			mlaService.reapprove(nrTrans);
		}

		/*
		 * Objetivo: Abrir a tela de seleção do faixa de data; Refazer a busca de acordo com a faixa de data informada
		 * Parâmetros:
		 * Observações:
		 */
		HistoricListControl.openAdvancedSearch = function(){
			HistoricListControl.advancedSearch = [];
			for(i=0;i<HistoricListControl.disclaimers.length;i++){
				if(HistoricListControl.disclaimers[i].property == "dt-geracao"){
					dateRange = HistoricListControl.disclaimers[i].value.split(";");
					HistoricListControl.advancedSearch.dateStart = parseInt(dateRange[0]);
					HistoricListControl.advancedSearch.dateEnd = parseInt(dateRange[1]);
					break;
				}
			}

			var modalInstance = $modal.open({
									          templateUrl: '/dts/mla/html/historic/historic.search.html',
									          controller: 'mla.historic.AdvancedSearchCtrl as controller',
									          size: 'lg',
									          resolve: {
									            model: function (){
									            	return HistoricListControl.advancedSearch;
									            }
									          }
									        });
			modalInstance.result.then(function () {
				HistoricListControl.addDisclaimersAdvancedSearch();
				HistoricListControl.loadData();
			});
		}

        /*
		 * Objetivo: Abre a tela de busca avançada, com empresa, estabelecimento e período
		 * Parâmetros:
		 * Observações:
		 */
        HistoricListControl.openAdvancedSearchComplete = function() {
            HistoricListControl.advancedSearch = [];
			for(i=0;i<HistoricListControl.disclaimers.length;i++){
				if(HistoricListControl.disclaimers[i].property == "dt-geracao"){
					dateRange = HistoricListControl.disclaimers[i].value.split(";");
					HistoricListControl.advancedSearch.dateStart = parseInt(dateRange[0]);
					HistoricListControl.advancedSearch.dateEnd = parseInt(dateRange[1]);
					break;
				}
			}

            //Indica que a modal está sendo aberta através do histórico, para mostrar o período
            HistoricListControl.advancedSearch.historic = true;
            var modalInstance = modalAdvancedSearch.open(HistoricListControl.advancedSearch, function() {});
        }

		/*
		 * Objetivo: Adicionar o filtro da faixa de data informada na modal (openAdvancedSearch())
		 * Parâmetros:
		 * Observações:
		 */
		HistoricListControl.addDisclaimersAdvancedSearch = function(){
			if (HistoricListControl.advancedSearch.dateStart || HistoricListControl.advancedSearch.dateEnd) {
            	var faixa = '0';
            	var deate = '';

	            if (!HistoricListControl.advancedSearch.dateStart)  {
	            	dataCalc = new Date(new Date(HistoricListControl.advancedSearch.dateEnd).getTime() - (30 * 24 * 60 * 60 * 1000));
	            	HistoricListControl.advancedSearch.dateStart = dataCalc;
	            }
                faixa = HistoricListControl.advancedSearch.dateStart;
                deate = ' ' + $rootScope.i18n('l-from') + ' ' + mlaService.timestampToDate(HistoricListControl.advancedSearch.dateStart);


                if (!HistoricListControl.advancedSearch.dateEnd) {
                	hoje = new Date();
	                HistoricListControl.advancedSearch.dateEnd = hoje;
                }
                faixa = faixa + ';' + HistoricListControl.advancedSearch.dateEnd;
                deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + mlaService.timestampToDate(HistoricListControl.advancedSearch.dateEnd);
	            HistoricListControl.addDisclaimer('dt-geracao', faixa, $rootScope.i18n("l-generation-date") + deate, true);
	        }
		}


		/*
		 * Objetivo: Remover um filtro
		 * Parâmetros: 	- disclaimer: objeto do filtro que deverá ser removido
		 * Observações:
		 */
		HistoricListControl.addDisclaimer = function(property, value, label, fixed) {
			index = undefined;
			for(i=0;i<HistoricListControl.disclaimers.length;i++)			{
				if(HistoricListControl.disclaimers[i].property == property){
					index = i;
					break;
				}
			}
			if(index !== undefined)
				HistoricListControl.disclaimers[index] = {property: property, value: value, title: label, fixed: fixed};
			else
				HistoricListControl.disclaimers.push({property: property, value: value, title: label, fixed: fixed});

			if(property == "dt-geracao")
				disclaimersCache = HistoricListControl.disclaimers;
		}


		/*
		 * Objetivo: Remover um filtro
		 * Parâmetros: 	- disclaimer: objeto do filtro que deverá ser removido
		 * Observações:
		 */
		HistoricListControl.removeDisclaimer = function(disclaimer) {
            if (disclaimer.property === 'estab') {
                $rootScope.filtersMLA.selectedEstab = '';
                HistoricListControl.addDisclaimerEstab();
            } else if (disclaimer.property === 'company') {
                $rootScope.filtersMLA.selectedCompany = '';
                HistoricListControl.addDisclaimersCompany();
            } else {
                var index = HistoricListControl.disclaimers.indexOf(disclaimer);
                if (index != -1) {
                    HistoricListControl.disclaimers.splice(index, 1);
                }

                if(disclaimer.property == "quickFilter")
                    HistoricListControl.disclaimers.push({property: 'quickFilter', value: 'saida', title: $rootScope.i18n('l-all'), fixed:true});
            }
			HistoricListControl.loadData();
		}


		/*
		 * Objetivo: Aplicar o filtro rápido na busca dos documentos.
		 * Parâmetros: filter: recebe o objeto de filtro selecionado
		 * Observações: Existem três filtros rápidos disponíveis: Aprovadas, Reprovadas e Todas
		 */
		HistoricListControl.selectFilter = function(filter){
			var quickFilter = $.grep(HistoricListControl.disclaimers, function(e){
			 	return e.property == "quickFilter";
		 	});
		 	var disclaimer = {property: 'quickFilter', value: filter.disclaimers, title: filter.title, fixed:filter.fixed};

		 	if(quickFilter.length > 0) {
 				var index = HistoricListControl.disclaimers.indexOf(quickFilter[0]);
 				HistoricListControl.disclaimers[index] = disclaimer;
		 	} else {
		 		HistoricListControl.disclaimers.push(disclaimer);
		 	}
            HistoricListControl.addDisclaimersCompany();
            HistoricListControl.addDisclaimerEstab();
			HistoricListControl.loadData();
		}

        /*
		 * Objetivo: Adicionar disclaimer de empresa conforme a selecionada
		 * Parâmetros:
		 * Observações:
		 */
        HistoricListControl.addDisclaimersCompany = function() {
            HistoricListControl.disclaimers = mlaService.addDisclaimersCompany(HistoricListControl.disclaimers);
        }

        /*
		 * Objetivo: Adicionar disclaimer de estabelecimento conforme o selecionado
		 * Parâmetros:
		 * Observações:
		 */
        HistoricListControl.addDisclaimerEstab = function() {
            HistoricListControl.disclaimers = mlaService.addDisclaimerEstab(HistoricListControl.disclaimers);
        }

		/*
		 * Objetivo: alterar a ordenação dos resultados
		 * Parâmetros: orderby: objeto que contém a ordenação selecionada pelo usuário em tela
		 * Observações: - orderby.property - nome do campo que será usado na ordenação
						- orderby.asc - indica se a ordenação é crescente (asc = true), ou decrescente (asc = false)
		 */
		HistoricListControl.selectOrderBy = function(orderby){
			mlaService.selectOrderBy(orderby);

			orderbyCache = $rootScope.filtersMLA.sort;
			HistoricListControl.sortList();
            HistoricListControl.orderbyList = mlaService.attOrderbyList($rootScope.filtersMLA.sort);
		}


		/*
		 * Objetivo: comparar dois registros para efetuar a ordenação da lista
		 * Parâmetros: 	- a: registro a
		 				- b: registro b
		 * Observações: a comparação é feita de acordo com o tipo seleciondo (sortType)
	 					- sortType = 1 -> Mais recentes
	 					- sortType = 2 -> Mais antigas
 						- sortType = 3 -> Maior valor
 						- sortType = 4 -> Menor valor
                        - sortType = 5 -> Maior empresa
						- sortType = 6 -> Menor empresa
		 */
		HistoricListControl.compareToSort = function(a,b){
			return mlaService.compareToSort(a,b);
		}


		/*
		 * Objetivo: ordenar a lista de documentos pendentes
		 * Parâmetros:
		 * Observações:
		 */
		HistoricListControl.sortList = function(){
			if(HistoricListControl.quickSearchText === undefined){
				HistoricListControl.allDocuments.sort(HistoricListControl.compareToSort);
				allDocuments = HistoricListControl.allDocuments.slice(0);

				numDocumentosMostrados = HistoricListControl.documentRequests.length;
				numDocumentosEscondidos = HistoricListControl.originalList.length;

				HistoricListControl.documentRequests = allDocuments.splice(0,numDocumentosMostrados);
				HistoricListControl.originalList = allDocuments;

				HistoricListControl.documentRequests = mlaService.separateDocuments(HistoricListControl.documentRequests);
			}else{
				HistoricListControl.documentRequests.sort(HistoricListControl.compareToSort);
			}
		}

		/*
		 * Objetivo: Refazer a busca dos dados do ERP
		 * Parâmetros:
		 * Observações:
		 */
		HistoricListControl.search = function(){
			HistoricListControl.searched = true;
			HistoricListControl.documentRequests = $filter('filter')(HistoricListControl.allDocuments, { $:HistoricListControl.quickSearchText });
			if(HistoricListControl.quickSearchText == undefined || HistoricListControl.quickSearchText == ""){
				HistoricListControl.cleanSearch();
			}

		}

		HistoricListControl.cleanSearch = function(){
			HistoricListControl.searched = false;
			HistoricListControl.loadData();
		}

		/*
		 * Objetivo: retornar se o campo lógico é verdadeiro ou falso
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna true/false
		 */
		HistoricListControl.checkLog = function(value){
			return mlaService.checkLog(value);
		}

		/*
		 * Objetivo: retornar se o campo lógico é 'Sim' ou 'Não' (já traduzido)
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna 'Sim' / 'Não'
		 */
		HistoricListControl.checkLogValue = function(value){
			return mlaService.checkLogValue(value);
		}

        /*
		 * Objetivo: Indica se a empresa deve ser apresentada nas pendências
		 * Parâmetros:
		 * Observações: Será apresentada somente quando estiver seleciona a opção de "Todas" empresas
		 */
        HistoricListControl.showCompany = function() {
            return mlaService.showCompany();
        }

        /* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                HistoricListControl.init();
            }
		}

		/* Objetivo: Iniciar a tela (executa o método inicial ) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                HistoricListControl.init();
            }
		});

        /* Evento de carregamento de dados do usuário
           (defaults de ordenação, visualização de pendências) */
        $scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});

		/**********************************************************************************/
		/************************************* Events *************************************/
		/* Evento de sucesso da reaprovação da pendência*/
		$scope.$on("mla.historic.event", function (event, objs) {
			toaster.pop('success', $rootScope.i18n('l-documents-approval'),$rootScope.i18n('l-approval-done'));
			HistoricListControl.loadData();
		});

		/* busca os dados novamente quando é feita a troca de empresa */
		$scope.$on("mla.selectCompany.event", function (event, currentcompany) {
			//Atualiza rootScope com empresa selecionada
			mlaService.afterSelectCompany(currentcompany);
			
			documentListCache = undefined;
			HistoricListControl.loadData();
            HistoricListControl.addDisclaimersCompany();
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
            HistoricListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            HistoricListControl.init();
		});

        /* Busca de dados após cofirmação da tela de busca avançada */
        $scope.$on("mla.advancedsearch.event", function(event, advancedSearch){
			documentListCache = undefined;
			if (advancedSearch.allCompanies) {
				$rootScope.filtersMLA.selectedCompany = '';
			}
            HistoricListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            HistoricListControl.advancedSearch.dateStart = advancedSearch.dateStart;
            HistoricListControl.advancedSearch.dateEnd = advancedSearch.dateEnd;
            HistoricListControl.addDisclaimersAdvancedSearch();
            HistoricListControl.addDisclaimersCompany();
            HistoricListControl.addDisclaimerEstab();
			HistoricListControl.loadData();
            HistoricListControl.loadDefaults();
		});
	}


	// ################################################################################
	// ### CONTROLLER LISTAGEM DE APROVAÇÕES - Listagem das aprovações de um documento
	// ################################################################################
	historicDetailCtrl.$inject = ['$stateParams', '$rootScope', '$scope', 'totvs.app-main-view.Service', 'mla.mla0009.factory', 'mla.mlahtml9999p.factory', 'mla.mlahtml010p.factory', 'mla.service.ttService', 'mla.service.mlaService', 'toaster','customization.generic.Factory', '$injector', '$timeout', '$modal', '$state', 'TOTVSEvent'];
	function historicDetailCtrl($stateParams, $rootScope, $scope, appViewService, mla0009, mlahtml9999p, mlahtml010p, ttService, mlaService, toaster, customizationService, $injector, $timeout, $modal, $state, TOTVSEvent) {
		var HistoricDetailControl = this;

		/*
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 */
		HistoricDetailControl.init = function(){
			// Se a tela chamadora for a listaem não deve inicializar o controller
			if($state.is('dts/mla/historic.list')) {
				return;
			}
            HistoricDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;

			/* Lógica de comparação do código da empresa/estabelecimento para a navegação entre abas */
            if(HistoricDetailControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== HistoricDetailControl.companycode){
                    HistoricDetailControl.loadData();
                    return;
                }
            }

			createTab = appViewService.startView($rootScope.i18n('l-approval-history'), 'mla.historic.DetailCtrl', HistoricDetailControl);
			previousView = appViewService.previousView;

	        if(	createTab === false &&
	        	HistoricDetailControl.documentId === $stateParams.documentId &&
	        	HistoricDetailControl.requestId === $stateParams.requestId){
	        	return;
	    	}
            /* Fim - Navegação entre abas */
			beforeLoadData();
		};

		/**
		* Objetivo: Buscar os detalhes de um documento e exibi-los na listagem
		* Parâmetros: @param  {int} nrTrans Número da transação
		* Observações:
		*/
	   HistoricDetailControl.detail = function(nrTrans) {
		   $stateParams.requestId = nrTrans;
		   if($stateParams.requestId === HistoricDetailControl.requestId && $stateParams.documentId === HistoricDetailControl.documentId) {
			   return;
		   }
		   beforeLoadData();
	   };

		/**
		* Objetivo: Carregar o template do documento de acordo com o código da URL e chamar a função para carregar os registros
		* Parâmetros:
		* Observações:
		*/
	   function beforeLoadData() {
		   var codPrograma = "";
		   HistoricDetailControl.documentId = $stateParams.documentId;
		   HistoricDetailControl.requestId = $stateParams.requestId;
		   HistoricDetailControl.documentDetailTemplate = "/dts/mla/html/template/detail/doc-" + $stateParams.documentId + ".html";

		   /* Procura se há arquivo html customizado na pasta custom, caso não houver carrega o template padrão */
		   var nameDoc = "doc-"+HistoricDetailControl.documentId + ".html";
		   requirejs(['text!/dts/custom/mla/template/detail/' + nameDoc], function () {
			   HistoricDetailControl.documentDetailTemplate = '/dts/custom/mla/template/detail/' + nameDoc;
		   }, function(err){
			   HistoricDetailControl.documentDetailTemplate = "/dts/mla/html/template/detail/" + nameDoc;
		   });

		   HistoricDetailControl.loadComplete = false;
		   HistoricDetailControl.loadData();
	   }

		/*
		 * Objetivo: buscar os dados do ERP
		 * Parâmetros:
		 * Observações:	-getDocumentosDoUsuario: busca o nome dos documentos disponíveis.
		 					-Obs: só busca se a variável documentListCache não estiver carregada.
		 				-detalheDocumento: busca os dados da pendência selecionada
		 				-getHistoricoAprovacoes: busca os dados do histórico de aprovações da pendência selecionada
		 */
		HistoricDetailControl.loadData = function(){
			/* Atualiza código da empresa corrente  */
			if ($rootScope.filtersMLA.selectedCompany !== undefined) {
				HistoricDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
                HistoricDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			}

			if(documentListCache){
				HistoricDetailControl.documentName = documentListCache[HistoricDetailControl.documentId];
			}else{
				mla0009.getDocumentosDoUsuario({epCodigo:$rootScope.filtersMLA.selectedCompany}, function(result){
					documentListCache = [];
					for(var i = 0; i < result.length; i++){
						documentListCache[result[i]["cod-tip-doc"]] = result[i]["desc-tip-doc"];
					}
					HistoricDetailControl.documentName = documentListCache[HistoricDetailControl.documentId];
				},{});
			}

			/* monta o nome do programa de acordo com o tipo do documento */
			if(String(HistoricDetailControl.documentId).length < 3 && String(HistoricDetailControl.documentId).length >= 1){
				switch(String(HistoricDetailControl.documentId).length){
					case 1: codPrograma = "00" + String(HistoricDetailControl.documentId);
							break;
					case 2: codPrograma = "0" + String(HistoricDetailControl.documentId);
							break;
				}
				codPrograma = 'mlahtml' + codPrograma + 'p';
			}else{
				codPrograma = 'mlahtml' + String(HistoricDetailControl.documentId) + 'p';
			}

			mlahtml9999p.detalheDocumento({programcode:codPrograma, nrTransacao:HistoricDetailControl.requestId}, function(result){
				HistoricDetailControl.request = [];
				HistoricDetailControl.situacao = result["p-situacao"];

				HistoricDetailControl.request = ttService.transformTT(result["ttDados"]);

				HistoricDetailControl.documentRequestsCount = result["ttDados"].length;

				if(HistoricDetailControl.documentId == 10){
                    var ttMapaComparativo = [];
                    HistoricDetailControl.showDetail = [];
                    for(var i=0;i<HistoricDetailControl.request['tt-ordem-proc'].length;i++){
						HistoricDetailControl.showDetail[HistoricDetailControl.request['tt-ordem-proc'][i]["numero-ordem"]] = false;
						
						ttMapaComparativo[HistoricDetailControl.request['tt-ordem-proc'][i]["numero-ordem"]] = [];
					}
					
					for(var i=0;i<HistoricDetailControl.request['tt-mapa-comparativo'].length; i++){
						HistoricDetailControl.request['tt-mapa-comparativo'][i]['aprovada-log'] = HistoricDetailControl.checkLog(HistoricDetailControl.request['tt-mapa-comparativo'][i]['aprovada']);

						HistoricDetailControl.request['tt-mapa-comparativo'][i]['ult-compra-log'] = HistoricDetailControl.checkLog(HistoricDetailControl.request['tt-mapa-comparativo'][i]['ult-compra']);	
						
						ttMapaComparativo[HistoricDetailControl.request['tt-mapa-comparativo'][i]['numero-ordem-orig']].push(HistoricDetailControl.request['tt-mapa-comparativo'][i]);
					}
					HistoricDetailControl.ttMapaComparativo = ttMapaComparativo;
				}

				if(HistoricDetailControl.documentId == 5){
					var ttMapaComparativo = [];
					for(var i=0;i<HistoricDetailControl.request['tt-cotacao'].length;i++){
						ttMapaComparativo[HistoricDetailControl.request['tt-cotacao'][i]["numero-ordem"]] = [];
					}

					for(var i=0;i<HistoricDetailControl.request['tt-mapa-comparativo'].length; i++){
						HistoricDetailControl.request['tt-mapa-comparativo'][i]['aprovada-log'] = HistoricDetailControl.checkLog(HistoricDetailControl.request['tt-mapa-comparativo'][i]['aprovada']);
						HistoricDetailControl.request['tt-mapa-comparativo'][i]['ult-compra-log'] = HistoricDetailControl.checkLog(HistoricDetailControl.request['tt-mapa-comparativo'][i]['ult-compra']);	
						
						ttMapaComparativo[HistoricDetailControl.request['tt-mapa-comparativo'][i]['numero-ordem-orig']].push(HistoricDetailControl.request['tt-mapa-comparativo'][i]);
					}
					HistoricDetailControl.ttMapaComparativo = ttMapaComparativo;
				}
				
				if (HistoricDetailControl.documentId == 6 || HistoricDetailControl.documentId == 7 || 
				    HistoricDetailControl.documentId == 8 || HistoricDetailControl.documentId == 19) {			   
					HistoricDetailControl.showDetail = [];
					for(var i=0;i<HistoricDetailControl.request['tt-ordem-compra'].length;i++){
						HistoricDetailControl.showDetail[HistoricDetailControl.request['tt-ordem-compra'][i]["numero-ordem"]] = false;
					}
				}
				HistoricDetailControl.loadComplete = true;
			});

			HistoricDetailControl.approvalLog = [];
			mla0009.getHistoricoAprovacoes({nrTransacao:HistoricDetailControl.requestId},function(result){
				HistoricDetailControl.approvalLog = result;
			});
		}
		
		/*
         * Objetivo: Controle dos itens que estão sendo exibidos os detalhes ou não
         * Parâmetros: Número da ordem de compra
         * Observações: Realizado esse controle para melhora de performance, quando há muitas informações
                        há uma demora para apresentar os dados em tela, dessa maneira será apresentado 
                        apenas os registros que o usuário deseja ver o "detalhe"
         */
        HistoricDetailControl.viewDetail = function(oc){
			if(HistoricDetailControl.documentId == 10){
				if(HistoricDetailControl.ttMapaComparativo[oc].length > 0){
					HistoricDetailControl.showDetail[oc] = !HistoricDetailControl.showDetail[oc];
				}
				else{
					mlahtml010p.getComparativeMaps({iNumOrdem:oc}, function(result){
						var mapAux = ttService.transformTT(result["ttDados"]);
						var ttMapaComparativoAux = mapAux['tt-mapa-comparativo'];

						for(var i=0;i<ttMapaComparativoAux.length; i++){
							ttMapaComparativoAux[i]['aprovada-log'] = HistoricDetailControl.checkLog(ttMapaComparativoAux[i]['aprovada']);
						
							ttMapaComparativoAux[i]['ult-compra-log'] = HistoricDetailControl.checkLog(ttMapaComparativoAux[i]['ult-compra']);	
							
							HistoricDetailControl.ttMapaComparativo[oc].push(ttMapaComparativoAux[i]);
						}

						HistoricDetailControl.showDetail[oc] = !HistoricDetailControl.showDetail[oc];
					});
				}
			}
			else{
				HistoricDetailControl.showDetail[oc] = !HistoricDetailControl.showDetail[oc];
			}
             
        }


		/*
		 * Objetivo: efetuar a reaprovação de uma pendência
		 * Parâmetros:
		 * Observações: requestId: número da pendência que será reaprovada
		 */
		HistoricDetailControl.reapprove = function(){
			mlaService.reapprove(HistoricDetailControl.requestId);
		}

		/* Objetivo: retornar para a tela de listagem do documento
		 * Parâmetros:
		 * Observações:
		 */
		HistoricDetailControl.goBack = function(){
			location.href = "#/dts/mla/historic/list/" + HistoricDetailControl.documentId;
		}

		/*
		 * Objetivo: retornar se o campo lógico é verdadeiro ou falso
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna true/false
		 */
		HistoricDetailControl.checkLog = function(value){
			return mlaService.checkLog(value);
		}

		/*
		 * Objetivo: retornar se o campo lógico é 'Sim' ou 'Não' (já traduzido)
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna 'Sim' / 'Não'
		 */
		HistoricDetailControl.checkLogValue = function(value){
			return mlaService.checkLogValue(value);
		}

		/*
		 * Objetivo: Abrir a tela modal de detalhe da pendência
		 * Parâmetros: nrTrans: número da transação da pendência
		 * Observações:
		 */
		HistoricDetailControl.openDetailPending = function(nrTrans){
			var modalInstance = $modal.open({
                                          		templateUrl: '/dts/mla/html/template/detail/detail-pending.html',
                                              	controller: 'mla.modalDetailPendingCtrl as controller',
											  	size: 'lg',
                                              	resolve: {
                                              				nrTransacao: function(){
                                              					return nrTrans;
                                              			 }
                                              	}
                                            });
		}

		/* Objetivo: Mostrar/esconder a div de detalhes
		 * Parâmetros: div_detalhe - id da div a ser manipulada
		 * Observações:
		 */
		HistoricDetailControl.showDetail = function(div_detalhe){
		    $('#'+div_detalhe).slideToggle("fast");
		}
		
		/* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                HistoricDetailControl.init();
            }
		}

		/* Objetivo: Iniciar a tela (executa o método inicial) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                HistoricDetailControl.init();
            }
		});

		/**********************************************************************************/
		/************************************* Events *************************************/
		/* busca os dados novamente quando é feita a troca de empresa */
		$scope.$on("mla.selectCompany.event", function (event, currentcompany) {
			//Atualiza rootScope com empresa selecionada
			mlaService.afterSelectCompany(currentcompany);

			documentListCache = undefined;
			// Se o controller estiver sendo chamado da listagem não deve carregar os dados
			if($state.is('dts/mla/historic.list')) return;
			location.href ="#/dts/mla/historic/list/" + HistoricDetailControl.documentId;
		});

		/* Evento de sucesso da reaprovação da pendência */
		$scope.$on("mla.historic.event", function (event, objs) {
			// Se a tela atual for a listagem não exibe estas mensagens pois este watcher já existe no controller de listagem (serve para evitar mensagens repetidas)
			if($state.is('dts/mla/historic.list')) return;
			toaster.pop('success', $rootScope.i18n('l-documents-approval'),$rootScope.i18n('l-approval-done'));
			location.href ="#/dts/mla/historic/list/" + HistoricDetailControl.documentId;
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
			// Se o controller estiver sendo chamado da listagem não deve carregar os dados
			if($state.is('dts/mla/historic.list')) return;
            HistoricDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
            HistoricDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            HistoricDetailControl.init();
		});

        /* Evento de carregamento de dados do usuário
           (defaults de ordenação, visualização de pendências) */
        $scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});

		/* Evento de carregamento concluído da include de detalhe do documento (ng-include) */
		$scope.$on("$includeContentLoaded", function(event,src){
			srcAux = src.split("/");
			doc = srcAux[srcAux.length - 1];
			if(doc.indexOf("doc-") < 0){
		  		customFunctionName = 'customDetail_quotation';
		  		customObject = $("#quotation");
			}else{
		  		doc = doc.replace("doc-","");
			  	doc = doc.replace(".html","");
			  	customFunctionName = 'customDetail'+doc;
			  	customObject = $("#template");
			}

			customizationService.callEvent('mla.historic', customFunctionName, HistoricDetailControl, customObject);
		});
	}


	// ########################################################
	// ### CONTROLLER MODAL Aprovação/Reprovação
	// ########################################################
	historicModalCtrl.$inject = ['$rootScope', '$modalInstance', 'modalReject'];
	function historicModalCtrl($rootScope, $modalInstance, modalReject) {
		var historicModalControl = this;

		/*
		 * Objetivo: Método inicial da abertura da modal de reaprovação.
		 * Parâmetros:
		 * Observações:
		 */
		historicModalControl.init = function(){
			setTimeout(function () {
				document.getElementsByName("controller_approvaltext")[0].focus();
			}, 200);
		}

		/*
		 * Objetivo: Cancelar e fechar a modal de busca avançada.
		 * Parâmetros:
		 * Observações:
		 */
		historicModalControl.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		/*
		 * Objetivo: Aprovar as pendências selecionadas
		 * Parâmetros:
		 * Observações: Envia o texto de aprovação
		 */
		historicModalControl.approve = function () {
			$modalInstance.close({approvalText: this.approvalText});
		};

		/* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
			historicModalControl.init();
		}
	}

	// ########################################################
	// ### CONTROLLER MODAL Pesquisa Avançada
	// ########################################################
	historicAdvancedSearchCtrl.$inject = ['$scope', '$rootScope','$modalInstance', 'model', 'toaster'];
	function historicAdvancedSearchCtrl($scope, $rootScope, $modalInstance, model, toaster) {
		var historicAdvancedSearchControl = this;

		historicAdvancedSearchControl.advancedSearch = model;

		/*
		 * Objetivo: Realizar validações nas datas informadas na modal de seleção da faixa de data (pesquisa avançada)
		 * Parâmetros:
		 * Observações:
		 */
		historicAdvancedSearchControl.search = function(){
			/*Se não for informar nenhuma data apenas cancela e fecha o modal */
			if(!historicAdvancedSearchControl.advancedSearch.dateStart && !historicAdvancedSearchControl.advancedSearch.dateEnd){
				historicAdvancedSearchControl.cancel();
				return;
			}

			if(!historicAdvancedSearchControl.advancedSearch.dateEnd){
				var hoje = new Date();
	        	hoje = parseInt(hoje.getTime());
				historicAdvancedSearchControl.advancedSearch.dateEnd = hoje;
			}

			if(historicAdvancedSearchControl.advancedSearch.dateEnd < historicAdvancedSearchControl.advancedSearch.dateStart)
				toaster.pop('error', $rootScope.i18n('l-invalid-range'), $rootScope.i18n('l-invalid-range-help'));
			else
				$modalInstance.close();
		}

		/*
		 * Objetivo: Cancelar e fechar a modal de busca avançada.
		 * Parâmetros:
		 * Observações:
		 */
		historicAdvancedSearchControl.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		/* Evento de fechamento da modal caso mude o state da tela */
		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});
	}

    // *************************************************************************************
	// *** SERVICE MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalAdvancedSearch.$inject = ['$modal', 'mla.service.mlaService'];
	function modalAdvancedSearch($modal, mlaService) {
        /*
		 * Objetivo: Abre a modal de busca avançada
		 * Parâmetros: params: Parâmetros para a modal
		 * Observações:
		 */
		this.open = function (params) {
			 return mlaService.advancedSearch(params);
		}
	};

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.controller('mla.historic.Ctrl', historicCtrl);
	index.register.controller('mla.historic.ListCtrl', historicListCtrl);
	index.register.controller('mla.historic.DetailCtrl', historicDetailCtrl);
	index.register.controller('mla.hisroric.ModalCtrl', historicModalCtrl);
	index.register.controller('mla.historic.AdvancedSearchCtrl',historicAdvancedSearchCtrl);
    index.register.service('mla.approval.ModalAdvancedSearch', modalAdvancedSearch);
});
