define(['index',         
        '/dts/hgp/html/hvp-healthCondVsProcAssoc/healthCondVsProcAssocFactory.js',
        '/dts/hgp/html/js/util/HibernateTools.js',
        '/dts/hgp/html/hrc-movement/movementZoomController.js',         
        '/dts/hgp/html/global/healthConditionZoomController.js',
    ], function(index) {

	healthCondVsProcAssocMaintenanceController.$inject = ['$rootScope', '$scope', '$state', '$stateParams',
                                                          'totvs.app-main-view.Service', 'hvp.healthCondVsProcAssoc.Factory', '$location', 'TOTVSEvent'];
	function healthCondVsProcAssocMaintenanceController($rootScope, $scope, $state, $stateParams, appViewService, healthCondVsProcAssocFactory, $location, TOTVSEvent) {

		var _self = this;
        _self.today = new Date();
        _self.healthCondVsProcAssoc = {};
        _self.movementFixedFilters = {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: "PROCEDIMENTOS"};
        
        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        });  

        this.init = function(){

            appViewService.startView("Associativa Condição Saúde x Procedimento", 'hvp.healthCondVsProcAssocList.Control', _self);

            _self.action = 'INSERT';     
            _self.healthCondVsProcAssoc.codUsuarUltAtualiz = $rootScope.currentuser.login       

            if(appViewService.lastAction != 'newtab' 
            && _self.currentUrl == $location.$$path){
                return;
            }            

            _self.currentUrl = $location.$$path; 
            _self.healthCondVsProcAssoc.datUltAtualiz = Date.now();

            if (angular.isUndefined($stateParams.cdCondicaoSaude)
             && angular.isUndefined($stateParams.cdProcedimento)
             && angular.isUndefined($stateParams.dtLimite)){
                return;
            }     

            if($state.current.name === 'dts/hgp/hvp-healthCondVsProcAssoc.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            }     

            var disclaimers = [{property: 'cdCondicaoSaude', value: $stateParams.cdCondicaoSaude},
                               {property: 'cdProcedimento',  value: $stateParams.cdProcedimento},
                               {property: 'dtLimite',        value: $stateParams.dtLimite}];

            healthCondVsProcAssocFactory.getHealthCondVsProcAssocByFilter('', 0, 0, false, disclaimers,
                function(result){
                    _self.healthCondVsProcAssoc = result[0];  

                    if(_self.action == 'EDIT'){
                        _self.healthCondVsProcAssoc.datUltAtualiz = Date.now();                        
                    }                      

                    console.log('result', result);
                });


        }; 

        // cancela edição - volta para a lista
        this.onCancel = function () {  
            appViewService.removeView({active: true,
                                       name  : 'Inclusão Associativa Condição Saúde x Procedimento',
                                       url   : _self.currentUrl}); 
        };

        this.onSaveNew = function () {  

            var disclaimers = [{property: 'cdCondicaoSaude', value: _self.healthCondVsProcAssoc.cdCondicaoSaude},
                               {property: 'cdProcedimento', value: _self.healthCondVsProcAssoc.cdProcedimento}];

            healthCondVsProcAssocFactory.getHealthCondVsProcAssocByFilter('', 0, 0, false, disclaimers,
                function(result){

                    if(result.length != 0){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: 'Registro já cadastrado com este código!'
                        }); 
                        return;
                    }    

                    healthCondVsProcAssocFactory.saveHealthCondVsProcAssoc(_self.healthCondVsProcAssoc,
                        function (result) {
                            if(result.$hasError == true){
                                return;
                            }

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', title: 'Salvo com sucesso'                                 
                            });                                            

                            if(result.$hasError != true){                            
                                _self.healthCondVsProcAssoc.cdCondicaoSaude = "";
                                _self.healthCondVsProcAssoc.cdProcedimento = "";                                
                                _self.healthCondVsProcAssoc.dtLimite = undefined;                     
                                _self.healthCondVsProcAssoc.nrCarenciaCpt = "";                                

                                _self.action = "INSERT";
                                _self.init();  
                            }
                        });                
            });           
        };

        // salva os parametros alterados 
        this.save = function () {  
            
            healthCondVsProcAssocFactory.saveHealthCondVsProcAssoc(_self.healthCondVsProcAssoc,
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
	}
	
	index.register.controller('hvp.healthCondVsProcAssocMaintenance.Control', healthCondVsProcAssocMaintenanceController);	
});