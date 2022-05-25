
define(['index','/dts/kbn/js/helpers.js'], function(index) {
    dataFactory.$inject = ['$window'];
    function dataFactory($window) {
        var factory = {};

        factory.set = function(key, value) {
            $window.localStorage.setItem(key, value);
        };

        factory.get = function(key) {
            return $window.localStorage.getItem(key);
        };

        factory.getEstablishment = function() {
            return factory.getEstablishmentDirective().cod_estab_erp;
        };

        factory.setEstablishment = function(value) {
            factory.setEstablishmentDirective({cod_estab_erp: value});
        };

        factory.getEstablishmentDirective = function() {
            factory.updateEstabCookie();
            return JSON.parse(factory.get('kbn.estab') || '{}');
        };

        factory.updateEstabCookie = function() {
            oldCache = factory.get('kbn.establishment');

            if(oldCache){
                $window.localStorage.removeItem('kbn.establishment');
                factory.setEstablishmentDirective({ 'cod_estab_erp' : oldCache});
            }
        };

        factory.setEstablishmentDirective = function(value) {
            factory.set('kbn.estab', JSON.stringify(value));
        };

        factory.getDefaultBoardSettings = function() {
            return JSON.stringify({
                show: false,
                manualItems: true,
                automaticItems: true,
                order: "priority"
            });
        };

        factory.getDashboardSettings = function() {
            return JSON.parse(
                factory.get('kbn.dashboard.settings') ||
                factory.getDefaultDashboardSettings()
            );
        };

        factory.getDefaultDashboardSettings = function() {
            var date = new Date();
            return JSON.stringify({
                establishment: factory.getEstablishmentDirective(),
                itemExpedited: "2",
                dateRange: {
                    start: date.getTime(),
                    end: date.getTime()
                }
            });
        };

        factory.setDashboardSettings = function(settings) {
            factory.set('kbn.dashboard.settings', JSON.stringify(settings));
        };

        factory.setFrequencySettings = function(settings) {
            factory.set('kbn.frequencyitem.settings', JSON.stringify(settings));
        };

        factory.getFrequencySettings = function(settings) {
            return JSON.parse(
                factory.get('kbn.frequencyitem.settings') ||
                factory.getDefaultFrequencySettings()
            );
        };

        factory.getDefaultFrequencySettings = function() {

            dataFim = new Date();
            dataIni = new Date();
            dataIni.setDate(dataFim.getDate() - 90);

            return JSON.stringify({
                dateRange: {
                    start: dataIni.getTime(),
                    end: dataFim.getTime(),
                    isToday: true
                }
            });
        };

        factory.setItemTimeByRangeSettings = function(settings) {
            factory.set('kbn.itemtimebyrange.settings', JSON.stringify(settings));
        };

        factory.getItemTimeByRangeSettings = function(settings) {
            return JSON.parse(
                factory.get('kbn.itemtimebyrange.settings') ||
                factory.getDefaultItemTimeByRangeSettings()
            );
        };

        factory.getDefaultItemTimeByRangeSettings = function() {

            dataFim = new Date();
            dataIni = new Date();
            dataIni.setDate(dataFim.getDate() - 30);

            return JSON.stringify({
                dateRange: {
                    start: dataIni.getTime(),
                    end: dataFim.getTime(),
                    isToday: true
                }
            });
        };

        factory.getBoardSettings = function(boardId) {
            return JSON.parse(factory.get('kbn.board.' + boardId) || factory.getDefaultBoardSettings());
        }

        factory.setBoardSettings = function(boardId, value) {
            factory.set('kbn.board.' + boardId, JSON.stringify(value));
        }

        return factory;
    };



    var processPromise = function (call, callback) {
        if (call && call.hasOwnProperty('$then')) {
            call.$then(function (result) {
                if (callback) {
                    callback(result.data);
                }
            });
        } else {
            call.$promise.then(function (result) {
                if (callback) {
                    if (result && result.hasOwnProperty('data')) {
                        callback(result.data);
                    } else {
                        callback(result);
                    }
                }
            });
        }
    };


    factoryGeneric.$inject = ['kbn.helper.Service'];
    function factoryGeneric(kbnHelper) {
        return {
            getRecord: function (id, full, callback) {
                var call = this.get({
                    id: id,
                    fullObject: full
                });
                processPromise(call, callback);

                return call;
            },
            findRecords: function (start, max, property, values, orderBy, asc, callback) {
                var call = this.query({
                    start: start,
                    max: max,
                    properties: property,
                    values: values,
                    orderBy: orderBy,
                    asc: asc
                });
                processPromise(call, callback);

                return call;
            },
            findRecordsByParam: function (start, max, filters, orderBy, asc, callback) {

                filters = kbnHelper.sanitizeFilters(filters);

                var call = this.searchByParam({
                    searchInfo: {
                        start: start,
                        limit: max,
                        sortColumns: orderBy.join(","),
                        sortOrder: asc.join(",")
                    },
                    whereClause: filters
                });
                processPromise(call, callback);

                return call;
            }
        };
    } // factoryGeneric() {

    factoryGenericQuickSearch.$inject = [];
    function factoryGenericQuickSearch() {
        return {
            quickSearch: function (start, max, properties, value, orderBy, asc, callback) {
                var call = this.query({
                    method: 'quickSearch',
                    start: start,
                    max: max,
                    properties: properties,
                    value: value,
                    orderBy: orderBy,
                    asc: asc
                });
                processPromise(call, callback);

                return call;
            }
        };
    } // factoryGenericQuickSearch()

    factoryGenericTypeahead.$inject = [];
    function factoryGenericTypeahead() {
        return {
            typeahead: function (start, max, properties, values, orderBy, asc, callback) {
                var call = this.query({
                    method: 'typeahead',
                    start: start,
                    max: max,
                    properties: properties,
                    values: values,
                    orderBy: orderBy,
                    asc: asc
                });
                processPromise(call, callback);
            }
        };
    } // factoryGenericTypeahead()

    factoryGenericZoom.$inject = [];
    function factoryGenericZoom() {
        return {
            zoom: function (start, max, properties, values, orderBy, asc, callback) {
                var call = this.query({
                    method: 'zoom',
                    start: start,
                    max: max,
                    properties: properties,
                    values: values,
                    orderBy: orderBy,
                    asc: asc
                });
                processPromise(call, callback);
            }
        };
    } // factoryGenericZoom()

    factoryGenericCRUD.$inject = [];
    function factoryGenericCRUD() {
        return {
            saveRecord: function (model, callback) {
                var call = this.save({}, model);
                processPromise(call, callback);
            },
            updateRecord: function (id, model, callback) {
                var call = this.update({
                    id: id
                }, model);
                processPromise(call, callback);
            },
            deleteRecord: function (id, callback) {
                var call = this.remove({
                    id: id
                });
                processPromise(call, callback);
            }
        };
    } // factoryGenericCRUD()


    index.register.factory('kbn.generic.Factory', factoryGeneric);
    index.register.factory('kbn.generic-crud.Factory', factoryGenericCRUD);
    index.register.factory('kbn.zoom.Factory', factoryGenericZoom);
    index.register.factory('kbn.typeahead.Factory', factoryGenericTypeahead);
    index.register.factory('kbn.quick-search.Factory', factoryGenericQuickSearch);
    index.register.factory('kbn.data.Factory', dataFactory);
});
