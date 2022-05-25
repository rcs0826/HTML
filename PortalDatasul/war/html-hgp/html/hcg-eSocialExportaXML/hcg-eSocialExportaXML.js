define(['index',
'/dts/hgp/html/hcg-eSocialExportaXML/controller/eSocialExportaXMLListController.js',
'/dts/hgp/html/hcg-eSocialExportaXML/controller/eSocialEventDeleteController.js'


], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcg-eSocialExportaXML', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcg-eSocialExportaXML.start', {
                url: '/dts/hgp/hcg-eSocialExportaXML',
                controller: 'hcg.eSocialExportaXMLList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-eSocialExportaXML/ui/eSocialExportaXMLList.html'
            })
            
            .state('dts/hgp/hcg-eSocialExportaXML.delete', {
                url: '/dts/hgp/hcg-eSocialExportaXML/eventDelete',
                controller: 'hcg.eSocialEventDelete.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-eSocialExportaXML/ui/eSocialEventDelete.html'
            })
        
});


