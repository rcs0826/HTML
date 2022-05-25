define(['index',
        '/dts/mmi/js/dbo/bomn131.js'], function(index) {


    /**
     * specialtyController
     */
    specialtyListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
        '$timeout',
    	'TOTVSEvent',
        '$modal',
        'mmi.bomn131.Service',
        'helperOrder'
    ];

    function specialtyListController($rootScope, 
    							$scope,
    							$filter,
                                $timeout,
    							TOTVSEvent,
                                $modal,
                                bomn131Service,
                                helperOrder) {

    	/**
    	 * specialtyListControl
    	 */ 
        var specialtyCtrl = this;
        
        specialtyCtrl.showButton = helperOrder.data.showButton === undefined;

        /**
         * Lista de Especialidades
         */
        $scope.listOfSpecialties;
        $scope.selectedSpecialty;


        
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        specialtyCtrl.loadDataGridSpecialty = function(){

           if(detailOrderCtrl.reloadSpecialty){
                $scope.listOfSpecialties = undefined;
                detailOrderCtrl.reloadSpecialty = false;
            }

            specialtyCtrl.isDisabled = false;
            specialtyCtrl.hideActions = false;

            if (detailOrderCtrl.listOfTasks.length < 1)
                specialtyCtrl.isDisabled = true;                


            if (detailOrderCtrl.model['estado-om'] == 4){
                specialtyCtrl.hideActions = true;                
            }

            if ($scope.listOfSpecialties) return;

            $scope.listOfSpecialties = [];                

            var where = "ord-esp.nr-ord-produ = " + detailOrderCtrl.model['nr-ord-produ'];
            var parameters = {};
            
            parameters.where = where;

            bomn131Service.findRecords(0, 9999, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {  
                        value['des-espec'] = value['_']['des-espec'];
                        value['tempo'] = $filter('number')(value['tempo'], 4);
                        value['aloc-minima'] = $filter('number')(value['aloc-minima'], 4);
                        value['aloc-maxima'] = $filter('number')(value['aloc-maxima'], 4);
                        value['conclusao'] = $filter('number')(value['conclusao'], 2);
                        $scope.listOfSpecialties.push(value);
                    });
                }
            });            
        }

        /**
         * Inclusão de tarefa
         */
        specialtyCtrl.specialtyAdd = function() {
            specialtyCtrl.specialty = {};           
            specialtyCtrl.specialty.tempo = "0";
            specialtyCtrl.specialty.isNew = true;            
            specialtyCtrl.openSpecialtyForm();
        }

        /**
         * Alteração de tarefa
         */
        specialtyCtrl.specialtyEdit = function(dataItem) {
            specialtyCtrl.specialty = angular.copy(dataItem);
            specialtyCtrl.specialty.isNew = false;
            specialtyCtrl.openSpecialtyForm ();
        }

        specialtyCtrl.removeSpecialty = function(dataItem){

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-confirm-delete-record', [$rootScope.i18n('l-task' ) + " " + dataItem['cd-tarefa'].toString() + ", " + $rootScope.i18n('l-specialty') + " " + dataItem['tp-especial']]),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        bomn131Service.deleteRecord({pNrOrdProdu: dataItem['nr-ord-produ'], pCdTarefa: dataItem['cd-tarefa'], pTpEspecial: dataItem['tp-especial']}, function(result){
                            if (!result.$hasError) {
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('msg-specialty-delete'),
                                    detail: $rootScope.i18n('msg-success-specialty-delete')
                                });

                                $scope.listOfSpecialties = undefined;
                                specialtyCtrl.loadDataGridSpecialty();
                            }
                        });      
                    }
                }
            });
        }

        /**
         * Abre tela de edição da Especialidade
         */
        specialtyCtrl.openSpecialtyForm = function() {
            
            if(specialtyCtrl.specialty.isNew){
                if (specialtyCtrl.selectedSpecialty) {
                    specialtyCtrl.specialty['cd-tarefa'] = specialtyCtrl.selectedSpecialty; 
                } else {            
                    specialtyCtrl.specialty['cd-tarefa'] = detailOrderCtrl.listOfTasks[0]['cd-tarefa'];
                }
            }

            var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/order/specialty/specialty.edit.html',
                controller: 'mmi.order.SpecialtyEditCtrl as specialtyEditCtrl',
                backdrop: 'static',
                keyboard: true,
                size: 'lg',
                resolve: {
                    model: function () {
                        return specialtyCtrl.specialty;
                    }
                }
            });
            
            modalInstance.result.then(function(){         
                if (specialtyCtrl.specialty.refresh) {
                    if (specialtyCtrl.specialty.isNew) {
                        $scope.listOfSpecialties = undefined;
                        specialtyCtrl.loadDataGridSpecialty();
                    } else {

                        $scope.listOfSpecialties = undefined;
                        specialtyCtrl.loadDataGridSpecialty();                        

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
                        
                        $scope.listOfSpecialties.sort(orderAll);
                    }
                }
            }, function(){
                if (specialtyCtrl.specialty.isSaveNew){
                    $scope.listOfSpecialties = undefined;
                    specialtyCtrl.loadDataGridSpecialty();
                }
            });                     
        }

        specialtyCtrl.templateHeaderSpecialty = function(text, campo){
            var input = '<span';
            input = input + ' id="h-'+campo+'" class="glyphicon" data-toggle="tooltip" title="' + $rootScope.i18n(text) + '"';
            input = input + ' ></span>'
            input = input + '<span class="font-header" ng-click="specialtyCtrl.orderGridSpecialty(\''+ campo +'\')">' + $rootScope.i18n(text) + '</span>';

            return input;            
        };

        specialtyCtrl.templateSpecialtyEncerrada = function(dataItem){
            var input = "<span>";
            if (dataItem.encerrada)
                input = input + $rootScope.i18n('l-yes');
            else
                input = input + $rootScope.i18n('l-no');

            input = input + "</span>";

            return input;
        }

        specialtyCtrl.templateTipoTempo = function(dataItem){
            var label = "";

            if (dataItem['tipo-tempo'] == 1)
                label = $rootScope.i18n('l-individual');
            else
                label = $rootScope.i18n('l-total');

            return label;
        }

        specialtyCtrl.templateTipoEspec = function(dataItem){
            var label = "";

            if(dataItem['tipo-espec'] == 1)
                label = $rootScope.i18n('l-normal');
            else
                label = $rootScope.i18n('l-support');
            
            return label;
        }


        specialtyCtrl.orderby = {
            "property": '',
            "asc": true
        };

        specialtyCtrl.orderGridSpecialty = function(order){

            if (specialtyCtrl.orderby && specialtyCtrl.orderby.property != ""){
                if (specialtyCtrl.orderby.property == order){
                    if (specialtyCtrl.orderby.asc){
                        specialtyCtrl.orderby = {
                            "property": order,
                            "asc": false
                        };
                        angular.element('#h-'+order).addClass('glyphicon-triangle-bottom');
                        angular.element('#h-'+order).removeClass('glyphicon-triangle-top');
                    } else {
                        specialtyCtrl.orderby = {
                            "property": order,
                            "asc": true
                        };
                        angular.element('#h-'+order).addClass('glyphicon-triangle-top');
                        angular.element('#h-'+order).removeClass('glyphicon-triangle-bottom');
                    }
                }else{
                    angular.element('#h-'+specialtyCtrl.orderby.property).removeClass('glyphicon-triangle-bottom');
                    angular.element('#h-'+specialtyCtrl.orderby.property).removeClass('glyphicon-triangle-top');
                    specialtyCtrl.orderby = {
                        "property": order,
                        "asc": true
                    };
                    angular.element('#h-'+order).addClass('glyphicon-triangle-bottom');                    
                }
            }else{
                specialtyCtrl.orderby = {
                    "property": order,
                    "asc": true
                };
                angular.element('#h-'+order).addClass('glyphicon-triangle-top');
            }

            if (specialtyCtrl.orderby.asc){
                $scope.listOfSpecialties.sort(function (a, b){
                    if (a[specialtyCtrl.orderby.property] > b[specialtyCtrl.orderby.property])
                        return 1;
                    else if (a[specialtyCtrl.orderby.property] < b[specialtyCtrl.orderby.property])
                        return -1;
                    else
                        return ;
                });
            }else{
                $scope.listOfSpecialties.sort(function (a, b){
                    if (a[specialtyCtrl.orderby.property] < b[specialtyCtrl.orderby.property])
                        return 1;
                    else if (a[specialtyCtrl.orderby.property] > b[specialtyCtrl.orderby.property])
                        return -1;
                    else
                        return 0;
              });
            }
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
         
        // cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            specialtyCtrl.init();
        });
            
    }

    index.register.controller('mmi.order.specialty.SpecialtyListCtrl', specialtyListController);

});