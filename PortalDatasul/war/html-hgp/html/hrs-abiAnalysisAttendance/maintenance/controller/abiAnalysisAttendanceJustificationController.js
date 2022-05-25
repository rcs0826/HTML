define(['index',
    '/dts/hgp/html/hvp-beneficiary/beneficiaryZoomController.js',
    '/dts/hgp/html/hvp-contractingparty/contractingPartyZoomController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAnalysisAttendanceJustificationController.$inject = ['$rootScope', '$scope','$modalInstance', '$location', 'TOTVSEvent', 
                                                            'hrs.abiAnalysisAttendance.Factory',
                                                            'cddRessusAbiAtendim', 'abiAttendanceJustificationList', 'idPermissao'];
    function abiAnalysisAttendanceJustificationController($rootScope, $scope, $modalInstance,  $location, TOTVSEvent, 
                                                          abiAnalysisAttendanceFactory,
                                                          cddRessusAbiAtendim, abiAttendanceJustificationList, idPermissao) {

        var _self = this;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listOfJustification = [];
        _self.reasonList = [];
        _self.idPermissao = idPermissao;

        _self.abiAttendanceJustificationList = [];

        this.save = function () {
            var lgAchou;

            //REMOVE OS ITENS N�O MARCADOS DA LISTA QUE SERA GRAVADA 
            angular.forEach(_self.abiAttendanceJustificationList, function(justification, index){
                angular.forEach(_self.reasonList, function(reason){
        
                    if (reason.idMotivo        == justification.cd_motivo &&
                        reason.idJustificativa == justification.id_justificativa &&
                        reason.idNatureza      == justification.id_natureza &&
                        !reason.$selected){
                            _self.abiAttendanceJustificationList.splice(index);
                    }
                });
            });

            angular.forEach(_self.reasonList, function(reason, index){
                if (reason.$selected){
                    lgAchou = false;
                    angular.forEach(_self.abiAttendanceJustificationList, function(justification){
                        if (reason.idMotivo                == justification.cd_motivo &&
                            reason.idNatureza              == justification.id_natureza &&
                            justification.id_justificativa == 0){

                                justification.ds_motivo_observacao = reason.dsObservacao;
                                justification.ds_memoria_calculo   = reason.ds_memoria_calculo;
                                lgAchou = true;
                            }
                    });

                    //ADICIONA ITEM NA LISTA
                    if (!lgAchou){
                        _self.abiAttendanceJustificationList.push(
                            JSON.parse('{ "cd_motivo" :' + reason.idMotivo  + ',' + 
                                         '"cd_protocolo_abi" :' + cdProtocoloAbi  + ',' + 
                                         '"cd_protocolo_aih" :' + cdProtocoloAih + ',' + 
                                         '"ds_clausula" : "" ,' +
                                         '"ds_justificativa" : "' + reason.dsObservacao + '" ,' + 
                                         '"ds_memoria_calculo" : "' + reason.ds_memoria_calculo + '" ,' +
                                         '"ds_motivo" : "' + reason.dsMotivo + '" ,' + 
                                         '"ds_motivo_observacao" : "' + reason.dsObservacao + '" ,' + 
                                         '"ds_natureza_impug" : "" , ' +
                                         '"ds_nota_rodape" : "' + reason.ds_memoria_calculo + '" ,' + 
                                         '"id_justificativa" : 0 , ' +
                                         '"id_natureza" :' + reason.idNatureza + ',' + 
                                         '"id_nota_rodape" : 0 , ' +
                                         '"id_princ_proc_motivo" : 0'
                                     + '}')     
                        );
                    }
                }
            });


            //REMOVE OS ITENS N�O MARCADOS DA LISTA QUE SERA GRAVADA 
            angular.forEach(_self.abiAttendanceJustificationList, function(justification, index){
                angular.forEach(_self.listOfJustification, function(atendanceJustification){
        
                    if (atendanceJustification.idMotivo        == justification.cd_motivo &&
                        atendanceJustification.idJustificativa == justification.id_justificativa &&
                        atendanceJustification.idNatureza      == justification.id_natureza &&
                        !atendanceJustification.$selected){
                            _self.abiAttendanceJustificationList.splice(index);
                    }
                });
            });

            angular.forEach(_self.listOfJustification, function(atendanceJustification, index){
                if (atendanceJustification.$selected){
                    // BUSCA O ITEM NA LISTA DOS REGISTROS QUE SERAO GRAVADOS
                    lgAchou = false;
                    angular.forEach(_self.abiAttendanceJustificationList, function(justification){
                        if (atendanceJustification.idMotivo        == justification.cd_motivo &&
                            atendanceJustification.idJustificativa == justification.id_justificativa &&
                            atendanceJustification.idNatureza      == justification.id_natureza ) {

                                justification.ds_justificativa = atendanceJustification.dsObservacao;
                                //justification.ds_motivo_observacao = atendanceJustification.dsObservacao;
                                lgAchou = true;
                            }

                    });

                    // ITEM ADICIONADO
                    if (!lgAchou ){
                        _self.abiAttendanceJustificationList.push(
                            JSON.parse('{ "cd_motivo" :' + atendanceJustification.idMotivo  + ',' + 
                                         '"cd_protocolo_abi" :' + cdProtocoloAbi  + ',' + 
                                         '"cd_protocolo_aih" :' + cdProtocoloAih + ',' + 
                                         '"ds_clausula" : "" ,' +
                                         '"ds_justificativa" : "' + atendanceJustification.dsObservacao + '" ,' + 
                                         '"ds_memoria_calculo" : "" , ' +
                                         '"ds_motivo" : "' + atendanceJustification.dsJustificativa + '" ,' + 
                                         '"ds_motivo_observacao" : "' + atendanceJustification.dsObservacao + '" ,' + 
                                         '"ds_natureza_impug" : "" , ' +
                                         '"ds_nota_rodape" : "" , ' +
                                         '"id_justificativa" :' + atendanceJustification.idJustificativa + ',' + 
                                         '"id_natureza" :' + atendanceJustification.idNatureza + ',' + 
                                         '"id_nota_rodape" : 0 , ' +
                                         '"id_princ_proc_motivo" : 0'
                                     + '}')
                        );    
                    }

                }
            });

            abiAnalysisAttendanceFactory.saveAttendanceJustifications(1, 1, _self.abiAttendanceJustificationList,
                function (result) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Dados salvos com sucesso'
                    });
                    $modalInstance.close(result);
            });

        };

        this.cancel = function () {
            $modalInstance.close(true);
        };

        this.init = function () {

            _self.currentUrl = $location.$$path;

            _self.abiAttendanceJustificationList = abiAttendanceJustificationList;

            abiAnalysisAttendanceFactory.getAbiAnalysisAttendanceJustifications(cddRessusAbiAtendim,
                function(result){
                    /*if (result){
            
                        _self.listOfJustification = result.tmpAbiJustifications;
                        _self.reasonList = result.tmpAbiReasons;

                        angular.forEach(_self.reasonList, function(reason, index){

                            reason.idJustificativa = 0;

                            angular.forEach(_self.abiAttendanceJustificationList, function(justification){
                                if (reason.idMotivo                == justification.cd_motivo &&
                                    reason.idNatureza              == justification.id_natureza &&
                                    justification.id_justificativa == 0){
                                        _self.reasonList[index].$selected = 'true';
                                        _self.reasonList[index].ds_memoria_calculo = justification.ds_memoria_calculo;
                                        _self.reasonList[index].dsObservacao = justification.ds_motivo_observacao;
                                }
                            });
                        });

                        angular.forEach(_self.listOfJustification, function(atendanceJustification, index){

                            angular.forEach(_self.abiAttendanceJustificationList, function(justification){
                                if (atendanceJustification.idMotivo        == justification.cd_motivo &&
                                    atendanceJustification.idJustificativa == justification.id_justificativa &&
                                    atendanceJustification.idNatureza      == justification.id_natureza ) {
                                        _self.listOfJustification[index].$selected = 'true';
                                        _self.listOfJustification[index].dsObservacao = justification.ds_justificativa;
                                    }
                                });
                            });


                        }*/
                    });

        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceJustificationController);
    }

    index.register.controller('hrs.abiAnalysisAttendJustification.Control', abiAnalysisAttendanceJustificationController);
});


