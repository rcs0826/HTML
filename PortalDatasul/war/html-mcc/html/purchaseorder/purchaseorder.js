define(['index', 
        '/dts/mcc/html/purchaseorder/purchaseorder-services.js',
        '/dts/mcc/html/purchaseorder/list/purchaseorder.list.ctrl.js',
        '/dts/mcc/html/purchaseorder/edit/purchaseorder.edit.ctrl.js',
        '/dts/mcc/html/purchaseorderline/purchaseorderline.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
      
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mcc/purchaseorder', {
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
         .state('dts/mcc/purchaseorder.start', {
             url:'/dts/mcc/purchaseorder',
             controller:'mcc.purchaseorder.ListCtrl',
             controllerAs: 'controller',
             templateUrl:'/dts/mcc/html/purchaseorder/list/purchaseorder.list.html'
         })

         // definição do state de criação do processo de pedido de compras
        .state('dts/mcc/purchaseorder.new', {
            url:'/dts/mcc/purchaseorder/new',
            controller:'mcc.purchaseorder.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorder/edit/purchaseorder.edit.html',
        })

        // definição do state de edição do processo de pedido de compras
        .state('dts/mcc/purchaseorder.edit', {
            url:'/dts/mcc/purchaseorder/edit/:purchaseOrderNumber',
            controller:'mcc.purchaseorder.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorder/edit/purchaseorder.edit.html',
        })

        .state('dts/mcc/purchaseorder.detail', {
            url:'/dts/mcc/purchaseorder/detail/:nrPedido',
            controller:'mcc.purchaseorder.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/purchaseorder/detail/purchaseorder.detail.html'
        });
});
