define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-adjustmentPercentage/adjustmentPercentageFactory.js',        
    ], function(index) {

        adjustmentPercentageMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrs.adjustmentPercentage.Factory','TOTVSEvent'];
        function adjustmentPercentageMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, adjustmentPercentageFactory , TOTVSEvent) {
    
            var _self = this;
            _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 
            _self.PercHistorImpug = {};  
            _self.formPercHistorImpug = {};
    
            this.cleanModel = function (){
                _self.PercHistorImpug = {}; 
                _self.PercHistorImpug.numMes = new Date().getMonth() + 1;
                _self.PercHistorImpug.numAno = new Date().getFullYear();
                _self.PercHistorImpug.valPerc = "0";
                
            }       
    
            this.init = function(){
                appViewService.startView("Incluir Percentual Histórico de Cobrança",
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
                    Por segurança foi removido o edit e deixado apenas o new
                    */
                    $state.go($state.get('dts/hgp/html/hrs/hrs-adjustmentPercentage.new')); 
    
                   
                }
                else
                if($state.current.name === 'dts/hgp/hrs-adjustmentPercentage.new'){
                    _self.action = 'INSERT'; 
                }else if($state.current.name === 'dts/hgp/hrs-adjustmentPercentage.detail'){
                    _self.action = 'DETAIL';                                                
                }
    
            };
    
            this.cleanPercHistorImpugInputFields = function (){
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
                if (_self.PercHistorImpugForm.$invalid){
                    _self.PercHistorImpugForm.$setDirty();              
                    angular.forEach(_self.PercHistorImpugForm, function(value, key) {
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
             
                adjustmentPercentageFactory.savePercHistorImpug(novoRegistro,_self.PercHistorImpug,
                    function (result) {
                        if(result.$hasError == true){
                            return;
                        }
                        
                        result = result[0];
                        
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Percentual Histórico de Cobrança salvo com sucesso'
                        });
                        
    
                        //Salva e limpa o model para um nova inclusao
                        if(isSaveNew){
                            _self.cleanModel();
                            if(_self.action != 'INSERT'){                            
                                $state.go($state.get('dts/hgp/hrs-adjustmentPercentage.new')); 
                            }
                        //Salva e fecha a tela
                        }else if(isSaveClose){

                            appViewService.removeView({active: true,
                                                       name  : 'Percentual Histórico de Cobrança',
                                                       url   : 'dts/hgp/hrs-adjustmentPercentage.start'});  
                            _self.invalidatePercHistorImpug(result);

                        //Salva e redireciona para o edit do item incluido
                        }else{
                            $state.go($state.get('dts/hgp/hrs-adjustmentPercentage.start')); 
                            
                        }

                        _self.resetPage();
                });
            };
            
            this.invalidatePercHistorImpug = function(result){
                //dispara um evento pra lista atualizar o registro
                $rootScope.$broadcast('invalidatePercHistorImpug',
                                      {numAno: result.numAno, numMes: result.numMes });
                                      
            };
            this.onCancel = function(){                    
                if(_self.action == 'DETAIL'){
                    appViewService.removeView({active: true,
                                               name  : 'Percentual Histórico de Cobrança',
                                               url   : 'dts/hgp/hrs-adjustmentPercentage.start'}); 
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
                                                   name  : 'Percentual Histórico de Cobrança',
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
                || _self.PercHistorImpugForm == undefined)
                    return;
                    
                _self.PercHistorImpugForm.$setPristine();
                _self.PercHistorImpugForm.$setUntouched();
            }  
        }
        
        index.register.controller('hrs.adjustmentPercentageMaintenance.Control', adjustmentPercentageMaintenanceController);	
    });
    
    
    