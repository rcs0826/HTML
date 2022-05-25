/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1008.js',
	'/dts/crm/js/api/fchcrm1010.js',
	'/dts/crm/js/api/fchcrm1011.js',
	'/dts/crm/js/api/fchcrm1012.js',
	'/dts/crm/js/api/fchcrm1013.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalAccountAddressEdit,
		controllerAccountAddressTab,
		controllerAccountAddressEdit;

	// *************************************************************************************
	// *** CONTROLLER ADDRESS TAB
	// *************************************************************************************
	controllerAccountAddressTab = function ($rootScope, $scope, TOTVSEvent, helper, helperAddress, accountFactory,
										 modalAddressEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountAddressTab = this;

		this.accessRestriction = undefined;

		this.listOfAddress = [];

		this.listOfAddressCount = 0;

		this.types = helperAddress.types;

		this.account = undefined;

		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.addEdit = function (address) {
			var vo = angular.copy(address),
				i;

			if (vo && vo.cod_cep) {
				vo.cod_cep = vo.cod_cep.replace(/d+/, '');
			}

			modalAddressEdit.open({
				address: vo,
				typesToRemove: CRMControlAccountAddressTab.listOfAddress,
				account: this.account
			}).then(function (result) {

				if (!result || (result && result.length === 0)) { return; }

				if (address) {
					var index = CRMControlAccountAddressTab.listOfAddress.indexOf(address);
					CRMControlAccountAddressTab.listOfAddress[index] = result[0];
				} else {
					for (i = 0; i < result.length; i++) {
						CRMControlAccountAddressTab.listOfAddressCount++;
						CRMControlAccountAddressTab.listOfAddress.unshift(result[i]);
					}
				}
			});
		};
		
		this.load = function () {
			accountFactory.getAddress(this.account.num_id, function (result) {
				var i;

				if (!result) { return; }

				CRMControlAccountAddressTab.listOfAddress = [];

				for (i = 0; i < result.length; i++) {
					helperAddress.parseType(result[i]);					
					CRMControlAccountAddressTab.listOfAddress.push(result[i]);
				}

				CRMControlAccountAddressTab.listOfAddressCount = result.length;
			});
		};

		this.remove = function (address) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-addresses', [], 'dts/crm').toLowerCase(),
					helperAddress.parseAddressToString(address)
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						accountFactory.deleteAddress(address.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-address', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlAccountAddressTab.listOfAddress.indexOf(address);

							if (index !== -1) {
								CRMControlAccountAddressTab.listOfAddress.splice(index, 1);
								CRMControlAccountAddressTab.listOfAddressCount--;
							}
						});

					}
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (account, isEnabled) {

			accessRestrictionFactory.getUserRestrictions('account.address.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountAddressTab.accessRestriction = result || {};
			});

			this.account = account;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountAddressTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountAddressTab.init(account, account.log_acesso);
		});

		$scope.$on(CRMEvent.scopeSaveAccount, function (event, account) {
			CRMControlAccountAddressTab.init(account, account.log_acesso);
		});

	}; // controllerAccountAddressTab
	controllerAccountAddressTab.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'crm.helper',
		'crm.account-address.helper',
		'crm.crm_pessoa.conta.factory',
		'crm.account-address.modal.edit',
		'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** MODAL ACCOUNT ADDRESS EDIT
	// *************************************************************************************
	modalAccountAddressEdit = function ($modal) {
		this.open = function (params) {

			params = params || {};

			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/address/address.edit.html',
				controller: 'crm.account-address.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalAccountAddressEdit.$inject = ['$modal'];
	// *************************************************************************************
	// *** CONTROLLER ACCOUNT ADDRESS EDIT
	// *************************************************************************************
	controllerAccountAddressEdit = function ($rootScope, $scope, $modalInstance, $filter, $timeout,
										  TOTVSEvent, parameters, helper, helperAddress, accountFactory,
										  preferenceFactory, countryFactory, federationFactory, cityFactory, neighborhoodFactory, postalcodeFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountAddressEdit = this;

		this.accessRestriction = undefined;

		this.editMode = false;
		this.isPersist = true;

		this.model = undefined;
		this.address = undefined;
		this.account = undefined;

		this.countryDefault = undefined;

		this.isIntegratedWithEMS = undefined;
		this.isIntegratedWithLOGIX = undefined;

		this.postalcodes = undefined;
		this.countries = undefined;
		this.federations = undefined;
		this.cities  = undefined;
		this.neighborhoods = undefined;

		this.canOverrideTypeAddress = true;

		this.loadingZipCodes = false;

		this.types = helperAddress.types;

		this.typesToSelect = angular.copy(helperAddress.types);

		this.maxTypes = undefined;

		this.resultClose = [];

		this.log_campos_salvos = true;

		this.typesToRemove = undefined;
		this.postalCodeRequired = true;
		this.loadDataEdit = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function (isSaveNew) {

			if (this.isInvalidForm()) { return; }

			var vo = this.convertToSave(),
				postPersist,
				i,
				addressVO = [],
				count = 0;

			if (!vo) { return; }

			postPersist = function (result) {

				if (!result || result.num_id <= 0) { return; }

				for (i = 0; i < result.length; i++) {
					helperAddress.parseType(result[i]);
					CRMControlAccountAddressEdit.parsePostalCode(result[i]);

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-addresses', [], 'dts/crm'),
						detail: $rootScope.i18n(CRMControlAccountAddressEdit.editMode ? 'msg-update-related-generic' : 'msg-save-related-generic', [
							$rootScope.i18n('l-address', [], 'dts/crm'),
							helperAddress.parseAddressToString(result[i]),
							CRMControlAccountAddressEdit.account.nom_razao_social
						], 'dts/crm')
					});

					CRMControlAccountAddressEdit.resultClose.push(result[i]);

					if (isSaveNew) {
						CRMControlAccountAddressEdit.removeTypeToSelect(result[i].idi_tip_ender);
					}
				}

				if (!isSaveNew && CRMControlAccountAddressEdit.resultClose.length > 0) {
					$modalInstance.close(CRMControlAccountAddressEdit.resultClose);
				} else if (isSaveNew) {

					if (!CRMControlAccountAddressEdit.log_campos_salvos) {
						CRMControlAccountAddressEdit.model = undefined;
					} else {
						if (result.length > 0) {
							CRMControlAccountAddressEdit.model.ttTipo = [];
						}
					}
				}
			};

			if (this.account && this.isPersist) {

				if (this.editMode) {
					vo.idi_tip_ender = vo.idi_tip_ender[0];

					accountFactory.updateAddress(vo.num_id, this.account.num_id, vo, function (result) {
						postPersist([result]);
					});
				} else {
					for (i = 0;  i < vo.idi_tip_ender.length; i++) {
						addressVO.push(angular.copy(vo));
						addressVO[i].idi_tip_ender = vo.idi_tip_ender[i];
					}

					accountFactory.addAddress(this.account.num_id, addressVO, function (result) {
						postPersist(result);
					});
				}

			} else {

				// Quando não for especificada uma conta para relacionamento, deve devolver o endereço
				// sem realizar a persistência.
				vo.type_oper = 'CREATE';

				if (vo.idi_tip_ender) {
					this.model.idi_tip_ender = vo.idi_tip_ender;
				}

				if (vo.cod_cep) {
					this.model.cod_cep = vo.cod_cep;
				}

				if (vo.cod_zip_code) {
					this.model.cod_zip_code = vo.cod_zip_code;
				}

				if (this.model.ttBairro && this.model.ttBairro.num_id && this.model.ttBairro.num_id > 0) {
					this.model.num_id_bairro = this.model.ttBairro.num_id;
					this.model.nom_bairro    = this.model.ttBairro.nom_bairro;
				}

				if (this.model.ttCidade && this.model.ttCidade.num_id && this.model.ttCidade.num_id > 0) {
					this.model.num_id_cidad = this.model.ttCidade.num_id;
					this.model.nom_cidade   = this.model.ttCidade.nom_cidade;
				}

				if (this.model.ttEstado && this.model.ttEstado.num_id && this.model.ttEstado.num_id > 0) {
					this.model.num_id_uf = this.model.ttEstado.num_id;
					this.model.nom_complet_uf = this.model.ttEstado.nom_complet_uf;
					this.model.nom_unid_federac = this.model.ttEstado.nom_unid_federac;
				}

				if (this.model.ttPais && this.model.ttPais.num_id && this.model.ttPais.num_id > 0) {
					this.model.num_id_pais = this.model.ttPais.num_id;
					this.model.nom_pais    = this.model.ttPais.nom_pais;
				}

				if ((!this.model.nom_bairro) && (this.model.vo && this.model.vo.nom_bairro)) {
					this.model.nom_bairro = this.model.vo.nom_bairro;
				}

				if (this.model.num_id && this.model.num_id > 0) {
					vo.type_oper = 'UPDATE';
				}

				CRMControlAccountAddressEdit.parsePostalCode(this.model, function (adr) {
					CRMControlAccountAddressEdit.model.vo = vo;
					CRMControlAccountAddressEdit.resultClose.push(angular.copy(CRMControlAccountAddressEdit.model));

					if (!isSaveNew) {
						$modalInstance.close(CRMControlAccountAddressEdit.resultClose);

					} else {

						for (i = 0; i < CRMControlAccountAddressEdit.model.idi_tip_ender.length; i++) {
							CRMControlAccountAddressEdit.removeTypeToSelect(CRMControlAccountAddressEdit.model.idi_tip_ender[i]);
						}

						if (!CRMControlAccountAddressEdit.log_campos_salvos) {
							CRMControlAccountAddressEdit.model = undefined;
						} else {
							CRMControlAccountAddressEdit.model.ttTipo = [];
						}
					}
				});
			}
		};

		this.cancel = function () {
			$modalInstance.close(CRMControlAccountAddressEdit.resultClose);
		};

		this.validadeParameterModel = function () {

			var control = CRMControlAccountAddressEdit,
				vo = {
					num_id  : control.address.num_id,
					cod_cep : control.address.cod_cep,
					ttTipo  : []
				},
				i;

			if (this.postalCodeRequired) {
				control.editMode = (((vo.num_id > 0) || (vo.cod_cep && vo.cod_cep.length >= 1)) ? true : false);
			} else {
				if ((vo.num_id > 0) || (control.address && control.address.nom_pais && control.address.nom_pais.length > 0)) {
					control.editMode = true;
				} else {
					control.editMode = false;
				}
			}


			for (i = 0; i < control.typesToRemove.length; i++) {

				if (!control.address) {
					control.removeTypeToSelect(control.typesToRemove[i].idi_tip_ender);

				} else if (control.address.idi_tip_ender !== control.typesToRemove[i].idi_tip_ender) {
					control.removeTypeToSelect(control.typesToRemove[i].idi_tip_ender);

				}
			}

			if (control.editMode) {

				vo.idi_tip_ender = control.address.idi_tip_ender;
				vo.ttTipo.push(control.types[vo.idi_tip_ender - 1]);
				vo.log_integrad_erp = control.address.log_integrad_erp;

				vo.ttCep = {
					num_id  : control.address.num_id_cep,
					cod_cep : control.address.cod_cep,
					ttCidade: {
						nom_cidade: control.address.nom_cidade
					}
				};

				vo.cod_zip_code = control.address.cod_zip_code;

				vo.nom_compl_ender = control.address.nom_compl_ender;
				vo.nom_lograd_ender = control.address.nom_lograd_ender;
				vo.num_lograd_ender = control.address.num_lograd_ender.toString();

				vo.ttPais = {
					num_id	: control.address.num_id_pais,
					nom_pais: control.address.nom_pais
				};

				vo.ttEstado = {
					num_id			: control.address.num_id_uf,
					nom_complet_uf	: control.address.nom_complet_uf,
					nom_unid_federac: control.address.nom_unid_federac
				};

				vo.ttCidade = {
					num_id		: control.address.num_id_cidad,
					nom_cidade	: control.address.nom_cidade
				};

				vo.ttBairro = {
					num_id		: control.address.num_id_bairro,
					nom_bairro	: control.address.nom_bairro
				};

				control.canOverrideTypeAddress = vo.log_integrad_erp || true;

			} else {
				vo.ttPais = control.countryDefault;
			}

			control.model = vo;
		};

		this.removeTypeToSelect = function (type) {
			var i;

			if (type === 1 || type === 3 || type === 4) {
				for (i = 0; i < CRMControlAccountAddressEdit.typesToSelect.length; i++) {
					if (CRMControlAccountAddressEdit.typesToSelect[i].num_id === type) {
						CRMControlAccountAddressEdit.typesToSelect.splice(i, 1);
						break;
					}
				}
			}
		};

		this.loadDefaults = function (callback) {
			countryFactory.getDefaultCountry(function (result) {
				CRMControlAccountAddressEdit.countryDefault = result;
				if (callback) { callback(); }
				CRMControlAccountAddressEdit.getFederations();
			});
		};

		this.loadPreferences = function (callback) {

			var count = 0,
				total = 2;

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControlAccountAddressEdit.isIntegratedWithEMS = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.isIntegratedWithLOGIX(function (result) {
				CRMControlAccountAddressEdit.isIntegratedWithLOGIX = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.ttTipo || (this.model.ttTipo && this.model.ttTipo.length === 0)) {
				isInvalidForm = true;
				messages.push('l-type');
			}

			if (!this.model.ttCep && this.postalCodeRequired) {
				isInvalidForm = true;
				messages.push('l-zipcode');
			}

			if (!this.model.ttPais || !this.model.ttPais.num_id) {
				isInvalidForm = true;
				messages.push('l-country');
			}

			if (!this.model.ttEstado) {
				isInvalidForm = true;
				messages.push('l-uf');
			}

			if (!this.model.ttCidade) {
				isInvalidForm = true;
				messages.push('l-city');
			}

			if (!this.model.ttBairro) {
				isInvalidForm = true;
				messages.push('l-neighborhood');
			}

			if (!this.model.nom_lograd_ender || this.model.nom_lograd_ender.trim().length <= 0) {
				isInvalidForm = true;
				messages.push('l-street');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-address', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				i;

			vo = {
				num_id_pessoa	: (this.account ? this.account.num_id : undefined),
				nom_lograd_ender: this.model.nom_lograd_ender,
				nom_compl_ender : this.model.nom_compl_ender,
				num_lograd_ender: this.model.num_lograd_ender,
				idi_tip_ender   : []
			};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
			}

			if (this.model.ttTipo) {
				for (i = 0; i < this.model.ttTipo.length; i++) {
					vo.idi_tip_ender.push(this.model.ttTipo[i].num_id);
				}
			}

			if (this.model.ttCep && this.model.ttCep.hasOwnProperty('num_id')) {
				if (this.model.ttCep.num_id > 0) {
					vo.num_id_cep = this.model.ttCep.num_id;
					vo.cod_cep = this.model.ttCep.cod_cep;
				} else if (this.model.ttCep.hasOwnProperty('cod_cep')) {
					vo.cod_cep = this.model.ttCep.cod_cep;
				}
			} else {
				vo.cod_cep = this.model.ttCep;
			}

			if (this.model.ttPais && this.model.ttPais.num_id) {
				vo.num_id_pais = this.model.ttPais.num_id;
				vo.nom_pais = this.model.ttPais.nom_pais;
			}

			if (this.model.ttEstado) {
				vo.num_id_uf = this.model.ttEstado.num_id;
				vo.nom_complet_uf = this.model.ttEstado.nom_complet_uf;
				vo.nom_unid_federac = this.model.ttEstado.nom_unid_federac;
			}

			if (this.model.ttCidade) {
				vo.num_id_cidad = this.model.ttCidade.num_id;
				vo.nom_cidade = this.model.ttCidade.nom_cidade;
			}

			if (this.model.ttBairro && this.model.ttBairro.num_id) {
				vo.num_id_bairro = this.model.ttBairro.num_id;
				vo.nom_bairro = this.model.ttBairro.nom_bairro;
			} else if (this.model.ttBairro && this.model.ttBairro.nom_bairro) {
				vo.nom_bairro = this.model.ttBairro.nom_bairro;
				this.model.nom_bairro = this.model.ttBairro.nom_bairro;
			} else {
				vo.nom_bairro = this.model.ttBairro;
				this.model.nom_bairro = this.model.ttBairro;
			}

			vo.cod_zip_code = this.model.cod_zip_code;

			return vo;
		};

		this.parsePostalCode = function (address, callback) {

			if (address &&  address.cod_cep && address.cod_cep.length > 0) {
				address.cod_cep = address.cod_cep.replace(/\D/g, ""); //Remove tudo o que não é dígito
				address.cod_cep = address.cod_cep.replace(/^(\d{2})(\d)/g, "$1.$2"); //separa com .
				address.cod_cep = address.cod_cep.replace(/(\d{3})(\d)/g, "$1-$2"); // separa com -
				//v = v.replace(/(\d)(\d{3})$/,"$1-$2"); //separa a contar do ultimo digito
			}

			if (callback) { callback(address); }
		};

		this.getZipcodes = function (value) {

			this.loadingZipCodes = true;

			this.postalcodes = [];

			if (!value || value === '' || value.length != 8) {
				this.loadingZipCodes = false;
				return [];
			}

			return postalcodeFactory.validatePostalCode(value, function (result) {

				CRMControlAccountAddressEdit.postalcodes = result || [];

				if (CRMControlAccountAddressEdit.postalcodes.length === 0) {

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-addresses', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-postal-code', [
							value
						], 'dts/crm')
					});
				} else if (CRMControlAccountAddressEdit.postalcodes.length === 1) {
					CRMControlAccountAddressEdit.onSelectPostalCode(CRMControlAccountAddressEdit.postalcodes[0]);
				}

				CRMControlAccountAddressEdit.loadingZipCodes = false;
			});
		};

		this.getCountries = function (value) {

			if (!value || value === '') { return []; }

			var filter = [
				{ property: 'nom_pais', value: helper.parseStrictValue(value) }
			];

			countryFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAddressEdit.countries = result;
			});
		};

		this.getFederations = function () {

			if (!this.model.ttPais || !this.model.ttPais.num_id) { return []; }

			federationFactory.getAll(this.model.ttPais.num_id, function (result) {
				CRMControlAccountAddressEdit.federations = result;
			});
		};

		this.getCities = function (value) {

			if (!value || value === '' || !this.model.ttEstado || !this.model.ttEstado.num_id) { return []; }

			var filter = [
				{ property: 'num_id_uf',  value: this.model.ttEstado.num_id },
				{ property: 'nom_cidade', value: helper.parseStrictValue(value) }
			];

			cityFactory.typeahead(filter, undefined, function (result) {
				CRMControlAccountAddressEdit.cities = result;
			});
		};

		this.getNeighborhoods = function (value) {

			if (!value || value === '' || !this.model.ttCidade || !this.model.ttCidade.num_id) { return []; }

			var filter = [
				{ property: 'num_id_cidad', value: this.model.ttCidade.num_id },
				{ property: 'nom_bairro',   value: helper.parseStrictValue(value) }
			];

			return neighborhoodFactory.typeahead(filter, undefined, function (result) {

				var i;

				CRMControlAccountAddressEdit.neighborhoods = result;

				for (i = 0; i < result.length; i++) {
					if (CRMControlAccountAddressEdit.model.ttBairro.toUpperCase() === result[i].nom_bairro.toUpperCase()) {
						CRMControlAccountAddressEdit.model.ttBairro = result[i];
					}
				}
			});
		};

		this.onChangePostalCode = function () {

			if (this.postalCodeRequired && !this.loadDataEdit) {

				this.model.ttPais = undefined;
				this.model.ttEstado = undefined;
				this.model.ttCidade = undefined;
				this.model.ttBairro = undefined;

				this.model.nom_lograd_ender = '';
				this.model.num_lograd_ender = '';
				this.model.nom_compl_ender  = '';

				this.model.ttPais = this.countryDefault;
				this.onChangeCountry();
			}
		};

		this.onSelectPostalCode = function (selected) {

			if (this.postalCodeRequired && selected) {

				var idCountryOld = this.model.ttPais ? this.model.ttPais.num_id : undefined;

				if (idCountryOld && idCountryOld !== this.model.ttPais.num_id) {
					this.onChangeCountry();
				}

				if (selected.ttCidade) {
					this.model.ttPais = selected.ttCidade.ttEstado.ttPais;
					this.model.ttEstado = selected.ttCidade.ttEstado;
					this.model.ttCidade = selected.ttCidade;
				}
				this.model.ttBairro = selected.ttBairro;

				this.model.nom_lograd_ender = selected.nom_lograd_cep;

				this.model.ttCep = selected;
			}
		};

		this.onBlurPostalCode = function () {

			if (this.postalCodeRequired) {
				$timeout(function () {

					if (CRMUtil.isUndefined(CRMControlAccountAddressEdit) || CRMControlAccountAddressEdit.loadingZipCodes === true) {
						return;
					}

					var cep = CRMControlAccountAddressEdit.model.ttCep;

					if (!cep) {
						CRMControlAccountAddressEdit.onChangePostalCode();
						return;
					}

					if (angular.isString(cep) && cep.trim().length > 0) {
						if (CRMControlAccountAddressEdit.postalcodes && CRMControlAccountAddressEdit.postalcodes.length > 0) {
							CRMControlAccountAddressEdit.onSelectPostalCode(CRMControlAccountAddressEdit.postalcodes[0]);
						}
					} else if (angular.isObject(cep)) {
						CRMControlAccountAddressEdit.onSelectPostalCode(cep);
					}
				}, 1000);
			}
		};

		this.onChangeCountry = function () {

			this.federations = undefined;
			this.cities = undefined;
			this.model.ttEstado = undefined;
			this.model.ttCidade = undefined;
			this.model.ttBairro = undefined;

			this.getFederations();
		};

		this.onChangeFederation = function () {
			this.cities = undefined;
			this.model.ttCidade = undefined;
			this.model.ttBairro = undefined;
		};

		this.onChangeCity = function () {
			this.model.ttBairro = undefined;
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('account.address.edit', $rootScope.currentuser.login, function (result) {
				CRMControlAccountAddressEdit.accessRestriction = result || {};
			});
			this.loadDataEdit = true;
			this.loadDefaults(function (result) {
				CRMControlAccountAddressEdit.validadeParameterModel();
			});

			this.loadPreferences();

			$timeout(function() {
				CRMControlAccountAddressEdit.loadDataEdit = false;
			}, 1000);
			
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.address = parameters.address ? angular.copy(parameters.address) : {};
		this.account = parameters.account ? angular.copy(parameters.account) : undefined;
		this.isPersist = CRMUtil.isDefined(parameters.isPersist) ? parameters.isPersist : true;
		this.maxTypes = parameters.address ? 1 : this.types.length;
		this.typesToRemove = parameters.typesToRemove || [];

		if (CRMUtil.isDefined(parameters.account)) {
			this.postalCodeRequired = (parameters.account.idi_tip_pessoa === 1 || parameters.account.idi_tip_pessoa === 2);
		} else if (CRMUtil.isDefined(parameters.accountType)) {
			this.postalCodeRequired = (parameters.accountType === 1 || parameters.accountType === 2);
		}

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountAddressEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerAccountAddressEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', '$timeout', 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.account-address.helper', 'crm.crm_pessoa.conta.factory', 'crm.crm_param.factory',
		'crm.crm_pais.factory', 'crm.crm_unid_federac.factory', 'crm.crm_cidad.factory',
		'crm.crm_bairro.factory', 'crm.crm_cep.factory', 'crm.crm_acess_portal.factory'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.account-address.modal.edit', modalAccountAddressEdit);

	index.register.controller('crm.account-address.tab.control', controllerAccountAddressTab);
	index.register.controller('crm.account-address.edit.control', controllerAccountAddressEdit);

});
