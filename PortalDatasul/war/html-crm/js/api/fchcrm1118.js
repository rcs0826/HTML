/*globals define, CRMRestService, Upload */
define([
    'index',
	'ng-load!ui-file-upload',
	'/dts/crm/js/crm-factories.js'
], function (index) {
    
    'use strict';
    
    var factory;
    
    factory = function ($rootScope, $totvsresource, Upload) {
        var factory = $totvsresource.REST(CRMRestService + '1118/:method', undefined, undefined);
        
        factory.download = function (callback) {
           return this.TOTVSGet({method: 'download'}, function (result) {
				if (callback) {
					callback(result);
				}
			});
        };
        
        factory.upload = function (file, callback, callbackProgress, callbackError) {
            return Upload.upload({
				url: CRMRestService + '1118/upload',
				file: file
			}).success(function (result, status, headers, config) {
                if (callback) {
					callback((result && result.length > 0 ? result : undefined));
				}
			}).progress(function (evt) {
                if (callbackProgress) {
					callbackProgress(parseInt(100.0 * evt.loaded / evt.total, 10) + '%', evt);
                }
			}).error(function (result, status, headers, config) {
                if (callbackError) {
					callbackError(result, status, headers, config);
				}
			});
        };
        
        factory.create = function (file, callback, callbackProgress, callbackError) {
            return Upload.upload({
				url: CRMRestService + '1118/create',
                headers: {'noCountRequest': 'true'},
				file: file
			}).success(function (result, status, headers, config) {
                if (callback) {
					callback((result && result.length > 0 ? result : undefined));
				}
			}).progress(function (evt) {
                if (callbackProgress) {
					callbackProgress(parseInt(100.0 * evt.loaded / evt.total, 10) + '%', evt);
                }
			}).error(function (result, status, headers, config) {
                if (callbackError) {
					callbackError(result, status, headers, config);
				}
			});
            
        };
        
        return factory;
    };
    
    factory.$inject = [
		'$rootScope', '$totvsresource', 'Upload'
    ];
    
    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.factory('crm.crm_importa_lead.factory', factory);
    
});
