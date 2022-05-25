define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mguni
    # Table...: modalid-frete
    # Service.: serviceModalidadeFrete
    # Register: mpd.modalidadefrete.zoom
    ####################################################################################################*/

	serviceModalidadeFrete.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', '$q'];
	function serviceModalidadeFrete($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, $q) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi600/:gotomethod/:id', {fields: "cod-modalid-frete,des-modalid-frete"}, {});
		service.zoomName = $rootScope.i18n('l-modalidade-frete', undefined, 'dts/mpd');
		service.configuration = false;
                service.useSearchMethod = true;
                service.matches = ['cod-modalid-frete','des-modalid-frete'];  
        
		service.propertyFields = [
          	{label: 'l-modalidade-frete', property: 'cod-modalid-frete', type:'stringrange', default: true},
				{label: 'l-modalidade-frete-desc', property: 'des-modalid-frete', type:'string'}
        ];
			
		service.columnDefs = [
                {headerName: $rootScope.i18n('l-modalidade-frete', undefined, 'dts/mpd'), field: 'cod-modalid-frete'},
                {headerName: $rootScope.i18n('l-modalidade-frete-desc', undefined, 'dts/mpd'), field: 'des-modalid-frete'}
        ];

        service.applyFilter = function (parameters) {
            var that = this;
            var strQuery = "";
            var queryproperties = {};
            
            queryproperties.property = [];
            queryproperties.value = [];
            queryproperties.limit = that.limitZoom;
            
            if (parameters.isSelectValue) {
                queryproperties.where = [];

                strQuery += "(modalid-frete.cod-modalid-frete MATCHES ('" + parameters.selectedFilterValue + 
                            "*') OR modalid-frete.des-modalid-frete MATCHES ('*" + parameters.selectedFilterValue + "*'))";

                delete queryproperties.method;
				delete queryproperties.searchfields;
				delete queryproperties.siteId;

                queryproperties.where.push(strQuery);
            } else {
                angular.forEach(parameters.disclaimers, function (disclaimer, key) { 
                    if (disclaimer.value) {
						queryproperties.property.push(disclaimer.property);
						
						if (disclaimer.property == 'cod-modalid-frete') {
								
							if (disclaimer.value.start == undefined || disclaimer.value.start == "") {
								disclaimer.value.start = "";
							}

							if (disclaimer.value.end == undefined || disclaimer.value.end == "") {
								disclaimer.value.end = "";
							}

                            if (disclaimer.value.end != "") {
                                queryproperties.value.push(disclaimer.value.start + ";" + disclaimer.value.end);
                            } else {
                                queryproperties.value.push(disclaimer.value.start + ";999999999");
                            }
						}

                        if (disclaimer.property == 'des-modalid-frete') {
                            queryproperties.value.push("*" + disclaimer.value + "*");
                        }
					}
                });
			}
            
            if (parameters.more)
                queryproperties.start = this.zoomResultList.length;
            else
                that.zoomResultList = [];

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                if ((!parameters.init || parameters.init.setDefaultValue) && (!parameters.selectedFilterValue)) return;
                
                if (result) {
                    that.zoomResultList = that.zoomResultList.concat(result);
                    $timeout(function () {
                        if (result.length > 0) {
                            that.resultTotal = result[0].$length;
                        } else {
                            that.resultTotal = 0;
                        }
                    }, 0);
                }
            }, { noErrorMessage: true }, false);
        }
        
        service.getObjectFromValue =  function (value) {
            var itemSelected,
            queryproperties = {where: ["modalid-frete.cod-modalid-frete = " + "'" + value + "'"]},
            getItem = function (item){
                if (item['cod-modalid-frete'] == value) return item;
            };
            
            if (value) {

                if (service.zoomResultList && service.zoomResultList.length > 0) {
                    itemSelected = service.zoomResultList.filter(getItem);
                }

                if (itemSelected && itemSelected.length > 0) {
                    return $q(function (resolve, reject) {
                        resolve(itemSelected[0]);
                    });
                } else {
                    return $q(function (resolve, reject) {
                        service.resource.TOTVSQuery(queryproperties, function (result) {
                            resolve(result[0]);
                        }, { noErrorMessage: true }, true);
                    });
                }

            }
            			
        };
        
        service.comparator = function(item1, item2) {
            return (item1['cod-modalid-frete'] === item2['cod-modalid-frete']);
        };
        
        service.paisList = [];
        service.getPais = function (value) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];
            
            parameters.disclaimers.push({
                property: "cod-modalid-frete",
                type: "string",
                value: value
            });
                 
            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.modalidadeFreteList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
            
        };
        
		return service;
		
	}
	index.register.service('mpd.modalidadefrete.zoom', serviceModalidadeFrete);
	
});
