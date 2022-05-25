define(['index', 
        '/dts/mab/js/dbo/bofr032.js',
        '/dts/mab/html/employee/employee-list.js',
        '/dts/mab/html/employee/employee-edit.js',
        '/dts/mab/html/employee/employee-detail.js'
    ], function(index) {

    index.stateProvider
     
        .state('dts/mab/employee', {
            abstract: true,
            template: '<ui-view/>'
        })
     
        .state('dts/mab/employee.start', {
            url:'/dts/mab/employee/',
            controller:'mab.employee.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mab/html/employee/employee.list.html'
        })
        
        // definição do state de visualização do registro
        .state('dts/mab/employee.detail', {
            url:'/dts/mab/employee/detail/:epCodigo/:codEstabel/:codMatr',
            controller:'mab.employee.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mab/html/employee/employee.detail.html'
        });

});