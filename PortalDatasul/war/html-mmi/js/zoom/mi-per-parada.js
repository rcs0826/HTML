define(['index',
        '/dts/mce/js/mce-utils.js',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function(index) {

        /*####################################################################################################
        # Database: movmnt
        # Table...: mi-per-parada
        # Service.: serviceZoomStopPeriod
        # Register: mmi.per-parada.zoom
        ####################################################################################################*/
        serviceZoomStopPeriod.$inject = ['$timeout', '$totvsresource', 'mce.utils.Service', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter', 'helperOrder', 'dts-utils.utils.Service'];

        function serviceZoomStopPeriod($timeout, $totvsresource, mceUtils, $rootScope, $filter, zoomService, i18nFilter, helperOrder, dtsUtils){

        var service = {};

        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn115//:pCdParada//:pSequencia');
        service.zoomName       = i18nFilter('l-standing-period', [], 'dts/mmi');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches = ['String(sequencia)'];
        service.useCache = false;

        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters, model);
            return service.resource.processPromise(call, callback);
        };

        service.enableFilter = true;

        service.propertyFields = [
            {label: i18nFilter('l-sequence', [], 'dts/mmi'), property: 'sequencia', type: 'integer', default: true}
        ];

        service.columnDefs = [
            {headerName: i18nFilter('l-sequence', [], 'dts/mmi'), field: 'sequencia', width: 60, minWidth: 40},
            {
                headerName: i18nFilter('l-start-date', [], 'dts/mmi'),
                field: 'dt-inicio',
                width: 80,
                minWidth: 80,
                valueGetter: function (params) {
                    return mceUtils.formatDate(params.data['dt-inicio'])
                }
            },
            {
                headerName: i18nFilter('l-end-date', [], 'dts/mmi'),
                field: 'dt-termino',
                width: 80,
                minWidth: 80,
                valueGetter: function (params) {
                    return mceUtils.formatDate(params.data['dt-termino'])
                }
            },
            {headerName: i18nFilter('l-project', [], 'dts/mmi'), field: 'cd-projeto', width: 80, minWidth: 80},
            {headerName: i18nFilter('l-observation', [], 'dts/mmi'), field: 'observacao', width: 160, minWidth: 160}
        ];

        // define a column type (you can define as many as you like)
        service.columnTypes = {
            "dateColumn": {filter: 'date'}
        };

        /*
        * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao
        */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };

        service.getObjectFromValue =  function (value) {

            if (isNaN(value)) {
                value = "";
            }

            return this.resource.TOTVSGet( { pCdParada: helperOrder.data['cd-parada'], pSequencia: value }, function(data) {
                
                if (data) {
                    data['dt-inicio-formatada'] = mceUtils.formatDate(data['dt-inicio']);
                }
            }, { 
                noErrorMessage: true
            });
        };

        service.beforeQuery = function (queryproperties, parameters) {

            if (queryproperties.where){
                queryproperties.where = queryproperties.where.concat(' AND cd-parada = "' + helperOrder.data['cd-parada'] + '"');
            } else {
                if (queryproperties.property) {
                    queryproperties.where = "String(" + queryproperties.property[0] + ') matches "'+queryproperties.value[0]+'" AND cd-parada = "' + helperOrder.data['cd-parada'] + '"';
                } else {
                    queryproperties.where = "cd-parada = '" + helperOrder.data['cd-parada'] + "'";
                }
            }  
        }

        service.applyFilter = function (parameters) {
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

            if (parameters.isSelectValue) {
                if (this.limitSelect) { queryproperties.limit = this.limitSelect; }
            } else {
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

                angular.forEach(result, function(registro) {
                    registro['dt-inicio-formatada'] = mceUtils.formatDate(registro['dt-inicio']);
                });

                thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
                if (!thisZoom.zoomResultList && thisZoom.zoomResultList.length > 0) {
                    thisZoom.zoomResultList[0]['$lenght'] = thisZoom.zoomResultList.length;
                }

                if (thisZoom.afterQuery){
                    thisZoom.afterQuery(thisZoom.zoomResultList, parameters);
                }
                
                $timeout(function () {

                    thisZoom.zoomResultList = result;

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
        }

        return service;
    }

    index.register.service('mmi.per-parada.zoom', serviceZoomStopPeriod);
});
