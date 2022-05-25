define([
    'index', '/dts/mft/html/document-tag-config/document-tag-config-controller.js', '/dts/mft/js/api/document-tag-config.js'
], function (index) {
    index.stateProvider
        .state('dts/mft/document-tag-config', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('dts/mft/document-tag-config.start', {
            url: '/dts/mft/document-tag-config/',
            controller: 'mft.document-tag-config.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mft/html/document-tag-config/document-tag-config.html'
        })
        .state('dts/mft/document-tag-config.new', {
            url: '/dts/mft/document-tag-config/new',
            controller: 'mft.document-tag-config.add-edit.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-add-edit.html'
        })
        .state('dts/mft/document-tag-config.edit', {
            url: '/dts/mft/document-tag-config/edit/:cdnDoctoTag',
            controller: 'mft.document-tag-config.add-edit.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-add-edit.html'
        })
        .state('dts/mft/document-tag-config.copy', {
            url: '/dts/mft/document-tag-config/copy/:cdnDoctoTag',
            controller: 'mft.document-tag-config.add-edit.controller',
            controllerAs: 'controller',
            templateUrl: '/dts/mft/html/document-tag-config/document-tag-config-add-edit.html'
        });
});