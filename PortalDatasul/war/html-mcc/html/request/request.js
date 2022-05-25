define(['index','/dts/mcc/html/request/request-services.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
    // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
    .state('dts/mcc/request', {
        abstract: true,
        template: '<ui-view/>'
    })

    // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado; Será ativado automaticamente quando a tela for carregada.
    .state('dts/mcc/request.start', {
        url: '/dts/mcc/request/',
        controller: 'mcc.request.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mcc/html/request/list/request.list.html'
    })    

    // definição do state de detalhe de requisição
    .state('dts/mcc/request.detail', {
        url:'/dts/mcc/request/detail/:id',
        controller:'mcc.request.DetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.html'
    })

    // definição do state de criação de requisição    
    .state('dts/mcc/request.new', {
        url:'/dts/mcc/request/new',
        controller:'mcc.request.EditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.html'
    })

    // definição do state de edição de requisição
    .state('dts/mcc/request.edit', {
        url: '/dts/mcc/request/edit/:id',
        controller:'mcc.request.EditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.html'
    })

    // definição do state de detalhe de item
    .state('dts/mcc/request.itemDetail', {
        url:'/dts/mcc/request/item/detail?req&seq&item&previous',
        controller:'mcc.request.ItemDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.item.html'
    })

    // definição do state de incusão de novo item
    .state('dts/mcc/request.itemNew', {
        url:'/dts/mcc/request/item/new/:req',
        controller:'mcc.request.ItemEditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.item.html'
    })

    // definição do state de edição de item
    .state('dts/mcc/request.itemEdit', {
        url:'/dts/mcc/request/item/edit?req&seq&item',
        controller:'mcc.request.ItemEditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.edit.item.html'
    })

    // definição do state de cópia de item
    .state('dts/mcc/request.itemCopy', {
        url:'/dts/mcc/request/item/copy/:req',
        controller:'mcc.request.CopyItemCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/edit/request.copy.item.html'
    })

    /* DEFINIAÇÃO DOS ESTADOS DE CONSULTA DE REQUISIÇÃO */

    // Estado inicial da consulta (listagem)
    .state('dts/mcc/request.search', {
        url: '/dts/mcc/request/search',
        controller: 'mcc.request.SearchListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mcc/html/request/list/request.list.html'
    })

    // definição do state de detalhe de requisição
    .state('dts/mcc/request.searchDetail', {
        url:'/dts/mcc/request/search/detail/:id',             
        controller:'mcc.request.SearchDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.html'
    })

    // definição do state de detalhe de item
    .state('dts/mcc/request.searchItemDetail', {
        url:'/dts/mcc/request/search/item/detail?req&seq&item',
        controller:'mcc.request.SearchItemDetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/request/detail/request.detail.item.html'
    })

});