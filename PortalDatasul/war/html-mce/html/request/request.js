define(['index','/dts/mcc/html/request/request-services.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
    // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
    .state('dts/mce/request', {
        abstract: true,
        template: '<ui-view/>'
    })

    // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado; Será ativado automaticamente quando a tela for carregada.
    .state('dts/mce/request.start', {
        url: '/dts/mce/request/',
        controller: 'mcc.request.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mcc/html/request/list/request.list.html'
    })    

    // definição do state de visualização de requisição
    .state('dts/mce/request.detail', {
        url:'/dts/mce/request/detail/:id',
        controller:'mcc.request.DetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.html'
    })

    // definição do state de criação de requisição    
    .state('dts/mce/request.new', {
        url:'/dts/mce/request/new',
        controller:'mcc.request.EditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.html'
    })

    // definição do state de edição de requisição
    .state('dts/mce/request.edit', {
        url: '/dts/mce/request/edit/:id',
        controller:'mcc.request.EditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.html'
    })

    // definição do state de visualização de item
    .state('dts/mce/request.itemDetail', {
        url:'/dts/mce/request/item/detail?req&seq&item&previous',
        controller:'mcc.request.ItemDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.item.html'
    })

    // definição do state de incusão de novo item
    .state('dts/mce/request.itemNew', {
        url:'/dts/mce/request/item/new/:req',
        controller:'mcc.request.ItemEditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.item.html'
    })

    // definição do state de edição de item
    .state('dts/mce/request.itemEdit', {
        url:'/dts/mce/request/item/edit?req&seq&item',
        controller:'mcc.request.ItemEditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.item.html'
    })

    // definição do state de cópia de item
    .state('dts/mce/request.itemCopy', {
        url:'/dts/mce/request/item/copy/:req',
        controller:'mcc.request.CopyItemCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.copy.item.html'
    })

    /* DEFINIAÇÃO DOS ESTADOS DE CONSULTA DE REQUISIÇÃO */

    // Estado inicial da consulta (listagem)
    .state('dts/mce/request.search', {
        url: '/dts/mce/request/search',
        controller: 'mcc.request.SearchListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mcc/html/request/list/request.list.html'
    })

    // definição do state de detalhe de requisição
    .state('dts/mce/request.searchDetail', {
        url:'/dts/mce/request/search/detail/:id',
        controller:'mcc.request.SearchDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.html'
    })

    // definição do state de detalhe de item
    .state('dts/mce/request.searchItemDetail', {
        url:'/dts/mce/request/search/item/detail?req&seq&item',
        controller:'mcc.request.SearchItemDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.item.html'
    })
    
});