define(['index',
'/dts/hgp/html/hrb-importBenefCompartRisco/controller/importBenefCompartRiscoMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-importBenefCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-importBenefCompartRisco.start', {
                url: '/dts/hgp/hrb-importBenefCompartRisco',
                controller: 'hrb.importBenefCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-importBenefCompartRisco/ui/importBenefCompartRiscoMain.html'
            })                        
        
});


