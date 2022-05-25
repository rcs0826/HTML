/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    configfieldscontroller.$inject = ['$rootScope', '$timeout','$filter','$stateParams', 'totvs.app-main-view.Service', 'mpd.fchdis0052.Factory', 'TOTVSEvent'];

    function configfieldscontroller($rootScope, $timeout, $filter, $stateParams, appViewService, fchdis0052, TOTVSEvent) {
        
        var configFieldsController = this;
        
        var i18n = $filter('i18n');

        var batch = false;

        configFieldsController.screen = "*";
        configFieldsController.configFieldsSeq    = [];              
        configFieldsController.configFieldsSeqAux = [];
        configFieldsController.tag = true;

        configFieldsController.telas = [
            {id: "*", desc: i18n("Todas"), grupos: [0]},
            {id: "ped-venda-add", desc: i18n("1 - Inclusão de Pedido"), grupos: [0,1,2,3,4,5,6,7]},
            {id: "ped-venda-edit", desc: i18n("2 - Alteração de Cabeçalho"), grupos: [0,1,2,3,4,5,6,7]},
            {id: "ped-item-add-edit", desc: i18n("3 - Inclusão/Alteração de Item"), grupos: [0,8,9,10,11,12,13,14]},
            {id: "ped-item-child", desc: i18n("4 - Inclusão de Item Filho"), grupos: [0,8,9,10]},
            {id: "ped-item-fastadd", desc: i18n("5 - Inclusão rápida de Item"), grupos: [0,8,9,10,11,12,13,14]},
            {id: "ped-item-grid", desc: i18n("6 - Grade de itens do pedido"), grupos: [0]},
            {id: "ped-item-search", desc: i18n("7 - Pesquisa de produtos"), grupos: [0]},
            {id: "pd4000", desc: i18n("8 - Tela do Pedido"), grupos: [0,15,16,17,18]},
            {id: "carteira-pedidos", desc: i18n("9 - Carteira de Pedidos"), grupos: [0,19]}
        ];

        configFieldsController.grupo = 0;
        configFieldsController.grupos = [{id: 0, desc: i18n("Todos")}];    
        configFieldsController.todosGrupos = [
            i18n("Todos"),
            i18n("Informações Básicas"),
            i18n("Informações de Preço"),
            i18n("Informações de Entrega"),
            i18n("Informações de Atendimento"),
            i18n("Informações Complementares"),
            i18n("Informações de Vendor"),
            i18n("Observações"),
            i18n("Identificação do Item"),
            i18n("Quantidade"),
            i18n("Preço"),
            i18n("Dados Fiscais"),
            i18n("Atendimento"),
            i18n("Outros Dados"),
            i18n("Descontos"),
            i18n("Ações do Pedido"),
            i18n("Informações do Pedido"),
            i18n("Ações de Item"),
            i18n("Abas do Pedido"),
            i18n("Ações do Pedido")
        ];        

        configFieldsController.sim = i18n('Sim');

        configFieldsController.orderFields = [];

        configFieldsController.loadData = function() {
            fchdis0052.getConfigurationsFields ({
                idiSeq: $stateParams.idiSeq
            },function (data) {
                configFieldsController.orderFields = data.ttOrderConfigurationFields;
                configFieldsController.registro = data.registro;
                $timeout(function () {
                    configFieldsController.orderFieldsGrid.dataSource.sort([
                        {field: 'tabela', dir: 'asc'},
                        {field: 'grupo', dir: 'asc'},
                        {field: 'seq', dir: 'asc'}
                    ]);
                });

            })

        }
        
        configFieldsController.save = function() {
            
            let canSave  = true;   
            let oldValue = false;
                                                   
            for (var i = 0; i < configFieldsController.fieldGridDirtyItems.length; i++) {
                
                for (var j = 0; j < configFieldsController.configFieldsSeq.length; j++) {
                    if(configFieldsController.configFieldsSeq[j]['seq'] == configFieldsController.fieldGridDirtyItems[i]['seq']
                    && configFieldsController.configFieldsSeq[j]['cod-tabela'] == configFieldsController.fieldGridDirtyItems[i]['cod-tabela']
                    && configFieldsController.configFieldsSeq[j]['grupo'] == configFieldsController.fieldGridDirtyItems[i]['grupo']){                                                                        
                        oldValue = true;
                    }
                }
                                                              
                for (var j = 0; j < configFieldsController.configFieldsSeqAux.length; j++) {

                    if(configFieldsController.configFieldsSeqAux[j]['seq'] == configFieldsController.fieldGridDirtyItems[i]['seq']
                    && configFieldsController.configFieldsSeqAux[j]['cod-tabela'] == configFieldsController.fieldGridDirtyItems[i]['cod-tabela']
                    && configFieldsController.configFieldsSeqAux[j]['grupo'] == configFieldsController.fieldGridDirtyItems[i]['grupo']){                                                
                        canSave = false;                        
                    }                                        
                }                                                                
            };
            
            if(canSave || oldValue){                
                fchdis0052.saveConfigurationsFields ({
                    idiSeq: $stateParams.idiSeq
                }, configFieldsController.fieldGridDirtyItems, function (data) {
                    configFieldsController.loadData();
                })
            }else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('As sequências dos campos não podem ser repetidas para o mesmo grupo!')
				});
            }
            
        }

        configFieldsController.remover = function (dataItem) {
            dataItem.set('["configurado"]', i18n('Remover'));
        }

        configFieldsController.itemsGridEdit = function (event, column) {

            var valor = {
                'grupo': event.model.grupo,
                'seq': event.model.seq,
                'cod-tabela': event.model['cod-tabela']
            }
			
			var indexOfStevie = -1;
			for (var i = 0; i < configFieldsController.configFieldsSeq.length; ++i) {
				if (configFieldsController.configFieldsSeq[i].seq === valor['seq'] && configFieldsController.configFieldsSeq[i].grupo === valor['grupo'] && configFieldsController.configFieldsSeq[i]['cod-tabela'] === valor['cod-tabela']) {
					indexOfStevie = i;
					break;
				}
			}
                        
            if (indexOfStevie === -1){                
                configFieldsController.configFieldsSeq.push(valor);
            }     
            
            if(configFieldsController.tag){                
                for (var j = 0; j < configFieldsController.orderFields.length; j++) {
                    configFieldsController.configFieldsSeqAux.push(
                        {   'grupo': configFieldsController.orderFields[j]['grupo'],
                            'seq': configFieldsController.orderFields[j]['seq'],
                            'cod-tabela': configFieldsController.orderFields[j]['cod-tabela']
                        }
                    );
                }
                configFieldsController.tag = false;
            }
                                                                            
            if ((column.column == "editavel" && event.model.editavel == 0) |
                (column.column == "seq"      && event.model.seq      == 0)) {
                configFieldsController.orderFieldsGrid.closeCell();
                configFieldsController.orderFieldsGrid.table.focus();
            }
        }

        configFieldsController.filtraTela = function () {

            var grupos = []

            for (var i = 0; i < configFieldsController.telas.length; i++) {
                var tela = configFieldsController.telas[i];
                if (tela.id == configFieldsController.screen) {
                    for (var j = 0; j < tela.grupos.length; j++) {
                        grupos.push ({
                            id: tela.grupos[j],
                            desc: configFieldsController.todosGrupos[tela.grupos[j]]
                        });
                    }
                }
            }

            configFieldsController.grupos = grupos;
            configFieldsController.grupo = 0;

            configFieldsController.search();    
        }

        configFieldsController.search = function () {

            var filters = [];
            if (configFieldsController.quickSearchText) {
                filters.push(
                    {field: "campo", operator: 'contains', value: configFieldsController.quickSearchText }
                );
            }

            if (configFieldsController.screen != "*") {
                filters.push(
                    {field: "['cod-tabela']", operator: 'equals', value: configFieldsController.screen }
                );
            }

            if (configFieldsController.grupo != 0) {
                filters.push(
                    {field: "grupo", operator: 'equals', value: configFieldsController.grupo }
                );
            }

            if (configFieldsController.configurado) {
                filters.push(
                    {field: "configurado", operator: 'equals', value: configFieldsController.sim }
                );
            }

            configFieldsController.orderFieldsGrid.dataSource.filter(filters);
        }

        configFieldsController.removeSelected = function () {
            batch = true;
            var remover = i18n('Remover');
            for(var i = 0; i < configFieldsController.fieldGridSelectedItems.length; i++) {
                if (configFieldsController.fieldGridSelectedItems[i]['configurado'] == configFieldsController.sim) {
                    configFieldsController.fieldGridSelectedItems[i].set('["configurado"]', remover);
                }
            }
            batch = false;
            configFieldsController.orderFieldsGrid.refresh();
        }

        configFieldsController.toogleVisible = function (visivel) {
            batch = true;
            for(var i = 0; i < configFieldsController.fieldGridSelectedItems.length; i++) {
                configFieldsController.fieldGridSelectedItems[i].set('["visivel"]', visivel);
            }
            batch = false;
            configFieldsController.orderFieldsGrid.refresh();
        }

        configFieldsController.toogleEditable = function (editavel) {
            batch = true;
            for(var i = 0; i < configFieldsController.fieldGridSelectedItems.length; i++) {
                if (configFieldsController.fieldGridSelectedItems[i].editavel > 0) {
                    configFieldsController.fieldGridSelectedItems[i].set('["editavel"]', editavel);
                }
            }
            batch = false;
            configFieldsController.orderFieldsGrid.refresh();
        }

        configFieldsController.gridoptions = {
            dataBinding: function (e) {
                if (e.action == "itemchange" && batch) e.preventDefault();
            }
        }

        appViewService.startView(i18n('Configuração PD4000'));

        configFieldsController.loadData();

        $timeout(function () {
            configFieldsController.orderFieldsGrid.hideColumn('["tabela"]');
            configFieldsController.orderFieldsGrid.hideColumn('["grupo"]');
        });

        
    }

    index.register.controller('salesorder.pd4000.config.fields.Controller', configfieldscontroller);
});

