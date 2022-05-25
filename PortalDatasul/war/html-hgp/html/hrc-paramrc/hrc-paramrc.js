define(['index',
    '/dts/hgp/html/hrc-paramrc/controller/paramrcController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-paramrc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-paramrc.start', {
                url: '/dts/hgp/hrc-paramrc/?showAsTable',
                controller: 'hrc.paramrc.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-paramrc/ui/paramrcMaintenance.html'
            })         

            .state('dts/hgp/hrc-paramrc.edit', {
                url: '/dts/hgp/hrc-paramrc/edit',
                controller: 'hrc.paramrc.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-paramrc/ui/paramrcMaintenance.html'
            });             
});