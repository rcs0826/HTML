define([
    'index',
    '/dts/mce/html/distributecounts/distributecounts-controllers.js',
    '/dts/mce/html/distributecounts/distributecountsAdvancedSearch-controllers.js',
    '/dts/mce/html/distributecounts/detail/distributecountsdetail-controllers.js',
    '/dts/mce/js/api/fch/fchmat/fchmatdistributecounts-services.js'
    ], function(index) {
 
    // Inicializa os states da aplicação. 'dts/mce/html/messages/messages-services.js'
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mce/distributecounts', {
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
        .state('dts/mce/distributecounts.start', {
            url: '/dts/mce/distributecounts/',
            controller: 'mce.distributecounts.ListCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mce/html/distributecounts/distributecounts.list.html' 
        })  
    
    // definição do state de detalhe 
    .state('dts/mce/distributecounts.detail', {
        url:'/dts/mce/distributecounts/detail?rRowid',
        controller:'mce.distributecounts.detailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mce/html/distributecounts/detail/distributecounts.detail.html'
    })
    
});