define(['index',
    '/healthcare/hrb/html/beneficiarioCompartRiscoIntercam/controller/listController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/beneficiarioCompartRiscoIntercam', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/beneficiarioCompartRiscoIntercam.start', {
                url: '/healthcare/hrb/beneficiarioCompartRiscoIntercam/?showAsTable',
                controller: 'hrb.beneficiarioCompartRiscoIntercamList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/beneficiarioCompartRiscoIntercam/ui/list.html'
            })
});


