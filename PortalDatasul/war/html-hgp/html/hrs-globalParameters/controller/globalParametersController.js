define(['index',
        '/dts/hgp/html/hrc-transaction/transactionZoomController.js',
        '/dts/hgp/html/hrs-globalParameters/globalParametersFactory.js',
        '/dts/hgp/html/js/util/HibernateTools.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/global-userConfigs/userConfigsFactory.js',
        '/dts/hgp/html/util/genericConfigController.js',
        '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js',
        '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
        '/dts/hgp/html/global-provider/providerZoomController.js',    
        '/dts/hgp/html/global-financialDocumentKind/financialDocumentKindZoomController.js',    
        '/dts/hgp/html/hvp-beneficiary/beneficiaryFactory.js',
        '/dts/hgp/html/global-provider/providerFactory.js',
        '/dts/hgp/html/global-financialDocumentKind/financialDocumentKindFactory.js',
        '/dts/hgp/html/hrc-movement/movementZoomController.js',
        '/dts/hgp/html/js/libs/bootstrap-typeahead.js',
        '/dts/hgp/html/js/libs/mention.js',
        '/dts/hgp/html/enumeration/hashVariableEnumeration.js',
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER - 
    // *************************************************************************************

    globalParametersController.$inject = ['$rootScope', '$scope', '$state', '$stateParams','totvs.app-main-view.Service',
                                          'hrs.globalParameters.Factory','global.userConfigs.Factory',
                                          'hvp.beneficiary.Factory', 'global.provider.Factory', 'global.financialDocumentKind.Factory',
                                          'totvs.app-main-view.Service','$location', '$modal',
                                          'AbstractAdvancedFilterController', 'dts-utils.utils.Service', 'TOTVSEvent'];
    function globalParametersController($rootScope, $scope, $state, $stateParams, appViewService,
                                        globalParametersFactory, userConfigsFactory, 
                                        beneficiaryFactory, providerFactory, financialDocumentKindFactory,
                                        totvsUtilsService, $location, $modal,
                                        AbstractAdvancedFilterController, dtsUtils, TOTVSEvent) { 
 
        var _self = this;

        _self.cdProgramaCorrente = 'hrs.globalParameters';
        _self.config = [];
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.disclaimers = [];

        $scope.HASH_VARIABLE_ENUM = HASH_VARIABLE_ENUM;
        
        this.onEdit = function(){                                    
            $state.go($state.get('dts/hgp/hrs-globalParameters.edit'));
        }

        /* cancela edição - volta para o detail */
        this.onCancel = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você deseja cancelar e descartar os dados não salvos?',
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    $state.go($state.get('dts/hgp/hrs-globalParameters.start'));                   
                }
            }); 
        };
        
        this.init = function(){
            appViewService.startView("Parâmetros do Ressarcimento ao SUS", 'hrs.globalParameters.Control', _self);


            if($state.current.name === 'dts/hgp/hrs-globalParameters.start'){
                _self.action = 'DETAIL';
            }else if($state.current.name === 'dts/hgp/hrs-globalParameters.edit'){
                _self.action = 'EDIT';
            }
            
            if(appViewService.lastAction != 'newtab' 
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();
         
            _self.currentUrl = $location.$$path;
            
            _self.movementFixedFilters = {property: HibernateTools.SEARCH_OPTION_CONSTANT, value: 'PROCEDIMENTOS'}; 

            globalParametersFactory.prepareDataToMaintenanceWindow(function(result){
                if (result) {
                    angular.forEach(result, function (value) {
                        _self.globalParameters = value;
                        _self.movementReturnObject = {formattedCodeWithType: value.cdMovimentoGenerico};
                    });                   
                }
                _self.createMention();
            });

        };

        this.onMovementSelect = function()
        {
            if (angular.isUndefined(_self.movementReturnObject)){
                _self.globalParameters.cdMovimentoGenerico = null;
            }
            else{
                _self.globalParameters.cdMovimentoGenerico = _self.movementReturnObject.formattedCodeWithType;
            }
        }

        this.cleanModel = function () {
            _self.globalParameters = {};
            _self.provider = {};
            _self.beneficiary = {};

            _self.beneficiaryFixedFilters = _self.createObject(HibernateTools.SEARCH_OPTION_CONSTANT, 'withCard');    
        };
        
        this.save = function () {
            if (_self.globalParametersForm.$invalid){
                _self.globalParametersForm.$setDirty();
                angular.forEach(_self.globalParametersForm, function(value, key) {
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

            globalParametersFactory.saveGlobalParameters(_self.globalParameters,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Parâmetros atualizados com sucesso.'
                    });

                    appViewService.removeView({active: true,
                                                name  : 'Parâmetros atualizados com sucesso.',
                                                url   : _self.currentUrl});  
                    $state.go($state.get('dts/hgp/hrs-globalParameters.start'))
            });        
        }
        
        this.onBeneficiarySelect = function(){
            if(!_self.globalParameters.cdUnidCdCarteiraUsuarioGenerico){
                _self.globalParameters.cdModalidade = 0;
                _self.globalParameters.nrTerAdesao  = 0;
                _self.globalParameters.cdUsuario    = 0;
                return;
            }                        

            beneficiaryFactory.getBenefByCard(_self.globalParameters.cdUnidCdCarteiraUsuarioGenerico,
                [],
                function (benef) {
                    _self.globalParameters.cdModalidade = benef.cdModalidade;
                    _self.globalParameters.nrTerAdesao  = benef.nrTerAdesao;
                    _self.globalParameters.cdUsuario    = benef.cdUsuario;
                });
        }; 

        this.onProviderSelect = function(){   
            if(!_self.globalParameters.cdUnidCdPrestadorSus){                
                _self.globalParameters.cdUnidadePrestador = 0;
                _self.globalParameters.cdPrestador        = 0;
                return;
            }

            _self.globalParameters.cdUnidadePrestador = _self.globalParameters.cdUnidCdPrestadorSus.substring(0, 4);
            _self.globalParameters.cdPrestador        = _self.globalParameters.cdUnidCdPrestadorSus.substring(4);

            providerFactory.getImportParamProvider(_self.globalParameters.cdUnidadePrestador, _self.globalParameters.cdPrestador,
                function (result) {
                    if (!result.tmpPipresta) {
                        return;
                    }

                    var paramProvider = result.tmpPipresta[0];

                    if (paramProvider.lgBeneficiarioPadrao == true){
                        _self.globalParameters.cdModalidade = paramProvider.cdModalidade;
                        _self.globalParameters.nrTerAdesao  = paramProvider.nrTerAdesao;
                        _self.globalParameters.cdUsuario    = paramProvider.cdUsuario;

						
                        var disclaimers = [{property: 'cdModalidade',  value: _self.globalParameters.cdModalidade},
                                           {property: 'nrTerAdesao',   value: _self.globalParameters.nrTerAdesao},
                                           {property: 'cdUsuario',     value: _self.globalParameters.cdUsuario },
                                           {property: 'SEARCH_OPTION', value: 'withCard'}];

                        /* Busca usuario cadastrado nos parametros de importacao do prestador*/
                        beneficiaryFactory.getBenefsByFilter("", 0, 1, false, disclaimers, function(benef) {
                            if (!(benef.length > 0)) {
                                return;
                            }

                            _self.globalParameters.cdUnidCdCarteiraUsuarioGenerico = benef[0].cdUnidCdCarteiraInteira;
                        });
                    }
                });            
        };

        this.openVariableFields = function (campo) {
            $('#' + campo).popover('show');
        }; 
                              
        this.createMention = function () {
            /* Se tirar o mouse do popover, fecha ele */
            $('body').on('mouseover', function (e) {
                if ($(e.target).data('toggle') !== 'popover'
                &&  $(e.target).parents('.popover.in').length === 0) {
                    $('[data-toggle="popover"]').popover('hide');
                }
            });

            /* Abrir componente de hashtags nos textarea */
            $(".mentions input").mention({
                delimiter: '#',
                emptyQuery: true,
                sensitive: false,
                users: HASH_VARIABLE_ENUM.ENUMERATION_VALUES
            });
        }

        this.createObject = function(property, value){
            var obj = {};
            obj[property] = value;

            return obj;
        };

        if ($rootScope.currentuserLoaded) {
            this.init();
        } else {
            $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
                _self.init();
            });
        }
		
    }

    index.register.controller('hrs.globalParameters.Control', globalParametersController);
});


