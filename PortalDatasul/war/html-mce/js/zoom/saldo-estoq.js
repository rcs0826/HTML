define(['index', '/dts/mce/js/mce-utils.js', '/dts/mce/js/mce-legend-service.js', '/dts/dts-utils/js/zoom/zoom.js'], function (index) {

    /*####################################################################################################
     # ZOOM DA TABELA: saldo-estoq (para recuperar o lote)
     # SERVICO.......: serviceZoomSaldoEstoq
     # REGISTRO......: mce.zoom.SaldoEstoq
 ####################################################################################################*/
    serviceZoomSaldoEstoq.$inject = ['$timeout', '$totvsresource', 'mce.utils.Service', 'dts-utils.zoom', '$rootScope'];

    function serviceZoomSaldoEstoq($timeout, $totvsresource, mceUtils, zoomService, $rootScope) {

        var service = {};

        angular.extend(service, zoomService); // Extende o serviço de zoom padrão

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin403na/');

        service.zoomName = $rootScope.i18n('l-stock-balance', undefined, 'dts/mce');

        service.setConfiguration('mce.saldo-estoq.zoom');
		
		service.useCache = false;

        service.propertyFields = [
            {
                label: $rootScope.i18n('l-lot-serial', undefined, 'dts/mce'),
                property: 'lote',
                type: 'stringextend',
                maxlength: 40,
            },
            {
                label: $rootScope.i18n('l-warehouse', undefined, 'dts/mce'),
                property: 'cod-depos',
                type: 'stringextend',
                maxlength: 3,
                default: true
            },
            {
                label: $rootScope.i18n('l-localization', undefined, 'dts/mce'),
                property: 'cod-localiz',
                type: 'stringextend',
                maxlength: 20,
            },
            {
                label: $rootScope.i18n('l-reference', undefined, 'dts/mce'),
                property: 'cod-refer',
                type: 'stringextend',
                maxlength: 16,
            },
            {
                label: $rootScope.i18n('l-dateValidLot', undefined, 'dts/mce'),
                property: 'dt-vali-lote',
                type: 'date'
            },
            {
                label: $rootScope.i18n('l-current-qtd', undefined, 'dts/mce'),
                property: 'qtidade-atu',
                type: 'decimalrange',
                vMin: 0,
                vMax: 999999999
            }
        ];


        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-lot-serial', undefined, 'dts/mce'),
                field: 'lote',
                width: 100,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-dateValidLot', undefined, 'dts/mce'),
                field: 'dt-vali-lote',
                width: 124,
                minWidth: 124,
                valueGetter: function (params) {
                    return mceUtils.formatDate(params.data['dt-vali-lote'])
                }
            },
            {
                headerName: $rootScope.i18n('l-current-qtd', undefined, 'dts/mce'), 
                field: 'qtidade-atu',
                width: 100,
                minWidth: 100,
                valueGetter: function (params) {
                    return mceUtils.formatDecimal(params.data['qtidade-atu'], '4')
                }
            },
            {
                headerName: $rootScope.i18n('l-available-qtd', undefined, 'dts/mce'),
                width: 100,
                minWidth: 100,
                valueGetter: function (params) {
                    return mceUtils.formatDecimal(params.data['_']['saldoDisponivel'], '4')
                }
            },
            {
                headerName: $rootScope.i18n('l-site', undefined, 'dts/mce'), 
                field: 'cod-estabel',
                width: 100,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-item', undefined, 'dts/mce'), 
                field: 'it-codigo',
                width: 100,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-warehouse', undefined, 'dts/mce'),
                field: 'cod-depos',
                width: 100,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-localization', undefined, 'dts/mce'),
                field: 'cod-localiz',
                width: 100,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-reference', undefined, 'dts/mce'),
                field: 'cod-refer',
                width: 100,
                minWidth: 100
            }
	    ];
		
		
        service.beforeQuery = function (queryproperties, parameters) {
            if(parameters.init) {
                queryproperties.property = queryproperties.property || [];
                queryproperties.value = queryproperties.value || [];
				
				queryproperties.where = (' qtidade-atu <> 0 ');
				
				var field = parameters.selectedFilter.property;

				if(field == "cod-depos"){
					queryproperties.order = "saldo-estoq.cod-depos";
				}
				else if(field == "cod-localiz"){
					queryproperties.order = "saldo-estoq.cod-localiz";
				}
				else if(field == "cod-refer"){
					queryproperties.order = "saldo-estoq.lote"; 	
				}				
				else if(field == "dt-vali-lote"){
					queryproperties.order = "saldo-estoq.dt-vali-lote"; 	
				}
				else if(field == "qtidade-atu"){
					queryproperties.order = "saldo-estoq.qtidade-atu"; 	
				}					

                if(parameters.init.filter) {
                    for (var property in parameters.init.filter) {
                        // Verifica se o usuï¿½rio informou algum valor para a propriedade, se nï¿½o, utiliza o valor padrï¿½o (init)
                        if(queryproperties.property.indexOf(property) < 0) {
                            queryproperties.property.push(property);
                            queryproperties.value.push(parameters.init.filter[property]);
                        }
                    }
                }
            }
        };		
        
        return service;

    }

    index.register.service('mce.saldo-estoq.zoom', serviceZoomSaldoEstoq);
    index.register.service('mce.saldo-estoq-orig.zoom', serviceZoomSaldoEstoq);	
    index.register.service('mce.saldo-estoq-dest.zoom', serviceZoomSaldoEstoq);		

});