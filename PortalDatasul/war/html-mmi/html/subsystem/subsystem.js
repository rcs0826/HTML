define(['index', 
		'/dts/mmi/js/dbo/bomn258.js',
		'/dts/mmi/js/zoom/mi-sist.js',
		'/dts/mmi/html/subsystem/subsystem-list.js',
		'/dts/mmi/html/subsystem/subsystem-detail.js',
		'/dts/mmi/html/subsystem/subsystem-edit.js'], function(index) {

	// Inicializa os states da aplica��o.
    index.stateProvider
     
        // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mmi/subsystem', {
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
        .state('dts/mmi/subsystem.start', {
            url:'/dts/mmi/subsystem/',
            controller:'mmi.subsystem.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/subsystem/subsystem.list.html'
        })
        
        // definição do state de visualização do registro
        .state('dts/mmi/subsystem.detail', {
            url:'/dts/mmi/subsystem/detail/:id',
            controller:'mmi.subsystem.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/subsystem/subsystem.detail.html'
        })
        
        // definição do state de modificação do registro
        .state('dts/mmi/subsystem.edit', {
            url: '/dts/mmi/subsystem/edit/:id',
            controller: 'mmi.subsystem.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/subsystem/subsystem.edit.html'
        })
        
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mmi/subsystem.new', {
            url: '/dts/mmi/subsystem/new',
            controller: 'mmi.subsystem.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/subsystem/subsystem.edit.html'
        });

});