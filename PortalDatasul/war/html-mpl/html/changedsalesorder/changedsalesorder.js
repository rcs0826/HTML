define(['index',
        '/dts/mpl/js/utils/filters.js',
        '/dts/mpl/js/api/fch/fchman/fchmanproductionplan.js',
        '/dts/mpl/js/api/fch/fchman/fchmanproductionplanitem.js',
        '/dts/mpl/js/api/fch/fchmpl/fchmpl0001.js',
        '/dts/mpl/html/changedsalesorder/changedsalesorder-list.controller.js',
        '/dts/mpl/html/changedsalesorder/changedsalesorder-advancedsearch.controller.js'], function(index) {

    index.stateProvider
    
    .state('dts/mpl/changedsalesorder', {
        abstract: true,
        template: '<ui-view/>'
    })

    .state('dts/mpl/changedsalesorder.start', {
        url:'/dts/mpl/changedsalesorder/',
        controller:'mpl.changedsalesorder-list.controller',
        controllerAs: 'controller',
        templateUrl:'/dts/mpl/html/changedsalesorder/changedsalesorder.list.html'
    })
});