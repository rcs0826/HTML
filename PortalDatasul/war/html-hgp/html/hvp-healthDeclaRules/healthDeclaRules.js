define(['index', 
        '/healthcare/hvp/html/healthDeclaRules/controller/healthDeclaRulesListController.js',
        '/healthcare/hvp/html/healthDeclaRules/maintenance/controller/healthDeclaRulesMaintenanceController.js'
        ], function(index) {

    index.stateProvider
	
        .state('healthcare/hvp/healthDeclaRules', {
            abstract: true,
            template: '<ui-view/>'
        })
		
            .state('healthcare/hvp/healthDeclaRules.start', {
                url: '/healthcare/hvp/healthDeclaRules/',
                controller: 'hvp.healthDeclaRulesListController',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthDeclaRules/ui/healthDeclaRulesList.html'
            })
            
            .state('healthcare/hvp/healthDeclaRules.new', {
                url: '/healthcare/hvp/healthDeclaRules/new',
                controller: 'hvp.healthDeclaRulesMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthDeclaRules/maintenance/ui/healthDeclaRulesMaintenance.html'
            })

            .state('healthcare/hvp/healthDeclaRules.edit', {
                url: '/healthcare/hvp/healthDeclaRules/edit/:id',
                controller: 'hvp.healthDeclaRulesMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthDeclaRules/maintenance/ui/healthDeclaRulesMaintenance.html'
            })
           
            .state('healthcare/hvp/healthDeclaRules.detail', {
                url: '/healthcare/hvp/healthDeclaRules/detail/:id',
                controller: 'hvp.healthDeclaRulesMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthDeclaRules/maintenance/ui/healthDeclaRulesMaintenance.html'
            });
});
