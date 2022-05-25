define(['index',
		'/dts/mcp/js/api/fch/fchman/fchmanpendingappointment.js',
        '/dts/mcp/html/pendingappointment/pendingappointment.list.js'], function(index) {

	// Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mcp/pendingappointment', {
            abstract: true,
            template: '<ui-view/>'
        })
     
         // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado
         // será ativado automaticamente quando a tela for carregada.
         //
         // A URL deve ser compatável com a tela inicial.
         //
         // No estado também definimos o controller usado na template do estado, e definimos
         // o nome do controller em 'controllerAs' para ser utilizado na view.
         // também definimos a template ou templateUrl com o HTML da tela da view.
        .state('dts/mcp/pendingappointment.start', {
            url:'/dts/mcp/pendingappointment/',
            controller:'mcp.pendingappointment.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcp/html/pendingappointment/pendingappointment.list.html'
        });
});