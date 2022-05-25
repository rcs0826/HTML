define([
    'index',
    // componentes do framework
    'angularAMD',    
    '/dts/mce/js/api/fch/fchmat/fchmatcd1409.js', /* Facahada para API fchmatcd1409 */
    '/dts/mce/js/mce-utils.js', //Utils do modulo estoque
    '/dts/mce/js/factories/mce-factories.js', //Factories do modulo estoque
    '/dts/mce/html/cd1409/cd1409AdvancedSearch-controllers.js', // Controller busca avançada
    '/dts/mce/html/cd1409/cd1409-controllers.js', // contreller da tela de atendimento
    '/dts/mce/html/cd1409/cd1409ChooseBalance-controllers.js', // Controller Modal Atendimento Selecionando Saldo
    '/dts/mcc/html/followup/followup-services.js', //Controller Modal de Follow UP
    '/dts/mpd/js/zoom/estabelec.js', // zoom estabelecimento
    '/dts/mcc/js/api/ccapi354.js',
    '/dts/mcc/js/mcc-legend-service.js',
    '/dts/mcc/html/request/request-services.js'
    ], function (index) {

    // Inicializa os states da aplicação. 'dts/mce/html/messages/messages-services.js'
    index.stateProvider

    // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mce/cd1409', {
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
    .state('dts/mce/cd1409.start', {
        url: '/dts/mce/cd1409/',
        controller: 'mce.cd1409.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mce/html/cd1409/cd1409.list.html'
    })

    /* DEFINIAÇÃO DOS ESTADOS DE DETALHES */
    
     // definição do state de detalhe de requisição
    .state('dts/mce/cd1409.requestDetail', {
        url:'/dts/mce/cd1409/detail/:id',
        controller:'mcc.request.SearchDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.html'
    })

    // definição do state de detalhe de item
    .state('dts/mce/cd1409.itemRequestDetail', {
        url:'/dts/mce/cd1409/item/detail?req&seq&item',
        controller:'mcc.request.SearchItemDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.item.html'
    })    

});
