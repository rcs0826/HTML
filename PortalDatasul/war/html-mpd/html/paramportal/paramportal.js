define(['index',        
                 
        
        '/dts/mpd/html/paramportal/param-portal-controllers.js'],

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/paramportal', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
         
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/paramportal.start', {
            url:'/dts/mpd/paramportal',
            controller:'mpd.param-portal-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/paramportal/param-portal.detail.html'
        })
         
        // definição do state de visualização do registro
        .state('dts/mpd/paramportal.detail', {
            url:'/dts/mpd/paramportal/detail',
            controller:'mpd.param-portal-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/paramportal/param-portal.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/paramportal.edit', {
            url: '/dts/mpd/paramportal/edit',
            controller: 'mpd.param-portal-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/paramportal/param-portal.edit.html'
        });
        
});