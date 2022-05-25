define(['index',
    '/healthcare/hrc/html/paramrc/controller/paramrcController.js'], function (index) {

    index.stateProvider 

            .state('healthcare/hrc/paramrc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrc/paramrc.start', {
                url: '/healthcare/hrc/paramrc/?showAsTable',
                controller: 'hrc.paramrc.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/paramrc/ui/paramrcMaintenance.html'
            })         

            .state('healthcare/hrc/paramrc.edit', {
                url: '/healthcare/hrc/paramrc/edit',
                controller: 'hrc.paramrc.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/paramrc/ui/paramrcMaintenance.html'
            });             
});