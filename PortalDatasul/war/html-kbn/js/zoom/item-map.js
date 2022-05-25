define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js'
], function(index) {
    
    serviceZoomItemMap.$inject = [
        '$timeout',
        '$totvsresource',
        '$rootScope',
        '$filter',
        'dts-utils.zoom',
        'i18nFilter'
    ];

    function serviceZoomItemMap($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchkb/fchkbzoomitem/itemsMapeamento/:method/:id/');
        service.zoomName = i18nFilter('l-mapping-items', [], 'dts/kbn');
        service.configuration = true;
        service.advancedSearch = false;
        service.matches = ['cod_chave_erp', 'des_item_erp'];

        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters,model);
            return service.resource.processPromise(call, callback);
        };

        service.propertyFields = [
            {label: i18nFilter('l-code', [], 'dts/kbn'), property: 'cod_chave_erp', type: 'string', default: true},
            {label: i18nFilter('l-description', [], 'dts/kbn'), property: 'des_item_erp', type: 'string'}
        ];

        service.columnDefs = [
            {headerName: i18nFilter('l-code', [], 'dts/kbn'), field: 'cod_chave_erp', hide: false, width: 80, minWidth: 80},
            {headerName: i18nFilter('l-description', [], 'dts/kbn'), field: 'des_item_erp', hide: false, width: 180, minWidth: 180},
            {headerName: i18nFilter('l-reference', [], 'dts/kbn'), field: 'cod_refer', hide: false, width: 60, minWidth: 60},
            {headerName: i18nFilter('l-type', [], 'dts/kbn'), field: 'log_expedic', hide: false, width: 60, minWidth: 60, valueGetter: function(params){
            	var cText = "";
        		switch (params.data.log_expedic){
    				case true :
    					cText = i18nFilter('l-expedition', [], 'dts/kbn');
    					break;
    				case false :
    					cText = i18nFilter('l-process', [], 'dts/kbn');
    					break;
        		};
        		return cText; 
    		}},
            {headerName: i18nFilter('l-current-cell', [], 'dts/kbn'), field: 'cod_cel_erp', hide: false, width: 100, minWidth: 100},
            {headerName: i18nFilter('l-site', [], 'dts/kbn'), field: 'cod_estab_erp', hide: false, width: 80, minWidth: 80}
        ];

        service.comparator= function(item1, item2) {
            return (item1.id === item2.id);
        };

        service.getObjectFromValue = function(value){
            return this.resource.TOTVSGet({
                id: value,
                numIdMapeamento: init.filters['num-id-mapeamento']
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        return service;
    }

    index.register.service('kbn.item-map.zoom', serviceZoomItemMap);
});