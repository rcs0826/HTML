define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js',
        '/dts/mcc/js/mcc-legend-service.js'], function(index) {

    /*####################################################################################################
     # Database: movind
     # Table...: requisicao
     # Service.: serviceRequisicao
     # Register: mcc.requisicao.zoom
     ####################################################################################################*/
    serviceRequisicao.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', 'mcc.zoom.serviceLegend'];
    function serviceRequisicao($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, serviceLegend){

        var service = {};    
        var queryproperties = {};     
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin385nafx/:method/:id');

        service.zoomName       = $rootScope.i18n('l-requests', [], 'dts/mcc');
        service.setConfiguration('mcc.requisicao.zoom');
        service.limit = 20;
        service.propertyFields = [
            {label: $rootScope.i18n('l-request', [], 'dts/mcc'), property: 'nr-requisicao', type: 'integerrange', default: true, vMin: 0, vMax: 999999999},
            {label: $rootScope.i18n('l-requisition-date', [], 'dts/mcc'), property: 'dt-requisicao', type: 'daterange'},
            {label: $rootScope.i18n('l-requester', [], 'dts/mcc'), property: 'nome-abrev', type: 'stringextend', maxlength: 12},
            {label: $rootScope.i18n('l-requisition-type', [], 'dts/mcc'), property: 'tp-requis', propertyList: [{
                id: 1,
                name: $rootScope.i18n('l-inventory-request'),
                value: 1
            },
            {
                id: 2,
                name: $rootScope.i18n('l-purchase-request'),
                value: 2
            },
            {
                id: 3,
                name: $rootScope.i18n('l-quotation-request'),
                value: 3
            }]}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-request', [], 'dts/mcc'), field: 'nr-requisicao', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-requester', [], 'dts/mcc'), field: 'nome-abrev', width: 115, minWidth: 100},            
            {headerName: $rootScope.i18n('l-realization', [], 'dts/mcc'), field: 'dt-atend', width: 100, minWidth: 100, valueGetter: function(params) {
                if(params.data['dt-atend']) return $filter('date') (params.data['dt-atend'], $rootScope.i18n('l-date-format', [], 'dts/mcc'));
            }},            
            {headerName: $rootScope.i18n('l-status', [], 'dts/mcc'), field: 'situacao', width: 100, minWidth: 100, valueGetter: function(params) {
                if(params.data['situacao']) {                    
                    return serviceLegend.requestStatus.NAME(params.data['situacao']);
                }
            }},            
            {headerName: $rootScope.i18n('l-requisition-date', [], 'dts/mcc'), field: 'dt-requisicao', width: 140, minWidth: 100, valueGetter: function(params) {
                if(params.data['dt-requisicao']) return $filter('date') (params.data['dt-requisicao'], $rootScope.i18n('l-date-format', [], 'dts/mcc'));
            }},            
            {headerName: $rootScope.i18n('l-approved-gen', [], 'dts/mcc'), field: 'estado', width: 100, minWidth: 100, valueGetter: function(params) {
                if(params.data['estado']) return serviceLegend.requestState.NAME(params.data['estado']);
            }},            
            {headerName: $rootScope.i18n('l-approver', [], 'dts/mcc'), field: 'nome-aprov', width: 115, minWidth: 100},            
            {headerName: $rootScope.i18n('l-site', [], 'dts/mcc'), field: 'cod-estabel', width: 130, minWidth: 100},            
            {headerName: $rootScope.i18n('l-type', [], 'dts/mcc'), field: 'tp-requis', width: 170, minWidth: 100, valueGetter: function(params) {
                if(params.data['tp-requis']) return serviceLegend.requestType.NAME(params.data['tp-requis']);
            }}
        ];

        return service;
    }
 
    index.register.service('mcc.requisicao.zoom', serviceRequisicao);
});
