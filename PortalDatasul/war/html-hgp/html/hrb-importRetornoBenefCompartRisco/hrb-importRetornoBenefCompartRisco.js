define(['index',
'/dts/hgp/html/hrb-importRetornoBenefCompartRisco/controller/importRetornoBenefCompartRiscoMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-importRetornoBenefCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-importRetornoBenefCompartRisco.start', {
                url: '/dts/hgp/hrb-importRetornoBenefCompartRisco',
                controller: 'hrb.importRetornoBenefCompartRiscoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-importRetornoBenefCompartRisco/ui/importRetornoBenefCompartRiscoMain.html'
            })                        
        
});


