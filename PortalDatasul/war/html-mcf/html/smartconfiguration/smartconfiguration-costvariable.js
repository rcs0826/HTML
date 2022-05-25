define(['index',
		'/dts/mcf/js/utils/bootstrap-treeview.js'
		], function(index) {

	smartconfigurationCostVariableCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$modal',
		'$filter',
		'$location',
		'$stateParams',
		'cfapi004.Factory',
		'totvs.app-main-view.Service',
		'totvs.app-notification.Service',
		'TOTVSEvent'
	];
	
	function smartconfigurationCostVariableCtrl($rootScope,
									 $scope,
									 $modal,
									 $filter,
									 $location,
									 $stateParams,
									 cfapi004,
									 appViewService,
									 appNotificationService,
									 TOTVSEvent) {
	
		var controller = this;
		controller.ttVarCost = [];
		controller.tgAtualizPedido = false;
		$scope.nodes = [];
	
		controller.montaTree = function(list, node){
			if (node != undefined){
				if (node.tipo == 1)
					imagem = "glyphicon glyphicon-file";
				else if (node.tipo == 2)
					imagem = "glyphicon glyphicon-duplicate";
				else if (node.tipo == 3)
					imagem = "glyphicon glyphicon-inbox";
				
				if (node.chavePai == ""){
					$scope.nodes.push({'text': node.texto,
									   'chavePai' : node.chavePai,
									   'chaveFilho' : node.chaveFilho,
									   'imagem' : node.tipo,
									   'icon' : imagem});
				} else {
					controller.isNewNode = true;
					angular.forEach(list, function(l, i, obj) {
						if (l.chaveFilho == node.chavePai){
							if (obj[i].nodes == undefined)
								obj[i].nodes = [];

							obj[i].nodes.push({'text': node.texto,
											   'chavePai' : node.chavePai,
											   'chaveFilho' : node.chaveFilho,
											   'imagem' : node.tipo,
											   'icon' : imagem});
							
							controller.isNewNode = false;
						} else {
							if (obj[i].nodes != undefined){
								if (obj[i].nodes.length > 0)
									controller.montaTree(obj[i].nodes, node);
							}
						}
					});
				}
			}
		}		
		controller.exportaParaPedidos = function() {
			// realiza a busca de dados inicial	        	
			var pItemCotacao = $stateParams.pItemCotacao;
			var pNumCFG 		= $stateParams.pNumCFG;

			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				pItemCFG:pItemCotacao,
				pNumCFG:pNumCFG,
				ttVarCost:controller.ttVarCost
			};
			cfapi004.exportaParaPedidos(param, function(result){
				console.log("Resultado-5", result);
				if (result){
					if (result.length > 0){
						angular.forEach(result,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						var alert = {
							type: 'success',
							title: "Atualização Concluída!",
							size: 'md',
							//detail: "As sequências dos pedidos que contém o item AA, com configuração BB, tiveram seu preço de venda atualizado." 
							detail: "As sequências dos pedidos que contém o item " + pItemCotacao + ", com configuração " + pNumCFG + " , tiveram seu preço de venda atualizado."
						};
						appNotificationService.notify(alert);
					}
				}
			});
		}

	    controller.cancel = function() {
			$location.path('dts/mcf/smartconfiguration');
	    }

		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************		
		this.init = function() {
			
			 if (appViewService.startView($rootScope.i18n('l-productconfigured'), 'mcf.smartconfiguration.CostVariableCtrl', controller)) { }
			 
			// se houver parametros na URL
	        if ($stateParams) {
	            // realiza a busca de dados inicial	        	
				$scope.pItemCotacao = $stateParams.pItemCotacao;
				$scope.pNumCFG 		= $stateParams.pNumCFG;
				
				var param = {
					pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
					pItemCFG:$scope.pItemCotacao,
					pNumCFG:$scope.pNumCFG
				};
				cfapi004.exibeVariaveisCustos(param, function(result){
					if (result){
						console.log("Resultado", result);
						controller.ttVarCost = result.ttVarCost;
						console.log("Resultado-1", controller.ttVarCost);
						angular.forEach(result.ttCostVariable, function(node, i, obj){
							controller.montaTree($scope.nodes, node);
						});
						$('#treeCost').treeview({
								data: $scope.nodes,         // data is not optional
								levels: 5,
								backColor: 'green',
								showBorder: false
						});
					}				
				});
			}
		}
		if ($rootScope.currentuserLoaded) { this.init(); }
		
		// *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************		
		$scope.$on('$destroy', function () {
			controller = undefined;
		});
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
					
	}
 	
	index.register.controller('mcf.smartconfiguration.CostVariableCtrl', smartconfigurationCostVariableCtrl);
			
});