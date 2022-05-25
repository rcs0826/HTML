define(['index',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hrs-permissionSituation/permissionSituationFactory.js',
        '/dts/hgp/html/hrs-situation/situationFactory.js',
        '/dts/hgp/html/global-group/groupZoomController.js',
        '/dts/hgp/html/enumeration/attendanceStatusEnumeration.js',
    ], function(index) {                                

	permissionSituationMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 
                                                        'totvs.utils.Service', 'totvs.app-main-view.Service','$location',
                                                        'hrs.permissionSituation.Factory','hrs.situation.Factory', '$filter', 'TOTVSEvent'];
	function permissionSituationMaintenanceController($rootScope, $scope, $state, $stateParams, 
                                                      totvsUtilsService, appViewService, $location, 
                                                      permissionSituationFactory, situationFactory, $filter, TOTVSEvent) {

        var _self = this;        
                
        this.cleanModel = function (){
            _self.attendanceStatus = ATTENDANCE_STATUS_ENUM.DETAILED_ENUMERATION_VALUES;
            _self.permissionSituationList = [];
            _self.codGrp = "";
        }              

        this.init = function(){
            appViewService.startView("Manutenção das Permissões de Grupos de Usuário", 'hrs.permissionSituationMaintenance.Control', _self);

            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.disableAnalisysStatus = false;

            _self.cleanModel();

            _self.currentUrl = $location.$$path;

            if($state.current.name === 'dts/hgp/hrs-permissionSituation.new'){
                _self.action = 'INSERT';
            }else if($state.current.name === 'dts/hgp/hrs-permissionSituation.detail'){
                _self.action = 'DETAIL';
            }else{
                _self.action = 'EDIT';
            }

            for (var i = _self.attendanceStatus.length - 1; i >= 0; i--) {
                _self.attendanceStatus[i].cdnPermis = 0;
                _self.attendanceStatus[i].idiSubStatus = 0;
                _self.attendanceStatus[i].idiStatus = _self.attendanceStatus[i].data;
            }

            situationFactory.getSituationByFilter('', 0, 0, false, [],
                function (result) {                        
                    if (result) {
                        angular.forEach(result, function (value) {
                            _self.permissionSituationList.push({idSituacao: value.idSituacao,
                                                                nmSituacao: value.nmSituacao,
                                                                idiStatus: ATTENDANCE_STATUS_ENUM.EM_ANALISE,
                                                                idiSubStatus: value.idSituacao,
                                                                cdnPermis: 0});
                        });                            
                    }

                    if (!angular.isUndefined($stateParams.codGrp)) {
                        permissionSituationFactory.prepareDataToMaintenanceWindow($stateParams.codGrp,
                            function (result) {
                                if (result) {
                                    angular.forEach(result, function (value) {
                                        _self.codGrp = value.codGrp;

                                        if(value.idiSubStatus == 0){
                                            for (var i = _self.attendanceStatus.length - 1; i >= 0; i--) {
                                                if(_self.attendanceStatus[i].idiStatus == value.idiStatus){
                                                    _self.attendanceStatus[i].cddAbiGrpUsuar = value.cddAbiGrpUsuar;
                                                    _self.attendanceStatus[i].cdnPermis = value.cdnPermis;

                                                    /* Se for em analise e sem permissao (0), desabilita os substatus */
                                                    if(_self.attendanceStatus[i].idiStatus == ATTENDANCE_STATUS_ENUM.EM_ANALISE
                                                    && _self.attendanceStatus[i].cdnPermis == 0){
                                                        _self.disableAnalisysStatus = true;
                                                    }
                                                }
                                            }
                                        }else{
                                            for (var i = _self.permissionSituationList.length - 1; i >= 0; i--) {
                                                if(_self.permissionSituationList[i].idiSubStatus == value.idiSubStatus){
                                                    _self.permissionSituationList[i].cddAbiGrpUsuar = value.cddAbiGrpUsuar;
                                                    _self.permissionSituationList[i].cdnPermis = value.cdnPermis;
                                                }                                            
                                            }
                                        }
                                    });
                                }
                            });
                    }

                    _self.permissionSituationList = $filter('orderBy')(_self.permissionSituationList, 'idiSubStatus');
                });
        };

        this.save = function () {
            if (_self.permissionSituationForm.$invalid){
                _self.permissionSituationForm.$setDirty();
                angular.forEach(_self.permissionSituationForm, function(value, key) {
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

            var tmpPermissionSituationAux = [];
            var tmpPermission;
            for (var i = _self.permissionSituationList.length - 1; i >= 0; i--) {
                tmpPermissionSituationAux.push(_self.permissionSituationList[i]);
                /* chuncho para criar as permissões do status Importação com Erro junto com o Em Análise */
                tmpPermission = angular.copy(_self.permissionSituationList[i]);
                tmpPermission.idiStatus = 2;
                tmpPermissionSituationAux.push(tmpPermission);
            }

            for (var i = _self.attendanceStatus.length - 1; i >= 0; i--) {
                tmpPermissionSituationAux.push(_self.attendanceStatus[i]);
            }
            
            permissionSituationFactory.savePermissionSituation(_self.codGrp, tmpPermissionSituationAux,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Permissões das Situações salvas com sucesso'
                    });

                    appViewService.removeView({active: true,
                                               name  : 'Manutenção das Permissões de Grupos de Usuário',
                                               url   : _self.currentUrl});
                                               
                    _self.resetPage();
            });
        };

        this.onCancel = function(){                    
            if(_self.action == 'DETAIL'){
                appViewService.removeView({active: true,
                                           name  : 'Manutenção das Permissões de Grupos de Usuário',
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
                                               name  : 'Manutenção das Permissões de Grupos de Usuário',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        this.onPermissionClick = function (idiStatus, cdnPermis) {
            if (idiStatus != ATTENDANCE_STATUS_ENUM.EM_ANALISE){
                return;
            }

            /* Sem Permissao */
            if (cdnPermis == 0){
                _self.disableAnalisysStatus = true;

                for (var i = _self.permissionSituationList.length - 1; i >= 0; i--) {
                    _self.permissionSituationList[i].cdnPermis = 0;
                }                                
            }else{
                _self.disableAnalisysStatus = false;
            }
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
            || _self.permissionSituationForm == undefined)
                return;
                
            _self.permissionSituationForm.$setPristine();
            _self.permissionSituationForm.$setUntouched();
        }  
	}
	
	index.register.controller('hrs.permissionSituationMaintenance.Control', permissionSituationMaintenanceController);	
});


