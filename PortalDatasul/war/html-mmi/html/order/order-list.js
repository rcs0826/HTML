define(['index',
        '/dts/mmi/js/dbo/bomn134.js',
        '/dts/mcd/js/api/fch/fchmcd/fchmcd0001.js',
        '/dts/mmi/html/order/order-close.js',
        '/dts/mmi/html/order/message/order-message.js'
		], function(index) {

	/**
	 * Controller List 
	 */
	orderListCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$modal',
		'$filter',
		'$location',
		'$timeout',
		'totvs.app-main-view.Service',
		'fchmip.fchmiporder.Factory',
		'mmi.bomn134.Service',
		'helperOrder',
		'TOTVSEvent'
	];

	function orderListCtrl($rootScope,
					       $scope,
						   $modal,
						   $filter,
						   $location,
						   $timeout,
						   appViewService,
						   fchmiporder,
						   bomn134Service,
						   helperOrder,
						   TOTVSEvent) {

		var controller = this;
		
		controller.quantidadeOrdens = 0;
		controller.listResult = [];
		controller.totalRecords = 0;
		controller.ttSelecao = {};
		controller.quickSearchText = "";
		
		this.filtro = 1; /*1 - filtro rápido; 2 - filtro avançado*/

		// *************************************************************************************
		// *** Functions
		// *************************************************************************************

		/**
	     * Método de pesquisa para filtro rápido
	     */
	    this.search = function(isMoreData) {
	    	controller.filtro = 1;
	    	controller.advancedSearch.tta_cod_estab = "";
	    	if (!isNaN(controller.quickSearchText) || controller.quickSearchText == undefined) {
	    		this.addQuickSearchDisclaimer();
		    	this.loadData(isMoreData);
	    	}
	    	else {
	    		$rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: $rootScope.i18n('msg-maintenance-order-valid-number')
                });
	    	}
	    		
	    }

		/**
		 * Remove registro da base de dados
		 */
		this.delete = function(value){

			var nrOrderMasked = $filter('orderNumberMask')(String(value['nr-ord-produ']));

	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-delete-record', [nrOrderMasked]),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {

				    	fchmiporder.deleteOrder(value['nr-ord-produ'], function(result){
				            if (!result.$hasError) {

                                var index = controller.listResult.indexOf(value);
                                if (index != -1){
                                    controller.listResult.splice(index, 1);
                                    controller.totalRecords--;
                                }
                                
                                if (controller.paginate)
            	            		controller.quantidadeOrdens = controller.totalRecords + "+";
            	            	else
            	            		controller.quantidadeOrdens = controller.totalRecords;

						        $rootScope.$broadcast(TOTVSEvent.showNotification, {
						            type: 'success',
	                                title: $rootScope.i18n('msg-order-delete'),
	                                detail: $rootScope.i18n('msg-success-order-delete')
						        });
				            }
				    	});	     
	                }
	            }
	        });
	    }
		
		/**
		 * Executa a tela para Realizar a Copia
		 */
		this.openOrderCopy = function(value) {
			
			var model=  {};
			
			model.order = value;
			
			var nrOrderMasked = $filter('orderNumberMask')(String(value['nr-ord-produ']));
			
			if (model.order["cd-manut"] == null || model.order["cd-manut"] == undefined || model.order["cd-manut"] == "") {
		        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
		            title: 'l-question',
		            text: $rootScope.i18n('msg-question-order-copy', [nrOrderMasked]),
		            cancelLabel: 'l-no',
		            confirmLabel: 'l-yes',
		            callback: function(isPositiveResult) {
		                if (isPositiveResult) {
				        	controller.copy(model.order["nr-ord-produ"], 1);
		                }
		            }
		        });
			} else {
		        var modalInstance = $modal.open({
			          templateUrl: '/dts/mmi/html/order/order.copy.html',
			          controller: 'mmi.order.CopyCtrl as controller',
			          size: 'md',
   					  backdrop: 'static',
					  keyboard: true,
			          resolve: {
			            model: function () {
			              return model;
			            }
			          }
			    });
		        
		        
		        modalInstance.result.then(function(){
		        	controller.copy(model.order["nr-ord-produ"], model.acao);
			    });
			}
		}
		
		/**
		 * Realiza a Copia da Ordem
		 */
		this.copy = function(nrOrdem, acao){

            parameters = {
                	'nr-ord-produ': nrOrdem,
	                'iAcao': parseInt(acao)
    			}
            
	    	fchmiporder.copyOrder(parameters, function(result){
	    		
	            if (!result.$hasError) {
					if (result.length > 0) {
		            	helperOrder.data = result[0];
						var nrOrderMasked = $filter('orderNumberMask')(String(helperOrder.data['nr-ord-produ']));
						
						controller.redirectToDetail();
				        $rootScope.$broadcast(TOTVSEvent.showNotification, {
				        	type: 'success',
				            title: $rootScope.i18n('msg-order-create'),
				            detail: $rootScope.i18n('msg-success-order-created-number', nrOrderMasked)
				        });
				        
					}
	            }
	    	});
		}
		
		/**
		 * Executa a tela para Realizar a Suspensao/Reativacao
		 */
		this.openOrderSuspend = function(value) {
			
			var model = value;
			
	        var modalInstance = $modal.open({
		          templateUrl: '/dts/mmi/html/order/order.suspend.html',
		          controller: 'mmi.order.SuspendCtrl as controller',
		          size: 'md',
				  backdrop: 'static',
				  keyboard: true,
		          resolve: { 
		            model: function () {
		            	return model;
		            }
		          }
		    });
		        
	        modalInstance.result.then(function(){
	        	value["estado-om"] = model["estado-om"];
	        	if (model['estado-om'] === 3) {
	        		model.situacao = 3;
	        	} else {
	        		value.situacao = model.estado === 1 ? 1 : 2;
	        	}
		    });
		}
		
	    /**
	     * Redireciona para a tela de detalhar
	     */	    
	    this.redirectToDetail = function() {
	        $location.path('dts/mmi/order/detail/' + helperOrder.data['nr-ord-produ']);
	    }
		
		/**
		 * Libera ordem de manutenção
		 */
		this.release = function(value){
			fchmiporder.releaseOrder(value['nr-ord-produ'], function(result){
				if (!result.$hasError) {
			        if (!result.hasWarning) { 
				        $rootScope.$broadcast(TOTVSEvent.showNotification, {
				            type: 'success',
	                        title: $rootScope.i18n('l-order-release'),
	                        detail: $rootScope.i18n('l-order-release-success')
				        });
			        }
			        
			        if (result.ttOrdem) {
			        	var selected = value.$selected;
				        angular.copy(result.ttOrdem[0], value);
				        value.$selected = selected;
			        }
	            }
	    	});
	    }
		
		controller.liberaOrdensSelecionadas = function() {
			if (controller.listResult.length === 0) return;
			
			var count = controller.validaOrdensSelecionadas(1);
			
			if (count === 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'warning',
	                title: $rootScope.i18n('l-attention'),
	                detail: $rootScope.i18n('msg-select-order-not-started')
	            });
			} else {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question',
                    text: $rootScope.i18n('msg-selected-orders-release-confirm'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(isPositiveResult) {
                    	if (isPositiveResult) {
                    		controller.messageTitle = $rootScope.i18n('l-work-order-release');
                    		fchmiporder.liberaOrdensSelecionadas(controller.ordensSelecionadas, ordensSelecionadasCallback);
                    	}
                    }
                });
			}
		}
		
		var ordensSelecionadasCallback = function(result) {
			var count = 0;
		
			angular.forEach(result.ttOrdem, function(value){
				value.$selected = true;
				angular.copy(value, controller.ordensSelecionadas[count]);
				count++;
			});
			
			var model = {"title": controller.messageTitle,
						 "messages": result.ttMensagemOrdem};
			
			var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/message/order.message.html',
	            controller: 'mmi.order.MessageCtrl as messageCtrl',
	            size: 'lg',
	            backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return model;
	            	}
	            }
			});
		}
		
		/**
		 * Bloqueia ordem de manutenção
		 */
		this.block = function(value){
			fchmiporder.blockOrder(value['nr-ord-produ'], function(result){
	            if (!result.hasError) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
			            type: 'success',
                        title: $rootScope.i18n('l-order-block'),
                        detail: $rootScope.i18n('l-order-block-success')
			        });	
	            }
	            var selected = value.$selected;
            	angular.copy(result.ttOrdem[0], value);
            	value.$selected = selected;
	    	});
	    }
		
		controller.bloqueiaOrdensSelecionadas = function() {
			if (controller.listResult.length === 0) return;
			
			var count = controller.validaOrdensSelecionadas(2);
			
			if (count === 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'warning',
	                title: $rootScope.i18n('l-attention'),
	                detail: $rootScope.i18n('msg-select-order-released')
	            });
			} else {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question',
                    text: $rootScope.i18n('msg-selected-orders-block-confirm'),
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                    callback: function(isPositiveResult) {
                    	if (isPositiveResult) {
                    		controller.messageTitle = $rootScope.i18n('l-work-order-block');
                    		fchmiporder.bloqueiaOrdensSelecionadas(controller.ordensSelecionadas, ordensSelecionadasCallback);
                    	}
                    }
                });
			}
		}
		
		controller.validaOrdensSelecionadas = function(estado) {
			var count = 0;

			controller.ordensSelecionadas = [];
			
			angular.forEach(controller.listResult, function(value) {
				if (value.$selected) {
					if (estado === 1) {
						if (value.estado === 1) {
							controller.ordensSelecionadas.push(value);
							count++;
						}
					} else {
						if (value.estado === 2 || value.estado === 3) {
							controller.ordensSelecionadas.push(value);
							count++;
						}
					}
				}
			});
			
			return count;
		}

	    /**
		 * Adiciona disclaimers do filtro rápido
		 */
		this.addQuickSearchDisclaimer = function() {
			if (controller.quickSearchText === "" || controller.quickSearchText === undefined) {
				this.disclaimers = undefined;
			} else {
				var placeholder = $rootScope.i18n('l-orderline-number');				
				this.disclaimers = [{
					property : placeholder,
					value : controller.quickSearchText,
					title : placeholder + ": " + controller.quickSearchText
				}];
			}
		}


		/**
		 * Abre tela de edição da ordem
		 */
		this.openOrderEdit = function(order) {
			var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/order.edit.html',
	            controller: 'mmi.order.EditCtrl as controller',
	            size: 'lg',
	            backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		helperOrder.data = order;
	            		return order;
	            	}
	            }
			});
			
	        modalInstance.result.then(function(){
	        	order = helperOrder.data;
	        	
	        	for (i = 0; i < controller.listResult.length; i++) {
	        		if (controller.listResult[i]['nr-ord-produ'] == order['nr-ord-produ']) {
	        			controller.listResult[i] = order;
	        		}
	        	}
	        	
	        }, function(){
	        	if (helperOrder.data) {
	        		helperOrder.data.nrOrdemFiltro = undefined;
	        	}	        		
            });	
		}
		
		controller.openOrderClose = function(order) {			
			var model =  {};			
			model.order = order; 
			
			var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/order.close.html',
	            controller: 'mmi.order.CloseCtrl as closeCtrl',
	            size: 'lg',
	            backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return model;
	            	}
	            }
			});
			
			modalInstance.result.then(function(){
				order = model.result;
	        	
	        	for (i = 0; i < controller.listResult.length; i++) {
	        		if (controller.listResult[i]['nr-ord-produ'] == order['nr-ord-produ']) {
	        			controller.listResult[i] = order;
	        		}
	        	}
		    });
		}
				
		/**
		 * Método de leitura dos dados
		 */
		this.loadData = function(isMoreData) {

	        if (!isMoreData) {
	            controller.listResult = [];
		        controller.totalRecords = 0;
		        controller.quantidadeOrdens = 0;
	        }
            if (controller.advancedSearch['dt-manut'] == undefined){
                controller.advancedSearch['dt-manut'] = {
                    startDate : undefined,
                    endDate : undefined
                }
            }

            if (controller.advancedSearch['dt-fecham'] == undefined){
                controller.advancedSearch['dt-fecham'] = {
                    startDate : undefined,
                    endDate : undefined
                }
            }
            
            controller.ttSelecao = {startAt: isMoreData == true ? controller.listResult.length + 1 : controller.listResult.length,
            						filtro: controller.filtro,
                                    nrOrdProdu: parseInt(controller.quickSearchText),
                                    cdEquipto: controller.advancedSearch['cd-equipto'] == undefined ? "" : controller.advancedSearch['cd-equipto']['cd-equipto'] ,
                                    cdTag: controller.advancedSearch['cd-tag'],
                                    cdManut: controller.advancedSearch['cd-manut'],
                                    cdTipo: controller.advancedSearch['cd-tipo'],
                                    cdPlanejado: controller.advancedSearch['cd-planejado'],
                                    cdEquipRes: controller.advancedSearch['cd-equip-res'],
                                    usuarioAlt: controller.advancedSearch['usuario-alt'],
                                    lNaoIniciada : controller.advancedSearch.lNaoIniciada == undefined ? false : controller.advancedSearch.lNaoIniciada,
                                    lLiberada : controller.advancedSearch.lLiberada == undefined ? false : controller.advancedSearch.lLiberada,
                                    lReservada : controller.advancedSearch.lReservada == undefined ? false : controller.advancedSearch.lReservada,
                                    lRequisitada : controller.advancedSearch.lRequisitada == undefined ? false : controller.advancedSearch.lRequisitada,
                                    lIniciada : controller.advancedSearch.lIniciada == undefined ? false : controller.advancedSearch.lIniciada,
                                    lSuspensa : controller.advancedSearch.lSuspensa == undefined ? false : controller.advancedSearch.lSuspensa,
                                    lEncerrada : controller.advancedSearch.lEncerrada == undefined ? false : controller.advancedSearch.lEncerrada,                                 
                                    lTerminada : controller.advancedSearch.lTerminada == undefined ? false : controller.advancedSearch.lTerminada,
                                    dataManutInicio: controller.advancedSearch['dt-manut'].startDate,
                                    dataManutTermino: controller.advancedSearch['dt-manut'].endDate,
                                    dataFechamInicio: controller.advancedSearch['dt-fecham'].startDate,
                                    dataFechamTermino: controller.advancedSearch['dt-fecham'].endDate,
                                    tta_cod_estab: controller.advancedSearch.tta_cod_estab == undefined ? '' : controller.advancedSearch.tta_cod_estab.tta_cod_estab };

            if (controller.ttSelecao.startAt == 0)
            	controller.ttSelecao.startAt++;

	        fchmiporder.getListOrder(controller.ttSelecao, function(result) {

	        	if (result) {
	            	controller.lengthPage = result.ttOrdem.length;
	    	        controller.paginate = result.paginate;

	            	if (!isMoreData)
                    	controller.totalRecords = controller.lengthPage;
 	        		else
 	        			controller.totalRecords = controller.totalRecords + controller.lengthPage;

	            	angular.forEach(result.ttOrdem, function (value) {
	                    if (value && value.$length) {
	                        controller.totalRecords = value.$length;
	                    }
	                    controller.listResult.push(value);
	                });
	            	
	            	if (controller.paginate)
	            		controller.quantidadeOrdens = controller.totalRecords + "+";
	            	else
	            		controller.quantidadeOrdens = controller.totalRecords;
	            }

	        });
	    }
				
		/**
		 * Filtro Avançado
		 */
		this.openAdvancedSearch = function () {
			controller.quickSearchText = "";

	        var modalInstance = $modal.open({
	          templateUrl: '/dts/mmi/html/order/order.advanced.search.html',
	          controller: 'mmi.order.SearchCtrl as controller',
	          size: 'lg',
	          backdrop: 'static',
	          keyboard: true,
	          resolve: {
	            model: function () {
	              return controller.advancedSearch;
	            }
	          }
	        });

	        modalInstance.result.then(function () {
	        	controller.addDisclaimers();
	        	controller.filtro = 2;
	            controller.loadData(false);
	        });
		}

		this.addFilter = function(estado){
			controller.advancedSearch.lNaoIniciada = false;
			controller.advancedSearch.lLiberada = false;
			controller.advancedSearch.lReservada = false;
			controller.advancedSearch.lRequisitada = false;
			controller.advancedSearch.lIniciada = false;
			controller.advancedSearch.lSuspensa = false;
			controller.advancedSearch.lEncerrada = false;
			controller.advancedSearch.lTerminada = false;

			if(estado == 1)
				controller.advancedSearch.lNaoIniciada = true;
			else if (estado == 2){
				controller.advancedSearch.lLiberada = true;
				controller.advancedSearch.lReservada = true;
				controller.advancedSearch.lRequisitada = true;
				controller.advancedSearch.lIniciada = true;
			}
			else if (estado == 3)
				controller.advancedSearch.lSuspensa = true;
			else if (estado == 4){
				controller.advancedSearch.lEncerrada = true;
				controller.advancedSearch.lTerminada = true;
			}

        	controller.addDisclaimers();
        	controller.filtro = 2;
            controller.loadData(false);
		}

		 /**
	     * Método para adicionar os disclaimers relativos a tela de pesquisa avançada
	     */
	    this.addDisclaimers = function() {
	        controller.disclaimers = [];
            
	        if (controller.advancedSearch['dt-manut']){
		        if (controller.advancedSearch['dt-manut'].startDate || controller.advancedSearch['dt-manut'].endDate) {
		            var faixa = '0', deate = ' do início';
		            if (controller.advancedSearch['dt-manut'].startDate)  {
		                faixa = controller.advancedSearch['dt-manut'].startDate;
		                deate = ' de ' + $filter('date')(controller.advancedSearch['dt-manut'].startDate, 'dd/MM/yyyy');
		            }
		            if (controller.advancedSearch['dt-manut'].endDate) {
		                faixa = faixa + ';' + controller.advancedSearch['dt-manut'].endDate;
		                deate = deate + ' até ' + $filter('date')(controller.advancedSearch['dt-manut'].endDate, 'dd/MM/yyyy');
		            } else {
		                faixa = faixa + ';ZZZZZZZZ';
		                deate = deate + ' até o final';
		            }
		            controller.addDisclaimer('dt-manut', faixa, $rootScope.i18n('l-maintenance-date') + deate);
		        }
	        }

	        if (controller.advancedSearch['dt-fecham']){
		        if (controller.advancedSearch['dt-fecham'].startDate || controller.advancedSearch['dt-fecham'].endDate) {
		            var faixa = '0', deate = ' do início';
		            if (controller.advancedSearch['dt-fecham'].startDate)  {
		                faixa = controller.advancedSearch['dt-fecham'].startDate;
		                deate = ' de ' + $filter('date')(controller.advancedSearch['dt-fecham'].startDate, 'dd/MM/yyyy');
		            }
		            if (controller.advancedSearch['dt-fecham'].endDate) {
		                faixa = faixa + ';' + controller.advancedSearch['dt-fecham'].endDate;
		                deate = deate + ' até ' + $filter('date')(controller.advancedSearch['dt-fecham'].endDate, 'dd/MM/yyyy');
		            } else {
		                faixa = faixa + ';ZZZZZZZZ';
		                deate = deate + ' até o final';
		            }
		            controller.addDisclaimer('dt-fecham', faixa, $rootScope.i18n('l-closing-date') + deate);
		        }
	        }
	        
	        if(controller.advancedSearch.tta_cod_estab){
            	if(controller.advancedSearch.tta_cod_estab.tta_cod_estab)
            		controller.addDisclaimer('tta_cod_estab', '*' + controller.advancedSearch.tta_cod_estab.tta_cod_estab + '*', $rootScope.i18n('l-site') + ': ' + controller.advancedSearch.tta_cod_estab.tta_cod_estab);
            }
	        
	        if (controller.advancedSearch['usuario-alt'])
	            controller.addDisclaimer('usuario-alt', '*' + controller.advancedSearch['usuario-alt']  + '*', $rootScope.i18n('l-user-opening') + ": " + controller.advancedSearch['usuario-alt']);
	        
	        if (controller.advancedSearch['cd-equipto'])
	            controller.addDisclaimer('cd-equipto', '*' + controller.advancedSearch['cd-equipto']['cd-equipto']  + '*', $rootScope.i18n('l-equipment') + ": " + controller.advancedSearch['cd-equipto']['cd-equipto']);

	        if (controller.advancedSearch['cd-tag'])
	            controller.addDisclaimer('cd-tag', '*' + controller.advancedSearch['cd-tag']  + '*', $rootScope.i18n('l-tag') + ": " + controller.advancedSearch['cd-tag']);

	        if (controller.advancedSearch['cd-manut'])
	            controller.addDisclaimer('cd-manut', '*' + controller.advancedSearch['cd-manut']  + '*', $rootScope.i18n('l-maintenance') + ": " + controller.advancedSearch['cd-manut']);

	        if (controller.advancedSearch['cd-tipo'])
	            controller.addDisclaimer('cd-tipo', '*' + controller.advancedSearch['cd-tipo']  + '*', $rootScope.i18n('l-maintenance-type') + ": " + controller.advancedSearch['cd-tipo']);

	        if (controller.advancedSearch['cd-planejado'])
	            controller.addDisclaimer('cd-planejado', '*' + controller.advancedSearch['cd-planejado']  + '*', $rootScope.i18n('l-planner') + ": " + controller.advancedSearch['cd-planejado']);

	        if (controller.advancedSearch['cd-equip-res'])
	            controller.addDisclaimer('cd-equip-res', '*' + controller.advancedSearch['cd-equip-res']  + '*', $rootScope.i18n('l-team') + ": " + controller.advancedSearch['cd-equip-res']);

	        if (controller.advancedSearch['estado-om']){
                switch(controller.advancedSearch['estado-om']) {
                    case '0':
                        var labelStateDisclaimer = $rootScope.i18n('l-all-gen');
                        break;
                    case '1':
                        var labelStateDisclaimer = $rootScope.i18n('l-not-started');
                        break;
                    case '2':
                        var labelStateDisclaimer = $rootScope.i18n('l-released');
                        break;
                    case '3':
                        var labelStateDisclaimer = $rootScope.i18n('l-reserved');
                        break;
                    case '5':
                    	var labelStateDisclaimer = $rootScope.i18n('l-requested');
                        break;
                    case '6':
                        var labelStateDisclaimer = $rootScope.i18n('l-started');
                        break;
                    case '7':
                        var labelStateDisclaimer = $rootScope.i18n('l-finished');
                        break;
                    case '8':
                        var labelStateDisclaimer = $rootScope.i18n('l-done');
                        break;
                    case '9':
                        var labelStateDisclaimer = $rootScope.i18n('l-suspended');
                        break;
                }
                controller.addDisclaimer('estado-om', '*' + controller.advancedSearch['estado-om']  + '*', labelStateDisclaimer);
            }

            if(controller.advancedSearch.lNaoIniciada == true){
            	var labelNaoIniDisclaimer = $rootScope.i18n('l-not-started');
            	controller.addDisclaimer('estado-om1', '*' + controller.advancedSearch['estado-om']  + '*', labelNaoIniDisclaimer);
            }


            if(controller.advancedSearch.lLiberada == true){
            	var labelIniDisclaimer = $rootScope.i18n('l-released');
            	controller.addDisclaimer('estado-om2', '*' + controller.advancedSearch['estado-om']  + '*', labelIniDisclaimer);
            }


            if(controller.advancedSearch.lReservada == true){
            	var labelIniDisclaimer = $rootScope.i18n('l-reserved');
            	controller.addDisclaimer('estado-om3', '*' + controller.advancedSearch['estado-om']  + '*', labelIniDisclaimer);
            }

            if(controller.advancedSearch.lRequisitada == true){
            	var labelIniDisclaimer = $rootScope.i18n('l-requested');
            	controller.addDisclaimer('estado-om5', '*' + controller.advancedSearch['estado-om']  + '*', labelIniDisclaimer);
            }

            if(controller.advancedSearch.lIniciada == true){
            	var labelIniDisclaimer = $rootScope.i18n('l-started');
            	controller.addDisclaimer('estado-om6', '*' + controller.advancedSearch['estado-om']  + '*', labelIniDisclaimer);
            }

            if(controller.advancedSearch.lSuspensa == true){ /* pelo estado-om */
            	var labelSuspDisclaimer = $rootScope.i18n('l-suspended');
            	controller.addDisclaimer('estado-om9', '*' + controller.advancedSearch['estado-om']  + '*', labelSuspDisclaimer);
            }

            if(controller.advancedSearch.lEncerrada == true){
            	var labelEncDisclaimer = $rootScope.i18n('l-finished');
            	controller.addDisclaimer('estado-om7', '*' + controller.advancedSearch['estado-om']  + '*', labelEncDisclaimer);
            }

            if(controller.advancedSearch.lTerminada == true){
            	var labelDoneDisclaimer = $rootScope.i18n('l-done');
            	controller.addDisclaimer('estado-om8', '*' + controller.advancedSearch['estado-om']  + '*', labelDoneDisclaimer);
            }
	    }

	    /**
	     * Adiciona um objeto na lista de disclaimers
	     */
	    this.addDisclaimer = function(property, value, label) {
	    	var fixed = false;

	        controller.disclaimers.push({
	            property: property,
	            value: value,
	            title: label,
	            fixed: fixed
	        });	     
	    }

	    /**
	     * Remove um disclaimer
	     */
	    this.removeDisclaimer = function(disclaimer) {
	        var index = controller.disclaimers.indexOf(disclaimer);
	        if (index != -1) {
	            controller.disclaimers.splice(index, 1);
	        }

			if (disclaimer.property == 'tta_cod_estab') {
                controller.advancedSearch['tta_cod_estab'] = undefined;
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

            if (disclaimer.property == 'cd-tipo') {
                controller.advancedSearch['cd-tipo'] = undefined;
            }

            if (disclaimer.property == 'cd-planejado') {
                controller.advancedSearch['cd-planejado'] = undefined;
            }

            if (disclaimer.property == 'cd-equip-res') {
                controller.advancedSearch['cd-equip-res'] = undefined;
            }

            if (disclaimer.property == 'usuario-alt') {
                controller.advancedSearch['usuario-alt'] = '';
            }

            if (disclaimer.property == 'estado-om') {
                controller.advancedSearch['estado-om'] = undefined;
            }

            if (disclaimer.property == 'dt-manut') {
                controller.advancedSearch['dt-manut'] = undefined;
            }

            if (disclaimer.property == 'dt-fecham') {
                controller.advancedSearch['dt-fecham'] = undefined;
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

	        if (controller.quickSearchText) {
	        	controller.quickSearchText = "";
	        }

            if (disclaimer.property == 'estado-om1') {
                controller.advancedSearch.lNaoIniciada = false;
            }
            if (disclaimer.property == 'estado-om2') {
                controller.advancedSearch.lLiberada = false;
            }
            if (disclaimer.property == 'estado-om3') {
                controller.advancedSearch.lReservada = false;
            }
            if (disclaimer.property == 'estado-om5') {
                controller.advancedSearch.lRequisitada = false;
            }
            if (disclaimer.property == 'estado-om6') {
                controller.advancedSearch.lIniciada = false;
            }            
            if (disclaimer.property == 'estado-om7') {
                controller.advancedSearch.lEncerrada = false;
            }
            if (disclaimer.property == 'estado-om8') {
                controller.advancedSearch.lTerminada = false;
            }
            if (disclaimer.property == 'estado-om9') {
                controller.advancedSearch.lSuspensa = false;
            }
            
            if (controller.disclaimers.length === 0) controller.disclaimers = undefined;
            
	        controller.filtro = 2;
	        controller.loadData(false);
	    }

	    /**
		 * Define o objeto que servirá para a passagem de parâmetros para outras telas
		 */
		this.setHelperOrder = function(value) {
			helperOrder.data = value;
		}

		/**
		 * Abre tela de edição
		 */
		this.openEdit = function(value) {
			controller.setHelperOrder(value);
			$location.path('/dts/mmi/order/edit/');
		}

		/**
		 * Abre tela de detalhe
		 */
		this.openDetail = function(value) {
			controller.setHelperOrder(value);			
		}
		
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************

		this.init = function() {

			var createTab = appViewService.startView($rootScope.i18n('l-maintenance-order'), 'mmi.order.ListCtrl', controller);
			var previousView = appViewService.previousView;

			if(!controller.advancedSearch){
	        	this.advancedSearch = { accord : { period: true,
	   								   state: false,
	   								   filter: false},
				   						lNaoIniciada : true,
				   						lLiberada : true,
				   						lReservada: true,
			   							lRequisitada: true,
				   						lIniciada : true,
				   						lSuspensa : true,
				   						lEncerrada : false,
				   						lTerminada: false,
				   						tta_cod_estab: {}}; 
			} 	

			if (previousView.controller) {
				if (helperOrder.data) {
					if (createTab === false && (helperOrder.data.reloadList == false || helperOrder.data.reloadList == undefined) && (previousView.controller !== 'mmi.order.DetailCtrl' || previousView.controller !== "mmi.order.EditCtrl")){
		                return;
					}
					if (helperOrder.data.reloadList == true) {
						controller.loadData(false);
						return;
					}

				} else {
					if (createTab === false && (previousView.controller == "mmi.order.EditCtrl")) {
						return;
					}
				}
			}
			else{
				return;
			}
			
			controller.loadData(false);
		}
		if ($rootScope.currentuserLoaded) { this.init(); }
	}

	// *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************

	orderSearchCtrl.$inject = [
 		'$modalInstance',
		'$scope',
		'$rootScope',
		'$filter',
		'TOTVSEvent',
 	    'model'];

 	function orderSearchCtrl ($modalInstance,
 							  $scope,
 							  $rootScope,
 							  $filter,
 							  TOTVSEvent,
 							  model) {

 	    this.advancedSearch = model;

 	    this.closeOther = false;
 	    
 	    this.changeTipoManut = function() {
			this.advancedSearch["cd-tipo"] = $filter('numberMask')(this.advancedSearch["cd-tipo"]);
	    }
		
		this.changeEncerra = function(){					
			
			if (this.advancedSearch.lEncerrada){								
				this.advancedSearch['dt-fecham'] = { startDate : undefined, endDate : undefined, start : undefined, end : undefined};				
			}
		}

 	    this.search = function () {
 	    	var close = true;
 	    	
 	    	if (this.advancedSearch['dt-manut']) {	    		
 	    		
	 	    	if (this.advancedSearch['dt-manut'].startDate && !this.advancedSearch['dt-manut'].endDate) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'error',
		                title: $rootScope.i18n('l-attention'),
		                detail: $rootScope.i18n('msg-valid-range-maintenance-date')
		            });            	
	            	close = false;
	            } else if (!this.advancedSearch['dt-manut'].startDate && this.advancedSearch['dt-manut'].endDate) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'error',
		                title: $rootScope.i18n('l-attention'),
		                detail: $rootScope.i18n('msg-valid-range-maintenance-date')
		            });
	            	close = false;
	            }
 	    	}
 	    	
 	    	if (this.advancedSearch['dt-fecham']) {
 	    		if (this.advancedSearch['dt-fecham'].startDate != undefined && this.advancedSearch['dt-fecham'].endDate != undefined)
 	    			this.advancedSearch.lEncerrada = true;
 	    		
	 	    	if (this.advancedSearch['dt-fecham'].startDate && !this.advancedSearch['dt-fecham'].endDate) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'error',
		                title: $rootScope.i18n('l-attention'),
		                detail: $rootScope.i18n('msg-valid-range-closing-date')
		            });            	
	            	close = false;
	            } else if (!this.advancedSearch['dt-fecham'].startDate && this.advancedSearch['dt-fecham'].endDate) {
	            	$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'error',
		                title: $rootScope.i18n('l-attention'),
		                detail: $rootScope.i18n('msg-valid-range-closing-date')
		            });
	            	close = false;
	            }
 	    	}

        	if (this.advancedSearch.lNaoIniciada == false && this.advancedSearch.lLiberada == false && this.advancedSearch.lReservada == false && this.advancedSearch.lRequisitada == false && this.advancedSearch.lSuspensa == false && this.advancedSearch.lIniciada == false && this.advancedSearch.lEncerrada == false && this.advancedSearch.lTerminada == false) { 
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
 	     	    
		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		    $modalInstance.dismiss('cancel');
		});

 	}
 	
    index.register.controller('mmi.order.ListCtrl', orderListCtrl);
	index.register.controller('mmi.order.SearchCtrl', orderSearchCtrl);

	index.register.service('helperOrder', function(){
		return {
			data :{}
		};
	});

});
