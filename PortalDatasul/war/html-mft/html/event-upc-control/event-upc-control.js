define([
    'index', '/dts/mft/html/event-upc-control/event-upc-control-controller.js', '/dts/mft/js/api/event-upc-control.js'
], function (index) {
    index.stateProvider
        .state('dts/mft/event-upc-control', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('dts/mft/event-upc-control.start', {
            url: '/dts/mft/event-upc-control/',
            controller: 'mft.event-upc-control.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mft/html/event-upc-control/event-upc-control-list.html'
        })
        .state('dts/mft/event-upc-control.new', {
            url: '/dts/mft/event-upc-control/new',
            controller: 'mft.event-upc-control-add-edit.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mft/html/event-upc-control/event-upc-control-add-edit.html'
        })
        .state('dts/mft/event-upc-control.edit', {
            url: '/dts/mft/event-upc-control/edit/:codProgram',
            controller: 'mft.event-upc-control-add-edit.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mft/html/event-upc-control/event-upc-control-add-edit.html'
        })
});