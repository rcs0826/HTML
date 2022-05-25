define([
    'index',
    '/dts/mcd/html/relatpricetableestab/relatpricetableestab-services.js'
], function (index) {

    index.stateProvider
        .state('dts/mcd/relatpricetableestab', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('dts/mcd/relatpricetableestab.start', {
            url: '/dts/mcd/relatpricetableestab',
            controller: 'mcd.relatpricetableestab.list.control',
            controllerAs: 'controller',
            templateUrl: '/dts/mcd/html/relatpricetableestab/relatpricetableestab.list.html'
        })        
        .state('dts/mcd/relatpricetableestab.edit', {
            url: '/dts/mcd/relatpricetableestab/edit/:estabel',
            controller: 'mcd.relatpricetableestab.edit.control',
            controllerAs: 'controller',
            templateUrl: '/dts/mcd/html/relatpricetableestab/relatpricetableestab.edit.html'
        })
});
