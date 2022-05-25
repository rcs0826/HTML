define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hcg-eSocialDomainType/eSocialDomainTypeFactory.js'     
    ], function(index) {

	eSocialDomainMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hcg.eSocialDomainType.Factory','TOTVSEvent', '$timeout'];
	function eSocialDomainMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, eSocialDomainTypeFactory , TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 


        this.init = function(){
            appViewService.startView("Manutençao do Domínio",
                                     'hcg.eSocialDomainMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            
            _self.cleanModel();  
            _self.currentUrl = $location.$$path; 
            
            _self.domainType = {};
            _self.listOfESocialDomainCount = 0;

            if (!angular.isUndefined($stateParams.idiTipDomin)){
                eSocialDomainTypeFactory.getDomainTypeById($stateParams.idiTipDomin, 
                    function (result) {
                    if (result) {
                        angular.forEach(result, function (value) {
                            _self.domainType = value;
                        });
                    }
                });
            }
            if (!angular.isUndefined($stateParams.cdnDomin)) { 
                eSocialDomainTypeFactory.prepareDataToMaintenanceWindow($stateParams.cdnDomin,             
                     function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.eSocialDomain = value;
                            })
                        }
                    });
            } 
            
                                         
            if($state.current.name === 'dts/hgp/hcg-eSocialDomainType.new'){
                _self.action = 'INSERT';
            }
            else {
                if($state.current.name === 'dts/hgp/hcg-eSocialDomainType.detail'){
                    _self.action = 'DETAIL';    
                }else{
                    _self.action = 'EDIT';
                }
            }
        };

        
        this.cleanModel = function (){
            _self.eSocialDomain = {};   
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

            if (!_self.permiteSalvar()){
                return;
            }

            if (novoRegistro){
                _self.eSocialDomain.idiTipDomin = _self.domainType.idiTipDomin;
            }
            
            eSocialDomainTypeFactory.saveESocialDomain(novoRegistro, _self.eSocialDomain,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Domínio salvo com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    _self.invalidateESocialDomain(result.cdnDomin);
                    if(isSaveNew){
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hcg-eSocialDomainType.new'), 
                                                 {idiTipDomin: result.idiTipDomin});
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        appViewService.removeView({active: true,
                                                   name  : "Manutençao do Domínio",
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }
                    else{
                        $state.go($state.get('dts/hgp/hcg-eSocialDomainType.edit'), 
                                             {idiTipDomin: result.idiTipDomin,
                                              cdnDomin: result.cdnDomin});
                    }
            });
        }

        this.invalidateESocialDomain = function(cdnDomin){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateESocialDomain',
                                    cdnDomin);
        };

        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];

            if (_self.eSocialDomainForm.$invalid){
                permiteSalvarAux = false;
                _self.eSocialDomainForm.$setDirty();              
                angular.forEach(_self.eSocialDomainForm, function(value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')){
                        value.$setDirty(); 
                        value.$setTouched(); 
                    }
                }); 
                
                mensagem.push('Existem campos com valor inválido ou nao informado. Revise as informações.');
            }

            if (!permiteSalvarAux){
                    mensagem.forEach(function(element) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: element
                        });
                    }, this);
                    
                return false;
            }
            return true;
        }

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : "Manutençao do Domínio",
                                           url   : _self.currentUrl}); 
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atençao!',
                text: 'Você deseja cancelar e descartar os dados não salvos?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    appViewService.removeView({active: true,
                                               name  : "Manutençao do Domínio",
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hcg.eSocialDomainMaintenance.Control', eSocialDomainMaintenanceController);	
});


