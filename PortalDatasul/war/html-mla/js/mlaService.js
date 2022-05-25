define([
	'index',
    '/dts/mla/js/api/mla0007.js',
    '/dts/mla/js/api/mla0009.js',
    '/dts/mla/js/api/fchdis0035.js',
    '/dts/mla/js/zoom/estabelec.js',
    '/dts/mla/js/zoom/empresa.js'
], function(index) {

	// ##########################################################
    // ### SERVIÇO DE MOVIMENTAÇÃO DE DOCUMENTOS DO MLA (Aprovação,reprovação, reaprovação)
    // ########################################################
    mlaService.$inject = ['$rootScope', 
                          '$modal',
                          'mla.mla0007.factory', 
                          'mla.mla0009.factory', 
                          'customization.generic.Factory', 
                          '$injector', 
                          'mla.fchdis0035.factory',
                          '$http']; 
    function mlaService($rootScope, 
                        $modal, 
                        mla0007, 
                        mla0009, 
                        customizationService, 
                        $injector, 
                        fchdis0035,
                        $http){

        var service = {
            /*
             * Objetivo: Abrir modal de aprovação; Aprovar uma ou mais pendências
             * Parâmetros:  - nrTrans: pendência que foi clicada
             *              - list: lista das pendências que foi clicada
             * Observações: o parâmetro list pode ser nulo (aprovação individual).
             */
            approve: function(nrTrans,list){
                //Função de aprovação.
                var approveFunction = function(text) {
                    var objs = [];
                    if(nrTrans)
                        objs.push(nrTrans);

                    for(key in list) {
                        //Inclusão do move, em função de no portal do CRM terem reescrito o array para inserir o método move
                        if ((list[key]) && (key != nrTrans) && (key != 'move'))
                            objs.push(key)
                    }

                    mla0007.aprovaPendPortal_2({
                        pSelecionados: objs.join(','), 
                        pAcao: 1, 
                        pNarrativa: text.approvalText, 
                        pSenhaUsuario: '', 
                        pCodRejeicao: 0
                    },
                    function(result){
                        if(result["p-log-sucesso"])
                            $rootScope.$broadcast("mla.approval.event", objs);
                        }
                    );
                };
                if($rootScope.approveWithoutComments) {
                    approveFunction(' ');
                } else {
                    var modalInstance = $modal.open({
                        templateUrl: '/dts/mla/html/approval/approval.dialog.html',
                        controller: 'mla.approval.approvalModalCtrl as controller',
                        resolve: {
                            modalReject: function() {
                                return false;
                            }
                        }
                    });
    
                    modalInstance.result.then(function (narrative) {
                        approveFunction(narrative);
                    },
                    function () {});
                }

            },
            /*
             * Objetivo: Abrir modal de reprovação; Reprovar uma ou mais pendências
             * Parâmetros:  - nrTrans: pendência que foi clicada
                            - list: lista das pendências que foi clicada
             * Observações: o parâmetro list pode ser nulo (reprovação individual).
             */
            reject: function(nrTrans,list){
                var modalInstance = $modal.open({
                                                  templateUrl: '/dts/mla/html/approval/approval.reject.html',
                                                  controller: 'mla.approval.approvalModalCtrl as controller',
                                                  resolve: {
                                                    modalReject: function(){
                                                        return true;
                                                    }
                                                  }
                                                });
                modalInstance.result.then(function (selectedItem) {
                    var objs = [];
                    if(nrTrans)
                        objs.push(nrTrans);
					for(key in list) {
						//Inclusão do move, em função de no portal do CRM terem reescrito o array para inserir o método move
						if ((list[key]) && (key != nrTrans) && (key != 'move')) {
							objs.push(key)
						}
					}
                    mla0007.aprovaPendPortal_2({pSelecionados:objs.join(','), pAcao:2, pNarrativa:selectedItem.rejectText, pSenhaUsuario:'', pCodRejeicao:selectedItem.rejectCode}, function(result){
                        if(result["p-log-sucesso"])
                            $rootScope.$broadcast("mla.approval.rejectevent", objs);
                    });

                }, function () {
                });
            },
            /*
             * Objetivo: Abrir modal de reaprovação; Reaprovar uma pendência
             * Parâmetros:  - nrTrans: pendência que foi clicada
             * Observações: Esta opção só está disponível no detalhe do documento.
             */
            reapprove: function(nrTrans){
                var modalInstance = $modal.open({
                                                  templateUrl: '/dts/mla/html/approval/approval.dialog.html',
                                                  controller: 'mla.hisroric.ModalCtrl as controller',
                                                  resolve: {
                                                    modalReject: function(){
                                                        return false;
                                                    }
                                                  }
                                                });

                modalInstance.result.then(function (selectedItem) {
                    var objs = [];
                    if(nrTrans)
                        objs.push(nrTrans);
                    mla0007.aprovaPendPortal_2({pSelecionados:nrTrans, pAcao:3, pNarrativa:selectedItem.approvalText, pSenhaUsuario:"", pCodRejeicao:0}, function(result){
                        if(result['p-log-sucesso'])
                            $rootScope.$broadcast("mla.historic.event", objs);
                    });
                }, function () {
                });
            },
            /*
             * Objetivo: Abrir a modal de pesquisa avançada
             * Parâmetros:  params: Parâmetros a serem passados para a modal
             * Observações: Somente se a modal for aberta pelo histórico são apresentadas os campos de período
             */
            advancedSearch: function(params) {
                var modalInstance = $modal.open({
                                                  templateUrl: '/dts/mla/html/approval/approval.advanced.search.html',
                                                  controller: 'mla.approval.AdvancedSearchCtrl as controller',
                                                  backdrop: 'static',
                                                  keyboard: false,
                                                  size: 'md',
                                                  resolve: {
                                                      parameters: function () {
                                                          return params; }
                                                  }
                                                });
                modalInstance.result.then(function (advancedSearch) {
                    $rootScope.filtersMLA.selectedCompany = advancedSearch.company;
                    $rootScope.filtersMLA.selectedCompanyDesc = advancedSearch.companyDesc;
                    $rootScope.filtersMLA.selectedEstab   = advancedSearch.estab;
                    $rootScope.$broadcast("mla.advancedsearch.event", advancedSearch);
                }, function () {
                });
            },

            /*
             * Objetivo: Transformar um valor do formato String (9.999,99) para número (9999.99)
             * Parâmetros:  - num: valor no formato String
             * Observações:
             */
            stringToNumber: function(num){
                num = num.trim();
                do{
                    num = num.replace(".","");
                }while(num.indexOf(".") >= 0);
                num = num.replace(",",".");
                return Number(num);
            },
            /*
             * Objetivo: Retornar o código do documento pai
             * Parâmetros:  - documentId: código do documento filho
             * Observações: Caso o documento não tenha pai, retorna ele mesmo.
             */
            getCustomDocumentId: function(documentId){
                switch (parseInt(documentId)) {
                    case 3:
                    case 18:
                        return(1);
                    case 4:
                        return(2);
                    case 19:
                        return(6);
                    case 8:
                        return(7);
                    default:
                        return(documentId);
                }
            },
            /*
             * Objetivo: Formatar uma data do formato timestamp para o formato brasileiro (dd/mm/aaa)
             * Parâmetros:  -timestamp: valor (inteiro) referente a data
             * Observações:
             */
            timestampToDate: function(timestamp){
                date = new Date(timestamp);
                day = date.getDate();
                month = date.getMonth() + 1;
                year = date.getFullYear();
                return day + "/" + month + "/" + year;
            },
            /*
             * Objetivo: separar os documentos em: "Minhas pendências" e "Pendências Alternativas"
             * Parâmetros:  -Entrada: documentRequests: lista de documentos misturados (minhas pendências e pendências alternativas)
                            -Saída: documentRequests: lista de documentos (primeiro as 'minhas pendências', depois as 'pendências alternativas')
             * Observações: Este método apenas coloca as "minhas pendências" como primeiros registros do array,
                            para que a ordenação traga prioritariamente as pendências do usuário logado.
             */
            separateDocuments: function(documentRequests){
                documentRequestsAlternatives = [];
                documentRequestsNoAlternatives = [];

                for(var i = 0; i < documentRequests.length; i++){
                    if(documentRequests[i].alternativo.trim() == "yes")
                        documentRequestsAlternatives.push(documentRequests[i]);
                    else
                        documentRequestsNoAlternatives.push(documentRequests[i]);
                }

                documentRequests = [];

                for(var i = 0; i < documentRequestsNoAlternatives.length; i++)
                    documentRequests.push(documentRequestsNoAlternatives[i]);

                for(var i = 0; i < documentRequestsAlternatives.length; i++)
                    documentRequests.push(documentRequestsAlternatives[i]);

                return documentRequests;
            },
            /*
             * Objetivo: atualizar o componente gráfico de ordenação na tela.
             * Parâmetros:
             * Observações:
             */
            attOrderbyList: function(codOrderby){
                orderbyList = [];
                switch(codOrderby){
                    case 1: orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false, default:true},
                                            {title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:true},
											{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:true}];
                            break;
                    case 2: orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:true, default:true},
                                            {title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:true},
											{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:true}];
                            break;

                    case 3: orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false},
                                            {title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:false, default:true},
											{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:false}];
                            break;

                    case 4: orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false},
                                            {title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:true, default:true},
											{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:false}];
                            break;
					case 5: orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false},
                                            {title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:false},
											{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:false, default:true}];
                            break;
					case 6: orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false},
                                            {title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:false},
											{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:true, default:true}];
                            break;
                }
                return orderbyList;
            },
            /*
             * Objetivo: alterar a ordenação dos resultados
             * Parâmetros: orderby: objeto que contém a ordenação selecionada pelo usuário em tela
             * Observações: - orderby.property - nome do campo que será usado na ordenação
                            - orderby.asc - indica se a ordenação é crescente (asc = true), ou decrescente (asc = false)
             */
            selectOrderBy: function(orderby){
                if(orderby.property == "nr-trans"){
                    if(!orderby.asc)
                        $rootScope.filtersMLA.sort = 1;
                    else
                        $rootScope.filtersMLA.sort = 2;
                }else{
                    if(orderby.property == "mla-doc-pend-aprov-valor-doc"){
                        if(!orderby.asc)
                            $rootScope.filtersMLA.sort = 3;
                        else
                            $rootScope.filtersMLA.sort = 4;
                    } else {
                        if(orderby.property == "mla-ep-codigo") {
                            if(!orderby.asc)
                                $rootScope.filtersMLA.sort = 5;
                            else
                                $rootScope.filtersMLA.sort = 6;
                        }
                    }
                }
            },
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
            compareToSort: function(a,b){
                if($rootScope.filtersMLA.sort == 1 || $rootScope.filtersMLA.sort == 2){
                    if (parseInt(a["nr-trans"]) < parseInt(b["nr-trans"]))
                        if($rootScope.filtersMLA.sort == 2)
                            return -1;
                        else
                            return 1;
                    if (parseInt(a["nr-trans"]) > parseInt(b["nr-trans"]))
                        if($rootScope.filtersMLA.sort == 2)
                            return 1;
                        else
                            return -1;
                    return 0;
                }

                if($rootScope.filtersMLA.sort == 3 || $rootScope.filtersMLA.sort == 4){
                    if (service.stringToNumber(a["mla-doc-pend-aprov-valor-doc"]) < service.stringToNumber(b["mla-doc-pend-aprov-valor-doc"]))
                        if($rootScope.filtersMLA.sort == 4)
                            return -1;
                        else
                            return 1;
                    if (service.stringToNumber(a["mla-doc-pend-aprov-valor-doc"]) > service.stringToNumber(b["mla-doc-pend-aprov-valor-doc"]))
                        if($rootScope.filtersMLA.sort == 4)
                            return 1;
                        else
                            return -1;
                    return 0;
                }

                if($rootScope.filtersMLA.sort == 5 || $rootScope.filtersMLA.sort == 6){
                    if (service.stringToNumber(a["mla-ep-codigo"]) < service.stringToNumber(b["mla-ep-codigo"]))
                        if($rootScope.filtersMLA.sort == 6)
                            return -1;
                        else
                            return 1;
                    if (service.stringToNumber(a["mla-ep-codigo"]) > service.stringToNumber(b["mla-ep-codigo"]))
                        if($rootScope.filtersMLA.sort == 6)
                            return 1;
                        else
                            return -1;
                    return 0;
                }
            },
            /*
             * Objetivo: retornar se o campo lógico é verdadeiro ou falso
             * Parâmetros: value: valor do campo lógico
             * Observações: retorna true/false
             */
            checkLog: function(value){
				if(!value) return false;
                value = value.toLowerCase().trim();
                if(value == "sim" || value == "yes")
                    return true;
                else
                    return false;
            },
            /*
             * Objetivo: retornar se o campo lógico é 'Sim' ou 'Não' (já traduzido)
             * Parâmetros: value: valor do campo lógico
             * Observações: retorna 'Sim' / 'Não'
             */
            checkLogValue: function(value){
				if(!value) return $rootScope.i18n('l-no');
                value = value.toLowerCase().trim();
                if(value == "sim" || value == "yes")
                    return $rootScope.i18n('l-yes');
                else
                    return $rootScope.i18n('l-no');
            },
            
            /*
             * Objetivo: Preenche o combo-box com as empresas possíveis para serem selecionadas e seta a empresa
                         a empresa do usuário ou Todas as empresas conforme parametrizado nos usuários da aprovação (MLA0103)
             * Parâmetros:
             * Observações:
             */
            getDadosEmpresa:function(){
                if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
                    bussinessContexts = null;
                    bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');

                    var contextdata = bussinessContexts.getContextData('selected.company');
                    if (!contextdata)
                        bussinessContexts.setContext('selected.company',
                                                           'Lendo Empresas...',
                                                           'glyphicon-th-large',
                                                           [{name: 'Lendo Empresas...'}],
                                                           null);

                    mla0009.getDadosEmpresa({}, function(result){

                        empresas = result['tt-empresas-usuar'];
                        var companies = [];
                        var selectedCompany = [];

                        /* Caso o usuário esteja parametrizado para visualizar as pendências de todas as empresas
                         * Seleciona a opção "Todas" */
                        if ($rootScope.userMLAInformation.allCompanies) {
                            $rootScope.filtersMLA.selectedCompany = '';
                            $rootScope.filtersMLA.selectedCompanyDesc = $rootScope.i18n('l-all'); //Todas
                        }

                        //Inclui todas as demais empresas no combor
                        for (var i = 0; i < empresas.length; i++) {
                            companies[i] = new Object();
                            companies[i].name = empresas[i]['c-cod-empresa'] + " - " + empresas[i]['c-razao-social'];
                            companies[i].companyName = empresas[i]['c-razao-social'];

                            if  (empresas[i]['c-cod-empresa'] == result['p-cod-empresa']) {
                                selectedCompany  = empresas[i];
                                companies[i].icon = 'glyphicon-ok';

								if (!$rootScope.userMLAInformation.allCompanies) {
									$rootScope.filtersMLA.selectedCompany = empresas[i]['c-cod-empresa'];
									$rootScope.filtersMLA.selectedCompanyDesc = empresas[i]['c-razao-social'];
                                }
                            }
                            companies[i].data = {companyId: empresas[i]['c-cod-empresa']};
                            companies[i].click = service.selectCompany;
                            service.companies = companies;
                        }

                        customizationService.callCustomEvent('epcTrocaEmpresa', companies, selectedCompany);

                        //Seta a empresas juntamente com a que deve ser selecionada
                        bussinessContexts.setContextData('selected.company',
                                                    {name: selectedCompany['c-cod-empresa'] + " - " + selectedCompany['c-razao-social'],
                                                     data: {companyId: selectedCompany['c-cod-empresa']},
                                                     options: companies
                                                    });

                        //Dispara o evento avisando que a empresa foi setada
                        $rootScope.$broadcast("mla.currentcompanySelected.event", $rootScope.filtersMLA.selectedCompany);
                    });
                } else {
                    /* Caso o usuário esteja parametrizado para visualizar as pendências de todas as empresas
                     * Seleciona a opção "Todas" */
                    if ($rootScope.userMLAInformation.allCompanies) {
                        $rootScope.filtersMLA.selectedCompany = '';
                        $rootScope.filtersMLA.selectedCompanyDesc = $rootScope.i18n('l-all'); //Todas
                    } else {
                        $rootScope.filtersMLA.selectedCompany = $rootScope.userMLAInformation.companyCode;
                        $rootScope.filtersMLA.selectedCompanyDesc = $rootScope.userMLAInformation.companyName;
                    }
                    //Dispara o evento avisando que a empresa foi setada
                    $rootScope.$broadcast("mla.currentcompanySelected.event", $rootScope.filtersMLA.selectedCompany);
                }
            },
            /*
             * Objetivo: Buscar informações do usuário logado, como padrão de ordenação e visualização de pendências
             * Parâmetros:
             * Observações:
             */
            getUsuarInformation: function() {
                if ($rootScope.userMLAInformation === undefined) {
                    $rootScope.userMLAInformation = [];
                }

                var serviceMla0009 = mla0009.getUsuarInformation({},function(result){
					if(result) {
						$rootScope.userMLAInformation = {
							codUsuar: result[0]['cod-usuar'],
							sortDefaultUser: result[0]['idi-ordenacao-portal'],
							allCompanies: result[0]['log-pendcia-todas-empres'],
							isMasterUser: result[0]['usuar-mestre'],
							companyCode: result[0]['ep-codigo'],
							companyName: result[0]['ep-codigo-desc'],
							pendenciesDefault: result[0]['idi-visualizacao-padrao'],
							isApprovUniquePendency: result[0]['log-aprovac-unica-pendcia'],
							showDetailInList: result[0]['log-visualiza-detalhe-listagem'],
							showListCounter: result[0]['log-visualiza-contador-pendencia']
						};
                        if ($rootScope.filtersMLA === undefined) {
                            $rootScope.filtersMLA = [];
                        }
                        $rootScope.filtersMLA.sort = $rootScope.userMLAInformation.sortDefaultUser;
                        $rootScope.filtersMLA.pendenciesDefault = $rootScope.pendenciesDefault;

                        if ($rootScope.userMLAInformation.allCompanies) {
                            $rootScope.filtersMLA.selectedCompany = '';
                            $rootScope.filtersMLA.selectedCompanyDesc = '';
                        } else {
                            $rootScope.filtersMLA.selectedCompany = $rootScope.userMLAInformation.companyCode;
                            $rootScope.filtersMLA.selectedCompanyDesc = $rootScope.userMLAInformation.companyName;
                        }
                        $rootScope.filtersMLA.selectedEstab = '';
                    }
                   
				    $rootScope.oldCurrentCompany = angular.copy($rootScope.currentcompany);
                    $rootScope.$broadcast("mla.usermlainfo.event", $rootScope.userMLAInformation);
				});
            },
            /*
             * Objetivo:
             * Parâmetros:
             * Observações:
             */
            selectCompany: function(item){
                if($rootScope.filtersMLA.selectedCompany != ""){
                    $rootScope.filtersMLA.selectedCompany = item.data.companyId;
                    $rootScope.filtersMLA.selectedCompanyDesc = item.name;
                }

                if(bussinessContexts === undefined || bussinessContexts === null)
                    bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');

                if ($rootScope.filtersMLA.selectedCompany != '') {
                    fchdis0035.setCompanyId(item.data.companyId);

                    fchdis0035.changeCompany({pCodEmpresa:item.data.companyId},function(result){     
                        // altera a empresa do cabeçalho e o ícone de 'check' na lista de empresas
                        for(i=0; i<service.companies.length; i++){
                            if(service.companies[i].data.companyId === item.data.companyId)
                                service.companies[i].icon = 'glyphicon-ok';
                            else
                                service.companies[i].icon = '';
                        }
                        bussinessContexts.setContextData('selected.company',{name: item.name,
                                                                            data: {companyId: item.data.companyId},
                                                                            options: service.companies
                                                                            });
                        
                        $rootScope.$broadcast("mla.selectCompany.event", item);
                    });
                } else {
                    // altera a empresa do cabeçalho e o ícone de 'check' na lista de empresas
                    for(i=0; i<service.companies.length; i++){
                        if(service.companies[i].data.companyId === item.data.companyId)
                            service.companies[i].icon = 'glyphicon-ok';
                        else
                            service.companies[i].icon = '';
                    }

                    bussinessContexts.setContextData('selected.company',
                                    {name: item.name,
                                     data: {companyId: ''},
                                     options: service.companies
                                    });

                    $rootScope.$broadcast("mla.selectCompany.event", item);
                }
            },
            /*
             * Objetivo: Indica se deve ser apresentado o campo empresa em tela
             * Parâmetros:
             * Observações: Deve mostrar se estiver selecionado "Todas empresas"
             */
            showCompany: function() {
                if ($rootScope.filtersMLA.selectedCompany == '') {
                    return true;
                } else {
                    return false;
                }
            },
            /*
             * Objetivo: Adicionar o disclaimer de empresa, conforme a empresa selecionada
             * Parâmetros: disclaimers: Disclaimers da tela
             * Observações: Retorna os disclaimers com o de empresa atualizado
             */
            addDisclaimersCompany: function(disclaimers) {
                if (disclaimers !== undefined) {
                    var existDisclaimer = false;

                    var fixedCompany = true;
                    var titleCompany = $rootScope.i18n('l-company') + ": ";
                    if ($rootScope.filtersMLA.selectedCompany !== '') {
                        titleCompany = titleCompany + $rootScope.filtersMLA.selectedCompany;
						$rootScope.userMLAInformation.allCompanies = false;

                        if (!$injector.has('totvs.app-bussiness-Contexts.Service')) {
                            fixedCompany = false;
                        }
                    } else {
                        titleCompany = titleCompany + $rootScope.i18n('l-all');
						$rootScope.userMLAInformation.allCompanies = true;
                    }

                    for (var i = 0; i < disclaimers.length; i++) {
                        if (disclaimers[i].property === 'company') {
                            existDisclaimer = true;
                            disclaimers[i].value = $rootScope.filtersMLA.selectedCompany;
                            disclaimers[i].title = titleCompany;
                            disclaimers[i].fixed = fixedCompany;
                        }
                    }

                    if (!existDisclaimer) {
                        disclaimers.push(
                        {property: 'company', value: $rootScope.filtersMLA.selectedCompany, title: titleCompany, fixed:fixedCompany});
                    }
                }

                return disclaimers;
            },
            /*
             * Objetivo: Adicionar o disclaimer de estabelecimento, conforme o estabelecimento selecionado
             * Parâmetros: disclaimers: Disclaimers da tela
             * Observações: Retorna os disclaimers com o de estabelecimento atualizado
             */
            addDisclaimerEstab: function(disclaimers) {
                if (disclaimers !== undefined) {
                    var existDisclaimer = false;

                    var fixedEstab = true;
                    var titleEstab = $rootScope.i18n('l-site-short') + ": ";
                    if ($rootScope.filtersMLA.selectedEstab !== '') {
                        titleEstab = titleEstab + $rootScope.filtersMLA.selectedEstab;
                        fixedEstab = false;
                    } else {
                        titleEstab = titleEstab + $rootScope.i18n('l-all-gen');
                    }

                    for (var i = 0; i < disclaimers.length; i++) {
                        if (disclaimers[i].property === 'estab') {
                            existDisclaimer = true;
                            disclaimers[i].value = $rootScope.filtersMLA.selectedEstab;
                            disclaimers[i].title = titleEstab;
                            disclaimers[i].fixed = fixedEstab;
                        }
                    }

                    if (!existDisclaimer) {
                        disclaimers.push(
                        {property: 'estab', value: $rootScope.filtersMLA.selectedEstab, title: titleEstab, fixed:fixedEstab});
                    }
                }

                return disclaimers;
            },
            /*
            * Objetivo: Atualizar o rootScope com a empresa selecionada 
            * Parâmetros: item: Objeto com a empresa selecionada
            * Observações: 
            */
            afterSelectCompany:function(item){
                $rootScope.userMLAInformation.companyCode = item.data.companyId;
                $rootScope.userMLAInformation.companyName = item.companyName;

                if($rootScope.filtersMLA.selectedCompany != ""){
                    $rootScope.filtersMLA.selectedCompany     = item.data.companyId;
                    $rootScope.filtersMLA.selectedCompanyDesc = item.companyName;
                }

                if (angular.isDefined($rootScope.currentuser['ep-codigo'])) {
                    $rootScope.currentuser['ep-codigo'] = item.data.companyId;
                }else if (angular.isDefined($rootScope.currentcompany) && angular.isDefined($rootScope.currentcompany.companycode)) {
                    $rootScope.currentcompany.companycode = item.data.companyId;
                }
            },
            /*
            * Objetivo: Verificar se está sendo executado via Portal
            * Parâmetros: 
            * Observações: Retorna true se estiver sendo executado pelo portal 
            *              e false quando executado pelo menu.
            */
            isPortal: function(){
                return $injector.has('totvs.app-bussiness-Contexts.Service');
            },
            /*
            * Objetivo: Efetuar a troca de empresa
            * Parâmetros: companyId - Empresa destino
            * Observações: Após efetuar a troca de empresa dispara o evento 
            * mla.selectCompany.event
            */
            changeCompany: function(companyId){
                var isHistory = false;
                var codConexao = "";
                var CompanyInfo = $injector.get('CompanyInfo');

                $http.get('/totvs-rest/api/fwk/menu/menuCompanyData/getCompanyDatabaseConn',
                {
                    headers: {  companyId: companyId,
                                dbHistId: codConexao }
                })
                .success(function(result) {
                    if (result.returnConn) {
                        if(!service.isPortal()){
                            var ExecutionProgressService = $injector.get('ExecutionProgressService'),
                                ChangeCompanyService = $injector.get('ChangeCompanyService');
                            // Se DI estiver aberto
							if (ExecutionProgressService.diStatus !== "0") {
								ChangeCompanyService.changeCompany(companyId,
																isHistory,
                                                                codConexao);
                                return;
							} 
                        }

                        CompanyInfo.setCompanyUser(companyId,
                                                isHistory,
                                                codConexao, function() {
                            CompanyInfo.getCompanyInfoData(function () {
                                var selectedCompany = CompanyInfo.getCompanyInfo();

                                // Atualiza o valor no MLA
                                if ( $rootScope.filtersMLA &&  $rootScope.filtersMLA.selectedCompany) {
                                    $rootScope.filtersMLA.selectedCompany = selectedCompany.companyId;
                                }

                                // Atualiza a empresa selecionada no rootscope, será usada no factory-http-interceptor.js
                                $rootScope.currentcompany = selectedCompany;
                                $rootScope.currentcompany.companycode = selectedCompany.companyId;

                                $rootScope.$broadcast("mla.selectCompany.event", companyId);
                                $rootScope.$broadcast('companyChanged');
                            }, companyId); 
                        });
                    }
                })
            }
        };
        return service;
    }

    // ########################################################
    // ### CONTROLLER MODAL ADVANCED SEARCH
	// ########################################################
    modalAdvancedSearchCtrl.$inject = ['$rootScope', '$scope', '$modalInstance', '$injector','$timeout', 'mla.empresa.zoom', 'parameters'];
    function modalAdvancedSearchCtrl($rootScope, $scope, $modalInstance, $injector, $timeout, serviceCompanyAux, parameters) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var AdvancedSearchControl = this;
        AdvancedSearchControl.parameters = [];
        AdvancedSearchControl.advancedSearch = {};
        AdvancedSearchControl.serviceCompany = serviceCompanyAux;
        AdvancedSearchControl.companyZoomField = {};
        AdvancedSearchControl.zoomInitSite = {};
        AdvancedSearchControl.prevCompany = "";

        /* Variáveis para evento de tab no select */
	    $scope.selectControllers = {};
	    $scope.selectIds = {};
	    $scope.find = {};
	    $scope.oldValues = {};

        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.init = function(){
            AdvancedSearchControl.advancedSearch.company = $rootScope.filtersMLA.selectedCompany;
            AdvancedSearchControl.advancedSearch.companyDesc = $rootScope.filtersMLA.selectedCompanyDesc;
            AdvancedSearchControl.prevCompany = AdvancedSearchControl.advancedSearch.estab;
			AdvancedSearchControl.allCompanies = $rootScope.userMLAInformation.allCompanies;

            if ($rootScope.filtersMLA.selectedCompany === '') {
				AdvancedSearchControl.companyZoomField['cod_empresa']      = $rootScope.userMLAInformation.companyCode;
				AdvancedSearchControl.companyZoomField['nom_razao_social'] = $rootScope.userMLAInformation.companyName;
            } else {
                AdvancedSearchControl.companyZoomField['cod_empresa']      = $rootScope.filtersMLA.selectedCompany;
                AdvancedSearchControl.companyZoomField['nom_razao_social'] = $rootScope.filtersMLA.selectedCompanyDesc;
            }
			AdvancedSearchControl.changeCompany();
            
            AdvancedSearchControl.advancedSearch.estab = $rootScope.filtersMLA.selectedEstab;

            if (parameters !== undefined &&
                parameters !== null) {
                AdvancedSearchControl.advancedSearch.dateStart = parameters.dateStart;
                AdvancedSearchControl.advancedSearch.dateEnd = parameters.dateEnd;
                AdvancedSearchControl.advancedSearch.historic = parameters.historic;
            }
			AdvancedSearchControl.changeAllCompany(AdvancedSearchControl.allCompanies);
		}

        /*
         * Objetivo: Desabilitar o filtro de empresa em tela
         * Parâmetros:
         * Observações: É desabilitado quando a execução é através do portal que apresenta a empresa no
         *              cabeçalho ou quando o todas empresas estiver marcado
         */
        AdvancedSearchControl.changeAllCompany = function(allCompany) {
			if (allCompany) {
				AdvancedSearchControl.zoomInitSite = {};
			} else {
				AdvancedSearchControl.changeCompany();
			}
			
			if (($injector.has('totvs.app-bussiness-Contexts.Service')) || allCompany) {
				AdvancedSearchControl.disableCompany = true;
			} else {
				AdvancedSearchControl.disableCompany = false;
			}
        }

        // # Purpose: Executado ao alterar a empresa selecionada no Zoom de empresas
        // # Parameters:
        // # Notes: 
        AdvancedSearchControl.changeCompany = function(){
            if(AdvancedSearchControl.companyZoomField && AdvancedSearchControl.companyZoomField['cod_empresa']){
              AdvancedSearchControl.zoomInitSite = {filter :{"ep-codigo" : AdvancedSearchControl.companyZoomField["cod_empresa"]},
                                                    method : "gotokeybycompany"};
              if(AdvancedSearchControl.prevCompany !== AdvancedSearchControl.companyZoomField["cod_empresa"]){
                AdvancedSearchControl.advancedSearch.estab = "";
                AdvancedSearchControl.prevCompany = AdvancedSearchControl.companyZoomField["cod_empresa"];
              }
            } else {
              AdvancedSearchControl.zoomInitSite = {};
            }
        }

        /*
         * Objetivo: Aplica os filtros informados
         * Parâmetros:
         * Observações:
         */
		AdvancedSearchControl.apply = function() {
			
			AdvancedSearchControl.advancedSearch.allCompanies = AdvancedSearchControl.allCompanies;
			if (AdvancedSearchControl.advancedSearch.allCompanies) {
				$rootScope.filtersMLA.selectedCompany = '';
				$rootScope.userMLAInformation.allCompanies = true;
			} else {
				$rootScope.userMLAInformation.allCompanies = false;
			}
			
            if (AdvancedSearchControl.companyZoomField !== undefined &&
                AdvancedSearchControl.companyZoomField !== null &&
                AdvancedSearchControl.companyZoomField['cod_empresa'] !== undefined) {
                AdvancedSearchControl.advancedSearch.company = AdvancedSearchControl.companyZoomField['cod_empresa'];
                AdvancedSearchControl.advancedSearch.companyDesc = AdvancedSearchControl.companyZoomField['nom_razao_social'];
            } else {
				if (AdvancedSearchControl.advancedSearch.allCompanies) {
					AdvancedSearchControl.advancedSearch.company = '';
					AdvancedSearchControl.advancedSearch.companyDesc = '';
				} else {
					AdvancedSearchControl.advancedSearch.company = $rootScope.userMLAInformation.companyCode;
					AdvancedSearchControl.advancedSearch.companyDesc = $rootScope.userMLAInformation.companyName;
				}
            }

            if (AdvancedSearchControl.advancedSearch.estab === undefined) {
                AdvancedSearchControl.advancedSearch.estab = '';
            }
			$modalInstance.close(AdvancedSearchControl.advancedSearch);
		}

        /*
         * Objetivo: Cancela os filtros e fecha a tela
         * Parâmetros:
         * Observações:
         */
		AdvancedSearchControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

        /*===============
	    ** Métodos para evento de tab no select
	    ========================================*/
	    this.initSelects = function(select, id) {
	    	$scope.selectControllers[id] = select;
	    	$scope.selectIds[id] = '#'+id;
	    	$scope.find[id] = false;
	    	$scope.oldValues[id] = '';
	    }

	    function loadSelectValue(value, id) {
	    	var promise;
	    	if(value && angular.isObject(value)) {
	    		value = value[$scope.selectIds[selectId]];
	    	}

	    	switch(id) {
			    case 'company':
			        promise = AdvancedSearchControl.serviceCompany.getObjectFromValue(value);
			        break;
			}
			if(promise) {
				if(promise.then) {
					promise.then(function(data) {
						if(data) $scope.selectControllers[id].select(data);
					});
				} else {
					$scope.selectControllers[id].select(promise);
				}
			} else {
				$scope.selectControllers[id].select($scope.selectControllers[id].selected);
			}
	    }

	    function selectDefaultValue() {
			if(data && data.hasOwnProperty(id)) {
				$scope.selectControllers[id].select(data);
			}  else {
				$scope.selectControllers[id].select($scope.selectControllers[id].selected);
			}
	    }

	    this.refreshLists = function(search, id) {
			if($scope.oldValues[id] !== search) {
		    	switch(id) {
				    case 'company':
				        AdvancedSearchControl.serviceCompany.getSelectResultList(search, {}, function() {});
				        break;
				}
			}
	    }

	    $timeout(function() {
			$('#company').find('input.ui-select-search').keydown(function(e) {
				if(e.keyCode == 9) selectKeyDown('company');
			});
			$('#company').find('input.ui-select-search').focusin(function() {
				selectFocusin('company');
			});
	    }, 550);

	    function selectKeyDown(id) {
			$scope.find[id] = false;
			if($scope.oldValues[id] !== $scope.selectControllers[id].search) {
				loadSelectValue($scope.selectControllers[id].search, id);
			} else {
				$scope.selectControllers[id].select($scope.selectControllers[id].selected);
			}
	    }

	    function selectFocusin(id) {
			if($scope.selectControllers[id].selected !== undefined &&
         $scope.selectControllers[id].selected !== null) {
                $scope.selectControllers[id].search = $scope.selectControllers[id].selected[id];
                $scope.oldValues[id] = $scope.selectControllers[id].selected[id];
			} else {
				$scope.selectControllers[id].search = '';
			}

			if(!$scope.find[id]) {
				$scope.selectControllers[id].items = [];
			}
			$scope.find[id] = true;
	    }
	    /*==========================
	    ** Fim métodos para evento de tab no select
	    ============*/

        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

        AdvancedSearchControl.init();
        // *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			AdvancedSearchControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		    $modalInstance.dismiss('cancel');
		});
    }

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.factory('mla.service.mlaService',mlaService);
    index.register.controller('mla.approval.AdvancedSearchCtrl', modalAdvancedSearchCtrl);
});
