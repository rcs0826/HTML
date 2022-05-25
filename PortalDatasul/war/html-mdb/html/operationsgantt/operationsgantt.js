define(['index',
        '/dts/mdb/html/operationsgantt/operationsgantt.controller.js',
        '/dts/mdb/html/operationsgantt/operationsgantt.parameters.controller.js',
        '/dts/mdb/html/operationsgantt/operationsgantt.legend.controller.js',
        '/dts/mdb/html/operationsgantt/operationsgantt.backlog.controller.js',
        '/dts/mdb/html/operationsgantt/operationsgantt.validate.controller.js',
        '/dts/mdb/js/api/fch/fchmdb/fchmdb0001.js',
        '/dts/mdb/js/api/fch/fchmdb/fchmdb0002.js',
        '/dts/mdb/js/utils/utils.js'],function(index) {

    // Inicializa os states da aplicacao.
    index.stateProvider

    .state('dts/mdb/operationsgantt', {
        abstract: true,
        template: '<ui-view/>'
    })
    
    .state('dts/mdb/operationsgantt.start', {
        url:'/dts/mdb/operationsgantt/:scenario/:simulation/',
        controller:'mdb.operationsgantt.controller',
        controllerAs: 'controller',
        templateUrl:'/dts/mdb/html/operationsgantt/operationsgantt.html'
    })
});