define(['index', 
		'/dts/mpl/js/dbo/boin318.js',
		'/dts/mpl/js/dbo/boin436.js',
		'/dts/mpl/js/zoom/tipo-per.js',
		'/dts/mpl/js/zoom/periodo.js',
		'/dts/mpl/js/zoom/pl-prod.js',
		'/dts/mpl/js/api/fch/fchman/fchmanproductionplan.js',
        '/dts/mpl/js/api/fch/fchman/fchmanproductionplanitem.js',
		'/dts/mpl/html/productionplan/productionplan-list.js',
		'/dts/mpl/html/productionplan/productionplan-detail.js',
		'/dts/mpl/html/productionplan/productionplan-edit.js',
		'/dts/mpl/html/productionplan/productionplan-set-site.js',
		'/dts/mpl/html/productionplan/productionplan-copy-plan.js'], function(index) {

	// Inicializa os states da aplica��o.
    index.stateProvider
     
        // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mpl/productionplan', {
            abstract: true,
            template: '<ui-view/>'
        })
     
         // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado
         // ser� ativado automaticamente quando a tela for carregada.
         //
         // A URL deve ser compat�vel com a tela inicial.
         //
         // No estado tamb�m definimos o controller usado na template do estado, e definimos
         // o nome do controller em 'controllerAs' para ser utilizado na view.
         // tamb�m definimos a template ou templateUrl com o HTML da tela da view.
        .state('dts/mpl/productionplan.start', {
            url:'/dts/mpl/productionplan/',
            controller:'mpl.productionplan.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mpl/html/productionplan/productionplan.list.html'
        })
        // definição do state de visualização do registro
        .state('dts/mpl/productionplan.detail', {
            url:'/dts/mpl/productionplan/detail/:id',
            controller:'mpl.productionplan.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mpl/html/productionplan/productionplan.detail.html'
        })
        // definição do state de modificação do registro
        .state('dts/mpl/productionplan.edit', {
            url: '/dts/mpl/productionplan/edit/:id',
            controller: 'mpl.productionplan.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mpl/html/productionplan/productionplan.edit.html'
        }) 
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpl/productionplan.new', {
            url: '/dts/mpl/productionplan/new',
            controller: 'mpl.productionplan.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mpl/html/productionplan/productionplan.edit.html'
        })
        // modal de copia de itens do plano de producao
        .state('dts/mpl/productionplan.copyplan', {
            url: '/dts/mpl/productionplan/copyplan/',
            controller: 'mpl.productionplan.CopyPlanCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mpl/html/productionplan/productionplan.copy.plan.html'
        })
        // definição do state de modificação do registro
        .state('dts/mpl/productionplan.setsite', {
            url: '/dts/mpl/productionplan/setsite/',
            controller: 'mpl.productionplan.SetSiteCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mpl/html/productionplan/productionplan.set.site.html'
        });
});