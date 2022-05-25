define(['index',
    '/dts/cfl/js/cfl-components.js',
    '/dts/cfl/js/zoom/padr-fluxo-cx.js',
    '/dts/cfl/js/zoom/unid-control-financ.js',
    '/dts/cfl/js/api/keeptrackofcashflow.js',
    '/dts/cfl/js/userpreference.js', 
], function (index) {

    dashboardKeepTrackOfCashFlowCtrl.$inject = ['$rootScope', '$scope', '$location', 'cfl.keeptrackofcashflow.Factory', 'TOTVSEvent', '$filter', 'userPreference', '$q'];

    function dashboardKeepTrackOfCashFlowCtrl($rootScope, $scope, $location, service, TOTVSEvent, $filter, userPreference, $q) {

        var controller = this;

        controller.listResult = [];
        controller.listCashFlow = [];
        controller.model = undefined;
        controller.options = [{
            visualizationPattern: "",
            financialControlUnity: ""
        }];

        var today = new Date(),
        yesterday = (function(d){ d.setDate(d.getDate()-1); return d})(new Date),
        dateFormat = $rootScope.i18n('l-date-format', [], 'dts/cfl');

        controller.realizedDate = $filter('date')((yesterday.getTime()), dateFormat).toString();
        controller.forecastDate = $filter('date')((today.getTime()), dateFormat).toString();


        $q.all([userPreference.getPreference('keepTrackOfCashFlow.visualizationPattern'),
                userPreference.getPreference('keepTrackOfCashFlow.financialControlUnity')])
        .then(function(data) {

            if (data[0].prefValue && data[0].prefValue != undefined) {
                controller.options.visualizationPattern = data[0].prefValue;
            }					
            if (data[1].prefValue && data[1].prefValue != undefined) {
                controller.options.financialControlUnity = data[1].prefValue;
            }
            
            controller.loadData();
        });

        controller.loadData = function () {

            service.getCashFlow(controller.options.visualizationPattern, controller.options.financialControlUnity, function (result) {
                
                if (result) {

                    controller.listResult = result;

                    controller.listCashFlow.push({
                        name: $rootScope.i18n('l-start-balance', [], 'dts/cfl'),
                        realized: result[0].realizedInitialBalance,
                        forecast: result[0].forecastInitialBalance,
                        economicIndicatorAbrev: result[0].economicIndicatorAbrev
                    });

                    controller.listCashFlow.push({
                        name: $rootScope.i18n('l-inputs', [], 'dts/cfl'),
                        realized: result[0].realizedReceiptTotal,
                        forecast: result[0].forecastReceiptTotal,
                        economicIndicatorAbrev: result[0].economicIndicatorAbrev
                    });

                    controller.listCashFlow.push({
                        name: $rootScope.i18n('l-outputs', [], 'dts/cfl'),
                        realized: result[0].realizedIssueTotal,
                        forecast: result[0].forecastIssueTotal,
                        economicIndicatorAbrev: result[0].economicIndicatorAbrev
                    });

                    controller.listCashFlow.push({
                        name: $rootScope.i18n('l-end-balance', [], 'dts/cfl'),
                        realized: result[0].realizedFinalBalance,
                        forecast: result[0].forecastFinalBalance,
                        economicIndicatorAbrev: result[0].economicIndicatorAbrev
                    });

                }
            });
        };

        this.openCFL700 = function () {
            openProgressCFL700();
        };

        this.openCFL206 = function () {
            openProgressCFL206();
        };

        var openProgressCFL700 = function () {

            var params = [];
            cProgram = "";
            cProgram = "fch/fchcfl/fchcfl700.p";
            msgAux = "";
            msgAux = $rootScope.i18n('l-maintenance-cash-flow', [], 'dts/cfl') + ' - CMG700';
            controller.openProgress(cProgram, "fchcfl700.p", params, msgAux);

        };

        var openProgressCFL206 = function () {

            var params = [{"type": "character", "value": controller.options.visualizationPattern}, 
                          {"type": "character", "value": controller.options.financialControlUnity},
                          {"type": "character", "value": "Monit1"}];
            cProgram = "";
            cProgram = "fch/fchcfl/fchcfl206.p";
            msgAux = "";
            msgAux = $rootScope.i18n('l-inquire-cash-flow', [], 'dts/cfl') + ' - CMG206';
            controller.openProgress(cProgram, "fchcfl206.p", params, msgAux);

        };

        controller.openProgress = function (path, program, param, msgAux) {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'info',
                title: $rootScope.i18n('msg-opening-program', [msgAux], 'dts/cfl')
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

            $q.all([userPreference.setPreference('keepTrackOfCashFlow.visualizationPattern', controller.options.visualizationPattern),
                    userPreference.setPreference('keepTrackOfCashFlow.financialControlUnity', controller.options.financialControlUnity)])
				.then(function () {
                    controller.listResult = [];
                    controller.listCashFlow = [];
					controller.loadData();					
                    controller.listShow = true;
                    controller.chartsShow = false;
                    controller.configShow = false;
			});

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

    }//function dashboardKeepTrackOfCashFlow(loadedModules, userMessages)

    index.register.controller('cfl.dashboard.keeptrackofcashflow.Controller', dashboardKeepTrackOfCashFlowCtrl);
});
