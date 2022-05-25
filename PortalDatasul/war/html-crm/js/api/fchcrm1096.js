/*global define, CRMRestService*/

define([
    'index',
    '/dts/crm/js/crm-utils.js',
    '/dts/crm/js/crm-factories.js'
], function (index) {

    'use strict';
    
    var taskPreferenceFinancialFactory, taskPreferenceFinancialHelper;
    
	// *************************************************************************************
    // *** HELPER TASK PREFERENCES
    // *************************************************************************************
	
	taskPreferenceFinancialHelper = function ($filter, $rootScope) {
		
		this.formatDateTimeLastExecution = function (result) {
			var date;
			
			if (result && result['dtm-modif'] > 0) {
				date = $filter('date')(result['dtm-modif'], $rootScope.i18n('l-datetime-format', [], 'dts/crm'));
				return $rootScope.i18n('msg-financial-status-last-execution', [date], 'dts/crm');
			} else {
				return undefined;
			}
		};
	};
	taskPreferenceFinancialHelper.$inject = ['$filter', '$rootScope'];
    
    // *************************************************************************************
    // *** FACTORY TASK PREFERENCES
    // *************************************************************************************
    taskPreferenceFinancialFactory = function ($totvsresource, factoryGeneric, factoryGenericCreateUpdate, helperTaskPreferenceFinancial) {
        
        var factory = $totvsresource.REST(CRMRestService + '1096/:method/:id',
            undefined,  factoryGenericCreateUpdate.customActions);
        
        factory.findRecords = function (callback) {
            return factoryGeneric.findRecords({}, {}, callback, this);
		};

        factory.updateRecord = function (model, callback) {
            return this.DTSPut({}, model, function (result) {
                if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
            });
        };
        
        factory.executeCalendar = function (callback) {
            return this.TOTVSGet({method: 'execute_calendar'}, function (result) {
                if (callback) { callback(result); }
            });
        };
        
        factory.lastExecution = function (callback) {
            return this.TOTVSGet({method: 'last_execution'}, function (result) {
				
				result = helperTaskPreferenceFinancial.formatDateTimeLastExecution(result);
				
                if (callback) {
					callback(result);
				}
            });
        };

        return factory;
    };
    
    
    taskPreferenceFinancialFactory.$inject = [
        '$totvsresource', 'crm.generic.factory', 'crm.generic.create.update.factory', 'crm.task.param-sit-fincanc.helper'
    ];
    
    // *************************************************************************************
    // *** REGISTER
    // *************************************************************************************
    index.register.factory('crm.crm_param_sit_financ.factory', taskPreferenceFinancialFactory);
	index.register.service('crm.task.param-sit-fincanc.helper', taskPreferenceFinancialHelper);

});