define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    situationZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function situationZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsausituation/:method/:id');
        service.zoomName       = 'Situação';
        service.setConfiguration('hrs.situationZoomController');
        service.idSearchMethod = 'getSituationByZoomId';
        service.applyFilterMethod = 'getSituationsForZoom';
        service.propertyFields = [
		{   label: 'Código',  	       
            property: 'idSituacao', 
            type: 'integer',
            default: true
        },{   
            label: 'Nome',     
            property: 'nmSituacao',
            type: 'string'
        }];
            
        service.columnDefs = [
            {   
                headerName: 'Código', 
                field: 'idSituacao', 
                width: 70, 
                minWidth: 70
            },
            {   
                headerName: 'Situação', 
                field: 'nmSituacao', 
                width: 210, 
                minWidth: 200
            },
            {
                 headerName: 'Descrição', 
                 field: 'dsSituacao', 
                 width: 250, 
                 minWidth: 200
             }
        ];

        
        service.validateSelectedValue = function(value){
            return true;
        };
        
        service.getObjectFromValue = function (value, fixedFilters) {     
            
            if(!value) return;
            
            var params = {};
            
            if(fixedFilters){
                var conversionParams = {};
                if(fixedFilters.hasOwnProperty('filters')){
                    conversionParams = {parameters: {init: fixedFilters}};
            	}else{
                    conversionParams = {parameters: {init: { filters : fixedFilters}}};
            	}
                
                params = dtsUtils.mountQueryProperties(conversionParams);
            }
            
            params.id = value;
            params.method = this.idSearchMethod;
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }
    
    index.register.factory('hrs.situationZoomController', situationZoomController);

});