define(['index',
    '/dts/hgp/html/hrs-globalParameters/controller/globalParametersController.js',
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-globalParameters', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-globalParameters.start', {
                url: '/dts/hgp/hrs-globalParameters/?showAsTable',
                controller: 'hrs.globalParameters.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-globalParameters/ui/globalParametersMaintenance.html'
            })
            
            .state('dts/hgp/hrs-globalParameters.edit', {
                url: '/dts/hgp/hrs-globalParameters/edit',
                controller: 'hrs.globalParameters.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-globalParameters/ui/globalParametersMaintenance.html'
            })                            
});


