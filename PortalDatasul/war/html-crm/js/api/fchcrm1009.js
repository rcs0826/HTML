/*globals index, angular, define, CRMURL, TOTVSEvent, CRMEvent*/
define([
	'index',
	'ng-load!ui-file-upload',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	var attachmentHelper,
		factoryAttachment;

	attachmentHelper = function (legend) {

		this.filtersGroup = 'totvs.crm.portal.attachment.filters';

		this.parseAttachmentType = function (attachment) {
			if (attachment && attachment.idi_tip_anexo) {
				attachment.nom_tipo = legend.attachmentType.NAME(attachment.idi_tip_anexo);
			}
		};

		this.fileAlreadyExistInSelectedList = function (files, fileName) {
			var i;
			for (i = 0; i < files.length; i += 1) {
				if (fileName === files[i].name) {
					return true;
				}
			}
			return false;
		};

	};

	attachmentHelper.$inject = ['crm.legend'];

	factoryAttachment = function ($rootScope, $totvsresource, factoryGeneric, factoryGenericDetail, factoryGenericDelete, Upload, factoryPreference) {

		var factory = $totvsresource.REST(CRMURL.attachmentService + ':method/:id');

		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			options.orderBy	= ['num_id'];
			options.asc		= [false];

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.isAttachmentType = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_ATTACHMENT_TYPE', callback);
		};

		factory.getParamSizeLimit = function (callback) {
			return factoryPreference.getPreferenceAsDecimal('TAM_MAX_UPLOAD_ANEXO', callback);
		};

		factory.upload = function (type, idRecord, file, attachment, callback, callbackProgress, callbackError) {

			if (angular.isArray(file) && file.length < 1) {
				return;
			}

			return Upload.upload({
				url: CRMURL.uploadService + 'type=' + type + '&record=' + idRecord + '&attachmentType=' + (file.ttTipAnexo ? file.ttTipAnexo.num_id : 0),
				headers: {'noCountRequest': 'true'},
				file: file

			}).success(function (result, status, headers, config) {

				if (callback) {
					callback((result && result.length > 0 ? result[0] : undefined), attachment);
				}

				$rootScope.$broadcast(CRMEvent.scopeUploadAttachment, (result && result.length > 0 ? result[0] : undefined), attachment);

			}).progress(function (evt) {

				if (callbackProgress) {
					callbackProgress(parseInt(100.0 * evt.loaded / evt.total, 10) + '%', evt, attachment);
				}

			}).error(function (result, status, headers, config) {

				if (callbackError) {
					callbackError(result, status, headers, config, attachment);
				}

			});
		};

		factory.deleteRecordAborted = function (type, idRecord, name, callback) {
			return this.TOTVSRemove({method: 'abort', id: 0, type: type, record: idRecord, name: name}, callback);
		};

		return factory;
	};

	factoryAttachment.$inject = [
		'$rootScope', '$totvsresource', 'crm.generic.factory', 'crm.generic.detail.factory',
		'crm.generic.delete.factory', 'Upload', 'crm.crm_param.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.attachment.helper', attachmentHelper);

	index.register.factory('crm.crm_anexo.factory', factoryAttachment);

});
