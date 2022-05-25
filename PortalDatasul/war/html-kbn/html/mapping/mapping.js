define([
    'index',
    '/dts/kbn/html/mapping/mapping.list.js',
    '/dts/kbn/html/flow/flow.list.js',
    '/dts/kbn/html/flow/flow.view.js',
    '/dts/kbn/html/flow/flow.batch.edit.js',
    '/dts/kbn/html/mappingcell/mappingcell.list.js'
], function(index) {
    var stateProvider = index.stateProvider;

    stateProvider.state('dts/kbn/mapping', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/mapping.start', {
        url: '/dts/kbn/mapping',
        controller: 'ekanban.mapping.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/mapping/mapping.list.html'
    });

    stateProvider.state('dts/kbn/mapping.view', {
        url: '/dts/kbn/mapping/:id',
        controller: 'ekanban.mapping.FlowList',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/flow/flow.list.html'
    });

    stateProvider.state('dts/kbn/mapping.flowview', {
        url: '/dts/kbn/mapping/flow/view/:id',
        controller: 'ekanban.mapping.FlowView',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/flow/flow.view.html'
    });

    stateProvider.state('dts/kbn/mapping.flowedit', {
        url: '/dts/kbn/mapping/flow/edit/:mappingId?flowId',
        controller: 'ekanban.mapping.FlowBatchEdit',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/flow/flow.batch.edit.html'
    });

    stateProvider.state('dts/kbn/mapping.cellview', {
        url: '/dts/kbn/mapping/cell/:id',
        controller: 'ekanban.mapping.CellList',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/mappingcell/mappingcell.list.html'
    });

});
