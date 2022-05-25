/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', '/dts/utb/js/utb-utils.js', '/dts/cmg/html/inquireexchangevariation/inquireexchangevariation-list-services.js'], function(index) {

    'use strict';

    index.stateProvider
    .state('dts/cmg/inquireexchangevariation', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/cmg/inquireexchangevariation.start', {
        url: '/dts/cmg/inquireexchangevariation/',
        controller: 'cmg.inquireexchangevariation.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/cmg/html/inquireexchangevariation/inquireexchangevariation.list.html'
    });
});
