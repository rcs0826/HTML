define(['index',
        '/dts/mmi/js/utils/filters.js',
        '/dts/mmi/js/api/fch/fchmip/fchmipequipment.js'
        ], function(index) {
    
	dashboardEquipmentCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$state',
		'TOTVSEvent',
		'totvs.app-main-view.Service',
		'$modal',
        'fchmip.fchmipequipment.Factory',
        'helperEquipment'
	];

	function dashboardEquipmentCtrl($rootScope, 
                                    $scope, 
                                    $stateParams, 
                                    $state, 
                                    TOTVSEvent,
                                    appViewService, 
                                    $modal,
                                    equipmentFactory,
                                    helperEquipment) {
        
		var dashboardCtrl = this;
        
		dashboardCtrl.init = function() {
            
            var today  = new Date();
            
            dashboardCtrl.preditivaOn = false;
            dashboardCtrl.dateRange = {startDate : new Date().setDate(today.getDate()-30),
                                       endDate : new Date(9999,11,31)};
            dashboardCtrl.matrizUnidadeNegocio = false;

            dashboardCtrl.createTab = appViewService.startView($rootScope.i18n('l-equipment-relationships'), 'mmi.equipment.dashboard.DashboardEquipmentCtrl', dashboardEquipmentCtrl);
                            
            if (dashboardCtrl.createTab === false) {

                if(helperEquipment.data['cd-equipto']){

                    if(helperEquipment.data.dateRange){
                        dashboardCtrl.dateRange = helperEquipment.data.dateRange;
                    }

                    if(helperEquipment.data.pagina == 1){
                        dashboardCtrl.pesquisaEquipto(helperEquipment.data);
                    } else {
                        dashboardCtrl.atualizaEquipamento(helperEquipment.data);
                        dashboardCtrl.exibirPagina(helperEquipment.data.pagina);
                    }
                } else {
                    dashboardCtrl.zeraEquipamento();
                }

            } else {
                if(helperEquipment.data['nr-soli-serv']){
                    dashboardCtrl.pesquisaEquipto(helperEquipment.data);
                } else {
                    dashboardCtrl.zeraEquipamento();
                }
            }
            
            equipmentFactory.getParamPreditiva(function(result){
                dashboardCtrl.preditivaOn = result.pPreditiva;
            })
        }
        
        dashboardCtrl.zeraEquipamento = function(){
            helperEquipment.data = {};            
            helperEquipment.data.dateRange = undefined
            dashboardCtrl.tituloProgramacao = $rootScope.i18n('l-search-equipment');
        }
        
        dashboardCtrl.atualizaEquipamento = function(equipamento){
            dashboardCtrl.equiptoData = equipamento;
            dashboardCtrl.tituloProgramacao = dashboardCtrl.equiptoData['cd-equipto'] + ' - ' + dashboardCtrl.equiptoData.descricao;
            dashboardCtrl.equipamentoSelecionado = true;
            dashboardCtrl.selectedEquipto = equipamento;
        }

		dashboardCtrl.pesquisaEquipto = function(equipto) {
            
            dashboardCtrl.dados = true;
            dashboardCtrl.historico = false;
            dashboardCtrl.componente = false;
            dashboardCtrl.manutencao = false;
            dashboardCtrl.utilizacao = false;
            dashboardCtrl.ordens = false;
            dashboardCtrl.inspecao = false;
            dashboardCtrl.solicitacao = false;
            dashboardCtrl.omplanejada = false;
            
            equipmentFactory.getEquipmentData((equipto)? equipto['cd-equipto'] : dashboardCtrl.selectedEquipto['cd-equipto'], function(result){
                
                if(result.ttEquiptoDesc[0]){
                    dashboardCtrl.atualizaEquipamento(result.ttEquiptoDesc[0])
                    helperEquipment.data = result.ttEquiptoDesc[0];
                    helperEquipment.data.dateRange = dashboardCtrl.dateRange;
                    dashboardCtrl.zeraDados();
                    
                    if(result.ttUnidNegocioDesc.length > 0){
                        dashboardCtrl.matrizUnidadeNegocio = true;
                        helperEquipment.data.ttUnidNegocioDesc = result.ttUnidNegocioDesc;
                    } else {
                        dashboardCtrl.matrizUnidadeNegocio = false;
                    }
                    
                    dashboardCtrl.tituloProgramacao = dashboardCtrl.equiptoData['cd-equipto'] + ' - ' + dashboardCtrl.equiptoData.descricao;
                }
            })
            
		};
        
        dashboardCtrl.dadosSelecionado = function() {
            if(dashboardCtrl.dados) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.historicoSelecionado = function(){
            if(dashboardCtrl.historico) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.componenteSelecionado = function(){
            if(dashboardCtrl.componente) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.manutencaoSelecionado = function(){
            if(dashboardCtrl.manutencao) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.utilizacaoSelecionado = function(){
            if(dashboardCtrl.utilizacao) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.ordemSelecionado = function(){
            if(dashboardCtrl.ordens) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.inspecaoSelecionado = function(){
            if(dashboardCtrl.inspecao) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.solicitacaoSelecionado = function(){
            if(dashboardCtrl.solicitacao) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.omplanejadaSelecionado = function(){
            if(dashboardCtrl.omplanejada) return dashboardCtrl.paginaSelecionada();
        }
        
        dashboardCtrl.paginaSelecionada = function() {
			return {
				'background-color': '#bfbfbf'
			}
		}
        
        dashboardCtrl.obterAlturaConteudo = function() {
			return {
				height: window.innerHeight - 160 + 'px'
			};
		}
        
        dashboardCtrl.obterAlturaConteudoGrid = function() {
			return {
				height: window.innerHeight - 215 + 'px'
			};
		}
        
        dashboardCtrl.getSituacao = function(situacao){
            switch (situacao) {
                case 1: return 'l-active';
                case 2: return 'l-suspended2';
                case 3: return 'l-sold';
                case 4: return 'l-idle';
            }
        }
        
        dashboardCtrl.getCriticidade = function(criticidade){
            switch (criticidade) {
                case 1: return 'X';
                case 2: return 'Y';
                case 3: return 'Z';
            }
        }
        
        dashboardCtrl.exibirPagina = function(pagina) {
            
            if(!pagina){
                pagina = 1;
            }
            
            dashboardCtrl.dados = false;
            dashboardCtrl.historico = false;
            dashboardCtrl.componente = false;
            dashboardCtrl.manutencao = false;
            dashboardCtrl.utilizacao = false;
            dashboardCtrl.ordens = false;
            dashboardCtrl.inspecao = false;
            dashboardCtrl.solicitacao = false;
            dashboardCtrl.omplanejada = false;
            dashboardCtrl.paginaAtual = pagina;
            helperEquipment.data.pagina = pagina;
            
            switch (pagina) {
                case 1: 
                    dashboardCtrl.dados = true;
                    
                    break;
                case 2: 
                    dashboardCtrl.historico = true;
                
                    if(!dashboardCtrl.historyData){
                        dashboardCtrl.buscaHistorico();
                    }
                    
                    break;
                case 3: 
                    dashboardCtrl.componente = true;
                
                    if(!dashboardCtrl.componentData){
                        dashboardCtrl.buscaComponente();
                    }
                    
                    break;
                case 4: 
                    dashboardCtrl.manutencao = true;
                    
                    if(!dashboardCtrl.maintenanceData){
                        dashboardCtrl.buscaManutencao();
                    }
                    
                    break;
                case 5:
                    dashboardCtrl.utilizacao = true;
                    
                    if(!dashboardCtrl.utilityData){
                        dashboardCtrl.buscaUtilizacao();
                    }
                    
                    break;
                case 6:
                    dashboardCtrl.ordens = true;
                    
                    if(!dashboardCtrl.orderData){
                        dashboardCtrl.buscaOrdens();
                    }
                    
                    break;
                case 7:
                    dashboardCtrl.inspecao = true;
                    
                    if(!dashboardCtrl.inspectionData){
                        dashboardCtrl.buscaInspecao();
                    }
                    
                    break;
                case 8:
                    dashboardCtrl.solicitacao = true;
                    
                    if(!dashboardCtrl.requestData){
                        dashboardCtrl.buscaSolicitacao();
                    }
                    
                    break;
                case 9:
                    dashboardCtrl.omplanejada = true;
                    
                    if(!dashboardCtrl.plannedOrderData){
                        dashboardCtrl.buscaOMPlanejada();
                    }
                    
            }
		}
        
        dashboardCtrl.buscaHistorico = function(){
            var parameters = {
				cdEquipto: dashboardCtrl.equiptoData['cd-equipto'],
				startDate: dashboardCtrl.dateRange.startDate,
                endDate: dashboardCtrl.dateRange.endDate
			}
            
            equipmentFactory.getHistoryData(parameters, function(result){

                if(result){
                    dashboardCtrl.historyData = result;
                }
            })
        }
        
        dashboardCtrl.buscaComponente = function(){
            equipmentFactory.getComponentData(dashboardCtrl.equiptoData['cd-equipto'], function(result){

                if(result){
                    dashboardCtrl.componentData = result;
                }
            })
        }
        
        dashboardCtrl.buscaManutencao = function(){
            var parameters = {
				cdEquipto: dashboardCtrl.equiptoData['cd-equipto'],
				startDate: dashboardCtrl.dateRange.startDate,
                endDate: dashboardCtrl.dateRange.endDate
			}
            
            equipmentFactory.getMaintenanceData(parameters, function(result){

                if(result){
                    dashboardCtrl.maintenanceData = result;
                }
            })
        }
        
        dashboardCtrl.buscaUtilizacao = function(){
            var parameters = {
				cdEquipto: dashboardCtrl.equiptoData['cd-equipto'],
				startDate: dashboardCtrl.dateRange.startDate,
			}
            
            equipmentFactory.getUtilityData(parameters, function(result){

                if(result){
                    dashboardCtrl.utilityData = result;
                }
            })
        }
        
        dashboardCtrl.buscaOrdens = function(){
            var parameters = {
				cdEquipto: dashboardCtrl.equiptoData['cd-equipto'],
				startDate: dashboardCtrl.dateRange.startDate,
                endDate: dashboardCtrl.dateRange.endDate
			}
            
            equipmentFactory.getOrderData(parameters, function(result){

                if(result){
                    dashboardCtrl.orderData = result;
                }
            })
        }
        
        dashboardCtrl.buscaInspecao = function(){
            var parameters = {
				cdEquipto: dashboardCtrl.equiptoData['cd-equipto'],
				startDate: dashboardCtrl.dateRange.startDate,
                endDate: dashboardCtrl.dateRange.endDate
			}
            
            equipmentFactory.getInspectionData(parameters, function(result){

                if(result){
                    dashboardCtrl.inspectionData = result;
                }
            })
        }
        
        dashboardCtrl.buscaSolicitacao = function(){
            var parameters = {
				cdEquipto: dashboardCtrl.equiptoData['cd-equipto'],
				startDate: dashboardCtrl.dateRange.startDate,
                endDate: dashboardCtrl.dateRange.endDate
			}
            
            equipmentFactory.getRequestData(parameters, function(result){

                if(result){
                    dashboardCtrl.requestData = result;
                }
            })
        }
        
        dashboardCtrl.buscaOMPlanejada = function(){
            var parameters = {
				cdEquipto: dashboardCtrl.equiptoData['cd-equipto'],
				startDate: dashboardCtrl.dateRange.startDate,
                endDate: dashboardCtrl.dateRange.endDate
			}
            
            equipmentFactory.getPlannedOrderData(parameters, function(result){

                if(result){
                    dashboardCtrl.plannedOrderData = result;
                }
            })            
        }
        
        dashboardCtrl.zeraDados = function(){
            dashboardCtrl.historyData = undefined;
            dashboardCtrl.componentData = undefined;
            dashboardCtrl.maintenanceData = undefined;
            dashboardCtrl.utilityData = undefined;
            dashboardCtrl.orderData = undefined;
            dashboardCtrl.inspectionData = undefined;
            dashboardCtrl.requestData = undefined;
            dashboardCtrl.plannedOrderData = undefined;
            
            helperEquipment.data.pagina = 1;
        }
        
        this.openUnidNegoc = function() {

			var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/order/order.business.unit.html',
				controller: 'mmi.equipment.BusinesUnitCtrl as businessUnitCtrl',
				backdrop: 'static',
				keyboard: true,
                size: 'lg',
                resolve: {
                    model: function () {
                        return helperEquipment.data.ttUnidNegocAux;	            		
                    }
                }
            });
			modalInstance.result.then(function(){
                angular.element('totvs-editable').popover('destroy');
			}, function(){
                angular.element('totvs-editable').popover('destroy');
			});
        }
        
        dashboardCtrl.openAdvancedSearch = function(){
            
            var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/equipment/dashboard/dashboard.equipment.advanced.search.html',
                controller: 'mmi.equipmentAdvSearch.SearchCtrl as controller',
                size: 'md',
                backdrop: 'static',
                resolve: {
                    dateRange: function () {
                        // passa o objeto com os dados da pesquisa avançada para o modal
                        return dashboardCtrl.dateRange;
                    }
                }
            });

            // quando o usuario clicar em pesquisar:
            modalInstance.result.then(function (result) {
                
                dashboardCtrl.dateRange = result;
                helperEquipment.data.dateRange = result;
                
                if (dashboardCtrl.selectedEquipto){
                    dashboardCtrl.zeraDados();
                    dashboardCtrl.exibirPagina(dashboardCtrl.paginaAtual);
                }
            });
        }
        
        if ($rootScope.currentuserLoaded) { 
			dashboardCtrl.init();
		}
	
		$scope.$on('$destroy', function () {
			dashboardCtrl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			dashboardCtrl.init();
		});

    }
    
    // *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************
	
	equipmentAdvSearchCtrl.$inject = [
        '$modalInstance', 
        'dateRange'];

    function equipmentAdvSearchCtrl ($modalInstance, 
                                      dateRange) {

        // recebe os dados de pesquisa atuais e coloca no controller
        this.dateRange = dateRange;
        var today  = new Date();

        // ação de pesquisar
        this.apply = function () {
            // close é o fechamento positivo
            
            if(!this.dateRange){
                this.dateRange = {startDate : new Date().setDate(today.getDate()-30),
                                  endDate : new Date(9999,11,31)}
            } else {
                
                if(this.dateRange.startDate == null){
                    this.dateRange.startDate = new Date().setDate(today.getDate()-30);
                }

                if(this.dateRange.endDate == null){
                    this.dateRange.endDate = new Date(9999,11,31);
                }
            }
            
            $modalInstance.close(this.dateRange);
        }

        // ação de fechar
        this.cancel = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        }
    }
    
    equipmentBusinesUnitCtrl.$inject = [
		'$modalInstance',
        '$scope',
        '$rootScope',
		'model',
		'fchmip.fchmipequipment.Factory',
        'helperEquipment'];

	function equipmentBusinesUnitCtrl ($modalInstance,
                                       $scope,
                                       $rootScope,
                                       model,
                                       equipmentFactory,
                                       helperEquipment) {

		var businessUnitCtrl = this;
						
		businessUnitCtrl.ttBusinesUnit = [];
		
		businessUnitCtrl.model = helperEquipment.data.ttUnidNegocioDesc;
		
		this.loadRecords = function(){
            if (businessUnitCtrl.model) {
                angular.forEach(businessUnitCtrl.model, function(value){
                    businessUnitCtrl.ttBusinesUnit.push(value);
                });
            }
		}
		
		this.cancel = function () {
			$modalInstance.close();
		}

		this.init = function() {
			businessUnitCtrl.loadRecords();
		}

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});

		if ($rootScope.currentuserLoaded) { this.init(); }
	}

    index.register.controller('mmi.equipment.dashboard.DashboardEquipmentCtrl', dashboardEquipmentCtrl);
    index.register.controller('mmi.equipmentAdvSearch.SearchCtrl', equipmentAdvSearchCtrl);
    index.register.controller('mmi.equipment.BusinesUnitCtrl', equipmentBusinesUnitCtrl);
    index.register.service('helperEquipment', function(){
        return {
            data :{}
        };
    });
});