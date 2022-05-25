define(['index',
        '/dts/mcp/js/zoom/ord-prod.js',
        '/dts/mcp/js/zoom/ctrab.js',
        '/dts/mcp/js/zoom/operador.js',
        '/dts/mcp/js/zoom/split-operac.js',
        '/dts/mcp/js/zoom/oper-ord.js',
        '/dts/mcp/js/zoom/equipe-prod.js',
        '/dts/mcp/js/zoom/motiv-refugo.js',
        '/dts/men/js/zoom/item.js',
        '/dts/men/js/zoom/ref-item.js',
        '/dts/mce/js/zoom/deposito.js',
        '/dts/mce/js/zoom/localizacao.js',
		'/dts/mcp/js/api/fch/fchman/fchmanproductionappointment.js',
		'/dts/mcp/html/productionappointmentadd/productionappointmentadd.main.js'], function(index) {

	// Inicializa os states da aplicação.
    index.stateProvider
     
        // Estado pai, a hierarquia de states é feita através do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso é abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mcp/productionappointmentadd', {
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
         .state('dts/mcp/productionappointmentadd.start', {
            url:'/dts/mcp/productionappointmentadd/',
            controller:'mcp.productionappointmentadd.MainCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcp/html/productionappointmentadd/productionappointmentadd.main.html'
        }).state('dts/mcp/productionappointmentadd.aptoPcp', {
            url:'/dts/mcp/productionappointmentadd/:ordemParam',
            controller:'mcp.productionappointmentadd.MainCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcp/html/productionappointmentadd/productionappointmentadd.main.html'
        }).state('dts/mcp/productionappointmentadd.aptoSfc', {
            url:'/dts/mcp/productionappointmentadd/:ordemParam/:opSfc/:splitCode/:ctrab',
            controller:'mcp.productionappointmentadd.MainCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcp/html/productionappointmentadd/productionappointmentadd.main.html'
        });
});