define(['index',
    '/dts/hgp/html/js/global/healthcare-config.js',
    '/dts/hgp/html/hrc-workarea/workareaController.js'], function (index) {

    index.stateProvider

            .state('dts/hgp/hrc-workarea', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-workarea.start', {
                url: '/dts/hgp/hrc-workarea/',
                controller: 'hrc.workarea.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-workarea/workarea.html'
            })
});
