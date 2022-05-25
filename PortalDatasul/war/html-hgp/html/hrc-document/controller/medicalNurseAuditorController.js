define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    medicalNurseAuditorController.$inject = ['$rootScope', '$scope', '$modalInstance', 'hrc.document.Factory', 'hcg.global.Factory',
                                            'disclaimers', 'batchRelease', 'tmpUnselectedDocuments', 'TOTVSEvent'];
    function medicalNurseAuditorController($rootScope, $scope, $modalInstance, documentFactory, hcgGlobalFactory, 
                                           disclaimers, batchRelease, tmpUnselectedDocuments, TOTVSEvent) {

        var _self = this;        

        this.init = function () {            
            _self.lgSobrescrMedicAuditor = false;
            _self.lgSobrescrEnfAuditor   = false;
            _self.nmMedicoAuditor        = "";
            _self.cdCrmMedicoAuditor     = "";
            _self.cdUfMedicoAuditor      = "";
            _self.nmEnfermAuditor        = "";
            _self.cdCorenEnfermAuditor   = "";
            _self.cdUfEnfermAuditor      = "";
        };

        this.informAuditors = function () {
            var parameters = [{property: 'lgSobrescrMedicAuditor', value: _self.lgSobrescrMedicAuditor},
                              {property: 'lgSobrescrEnfAuditor',   value: _self.lgSobrescrEnfAuditor}];

            if (batchRelease == true) {
                documentFactory.batchInformAuditors(_self.nmMedicoAuditor, _self.cdCrmMedicoAuditor, _self.cdUfMedicoAuditor,
                                                    _self.nmEnfermAuditor, _self.cdCorenEnfermAuditor, _self.cdUfEnfermAuditor,
                                                    disclaimers, parameters, tmpUnselectedDocuments, function (result) {
                    if (result) {
                        $modalInstance.close(result);
                    }
                });
            }else{
                documentFactory.informAuditors(_self.nmMedicoAuditor, _self.cdCrmMedicoAuditor, _self.cdUfMedicoAuditor,
                                               _self.nmEnfermAuditor, _self.cdCorenEnfermAuditor, _self.cdUfEnfermAuditor,
                                               disclaimers, parameters, tmpUnselectedDocuments, function (result) {
                    if (result) {
                        $modalInstance.close(result);
                    }
                });
            }
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.onAuditorDoctorChange = function(){
            if(!_self.nmMedicoAuditor
            || _self.nmMedicoAuditor.length == 0){
                _self.cdCrmMedicoAuditor = '';
                _self.cdUfMedicoAuditor = '';
            }else{
                _self.loadUfs();
            }
        };
        
        this.onAuditorNurseChange = function(){
            if(!_self.nmEnfermAuditor
            || _self.nmEnfermAuditor.length == 0){
                _self.cdCorenEnfermAuditor = '';
                _self.cdUfEnfermAuditor = '';
            }else{
                _self.loadUfs();
            }
        };

        this.loadUfs = function(callback){
            if(angular.isUndefined(_self.ufs) === true
            || _self.ufs.length === 0){
                hcgGlobalFactory.getStateByFilter('', 0, 0, false, [],
                    function (result) {
                        _self.ufs = result;
                        _self.ufs.unshift({enUf: '', nmEstado:'', rotulo:' '});
                        
                        if(callback){
                            callback();
                        }
                    });
            }else{
                if(callback){
                    callback();
                }
            } 
        };
                

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }

    index.register.controller('hrc.medicalNurseAuditor.Control', medicalNurseAuditorController);
});
