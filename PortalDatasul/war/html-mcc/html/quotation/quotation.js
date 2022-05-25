define(['index',
        '/dts/mcc/html/quotation/edit/quotation.edit.ctrl.js',
        '/dts/mcc/html/quotation/list/quotation.list.ctrl.js',
        '/dts/mcc/html/quotation/detail/quotation.detail.ctrl.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mcc/quotation', {
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
        .state('dts/mcc/quotation.start', {
            url: '/dts/mcc/quotation/',
            controller: 'mcc.quotation.ListCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mcc/html/quotation/list/quotation.list.html'
        })

        // definição do state de visualização do detalhe registro
        .state('dts/mcc/quotation.detail', {
            url:'/dts/mcc/quotation/detail?ordem&item&emitente&seq',
            controller:'mcc.quotation.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/quotation/detail/quotation.detail.html'
        })

        // definição do state de criação do registro
        .state('dts/mcc/quotation.new', {
            url:'/dts/mcc/quotation/new',
            controller:'mcc.quotation.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/quotation/edit/quotation.edit.html'
        })

        // definição do state de criação do registro
        .state('dts/mcc/quotation.edit', {
            url:'/dts/mcc/quotation/edit?ordem&item&emitente&seq',
            controller:'mcc.quotation.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/quotation/edit/quotation.edit.html'
        })        
    
        // definição do state de cópia do registro   
        .state('dts/mcc/quotation.copy', {
            url:'/dts/mcc/quotation/copy?ordem&item&emitente&seq',
            controller:'mcc.quotation.EditCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcc/html/quotation/edit/quotation.edit.html'
        })
    
        // Estado inicial da consulta (listagem)
        .state('dts/mcc/quotation.search', {
            url: '/dts/mcc/quotation/search',
            controller: 'mcc.quotation.SearchListCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mcc/html/quotation/list/quotation.list.html'
        })
});
