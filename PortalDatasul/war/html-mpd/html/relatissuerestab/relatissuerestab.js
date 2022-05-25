define(['index', '/dts/mpd/html/relatissuerestab/relatissuerestab-controllers.js'],
function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/relatissuerestab', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
         
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/relatissuerestab.start', {
            url:'/dts/mpd/relatissuerestab',
            controller:'mpd.relatissuerestab-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/relatissuerestab/relatissuerestab.list.html'
        })
         
        // definição do state de visualização do registro
        .state('dts/mpd/relatissuerestab.detail', {
            url:'/dts/mpd/relatissuerestab/detail/:codEstabel/:codEmitente',
            controller:'mpd.relatissuerestab-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/relatissuerestab/relatissuerestab.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/relatissuerestab.edit', {
            url: '/dts/mpd/relatissuerestab/edit/:codEstabel/:codEmitente',
            controller: 'mpd.relatissuerestab-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/relatissuerestab/relatissuerestab.edit.html'
        })
         
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/relatissuerestab.new', {
            url: '/dts/mpd/relatissuerestab/new',
            controller: 'mpd.relatissuerestab-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/relatissuerestab/relatissuerestab.add.html'
        });
});