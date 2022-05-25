define(['index', '/dts/hub/js/hub-utils.js'], function(index) {
    'use strict';

    var factoryGeneric, factoryGenericZoom, factoryGenericTypeahead, factoryGenericCreateUpdate, factoryGenericDelete, factoryGenericDetail;

    // ########################################################
    // ### Generic
    // ########################################################

    factoryGeneric = function() {
        return {
            findRecords: function(parameters, options, callback, instance) {

                var i, properties = [], values = [];

                if (parameters) {
                    if (parameters instanceof Array) {
                        for (i = 0; i < parameters.length; i++) {
                            properties.push(parameters[i].property);
                            values.push(parameters[i].value);
                        }
                    } else if (parameters.property) {
                        properties.push(parameters.property);
                        values.push(parameters.value);
                    }
                }

                parameters = {
                    properties: properties,
                    values: values
                };

                options = options || {};

                if (!options.end) {
                    options.end = 50;
                }

                if (!options.type) {
                    options.type = 2;
                }

                if (options) {
                    angular.extend(parameters, options);
                }

                return instance.TOTVSQuery(parameters, function(result) {
                    if (callback) {
                        callback(result);
                    }
                }, options.headers, options.cache);
            }
        };
    }
    ;

    factoryGeneric.$inject = [];

    factoryGenericZoom = function() {
        return {
            zoom: function(parameters, options, callback, instance) {
                options = options || {};
                options.type = 3;
                if (!options.end) {
                    options.end = 25;
                }
                return this.findRecords(parameters, options, callback, instance);
            }
        };
    }
    ;

    factoryGenericZoom.$inject = [];

    factoryGenericTypeahead = function() {
        return {
            typeahead: function(parameters, options, callback, instance) {

                options = options || {};

                options.type = 1;

                if (!options.end) {
                    options.end = 10;
                }

                if (!options.count) {
                    options.count = false;
                }

                return this.findRecords(parameters, options, callback, instance);
            }
        };
    }
    ;

    factoryGenericTypeahead.$inject = [];

    factoryGenericCreateUpdate = function() {
        return {
            customActions: {
                DTSPost: {
                    method: 'POST',
                    isArray: true
                },
                DTSPut: {
                    method: 'PUT',
                    isArray: true
                }
            },
            saveRecord: function(model, callback) {
                return this.DTSPost({}, model, function(result) {
                    if (callback) {
                        callback((result && result.length > 0 ? result[0] : undefined));
                    }
                });
            },
            updateRecord: function(id, model, callback) {
                return this.DTSPut({
                    id: id
                }, model, function(result) {
                    if (callback) {
                        callback((result && result.length > 0 ? result[0] : undefined));
                    }
                });
            }
        };
    }
    ;

    factoryGenericCreateUpdate.$inject = [];

    factoryGenericDelete = function() {
        return {
            deleteRecord: function(id, callback) {
                return this.TOTVSRemove({
                    id: id
                }, callback);
            }
        };
    }
    ;

    factoryGenericDelete.$inject = [];

    factoryGenericDetail = function() {
        return {
            getRecord: function(id, callback) {
                return this.TOTVSQuery({
                    id: id,
                    method: 'detail'
                }, function(result) {
                    if (callback) {
                        callback((result && result.length > 0 ? result[0] : undefined));
                    }
                });
            }
        };
    }
    ;

    factoryGenericDetail.$inject = [];

    // *************************************************************************************
    // *** REGISTER
    // *************************************************************************************

    index.register.factory('hub.generic.factory', factoryGeneric);
    index.register.factory('hub.generic.zoom.factory', factoryGenericZoom);
    index.register.factory('hub.generic.typeahead.factory', factoryGenericTypeahead);
    index.register.factory('hub.generic.create.update.factory', factoryGenericCreateUpdate);
    index.register.factory('hub.generic.delete.factory', factoryGenericDelete);
    index.register.factory('hub.generic.detail.factory', factoryGenericDetail);

});
