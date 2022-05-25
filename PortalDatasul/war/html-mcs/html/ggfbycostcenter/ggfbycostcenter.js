define(['index',
        '/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-list.controller.js',        
        '/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-detail.controller.js',
        '/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-parameters.controller.js',
	    '/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-advancedsearch.controller.js',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0002.js',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0004.js',
        '/dts/mcs/js/cultures/kendo.culture.de-DE.min.js'],function(index) {
                    
    kendo.culture("de-DE");                
                
    index.stateProvider
     

    .state('dts/mcs/ggfbycostcenter', {
        abstract: true,
        template: '<ui-view/>'
    })
 
    .state('dts/mcs/ggfbycostcenter.start', {
        url:'/dts/mcs/ggfbycostcenter/',
        controller:'mcs.ggfbycostcenter-list.controller',
        controllerAs: 'controller',
        templateUrl:'/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-list.html'
    })

    .state('dts/mcs/ggfbycostcenter.detail', {
        url:'/dts/mcs/ggfbycostcenter/detail/:ccusto/:codestab',
        controller:'mcs.ggfbycostcenter-detail.controller',
        controllerAs: 'controller',
        templateUrl:'/dts/mcs/html/ggfbycostcenter/ggfbycostcenter-detail.html'
    });
    
});