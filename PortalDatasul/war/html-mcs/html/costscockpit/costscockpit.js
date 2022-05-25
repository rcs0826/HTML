define(['index',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0001.js',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0002.js',
        '/dts/mcs/html/costscockpit/costscockpit-list.js',
        '/dts/mcs/html/costscockpit/costscockpit-add-program.js',
        '/dts/mcs/html/costscockpit/costscockpit-chartparameters-controller.js',
        '/dts/mcs/js/zoom/estabelec.js'],function(index) {

    index.stateProvider

    .state('dts/mcs/costscockpit', {
        abstract: true,
        template: '<ui-view/>'
    })

    .state('dts/mcs/costscockpit.start', {
        url:'/dts/mcs/costscockpit/',
        controller:'mcs.costscockpit.ListCtrl',
        controllerAs: 'controller',
        templateUrl:'/dts/mcs/html/costscockpit/costscockpit.list.html'
    })

    .state('dts/mcs/costscockpit.add.program', {
        url: '/dts/mcs/costscockpit/addprogram/',
        controller: 'mcs.costscockpit.AddProgramCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/mcs/html/costscockpit/costscockpit.add.program.html'
    });
});