/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/api/fchcrm1028.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchdis0051.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalOpportunityProductEdit,
		modalOpportunityProductPriceSettings,
		controllerOpportunityProductTab,
		controllerOpportunityProductEdit,
		controllerOpportunityProductPriceSettings;

	// *************************************************************************************
	// *** TAB PRODUCT
	// *************************************************************************************
	controllerOpportunityProductTab = function ($rootScope, $scope, TOTVSEvent, helper, opportunityFactory,
		productFactory, referenceFactory, priceTableFactory, preferenceFactory, gainLossFactory, opportunityProductEditModal, accessRestrictionFactory
	) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityProductTab = this;

		this.accessRestriction = undefined;

		this.listOfProduct = [];
		this.listOfProductCount = 0;

		this.opportunity = undefined;

		this.isEnabled = true;
		this.isToChangeOppValue = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			CRMControlOpportunityProductTab.loadPreferences();
			opportunityFactory.getProducts(CRMControlOpportunityProductTab.opportunity.num_id, function (result) {

				if (!result) { return; }

				CRMControlOpportunityProductTab.listOfProduct = result;
				CRMControlOpportunityProductTab.listOfProductCount = result.length;
			});
		};

		this.loadPreferences = function (callback) {
			var count = 0, total = 1;

			preferenceFactory.getPreferenceAsBoolean('LOG_OP_TOTAL', function (result) {
				CRMControlOpportunityProductTab.isToChangeOppValue = result || false;
			});
		};

		this.addEdit = function (product) {
			var control = CRMControlOpportunityProductTab,
				isEdit = false,
				i;

			if (product && product.num_id > 0) {
				isEdit = true;
			}

			productFactory.isCifFobParamValid(control.opportunity.num_id, function (result) {

				if (result.isCifFobParamValid) {
					opportunityProductEditModal.open({
						opportunity: control.opportunity,
						establishment: (control.opportunity && control.opportunity.ttEstabelecimento) ? control.opportunity.ttEstabelecimento : undefined,
						product: product
					}).then(function (result) {

						if (isEdit === true) {
							for (i = 0; i < control.listOfProduct.length; i++) {
								if (result[0].num_id === control.listOfProduct[i].num_id) {
									control.listOfProduct[i] = result[0];
									break;
								}
							}
						} else {
							for (i = 0; i < result.length; i++) {
								control.listOfProduct.push(result[i]);
								control.listOfProductCount++;
							}
						}
						if (control.isToChangeOppValue === true) {
							$rootScope.$broadcast(CRMEvent.scopeSaveOpportunityProduct, control.opportunity.num_id);
						}
					});
				} else {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('nav-product', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-record-cif-fob-params', [], 'dts/crm')
					});

				}

			});
		};

		this.remove = function (product, index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-product', [], 'dts/crm').toLowerCase(),
					product.nom_produt
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						opportunityFactory.deleteProduct(product.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-product', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							CRMControlOpportunityProductTab.listOfProduct.splice(index, 1);
							CRMControlOpportunityProductTab.listOfProductCount--;

							if (CRMControlOpportunityProductTab.isToChangeOppValue === true) {
								$rootScope.$broadcast(CRMEvent.scopeSaveOpportunityProduct, product.num_id_oportun);
							}
						});

					}
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (opportunity, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('opportunity.product.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityProductTab.accessRestriction = result || {};
			});

			CRMControlOpportunityProductTab.opportunity = opportunity;
			CRMControlOpportunityProductTab.isEnabled = (isEnabled !== false);
			CRMControlOpportunityProductTab.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityProductTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlOpportunityProductTab.init(opportunity, opportunity.log_acesso);
		});

	}; // controllerAttachmentTab
	controllerOpportunityProductTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.crm_produt.factory',
		'crm.crm_refer.factory', 'crm.crm_tab_preco.factory', 'crm.crm_param.factory', 'crm.crm_oportun_ganho_perda.factory', 'crm.opportunity-product.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** EDIT PRODUCT
	// *************************************************************************************

	modalOpportunityProductEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/opportunity/product/product.edit.html',
				controller: 'crm.opportunity-product.edit.control as productController',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalOpportunityProductEdit.$inject = ['$modal'];

	modalOpportunityProductPriceSettings = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/opportunity/product/product-price.select.html',
				controller: 'crm.opportunity-product-price-settings.control as priceSettingsController',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalOpportunityProductPriceSettings.$inject = ['$modal'];

	controllerOpportunityProductEdit = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters, helper,
		productFactory, preferenceFactory, priceTableFactory, referenceFactory, opportunityFactory, gainLossFactory, opportunityProductPriceSettingsModal, sallesFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityProductEdit = this;

		this.accessRestriction = undefined;

		this.model = undefined;
		this.editMode = undefined;
		this.opportunity = undefined;

		this.gainLosses = undefined;
		this.products = undefined;

		this.resultModels = [];

		this.references = [];
		this.unitOfMeasures = [];

		this.priceSettingSelected = undefined;
		this.isControlCifFobEnable = false;
		this.applyCIFPrice = true; // default CIF

		// Estas flags controlam o Load destes campos para não disparar o cálculo do produto ao carregar a página.
		this.isFirstTimeAccessFieldReferences = true;
		this.isFirstTimeAccessFieldQuantity = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.save = function (keepOpen) {
			var vo,
				model,
				control = CRMControlOpportunityProductEdit;

			model = control.model;

			if (this.isInvalidForm()) { return; }

			vo = this.convertToSave();

			if (this.editMode === true) {

				vo.num_id = model.num_id;

				opportunityFactory.updateProduct(control.opportunity.num_id, vo.num_id, vo, function (result) {

					if (!result) { return; }

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-product', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-related-generic', [
							$rootScope.i18n('l-product', [], 'dts/crm'),
							model.ttProduto.nom_produt,
							control.opportunity.des_oportun_vda
						], 'dts/crm')
					});

					result.log_referencia = model.ttProduto.log_referencia;

					if (control.model.ttMotivoGanhoPerda &&
						control.model.ttMotivoGanhoPerda.num_id > 0 &&
						control.model.ttMotivoGanhoPerda.num_id !== control.model.num_id_gain_loss) {

						/**fecha a janela e retorna os dados corretamente para a tela chamadora */
						control.saveGainLoss(result.num_id, result, function (newResult) {
							CRMControlOpportunityProductEdit.resultModels.push(newResult);
							$modalInstance.close(CRMControlOpportunityProductEdit.resultModels);
						});

					} else {
						control.resultModels.push(result);
						if (keepOpen !== true) {
							$modalInstance.close(control.resultModels);
						}
					}

				});
			} else {
				opportunityFactory.addProduct(this.opportunity.num_id, vo, function (result) {

					if (!result) { return; }

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-product', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-related-generic', [
							$rootScope.i18n('l-product', [], 'dts/crm'),
							model.ttProduto.nom_produt,
							control.opportunity.des_oportun_vda
						], 'dts/crm')
					});

					result.log_referencia = model.ttProduto.log_referencia;

					control.resultModels.push(result);

					if (keepOpen !== true) {
						$modalInstance.close(control.resultModels);
					} else {
						control.model = {};
						control.editMode = false;
						// fix bug do compoente/frame que nao limpa o valor do input.
						$("[ng-model='productController.model.ttProduto']").find("input.ui-select-search").val("");
						control.validateParameterModel();
					}

				});
			}
		};

		this.isInvalidForm = function () {

			var i,
				fields,
				message,
				messages = [],
				isPlural,
				isInvalidForm = false;

			if (!this.model.ttProduto) {
				isInvalidForm = true;
				messages.push('l-product');
			}

			if (!this.model.ttTabelaPreco) {
				isInvalidForm = true;
				messages.push('l-price-table');
			}

			if (!this.model.ttReferencia && (this.model.ttProduto.log_referencia)) {
				isInvalidForm = true;
				messages.push('l-reference');
			}

			if ((!this.model.ttUnidadeMedida) && (this.unitOfMeasures.length > 0)) {
				isInvalidForm = true;
				messages.push('l-unit-of-measurement');
			}

			if (!this.model.qtd_item) {
				isInvalidForm = true;
				messages.push('l-quantity');
			}

			if (!this.model.val_preco_unit) {
				isInvalidForm = true;
				messages.push('l-price-value');
			}

			if (!this.model.val_tot_itens) {
				isInvalidForm = true;
				messages.push('l-total-value');
			}

			if (isInvalidForm) {

				fields = '';

				isPlural = messages.length > 1;

				message = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i++) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-product', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}

			/* tipo informado, campo preço fica aberto para usuario informar */
			if (isInvalidForm === false && this.model.ttProduto) {

				isInvalidForm = true;

				if (this.model.ttUnidadeMedida) {
					for (i = 0; i < this.priceSettings.length; i++) {
						if ((this.priceSettings[i].num_id_umd === this.model.ttUnidadeMedida.num_id) && (this.priceSettings[i].qtd_min_item <= this.model.qtd_item)) {
							isInvalidForm = false;
							break;
						}
					}
				} else {
					for (i = 0; i < this.priceSettings.length; i++) {
						if (this.priceSettings[i].qtd_min_item <= this.model.qtd_item) {
							isInvalidForm = false;
							break;
						}
					}
				}


				if (isInvalidForm === true) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('nav-product', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-validate-product-minimum-quantity', ['$'], 'dts/crm')
					});
					isInvalidForm = true;
				}

			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {};

			if (this.model.ttProduto) {
				vo.num_id_produt = this.model.ttProduto.num_id;	// id do item na tab preço
			}

			if (this.model.ttTabelaPreco) {
				vo.num_id_tab_preco = this.model.ttTabelaPreco.num_id;
			}

			if (this.model.ttReferencia) {
				vo.num_id_refer = this.model.ttReferencia.num_id;
			}

			if (this.model.ttUnidadeMedida) {
				vo.num_id_umd_vda = this.model.ttUnidadeMedida.num_id;
			}

			vo.qtd_item = this.model.qtd_item;
			vo.val_preco_unit = this.model.val_preco_unit;
			vo.val_item_clien = this.model.val_item_clien || 0;
			vo.val_item_repres = this.model.val_item_repres || 0;
			vo.val_tot_itens = this.model.val_tot_itens;
			vo.dsl_observacao = this.model.dsl_observacao || "";
			vo.purchase_order = this.model.purchase_order || "";

			return vo;
		};

		this.getPriceRelated = function () {

			var i = 0,
				qtd = 0,
				isOut = false,
				idx = -1;

			// encontra a faixa de preço(item tab preço) que melhor se encaixa
			for (i = 0; i < this.priceSettings.length; i++) {

				if (this.priceSettings[i].qtd_min_item <= this.model.qtd_item) {

					isOut = false;

					if ((this.model.ttUnidadeMedida) && (this.priceSettings[i].num_id_umd !== this.model.ttUnidadeMedida.num_id)) {
						isOut = true;
					}

					if ((this.model.ttReferencia) && (this.priceSettings[i].num_id_refer !== this.model.ttReferencia.num_id)) {
						isOut = true;
					}

					if (qtd > this.priceSettings[i].qtd_min_item) {
						isOut = true;
					}

					// ate o momento faixa de preço que melhor se encaixa
					if (isOut === false) {
						qtd = this.priceSettings[i].qtd_min_item;
						idx = i;
					}

				}
			}
			return idx;
		};

		this.cancel = function () {
			var control = CRMControlOpportunityProductEdit;

			if (control.resultModels.length > 0) {
				$modalInstance.close(control.resultModels);
			} else {
				$modalInstance.dismiss('cancel');
			}
		};

		this.getProducts = function (value) {

			var model,
				filter,
				control = CRMControlOpportunityProductEdit;

			model = control.model;

			if (!model.ttTabelaPreco || !model.ttTabelaPreco.num_id) { return []; }

			if (!value || value === '') { return []; }

			control.products = [];
			model.ttProduto = undefined;

			filter = [
				{ property: 'crm_tab_preco_item.num_id_tab_preco', value: model.ttTabelaPreco.num_id },
				{ property: 'custom.quick_search', value: helper.parseStrictValue(value) }
			];

			return productFactory.typeahead(filter, undefined, function (result) {
				control.products = result || [];

				if (control.products.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: $rootScope.i18n('nav-product', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-product', [], 'dts/crm')
					});
				}
			});
		};

		this.getProductZoomInit = function () {
			if (CRMControlOpportunityProductEdit.model.ttTabelaPreco) {
				return { 'num_id_tab_preco': CRMControlOpportunityProductEdit.model.ttTabelaPreco.num_id };
			} else {
				return { 'num_id_tab_preco': undefined };
			}

		};

		this.onChangePriceTable = function (selected) {
			var model = CRMControlOpportunityProductEdit.model,
				control = CRMControlOpportunityProductEdit;

			control.priceSettingSelected = undefined;

			if (selected) {
				model.ttTabelaPreco = selected;
			}

			control.products = [];
			model.ttProduto = undefined;

			this.onChangeProduct();
		};

		this.onChangeProduct = function (selected) {
			var model = CRMControlOpportunityProductEdit.model,
				control = CRMControlOpportunityProductEdit;

			control.unitOfMeasures = [];
			control.references = [];
			control.priceSettingSelected = undefined;
			control.priceSettings = [];

			model.ttReferencia = undefined;
			model.ttUnidadeMedida = undefined;

			model.qtd_item = 0;
			model.val_preco_unit = 0;
			model.val_tot_itens = 0;
			model.val_item_clien = 0;
			model.val_item_repres = 0;

			if (selected) {
				model.ttProduto = selected;
			}

			if (model.ttProduto && model.ttProduto.num_id_produt) {
				control.getProductSettings();
			}

		};

		this.onOpenComplementPanel = function () {
			var control = CRMControlOpportunityProductEdit;
			gainLossFactory.getAll(function (result) {
				control.gainLosses = result || [];
			});
		};

		this.onChangeUnitOfMeasures = function () {
			this.setPriceSuggestion();
		};

		this.onChangeReferences = function () {
			if (!this.isFirstTimeAccessFieldReferences) {
				this.setPriceSuggestion();
			}
			this.isFirstTimeAccessFieldReferences = false;
		};

		this.saveGainLossAsk = function (idOpportunityProduct) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-attention', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('l-no', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('l-yes', [], 'dts/crm'),
				text: $rootScope.i18n('msg-add-gain-loss-reason', [], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					CRMControlOpportunityProductEdit.saveGainLoss(idOpportunityProduct);
				}
			});

		};

		this.saveGainLoss = function (idOpportunityProduct, newResult, callback) {
			var control = CRMControlOpportunityProductEdit,
				model = control.model,
				voGainLoss = {};

			if (!model.ttMotivoGanhoPerda || model.ttMotivoGanhoPerda.num_id <= 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-gain-loss', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-form-validation', [
						$rootScope.i18n('l-gain-loss-reason', [], 'dts/crm')
					], 'dts/crm')
				});
				return;
			}

			voGainLoss.num_id = model.ttMotivoGanhoPerda.num_id;
			voGainLoss.num_id_oportun_produt = idOpportunityProduct;

			opportunityFactory.addGainLoss(control.opportunity.num_id, voGainLoss, function (result) {

				if (callback) {

					if (result) {
						newResult.num_id_gain_loss = model.ttMotivoGanhoPerda.num_id;
						newResult.nom_gain_loss = model.ttMotivoGanhoPerda.des_motivo;
						newResult.log_gain_loss = model.ttMotivoGanhoPerda.log_ganho_motiv;
					}

					callback(newResult);
				}

				if (!result) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-gain-loss', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n('l-gain-loss-reason', [], 'dts/crm'),
						model.ttMotivoGanhoPerda.des_motivo,
						control.opportunity.des_oportun_vda
					], 'dts/crm')
				});

				/**atualiza os valores no model principal */
				model.num_id_gain_loss = model.ttMotivoGanhoPerda.num_id;
				model.nom_gain_loss = model.ttMotivoGanhoPerda.des_motivo;
				model.log_gain_loss = model.ttMotivoGanhoPerda.log_ganho_motiv;

				$rootScope.$broadcast(CRMEvent.scopeSaveOpportunityGainLoss);


			});

		};

		this.getProductSettings = function (product, callback) {
			var control = CRMControlOpportunityProductEdit,
				model = control.model,
				i = 0;

			if (!model || !model.ttTabelaPreco || !model.ttProduto) { return; }

			productFactory.getProductSettingsForPriceTable(model.ttProduto.num_id_produt, model.ttTabelaPreco.num_id, function (result) {

				if (result) {

					control.references = result.ttReferencia || [];
					control.unitOfMeasures = result.ttUnidadeMedida || [];
					control.priceSettings = result.ttTabelaPrecoItem || [];
					control.currencyFormatTablePrice = result.currencyFormatTablePrice || undefined;

					if (!product) {
						if (model.ttProduto.log_referencia === true && control.references.length === 1) {
							model.ttReferencia = control.references[0];
						}

						if (control.unitOfMeasures.length === 1) {
							model.ttUnidadeMedida = control.unitOfMeasures[0];
						}
					} else {
						for (i = 0; i < control.unitOfMeasures.length; i++) {
							if (control.unitOfMeasures[i].num_id === product.num_id_umd) {
								model.ttUnidadeMedida = control.unitOfMeasures[i];
								break;
							}
						}

						if (model.ttProduto.log_referencia === true) {
							for (i = 0; i < control.references.length; i++) {
								if (control.references[i].num_id === product.num_id_refer) {
									model.ttReferencia = control.references[i];
									break;
								}
							}
						}
					}

					if (!product) {
						control.setPriceSuggestion();
					}
				}

				if (callback) { callback(); }

			});
		};

		this.calculateTotal = function (value, quantity) {
			var control = CRMControlOpportunityProductEdit;

			value = value || control.model.val_preco_unit;
			quantity = quantity || control.model.qtd_item;

			control.model.val_tot_itens = value * quantity;
		};

		this.setPriceSuggestion = function () {
			var control = CRMControlOpportunityProductEdit,
				model = control.model,
				selectPrice,
				idx = 0;

			if (!model.ttTabelaPreco || !model.ttProduto) { return; }

			idx = this.getPriceRelated();
			selectPrice = idx >= 0 ? this.priceSettings[idx] : undefined;
			control.setPriceSetting(selectPrice, true);

		};

		this.setPriceSetting = function (data, isSuggestion) {

			var i = 0,
				control = CRMControlOpportunityProductEdit;

			if (!data) {
				control.model.val_preco_unit = 0;
				return;
			}

			if (!isSuggestion) {
				control.priceSettingSelected = angular.copy(data);

				control.model.ttUnidadeMedida = undefined;
				control.model.ttReferencia = undefined;

				for (i = 0; i < control.unitOfMeasures.length; i++) {
					if (control.unitOfMeasures[i].num_id === data.num_id_umd) {
						control.model.ttUnidadeMedida = control.unitOfMeasures[i];
						break;
					}
				}

				for (i = 0; i < control.references.length; i++) {
					if (control.references[i].num_id === data.num_id_refer) {
						control.model.ttReferencia = control.references[i];
						break;
					}
				}

				control.model.qtd_item = data.qtd_min_item;
			}

			// seta valor selecionado na configuração de preço
			control.model.val_preco_unit = control.applyCIFPrice ? data.val_preco_unit : data.val_preco_fob;
			control.model.ttProduto.num_id = data.num_id; // id do produto é o msm, mas o id da relacional muda conforme faixa selecionada

			control.calculateTotal();

		};

		this.showPriceSettings = function () {
			var control = CRMControlOpportunityProductEdit;

			if (!control.model.ttProduto) { return; }

			opportunityProductPriceSettingsModal.open({
				priceSettings: control.priceSettings,
				product: control.ttProduto,
				currencyFormatTablePrice: control.currencyFormatTablePrice,
				isControlCifFobEnable: CRMControlOpportunityProductEdit.isControlCifFobEnable
			}).then(function (result) {
				control.setPriceSetting(result);
			});
		};

		this.validateParameterModel = function (callback) {
			var model = CRMControlOpportunityProductEdit.model || {};

			this.editMode = (model.num_id > 0);

			if (this.editMode === false) {
				priceTableFactory.getAll(true, function (result) {
					CRMControlOpportunityProductEdit.priceTables = result || [];
					if (callback) { callback(); }
				});
			} else {
				model.ttProduto = {
					num_id: model.num_id_produt,
					num_id_produt: model.num_id_produt_orig,
					nom_produt: model.nom_produt,
					cod_item_erp: model.cod_item_erp,
					val_preco_unit: model.val_preco_unit,
					qtd_min_item: model.qtd_min_item,
					num_id_umd: model.num_id_umd_vda,
					num_id_refer: model.num_id_refer,
					log_referencia: model.log_referencia
				};

				model.ttTabelaPreco = {
					num_id: model.num_id_tab_preco,
					nom_tab_preco: model.nom_tab_preco
				};

				/** Insere o ultimo ganho peso cadastrado **/
				if (model.num_id_gain_loss > 0) {
					model.ttMotivoGanhoPerda = {
						num_id: model.num_id_gain_loss,
						des_motivo: model.nom_gain_loss,
						log_ganho_motiv: model.log_gain_loss
					};
				}

				CRMControlOpportunityProductEdit.getProductSettings(model.ttProduto, function () {
					if (callback) { callback(); }
				});
			}
		};

		this.LoadEventsListeners = function () {

			$scope.$watch("productController.model.val_preco_unit", function (value, oldValue) {
				var control = CRMControlOpportunityProductEdit;

				if (control.priceSettingSelected && control.priceSettingSelected.val_preco_unit !== value) {
					control.priceSettingSelected = undefined;
				}

				control.calculateTotal(value, undefined);

			}, true);

			$scope.$watch("productController.model.qtd_item", function (value, oldValue) {
				var control = CRMControlOpportunityProductEdit;

				if (control.priceSettingSelected && control.priceSettingSelected.qtd_min_item !== value) {
					control.priceSettingSelected = undefined;
				}

				if (!control.priceSettingSelected && !control.isFirstTimeAccessFieldQuantity) {
					control.setPriceSuggestion();
				}

				control.isFirstTimeAccessFieldQuantity = false;

			}, true);

		};

		this.loadPreferences = function (callback) {
			var count = 0, total = 1;

			preferenceFactory.getPreferenceAsBoolean('LOG_CONTROL_CIF_FOB', function (result) {
				CRMControlOpportunityProductEdit.isControlCifFobEnable = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.applyPriceWithShipping = function (callback) {
			var opp = CRMControlOpportunityProductEdit.opportunity,
				estab = CRMControlOpportunityProductEdit.establishment;

			if (CRMUtil.isDefined(opp.nom_cidad_cif)) {
				if (callback) { callback(true); } // Cidade CIF -> ira aplicar preco CIF
			} else if (CRMUtil.isUndefined(estab)) {
				if (callback) { callback(true); } // N informado estabelecimento -> ira aplicar preco CIF
			} else {
				sallesFactory.applyPriceWithShipping(estab.cod_estab_erp, function (applyCIFPrice) {
					if (callback) { callback(applyCIFPrice); }
				});
			}
		};

		this.validatorPurchaseOrder = function () {
			if (CRMControlOpportunityProductEdit.model.purchase_order) {
				if (CRMControlOpportunityProductEdit.model.purchase_order.length > 15) {
					CRMControlOpportunityProductEdit.model.purchase_order = CRMControlOpportunityProductEdit.model.purchase_order_val;
				} else {
					CRMControlOpportunityProductEdit.model.purchase_order_val = CRMControlOpportunityProductEdit.model.purchase_order;
				}
			}
		};

		this.validateParameters = function () {

			var opp = CRMControlOpportunityProductEdit.opportunity,
				estab = CRMControlOpportunityProductEdit.establishment;

			CRMControlOpportunityProductEdit.loadPreferences(function () {

				if (CRMControlOpportunityProductEdit.isControlCifFobEnable === true) {

					// Se n informado Cidade CIF e informado o estabelecimento
					if (CRMUtil.isUndefined(opp.nom_cidad_cif) && CRMUtil.isDefined(estab)) {

						// Aplicar ou preco CIF?
						sallesFactory.applyPriceWithShipping(estab.cod_estab_erp, function (applyCIFPrice) {
							CRMControlOpportunityProductEdit.applyCIFPrice = applyCIFPrice;
						});

					}

				}

			});
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('opportunity.product.edit', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityProductEdit.accessRestriction = result || {};
			});

			this.validateParameters();

			this.validateParameterModel(function (result) {
				CRMControlOpportunityProductEdit.LoadEventsListeners();
			});

		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************
		this.opportunity = parameters.opportunity ? angular.copy(parameters.opportunity) : {};
		this.establishment = parameters.establishment ? angular.copy(parameters.establishment) : {};
		this.model = parameters.product ? angular.copy(parameters.product) : {};

		this.init();


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityProductEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});

	};
	controllerOpportunityProductEdit.$inject = [
		'$rootScope', '$scope', "$modalInstance", 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.crm_produt.factory', 'crm.crm_param.factory', 'crm.crm_tab_preco.factory',
		'crm.crm_refer.factory', 'crm.crm_oportun_vda.factory', 'crm.crm_oportun_ganho_perda.factory',
		'crm.opportunity-product-price-setttings.modal.edit', 'crm.mpd_fchdis0051.factory', 'crm.crm_acess_portal.factory'
	];

	controllerOpportunityProductPriceSettings = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters, helper) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityProductPriceSettings = this;

		this.model = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.selectPrice = function (data) {
			$modalInstance.close(data);
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};


		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.priceSettings = parameters.priceSettings ? angular.copy(parameters.priceSettings) : [];
		this.product = parameters.product ? angular.copy(parameters.product) : {};
		this.isControlCifFobEnable = parameters.isControlCifFobEnable || false;
		this.currencyFormatTablePrice = parameters.currencyFormatTablePrice || undefined;


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

	};
	controllerOpportunityProductPriceSettings.$inject = [
		'$rootScope', '$scope', "$modalInstance", 'TOTVSEvent', 'parameters', 'crm.helper'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.opportunity-product.modal.edit', modalOpportunityProductEdit);
	index.register.service('crm.opportunity-product-price-setttings.modal.edit', modalOpportunityProductPriceSettings);

	index.register.controller('crm.opportunity-product.tab.control', controllerOpportunityProductTab);
	index.register.controller('crm.opportunity-product.edit.control', controllerOpportunityProductEdit);
	index.register.controller('crm.opportunity-product-price-settings.control', controllerOpportunityProductPriceSettings);
});
