define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {
    professionalZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    function professionalZoomController($injector, $totvsresource, zoomService, dtsUtils) {
        var service = {};

        angular.extend(service, zoomService);
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/atfa/fchprofessional/:method/:id');
        service.zoomName = 'Profissional';
        service.setConfiguration('hcg.professionalZoomController');
        service.idSearchMethod = 'getProfessionalByZoomId';
        service.applyFilterMethod = 'getProfessionalForZoom';
        service.useCache = false;
        service.propertyFields = [
            {
                label: 'CPF',
                property: 'taxPayerNumber',
                type: 'string',
                default: true
            }, {
                label: 'Nome',
                property: 'name',
                type: 'string'
            }, {
                label: 'Conselho',
                property: 'councilMedicalCode',
                type: 'string'
            }, {
                label: 'Estado',
                property: 'state',
                type: 'string'
            }, {
                label: 'Registro',
                property: 'councilRegister',
                type: 'string'
            }, {
                label: 'Conselho Prest. Principal',
                property: 'councilRegister',
                type: 'string'
            }, {
                label: 'Cód. Prest. Principal',
                property: 'providerCode',
                type: 'string'
            }, {
                label: 'Unidade Prest. Principal',
                property: 'providerUnityCode',
                type: 'string'
            }
        ];

        service.columnDefs = [
            {
                headerName: 'CPF',
                field: 'cod-cpf',
                width: 110,
                minWidth: 100
            }, {
                headerName: 'Nome',
                field: 'nom-profis',
                width: 150,
                minWidth: 100
            }, {
                headerName: 'Conselho',
                field: 'cod-cons-medic',
                width: 150,
                minWidth: 100
            }, {
                headerName: 'Registro',
                field: 'cod-registro',
                width: 150,
                minWidth: 100
            }, {
                headerName: 'Estado',
                field: 'cod-uf-cons',
                width: 150,
                minWidth: 100
            }
        ];

        return service;
    }
    index.register.factory('hcg.professionalZoomController', professionalZoomController);
});