define(['index', 
        '/dts/mmi/js/dbo/bomn00306.js',
        '/dts/mmi/html/time/time-list.js',
        '/dts/mmi/html/time/time-edit.js',
        '/dts/mmi/html/time/time-detail.js',
    ], function(index) {

    index.stateProvider
     
        .state('dts/mmi/time', {
            abstract: true,
            template: '<ui-view/>'
        })
     
        .state('dts/mmi/time.start', {
            url:'/dts/mmi/time/',
            controller:'mmi.time.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/time/time.list.html'
        })
        
        // definição do state de visualização do registro
        .state('dts/mmi/time.detail', {
            url:'/dts/mmi/time/detail/:id',
            controller:'mmi.time.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/time/time.detail.html'
        })

        .state('dts/mmi/time.edit', {
            url: '/dts/mmi/time/edit/:id',
            controller: 'mmi.time.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/time/time.edit.html'
        })

        .state('dts/mmi/time.new', {
            url: '/dts/mmi/time/new',
            controller: 'mmi.time.EditCtrl',
            controllerAs: 'controller',
            templateUrl: '/dts/mmi/html/time/time.edit.html'
        });

});