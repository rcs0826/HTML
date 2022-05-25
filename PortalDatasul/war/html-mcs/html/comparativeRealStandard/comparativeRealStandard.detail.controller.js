define(['index',
        'filter-i18n'], function (index) {

    detailController.$inject = ['$rootScope', 
                                '$scope', 
                                '$modalInstance', 
                                'i18nFilter',
                                'model'];

    function detailController($rootScope, 
                              $scope, 
                              $modalInstance, 
                              i18n,
                              model) {
        var self = this;

        self.detail = function(value) {
            var template = "";

            if (!value) return;
            var template = '<span> <a target="_blank" href="#/dts/mce/ce0814/detail/' + value.nrTrans + '/' + model.moeda + '/' + model.tipoMedio + '">' + i18n('l-to-detail') + '</a></span>';
            return template;
        }

        self.templateTipoMovimento = function (param) {

            var template = "";

            if (!param) return;

            if (param.tipoTrans == 1) {
                template = '<label style="color:green">' + i18n('l-document-in') + '</label>';
            } else {
                template = '<label style="color:red"> ' + i18n('l-document-out') + ' </label>';
            }

            return template;
        };
        
        self.templateTipoReporte = function (param) {

            var template = "";

            if (!param) return;

            if (param.tipoTrans == 1) {
                template = '<label style="color:green">' + param.ctipoTrans + '</label>';
            } else {
                template = '<label style="color:red"> ' + param.ctipoTrans + ' </label>';
            }

            return template;
        };

        self.close = function () {
            $modalInstance.dismiss('cancel');
        }

        self.init = function() {
            if (model.type == 0) { // Habilita Grid MAT
                self.enableGridMat = true;
            } else if (model.type == 1) { // Habilita Grid GGF
                self.enableGridGgf = true;
            } else if (model.type == 2) { //Habilita grid MOB
                self.enableGridMob = true;
            } else { // Habilita Grid Ordens
                self.enableGridOrdem = true;
            } 

            self.title = model.title;

            self.gridOptions = model.gridOptions;
            self.gridData = model.gridData;
        }

        self.init();
        
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
             $modalInstance.dismiss('cancel');
        });
    };

    index.register.controller('mcs.comparativeRealStandard.detail.controller', detailController);
});