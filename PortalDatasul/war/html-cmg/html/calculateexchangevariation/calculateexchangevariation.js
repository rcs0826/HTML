/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', '/dts/utb/js/utb-utils.js', '/dts/cmg/html/calculateexchangevariation/calculateexchangevariation-report-services.js'], function(index) {

    'use strict';

    index.stateProvider
    .state('dts/cmg/calculateexchangevariation', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/cmg/calculateexchangevariation.start', {
        url: '/dts/cmg/calculateexchangevariation/',
        controller: 'cmg.calculateexchangevariation.ReportCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/cmg/html/calculateexchangevariation/calculateexchangevariation.report.html'
    });
});
