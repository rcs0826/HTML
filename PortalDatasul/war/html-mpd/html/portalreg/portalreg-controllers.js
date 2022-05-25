define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
         // totvs-custom alem das tags de customização de tela, tambem comtêm os serviços de customização
        '/dts/mpd/js/dbo/bodi00712.js', // os controllers dependem dos serviços registrados.
        '/dts/mpd/js/api/fchdis0028.js',
        '/dts/mpd/js/zoom/tb-preco.js', //zoom de tabela de preço carrega todas disponíveis
		'/dts/mpd/js/zoom/tb-preco-pv2.js', //zoom de tabela de preço que carrega somente as vinculadas no portal
        '/dts/mpd/js/zoom/cond-pagto.js', //zoom de condição de pagamento
        '/dts/mpd/js/zoom/cond-pagto-inter.js', //zoom de condição de pagamento interno
        '/dts/mpd/js/zoom/referencia.js', //zoom de referencia do item
        '/dts/mpd/js/zoom/portal-configur-clien.js', //zoom de configuração do portal
        '/dts/mpd/js/zoom/tpoperacao.js', //zoom de tipo de operacao
		'/dts/mpd/js/zoom/canal-venda.js', //zoom de canal de venda
        '/dts/men/js/zoom/item.js',
        '/dts/men/js/zoom/ref-item.js',
        'less!/dts/mpd/assets/css/configportal.less'
       ], function(index) {
 
    // *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

    portalRegListController.$inject = ['$rootScope',
                                       '$scope',
                                       '$stateParams',
                                       '$modal',
                                       'totvs.app-main-view.Service',                                       
                                       'customization.generic.Factory',
                                       'mpd.portalreg.Service',
                                       'mpd.fchdis0028.FactoryApi',
                                       '$location', 'TOTVSEvent'];
    function portalRegListController($rootScope, $scope, $stateParams, $modal, appViewService, customizationService, portalRegService, portalRegFactoryApi, $location, TOTVSEvent) {

        var controller = this;

        

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.advancedSearch = {};    // objeto para manter as informações do filtro avançado
        this.idPortalConfigur = $stateParams.idPortalConfigur;
        this.idiTipConfig = $stateParams.idTipConfig;
        this.addTbPreco = true; //Habilita a oplção de adicionar tabela de preço somente se a configuração for pra representante
        this.addTpOperacao = true; //Habilita a oplção de adicionar tipo de operacao somente se a configuração for pra representante
		this.addCanalVenda = true; //Habilita a oplção de adicionar canal de venda somente se a configuração for pra representante
        this.tagTabela = "";
        
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        
        // abertura da tela de pesquisa avançada
        this.openAdvancedSearch = function() {
            
            var modalInstance = $modal.open({
              templateUrl: '/dts/mpd/html/portalreg/portal-reg.search.html',
              controller: 'mpd.portal-reg-search.Control as controller',
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
            if (controller.advancedSearch.codItemIni || controller.advancedSearch.codItemFin) {
                var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codItemIni)  {
                    faixa = controller.advancedSearch.codItemIni;
                    deate = controller.advancedSearch.codItemIni;
                }
                if (controller.advancedSearch.codItemFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codItemFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codItemFin;
                } else {
                    faixa = faixa + ';"ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-item, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-item', faixa, $rootScope.i18n('l-cod-item') + deate);
            }            
            if (controller.advancedSearch.codReferIni || controller.advancedSearch.codReferFin) {
                var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codReferIni)  {
                    faixa = controller.advancedSearch.codReferIni;
                    deate = controller.advancedSearch.codReferIni;
                }
                if (controller.advancedSearch.codReferFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codReferFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codReferFin;
                } else {
                    faixa = faixa + ';"ZZZZZZZZ"';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-refer', faixa, $rootScope.i18n('l-cod-refer') + deate);
            }
            if (controller.advancedSearch.cdnCondPagIni || controller.advancedSearch.cdnCondPagFin) {
                var faixa = '0', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.cdnCondPagIni)  {
                    faixa = controller.advancedSearch.cdnCondPagIni;
                    deate = controller.advancedSearch.cdnCondPagIni;
                }
                if (controller.advancedSearch.cdnCondPagFin) {
                    faixa = faixa + ';' + controller.advancedSearch.cdnCondPagFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.cdnCondPagFin;
                } else {
                    faixa = faixa + ';999';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cdn-cond-pag', faixa, $rootScope.i18n('l-cdn-cond-pag') + deate);
            }
            if (controller.advancedSearch.codTbPrecoIni || controller.advancedSearch.codTbPrecoFin) {
                var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.codTbPrecoIni)  {
                    faixa = controller.advancedSearch.codTbPrecoIni;
                    deate = controller.advancedSearch.codTbPrecoIni;
                }
                if (controller.advancedSearch.codTbPrecoFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codTbPrecoFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codTbPrecoFin;
                } else {
                    faixa = faixa + ';"ZZZZZZZZ"';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cod-tab-preco', faixa, $rootScope.i18n('l-price-table') + deate);
            }
            if (controller.advancedSearch.cdnTpOperacaoIni || controller.advancedSearch.codTpOperacaoFin) {
                var faixa = '', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.cdnTpOperacaoIni)  {
                    faixa = controller.advancedSearch.cdnTpOperacaoIni;
                    deate = controller.advancedSearch.cdnTpOperacaoIni;
                }
                if (controller.advancedSearch.codTpOperacaoFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codTpOperacaoFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codTpOperacaoFin;
                } else {
                    faixa = faixa + ';"ZZZZZZZZ"';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cdn-tip-ped', faixa, $rootScope.i18n('Tipo de Operação') + deate);
            }
			if (controller.advancedSearch.cdnCanalVendaIni || controller.advancedSearch.codCanalVendaFin) {
                var faixa = '0', deate = ' ' + $rootScope.i18n('l-from-start');                 
                if (controller.advancedSearch.cdnCanalVendaIni)  {
                    faixa = controller.advancedSearch.cdnCanalVendaIni;
                    deate = controller.advancedSearch.cdnCanalVendaIni;
                }
                if (controller.advancedSearch.codCanalVendaFin) {
                    faixa = faixa + ';' + controller.advancedSearch.codCanalVendaFin;
                    deate = deate + ' ' + $rootScope.i18n('l-to') + ' ' + controller.advancedSearch.codCanalVendaFin;
                } else {
                    faixa = faixa + ';"999"';
                    deate = deate + ' ' + $rootScope.i18n('l-to-end');
                }
                // adicionar o disclaimer para o campo cod-mensagem, para faixa o value é "inicio;final"
                controller.addDisclaimer('cdn-canal-vendas', faixa, $rootScope.i18n('l-canal-venda') + deate);
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
            
            //Limpa os campos da pesquisa avançada de acordo com o disclaimer removido        
            if (disclaimer.property == 'cod-item') {
                controller.advancedSearch.codItemIni = "";
                controller.advancedSearch.codItemFin = "";
            } else if (disclaimer.property == 'cod-refer') {
                controller.advancedSearch.codReferIni = "";
                controller.advancedSearch.codReferFin = "";
            } else if (disclaimer.property == 'cdn-cond-pag') {
                controller.advancedSearch.cdnCondPagIni = "";
                controller.advancedSearch.cdnCondPagFin = "";
            } else if (disclaimer.property == 'cod-tab-preco') {
                controller.advancedSearch.codTbPrecoIni = "";
                controller.advancedSearch.codTbPrecoFin = "";
            } else if (disclaimer.property == 'cdn-tip-ped') {
                controller.advancedSearch.cdnTpOperacaoIni = "";
                controller.advancedSearch.codTpOperacaoFin = "";
            } else if (disclaimer.property == 'cdn-canal-vendas') {
                controller.advancedSearch.cdnCanalVendaIni = "";
                controller.advancedSearch.codCanalVendaFin = "";
            }
            
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }
            
            // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == null)
                controller.quickSearchText = '';            
            // recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        // metodo de leitura dos dados
        this.loadData = function(isMore, quickFilter) {
                    
            // valores default para o inicio e pesquisa
            var startAt = 0;
            var limitAt = 30;
            var where = '';
            var criteria = '';

            if (controller.idiTipConfig == 2){
                controller.addTbPreco    = false;
				controller.addCanalVenda = false;
            }                                                        
            else{
                controller.addTbPreco    = true;
				controller.addCanalVenda = true;
            }
                        
            //se houver pesquisa rápida, monta o where
            if (controller.quickSearchText){
                where = '(portal-reg-clien.cdn-cond-pag = int("' + controller.quickSearchText + '") OR ' +
                        'portal-reg-clien.cod-item Matches string("*' + controller.quickSearchText + '*") OR ' +
                        'portal-reg-clien.cdn-tip-ped = int("' + controller.quickSearchText + '") OR ' +
                        'portal-reg-clien.cod-refer Matches string("*' + controller.quickSearchText + '*") OR ' +
                        'portal-reg-clien.cod-tab-preco Matches string("*' + controller.quickSearchText + '*") OR ' +
						'portal-reg-clien.cdn-canal-vendas = int("' + controller.quickSearchText + '"))'
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer(null, null, controller.quickSearchText);                
            }
            
            //Pesquisa Rápida com tags
            if (quickFilter == 'item'){
                criteria = "portal-reg-clien.cod-tabela = 'item'";
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cod-tabela','item',$rootScope.i18n('l-cod-item'));
                controller.tagTabela = quickFilter;
            } else if (quickFilter == 'condPagto'){
                criteria = "portal-reg-clien.cod-tabela = 'cond-pagto'";
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cod-tabela','cond-pagto', $rootScope.i18n('l-cdn-cond-pag'));
                controller.tagTabela = quickFilter;
            } else if (quickFilter == 'tbPreco'){
                criteria = "portal-reg-clien.cod-tabela = 'tb-preco'";
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cod-tabela','tb-preco', $rootScope.i18n('l-tab-preco'));
                controller.tagTabela = quickFilter;
            } else if (quickFilter == 'tpOperacao'){
                criteria = "portal-reg-clien.cod-tabela = 'tp-operacao'";
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cod-tabela','tp-operacao', $rootScope.i18n('l-tp-oper'));
                controller.tagTabela = quickFilter;
            } else if (quickFilter == 'canalVenda'){
                criteria = "portal-reg-clien.cod-tabela = 'canal-venda'";
                controller.disclaimers = [];
                controller.addDisclaimers();
                controller.addDisclaimer('cod-tabela','canal-venda', $rootScope.i18n('l-canal-venda'));
                controller.tagTabela = quickFilter;
            } else {
                controller.tagTabela = "";
            }
            
            // se não é busca de mais dados, inicializa o array de resultado
            if (!isMore) {
                controller.listResult = [];
                controller.totalRecords = 0;
            }
            
            // calcula o registro inicial da busca
            startAt = controller.listResult.length;
            
            // monta a lista de propriedades e valores a partir dos disclaimers
            var properties = [];
            var values = [];
            
            //Adiciona as propriedades do pai
            properties.push('idi-seq');
            values.push($stateParams.idPortalConfigur);
            
            angular.forEach(controller.disclaimers, function (filter) {
                                
                if (filter.property) {
                                        
                    properties.push(filter.property);
                    values.push(filter.value);
                    
                    //Limpa os campos da pesquisa avançada de acordo com o disclaimer removido        
                    if (filter.property == 'cod-item') {
                        if (where != ""){
                            where = where + " AND portal-reg-clien.cod-item <> '?'";
                        } else {
                            where = " portal-reg-clien.cod-item <> '?'";
                        }
                    } else if (filter.property == 'cdn-cond-pag') {
                        if (where != ""){
                            where = where = " AND portal-reg-clien.cdn-cond-pag <> 0 ";
                        } else {
                            where = " portal-reg-clien.cdn-cond-pag <> 0 ";
                        }
                    } else if (filter.property == 'cdn-canal-vendas') {
                        if (where != ""){
                            where = where = " AND portal-reg-clien.cdn-canal-vendas <> 0 ";
                        } else {
                            where = " portal-reg-clien.cdn-canal-vendas <> 0 ";
                        }
                    }
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


            
            // chama o findRecords
            portalRegService.findRecords(startAt, limitAt, parameters, function(result) {

                
                // se tem result
                if (result) {
                    
                    // para cada item do result
                    angular.forEach(result, function (value) {
                        
                        // se tiver o atributo $length e popula o totalRecords
                        if (value && value.$length) {
                            controller.totalRecords = value.$length;
                        }
                                                
                        value['desc-tabela'] = value['_']['desc-tabela'];

                        //Ajustando as labels
                        if (value['cod-item'] == "?") {
                            value['cod-item'] = "";
                        }
                        
                        if (value['cod-item'] !== "") {
                            value['cod-item'] = value['cod-item'] + ' - ' + value['_']['desc-item'];
                        }

                        if (value['cdn-cond-pag'] > 0)
                            value['cdn-cond-pag'] = value['cdn-cond-pag'] + ' - ' + value['_']['desc-cond-pagto'];
                        else
                            value['cdn-cond-pag'] = "";

                        if (value['cdn-tip-ped'] > 0)
                            value['cdn-tip-ped'] = value['cdn-tip-ped'] + ' - ' + value['_']['desc-tp-operacao'];
                        else
                            value['cdn-tip-ped'] = "";
                        
                        if (value['cod-tab-preco'] !== "")
                            value['cod-tab-preco'] = value['cod-tab-preco'] + ' - ' + value['_']['desc-tb-preco'];
						
						if (value['cdn-canal-vendas'] > 0 )
                            value['cdn-canal-vendas'] = value['cdn-canal-vendas'] + ' - ' + value['_']['desc-canal-venda'];
						else
							value['cdn-canal-vendas'] = "";
                        
                        //controller.idiTipConfig = value['_']['idi-tip-config'];
                                                
                        // adicionar o item na lista de resultado
                        controller.listResult.push(value);
                    });
                } 
                
                var cFind = 'th[data-thf="totvs-table-col-reg-seq"]:first';
                var columnSeq = $('#reg-list').find(cFind);
                columnSeq.prop("width", "75px");

                var cFind2 = 'th[data-thf="totvs-table-col-reg-item"]:first';
                var columnItem = $('#reg-list').find(cFind2);
                columnItem.prop("width", "250px");

            });            
        }
        
        // metodo para a ação de delete
        this.delete = function() {
            
            var idiSeq = 0;
            var idiSeqReg = 0;
            var index = -1;
            controller.listResultAux = [];
            
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titulo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        
                        angular.forEach(controller.listResult, function (value) {
                            
                            if (value.$selected) {
                                idiSeq = value['idi-seq'];
                                idiSeqReg = value['idi-seq-reg'];
                                
                                controller.listResultAux.push(value);
                                
                                // chama o metodo de remover registro do service
                                portalRegService.deleteRecord(idiSeq, idiSeqReg, function(result) {
                                });
                            }
                        });
                        
                        angular.forEach(controller.listResultAux, function(value){
                            index = controller.listResult.indexOf(value);
                            
                            if (index != -1){
                                controller.listResult.splice(index, 1);
                                controller.totalRecords--;
                            }
                        });
                        if (index != -1) {
                                                
                            // notifica o usuario que o registro foi removido
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', // tipo de notificação
                                title: $rootScope.i18n('l-reg'), // titulo da notificação
                                // detalhe da notificação
                                detail: $rootScope.i18n('l-reg') + ' '
                                + $rootScope.i18n('l-success-deleted') + '!'
                            });            
                        }
                    }
                }
            });
        }
        
        this.edit = function(){
            
            var idiSeq = 0;
            var idiSeqReg = 0;
            var icont = 0;
            var table = "";
            
            angular.forEach(controller.listResult, function (value) {
                
                if (value.$selected) {
                    icont ++;
                    idiSeq = value['idi-seq'];
                    idiSeqReg = value['idi-seq-reg'];
                    
                    if (value['cod-tabela'] == "item"){
                        table = "item";
                    } else if (value['cod-tabela'] == "cond-pagto"){
                        table = "condPagto";
                    } else if (value['cod-tabela'] == "tp-operacao"){ 
                        table = "tpOperacao";
                    } else if (value['cod-tabela'] == "tb-preco" ) {
                        table = "tbPreco";
                    } else if (value['cod-tabela'] == "canal-venda" ) {
                        table = "canalVenda";
                    }
                }
            });
            
            if (icont == 1) {
                $location.path('dts/mpd/portalreg/edit/' + table + '/' + idiSeq + '/' + idiSeqReg);
            } else if (icont > 1) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-msg-editar-registro')
                });
            }            
        }
        
        this.detail = function(data){
            
            var table = "";
            
            if (data['cod-tabela'] == "item"){
                table = "item";
            } else if (data['cod-tabela'] == "cond-pagto"){
                table = "condPagto";
            } else if (data['cod-tabela'] == "tp-operacao"){
                table = "tpOperacao";
            } else if (data['cod-tabela'] == "tb-preco" ) {
                table = "tbPreco";
            } else if (data['cod-tabela'] == "canal-venda" ) {
                table = "canalVenda";
            }
            
            $location.path('dts/mpd/portalreg/detail/' + table + '/' + data['idi-seq'] + '/' + data['idi-seq-reg']);
        }
        
        //Abertura da modal de copia do registro
        this.openCopyModal = function(){
            var params = {};
            
            params = {idiTipConfig: controller.idiTipConfig, idPortalConfigur: $stateParams.idPortalConfigur, copyTpOperacao: controller.addTpOperacao, copyCanalVenda: controller.addCanalVenda};
            
            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/portalreg/portal-reg.copy.html',
                controller: 'mpd.portal-reg-copy.Controller as controller',
                size: 'lg',
                resolve: {
                    modalParams: function(){
                        // passa o objeto com os dados da copia avançada para o modal
                        return params;
                    }
                }
            });
            
            modalInstance.result.then(function () {
			    controller.loadData(false);
			});
        };
        
        this.loadParams = function(){
            portalRegFactoryApi.getParameters({}, function(result) {
                if (!result.$hasError){
                    angular.forEach(result, function(fieldData, key) {
                        if (fieldData['cField'] === "suges-nat-oper") controller.addTpOperacao = false;
                    });	
                }
            })
        };
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        this.init = function() {
            if (appViewService.startView($rootScope.i18n('l-portal-reg'), 'mpd.portal-reg-list.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // realiza a busca de dados inicial
            this.loadData(false);
            this.loadParams();            
            // chama um ponto da EPC para customizar a inicialização da tela.
            customizationService.callEvent('mpd.portalreg', 'initEvent', controller);
        }
        
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on('scope:on-load-portal-configur-detail', function (event, portalConfigur) {
            controller.init(portalConfigur);
        });
    }
     
    // **************************************************************************************
	// *** CONTROLLER - DETAIL
	// **************************************************************************************
    
    portalRegDetailController.$inject = ['$rootScope', 
                                         '$scope', 
                                         '$stateParams', 
                                         '$state',
                                         'totvs.app-main-view.Service', 
                                         'mpd.portalreg.Service', 'TOTVSEvent'];
    function portalRegDetailController($rootScope, $scope, $stateParams, $state,
                                        appViewService, portalRegService, TOTVSEvent) {
        var controller = this;

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        this.model = {}; // mantem o conteudo do registro em detalhamento
        this.father = $stateParams.idPortalConfigur;
        
        this.itemHide = true;
        this.condPagHide = true;
        this.tbPrecoHide = true;
        this.tpOperacaoHide = true;
		this.canalVendaHide = true;
        this.referHide = true;
                
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        // metodo para a ação de remover
        this.onRemove = function() {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titlo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar

                        // chama o metodo de remover registro do service
                        portalRegService.deleteRecord(controller.model ['idi-seq'], controller.model['idi-seq-reg'], function(result) {
                            if (result) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-reg'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-reg') + ': '
                                        + controller.model['idi-seq-reg'] + ', ' +
                                        $rootScope.i18n('l-success-deleted') + '!'
                                });
                                // muda o state da tela para o state inicial, que é a lista
                                $location.path('dts/mpd/portalreg/' + controller.model['idi-seq']);
                            }
                        });
                    }
                }
            });
        }
        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {}; // zera o model
            
            // chama o servico para retornar o registro                        
            portalRegService.getRecord(this.father, id, function(value) {
                if (value) { // se houve retorno, carrega no model
                    
                    value['desc-tabela'] = value['_']['desc-tabela'];
                    //Ajustando as labels
                    if (value['cdn-cond-pag'] > 0)
                        value['cdn-cond-pag'] = value['cdn-cond-pag'] + ' - ' + value['_']['desc-cond-pagto'];
                    else
                        value['cdn-cond-pag'] = "";
                    
                    if (value['cdn-tip-ped'] > 0)
                        value['cdn-tip-ped'] = value['cdn-tip-ped'] + ' - ' + value['_']['desc-tp-operacao'];
                    else
                        value['cdn-tip-ped'] = "";

                    if (value['cod-tab-preco'] !== "")
                        value['cod-tab-preco'] = value['cod-tab-preco'] + ' - ' + value['_']['desc-tb-preco'];
					
					if (value['cdn-canal-vendas'] !== "")
                        value['cdn-canal-vendas'] = value['cdn-canal-vendas'] + ' - ' + value['_']['desc-canal-venda'];
					else
						value['cdn-canal-vendas'] = "";

                    if (value['cod-item'] == "?")
                        value['cod-item'] = "";
                    
                    controller.model = value;
                    controller.model.table = $stateParams.table;                    
                }              
            });
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function() {

            if (appViewService.startView($rootScope.i18n('l-portal-reg'), 'mpd.portal-reg-detail.Control', controller)) {             
                // se é a abertura da tab, implementar aqui inicialização do controller
            }
            // se houver parametros na URL
            if ($stateParams && $stateParams.id) {
                // realiza a busca de dados inicial
                this.load($stateParams.id);
            }
            
            //esconte os campos das tabelas
           if ($stateParams.table == "item"){
               this.itemHide = false;
               this.condPagHide = true;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "condPagto"){
               this.itemHide = true;
               this.condPagHide = false;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "tpOperacao"){
               this.itemHide = true;
               this.condPagHide = true;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = false;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "tbPreco" ) {
               this.itemHide = true;
               this.condPagHide = true;
               this.tbPrecoHide = false;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "canalVenda" ) {
               this.itemHide = true;
               this.condPagHide = true;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = false;
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
    }    
 
    // **************************************************************************************
	// *** CONTROLLER - EDIT
	// **************************************************************************************
    
    portalRegEditController.$inject = ['$rootScope',
                                       '$scope',
                                       '$stateParams',
                                       '$window',
                                       '$location',
                                       '$state',
                                       'totvs.app-main-view.Service', 
                                       'mpd.portalreg.Service',
                                       'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalRegEditController($rootScope, $scope, $stateParams, $window, $location, $state,
                                     appViewService, portalRegService, portalRegFactoryApi, TOTVSEvent) {
        
        var controller = this;
            
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
            
        this.model = {}; // mantem o conteudo do registro em edição/inclusão
        this.father = $stateParams.idPortalConfigur;
        this.table  = $stateParams.table;
		this.idiTipConfig = $stateParams.idiTipConfig
        this.model.dateIniFimVal = {start: '?', end: '?'};
                
        this.itemHide = true;
        this.condPagHide = true;
        this.tbPrecoHide = true;
        this.tpOperacaoHide = true;
		this.canalVendaHide = true;
        this.referHide = true;
        this.hideTab = true;
        this.disableSave = false;
                
        // *********************************************************************************
        // *** Methods
        // *********************************************************************************
        
        // metodo de leitura do regstro
        this.load = function(id) {
            this.model = {};
            
            portalRegService.getRecord(this.father, id, function(result) {
                // carrega no model
                controller.model = result;
                
                //Carregando a data no daterange
                controller.model.dateIniFimVal = {start: controller.model['dat-livre-3'], end: controller.model['dat-livre-4']};
                
                if (controller.model['cod-refer'])
                    controller.referHide = false;
                else
                    controller.referHide = true;
            });            
        }
        
        this.save = function(){
            // verificar se o formulario tem dados invalidos
            if (this.isInvalidForm()) {
                return;
            }
            
            this.model['idi-seq'] = this.father;
            if (this.model.dateIniFimVal != undefined){
                this.model['dat-livre-3'] = this.model.dateIniFimVal.start;
                this.model['dat-livre-4'] = this.model.dateIniFimVal.end;                
            }
            
            //Insere valor da tabela
            if ($stateParams.table == "item"){
                this.model['cod-tabela'] = "item";
            } else if ($stateParams.table == "condPagto"){
                this.model['cod-tabela'] = "cond-pagto";
            } else if ($stateParams.table == "tpOperacao"){
                this.model['cod-tabela'] = "tp-operacao";
            } else if ($stateParams.table == "tbPreco" ) {
                this.model['cod-tabela'] = "tb-preco";
            } else if ($stateParams.table == "canalVenda" ) {
                this.model['cod-tabela'] = "canal-venda";
            }
                        
            // se for a tela de edição, faz o update
            if ($state.is('dts/mpd/portalreg.edit')) {      
                
                portalRegService.updateRecord(this.model['idi-seq'],this.model['idi-seq-reg'], this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(false, result);
                });
            } else { // senão faz o create
                
                portalRegService.saveRecord(this.model, function(result) {
                    // se gravou o registro com sucesso
                    controller.onSaveUpdate(false, result);
                });
            } 
        }
        
        // metodo para notificar o usuario da gravaçao do registro com sucesso
        this.onSaveUpdate = function(isUpdate, result) {
            
            if (result.$hasError == true) return;
            
            // redireciona a tela para a tela de detalhar
            controller.model = result;
            if (isUpdate){
                controller.redirectToDetail();
            } else {
                controller.redirectToInit();
            }

            // notifica o usuario que conseguiu salvar o registro
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-reg'),
                detail: $rootScope.i18n('l-reg') + ' ' +
                (isUpdate ? $rootScope.i18n('l-success-updated') : $rootScope.i18n('l-success-created')) + '!'
            });            
        }
        // metodo para a ação de cancelar
        this.cancel = function() {
            // solicita que o usuario confirme o cancelamento da edição/inclusão
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) { // se confirmou, navega para a pagina anterior
                        $window.history.back();
                    }
                }
           });
        }
        
       // metodo para verificar se o formulario é invalido
       this.isInvalidForm = function() {

           var messages = [];
           var isInvalidForm = false;

           // se for invalido, monta e mostra a mensagem
           if (isInvalidForm) {
               var warning = $rootScope.i18n('l-field');
               if (messages.length > 1) {
                   warning = $rootScope.i18n('l-fields');
               }
               angular.forEach(messages, function(item) {
                   warning = warning + ' ' + $rootScope.i18n(item) + ',';
               });
               if (messages.length > 1) {
                   warning = warning + ' ' + $rootScope.i18n('l-requireds');
               } else {
                   warning = warning + ' ' + $rootScope.i18n('l-required');
               }
               $rootScope.$broadcast(TOTVSEvent.showNotification, {
                   type: 'error',
                   title: $rootScope.i18n('l-attention'),
                   detail: warning
               });
               return isInvalidForm;
           }
		   
		   if (!this.itemHide && (!this.model.dateIniFimVal || (this.model.dateIniFimVal.start == null || this.model.dateIniFimVal.end == null))){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-dat-valid-inf-it')
				});
				
				isInvalidForm = true;
		   }

           return isInvalidForm;
       }
       
       //redireciona para a tela detalhar
       this.redirectToDetail = function() {           
           $location.path('dts/mpd/portalreg/detail/' + this.model['idi-seq'] + '/' + this.model['idi-seq-reg']);
       }
       
       //redireciona para a tela inicial
       this.redirectToInit = function() {
           //$location.path('dts/mpd/portalreg/' + this.model['idi-seq']);
           $window.history.back();
       }
       
       this.onChangeItem = function(codItem){
           
           controller.model['cod-refer'] = "";
           
           if (codItem == null || codItem == undefined){
               controller.referHide = true;
           } else {
               
               if (codItem == ""){
                   codItem = " ";
               }
               
               portalRegFactoryApi.getRef({itCodigo: codItem}, function(result){

                   controller.referHide = result.lControle;
               });
           }
       }
       
       this.disableSave = function(value){
           
           if (value == 2){
               var buttonSave = $(":button");
               buttonSave.each(function(column,inputObj){
                   var button = $(inputObj);
                   if(button.attr('ng-click') == 'controller.save();'){
                       button.attr('style','display: none;');
                   }
               });
           } else {
               var buttonSave = $(":button");
               buttonSave.each(function(column,inputObj){
                   var button = $(inputObj);
                   if(button.attr('ng-click') == 'controller.save();'){
                       button.attr('style','display:');
                   }
               });
           }
        }
       
       // *********************************************************************************
       // *** Control Initialize
       // *********************************************************************************

       this.init = function() {
           
           if (appViewService.startView($rootScope.i18n('l-portal-reg'), 'mpd.portal-reg-edit.Control', controller)) {
                // se é a abertura da tab, implementar aqui inicialização do controller            
           }

           // se houver parametros na URL
           if ($stateParams && $stateParams.id) {
               // realiza a busca de dados inicial
           this.load($stateParams.id);
           } else { // se não, incica com o model em branco (inclusão)
               this.model = {};
           }
            
           // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave        
           this.idDisabled = $state.is('dts/mpd/portalreg.edit');

           if (this.idDisabled) {
               this.title = $rootScope.i18n('l-editar');
               this.hideTab = true;
           } else {
               this.title = $rootScope.i18n('l-novo-registro');
               this.hideTab = false;
           }
           
           //esconte os campos das tabelas
           if ($stateParams.table == "item"){
               this.itemHide = false;
               this.condPagHide = true;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "condPagto"){
               this.itemHide = true;
               this.condPagHide = false;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "tpOperacao"){
               this.itemHide = true;
               this.condPagHide = true;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = false;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "tbPreco" ) {
               this.itemHide = true;
               this.condPagHide = true;
               this.tbPrecoHide = false;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = true;
           } else if ($stateParams.table == "canalVenda" ) {
               this.itemHide = true;
               this.condPagHide = true;
               this.tbPrecoHide = true;
               this.referHide = true;
               this.tpOperacaoHide = true;
			   this.canalVendaHide = false;
           }
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
        
    // **************************************************************************************
	// *** CONTROLLER - ADVANCED SEARCH
	// **************************************************************************************
    
    portalRegSearchController.$inject = ['$modalInstance', 'model'];
    function portalRegSearchController ($modalInstance, model) {
        
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
    
    // **************************************************************************************
	// *** CONTROLLER - Adiciona itens
	// **************************************************************************************
    
    portalRegInclAdvanItemController.$inject = ['$rootScope',
                                                '$scope',
                                                '$stateParams',
                                                '$window',
                                                '$location',
                                                '$state',
                                                'totvs.app-main-view.Service',
                                                'mpd.portalreg.Service',
                                                'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalRegInclAdvanItemController($rootScope, $scope, $stateParams, $window, $location, $state,
                                              appViewService, portalRegService, portalRegFactoryApi, TOTVSEvent) {
        
        var controller = this;
            
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        
        this.listResult = [];  // array que mantem a lista de registros    
        this.inclAdvanItemFilter = {};         
        
		this.inclAdvanItemFilter.idiSeq = $stateParams.idPortalConfigur;
        this.inclAdvanItemFilter.typeFilter = 1;
        this.inclAdvanItemFilter.tbPreco = ""
        this.inclAdvanItemFilter.codItemIni = "";
        this.inclAdvanItemFilter.codItemFin = "ZZZZZZZZZZZZZZZZ";
        this.inclAdvanItemFilter.codReferIni = "";
        this.inclAdvanItemFilter.codReferFin = "ZZZZZZZZ";
        this.inclAdvanItemFilter.fmCodigoIni = "";
        this.inclAdvanItemFilter.fmCodigoFin = "ZZZZZZZZ";
        this.inclAdvanItemFilter.fmCodComIni = "";
        this.inclAdvanItemFilter.fmCodComFin = "ZZZZZZZZ";
        this.totalRecords = 0;
        this.disableTbPreco = false;
        this.dtIni = new Date();
        this.dtFim = 4102365600000;
        this.titleTable = $rootScope.i18n('l-item-disp-inclu');
        this.labelButtonExec = $rootScope.i18n('l-incl-itens-selec');
        this.classBtApliFilter = "class='col-lg-12 col-md-12 col-sm-12 col-xs-12'";
        this.classBtIncItens = "class='col-lg-6 col-md-6 col-sm-12 col-xs-12'";
        this.iconeFilter = "glyphicon glyphicon-chevron-down";
        this.iconeIncExcl = "glyphicon glyphicon-plus";        
        
        this.dateIniFimVal= {start: this.dtIni, end: this.dtFim};
		
		this.loadData = function(){			
            
            this.totalRecords = 0;            
            this.inclAdvanItemFilter.pMax   = 50;
            this.inclAdvanItemFilter.pStart = 0;
            this.inclAdvanItemFilter.pStart = controller.listResult.length;
            
            this.inclAdvanItemFilter.dtValIni = controller.dateIniFimVal.start;
            this.inclAdvanItemFilter.dtValFin = controller.dateIniFimVal.end;
            
            obj = {
                ttParamSearchItem: this.inclAdvanItemFilter,
                ttItem: controller.listResult
            };
            
            portalRegFactoryApi.searchItem({},obj, function(result){
                
                controller.listResult = [];
                
                if (result){
                    
                    angular.forEach(result, function (value) {
                        
                        //value['desc_item'] = value['it_codigo'] + ' - ' + value['desc_item'];
                        
                        if (value.totalRecords != 0)
                            controller.totalRecords = value.totalRecords;
                        
                        if (controller.inclAdvanItemFilter.typeFilter == 1){
                            value.dt_val_ini = controller.dateIniFimVal.start;
                            value.dt_val_fim = controller.dateIniFimVal.end;                            
                        }                        
                            
                        controller.listResult.push(value);
                    });
                }
           });
        }
        
        this.filter = function (isMore){
            
            this.iconeFilter = "glyphicon glyphicon-chevron-right"
            
            if (!isMore) {
                controller.listResult = [];
            }
            
            if (   this.inclAdvanItemFilter.tbPreco    == "" 
                && this.inclAdvanItemFilter.codItemIni  == ""
                && this.inclAdvanItemFilter.codItemFin  == "ZZZZZZZZZZZZZZZZ"
                && this.inclAdvanItemFilter.codReferIni == ""
                && this.inclAdvanItemFilter.codReferFin == "ZZZZZZZZ"
                && this.inclAdvanItemFilter.fmCodigoIni == ""
                && this.inclAdvanItemFilter.fmCodigoFin == "ZZZZZZZZ"
                && this.inclAdvanItemFilter.fmCodComIni == ""
                && this.inclAdvanItemFilter.fmCodComFin == "ZZZZZZZZ"){
                
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question', // titulo da mensagem
                    text: $rootScope.i18n('l-confirm-filter-item'), // texto da mensagem
                    cancelLabel: 'l-no', // label do botão cancelar
                    confirmLabel: 'l-yes', // label do botão confirmar
                    callback: function(isPositiveResult) { // função de retorno
                        if (isPositiveResult) { // se foi clicado o botão confirmar
                            controller.loadData();
                        }
                    }
                });                
            } else {
                controller.loadData();
            }
        }
        
        this.changeTypeFilter = function(){
            if (this.inclAdvanItemFilter.typeFilter == 2) {
                this.disableFields = true;
                this.titleTable = $rootScope.i18n('l-item-disp-excl');
                this.labelButtonExec = $rootScope.i18n('l-excl-itens-selec');
                this.classBtApliFilter = "class='col-lg-6 col-md-6 col-sm-12 col-xs-12'";
                this.classBtIncItens = "class='col-lg-12 col-md-12 col-sm-12 col-xs-12'";
                this.iconeIncExcl = "glyphicon glyphicon-trash";
            } else{
                this.disableFields = false;
                this.titleTable = $rootScope.i18n('l-item-disp-inclu');
                this.labelButtonExec = $rootScope.i18n('l-incl-itens-selec');
                this.classBtApliFilter = "class='col-lg-12 col-md-12 col-sm-12 col-xs-12'";
                this.classBtIncItens = "class='col-lg-6 col-md-6 col-sm-12 col-xs-12'";
                this.iconeIncExcl = "glyphicon glyphicon-plus";
            }
            
            controller.listResult = [];
            this.totalRecords = 0;
            this.inclAdvanItemFilter.tbPreco = "";
            this.dtIni = new Date();
            this.dtFim = 4102365600000;        
            this.dateIniFimVal= {start: this.dtIni, end: this.dtFim};
        }
        
        this.changeDate = function(value, typeFilter){
            
            if (typeFilter == 1){
                angular.forEach(value, function (result) {
                    result.dt_val_ini = controller.dateIniFimVal.start;
                    result.dt_val_fim = controller.dateIniFimVal.end;
                });
            }
        }
        
        this.exec = function(){
            
            controller.listResultSelected = [];
            
            angular.forEach(controller.listResult, function (value) {
                if (value.$selected)
                    controller.listResultSelected.push(value);                
            });
            
            if (controller.listResultSelected.length != 0){
                            
                obj = {
                    ttParamSearchItem: this.inclAdvanItemFilter,
                    ttItem: controller.listResultSelected
                };
                
                if (controller.inclAdvanItemFilter.typeFilter == 1) {
                    
                    if (controller.dateIniFimVal.start == null || controller.dateIniFimVal.end == null){
                         $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: $rootScope.i18n('l-attention'),
                            detail: $rootScope.i18n('l-dat-valid-inf')
                        });
                        
                    } else {
                        portalRegFactoryApi.createRecordInclAdvanItem({},obj, function(result){
                            if (result) {
                                controller.listResult = [];
                                controller.loadData();
                            }
                        });
                    }
                } else {
                    portalRegFactoryApi.deleteRecordInclAdvanItem({},obj, function(result){
                        if (result) {
                            controller.listResult = [];
                            controller.loadData();
                        }
                    });
                }
            } else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-nenhum-registro-selecionado')
                });
            }
        }
        
        this.changeIcon = function(value){
                        
            if (value == false){
                this.iconeFilter = "glyphicon glyphicon-chevron-down"
            } else {                
                this.iconeFilter = "glyphicon glyphicon-chevron-right"
            }                
        }
    }
    
    // **************************************************************************************
	// *** CONTROLLER - Adiciona Condição de Pagamentos
	// **************************************************************************************
    
    portalRegInclAdvanCondPagtoController.$inject = ['$rootScope',
                                                     '$scope',
                                                     '$stateParams',
                                                     '$window',
                                                     '$location',
                                                     '$state',
                                                     'totvs.app-main-view.Service',
                                                     'mpd.portalreg.Service',
                                                     'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalRegInclAdvanCondPagtoController($rootScope, $scope, $stateParams, $window, $location, $state,
                                                   appViewService, portalRegService, portalRegFactoryApi, TOTVSEvent) {
                              
        var controller = this;
            
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        
        this.listResult = [];  // array que mantem a lista de registros    
        this.typeFilter = 1;
        this.totalRecords = 0;
        this.labelButtonExec = $rootScope.i18n('l-incl-cond-pagto-selec');
        this.titleTable = $rootScope.i18n('l-cond-pagto-disp-inclu');
        this.iconeIncExcl = "glyphicon glyphicon-plus";
                
        this.loadData = function(){
            
            this.totalRecords = 0;
            
            portalRegFactoryApi.getCondPagto({idiSeq: $stateParams.idPortalConfigur, typeFilter: controller.typeFilter}, function(result){
                
                controller.listResult = [];
                
                if (result){
                    
                    angular.forEach(result, function (value) {
                        
                        if (value.totalRecords != 0)
                            controller.totalRecords = value.totalRecords
                        
                        controller.listResult.push(value);
                    });
                }
           });
        }
        
        this.changeTypeFilter = function(){
            
            if (this.typeFilter == 2) {
                this.titleTable = $rootScope.i18n('l-cond-pagto-disp-excl');
                this.labelButtonExec = $rootScope.i18n('l-excl-cond-pagto-selec');
                this.iconeIncExcl = "glyphicon glyphicon-trash";
            } else{
                this.titleTable = $rootScope.i18n('l-cond-pagto-disp-inclu');
                this.labelButtonExec = $rootScope.i18n('l-incl-cond-pagto-selec');
                this.iconeIncExcl = "glyphicon glyphicon-plus";
            }
            
            controller.listResult = [];
            this.totalRecords = 0;
            this.search = "";            
        }
        
        this.selectAll = function(selected, list){
            angular.forEach(list, function (value) {
                    value.$selected = selected;            
            });
        }
        
        this.exec = function(){
            
            ttCondPagto = [];
            
            angular.forEach(controller.listResult, function (value) {
                if (value.$selected)
                    ttCondPagto.push(value);
            });
            
            if (ttCondPagto.length != 0){
                            
                portalRegFactoryApi.postInclExclCondPagto({idiSeq: $stateParams.idPortalConfigur, typeFilter: this.typeFilter},ttCondPagto, function(result){
                    if (result) {
                        controller.listResult = [];
                        controller.loadData();
                    }
                });
            } else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-nenhum-registro-selecionado')
                });
            }
        }                
    }

    // **************************************************************************************
	// *** CONTROLLER - Adiciona Tipos de Operação
	// **************************************************************************************
        
    portalRegInclAdvanTpOperacaoController.$inject = ['$rootScope',
                                                     '$scope',
                                                     '$stateParams',
                                                     '$window',
                                                     '$location',
                                                     '$state',
                                                     'totvs.app-main-view.Service',
                                                     'mpd.portalreg.Service',
                                                     'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalRegInclAdvanTpOperacaoController($rootScope, $scope, $stateParams, $window, $location, $state,
                                                   appViewService, portalRegService, portalRegFactoryApi, TOTVSEvent) {
        
                            
        var controller = this;
            
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        
        this.listResult = [];  // array que mantem a lista de registros    
        this.typeFilter = 1;
        this.totalRecords = 0;
        this.labelButtonExec = $rootScope.i18n('l-add-operation-type');
        this.titleTable = $rootScope.i18n('l-tp-oper');
        this.iconeIncExcl = "glyphicon glyphicon-plus";
                                    
        this.loadData = function(){
            
            this.totalRecords = 0;
            
            portalRegFactoryApi.getTpOperacao({idiSeq: $stateParams.idPortalConfigur, typeFilter: controller.typeFilter}, function(result){
                
                controller.listResult = [];
                
                if (result){
                    
                    angular.forEach(result, function (value) {
                        
                        if (value.totalRecords != 0)
                            controller.totalRecords = value.totalRecords
                        
                        controller.listResult.push(value);
                    });
                }
           });
        }
        
        this.changeTypeFilter = function(){
            
            if (this.typeFilter == 2) {
                this.titleTable = $rootScope.i18n('Tipo de Operação');
                this.labelButtonExec = $rootScope.i18n('Tipo de Operação');
                this.iconeIncExcl = "glyphicon glyphicon-trash";
            } else{
                this.titleTable = $rootScope.i18n('Tipo de Operação');
                this.labelButtonExec = $rootScope.i18n('Tipo de Operação');
                this.iconeIncExcl = "glyphicon glyphicon-plus";
            }
            
            controller.listResult = [];
            this.totalRecords = 0;
            this.search = "";            
        }
        
        this.selectAll = function(selected, list){
            angular.forEach(list, function (value) {
                    value.$selected = selected;            
            });
        }
        
        this.exec = function(){
            
            ttTpOperacao = [];
            
            angular.forEach(controller.listResult, function (value) {
                if (value.$selected)
                    ttTpOperacao.push(value);
            });
            
            if (ttTpOperacao.length != 0){
                            
                portalRegFactoryApi.postInclExclTpOperacao({idiSeq: $stateParams.idPortalConfigur, typeFilter: this.typeFilter},ttTpOperacao, function(result){
                    if (result) {
                        controller.listResult = [];
                        controller.loadData();
                    }
                });
            } else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-nenhum-registro-selecionado')
                });
            }
        }
        
        
    }
    
    // **************************************************************************************
	// *** CONTROLLER - Adiciona Tabelas de Preços
	// **************************************************************************************
    
    portalRegInclAdvanTbPrecoController.$inject = ['$rootScope',
                                                   '$scope',
                                                   '$stateParams',
                                                   '$window',
                                                   '$location',
                                                   '$state',
                                                   'totvs.app-main-view.Service',
                                                   'mpd.portalreg.Service',
                                                   'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalRegInclAdvanTbPrecoController($rootScope, $scope, $stateParams, $window, $location, $state,
                                                 appViewService, portalRegService, portalRegFactoryApi, TOTVSEvent) {
        
        var controller = this;
            
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        
        this.listResult = [];  // array que mantem a lista de registros    
        this.typeFilter = 1;
        this.totalRecords = 0;
        this.labelButtonExec = $rootScope.i18n('l-incl-tb-preco-selec');
        this.titleTable = $rootScope.i18n('l-tb-preco-disp-inclu');
        this.iconeIncExcl = "glyphicon glyphicon-plus";
                
        this.loadData = function(){
            
            this.totalRecords = 0;
            
            portalRegFactoryApi.getTbPreco({idiSeq: $stateParams.idPortalConfigur, typeFilter: controller.typeFilter}, function(result){
                
                controller.listResult = [];
                
                if (result){
                    
                    angular.forEach(result, function (value) {
                        
                        if (value.totalRecords != 0)
                            controller.totalRecords = value.totalRecords
                        
                        controller.listResult.push(value);
                    });
                }
           });
        }
        
        this.changeTypeFilter = function(){
            if (this.typeFilter == 2) {
                this.titleTable = $rootScope.i18n('l-tb-preco-disp-excl');
                this.labelButtonExec = $rootScope.i18n('l-excl-tb-preco-selec');
                this.iconeIncExcl = "glyphicon glyphicon-trash";
            } else{
                this.titleTable = $rootScope.i18n('l-tb-preco-disp-inclu');
                this.labelButtonExec = $rootScope.i18n('l-incl-tb-preco-selec');
                this.iconeIncExcl = "glyphicon glyphicon-plus";
            }
            
            controller.listResult = [];
            this.totalRecords = 0;
            this.search = "";            
        }
        
        this.selectAll = function(selected, list){
            angular.forEach(list, function (value) {
                    value.$selected = selected;            
            });
        }
        
        this.exec = function(){
            ttTbPreco = [];
            
            angular.forEach(controller.listResult, function (value) {
                if (value.$selected)
                    ttTbPreco.push(value);
            });
            
            if (ttTbPreco.length != 0){
                            
                portalRegFactoryApi.postInclExclTbPreco({idiSeq: $stateParams.idPortalConfigur, typeFilter: this.typeFilter},ttTbPreco, function(result){
                    if (result) {
                        controller.listResult = [];
                        controller.loadData();
                    }
                });
            } else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-nenhum-registro-selecionado')
                });
            }
        }
    }
	
	// **************************************************************************************
	// *** CONTROLLER - Adiciona Canal de Venda
	// **************************************************************************************
    
    portalRegInclAdvanCanalVendaController.$inject = ['$rootScope',
                                                      '$scope',
                                                      '$stateParams',
                                                      '$window',
                                                      '$location',
                                                      '$state',
                                                      'totvs.app-main-view.Service',
                                                      'mpd.portalreg.Service',
                                                      'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalRegInclAdvanCanalVendaController($rootScope, $scope, $stateParams, $window, $location, $state,
                                                    appViewService, portalRegService, portalRegFactoryApi, TOTVSEvent) {
        
        var controller = this;
            
        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        
        this.listResult = [];  // array que mantem a lista de registros    
        this.typeFilter = 1;
        this.totalRecords = 0;
        this.labelButtonExec = $rootScope.i18n('l-incl-canal-venda-selec');
        this.titleTable = $rootScope.i18n('l-canal-venda-disp-inclu');
        this.iconeIncExcl = "glyphicon glyphicon-plus";
                
        this.loadData = function(){
			            
            this.totalRecords = 0;
            
            portalRegFactoryApi.getCanalVenda({idiSeq: $stateParams.idPortalConfigur, typeFilter: controller.typeFilter}, function(result){
				                
                controller.listResult = [];
                
                if (result){
                    
                    angular.forEach(result, function (value) {
                        
                        if (value.totalRecords != 0)
                            controller.totalRecords = value.totalRecords
                        
                        controller.listResult.push(value);
                    });
                }
           });
        }
        
        this.changeTypeFilter = function(){
            if (this.typeFilter == 2) {
                this.titleTable = $rootScope.i18n('l-canal-venda-disp-excl');
                this.labelButtonExec = $rootScope.i18n('l-excl-canal-venda-selec');
                this.iconeIncExcl = "glyphicon glyphicon-trash";
            } else{
                this.titleTable = $rootScope.i18n('l-canal-venda-disp-inclu');
                this.labelButtonExec = $rootScope.i18n('l-incl-canal-venda-selec');
                this.iconeIncExcl = "glyphicon glyphicon-plus";
            }
            
            controller.listResult = [];
            this.totalRecords = 0;
            this.search = "";            
        }
        
        this.selectAll = function(selected, list){
            angular.forEach(list, function (value) {
                    value.$selected = selected;            
            });
        }
        
        this.exec = function(){
            ttCanalVenda = [];
            
            angular.forEach(controller.listResult, function (value) {
                if (value.$selected)
                    ttCanalVenda.push(value);
            });
            
            if (ttCanalVenda.length != 0){
                            
                portalRegFactoryApi.postInclExclCanalVenda({idiSeq: $stateParams.idPortalConfigur, typeFilter: this.typeFilter},ttCanalVenda, function(result){
                    if (result) {
                        controller.listResult = [];
                        controller.loadData();
                    }
                });
            } else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-nenhum-registro-selecionado')
                });
            }
        }
    }
    
    // **************************************************************************************
	// *** CONTROLLER - Copy
	// **************************************************************************************
    
    portalRegCopyController.$inject = ['modalParams', '$modalInstance', '$filter', 'mpd.fchdis0028.FactoryApi', 'TOTVSEvent'];
    function portalRegCopyController (modalParams, $modalInstance, $filter, portalRegFactoryApi, TOTVSEvent) {
         
        var controller = this;
        this.idDisabledBtnCopy = true;
        this.checkItem = true;
        this.checkCondPagto = true;
        this.checkTpOperacao = true;
		this.checkCanalVenda = true;
        this.checkTbPreco = true;
        
        this.myParams = angular.copy(modalParams);
        
        this.changeZoomConfigClienRep = function(idPortalConfigur){
            
            if (controller.idPortalConfigur > 0)
                controller.idDisabledBtnCopy = false;
            else
                controller.idDisabledBtnCopy = true;
        }
        
        // ação de pesquisar
        this.confirm = function () {
            
            portalRegFactoryApi.postPortalRegCopy({idiPortalConfigurCopy: controller.idPortalConfigur, idiPortalConfigurNew: controller.myParams.idPortalConfigur, checkItem: controller.checkItem, checkCondPagto: controller.checkCondPagto, checkTbPreco: controller.checkTbPreco, checktpOperacao: controller.checkTpOperacao, checkCanalVenda: controller.checkCanalVenda}, function(result){
                // close é o fechamento positivo
                $modalInstance.close();
            });
        }
         
        // ação de fechar
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }
        
        if (this.myParams.idiTipConfig == 1) {
            controller.hideTbPreco     = true;
            controller.checkTbPreco    = false;
            controller.hideTpOperacao  = true;
            controller.checkTpOperacao = false;
			controller.hideCanalVenda  = true;
            controller.checkCanalVenda = false;
        } else {
            controller.hideTbPreco = false;
            controller.checkTbPreco = true;
            controller.checkTpOperacao = true;
            controller.hideTpOperacao = this.myParams.copyTpOperacao;
			controller.checkCanalVenda = true;
            controller.hideCanalVenda = this.myParams.copyCanalVenda;
            
        }
    }
    
    // registrar os controllers no angular 
    index.register.controller('mpd.portal-reg-list.Control', portalRegListController);
    index.register.controller('mpd.portal-reg-edit.Control', portalRegEditController);    
    index.register.controller('mpd.portal-reg-detail.Control', portalRegDetailController);
    index.register.controller('mpd.portal-reg-search.Control', portalRegSearchController);
    index.register.controller('mpd.portal-reg-incl-advan-item.Control', portalRegInclAdvanItemController);
    index.register.controller('mpd.portal-reg-incl-advan-cond-pagto.Control', portalRegInclAdvanCondPagtoController);
    index.register.controller('mpd.portal-reg-incl-advan-tp-operacao.Control', portalRegInclAdvanTpOperacaoController);
    index.register.controller('mpd.portal-reg-incl-advan-tb-preco.Control', portalRegInclAdvanTbPrecoController);
	index.register.controller('mpd.portal-reg-incl-advan-canal-venda.Control', portalRegInclAdvanCanalVendaController);
    index.register.controller('mpd.portal-reg-copy.Controller', portalRegCopyController); 
});