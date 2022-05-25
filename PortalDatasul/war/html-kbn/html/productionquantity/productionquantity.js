define(['index',
		'/dts/kbn/html/productionquantity/productionquantity.list.js'
], function(index) {

    var stateProvider = index.stateProvider;

    stateProvider.state('dts/kbn/productionquantity', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/productionquantity.start', {
        url: '/dts/kbn/productionquantity',
        controller: 'ekanban.productionquantity.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/productionquantity/productionquantity.list.html'
    });

});
