define([
	'index',
	'angularAMD',
	'/dts/mce/js/mce-utils.js',   	
    '/dts/mce/js/zoom/agrup-invent.js'     
], function (index) {


    // CONTROLLER PESQUISA AVANCADA
    distributeCountsCtrlAdvacedSearch.$inject = [
   '$rootScope', '$scope', '$modalInstance', 'mce.utils.Service','mce.agrup-invent.zoom','parameters','mce.fchmatdistributecounts.factory','TOTVSEvent'];

   function distributeCountsCtrlAdvacedSearch($rootScope, $scope, $modalInstance, mceUtils, serviceAgrupInvent, parameters, fchmatDistributeCounts, TOTVSEvent) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        
        var controller = this;
       
        controller.mceUtils = mceUtils;
        controller.serviceAgrupInvent = serviceAgrupInvent;        
        controller.advancedSearchModel = {};
                                          
        controller.constants ={};
       
        controller.ttParams = {};
       
        controller.fchmatDistributeCounts = fchmatDistributeCounts;
        
        // *********************************************************************************
        // *** Functions
        // ***********************************************************************************
       
       this.loadinitialValues = function(){
                      
           var start, end;
           
           controller.initializeAdvancedSearchModel();
          
           
           angular.forEach(Object.keys(controller.constants), function(value){ 
              
               switch(value){
                     case "it-codigo": 
                          start = controller.ttParams.itCodigoIni;
                          end   = controller.ttParams.itCodigoFim;
                          break;     
                     case "fm-codigo": 
                          start = controller.ttParams.fmCodigoIni;
                          end   = controller.ttParams.fmCodigoFim;
                         break;
                     case "ge-codigo": 
                          start = controller.ttParams.geCodigoIni;
                          end   = controller.ttParams.geCodigoFim;
                          break;  
                     case "cod-localiz": 
                          start = controller.ttParams.codLocalizIni;
                          end   = controller.ttParams.codLocalizFim;
                          break;                           
                     case "cod-depos": 
                          start = controller.ttParams.codDeposIni;
                          end   = controller.ttParams.codDeposFim;                        
                          break;           
                     case "cod-estabel": 
                          start = controller.ttParams.codEstabelIni;
                          end   = controller.ttParams.codEstabelFim;
                          break; 
                     case "nr-ficha": 
                          start = controller.ttParams.nrFichaIni;
                          end   = controller.ttParams.nrFichaFim;
                          break; 
                     case "cod-confte-contag": 
                          start = controller.ttParams.codConfteContagIni;
                          end   = controller.ttParams.codConfteContagFim;
                          break;    
                     case "lote": 
                          start = controller.ttParams.loteIni;
                          end   = controller.ttParams.loteFim;
                          break;  
               }
              
              
               if(value !== 'dt-saldo' && value !== "cdn-agrup") {              
                   controller.advancedSearchModel[value].start = start;
                   controller.advancedSearchModel[value].end = end;
               }
                     
  
            });
       }
       
       /* Fun褯....: parseDisclaimersToModel
           Descri褯.: Fun褯 responsⷥl por fazer o parser do model da pesquisa avan袤a 
                       para os diclaimers que ser䯠retornados para a tela de listagem.
           Par㮥tros: <n䯠hᾠ
        */ 
        this.parseModelToDisclaimers = function () {

            controller.disclaimers = [];
            
            for (key in controller.advancedSearchModel) {

                var model = controller.advancedSearchModel[key];

                if (model == undefined)
                    continue;

                switch (key) {
                    case 'dt-saldo':
                         controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('date', key, model,  $scope.i18n('l-balance-date', undefined, 'dts/mce'), true, '')
                        );
                        break;  
                    case 'cod-estabel':
                        // Somente monta filtro se alterar o valor do campo
                        if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-site'), false, '')
                            );
                        }
                        break;                         
                        
                    case 'it-codigo':
                        // Somente monta filtro se alterar o valor do campo
                        if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-item'), false, '')
                            );
                        }
                        break;  
                        
                    case 'fm-codigo':                        
                        // Somente monta filtro se alterar o valor do campo
                        if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {                         
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-family'), false, '')
                            );
                        }
                        break; 
                        
                    case 'ge-codigo':
                        // Somente monta filtro se alterar o valor do campo
                       if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('integer-range', key, model, $scope.i18n('l-stock-group'), false, '')
                            );
                        }
                        break;     
                    case 'cod-localiz':
                        // Somente monta filtro se alterar o valor do campo
                       if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-localization'), false, '')
                            );
                        }
                        break;   
                        
                    case 'cod-depos':
                        // Somente monta filtro se alterar o valor do campo
                        if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-warehouse'), false, '')
                            );
                        }
                        break;    
  
                    case 'nr-ficha':
                        // Somente monta filtro se alterar o valor do campo
                        if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                            
                           if(!model.start || model.start == "") model.start = 0;
                           if(!model.end   || model.end   == "") model.end = 0;
                            
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('integer-range', key, model, $scope.i18n('l-sheet'), false, '')
                            );
                        }
                        break;   
                    case 'cod-confte-contag':
                        // Somente monta filtro se alterar o valor do campo
                        if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-checker'), false, '')
                            );
                        }
                        break;  
                    case 'lote':
                        // Somente monta filtro se alterar o valor do campo
                      if ((model.start != controller.constants[key].start) || (model.end != controller.constants[key].end)) {
                           controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-lot'), false, '')
                            );
                        }
                        break; 
                        
                     case 'situacao':   
                        if(model['1']){
                            controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('booleanNoValue', key, '1', $scope.i18n('l-updated'), false, '')
                            );
                        }
                        
                        if(model['2']){
                            controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('booleanNoValue', key, '2', $scope.i18n('l-not-update'), false, '')
                            );
                        }  
                        
                        if(model['3']){
                            controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('booleanNoValue', key, '3', $scope.i18n('l-inventory-ok'), false, '')
                            );
                        }  
                        
                        if(model['4']){
                            controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('booleanNoValue', key, '4', $scope.i18n('l-ok-to-inventory'), false, '')
                            );
                        } 
                        break;
                        
                        
                    case 'cdn-agrup':
                        if(model || model > 0) {
                            controller.disclaimers.push(
                                controller.mceUtils.parseTypeToDisclaimer('integer', 'cdn-agrup', 
                                                                          model, 
                                                                          $scope.i18n('l-group-separator'), false, '')
                            )
                        }                        
                        break;                        
                }
                
            };

            if (controller.disclaimers.length === 0) {
                controller.disclaimers = [{
                    property: '',
                    value: '',
                    title: $scope.i18n('l-no-filter-informed'), 
                    fixed: true
                }];
            }
            
        };
       
       
       /* Função....: initializeAdvancedSearchModel
           Descrição.:Inicializa models
           Parâmetros: <não há> 
        */        
       this.initializeAdvancedSearchModel = function() {
           
           controller.constants = parameters.constants;       
           controller.ttParams = parameters.ttParams;
           
           controller.advancedSearchModel = { 'dt-saldo': controller.ttParams.dtSaldo,                                     
                                              'it-codigo': {},
                                              'fm-codigo': {},
                                              'ge-codigo': {},
                                              'cod-localiz': {},
                                              'cod-depos': {},
                                              'cod-estabel': {},
                                              'nr-ficha': {},
                                              'cod-confte-contag': {},
                                              'lote': {},
                                              'situacao':{1:controller.ttParams.situacao1,
                                                          2:controller.ttParams.situacao2,
                                                          3:controller.ttParams.situacao3,
                                                          4:controller.ttParams.situacao4},
                                              'cdn-agrup':undefined   
                                             };
           
           
           if(!controller.ttParams.cdnAgrup || controller.ttParams.cdnAgrup == 0){
               controller.advancedSearchModel['cdn-agrup']  = undefined;
           } else {
               controller.advancedSearchModel['cdn-agrup'] = controller.ttParams.cdnAgrup; 
           }           
           
       };
       
       
        /* Função....: validaSituacao
           Descrição.:Valida para haver ao menos uma situação selecionada
           Parâmetros: <não há> 
        */       
       this.validaSituacao = function(){
           var isValid;
           
           for(var i = 1; i <= 4; i++ ){
               if(isValid) break;
               isValid = controller.advancedSearchModel.situacao[i];
           }
           
           return isValid;
       };
       
        
        /* Função....: apply
           Descrição.: Função disparada ao clicar no botõa aplicar
           Parâmetros: <não há> 
        */
        this.apply = function () {
            
            if(!controller.advancedSearchModel['dt-saldo'] || controller.advancedSearchModel['dt-saldo'] === "") {
                
                 $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail:$rootScope.i18n('l-field') + ' ' + $rootScope.i18n('l-balance-date') + " " + $rootScope.i18n('l-required-mce') + '. '
                });
                
                return;            
            }
            
            
            if(!controller.validaSituacao()) {
                 $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail:$rootScope.i18n('l-inform-at-least-one-situation')
                });
                
                return;            
            }            

            controller.parseModelToDisclaimers();
            controller.updateParamsToReturn();                
            
            $modalInstance.close({
                disclaimers: controller.disclaimers,
                ttParamsReturn: controller.ttParams
            }); 
        };       
        
        
        /* Função....: updateParamsToReturn
           Descrição.: Atualiza parametros para retornar a tela de listagem
           Parâmetros: <não há> 
        */       
        this.updateParamsToReturn = function(){
            
            angular.forEach(Object.keys(controller.advancedSearchModel), function(value){             
            
                switch (value){
                   case 'dt-saldo':    
                         controller.ttParams.dtSaldo = controller.advancedSearchModel[value];
                         break;   
                     case "cod-estabel":
                         controller.ttParams.codEstabelIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.codEstabelFim = controller.advancedSearchModel[value].end; 
                         break;                          
                     case "it-codigo":
                         controller.ttParams.itCodigoIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.itCodigoFim = controller.advancedSearchModel[value].end;
                         break;     
                     case "fm-codigo":
                         controller.ttParams.fmCodigoIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.fmCodigoFim = controller.advancedSearchModel[value].end;                        
                         break;
                     case "ge-codigo": 
                         controller.ttParams.geCodigoIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.geCodigoFim = controller.advancedSearchModel[value].end;                        
                         break;                        
                     case "cod-localiz": 
                         controller.ttParams.codLocalizIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.codLocalizFim = controller.advancedSearchModel[value].end;                        
                         break;                         
                     case "cod-depos": 
                         controller.ttParams.codDeposIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.codDeposFim = controller.advancedSearchModel[value].end; 
                         break; 
                     case "nr-ficha": 
                         controller.ttParams.nrFichaIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.nrFichaFim = controller.advancedSearchModel[value].end; 
                         break;                          
                     case "cod-confte-contag": 
                         controller.ttParams.codConfteContagIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.codConfteContagFim = controller.advancedSearchModel[value].end ;
                         break;                             
                     case "lote":
                         controller.ttParams.loteIni = controller.advancedSearchModel[value].start;
                         controller.ttParams.loteFim = controller.advancedSearchModel[value].end; 
                         break; 
                     case "situacao":
                         controller.ttParams.situacao1 = controller.advancedSearchModel[value]['1'];
                         controller.ttParams.situacao2 = controller.advancedSearchModel[value]['2'];
                         controller.ttParams.situacao3 = controller.advancedSearchModel[value]['3'];
                         controller.ttParams.situacao4 = controller.advancedSearchModel[value]['4'];
                         break;    
                     case "cdn-agrup":                        
                         if(!controller.advancedSearchModel[value]){
                             controller.ttParams.cdnAgrup = 0;
                         } else {                
                             controller.ttParams.cdnAgrup = controller.advancedSearchModel[value];
                         }                        
                         break;            
                } 
                
            });
            
        };
       
       
                   
        /* Função....: getDtSaldoByAgrup
           Descrição.: Disparada ao selecionar um agrupador
           Parâmetros: <não há> 
        */        
        this.getDtSaldoByAgrup = function(){
            
            if(controller.advancedSearchModel['cdn-agrup']){       
            
                controller.fchmatDistributeCounts.getDtSaldoByAgrup({cdnAgrup:controller.advancedSearchModel['cdn-agrup']},
                                                                   function(result){               
                    if(result.dtSaldo){
                        controller.advancedSearchModel['dt-saldo'] = result.dtSaldo;                
                    } else {
                        controller.advancedSearchModel['dt-saldo'] = controller.ttParams.dtSaldo;
                    }
                    
                });
            } else {
                controller.advancedSearchModel['dt-saldo'] = controller.ttParams.dtSaldo;
            }
            
        }; 
       
        /* Função....: cancel
           Descrição.: acionadoao clicar no botao cancelar
           Parâmetros: <não há> 
        */          
        this.cancel = function () {
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        };
       
        /* Funcao inicial */
        controller.loadinitialValues();
        

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        $scope.$on('$destroy', function () {
            controller = undefined;
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) { 
            // TODO: Confirmar o fechamento caso necessário.
            $modalInstance.dismiss('cancel');
        });  
       
    };
       
    index.register.controller('mce.distributecounts.AdvacendSearch', distributeCountsCtrlAdvacedSearch);

});