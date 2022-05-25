define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hvp-paramIncExc/paramIncExcFactory.js',   
        '/dts/hgp/html/hvp-contractingparty/contractingPartyZoomController.js', 
        '/dts/hgp/html/hpr-modality/modalityZoomController.js',     
        '/dts/hgp/html/hpr-plan/planZoomController.js',     
        '/dts/hgp/html/hpr-planType/planTypeZoomController.js',     
        '/dts/hgp/html/hcg-rejectionReason/rejectionReasonZoomController.js',     
    ], function(index) {

	paramIncExcMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hvp.paramIncExc.Factory','TOTVSEvent', '$timeout'];
	function paramIncExcMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, paramIncExcFactory , TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.semaforoChanged = function(){
            _self.loadSemaphore--;

            if(_self.loadSemaphore == 0){
                _self.isSettingData = false;
            }
        };

        this.cleanModel = function (){
            _self.paramIncExc = {};   

            _self.planFixedFilters = {};
            _self.planTypeFixedFilters = {};
            _self.rejectionReasonFixedFilters = {};
            _self.idiParamDatOpcoes = [];        
        }       

        this.init = function(){
            appViewService.startView("Manutençao de Regra de Inclusao e Exclusao",
                                     'hvp.paramIncExcMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
            _self.cleanModel();  
            
            _self.rejectionReasonFixedFilters['inEntidade'] = 'MC';

            _self.currentUrl = $location.$$path; 

            if (!angular.isUndefined($stateParams.cddRegra)) { 

                _self.isSettingData = true;
                _self.loadSemaphore = 4;

                paramIncExcFactory.prepareDataToMaintenanceWindow($stateParams.cddRegra,             
                     function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.paramIncExc = value;
                                _self.idiTipRegraChange();
                                _self.planFixedFilters.cdModalidade = value.cdnModalid;
                                _self.planTypeFixedFilters.cdModalidade = value.cdnModalid;
                                _self.planTypeFixedFilters.cdPlano = value.cdnPlano;

                                _self.paramIncExc.idiTipRegraAnt = _self.paramIncExc.idiTipRegra;
                                _self.paramIncExc.lgTodasModalidades = (_self.paramIncExc.cdnModalid == 0 || angular.isUndefined(_self.paramIncExc.cdnModalid));
                                if (_self.paramIncExc.lgTodasModalidades){
                                    /* Ta certo chamar 2 vezes, deixa assim */
                                    _self.semaforoChanged();
                                    _self.semaforoChanged();
                                }
                                _self.paramIncExc.lgTodosPlanos = (_self.paramIncExc.cdnPlano == 0 || angular.isUndefined(_self.paramIncExc.cdnPlano));
                                if (_self.paramIncExc.lgTodosPlanos){
                                    /* Ta certo chamar 2 vezes, deixa assim */
                                    _self.semaforoChanged();
                                    _self.semaforoChanged();
                                }
                                _self.paramIncExc.lgTodosTiposPlanos = (_self.paramIncExc.cdnTipPlano == 0 || angular.isUndefined(_self.paramIncExc.cdnTipPlano));
                                _self.paramIncExc.lgTodosContratantes = (_self.paramIncExc.numInscrContrnte == 0 || angular.isUndefined(_self.paramIncExc.numInscrContrnte));
                                _self.paramIncExc.lgTodosMotivos = (_self.paramIncExc.cdMotivoCancelamento == 0 || angular.isUndefined(_self.paramIncExc.cdMotivoCancelamento));
                                
                            })
                        }
                    });
            } 
            
                                         
            if($state.current.name === 'dts/hgp/hvp-paramIncExc.new'){
                _self.action = 'INSERT';
                _self.paramIncExc.lgTodasModalidades = true;
                _self.paramIncExc.lgTodosPlanos = true;
                _self.paramIncExc.lgTodosTiposPlanos = true;
                _self.paramIncExc.lgTodosContratantes = true;
                _self.paramIncExc.lgTodosMotivos = true;
                _self.paramIncExc.logTransf = true;
            }
            else {
                if($state.current.name === 'dts/hgp/hvp-paramIncExc.detail'){
                    _self.action = 'DETAIL';    

                    _self.paramIncExc.lgTodasModalidades = (_self.paramIncExc.cdnModalid == 0 || angular.isUndefined(_self.paramIncExc.cdnModalid));
                    _self.paramIncExc.lgTodosPlanos = (_self.paramIncExc.cdnPlano == 0 || angular.isUndefined(_self.paramIncExc.cdnPlano));
                    _self.paramIncExc.lgTodosTiposPlanos = (_self.paramIncExc.cdnTipPlano == 0 || angular.isUndefined(_self.paramIncExc.cdnTipPlano));
                    _self.paramIncExc.lgTodosContratantes = (_self.paramIncExc.numInscrContrnte == 0 || angular.isUndefined(_self.paramIncExc.numInscrContrnte));
                    _self.paramIncExc.lgTodosMotivos = (_self.paramIncExc.cdMotivoCancelamento == 0 || angular.isUndefined(_self.paramIncExc.cdMotivoCancelamento));                                            
                }else{
                    _self.action = 'EDIT';
                }
            }
        };

        this.cleanparamIncExcInputFields = function (){
        }

        this.onModalidChanged = function(){
            if(_self.isSettingData == true){
                _self.semaforoChanged();
                return;
            }

            $timeout(function() {
                _self.planFixedFilters.cdModalidade = _self.paramIncExc.cdnModalid;
                _self.planTypeFixedFilters.cdModalidade = _self.paramIncExc.cdnModalid;
            });

        };

        this.onPlanChanged = function(){
            if(_self.isSettingData == true){
                _self.semaforoChanged();
                return;
            }

            $timeout(function() {
                _self.planTypeFixedFilters.cdPlano = _self.paramIncExc.cdnPlano;
            });

            _self.paramIncExc.cdnTipPlano = 0;
        };
        
        this.lgTodasModalidadesChanged = function(){
            $timeout(function(){
                if (_self.paramIncExc.lgTodasModalidades){
                    _self.paramIncExc.cdnModalid = 0;
                }
            });
        };
        
        this.lgTodosPlanosChanged = function(){
            $timeout(function(){
                if (_self.paramIncExc.lgTodosPlanos){
                    _self.paramIncExc.cdnPlano = 0;
                }
            });
        };
        
        this.lgTodosTiposPlanosChanged = function(){
            $timeout(function(){
                if (_self.paramIncExc.lgTodosTiposPlanos){
                    _self.paramIncExc.cdnTipPlano = 0;
                }
            });
        };
        
        this.lgTodosContratantesChanged = function(){
            $timeout(function(){
                if (_self.paramIncExc.lgTodosContratantes){
                    _self.paramIncExc.numInscrContrnte = 0;
                }
            });
        };
        
        this.lgTodosMotivosChanged = function(){
            $timeout(function(){
                if (_self.paramIncExc.lgTodosMotivos){
                    _self.paramIncExc.cdMotivoCancelamento = 0;
                }
            });
        };

        this.idiTipRegraChange = function(){
            if (_self.paramIncExc.idiTipRegra == 1){
                _self.idiParamDatOpcoes = [{value: 1, label: 'Dia de Corte'},
                                           {value: 2, label: 'Dias úteis para Cálculo'}];
            }
            else{
                _self.idiParamDatOpcoes = [{value: 4, label: 'Dia de Corte'},
                                           {value: 5, label: 'Dia de Corte para Mês anterior'},
                                           {value: 6, label: 'Data da Solicitaçao'},
                                           {value: 7, label: 'Último dia Mês Faturado'}];

            }
        };

        this.cboParamDataChange = function(){
            _self.lgPermExclFat = false;
            _self.lgPermDtSolic = false;
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

            this.invalidateParamIncExc = function(cddRegra){
                //dispara um evento pra lista atualizar o registro
                $rootScope.$broadcast('invalidateParamIncExc',
                                    cddRegra);
            };

            paramIncExcFactory.saveParamIncExc(novoRegistro, _self.paramIncExc,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    var titleAux = 'Regra de ';
                    if (_self.paramIncExc.idiTipRegra == 1){
                        titleAux = titleAux + 'Inclusao';
                    }
                    else{
                        titleAux = titleAux + 'Exclusao';
                    }
                    titleAux = titleAux + ' salva com sucesso';
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: titleAux
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.cleanparamIncExcInputFields();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hvp-paramIncExc.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateParamIncExc(result.cddRegra);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutençao de Regra de Desconto em Faturas',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }
                    else{
                        $state.go($state.get('dts/hgp/hvp-paramIncExc.edit'), 
                                             {cddRegra: result.cddRegra});
                    }
            });
        }

        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];

            if (_self.incExcForm.$invalid){
                permiteSalvarAux = false;
                _self.incExcForm.$setDirty();              
                angular.forEach(_self.incExcForm, function(value, key) {
                    if (typeof value === 'object' && value.hasOwnProperty('$modelValue')){
                        value.$setDirty(); 
                        value.$setTouched(); 
                    }
                }); 
                
                mensagem.push('Existem campos com valor inválido ou nao informado. Revise as informações.');
            }

            if (_self.action == 'EDIT' && _self.paramIncExc.idiTipRegra != _self.paramIncExc.idiTipRegraAnt){
                permiteSalvarAux = false;
                mensagem.push('Nao e permitida a troca do tipo de regra!');
            }

            if (_self.paramIncExc.cdnPlano != 0 &&
                _self.paramIncExc.cdnModalid == 0){
                permiteSalvarAux = false;
                mensagem.push('Ao informar um plano você deve informar a modalidade!');
            }

            if (_self.paramIncExc.numTermoAdesaoInic != 0 &&
                _self.paramIncExc.numTermoAdesaoFim != 0 &&
                _self.paramIncExc.numTermoAdesaoInic > _self.paramIncExc.numTermoAdesaoFim){
                permiteSalvarAux = false;
                mensagem.push('Número de contrato final menor que número de contrato inicial');
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
                                           name  : 'Manutençao de Regra de Desconto em Faturas',
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
                                               name  : 'Manutençao de Regra de Desconto em Faturas',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hvp.paramIncExcMaintenance.Control', paramIncExcMaintenanceController);	
});


