define([
    'index',
    '/dts/mpd/js/portal-factories.js',
    '/dts/mpd/html/portalmodelval/portalmodelval-controllers.js'
],

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portalmodelval', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })

        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/portalmodelval.start', {
            url:'/dts/mpd/portalmodelval/:idPortalConfigur/:idModel',
            controller:'mpd.portal-model-val-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalmodelval/portal-model-val.list.html'
        })

        // definição do state de visualização do registro
        .state('dts/mpd/portalmodelval.detail', {
            url:'/dts/mpd/portalmodelval/detail/:idPortalConfigur/:idModel/:id',
            controller:'mpd.portal-model-val-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalmodelval/portal-model-val.detail.html'
        })

        // definição do state de modificação do registro
        .state('dts/mpd/portalmodelval.edit', {
            url: '/dts/mpd/portalmodelval/edit/:idPortalConfigur/:idModel/:id',
            controller: 'mpd.portal-model-val-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalmodelval/portal-model-val.edit.html'
        })

        /**
         * Definição do state de criação de um novo registro.
         * Note que a edição a criação de registros utilizam os mesmos controllers e templates.
         */
        .state('dts/mpd/portalmodelval.new', {
            url: '/dts/mpd/portalmodelval/:idPortalConfigur/:idModel/new',
            controller: 'mpd.portal-model-val-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalmodelval/portal-model-val.edit.html'
        });
});
