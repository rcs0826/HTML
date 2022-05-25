define(['index',
'/dts/hgp/html/hrb-exportBenefCompartRisco/controller/exportBenefCompartRiscoMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-exportBenefCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-exportBenefCompartRisco.start', {
                url: '/dts/hgp/hrb-exportBenefCompartRisco',
                controller: 'hrb.exportBenefCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-exportBenefCompartRisco/ui/exportBenefCompartRiscoMain.html'
            })                        
        
});


