define(['index',
        '/dts/mmi/html/laborreport/laborreport-list.js',
        '/dts/mpo/js/api/fch/fchmip/fchmip0066.js',
        '/dts/mmi/js/api/fch/fchmip/fchmiporder.js',
        '/dts/mmi/js/dbo/bomn136.js',
        '/dts/mmi/js/zoom/ord-taref.js',
        '/dts/mmi/js/zoom/tecn-mi.js',
        '/dts/mmi/js/zoom/mi-turno.js',
        '/dts/mmi/js/zoom/mi-espec.js',
        '/dts/mmi/js/utils/filters.js'], function(index) {

	
    index.stateProvider
        .state('dts/mmi/laborreport', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('dts/mmi/laborreport.start', {
            url:'/dts/mmi/laborreport/',
            controller:'mmi.laborreport.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mmi/html/laborreport/laborreport.list.html'
        });
});
