define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    adjustmentPercentageZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function adjustmentPercentageZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauperchistorimpug/:method/:id');
        service.zoomName       = 'Percentual';
        service.setConfiguration('hrs.adjustmentPercentageZoomController');
        service.idSearchMethod = 'getPercHistorImpugByZoomId';
        service.applyFilterMethod = 'getPercHistorImpugsForZoom';
        service.propertyFields = [
		{   label: 'Ano',  	       
                    property: 'numAno', 
                    type: 'integer',
                    default: true
                },{   
                    label: 'Mes',     
                    property: 'numMes',
                    type: 'integer'
                }
	];
            
        service.columnDefs = [
            {   headerName: 'Valor Percentual %', 
                field: 'valPerc', 
                width: 100, 
                minWidth: 200
             },{   headerName: 'Ano', 
                field: 'numAno', 
                width: 70, 
                minWidth: 70
             }, {
                 headerName: 'Mes', 
                 field: 'numMes', 
                 width: 100, 
                 minWidth: 100
             },{
                headerName: 'Mes', 
                field: 'numMes', 
                width: 100, 
                minWidth: 100
            }
        ];
        
        // Buscar descrições (input)
        service.getObjectFromValue = function (value) {     
            
            if(!value) return;
            
            return this.resource.TOTVSGet(
                    {method: this.idSearchMethod,
                         id: value}, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }
    
    index.register.factory('hrs.adjustmentPercentageZoomController', adjustmentPercentageZoomController);

});
