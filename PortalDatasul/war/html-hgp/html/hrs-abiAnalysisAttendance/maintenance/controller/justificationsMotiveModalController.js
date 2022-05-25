define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiServicesModalController.js',
    '/dts/hgp/html/js/libs/mention.js',
    '/dts/hgp/html/js/libs/bootstrap-typeahead.js',
    '/dts/hgp/html/enumeration/hashVariableEnumeration.js',
], function (index) {

    justificationsMotiveModalController.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                'TOTVSEvent','hrs.abiAnalysisAttendance.Factory', 'impugnation', 'attendance', 'action', '$filter', '$timeout', '$modal'];
    function justificationsMotiveModalController($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                              TOTVSEvent,  abiAnalysisAttendanceFactory, impugnation, attendance, action, $filter, $timeout, $modal) {

        var _self = this;
        _self.impugnation = impugnation;
        _self.attendance = attendance;
        _self.action = action;       

        this.openVariableFields = function () {
            $('#variablefields').popover('show');
        }; 
                              
        this.createMention = function () {
            _self.dsCamposVariaveis =  HASH_VARIABLE_ENUM.TOOLTIP;


            /* Se tirar o mouse do popover, fecha ele */
            $('body').on('mouseover', function (e) {
                if ($(e.target).data('toggle') !== 'popover'
                &&  $(e.target).parents('.popover.in').length === 0) { 
                    $('[data-toggle="popover"]').popover('hide');
                }
            });

            /* Abrir componente de hashtags nos textarea */
            $("input[type=textarea], textarea").mention({
                delimiter: '#',
                emptyQuery: true,
                sensitive: true,
                queryBy: ['username','descricao', 'name'],
                users: HASH_VARIABLE_ENUM.ENUMERATION_VALUES
            });           
        }

        this.cancel = function () {           
            $modalInstance.dismiss('cancel');
        };

        this.save = function () {
            var objectResult = { desObservacao : _self.desObservacaoAux,
                                 justificationsList : _self.justificationListSelected };
            $modalInstance.close(objectResult);      
        };

        this.orderJustificationList = function (type, justification) {
            /* Caso o checkbox esteja selecionado, joga na lista dos que não estão selecionados */
            if(type == 'SELECTED'){
                _self.justificationListUnselected.push(justification);
            }else{
               _self.justificationListSelected.push(justification);
            }

            /* Filtra listar por itens selecionados e após ordena pelo idMotivo */
            _self.justificationListSelected   = $filter('filter')(_self.justificationListSelected, {$selected:true});
            _self.justificationListUnselected = $filter('filter')(_self.justificationListUnselected, {$selected:false});

            _self.justificationListSelected   = $filter('orderBy')(_self.justificationListSelected, 'idJustificativa');
            _self.justificationListUnselected = $filter('orderBy')(_self.justificationListUnselected, 'idJustificativa');
        };

        this.closeJustificationTextDiv = function () {
            $(' .justificationTextDiv').slideToggle(200, function(){
                /* Habilita tela de motivos */
                $('#modal-form-justif').css('pointer-events', 'all');
                $('#btn-cancel').css('pointer-events', 'all');
                $('#btn-save').css('pointer-events', 'all');
    
                $('#modal-form-justif').css('opacity', '1');
                $('#btn-cancel').css('opacity', '1');
                $('#btn-save').css('opacity', '1');
    
                _self.desTextoJustificativaAux = "";
                _self.rotuloJustificativaAux = "";
                _self.justificationAux = {};
                
                _self.actionAux = 'EDIT';  
            });
        };

        this.saveObservation = function () {
            _self.justificationAux.dsObservacao = _self.desTextoJustificativaAux;            
            _self.closeJustificationTextDiv();
        };        

        this.openJustificationTextDiv = function (justification, action) {
            _self.rotuloJustificativaAux   = justification.idJustificativa + " - " + justification.dsJustificativa
            _self.desTextoJustificativaAux = justification.dsObservacao;
            _self.justificationAux = justification;

            $(' .justificationTextDiv').slideToggle(200, function(){
                $(' .justificationTextDiv').css('visibility', 'visible'); 

                /* Desabilita tela de motivos */
                $('#modal-form-justif').css('pointer-events', 'none');
                $('#btn-cancel').css('pointer-events', 'none');
                $('#btn-save').css('pointer-events', 'none');          

                $('#modal-form-justif').css('opacity', '0.7');
                $('#btn-cancel').css('opacity', '0.7');
                $('#btn-save').css('opacity', '0.7');

                });

                if(_self.action == 'DETAIL'){
                    /* Não habilita campo de texto da justificativa */
                    _self.actionAux = 'DETAIL_TEXT';
                }else{
                    _self.actionAux = action;
                }            
        };

        this.init = function () {
            $timeout(function(){
                $(' .justificationTextDiv').slideToggle();
            });

            _self.createMention();

            _self.desTextoJustificativaAux = "";
            _self.rotuloJustificativaAux = "";
            _self.justificationAux = {};

            if(impugnation.desObservacao != undefined){
                _self.desObservacaoAux = impugnation.desObservacao;
            }else{
                _self.desObservacaoAux = "";
            }

            _self.justificationListSelected = [];
            _self.justificationListUnselected = [];

            abiAnalysisAttendanceFactory.getJustificationImpugnationMotive(attendance.cddRessusAbiAtendim, impugnation.cddRessusAbiMotivImpug,
                            impugnation.idNatureza, impugnation.idMotivo,
                  function(result){
                      var tmpAbiJustif = [];

                      for (var i = result.length - 1; i >= 0; i--) {
                          result[i].$selected = result[i].isSelected;
                          result[i].idPai = impugnation.id;

                          for (var j = impugnation.justificativas.length - 1; j >= 0; j--) {
                             if (impugnation.justificativas[j].idJustificativa == result[i].idJustificativa){
                                  result[i].dsObservacao = impugnation.justificativas[j].dsObservacao;
                                  result[i].$selected = true;
                             }
                          }

                          tmpAbiJustif.push(result[i]);
                      }

                      _self.justificationListSelected = tmpAbiJustif;
                      angular.extend(_self.justificationListUnselected, _self.justificationListSelected);
    
                      _self.justificationListSelected   = $filter('filter')(_self.justificationListSelected, {$selected:true});
                      _self.justificationListUnselected = $filter('filter')(_self.justificationListUnselected, {$selected:false});
          
                      _self.justificationListSelected   = $filter('orderBy')(_self.justificationListSelected, 'idJustificativa');
                      _self.justificationListUnselected = $filter('orderBy')(_self.justificationListUnselected, 'idJustificativa');
            });
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.justificationsMotiveModalController.Control', justificationsMotiveModalController);
});

