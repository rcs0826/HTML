define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
        '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    groupZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function groupZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsaugroup/:method/:id');
        service.zoomName = 'Grupos de Usuários do Sistema';
        service.setConfiguration('global.groupZoomController');
        service.idSearchMethod = 'getGroupByZoomId';
        service.applyFilterMethod = 'getGroupForZoom';

        service.propertyFields = [
            {   label: 'Nome do Grupo',
                property: 'cod_grp_usuar',
                type: 'string'
            },{
                label: 'Descrição do Grupo',
                property: 'des_grp_usuar',
                type: 'string',
                default: true
            }
        ];
            
        service.columnDefs = [
            {   headerName: 'Nome do Grupo',
                field: 'nmGrupo',
                width: 110,
                minWidth: 100
            },{
                headerName: 'Descrição do Grupo',
                field: 'dsDescricao',
                width: 150,
                minWidth: 100
            }
        ];
        

        // Buscar descricoes (input)
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

    index.register.factory('global.groupZoomController', groupZoomController);

});
