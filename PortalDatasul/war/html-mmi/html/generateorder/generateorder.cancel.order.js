define(['index',
        '/dts/mmi/js/api/fch/fchmip/fchmipservicerequest.js'
], function(index) {

    generateOrderCancelCtrl.$inject = [ '$modalInstance',
                                        '$scope',
                                        'model',
                                        '$rootScope',
                                        'TOTVSEvent',
                                        'fchmip.fchmipservicerequest.Factory'
    ];

    function generateOrderCancelCtrl ( $modalInstance,
                                        $scope,
                                        model,
                                        $rootScope,
                                        TOTVSEvent,
                                        fchmipservicerequest){

        var cancelCtrl = this;
        cancelCtrl.model = model;

        cancelCtrl.init = function(){
            cancelCtrl.list = cancelCtrl.model;
        }

        cancelCtrl.cancelamento = function() {
            var param = {};
            param['tt-solic-serv'] = [];

            cancelCtrl.list.forEach(function(obj){
                param['tt-solic-serv'].push({'nr-soli-serv': obj['nr-soli-serv']});
            });

            param.ttJustificativa = {'justificativa':cancelCtrl.justificativa};

            fchmipservicerequest.cancelaSolicitacoesServico(param, function(result){
                if(cancelCtrl.justificativa) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-cancellation-of-service-request'),
                        detail: $rootScope.i18n('l-request-canceled-successfully')
                    });

                    $modalInstance.close();
                }
            });
        }

        cancelCtrl.init();

        cancelCtrl.close = function () {
            $modalInstance.dismiss();
        }
    }

    index.register.controller('mmi.generateorder.CancelCtrl', generateOrderCancelCtrl);

});