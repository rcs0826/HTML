define(['index',        
                 
        
        '/dts/mpd/js/portal-factories.js',
        '/dts/mpd/html/portalconfigpdp/portalconfigpdp-controllers.js'        
        ],

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portalconfigpdp', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
         
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/portalconfigpdp.start', {
            url:'/dts/mpd/portalconfigpdp/?showAsTable',
            controller:'mpd.portal-config-clien-rep-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalconfigpdp/portal-config-clien-rep.list.html'
        })
         
        // definição do state de visualização do registro
        .state('dts/mpd/portalconfigpdp.detail', {
            url:'/dts/mpd/portalconfigpdp/detail/:id/:tag',
            controller:'mpd.portal-config-clien-rep-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalconfigpdp/portal-config-clien-rep.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/portalconfigpdp.edit', {
            url: '/dts/mpd/portalconfigpdp/edit/:id/:tag',
            controller: 'mpd.portal-config-clien-rep-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalconfigpdp/portal-config-clien-rep.edit.html'
        })
         
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/portalconfigpdp.new', {
            url: '/dts/mpd/portalconfigpdp/new',
            controller: 'mpd.portal-config-clien-rep-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalconfigpdp/portal-config-clien-rep.edit.html'
        });
});