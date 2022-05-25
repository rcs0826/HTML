define(['index',
'/healthcare/hrb/html/importRetornoBenefCompartRisco/controller/importRetornoBenefCompartRiscoMainController.js',
'/healthcare/shared/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/importRetornoBenefCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/importRetornoBenefCompartRisco.start', {
                url: '/healthcare/hrb/importRetornoBenefCompartRisco',
                controller: 'hrb.importRetornoBenefCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/importRetornoBenefCompartRisco/ui/importRetornoBenefCompartRiscoMain.html'
            })                        
        
});


