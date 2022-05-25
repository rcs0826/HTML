define(['index',
	'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*#####################################################################################################
	 # Database: mgdis
	 # Table...: tab-preco
	 # Service.: serviceTabPreco Portal de Vendas
	 # Register: mpd.tb-preco-pv2.zoom
	 # Obs: Nesse zoom só será mostrado as tabelas de preço que o perfil tem acesso, através do idi-seq que é passado como parâmetro.
	 #####################################################################################################*/

	serviceTabPrecoPv2.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', 'TOTVSEvent',];
	function serviceTabPrecoPv2($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, TOTVSEvent) {
	
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi189pv2/:method/:gotomethod/:id', {fields: "nr-tabpre,descricao,dt-inival,dt-fimval,mo-codigo,situacao"}, {});
		service.zoomName = $rootScope.i18n('l-tab-preco', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['nr-tabpre', 'descricao'];
		service.useCache = false;

		service.propertyFields = [
			{label: 'l-tab-preco', property: 'nr-tabpre', type: 'stringrange', default: true},
			{label: 'l-description', property: 'descricao', type: 'string'},
			{label: 'l-mo-codigo', property: 'mo-codigo', type: 'integerrange'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-tab-preco', undefined, 'dts/mpd'), field: 'nr-tabpre'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'},
			{headerName: $rootScope.i18n('l-dt-inival-tab-preco', undefined, 'dts/mpd'), field: 'dt-inival', valueGetter: function(param) {
					return $filter('date')(param.data['dt-inival'], 'shortDate');
				}},
			{headerName: $rootScope.i18n('l-dt-fimval-tab-preco', undefined, 'dts/mpd'), field: 'dt-fimval', valueGetter: function(param) {
					return $filter('date')(param.data['dt-fimval'], 'shortDate');
				}},
			{headerName: $rootScope.i18n('l-situacao-tab-preco', undefined, 'dts/mpd'), field: 'situacao', valueGetter: function(param) {
					if (param.data.situacao === 1) {
						return $rootScope.i18n('l-ativo', undefined, 'dts/mpd');
					} else if (param.data.situacao === 2) {
						return $rootScope.i18n('l-inativo', undefined, 'dts/mpd');
					} else if (param.data.situacao === 3) {
						return $rootScope.i18n('l-simulacao', undefined, 'dts/mpd');
					}
					return param.data.situacao;
				}},
			{headerName: $rootScope.i18n('l-mo-codigo', undefined, 'dts/mpd'), field: 'mo-codigo'}
		];

		service.getObjectFromValue = function(value) {

			if (value) {					
				return this.resource.TOTVSGet({
					id: value
				}, undefined, {
					noErrorMessage: true
				}, false);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['nr-tabpre'] === item2['nr-tabpre']);
		};

		/* Implementação para que seja feito o filtro da tabela de preço filtrando para mostrar somente as tabelas que foram dadas acesso ao perfil */
		service.beforeQuery = function (queryproperties, parameters) {
		
			 var strQuery;
			 var iSit;
			 
			 queryproperties.where = queryproperties.where || [];
			 		 	 
			 strQuery = "FOR EACH portal-reg-clien WHERE portal-reg-clien.idi-seq = " + parameters.init + " and portal-reg-clien.cod-tabela = 'tb-preco', FIRST tb-preco WHERE tb-preco.nr-tabpre = portal-reg-clien.cod-tab-preco AND tb-preco.situacao <= 1 AND tb-preco.dt-inival <= TODAY AND tb-preco.dt-fimval >= TODAY";
			 			 
			 queryproperties.where.push(strQuery);
		}		

		service.tabPrecoList = [];
		service.getTabPreco = function(value) {
		
			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "nr-tabpre",
				type: "string",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields
			});
			
			return this.resource.TOTVSQuery(queryproperties, function(result) {
				service.emitenteList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, false);

		};

		service.applyFilter = function(parameters) {
			var useCache = true;
				
			if(this.useCache !== undefined)
			{
				useCache = this.useCache;
			}
			
			this.isSelectValue = parameters.isSelectValue;
			if (parameters.isSelectValue) {
				if (this.disclaimerSelect) {
					parameters.disclaimers[0].type = this.disclaimerSelect.type;
					if (this.disclaimerSelect.extend !== undefined) {
						parameters.disclaimers[0].extend = this.disclaimerSelect.extend;
					}
				}
			}

			var thisZoom = this,
				queryproperties = {};
			
			
			if (this.useSearchMethod && parameters.isSelectValue && angular.isArray(this.matches)) {
				queryproperties[this.searchParameter] = parameters.disclaimers[0].value;
				queryproperties.method = 'search';
				queryproperties.searchfields = this.matches.join(',');
				queryproperties.fields = queryproperties.searchfields;
			
			} else if (parameters.isSelectValue && angular.isArray(this.matches)) {
			  
				queryproperties = dtsUtils.mountQueryWhere({
					matches: this.matches,
					columnDefs: this.columnDefs,
					parameters: parameters
				});

			} else {
				queryproperties = dtsUtils.mountQueryProperties({
					parameters: parameters,
					columnDefs: this.columnDefs,
					propertyFields: this.propertyFields
				});
			}

			/* Quantidade máxima de registros para pesquisa */
			if (parameters.isSelectValue) {
				/* Select - Default: 10 */
				if (this.limitSelect) { queryproperties.limit = this.limitSelect; }
			} else {
				/* Zoom - Default: 50*/
				if (this.limitZoom) { queryproperties.limit = this.limitZoom; }
			}

			if (parameters.more) {
				queryproperties.start = this.zoomResultList.length;
			} else {
				thisZoom.zoomResultList = [];
			}
			
			if (this.beforeQuery)
				this.beforeQuery(queryproperties, parameters);

			return this.resource.TOTVSQuery(queryproperties, function (result) {

				if(result) {
					if(result.length < 1 && queryproperties.limit == 50) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, [{ 
							type: 'info', 
							title: $rootScope.i18n('l-no-data'), 
							detail: $rootScope.i18n('msg-no-data-for-price-table') }]);
					}
				}

				thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
				
				if (thisZoom.afterQuery)
					thisZoom.afterQuery(thisZoom.zoomResultList, parameters);
				
				$timeout(function () {
					if (result[0] && result[0].hasOwnProperty('$length')) {
						thisZoom.resultTotal = result[0].$length;
					} else {
						thisZoom.resultTotal = 0;
					}
				}, 0);
			}, {
				noErrorMessage: thisZoom.noErrorMessage,
				noCount : parameters.isSelectValue
			}, useCache);			
		};
		
		return service;

	}

	serviceTabPrecoGridSelect.$inject = ['mpd.tb-preco-pv2.zoom'];
	function serviceTabPrecoGridSelect(serviceTabPrecoPv2) {
		var service = {};
		angular.extend(service, serviceTabPrecoPv2);
		service.useCache = false;

		service.applyFilter = function(parameters) {
			return serviceTabPrecoPv2.applyFilter(parameters).then(function (result) {
				result.unshift({
					'nr-tabpre': '',
					'descricao': '',
					'r-Rowid': undefined
				})
				return result;
			});
		};		
		
		return service;		
	}
	

	index.register.service('mpd.tb-preco-pv2.zoom', serviceTabPrecoPv2);
	index.register.service('mpd.tb-preco-pv2.gridselect', serviceTabPrecoGridSelect);

});

