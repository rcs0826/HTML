define(['index',
        '/dts/mmv/html/budget/orcamento-anual.js'
       ], function(index) {

    index.stateProvider

        .state('dts/mmv/budget', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/mmv/budget.start', {
            url:'/dts/mmv/budget/',
            controller:'mmv.budget.OrcamentoCtrl',
            controllerAs: 'orcamentoCtrl',
            templateUrl:'/dts/mmv/html/budget/orcamento.anual.html'
        })

});
