define([
    'index',
    '/dts/mpd/js/dbo/bodi00902.js'
], function(index) {
    'use strict';

    paymentCiashopTransactionsController.$inject = [
        '$scope',
        '$rootScope',           
        'totvs.app-main-view.Service',
        'mpd.pedpagto.Service',
        'customization.generic.Factory',
        '$stateParams',        
        'TOTVSEvent',
        '$modal',
        '$filter'
    ];
    function paymentCiashopTransactionsController($scope, $rootScope, appViewService, pedpagtoservice, customizationService, $stateParams, TOTVSEvent, $modal, $filter) {
        
        var controller = this;     

        this.getUrlEncode = function(value) {
            value = window.encodeURIComponent(value);
            value = controller.replaceAllString(value, '.', '%2E');
            return value;
        };
        
        this.replaceAllString = function(str, find, replace) {
            return str.replace(find, replace);
        }   

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.advancedSearch = {}    // objeto para manter as informações do filtro avançado

        // abertura da tela de pesquisa avançada
        this.openAdvancedSearch = function() {
            var modalInstance = $modal.open({
              templateUrl: '/dts/mpd/html/paymentciashoptransactions/paymentciashoptransactions.search.html',
              controller: 'mpd.paymentciashoptransactionsadvanced.Control as controller',
              size: 'lg',
              resolve: {
                model: function () {
                  // passa o objeto com os dados da pesquisa avançada para o modal
                  return controller.advancedSearch;
                }
              }
            });
            // quando o usuario clicar em pesquisar:
            modalInstance.result.then(function () {
                // cria os disclaimers
                controller.addDisclaimers();
                // e chama o busca dos dados
                controller.loadData();
            });
        }

        // metodo para adicionar os disclaimers relativos a tela de pesquisa avançada
        this.addDisclaimers = function() {
            // reinicia os disclaimers
            controller.disclaimers = [];
            
            // para a faixa de codigos, tem que tratar e colocar em apenas um disclaimer
            if (controller.advancedSearch.nomeAbrevIni || controller.advancedSearch.nomeAbrevFin) {
                var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.nomeAbrevIni)  {
                    faixa = controller.advancedSearch.nomeAbrevIni;
                    deate = controller.advancedSearch.nomeAbrevIni;
                }
                if (controller.advancedSearch.nomeAbrevFin) {
                    faixa = faixa + ';' + controller.advancedSearch.nomeAbrevFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.nomeAbrevFin;
                } else {
                    faixa = faixa + ';9999999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('nome-abrev', faixa, $rootScope.i18n('Nome: ') + deate);
            }

            // Filtro por numero do pedido do cliente
            if (controller.advancedSearch.nrPedCliIni || controller.advancedSearch.nrPedCliFin) {
                var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.nrPedCliIni)  {
                    faixa = controller.advancedSearch.nrPedCliIni;
                    deate = controller.advancedSearch.nrPedCliIni;
                }
                if (controller.advancedSearch.nrPedCliFin) {
                    faixa = faixa + ';' + controller.advancedSearch.nrPedCliFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.nrPedCliFin;
                } else {
                    faixa = faixa + ';9999999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }                
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('nr-pedcli', faixa, $rootScope.i18n('Nr Pedido: ') + deate);
            }

            // Filtro por numero do pedido de compra
            if (controller.advancedSearch.codPedCompraIni || controller.advancedSearch.codPedCompraFin) {
                var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codPedCompraIni)  {
                    faixa = controller.advancedSearch.codPedCompraIni;
                    deate = controller.advancedSearch.codPedCompraIni;
                }
                if (controller.advancedSearch.codPedCompraFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codPedCompraFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codPedCompraFin;
                } else {
                    faixa = faixa + ';9999999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }                
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-ped-compra', faixa, $rootScope.i18n('Nr Pedido Compra: ') + deate);
            }
                        
            // Filtro por data de implantação
            if (controller.advancedSearch.dtImplantPed) {                 

                function insert(str, index, value) {
                    return str.substr(0, index) + value + str.substr(index);
                }                           

                var dtImplantPedido    = $filter('date')(controller.advancedSearch.dtImplantPed, 'shortDate');
                var dtImplantPedidoAux = insert(dtImplantPedido, 6, "20");                                                        
                
                controller.addDisclaimer("cod-dat-hora", dtImplantPedidoAux + "*", $rootScope.i18n('Dt Implant: ' + dtImplantPedido));
            } 
        
        }

        // adiciona um objeto na lista de disclaimers
        this.addDisclaimer = function(property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }        
		
        // remove um disclaimer
        this.removeDisclaimer = function(disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }
            
            // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == null)
                controller.quickSearchText = '';
                                            
            // recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        this.loadData = function(isMore) {
            
            var startAt  = 0;
            var where    = '';            
            var criteria = '';
            controller.totalRecords = 0;
                        
            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText){                                                    
                //where = '(ped-pagto.nr-pedcli ="' + controller.quickSearchText + '") OR (ped-pagto.nome-abrev ="' + controller.quickSearchText + '")';
                where = '(ped-pagto.nr-pedcli ="' + controller.quickSearchText + '") OR (ped-pagto.nome-abrev ="' + controller.quickSearchText + '") OR (ped-pagto.cod-ped-compra ="' + controller.quickSearchText + '")';
                controller.disclaimers = [];                
                controller.addDisclaimer(null, null, controller.quickSearchText);                
            }             
                                   
            // se não é busca de mais dados, inicializa o array de resultado
            if (!isMore) {
                controller.listResult = [];
            }
            // calcula o registro inicial da busca
            startAt = controller.listResult.length;

            // monta a lista de propriedades e valores a partir dos disclaimers
            var properties = [];
            var values = [];

            angular.forEach(controller.disclaimers, function (filter) {
                if (filter.property) {
                    properties.push(filter.property);
                    values.push(filter.value);
                }
            });
            // monta os parametros para o service
            var parameters = {
                property: properties,
                value: values,
            };
            
            if (where)
                parameters.where = where;
                        
            if (parameters.where && criteria)
                parameters.where = parameters.where + " AND " + criteria;
            else if (criteria)
                parameters.where = criteria;
            
            parameters.order='nr-pedcli';
            parameters.asc = false;
                                
            // chama o findRecords
            pedpagtoservice.findRecords(startAt, parameters, function(result) {
            
                // se tem result
                if (result) {
                    // para cada item do result
                    angular.forEach(result, function (value) {
                                                                                                                            
                        switch(value['idi-tip-mdo']){
                            case 1:
                            value['idi-tip-mdo'] = "Boleto";
                            break;
                            case 2:
                            value['idi-tip-mdo'] = "Transferência";
                            break;
                            case 3:
                            value['idi-tip-mdo'] = "Cartão de Crédito";
                            break;
                            case 4:
                            value['idi-tip-mdo'] = "Faturado";
                            break;
                        }
                                                                        
                        // se tiver o atributo $length e popula o totalRecords
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;  
                        }                                                 
                        // adicionar o item na lista de resultado
                        controller.listResult.push(value);                                                
                    });   
                                                                 
                }
            });
            
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        this.init = function() {           
            if (appViewService.startView($rootScope.i18n('l-payment-ciashop'), 'mpd.paymentciashoptransactions.list.control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);            
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.pedpagtopedpagto', 'initEvent', controller);
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });

    }

    paymentCiashopTransDetailController.$inject = ['$rootScope', 
                                                   '$scope', 
                                                   '$stateParams', 
                                                   '$state',
                                                   'totvs.app-main-view.Service', 
                                                   'mpd.pedpagto.Service',
                                                   'TOTVSEvent'];    
    function paymentCiashopTransDetailController($rootScope, $scope, $stateParams, $state,appViewService, pedpagtoservice, TOTVSEvent) {
        
        var controller = this;

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em detalhamento

        // *********************************************************************************
        // *** Methods
        // *********************************************************************************

        // metodo de leitura do regstro
        this.load = function(nomeAbrev, nrPedCli) {
            this.model = {}; // zera o model
            // chama o servico para retornar o registro
            pedpagtoservice.getRecord(nomeAbrev, nrPedCli, function(datadetail) {
                
                if (datadetail) { // se houve retorno, carrega no model

                    datadetail['cod-dat-hora'] = datadetail['cod-dat-hora'].substr(0,19);
                    
                    if(datadetail['log-cancel']){
                        datadetail['log-cancel'] = "Sim";
                    }else{
                        datadetail['log-cancel'] = "Não";
                    }
                    
                    controller.model = datadetail;
                }              
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {
            if (appViewService.startView($rootScope.i18n('Detalhes do Pedido'), 'mpd.paymentciashoptransactions.detail.Control', controller)) {             
                // se é a abertura da tab, implementar aqui inicialização do controller
            }

            // se houver parametros na URL
            if ($stateParams && $stateParams.nomeAbrev && $stateParams.nrPedCli) {
                // realiza a busca de dados inicial
                this.load($stateParams.nomeAbrev, $stateParams.nrPedCli);
            } 
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });        
                                                
    };

    // **************************************************************************************
	// *** CONTROLLER - Search
	// **************************************************************************************
	      
    paymentCiashopTransAdvancedController.$inject = ['$modalInstance', 'model'];
    function paymentCiashopTransAdvancedController ($modalInstance, model) {
         
        // recebe os dados de pesquisa atuais e coloca no controller
        this.advancedSearch = model;
         
        // ação de pesquisar
        this.search = function () {
            // close é o fechamento positivo
            $modalInstance.close();
        }
         
        // ação de fechar
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }
    }
    
    index.register.controller('mpd.paymentciashoptransactions.list.control'    , paymentCiashopTransactionsController);
    index.register.controller('mpd.paymentciashoptransactionsadvanced.Control' , paymentCiashopTransAdvancedController);
    index.register.controller('mpd.paymentciashoptransactions.detail.Control'  , paymentCiashopTransDetailController);

});
