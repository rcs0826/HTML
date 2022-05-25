define(['index', '/dts/mcc/html/purchaseorderline/purchaseorderline-services.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mcc/purchaseorderline', {
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

        .state('dts/mcc/purchaseorderline.start', { 
            url:'/dts/mcc/purchaseorderline/',
            controller:'mcc.purchaseorderline.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorderline/list/purchaseorderline.list.html'
        })

         // definição do state de detalhe da ordem
        .state('dts/mcc/purchaseorderline.detail', { 
            url:'/dts/mcc/purchaseorderline/detail/:numeroOrdem',
            controller:'mcc.purchaseorderline.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorderline/detail/purchaseorderline.detail.html'
        })

        // definição do state de criação de ordem compra    
        .state('dts/mcc/purchaseorderline.new', {
            url:'/dts/mcc/purchaseorderline/new',
            controller:'mcc.purchaseorderline.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorderline/edit/purchaseorderline.edit.html'
        })

        // definição do state de edição de ordem compra
        .state('dts/mcc/purchaseorderline.edit', {
            url: '/dts/mcc/purchaseorderline/edit/:id',
            controller:'mcc.purchaseorderline.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorderline/edit/purchaseorderline.edit.html'
        })

        // definição do state de cópia de ordem compra    
        .state('dts/mcc/purchaseorderline.copy', {
            url:'/dts/mcc/purchaseorderline/copy/:id',
            controller:'mcc.purchaseorderline.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorderline/edit/purchaseorderline.edit.html'
        })

        /* DEFINIÇÃO DOS ESTADOS DE CONSULTA DE ORDEM DE COMPRA */

        // Estado inicial da consulta (listagem)
       .state('dts/mcc/purchaseorderline.search', {
            url: '/dts/mcc/purchaseorderline/search',
            controller: 'mcc.purchaseorderline.SearchListCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mcc/html/purchaseorderline/list/purchaseorderline.list.html'
        })
});