define(['index', '/dts/mpd/html/relatcustomerchannelestab/relatcustomerchannelestab-controllers.js'],
function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/relatcustomerchannelestab', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
         
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/relatcustomerchannelestab.start', {
            url:'/dts/mpd/relatcustomerchannelestab',
            controller:'mpd.relatcustomerchannelestab-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/relatcustomerchannelestab/relatcustomerchannelestab.list.html'
        })
         
        // definição do state de visualização do registro
        .state('dts/mpd/relatcustomerchannelestab.detail', {
            url:'/dts/mpd/relatcustomerchannelestab/detail/:estabel/:canal/:emitente/:data',
            controller:'mpd.relatcustomerchannelestab-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/relatcustomerchannelestab/relatcustomerchannelestab.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/relatcustomerchannelestab.edit', {
            url: '/dts/mpd/relatcustomerchannelestab/edit/:estabel/:canal/:emitente/:data',
            controller: 'mpd.relatcustomerchannelestab-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/relatcustomerchannelestab/relatcustomerchannelestab.edit.html'
        })
         
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/relatcustomerchannelestab.new', {
            url: '/dts/mpd/relatcustomerchannelestab/new',
            controller: 'mpd.relatcustomerchannelestab-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/relatcustomerchannelestab/relatcustomerchannelestab.add.html'
        });
});