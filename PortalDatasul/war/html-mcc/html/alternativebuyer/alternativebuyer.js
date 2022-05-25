define(['index','/dts/mcc/html/alternativebuyer/alternativebuyer-services.js'], function(index) {
    'use strict';

    // Inicializa os states da aplicação.
    index.stateProvider

    // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
    .state('dts/mcc/alternativebuyer', {
        abstract: true,
        template: '<ui-view/>'
    })

    // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado; Será ativado automaticamente quando a tela for carregada.
    .state('dts/mcc/alternativebuyer.start', {
        url: '/dts/mcc/alternativebuyer/',
        controller: 'mcc.alternativebuyer.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mcc/html/alternativebuyer/list/alternativebuyer.list.html'
    })

    .state('dts/mcc/alternativebuyer.detail', {
        url:'/dts/mcc/alternativebuyer/detail/:buyer',
        controller:'mcc.alternativebuyer.DetailCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/alternativebuyer/detail/alternativebuyer.detail.html'
    })

    .state('dts/mcc/alternativebuyer.new', {
        url:'/dts/mcc/alternativebuyer/new',
        controller:'mcc.alternativebuyer.EditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/alternativebuyer/edit/alternativebuyer.edit.html'
    })

    .state('dts/mcc/alternativebuyer.edit', {
        url: '/dts/mcc/alternativebuyer/edit/:buyer',
        controller:'mcc.alternativebuyer.EditCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcc/html/alternativebuyer/edit/alternativebuyer.edit.html'
    });

});
