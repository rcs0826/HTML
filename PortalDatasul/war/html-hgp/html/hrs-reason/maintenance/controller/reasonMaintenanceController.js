define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-reason/reasonFactory.js',        
        '/dts/hgp/html/hrs-nature/natureFactory.js',        
        '/dts/hgp/html/hrc-restrictionClass/restrictionClassZoomController.js',
    ], function(index) {

    reasonMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrs.reason.Factory','hrs.nature.Factory','TOTVSEvent', '$timeout'];
    function reasonMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, reasonFactory, natureFactory , TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.cleanModel = function (){
            _self.reason = {};           
        }       

        this.init = function(){
            appViewService.startView("Manutenção de Motivos de Impugnação",
                                     'hrs.reasonMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
			
            _self.cleanModel();     
            
            _self.currentUrl = $location.$$path; 
            
                            
            natureFactory.getNatureByFilter('', 0, 20, true, [], function (result) {
                if (result) {
                    _self.natures = result;
                    for(var i = 0; i < _self.natures.length; i++){
                        var nature = _self.natures[i];
                        nature.value = nature.idNatureza;
                        nature.label = nature.dsNatureza;
                    }
                }
            });
            
            if (!angular.isUndefined($stateParams.idMotivo) 
             && !angular.isUndefined($stateParams.idNatureza)) {

                reasonFactory.prepareDataToMaintenanceWindow($stateParams.idMotivo, $stateParams.idNatureza,
                    function (result) {
                        if (result) {
                            _self.reason = result.tmpAbiMotivo[0];
                            _self.reason.restriction = result.tmpMotivoClasseErro;
                        }
                    });
            }

            if($state.current.name === 'dts/hgp/hrs-reason.new'){
                _self.action = 'INSERT';                                                
            }else if($state.current.name === 'dts/hgp/hrs-reason.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
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

            if (_self.reasonForm.$invalid){
                _self.reasonForm.$setDirty();              
                angular.forEach(_self.reasonForm, function(value, key) {
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

            /* caso o idMotivo seja alterado depois da inclusão das classes de erro */
            angular.forEach(_self.reason.restriction, function(restriction){
                restriction.cdnMotivo = _self.reason.idMotivo;
            });

            reasonFactory.saveReason(novoRegistro, _self.reason, _self.reason.restriction, 
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Motivos de Impugnação salva com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hrs-reason.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateReason(result);
                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção Motivos de Impugnação',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hrs-reason.edit'), 
                                             {idNatureza: result.idNatureza, idMotivo: result.idMotivo});
                    }

                    _self.resetPage();
            });
        };

        this.invalidateReason = function(result){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateReason',
                                  {idNatureza: result.idNatureza, idMotivo: result.idMotivo});
        };

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção Motivos de Impugnação',
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
                                               name  : 'Manutenção Motivos de Impugnação',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        this.addRestrictionClass = function () {
            var jaExisteClasseErro = false;
            if (!angular.isUndefined(_self.restrictionClassReturnObject) 
                && _self.restrictionClassReturnObject.cdClasseErro !== "0"){
                if(angular.isUndefined(_self.reason.restriction)){
                    _self.reason.restriction = [];
                }
                else {
                    angular.forEach(_self.reason.restriction, function(value){
                        if (value.cdnClasseErro == _self.restrictionClassReturnObject.cdClasseErro){
                            jaExisteClasseErro = true;
                        }
                    });
                }
                if (!jaExisteClasseErro)
                {
                    var tmpRestrictionAux = {cdnClasseErro: _self.restrictionClassReturnObject.cdClasseErro,
                                             cdnMotivo:     _self.reason.idMotivo,
                                             cdnNatureza:   _self.reason.idNatureza,
                                             dsClasseErro:  _self.restrictionClassReturnObject.dsClasseErro,
                                             lgGlosaManual: _self.restrictionClassReturnObject.lgGlosaManual};
                    _self.reason.restriction.unshift(angular.copy(tmpRestrictionAux)); 

                    _self.restriction = {};
                    _self.restrictionClassReturnObject = undefined;
                }
                else {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', title: 'Classe de erro já foi adicionada.'
                    });                    
                    return false;
                }
            }
            return true;
        };
        
        this.removeRestrictionClass = function (restriction, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você realmente deseja remover a classe de erro? <br><br>' 
                      + 'Classe: '+ restriction.cdnClasseErro  + ' | Descrição: ' + restriction.dsClasseErro,
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    _self.reason.restriction.splice(index, 1);
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
            || _self.reasonForm == undefined)
                return;
                
            _self.reasonForm.$setPristine();
            _self.reasonForm.$setUntouched();
        }
	}
	
	index.register.controller('hrs.reasonMaintenance.Control', reasonMaintenanceController);	
});


