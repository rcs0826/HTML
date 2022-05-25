define([
    'index',
    '/dts/mce/html/ce0814/ce0814-controller.js',
    '/dts/mce/html/ce0814/detail/ce0814.detail.controller.js'
    ], function(index) {
 
    // Inicializa os states da aplicação. 'dts/mce/html/ce0814/ce0814-services.js'
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mce/ce0814', {
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
        .state('dts/mce/ce0814.start', {
            url: '/dts/mce/ce0814/:itCodigo/:codEstabel',
            controller: 'mce.ce0814.ListController',
            controllerAs: 'controller',
            templateUrl: '/dts/mce/html/ce0814/ce0814.list.html'
        })  
        
        .state('dts/mce/ce0814.newstate', {
            url: '/dts/mce/ce0814',
            controller: 'mce.ce0814.ListController',
            controllerAs: 'controller',
            templateUrl: '/dts/mce/html/ce0814/ce0814.list.html'
        })  
    
        .state('dts/mce/ce0814.detail', {
            url: '/dts/mce/ce0814/detail/:nrTrans/:currency/:averageType',
            controller: 'mce.ce0814.DetailController',
            controllerAs: 'controller',
            templateUrl: '/dts/mce/html/ce0814/detail/ce0814.detail.html'
        })      
});