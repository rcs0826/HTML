define(['index',        
                 
        
        '/dts/mpd/html/productcrossselling/cross-selling-controllers.js'],

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/productcrossselling', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
         
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/productcrossselling.start', {
            url:'/dts/mpd/productcrossselling',
            controller:'mpd.cross-selling-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/productcrossselling/cross-selling.list.html'
        })
         
        // definição do state de visualização do registro
        .state('dts/mpd/productcrossselling.detail', {
            url:'/dts/mpd/productcrossselling/detail/:codProduto/:codCrossSelling',
            controller:'mpd.cross-selling-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/productcrossselling/cross-selling.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/productcrossselling.edit', {
            url: '/dts/mpd/productcrossselling/edit/:codProduto/:codCrossSelling',
            controller: 'mpd.cross-selling-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/productcrossselling/cross-selling.edit.html'
        })
         
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/productcrossselling.new', {
            url: '/dts/mpd/productcrossselling/new',
            controller: 'mpd.cross-selling-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/productcrossselling/cross-selling.add.html'
        });
});