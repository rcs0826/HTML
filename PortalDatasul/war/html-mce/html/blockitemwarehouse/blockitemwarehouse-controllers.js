define([
    'index',
    'angularAMD',	
    '/dts/mce/js/mce-utils.js',
    '/dts/mce/js/dbo/inbo/boin00881.js',  
    '/dts/mce/html/blockitemwarehouse/blockitemwarehouseAdvancedSearch-controllers.js',
    '/dts/mce/html/blockitemwarehouse/blockitemwarehouse.edit.controllers.js',
    '/dts/mce/js/api/fch/fchmat/fchmatblockitemwarehouse-services.js',
    '/dts/men/js/zoom/item.js'    
], function (index) {

    blockItemWarehouseCtrl.$inject = [
		'$rootScope', '$scope',
        'totvs.app-main-view.Service',
        'mce.boin00881.factory',
        'mce.fchmatblockitemwarwhouse.factory',
        'mce.utils.Service',
        'mce.blockitemwarehouse.modalAdvancedSearch.Service',
        '$filter',
        '$stateParams',
        'TOTVSEvent'
	];

    function blockItemWarehouseCtrl($rootScope,
        $scope,
        appViewService,
        boin00881,
        fchmatBlockItemWarehouse,
        mceUtils,
        modalAdvancedSearch,
        $filter,
        $stateParams,
        TOTVSEvent
      ) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************

        this.listofBlockItemWarehouseCount = 0;
        this.listofBlockItemWarehouse = [];
        this.disclaimers = undefined;
        this.dateTimeview = undefined;
        this.itemCode = undefined;
        this.model = [];
        this.mceUtil = mceUtils;
        this.boin00881 = boin00881;
        this.fchmatBlockItemWarehouse = fchmatBlockItemWarehouse;
        this.queryParams = {};
        var blockItemWarehouseCtrl = this;
        var controller = this;
        this.disableButtons = undefined;
        this.itemCodeCopy = "";

        var DEFAULT_DISCLAIMER = [{
            property: '',
            value: '',
            title: $rootScope.i18n('l-no-filter-informed'),
            fixed: true
        }];

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************

        
        /* Função....: removerDisclaimer
           Descrição.: Remove um filtro
           Parâmetros: disclaimer
        */
        this.removeDisclaimer = function (disclaimer) {
            var index = controller.disclaimers.indexOf(disclaimer);
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }

            controller.queryParams = controller.mountQueryForDisclaimers();            
            controller.findRecords(controller.queryParams); // busca registros conforme parâmetros          

        }

        /* Função....: mountQueryForDisclaimers
           Descrição.: Monta a query com base nos disclaimers
           Parâmetros: 
        */
        
        this.mountQueryForDisclaimers = function () {
            
            var params = {};
            
            controller.listofBlockItemWarehouse = [];
            controller.listofBlockItemWarehouseCount = 0; // zera count de resultados            

            if (controller.disclaimers.length === 0) {
                controller.disclaimers = DEFAULT_DISCLAIMER; //seta disclaimer inicial
                controller.changePlaceholder(false); 
                controller.itemCode = undefined;
            } else {
                params['properties'] = [];
                
                for (key in controller.disclaimers) {
                    var properties = {};

                    if (controller.disclaimers[key].property == 'warehouseBlock' &&
                        controller.disclaimers[key].value) {
                        properties.property = 'it-codigo';
                        properties.value = '#TODOS#';

                    } else {
                        properties.property = controller.disclaimers[key].property;
                        properties.value = controller.disclaimers[key].value;
                    }
                    
                    params.properties.push(properties);
                }
            }

            return params;
        }

        /* Função....: delete
           Descrição.: Função responsável para excluir os registros
           Parâmetros: option : SELECTED: Exlui selecionados, All: Exlui todos os registros
        */
        this.delete = function (option) {

            var listofBlockItemWarehouseDelete = [];
            var title, text;
            
            
            if(controller.disableButtons == false) {
            
            
                /* Cria lista com registros selecionados */
                controller.listofBlockItemWarehouse.forEach(function (entry) {
                    if (entry.$selected === true) {
                        listofBlockItemWarehouseDelete.push(entry);
                    }
                });


                if (option === "SELECTED") {

                    var lEmptyDelete = listofBlockItemWarehouseDelete.length === 0;  
                    if (lEmptyDelete) {

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error',
                            title: $rootScope.i18n('l-no-selected-record'),
                            detail: $rootScope.i18n('l-no-selected-record-txt')
                        });
                        return;
                    } else {
                        if(listofBlockItemWarehouseDelete.length == 1){
                            title  = $rootScope.i18n('l-remove-block-item-warehouse-question')
                            text = $rootScope.i18n('l-remove-block-item-warehouse-text');                   
                        } else {
                            title  = $rootScope.i18n('l-remove-block-items-warehouse-question')
                            text = $rootScope.i18n('l-remove-block-items-warehouse-text');
                        }
                    }

                } else {

                    title  = $rootScope.i18n('l-remove-all-block-item-warehouse-question');                
                    text = $rootScope.i18n('l-remove-all-block-item-warehouse-text');     

                }


                if (!lEmptyDelete || option === "ALL") {   

                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: title,
                        cancelLabel: 'btn-cancel',
                        confirmLabel: 'confirm',
                        text: text,
                        callback: function (isPositiveResult) {
                            if (isPositiveResult) {

                                if (option === "ALL") {

                                    controller.fchmatBlockItemWarehouse.deleteAll({}, listofBlockItemWarehouseDelete,
                                        function (result) {
                                            controller.disclaimers = DEFAULT_DISCLAIMER;
                                            controller.listofBlockItemWarehouse = [];
                                            controller.findRecords();

                                        });

                                } else {

                                    controller.fchmatBlockItemWarehouse.deleteSelected({}, listofBlockItemWarehouseDelete,
                                        function (result) {

                                            controller.listofBlockItemWarehouse = [];
                                            controller.queryParams.start = 0;
                                            controller.findRecords(controller.queryParams);

                                        });
                                }
                            }
                        }
                    });
                }
            }
        };
        
        /* Função....: changePlaceholder
           Descrição.: Função responsável mudar o placeholder do campo da tela
           Parâmetros: isAdvancedSearch => true: filtro avancado false: item
        */        
        this.changePlaceholder = function (isAdvancedSearch) {            
            if(!isAdvancedSearch){            
                $('input').attr('placeholder',$rootScope.i18n('l-item',undefined,'dts/mce'));    
            } else {
                $('input').attr('placeholder', $rootScope.i18n('l-advanced-filter-applied',undefined,'dts/mce'));      
            }    
        }
        

        /* Função....: delete
           Descrição.: Função responsável por abrir a modal de Busca Avançada
           Parâmetros:
        */
        this.openAdvancedSearch = function () {

            modalAdvancedSearch.open({
                disclaimers: controller.disclaimers
            }).then(function (result) {

                controller.itemCode = undefined;                
                controller.disclaimers = result.disclaimers;
                               angular.forEach(controller.disclaimers, function (disclaimer) {
                    //Controle para saber se tem algum filtro informado
                    if (disclaimer.value != "") {  
                        controller.changePlaceholder(true); // placeholder filtro avancado
                        controller.queryParams = controller.mountQueryForDisclaimers();
                    } else {
                        controller.changePlaceholder(false); // placeholder item
                        controller.queryParams = {};
                    }

                });

                controller.findRecords(controller.queryParams);

            });
            
            $('#item').focus(); // Seta foco no campo item ao retornar da bsuca avancada

        }
        
        /* Função....: formataHora
           Descrição.: Formata a hora para ser mostrada na tela de listagem
           Parâmetros: time - hora
        */
        this.formataHora = function (time) {
            var hh = time.substring(2, 0); // 00
            var mm = time.substring(4, 2); // 00
            var ss = time.substring(6, 4); // 00            

            return hh + ":" + mm + ":" + ss;
        }


        /* Função....: findRecords
           Descrição.: Chama a funcao findRecords na Factory da boin00881
           Parâmetros: params - objeto com os parametros para query
        */
        this.findRecords = function (params) {
            
            if (params === undefined) params = {order:'cod-estabel,cod-depos,it-codigo'};

            if (!params.hasOwnProperty('start')) {
                controller.listofBlockItemWarehouse = [];
            }

            var cont = 0;

            controller.boin00881.findRecords(params, function (result) {

                if (result[0]) {
                    controller.disableButtons = false;

                    //CONTADORES   
                    controller.totalRecords = result[0].$length;
                    controller.listofBlockItemWarehouseCount += result.length;

                    // TRATAMENTO DE CAMPOS PARA MOSTRAR NA LISTA
                    for (var i = 0; i < result.length; i++) {
                        // converte campos de data e hora    
                        result[i]['dateTimeview'] = controller.mceUtil.formatDate(result[i]['dat-inic-bloq']) + " - " + 
                                                    controller.formataHora(result[i]['hra-inic-bloq']);

                        // busca descricoes  EXTRA FIELDS   
                        result[i]['desc-item']  = result[i]['it-codigo']   + " - " + result[i]['_']['descItem'];
                        result[i]['nome-estab'] = result[i]['cod-estabel'] + " - " + result[i]['_']['nomeEstabel'];
                        result[i]['nome-depos'] = result[i]['cod-depos']   + " - " + result[i]['_']['nomeDepos'];
                        result[i]['tag']        = 1; // legenda para item bloqueado
                        
                        
                        if (result[i]['it-codigo'] === "#TODOS#") {
                            result[i]['tag']       = 2; // leganda para deposito bloqueado
                            result[i]['it-codigo'] = $scope.i18n('l-itens');
                            result[i]['desc-item'] = $scope.i18n('l-itens');
                        }

                        controller.listofBlockItemWarehouse.push(result[i]);

                    };
                } else {
                    controller.disableButtons = true;
                    controller.totalRecords   = 0;
                    controller.listofBlockItemWarehouseCount = 0;
                }
            });
        }

        /* Função....: search
           Descrição.: Funcao chamada ao selecionar registro no zoom de item 
           Parâmetros: 
        */
        this.search = function () {            
            // CONDICAO NECESSARIA PARA TRATAR DUPLICIDADE DE CHAMADAS, POIS O RETORNO DO ZOOM
            // FAZ COM QUE O METODO SEJA CHAMADO NOVAMENTE NO NG-CHANGE
            if(controller.itemCodeCopy !== controller.itemCode){
                
                controller.itemCodeCopy = angular.copy(controller.itemCode);
                
                controller.listofBlockItemWarehouseCount = 0; // zera contador de registros buscados

                controller.changePlaceholder(false); //placeholder  item

                if ((controller.queryParams != undefined) || (!controller.queryParams.hasOwnProperty('start'))) {
                    //cria objeto de parametros para query
                    controller.queryParams = {};
                }

                this.disclaimers = [];

                if (controller.itemCode === undefined || controller.itemCode === "" ){ 
                    controller.loadDefaults();

                } else {
                    // lista de propriedades
                    controller.queryParams.properties = [{
                        "property": "it-codigo",
                        "value": controller.itemCode ? controller.itemCode : ""
                    }];

                    this.disclaimers.push(this.mceUtil.parseTypeToDisclaimer('char', 'it-codigo', controller.itemCode,
                                          $scope.i18n('l-item'), false, ''));

                    controller.listofBlockItemWarehouse = []; // limpa lista
                    controller.findRecords(controller.queryParams);            
                }
            }
        }

        /* Função....: loadMore
            Descrição.: Funcao chamada ao clicar na opcao mais resultados
            Parâmetros: 
        */
        this.loadMore = function () {
            controller.queryParams.start = controller.listofBlockItemWarehouseCount;
            controller.findRecords(controller.queryParams);
        };
   
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        
        this.loadDefaults = function(){
            controller.disclaimers = DEFAULT_DISCLAIMER;
            controller.findRecords();
        }
        

        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function () {   
           
            createTab = appViewService.startView($rootScope.i18n('l-block-item-warehouse'),'mce.blockitemwarehouse.ListCtrl', controller); 
            
            previousView = appViewService.previousView;            
            
            /* Se for troca entre abas, retorna e mantém o controller */
            if(createTab === false && previousView.controller != "mce.blockitemwarehouse.editCtrl") {  
                return;
            }
            
            controller.itemCode = undefined;
            controller.loadDefaults();

        }
      

        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        	blockItemWarehouseCtrl.init();
        });
    }

    /*####################################################################################################
     # CONTROLLER: modalAdvancedSearch
     * REGISTRO..: mce.blockitemwarehouse.modalAdvancedSearch.Service
     # DESCRICAO.: Controle responsável pela abertura da Modal de Pesquisa Avançada
     ####################################################################################################*/
    modalAdvancedSearch.$inject = ['$modal'];

    function modalAdvancedSearch($modal) {

        this.open = function (params) {

            var instance = $modal.open({

                templateUrl: '/dts/mce/html/blockitemwarehouse/blockitemwarehouse.advanced.search.html',
                controller: 'mce.blockitemwarehouse.AdvacendSearch as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    parameters: function () {
                        return params;
                    }
                }

            });

            return instance.result;

        }

    }

    index.register.service('mce.blockitemwarehouse.modalAdvancedSearch.Service', modalAdvancedSearch);
    index.register.controller('mce.blockitemwarehouse.ListCtrl', blockItemWarehouseCtrl);

});