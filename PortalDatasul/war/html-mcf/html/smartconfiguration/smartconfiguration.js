define(['index',
        '/dts/mcf/js/api/cfp/cfapi004.js',
		'/dts/mcf/html/smartconfiguration/smartconfiguration-list.js',
		'/dts/mcf/html/smartconfiguration/smartconfiguration-detail.js',
		'/dts/mcf/html/smartconfiguration/smartconfiguration-costvariable.js',
        '/dts/mcf/html/smartconfiguration/smartconfiguration-configuration.js'], function(index) {

	// Inicializa os states da aplicacao.
    index.stateProvider

        // Estado pai, a hierarquia de states e feita atraves do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso e abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mcf/smartconfiguration', {
            abstract: true,
            template: '<ui-view/>'
        })

         // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado
         // sera ativado automaticamente quando a tela for carregada.
         //
         // A URL deve ser compativel com a tela inicial.
         //
         // No estado tambem definimos o controller usado na template do estado, e definimos
         // o nome do controller em 'controllerAs' para ser utilizado na view.
         // tambem definimos a template ou templateUrl com o HTML da tela da view.

        .state('dts/mcf/smartconfiguration.start', {
            url:'/dts/mcf/smartconfiguration/',
            controller:'mcf.smartconfiguration.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcf/html/smartconfiguration/smartconfiguration.list.html'
        })
        .state('dts/mcf/smartconfiguration.detail', {
            url:'/dts/mcf/smartconfiguration/detail/:pItemCotacao/:pNumCFG',
            controller:'mcf.smartconfiguration.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcf/html/smartconfiguration/smartconfiguration.detail.html'
        })
        .state('dts/mcf/smartconfiguration.costvariable', {
            url:'/dts/mcf/smartconfiguration/costvariable/:pItemCotacao/:pNumCFG',
            controller:'mcf.smartconfiguration.CostVariableCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcf/html/smartconfiguration/smartconfiguration.costvariable.html'
        })
        .state('dts/mcf/smartconfiguration.configuration', {
            url:'/dts/mcf/smartconfiguration/configuration/:pItemCotacao/:pNumCFG/:pTpProcess',
            controller:'mcf.smartconfiguration.ConfigurationCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcf/html/smartconfiguration/smartconfiguration.configuration.html'
        });
});