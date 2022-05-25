/*global $, index, angular, define, TOTVSEvent, apbEvent, apbUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/apb/js/zoom/estabelecimento.js',
	'/dts/apb/js/zoom/espec-docto.js',
	'/dts/apb/js/zoom/ser-fisc-nota.js',
	'/dts/apb/js/userpreference.js',
	'/dts/apb/js/apb-factories.js',
	'/dts/apb/js/apb-components.js',
	'/dts/apb/js/api/inquirevendordocdetail.js',
	'/dts/apb/html/inquirevendordocs/inquirevendordocs.js',
	'/dts/apb/html/inquirevendorsettlementsdocs/inquirevendorsettlementsdocs.js'
], function (index) {

	index.stateProvider

		.state('dts/apb/inquirevendordocdetail', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/apb/inquirevendordocdetail.start', {
			url: '/dts/apb/inquirevendordocdetail',
			controller: 'apb.inquirevendordocdetail.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/apb/html/inquirevendordocdetail/inquirevendordocdetail.html'
		});

	var controllerInquireVendorDocDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerInquireVendorDocDetail.$inject = [
		'$rootScope',
		'$scope',
		'apb.inquirevendordocdetail.Factory',
		'$modal',
		'apb.inquirevendordocdetail.param-service',
		'totvs.app-main-view.Service',
		'TOTVSEvent',
		'$filter'];

	function controllerInquireVendorDocDetail(
		$rootScope,
		$scope,
		factory,
		$modal,
		serviceInquireVendorDocDetailParam,
		appViewService,
		TOTVSEvent,
		$filter) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var controller = this,
			i18n = $filter('i18n');

		this.selectDocs = { model: {} };
		this.ttParameters = {};
		this.detailResult = undefined;
		
		var parameters = {
			site: "",
			vendorID: undefined,
			documentClass: "",
			documentSeries: "",
			documentCode: "",
			documentParcel: "",
			typeRecordFind: undefined
		};

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (parameters) {

			if (parameters.typeRecordFind == undefined) {
				parameters.typeRecordFind = 0;
			}

			var ttParameters = {
					'site': parameters.site,
					'vendorID': parameters.vendorID,
					'documentClass': parameters.documentClass,
					'documentSeries': parameters.documentSeries != undefined ? parameters.documentSeries : "",
					'documentCode': parameters.documentCode,
					'documentParcel': parameters.documentParcel != undefined ? parameters.documentParcel : "",
					'typeRecordFind': parameters.typeRecordFind
				}

			factory.getDocDetail(ttParameters, function (result) {

				if (result) {

					if (result.length > 0) {

						controller.detailResult = result[0];
						
					} 
				}
			});
		}

		this.openSelectDocs = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/apb/html/inquirevendordocdetail/inquirevendordocdetail-select-document.html',
				controller: 'apb.inquirevendordocdetail.select-document.Controller as controllerDetail',
				keyboard: true,
				backdrop: 'static',
				size: 'lg',
				resolve: {
					model: function () {
						return controller.selectDocs;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				controller.load(controller.selectDocs.model);
			});

		}

		$scope.safeApply = function (fn) {
			var phase = (this.$root ? this.$root.$$phase : undefined);

			if (phase === '$apply' || phase === '$digest') {
				if (fn && (typeof (fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			appViewService.startView(i18n('l-inquire-vendor-doc-detail-external'), 'apb.inquirevendordocdetail.Controller', this);

		};

		this.nextDocument = function () {

			if (controller.detailResult != undefined) {

				controller.setEmptyParams();

				if (controller.detailResult.site) {
					parameters.site = controller.detailResult.site;
				}
				if (controller.detailResult.vendorID) {
					parameters.vendorID = controller.detailResult.vendorID;
				}
				if (controller.detailResult.documentClass) {
					parameters.documentClass = controller.detailResult.documentClass;
				}
				if (controller.detailResult.documentSeries) {
					parameters.documentSeries = controller.detailResult.documentSeries;
				}
				if (controller.detailResult.documentCode) {
					parameters.documentCode = controller.detailResult.documentCode;
				}
				if (controller.detailResult.documentParcel) {
					parameters.documentParcel = controller.detailResult.documentParcel;
				}

				parameters.typeRecordFind = 1;

				controller.load(parameters);

			} else {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-document', [], 'dts/apb'),
					detail: $rootScope.i18n('msg-select-document', [], 'dts/apb')
				});

				return;
			}

		}

		this.previousDocument = function () {

			if (controller.detailResult != undefined) {

				controller.setEmptyParams();

				if (controller.detailResult.site) {
					parameters.site = controller.detailResult.site;
				}
				if (controller.detailResult.vendorID) {
					parameters.vendorID = controller.detailResult.vendorID;
				}
				if (controller.detailResult.documentClass) {
					parameters.documentClass = controller.detailResult.documentClass;
				}
				if (controller.detailResult.documentSeries) {
					parameters.documentSeries = controller.detailResult.documentSeries;
				}
				if (controller.detailResult.documentCode) {
					parameters.documentCode = controller.detailResult.documentCode;
				}
				if (controller.detailResult.documentParcel) {
					parameters.documentParcel = controller.detailResult.documentParcel;
				}

				parameters.typeRecordFind = 2;

			} else {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-document', [], 'dts/apb'),
					detail: $rootScope.i18n('msg-select-document', [], 'dts/apb')
				});

				return;
			}

			controller.load(parameters);

		}

		this.showMessage = function (typeRecordFind) {

			if (typeRecordFind == 1) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('1522', [], 'dts/apb'),
					detail: $rootScope.i18n('msg-last-object', [], 'dts/apb')
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('1522', [], 'dts/apb'),
					detail: $rootScope.i18n('msg-first-object', [], 'dts/apb')
				});
			}

		}

		this.setEmptyParams = function () {

			parameters = {
				site: "",
				vendorID: undefined,
				documentClass: "",
				documentSeries: "",
				documentCode: "",
				documentParcel: "",
				typeRecordFind: 0
			};

		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		if (ApbUtil.isDefined(serviceInquireVendorDocDetailParam.paramOpp)) {

			if (serviceInquireVendorDocDetailParam.paramOpp[0]) {
				parameters.site = serviceInquireVendorDocDetailParam.paramOpp[0].value;
			}
			if (serviceInquireVendorDocDetailParam.paramOpp[1]) {
				parameters.vendorID = serviceInquireVendorDocDetailParam.paramOpp[1].value;
			}
			if (serviceInquireVendorDocDetailParam.paramOpp[2]) {
				parameters.documentClass = serviceInquireVendorDocDetailParam.paramOpp[2].value;
			}
			if (serviceInquireVendorDocDetailParam.paramOpp[3]) {
				parameters.documentSeries = serviceInquireVendorDocDetailParam.paramOpp[3].value;
			}
			if (serviceInquireVendorDocDetailParam.paramOpp[4]) {
				parameters.documentCode = serviceInquireVendorDocDetailParam.paramOpp[4].value;
			}
			if (serviceInquireVendorDocDetailParam.paramOpp[5]) {
				parameters.documentParcel = serviceInquireVendorDocDetailParam.paramOpp[5].value;
			}

			controller.load(parameters);

			serviceInquireVendorDocDetailParam.paramOpp = undefined;
		}

	}
	index.register.controller('apb.inquirevendordocdetail.Controller', controllerInquireVendorDocDetail);

	inquireDocSelectController.$inject = ['$modalInstance', 'model', 'TOTVSEvent', '$rootScope'];
	function inquireDocSelectController($modalInstance, model, TOTVSEvent, $rootScope) {

		var ctrl = this,
			messages = [];

		this.selectDocs = model;
		this.invalidForm = false;

		this.search = function () {

			messages = [];

			this.isInvalidForm();

			if (!ctrl.invalidForm) {
				$modalInstance.close();
			} else {
				return;
			}

		}

		this.close = function () {
			$modalInstance.dismiss();
		}

		this.isInvalidForm = function () {

			var isInvalidForm = false;

			if (!this.selectDocs.model.site || this.selectDocs.model.site.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-site');
			}
			if (!this.selectDocs.model.documentClass || this.selectDocs.model.documentClass.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-class');
			}			
			if (!this.selectDocs.model.documentCode || this.selectDocs.model.documentCode.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				this.showInvalidFormMessage('l-restriction', messages);
			}

			ctrl.invalidForm = isInvalidForm;

			return ctrl.invalidForm;
		}

		this.showInvalidFormMessage = function (title, messages) {

			messages = messages || [];

			if (!angular.isArray(messages)) {
				messages = [messages];
			}

			var i,
				fields = '',
				isPlural,
				message;

			isPlural = messages.length > 1;
			message = 'msg-form-validation' + (isPlural ? '-plural' : '');

			for (i = 0; i < messages.length; i += 1) {
				fields += $rootScope.i18n(messages[i], [], 'dts/apb');
				if (isPlural && i !== (messages.length - 1)) {
					fields += ', ';
				}
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'error',
				title: $rootScope.i18n(title, [], 'dts/apb'),
				detail: $rootScope.i18n(message, [fields], 'dts/apb')
			});
		};

	}
	index.register.controller('apb.inquirevendordocdetail.select-document.Controller', inquireDocSelectController);

});
