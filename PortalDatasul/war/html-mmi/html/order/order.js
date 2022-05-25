define(['index',
        '/dts/mmi/js/dbo/bomn134.js',
        '/dts/mmi/js/dbo/bomn136.js',
        '/dts/mmi/js/dbo/boin390.js',
        '/dts/mmi/js/zoom/equipto.js',
        '/dts/mmi/js/zoom/equipe.js',
        '/dts/mmi/js/zoom/manut.js',
        '/dts/mmi/js/zoom/ord-taref.js',
        '/dts/mmi/js/zoom/tag.js',
        '/dts/mmi/js/zoom/sintoma.js',
        '/dts/mmi/js/zoom/causa-padr.js',
        '/dts/mmi/js/zoom/interv-padr.js',
        '/dts/mmi/js/zoom/projeto.js',
        '/dts/mmi/js/zoom/inspec.js',
        '/dts/mmi/js/zoom/mi-parada.js',
        '/dts/mmi/js/zoom/mi-per-parada.js',
        '/dts/mmi/js/zoom/mnt-planejador.js',
        '/dts/mmi/js/zoom/tipo-manut.js',
        '/dts/mmi/js/zoom/form-lubrif.js',
        '/dts/men/js/zoom/item.js',
        '/dts/men/js/zoom/ref-item.js',
        '/dts/mce/js/zoom/deposito.js',
        '/dts/mce/js/zoom/localizacao.js',
        '/dts/mmi/js/utils/filters.js',
		'/dts/mmi/html/order/order-list.js',
        '/dts/mmi/html/order/order-edit.js',
        '/dts/mmi/html/order/order-detail.js',
        '/dts/mmi/js/api/fch/fchmip/fchmiporder.js',
        '/dts/mmi/js/api/fch/fchmip/fchmiplaborreport.js',
        '/dts/mpo/js/api/fch/fchmip/fchmip0066.js',
        '/dts/mmi/js/zoom/mi-espec.js',
        '/dts/mmi/js/zoom/mi-turno.js',
        '/dts/mmi/js/zoom/mip-tecnica.js',
        '/dts/mmi/js/zoom/plano-orig.js',
        '/dts/mmi/js/zoom/epi.js',
        '/dts/mmi/js/zoom/pend-padrao.js',
        '/dts/mmi/js/zoom/mnt-ficha-metodo.js',
        '/dts/mmi/js/api/fch/fchmip/fchmipparameter.js',
        '/dts/mcd/js/directive/select-estabelec.js',
        '/dts/mmi/html/order/order-copy.js',
        '/dts/mmi/html/order/order-suspend.js',
        '/dts/mmi/js/utils/mmi-utils.js'
		], function(index) {

	// Inicializa os states da aplica��o. 
    index.stateProvider
     
        // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mmi/order', {
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
        .state('dts/mmi/order.start', {
            url:'/dts/mmi/order/',
            controller:'mmi.order.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/order/order.list.html'
        })        
        // definição do state de modificação do registro
        .state('dts/mmi/order.edit', {
            url: '/dts/mmi/order/edit/:id',
            controller: 'mmi.order.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/order/order.edit.html'
        })        
        // definição do state de visualização do registro
        .state('dts/mmi/order.detail', {
            url:'/dts/mmi/order/detail/:id',
            controller:'mmi.order.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/order/order.detail.html'
        })        
        // definição do state de detalhe da tarefa
        .state('dts/mmi/order/detail/task', {
            url:'/dts/mmi/order/detail/task/',
            controller:'mmi.order.TaskDetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/order/task/task.detail.html'
        })
        // definição do state de histórico de alteração
        .state('dts/mmi/order/updatehistory', {
            url:'/dts/mmi/order/updatehistory/',
            controller:'mmi.order.HistoryDetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/order/history/history.detail.html'
        })
        
});