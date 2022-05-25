/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */ 
/*global define, angular, $, TOTVSEvent */
define(['index',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {

    'use strict';
    
    function serviceZoom($timeout,
        $totvsresource,
        $rootScope,
        $totvsprofile,
        dtsUtils) {

        return {

            limitZoom: 50,
            limitSelect: 10,
            noErrorMessage: true,
            advancedSearch: true,
            configuration: false,
			useSearchMethod: false,
			searchParameter: 'id',
            isSelectValue: false,
			
            setConfiguration: function (register) {

                this.configuration = {

                    save: function (config, callback) {
                        //console.log('setConfiguration', 'save', 'register', register);
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
                                //console.log('setConfiguration', 'load', 'config', config);
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
    }
    
    serviceZoom.$inject = ['$timeout',
                           '$totvsresource',
                           '$rootScope',
                           '$totvsprofile',
                           'dts-utils.utils.Service'];

    index.register.service('dts-utils.zoom', serviceZoom);

});