define(['index',
        '/dts/mcs/js/api/fch/fchman/fchman0008.js',
        '/dts/mcs/html/costssimulation/costssimulation-list.js',
        '/dts/mcs/html/costssimulation/costssimulation.advanced.search.controller.js',
        '/dts/mcs/html/costssimulation/costssimulation.detail.controller.js',
        '/dts/mcs/js/dbo/boin400.js',
        '/dts/mcs/js/dbo/boin482.js',
        '/dts/men/js/zoom/item.js',
        '/dts/men/js/zoom/ref-item.js',
        '/dts/mcs/js/zoom/estabelec.js',
        '/dts/mcs/js/zoom/roteiro.js',
        '/dts/mcs/js/zoom/list-compon.js',
        '/dts/mcs/js/cultures/kendo.culture.de-DE.min.js'],function(index) {

    kendo.culture("de-DE");

    // Inicializa os states da aplica��o.
    index.stateProvider

    // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
    .state('dts/mcs/costssimulation', {
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
    .state('dts/mcs/costssimulation.start', {
        url:'/dts/mcs/costssimulation/',
        controller:'mcs.costssimulation.ListCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcs/html/costssimulation/costssimulation.list.html'
    });
});