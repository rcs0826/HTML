define(['index',
        '/dts/kbn/html/integrationparameters/integrationparameters.edit.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/integrationparameters', {
        abstract: true,
        template: '<br><ui-view>'
    });

    stateProvider.state('dts/kbn/integrationparameters.start', {
        url: '/dts/kbn/integrationparameters',
        controller: 'ekanban.integrationparameters.EditCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/integrationparameters/integrationparameters.edit.html'
    });
});
