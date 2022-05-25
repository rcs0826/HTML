define(['index',
    '/dts/hgp/html/hrc-transactionVsUserAssociative/transactionVsUserAssociativeFactory.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************

    userCopyController.$inject = ['$rootScope', '$scope', '$modalInstance',
                                  'hrc.transactionVsUserAssociative.Factory', 'TOTVSEvent'];
    function userCopyController($rootScope, $scope, $modalInstance, 
                                transactionVsUserAssociativeFactory, TOTVSEvent) {

        var _self = this;
        _self.fromUser = {};
        _self.toUser = {};
        _self.excludeTransactions = false;

        this.init = function () {
        
        };

        this.userCopy = function () {

            if (_self.excludeTransactions) {
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Atenção!',
                    text: 'As permissões dos usuários serão as mesmas, qualquer diferença será eliminada. Deseja continuar?',
                    cancelLabel: 'Não',
                    confirmLabel: 'Sim',
                    size: 'md',
                    callback: function (hasChooseYes) {
                        if (hasChooseYes != true) 
                            return;

                        transactionVsUserAssociativeFactory.userCopy(_self.excludeTransactions,
                                                                     _self.fromUser.cdUseridTransacao, 
                                                                     _self.toUser.cdUseridTransacao,
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
                transactionVsUserAssociativeFactory.userCopy(_self.excludeTransactions,
                                                             _self.fromUser.cdUseridTransacao, 
                                                             _self.toUser.cdUseridTransacao,
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

    index.register.controller('hrc.userCopyController', userCopyController);
});
