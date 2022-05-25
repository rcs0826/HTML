define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js'
], function(index) {
    
    serviceZoomCtEstab.$inject = [
        '$timeout',
        '$totvsresource',
        '$rootScope',
        '$filter',
        'dts-utils.zoom',
        'i18nFilter'
    ];

    function serviceZoomCtEstab($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchkb/fchkbzoomctmestre/centroTrabalhoEstab/:method/:id/');
        service.zoomName = i18nFilter('l-cell-workcenters', [], 'dts/kbn');
        service.configuration = true;
        service.advancedSearch = false;
        service.matches = ['cod_chave_erp', 'des_ct_erp'];

        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters,model);
            return service.resource.processPromise(call, callback);
        };

        service.propertyFields = [
            {label: i18nFilter('l-code', [], 'dts/kbn'), property: 'cod_chave_erp', type: 'string', default: true},
            {label: i18nFilter('l-description', [], 'dts/kbn'), property: 'des_ct_erp', type: 'string'}
        ];

        service.columnDefs = [
            {headerName: i18nFilter('l-code', [], 'dts/kbn'), field: 'cod_chave_erp', hide: false, width: 80, minWidth: 80},
            {headerName: i18nFilter('l-description', [], 'dts/kbn'), field: 'des_ct_erp', hide: false, width: 180, minWidth: 180}
        ];

        service.comparator= function(item1, item2) {
            return (item1.id === item2.id);
        };

        service.getObjectFromValue = function(value){
            return this.resource.TOTVSGet({
                id: value,
                numIdEstab: init.filters.num_id_estab,
                numIdCel: init.filters.num_id_cel
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        return service;
    }

    index.register.service('kbn.ct-estab.zoom', serviceZoomCtEstab);
});