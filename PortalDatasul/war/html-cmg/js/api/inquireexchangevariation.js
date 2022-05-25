/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index'], function(index) {

    'use strict';

    function inquireExchVarFactory($totvsresource) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchcmg/inquireexchangevariation/:method/:id', {}, {

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
            if (parameters === undefined || !angular.isObject(parameters)) {
                parameters = {};
            }
            parameters.method = 'initparams';
            return this.TOTVSGet(parameters, callback);
        }
        ;

        factory.inquireExchangeVariation = function(parameters, model, callback, headers) {
            if (parameters === undefined || !angular.isObject(parameters)) {
                parameters = {};
            }
            return this.TOTVSDTSPost(parameters, model, callback, headers);
        }
        ;

        return factory;

    }

    inquireExchVarFactory.$inject = ['$totvsresource'];
    index.register.factory('cmg.inquireexchangevariation.Factory', inquireExchVarFactory);

});
