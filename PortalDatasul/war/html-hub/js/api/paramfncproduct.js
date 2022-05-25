/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index'], function(index) {
    'use strict';
    function ParamFncProdFactory($totvsresource) {
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchhub/paramfncproduct/:method/:id', {}, {
            DTSPost: {
                method: 'POST',
                isArray: true
            },
            DTSGet: {
                method: 'GET',
                isArray: true
            },
            DTSPut: {
                method: 'PUT',
                isArray: false
            }
        });
        factory.TOTVSDTSPost = function(parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSPost(parameters, model);
            return this.processPromise(call, callback);
        }
        ;
        factory.TOTVSDTSGet = function(parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSGet(parameters, model);
            return this.processPromise(call, callback);
        }
        ;
        factory.TOTVSDTSPut = function(parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSPut(parameters, model);
            return this.processPromise(call, callback);
        }
        ;
        factory.getInitParams = function(parameters, callback) {
            return this.TOTVSGet(parameters, callback);
        }
        ;
        factory.updateFunctions = function(parameters, model, callback, headers) {
            if (parameters === undefined || !angular.isObject(parameters)) {
                parameters = {};
            }
            parameters.method = 'updatefunctions';
            return this.TOTVSDTSPost(parameters, model, callback, headers);
        }
        ;
        factory.activateFunction = function(parameters, model, callback, headers) {
            if (parameters === undefined || !angular.isObject(parameters)) {
                parameters = {};
            }
            parameters.method = 'activatefunction';
            return this.TOTVSPost(parameters, model, callback, headers);
        }
        ;
        factory.disableFunction = function(parameters, model, callback, headers) {
            if (parameters === undefined || !angular.isObject(parameters)) {
                parameters = {};
            }
            parameters.method = 'disablefunction';
            return this.TOTVSPost(parameters, model, callback, headers);
        }
        ;
        return factory;
    }
    ParamFncProdFactory.$inject = ['$totvsresource'];
    index.register.factory('hub.paramfncproduct.Factory', ParamFncProdFactory);
});
