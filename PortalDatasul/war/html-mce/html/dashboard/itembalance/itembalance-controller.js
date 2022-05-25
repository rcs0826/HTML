define([
    "index",
    "angularAMD"
], function (index) {

    itembalanceController.$inject = [
        '$rootScope',
        '$scope',
        'totvs.app-main-view.Service',  
        'mce.fchmatmcetools.factory',
        'mce.fchmatitembalancewidget.factory',
        'mce.utils.Service',
        'TOTVSEvent',
        '$filter'
    ];
    
    function itembalanceController (
        $rootScope, 
        $scope,
        appViewService, 
        fchmatmceTools, 
        fchmatitembalancewidget,
        mceUtils,
        TOTVSEvent,
        $filter ) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************    

        var _self = this,
            i18n = $filter('i18n');

        _self.itemCode = "";
        _self.ttTotalWarehouseItemBalance = {};
        _self.ttSite = [];
        _self.tooltip = "<b><i>" + i18n('l-msg-dash-item-balance', [], 'dts/mce/') + "</i></b>";
        _self.selectedLine = {};
        _self.configurationShow = false;
        _self.isAllSites = false;
        _self.listOfConfigurationSites = [];

        /* Definicao das colinas do grid da tela de configuracao */
        _self.gridOptions = {
            columns: [
                {title: i18n('l-site-short', [], 'dts/mce'), field: "cod-estabel" , width: 70},
                {title: i18n('l-description', [], 'dts/mce'), field: "nome" },
                { 
                    title: "-", 
                    field: "excluir",  
                    width: 35,
                    template: '<span style="text-align: center" class="glyphicon glyphicon-remove" ng-click="controller.removeItemFromlistOfConfigurationSites(dataItem)" > </span>'
                }
            ]
        };

        // *********************************************************************************
        // *** Methods
        // ********************************************************************************* 

        /* Função....: init
           Descrição.: Carga inicial da tela
           Parâmetros:
        */
        _self.init = function () {

            if ($rootScope.isActiveDashboard) {
                _self.itemCode = $rootScope.isActiveDashboard.item;
                _self.ttSite = $rootScope.isActiveDashboard.sites;
                _self.isSingleSite = $rootScope.isActiveDashboard.isSingleSite;
                $rootScope.isActiveDashboard = undefined;
                _self.ttTotalWarehouseItemBalance = [];
                _self.search();
            } else {
                _self.load();
            }
        }

        /* Função....: load
           Descrição.: faz a busca do estabelecimento padrao do usuario
           Parâmetros:
        */
        _self.load = function () {
            fchmatmceTools.getDefaultSite({}, {}, function (result) {
                _self.isSingleSite = true;
                _self.ttSite.push(result[0]);
            });
        }

        /* Função....: search
           Descrição.: Disparada no retorno da pesquisa de itens.
                       Retorna saldo
           Parâmetros:
        */
        _self.search = function () {

            _self.ttTotalWarehouseItemBalance = [];

            fchmatitembalancewidget.getItemBalance({pItem: _self.itemCode}, _self.ttSite, function (result) {
                _self.ttTotalWarehouseItemBalance = result;
            });
        }


        /* ############ FUNCOES DA TELA DE CONFIGURACAO ############*/
        /* Função....: removeItemFromlistOfConfigurationSites
           Descrição.: Elimina estabeleciemtno da lista de estabelecimentos da tela de configuração.
           Parâmetros:
        */
        _self.removeItemFromlistOfConfigurationSites = function (dataItem) {
            // busca indice do array
            var index = mceUtils.findIndexByAttr(_self.listOfConfigurationSites, 'cod-estabel', dataItem['cod-estabel']);
            _self.listOfConfigurationSites.splice(index, 1);
        }

        /* Função....: changeSelectedSites
           Descrição.: Função executada no retorno do zoom de multimpla escolha para estabelecimentos
           Parâmetros:  Recebe uma lista de estabelecimentos
        */
        _self.changeSelectedSites = function (selectedSites) {
            _self.listOfConfigurationSites = [];

            // /quando selecionado mais de um estabelecimento, retona uma lista em objSelected
            if (selectedSites.objSelected){
                _self.listOfConfigurationSites = selectedSites.objSelected;
            } else { // quando selecionado somente um estabelecimento, retorna um objeto que é inserido na lista de estabelecimetnos.
                _self.listOfConfigurationSites.push(selectedSites);
            }

            _self.gridOptions.rowData = _self.listOfConfigurationSites;
        }

        /* Função....: applyConfig
           Descrição.: Aplica configuracoes
           Parâmetros:  
        */
        _self.applyConfig = function (){

            _self.ttSite = _self.isAllSites ? [{}] : _self.listOfConfigurationSites;

            // Faz pesquisa se existir item pesquisado
            if (_self.itemCode) {
                _self.search();
            }
            _self.isSingleSite = !(_self.ttSite.length > 1 || _self.isAllSites);
            _self.configurationShow = false;
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        if ($rootScope.currentuserLoaded) {
            _self.init();
        }

        $scope.$on ('$destroy', function () {
            if (_self.itemCode) {
                $rootScope.isActiveDashboard = {
                    item: _self.itemCode,
                    sites: _self.ttSite,
                    isSingleSite: _self.isSingleSite
                };
            }
            _self = undefined;
        });
		
		this.gridOptionsDuploClique = {
			dataBound: function (e) {
				var grid = this;
				grid.tbody.find("tr").dblclick(function (e) { /*DUPLO CLIQUE NO ITEM DO GRID*/
					 var dataItem = grid.dataItem(this);
					 location.href="#/dts/mce/ce0830/?site="
									+ dataItem['cod-estabel'] + "&itemCode="
									+ _self.itemCode + "&warehouse="
									+ dataItem['cod-depos']; 
				});
			}                
        }

    } 

    index.register.controller('mce.dashboard.itembalance.itembalanceController', itembalanceController);

});