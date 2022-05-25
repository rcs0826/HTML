define(['index',
    '/dts/cmg/js/cmg-components.js',
    '/dts/cmg/js/api/keeptrackofstatementimportations.js'
], function (index) {

    dashboardKeepTrackOfStatementImportationsCtrl.$inject = ['$rootScope', '$scope', '$location', 'cmg.dashboard.keeptrackofstatementimportations.Factory', 'TOTVSEvent'];

    function dashboardKeepTrackOfStatementImportationsCtrl($rootScope, $scope, $location, service, TOTVSEvent) {

        var controller = this;

        controller.listResult = [];
        controller.listOfBanks = [];
        controller.model = undefined;

        controller.loadData = function () {

            service.getStatementImportations(function (result) {
                if (result) {

                    controller.listResult = result;

                    angular.forEach(result, function (value) {
                        controller.listOfBanks.push(value);

                    });

                }
            });
        };

        this.openCMG705 = function () {
            openProgressCMG705();
        };

        this.openImportBankStatement = function () {

            var url = '/dts/cmg/importbankstatement/';

            $scope.safeApply(function () {
                $location.path(url);
            });

        };

        var openProgressCMG705 = function () {

            var params = [];
            cProgram = "";
            cProgram = "fch/fchcmg/fchcmg705.p";
            msgAux = "";
            msgAux = $rootScope.i18n('l-cash-closing', [], 'dts/cmg') + ' - CMG705';
            controller.openProgress(cProgram, "fchcmg705.p", params, msgAux);

        };

        controller.openProgress = function (path, program, param, msgAux) {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'info',
                title: $rootScope.i18n('msg-opening-program', [msgAux], 'dts/cmg')
            });
            $rootScope.openProgramProgress(path, program, param);

        }

        $scope.safeApply = function (fn) {
            var phase = (this.$root ? this.$root.$$phase : undefined);

            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        this.applyConfig = function () {

            var result = [];
            controller.listResult = [];
            result = controller.selectedItems.getSelectedItems();

            angular.forEach(result, function (value) {
                controller.listResult.push(value);
            });

            controller.listShow = true;
            controller.configShow = false;

        };

        this.showConfig = function () {

            this.listShow = false;
            this.configShow = true;

        };

        this.showList = function () {

            this.listShow = true;
            this.configShow = false;

        };

        this.listShow = true;
        this.chartsShow = false;

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {
            controller.loadData();
        };

        if ($rootScope.currentuserLoaded) { controller.init(); }

    }//function dashboardKeepTrackOfBalancesByCheckingAccountCtrl(loadedModules, userMessages)

    index.register.controller('cmg.dashboard.keeptrackofstatementimportations.Controller', dashboardKeepTrackOfStatementImportationsCtrl);
});
