define(['index',    
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',    
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    documentosExportAvisosCobRemoverController.$inject = ['$rootScope','$scope', '$modalInstance', 
    '$timeout', '$state', 'TOTVSEvent', 'hrc.documentosExportAvisosCob.Factory','tmpDoctoAvisoCob','disclaimers','tmpNaoSelecDoctoAvisoCob'];
    function documentosExportAvisosCobRemoverController($rootScope,$scope, $modalInstance,
        $timeout, $state, TOTVSEvent, documentosExportAvisosCobFactory, tmpDoctoAvisoCob,disclaimers,tmpNaoSelecDoctoAvisoCob) {

        var _self = this;
        this.model = {};        
        this.tmpDocAvisoExcSit;
        this.stats;        
        this.SUCCESS_CONST = '1';        
        this.ERROR_CONST   = '2';        
        this.hasDoneSearch = false;
        this.tmpDoctoAvisoCob = tmpDoctoAvisoCob;
        this.tmpNaoSelecDoctoAvisoCob = tmpNaoSelecDoctoAvisoCob;
        this.disclaimers = disclaimers;
        this.cancel = function () {
            $modalInstance.close('Voltar');
        };


        this.getStatus = function (status){
            if(status == null){
                return status;
            }else if(status == "2"){
                return _self.ERROR_CONST;
            }else return _self.SUCCESS_CONST;
        };

        this.init = function () {               
            if  (_self.tmpDoctoAvisoCob == undefined){
                _self.tmpDoctoAvisoCob = [];
            }
            documentosExportAvisosCobFactory.postDeletarAvisosCobrancas(_self.tmpDoctoAvisoCob,_self.disclaimers,false,_self.tmpNaoSelecDoctoAvisoCob, function (result) { 
                _self.hasDoneSearch = true;
                if (result) { 
                    _self.deleteDoctList = result.tmpDocAvisoExcSit;                    
                    _self.stats = result.Stats;
              /*      angular.forEach(_self.deleteDoctList,function(deleteDoc){
                        deleteDoc.situacao = getStatus(deleteDoc.situacao);
                    })*/
                }     
                _self.hasDoneSearch = true;
            });     
        };

        $scope.$watch('$viewContentLoaded', function () {            
            _self.init();
        });

        $.extend(this, documentosExportAvisosCobRemoverController);
    }

    index.register.controller('hrc.documentosExportAvisosCobRemover.Control', documentosExportAvisosCobRemoverController);
});

