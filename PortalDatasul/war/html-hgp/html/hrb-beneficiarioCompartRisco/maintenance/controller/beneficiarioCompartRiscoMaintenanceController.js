define(['index', 
        '/dts/hgp/html/hcg-unit/unitZoomController.js',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrb-beneficiarioCompartRisco/beneficiarioCompartRiscoFactory.js',   
        '/dts/hgp/html/hvp-beneficiary/beneficiaryFactory.js',
        '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js'   
    ], function(index) {

    beneficiarioCompartRiscoMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hvp.beneficiary.Factory','hrb.beneficiarioCompartRisco.Factory','TOTVSEvent', '$timeout'];
	function beneficiarioCompartRiscoMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, beneficiaryFactory, beneficiarioCompartRiscoFactory , TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        _self.benefFixedFilters = {SEARCH_OPTION : 'withCard'};

        this.cleanModel = function (){
            _self.beneficiarioCompartRisco = {};
            _self.listStatus = [                
                { 'value': 0, 'label': 'Pendente Envio' },
                { 'value': 1, 'label': 'Aguardando Retorno' },
                { 'value': 2, 'label': 'Confirmado' },
                { 'value': 3, 'label': 'Pendente Reenvio' }];            
			_self.beneficiarioReturnObject = null;
			
			_self.beneficiarioCompartRiscoForm.$setPristine();
			_self.beneficiarioCompartRiscoForm.$setValidity();
			_self.beneficiarioCompartRiscoForm.$setUntouched();			

        }

        this.init = function(){
            appViewService.startView("Manutenção de Compartilhamento de Riscos de Beneficiários",
            'hrb.beneficiarioCompartRiscoMaintenance.Control', 
            _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.cdUnidade)
            &&  !angular.isUndefined($stateParams.cdModalidade)
            &&  !angular.isUndefined($stateParams.cdContrato)
            &&  !angular.isUndefined($stateParams.cdBeneficiario)
            &&  !angular.isUndefined($stateParams.dtInicio)) { 
                beneficiarioCompartRiscoFactory.prepareDataToMaintenanceWindow($stateParams.cdUnidade, 
                    $stateParams.cdModalidade, $stateParams.cdContrato, $stateParams.cdBeneficiario, $stateParams.dtInicio,
                     function (result) {
                        if (result) {
                            angular.forEach(result, function (value) {
                                _self.beneficiarioCompartRisco = value;                                  
                                _self.beneficiarioReturnObject = {};
                                _self.beneficiarioReturnObject = {cdUnidCdCarteiraInteira : value.cdUnidCdCarteiraInteira};

                                _self.benefFixedFilters.cdUnidCdCarteiraInteira = value.cdUnidCdCarteiraInteira;
                                
                            })
                        }
                    });
            } 
                               
            if($state.current.name === 'dts/hgp/hrb-beneficiarioCompartRisco.new'){
                _self.action = 'INSERT';
            }
            else {
                if($state.current.name === 'dts/hgp/hrb-beneficiarioCompartRisco.detail'){
                    _self.action = 'DETAIL';    
                }else{
                    _self.action = 'EDIT';
                }
            }
        };

        //Chama ao selecionar zoom de beneficiario
        this.onSelectBeneficiario = function (){
            if(!_self.beneficiarioReturnObject){
                _self.beneficiarioCompartRisco.cdModalidade = 0;
                _self.beneficiarioCompartRisco.cdContrato   = 0;
                return;
            }                        

            beneficiaryFactory.getBenefByCard(_self.beneficiarioReturnObject.cdUnidCdCarteiraInteira,
                [],
                function (benef) {
                    _self.beneficiarioCompartRisco.cdModalidade   = benef.cdModalidade;
                    _self.beneficiarioCompartRisco.cdContrato     = benef.nrTerAdesao;
                    _self.beneficiarioCompartRisco.cdBeneficiario = benef.cdUsuario;
                    _self.beneficiarioCompartRisco.nmBeneficiario = benef.nmUsuario;
                });						
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

            this.invalidatebeneficiarioCompartRisco = function(cdUnidade, cdModalidade, cdContrato, cdBeneficiario, dtInicio){
                //dispara um evento para a lista atualizar o registro
                $rootScope.$broadcast('invalidateBeneficiarioCompartRisco',
                    cdUnidade, cdModalidade, cdContrato, cdBeneficiario, dtInicio);
            };

            beneficiarioCompartRiscoFactory.saveBeneficiarioCompartRisco(novoRegistro, _self.beneficiarioCompartRisco,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    result = result.tmpBeneficiariocompartrisco[0];
                    
                    var titleAux = 'Compartilhamento de riscos salvo com sucesso';
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: titleAux
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        if(_self.action != 'INSERT'){                           
                            $state.go($state.get('dts/hgp/hrb-beneficiarioCompartRisco.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidatebeneficiarioCompartRisco(result.cdUnidade, result.cdModalidade, result.cdContrato, result.cdBeneficiario, result.dtInicio);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção de Compartilhamento de Riscos de Beneficiários',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }
                    else{
                        $state.go($state.get('dts/hgp/hrb-beneficiarioCompartRisco.edit'), 
                                             {  cdUnidade: result.cdUnidade,
                                                cdModalidade: result.cdModalidade,
                                                cdContrato: result.cdContrato,
                                                cdBeneficiario: result.cdBeneficiario,
                                                dtInicio: result.dtInicio});
                    }
            });
        };

        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];

            if (_self.beneficiarioCompartRiscoForm.$invalid){
                permiteSalvarAux = false;
                _self.beneficiarioCompartRiscoForm.$setDirty();              
                angular.forEach(_self.beneficiarioCompartRiscoForm, function(value, key) {
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
                                           name  : 'Manutenção de Compartilhamento de Riscos de Beneficiários',
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
                                               name  : 'Manutenção de Compartilhamento de Riscos de Beneficiários',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrb.beneficiarioCompartRiscoMaintenance.Control', beneficiarioCompartRiscoMaintenanceController);	
});


