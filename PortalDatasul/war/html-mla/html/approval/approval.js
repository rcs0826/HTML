define(['index',
        '/dts/mla/html/approval/approval-services.js', 
        '/dts/mla/html/alternativeuser/alternativeuser.js',
        '/dts/mla/html/historic/historic.js',
        '/dts/mla/html/approval/approval.email.ctrl.js'
    ], function(index) {
    // Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mla/approval', {
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
        .state('dts/mla/approval.start', {
            url:'/dts/mla/approval/',
            controller:'mla.approval.Ctrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/approval/approval.html'
        })

        .state('dts/mla/approval.list', {
            url: '/dts/mla/approval/list/:documentId',
            controller:'mla.approval.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/approval/approval.list.html'
        })

        .state('dts/mla/approval.detail', {
            url: '/dts/mla/approval/detail/:documentId/:requestId',
            controller:'mla.approval.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/approval/approval.detail.html'
        })

        .state('dts/mla/approval.email', {
            url: '/dts/mla/approval/email',
            controller:'mla.approval.email.ctrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mla/html/approval/approval.email.html'
        })
});
