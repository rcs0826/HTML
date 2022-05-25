define(['index','/dts/mla/html/historic/historic-services.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mla/historic', {
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
        .state('dts/mla/historic.start', {
            url:'/dts/mla/historic/',
            controller:'mla.historic.Ctrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/historic/historic.html'
        })

        .state('dts/mla/historic.list', {
            url: '/dts/mla/historic/list/:documentId',
            controller:'mla.historic.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/historic/historic.list.html'
        })

        .state('dts/mla/historic.detail', {
            url: '/dts/mla/historic/detail/:documentId/:requestId',
            controller:'mla.historic.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/historic/historic.detail.html'
        })
});