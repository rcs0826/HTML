define(['index',
        '/dts/mmi/js/dbo/bomn150.js',
        '/dts/mmi/js/zoom/equipto.js',
        '/dts/mmi/html/servicerequest/servicerequest-list.js',
        '/dts/mmi/html/servicerequest/servicerequest-detail.js',
        '/dts/mmi/js/api/fch/fchmip/fchmipservicerequest.js',
        '/dts/mmi/js/utils/filters.js',
        '/dts/mmi/js/zoom/manut.js',
        '/dts/mmi/js/zoom/tag.js',
        '/dts/mmi/js/zoom/sintoma.js',
        '/dts/mmi/js/zoom/causa-padr.js',
        '/dts/mmi/js/zoom/interv-padr.js',
        '/dts/mmi/js/zoom/mi-parada.js',
        '/dts/mmi/js/zoom/mnt-planejador.js',
        '/dts/mmi/js/zoom/ord-taref.js',
        '/dts/mmi/js/utils/mmi-utils.js'
    ], function(index) {

	// Inicializa os states da aplica��o.
    index.stateProvider

        // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mmi/servicerequest', {
            abstract: true,
            template: '<ui-view/>'
        })

         // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado
         // ser� ativado automaticamente quando a tela for carregada.
         //
         // A URL deve ser compat�vel com a tela inicial.
         //
         // No estado tamb�m definimos o controller usado na template do estado, e definimos
         // o nome do controller em 'controllerAs' para ser utilizado na view.
         // tamb�m definimos a template ou templateUrl com o HTML da tela da view.
        .state('dts/mmi/servicerequest.start', {
            url:'/dts/mmi/servicerequest/',
            controller:'mmi.servicerequest.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/servicerequest/servicerequest.list.html'
        })
        
        // definição do state de visualização do registro
        .state('dts/mmi/servicerequest.detail', {
            url:'/dts/mmi/servicerequest/detail/:id',
            controller:'mmi.servicerequest.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/servicerequest/servicerequest.detail.html'
        })

        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mmi/servicerequest.new', {
            url: '/dts/mmi/servicerequest/new',
            controller: 'mmi.servicerequest.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/servicerequest/servicerequest.edit.html'
        });



});
