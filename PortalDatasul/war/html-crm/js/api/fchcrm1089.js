/*global $, index, angular, define, TOTVSEvent, CRMURL, CRMRestService*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var helperBill,
		billFactory;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	helperBill = function ($rootScope) {
		this.parseBillStatus = function (bill) {
			bill.nom_cor = "tag-" + bill.ttv_num_situacao;
			switch (bill.ttv_num_situacao) {
			case 1:
				bill.nom_situation = $rootScope.i18n('l-sit-expired', [], 'dts/crm');
				break;
			case 2:
				bill.nom_situation = $rootScope.i18n('l-sit-to-win', [], 'dts/crm');
				break;
			case 3:
				bill.nom_situation = $rootScope.i18n('l-sit-anticipation', [], 'dts/crm');
				break;
			}
		};
	};

	helperBill.$inject = ['$rootScope'];

	// *************************************************************************************
	// *** FACTORY BILL
	// *************************************************************************************

	billFactory = function ($totvsresource, factoryGeneric, factoryGenericZoom,
								   factoryGenericTypeahead, factoryGenericCreateUpdate) {

		var factory = $totvsresource.REST(CRMRestService + '1089/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [false]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		return factory;
	}; //billFactory

	billFactory.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.bill.helper', helperBill);
	index.register.factory('crm.tit_acr.factory', billFactory);

});
