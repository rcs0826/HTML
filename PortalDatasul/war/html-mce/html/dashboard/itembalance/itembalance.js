define([
    'index',
    '/dts/mce/html/dashboard/itembalance/itembalance-controller.js',   
    '/dts/men/js/zoom/item.js',
    '/dts/mce/js/api/fch/fchmat/fchmatmcetools.js',
    '/dts/mce/js/api/fch/fchmat/fchmatitembalancewidget.js',
    '/dts/mce/js/api/fch/fchmat/fchmatinventorybalanceinquiry-services.js',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mce/js/mce-utils.js'
    ], function (index) {
 
    // Inicializa os states da aplicação. 'dts/mce/html/ce0814/ce0814-services.js'
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mce/dashboard/itembalance', {
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
        .state('dts/mce/dashboard/itembalance.start', {
            url: 'dts/mce/dashboard/itembalance',
            controller: 'mce.dashboard.itembalance.itembalanceController',
            controllerAs: 'controller',
            templateUrl: '/dts/mce/dashboard/itembalance/itembalance.html'
        })                 
});