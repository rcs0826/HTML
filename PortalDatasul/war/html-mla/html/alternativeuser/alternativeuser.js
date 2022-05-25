define(['index','/dts/mla/html/alternativeuser/alternativeuser-services.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mla/alternativeuser', {
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
        .state('dts/mla/alternativeuser.start', {
            url: '/dts/mla/alternativeuser/',
            controller: 'mla.alternativeuser.ListCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mla/html/alternativeuser/alternativeuser.list.html'
        })

        // definição do state de visualização do detalhe registro
        .state('dts/mla/alternativeuser.detail', {
            url:'/dts/mla/alternativeuser/detail/:alternativo',
            controller:'mla.alternativeuser.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/alternativeuser/alternativeuser.detail.html'
        })

        // definição do state de edição do registro
        .state('dts/mla/alternativeuser.edit', {
            url:'/dts/mla/alternativeuser/edit/:alternativo',
            controller:'mla.alternativeuser.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/alternativeuser/alternativeuser.edit.html'
        })

        // definição do state de criação do registro
        .state('dts/mla/alternativeuser.new', {
            url:'/dts/mla/alternativeuser/new',
            controller:'mla.alternativeuser.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/alternativeuser/alternativeuser.edit.html'
        })
});