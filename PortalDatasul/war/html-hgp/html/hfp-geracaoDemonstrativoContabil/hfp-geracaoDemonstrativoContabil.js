define(['index',
'/dts/hgp/html/hfp-geracaoDemonstrativoContabil/controller/geracaoDemonstrativoContabilMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'


], function (index) {

    index.stateProvider

            .state('dts/hgp/hfp-geracaoDemonstrativoContabil', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hfp-geracaoDemonstrativoContabil.start', {
                url: '/dts/hgp/hfp-geracaoDemonstrativoContabil',
                controller: 'hfp.geracaoDemonstrativoContabilMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hfp-geracaoDemonstrativoContabil/ui/geracaoDemonstrativoContabilMain.html'
            }) 

});


