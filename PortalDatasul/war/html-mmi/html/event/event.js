define(['index', 
		'/dts/mmi/js/dbo/bomn262.js',
		'/dts/mmi/html/event/event-list.js',
		'/dts/mmi/html/event/event-detail.js',
		'/dts/mmi/html/event/event-edit.js'], function(index) {

	// Inicializa os states da aplica��o.
    index.stateProvider
     
        // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mmi/event', {
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
        .state('dts/mmi/event.start', {
            url:'/dts/mmi/event/',
            controller:'mmi.event.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/event/event.list.html'
        })
        
        // definição do state de visualização do registro
        .state('dts/mmi/event.detail', {
            url:'/dts/mmi/event/detail/:id',
            controller:'mmi.event.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/event/event.detail.html'
        })
        
        // definição do state de modificação do registro
        .state('dts/mmi/event.edit', {
            url: '/dts/mmi/event/edit/:id',
            controller: 'mmi.event.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/event/event.edit.html'
        })
        
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mmi/event.new', {
            url: '/dts/mmi/event/new',
            controller: 'mmi.event.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/event/event.edit.html'
        });

});