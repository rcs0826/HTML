define(['index', 
        '/dts/hgp/html/hrc-pooler/poolerFactory.js',
        '/dts/hgp/html/js/util/HibernateTools.js',        
    ], function(index) {

	poolerMaintenanceController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 
                                            'totvs.app-main-view.Service', 'hrc.pooler.Factory', '$location'];
	function poolerMaintenanceController($rootScope, $scope, $state, $stateParams, appViewService, poolerFactory, $location) {

		var _self = this;

        this.action = "INSERT"; 
        _self.pooler = {};

        this.init = function(){            
            appViewService.startView("Agrupadores Regras Coparticipação", 'hrc.poolerMaintenance.Control', _self);

            _self.action = "INSERT";
            _self.pooler.codUsuarUltAtualiz = $rootScope.currentuser.login       

            if(appViewService.lastAction != 'newtab' 
            && _self.currentUrl == $location.$$path){
                return;
            }            

            _self.currentUrl = $location.$$path; 
            _self.pooler.datUltAtualiz = Date.now();

            if (angular.isUndefined($stateParams.cdnAgrupRegraFaturam)){
                return;
            }    

            if($state.current.name === 'dts/hgp/hrc-pooler.detail'){
                _self.action = "DETAIL";                                                
            }else{
                _self.action = "EDIT";
            }     

            var disclaimers = [{property: 'cdnAgrupRegraFaturam', value: $stateParams.cdnAgrupRegraFaturam}];

            poolerFactory.getPoolerByFilter('', 0, 0, false, disclaimers,
                function(result){
                    _self.pooler = result[0];  

                    if(_self.action == 'EDIT' || _self.action == 'INSERT'){
                        _self.pooler.datUltAtualiz = Date.now();                        
                    }                      
                });
        };

        // cancela edição - volta para a lista
        this.onCancel = function () {  
            appViewService.removeView({active: true,
                                       name  : 'Inclusão Agrupadores Regras Coparticipação',
                                       url   : _self.currentUrl}); 
        };


        this.onSaveNew = function () {              
            _self.save(true);
        };


        // salva os parametros alterados 
        this.save = function (isSaveNew) {

            poolerFactory.getPoolerByFilter(_self.pooler.cdnAgrupRegraFaturam, 0, 0, false,[],
                function(result){

                    if(_self.action === "INSERT") {
                        if(result.length != 0){
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'error', title: 'Registro já cadastrado com este código!'
                            }); 
                            return;
                        }    
                    }

                    poolerFactory.savePooler(_self.pooler,
                        function (result) {
                            if(result.$hasError == true){
                                return;
                            }

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', title: 'Salvo com sucesso'
                            }); 

                            if(isSaveNew) {
                                _self.pooler.cdnAgrupRegraFaturam = "";
                                _self.pooler.desAgrupRegraFaturam = "";
                                _self.pooler.datInicVigenc = undefined;
                                _self.pooler.datFimVigenc = undefined;

                                _self.action = "INSERT";
                                _self.init();
                            } else {
                                appViewService.removeView({active: true,
                                                           name  : 'Inclusão Agrupadores Regras Coparticipação',
                                                           url   : _self.currentUrl});                                  
                            }
                        });  
            });             
        }; 

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrc.poolerMaintenance.Control', poolerMaintenanceController);	
});
