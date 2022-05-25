/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/cmg/js/cmg-utils.js'], function(index) {

    'use strict';

    function importbankstatementFactory($totvsresource, Upload) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchcmg/importbankstatement/:method/:idRuleBankStmnt/:idFileRule', {}, {

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

        factory.getUserRules = function(parameters, callback) {
            return this.DTSGet(parameters, callback);
        }
        ;

        factory.getUserRule = function(id, callback) {
            return this.TOTVSDTSGet({
                method: 'userRule',
                idRuleBankStmnt: id
            }, callback);
        }
        ;

        factory.save = function(parameters, object, callback) {
            return this.TOTVSPost(parameters, object, callback);
        }
        ;

        factory.update = function(object, callback) {
            return this.TOTVSDTSPut({
                method: 'userRule'
            }, object, callback);
        }
        ;

        factory.deleteFileUserRule = function(idRuleBankStmnt, idFileRule, callback) {
            return this.TOTVSRemove({
                method: 'fileUserRule',
                idRuleBankStmnt: idRuleBankStmnt,
                idFileRule: idFileRule
            }, callback);
        }
        ;

        factory.deleteUserRule = function(id, callback) {
            return this.TOTVSRemove({
                method: 'userRule',
                idRuleBankStmnt: id
            }, callback);
        }
        ;

        factory.deleteAllUserRule = function(callback) {
            return this.TOTVSRemove({
                method: 'allUserRule'
            }, callback);
        }
        ;

        factory.upload = function(fileRuleBankStmnt, callback, callbackProgress, callbackError) {

            if (fileRuleBankStmnt.file.lastModifiedDate === undefined){
                fileRuleBankStmnt.file.lastModifiedDate = new Date();
            }
			
            return Upload.upload({

                url: '/dts/datasul-rest/resources/api/fch/fchcmg/importbankstatement/upload?' + 'idRuleBankStmnt=' + fileRuleBankStmnt.idRuleBankStmnt + '&idFileRule=' + fileRuleBankStmnt.seq + '&fileLength=' + fileRuleBankStmnt.file.size + '&dateMod=' + fileRuleBankStmnt.file.lastModifiedDate.getTime(),
                headers: {},
                file: fileRuleBankStmnt.file

            }).success(function(result, status, headers, config) {

                if (callback) {
                    callback((result && result.length > 0 ? result[0] : undefined));
                }

            }).progress(function(evt) {

                if (callbackProgress) {
                    callbackProgress(parseInt(100.0 * evt.loaded / evt.total, 10) + '%', evt);
                }

            }).error(function(result, status, headers, config) {

                if (callbackError) {
                    callbackError(result, status, headers, config);
                }
            });
        }
        ;

        factory.getInitParamsExec = function(parameters, callback) {
            if (parameters === undefined || !angular.isObject(parameters)) {
                parameters = {};
            }
            parameters.method = 'initexecparams';
            return this.TOTVSDTSGet(parameters, callback);
        }
        ;

        factory.isValidParamsExec = function(parameters, model, callback, headers) {
            if (parameters === undefined || !angular.isObject(parameters)) {
                parameters = {};
            }
            parameters.method = 'isvalidparamsexec';
            return this.TOTVSPost(parameters, model, callback, headers);
        }
        ;

        return factory;
    }

    importbankstatementFactory.$inject = ['$totvsresource', 'Upload'];
    index.register.factory('cmg.importbankstatement.Factory', importbankstatementFactory);

});
