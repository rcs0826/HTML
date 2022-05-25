define(['index',
    '/dts/hgp/html/hrc-transactionVsUserAssociative/transactionVsUserAssociativeFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    transactionCopyController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                         'hrc.transactionVsUserAssociative.Factory', 'TOTVSEvent'];
    function transactionCopyController($rootScope, $scope, $modalInstance, 
                                       transactionVsUserAssociativeFactory, TOTVSEvent) {

        var _self = this;
        _self.fromTransaction = {};
        _self.toTransaction = {};
        _self.excludeUsers = false;
        this.init = function () {
            
        };

        this.transactionCopy = function () {

            if (_self.excludeUsers) {
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Atenção!',
                    text: 'Os usuários cadastrados em ambas transações serão os mesmos, qualquer diferença será eliminada. Deseja continuar?', 
                    cancelLabel: 'Não',
                    confirmLabel: 'Sim',
                    size: 'md',
                    callback: function (hasChooseYes) {
                        if (hasChooseYes != true) 
                            return;

                        transactionVsUserAssociativeFactory.transactionCopy(_self.excludeUsers,
                                                                            _self.fromTransaction.cdTransacao, 
                                                                            _self.toTransaction.cdTransacao,
                            function (result) {
                                if(result.$hasError == true){
                                    return;
                                }

                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', title: 'Copiado com sucesso'
                                });                                 
                            });                        
                    }
                });
            }
            else{
                transactionVsUserAssociativeFactory.transactionCopy(_self.excludeUsers,
                                                                    _self.fromTransaction.cdTransacao, 
                                                                    _self.toTransaction.cdTransacao,
                    function (result) {
                        if(result.$hasError == true){
                            return;
                        }

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success', title: 'Copiado com sucesso'
                        });                                 
                    });      
            }       
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }

    index.register.controller('hrc.transactionCopyController', transactionCopyController);
});
