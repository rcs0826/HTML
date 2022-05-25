define(['index', 
        '/dts/hgp/html/hrc-transactionVsUserAssociative/transactionVsUserAssociativeFactory.js',        
        '/dts/hgp/html/hrc-transaction/transactionZoomController.js',        
        '/dts/hgp/html/global-user/userZoomController.js',        
        '/dts/hgp/html/hrc-periodSituation/sitPerZoomController.js',        
        '/dts/hgp/html/js/util/HibernateTools.js',
        /* Colocar os inject dos zooms que for usar */        
    ], function(index) {

	transactionVsUserAssociativeMaintenanceController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 
                                                                'totvs.app-main-view.Service', 'hrc.transactionVsUserAssociative.Factory', 
                                                                '$location', 'TOTVSEvent'];
	function transactionVsUserAssociativeMaintenanceController($rootScope, $scope, $state, $stateParams, appViewService, transactionVsUserAssociativeFactory, $location  , TOTVSEvent) {

		var _self = this;
        _self.today = new Date();
        _self.transactionVsUserAssociative = {};
        _self.movementFixedFilters = {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: "PROCEDIMENTOS"};        
                
        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });  

        this.init = function(){

            appViewService.startView("Associativa Transação x Usuários", 'hrc.transactionVsUserAssociative.Control', _self);

            if($state.current.name === 'dts/hgp/hrc-transactionVsUserAssociative.new'){
                _self.action = 'INSERT';
                _self.transactionVsUserAssociative.cdUserid = $rootScope.currentuser.login;                                                  
            }

            if(appViewService.lastAction != 'newtab' 
            && _self.currentUrl == $location.$$path){
                return;
            }            

            _self.currentUrl = $location.$$path; 
            _self.transactionVsUserAssociative.dtAtualizacao = Date.now();


            if (angular.isUndefined($stateParams.cdTransacao)
            && angular.isUndefined($stateParams.cdUseridTransacao)){
                return;
            }     


            if($state.current.name === 'dts/hgp/hrc-transactionVsUserAssociative.detail'){
                _self.action = 'DETAIL';                                                
            }
            else
            {
                _self.action = 'EDIT';
            }     

            var disclaimers = [{property: 'cdTransacao', value: $stateParams.cdTransacao},
                               {property: 'cdUseridTransacao',  value: $stateParams.cdUseridTransacao}];

            transactionVsUserAssociativeFactory.getTransactionVsUserAssociativeByFilter('', 0, 0, false, disclaimers,
                function(result){
                    _self.transactionVsUserAssociative = result[0];  

                    if(_self.action == 'EDIT'){
                        _self.transactionVsUserAssociative.dtAtualizacao = Date.now();                        
                    }                      
                });
        };

        // cancela edição - volta para a lista
        this.onCancel = function () {                  
            appViewService.removeView({active: true,
                                       name  : 'Associativa Transação x Usuários',
                                       url   : _self.currentUrl}); 
        };


        this.onSaveNew = function () {  

            var disclaimers = [{property: 'cdTransacao', value: _self.transactionVsUserAssociative.cdTransacao},
                               {property: 'cdUseridTransacao', value: _self.transactionVsUserAssociative.cdUseridTransacao}];

            transactionVsUserAssociativeFactory.getTransactionVsUserAssociativeByFilter('', 0, 0, false, disclaimers,
                function(result){

                    if(result.length != 0){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Registro já cadastrado com este código!'
                        }); 
                        return;
                    }    

                    transactionVsUserAssociativeFactory.saveTransactionVsUserAssociative(_self.transactionVsUserAssociative, _self.action,
                        function (result) {
                            if(result.$hasError == true){
                                return;
                            }

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', title: 'Salvo com sucesso'                                 
                            });                                            

                            if(result.$hasError != true){                            
                                _self.transactionVsUserAssociative.cdTransacao = "";
                                _self.transactionVsUserAssociative.cdUseridTransacao = "";                                
                                _self.transactionVsUserAssociative.lgUnicaSitPeriodo = false;                     
                                _self.transactionVsUserAssociative.lgAutorizaDigitacao = false;                     
                                _self.transactionVsUserAssociative.cdSitPer = "";                                
                                _self.transactionVsUserAssociative.cdUserid = "";     
                                _self.transactionVsUserAssociative.dsObservacao = "";                     

                                _self.action = "INSERT";
                                _self.init();  
                            }
                        });                
            });           
        };

        // salva os parametros alterados 
        this.save = function () {  
            
            transactionVsUserAssociativeFactory.saveTransactionVsUserAssociative(_self.transactionVsUserAssociative, _self.action,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Salvo com sucesso'
                    }); 

                    appViewService.removeView({active: true,
                                               name  : 'Inclusão Associativa Condição Saúde x Procedimento',
                                               url   : _self.currentUrl});                                  
                });                                       
        };         


        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrc.transactionVsUserAssociativeMaintenance.Control', transactionVsUserAssociativeMaintenanceController);	
});

