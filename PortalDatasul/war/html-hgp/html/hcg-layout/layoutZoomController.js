define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    layoutZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function layoutZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {}; 
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName       = 'Layout';
        service.setConfiguration('hcg.layoutImprContaMedicaZoomController');
        service.idSearchMethod = 'getTablasByZoomId';
        service.applyFilterMethod = 'getTablasForZoom';
        service.useCache = false;

        service.propertyFields = [
		{   
          label: 'Código',     
          property: 'cdLayout', 
          type: 'string',
          operator: 'begins'
         }, 
         {   
          label: 'Descrição',     
          property: 'dsLayout',
          type: 'string',
          default: true,
          operator: 'begins'
         },
	];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'cdLayout', 
                width: 50, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'dsLayout', 
                 width: 200, 
                 minWidth: 100
             }
        ];
        
       service.validateSelectedValue = function(value){
            if (value.selectedFilter != undefined
            &&  value.selectedFilter.property == undefined){
              return true;            
            }

            if (value.selectedFilterValue != ""){
              return true;
            }
            
            return false;
        };

        // Buscar descriÃ§Ãµes (input)
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

            params.id     = value;
            params.method = this.idSearchMethod;

            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }
    
    index.register.factory('hcg.layoutImprContaMedicaZoomController', layoutZoomController);
	index.register.factory('hcg.layoutExpoA450ZoomController', layoutZoomController);
	index.register.factory('hcg.layoutExpoA1100ZoomController', layoutZoomController);
	index.register.factory('hcg.layoutExpoA1200ZoomController', layoutZoomController);
	index.register.factory('hcg.layoutImpoA1200ZoomController', layoutZoomController);
	index.register.factory('hcg.layoutExpoA1300ZoomController', layoutZoomController);

});