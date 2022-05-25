define(['index',
        '/dts/kbn/html/checklist/checklist.list.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/checklist', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/checklist.start', {
        url: '/dts/kbn/checklist',
        controller: 'ekanban.checklist.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/checklist/checklist.list.html'
    });

});
