define(['index',
        '/dts/mmi/js/dbo/bomn150.js',
        '/dts/mmi/html/servicerequest/servicerequest.add.js'
        ], function(index) {

    serviceRequestListCtrl.$inject = [
        '$rootScope',
        '$scope',
        '$modal',
        '$filter',
        '$location',
        'totvs.app-main-view.Service',
        'fchmip.fchmipservicerequest.Factory',
        'mmi.bomn150.Service',
        'helperServiceRequest',
        'TOTVSEvent',
        'mmi.servicerequest.modal'
    ];

    function serviceRequestListCtrl($rootScope,
        $scope,
        $modal,
        $filter,
        $location,
        appViewService,
        fchmipservicerequest,
        bomn150Service,
        helperServiceRequest,
        TOTVSEvent,
        NewServiceModal
    ) {

		var controller = this;

        this.listResult = [];       // array que mantem a lista de registros
        this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
        this.disclaimers = [];      // array que mantem a lista de filtros aplicados
        this.lengthPage = 0;        // tamanho do resultado da busca
        this.ttSelecao = {};
        this.filter = "";
        this.previousView;
        this.submitAdvancedSearch = false;
        this.paginate = false;
        controller.loginCurrentUser = $rootScope.currentuser.login;
        
        controller.advancedSearch = { lPending : true,        
        							  lApproved : true,        
        							  lOpenOrder : true,        
        							  lCanceled : false,       	
        							  lInmate : false,
                                      accord : { period: true,
                                                 filter: false,
                                                 state: false}};

        this.openAdvancedSearch = function() {
            controller.quickSearchText = "";

            var modalInstance = $modal.open({
              templateUrl: '/dts/mmi/html/servicerequest/servicerequest.advanced.search.html',
              controller: 'mmi.servicerequest.SearchCtrl as controller',
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
            	controller.addDisclaimerAdvancedSearch();
                controller.submitAdvancedSearch = true;
                controller.loadData();
            });
        }

        this.addDisclaimerAdvancedSearch = function() {
            controller.disclaimers = [];

            if (controller.advancedSearch.dateRange){
                if (controller.advancedSearch.dateRange.startDate || controller.advancedSearch.dateRange.endDate) {
                    var faixa = '0', deate = ' do início';
                    if (controller.advancedSearch.dateRange.startDate)  {
                        faixa = controller.advancedSearch.dateRange.startDate;
                        deate = ' de ' + $filter('date')(controller.advancedSearch.dateRange.startDate, 'dd/MM/yyyy');
                    }
                    if (controller.advancedSearch.dateRange.endDate) {
                        faixa = faixa + ';' + controller.advancedSearch.dateRange.endDate;
                        deate = deate + ' até ' + $filter('date')(controller.advancedSearch.dateRange.endDate, 'dd/MM/yyyy');
                    } else {
                        faixa = faixa + ';ZZZZZZZZ';
                        deate = deate + ' até o final';
                    }
                    controller.addDisclaimer('data', faixa, $rootScope.i18n('l-opening') + deate);
                }
            }

            if (controller.advancedSearch['cd-equipto'])
                controller.addDisclaimer('cd-equipto', '*' + controller.advancedSearch['cd-equipto']  + '*', $rootScope.i18n('l-equipment') + ": " + controller.advancedSearch['cd-equipto']);

            if (controller.advancedSearch['cd-tag'])
                controller.addDisclaimer('cd-tag', '*' + controller.advancedSearch['cd-tag']  + '*', $rootScope.i18n('l-tag') + ": " + controller.advancedSearch['cd-tag']);

            if (controller.advancedSearch['cd-manut'])
                controller.addDisclaimer('cd-manut', '*' + controller.advancedSearch['cd-manut']  + '*', $rootScope.i18n('l-maintenance') + ": " + controller.advancedSearch['cd-manut']);

            if (controller.advancedSearch['cd-sint-padr'])
                controller.addDisclaimer('cd-sint-padr', '*' + controller.advancedSearch['cd-sint-padr']  + '*', $rootScope.i18n('l-sympthom') + ": " + controller.advancedSearch['cd-sint-padr']);

            if (controller.advancedSearch['cd-planejado'])
                controller.addDisclaimer('cd-planejado', '*' + controller.advancedSearch['cd-planejado']  + '*', $rootScope.i18n('l-planner') + ": " + controller.advancedSearch['cd-planejado']);

            if (controller.advancedSearch['cd-equip-res'])
                controller.addDisclaimer('cd-equip-res', '*' + controller.advancedSearch['cd-equip-res']  + '*', $rootScope.i18n('l-team') + ": " + controller.advancedSearch['cd-equip-res']);

            if (controller.advancedSearch['usuario-alt'])
                controller.addDisclaimer('usuario-alt', '*' + controller.advancedSearch['usuario-alt']  + '*', $rootScope.i18n('l-user-opening') + ": " + controller.advancedSearch['usuario-alt']);

            if (controller.advancedSearch.lPending)
            	controller.addDisclaimer('pending', '*1*', $rootScope.i18n('l-pending'));
            
            if (controller.advancedSearch.lApproved)
            	controller.addDisclaimer('approved', '*2*', $rootScope.i18n('l-approved'));
            
            if (controller.advancedSearch.lOpenOrder)
            	controller.addDisclaimer('openOrder', '*3*', $rootScope.i18n('l-open-order'));
            
            if (controller.advancedSearch.lCanceled)
            	controller.addDisclaimer('canceled', '*4*', $rootScope.i18n('l-canceled'));
            
            if (controller.advancedSearch.lInmate)
            	controller.addDisclaimer('inmate', '*5*', $rootScope.i18n('l-inmate'));

        }

        this.addDisclaimer = function(property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }

        this.removeDisclaimer = function(disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }

            controller.removeValueDisclaimers(disclaimer);

            // limpa texto da pesquisa r�pida
            if (controller.quickSearchText) {
            	controller.quickSearchText = "";
            }

            controller.loadData();
        }

        this.removeValueDisclaimers = function(disclaimer) {
            // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
            if (disclaimer.property == 'usuario-alt') {
                controller.advancedSearch['usuario-alt'] = '';
            }

            if (disclaimer.property == 'cd-equipto') {
                controller.advancedSearch['cd-equipto'] = undefined;
            }

            if (disclaimer.property == 'cd-tag') {
                controller.advancedSearch['cd-tag'] = undefined;
            }

            if (disclaimer.property == 'cd-manut') {
                controller.advancedSearch['cd-manut'] = undefined;
            }

            if (disclaimer.property == 'cd-sint-padr') {
                controller.advancedSearch['cd-sint-padr'] = undefined;
            }

            if (disclaimer.property == 'cd-equip-res') {
                controller.advancedSearch['cd-equip-res'] = undefined;
            }
        	if (disclaimer.property == 'pending') {
                controller.advancedSearch.lPending = false;
            }

        	if (disclaimer.property == 'approved') {
                controller.advancedSearch.lApproved = false;
            }

        	if (disclaimer.property == 'openOrder') {
                controller.advancedSearch.lOpenOrder = false;
            }
        	if (disclaimer.property == 'canceled') {
                controller.advancedSearch.lCanceled = false;
            }
        	if (disclaimer.property == 'inmate') {
                controller.advancedSearch.lInmate = false;
            }
            if (disclaimer.property == 'data') {
                controller.advancedSearch.dateRange = undefined;
            }
            if (disclaimer.property == null)
                controller.quickSearchText = '';
            if (disclaimer.property == 'nr-soli-serv') {
                controller.advancedSearch.codini = '';
                controller.advancedSearch.codfin = '';
            }
            if (disclaimer.property == 'descricao') {
                controller.advancedSearch.descricao = '';
            }
        }

        this.search = function(isMoreData) {
        	this.addQuickSearchDisclaimer();
        	this.loadData(isMoreData);
        }

        this.addQuickSearchDisclaimer = function() {
            if (controller.quickSearchText === "" || controller.quickSearchText === undefined) {
                controller.disclaimers = undefined;
            } else {
                controller.advancedSearch = {};
                var placeholder = $rootScope.i18n('l-solicitation-number');
                controller.disclaimers = [{
                    property : placeholder,
                    value : controller.quickSearchText,
                    title : placeholder + ": " + controller.quickSearchText
                }];
            }
        }

        this.loadData = function(isMoreData) {
        	// se não é busca de mais dados, inicializa o array de resultado
            if (!isMoreData) {
                controller.listResult = [];
                controller.totalRecords = 0;
            }

            if (controller.advancedSearch.dateRange == undefined){
                controller.advancedSearch.dateRange = {
                    startDate : undefined,
                    endDate : undefined
                }
            }

            controller.ttSelecao = {startAt: controller.listResult.length + 1,
                                    nrSoliServ: parseInt(controller.quickSearchText),
                                    cdEquipto: controller.advancedSearch['cd-equipto'],
                                    cdTag: controller.advancedSearch['cd-tag'],
                                    cdManut: controller.advancedSearch['cd-manut'],
                                    cdSintPadr: controller.advancedSearch['cd-sint-padr'],
                                    cdPlanejado: controller.advancedSearch['cd-planejado'],
                                    usuarioAlt: controller.advancedSearch['usuario-alt'],
                                    lPending: controller.advancedSearch.lPending,
                                    lApproved: controller.advancedSearch.lApproved,
                                    lOpenOrder: controller.advancedSearch.lOpenOrder,
                                    lCanceled: controller.advancedSearch.lCanceled,
                                    lInmate: controller.advancedSearch.lInmate,
                                    dataInicio: controller.advancedSearch.dateRange.startDate,
                                    dataTermino: controller.advancedSearch.dateRange.endDate,
                                    type: 1,
                                    ordination: 'DESCENDING'
                                };

            fchmipservicerequest.getListServiceRequest(controller.ttSelecao, function(result) {

                if (result) {
                    controller.lengthPage = result["tt-solic-serv-retorno"].length;
                    controller.paginate = result.paginate;

                    controller.totalRecords = result.totalRecords;

                    result["tt-solic-serv-retorno"] = result["tt-solic-serv-retorno"].sort(function(a,b) {return b["nr-soli-serv"] - a["nr-soli-serv"]});

                    // para cada item do result
                    angular.forEach(result["tt-solic-serv-retorno"], function (value) {
                        // adicionar o item na lista de resultado
                        controller.listResult.push(value);
                    });
                }
            });
        }

        this.openEdit = function(value) {
        	if (!controller.isDisabledAction(value.estado)){
	            NewServiceModal.open({value: value});
        	}
        }

        this.addService = function(value) {
            NewServiceModal.open(
                {value: value}
            ).then(function(result){
                controller.init();
            });
		};
        
        this.isDisabledAction = function(estado){
        	
        	// Aberta Ordem(3), Cancelada(4), Encerrada(5)
        	if (estado == 3 || estado == 4 || estado == 5)
        		return true;
        	
        	return false;
        }

        this.delete = function(record) {
        	if (!controller.isDisabledAction(record.estado)){
	    		$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	                title: 'l-question',
	                text: $rootScope.i18n('l-confirm-delete-servicerequest',[record['nr-soli-serv']], 'dts/mmi'),
	                cancelLabel: 'l-no', // label do bot�o cancelar
	                confirmLabel: 'l-yes', // label do bot�o confirmar
	                callback: function(isPositiveResult) { // fun��o de retorno
	                    if (isPositiveResult) { // se foi clicado o bot�o confirmar
	                        bomn150Service.deleteRecord(record['nr-soli-serv'], function(result) {
	                        	if (!result.$hasError) {
	                        		// remove o item da lista
                                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                        type: 'success', // tipo de notificação
                                        title: $rootScope.i18n('msg-service-request-delete'), // titulo da notificação
                                        detail: $rootScope.i18n('msg-success-service-request-delete') // detalhe da notificação
                                    });
                                    controller.loadData();
	                            }
	                        });
	                    }
	                }
	            });
        	}
        }

        this.openDetail = function(value) {
        	helperServiceRequest.data = value;
        	$location.path('/dts/mmi/servicerequest/detail/');
        }

        this.getUserDisclaimer = function() {
            if (!controller.submitAdvancedSearch) {
                controller.advancedSearch['usuario-alt'] = controller.loginCurrentUser;
            } else {
                controller.advancedSearch['usuario-alt'] = undefined;
            }
        }

        this.init = function() {
            
            controller.createTab = appViewService.startView($rootScope.i18n('l-service-request'), 'mmi.servicerequest.ListCtrl', controller);
            previousView = appViewService.previousView;
            
            if (!controller.createTag)
            	controller.createTag = false;            	
            
            if (previousView.controller) {            	              
           	 	if (controller.createTab == false && (helperServiceRequest.data.reloadList == false || helperServiceRequest.data.reloadList == undefined)
                        && (previousView.controller !== "mmi.servicerequest.DetailCtrl" || previousView.controller !== "mmi.servicerequest.EditCtrl")) {
           	 		           	 		
           	 		return;
           	 	}
            }else{
            	return;
            }

        	var placeholder = $rootScope.i18n('l-user');
        
            if (controller.createTab === true) {
                controller.disclaimers = [{
                    property : 'usuario-alt',
                    value : controller.loginCurrentUser,
                    title : placeholder + ": " + controller.loginCurrentUser
                }];
                controller.getUserDisclaimer();
            }
            controller.loadData();
            helperServiceRequest.data.reloadList = false;
        }

        this.openOM = function(obj){
            $location.path('dts/mmi/orderdetailing/' + obj['nr-ord-produ']);
        }

        if ($rootScope.currentuserLoaded) { this.init(); }

        $scope.$on('$destroy', function () {
        	controller = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        	controller.init();
        });

    }

    serviceRequestSearchCtrl.$inject = ['$modalInstance', '$scope', 'model', '$rootScope', 'TOTVSEvent'];

    function serviceRequestSearchCtrl ($modalInstance, $scope, model, $rootScope, TOTVSEvent) {
        // recebe os dados de pesquisa atuais e coloca no controller
        this.advancedSearch = model;
        
        var controller = this;

	    this.closeOther = false;
	    $scope.oneAtATime = true;
	    
	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };

        this.search = function () {
        	var close = true;
 	    	
 	    	if (this.advancedSearch.dateRange) {
	 	    	if (this.advancedSearch.dateRange.startDate && !this.advancedSearch.dateRange.endDate) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'error',
		                title: $rootScope.i18n('l-attention'),
		                detail: $rootScope.i18n('msg-valid-range-open-date')
		            });            	
	            	close = false;
	            } else if (!this.advancedSearch.dateRange.startDate && this.advancedSearch.dateRange.endDate) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'error',
		                title: $rootScope.i18n('l-attention'),
		                detail: $rootScope.i18n('msg-valid-range-open-date')
		            });
	            	close = false;
	            }
 	    	}
 	    	 	    	        	
        	if (this.advancedSearch.lPending == false && controller.advancedSearch.lApproved == false && controller.advancedSearch.lOpenOrder == false && controller.advancedSearch.lCanceled == false && controller.advancedSearch.lInmate == false) {
        		$rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('msg-select-status')
                });
        		close = false;        	        		
        	}        	        	
        	
        	if (close == true) {
        		$modalInstance.close();
        	}
        }

        this.close = function () {
            $modalInstance.dismiss();
        }
        
    }

    index.register.controller('mmi.servicerequest.ListCtrl', serviceRequestListCtrl);
    index.register.controller('mmi.servicerequest.SearchCtrl', serviceRequestSearchCtrl);
    index.register.service('helperServiceRequest', function(){
        return {
        	data :{}
        };
    });

});
