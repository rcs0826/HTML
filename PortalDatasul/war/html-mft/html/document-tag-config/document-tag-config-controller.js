/* global TOTVSEvent, angular*/
define([
    'index', '/dts/mft/js/mft-factories.js', '/dts/dts-utils/js/resizer.js', '/dts/mft/js/api/document-tag-config.js'
], function (index) {

    documentTagConfigController.$inject = ['$rootScope','$timeout', '$filter', '$modal', '$location', 'TOTVSEvent','mft.helper', 'mft.document-tag-config.Factory', 'dts-utils.Resize.Service', 'totvs.app-main-view.Service'];

    function documentTagConfigController($rootScope, $timeout, $filter, $modal, $location, TOTVSEvent, helper, factory, resizeService, appViewService) {

        var controller = this;
        var i18n = $filter('i18n');

        controller.documentTag = [];
        controller.disclaimers = [];
        controller.advancedSearch = {
            model: {}
        };

        controller.tag = {
            'cdn-operac': 1,
            'cdn-acao': 1
        }

        controller.typeOperation = [
            {id: 1, desc: i18n("Não enviar")},
            {id: 2, desc: i18n("Enviar Fixo")},
            {id: 3, desc: i18n("Multiplicar por")},
            {id: 4, desc: i18n("Limitar tamanho")},
            {id: 5, desc: i18n("Formato numérico")},
            {id: 6, desc: i18n("Programa")},
        ];

        controller.loadData = function (paging) {

            if(!paging) {
                controller.documentTag = [];
            }

            // Parâmetros default de pesquisa
            var options = {
				page: 0,
				pageSize: 50				
			};			

            var searchValue = $.grep(controller.disclaimers, function (filter) {
                return filter.property.indexOf('actionFilter') >= 0;
            });

            if(searchValue.length > 0) {
                options['action-filter'] = searchValue[0].value;
            } else {
                // Adiciona o filtro avançado
                angular.forEach(controller.disclaimers, function (disclamer, key) {
                    options[disclamer.property + '-initial'] = disclamer.value.split(";")[0];
                    options[disclamer.property + '-final'] = disclamer.value.split(";")[1];
                });
            }                

            // Adiciona o filtro simples
            if(controller.quickSearchText) {
                options['cod-quick-search'] = controller.quickSearchText;
                controller.quickSearchText = "";
            };                       

            // Executa a busca na base de dados
			factory.getTag(options, function(result) {
                if (result) { 
                    controller.documentTag = controller.documentTag.concat(result);                    
                }																					
			});           
        }

        controller.createTag = function () {
            $location.url('/dts/mft/document-tag-config/new');
        }

        controller.editTag = function () {
            if(controller.documentTagSelected) {
                $location.url('/dts/mft/document-tag-config/edit/' + controller.documentTagSelected['cdn-docto-tag']);                
            }            
        }

        controller.deleteTag = function () {
            if(controller.documentTagSelected) {
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Atenção',
                    text: $rootScope.i18n('Deseja eliminar a Tag selecionada? Todas as regras da Tag e suas faixas de campos também serão eliminadas.'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(ok) {
                        if (ok) {
                            factory.deleteTag({cdnDoctoTag: controller.documentTagSelected['cdn-docto-tag']}, function (){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('Tag eliminada com sucesso!')                    
                                });
                                controller.loadData();
                            })
                        }                        
                    }
                });                
            }     
        }

        controller.copyTag = function () {
            if(controller.documentTagSelected) {
                $location.url('/dts/mft/document-tag-config/copy/' + controller.documentTagSelected['cdn-docto-tag']);                
            }            
        }

        controller.getRuleRange = function (tag) {
            var options = {'cdn-docto-tag': tag['cdn-docto-tag']}
            factory.getRuleRange(options, function(result) {
                if (result) { 
                    tag.ruleRange = result;       

                    // Cria um id para possibilitar o controle de tela
                    angular.forEach(tag.ruleRange, function (range, key) {
                        range['id'] = key;
                        range['cod-programa'] = range['cod-valor'];
                    })

                    controller.removeColumns(tag);
                }																					
			});
        }

        controller.removeColumns = function (tag) {
            $timeout(function () {
                if (controller.tagGrid) {
                    controller.tagGrid.hideColumn('["des-regra"]');

                    if(tag['cdn-acao'] == 2) {
                        controller.tagGrid.hideColumn('["cod-xml"]');
                        controller.tagGrid.hideColumn('["cod-programa"]');
                    } else {
                        controller.tagGrid.hideColumn('["cod-valor"]');
                    }

                    resizeService.doResize();                            
                }                
            }, 50);
        }

        controller.search = function () {
            controller.clearFilters();
            controller.addFilters();
            controller.loadData();
        }

        controller.clearFilters = function () {
            controller.disclaimers = [];            
        }

        controller.addActionFilter = function (action) {
            
            var searchValue = $.grep(controller.disclaimers, function (filter) {
                return filter.property.indexOf('actionFilter') >= 0;
            });
            var disclaimer = helper.addFilter("actionFilter", action, i18n('Ação'));

            if (searchValue.length > 0) {
                var index = controller.disclaimers.indexOf(searchValue[0]);
                controller.disclaimers[index] = disclaimer;
            } else {
                controller.disclaimers.push(disclaimer);
            }    

            controller.loadData();
        }

        controller.addFilters = function () {

            controller.disclaimers = [];
            
            // Filtro simples
            if (controller.quickSearchText && controller.quickSearchText.length > 0) {
                var searchValue = $.grep(controller.disclaimers, function (filter) {
                    return filter.property.indexOf('simpleFilter') >= 0;
                });
                var disclaimer = helper.addFilter("simpleFilter", controller.quickSearchText, i18n('l-simple-filter'));

                if (searchValue.length > 0) {
                    var index = controller.disclaimers.indexOf(searchValue[0]);
                    controller.disclaimers[index] = disclaimer;
                } else {
                    controller.disclaimers.push(disclaimer);
                }
            }

            // Filtro avançado
            if (controller.advancedSearch.model.doctoTagFirst || controller.advancedSearch.model.doctoTagLast) {
                var faixa = ' ',
                    deate = ' ' + i18n('l-from-start');
                if (controller.advancedSearch.model.doctoTagFirst) {
                    faixa = controller.advancedSearch.model.doctoTagFirst;
                    deate = controller.advancedSearch.model.doctoTagFirst;
                }
                if (controller.advancedSearch.model.doctoTagLast) {
                    faixa = faixa + ';' + controller.advancedSearch.model.doctoTagLast;
                    deate = deate + ' ' + i18n('l-to') + ' ' + controller.advancedSearch.model.doctoTagLast;
                } else {
                    faixa = faixa + ';ZZZZZZ';
                    deate = deate + ' ' + i18n('l-to-end');
                }
                controller.addDisclaimer('cod-docto', faixa, i18n('l-document') + ': ' + deate);
            }

            if (controller.advancedSearch.model.versionFirst || controller.advancedSearch.model.versionLast) {
                var faixa = ' ',
                    deate = ' ' + i18n('l-from-start');
                if (controller.advancedSearch.model.versionFirst) {
                    faixa = controller.advancedSearch.model.versionFirst;
                    deate = controller.advancedSearch.model.versionFirst;
                }
                if (controller.advancedSearch.model.versionLast) {
                    faixa = faixa + ';' + controller.advancedSearch.model.versionLast;
                    deate = deate + ' ' + i18n('l-to') + ' ' + controller.advancedSearch.model.versionLast;
                } else {
                    faixa = faixa + ';ZZZZZZ';
                    deate = deate + ' ' + i18n('l-to-end');
                }
                controller.addDisclaimer('cod-versao', faixa, i18n('l-version') + ': ' + deate);
            }

            if (controller.advancedSearch.model.codTagFirst || controller.advancedSearch.model.codTagLast) {
                var faixa = ' ',
                    deate = ' ' + i18n('l-from-start');
                if (controller.advancedSearch.model.codTagFirst) {
                    faixa = controller.advancedSearch.model.codTagFirst;
                    deate = controller.advancedSearch.model.codTagFirst;
                }
                if (controller.advancedSearch.model.codTagLast) {
                    faixa = faixa + ';' + controller.advancedSearch.model.codTagLast;
                    deate = deate + ' ' + i18n('l-to') + ' ' + controller.advancedSearch.model.codTagLast;
                } else {
                    faixa = faixa + ';ZZZZZZ';
                    deate = deate + ' ' + i18n('l-to-end');
                }
                controller.addDisclaimer('cod-tag', faixa, i18n('l-tag') + ': ' + deate);
            }

            if (controller.advancedSearch.model.codTagParentFirst || controller.advancedSearch.model.codTagParentLast) {
                var faixa = ' ',
                    deate = ' ' + i18n('l-from-start');
                if (controller.advancedSearch.model.codTagParentFirst) {
                    faixa = controller.advancedSearch.model.codTagParentFirst;
                    deate = controller.advancedSearch.model.codTagParentFirst;
                }
                if (controller.advancedSearch.model.codTagParentLast) {
                    faixa = faixa + ';' + controller.advancedSearch.model.codTagParentLast;
                    deate = deate + ' ' + i18n('l-to') + ' ' + controller.advancedSearch.model.codTagParentLast;
                } else {
                    faixa = faixa + ';ZZZZZZ';
                    deate = deate + ' ' + i18n('l-to-end');
                }
                controller.addDisclaimer('cod-tag-parent', faixa, i18n('l-tag-parent') + ': ' + deate);
            }

            if (controller.advancedSearch.model.dtIniValidFirst || controller.advancedSearch.model.dtIniValidLast) {
                var faixa = '01/01/1970',
                    deate = ' ' + i18n('l-from-start');
                if (controller.advancedSearch.model.dtIniValidFirst) {
                    faixa = $filter('date')(controller.advancedSearch.model.dtIniValidFirst, 'shortDate');
                    deate = $filter('date')(controller.advancedSearch.model.dtIniValidFirst, 'shortDate');
                }
                if (controller.advancedSearch.model.dtIniValidLast) {
                    faixa = faixa + ';' + $filter('date')(controller.advancedSearch.model.dtIniValidLast, 'shortDate');
                    deate = deate + ' ' + i18n('l-to') + ' ' + $filter('date')(controller.advancedSearch.model.dtIniValidLast, 'shortDate');
                } else {
                    faixa = faixa + ';31/12/9999';
                    deate = deate + ' ' + i18n('l-to-end');
                }
                controller.addDisclaimer('dat-inic-valid', faixa, i18n('l-dt-ini-valid') + ': ' + deate);
            }

            if (controller.advancedSearch.model.dtEndValidFirst || controller.advancedSearch.model.dtEndValidLast) {
                var faixa = '01/01/1970',
                    deate = ' ' + i18n('l-from-start');
                if (controller.advancedSearch.model.dtEndValidFirst) {
                    faixa = $filter('date')(controller.advancedSearch.model.dtEndValidFirst, 'shortDate');
                    deate = $filter('date')(controller.advancedSearch.model.dtEndValidFirst, 'shortDate');
                }
                if (controller.advancedSearch.model.dtEndValidLast) {
                    faixa = faixa + ';' + $filter('date')(controller.advancedSearch.model.dtEndValidLast, 'shortDate');
                    deate = deate + ' ' + i18n('l-to') + ' ' + $filter('date')(controller.advancedSearch.model.dtEndValidLast, 'shortDate');
                } else {
                    faixa = faixa + ';31/12/9999';
                    deate = deate + ' ' + i18n('l-to-end');
                }
                controller.addDisclaimer('dat-fim-valid', faixa, i18n('l-dt-end-valid') + ': ' + deate);
            }            
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

            if (disclaimer.property == "cod-docto") {
                controller.advancedSearch.model.doctoTagLast = "";
                controller.advancedSearch.model.doctoTagLast = "";
            }

            if (disclaimer.property == "cod-version") {
                controller.advancedSearch.model.versionFirst = "";
                controller.advancedSearch.model.versionLast = "";
            }

            if (disclaimer.property == "cod-tag") {
                controller.advancedSearch.model.codTagFirst = "";
                controller.advancedSearch.model.codTagLast = "";
            }

            if (disclaimer.property == "cod-tag-parent") {
                controller.advancedSearch.model.codTagParentFirst = "";
                controller.advancedSearch.model.codTagParentLast = "";
            }

            if (disclaimer.property == "dat-inic-valid") {
                controller.advancedSearch.model.dtIniValidFirst = "";
                controller.advancedSearch.model.dtIniValidLast = "";
            }

            if (disclaimer.property == "dat-fim-valid") {
                controller.advancedSearch.model.dtEndValidFirst = "";
                controller.advancedSearch.model.dtEndValidLast = "";
            }

            // Dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == null)
                controller.quickSearchText = '';

            // Recarrega os dados quando remove um disclaimer
            controller.loadData();
        }

        controller.showXml = function(rule) {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-xml.html',
                controller: 'mft.document-tag-config.xml.controller as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        var params = {
                            'xml': rule["cod-xml"]                            
                        }
                        return params;
                    }
                }
            });
    
            modalInstance.result.then(function () {
                
            });            
        }

        controller.openAdvancedSearch = function () {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-adv-search.html',
                controller: 'mft.document-tag-config.adv-search.controller as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        return controller.advancedSearch;
                    }
                }
            });

            modalInstance.result.then(function () {
                controller.search();
            });
        }

        appViewService.startView(i18n('l-document-tag-config'));

        controller.loadData();
    }
    index.register.controller('mft.document-tag-config.controller', documentTagConfigController);

    // documentTagConfigAdvSearchController 
    documentTagConfigAdvSearchController.$inject = ['$modalInstance', 'model'];

    function documentTagConfigAdvSearchController($modalInstance, model) {

        this.advancedSearch = model;

        this.search = function () {
            $modalInstance.close();
        }

        this.close = function () {
            $modalInstance.dismiss();
        }
    }
    index.register.controller('mft.document-tag-config.adv-search.controller', documentTagConfigAdvSearchController);

    // documentTagConfigAddEditController
    documentTagConfigAddEditController.$inject = ['$rootScope','$stateParams','$location','$state','$filter','$modal','$timeout','mft.document-tag-config.Factory','TOTVSEvent'];

    function documentTagConfigAddEditController($rootScope, $stateParams, $location, $state, $filter, $modal, $timeout, factory, TOTVSEvent) {

        var controller = this;
        var i18n = $filter('i18n');

        controller.tagInf = true;
        controller.ruleInf = true;

        controller.state = ($state.is('dts/mft/document-tag-config.new') ? 'new' : $state.is('dts/mft/document-tag-config.edit') ? 'edit' : 'copy') 
                
        controller.typeOperation = [
            {id: 1, desc: i18n("Não enviar")},
            {id: 2, desc: i18n("Enviar Fixo")},
            {id: 3, desc: i18n("Multiplicar por")},
            {id: 4, desc: i18n("Limitar tamanho")},
            {id: 5, desc: i18n("Formato numérico")},
            {id: 6, desc: i18n("Programa")},
        ];

        controller.documentOption = [
            {id: "NF-e", desc: i18n("NF-e")},
            {id: "NFS-e", desc: i18n("NFS-e")},
        ];

        controller.actionOption = [
            {id: 1, desc: i18n("Inclusão de Tag")},
            {id: 2, desc: i18n("Alteração de Tag")},
        ];

        controller.loadData = function () {
            if (controller.state == 'new') {
                controller.tag = {
                    'cdn-operac': 1,
                    'cdn-acao': 1,   
                    'cod-docto': "NF-e",
                    'dat-inic-valid': new Date(),
                    'dat-fim-valid': new Date()
                }
            } else {
                controller.getTag();
                              
            }                        
        }

        controller.getTag = function () {
            factory.getTag({'cdn-docto-tag': $stateParams.cdnDoctoTag}, function(result) {
                if (result) {
                    $timeout(function () {                        
                        controller.tag = result[0];                            

                        controller.getRuleRange();  
                    }, 100);                   
                }
            });           
        }      

        controller.getRuleRange = function () {
            factory.getRuleRange({'cdn-docto-tag': $stateParams.cdnDoctoTag}, function(result) {
                if (result) {
                    controller.range = result;    
                    
                    // Cria um id para possibilitar o controle de tela
                    angular.forEach(controller.range, function (range, key) {
                        range['id'] = key;
                        range['cod-programa'] = range['cod-valor'];
                    })
                    
                    controller.removeColumns();
                }
            });
        }        

        controller.removeColumns = function () {
            $timeout(function () {
                if (controller.ruleGrid) {
                    controller.ruleGrid.hideColumn('["des-regra"]');   

                    if(controller.tag['cdn-acao'] == 2) {
                        controller.ruleGrid.hideColumn('["cod-xml"]');
                        controller.ruleGrid.hideColumn('["cod-programa"]');
                    } else {
                        controller.ruleGrid.hideColumn('["cod-valor"]');
                    }

                    resizeService.doResize();
                }                
            }, 50);
        }

        controller.changeTypeOperation = function() {
            if (controller.tag['cdn-operac'] == 1) {
                controller.tag['cod-valor'] = "";
            }
        }

        controller.cancel = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function (ok) {
                    if (ok) {
                        $state.go('dts/mft/document-tag-config.start');
                    }
                }
            });
        }

        controller.confirm = function () {
            var options = {
                'cdnDoctoTag': $stateParams.cdnDoctoTag,
                'type': controller.state,
                'tag': controller.tag                             
            }
            factory.createUpdateTag(options, function(result){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('Tag salva com sucesso!')                    
                });
                if (controller.state == "new" || controller.state == "copy") {
                    $location.url('/dts/mft/document-tag-config/edit/' + result[0]['cdn-docto-tag']); 
                } else {
                    $location.url('/dts/mft/document-tag-config/'); 
                }                
            })
        }

        controller.addRule = function () {
            // Somente é possível incluir regras após a tag estar cadastrada
            if(controller.state == 'edit') { 
                var modalInstance = $modal.open({
                    templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-add-edit-rule.html',
                    controller: 'mft.document-tag-config.add-edit-rule.controller as controller',
                    size: 'lg',
                    resolve: {
                        model: function () {
                            var params = {
                                'cdnDoctoTag': $stateParams.cdnDoctoTag,
                                'state': 'new',
                                'action': controller.tag['cdn-acao'],
                                'rule' : controller.tag,
                                'range': undefined
                            }
                            return params;
                        }
                    }
                });
        
                modalInstance.result.then(function () {
                    controller.getRuleRange();
                });
            } 
        }
        
        controller.editRule = function () {
            if(controller.ruleSelected && controller.state == 'edit') {
                var modalInstance = $modal.open({
                        templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-add-edit-rule.html',
                        controller: 'mft.document-tag-config.add-edit-rule.controller as controller',
                        size: 'lg',
                        resolve: {
                            model: function () {
                                var params = {
                                    'cdnDoctoTag': $stateParams.cdnDoctoTag,
                                    'state': 'edit',
                                    'action': controller.tag['cdn-acao'],
                                    'rule' : angular.copy(controller.ruleSelected),
                                    'range' : angular.copy(controller.range.filter(function(obj) {return obj['cdn-docto-tag-regra'] == controller.ruleSelected['cdn-docto-tag-regra'];}))
                                }
                                return params;
                            }
                        }
                    });
            
                    modalInstance.result.then(function () {
                        controller.getRuleRange();
                    });                
            }            
        } 

        controller.deleteRule = function () {
            if(controller.ruleSelected && controller.state == 'edit') {
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Atenção',
                    text: $rootScope.i18n('Deseja eliminar a regra selecionada? Todas as faixas de campos da regra também serão eliminadas.'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(ok) {
                        if (ok) {
                            factory.deleteRuleRange({cdnDoctoTagRegra: controller.ruleSelected['cdn-docto-tag-regra']}, function (){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('Regra eliminada com sucesso!')                    
                                });
                                controller.loadData();
                            })
                        }                        
                    }
                });      
            } 
        } 

        controller.copyRule = function () {
            if(controller.ruleSelected && controller.state == 'edit') {
                var modalInstance = $modal.open({
                    templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-add-edit-rule.html',
                    controller: 'mft.document-tag-config.add-edit-rule.controller as controller',
                    size: 'lg',
                    resolve: {
                        model: function () {
                            var params = {
                                'cdnDoctoTag': $stateParams.cdnDoctoTag,
                                'state': 'copy',
                                'action': controller.tag['cdn-acao'],
                                'rule' : angular.copy(controller.ruleSelected),
                                'range' : angular.copy(controller.range.filter(function(obj) {return obj['cdn-docto-tag-regra'] == controller.ruleSelected['cdn-docto-tag-regra'];}))
                            }
                            return params;
                        }
                    }
                });
        
                modalInstance.result.then(function () {
                    controller.getRuleRange();
                });            
            } 
        }

        controller.showXml = function(rule) {
            var modalInstance = $modal.open({
                templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-xml.html',
                controller: 'mft.document-tag-config.xml.controller as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        var params = {
                            'xml': rule["cod-xml"]                            
                        }
                        return params;
                    }
                }
            });
    
            modalInstance.result.then(function () {
                
            });            
        }

        controller.loadData();
    }   

    index.register.controller('mft.document-tag-config.add-edit.controller', documentTagConfigAddEditController);

    // documentTagConfigAddEditRuleController 
    documentTagConfigAddEditRuleController.$inject = ['$rootScope', '$modalInstance', '$filter', 'model', 'mft.document-tag-config.Factory', 'TOTVSEvent'];

    function documentTagConfigAddEditRuleController($rootScope, $modalInstance, $filter, model, factory, TOTVSEvent) {

        var controller = this;
        var i18n = $filter('i18n');
    
        controller.cdnDoctoTag = model.cdnDoctoTag;
        controller.rule = model.rule;
        controller.range = model.range;
        controller.state = model.state;
        controller.action = model.action;

        // Inclusão de uma nova regra
        if (controller.state == 'new') {
            controller.range = [];
            controller.rule = {
                'cdn-docto-tag': controller.cdnDoctoTag,
                'cdn-operac': (controller.action == 1 ? 7 : model.rule['cdn-operac']),
                'cod-valor': model.rule['cod-valor']
            }    
        }

        controller.typeOperation = [
            {id: 1, desc: i18n("Não enviar")},
            {id: 2, desc: i18n("Enviar Fixo")},
            {id: 3, desc: i18n("Multiplicar por")},
            {id: 4, desc: i18n("Limitar tamanho")},
            {id: 5, desc: i18n("Formato numérico")},
            {id: 6, desc: i18n("Programa")},
        ];

        controller.close = function () {
            $modalInstance.dismiss();
        }

        controller.changeTypeOperation = function() {
            if (controller.rule['cdn-operac'] == 1) {
                controller.rule['cod-valor'] = "";
            }
        }

        controller.addRange = function (){
            var range = {
                'id': controller.range.length + 1,
                'cod-campo':'CFOP',
                'cod-val-inic':'',
                'cod-val-fim':''
            }
            controller.range.push(range);            
        }
        
        controller.deleteRange = function () {
            if(controller.rangeSelected) {
                angular.forEach(controller.range, function (range, key) {
                    if(range.id === controller.rangeSelected.id) {
                        controller.range.splice(key,1);
                    }
                });
            } else {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: $rootScope.i18n('l-warning'),
                    detail: $rootScope.i18n('l-select-range')
                });
            }           
        }
        
        controller.confirm = function () {
            if (controller.checkDuplicateInObject('cod-campo', controller.range)) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('Não é possível cadastrar uma faixa com campos duplicados')                    
                });
            } else {
                if (controller.rule && controller.range && controller.range.length > 0) {
                    var options = {
                        'type': controller.state,
                        'rule': controller.rule,
                        'range': controller.range
                    }
                    factory.createUpdateRuleRange(options, function(){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('Regra salva com sucesso!')                    
                        });
                        $modalInstance.close();
                    })
                } else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('A regra deve possuir ao menos uma faixa')                    
                    });
                }
            }
        }

        controller.checkDuplicateInObject = function (propertyName, inputArray) {
            var seenDuplicate = false,
                testObject = {};
          
            inputArray.map(function(item) {
              var itemPropertyName = item[propertyName];    
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
    }
    index.register.controller('mft.document-tag-config.add-edit-rule.controller', documentTagConfigAddEditRuleController);

    // documentTagConfigXmlController 
    documentTagConfigXmlController.$inject = ['$modalInstance', 'model'];

    function documentTagConfigXmlController($modalInstance, model) {

        var controller = this;
        
        controller.xml = model.xml;
        
        controller.close = function () {
            $modalInstance.dismiss();
        }        
    }
    index.register.controller('mft.document-tag-config.xml.controller', documentTagConfigXmlController);
});