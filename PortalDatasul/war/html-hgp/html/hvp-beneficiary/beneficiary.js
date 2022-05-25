define(['index', 
        '/healthcare/hvp/html/beneficiary/detail/beneficiaryDetailController.js',
        '/healthcare/hvp/html/beneficiary/maintenance/controller/beneficiaryOtherUnitsController.js'], function(index) {

    index.stateProvider
	
        .state('healthcare/hvp/beneficiary', {
            abstract: true,
            template: '<ui-view/>'
        })
		
        .state('healthcare/hvp/beneficiary.start', {
            url:'/healthcare/hvp/beneficiary/detail/:benefCardNumber',
            controller:'hvp.benefDetail.Control',
            controllerAs: 'controller',
            templateUrl:'/healthcare/hvp/html/beneficiary/detail/beneficiary.detail.html'
        })
        
        .state('healthcare/hvp/beneficiary.detail', {
            url:'/healthcare/hvp/beneficiary/detail/:benefCardNumber/:unity',
            controller:'hvp.benefDetail.Control',
            controllerAs: 'controller',
            templateUrl:'/healthcare/hvp/html/beneficiary/detail/beneficiary.detail.html'
        })
        
        .state('healthcare/hvp/beneficiary.new', {
            url: '/healthcare/hvp/beneficiary/benefOtherUnit/new/:benefCardNumber',
            controller: 'hvp.benefOtherUnitsControlller',
            controllerAs: 'controller',
            templateUrl: '/healthcare/hvp/html/beneficiary/maintenance/ui/beneficiary.other.units.html'
        })
});
