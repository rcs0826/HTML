define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgind
    # Table...: gr-cli
    # Service.: serviceGrupoClienteZoom
    # Register: mpd.gr-cli.zoom
    ####################################################################################################*/

	serviceGrupoClienteZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceGrupoClienteZoom($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {
		
		var service = {};
		angular.extend(service, zoomService);
        
        service.useSearchMethod = true;
		service.searchParameter = 'id';
		service.useCache = true;
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad129a/:method/:id', {}, {
            DTSGet: {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/dbo/adbo/boad129a/:id',
                params: {}
            }       
        });
		service.zoomName = "l-customer-group";
        
        // Método customizado para requisições GET
        service.resource.TOTVSDTSGet = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSGet(parameters, model);            
            return this.processPromise(call, callback);
        };
        
		service.configuration = ('mpd.grupo-cliente.zoom');
		
        service.matches = ['cod-gr-cli','descricao'];
        service.propertyFields = [
          	{label: 'l-customer-group', property: 'cod-gr-cli', type:'integer', default: true},
            {label: 'l-description', property: 'descricao', type:'stringextend'},
            ];
        
		service.columnDefs = [
            {headerName: $rootScope.i18n('l-cod-gr-cli', undefined, 'dts/mpd'), field: 'cod-gr-cli'},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'},
            ];
        
        service.getObjectFromValue =  function (value) {
            if (!value) return undefined;
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
        
        /*service.comparator = function(item1, item2) {
            return (item1['cod-gr-cli'] === item2['cod-gr-cli']);
        };*/
        
        service.groupList = [];
        service.getGroup = function (value) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            // Busca o item pelo código ou pela descrição
            queryproperties.where  = "cod-gr-cli MATCHES "+value+" OR descricao MATCHES '*"+value+"*'"; 
            queryproperties.limit  = 20;
            queryproperties.fields = "cod-gr-cli,descricao";
            
            this.resource.TOTVSDTSGet(queryproperties, undefined, function (result) {
                service.groupList = result;
            }, {noErrorMessage: true}, true);            
        };
        
		return service;		
	}
	index.register.service('mpd.grupo-cliente.zoom', serviceGrupoClienteZoom);
    index.register.service('mpd.grupo-cliente.select', serviceGrupoClienteZoom);
	
});