define(['index',
		'/dts/mcc/html/requesttoprocess/requesttoprocess-services.js'], function(index) {
	// Inicializa os states da aplicação.
	index.stateProvider

	// Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
	// tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
	// apenas de uma template com o elemento <ui-view> para conter os estados filhos.
	.state('dts/mcc/requesttoprocess', {
		abstract: true,
		template: '<ui-view/>'
	})

	// Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado; Será ativado automaticamente quando a tela for carregada.
	.state('dts/mcc/requesttoprocess.start', {
		url: '/dts/mcc/requesttoprocess/',
		controller: 'mcc.requesttoprocess.ListCtrl',
		controllerAs: 'controller',
		templateUrl: '/dts/mcc/html/requesttoprocess/list/requesttoprocess.list.html'
	})
});