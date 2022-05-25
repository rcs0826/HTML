define(['index',
    '/dts/hgp/html/hrb-beneficiarioCompartRiscoIntercam/controller/listController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-beneficiarioCompartRiscoIntercam', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-beneficiarioCompartRiscoIntercam.start', {
                url: '/dts/hgp/hrb-beneficiarioCompartRiscoIntercam/?showAsTable',
                controller: 'hrb.beneficiarioCompartRiscoIntercamList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRiscoIntercam/ui/list.html'
            })
});


