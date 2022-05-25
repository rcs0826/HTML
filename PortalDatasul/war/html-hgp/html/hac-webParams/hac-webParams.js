define(['index',
    '/dts/hgp/html/hac-webParams/controller/webParamsController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hac-webParams', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hac-webParams.start', {
                url: '/dts/hgp/hac-webParams/?showAsTable',
                controller: 'hac.webParams.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hac-webParams/ui/webParamsDetail.html'
            })         

            .state('dts/hgp/hac-webParams.edit', {
                url: '/dts/hgp/hac-webParams/edit',
                controller: 'hac.webParams.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hac-webParams/ui/webParamsMaintenance.html'
            });             
});