/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', '/dts/utb/js/utb-utils.js', '/dts/hub/html/paramfncproduct/paramfncproduct-list-services.js', 'css!/dts/hub/html/paramfncproduct/assets/css/paramfncproduct.css'], function(index) {
    'use strict';
    index.stateProvider.state('dts/hub/paramfncproduct', {
        abstract: true,
        template: '<ui-view/>'
    }).state('dts/hub/paramfncproduct.start', {
        url: '/dts/hub/paramfncproduct/',
        controller: 'hub.paramfncproduct.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/hub/html/paramfncproduct/paramfncproduct.list.html'
    });
});