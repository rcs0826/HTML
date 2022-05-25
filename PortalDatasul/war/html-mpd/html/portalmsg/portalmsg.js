define(['index',        
                 
        
        '/dts/mpd/js/portal-factories.js',
        '/dts/mpd/html/portalmsg/portalmsg-controllers.js'], 

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portalmsg', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
    
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/portalmsg.start', {
            url:'/dts/mpd/portalmsg/:idPortalConfigur',
            controller:'mpd.portal-msg-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalmsg/portal-msg.list.html'
        })
    
        // definição do state de detalhe do registro
        .state('dts/mpd/portalmsg.detail', {
            url:'/dts/mpd/portalmsg/detail/:idPortalConfigur/:id',                
            controller:'mpd.portal-msg-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalmsg/portal-msg.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/portalmsg.edit', {
            url: '/dts/mpd/portalmsg/edit/:idPortalConfigur/:id',
            controller: 'mpd.portal-msg-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalmsg/portal-msg.edit.html'
        })
         
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/portalmsg.new', {
            url: '/dts/mpd/portalmsg/:idPortalConfigur/new',
            controller: 'mpd.portal-msg-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalmsg/portal-msg.edit.html'
        });
});