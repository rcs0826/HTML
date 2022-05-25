define(['index',
    '/dts/hgp/html/hcg-eSocialImportaCSV/controller/eSocialImportaCSVListController.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcg-eSocialImportaCSV', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcg-eSocialImportaCSV.start', {
                url: '/dts/hgp/hcg-eSocialImportaCSV',
                controller: 'hcg.eSocialImportaCSVList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-eSocialImportaCSV/ui/eSocialImportaCSVList.html'
            })
        
});


