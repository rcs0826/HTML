define(['index',
        '/dts/mmi/js/dbo/boin390.js',
        '/dts/mmi/html/order/materials/materials-edit.js'], function(index) {

    /**
     * materialsController
     */
    materialsListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
        '$timeout',
    	'TOTVSEvent',
        'mmi.boin390.Service',
        '$modal',
        'helperItem',
        'fchmip.fchmiporder.Factory' ,
        'helperOrder'
    ];

    function materialsListController($rootScope, 
         							 $scope,
        							 $filter,
                                     $timeout,
        							 TOTVSEvent,
                                     boin390Service,
                                     $modal,
                                     helperItem,
                                     fchmiporderFactory,
                                     helperOrder) {

    	/**
    	 * materialsListControl
    	 */ 
    	var materialsCtrl = this;

        this.selectedItem;

        this.disableAdd = false;

        materialsCtrl.showButton = helperOrder.data.showButton === undefined;

        /**
         * Lista de Materiais
         */
        $scope.listOfMaterials;

    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        materialsCtrl.loadDataGridMaterials = function(){

            if(detailOrderCtrl.reloadMaterials){
                $scope.listOfMaterials = undefined;
                detailOrderCtrl.reloadMaterials = false;
            }

            if ($scope.listOfMaterials) return;  

            $scope.listOfMaterials = [];

            var where = "reservas.nr-ord-produ = " + detailOrderCtrl.model['nr-ord-produ'];
            var parameters = {};
            
            materialsCtrl.disableAdd = detailOrderCtrl.model['estado-om'] === 4;
            
            parameters.where = where;

            boin390Service.findRecords(0, 9999, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {  
                        value['dt-reserva'] = new Date(value['dt-reserva']);
                        value['dt-reserva'] = $filter('date')(value['dt-reserva'], 'dd/MM/yyyy');
                        value['quant-aloc'] = $filter('number')(value['quant-aloc'], 4);
                        value['quant-orig'] = $filter('number')(value['quant-orig'], 4);
                        value['quant-requis'] = $filter('number')(value['quant-requis'], 4);
                        value['quant-atend'] = $filter('number')(value['quant-atend'], 4);
                        value['log-1'] = undefined;
                        value['des-item'] = value['_']['des-item'];
                        value['dtReservaStr'] = value['_']['dtReservaStr'];
                        $scope.listOfMaterials.push(value);
                    });
                   
                    if($scope.listOfMaterials.length > 0){
                        materialsCtrl.disableBalance = true;
                    }
                }
            });
        }

        materialsCtrl.templateHeaderMaterials = function(text, campo){
            var input = '<span';
            input = input + ' id="h-'+campo+'" class="glyphicon" data-toggle="tooltip" title="' + $rootScope.i18n(text) + '"';
            input = input + ' ></span>'
            input = input + '<span class="font-header" ng-click="materialsCtrl.orderGridMaterials(\''+ campo +'\')">' + $rootScope.i18n(text) + '</span>';

            return input;            
        };

        materialsCtrl.orderGridMaterials = function(order){

            if (materialsCtrl.orderby && materialsCtrl.orderby.property != ""){
                if (materialsCtrl.orderby.property == order){
                    if (materialsCtrl.orderby.asc){
                        materialsCtrl.orderby = {
                            "property": order,
                            "asc": false
                        };
                        angular.element('#h-'+order).addClass('glyphicon-triangle-bottom');
                        angular.element('#h-'+order).removeClass('glyphicon-triangle-top');
                    } else {
                        materialsCtrl.orderby = {
                            "property": order,
                            "asc": true
                        };
                        angular.element('#h-'+order).addClass('glyphicon-triangle-top');
                        angular.element('#h-'+order).removeClass('glyphicon-triangle-bottom');
                    }
                }else{
                    angular.element('#h-'+materialsCtrl.orderby.property).removeClass('glyphicon-triangle-bottom');
                    angular.element('#h-'+materialsCtrl.orderby.property).removeClass('glyphicon-triangle-top');
                    materialsCtrl.orderby = {
                        "property": order,
                        "asc": true
                    };
                    angular.element('#h-'+order).addClass('glyphicon-triangle-bottom');                    
                }
            }else{
                materialsCtrl.orderby = {
                    "property": order,
                    "asc": true
                };
                angular.element('#h-'+order).addClass('glyphicon-triangle-top');
            }

            if (materialsCtrl.orderby.asc){
                $scope.listOfMaterials.sort(function (a, b){
                    if (a[materialsCtrl.orderby.property] > b[materialsCtrl.orderby.property])
                        return 1;
                    else if (a[materialsCtrl.orderby.property] < b[materialsCtrl.orderby.property])
                        return -1;
                    else
                        return ;
                });
            }else{
                $scope.listOfMaterials.sort(function (a, b){
                    if (a[materialsCtrl.orderby.property] < b[materialsCtrl.orderby.property])
                        return 1;
                    else if (a[materialsCtrl.orderby.property] > b[materialsCtrl.orderby.property])
                        return -1;
                    else
                        return 0;
              });
            }
        }

        /**
         * Abre tela de edição de Materiais
         */
        materialsCtrl.openMaterialsForm = function() {

            var taskNumber;
            
            if(materialsCtrl.material.isNew){
                if (materialsCtrl.selectedItem) {
                    taskNumber = materialsCtrl.selectedItem['op-codigo']; 
                } else {
                    if(detailOrderCtrl.listOfTasks && detailOrderCtrl.listOfTasks.length > 0){
                        taskNumber = detailOrderCtrl.listOfTasks[0]['cd-tarefa'];
                    }
                }

                materialsCtrl.material['op-codigo'] = taskNumber;
            }else{
                if(materialsCtrl.material['it-codigo']){
                    helperItem.data = materialsCtrl.material['it-codigo'];
                }
            }

            var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/order/materials/materials.edit.html',
                controller: 'mmi.order.materialsEditCtrl as materialsEditCtrl',
                size: 'lg',
                backdrop: 'static',
                keyboard: true,
                resolve: {
                    model: function () {
                        return materialsCtrl.material;
                    }
                }
            });
            
            modalInstance.result.then(function(){
                var materialLink = "material" + materialsCtrl.material['it-codigo'];

                if (materialsCtrl.material.refresh !== true && materialsCtrl.material.cancel == true){
                    return;
                } else{
                    $scope.listOfMaterials = undefined;
                    materialsCtrl.loadDataGridMaterials();

                    var orderTask = function(a, b) {
                        return a['cd-tarefa'] - b['cd-tarefa'];
                    };

                    var orderSpecialty = function(a, b) {
                        return a['tp-especial'] - b['tp-especial'];
                    };
                    
                    var orderAll = function(a, b) {
                        if (orderTask(a, b) != 0) return orderTask(a, b);
                        return orderSpecialty(a, b);
                    };
                    
                    $scope.listOfMaterials.sort(orderAll);
                }
            }, function(){
                if(!materialsCtrl.material.isSaveNew){
                    $scope.listOfMaterials = undefined;
                    materialsCtrl.loadDataGridMaterials();
                }
            });                     
        }

        /**
         * Inclusão da reserva
         */
        materialsCtrl.materialsAdd = function() {
            materialsCtrl.material = {};
            materialsCtrl.material.isNew = true;
            materialsCtrl.openMaterialsForm();
        }
         
         /**
         * Verifica saldo das reservas da ordem.
         */
        materialsCtrl.verificaSaldo = function() {
          
                   
            fchmiporderFactory.validaSaldo(detailOrderCtrl.model['nr-ord-produ'], function(result) {
               
                if (!result.$hasError) {    

                    iCont = 0;
                    
                    angular.forEach(result, function(material){
                       material['dt-reserva']   = $filter('date')(material['dt-reserva'], 'dd/MM/yyyy');
                       material['quant-orig']   = $filter('number')(material['quant-orig'], 4);
                       material['quant-requis'] = $filter('number')(material['quant-requis'], 4);
                       material['quant-atend']  = $filter('number')(material['quant-atend'], 4);
                       material['quant-aloc']   = $filter('number')(material['quant-aloc'], 4);
                       material['des-item']     = $scope.listOfMaterials[iCont]['des-item'];
                       
                       iCont++;
                    });
                    
                    $scope.listOfMaterials = result;
	            }
                 		
	                 
            });
        }    

        /**
         * Alteração da reserva
         */
            materialsCtrl.materialsEdit = function(value) {
            materialsCtrl.material = angular.copy(value);
            materialsCtrl.material.isNew = false;
            materialsCtrl.openMaterialsForm(value);
        }

        /**
         * Remover reserva
         */
        materialsCtrl.remove = function(dataItem){
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-confirm-delete-record', [$rootScope.i18n('l-task' ) + " " + dataItem['op-codigo'].toString() + ", " + $rootScope.i18n('l-item') + " " + dataItem['it-codigo']]),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {

                        for(var i = 0; i < $scope.listOfMaterials.length; i++) {
                            if ($scope.listOfMaterials[i]['op-codigo'] === dataItem['op-codigo'] && $scope.listOfMaterials[i]['it-codigo'] === dataItem['it-codigo']) {
                                index = i;
                                break;
                            }
                        }

                        boin390Service.deleteRecord({pNrOrdProdu: dataItem['nr-ord-produ'], pItemPai: dataItem['item-pai'] == "" ? " " : dataItem['item-pai'], pCodRoteiro: dataItem['cod-roteiro'] == "" ? " " : dataItem['cod-roteiro'], pOpCodigo: dataItem['op-codigo'], pItCodigo: dataItem['it-codigo'], pCodRefer: dataItem['cod-refer'] == "" ? " " : dataItem['cod-refer']}, function(result){

                            if (!result.$hasError) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('msg-material-delete'),
                                    detail: $rootScope.i18n('msg-success-material-delete')
                                });

                                $scope.listOfMaterials.splice(index, 1);
                            }

                            if($scope.listOfMaterials.length > 0){
                                materialsCtrl.disableBalance = true;
                            } else{
                                materialsCtrl.disableBalance = false;
                              }

                        });      
                    }
                }
            });

           

        }

    	// *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         


        this.init = function() {
            materialsCtrl.disableBalance = false;
        };    
         
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }    
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }

    index.register.controller('mmi.order.materials.materialsListCtrl', materialsListController);

    index.register.service('helperItem', function(){
        // serviço para passagem de parametro
        return {
            data :{}
        };
    });
});