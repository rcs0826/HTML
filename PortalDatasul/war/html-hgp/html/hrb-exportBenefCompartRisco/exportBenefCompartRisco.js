define(['index',
'/healthcare/hrb/html/exportBenefCompartRisco/controller/exportBenefCompartRiscoMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/exportBenefCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/exportBenefCompartRisco.start', {
                url: '/healthcare/hrb/exportBenefCompartRisco',
                controller: 'hrb.exportBenefCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/exportBenefCompartRisco/ui/exportBenefCompartRiscoMain.html'
            })                        
        
});


