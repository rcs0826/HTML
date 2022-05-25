define(['index',
'/dts/hgp/html/hfp-contabilizacaoFaturamento/controller/contabilizacaoFaturamentoMainController.js',
'/dts/hgp/html/global/gpsScheduleTotvs.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hfp-contabilizacaoFaturamento', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hfp-contabilizacaoFaturamento.start', {
                url: '/dts/hgp/hfp-contabilizacaoFaturamento',
                controller: 'hfp.contabilizacaoFaturamentoMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hfp-contabilizacaoFaturamento/ui/contabilizacaoFaturamentoMain.html'
            })

});
