define(['index',
        '/dts/mmi/js/dbo/bomn138.js'], function(index) {

    /**
    * pertController
    */
    pertListController.$inject = ['$rootScope',	         
                                  '$scope',
                                  '$filter',
                                  'TOTVSEvent',
                                  'mmi.bomn138.Service',
                                  '$modal',
                                  'fchmip.fchmiporder.Factory',
                                  'helperOrder'
    ];

    function pertListController($rootScope, 
                                $scope,
                                $filter,
                                TOTVSEvent,
                                bomn138Service,
                                $modal,
                                fchmiporderFactory,
                                helperOrder) {

        /**
         * Controller
         */ 
        var pertCtrl = this;

        this.taskLength;

        pertCtrl.showButton = helperOrder.data.showButton === undefined;


        /**
         * Lista da Rede PERT
         */
        $scope.listOfPert;

        // *********************************************************************************
        // *** Funções
        // *********************************************************************************

        /**
         * Gera rede PERT
         */
        this.generatePert = function(){

            var nrOrderMasked = $filter('orderNumberMask')(String(detailOrderCtrl.model['nr-ord-produ']));

            if ($scope.listOfPert.length > 0){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: $rootScope.i18n('msg-question-generate-pert'), // titulo da mensagem
                    text: $rootScope.i18n('msg-generate-pert', [nrOrderMasked]), // texto da mensagem
                    cancelLabel: 'l-no', // label do botão cancelar
                    confirmLabel: 'l-yes', // label do botão confirmar
                    callback: function(isPositiveResult) { // função de retorno
                        if (isPositiveResult) { // se foi clicado o botão confirmar
                            fchmiporderFactory.generatePert(detailOrderCtrl.model['nr-ord-produ'], function(result){
                                if (result){
                                    $scope.listOfPert = [];
                                    angular.forEach(result, function (value) {
                                        value.overlap               = $filter('number')(value['overlap'], 2);
                                        value['tempo-overlap']      = $filter('number')(value['tempo-overlap'], 4);
                                        value['tempo-espera-min']   = $filter('number')(value['tempo-espera-min'], 4);
                                        value['tempo-espera-max']   = $filter('number')(value['tempo-espera-max'], 4);
                                        value['tipo-overlap']       = value['traduz-tipo-overlap']
                                        value['desc-tarefa-predec'] = value['desc-tarefa-predec'];
                                        $scope.listOfPert.push(value);
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                fchmiporderFactory.generatePert(detailOrderCtrl.model['nr-ord-produ'], function(result){
                    if (result){
                        $scope.listOfPert = [];
                        angular.forEach(result, function (value) {
                            value.overlap               = $filter('number')(value['overlap'], 2);
                            value['tempo-overlap']      = $filter('number')(value['tempo-overlap'], 4);
                            value['tempo-espera-min']   = $filter('number')(value['tempo-espera-min'], 4);
                            value['tempo-espera-max']   = $filter('number')(value['tempo-espera-max'], 4);
                            value['tipo-overlap']       = value['traduz-tipo-overlap']
                            value['desc-tarefa-predec'] = value['desc-tarefa-predec'];
                            $scope.listOfPert.push(value);
                        });
                    }
                });
            }
        }

        /**
         * Lista Pert
         */
        this.loadDataGridPert = function(){

            if(detailOrderCtrl.reloadPert){
                $scope.listOfPert = undefined;
                detailOrderCtrl.reloadPert = false;
            }
            
        	pertCtrl.isDisabled = false;

        	if (detailOrderCtrl.listOfTasks.length < 2) {
        		pertCtrl.isDisabled = true;
        	} else {
        		if (pertCtrl.taskLength !== detailOrderCtrl.listOfTasks.length) {
            		$scope.listOfPert = undefined;
            	}
            }

            if ($scope.listOfPert) return;

            $scope.listOfPert = [];
            if (detailOrderCtrl.model['estado-om'] === 4){
            	pertCtrl.hidePert = true;            	
            }

            var where = "p-ord-esp.nr-ord-produ = " + detailOrderCtrl.model['nr-ord-produ'];
            var parameters = {};
            
            parameters.where = where;

            bomn138Service.findRecords(0, 9999, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {
                        value.overlap               = $filter('number')(value['overlap'], 2);
                        value['tempo-overlap']      = $filter('number')(value['tempo-overlap'], 4);
                        value['tempo-espera-min']   = $filter('number')(value['tempo-espera-min'], 4);
                        value['tempo-espera-max']   = $filter('number')(value['tempo-espera-max'], 4);
                        value['desc-tarefa']        = value._['desc-tarefa'];
                        value['tipo-overlap']       = value._['traduz-tipo-overlap']
                        value['desc-tarefa-predec'] = value._['desc-tarefa-predec'];
                        $scope.listOfPert.push(value);
                    });
                }
            });

            pertCtrl.taskLength = detailOrderCtrl.listOfTasks.length;
        }

         /**
         * Consiste Rede Pert
         */
        this.consistPert = function(){
            fchmiporderFactory.consistPert(detailOrderCtrl.model['nr-ord-produ'], function(result){  

                if (result.lConsist){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: ($rootScope.i18n('msg-pert-ok')), //A Rede Pert está ok!
                        detail: ($rootScope.i18n('msg-pert-consist-ok')) //A Rede Pert consistida está perfeitamente funcional.
                    });
                }

            });

        }
            
            

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        this.init = function() { }
        
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

    index.register.controller('mmi.order.pert.PertListCtrl', pertListController);

});