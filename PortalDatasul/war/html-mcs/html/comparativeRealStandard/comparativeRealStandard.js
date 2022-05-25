define(['index',
        '/dts/mcs/js/api/fch/fchmcs/fchmcs0002.js',
        '/dts/mcs/html/comparativeRealStandard/comparativeRealStandard.controller.js',
        '/dts/mcs/html/comparativeRealStandard/comparativeRealStandard.parameters.controller.js',
        '/dts/mcs/html/comparativeRealStandard/comparativeRealStandard.detail.controller.js',
        '/dts/mcs/html/modalErrors/modalErrors.controller.js',
        '/dts/mcs/js/zoom/estabelec.js',
        '/dts/men/js/zoom/item.js',
        '/dts/men/js/zoom/ref-item.js'],function(index) {

index.stateProvider

.state('dts/mcs/comparativeRealStandard', {
abstract: true,
template: '<ui-view/>'
})

.state('dts/mcs/comparativeRealStandard.start', {
    url:'/dts/mcs/comparativeRealStandard/:site/:item/:date',
    controller:'mcs.comparativeRealStandard.controller',
    controllerAs: 'controller',
    templateUrl:'/dts/mcs/html/comparativeRealStandard/comparativeRealStandard.html'
    });
});

