/*globals index, define, angular, CRMURL, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-factories.js'
], function (index) {
	'use strict';

	var factoryEmail;

	factoryEmail = function ($totvsresource, $cacheFactory, factoryGenericCreateUpdate) {

		var cache = $cacheFactory('crm.email.Cache'),
			factory = $totvsresource.REST(
				CRMURL.emailService + ':method/:id',
				undefined,
				factoryGenericCreateUpdate.customActions
			);

		factory.sendEmail = function (code, typeForm, model, callback) {
			return this.DTSPost({method: 'send_email', code: code, typeForm: typeForm}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.returnAttachmentSequence = function (callback) {
			return this.TOTVSGet({method: 'attatchment_sequence'}, function (data) {
				if (callback) { callback(data); }
			});
		};

		return factory;
	}; // factoryEmail
	factoryEmail.$inject = ['$totvsresource', '$cacheFactory', 'crm.generic.create.update.factory'];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.crm_email.factory', factoryEmail);

});
