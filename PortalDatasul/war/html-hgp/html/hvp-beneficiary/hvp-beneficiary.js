define(['index', 
        '/dts/hgp/html/hvp-beneficiary/detail/beneficiaryDetailController.js',
        '/dts/hgp/html/hvp-beneficiary/maintenance/controller/beneficiaryOtherUnitsController.js'], function(index) {

    index.stateProvider
	
        .state('dts/hgp/hvp-beneficiary', {
            abstract: true,
            template: '<ui-view/>'
        })
		
        .state('dts/hgp/hvp-beneficiary.start', {
            url:'/dts/hgp/hvp-beneficiary/detail/:benefCardNumber',
            controller:'hvp.benefDetail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/hgp/html/hvp-beneficiary/detail/beneficiary.detail.html'
        })
        
        .state('dts/hgp/hvp-beneficiary.detail', {
            url:'/dts/hgp/hvp-beneficiary/detail/:benefCardNumber/:unity',
            controller:'hvp.benefDetail.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/hgp/html/hvp-beneficiary/detail/beneficiary.detail.html'
        })
        
        .state('dts/hgp/hvp-beneficiary.new', {
            url: '/dts/hgp/hvp-beneficiary/benefOtherUnit/new/:benefCardNumber',
            controller: 'hvp.benefOtherUnitsControlller',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/hvp-beneficiary/maintenance/ui/beneficiary.other.units.html'
        })
});
