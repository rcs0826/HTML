define(['index',
		'/dts/kbn/html/inventoryadjustment/inventoryadjustment.list.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/inventoryadjustment', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/inventoryadjustment.start', {
        url: '/dts/kbn/inventoryadjustment',
        controller: 'ekanban.inventoryadjustment.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/inventoryadjustment/inventoryadjustment.list.html'
    });

});
