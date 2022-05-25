define(['index','/dts/mla/html/fluigmonitor/fluigmonitor-services.js'], function(index) {
 
    // Inicializa os states da aplicação.
    index.stateProvider
     
    // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
    // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
    // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
    .state('dts/mla/fluigmonitor', {
        abstract: true,
        template: '<ui-view/>'
    })

    // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado; Será ativado automaticamente quando a tela for carregada.
    .state('dts/mla/fluigmonitor.start', {
        url: '/dts/mla/fluigmonitor/',
        controller: 'mla.fluigmonitor.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mla/html/fluigmonitor/fluigmonitor.list.html'
    })   
});