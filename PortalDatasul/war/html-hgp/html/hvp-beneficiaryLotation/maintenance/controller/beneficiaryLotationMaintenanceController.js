define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/global/hvpGlobalFactory.js',        
        '/dts/hgp/html/hvp-beneficiaryLotation/beneficiaryLotationFactory.js',        
        '/dts/hgp/html/hvp-contractingparty/contractingPartyZoomController.js',
        '/dts/hgp/html/hvp-proposal/proposalIdentifCodeZoomController.js',
        '/dts/hgp/html/js/util/HibernateTools.js',        
        '/dts/hgp/html/hvp-beneficiaryLotation/maintenance/controller/factoryLotationMaintenanceModalController.js',
    ], function(index) {

	beneficiaryLotationMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 
                                                         'totvs.utils.Service', 'totvs.app-main-view.Service',
                                                         '$location','hvp.global.Factory','hvp.beneficiaryLotation.Factory',
                                                         '$modal', 'TOTVSEvent'];
	function beneficiaryLotationMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, 
                                                       $location, hvpGlobalFactory, beneficiaryLotationFactory , 
                                                       $modal, TOTVSEvent) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.init = function(){
            appViewService.startView("Manutenção Lotação do Beneficiário",
                                     'hvp.beneficiaryLotationMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            if($state.current.name === 'dts/hgp/hvp-beneficiaryLotation.new'){
                _self.action = 'INSERT';                                                
            }else if($state.current.name === 'dts/hgp/hvp-beneficiaryLotation.detail'){
                _self.action = 'DETAIL';                                                                
            }else{
                _self.action = 'EDIT';
            }

            _self.cleanModel();              
            _self.currentUrl = $location.$$path; 
            
            if ($stateParams.cdnLotac) {

                var disclaimersAux = [];
                    disclaimersAux.push({property: 'cdnLotac', value: $stateParams.cdnLotac, priority:1});

                beneficiaryLotationFactory.getBeneficiaryLotationByFilter('', 0, 0, false, disclaimersAux,
                    function(result){
                        /* dados da lotação */
                        _self.beneficiaryLotation = result[0];                          
                    });
            }
        };

        this.cleanModel = function (){
            _self.beneficiaryLotation = { logDemitApos : false}; 
        };

        /* SAVE */
        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {
        
            beneficiaryLotationFactory.saveBeneficiaryLotation(_self.beneficiaryLotation, 
                                                                 _self.action,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    _self.invalidateLotation(_self.beneficiaryLotation);            
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Lotação ' + result.cdnLotac +' modificada com sucesso'
                    });

                    //Salva e limpa o model para um nova inclusao
                    if(isSaveNew){
                        _self.cleanModel();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hvp-beneficiaryLotation.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção Lotação do Beneficiário',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hvp-beneficiaryLotation.edit'), 
                                             {cdnLotac: result.cdnLotac});
                    }
            });
        };
        /**/

        /* CANCEL */
        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção Lotação do Beneficiário',
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
                                               name  : 'Manutenção Lotação do Beneficiário',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };
        /**/        

        this.invalidateLotation = function(lot){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateLotation',
                    {cdnLotac: lot.cdnLotac});
        };

        $scope.$watch('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hvp.beneficiaryLotationMaintenance.Control', beneficiaryLotationMaintenanceController);	
});


