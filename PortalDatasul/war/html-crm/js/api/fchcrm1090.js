/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
    'index',
    '/dts/crm/js/crm-utils.js',
    '/dts/crm/js/crm-factories.js'
], function (index) {

    'use strict';

    var taskNotificationFactory;

    // *************************************************************************************
    // *** FACTORY TASK PREFERENCES
    // *************************************************************************************

    taskNotificationFactory = function ($totvsresource, factoryGeneric, factoryGenericCreateUpdate, Upload) {

        var factory = $totvsresource.REST(CRMRestService + '1090/:method/:id',
            undefined,  factoryGenericCreateUpdate.customActions);

        factory.upload = function (file, callback) {
            return Upload.upload({
                url: CRMRestService + '1090/template/',
                file: file
            }).success(function (result) {
                if (callback) {
                    callback(result);
                }
            });
        };

        factory.updateRecord = function (model, callback) {
            return this.DTSPut({method: "task"}, model, function (result) {
                if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
            });
        };

        factory.executeTaskCalendar = function (callback) {
            return this.TOTVSGet({method: 'execute_task_calendar'}, function (result) {
                if (callback) { callback(result); }
            });
        };

        factory.download = function () {
            return CRMRestService + '1090/task_download/';
        };

        factory.findRecords = function (callback) {
            return this.TOTVSQuery({method: 'task'}, function (result) {
                if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
            });
        };

        return factory;
    }; //taskNotificationFactory

    taskNotificationFactory.$inject = [
        '$totvsresource', 'crm.generic.factory', 'crm.generic.create.update.factory', 'Upload'
    ];

    // *************************************************************************************
    // *** REGISTER
    // *************************************************************************************
    index.register.factory('crm.crm_tar_notif.factory', taskNotificationFactory);

});
