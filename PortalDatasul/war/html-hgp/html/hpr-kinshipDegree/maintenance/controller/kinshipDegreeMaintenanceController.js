define(['index',        
        '/dts/hgp/html/js/util/DateTools.js',       
        '/dts/hgp/html/hpr-kinshipDegree/kinshipDegreeFactory.js',
        '/dts/hgp/html/hcg-eSocialDomainType/eSocialDomainTypeFactory.js',        
    ], function(index) {

	kinshipDegreeMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 
                                                  'totvs.app-main-view.Service', '$location', 'hpr.kinshipDegree.Factory', 
                                                  'hcg.eSocialDomainType.Factory','TOTVSEvent'];
	function kinshipDegreeMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, 
                                                kinshipDegreeFactory, eSocialDomainTypeFactory, TOTVSEvent) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";

        this.cleanModel = function (){
            _self.kinshipDegree = {};
            _self.listTipoDependencia = [];           
            _self.listNivelDependencia = [];
            _self.listTipoDepEsocial = [];
        }       

        this.init = function(){
            
            appViewService.startView("Manutenção Graus de Parentesco",
                                     'hpr.kinshipDegreeMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();              
            _self.getDadosCombo();            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.cdGrauParentesco)) {                                

                kinshipDegreeFactory.prepareDataToMaintenanceWindow($stateParams.cdGrauParentesco,             
                    function (result) {                             
                        if (result) {                             
                             _self.kinshipDegree = result[0];                             
                        }
                    });
            }

            if($state.current.name === 'dts/hgp/hpr-kinshipDegree.new'){
                _self.action = 'INSERT'; 
                _self.kinshipDegree.inTipoDependencia = 1;
                _self.kinshipDegree.inNivelDependencia = 0;
                _self.kinshipDegree.inTipoDepEsocial = 0;
            }else if($state.current.name === 'dts/hgp/hpr-kinshipDegree.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            }
        };

        this.getDadosCombo = function(){
            _self.getTiposDependencia();
            _self.getNiveisDependencia();
            _self.getTiposDepEsocial();
        }

        this.getTiposDependencia = function(){
            kinshipDegreeFactory.getTiposDependencia(
                function (result) {
                    if (result) {
                        angular.forEach(result, function (value) {
                            _self.listTipoDependencia.push({
                                value: value.cdTipoDependencia,
                                label: value.cdTipoDependencia + " - " + value.dsTipoDependencia
                            });  
                        })
                    }
                });
        };

        this.getNiveisDependencia = function(){
            kinshipDegreeFactory.getNiveisDependencia(
                function (result) {
                    if (result) {
                        angular.forEach(result, function (value) {
                            _self.listNivelDependencia.push({
                                value: value.cdNivelDependencia,
                                label: value.cdNivelDependencia + " - " + value.dsNivelDependencia
                            });  
                        })
                    }
                });
        };

        this.getTiposDepEsocial = function(){

            _self.listTipoDepEsocial.push({value: 0, label: "Não Informado"});

            eSocialDomainTypeFactory.getDomainByFilter(
                7, "", 0, 0, 0, [],
                function (result) {
                    if (result) {
                        angular.forEach(result, function (value) {
                            _self.listTipoDepEsocial.push({
                                value: value.cdnDomin,
                                label: value.desDomin
                            });  
                        })
                    }
                });
        };        

        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {

            if (!_self.checkFields()){
                return;
            }

            var saveCallback = function (result) {                

                if(result.$hasError == true){
                    return;
                }
                
                result = result[0];
                
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success', title: 'Grau de Parentesco salvo com sucesso'
                });

                //dispara um evento pra lista atualizar o registro
                $rootScope.$broadcast('invalidateKinshipDegree', result.cdGrauParentesco);

                //Salva e limpa o model para um nova inclusao
                if(isSaveNew){
                    _self.cleanModel();                    
                    if(_self.action != 'INSERT'){                            
                        $state.go($state.get('dts/hgp/hpr-kinshipDegree.new')); 
                    }
                //Salva e fecha a tela
                }else if(isSaveClose){
                    appViewService.removeView({active: true,
                                               name  : 'Manutenção Graus de Parentesco',
                                               url   : _self.currentUrl});  
                //Salva e redireciona para o edit do item incluido
                }else{                    
                    $state.go($state.get('dts/hgp/hpr-kinshipDegree.edit'), 
                                         {cdGrauParentesco: result.cdGrauParentesco});
                }
            }


            if (_self.action == 'INSERT'){
                kinshipDegreeFactory.createKinshipDegree(_self.kinshipDegree, saveCallback);                                
            }else{
                kinshipDegreeFactory.editKinshipDegree(_self.kinshipDegree, saveCallback);
            }               
        }        


        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção Graus de Parentesco',
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
                                               name  : 'Manutenção Graus de Parentesco',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        this.checkFields = function(){        
            var camposOk = true;
            var mensagem = [];
    
            if (_self.editForm.$invalid){
                camposOk = false;
                _self.editForm.$setDirty();              
                angular.forEach(_self.editForm, function(value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')){
                        value.$setDirty();                    
                    }
                });             
                mensagem.push('Existem campos com valor inválido ou nao informado. Revise as informações.');
            }
            
            if (!camposOk){
                    mensagem.forEach(function(element) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', title: element
                        });
                    }, this);            
            }
            return camposOk;
        }

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hpr.kinshipDegreeMaintenance.Control', kinshipDegreeMaintenanceController);	
});


