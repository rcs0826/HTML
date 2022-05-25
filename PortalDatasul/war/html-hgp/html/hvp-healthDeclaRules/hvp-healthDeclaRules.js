define(['index', 
        '/dts/hgp/html/hvp-healthDeclaRules/controller/healthDeclaRulesListController.js',
        '/dts/hgp/html/hvp-healthDeclaRules/maintenance/controller/healthDeclaRulesMaintenanceController.js'
        ], function(index) {

    index.stateProvider
	
        .state('dts/hgp/hvp-healthDeclaRules', {
            abstract: true,
            template: '<ui-view/>'
        })
		
            .state('dts/hgp/hvp-healthDeclaRules.start', {
                url: '/dts/hgp/hvp-healthDeclaRules/',
                controller: 'hvp.healthDeclaRulesListController',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/ui/healthDeclaRulesList.html'
            })
            
            .state('dts/hgp/hvp-healthDeclaRules.new', {
                url: '/dts/hgp/hvp-healthDeclaRules/new',
                controller: 'hvp.healthDeclaRulesMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/maintenance/ui/healthDeclaRulesMaintenance.html'
            })

            .state('dts/hgp/hvp-healthDeclaRules.edit', {
                url: '/dts/hgp/hvp-healthDeclaRules/edit/:id',
                controller: 'hvp.healthDeclaRulesMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/maintenance/ui/healthDeclaRulesMaintenance.html'
            })
           
            .state('dts/hgp/hvp-healthDeclaRules.detail', {
                url: '/dts/hgp/hvp-healthDeclaRules/detail/:id',
                controller: 'hvp.healthDeclaRulesMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthDeclaRules/maintenance/ui/healthDeclaRulesMaintenance.html'
            });
});
