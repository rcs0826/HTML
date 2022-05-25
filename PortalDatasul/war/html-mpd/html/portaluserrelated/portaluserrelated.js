define(['index',        
                 
        
        //'/dts/mpd/js/portal-factories.js',
        '/dts/mpd/html/portaluserrelated/portaluserrelated-controllers.js'], 

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portaluserrelated', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
    
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/portaluserrelated.start', {
            url:'/dts/mpd/portaluserrelated/:idPortalConfigur',
            controller:'mpd.portal-user-related-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portaluserrelated/portal-user-related.list.html'
        })
    
        // definição do state de detalhe do registro
        .state('dts/mpd/portaluserrelated.detail', {
            url:'/dts/mpd/portaluserrelated/detail/:idPortalConfigur/:id',                
            controller:'mpd.portal-user-related-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portaluserrelated/portal-user-related.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/portaluserrelated.edit', {
            url: '/dts/mpd/portaluserrelated/edit/:idPortalConfigur/:id',
            controller: 'mpd.portal-user-related-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portaluserrelated/portal-user-related.edit.html'
        })
         
         // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/portaluserrelated.new', {
            url: '/dts/mpd/portaluserrelated/:idPortalConfigur/new',
            controller: 'mpd.portal-user-related-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portaluserrelated/portal-user-related.edit.html'
        });
});