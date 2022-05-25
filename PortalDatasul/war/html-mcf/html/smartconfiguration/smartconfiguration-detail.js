define(['index',
		'/dts/mcf/js/utils/bootstrap-treeview.js'
		], function(index) {

	smartconfigurationDetailCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$modal',
		'$filter',
		'$location',
		'$stateParams',
		'cfapi004.Factory',
		'totvs.app-main-view.Service',
		'TOTVSEvent'
	];
	
	function smartconfigurationDetailCtrl($rootScope,
									 $scope,
									 $modal,
									 $filter,
									 $location,
									 $stateParams,
									 cfapi004,
									 appViewService,
									 TOTVSEvent) {
	
		var controller = this;
		$scope.nodes = [];

		controller.montaTree = function(list, node){
			if (node != undefined){
				if (node.imagem == 12)
					imagem = "glyphicon glyphicon-file";
				else if (node.imagem == 10)
					imagem = "glyphicon glyphicon-object-align-horizontal";
				else if (node.imagem == 3)
					imagem = "glyphicon glyphicon-hdd";
				else if (node.imagem == 1)
					imagem = "glyphicon glyphicon-file";
				else if (node.imagem == 4)
					imagem = "glyphicon glyphicon-inbox";
				else if (node.imagem == 6)
					imagem = "glyphicon glyphicon-duplicate";
				
				if (node.chavePai == ""){
					$scope.nodes.push({'text': node.texto,
									   'chavePai' : node.chavePai,
									   'chaveFilho' : node.chaveFilho,
									   'imagem' : node.imagem,
									   'icon' : imagem});
				} else {
					controller.isNewNode = true;
					angular.forEach(list, function(l, i, obj) {
						if (l.chaveFilho == node.chavePai && controller.isNewNode == true){
							if (obj[i].nodes == undefined)
								obj[i].nodes = [];

							obj[i].nodes.push({'text': node.texto,
											   'chavePai' : node.chavePai,
											   'chaveFilho' : node.chaveFilho,
											   'imagem' : node.imagem,
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
	
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************		
		this.init = function() {
			
			 if (appViewService.startView($rootScope.i18n('l-productconfigured'), 'mcf.smartconfiguration.DetailCtrl', controller)) { }
			 
			// se houver parametros na URL
	        if ($stateParams) {
	            // realiza a busca de dados inicial	        	
				$scope.pItemCotacao = $stateParams.pItemCotacao;
				$scope.pNumCFG 		= $stateParams.pNumCFG;
				
				var param = {
					pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
					pItemCFG:$scope.pItemCotacao,
					pNumCFG:$scope.pNumCFG,
				};
				cfapi004.exibeEstruturaDetalhe(param, function(result){
					if (result){
						result = result.sort(function(a,b){ return a.seq - b.seq});
						
						angular.forEach(result, function(node, i, obj){
							controller.montaTree($scope.nodes, node);
						});
						console.log($scope.nodes);
						$('#tree').treeview({
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
 	
	index.register.controller('mcf.smartconfiguration.DetailCtrl', smartconfigurationDetailCtrl);
			
});