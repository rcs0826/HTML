define([
	'index',
	'angularAMD',	
    '/dts/mce/js/zoom/deposito.js',
    '/dts/mce/js/zoom/usuar-mater.js',       
    '/dts/mce/js/mce-utils.js'    
], function (index) {

    distributeCountsCtrl.$inject = ['$rootScope', '$scope','totvs.app-main-view.Service', '$filter', '$stateParams', 'mce.deposito.zoom','mce.fchmatdistributecounts.factory', 'mce.utils.Service', 'mce.distributecounts.modalAdvancedSearch.Service', 'mce.material-usuar-1.zoom', 'mce.material-usuar-2.zoom', 'mce.material-usuar-3.zoom', 'mce.distributecounts.modalUpdateConfFilter.Service', 'mce.distributecounts.modalBlockItemWarehouse.Service', 'TOTVSEvent'];

    function distributeCountsCtrl($rootScope, $scope, appViewService, $filter, $stateParams, serviceDeposito, fchmatDistributeCounts, mceUtils, modalAdvancedSearch,serviceZoomUsuarMateriais1,serviceZoomUsuarMateriais2,serviceZoomUsuarMateriais3, modalUpdateConfFilter, modalBlockItemWarehouse, TOTVSEvent){
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
    	
    	var controller = this;
        
        
        controller.CONSTANTS = {
            'it-codigo': {start:"", end:"ZZZZZZZZZZZZZZZZ"},
            'fm-codigo': {start:"", end:"ZZZZZZZZ"},
            'ge-codigo': {start:0, end:99},
            'cod-localiz': {start:"", end:"ZZZZZZZZZZ"},
            'cod-depos': {start:"", end:"ZZZ"},
            'cod-estabel': {start:"", end:"ZZZZZ"},
            'nr-ficha':{start:0, end:9999999},
            'cod-confte-contag': {start:"", end:"ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"},   
            'lote': {start:"", end:"ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ"}  
        };
    	
    	controller.listofDistributeCountsCount = 0;
    	controller.listofDistributeCounts = [];
    	controller.disclaimers = [];
        controller.serviceDeposito = serviceDeposito;
        controller.fchmatDistributeCounts = fchmatDistributeCounts;
        controller.mceUtils = mceUtils;
        controller.lMore = false;       
        controller.ttParams = {};
        controller.modalAdvancedSearch = modalAdvancedSearch;
        controller.modalUpdateConfFilter = modalUpdateConfFilter;
        controller.modalBlockItemWarehouse = modalBlockItemWarehouse;
        controller.serviceZoomUsuarMateriais1 = serviceZoomUsuarMateriais1;
        controller.ConfteContag1ZoomField = {};
        
        controller.serviceZoomUsuarMateriais2 = serviceZoomUsuarMateriais2;
        controller.ConfteContag2ZoomField = {};
        
        controller.serviceZoomUsuarMateriais3 = serviceZoomUsuarMateriais3;
        controller.ConfteContag3ZoomField = {};
        
        
        controller.totalRecords = 0;
        
        
        angular.extend(this, controller.mceUtils);
      
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************

        
        /* Função....: validaDisclaimerSituacao
           Descrição.: Se tiver apenas 1 disclaimer de situação, coloca o valor fixo para 
                       nao ser possivel remover.
           Parâmetros: 
        */
        
        this.validaDisclaimerSituacao = function(){
            
            if (( controller.ttParams.situacao1 &&
                !controller.ttParams.situacao2 &&
                !controller.ttParams.situacao3 &&
                !controller.ttParams.situacao4) 
            || (!controller.ttParams.situacao1 &&
                 controller.ttParams.situacao2 &&
                !controller.ttParams.situacao3 &&
                !controller.ttParams.situacao4)            
            || (!controller.ttParams.situacao1 &&
                !controller.ttParams.situacao2 &&
                 controller.ttParams.situacao3 &&
                !controller.ttParams.situacao4)            
            || (!controller.ttParams.situacao1 &&
                !controller.ttParams.situacao2 &&
                !controller.ttParams.situacao3 &&
                 controller.ttParams.situacao4)) {
            
              for(key in controller.disclaimers) {
                   if(controller.disclaimers[key].property == 'situacao') {
                       controller.disclaimers[key].fixed = true;
                    }
                }
            }             
            
        };
        
        
        
        /* Função....: removerDisclaimer
           Descrição.: Remove um filtro
           Parâmetros: disclaimer
        */
                
        this.removeDisclaimer = function (disclaimer, property) {
            
            
            
                 
            var index;
            
            if(property===undefined){
            
                var prop = disclaimer.property;

                switch(prop){
                    case "it-codigo": 
                         controller.ttParams.itCodigoIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.itCodigoFim = controller.CONSTANTS[prop].end;
                         break;     
                    case "fm-codigo": 
                         controller.ttParams.fmCodigoIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.fmCodigoFim = controller.CONSTANTS[prop].end;
                        break;
                    case "ge-codigo": 
                         controller.ttParams.geCodigoIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.geCodigoFim = controller.CONSTANTS[prop].end;
                         break;  
                    case "cod-localiz": 
                         controller.ttParams.codLocalizIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.codLocalizFim = controller.CONSTANTS[prop].end;
                         break;                           
                    case "cod-depos": 
                         controller.ttParams.codDeposIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.codDeposFim = controller.CONSTANTS[prop].end;

                         controller.searchWarehouse = undefined;
                        
                         break;           
                    case "cod-estabel": 
                         controller.ttParams.codEstabelIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.codEstabelFim = controller.CONSTANTS[prop].end;
                         break; 
                    case "nr-ficha": 
                         controller.ttParams.nrFichaIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.nrFichaFim = controller.CONSTANTS[prop].end;
                         break; 
                    case "cod-confte-contag": 
                         controller.ttParams.codConfteContagIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.codConfteContagFim = controller.CONSTANTS[prop].end;
                         break;    
                    case "lote": 
                         controller.ttParams.loteIni = controller.CONSTANTS[prop].start;
                         controller.ttParams.loteFim = controller.CONSTANTS[prop].end;
                         break;  
                    case "cdn-agrup": 
                         controller.ttParams.cdnAgrup = undefined;                          
                         break;                        
                    case "situacao": 
                        switch(disclaimer.value){
                            case '1':  controller.ttParams.situacao1 = false;
                                break;
                            case '2':  controller.ttParams.situacao2 = false;
                                break;
                            case '3':  controller.ttParams.situacao3 = false;
                                break;
                            case '4':  controller.ttParams.situacao4 = false;
                                break;
                        };
                };
                
                index = controller.disclaimers.indexOf(disclaimer);
                
            } else {                   
                index = controller.mceUtils.findIndexByAttr(disclaimer, 'property', 'cod-depos');            
            }
           
            if (index != -1 && index != undefined) {
                controller.disclaimers.splice(index, 1);
                controller.validaDisclaimerSituacao();
            }
            
            controller.getInventarioByFilter(false);

        };

        /* Função....: initializeInterface
           Descrição.: Metodo GET para incialiazação da interface
           Parâmetros: 
        */
        
        this.initializeInterface = function(){
            controller.fchmatDistributeCounts.initializeInterface(function (result) {
                if (!result.$hasError) {          
                    controller.getDefaultsParam();
                }
            });
        };  
   
        /* Função....: getDefaultsParam
           Descrição.: Retorna parametros de filtro inicial
           Parâmetros: 
        */        
        this.getDefaultsParam = function(){
            controller.fchmatDistributeCounts.getDefaultsParam(function (result) {
                controller.ttParams = result[0];
                
                controller.mountInitialDisclaimers();
                
                controller.getInventarioByFilter(false);                
                
            });
        };
        
        /* Função....: applyConfCont
           Descrição.: disparada ao editar um conferente.
           Parâmetros: 
        */      
	    this.applyConfCont = function(value, list, op) {	  
             
            var conferente = undefined;
            var codConfOld, nomeConfOld;
          
            switch(op){
                case '1':
                    codConfOld  = list['codConfteContag1']; 
                    nomeConfOld = list['nomeConfteContag1'];
                    
                    if(value && list){                        
                        list['codConfteContag1'] = value['cod-usuario'];          
                        list['nomeConfteContag1'] = value['nome-usuar'];
                    } else {
                        list['codConfteContag1'] = '';          
                        list['nomeConfteContag1'] = '';
                    }       
                    
                    conferente = list['codConfteContag1'];
                    
                    break;
                case '2':      	  
                    codConfOld  = list['codConfteContag2']; 
                    nomeConfOld = list['nomeConfteContag2'];
                    
                    if(value && list){                        
                        list['codConfteContag2'] = value['cod-usuario'];          
                        list['nomeConfteContag2'] = value['nome-usuar'];
                    } else {
                        list['codConfteContag2'] = '';          
                        list['nomeConfteContag2'] = '';
                    }
                    
                    conferente = list['codConfteContag2'];
                    
                    break;
                case '3':  
                    codConfOld  = list['codConfteContag3']; 
                    nomeConfOld = list['nomeConfteContag3'];    
                    
                    if(value && list){                        
                        list['codConfteContag3'] = value['cod-usuario'];          
                        list['nomeConfteContag3'] = value['nome-usuar'];
                    } else {
                        list['codConfteContag3'] = '';          
                        list['nomeConfteContag3'] = '';
                    }
                    
                    conferente = list['codConfteContag3'];
                    
                    break;                    
            }
            
            
            if(op){
                controller.fchmatDistributeCounts.atualizaConferente({
                    cConfIndex: op.toString(),
                    rRowid: list['r-Rowid'],
                    codConf: conferente                 
                }, {},  function (result) {
                
                    if(result.$hasError){

                        switch(op){
                            case '1':
                                list['codConfteContag1'] = codConfOld;          
                                list['nomeConfteContag1'] = nomeConfOld;
                                break;
                            case '2':      	  
                                list['codConfteContag2'] = codConfOld;          
                                list['nomeConfteContag2'] = nomeConfOld;
                                break;
                            case '3':  
                                list['codConfteContag3'] = codConfOld;          
                                list['nomeConfteContag3'] = nomeConfOld;
                                break;                    
                        }
                    }
                
                });            
            }
            
	    };        
        
        /* Função....: search
           Descrição.: 
           Parâmetros: 
        */         
        this.search = function(codDepos){
            
            if(codDepos){                   
                
                controller.ttParams.codDeposIni = codDepos;
                controller.ttParams.codDeposFim = codDepos;

                 // Remove o disclaimer de deposito ao clicar no canclean
                controller.removeDisclaimer(controller.disclaimers, 'cod-depos');                
                
                
                controller.disclaimers.push(controller.mceUtils.parseTypeToDisclaimer('char', 
                                                                                      'cod-depos', 
                                                                                       codDepos, 
                                                                                       $scope.i18n('l-warehouse'), 
                                                                                       false, 
                                                                                       ''));
                
            } else {
                
                // Seta valores defaults para o deposito
                controller.ttParams.codDeposIni = controller.CONSTANTS['cod-depos'].start;
                controller.ttParams.codDeposFim = controller.CONSTANTS['cod-depos'].end;
                
                // Remove o disclaimer de deposito ao clicar no canclean
                controller.removeDisclaimer(controller.disclaimers, 'cod-depos');
            }
            
            controller.getInventarioByFilter(false);
            
        }        

        
        /* Função....: getInventarioByFilter
           Descrição.: REtorna lista de fichas de contagem
           Parâmetros: lMore: para buscar mais resultados
        */       
        this.getInventarioByFilter = function(lMore){            
                
              // Zera contadores para nova pesquisa
              if(lMore==false){
                  controller.listofDistributeCountsCount = 0;
                  controller.totalRecords = 0;
                  controller.listofDistributeCounts = {};
              }
            
            
              controller.fchmatDistributeCounts.getInventarioByFilter({
                    lMore: lMore,
                    iNumResults: controller.listofDistributeCountsCount,
                    piTotalRecords: controller.totalRecords 
                }, controller.ttParams,  function (result) {
                 
                  controller.listofDistributeCountsCount = result.QP_iNumResults;
                  controller.totalRecords = result.QP_piTotalRecords;
                  
                  if (lMore){ 
                        // para mais resultados, incrementa a lista
                        angular.forEach(result.ttInventarioHTML, function(value) {
                            controller.listofDistributeCounts.push(value);
                        });
                  } else { 
                      // Nova lista                      
                      controller.listofDistributeCounts = result.ttInventarioHTML;                      
                  }
              
              });
        
        };
           
        /* Função....: mountInitialDisclaimers
           Descrição.: monta diclaimers com base nos parametros defaults
           Parâmetros: 
        */          
        this.mountInitialDisclaimers = function(){
            
            var estabRange = {start: controller.ttParams.codEstabelIni,
                                end: controller.ttParams.codEstabelFim };
            
            controller.disclaimers.push(controller.mceUtils.parseTypeToDisclaimer('date', 
                                                                                  'dt-saldo', 
                                                                                   controller.ttParams.dtSaldo, 
                                                                                   $scope.i18n('l-balance-date', undefined, 'dts/mce'), 
                                                                                   true, 
                                                                                   ''));        

           if ((estabRange.start != controller.CONSTANTS['cod-estabel'].start) || 
               (estabRange.end   != controller.CONSTANTS['cod-estabel'].end)) {            
                controller.disclaimers.push(controller.mceUtils.parseTypeToDisclaimer('char-range', 
                                                                                      'cod-estabel', 
                                                                                       estabRange, 
                                                                                       $scope.i18n('l-site'), 
                                                                                       false, 
                                                                                       ''));
           }
            
            
            controller.disclaimers.push(controller.mceUtils.parseTypeToDisclaimer('booleanNoValue', 
                                                                                  'situacao', 
                                                                                   '2', 
                                                                                   $scope.i18n('l-not-update', undefined, 'dts/mce'), 
                                                                                   false, 
                                                                                   '')); 
            
            controller.disclaimers.push(controller.mceUtils.parseTypeToDisclaimer('booleanNoValue', 
                                                                                  'situacao', 
                                                                                   '4', 
                                                                                   $scope.i18n('l-ok-to-inventory', undefined, 'dts/mce'), 
                                                                                   false, 
                                                                                   ''));              
            
        };
        
        /* Função....: loadMore
           Descrição.: disparada ao clicar no botão mais resultados
           Parâmetros: 
        */      
        this.loadMore = function () {         
            controller.getInventarioByFilter(true);           
        };     
 
        
        /* Função....: openAdvancedSearch
           Descrição.: abre tela de filtro avancado
           Parâmetros: 
        */            
        this.openAdvancedSearch = function () {

            modalAdvancedSearch.open({               
                ttParams: controller.ttParams,
                constants: controller.CONSTANTS
                
            }).then(function (result) {
                
                controller.ttParams = result.ttParamsReturn;
                controller.disclaimers = result.disclaimers;  
                
                controller.validaDisclaimerSituacao();
                
                
                controller.getInventarioByFilter(false);
            });
        };
        
        
        /* Função....: openUpdateConfFilter
           Descrição.: abre tela de atualizar conferentes ao clicar no botao
           Parâmetros: 
        */        
        this.openUpdateConfFilter = function(){
            
            if(controller.totalRecords > 0){

                modalUpdateConfFilter.open({
                    disclaimers: controller.disclaimers,   
                    ttParams: controller.ttParams            
                }).then(function (result) {
                    controller.getInventarioByFilter(false);               
                });  
            }
            
        };
        
        /* Função....: openBlockItemWarehouse
           Descrição.: abre tela de bloqueio de movimentos
           Parâmetros: 
        */        
        this.openBlockItemWarehouse = function(){   
            
            if(controller.totalRecords > 0){
            
                controller.modalBlockItemWarehouse.open({
                    disclaimers: controller.disclaimers,   
                    ttParams: controller.ttParams            
                }).then(function (result) {
                    controller.getInventarioByFilter(false);               
                });  
            }
        
        };        
        
        
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        // *********************************************************************************
        
        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function () {   
           
            createTab = appViewService.startView($rootScope.i18n('l-distribute-counts'),'mce.distributecounts.ListCtrl', controller); 
            
            previousView = appViewService.previousView;            
            
            /* Se for troca entre abas, retorna e mantém o controller */
            if(createTab === false && previousView.controller != "mce.distributeCounts.editCtrl") {  
                return;
            }
            
            controller.searchWarehouse = undefined;
            controller.initializeInterface();
        }
      

        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        	distributeCountsCtrl.init();
        });
    }

    
    
  /****************************CONTROLLER ATUALIZAR CONFERENTES FILTRO  ***********************************************/    
    
  modalUpdateConfFilterCtrl.$inject = ['$rootScope', '$scope','totvs.app-main-view.Service', '$filter', '$stateParams',         'mce.distributecounts.modalAdvancedSearch.Service','parameters','mce.fchmatdistributecounts.factory','$modalInstance',
'mce.utils.Service','TOTVSEvent'];    
    function modalUpdateConfFilterCtrl($rootScope,$scope,appViewService,$filter,$stateParams,modalAdvancedSearch,
                                        parameters, fchmatDistributeCounts,$modalInstance, mceUtils,TOTVSEvent){
        
        
        var controller = this;
        
        controller.fchmatDistributeCounts = fchmatDistributeCounts;
        
        controller.modalDisclaimers = parameters.disclaimers;        
        controller.ttParams = parameters.ttParams; 
        controller.mceUtils = mceUtils;
        controller.conferentes = {};
      
        /* Função....: cancel
           Descrição.:Disparada ao clicar no botão Cancelar
           Parâmetros: <não há>
        */       
        this.cancel = function(){
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        };
        
        /* Função....: apply
           Descrição.:Disparada ao clicar no botão Aplicar
           Parâmetros: <não há>
        */            
        this.apply = function(){
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'msg-filter-sheet-update-conf-question',
                cancelLabel : 'l-cancel',
                confirmLabel: 'l-confirm',
                text: $scope.i18n('hlp-filter-sheet-update-conf-txt'),
                callback: function (isPositiveResult) {
                    if (isPositiveResult) {
                        
                        controller.fchmatDistributeCounts.atualizaConferenteByFilter({}, 
                                                                         {ttParamHTML: controller.ttParams, 
                                                                          ttConferentes:controller.conferentes},
                                                                         function(result){
                            
                            if(!result.$hasError && result['l-atualizou']){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success',
                                        title: $rootScope.i18n('msg-success-action', [$rootScope.i18n('l-update'),'dts/mce']),
                                        detail: ''
                                });
                                 $modalInstance.close({}); // fecha modal retornando parametro                                
                            } else if(!result['l-atualizou']){
                                 $modalInstance.close({}); // fecha modal retornando parametro  
                            }
                            
                        });
                       
                    }
                }
            });
           
        };
        
        
       // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        // *********************************************************************************
        
        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function () {  
          controller.modalDisclaimers = controller.mceUtils.disableDisclaimers(parameters.disclaimers);
        };
      

        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        	modalUpdateConfFilterCtrl.init();
        });        
        
         $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { 
            // TODO: Confirmar o fechamento caso necessário.
            $modalInstance.dismiss('cancel');
        });
    };
    
    
    
    
 /****************************CONTROLLER BLOQUEIO ITEM DEPOSITO  ***********************************************/    
    
  modalBlockItemWarehouseCtrl.$inject = ['$rootScope', '$scope','totvs.app-main-view.Service', '$filter', '$stateParams', 'mce.distributecounts.modalAdvancedSearch.Service','parameters','mce.fchmatdistributecounts.factory','$modalInstance', 'mce.utils.Service','$filter','TOTVSEvent'];    
    function modalBlockItemWarehouseCtrl($rootScope,$scope,appViewService,$filter,$stateParams,modalAdvancedSearch,
                                        parameters, fchmatDistributeCounts,$modalInstance, mceUtils,$filter,TOTVSEvent){
        
        var controller = this;
        
        controller.fchmatDistributeCounts = fchmatDistributeCounts;
        
        controller.modalDisclaimers = parameters.disclaimers;        
        controller.ttParams = parameters.ttParams;       
        controller.mceUtils = mceUtils;
        controller.block    = {};
        
        
        this.validateBlankFields = function(){           
            
            var detailMsg = $rootScope.i18n('l-field') + ' & ' + $rootScope.i18n('l-required-mce') + '. ';
            
            var lMsg = false;
            
            if(!controller.block['dat-inic-bloq'] || controller.block['dat-inic-bloq'] == "") {                 
                
                detailMsg = detailMsg.replace ('&', $rootScope.i18n('l-block-init-date'));    
                lMsg = true;
            } else if(!controller.block['hra-inic-bloq'] || controller.block['hra-inic-bloq'] == "") {
                
                detailMsg = detailMsg.replace ('&', $rootScope.i18n('l-block-init-time')); 
                lMsg = true;
            }            
            
            if(lMsg){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'error',
                                    title: $rootScope.i18n('l-attention'),
                                    detail:detailMsg
                });    
            }

            return lMsg;
        };
        
        
        /* Função....: apply
           Descrição.:Disparada ao clicar no botão confirmar
           Parâmetros: <não há>
        */
        this.apply = function() {
            
            var ttBloqMovtoItemDepos = {};
            
          
            if(!controller.validateBlankFields()){ 
              
               
                var time = controller.block['hra-inic-bloq'].replace(":", "");
                var type, title, detail, cAction;
                
                // Se a hora escolhida for antes de 10:00 o componente de hora 
                // retorna em formato inválido para o progress (9:55), neste caso é acrescido um zero
                // à frente da hora informada                
                if (time.length === 3) {
                    time = '0' + time;
                }

                // Completa a hora com o formato correto para ser enviado ao progress
                time += '00';
               
                ttBloqMovtoItemDepos.datInicBloq = controller.block['dat-inic-bloq'];
                ttBloqMovtoItemDepos.hraInicBloq = time;
              
        
                controller.fchmatDistributeCounts.bloquearDesbloquearItemDeposito({iAction: controller.block['option']},
                                                                                 {ttParamHTML: parameters.ttParams,
                                                                                  ttBloqMovtoItemDepos:ttBloqMovtoItemDepos},
                                                                                 function(result){
                    
                    
                    if(controller.block['option'] == 1 ){
                        cAction = $rootScope.i18n('l-block-item-warehouse'); 
                    } else {
                        cAction = $rootScope.i18n('l-unlock-item-warehouse'); 
                    }
                    
                    if(result.lBloqueio){
                        type  = 'success';
                        title = $rootScope.i18n('l-success-action-gen', [cAction,'dts/mce']),
                        detail = "";                        
                    } else {
                        type   = 'information';
                        title  = $rootScope.i18n('l-information', 'dts/mce');
                        detail = $rootScope.i18n('msg-no-blockade',[cAction,'dts/mce']);                       
                    }
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {type: type,
                                                                        title: title,
                                                                        detail:detail});
                    
                    // Fecha modal
                    $modalInstance.close({
                    }); 
               });
                
           };
            
        };
        
        
        /* Função....: cancel
           Descrição.:Disparada ao clicar no botão Cancelar
           Parâmetros: <não há>
        */       
        this.cancel = function(){
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        };        
        
          // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        // *********************************************************************************
        
        /* Função....: init
           Descrição.: responsável por inicializar o controller principal
           Parâmetros: <não há>
        */
        this.init = function () {          
            
          controller.modalDisclaimers = controller.mceUtils.disableDisclaimers(parameters.disclaimers);
          controller.block['dat-inic-bloq'] = parameters.ttParams.dtSaldo;  
          controller.block['hra-inic-bloq'] = $filter('date')(new Date(), 'HH:mm:ss');  
          controller.block['option'] = 1;
            
        };
      

        if ($rootScope.currentuserLoaded) { this.init(); }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        	modalBlockItemWarehouse.init();
        });        
        
         $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { 
            // TODO: Confirmar o fechamento caso necessário.
            $modalInstance.dismiss('cancel');
        });   
        
    };
    
    
    
    
    /*####################################################################################################
     # CONTROLLER: modalAdvancedSearch
     * REGISTRO..: mce.blockitemwarehouse.modalAdvancedSearch.Service
     # DESCRICAO.: Controle responsável pela abertura da Modal de Pesquisa Avançada
     ####################################################################################################*/
    modalAdvancedSearch.$inject = ['$modal'];

    function modalAdvancedSearch($modal) {

       this.open = function (params) {

            var instance = $modal.open({

                templateUrl: '/dts/mce/html/distributecounts/distributecounts.advanced.search.html',
                controller: 'mce.distributecounts.AdvacendSearch as controller',
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

    };
    
    
    /*####################################################################################################
     # CONTROLLER: modalUpdateConfFilter
     * REGISTRO..: mce.distributecounts.modalUpdateConfFilter.Service
     # DESCRICAO.: Controle responsável pela abertura da Modal para Atualizar conferentes filtrados
     ####################################################################################################*/
    modalUpdateConfFilter.$inject = ['$modal'];

    function modalUpdateConfFilter($modal) {

       this.open = function (params) {     

            var instance = $modal.open({

                templateUrl: '/dts/mce/html/distributecounts/distributecounts.update.conf.filter.html',
                controller: 'mce.distributecounts.UpdateConfFilter as controller',
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

    };   
    
   /*####################################################################################################
     # CONTROLLER: modalBlockItemWarehouse
     * REGISTRO..: mce.distributecounts.modalBlockItemWarehouse.Service
     # DESCRICAO.: Controle responsável pela abertura da Modal para bloquear movimentos
     ####################################################################################################*/
    modalBlockItemWarehouse.$inject = ['$modal'];

    function modalBlockItemWarehouse($modal) {

       this.open = function (params) {     

            var instance = $modal.open({

                templateUrl: '/dts/mce/html/distributecounts/distributecounts.block.item.warehouse.html',
                controller: 'mce.distributecounts.BlockItemWarehouse as controller',
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

    };     

    index.register.service('mce.distributecounts.modalAdvancedSearch.Service', modalAdvancedSearch);
    index.register.service('mce.distributecounts.modalUpdateConfFilter.Service', modalUpdateConfFilter);
    index.register.service('mce.distributecounts.modalBlockItemWarehouse.Service', modalBlockItemWarehouse);
    
    index.register.controller('mce.distributecounts.ListCtrl', distributeCountsCtrl);
    index.register.controller('mce.distributecounts.UpdateConfFilter', modalUpdateConfFilterCtrl);
    index.register.controller('mce.distributecounts.BlockItemWarehouse', modalBlockItemWarehouseCtrl);

});


