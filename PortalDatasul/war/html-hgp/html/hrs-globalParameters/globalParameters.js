define(['index',
    '/healthcare/hrs/html/globalParameters/controller/globalParametersController.js',
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/globalParameters', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/globalParameters.start', {
                url: '/healthcare/hrs/globalParameters/?showAsTable',
                controller: 'hrs.globalParameters.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/globalParameters/ui/globalParametersMaintenance.html'
            })
            
            .state('healthcare/hrs/globalParameters.edit', {
                url: '/healthcare/hrs/globalParameters/edit',
                controller: 'hrs.globalParameters.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/globalParameters/ui/globalParametersMaintenance.html'
            })                            
});


