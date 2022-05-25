define(['index',
        '/dts/mmi/js/dbo/bomn132.js'], function(index) {

    /**
     * toolController
     */
    toolListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
        '$timeout',
    	'TOTVSEvent',
        'mmi.bomn132.Service',
        '$modal',
        'helperOrder'
    ];

    function toolListController($rootScope, 
    							$scope,
    							$filter,
                                $timeout,
    							TOTVSEvent,
                                bomn132Service,
                                $modal,
                                helperOrder) {

    	/**
    	 * Controller
    	 */ 
    	var toolCtrl = this;
    	
    	this.tool = {};
    	
    	this.hideAdd = false;
    	
        this.selectedItem;
        
        toolCtrl.showButton = helperOrder.data.showButton === undefined;

        $scope.listOftools;
        
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        /**
         * Lista Ferramentas
         */
        toolCtrl.loadDataGridTool = function(){

            if(detailOrderCtrl.reloadTools){
                $scope.listOfTools = undefined;
                detailOrderCtrl.reloadTools = false;
            }

        	toolCtrl.isDisabled = false; 

            if (detailOrderCtrl.listOfTasks.length < 1) {                
                toolCtrl.isDisabled = true;
                $scope.listOfTools = undefined;                
            }
            
             toolCtrl.hideAdd = detailOrderCtrl.model['estado-om'] === 4;

            if (detailOrderCtrl.model['estado-om'] === 4){
                toolCtrl.hideAdd = true;                
            }

            
            if ($scope.listOfTools) return;
            $scope.listOfTools = [];
            
            toolCtrl.hideAdd = detailOrderCtrl.model['estado-om'] === 4;

            var where = "ord-ferr.nr-ord-produ = " + detailOrderCtrl.model['nr-ord-produ'];
            var parameters = {};
            
            parameters.where = where;
                        
            bomn132Service.findRecords(0, 9999, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {  
                        value['desc-ferr'] = value['_']['desc-ferr'];
                        value['tempo'] = $filter('number')(value['tempo'],4);
                        $scope.listOfTools.push(value);                        
                    });
                }
            });    


        }
        
         toolCtrl.addTool = function() {
            toolCtrl.tool = {};
            toolCtrl.tool.isNew= true;
            toolCtrl.tool["nr-ord-produ"] = detailOrderCtrl.model['nr-ord-produ'];
            toolCtrl.tool.tempo = "0,000";
            toolCtrl.openToolEdit();
        }

         /**
          * Alteração da ferramenta
          */
         toolCtrl.toolEdit = function(value) {
         	 toolCtrl.tool = angular.copy(value);
             toolCtrl.tool.isNew = false;
             toolCtrl.openToolEdit ();
         }
         
         /**
          * Abre tela para edição da ferramenta
          */
                 
        toolCtrl.openToolEdit = function() {
              var taskNumber;
                  
            if(toolCtrl.tool.isNew){
            	if (toolCtrl.selectedItem) {
            		taskNumber = toolCtrl.selectedItem['cd-tarefa']; 
            	} else {        	
            		taskNumber = detailOrderCtrl.listOfTasks[0]['cd-tarefa'];
            	}
            	
            	toolCtrl.tool['cd-tarefa'] = taskNumber;            	
            }
            
            var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/order/tool/tool.edit.html',
                controller: 'mmi.order.toolEditCtrl as toolEditCtrl',
                backdrop: 'static',
                keyboard: true,
                size: 'md',
                resolve: {
                    model: function () {
                        return toolCtrl.tool;                      
                    }
                }
            });
            
                       
            modalInstance.result.then(function(){
        		if (toolCtrl.tool.refresh) {
        			$scope.listOfTools = undefined;
      				toolCtrl.loadDataGridTool();
      				
        	    }else{
        	    	
        	    	if (toolCtrl.tool.isNew && toolCtrl.tool.refresh === false){
        	    		toolCtrl.tool['tempo'] = $filter('number')(toolCtrl.tool['tempo'], 4);
           			 	$scope.listOfTools.push(toolCtrl.tool);
   		            }else{
   		            	if(toolCtrl.tool.refresh !== true){
   	   		               	$scope.listOfTools = undefined;
   	   		            	toolCtrl.loadDataGridTool();
   		            	}
   		            }
        	    }
        	    	 
        		var orderTask = function(a, b) {
				    return a['cd-tarefa'] - b['cd-tarefa'];
				};

				var orderTool = function(a, b) {
				    return a['cd-tp-ferr'] - b['cd-tp-ferr'];
				};
				
				var orderAll = function(a, b) {
					if (orderTask(a, b) != 0) return orderTask(a, b);
					return orderTool(a, b);
				};
				
				$scope.listOfTools.sort(orderAll);
				
				
            },function(){
	           if (toolCtrl.tool.isSaveNew){
	               $scope.listOfTools = undefined;
	               toolCtrl.loadDataGridTool();
	           }

        	});
        }

        
               
              /** Valida remoção da ferramenta      */
        toolCtrl.remove = function(dataItem) {
            var index;
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-confirm-delete-record', [$rootScope.i18n('l-task' ) + " " + dataItem['cd-tarefa'].toString() + ", " + $rootScope.i18n('l-tool') + " " + dataItem['cd-tp-ferr']]),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        
                        for(var i = 0; i < $scope.listOfTools.length; i++) {
                            if ($scope.listOfTools[i]['cd-tarefa'] === dataItem['cd-tarefa'] && $scope.listOfTools[i]['cd-tp-ferr'] === dataItem['cd-tp-ferr']) {
                                index = i;
                                toolId = {pNrOrdProdu: dataItem['nr-ord-produ'], pCdTarefa: dataItem['cd-tarefa'], pCdTpFerr: dataItem['cd-tp-ferr']};
                                break;
                            }
                        }
                        
                        toolCtrl.deleteRecord(index, toolId);
                    }
                }
            });         
        }
        
        /**
         * Remove ferramenta
         */
        toolCtrl.deleteRecord = function(index, toolId) {
            bomn132Service.deleteRecord(toolId, function(result) {
                if (!result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-tool-delete'),
                        detail: $rootScope.i18n('msg-success-tool-delete')
                    });

                    $scope.listOfTools.splice(index, 1);
                }
            });
        }




        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         
        this.init = function() {
        }
         
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }    
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o toolListController somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }

    index.register.controller('mmi.order.tool.ToolListCtrl', toolListController);    
});