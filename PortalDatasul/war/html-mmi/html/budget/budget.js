define(['index',
        '/dts/mmi/html/budget/orcamento-anual.js'
       ], function(index) {

    index.stateProvider

        .state('dts/mmi/budget', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmi/budget.start', {
            url:'/dts/mmi/budget/',
            controller:'mmi.budget.OrcamentoCtrl',
            controllerAs: 'orcamentoCtrl',
            templateUrl:'/dts/mmi/html/budget/orcamento.anual.html'
        })

});
