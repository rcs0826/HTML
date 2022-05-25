/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */ 
/*global define, angular, $, TOTVSEvent */
define(['index',
        '/dts/hgp/html/util/dts-utils.js'], function (index) {

    'use strict';
    
    function serviceZoom($timeout,
        $totvsresource,
        $rootScope,
        $totvsprofile,
        dtsUtils) {

        var zoom = {

            limitZoom: 50,
            limitSelect: 10,
            noErrorMessage: false,
            advancedSearch: false,
            configuration: false,
			useSearchMethod: false,
			searchParameter: 'id',
            validateSelectedValue : function(parameters){
                /* Carregar dados do zoom sem ter que pesquisar */
                if (parameters) {
                    if (parameters.init) {
                        if (parameters.init.filters) {
                            if (parameters.init.filters.loadResultZoom) {
                                return true;
                            }
                        }
                    }
                }

                if(parameters.isAdvanced == false
                && (!parameters.selectedFilterValue || parameters.selectedFilterValue == '')){
                    return false;
                }

                if(parameters.isAdvanced == true
                && parameters.disclaimers.length == 0){
                    return false;
                }

                return true;
            },
			
            setConfiguration: function (register) {

                this.configuration = {

                    save: function (config, callback) {
                        $totvsprofile.remote.set(register, {
                            dataCode: 'zoomConfig',
                            dataValue: config
                        }, function (result) {
                            callback();
                        });
                    },
                    load: function (callback) {
                        $totvsprofile.remote.get(register,
                            'zoomConfig',
                            function (config) {
                                if (config !== undefined && config.length > 0) {
                                    callback(config[0].dataValue);
                                }
                            });
                    }
                };
            },
            options: {
                angularCompileHeaders: true
            },
            applyFilter: function (parameters) {
                if(!this.validateSelectedValue(parameters)){
                    this.zoomResultList = [];
                    this.resultTotal = 0;
                    return [];
                }               

                var useCache = true;

                if(this.useCache !== undefined){
                        useCache = this.useCache;
                }
                
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
                
				
		        if (parameters.isSelectValue && angular.isArray(this.matches)) {
                  
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
                
                queryproperties.method = this.applyFilterMethod;

                return this.resource.TOTVSQuery(queryproperties, function (result) {
                    
                    thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
                    $timeout(function () {
                        if (result[0] && result[0].hasOwnProperty('$length')) {
                            thisZoom.resultTotal = result[0].$length;
                        } else {
                            thisZoom.resultTotal = 0;
                        }
                    }, 0);

                    zoom.zoomResultList = thisZoom.zoomResultList;
                    zoom.resultTotal    = thisZoom.resultTotal;
                    

                }, {
                    noErrorMessage: thisZoom.noErrorMessage,
                    noCountRequest: parameters.isSelectValue
                }, useCache);    
            },
            legend: {
                logical: function (param) {
                    if (param) {
                        return $rootScope.i18n('l-yes');
                    } else {
                        return $rootScope.i18n('l-no');
                    }
                }
            }
        };

        return zoom;
    }
    
    serviceZoom.$inject = ['$timeout',
                           '$totvsresource',
                           '$rootScope',
                           '$totvsprofile',
                           'dts-utils.utils.Service'];

    index.register.service('dts-utils.zoom', serviceZoom);

});
