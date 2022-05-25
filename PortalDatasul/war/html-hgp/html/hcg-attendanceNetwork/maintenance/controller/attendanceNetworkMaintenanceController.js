define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hcg-attendanceNetwork/attendanceNetworkFactory.js',
        '/dts/hgp/html/global-provider/providerZoomController.js',
        '/dts/hgp/html/util/customFilters.js',
        '/dts/hgp/html/global-provider/providerFactory.js',
        '/dts/hgp/html/hcg-attendanceNetwork/maintenance/controller/providerMaintenanceModalController.js',
        '/dts/hgp/html/hcg-providerGroup/providerGroupZoomController.js',
        '/dts/hgp/html/hcg-unit/unitZoomController.js',
        '/dts/hgp/html/global/hcgGlobalFactory.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/enumeration/providerTypeEnumeration.js',
    ], function(index) {

	attendanceNetworkMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service',
                                                      'totvs.app-main-view.Service','$location','hcg.attendanceNetwork.Factory','TOTVSEvent',
                                                      'global.provider.Factory', '$modal', 'hcg.global.Factory'];
	function attendanceNetworkMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService,
                                                    appViewService, $location, attendanceNetworkFactory , TOTVSEvent, 
                                                    providerFactory, $modal, hcgGlobalFactory) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 
        $scope.StringTools = StringTools;

        $scope.PROVIDER_TYPE_ENUM = PROVIDER_TYPE_ENUM;

        _self.providerTypes = PROVIDER_TYPE_ENUM.ENUMERATION_VALUES;              

        this.init = function(){
            appViewService.startView("Manutenção de Rede de Atendimento",
                                     'hcg.attendanceNetworkMaintenance.Control', 
                                     _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }
			
            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path;

            if($state.current.name === 'dts/hgp/hcg-attendanceNetwork.new'){
                _self.action = 'INSERT';      
                return;
            }

            if($state.current.name === 'dts/hgp/hcg-attendanceNetwork.detail'){
                _self.action = 'DETAIL';                                                
            }else{
                _self.action = 'EDIT';
            } 

            attendanceNetworkFactory.prepDataToAttendNetworkWindow($stateParams.cdnRede,             
                function (result) {
                    if (result) {
                        _self.providersAttendNetPageOffset   = 20; 

                        if(result.tmpRedeAtendimPrestdor != undefined
                        && result.tmpRedeAtendimPrestdor.length < 20){
                            _self.hasLoadedAllProvidersAttendNet = true;   
                        }

                        _self.attendanceNetwork = result.tmpRedeAtendim[0];
                        _self.attendanceNetwork.providers = result.tmpRedeAtendimPrestdor;
                    }
                });
        };

        this.cleanModel = function (){
            _self.unsavedProvidersNumber = 0;
            _self.providersAttendNetPageOffset = 0;
            _self.hasLoadedAllProvidersAttendNet = false;
            _self.provider = {};
            _self.attendanceNetwork = {};
            _self.attendanceNetwork.providers = [];
            _self.removedProvidersAtend = [];
            _self.fixedFiltersProvider = {};
        };

        this.saveNew = function(){
            _self.save(true, false);
        };
        
        this.saveClose = function (){
            _self.save(false, true);
        };

        this.save = function (isSaveNew, isSaveClose) {

            var addedProvidersAtend = [];

            for (var i = 0; i < _self.unsavedProvidersNumber; i++) {
                addedProvidersAtend.push(_self.attendanceNetwork.providers[i]);
            }

            attendanceNetworkFactory.saveAttendanceNetwork(_self.attendanceNetwork, addedProvidersAtend,
                _self.removedProvidersAtend,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    _self.invalidateAttendanceNetwork(_self.attendanceNetwork); 

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Regra de Atendimento salva com sucesso'
                    });

                    
                    //Salva e limpa o model para uma nova inclusao
                    if(isSaveNew){ 
                        _self.cleanModel();    
                        if(_self.action != 'INSERT'){
                            $state.go($state.get('dts/hgp/hcg-attendanceNetwork.new'));
                        }

                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção de Rede de Atendimento',
                                                   url   : _self.currentUrl});
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hcg-attendanceNetwork.edit'), 
                                             {cdnRede: result.cdnRede});
                    }
                });
        };

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção de Rede de Atendimento',
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
                                               name  : 'Manutenção de Rede de Atendimento',
                                               url   : _self.currentUrl}); 
                }
            }); 
        };

        this.onProviderSelect = function(){   
            if(!(_self.provider.cdUnidCdPrestador > 0)){
                return;
            }

            providerFactory.getProviderByKey(_self.provider.cdUnidCdPrestador, [{property: 'SEARCH_OPTION', value: 'descriptions'}],
                function (val) {
                    _self.provider.rotuloPrestador = StringTools.fill(val.cdPrestador, '0', 8)
                                                   + ' - ' + val.nmPrestador;

                    _self.provider.codGrpPrestdor       = val.cdGrupoPrestador;
                    _self.provider.rotuloGrupoPrestador = StringTools.fill(val.cdGrupoPrestador, '0', 8)
                                                        + ' - ' + val.dsGrupoPrestador;
                });            
        };

        this.onUnitSelect = function () {
            if(!(_self.provider.cdUnidadePres > 0)){
                _self.provider.rotuloPrestador = "";
                _self.provider.cdUnidCdPrestador = undefined;
                return;
            }

            _self.fixedFiltersProvider = {};

            hcgGlobalFactory.getUnitByKey(_self.provider.cdUnidadePres, [],
                function (val) {
                    _self.provider.rotuloUnidade = StringTools.fill(val.cdUnimed, '0', 4) + ' - ' + val.nmUnimed;
                });
            _self.fixedFiltersProvider['cdUnidade'] = _self.provider.cdUnidadePres;            
        };

        this.onGroupSelect = function(){   
            if(!(_self.provider.codGrpPrestdor > 0)){
                return;
            }

            hcgGlobalFactory.getProviderGroupByKey(_self.provider.codGrpPrestdor, [],
                function (val) {
                    _self.provider.codGrpPrestdor = val.cdGrupoPrestador;
                    _self.provider.rotuloGrupoPrestador = StringTools.fill(val.cdGrupoPrestador, '0', 8)
                                                        + ' - ' + val.dsGrupoPrestador;
                });            
        };

        this.addProvider = function (isFromEdit) {
            if (isFromEdit != true){
                if(!(_self.provider.cdUnidadePres > 0)
                  && _self.provider.lgTodasUnidades != true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', 
                        title: 'Unidade não foi informada!'
                    });

                    totvsUtilsService.focusOn('providerUnitZoom');
                    return;
                }

                if(!(_self.provider.cdUnidCdPrestador > 0)
                  && _self.provider.lgTodosPrestadores != true){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', 
                        title: 'Prestador não foi informado!'
                    });

                    totvsUtilsService.focusOn('providerZoom');
                    return;
                }

                if(!(_self.provider.cdTipoPrestador != undefined)){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'error', 
                        title: 'Tipo do Prestador não foi informado!'
                    });

                    totvsUtilsService.focusOn('providerType');
                    return;
                }           

                for (var i = _self.attendanceNetwork.providers.length - 1; i >= 0; i--) {
                    
                    // Valida se prestador ja foi cadastrado
                    if(_self.attendanceNetwork.providers[i].cdUnidadePres     == _self.provider.cdUnidadePres
                    && _self.attendanceNetwork.providers[i].cdUnidCdPrestador == _self.provider.cdUnidCdPrestador
                    && _self.attendanceNetwork.providers[i].cdTipoPrestador   == _self.provider.cdTipoPrestador
                    && _self.attendanceNetwork.providers[i].codGrpPrestdor    == _self.provider.codGrpPrestdor){

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', 
                            title: 'Prestador já foi informado!'
                        });

                        return;
                    }

                    if(     (   _self.attendanceNetwork.providers[i].cdUnidadePres     == _self.provider.cdUnidadePres
                             || _self.attendanceNetwork.providers[i].cdUnidadePres     == 0
                             || _self.provider.cdUnidadePres                           == 0)
                        &&  (   _self.attendanceNetwork.providers[i].cdUnidCdPrestador == _self.provider.cdUnidCdPrestador
                             || _self.attendanceNetwork.providers[i].cdUnidCdPrestador == 0
                             || _self.provider.cdUnidCdPrestador                       == 0)
                        &&  (   _self.provider.cdTipoPrestador                         == PROVIDER_TYPE_ENUM.AMBOS
                             || _self.attendanceNetwork.providers[i].cdTipoPrestador   == PROVIDER_TYPE_ENUM.AMBOS)
                        &&  (   _self.provider.codGrpPrestdor                          == "T"
                             || _self.attendanceNetwork.providers[i].codGrpPrestdor    == 0)
                        &&  (   _self.attendanceNetwork.providers[i].cdTipoPrestador   != _self.provider.cdTipoPrestador
                             && _self.attendanceNetwork.providers[i].codGrpPrestdor    != _self.provider.codGrpPrestdor)){

                         $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'error', 
                            title: 'Regra de Atendimento conflita com outra regra informada!' +
                                   ' Unidade: ' + _self.attendanceNetwork.providers[i].rotuloUnidade +
                                   ' - Prestador: ' + _self.attendanceNetwork.providers[i].rotuloPrestador + 
                                   ' - Tipo: ' + _self.getProviderTypesLabel(_self.attendanceNetwork.providers[i].cdTipoPrestador) + 
                                   ' - Grupo: ' + _self.attendanceNetwork.providers[i].rotuloGrupoPrestador
                        });

                        return;  
                    }
                }
            }

            _self.attendanceNetwork.providers.unshift(angular.copy(_self.provider));
            _self.unsavedProvidersNumber ++;
            _self.provider = {};

            totvsUtilsService.focusOn('allUnits');

            return true;
        };

        this.removeProvider = function (prov, index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Você realmente deseja remover o prestador? <br><br>' 
                      + 'Unidade: '   + prov.rotuloUnidade  + ' <br> '
                      + 'Prestador: ' + prov.rotuloPrestador,
                cancelLabel: 'Não',
                confirmLabel: 'Sim',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes != true) 
                        return;

                    _self.doRemoveProvider(prov, index);
                }
            }); 
        }; 

        this.doRemoveProvider = function (provider, index, isFromEdit) {
            if(isFromEdit != true){
                if(provider.cdnRede > 0){
                    _self.removedProvidersAtend.push(angular.copy(provider));
                }
            }

            if(_self.unsavedProvidersNumber > index){
                _self.unsavedProvidersNumber --;
            }

            _self.attendanceNetwork.providers.splice(index, 1);
        };

        this.editProvider = function (providerToEdit, providerIndex) {
            providerToEdit.isEdit = true;
            _self.provider = angular.copy(providerToEdit);

            var movementModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hcg-attendanceNetwork/maintenance/ui/providerMaintenanceModal.html',
                backdrop: 'static',
                controller: 'hcg.providerMaintenanceModalController as modalController',
                windowClass: 'md',
                resolve: {
                    attendanceNetworkMaintenanceController: function () {
                        return _self;
                    },
                    providerToEdit: function(){
                        return providerToEdit;
                    },
                    providerIndex: function(){
                        return providerIndex;
                    }
                }
            });
        };

        this.getProviderTypesLabel = function(value){
            return PROVIDER_TYPE_ENUM.getLabelByKey(value);
        };

        /* Todos Prestadores */
        this.onChangeAllProviders = function () {
            if(!_self.provider.lgTodosPrestadores){
                _self.provider.rotuloPrestador = "";
            }else{
                _self.provider.cdUnidCdPrestador = 0;
                _self.provider.rotuloPrestador = "TODOS PRESTADORES";    
            }
        };

        /* Todas Unidades */
        this.onChangeAllUnits = function () {
            if(!_self.provider.lgTodasUnidades){
                _self.provider.rotuloUnidade = "";
                _self.provider.lgTodosPrestadores = false;
            }else{
                _self.provider.lgTodosPrestadores = true;
                _self.provider.cdUnidadePres = 0;
                _self.provider.rotuloUnidade = "TODAS UNIDADES";
            }

            _self.onChangeAllProviders();
        };

        /* Todos Grupos */
        this.onChangeAllGroups = function () {
            if(!_self.provider.lgTodosGrupos){
                _self.provider.rotuloGrupoPrestador = "";
            }else{
                _self.provider.codGrpPrestdor = "T";
                _self.provider.rotuloGrupoPrestador = "TODOS GRUPOS";
            }
        };

        this.loadProvidersAttendenceNetwork = function () {
            attendanceNetworkFactory.getProviderAttendanceNetworkByFilter("", _self.providersAttendNetPageOffset + 1, 20,
                false, [{property: 'cdnRede', value: _self.attendanceNetwork.cdnRede}], 
                function(result){
                    _self.providersAttendNetPageOffset += 20;

                    if (result.length < 20){
                        _self.hasLoadedAllProvidersAttendNet = true;
                    }

                    for (var i = result.length - 1; i >= 0; i--) {
                        _self.attendanceNetwork.providers.push(result[i]);
                    }
                });
        };

        this.invalidateAttendanceNetwork = function(attendanceNetwork){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateAttendanceNetwork',
                    {cdnRede: attendanceNetwork.cdnRede});
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hcg.attendanceNetworkMaintenance.Control', attendanceNetworkMaintenanceController);	
});


