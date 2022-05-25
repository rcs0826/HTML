define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiServicesModalController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/justificationsMotiveModalController.js',    
	'/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceSupportingDocumentsController.js',
    '/dts/hgp/html/enumeration/attendanceStatusEnumeration.js',

], function (index) {

    impugnationMotiveModalController.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                'TOTVSEvent','hrs.abiAnalysisAttendance.Factory', 'movto', 'attendance', 'cddRessusAbiDados', '$filter', '$timeout', '$modal'];
    function impugnationMotiveModalController($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                              TOTVSEvent,  abiAnalysisAttendanceFactory, movto, attendance, cddRessusAbiDados, $filter, $timeout, $modal) {

      

        var _self = this;
        _self.movto = movto;
        _self.attendance = attendance;
        _self.controllerDocumentos = null;
        _self.lstKindRequest = [];
        _self.ATTENDANCE_STATUS_ENUM = ATTENDANCE_STATUS_ENUM;


        this.cancel = function () {           
            $modalInstance.dismiss('cancel');
        };

        this.save = function (){
          this.onSave(false);
        };

        this.saveAndConclude = function (){
          this.onSave(true);
        };

        this.onSave = function (conclude) {
            /* Servicos dos Motivos */
            var servicesListAux = [];
            var justificationsListAux = [];

            _self.controllerDocumentos.save();

            for (var i = _self.impugnationListSelected.length - 1; i >= 0; i--) {
                for (var j = _self.impugnationListSelected[i].servicos.length - 1; j >= 0; j--) {                  
                  servicesListAux.push(_self.impugnationListSelected[i].servicos[j]);
                }
                for (var j = _self.impugnationListSelected[i].justificativas.length - 1; j >= 0; j--) {  
                    justificationsListAux.push(_self.impugnationListSelected[i].justificativas[j]);
                }

                for (var k = _self.impugnationListSelectedBkp.length - 1; k >= 0; k--) {
                    if(_self.impugnationListSelectedBkp[k].id == _self.impugnationListSelected[i].id
                    && _self.impugnationListSelectedBkp[k].desQtdeServicos != _self.impugnationListSelected[i].desQtdeServicos){
                        _self.impugnationListSelected[i].logMotivGeradSist = false;
                    }
                }
            }

            abiAnalysisAttendanceFactory.saveAttendanceImpugnationMotive(attendance.cddRessusAbiAtendim, _self.idTipoPedido, _self.desMemoCalc, _self.impugnationListSelected, 
                servicesListAux, justificationsListAux,conclude,
                function(result){
                    if(result.$hasError == true){
                        return;
                    }
                    if(_self.maintenancePermission){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Motivos de Impuganação aplicados ao atendimento ' + attendance.cddAtendim
                        }); 
                        $modalInstance.close('SUCCESS');
                    }else{
                        _self.invalidateAttendance(_self.attendance);

                        _self.maintenancePermission = true;
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Atendimento em situação de análise '
                        }); 
                    }                    
            });
        };

        this.invalidateAttendance = function(attendance){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateAttendance',
                    {cddRessusAbiAtendim: attendance.cddRessusAbiAtendim,
                     cddRessusAbiDados: cddRessusAbiDados});
        };

        this.openServicesModal = function (impugnation, action) {
            action = 'EDIT';

            if(!_self.maintenancePermission)
              action = 'DETAIL';

            var abiServicesModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/abiServicesModal.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.abiServicesModalController.Control as controller',
                resolve: {
                            impugnation: function () {
                                return impugnation;
                            },
                            attendance: function(){
                                return attendance;
                            },
                            action: function(){
                                return action;
                            }
                         }
            });

            abiServicesModal.result.then(function (result) {
                impugnation.servicos = result;

                /* Somente mostra valor na coluna de servicos se a qtde de movimentos for diferente*/
                if(parseInt(impugnation.servicos.length) != parseInt(_self.qtdeMovtosImpug)
                && parseInt(impugnation.servicos.length) > 0){
                    impugnation.desQtdeServicos = impugnation.servicos.length + '/' + _self.qtdeMovtosImpug;
                }else{
                    impugnation.desQtdeServicos = "";
                }
            });
        };

        this.openJustificationModal = function (impugnation, action) {

            if(!_self.maintenancePermission)
              action = 'DETAIL';

            var justificationMotiveModal = $modal.open({
                animation: true,
                templateUrl: '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/ui/justificationsMotiveModal.html',
                size: 'lg',
                backdrop: 'static',
                controller: 'hrs.justificationsMotiveModalController.Control as controller',
                resolve: {
                            impugnation: function () {
                                return impugnation;
                            },
                            attendance: function(){
                                return attendance;
                            },
                            action: function(){
                                return action;
                            }
                         }
            });

            justificationMotiveModal.result.then(function (result) {
                impugnation.justificativas = result.justificationsList;

                impugnation.desObservacao = result.desObservacao;
                impugnation.desMemoCalc   = result.desMemoCalc;

            });
        };        

        /* Troca cor do texto da coluna de Servicos quando está selecionado */
        this.alterSelectedItemColor = function () {
            for (var i = _self.impugnationListSelected.length - 1; i >= 0; i--) {
                if(_self.impugnationListSelected[i].$selected){
                    $('#' + i).css( 'color', 'white' );
                }else{
                    $('#' + i).css( 'color', '#333' );
                    
                }
            }

            /* Lista secundária */
            for (var i = _self.impugnationListUnselected.length - 1; i >= 0; i--) {
                if(_self.impugnationListUnselected[i].$selected){
                    $('#c' + i).css( 'color', 'white' );
                }else{
                    $('#c' + i).css( 'color', '#333' );
                }
            }
        };

        this.orderImpugnationList = function (type, impugnation) {
            /* Caso o checkbox esteja selecionado, joga na lista dos que não estão selecionados */
            if(type == 'SELECTED'){
                _self.impugnationListUnselected.push(impugnation);
            }else{
               _self.impugnationListSelected.push(impugnation);
            }

            /* Filtra listar por itens selecionados e após ordena pelo idMotivo */
            _self.impugnationListSelected   = $filter('filter')(_self.impugnationListSelected, {$selected:true});
            _self.impugnationListUnselected = $filter('filter')(_self.impugnationListUnselected, {$selected:false});

            _self.impugnationListSelected   = $filter('orderBy')(_self.impugnationListSelected, 'idMotivo');
            _self.impugnationListUnselected = $filter('orderBy')(_self.impugnationListUnselected, 'idMotivo');

            $timeout(function(){
                _self.alterSelectedItemColor();
            });
        };

        this.setControllerDocumentosComprobatorios = function(controllerDocumentos) {
            _self.controllerDocumentos = controllerDocumentos;
        };

        this.init = function () {   
          _self.impugnationListSelected = [];
          _self.impugnationListUnselected = [];

          _self.maintenancePermission = true;
          
          _self.idTipoPedido = 1;

          /* Caso seja chamado pelo atendimento */
          if (attendance != undefined){
              abiAnalysisAttendanceFactory.getAttendanceImpugnationMotive(attendance.cddRessusAbiAtendim ,function(result){

                  if(attendance.idiTipImpug != undefined)
                      _self.idTipoPedido = attendance.idiTipImpug; 

                  if(attendance.desMemoCalc != undefined)
                      _self.desMemoCalc  = attendance.desMemoCalc;
                  else
                      _self.desMemoCalc  = "";
  
                  _self.lstKindRequest = [{value: 0, label: '0 - Sem Impuganação'},
                                          {value: 1, label: '1 - Anulação da identificação do atendimento'},
                                          {value: 2, label: '2 - Retificação do valor a ser ressarcido'},
                                          {value: 3, label: '3 - Anulação da identificação do atendimento ou, subsidiariamente, retificação do valor a ser ressarcido'}];
                  
                  var idAux = 1;
                  var tmpAbiMotivo = result.tmpAbiMotivo;
                  var tmpRessusAbiMotivImpug = result.tmpRessusAbiMotivImpug;
                  var tmpRessusAbiProced = result.tmpRessusAbiProced;
                  var tmpAbiJustif = result.tmpAbiJustif;
                  _self.qtdeMovtosImpug = 0;

                  if (tmpRessusAbiProced){
                      _self.qtdeMovtosImpug = tmpRessusAbiProced.length;
                  }

                  for (var i = 0; i < tmpAbiMotivo.length; i++) {
                      tmpAbiMotivo[i].$selected = false;
                      tmpAbiMotivo[i].servicos = [];
                      tmpAbiMotivo[i].justificativas = [];
                      tmpAbiMotivo[i].desQtdeServicos = "";
                      tmpAbiMotivo[i].id = idAux++;

                      for (var j = 0; j < tmpRessusAbiMotivImpug.length; j++) {
                          if(tmpAbiMotivo[i].idNatureza == tmpRessusAbiMotivImpug[j].cdnNatur
                          && tmpAbiMotivo[i].idMotivo == tmpRessusAbiMotivImpug[j].cdnMotiv){
                              tmpAbiMotivo[i].$selected = true;
                              tmpAbiMotivo[i].cddRessusAbiMotivImpug = tmpRessusAbiMotivImpug[j].cddRessusAbiMotivImpug;
                              tmpAbiMotivo[i].desObservacao = tmpRessusAbiMotivImpug[j].desObservacao;
                              tmpAbiMotivo[i].desMemoCalc = tmpRessusAbiMotivImpug[j].desMemoCalc;
                              tmpAbiMotivo[i].logMotivGeradSist = tmpRessusAbiMotivImpug[j].logMotivGeradSist;
                          
                              /* Adiciona os serviços que já estão salvos aos motivos */
                              if(tmpRessusAbiMotivImpug[j].cddRessusAbiProced > 0){
                                  for (var k = tmpRessusAbiProced.length - 1; k >= 0; k--) {
                                      if(tmpRessusAbiProced[k].cddRessusAbiProced == tmpRessusAbiMotivImpug[j].cddRessusAbiProced){
                                          servicoAux = {};
                                          servicoAux = angular.copy(tmpRessusAbiProced[k])
                                          servicoAux.idPai = tmpAbiMotivo[i].id;

                                          tmpAbiMotivo[i].servicos.push(angular.copy(servicoAux));
                                      }
                                  }

                                  if(parseInt(tmpAbiMotivo[i].servicos.length) != parseInt(_self.qtdeMovtosImpug)){
                                      tmpAbiMotivo[i].desQtdeServicos = tmpAbiMotivo[i].servicos.length + '/' + _self.qtdeMovtosImpug;
                                  }
                              }

                              /* Adiciona as justificativas que já estão salvas aos motivos */
                              for (var k = tmpAbiJustif.length - 1; k >= 0; k--) {
                                  if(tmpAbiJustif[k].cddRessusAbiMotivImpug == tmpRessusAbiMotivImpug[j].cddRessusAbiMotivImpug){
                                      justificativaAux = {};
                                      justificativaAux = angular.copy(tmpAbiJustif[k])
                                      justificativaAux.idPai = tmpAbiMotivo[i].id;

                                      tmpAbiMotivo[i].justificativas.push(angular.copy(justificativaAux));
                                  }
                              }                              
                          }
                      }
                  }

                  _self.impugnationListSelected = tmpAbiMotivo;
                  angular.extend(_self.impugnationListUnselected, _self.impugnationListSelected);

                  _self.impugnationListSelected   = $filter('filter')(_self.impugnationListSelected, {$selected:true});
                  _self.impugnationListUnselected = $filter('filter')(_self.impugnationListUnselected, {$selected:false});

                  _self.impugnationListSelected   = $filter('orderBy')(_self.impugnationListSelected, 'idMotivo');
                  _self.impugnationListUnselected = $filter('orderBy')(_self.impugnationListUnselected, 'idMotivo');

                  _self.impugnationListSelectedBkp = angular.copy(_self.impugnationListSelected);

                  if(attendance.idiStatus >= _self.ATTENDANCE_STATUS_ENUM.ANALISE_CONCLUIDA)
                    _self.maintenancePermission = false;

                  $timeout(function(){
                      _self.alterSelectedItemColor();
                  });
              });
          }else{
              var cddRessusAbiProcedAux = movto.cddRessusAbiProced;

              /* Se for o serviço principal, busca somente os motivos que estão no atendimento */
              if (movto.indTipServRessus == "P"){
                  cddRessusAbiProcedAux = 0;
              }

              abiAnalysisAttendanceFactory.getServiceImpugnationMotive(movto.cddRessusAbiAtendim, cddRessusAbiProcedAux,
                  function(result){                    
                      _self.impugnationListSelected = result;
  
                      for (var i = _self.impugnationListSelected.length - 1; i >= 0; i--) {
                          _self.impugnationListSelected[i].$selected = true;
                      }
  
                      _self.impugnationListSelected = $filter('orderBy')(_self.impugnationListSelected, 'idMotivo');  
              });
          }         
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.impugnationMotiveModalController.Control', impugnationMotiveModalController);
});

