/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
    'index'

], function (index) {
    
    'use strict';
    
    var modalAttributeAdvancedSearch,
		controllerAttributeAdvancedSearch;
    
    // *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalAttributeAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/attribute/attribute.advanced.search.html',
                controller: 'crm.attribute.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalAttributeAdvancedSearch.$inject = ['$modal'];
    
    // *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerAttributeAdvancedSearch = function ($rootScope, $scope, $modalInstance, TOTVSEvent,
										  parameters, attributeHelper, helper) {
        
        var CRMControlAttributeAdvancedSearch = this;

		this.disclaimers = undefined;
		this.model = undefined;
        this.listOfProcess = angular.copy(attributeHelper.process);
        this.listOfTypes = angular.copy(attributeHelper.attributeTypes);
        this.log_obrig = false;
        
        
        this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};
        
        this.apply = function () {
            var disclaimers,
                closeObj = {};

			this.parseModelToDisclaimers();
            
            closeObj.disclaimers = this.disclaimers;
            $modalInstance.close(closeObj);
        };
        
        this.parseModelToDisclaimers = function () {
            var i,
				key,
				model,
				fixed,
				property,
                isRequired;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {
                    
                    model = this.model[key];
                    
                    if (key === 'nom_atrib') {
                        if (model) {
                            this.disclaimers.push({
                                property: 'nom_atrib',
                                value: model,
                                title: $rootScope.i18n('l-name', [], 'dts/crm') + ': ' + model
                            });
                        }
                        
					} else if (key === 'idi_process') {
                        if (model) {
                            this.disclaimers.push({
                                property: 'idi_process',
                                value: model,
                                title: $rootScope.i18n('l-process', [], 'dts/crm') + ': ' + model.nom_process
                            });
                        }
                        
                    } else if (key === 'idi_tip_atrib') {
                        if (model) {
                            this.disclaimers.push({
                                property: 'idi_tip_atrib',
                                value: model,
                                title: $rootScope.i18n('l-type', [], 'dts/crm') + ': ' + model.nom_type
                            });
                        }
                        
                    } else if (key === 'log_obrig') {
                        if (model) {
                            this.disclaimers.push({
                                property: 'log_obrig',
                                value: model,
                                title: $rootScope.i18n('l-required', [], 'dts/crm')
                            });
                        }
                    }
                }
                
            }
        };
        
        this.parseDisclaimersToModel = function (disclaimers) {

            helper.parseDisclaimersToModel(disclaimers, function (model, disclaimers) {
				CRMControlAttributeAdvancedSearch.model = model;
				CRMControlAttributeAdvancedSearch.disclaimers = disclaimers;
			});
        };
        
        this.cleanFilters = function () {
            CRMControlAttributeAdvancedSearch.model = {};
        };
        
        
        this.init = function () {
            
            if (parameters.disclaimers && parameters.disclaimers.length > 0) {
                this.parseDisclaimersToModel(parameters.disclaimers);
            }
        };
        
        this.init();
        
    };
    
    controllerAttributeAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters', 'crm.attribute.helper', 'crm.helper'
	];

    // *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.attribute.modal.advanced.search', modalAttributeAdvancedSearch);
    index.register.controller('crm.attribute.advanced.search.control', controllerAttributeAdvancedSearch);
});