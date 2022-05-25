define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-nature/natureFactory.js',        
    ], function(index) {

	natureMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrs.nature.Factory','TOTVSEvent'];
	function natureMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, natureFactory , TOTVSEvent) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 
        _self.nature = {};  

        this.cleanModel = function (){
            _self.nature = {};           
        }       

        this.init = function(){
            appViewService.startView("Manutenção Naturezas de Impugnação",
                                     'hrs.natureMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
			
            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path;

            if (!angular.isUndefined($stateParams.idNatureza)) { 
                natureFactory.prepareDataToMaintenanceWindow($stateParams.idNatureza,             
                    function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.nature = value
                            });
                        }
                    });
            } 
                                         
            if($state.current.name === 'dts/hgp/hrs-nature.new'){
                _self.action = 'INSERT';                                                
            }else if($state.current.name === 'dts/hgp/hrs-nature.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            }
        };

        this.cleannatureInputFields = function (){
        }

        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {
            var novoRegistro = false;
            if (_self.action == 'INSERT'){
                novoRegistro = true;
            }

            if (_self.natureForm.$invalid){
                _self.natureForm.$setDirty();              
                angular.forEach(_self.natureForm, function(value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')){
                        value.$setDirty(); 
                        value.$setTouched(); 
                    }
                }); 
                
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', title: 'Existem campos com valor inválido ou não informado.\nRevise as informações.'
                });
                
                return;
            }

            natureFactory.saveNature(novoRegistro, _self.nature,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Natureza de Impugnação salva com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.cleannatureInputFields();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hrs-nature.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateNature(result);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção Naturezas de Impugnação',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hrs-nature.edit'), 
                                             {idNatureza: result.idNatureza});
                    }

                    _self.resetPage();
            });
        };

        this.invalidateNature = function(nature){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateNature',
                                  {idNatureza: nature.idNatureza});
        };

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção Naturezas de Impugnação',
                                           url   : _self.currentUrl}); 
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você deseja cancelar e descartar os dados não salvos?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    appViewService.removeView({active: true,
                                               name  : 'Manutenção Naturezas de Impugnação',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
            _self.resetForm();
        });

        $rootScope.$on('$stateChangeSuccess', function(){
            _self.resetForm(); 
        });

        this.resetPage = function(){
            _self.init();
            _self.resetForm();
        }

        this.resetForm = function (){
            if(_self == undefined
            || _self.natureForm == undefined)
                return;
                
            _self.natureForm.$setPristine();
            _self.natureForm.$setUntouched();
        } 
	}
	
	index.register.controller('hrs.natureMaintenance.Control', natureMaintenanceController);	
});


