define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
        '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    userZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function userZoomController($injector, $totvsresource, zoomService, dtsUtils) {

    var service = {};
        
        angular.extend(service, zoomService);

        service.resource =  $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsauuser/:method/:id');
        service.zoomName = 'Usuários do Sistema';
        service.setConfiguration('hrc.userZoomController');
        service.idSearchMethod = 'getUserByZoomId';
        service.applyFilterMethod = 'getUserForZoom';

        service.propertyFields = [
            {   label: 'Código do Usuário',
                property: 'codUsuario',
                type: 'string'
            },{
                label: 'Nome do Usuário',
                property: 'nomUsuario',
                type: 'string',
                default: true
            }
        ];
            
        service.columnDefs = [
            {   headerName: 'Código do Usuário',
                field: 'codUsuario',
                width: 110,
                minWidth: 100
            },{
                headerName: 'Nome do Usuário',
                field: 'nomUsuario',
                width: 150,
                minWidth: 100
            }
        ];
        
         /* Foi colocada essa funcao para que permita pesquisar valores em branco
         * ja que a funcao padrao localizada no zoom.js nao permite,
         * dessa forma todas os usuários serão carregadas qdo o campo for mostrado
         */
        service.validateSelectedValue = function(value){
            return true;
        };

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

    index.register.factory('hrc.userZoomController', userZoomController);

});
