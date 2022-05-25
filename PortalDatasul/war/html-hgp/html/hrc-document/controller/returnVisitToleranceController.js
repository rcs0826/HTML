define(['index',
    '/dts/hgp/html/hrc-document/documentFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    returnVisitToleranceController.$inject = ['$scope', '$modalInstance',
                                              'hrc.document.Factory', 'disclaimers', 'document', '$rootScope', 'TOTVSEvent'];
    function returnVisitToleranceController($scope, $modalInstance, documentFactory, disclaimers, document, $rootScope, TOTVSEvent) {

        var _self = this;
        
        $scope.StringTools = StringTools;
        _self.documentValues = [];
        _self.disclaimers = disclaimers;
        _self.documentKey = null;
        _self.periodKey     = "";
        _self.lgOtherErrorClasses = false;
        _self.lgSimulation = false;

        this.init = function () {
            var arrayLength = _self.disclaimers.length - 1;
            var lgFoundPeriod = false;
            var periodYear    = new Date().getFullYear();
            var periodNumber  = 0;
            
            for (var i = arrayLength ; i >= 0 ; i--) {
                 
                if (_self.disclaimers[i].property === 'nrPerref'){
                    periodNumber  = _self.disclaimers[i].value; 
                    lgFoundPeriod = true;                  
                }else{
                    if(_self.disclaimers[i].property === 'dtAnoref'){
                        periodYear = _self.disclaimers[i].value;
                        if(lgFoundPeriod){
                           break; 
                        }
                    }
                }
            }
            if(!lgFoundPeriod){

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', 
                    title: 'Para esse processo deve-se informar o filtro por período do revisão de contas'
                });
                $modalInstance.dismiss('cancel');
            }else{
                _self.periodKey=periodYear + "/" + StringTools.fill(periodNumber, '0', 3);
            }   
        };
        this.applyReturnVisitTolerance = function () {
           var parameters = [{property: 'lgOutrasClassesErro', value: _self.lgOtherErrorClasses},
                             {property: 'lgSimulacao', value: _self.lgSimulation}];

          
            documentFactory.batchApplyReturnVisitTolerance(disclaimers, parameters, function (result) {
                if (result) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'info', 
                        title: 'Execução agendada com sucesso, número do pedido: ' + result.nrPedido
                    });

                    $modalInstance.close(result);
                }
            });
           
        };
        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });
    }
    index.register.controller('hrc.returnVisitTolerance.Control', returnVisitToleranceController);
});

