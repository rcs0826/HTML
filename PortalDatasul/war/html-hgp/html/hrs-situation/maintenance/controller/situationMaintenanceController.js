define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-situation/situationFactory.js',        
    ], function(index) {

	situationMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrs.situation.Factory','TOTVSEvent'];
	function situationMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, situationFactory , TOTVSEvent) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 
        _self.situation = {};  
        _self.lgPadraoAux = false;
        
        this.cleanModel = function (){
            _self.situation = {};           
        }       

        this.init = function(){
            appViewService.startView("Manutenção de Situação da Impugnação",
                                     'hrs.situationMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
			
            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
                             
            if($state.current.name === 'dts/hgp/hrs-situation.new'){
                _self.action = 'INSERT';
                return;
            }else if($state.current.name === 'dts/hgp/hrs-situation.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            }
                
            if (!angular.isUndefined($stateParams.idSituacao)) { 
                situationFactory.prepareDataToMaintenanceWindow($stateParams.idSituacao,             
                    function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.situation = value;
                                _self.lgPadraoAux = _self.situation.lgPadrao;
                            });
                        }
                    });
            } 
        };

        this.cleansituationInputFields = function (){
        }

        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {
            if (_self.situationForm.$invalid){
                _self.situationForm.$setDirty();              
                angular.forEach(_self.situationForm, function(value, key) {
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

            situationFactory.saveSituation(_self.situation,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Situação salva com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.cleansituationInputFields();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hrs-situation.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateSituation(result);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção de Situação da Impugnação',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hrs-situation.edit'), 
                                             {idSituacao: result.idSituacao});
                    }

                    _self.resetPage();
            });
        };

        this.invalidateSituation = function(situation){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateSituation',
                                  {idSituacao: situation.idSituacao});
        };

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção de Situação da Impugnação',
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
                                               name  : 'Manutenção de Situação da Impugnação',
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
            || _self.situationForm == undefined)
                return;
                
            _self.situationForm.$setPristine();
            _self.situationForm.$setUntouched();
        }  
	}
	
	index.register.controller('hrs.situationMaintenance.Control', situationMaintenanceController);	
});


