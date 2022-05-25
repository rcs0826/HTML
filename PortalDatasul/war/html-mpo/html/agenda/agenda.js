define(['index',
		'/dts/mpo/js/utils/filters.js',
		'/dts/mpo/js/api/fch/fchmip/fchmip0066.js',
        '/dts/mpo/js/api/fch/fchmpo/fchmpoagenda.js',
        '/dts/mpo/html/agenda/agenda-list.js',
        '/dts/mpo/html/agenda/agenda-detail.js',
        '/dts/mpo/html/agenda/agenda-laborreport.js',
        '/dts/mpo/html/agenda/agenda-detail-laborreport.js'], function(index) {
	
	// Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states � feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mpo/agenda', {
            abstract: true,
            template: '<ui-view/>'
        })
     
         // Estado inicial da tela deve ser o estado pai com o sufixo '.start' este estado
         // será ativado automaticamente quando a tela for carregada.
         //
         // A URL deve ser compatível com a tela inicial.
         //
         // No estado também definimos o controller usado na template do estado, e definimos
         // o nome do controller em 'controllerAs' para ser utilizado na view.
         // também definimos a template ou templateUrl com o HTML da tela da view.
        .state('dts/mpo/agenda.start', {
            url:'/dts/mpo/agenda/',
            controller:'mpo.agenda.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mpo/html/agenda/agenda.list.html'
        }) // definição do state de visualização do registro
        .state('dts/mpo/agenda.detail', {
            url:'/dts/mpo/agenda/detail/',
            controller:'mpo.agenda.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mpo/html/agenda/agenda.detail.html'
        })
        .state('dts/mpo/agenda.laborreport', {
            url:'/dts/mpo/agenda/laborreport/',
            controller:'mpo.agenda.LaborReportCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mpo/html/agenda/agenda.laborreport.html'
        })
	    .state('dts/mpo/agenda.detail.laborreport', {
	        url:'/dts/mpo/agenda/detail-laborreport/',
	        controller:'mpo.agenda.DetailLaborReportCtrl',
	        controllerAs: 'controller',
	        templateUrl:'/dts/mpo/html/agenda/agenda.detail.laborreport.html'
	    });
});