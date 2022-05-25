define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hcg-hrs-adjustmentPercentage/adjustmentPercentageFactory.js',        
    ], function(index) {

	adjustmentPercentageMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrs.adjustmentPercentage.Factory','TOTVSEvent'];
	function adjustmentPercentageMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, adjustmentPercentageFactory , TOTVSEvent) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 
        _self.adjustmentPercentage = {};  
        _self.formAdjustment = {};

        this.cleanModel = function (){
            _self.adjustmentPercentage = {};           
        }       

        this.init = function(){
            appViewService.startView("Manutenção de Percentual de Reajuste",
                                     'hrs.adjustmentPercentageMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
			
            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.numAno)
            &&  !angular.isUndefined($stateParams.numMes)) { 
                /*
                OBS: este cadastro não possui edit. 
                Por segurança foi removido o acesso ao edit e deixado apenas ao new
                */
                $state.go($state.get('healthcare/hrs/adjustmentPercentage.new')); 

                /*
                if($state.current.name === 'healthcare/hrs/adjustmentPercentage.detail'){
                    _self.action = 'DETAIL';
                }else{
                    _self.action = 'EDIT';
                }

                var disclaimersAux = [];
                    disclaimersAux.push({property: 'numAno', value: $stateParams.numAno, priority:1});
                    disclaimersAux.push({property: 'numMes', value: $stateParams.numMes, priority:2});

                adjustmentPercentageFactory.getAdjustmentPercentageByFilter('', 0, 1, false, disclaimersAux,
                        function (result) {
    
                        if (result) {
                            _self.adjustmentPercentage = result[0];
                        }
                    });
                */
            }
            else
            {
                _self.action = 'INSERT';                                                
            }

        };

        this.cleanAdjustmentPercentageInputFields = function (){
        }

        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {
            if (_self.adjustmentPercentageForm.$invalid){
                _self.adjustmentPercentageForm.$setDirty();              
                angular.forEach(_self.adjustmentPercentageForm, function(value, key) {
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

            adjustmentPercentageFactory.saveAdjustmentPercentage(_self.adjustmentPercentage,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Percentual de Reajuste salvo com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.cleanAdjustmentPercentageInputFields();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('healthcare/hrs/adjustmentPercentage.new')); 
                        }
                    //Salva e fecha a tela
                    }else {
                        appViewService.removeView({active: true,
                                                   name  : 'Percentual de Reajuste',
                                                   url   : _self.currentUrl});  

                        $state.go($state.get('healthcare/hrs/adjustmentPercentage.start')); 
                        
                    }
            });
        };

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Percentual de Reajuste',
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
                                               name  : 'Percentual de Reajuste',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrs.adjustmentPercentageMaintenance.Control', adjustmentPercentageMaintenanceController);	
});


