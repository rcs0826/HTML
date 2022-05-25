define(['index',
    '/dts/hgp/html/hrs-situation/situationFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-gru/gruFactory.js',
], function (index) {

    abiAnalysisAttendanceDataController.$inject = ['$rootScope', '$scope','$modalInstance', '$location',
                                                   'cdProtocoloAbi', 'cdProtocoloAih', 'TOTVSEvent', 
                                                   'hrs.abiAnalysisAttendance.Factory', 'hrs.gru.Factory','hrs.situation.Factory', 'idPermissao'];
    function abiAnalysisAttendanceDataController($rootScope, $scope, $modalInstance, $location,
                                                 cdProtocoloAbi, cdProtocoloAih, TOTVSEvent, 
                                                 abiAnalysisAttendanceFactory, gruFactory, situationFactory, idPermissao) {

        var _self = this;
        _self.model = {}; 
        
        _self.listItemInfoClasses2col = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.listItemInfoClasses3col = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClasses4col = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.listItemInfoClasses6col = "col-sm-2 col-md-2 col-lg-2 col-sm-height";
        _self.idPermissao = idPermissao;
        
        this.cleanModel = function (){
            _self.abiAnalysisAttendance = {};           
        }
        
        this.save = function () { 
            abiAnalysisAttendanceFactory.saveAttendanceData(true, _self.abiAnalysisAttendance,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }
                    
                    result = result[0];
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Dados salvos com sucesso'
                    });

                    $modalInstance.dismiss('cancel');

                    //Salva e limpa o model para um nova inclusao
                    /*if(isSaveNew){
                        _self.cleanModel();
                        _self.cleanjustificationInputFields();
                        if(_self.action != 'INSERT'){                            
                            $state.go($state.get('dts/hgp/hrs-justification.new')); 
                        }
                    //Salva e fecha a tela
                    }else if(isSaveClose){
                        _self.invalidateJustification(result);

                        appViewService.removeView({active: true,
                                                   name  : 'Manutenção Justificativas de Impugnação',
                                                   url   : _self.currentUrl});  
                    //Salva e redireciona para o edit do item incluido
                    }else{
                        $state.go($state.get('dts/hgp/hrs-justification.edit'), 
                                             {idJustificativa: result.idJustificativa});
                    }*/
            });
            
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function init() {

            _self.currentUrl = $location.$$path;
            _self.cleanModel();

            situationFactory.getSituationByFilter('', 0, 0, true, [], 
                function (result) {
                    _self.listOfSituation = result;
                    for(var i = 0; i < _self.listOfSituation.length; i++){
                        var situation = _self.listOfSituation[i];
                        situation.value = situation.nmSituacao;
                        situation.label = situation.nmSituacao;
                    }

                    if (!angular.isUndefined(cdProtocoloAbi) 
                    &&  !angular.isUndefined(cdProtocoloAih)){
                        
                        abiAnalysisAttendanceFactory.prepareDataToMaintenanceWindow(cdProtocoloAbi, cdProtocoloAih,             
                            function (result) {
                                if (result) {
                                    angular.forEach(result, function (value) {
                                        _self.abiAnalysisAttendance = value;
                                    });
                                }
                            }.bind(this));
                    }
                }); 

            gruFactory.getGruByFilter('', 0, 0, true, [], 
                function (result) {
                    _self.listOfGru = result;
                    var gru;
                    var str;
                    for(var i = 0; i < _self.listOfGru.length; i++){
                        gru = _self.listOfGru[i];
                        gru.value = gru.cdRecolhimentoGru;

                        str = gru.dsObservacaoGru;
                        gru.label = gru.cdRecolhimentoGru + " - " + str.substring(1,20);
                    }
                }
            );
        };

        

        $scope.$watch('$viewContentLoaded', function () {   
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceDataController);
    }

    index.register.controller('hrs.abiAnalysisAttendData.Control', abiAnalysisAttendanceDataController);
});


