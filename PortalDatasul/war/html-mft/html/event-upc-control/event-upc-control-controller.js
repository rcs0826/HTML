/* global TOTVSEvent, angular*/
define([
    'index', '/dts/mft/js/mft-factories.js', '/dts/dts-utils/js/resizer.js', '/dts/mft/js/api/event-upc-control.js', '/dts/mft/js/zoom/programa.js' ,'less!/dts/mft/assets/css/event-upc-control.less'
], function (index) {

    documentTagConfigController.$inject = ['$rootScope', '$filter', '$location', 'TOTVSEvent','mft.helper', 'mft.event-upc-control.Factory', 'totvs.app-main-view.Service'];

    function documentTagConfigController($rootScope, $filter, $location, TOTVSEvent, helper, factory, appViewService) {

        var controller = this;
        var i18n = $filter('i18n');

        controller.listProgram = [];
        controller.disclaimers = [];
        controller.quickSearchText = "";
        controller.active = "";
        
        controller.getProgram = function (paging) {

            if(!paging) {
                controller.listProgram = [];
                controller.page = 1
            } else {
                controller.page++;
            }

            // Parâmetros default de pesquisa
            var options = {
				page: controller.page,
				pageSize: 999999			
			};			

            // Adiciona o filtro simples
            if(controller.quickSearchText) {
                options['cod-quick-search'] = controller.quickSearchText;
                controller.quickSearchText = "";
            };
            
            if(controller.active === true ||
               controller.active === false) {
                options['log-ativo'] = controller.active;
                controller.active = "";
            };
            
            // Executa a busca na base de dados
			factory.getProgram(options, function(result) {
                controller.listProgram = controller.listProgram.concat(result);                                    
                //controller.hasNext = result.hasNext;                																					
			});           
        }

        controller.addProgram = function () {
            $location.url('/dts/mft/event-upc-control/new');
        }

        controller.editProgram = function () {
            if(controller.documentTagSelected) {
                $location.url('/dts/mft/event-upc-control/edit/' + controller.documentTagSelected['cdn-docto-tag']);                
            }            
        }

        controller.deleteProgram = function (program) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção',
                text: $rootScope.i18n('Deseja eliminar o programa selecionado?'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(ok) {
                    if (ok) {
                        factory.deleteProgram({codProgram: program['cod-prog-dtsul']}, function (){
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success',
                                title: $rootScope.i18n('Programa eliminado com sucesso!')                    
                            });
                            controller.getProgram();
                        })
                    }                        
                }
            });                
        }

        controller.getEvent = function (program) {
            var options = {'cod-prog-dtsul': program['cod-prog-dtsul']}
            factory.getEvent(options, function(result) {
                program.listEvent = result;                                           
			});
        }        

        controller.addFilterActiveProgram = function(active) {
            controller.clearFilters();
            
            controller.active = active;

            var disclaimer;
            if(active) {
                disclaimer = helper.addFilter("log-ativo", active , i18n('l-control-event'), 'boolean');   
            } else {
                disclaimer = helper.addFilter("log-ativo", active , i18n('l-not-control-event'), 'boolean');   
            }
            
            controller.disclaimers.push(disclaimer);                     
            
            controller.getProgram();
        }

        controller.search = function () {
            controller.clearFilters();
            
            var disclaimer = helper.addFilter("simpleFilter", controller.quickSearchText, i18n('l-simple-filter'));                    
            controller.disclaimers.push(disclaimer);

            controller.getProgram();
        }

        controller.clearFilters = function () {
            controller.disclaimers = [];            
        }

        controller.addDisclaimer = function (property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }

        controller.removeDisclaimer = function (disclaimer) {
            // Pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);
           
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }
           
            // Dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == null)
                controller.quickSearchText = '';

            // Recarrega os dados quando remove um disclaimer
            controller.getProgram();
        }

        appViewService.startView(i18n('l-event-upc-control'));

        controller.getProgram();
    }
    index.register.controller('mft.event-upc-control.controller', documentTagConfigController);

    // documentTagConfigAddEditController
    documentTagConfigAddEditController.$inject = ['$rootScope','$stateParams','$location','$state','$filter','$timeout','mft.event-upc-control.Factory','TOTVSEvent'];

    function documentTagConfigAddEditController($rootScope, $stateParams, $location, $state, $filter, $timeout, factory, TOTVSEvent) {

        var controller = this;
        var i18n = $filter('i18n');

        controller.program = {'log-ativo': true};
        controller.listEvent = [];
        
        controller.state = ($state.is('dts/mft/event-upc-control.new') ? 'new' : $state.is('dts/mft/event-upc-control.edit') ? 'edit' : 'copy') 
                
        controller.getProgramAndEvent = function () {
            factory.getProgram({'cod-prog-dtsul': $stateParams.codProgram}, function(result) {
                if (result) {
                    $timeout(function () {
                        controller.program = result[0];
                    }, 200);                   
                }
            });
            factory.getEvent({'cod-prog-dtsul': $stateParams.codProgram}, function(result) {
                if (result) {
                    $timeout(function () {
                        controller.listEvent = result;
                    }, 200);                   
                }
            });
        }   

        controller.addEvent = function () {
            event = {
                "cod-evento":"",
                "log-ativo": true
            }

            controller.listEvent.push(event);
        }

        controller.removeEvent = function (event) {
            angular.forEach(controller.listEvent, function (eventList, key) {
                if(eventList['cod-evento'] === event['cod-evento']) {
                    controller.listEvent.splice(key,1);
                }
            });                    
        }        

       controller.cancel = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function (ok) {
                    if (ok) {
                        $state.go('dts/mft/event-upc-control.start');
                    }
                }
            });
        }

        controller.save = function () {
            if (controller.checkDuplicateInObject('cod-evento', controller.listEvent)) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('Existem eventos duplicados!')                    
                });
            } else {
                if (controller.program['cod-prog-dtsul'] == "" || controller.program['cod-prog-dtsul'] == undefined) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('Programa não informado!')                    
                    });
                } else {
                    var options = {
                        'type': controller.state,
                        'program': controller.program,
                        'event': controller.listEvent
                    }
                    factory.createUpdateProgramEvent(options, function(){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('Salvo com sucesso!')                    
                        });          
                        $location.url('/dts/mft/event-upc-control/');          
                    }) 
                }                                
            }
        }

        controller.checkDuplicateInObject = function (propertyName, inputArray) {
            var seenDuplicate = false,
                testObject = {};
          
            inputArray.map(function(item) {
              var itemPropertyName = item[propertyName].toUpperCase();    
              if (itemPropertyName in testObject) {
                testObject[itemPropertyName].duplicate = true;
                item.duplicate = true;
                seenDuplicate = true;
              }
              else {
                testObject[itemPropertyName] = item;
                delete item.duplicate;
              }
            });
          
            return seenDuplicate;
        }

        if(controller.state == "edit") {
            controller.getProgramAndEvent();
        }
    }   

    index.register.controller('mft.event-upc-control-add-edit.controller', documentTagConfigAddEditController);

});