define(['index',        
        '/dts/mpd/html/notificationorderconfig/notificationorderconfigcontrollers.js'],

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/notificationorderconfig', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
         
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/notificationorderconfig.start', {
            url:'/dts/mpd/notificationorderconfig',
            controller: 'mpd.notificationorderconfig.controller',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/notificationorderconfig/notificationorderconfig.edit.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/notificationorderconfig.edit', {
            url: '/dts/mpd/notificationorderconfig/edit',
            controller: 'mpd.notificationorderconfig.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/notificationorderconfig/notificationorderconfig.edit.html'
        });
        
});
