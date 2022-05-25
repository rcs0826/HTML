define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    var userZoomService = function($timeout, $totvsresource, $rootScope,
        $filter, zoomService) {
        var service = this;

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/fnbo/bofn017//:id/?order=cod_usuario');
        service.zoomName = $rootScope.i18n('l-user');
        service.configuration = true;
        service.advancedSearch = false;
        service.matches = ['cod_usuario', 'nom_usuario'];

        service.propertyFields = [
            { label: 'l-code', property: 'cod_usuario', type: 'string', default: true },
            { label: 'l-description', property: 'nom_usuario', type: 'string' }
        ];

        service.columnDefs = [{
            headerName: $rootScope.i18n('l-code'),
            field: 'cod_usuario',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-description'),
            field: 'nom_usuario',
            width: 200,
            minWidth: 200
        }];

        service.comparator = function(item1, item2) {
            return (item1.cod_usuario === item2.cod_usuario);
        };

        service.getObjectFromValue = function(value) {
            if (value) {
                return this.resource.TOTVSGet({
                    id: value
                }, undefined, { noErrorMessage: true }, true);
            }
        };

        return service;
    };

    userZoomService.$inject = ['$timeout',
        '$totvsresource',
        '$rootScope',
        '$filter',
        'dts-utils.zoom'
    ];

    index.register.service("mmv.user.zoom", userZoomService);
});