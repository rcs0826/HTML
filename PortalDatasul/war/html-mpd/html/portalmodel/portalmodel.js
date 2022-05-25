define([
    'index',
    '/dts/mpd/js/portal-factories.js',
    '/dts/mpd/html/portalmodel/portalmodel-controllers.js',
    '/dts/mpd/html/portalmodelval/portalmodelval-controllers.js'
],

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portalmodel', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
    
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/portalmodel.start', {
            url:'/dts/mpd/portalmodel/:idPortalConfigur/:idTipconfig',
            controller:'mpd.portal-model-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalmodel/portal-model.list.html'
        })
                 
        // definição do state de visualização do registro
        .state('dts/mpd/portalmodel.detail', {
            url:'/dts/mpd/portalmodel/detail/:idPortalConfigur/:id',
            controller:'mpd.portal-model-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalmodel/portal-model.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/portalmodel.edit', {
            url: '/dts/mpd/portalmodel/edit/:idPortalConfigur/:id',
            controller: 'mpd.portal-model-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalmodel/portal-model.edit.html'
        })
         
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/portalmodel.new', {
            url: '/dts/mpd/portalmodel/new/:idPortalConfigur/:id',
            controller: 'mpd.portal-model-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalmodel/portal-model.edit.html'
        })
    
        .state('dts/mpd/portalmodel.copy', {
            url: '/dts/mpd/portalmodel/copy/:idPortalConfigur',
            controller: 'mpd.portal-model-copy.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalmodel/portal-model.copy.html'
        });
});
