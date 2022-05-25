define(['index',        
                 
        
        '/dts/mpd/js/portal-factories.js',
        '/dts/mpd/html/portalconfignotif/portalconfignotif-controllers.js'], 

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portalconfignotif', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
    
        .state('dts/mpd/portalconfignotif.start', {
            url:'/dts/mpd/portalconfignotif/:idPortalConfigur',
            controller:'mpd.portal-config-notif-edit.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalconfignotif/portal-config-notif.edit.html'
        });
});