define(['index', 
    '/dts/mcc/html/requestquotation/list/requestquotation.list.ctrl.js',
    '/dts/mcc/html/requestquotation/edit/requestquotation.edit.ctrl.js'
    ], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mcc/requestquotation', {
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

         // definição do state de lista do processo de cotação
        .state('dts/mcc/requestquotation.start', {
            url: '/dts/mcc/requestquotation/',
            controller:'mcc.requestquotation.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/requestquotation/list/requestquotation.list.html'
        })

        // definição do state de criação do processo de cotação   
        .state('dts/mcc/requestquotation.new', {
            url:'/dts/mcc/requestquotation/new',
            controller:'mcc.requestquotation.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/requestquotation/edit/requestquotation.edit.html',
        })

        // definição do state de edição do processo de cotação
        .state('dts/mcc/requestquotation.edit', {
            url: '/dts/mcc/requestquotation/edit/:id',
            controller:'mcc.requestquotation.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/requestquotation/edit/requestquotation.edit.html'
        })

        
});
