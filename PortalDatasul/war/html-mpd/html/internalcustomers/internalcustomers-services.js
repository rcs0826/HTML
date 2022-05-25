define([
    'index',
    '/dts/mpd/js/api/fchdis0048.js',
    '/dts/mpd/js/userpreference.js',
    '/dts/mpd/js/portal-factories.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function(index) {
    'use strict';

    internalCustomersListController.$inject = [
        '$scope', '$rootScope', 'mpd.customerapd.Factory', '$filter', 'mpd.internalcustomers.helper',
        'mpd.internalcustomers.modal.advanced.search', '$totvsprofile', 'totvs.app-main-view.Service', 
        '$stateParams', 'salesorder.salesorders.Factory', '$q', 'userPreference', '$location', 
        'TOTVSEvent', '$timeout', 'mpd.internalcustomers.suppliermaisnegocios.modal.service'
    ];
    function internalCustomersListController($scope, $rootScope, internalCustomersFactory, $filter, helper,
    modalAdvancedSearch, $totvsprofile, appViewService, $stateParams, salesorders, $q, userPreference, $location, 
    TOTVSEvent, $timeout, modalSupplierMaisNegociosModal) {
                                                                                        
        var vm = this;
        
        var quantidadeAtivos   = 0;
        var quantidadeInativos = 0;
        var quantidadeTotal    = 0; 

        vm.i18n = $filter('i18n');
        vm.disclaimers = [];
        vm.quickFilters = [];
        vm.listOfCustomFilters = [];
        vm.orderList = [];
        vm.allUserGroups = [];
        vm.orderItems = {};
        vm.customerSuspended = false;   
        vm.supplierParams = [];  
        vm.useRisk = false;
        vm.customGridLodashData = {useRisk: false};
        vm.initialStart = false;
                                                       
        this.init = function init() { 

            salesorders.getOrderParam({},function(dataParams){    
                
                internalCustomersFactory.getSupplierParam({}, function(data) {
                    vm.supplierParams = data;  
                    angular.forEach(vm.supplierParams, function(param, key) {
                        if(param.paramCode == 'log_integr_mng') {
                            vm.useRisk = param.paramValue == 'yes' ? true : false;
                            vm.customGridLodashData.useRisk = vm.useRisk;
                        }
                    });

                    if($stateParams.portletopen == 'true'){                  
                        vm.setDefaults(function() {                
                            $q.all([userPreference.getPreference('custSummaryGroups')]).then(function(results) {
                                if (results[0].prefValue){
                                    vm.disclaimers = angular.fromJson(results[0].prefValue);                                                                                                                                                                                          
                                    angular.forEach(vm.disclaimers, function(value, key) {
                                        var codeGroup = value.title.split(' - ');                                                                                                         
                                        vm.allUserGroups.push({codgrcli: codeGroup[0]}); 
                                    });                                                                                    
                                }                                                       
                               
                               vm.search(false);
                               vm.initialStart = true;
                            }); 
                        });
                    }else{
                        vm.setDefaults(function() {
                            vm.search(false);
                            vm.initialStart = true;
                        });
                    }


                });
                        
            });
            
        };

        vm.setDefaults = function setDefaults(callback) {
            // Default filters
            vm.quickFilters = [{
                property: 'quickfilter',
                value: [
                    helper.addFilter('tag.status', '3', $rootScope.i18n('l-all'), 'boolean')
                ],
                title: $rootScope.i18n('l-all', [], 'dts/mpd')
            },{
                property: 'quickfilter',
                value: [
                    helper.addFilter('tag.status', '1', $rootScope.i18n('l-active'), 'boolean')
                ],
                title: $rootScope.i18n('l-active', [], 'dts/mpd') 
            },{
                property: 'quickfilter',
                value: [
                    helper.addFilter('tag.status', '2', $rootScope.i18n('l-inactive'), 'boolean')
                ],
                title: $rootScope.i18n('l-inactive', [], 'dts/mpd')
            }];

            if(vm.useRisk) {
                vm.quickFilters.push ({
                    property: 'quickfilter',
                    value: [
                        helper.addFilter('tag.status', '4', $rootScope.i18n('l-supplier-customer-risk-active'), 'boolean')
                    ],
                    title: $rootScope.i18n('l-supplier-customer-risk-active', [], 'dts/mpd')
                });
            }


            // Custom filters
            $totvsprofile.remote.get('dts.mpd.internalcustomers.filters', '', function(result) {
                if(result) {
                    vm.listOfCustomFilters = [];
                    result.forEach(function(filter) {
                        vm.listOfCustomFilters.push({
                            'property': 'quickfilter',
                            'title': filter.dataCode,
                            'value': filter.dataValue
                        });
                    });
                }
            });

            // Filtro default do usuário
            $totvsprofile.remote.get('/dts/mpd/internalcustomers', '$defaultfilter', function(result) {
                if(result.length > 0) {
                    vm.disclaimers = result[0].dataValue.value;                                        
                } else { // Se não for selecionado um filtro default
                    vm.disclaimers = [];
                    vm.disclaimers.push(helper.addFilter('tag.status', '3', $rootScope.i18n('l-all'), 'boolean')); //ativos                    
                }
                
                callback();
            });
           
        };

        vm.getSuspendedCustomers = function(codigo, identific, indCreCli){
            
            if(identific != 2){
                if(indCreCli == 4){                       
                    vm.customerSuspended = true;                                     
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {                        
                        type: 'error',                        
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('l-customer-suspended')
                    });                                      
                }
                else
                    vm.customerSuspended = false;                                
            }                                                
        };

        vm.search = function search(isMore) {
                                                
            var options, filters = [];

            vm.orderListCount = 0;
            if (!isMore) {
                vm.orderList = [];
            }

            options = {
                start: vm.orderList.length,
                max: 50
            };

            // Parâmetros para a API
            angular.extend(options, helper.parseDisclaimersToParameters(vm.disclaimers));
                                    
            internalCustomersFactory.getInternalCustomers(options, vm.allUserGroups, function(result) {
                if(result && result[0] && result[0].hasOwnProperty('$length')) {
                    vm.orderListCount = result[0].$length;
                }
                
                vm.orderList = vm.orderList.concat(result);                                                                                 
                                                
                vm.maxquantityphones = 0;
                
                angular.forEach(vm.orderList, function(valuemain, key) {
                    
                    vm.phonelist = "";
                    angular.forEach(valuemain['telefone'], function(value, key) {
                        if(vm.phonelist != ""){
                            if(value != "") vm.phonelist = vm.phonelist + ' | ' + value;
                        }else{
                            vm.phonelist = value;
                        }
                    }); 
                    valuemain['telefonelist'] = vm.phonelist;
                                        
                    vm.contactlist = "";
                    angular.forEach(valuemain['contato'], function(value, key) {
                        if(vm.contactlist != ""){
                            if(value != "") vm.contactlist = vm.contactlist + ' | ' + value;
                        }else{
                            vm.contactlist = value;
                        }
                    }); 
                    valuemain['contatolist'] = vm.contactlist;     
                                        
                    vm.branchlinelist = "";
                    angular.forEach(valuemain['ramal'], function(value, key) {
                        if(vm.branchlinelist != ""){
                            if(value != "") vm.branchlinelist = vm.branchlinelist + ' | ' + value;
                        }else{
                            vm.branchlinelist = value;
                        }
                    }); 
                    valuemain['ramallist'] = vm.branchlinelist;  
                    
                    valuemain['natureza-desc'] = valuemain['natureza'] + ' - ' + valuemain['desc-natureza'];
                    valuemain['cod-gr-cli-desc'] = valuemain['cod-gr-cli'] + ' - ' + valuemain['desc-gr-cli'];   
                    
                    if(vm.useRisk == true) {
                        valuemain['statusMaisNegocios'] = valuemain['idi-status-emit'] + ' - ' + valuemain['des-status-emit'];   
                    }                    
                    
                });                                        
            });
            
            
            angular.forEach(vm.disclaimers, function(value, key) {
                if(((value.property == "tag.status")&&(value.value == "1"))||((value.property == "tag.status")&&(value.value == "2"))){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'info',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('O filtro por clientes ativos ou inativos é menos performático, devido a verificação da última venda.')
                    });
                }
            }); 
            
        };
        
        this.reloadQuickFilters = function(){
            // Default filters
            vm.quickFilters = [{
                property: 'quickfilter',
                value: [
                    helper.addFilter('tag.status', '1', $rootScope.i18n('l-active'), 'boolean')
                ],
                title: $rootScope.i18n('l-active', [], 'dts/mpd') + "(" + quantidadeAtivos + ")" 
            },{
                property: 'quickfilter',
                value: [
                    helper.addFilter('tag.status', '2', $rootScope.i18n('l-inactive'), 'boolean')
                ],
                title: $rootScope.i18n('l-inactive', [], 'dts/mpd') + "(" + quantidadeInativos + ")"
            },{
                property: 'quickfilter',
                value: [
                    helper.addFilter('tag.status', '3', $rootScope.i18n('l-all'), 'boolean')
                ],
                title: $rootScope.i18n('l-all', [], 'dts/mpd') + "(" + quantidadeTotal + ")"
            }];

            if(vm.useRisk) {
                vm.quickFilters.push ({
                    property: 'quickfilter',
                    value: [
                        helper.addFilter('tag.status', '4', $rootScope.i18n('l-supplier-customer-risk-active'), 'boolean')
                    ],
                    title: $rootScope.i18n('l-supplier-customer-risk-active', [], 'dts/mpd') + "(" + quantidadeTotal + ")"
                });
            }

        }
        
        this.customerButton = function(buttonId){
                                                
            if(!vm.customerListSelectedCust){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'info',
                            title: $rootScope.i18n('l-attention'),
                            detail: $rootScope.i18n('l-select-customer')
                    });
                return;   
            }  
            
            switch(buttonId){ 
                case 'btcustomerdetail':
                    $location.url('/dts/mpd/internalcustomerdetail/' + vm.customerListSelectedCust['cod-emitente']);
                    break;                     
                case 'btneworder':
                    if(vm.customerSuspended == false){
                        $location.url('/dts/mpd/pd4000/model/' + vm.customerListSelectedCust['cod-emitente']);
                    }                                                                                        
                    break;                
                case 'btcustomerorders':
                    $location.url('dts/mpd/internalsalesorders/openbycustomer/' + vm.customerListSelectedCust['nome-abrev']);
                    break;                                        
                case 'btselectcustomer':                    
                    vm.selectCustomer(vm.customerListSelectedCust['cod-emitente']);
                    break;
            }
        };
        
        vm.selectCustomer = function(codEmitente){            
            var params = {};                 
            params.codEmitente = codEmitente;             
            internalCustomersFactory.findByCustomerCode(params, function(data) {
                $rootScope.selectedcustomer = data[0];
                
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-selected-customer'),
                    detail: $rootScope.selectedcustomer['cod-emitente'] +  ' - ' +  $rootScope.selectedcustomer['nome-abrev']
                });                                 
            });
        };        
       
        vm.getItems = function getItems(order) {
            if(order['nr-pedido']) {
                internalCustomersFactory.getInternalCustomerItems({
                    'short_name': order['nome-abrev'],
                    'customer_order': order['nr-pedcli']
                }, function(result) {
                    vm.orderItems[order['nr-pedido']] = result;
                });
            }
        };

        vm.applySimpleFilter = function applySimpleFilter() {
            if (vm.quickSearch && vm.quickSearch.trim().length > 0) {
                var quickSearch = $.grep(vm.disclaimers, function(filter){ return filter.property.indexOf('quickSearch') >= 0; });
                var disclaimer = helper.addFilter('quickSearch', vm.quickSearch, $rootScope.i18n('l-simple-filter'));

                if(quickSearch.length > 0) {
                    var index = vm.disclaimers.indexOf(quickSearch[0]);
                    vm.disclaimers[index] = disclaimer;
                } else {  
                    vm.disclaimers.push(disclaimer);
                }
            }else{
                vm.disclaimers.forEach(function(tag) {                                       
                    var index = tag.property.indexOf('quickSearch');
                    if (index >= 0) {
                        vm.disclaimers.splice(vm.disclaimers.indexOf(tag), 1);
                    }
                }); 
            }
            vm.search(false);
        };


        vm.removeDisclaimer = function removeDisclaimer(disclaimer) {
            var index = vm.disclaimers.indexOf(disclaimer);
            if(index >= 0) {
                vm.disclaimers.splice(index,1);
            }
            vm.search(false);
        };


        vm.openAdvancedSearch = function openAdvancedSearch() {
            var instance = modalAdvancedSearch.open({
                'filters': vm.disclaimers,
                'isQuickFilter': false,
                'useRisk': vm.useRisk
            });
            onCloseAdvancedSearch(instance);
        };


        vm.addEditCustomFilters = function addEditCustomFilters(filter) {
            var instance = modalAdvancedSearch.open({
                'filters': filter,
                'isQuickFilter': true,
                'isFilterEdit': filter.hasOwnProperty('title'),
                'filtersToLoad': vm.disclaimers
            });
            onCloseAdvancedSearch(instance, true, filter.hasOwnProperty('title'), filter);
        };

        function onCloseAdvancedSearch(instance, isQuickFilter, isFilterEdit, customFilter) {
            instance.then(function(parameters) {
                                    
                if(isQuickFilter) {
                    if(isFilterEdit) { // Edição do filtro (sobrescreve os disclaimerss)
                        var index = vm.listOfCustomFilters.indexOf(customFilter);
                        vm.listOfCustomFilters[index].value = parameters.filters;
                    } else { // Novo filtro
                        vm.listOfCustomFilters.push(parameters.customFilter);
                    }
                }

                // Se deve buscar os registros novamente de acordo com os filtros
                if(parameters.search) {
                    vm.disclaimers = parameters.filters;                                                            
                    vm.search(false);
                }                                                
            });
        }


        vm.removeCustomFilter = function removeCustomFilter(filter) {
            $totvsprofile.remote.remove('dts.mpd.internalcustomers.filters', filter.title, function(result) {
                if(!result.$hasError) {
                    var index = vm.listOfCustomFilters.indexOf(filter);
                    vm.listOfCustomFilters.splice(index, 1);
                }
            });
        };

        vm.setQuickFilter = function setQuickFilter(filter) {
            vm.disclaimers = [].concat(filter.value);
            vm.search(false);
        };

        vm.openSupplierMaisNegocios = function openSupplierMaisNegocios(customerObj) {

            if(!vm.customerListSelectedCust){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'info',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-select-customer-on-grid')
                });
                return;   
            }

            var instance = modalSupplierMaisNegociosModal.open({
                'customer': customerObj
            });
            onCloseSupplierMaisNegocios(instance);
        };

        function onCloseSupplierMaisNegocios(instance, isQuickFilter, isFilterEdit, customFilter) {
            instance.then(function(parameters) {
                                                                                   
            });
        }

        $timeout(function () {
			if (vm.grid && vm.grid.hasOwnProperty('content')) {
				vm.grid.content.dblclick(function () {
					vm.customerButton('btcustomerdetail');
				});
			}
        });

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        //if ($rootScope.currentuserLoaded) { vm.init(); }
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        $scope.$on('$destroy', function () {
            vm = undefined;
        });
                
        if (appViewService.startView( vm.i18n('l-customer-portfolio'), 'mpd.internalcustomers.advanced.search.control', this)) {
            vm.init();
        }else{
        //    vm.init();
        }                                
        
    }


    

    // *************************************************************************************
    // *** CONTROLLER MODAL ADAVANCED SEARCH
    // *************************************************************************************
    internalCustomersAdvancedSearchController.$inject = ['$modalInstance', 'parameters', '$rootScope', 'mpd.internalcustomers.helper', 'portal.getUserData.factory', '$totvsprofile', 'salesorder.salesorders.Factory', 'TOTVSEvent'];
    function internalCustomersAdvancedSearchController($modalInstance, parameters, $rootScope, helper, userData, $totvsprofile, salesorders, TOTVSEvent) {
        
        var vm = this;
        vm.model = {};
        vm.currentUser = userData;
        vm.isQuickFilter = parameters.isQuickFilter;
        vm.useRisk = parameters.useRisk;
        vm.isFilterEdit = parameters.isFilterEdit;
        vm.filtersToLoad = parameters.filtersToLoad;
        vm.isDefaultFilter = false;
        
        var wasDefaultFilter;

        vm.init = function init() {            

            if(parameters.isQuickFilter && parameters.isFilterEdit) {
                vm.customFilter = parameters.filters;
                vm.model = helper.parseDisclaimersToFilter(parameters.filters.value);

                $totvsprofile.remote.get('/dts/mpd/internalcustomers', '$defaultfilter', function(result) {
                    vm.isDefaultFilter = result.length > 0 && vm.customFilter.title === result[0].dataValue.title;
                    wasDefaultFilter = vm.isDefaultFilter;
                });
            } else if(!parameters.isQuickFilter) {
                vm.model = helper.parseDisclaimersToFilter(parameters.filters);
            }
        };
                
        vm.loadFilters = function() {
            angular.forEach(vm.filtersToLoad, function(filter, key) {
                switch (filter.property) {
                    case 'nomeAbrevIni':
                        vm.model.nomeAbrevIni = filter.value
                    break;
                    case 'nomeAbrevFim':
                        vm.model.nomeAbrevFim = filter.value
                    break;
                    case 'codEmitenteIni':
                        vm.model.codEmitenteIni = filter.value
                    break;
                    case 'codEmitenteFim':
                        vm.model.codEmitenteFim = filter.value
                    break;
                    case 'codGrCliIni':
                        vm.model.codGrCliIni = filter.value
                    break;
                    case 'codGrCliFim':
                        vm.model.codGrCliFim = filter.value
                    break;
                    case 'nomeEmit':
                        vm.model.nomeEmit = filter.value
                    break;
                    case 'telefone':
                        vm.model.telefone = filter.value
                    break;
                    case 'endereco':
                        vm.model.endereco = filter.value
                    break;
                    case 'eMail':
                        vm.model.eMail = filter.value
                    break;
                    case 'contato':
                        vm.model.contato = filter.value
                    break;
                    case 'cep':
                        vm.model.cep = filter.value
                    break;
                    case 'bairro':
                        vm.model.bairro = filter.value
                    break;
                    case 'caixaPostal':
                        vm.model.caixaPostal = filter.value
                    break;
                    case 'cidade':
                        vm.model.cidade = filter.value
                    break;
                    case 'estado':
                        vm.model.estado = filter.value
                    break;
                    case 'categoria':
                        vm.model.categoria = filter.value
                    break;
                    case 'homePage':
                        vm.model.homePage = filter.value
                    break;                                                                                                                                                
                    case 'dataImplantIni':
                        vm.model.dataImplantIni = filter.value
                    break;
                    case 'dataImplantFim':
                        vm.model.dataImplantFim = filter.value
                    break;
                    case 'linhaProdutIni':
                        vm.model.linhaProdutIni = filter.value
                    break;
                    case 'linhaProdutFim':
                        vm.model.linhaProdutFim = filter.value
                    break;       
                    case 'tag.status':
                        vm.model['tag.status'] = filter.value;
                    break;
                    case 'tag.status':
                        vm.model['tag.status'] = filter.value;
                    break;                    
                }                                
            });
        };        

 
        vm.search = function search() {
            $modalInstance.close({
                'filters': parseFiltersToDisclaimers(),
                'search': true
            });
        };


        vm.save = function save(search) {
            var filters = parseFiltersToDisclaimers();
            
            if (!vm.customFilter) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('l-filer-title-validate')
                });
                return;
            } else {
                if (!vm.customFilter.title) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('l-filer-title-validate')
                    });
                    return;
                }
            }            
            
            var customFilter = {
                'property': 'quickfilter',
                'title': vm.customFilter.title,
                'value': filters
            };

            $totvsprofile.remote.set('dts.mpd.internalcustomers.filters', {dataCode: vm.customFilter.title, dataValue: filters}, function(result) {
                $modalInstance.close({
                    'filters': filters,
                    'search': search,
                    'customFilter': customFilter
                });
            });

            if(vm.isDefaultFilter) { // Se é um filtro padrão
                $totvsprofile.remote.set('/dts/mpd/internalcustomers', {dataCode: '$defaultfilter', 'dataValue': customFilter});
            } else if(wasDefaultFilter) { // Se era um filtro padrão e o usuário desmarcou, elimina das preferencias
                $totvsprofile.remote.remove('/dts/mpd/internalcustomers', '$defaultfilter');
            }
        };


        vm.clear = function clear() {
            vm.model = {};
        };


        vm.close = function close() {
            $modalInstance.dismiss();
        };


        function parseFiltersToDisclaimers() {
            var filters = [];

            for (var property in vm.model) {
                if (vm.model.hasOwnProperty(property) && vm.model[property]) {
                    switch (property) {
                        case 'nomeAbrevIni':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-nome-abrev-start')));
                        break;
                        case 'nomeAbrevFim':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-nome-abrev-end')));
                        break;
                        case 'codEmitenteIni':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-cod-customer-inicial')));
                        break;
                        case 'codEmitenteFim':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-cod-customer-final')));
                        break;
                        case 'codGrCliIni':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-gr-cli-inicial')));
                        break;
                        case 'codGrCliFim':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-gr-cli-final')));
                        break;
                        case 'nomeEmit':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-nome-emit')));
                        break;
                        case 'telefone':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-telefone')));
                        break;
                        case 'endereco':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-endereco')));
                        break;
                        case 'eMail':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-email')));
                        break;
                        case 'contato':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-contato')));
                        break;
                        case 'cep':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-cep')));
                        break;
                        case 'bairro':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-bairro')));
                        break;
                        case 'caixaPostal':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-caixa-postal')));
                        break;
                        case 'cidade':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-cidade')));
                        break;
                        case 'estado':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-estado')));
                        break;
                        case 'categoria':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-categoria')));
                        break;
                        case 'homePage':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-home-page')));
                        break;                                                                                                                                                
                        case 'dataImplantIni':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-initial-dt-impl'), 'date'));
                        break;
                        case 'dataImplantFim':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-final-dt-impl'), 'date'));
                        break;
                        case 'linhaProdutIni':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-linha-prod-ini')));
                        break;
                        case 'linhaProdutFim':
                            filters.push(helper.addFilter(property, vm.model[property], $rootScope.i18n('l-linha-prod-fim')));
                        break;       
                        case 'tag.status':
                            switch (vm.model[property]) {
                                case '1':
                                    filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-active'), 'boolean'));
                                break;
                                case '2':
                                    filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-inactive'), 'boolean'));
                                break;
                                case '3':
                                    filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-all'), 'boolean'));
                                break;
                                case '4':
                                    filters.push(helper.addFilter('tag.status', vm.model[property], $rootScope.i18n('l-supplier-customer-risk-active'), 'boolean'));
                                break;
                            }
                        break;                                                                                                                                                                                         
                    }
                }
            }

            return filters;
        }

        vm.init();
    }
    
    

    // *************************************************************************************
	// *** HELPER
	// *************************************************************************************
    internalCustomersHelper.$inject = ['$filter'];
    function internalCustomersHelper($filter) {
        return {

            addFilter: function (property, value, title, type, hide) {
                var filter = {
                    'property': property,
                    'value': value,
                    'type': type ? type : 'string',
                    'hide': hide === true
                };

                switch (type) {
                    case 'date':
                        filter.title = title + ': ' + $filter('date')(value, 'shortDate');
                    break;
                    case 'boolean':
                        filter.title = title;
                    break;
                    default:
                        filter.title = title + ': ' + value;
                    break;
                }
                return filter;
            },

            parseDisclaimersToFilter: function(disclaimers) {
                disclaimers = disclaimers || [];
                var filters = {};
                disclaimers.forEach(function(disclaimer) {
                    filters[disclaimer.property] = disclaimer.value;
                });
                return filters;
            },

            parseDisclaimersToParameters: function(disclaimers) {
                disclaimers = disclaimers || [];
                var options = {
                    properties: [],
                    values: []
                };
                disclaimers.forEach(function(filter) {
                    if (filter.property) {
                        options.properties.push(filter.property);
                        switch (filter.type) {
                            case 'date':
                                options.values.push($filter('date')(filter.value, 'shortDate'));
                            break;
                            default:
                                options.values.push(filter.value);
                            break;
                        }
                    }
                });
                return options;
            }
        };
    }
        

    // *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalAdvancedSearch.$inject = ['$modal'];
    function modalAdvancedSearch($modal) {
        
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/mpd/html/internalcustomers/internalcustomers.advanced.search.html',
                controller: 'mpd.internalcustomers.advanced.search.control as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    // *************************************************************************************
	// *** MODAL SUPPLIER RISK
	// *************************************************************************************
	modalSupplierMaisNegociosModal.$inject = ['$modal'];
    function modalSupplierMaisNegociosModal($modal) {
        
        this.open = function (params) {
            var instance = $modal.open({
                templateUrl: '/dts/mpd/html/internalcustomers/suppliermaisnegocios.modal.html',
                controller: 'mpd.internalcustomers.suppliermaisnegocios.control as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });
            return instance.result;
        };
    }

    // *************************************************************************************
    // *** CONTROLLER MODAL SUPPLIER RISK
    // *************************************************************************************
    modalSupplierMaisNegocios.$inject = ['$modalInstance', 'parameters', '$rootScope', 'mpd.internalcustomers.helper', 'TOTVSEvent', 'mpd.customerapd.Factory', '$timeout'];
    function modalSupplierMaisNegocios($modalInstance, parameters, $rootScope, helper, TOTVSEvent, customerApdFactory, $timeout) {
        
        var vm = this;
        vm.customerCode = {};
        vm.customerShortName = ''
        vm.model = {};
        vm.supplierCustomerCredit = undefined;
        vm.supplierCustomerCreditConcessi = [];
        vm.newCreditLimit = null;

        vm.init = function init() {   
            vm.customer = parameters.customer;
            vm.loadSupplierMaisNegociosCustomerCredit(parameters.customer['cod-emitente'], false);
        };

        vm.refreshSupplierCustomerCredit = function() {
            vm.loadSupplierMaisNegociosCustomerCredit(parameters.customer['cod-emitente'], true);
        }

        vm.loadSupplierMaisNegociosCustomerCredit = function(customerCode, refreshOnline) {
            customerApdFactory.getSupplierMaisNegociosCustomerCredit({customerCode: customerCode, refreshOnline: refreshOnline}, function(data) {

                if(!data.$hasError) {
                    if(data.ttSupplierCustomerCredit[0]['dtm-ultima-atualiz']) {
                        data.ttSupplierCustomerCredit[0]['dtm-ultima-atualiz'] = vm.formatDateTime(data.ttSupplierCustomerCredit[0]['dtm-ultima-atualiz']);
                    }

                    for (var i = 0; i < data.ttSupplierCustomerCreditConcessi.length; i++) {
                        data.ttSupplierCustomerCreditConcessi[i]['dtm-solicitacao'] = vm.formatDateTime(data.ttSupplierCustomerCreditConcessi[i]['dtm-solicitacao']);
                        data.ttSupplierCustomerCreditConcessi[i]['dtm-avaliac']     = vm.formatDateTime(data.ttSupplierCustomerCreditConcessi[i]['dtm-avaliac']);
                    }  

                    vm.supplierCustomerCredit = data.ttSupplierCustomerCredit[0];  
                    vm.supplierCustomerCreditConcessi = data.ttSupplierCustomerCreditConcessi; 
                }   
                
            });
        }

        vm.formatDateTime = function(dateTimeISO) {
            var dateTime = new Date(dateTimeISO);
            return vm.pad(dateTime.getUTCDate()) + '/' + vm.pad(dateTime.getUTCMonth() + 1) + '/' + dateTime.getUTCFullYear() + ' ' +
            vm.pad(dateTime.getUTCHours()) + ':' + vm.pad(dateTime.getUTCMinutes()) + ':' +  vm.pad(dateTime.getUTCSeconds())
        };

        vm.pad = function(number) {
            if (number < 10) {
              return '0' + number;
            }
            return number;
        }
                
        vm.supplierGrantCredit = function save() {

            $timeout(function () {

                if(vm.newCreditLimit > 0) {
                    customerApdFactory.postSupplierMaisNegociosRequestCredit({customerCode: parameters.customer['cod-emitente'], newCreditLimit: vm.newCreditLimit}, function(result) {
                        if(!result.$hasError) {
                            vm.loadSupplierMaisNegociosCustomerCredit(parameters.customer['cod-emitente'], true);
                        }
                    });
                } else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error',
                        title: $rootScope.i18n('l-attention'),
                        detail: $rootScope.i18n('l-supplier-enter-the-desired-limit')
                    });
                    return;
                }

            }, 100);

        };

        vm.clear = function clear() {
            vm.model = {};
        };

        vm.close = function close() {
            $modalInstance.dismiss();
        };

        vm.init();
    }

    
    index.register.service('mpd.internalcustomers.helper', internalCustomersHelper);
    index.register.controller('mpd.internalcustomers.list.control', internalCustomersListController);

    index.register.service('mpd.internalcustomers.modal.advanced.search', modalAdvancedSearch);
    index.register.controller('mpd.internalcustomers.advanced.search.control', internalCustomersAdvancedSearchController);

    index.register.service('mpd.internalcustomers.suppliermaisnegocios.modal.service', modalSupplierMaisNegociosModal);
    index.register.controller('mpd.internalcustomers.suppliermaisnegocios.control', modalSupplierMaisNegocios);
});
 