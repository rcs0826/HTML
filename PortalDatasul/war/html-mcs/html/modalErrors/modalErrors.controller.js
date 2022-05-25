define(['index',
        'filter-i18n'], function (index) {

    modalErrors.$inject = ['$rootScope', 
                                    '$scope', 
                                    '$modalInstance', 
                                    'i18nFilter', 
                                    'model' ];

    function modalErrors($rootScope, 
                         $scope, 
                         $modalInstance, 
                         i18n, 
                         model) {
        var self = this;

        self.model = JSON.parse(JSON.stringify(model));
        
        self.classe = ["glyphicon glyphicon-exclamation-sign local-error", 
                       "glyphicon glyphicon-alert local-alert",
                       'glyphicon glyphicon-ok local-success'];
                 
        self.apply = function () {
            $modalInstance.close(self.model);
        }
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
             $modalInstance.dismiss('cancel');
        });
    };

    index.register.controller('mcs.modalErrors.controller', modalErrors);
});