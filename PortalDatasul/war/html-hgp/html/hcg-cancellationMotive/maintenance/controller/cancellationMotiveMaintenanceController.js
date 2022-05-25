define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hcg-cancellationMotive/cancellationMotiveFactory.js',   
        '/dts/hgp/html/hcg-eSocialDomainType/eSocialDomainTypeFactory.js',
    ], function(index) {

    cancellationMotiveMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hcg.cancellationMotive.Factory','hcg.eSocialDomainType.Factory','TOTVSEvent', '$timeout'];
	function cancellationMotiveMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, cancellationMotiveFactory ,eSocialDomainTypeFactory, TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";

        _self.options = {};
        _self.options.padraoAuditoria = [
            { 'value': 1, 'label': 'Ambos'},
            { 'value': 2, 'label': 'Com anexos'},
            { 'value': 3, 'label': 'Sem anexos'}
        ];

        this.changeObrigAudit = function () {
            if (!_self.cancellationMotive.logObrigAudit) {
                _self.cancellationMotive.inPadraoAuditoria = 1;
            }
        };
        
        this.cleanModel = function (){
            _self.cancellationMotive = {};   
            _self.listModulos = [];
            _self.listESocialMotAfast = [];
            _self.listCancellationMotive = [];
            _self.disclaimers = [];
        }       

        this.init = function(){
            appViewService.startView("Manutençao de Motivos de Cancelamentos Genéricos",
            'hcg.cancellationMotiveMaintenance.Control', 
            _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();  
            _self.getDadosCombo();
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.inEntidade)
            &&  !angular.isUndefined($stateParams.cdMotivo)) { 
                cancellationMotiveFactory.prepareDataToMaintenanceWindow($stateParams.inEntidade, $stateParams.cdMotivo,             
                    function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.cancellationMotive = value;  
                            });
                        }
                    }
                );
            }
                               
            if($state.current.name === 'dts/hgp/hcg-cancellationMotive.new'){
                _self.action = 'INSERT';
            }
            else {
                if($state.current.name === 'dts/hgp/hcg-cancellationMotive.detail'){
                    _self.action = 'DETAIL';    
                }else{
                    _self.action = 'EDIT';
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

            this.invalidateCancellationMotive = function(inEntidade, cdMotivo){
                //dispara um evento pra lista atualizar o registro
                $rootScope.$broadcast('invalidateCancellationMotive',
                                        inEntidade, cdMotivo);
            };

            cancellationMotiveFactory.saveCancellationMotive(novoRegistro, _self.cancellationMotive,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    result = result.tmpMotcange[0];
                    
                    
                    var titleAux = 'Motivo salvo com sucesso';
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: titleAux
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        _self.getDadosCombo();
                        if(_self.action != 'INSERT'){                           
                            $state.go($state.get('dts/hgp/hcg-cancellationMotive.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateCancellationMotive(result.inEntidade, result.cdMotivo);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutençao de Motivos de Cancelamento Genéricos',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }
                    else{
                        $state.go($state.get('dts/hgp/hcg-cancellationMotive.edit'), 
                                             {inEntidade: result.inEntidade,
                                              cdMotivo:   result.cdMotivo});
                    }
            });
        };

        this.getDadosCombo = function(){
            _self.getModulos();
            _self.getESocialMotivoAfastamento();
            _self.getCancellationMotives();
        }

        this.getModulos = function(){
            cancellationMotiveFactory.getModulos(
                function (result) {
                    if (result) {
                        angular.forEach(result, function (value) {
                            _self.listModulos.push({
                                value: value.inEntidade,
                                label: value.inEntidade + " - " + value.dsModulo
                            });  
                        })
                    }
                });
        };
        this.getESocialMotivoAfastamento = function(){
            eSocialDomainTypeFactory.getDomainByFilter(
                18, "", 0, 0, 0, [],
                function (result) {
                    if (result) {
                        _self.listESocialMotAfast.push({
                            value: 0,
                            label: "Não Informado"
                        });
                        angular.forEach(result, function (value) {
                            _self.listESocialMotAfast.push({
                                value: value.cdnDomin,
                                label: value.desDomin
                            });  
                        });
                    }
                });
        };
        this.getCancellationMotives = function(){
            _self.disclaimers.push({property: 'inEntidade',
                                       value: 'MC',
                                       title: 'Entidade: ' + 'MC',
                                    priority: 2});
            cancellationMotiveFactory.getCancellationMotiveByFilter('', 0, 9999, true, _self.disclaimers, function (result) {
                _self.hasDoneSearch = true;
                //Se encontrou resultados, preenche a lista de periodos com os mesmos.
                if (result) {
                    angular.forEach(result, function (value) {
                        _self.listCancellationMotive.push({
                            value: value.cdMotivo,
                            label: value.cdMotivo + " - " + value.dsMotivo
                        });  
                    });
                }
            });
        };


        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];

            if (_self.cancellationMotiveForm.$invalid){
                permiteSalvarAux = false;
                _self.cancellationMotiveForm.$setDirty();              
                angular.forEach(_self.cancellationMotiveForm, function(value, key) {
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
                                           name  : 'Manutençao de Motivos de Canelamento Genéricos',
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
	
	index.register.controller('hcg.cancellationMotiveMaintenance.Control', cancellationMotiveMaintenanceController);	
});


