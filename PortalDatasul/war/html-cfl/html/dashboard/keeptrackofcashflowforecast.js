define(['index',
    '/dts/cfl/js/cfl-components.js',
    '/dts/cfl/js/zoom/padr-fluxo-cx.js',
    '/dts/cfl/js/zoom/unid-control-financ.js',
    '/dts/cfl/js/userpreference.js',
    '/dts/cfl/js/api/keeptrackofcashflow.js'
], function (index) {

    dashboardKeepTrackOfCashFlowForecast.$inject = ['$rootScope', '$filter', '$q', 'cfl.keeptrackofcashflow.Factory', 'TOTVSEvent', 'userPreference'];

    function dashboardKeepTrackOfCashFlowForecast($rootScope, $filter, $q, service, TOTVSEvent, userPreference) {

        var controller = this;

        controller.seriesForecast = [];
        controller.listResult = [];
        controller.stats = [];
        controller.options = [];

        controller.tamDiv = undefined;
        controller.tamGrafico = 500;
        controller.innerWidth = window.innerWidth;

        if (controller.tamDiv >= 920) {
            controller.tamGrafico = 900;
        }

        controller.loadData = function () {

            controller.listResult = [];

            service.getCashFlowForecast(controller.options.visualizationPattern, controller.options.financialControlUnity, function (result) {

                if (result) {

                    angular.forEach(result, function (value) {
                        controller.listResult.push(value);
                    });

                    controller.createData(result);

                }
            });
        };

        this.createData = function (result) {

            var i,
                dt = undefined,
                stepDate = 1;

            controller.stats = [];

            for (i = 0; i < result.length; i += 1) {

                dt = controller.formatDate(result[i].forecastBalanceDate);

                controller.stats.push({
                    date: dt,
                    value: result[i].forecastFinalBalance
                });

                if ((result.length >= 40) && (result.length < 80)) {
                    stepDate = 5;
                } else if (result.length >= 80) {
                    stepDate = 10;
                }
            }

            $("#chart").kendoChart({
                dataSource: {
                    data: controller.stats
                },
                series: [{
                    type: "line",
                    color: "#356FA2",
                    aggregate: "avg",
                    field: "value",
                    categoryField: "date"
                }],
                valueAxis: {
                    labels: {
                        format: "{0:n2}"
                    }
                },
                categoryAxis: {
                    labels: {
                        rotation: "auto",
                        step: stepDate,
                        skip: 0
                    },
                    baseUnit: ""
                },
                chartArea: {
                    width: controller.tamGrafico
                },
                tooltip: {
                    visible: "true",
                    template: "#= category #: #=kendo.format('{0:n2}', value)#"
                }
            });

        };

        this.formatDate = function (value) {
            var filterDate = $filter('date'),
                dateFormat = $rootScope.i18n('l-date-format', undefined, 'dts/acr');
            return filterDate(value, dateFormat);
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

            var params = [{ "type": "character", "value": controller.options.visualizationPattern },
            { "type": "character", "value": controller.options.financialControlUnity },
            { "type": "character", "value": "Monit2" }];
            cProgram = "";
            cProgram = "fch/fchcfl/fchcfl206.p";
            msgAux = "";
            msgAux = $rootScope.i18n('l-inquire-cash-flow', [], 'dts/cfl') + ' - CFL206';
            controller.openProgress(cProgram, "fchcfl206.p", params, msgAux);

        };

        controller.openProgress = function (path, program, param, msgAux) {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'info',
                title: $rootScope.i18n('msg-opening-program', [msgAux], 'dts/cfl')
            });
            $rootScope.openProgramProgress(path, program, param);

        }

        this.applyConfig = function () {

            $q.all([userPreference.setPreference('cashFlowForecast.visualizationPattern', controller.options.visualizationPattern),
            userPreference.setPreference('cashFlowForecast.financialControlUnity', controller.options.financialControlUnity)])
                .then(function () {
                    controller.loadData();
                    controller.listShow = true;
                    controller.chartsShow = false;
                });

        };

        this.showConfig = function () {

            this.listShow = false;
            this.chartsShow = false;

        };

        this.showList = function () {

            this.listShow = true;
            this.chartsShow = false;

        };

        this.showCharts = function () {

            this.chartsShow = true;
            this.listShow = false;

        };

        this.listShow = true;
        this.chartsShow = false;

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {

            $q.all([userPreference.getPreference('cashFlowForecast.visualizationPattern'),
            userPreference.getPreference('cashFlowForecast.financialControlUnity')])
                .then(function (data) {

                    var visualizationPattern = controller.options.visualizationPattern;
                    var financialControlUnity = controller.options.financialControlUnity;

                    if (data[0].prefValue && data[0].prefValue != "undefined") {
                        visualizationPattern = data[0].prefValue;
                    }
                    if (data[1].prefValue && data[1].prefValue != "undefined") {
                        financialControlUnity = data[1].prefValue;
                    }

                    controller.options.visualizationPattern = visualizationPattern;
                    controller.options.financialControlUnity = financialControlUnity;

                    controller.loadData();
                });

        };

        if ($rootScope.currentuserLoaded) { controller.init(); }

    }//function dashboardKeepTrackOfCashFlowForecast(loadedModules, userMessages)

    index.register.controller('cfl.dashboard.keeptrackofcashflowforecast.Controller', dashboardKeepTrackOfCashFlowForecast);
});