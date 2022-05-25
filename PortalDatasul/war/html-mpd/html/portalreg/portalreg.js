define(['index',        
                 
        
        '/dts/mpd/js/portal-factories.js',
        '/dts/mpd/html/portalreg/portalreg-controllers.js'], 

function(index) {
    index.stateProvider
        // como a api de states utiliza hierarquia de states, temos que definir o state raiz da tela
        .state('dts/mpd/portalreg', {
            abstract: true,
            template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
        })
    
        // definição do state inicial, o state é carregado a partir de sua URL
        .state('dts/mpd/portalreg.start', {
            url:'/dts/mpd/portalreg/:idPortalConfigur/:idTipConfig',
            controller:'mpd.portal-reg-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalreg/portal-reg.list.html'
        })
         
        // definição do state de visualização do registro
        .state('dts/mpd/portalreg.detail', {
            url:'/dts/mpd/portalreg/detail/:table/:idPortalConfigur/:id',
            controller:'mpd.portal-reg-detail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/portalreg/portal-reg.detail.html'
        })
         
        // definição do state de modificação do registro
        .state('dts/mpd/portalreg.edit', {
            url: '/dts/mpd/portalreg/edit/:table/:idPortalConfigur/:id',
            controller: 'mpd.portal-reg-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.edit.html'
        })
         
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mpd/portalreg.new', {
            url: '/dts/mpd/portalreg/:idPortalConfigur/:idiTipConfig/:table/new',
            controller: 'mpd.portal-reg-edit.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.edit.html'
        })
    
        //definição do state de adcionar itens bacth
        .state('dts/mpd/portalreg.inclAdvanItem', {
            url: '/dts/mpd/portalreg/:itensInclAdvanItem',
            controller: 'mpd.portal-reg-incl-advan-item.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.inclAdvanItem.html'
        })
    
        //definição do state de adcionar condições de pagamentos
        .state('dts/mpd/portalreg.inclAdvanCondPagto', {
            url: '/dts/mpd/portalreg/:itensInclAdvanCondPagto',
            controller: 'mpd.portal-reg-incl-advan-cond-pagto.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.inclAdvanCondPagto.html'
        })
    
        //definição do state de adcionar tabelas de preços
        .state('dts/mpd/portalreg.inclAdvanTbPreco', {
            url: '/dts/mpd/portalreg/:itensInclAdvanTbPreco',
            controller: 'mpd.portal-reg-incl-advan-tb-preco.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.inclAdvanTbPreco.html'
        })

        //definição do state de adcionar tipo de operacao
        .state('dts/mpd/portalreg.inclAdvanTpOperacao', {
            url: '/dts/mpd/portalreg/:itensinclAdvanTpOperacao',
            controller: 'mpd.portal-reg-incl-advan-tp-operacao.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.inclAdvanTpOperacao.html'
        })

		//definição do state de adcionar canal de venda
        .state('dts/mpd/portalreg.inclAdvanCanalVenda', {
            url: '/dts/mpd/portalreg/:itensInclAdvanCanalVenda',
            controller: 'mpd.portal-reg-incl-advan-canal-venda.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.inclAdvanCanalVenda.html'
        })
    
        .state('dts/mpd/portalreg.copy', {
            url: '/dts/mpd/portalreg/copy/:idPortalConfigur',
            controller: 'mpd.portal-reg-copy.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/mpd/html/portalreg/portal-reg.copy.html'
        });
});