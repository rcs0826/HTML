define(['index',
'/dts/hgp/html/hcm-calculo_comis_agenc/controller/calculo_comis_agencMainController.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcm-calculo_comis_agenc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcm-calculo_comis_agenc.start', {
                url: '/dts/hgp/hcm-calculo_comis_agenc',
                controller: 'hcm.calculo_comis_agencMain.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcm-calculo_comis_agenc/ui/calculo_comis_agencMain.html'
            })                        
        
});


