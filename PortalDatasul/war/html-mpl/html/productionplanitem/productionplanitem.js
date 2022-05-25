define(['index',
        '/dts/mpl/js/utils/filters.js',
		    '/dts/mpl/js/api/fch/fchman/fchmanproductionplan.js',
        '/dts/mpl/js/api/fch/fchman/fchmanproductionplanitem.js',
        '/dts/mpl/html/productionplanitem/productionplanitem-list.js',
        '/dts/mpl/html/productionplanitem/productionplanitem-edit.js',
        '/dts/mpl/html/productionplanitem/productionplanitem-edit-needs.js',
        '/dts/mpl/html/productionplanitem/productionplanitem-import.js',
        '/dts/mpl/js/zoom/periodo.js',
        '/dts/mpl/js/zoom/estabelec.js',
        '/dts/men/js/zoom/item.js',
        '/dts/men/js/zoom/ref-item.js',
        '/dts/mpl/js/zoom/emitente.js',
        '/dts/mpl/js/zoom/gr-cli.js',
        '/dts/mpl/js/zoom/ped-venda.js'
       ], function (index) {

    // Inicializa os states da aplicação.
    index.stateProvider

    // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mpl/productionplanitem', {
        abstract: true,
        template: '<ui-view/>'
    })

    // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado
    // será ativado automaticamente quando a tela for carregada.
    //
    // A URL deve ser compatível com a tela inicial.
    //
    // No estado também definimos o controller usado na template do estado, e definimos
    // o nome do controller em 'controllerAs' para ser utilizado na view.
    // também definimos a template ou templateUrl com o HTML da tela da view.
    .state('dts/mpl/productionplanitem.start', {
            url: '/dts/mpl/productionplanitem/:productionPlanCode',
            controller: 'mpl.productionplanitem.ListCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.list.html'
    })
    // definição do state de modificação do registro
    .state('dts/mpl/productionplanitem.edit', {
            url: '/dts/mpl/productionplanitem/edit/:productionPlanCode/:itemCode',
            controller: 'mpl.productionplanitem.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.edit.html'
    })
    // definição do state de criação de um novo registro
    // note que a edição a criação de registros utilizam os mesmos controllers e templates
    .state('dts/mpl/productionplanitem.new', {
        url: '/dts/mpl/productionplanitem/new/',
        controller: 'mpl.productionplanitem.EditCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.edit.html'
    })
    //
    //
    .state('dts/mpl/productionplanitem.edit.needs', {
        url: '/dts/mpl/productionplanitem/editneeds/',
        controller: 'mpl.productionplanitem.EditNeedsCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.edit.needs.html'
    })
    //
    //
    .state('dts/mpl/productionplanitem.import', {
        url: '/dts/mpl/productionplanitem/import/',
        controller: 'mpl.productionplanitem.ImportCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mpl/html/productionplanitem/productionplanitem.import.html'
    });
});