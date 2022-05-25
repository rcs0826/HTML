define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    ressusAbiImportationZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function ressusAbiImportationZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauressus/:method/:id');
        service.zoomName = 'ABI';
        service.setConfiguration('hrs.ressusAbiImportationZoomController');
        service.idSearchMethod = 'getRessusAbiDadosByZoomId';
        service.applyFilterMethod = 'getRessusAbiDadosForZoom';
        service.propertyFields = [
            {   label: 'ABI',
                property: 'codAbi',
                type: 'string',
                default: true
            },
            {   label: 'Número do Ofício',
                property: 'codOficio',
                type: 'string'
            },
            {   label: 'Data de Disponibilização',
                property: 'datRecebto',
                type: 'date'
            }
        ];

        service.columnDefs = [
            {   headerName: 'ABI',
                field: 'codAbi',
                width: 210,
                minWidth: 200
            },
            {   headerName: 'Número do Ofício',
                field: 'codOficio',
                width: 100,
                minWidth: 200
            },
            {   headerName: 'Data de Disponibilização',
                field: 'rotuloDatRecebto',
                width: 100,
                minWidth: 200
            }
        ];

        // Buscar descrições (input)
        service.getObjectFromValue = function (value) {
            if(!value)
            return;

            return this.resource.TOTVSGet({method: this.idSearchMethod, id: value},
                                          undefined,
                                          {noErrorMessage: true},
                                          true);
        };

        return service;
    }
    
    index.register.factory('hrs.ressusAbiImportationZoomController', ressusAbiImportationZoomController);
});