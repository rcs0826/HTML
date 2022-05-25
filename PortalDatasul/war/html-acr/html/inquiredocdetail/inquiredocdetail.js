define([
	'index',
	'/dts/acr/js/zoom/estabelecimento.js',
	'/dts/acr/js/zoom/espec-docto.js',
	'/dts/acr/js/zoom/ser-fisc-nota.js',
	'/dts/acr/js/userpreference.js',
	'/dts/acr/js/acr-factories.js',
	'/dts/acr/js/acr-components.js',
	'/dts/acr/js/api/inquiredocdetail.js',
	'/dts/acr/html/inquirecustdocs/inquirecustdocs.js'
], function (index) {

	index.stateProvider

		.state('dts/acr/inquiredocdetail', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/acr/inquiredocdetail.start', {
			url: '/dts/acr/inquiredocdetail',
			controller: 'acr.inquiredocdetail.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/acr/html/inquiredocdetail/inquiredocdetail.html'
		});

	var controllerInquireDocDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerInquireDocDetail.$inject = [
		'$rootScope',
		'$scope',
		'acr.inquiredocdetail.Factory',
		'$modal',
		'acr.inquiredocdetail.param-service',
		'totvs.app-main-view.Service',
		'TOTVSEvent',
		'$filter'];

	function controllerInquireDocDetail(
		$rootScope,
		$scope,
		factory,
		$modal,
		serviceInquireDocDetailParam,
		appViewService,
		TOTVSEvent,
		$filter) {

		var controller = this,
			i18n = $filter('i18n');

		this.selectDocs = { model: {} };
		this.ttParameters = {};
		this.detailResult = undefined;
		this.detailComis = [];
		this.totalComis = 0;

		this.dateOpen = false;
		this.addressOpen = false;
		this.discountOpen = false;
		this.valueOpen = false;
		this.creditOpen = false;
		this.comissionOpen = false;

		this.userRole = undefined;
		this.hasContact = false;
		this.hasFax = false;
		this.representativeRole = false;

		var parameters = {
			documentCode: "",
			documentParcel: "",
			site: "",
			documentSeries: "",
			documentClass: "",
			roleID: undefined,
			typeRecordFind: undefined
		};

		this.load = function (parameters) {

			controller.hasContact = false;
			controller.hasFax = false;

			if (parameters.typeRecordFind == undefined) {
				parameters.typeRecordFind = 0;
			}

			var ttParameters = {
					'documentCode': parameters.documentCode,
					'documentParcel': parameters.documentParcel !== undefined ? parameters.documentParcel : "",
					'site': parameters.site,
					'documentSeries': parameters.documentSeries !== undefined ? parameters.documentSeries : "",
					'documentClass': parameters.documentClass,
					'roleID': parameters.roleID,
					'typeRecordFind': parameters.typeRecordFind
				}

			factory.getDocDetail(ttParameters, function (result) {

				if (result.ttDetailTitulos) {

					if (result.ttDetailTitulos.length > 0) {

						controller.detailResult = result.ttDetailTitulos[0];
						controller.userRole = result.userRole;

						if (controller.userRole == "Representante") {

							controller.representativeRole = true;
							controller.detailComis = result.ttCommissionTrans_aux;

						} else {
							controller.representativeRole = false;
						}

						if (controller.detailResult != null && (controller.detailResult.contactName != null && controller.detailResult.contactName != "")) {
							controller.hasContact = true;

							if (controller.detailResult.contactFax != null || controller.detailResult.contactFax != "") {
								controller.hasFax = true;
							} else {
								controller.hasFax = false;
							}

						} else {
							controller.hasContact = false;
						}

					} 
				}
			});
		}

		this.openSelectDocs = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/acr/html/inquiredocdetail/inquiredocdetail-select-document.html',
				controller: 'acr.inquiredocdetail.select-document.Controller as controllerDetail',
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

		this.openComisDetail = function (indexPosition) {

			var modalInstance = $modal.open({
				templateUrl: '/dts/acr/html/inquiredocdetail/inquiredocdetail-comission-detail.html',
				controller: 'acr.inquiredocdetail.comis-detail.Controller as controller',
				size: 'lg',
				keyboard: true,
				backdrop: 'static',
				resolve: {
					modalParams: function () {
						return {
							detailComis: controller.detailComis,
							indexPosition: indexPosition
						};
					}
				}

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

		this.init = function () {

			appViewService.startView(i18n('l-inquire-doc-detail-external'), 'acr.inquiredocdetail.Controller', this);

		};

		this.nextDocument = function () {

			if (controller.detailResult != undefined) {

				controller.setEmptyParams();

				if (controller.detailResult.documentCode) {
					parameters.documentCode = controller.detailResult.documentCode;
				}
				if (controller.detailResult.documentParcel) {
					parameters.documentParcel = controller.detailResult.documentParcel;
				}
				if (controller.detailResult.site) {
					parameters.site = controller.detailResult.site;
				}
				if (controller.detailResult.documentSeries) {
					parameters.documentSeries = controller.detailResult.documentSeries;
				}
				if (controller.detailResult.documentClass) {
					parameters.documentClass = controller.detailResult.documentClass;
				}

				parameters.typeRecordFind = 1;

				controller.load(parameters);

			} else {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-document', [], 'dts/acr'),
					detail: $rootScope.i18n('msg-select-document', [], 'dts/acr')
				});

				return;
			}

		}

		this.previousDocument = function () {

			if (controller.detailResult != undefined) {

				controller.setEmptyParams();

				if (controller.detailResult.documentCode) {
					parameters.documentCode = controller.detailResult.documentCode;
				}
				if (controller.detailResult.documentParcel) {
					parameters.documentParcel = controller.detailResult.documentParcel;
				}
				if (controller.detailResult.site) {
					parameters.site = controller.detailResult.site;
				}
				if (controller.detailResult.documentSeries) {
					parameters.documentSeries = controller.detailResult.documentSeries;
				}
				if (controller.detailResult.documentClass) {
					parameters.documentClass = controller.detailResult.documentClass;
				}

				parameters.typeRecordFind = 2;

			} else {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-document', [], 'dts/acr'),
					detail: $rootScope.i18n('msg-select-document', [], 'dts/acr')
				});

				return;
			}

			controller.load(parameters);

		}

		this.showMessage = function (typeRecordFind) {

			if (typeRecordFind == 1) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('1522', [], 'dts/acr'),
					detail: $rootScope.i18n('msg-last-object', [], 'dts/acr')
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('1522', [], 'dts/acr'),
					detail: $rootScope.i18n('msg-first-object', [], 'dts/acr')
				});
			}

		}

		this.setEmptyParams = function () {

			parameters = {
				documentCode: "",
				documentParcel: "",
				site: "",
				documentSeries: "",
				documentClass: "",
				typeRecordFind: 0
			};

		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		if (AcrUtil.isDefined(serviceInquireDocDetailParam.paramOpp)) {

			if (serviceInquireDocDetailParam.paramOpp[0]) {
				parameters.documentCode = serviceInquireDocDetailParam.paramOpp[0].value;
			}
			if (serviceInquireDocDetailParam.paramOpp[1]) {
				parameters.documentParcel = serviceInquireDocDetailParam.paramOpp[1].value;
			}
			if (serviceInquireDocDetailParam.paramOpp[2]) {
				parameters.site = serviceInquireDocDetailParam.paramOpp[2].value;
			}
			if (serviceInquireDocDetailParam.paramOpp[3]) {
				parameters.documentSeries = serviceInquireDocDetailParam.paramOpp[3].value;
			}
			if (serviceInquireDocDetailParam.paramOpp[4]) {
				parameters.documentClass = serviceInquireDocDetailParam.paramOpp[4].value;
			}

			controller.load(parameters);

			serviceInquireDocDetailParam.paramOpp = undefined;
		}

	}
	index.register.controller('acr.inquiredocdetail.Controller', controllerInquireDocDetail);

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

			if (!this.selectDocs.model.documentCode || this.selectDocs.model.documentCode.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-document');
			}

			if (!this.selectDocs.model.site || this.selectDocs.model.site.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-site');
			}

			if (!this.selectDocs.model.documentClass || this.selectDocs.model.documentClass.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-class');
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
				fields += $rootScope.i18n(messages[i], [], 'dts/acr');
				if (isPlural && i !== (messages.length - 1)) {
					fields += ', ';
				}
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'error',
				title: $rootScope.i18n(title, [], 'dts/acr'),
				detail: $rootScope.i18n(message, [fields], 'dts/acr')
			});
		};

	}
	index.register.controller('acr.inquiredocdetail.select-document.Controller', inquireDocSelectController);

	inquireDocComisDetail.$inject = ['$modalInstance', 'modalParams', 'TOTVSEvent', '$rootScope'];
	function inquireDocComisDetail($modalInstance, modalParams, TOTVSEvent, $rootScope) {

		var controller = this;

		controller.indexPosition = undefined;
		controller.detailComis = undefined;

		controller.indexPosition = modalParams.indexPosition;
		controller.detailComis = modalParams.detailComis[controller.indexPosition];

		if (controller.indexPosition == 0) {
			controller.disablePrevious = true;
		} else {
			controller.disablePrevious = false;
		}

		if (controller.indexPosition == modalParams.detailComis.length - 1) {
			controller.disableNext = true;
		} else {
			controller.disableNext = false;
		}

		this.prevComis = function () {

			controller.disableNext = false;

			if (controller.indexPosition == 0) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('1522', [], 'dts/acr'),
					detail: $rootScope.i18n('msg-first-object', [], 'dts/acr')
				});

				return;

			} else {

				controller.indexPosition = controller.indexPosition - 1;
				controller.detailComis = modalParams.detailComis[controller.indexPosition];

				if (controller.indexPosition == 0) {
					controller.disablePrevious = true;
				} else {
					controller.disablePrevious = false;
				}

			}
		}

		this.nextComis = function () {

			controller.disablePrevious = false;

			if (controller.indexPosition == modalParams.detailComis.length - 1) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('1522', [], 'dts/acr'),
					detail: $rootScope.i18n('msg-last-object', [], 'dts/acr')
				});

				return;

			} else {

				controller.indexPosition = controller.indexPosition + 1;
				controller.detailComis = modalParams.detailComis[controller.indexPosition];

				
				if (controller.indexPosition == modalParams.detailComis.length - 1) {
					controller.disableNext = true;
				} else {
					controller.disableNext = false;
				}

			}
		}

		this.cancel = function () {
			$modalInstance.dismiss();
		}

	}
	index.register.controller('acr.inquiredocdetail.comis-detail.Controller', inquireDocComisDetail);
});
