define([
	'index',
	'/dts/mla/js/api/mla0007.js',
	'/dts/mla/js/api/mla0009.js',
	'/dts/mla/js/api/mlahtml9999p.js',
	'/dts/mla/js/api/mlahtml010p.js',
	'/dts/mla/js/ttService.js',
	'/dts/mla/js/mlaService.js',
	'/dts/mla/js/modalDetailPendingCtrl.js',
	'/dts/mla/html/approval/approval.config.modal.ctrl.js'
], function(index) {
	var documentListCache = undefined;
	var rejectCodesCache = undefined;
	var orderbyCache = undefined;

	var limitPag = 50;

	// ########################################################
	// ### CONTROLLER GERAL - Listagem de todos os documentos
	// ########################################################
	approvalCtrl.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'mla.mla0009.factory', 'customization.generic.Factory', 'mla.service.mlaService', 'mla.approval.ModalAdvancedSearch', 'TOTVSEvent','mla.approval.configModal', '$totvsprofile'];
	function approvalCtrl($rootScope, $scope,  appViewService, mla0009, customizationService,  mlaService, modalAdvancedSearch, TOTVSEvent, configModal, $totvsprofile) {
		var ApprovalControl = this;

        ApprovalControl.approvalDocuments = [];
		ApprovalControl.searchInputText = '';
		ApprovalControl.disclaimers = [];

        /*
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 */
		ApprovalControl.init = function(){
			ApprovalControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalControl.estabcode = $rootScope.filtersMLA.selectedEstab;

			createTab = appViewService.startView($rootScope.i18n('l-documents-approval'), 'mla.approval.Ctrl', ApprovalControl);
			previousView = appViewService.previousView;

			/* Lógica de comparação do código da empresa/estabelecimento para a navegação entre abas */
            if(ApprovalControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== ApprovalControl.companycode){
                    ApprovalControl.loadData();
                    return;
                }
            }

            if (ApprovalControl.estabcode !== undefined) {
                if($rootScope.filtersMLA.selectedEstab !== ApprovalControl.estabcode){
                    ApprovalControl.loadData();
                    return;
                }
            }

			if(	createTab === false && previousView && previousView.controller &&
	        	previousView.controller != "mla.approval.ListCtrl" &&
	        	ApprovalControl.approvalDocuments.length > 0){
	        	return;
	    	}
            /* Fim - Navegação entre abas */

			ApprovalControl.searchInputText = "";
            ApprovalControl.loadData();
			customizationService.callEvent('mla.approval', 'initEvent', ApprovalControl);
		};

		/*
		 * Objetivo: Buscar os dados do ERP
		 * Parâmetros:
		 * Observações: Este método faz a busca dos totalizadores por documento
		 */
		ApprovalControl.loadData = function(){
			var dtFim = new Date().getTime();
			var dtIni = dtFim - (30 * 24 * 60 * 60 * 1000);

			/* Atualiza código da empresa corrente */
			if ($rootScope.filtersMLA.selectedCompany !== undefined) {
				ApprovalControl.companycode = $rootScope.filtersMLA.selectedCompany;
                ApprovalControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			}

			mla0009.getTotalizadoresPorDocumentoEmpresaEstab({epCodigo:$rootScope.filtersMLA.selectedCompany,
                                                              codEstabel:$rootScope.filtersMLA.selectedEstab,
                                                              iTipo:1,
                                                              dtIni:dtIni,
                                                              dtFim:dtFim},function(result){
				ApprovalControl.approvalDocuments = result.sort(ApprovalControl.sortApprovalDocuments);
			});

            ApprovalControl.isMasterUser = $rootScope.userMLAInformation.isMasterUser;
            ApprovalControl.addDisclaimersCompany();
            ApprovalControl.addDisclaimerEstab();
		}

		/*
		 * Objetivo: Ordenar a lista de documentos pela quantidade de pendências
		 * Parâmetros: 	doc1: objeto do documento
						doc2: objeto do documento
		 * Observações:
		 */
		ApprovalControl.sortApprovalDocuments = function(doc1,doc2){
			if(parseInt(doc1['nr-doc-pend-aprov-total']) < parseInt(doc2['nr-doc-pend-aprov-total']))
				return 1;
			else
				return -1;
		}

        /*
		 * Objetivo: Adicionar disclaimer de empresa conforme a selecionada
		 * Parâmetros:
		 * Observações:
		 */
        ApprovalControl.addDisclaimersCompany = function() {
            ApprovalControl.disclaimers = mlaService.addDisclaimersCompany(ApprovalControl.disclaimers);
        }

        /*
		 * Objetivo: Adicionar disclaimer de estabelecimento conforme o selecionado
		 * Parâmetros:
		 * Observações:
		 */
        ApprovalControl.addDisclaimerEstab = function() {
            ApprovalControl.disclaimers = mlaService.addDisclaimerEstab(ApprovalControl.disclaimers);
        }

        /*
		 * Objetivo: Remover um disclaimer
		 * Parâmetros: disclaimer: Objeto de disclaimer que foi removido
		 * Observações:
		 */
        ApprovalControl.removeDisclaimer = function(disclaimer){
            /* Se o objeto removido for o estabelecimento, deve manter o "Todos" para
               estabelecimento */
			if (disclaimer.property === 'estab') {
                $rootScope.filtersMLA.selectedEstab = '';
                ApprovalControl.addDisclaimerEstab();
            } else if (disclaimer.property === 'company') {
                /* Se o objeto removido for a empresa, deve manter o "Todas" para
                   empresa */
                $rootScope.filtersMLA.selectedCompany = '';
                ApprovalControl.addDisclaimersCompany();
            }
            ApprovalControl.loadData();
		}

		/*
		 * Objetivo: Refazer a busca dos dados do ERP
		 * Parâmetros:
		 * Observações:
		 */
		ApprovalControl.search = function(){
			if(!ApprovalControl.searchInputText)
				ApprovalControl.loadData();
		}

		/*
		 * Objetivo: Abrir a modal de Configuração de Aprovações
		 * Parâmetros:
		 * Observações:
		 */
		ApprovalControl.settings = function() {
			configModal.open().then(function(result) {
				if (result != undefined && result != null) {
					$totvsprofile.remote.set('/dts/mla/approval', { dataCode: 'approveWithoutComments', dataValue: result.approveWithoutComments }, function() {});
					$rootScope.approveWithoutComments = result.approveWithoutComments;
				}
			});
		}

		/**
 		 * Objetivo: Identificar se a tela está sendo aberta em um dispositivo touch
 		 * Parâmetros: 
 		 * Observações:
 		 */
		ApprovalControl.isTouchDevice = function() {
			return 'ontouchstart' in document.documentElement;
		}

        /*
		 * Objetivo: Abre a tela de busca avançada
		 * Parâmetros:
		 * Observações:
		 */
        ApprovalControl.openAdvancedSearch = function(){
            var modalInstance = modalAdvancedSearch.open({}, function() {});
		}

		/* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
            	if (!mlaService.isPortal() &&
					$rootScope.currentcompany && 
				   (!$rootScope.oldCurrentCompany || 
				     $rootScope.currentcompany.companycode != $rootScope.oldCurrentCompany.companycode)) {
				 
				 	mlaService.getUsuarInformation({}, function(result) {},{});
			 	} else {	
                	ApprovalControl.init();
			 	}
            }
		}

        /* Objetivo: Iniciar a tela (executa o método inicial ) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
				if (!mlaService.isPortal() &&
				    $rootScope.currentcompany && 
				   (!$rootScope.oldCurrentCompany || 
				     $rootScope.currentcompany.companycode != $rootScope.oldCurrentCompany.companycode)) {
				 
				 	mlaService.getUsuarInformation({}, function(result) {},{});
			 	} else {	
                	ApprovalControl.init();
			 	}
            }
		});

        /* Evento de carregamento de dados do usuário
           (defaults de ordenação, visualização de pendências) */
		$scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});

		/* busca os dados novamente quando é feita a troca de empresa */
		$scope.$on("mla.selectCompany.event", function (event, currentcompany) {
			//Atualiza rootScope com empresa selecionada
			mlaService.afterSelectCompany(currentcompany);
			
			documentListCache = undefined;
			ApprovalControl.loadData();
            ApprovalControl.addDisclaimersCompany();
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
			ApprovalControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            ApprovalControl.init();
		});

        /* Busca de dados após cofirmação da tela de busca avançada */
		$scope.$on("mla.advancedsearch.event", function(event, advancedSearch){
			documentListCache = undefined;
			if (advancedSearch.allCompanies) {
				$rootScope.filtersMLA.selectedCompany = '';
			}
            ApprovalControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			ApprovalControl.loadData();
            ApprovalControl.addDisclaimersCompany();
            ApprovalControl.addDisclaimerEstab();
		});
	}

	// #############################################################################################
	// ### CONTROLLER LISTAGEM - Listagem dos documentos pendentes de acordo com o tipo do documento
	// #############################################################################################
	approvalListCtrl.$inject = ['$rootScope', '$stateParams', '$scope', 'totvs.app-main-view.Service', 'mla.mla0009.factory', 'mla.mlahtml9999p.factory', 'toaster', 'mla.service.mlaService','customization.generic.Factory', '$filter', 'mla.approval.ModalAdvancedSearch', 'TOTVSEvent', '$totvsprofile'];
	function approvalListCtrl($rootScope, $stateParams, $scope, appViewService, mla0009, mlahtml9999p, toaster, mlaService, customizationService, $filter, modalAdvancedSearch, TOTVSEvent, $totvsprofile) {
		var ApprovalListControl = this;

		ApprovalListControl.searchInputText = '';
		ApprovalListControl.searched = false;
		ApprovalListControl.orderbyList = {};
		ApprovalListControl.filters = {};

		/*
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 */
		ApprovalListControl.init = function() {
            ApprovalListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalListControl.estabcode = $rootScope.filtersMLA.selectedEstab;

			createTab = appViewService.startView($rootScope.i18n('l-documents-approval'), 'mla.approval.ListCtrl', ApprovalListControl);
            previousView = appViewService.previousView;
            ApprovalListControl.loadDefaults();

            /* Lógica de comparação do código da empresa/estabelecimento para a navegação entre abas */
            if(ApprovalListControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== ApprovalListControl.companycode &&
            	   ApprovalListControl.documentId === $stateParams.documentId){
                    ApprovalListControl.loadData();
                    return;
                }
            }

            if (ApprovalListControl.estabcode !== undefined) {
                if($rootScope.filtersMLA.selectedEstab !== ApprovalListControl.estabcode &&
            	   ApprovalListControl.documentId === $stateParams.documentId){
                    ApprovalListControl.loadData();
                    return;
                }
            }

            if(	createTab === false && previousView && previousView.controller &&
            	previousView.controller != "mla.approval.DetailCtrl" &&
				previousView.controller != "mla.approval.Ctrl" &&
            	ApprovalListControl.documentId === $stateParams.documentId){
            	return;
        	}
            /* Fim - Navegação entre abas */

        	ApprovalListControl.searchInputText = "";
            ApprovalListControl.documentId = $stateParams.documentId;
            ApprovalListControl.loadComplete = false;
            ApprovalListControl.customDocumentId = mlaService.getCustomDocumentId(ApprovalListControl.documentId);
            ApprovalListControl.pageLink = "approval";

            /* Procura se há arquivo html customizado na pasta custom, caso não houver carrega o template padrão */
            var nameDoc = "doc-"+ApprovalListControl.documentId + ".html";
            requirejs(['text!/dts/custom/mla/template/list/' + nameDoc], function () {
                ApprovalListControl.documentListTemplate = '/dts/custom/mla/template/list/' + nameDoc;
            }, function(err){
                ApprovalListControl.documentListTemplate = "/dts/mla/html/template/list/" + nameDoc;
            });


            /*
             * Procura se há arquivo html customizado para o título, se não achar, procura o arquivo html de
             *  acordo com o tipo do documento. Se não encontrar, carrega o template default do título
             */
            requirejs(['text!/dts/custom/mla/template/title/' + nameDoc], function () {
                ApprovalListControl.documentTitleTemplate = '/dts/custom/mla/template/title/' + nameDoc;
            }, function(err){
                requirejs(['text!/dts/mla/html/template/title/' + nameDoc], function () {
                    ApprovalListControl.documentTitleTemplate = "/dts/mla/html/template/title/" + nameDoc;
                }, function(err){
                    ApprovalListControl.documentTitleTemplate = "/dts/mla/html/template/title/default.html";
                });
            });

            ApprovalListControl.documentRequests = [];
            ApprovalListControl.selected = [];

			$totvsprofile.remote.get('/dts/mla/approval', 'approveWithoutComments', function(result) {
				if(result != undefined && result != null && result.length> 0) {
					$rootScope.approveWithoutComments = result[0].dataValue;
				}
			});

			ApprovalListControl.loadData();

			customizationService.callEvent('mla.approval', 'initEvent', ApprovalListControl);
		};
		
		/**
 		 * Objetivo: Identificar se a tela está sendo aberta em um dispositivo touch
 		 * Parâmetros: 
 		 * Observações:
 		 */
		ApprovalListControl.isTouchDevice = function() {
			return 'ontouchstart' in document.documentElement;
		}

		/*
		 * Objetivo: Carregar as informações padrões de inicialização da tela.
		 * Parâmetros:
		 * Observações: Carrega os parâmetros padrões da tela: filtro rápido, filtros, ordenação
		 * 				- A ordenação é buscada do ERP (mla0103) e armazenada na memória (quando a página é recarregada, a busca é refeita)
		 */
		ApprovalListControl.loadDefaults = function(){
            /* Se é a primeira vez que a tela é aberta utiliza "Todos" senão utiliza a última opção que
               o usuário selecionou*/
            if ($rootScope.filtersMLA.quickFilter === undefined) {
                switch($rootScope.userMLAInformation.pendenciesDefault) {
				    case 1:
				        ApprovalListControl.quickFilter = "ambos";
                        ApprovalListControl.disclaimers =  [{property: 'quickFilter', value: 'ambos',
                                                             title: $rootScope.i18n('l-all-pendencies'), fixed:true}];
				        break;
                    case 2:
                        ApprovalListControl.quickFilter = "prin";
                        ApprovalListControl.disclaimers =  [{property: 'quickFilter', value: 'prin',
                                                             title: $rootScope.i18n('l-my-pendencies'), fixed:false}];
				        break;
                    case 3:
                        ApprovalListControl.quickFilter = "mes";
                        ApprovalListControl.disclaimers =  [{property: 'quickFilter', value: 'mes',
                                                             title: $rootScope.i18n('l-master-pendencies'), fixed:false}];
				        break;
                    case 4:
                        ApprovalListControl.quickFilter = "alt";
                        ApprovalListControl.disclaimers =  [{property: 'quickFilter', value: 'alt',
                                                             title: $rootScope.i18n('l-alternalte-pendencies'),fixed:false}];
				        break;
                    default:
                        ApprovalListControl.quickFilter = "ambos";
                        ApprovalListControl.disclaimers =  [{property: 'quickFilter', value: 'ambos',
                                                             title: $rootScope.i18n('l-all-pendencies'), fixed:true}];
				        break;
				}
                $rootScope.filtersMLA.quickFilter = ApprovalListControl.quickFilter;
            } else {
                ApprovalListControl.quickFilter = $rootScope.filtersMLA.quickFilter;
            }

            ApprovalListControl.addDisclaimersCompany();
            ApprovalListControl.addDisclaimerEstab();
			ApprovalListControl.filters =  [{title:$rootScope.i18n('l-my-pendencies'),disclaimers:"prin"},
			                                {title:$rootScope.i18n('l-master-pendencies'),disclaimers:"mes"},
											{title:$rootScope.i18n('l-alternalte-pendencies'),disclaimers:"alt"},
											{title:$rootScope.i18n('l-all-pendencies'),disclaimers:"ambos", fixed:true}];
			ApprovalListControl.orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false, default:true},
												{title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:false},
												{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:false}];

            /* Se não for mestre - Remove filtro da tela */
            if (ApprovalListControl.filters.length == 4 &&
                !$rootScope.userMLAInformation.isMasterUser) {
                ApprovalListControl.filters.splice(1, 1);
            }

			if($rootScope.filtersMLA.sort === undefined ||
               $rootScope.filtersMLA.sort == ""){

                ApprovalListControl.orderbyList = mlaService.attOrderbyList($rootScope.userMLAInformation.sortDefaultUser);
				if($rootScope.filtersMLA === undefined)
					$rootScope.filtersMLA = [];
                $rootScope.filtersMLA.sort        = $rootScope.userMLAInformation.sortDefaultUser;

			}else{
				ApprovalListControl.orderbyList = mlaService.attOrderbyList($rootScope.filtersMLA.sort);
			}
		};


		/*
		 * Objetivo: Aplicar o filtro rápido na busca dos documentos.
		 * Parâmetros: filter: recebe o objeto de filtro selecionado
		 * Observações: Existem três filtros rápidos disponíveis: Minhas pendências, Pendências alternativas e Todas pendências
		 */
		ApprovalListControl.selectFilter = function(filter){
			ApprovalListControl.setQuickFilter(filter.disclaimers);
			ApprovalListControl.disclaimers = [{property: 'quickFilter', value: filter.disclaimers, title: filter.title, fixed:filter.fixed}];
            ApprovalListControl.addDisclaimersCompany();
            ApprovalListControl.addDisclaimerEstab();
		}

        /*
		 * Objetivo: Adicionar disclaimer de empresa conforme a selecionada
		 * Parâmetros:
		 * Observações:
		 */
        ApprovalListControl.addDisclaimersCompany = function() {
            ApprovalListControl.disclaimers = mlaService.addDisclaimersCompany(ApprovalListControl.disclaimers);
        }

        /*
		 * Objetivo: Adicionar disclaimer de estabelecimento conforme o selecionado
		 * Parâmetros:
		 * Observações:
		 */
        ApprovalListControl.addDisclaimerEstab = function() {
            ApprovalListControl.disclaimers = mlaService.addDisclaimerEstab(ApprovalListControl.disclaimers);
        }

		/*
		 * Objetivo: Remover um filtro aplicado na consulta
		 * Parâmetros: disclaimer: objeto do filtro a ser removido
		 * Observações: Nesta tela, o filtro padrão é o "Todas pendências" (valor: "ambos")
		 */
		ApprovalListControl.removeDisclaimer = function(disclaimer){
            if (disclaimer.property === 'estab') {
                $rootScope.filtersMLA.selectedEstab = '';
                ApprovalListControl.addDisclaimerEstab();
                ApprovalListControl.loadData();
            } else if (disclaimer.property === 'company') {
                $rootScope.filtersMLA.selectedCompany = '';
                ApprovalListControl.addDisclaimersCompany();
                ApprovalListControl.loadData();
            } else {
                ApprovalListControl.setQuickFilter("ambos");
                ApprovalListControl.disclaimers =  [{property: 'quickFilter', value: 'ambos', title: $rootScope.i18n('l-all-pendencies'), fixed:true}];
                ApprovalListControl.addDisclaimersCompany();
                ApprovalListControl.addDisclaimerEstab();
            }
		}

		/*
		 * Objetivo: alterar a ordenação dos resultados
		 * Parâmetros: orderby: objeto que contém a ordenação selecionada pelo usuário em tela
		 * Observações: - orderby.property - nome do campo que será usado na ordenação
						- orderby.asc - indica se a ordenação é crescente (asc = true), ou decrescente (asc = false)
		 */
		ApprovalListControl.selectOrderBy = function(orderby){
            mlaService.selectOrderBy(orderby);

			orderbyCache = $rootScope.filtersMLA.sort;
			ApprovalListControl.sortList();
            ApprovalListControl.orderbyList = mlaService.attOrderbyList($rootScope.filtersMLA.sort);
		}

		/*
		 * Objetivo: buscar as informações no ERP
		 * Parâmetros:
		 * Observações: - getDocumentosDoUsuario - Busca o nome dos documentos
		 */
		ApprovalListControl.loadData = function(){
			/* Atualiza código da empresa corrente  */
			if ($rootScope.filtersMLA.selectedCompany !== undefined) {
				ApprovalListControl.companycode = $rootScope.filtersMLA.selectedCompany;
                ApprovalListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			}

			if(documentListCache){
				ApprovalListControl.documentName = documentListCache[ApprovalListControl.documentId];
				if(documentListCache[ApprovalListControl.documentId] === undefined){
					ApprovalListControl.notFound = true;
					//Documento X não encontrado na empresa Y.
					toaster.pop('warning', $rootScope.i18n('l-change-company'), $rootScope.i18n('l-document') + " " + 
								    ApprovalListControl.documentId + " " + $rootScope.i18n('l-not-found-at-company') + " " + ApprovalListControl.companycode);
					location.href ="#/dts/mla/approval";
				}else{
					ApprovalListControl.loadDocuments();
					ApprovalListControl.notFound = false;
				}
			}else{
				mla0009.getDocumentosDoUsuario({epCodigo:$rootScope.filtersMLA.selectedCompany}, function(result){
					documentListCache = [];
					for(var i = 0; i < result.length; i++){
						documentListCache[result[i]["cod-tip-doc"]] = result[i]["desc-tip-doc"];
					}
					ApprovalListControl.documentName = documentListCache[ApprovalListControl.documentId];
					if(documentListCache[ApprovalListControl.documentId] === undefined){
						ApprovalListControl.notFound = true;
						//Documento X não encontrado na empresa Y.  
						toaster.pop('warning', $rootScope.i18n('l-change-company'), $rootScope.i18n('l-document') + " " + 
								    ApprovalListControl.documentId + " " + $rootScope.i18n('l-not-found-at-company') + " " + ApprovalListControl.companycode);
						location.href ="#/dts/mla/approval"; 
					}else{
						ApprovalListControl.loadDocuments();
						ApprovalListControl.notFound = false;
					}
				},{});
			}
		};

		/*
		 * Objetivo: ordenar a lista de documentos retornados pelo método listagemDocumentos
		 * Parâmetros: 	Entrada: 	a: documento a
		 							b: documento b
		 * Observações:
		 */
		ApprovalListControl.sortTT = function(a,b){
            if (parseInt(a["iRow"]) < parseInt(b["iRow"]))
                return -1;
            else
                return 1;
        }

        /*
		 * Objetivo: buscar os documentos no ERP
		 * Parâmetros:
		 * Observações: - listagemDocumentos - busca as pendências de acordo com o tipo de documento selecionado
		 */
		ApprovalListControl.loadDocuments = function(){
			var codPrograma = "";
			/* monta o nome do programa de acordo com o tipo do documento */
			if(String(ApprovalListControl.documentId).length < 3 && String(ApprovalListControl.documentId).length >= 1){
				switch(String(ApprovalListControl.documentId).length){
					case 1: codPrograma = "00" + String(ApprovalListControl.documentId);
							break;
					case 2: codPrograma = "0" + String(ApprovalListControl.documentId);
							break;
				}
				codPrograma = 'mlahtml' + codPrograma + 'p';
			}else{
				codPrograma = 'mlahtml' + String(ApprovalListControl.documentId) + 'p';
			}

			var dtFim = new Date().getTime();
			var dtIni = dtFim - (30 * 24 * 60 * 60 * 1000);
			mlahtml9999p.listagemDocumentosEmpresaEstab({cEpCodigo:$rootScope.filtersMLA.selectedCompany,
                                                         cCodEstabel:$rootScope.filtersMLA.selectedEstab,
                                                         programcode:codPrograma,
                                                         iCodTipDoc:ApprovalListControl.documentId,
                                                         tipoEntrSai:ApprovalListControl.quickFilter,
                                                         dtIni:dtIni,
                                                         dtFim:dtFim}, function(result){
				var lista = [];
				var c = -1;
				var rowant = 0;
				result.sort(ApprovalListControl.sortTT);

				for (var i = 0; i < result.length; i++) {
					if (rowant != result[i].iRow) {
						rowant = result[i].iRow;
						c++;
						lista[c] = new Object();
					}
					lista[c][result[i].cField] = result[i].cValue;
				}

				ApprovalListControl.allDocuments = lista;
				ApprovalListControl.documentRequestsCount = lista.length;
				ApprovalListControl.originalList = lista.slice(limitPag);
				ApprovalListControl.documentRequests = lista.slice(0,limitPag);
				ApprovalListControl.loadComplete = true;
				ApprovalListControl.selectOrderBy($rootScope.filtersMLA.sort);
				if(ApprovalListControl.searchInputText !== undefined && ApprovalListControl.searchInputText != "")
					ApprovalListControl.search();

			});
		}

		/*
		 * Objetivo: Refazer a busca dos dados do ERP
		 * Parâmetros:
		 * Observações:
		 */
		ApprovalListControl.search = function(){
			//console.info("testeFiltro")	;
        	ApprovalListControl.searched = true;
        	ApprovalListControl.documentRequests = $filter('filter')(ApprovalListControl.allDocuments, { $:ApprovalListControl.searchInputText });
			if(ApprovalListControl.searchInputText == undefined || ApprovalListControl.searchInputText == ""){
				ApprovalListControl.cleanSearch();
			}
		}

		ApprovalListControl.cleanSearch = function(){
			ApprovalListControl.searched = false;
			ApprovalListControl.loadData();
		}

		/*
		 * Objetivo: paginação dos resultados
		 * Parâmetros:
		 * Observações: Este método não está fazendo a páginação dos registros através de consultas ao ERP.
		 				Está apenas fazendo a paginação 'visual' na tela
		 */
		ApprovalListControl.loadMore = function(){
			ApprovalListControl.documentRequests = ApprovalListControl.documentRequests.concat(ApprovalListControl.originalList.slice(0,limitPag));
			ApprovalListControl.originalList = ApprovalListControl.originalList.slice(limitPag);
		}

		/*
		 * Objetivo: efetuar a aprovação de uma ou mais pendências
		 * Parâmetros: nrTrans: número da pendência que foi clicada
		 * Observações: Neste método é feita a leitura de toda lista de documentos para ver quais pendências foram selecionadas
		 */
		ApprovalListControl.approve = function(nrTrans){
			var list = [];
			if(!nrTrans || !$rootScope.userMLAInformation.isApprovUniquePendency){
				for(i = 0; i < ApprovalListControl.documentRequests.length; i++){
					if(ApprovalListControl.documentRequests[i].$selected)
						list[ApprovalListControl.documentRequests[i]["nr-trans"]] = true;
				}
			}
			if(list.length > 0 || nrTrans)
				mlaService.approve(nrTrans,list);
			else
				toaster.pop('error','',$rootScope.i18n('l-invalid-selection-help'));
		};

		/*
		 * Objetivo: efetuar a rejeição de uma ou mais pendências
		 * Parâmetros: nrTrans: número da pendência que foi clicada
		 * Observações: Neste método é feita a leitura de toda lista de documentos para ver quais pendências foram selecionadas
		 */
		ApprovalListControl.reject = function(nrTrans){
			var list = [];
			if(!nrTrans || !$rootScope.userMLAInformation.isApprovUniquePendency){
				for(i = 0; i < ApprovalListControl.documentRequests.length; i++){
					if(ApprovalListControl.documentRequests[i].$selected)
						list[ApprovalListControl.documentRequests[i]["nr-trans"]] = true;
				}
			}
			if(list.length > 0 || nrTrans)
				mlaService.reject(nrTrans,list);
			else
				toaster.pop('error','',$rootScope.i18n('l-invalid-selection-help'));
		};

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
		ApprovalListControl.compareToSort = function(a,b){
			return mlaService.compareToSort(a,b);
		}


		/*
		 * Objetivo: ordenar a lista de documentos pendentes
		 * Parâmetros:
		 * Observações:
		 */
		ApprovalListControl.sortList = function(){
			if(ApprovalListControl.searchInputText === undefined){
				ApprovalListControl.allDocuments.sort(ApprovalListControl.compareToSort);
				allDocuments = ApprovalListControl.allDocuments.slice(0);

				numDocumentosMostrados = ApprovalListControl.documentRequests.length;
				numDocumentosEscondidos = ApprovalListControl.originalList.length;

				ApprovalListControl.documentRequests = allDocuments.splice(0,numDocumentosMostrados);
				ApprovalListControl.originalList = allDocuments;

				ApprovalListControl.documentRequests = mlaService.separateDocuments(ApprovalListControl.documentRequests);
			}else{
				ApprovalListControl.documentRequests.sort(ApprovalListControl.compareToSort);
			}
		}

		/*
		 * Objetivo: aplicar o filtro rápido
		 * Parâmetros: value: valor do filtro rápido que será aplicado
		 * Observações: Quando um filtro rápido é aplicado, a busca no ERP é refeita com base no filtro informado.
		 				Antes de efetuar a busca, os registros que estavam marcados são desmarcados
		 */
		ApprovalListControl.setQuickFilter = function(value){
			ApprovalListControl.quickFilter = value;
            $rootScope.filtersMLA.quickFilter = value;
			numSelected = 0;

			/* limpar selecionados */
			for (var i = 0; i < ApprovalListControl.documentRequests.length; i++) {
				/* desmarca as 'minhas pendencias' e 'mestre' quando o filtro 'pendencias alternativas' for selecionado*/
				if(ApprovalListControl.quickFilter == "alt" &&
                   ApprovalListControl.documentRequests[i]['alternativo'].trim() == "no"){
					if(ApprovalListControl.selected[ApprovalListControl.documentRequests[i]['nr-trans']])
						ApprovalListControl.selected[ApprovalListControl.documentRequests[i]['nr-trans']] = false;
				}

				/*desmarca as 'pendencias alternativas' e 'mestre' quando o filtro 'minhas pendencias' for selecionado*/
				if(ApprovalListControl.quickFilter == "prin" &&
                   (ApprovalListControl.documentRequests[i]['alternativo'].trim() == "yes" ||
                    ApprovalListControl.documentRequests[i]['mestre'].trim() == "yes")){
					if(ApprovalListControl.selected[ApprovalListControl.documentRequests[i]['nr-trans']])
						ApprovalListControl.selected[ApprovalListControl.documentRequests[i]['nr-trans']] = false;
				}

                /*desmarca as 'pendencias alternativas' e 'minhas pendências' quando o filtro 'mestre' for selecionado*/
				if(ApprovalListControl.quickFilter == "mes" &&
                   ApprovalListControl.documentRequests[i]['mestre'].trim() == "no"){
					if(ApprovalListControl.selected[ApprovalListControl.documentRequests[i]['nr-trans']])
						ApprovalListControl.selected[ApprovalListControl.documentRequests[i]['nr-trans']] = false;
				}

				if(ApprovalListControl.selected[ApprovalListControl.documentRequests[i]['nr-trans']])
					numSelected++;
			}
			ApprovalListControl.loadData();
		}

		/*
		 * Objetivo: retornar se o campo lógico é verdadeiro ou falso
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna true/false
		 */
		ApprovalListControl.checkLog = function(value){
			return mlaService.checkLog(value);
		}

		/*
		 * Objetivo: retornar se o campo lógico é 'Sim' ou 'Não' (já traduzido)
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna 'Sim' / 'Não'
		 */
		ApprovalListControl.checkLogValue = function(value){
			return mlaService.checkLogValue(value);
		}

		/*
		 * Objetivo: Abre a modal de busca avançada
		 * Parâmetros:
		 * Observações:
		 */
		ApprovalListControl.openAdvancedSearch = function(){
            var modalInstance = modalAdvancedSearch.open({disclaimers: ApprovalListControl.disclaimers});

		}

        /*
		 * Objetivo: Indica se o aprovador deve ou não ser apresentado nas pendências
		 * Parâmetros: usuar: Usuário da pendência verificada
		 * Observações: O aprovador deverá ser apresentado quando for diferente do usuário logado
		 */
        ApprovalListControl.showApprover = function(usuar) {
            if (String($rootScope.userMLAInformation.codUsuar).toUpperCase().trim() === String(usuar).toUpperCase().trim()) {
                return false;
            } else {
                return true;
            }
        }

		 /*
 		 * Objetivo: Contar a quantidade de pendências selecionadas
 		 * Parâmetros:
 		 * Observações: Quando selecionada alguma pendência esta função é chamada pelo digest cycle do angular atualizando os valores das varíaeveis.
 		 */
		ApprovalListControl.countSelected = function() {

			if (ApprovalListControl.documentRequests !== undefined) {
				ApprovalListControl.totalSelected = 0;
				ApprovalListControl.totalValueSelected = 0;

				for(i = 0; i < ApprovalListControl.documentRequests.length; i++){
					if (ApprovalListControl.documentRequests[i].$selected) {
						ApprovalListControl.totalSelected = ApprovalListControl.totalSelected + 1;

						ApprovalListControl.totalValueSelected = ApprovalListControl.totalValueSelected +
																 mlaService.stringToNumber(ApprovalListControl.documentRequests[i]["mla-doc-pend-aprov-valor-doc"]);
					}
				}

				return ApprovalListControl.totalSelected;
			}
		};

		/*
		* Objetivo: Retornar a soma dos valores das pendências selecionadas
		* Parâmetros:
		* Observações:
		*/
		ApprovalListControl.valueSelected = function() {
			return ApprovalListControl.totalValueSelected;
		};

        /*
		 * Objetivo: Indica se a empresa deve ser apresentada nas pendências
		 * Parâmetros:
		 * Observações: Será apresentada somente quando estiver seleciona a opção de "Todas" empresas
		 */
        ApprovalListControl.showCompany = function() {
            return mlaService.showCompany();
        }

		/* Objetivo: Iniciar a tela (executa o método inicial - MENU HTML) */
		if($rootScope.currentuserLoaded){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                ApprovalListControl.init();
            }
		}

        /* Objetivo: Iniciar a tela (executa o método inicial - PORTAL) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                ApprovalListControl.init();
            }
		});

        /* Evento de carregamento de dados do usuário
           (defaults de ordenação, visualização de pendências) */
		$scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});

		/* busca os dados novamente quando é feita a troca de empresa */
		$scope.$on("mla.selectCompany.event", function (event, currentcompany) {
			//Atualiza rootScope com empresa selecionada
			mlaService.afterSelectCompany(currentcompany);

			documentListCache = undefined;
			ApprovalListControl.loadData();
            ApprovalListControl.addDisclaimersCompany();
		});

		/* Evento de sucesso na aprovação */
		$scope.$on("mla.approval.event", function (event, objs) {
			toaster.pop('success', $rootScope.i18n('l-documents-approval'),$rootScope.i18n('l-approval-done'));
			ApprovalListControl.loadData();
		});

		/* Evento de sucesso na reprovação */
		$scope.$on("mla.approval.rejectevent", function (event, objs) {
			toaster.pop('info', $rootScope.i18n('l-documents-approval'), $rootScope.i18n('l-reproval-done'));
			ApprovalListControl.loadData();
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
			ApprovalListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            ApprovalListControl.init();
		});

        /* Busca de dados após cofirmação da tela de busca avançada */
        $scope.$on("mla.advancedsearch.event", function(event, advancedSearch){
			documentListCache = undefined;
			if (advancedSearch.allCompanies) {
				$rootScope.filtersMLA.selectedCompany = '';
			}
            ApprovalListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			ApprovalListControl.loadData();
            ApprovalListControl.addDisclaimersCompany();
            ApprovalListControl.addDisclaimerEstab();
		});
	}


	// ########################################################
	// ### CONTROLLER DETALHE
	// ########################################################
	approvalDetailCtrl.$inject = ['$rootScope', '$stateParams', '$scope', 'totvs.app-main-view.Service', 'mla.mla0009.factory', 'mla.mlahtml9999p.factory', 'mla.mlahtml010p.factory', 'toaster', 'mla.service.ttService', 'mla.service.mlaService','customization.generic.Factory', '$injector', '$timeout', '$modal', '$state', 'TOTVSEvent'];
	function approvalDetailCtrl($rootScope, $stateParams, $scope, appViewService, mla0009, mlahtml9999p,mlahtml010p, toaster, ttService, mlaService, customizationService, $injector, $timeout, $modal, $state, TOTVSEvent) {
		var ApprovalDetailControl = this;

		ApprovalDetailControl.searchInputText = '';

		/*
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 */
		ApprovalDetailControl.init = function(){
			// Se a tela chamadora for a listaem não deve inicializar o controller
			if($state.is('dts/mla/approval.list')) return;

            ApprovalDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;

			createTab = appViewService.startView($rootScope.i18n('l-documents-approval'), 'mla.approval.DetailCtrl', ApprovalDetailControl);
			previousView = appViewService.previousView;

			/* Lógica de comparação do código da empresa/estabelecimento para a navegação entre abas */
            if(ApprovalDetailControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== ApprovalDetailControl.companycode){
					ApprovalDetailControl.loadComplete = false;
					ApprovalDetailControl.requestId    = $stateParams.requestId;
					ApprovalDetailControl.documentId   = $stateParams.documentId;					
                    ApprovalDetailControl.loadData();
                    return;
                }
            }

			if(	createTab === false &&
	        	ApprovalDetailControl.documentId === $stateParams.documentId &&
	        	ApprovalDetailControl.requestId === $stateParams.requestId){

                //quando for navegação entre abas, declara novamente o array showDetail para fechar todos os detalhes.
                ApprovalDetailControl.showDetail = [];
	        	return;
	    	}

            /* Fim - Navegação entre abas */
			beforeLoadData();
			customizationService.callEvent('dts.mla.approval', 'initEvent', ApprovalDetailControl);
		};

		/**
 		 * Objetivo: Identificar se a tela está sendo aberta em um dispositivo touch
 		 * Parâmetros: 
 		 * Observações:
 		 */
		ApprovalDetailControl.isTouchDevice = function() {
			return 'ontouchstart' in document.documentElement;
		}

		 /**
 		 * Objetivo: Buscar os detalhes de um documento e exibi-los na listagem
 		 * Parâmetros: @param  {int} nrTrans Número da transação
 		 * Observações:
 		 */
		ApprovalDetailControl.detail = function(nrTrans) {
			$stateParams.requestId = nrTrans;
			if($stateParams.requestId === ApprovalDetailControl.requestId && $stateParams.documentId === ApprovalDetailControl.documentId) {
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
			ApprovalDetailControl.loadComplete = false;
			ApprovalDetailControl.documentId = $stateParams.documentId;
			ApprovalDetailControl.requestId = $stateParams.requestId;

			/* Procura se há arquivo html customizado na pasta custom, se não houver carrega o template padrão */
			var nameDoc = "doc-"+ApprovalDetailControl.documentId + ".html";
			requirejs(['text!/dts/custom/mla/template/detail/' + nameDoc], function () {
				ApprovalDetailControl.documentDetailTemplate = '/dts/custom/mla/template/detail/' + nameDoc;

			}, function(err) {
				ApprovalDetailControl.documentDetailTemplate = "/dts/mla/html/template/detail/" + nameDoc;
			});
			ApprovalDetailControl.loadData();
		}

		/*
		 * Objetivo: Carregar os dados do ERP
		 * Parâmetros:
		 * Observações: Este método busca no ERP os dados do detalhe do documento e o histórico de aprovações do mesmo.
		 */
		ApprovalDetailControl.loadData = function(){
			/* Atualiza código da empresa corrente */
			if ($rootScope.filtersMLA.selectedCompany !== undefined) {
				ApprovalDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
                ApprovalDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			}

			if(documentListCache){
				ApprovalDetailControl.documentName = documentListCache[ApprovalDetailControl.documentId];
			}else{
				mla0009.getDocumentosDoUsuario({epCodigo:$rootScope.filtersMLA.selectedCompany}, function(result){
					documentListCache = [];
					for(var i = 0; i < result.length; i++){
						documentListCache[result[i]["cod-tip-doc"]] = result[i]["desc-tip-doc"];
					}
					ApprovalDetailControl.documentName = documentListCache[ApprovalDetailControl.documentId];
				},{});
			}

			/* monta o nome do programa de acordo com o tipo do documento */
			if(String(ApprovalDetailControl.documentId).length < 3 && String(ApprovalDetailControl.documentId).length >= 1){
				switch(String(ApprovalDetailControl.documentId).length){
					case 1: codPrograma = "00" + String(ApprovalDetailControl.documentId);
							break;
					case 2: codPrograma = "0" + String(ApprovalDetailControl.documentId);
							break;
				}
				codPrograma = 'mlahtml' + codPrograma + 'p';
			}else{
				codPrograma = 'mlahtml' + String(ApprovalDetailControl.documentId) + 'p';
			}

			mlahtml9999p.detalheDocumento({programcode:codPrograma, nrTransacao:ApprovalDetailControl.requestId}, function(result){
				pSituacao = result["p-situacao"];
				ApprovalDetailControl.request = [];
				ApprovalDetailControl.request = ttService.transformTT(result["ttDados"]);
				ApprovalDetailControl.documentRequestsCount = result["ttDados"].length;

                if(ApprovalDetailControl.documentId == 10){
                    var ttMapaComparativo = [];
                    ApprovalDetailControl.showDetail = [];
                    for(var i=0;i<ApprovalDetailControl.request['tt-ordem-proc'].length;i++){
						ApprovalDetailControl.showDetail[ApprovalDetailControl.request['tt-ordem-proc'][i]["numero-ordem"]] = false;
						
						ttMapaComparativo[ApprovalDetailControl.request['tt-ordem-proc'][i]["numero-ordem"]] = [];
					}
					
					for(var i=0;i<ApprovalDetailControl.request['tt-mapa-comparativo'].length; i++){
						ApprovalDetailControl.request['tt-mapa-comparativo'][i]['aprovada-log'] = ApprovalDetailControl.checkLog(ApprovalDetailControl.request['tt-mapa-comparativo'][i]['aprovada']);

						ApprovalDetailControl.request['tt-mapa-comparativo'][i]['ult-compra-log'] = ApprovalDetailControl.checkLog(ApprovalDetailControl.request['tt-mapa-comparativo'][i]['ult-compra']);	
						
						ttMapaComparativo[ApprovalDetailControl.request['tt-mapa-comparativo'][i]['numero-ordem-orig']].push(ApprovalDetailControl.request['tt-mapa-comparativo'][i]);
					}
					ApprovalDetailControl.ttMapaComparativo = ttMapaComparativo;
				}

				if(ApprovalDetailControl.documentId == 5 || ApprovalDetailControl.documentId == 9){
					var ttMapaComparativo = [];
					for(var i=0;i<ApprovalDetailControl.request['tt-cotacao'].length;i++){
						ttMapaComparativo[ApprovalDetailControl.request['tt-cotacao'][i]["numero-ordem"]] = [];
					}

					for(var i=0;i<ApprovalDetailControl.request['tt-mapa-comparativo'].length; i++){
						ApprovalDetailControl.request['tt-mapa-comparativo'][i]['aprovada-log'] = ApprovalDetailControl.checkLog(ApprovalDetailControl.request['tt-mapa-comparativo'][i]['aprovada']);
						ApprovalDetailControl.request['tt-mapa-comparativo'][i]['ult-compra-log'] = ApprovalDetailControl.checkLog(ApprovalDetailControl.request['tt-mapa-comparativo'][i]['ult-compra']);	
						
						ttMapaComparativo[ApprovalDetailControl.request['tt-mapa-comparativo'][i]['numero-ordem-orig']].push(ApprovalDetailControl.request['tt-mapa-comparativo'][i]);
					}
					ApprovalDetailControl.ttMapaComparativo = ttMapaComparativo;
				}

				if (ApprovalDetailControl.documentId == 6 || ApprovalDetailControl.documentId == 7 ||
				    ApprovalDetailControl.documentId == 8 || ApprovalDetailControl.documentId == 19) {			   
					ApprovalDetailControl.showDetail = [];
					for(var i=0;i<ApprovalDetailControl.request['tt-ordem-compra'].length;i++){
						ApprovalDetailControl.showDetail[ApprovalDetailControl.request['tt-ordem-compra'][i]["numero-ordem"]] = false;
					}
				}else if (ApprovalDetailControl.documentId == 13){
                    /*Lê a matriz de rateio cadastrada nos itens e atribui ao campo matriz no 
                    item correspondente*/
                    for(var i=0;i<ApprovalDetailControl.request['tt-item-contrat'].length;i++){
                        ApprovalDetailControl.request['tt-item-contrat'][i]["matriz"] = [];
                        if(ApprovalDetailControl.request['tt-matriz-item']){
                            for(var j=0;j<ApprovalDetailControl.request['tt-matriz-item'].length;j++){
                                if(ApprovalDetailControl.request['tt-matriz-item'][j]["num-seq-item"] == 
                                   ApprovalDetailControl.request['tt-item-contrat'][i]["num-seq-item"]){
                                    ApprovalDetailControl.request['tt-item-contrat'][i]["matriz"].push(ApprovalDetailControl.request['tt-matriz-item'][j]);
                                }
                            }
                            if(ApprovalDetailControl.request['tt-item-contrat'][i]["matriz"].length == 0){
                                ApprovalDetailControl.request['tt-item-contrat'][i]["matriz"] = undefined;
                            }
                        }else{
                            ApprovalDetailControl.request['tt-item-contrat'][i]["matriz"] = undefined;
                        }
                    }
                }

				ApprovalDetailControl.loadComplete = true;
                customizationService.callCustomEvent('afterLoad', ApprovalDetailControl);
			});

			ApprovalDetailControl.approvalLog = [];
			mla0009.getHistoricoAprovacoes({nrTransacao:ApprovalDetailControl.requestId},function(result){
				ApprovalDetailControl.approvalLog = result;
			});
		}

		/*
         * Objetivo: Controle dos itens que estão sendo exibidos os detalhes ou não
         * Parâmetros: Número da ordem de compra
         * Observações: Realizado esse controle para melhora de performance, quando há muitas informações
                        há uma demora para apresentar os dados em tela, dessa maneira será apresentado 
                        apenas os registros que o usuário deseja ver o "detalhe"
         */
        ApprovalDetailControl.viewDetail = function(oc){
			
			if(ApprovalDetailControl.documentId == 10){
				if (ApprovalDetailControl.ttMapaComparativo[oc].length > 0) {
					ApprovalDetailControl.showDetail[oc] = !ApprovalDetailControl.showDetail[oc];
				}
				else{
					mlahtml010p.getComparativeMaps({iNumOrdem:oc}, function(result){					
						var mapAux = ttService.transformTT(result["ttDados"]);
						var ttMapaComparativoAux = mapAux['tt-mapa-comparativo'];					

						for(var i=0;i<ttMapaComparativoAux.length; i++){
							ttMapaComparativoAux[i]['aprovada-log'] = ApprovalDetailControl.checkLog(ttMapaComparativoAux[i]['aprovada']);
						
							ttMapaComparativoAux[i]['ult-compra-log'] = ApprovalDetailControl.checkLog(ttMapaComparativoAux[i]['ult-compra']);	
							
							ApprovalDetailControl.ttMapaComparativo[oc].push(ttMapaComparativoAux[i]);
						}
						
						ApprovalDetailControl.showDetail[oc] = !ApprovalDetailControl.showDetail[oc];
					});				
				}
			}
			else{
				ApprovalDetailControl.showDetail[oc] = !ApprovalDetailControl.showDetail[oc];
			}             
        }

		/*
		 * Objetivo: retornar se o campo lógico é verdadeiro ou falso
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna true/false
		 */
		ApprovalDetailControl.checkLog = function(value){
			return mlaService.checkLog(value);
		}

		/*
		 * Objetivo: retornar se o campo lógico é 'Sim' ou 'Não' (já traduzido)
		 * Parâmetros: value: valor do campo lógico
		 * Observações: retorna 'Sim' / 'Não'
		 */
		ApprovalDetailControl.checkLogValue = function(value){
			return mlaService.checkLogValue(value);
		}

		/*
		 * Objetivo: efetuar a aprovação de uma ou mais pendências
		 * Parâmetros: nrTrans: número da pendência que foi clicada
		 * Observações: Neste método é feita a leitura de toda lista de documentos para ver quais pendências foram selecionadas
		 */
		ApprovalDetailControl.approve = function(nrTrans,list){
			mlaService.approve(nrTrans,list);
		};

		/*
		 * Objetivo: efetuar a rejeição de uma ou mais pendências
		 * Parâmetros: nrTrans: número da pendência que foi clicada
		 * Observações: Neste método é feita a leitura de toda lista de documentos para ver quais pendências foram selecionadas
		 */
		ApprovalDetailControl.reject = function(nrTrans,list){
			mlaService.reject(nrTrans,list);
		}

		/* Objetivo: retornar para a tela de listagem do documento
		 * Parâmetros:
		 * Observações:
		 */
		ApprovalDetailControl.goBack = function(){
			location.href = "#/dts/mla/approval/list/" + ApprovalDetailControl.documentId;
		}

		/*
		 * Objetivo: Abrir a tela modal de detalhe da pendência
		 * Parâmetros: nrTrans: número da transação da pendência
		 * Observações:
		 */
		ApprovalDetailControl.openDetailPending = function(nrTrans){
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
		ApprovalDetailControl.showDetail = function(div_detalhe){
		    $('#'+div_detalhe).slideToggle("fast");
		}
		
		/* Objetivo: Iniciar a tela (executa o método inicial - MENU HTML) */
		if($rootScope.currentuserLoaded){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                ApprovalDetailControl.init();
            }
		}

        /* Objetivo: Iniciar a tela (executa o método inicial - PORTAL) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                ApprovalDetailControl.init();
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
			if($state.is('dts/mla/approval.list')) return;
            location.href ="#/dts/mla/approval/list/" + ApprovalDetailControl.documentId;
		});

		/* Evento de sucesso na aprovação */
		$scope.$on("mla.approval.event", function (event, objs) {
			// Se a tela atual for a listagem não exibe estas mensagens pois este watcher já existe no controller de listagem (serve para evitar mensagens repetidas)
			if($state.is('dts/mla/approval.list')) return;
			toaster.pop('success', $rootScope.i18n('l-documents-approval'),$rootScope.i18n('l-approval-done'));
			location.href ="#/dts/mla/approval/list/" + ApprovalDetailControl.documentId;
		});

		/* Evento de sucesso na reprovação */
		$scope.$on("mla.approval.rejectevent", function (event, objs) {
			// Se a tela atual for a listagem não exibe estas mensagens pois este watcher já existe no controller de listagem (serve para evitar mensagens repetidas)
			if($state.is('dts/mla/approval.list')) return;
			toaster.pop('info', $rootScope.i18n('l-documents-approval'), $rootScope.i18n('l-reproval-done'));
			location.href ="#/dts/mla/approval/list/" + ApprovalDetailControl.documentId;
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
			ApprovalDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
            ApprovalDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            ApprovalDetailControl.init();
		});

        /* Evento de carregamento de dados do usuário
           (defaults de ordenação, visualização de pendências) */
        $scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});

		/* CHAMADA DA CUSTOMIZAÇÃO */
		/* Evento de load na div que inclui o template (ng-include) */
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
			customizationService.callEvent('mla.approval', customFunctionName, ApprovalDetailControl, customObject);
		});
	}

	// ########################################################
	// ### CONTROLLER MODAL Aprovação/Reprovação
	// ########################################################
	approvalModalCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', 'mla.mla0007.factory', 'modalReject', 'totvs.utils.Service', 'TOTVSEvent'];
	function approvalModalCtrl($scope, $rootScope, $modalInstance, mla0007, modalReject, totvsUtilsService, TOTVSEvent) {
		var ApprovalModalControl = this;

		/*
		 * Objetivo: Executar os métodos iniciais da modal
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a modal é aberta.
		 */
		ApprovalModalControl.init = function(){
			if(modalReject){
				if(!rejectCodesCache){
		  			mla0007.getCodRejeita({},function(result){
				  		rejectCodesCache = result;
				  		ApprovalModalControl.rejectCodes = rejectCodesCache;
				  	});
		  		}else{
		  			ApprovalModalControl.rejectCodes = rejectCodesCache;
		  		}

				setTimeout(function () {
					totvsUtilsService.focusOn('rejectCode');
				}, 200);
		  	}else{
				setTimeout(function () {
					totvsUtilsService.focusOn('approvalText');
				}, 200);
		  	}
		}

		/*
		 * Objetivo: Retorna se o campo de descrição é obrigatório ou não de acordo com a Rejeição escolhida.
		 * Parâmetros:
		 * Observações: Este método é executado apenas na rejeição
		 */
		ApprovalModalControl.isRequired = function () {
			if(modalReject && ApprovalModalControl.rejectCodes){
				for (var i = 0; i < ApprovalModalControl.rejectCodes.length; i++) {
					if (ApprovalModalControl.rejectCode == ApprovalModalControl.rejectCodes[i]['iCodRejeita']) {
						return ApprovalModalControl.rejectCodes[i]['obriga-narrativa'];
					}
				}
			}
			return true;
		}

		/*
		 * Objetivo: Cancelar e fechar a tela
		 * Parâmetros:
		 * Observações:
		 */
		ApprovalModalControl.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		/*
		 * Objetivo: Rejeitar as pendências selecionadas
		 * Parâmetros:
		 * Observações: Envia o texto de rejeição e o código da rejeição
		 */
		ApprovalModalControl.reject = function () {
			if(this.rejectText === undefined ){
				this.rejectText = "";
			}
			$modalInstance.close({rejectText: this.rejectText, rejectCode: this.rejectCode});
		};

		/*
		 * Objetivo: Aprovar as pendências selecionadas
		 * Parâmetros:
		 * Observações: Envia o texto de aprovação
		 */
		ApprovalModalControl.approve = function () {
			if(this.approvalText === undefined )	{
				this.approvalText = "";
			}
			$modalInstance.close({approvalText: this.approvalText});
		};

		/* Objetivo: Iniciar a tela (executa o método inicial) */
		if($rootScope.currentuserLoaded){
			ApprovalModalControl.init();
		}

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
	index.register.controller('mla.approval.Ctrl', approvalCtrl);
	index.register.controller('mla.approval.ListCtrl', approvalListCtrl);
	index.register.controller('mla.approval.DetailCtrl', approvalDetailCtrl);
	index.register.controller('mla.approval.approvalModalCtrl', approvalModalCtrl);

	/* Busca Avançada */
	index.register.service('mla.approval.ModalAdvancedSearch', modalAdvancedSearch);


});
