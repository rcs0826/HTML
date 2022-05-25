define(['index', 
        '/dts/hgp/html/hcg-unit/unitZoomController.js',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/associativaUnidadeAreaAcaoFactory.js',   
        '/dts/hgp/html/hcg-city/cityZoomController.js',
        '/dts/hgp/html/hcg-unit/unitZoomController.js'
    ], function(index) {

    associativaUnidadeAreaAcaoMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hcg.associativaUnidadeAreaAcao.Factory','TOTVSEvent', '$timeout'];
	function associativaUnidadeAreaAcaoMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, associativaUnidadeAreaAcaoFactory , TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.cleanModel = function (){
            _self.associativaUnidadeAreaAcao = {};
			
			_self.associativaUnidadeAreaAcaoForm.$setPristine();
			_self.associativaUnidadeAreaAcaoForm.$setValidity();
			_self.associativaUnidadeAreaAcaoForm.$setUntouched();			

        }

        this.init = function(){
            appViewService.startView("Associativa Unidade x Área de Ação",
            'hcg.associativaUnidadeAreaAcaoMaintenance.Control', 
            _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.cdnUnid)
            &&  !angular.isUndefined($stateParams.cdnCidade)) { 
                associativaUnidadeAreaAcaoFactory.prepareDataToMaintenanceWindow($stateParams.cdnUnid, 
                    $stateParams.cdnCidade,
                     function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.associativaUnidadeAreaAcao = value;                                
                            })
                        }
                    });
            } 
                               
            if($state.current.name === 'dts/hgp/hcg-associativaUnidadeAreaAcao.new'){
                _self.action = 'INSERT';
            }
            else {
                if($state.current.name === 'dts/hgp/hcg-associativaUnidadeAreaAcao.detail'){
                    _self.action = 'DETAIL';    
                }
            }
        };
        
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

            this.invalidateassociativaUnidadeAreaAcao = function(cdnUnid, cdnCidade){
                //dispara um evento para a lista atualizar o registro
                $rootScope.$broadcast('invalidateAssociativaUnidadeAreaAcao',
                cdnUnid, cdnCidade);
            };

            associativaUnidadeAreaAcaoFactory.saveAssociativaUnidadeAreaAcao(novoRegistro, _self.associativaUnidadeAreaAcao,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    var titleAux = 'Associativa Unidade x Área de Ação salvo com sucesso';
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: titleAux
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        if(_self.action != 'INSERT'){                           
                            $state.go($state.get('dts/hgp/hcg-associativaUnidadeAreaAcao.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateassociativaUnidadeAreaAcao(result.cdnUnid, result.cdnCidade);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção Associativa Unidade x Área de Ação',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }
                    else{
                        $state.go($state.get('dts/hgp/hcg-associativaUnidadeAreaAcao.edit'), 
                                             {  cdnUnid: result.cdnUnid,
                                                cdnCidade: result.cdnCidade});
                    }
            });
        };

        this.onCitySelect = function(){
            associativaUnidadeAreaAcaoFactory.getInfoCity(_self.associativaUnidadeAreaAcao.cdnCidade,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    if(result.estado != undefined){
                        _self.associativaUnidadeAreaAcao.estado = result.estado;   
                    }

                    if(result.ibge != undefined){
                        _self.associativaUnidadeAreaAcao.ibge = result.ibge;   
                    }
                });

        };

        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];

            if (_self.associativaUnidadeAreaAcaoForm.$invalid){
                permiteSalvarAux = false;
                _self.associativaUnidadeAreaAcaoForm.$setDirty();              
                angular.forEach(_self.associativaUnidadeAreaAcaoForm, function(value, key) {
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
                                           name  : 'Manutenção Associativa Unidade x Área de Ação',
                                           url   : _self.currentUrl}); 
                return;
            }

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atençao!',
                text: 'Você deseja cancelar e descartar os dados nao salvos?',
                cancelLabel: 'Nao',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    appViewService.removeView({active: true,
                                               name  : 'Manutenção Associativa Unidade x Área de Ação',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hcg.associativaUnidadeAreaAcaoMaintenance.Control', associativaUnidadeAreaAcaoMaintenanceController);	
});


