define(['index',
'/healthcare/hrb/html/importBenefCompartRisco/controller/importBenefCompartRiscoMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/importBenefCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/importBenefCompartRisco.start', {
                url: '/healthcare/hrb/importBenefCompartRisco',
                controller: 'hrb.importBenefCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/importBenefCompartRisco/ui/importBenefCompartRiscoMain.html'
            })                        
        
});


