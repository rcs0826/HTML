define(['index',        
                 
        
        '/dts/mpd/js/portal-factories.js',
        '/dts/mpd/html/portalcampos/portalcampos-controllers.js'], 

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portalcampos', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
    
        .state('dts/mpd/portalcampos.start', {
            url:'/dts/mpd/portalcampos/:idPortalConfigur/:tag/:idTipconfig',
            controller:'mpd.portal-campos-edit.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalcampos/portal-campos.edit.html'
        });
});