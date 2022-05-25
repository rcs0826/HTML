define(['index', 
        '/dts/mab/js/dbo/bofr001.js',
        '/dts/mab/js/api/fch/fchmab/fchmabactivities.js',
        '/dts/mab/html/activities/activities-list.js',
        '/dts/mab/html/activities/activities-detail.js',
        '/dts/mab/html/activities/activities-edit.js'], function(index) {

    // Inicializa os states da aplica��o.
    index.stateProvider
     
        // Estado pai, a hierarquia de states � feita atrav�s do '.', e todo estado novo
        // tem que ter um estado pai, que nesse caso � abstrato. Este status precisa
        // apenas de uma template com o elemento <ui-view> para conter os estados filhos.
        .state('dts/mab/activities', {
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
        .state('dts/mab/activities.start', {
            url:'/dts/mab/activities/',
            controller:'mab.activities.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mab/html/activities/activities.list.html'
        })
        
        // definição do state de visualização do registro
        .state('dts/mab/activities.detail', {
            url:'/dts/mab/activities/detail/:id',
            controller:'mab.activities.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mab/html/activities/activities.detail.html'
        })
        
        // definição do state de modificação do registro
        .state('dts/mab/activities.edit', {
            url: '/dts/mab/activities/edit/:id',
            controller: 'mab.activities.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mab/html/activities/activities.edit.html'
        })
        
        // definição do state de criação de um novo registro
        // note que a edição a criação de registros utilizam os mesmos controllers e templates
        .state('dts/mab/activities.new', {
            url: '/dts/mab/activities/new',
            controller: 'mab.activities.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mab/html/activities/activities.edit.html'
        });

});