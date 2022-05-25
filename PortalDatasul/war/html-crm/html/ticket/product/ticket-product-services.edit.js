/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1033.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1004.js',	
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalTicketProductEdit,
		controllerTicketProductEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalTicketProductEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/ticket/product/ticket-product.edit.html',
				controller: 'crm.ticket.product.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalTicketProductEdit.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************
	controllerTicketProductEdit = function ($rootScope, $scope, ticketRatingFactory, productFactory, ticketFactory, TOTVSEvent, helper, preferenceFactory, accessRestrictionFactory) {

		var CRMControlTicketProductEdit = this,
			$modalInstance = $scope.$modalInstance || undefined;

		this.model = {};

		this.parameters = $scope.parameters || {};

		this.listOfProducts = [];

		this.listOfProductsToAdd = [];

		this.editMode = false;

		this.defaults = {};

		this.firstLoad = false;

		this.productQuantity = undefined;

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('ticket.product.edit', $rootScope.currentuser.login, function (result) {
				CRMControlTicketProductEdit.accessRestriction = result || {};
			});

			if (this.parameters && this.parameters.num_id_ocor) {
				this.model.num_id_ocor = this.parameters.num_id_ocor;
			}

			if (this.parameters && this.parameters.isAddTicket) {
				this.isAddTicket = this.parameters.isAddTicket;
			}

			if (this.parameters && this.parameters.productsCount) {
				this.productsCount = this.parameters.productsCount;
			} else {
				this.productsCount = 0;
			}

			if (CRMUtil.isDefined(this.parameters.product)) {
				this.model = this.parameters.product;

				this.createDefaults();

				if (!this.model.ttProduto) {
					this.convertModelToTTproduct();
				}

				this.onChangeProduct();
			}

			preferenceFactory.getPreferenceAsInteger('QTD_PROD_OCOR', function (result) {
				CRMControlTicketProductEdit.productQuantity = result || 0;
			});


			this.editMode = this.model.num_id > 0 || this.parameters.isEditMode === true;
			if (this.editMode) {
				this.firstLoad = true;
			}

			this.getRatings();
		};

		this.createDefaults = function () {
			this.defaults.num_id_vers = this.model.ttVersao ? this.model.ttVersao.num_id : 0;
			this.defaults.num_id_refer = this.model.ttReferencia ? this.model.ttReferencia.num_id : 0;
			this.defaults.num_id_compon = this.model.ttComponente ? this.model.ttComponente.num_id : 0;
		};

		this.convertModelToTTproduct = function () {
			this.model.ttProduto = {
				"cod_item_erp": this.model.cod_item_erp,
				"nom_produt": this.model.dsl_produt,
				"num_id": this.model.num_id,
				"num_id_classif_ocor": this.model.num_id_classif_ocor,
				"num_id_classif_ocor_item": this.model.num_id_classif_ocor_item
			};
		};

		this.getProducts = function (value) {
			if (!value || value === '') {
				this.listOfProducts = [];
				return [];
			}
			var model = this.model;

			this.listOfProducts = [];

			if (model.ttClassificacao && model.ttClassificacao.num_id) {
				ticketRatingFactory.getProduct(model.ttClassificacao.num_id, value, function (result) {
					if (!result) { return; }

					CRMControlTicketProductEdit.listOfProducts = result;

					if (model.ttProduto && model.ttProduto.num_id > 0) {
						CRMControlTicketProductEdit.onChangeProduct();
					}

				}, false);
			}
		};

		this.getRatings = function (isInit) {
			var i,
				model = this.model;

			ticketRatingFactory.getAll(function (result) {

				CRMControlTicketProductEdit.listOfRatings = result || [];

				if (model.ttProduto) {
					for (i = 0; i < CRMControlTicketProductEdit.listOfRatings.length; i++) {
						if (model.ttProduto.num_id_classif_ocor === CRMControlTicketProductEdit.listOfRatings[i].num_id) {
							model.ttClassificacao = CRMControlTicketProductEdit.listOfRatings[i];
							break;
						}
					}
				}

				if (CRMControlTicketProductEdit.listOfRatings.length === 1 && !model.ttProduto) {
					model.ttProduto = CRMControlTicketProductEdit.listOfRatings[0];
				}

				CRMControlTicketProductEdit.onChangeRating();
			});
		};

		this.getReferences = function () {

			this.listOfReferences = [];

			var i,
				model = this.model,
				id;

			id = model.ttProduto.num_id_classif_ocor_item || model.ttProduto.num_id;

			if (model.ttProduto && id) {
				productFactory.getReferences(id, function (result) {
					if (!result) { return; }

					CRMControlTicketProductEdit.listOfReferences = result;

					if (CRMControlTicketProductEdit.defaults && CRMControlTicketProductEdit.defaults.num_id_refer > 0) {

						for (i = 0; i < CRMControlTicketProductEdit.listOfReferences.length; i++) {

							if (CRMControlTicketProductEdit.defaults.num_id_refer === CRMControlTicketProductEdit.listOfReferences[i].num_id) {
								model.ttReferencia = CRMControlTicketProductEdit.listOfReferences[i];
								break;
							}
						}
					}

				}, true);
			}
		};

		this.getComponents = function () {

			this.listOfComponents = [];

			var i,
				model = this.model,
				id;

			id = model.ttProduto.num_id_classif_ocor_item || model.ttProduto.num_id;

			if (model.ttProduto && id) {
				productFactory.getComponents(id, function (result) {
					if (!result) { return; }

					CRMControlTicketProductEdit.listOfComponents = result;

					if (CRMControlTicketProductEdit.defaults && CRMControlTicketProductEdit.defaults.num_id_compon > 0) {

						for (i = 0; i < CRMControlTicketProductEdit.listOfComponents.length; i++) {

							if (CRMControlTicketProductEdit.defaults.num_id_compon === CRMControlTicketProductEdit.listOfComponents[i].num_id) {
								model.ttComponente = CRMControlTicketProductEdit.listOfComponents[i];
								break;
							}
						}
					}

				}, true);
			}
		};

		this.getVersions = function () {

			this.listOfVersions	 = [];

			var i,
				model = this.model,
				id;

			id = model.ttProduto.num_id_classif_ocor_item || model.ttProduto.num_id;

			if (model.ttProduto && id) {
				productFactory.getVersions(id, function (result) {
					if (!result) { return; }

					CRMControlTicketProductEdit.listOfVersions = result;

					if (CRMControlTicketProductEdit.defaults && CRMControlTicketProductEdit.defaults.num_id_vers > 0) {

						for (i = 0; i < CRMControlTicketProductEdit.listOfVersions.length; i++) {

							if (CRMControlTicketProductEdit.defaults.num_id_vers === CRMControlTicketProductEdit.listOfVersions[i].num_id) {
								model.ttVersao = CRMControlTicketProductEdit.listOfVersions[i];
								break;
							}
						}
					}

				}, true);
			}
		};

		this.save = function (isNew) {
			var vo,
				product;

			if (this.isInvalidForm()) {
				return;
			}

			if (this.parameters.isAddTicket) {
				product = angular.copy(this.model);

				if (this.listOfProductsToAdd.length + this.productsCount >= this.productQuantity) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-max-product-quantity', [
							this.productQuantity
						], 'dts/crm')
					});

					return;
				}

				this.listOfProductsToAdd.push(product);

				if (!isNew) {
					this.cancel();
					return;
				} else {
					this.clearForm();
				}

			} else {
				vo = this.convertToSave();

				if (this.editMode === false) {
					ticketFactory.addProduct(this.model.num_id_ocor, vo, function (result) {
						if (result && result.length > 0) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-save-ticket-product', [
									result[0].dsl_produt
								], 'dts/crm')
							});

							if (isNew) {
								CRMControlTicketProductEdit.clearForm();
							} else {
								CRMControlTicketProductEdit.cancel();
							}
						}
					});
				} else {
					ticketFactory.updateProduct(this.model.num_id, this.model.num_id_ocor, vo, function (result) {
						if (result) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-save-ticket-product', [
									result.dsl_produt
								], 'dts/crm')
							});

							CRMControlTicketProductEdit.cancel();
						}
					});
				}
			}

		};

		this.convertToSave = function () {
			var vo = {};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
			}

			vo.num_id_classif_ocor_item = this.model.ttProduto.num_id_classif_ocor_item || this.model.ttProduto.num_id;

			if (this.model.ttReferencia &&  this.model.ttReferencia.num_id) {
				vo.num_id_refer = this.model.ttReferencia.num_id;
			}

			if (this.model.ttComponente && this.model.ttComponente.num_id) {
				vo.num_id_produt_filho = this.model.ttComponente.num_id;
			}


			if (this.model.ttVersao &&  this.model.ttVersao.num_id) {
				vo.num_id_vers = this.model.ttVersao.num_id;
			}

			vo.cod_lote = this.model.cod_lote;
			vo.dat_valid = this.model.dat_valid;
			vo.qtd_analis = this.model.qtd_analis;
			vo.qtd_devolvid = this.model.qtd_devolvid;

			return vo;
		};

		this.isInvalidForm = function () {

			var message,
				messages = [],
				isInvalidForm = false;

			if (!this.model.ttClassificacao) {
				isInvalidForm = true;
				messages.push('l-classification');
			}

			if (!this.model.ttProduto) {
				isInvalidForm = true;
				messages.push('l-product');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-product', messages);
			}

			return isInvalidForm;
		};


		this.onChangeProduct = function (selected) {
			if (CRMUtil.isDefined(selected)) {
				this.model.ttProduto = selected;
			}

			this.model.ttVersao = undefined;
			this.model.ttComponente = undefined;
			this.model.ttReferencia = undefined;

			this.getReferences();
			this.getComponents();
			this.getVersions();
		};

		this.clearForm = function () {
			delete this.model.ttClassificacao;
			delete this.model.ttProduto;
			this.onChangeRating();
		};

		this.onChangeRating = function () {

			if (this.firstLoad) {
				this.firstLoad = false;
				return;
			}

			delete this.model.ttReferencia;
			delete this.model.ttComponente;
			delete this.model.ttVersao;
			delete this.model.ttComponente;
			delete this.model.ttProduto;
			delete this.model.cod_lote;
			delete this.model.qtd_analis;
			delete this.model.qtd_devolvid;
			delete this.model.dat_valid;

			this.model.ttVersao = undefined;
			this.model.ttComponente = undefined;
			this.model.ttReferencia = undefined;
		};

		this.cancel = function () {
			$modalInstance.close(CRMControlTicketProductEdit.listOfProductsToAdd);
		};

		this.init();
	};

	controllerTicketProductEdit.$inject = ['$rootScope', '$scope', 'crm.crm_classificacao_ocor.factory', 'crm.crm_produt.factory', 'crm.crm_ocor.factory', 'TOTVSEvent', 'crm.helper', 'crm.crm_param.factory', 'crm.crm_acess_portal.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket.product.modal.edit', modalTicketProductEdit);
	index.register.controller('crm.ticket.product.edit.control', controllerTicketProductEdit);

});
