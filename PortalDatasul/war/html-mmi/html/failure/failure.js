define(['index', 
		'/dts/mmi/js/dbo/bomn262.js',
		'/dts/mmi/html/failure/failure-list.js',
		'/dts/mmi/html/failure/failure-detail.js',
		'/dts/mmi/html/failure/failure-edit.js'], function(index) {

	// Inicializa os states da aplica��o.
    index.stateProvider
     
        // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mmi/failure', {
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
        .state('dts/mmi/failure.start', {
            url:'/dts/mmi/failure/',
            controller:'mmi.failure.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/failure/failure.list.html'
        })
        
        // definição do state de visualização do registro
        .state('dts/mmi/failure.detail', {
            url:'/dts/mmi/failure/detail/:id',
            controller:'mmi.failure.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/failure/failure.detail.html'
        })
        
        // definição do state de modificação do registro
        .state('dts/mmi/failure.edit', {
            url: '/dts/mmi/failure/edit/:id',
            controller: 'mmi.failure.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/failure/failure.edit.html'
        })
        
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mmi/failure.new', {
            url: '/dts/mmi/failure/new',
            controller: 'mmi.failure.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/failure/failure.edit.html'
        });

});