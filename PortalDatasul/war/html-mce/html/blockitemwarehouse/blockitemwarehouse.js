define([
    'index',
    '/dts/mce/html/blockitemwarehouse/blockitemwarehouse-controllers.js',
    '/dts/mce/html/blockitemwarehouse/blockitemwarehouse.edit.controllers.js'
   
    ], function(index) {
 
    // Inicializa os states da aplicação. 'dts/mce/html/messages/messages-services.js'
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mce/blockitemwarehouse', {
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
        .state('dts/mce/blockitemwarehouse.start', {
            url: '/dts/mce/blockitemwarehouse/',
            controller: 'mce.blockitemwarehouse.ListCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mce/html/blockitemwarehouse/blockitemwarehouse.list.html' 
        })
    
        .state('dts/mce/blockitemwarehouse.edit', {
            url: '/dts/mce/blockitemwarehouse/edit',
            controller: 'mce.blockitemwarehouse.editCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mce/html/blockitemwarehouse/blockitemwarehouse.edit.html' 
        })    
        
});