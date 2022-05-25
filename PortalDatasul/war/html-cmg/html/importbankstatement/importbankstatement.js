/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index', '/dts/cmg/js/cmg-utils.js', '/dts/utb/js/utb-utils.js', '/dts/cmg/html/importbankstatement/importbankstatement-edit-services.js', '/dts/cmg/html/importbankstatement/importbankstatement-list-services.js', '/dts/cmg/html/importbankstatement/importbankstatement-report-services.js', 'css!/dts/cmg/assets/css/importbankstatement.css'], function(index) {

    'use strict';

    index.stateProvider
    .state('dts/cmg/importbankstatement', {
        abstract: true,
        template: '<ui-view/>'
    })
    // Definição do state de listagem
    .state('dts/cmg/importbankstatement.start', {
        url: '/dts/cmg/importbankstatement/',
        controller: 'cmg.importbankstatement.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/cmg/html/importbankstatement/importbankstatement.list.html'
    })
    // Definição do state de criação de um novo registro
    .state('dts/cmg/importbankstatement.new', {
        url: '/dts/cmg/importbankstatement/new',
        controller: 'cmg.importbankstatement.EditCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/cmg/html/importbankstatement/importbankstatement.edit.html'
    })
    // Definição do state de alteração de um registro
    .state('dts/cmg/importbankstatement.edit', {
        url: '/dts/cmg/importbankstatement/edit/:id',
        controller: 'cmg.importbankstatement.EditCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/cmg/html/importbankstatement/importbankstatement.edit.html'
    })
    // Definição do state de execução
    .state('dts/cmg/importbankstatement.report', {
        url: '/dts/cmg/importbankstatement/report/:id',
        controller: 'cmg.importbankstatement.ReportCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/cmg/html/importbankstatement/importbankstatement.report.html'
    });
});
