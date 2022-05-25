define(['index', 
        '/dts/hgp/html/hcg-unit/unitZoomController.js',
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/hcg-cid/cidZoomController.js',
        '/dts/hgp/html/hrc-noticeBillingImport/noticeBillingImportFactory.js',   
        '/dts/hgp/html/hrc-leaveReason/leaveReasonZoomController.js',
        '/dts/hgp/html/global/hacGlobalFactory.js',
        '/dts/hgp/html/util/customFilters.js',
    ], function(index) {

    noticeBillingImportMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrc.noticeBillingImport.Factory','hac.global.Factory','TOTVSEvent', '$timeout'];
	function noticeBillingImportMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, noticeBillingImportFactory , hacGlobalFactory, TOTVSEvent, $timeout) {

		var _self = this;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.cleanModel = function (){
            _self.noticeBillingImport = {};
            _self.noticeBillingImport.procedures = [];
            _self.noticeBillingImport.inputs = [];
            _self.proceduresPageOffset = 0;
            _self.inputsPageOffset = 0;
            _self.tissConsultationTypes = [];
            _self.tissAccidentIndications = [];
            _self.tissInternmentTypes = [];
            _self.tissAttendanceTypes = [];
            _self.tissInternmentRegimes = [];
            _self.tissBillingTypes = [];
            _self.tissLeaveReason = {};
        }

        this.init = function(){
            appViewService.startView("Manutenção Aviso Cobrança Importados",
                                     'hrc.noticeBillingImportMaintenance.Control', 
                                     _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 

            noticeBillingImportFactory.prepareDataToMaintenanceWindow($stateParams.cddSeq,             
                function (result) {
                    if (result) {
                        
                        _self.proceduresPageOffset   = 20; 
                        _self.inputsPageOffset   = 20; 

                        if(result.tmpProcedAvisoCobImp != undefined
                        && result.tmpProcedAvisoCobImp.length < 20){
                            _self.hasLoadedAllProcedures = true;   
                        }

                        if(result.tmpInsumoAvisoCobImp != undefined
                        && result.tmpInsumoAvisoCobImp.length < 20){
                            _self.hasLoadedAllInputs = true;   
                        }

                        _self.noticeBillingImport = result.tmpDoctoAvisoCobImp[0];
                        _self.noticeBillingImport.procedures = result.tmpProcedAvisoCobImp;
                        _self.noticeBillingImport.inputs = result.tmpInsumoAvisoCobImp;


                        angular.forEach(_self.noticeBillingImport.procedures, function(procedure){
                            procedure.providers = [];

                            angular.forEach(result.tmpPreserv, function(prest){
                                if(prest.idRegistroMovto === procedure.idRegistro) {
                                    procedure.providers.push(prest);
                                }
                            });
                        });
                    }
                });

            hacGlobalFactory.getTissConsultationTypeByFilter('', 0, 0, false, [],
                function (result) {
                    _self.tissConsultationTypes = result;
                    for (let i = 0; i < _self.tissConsultationTypes.length; i++){
                        _self.tissConsultationTypes[i].cdnTipCon = _self.tissConsultationTypes[i].cdnTipCon.toString();
                    }
                });

            hacGlobalFactory.getTissAccidentIndicationByFilter('', 0, 0, false, [],
                function (result) {
                    _self.tissAccidentIndications = result;
                });

            hacGlobalFactory.getTissInternmentTypeByFilter('', 0, 0, false, [],
                function (result) {
                    _self.tissInternmentTypes = result;
                });

            hacGlobalFactory.getTissAttendanceTypeByFilter('', 0, 0, false, [],
                function (result) {
                    _self.tissAttendanceTypes = result;
                }); 

            hacGlobalFactory.getTissInternmentRegimeByFilter('', 0, 0, false, [],
                function (result) {
                    _self.tissInternmentRegimes = result;
                });

            hacGlobalFactory.getTissBillingTypeByFilter('', 0, 0, false, [],
                function (result) {
                    _self.tissBillingTypes = result;
                });
            
            if($state.current.name === 'dts/hgp/hrc-noticeBillingImport.detail'){
                _self.action = 'DETAIL';    
            }else{
                _self.action = 'EDIT';
            }            
        };

        this.onLeaveReasonSelect = function(){
            _self.setTissLeaveReason();
        };
        
        this.setTissLeaveReason = function(){
            if(angular.isUndefined(_self.noticeBillingImport.cdnMotivEncerra)
            || _self.noticeBillingImport.cdnMotivEncerra === ''){
                _self.tissLeaveReason = {};
                return;
            }
            
            hacGlobalFactory.getTissLeaveReasonByFilter('', 0, 0, false,
                [{property:'cdnMotivAltaGp' , value: _self.noticeBillingImport.cdnMotivEncerra},
                 {property:'cdnVersao'      , value: 3}], //TISS 3.00.00
                function (result) {
                    if(result.length > 0){
                        _self.tissLeaveReason = result[0];
                    }else{
                        _self.tissLeaveReason = {rotulo: '0 - Não Informado'};
                    }
            });                    
        };

        this.loadProcedures = function () {
            noticeBillingImportFactory.getProceduresNoticeBillingImportByFilter("", _self.proceduresPageOffset + 1, 20,
                false, [{property: 'cdnUnid', value: _self.noticeBillingImport.cdnUnid},
                        {property: 'cdnUnidPrestdra', value: _self.noticeBillingImport.cdnUnidPrestdra},
                        {property: 'cdnTrans', value: _self.noticeBillingImport.cdnTrans},
                        {property: 'codSerDoctoOrigin', value: _self.noticeBillingImport.codSerDoctoOrigin},
                        {property: 'numDoctoOrigin', value: _self.noticeBillingImport.numDoctoOrigin},
                        {property: 'numDoctoSist', value: _self.noticeBillingImport.numDoctoSist}],
                function(result){
                    _self.proceduresPageOffset += 20;

                    if (result.length < 20){
                        _self.hasLoadedAllProcedures = true;
                    }

                    for (var i = result.length - 1; i >= 0; i--) {
                        _self.noticeBillingImport.procedures.push(result[i]);
                    }
                });
        };

        this.loadInputs = function () {
            noticeBillingImportFactory.getInputsNoticeBillingImportByFilter("", _self.inputsPageOffset + 1, 20,
                false, [{property: 'cdnUnid', value: _self.noticeBillingImport.cdnUnid},
                        {property: 'cdnUnidPrestdra', value: _self.noticeBillingImport.cdnUnidPrestdra},
                        {property: 'cdnTrans', value: _self.noticeBillingImport.cdnTrans},
                        {property: 'codSerDoctoOrigin', value: _self.noticeBillingImport.codSerDoctoOrigin},
                        {property: 'numDoctoOrigin', value: _self.noticeBillingImport.numDoctoOrigin},
                        {property: 'numDoctoSist', value: _self.noticeBillingImport.numDoctoSist}],
                function(result){
                    _self.inputsPageOffset += 20;

                    if (result.length < 20){
                        _self.hasLoadedAllInputs = true;
                    }

                    for (var i = result.length - 1; i >= 0; i--) {
                        _self.noticeBillingImport.inputs.push(result[i]);
                    }
                });
        };
        
        this.saveClose = function (){
            _self.save(true);
        };

        this.save = function (isSaveClose) {

            if (!_self.permiteSalvar()){
                return;
            }

            this.invalidateNoticeBillingImport = function(cddSeq){
                //dispara um evento para a lista atualizar o registro
                $rootScope.$broadcast('invalidateNoticeBillingImport',
                cddSeq);
            };

            noticeBillingImportFactory.saveNoticeBillingImport(_self.noticeBillingImport,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    var titleAux = 'Aviso de Cobrança salvo com sucesso';
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: titleAux
                    });
                    
                    //Salva e fecha a tela
                    if(isSaveClose){
                        _self.invalidateNoticeBillingImport(result.cddSeq);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção Aviso Cobrança Importados',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }
                    else{
                        $state.go($state.get('dts/hgp/hrc-noticeBillingImport.edit'), 
                                             {  cddSeq: result.cddSeq});
                    }
            });
        };

        this.permiteSalvar = function(){
            var permiteSalvarAux = true;
            var mensagem = [];

            if (_self.noticeBillingImportForm.$invalid){
                permiteSalvarAux = false;
                _self.noticeBillingImportForm.$setDirty();              
                angular.forEach(_self.noticeBillingImportForm, function(value, key) {
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
                                           name  : 'Manutenção Aviso Cobrança Importados',
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
                                               name  : 'Manutenção Aviso Cobrança Importados',
                                               url   : _self.currentUrl}); 
                }
            }); 
            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrc.noticeBillingImportMaintenance.Control', noticeBillingImportMaintenanceController);	
});


