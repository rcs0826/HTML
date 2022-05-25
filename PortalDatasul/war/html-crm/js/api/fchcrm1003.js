/*globals angular, index, define, TOTVSEvent, CRMURL, CRMEvent, CRMUtil*/
/*jslint plusplus: true */
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var accountHelper,
		helperAccountAddress,
		factoryAccount,
		factoryContact;

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	accountHelper = function (legend, $rootScope, TOTVSEvent) {

		this.filtersGroup = 'totvs.crm.portal.accounts.filters';
		this.selectedAccountConfig = 'totvs.crm.portal.conta.selected-account.config';
		this.accountBirthdayConfig = 'totvs.crm.portal.account.account-birthday.config';
		this.legendColors = ["crm-account-green", "crm-account-red", "crm-account-yellow"];
		this.legendStatus = ["l-active-status", "l-inactive-status", "l-not-integrated"];

		this.parseAccessLevel = function (account) {
			if (account && account.idi_niv_aces) {
				account.nom_niv_aces = legend.accountAccessLevel.NAME(account.idi_niv_aces);
				account.ttNivelAcesso = {
					num_id : account.idi_niv_aces,
					nom_niv_aces : account.nom_niv_aces
				};
			}
		};

		this.parseAccountType = function (account) {
			if (account && account.idi_tip_cta) {
				account.nom_tip_cta = legend.accountType.NAME(account.idi_tip_cta);
				account.ttTipoConta = {
					num_id   : account.idi_tip_cta,
					nom_tipo : account.nom_tip_cta
				};
			}
		};

		this.parsePreviousAccountType = function (account) {
			if (account && account.idi_tip_cta_ant) {
				account.nom_tip_cta_ant = legend.accountType.NAME(account.idi_tip_cta_ant);
				account.ttTipoContaAnterior = {
					num_id   : account.idi_tip_cta_ant,
					nom_tipo : account.nom_tip_cta_ant
				};
			}
		};

		this.parsePersonType = function (account) {
			if (account && account.idi_tip_pessoa) {
				account.nom_tip_pessoa = legend.personalType.NAME(account.idi_tip_pessoa);
				account.ttTipoPessoa = {
					num_id   : account.idi_tip_pessoa,
					nom_tipo : account.nom_tip_pessoa
				};
			}
		};

		this.parseSex = function (account) {
			if (account && account.idi_sexo > 0) {
				account.nom_sex = legend.sex.NAME(account.idi_sexo);
				account.ttSexo = {
					num_id  : account.idi_sexo,
					nom_sex : account.nom_sex
				};
			}
		};

		this.parsePhoneIcon = function (phone) {

			if (!phone) { return; }

			if (phone.num_tip_telef === 12 || phone.num_tip_telef === 13 || (phone.num_tip_telef >= 16 && phone.num_tip_telef <= 21)) {

				phone.nom_icone = 'glyphicon-phone-alt';

			} else if (phone.num_tip_telef === 7) {
				phone.nom_icone = 'glyphicon-phone';
			} else {
				phone.nom_icone = 'glyphicon-earphone';
			}
		};

		this.configurePhoneList = function (phones) {

			var i,
				crm = [],
				phone,
				cellphone = [],
				integrated = [];

			for (i = 0; i < phones.length; i++) {

				phone = phones[i];

				this.parsePhoneIcon(phone);

				if (phone.num_tip_telef === 12
						|| phone.num_tip_telef === 13
						|| (phone.num_tip_telef >= 16 && phone.num_tip_telef <= 21)) {

					integrated.push(phone);

				} else if (phone.num_tip_telef === 7) {
					cellphone.push(phone);
				} else {
					crm.push(phone);
				}
			}

			return integrated.concat(cellphone).concat(crm);
		};

		this.parseAccountColor = function (account) {
			account.nom_cor = this.legendColors[2]; // default n integrado

			if (account && account.idi_status) {
				account.nom_cor = this.legendColors[account.idi_status - 1];
			}
		};

		this.parseStatus = function (account, integratedWith) {
			if (!account) { return; }

			integratedWith = integratedWith ? '(' + integratedWith + ')' : integratedWith;

			account.nom_status = $rootScope.i18n(this.legendStatus[2], [integratedWith], 'dts/crm'); // defaul

			if (account.idi_status) {
				account.nom_status = $rootScope.i18n(this.legendStatus[account.idi_status  - 1], [integratedWith], 'dts/crm');
			}

		};

		this.parseParameters = function (parameters, callback) {
			var i, properties = [], values = [];

			if (parameters) {
				if (parameters instanceof Array) {
					for (i = 0; i < parameters.length; i++) {
						properties.push(parameters[i].property);
						values.push(parameters[i].value);
					}
				} else if (parameters.property) {
					properties.push(parameters.property);
					values.push(parameters.value);
				}
			}

			if (callback) { callback(properties, values); }
		};
        
        this.isPhoneFilterInvalid = function (filters) {
            var i,
                phoneFilter,
                replaceAll = function replaceAll(str, de, para) {
					var pos = str.indexOf(de);
					while (pos > -1) {
						str = str.replace(de, para);
						pos = str.indexOf(de);
					}
					return (str);
				};
            
            for (i = 0; i < filters.length; i++) {
                if (filters[i].property === "custom.nom_telef") {
                    phoneFilter = angular.copy(filters[i].value);
                    phoneFilter = replaceAll(phoneFilter, "*", "");
                    
                    if (phoneFilter.length < 5) {
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type:   'error',
                            title:  $rootScope.i18n('l-account', [], 'dts/crm'),
                            detail: $rootScope.i18n('l-phone-message', [5], 'dts/crm')
                        });
                        
                        return true;
                    }
                }
            }

            
            return false;
        };


	};
	accountHelper.$inject = ['crm.legend', '$rootScope', 'TOTVSEvent'];

	helperAccountAddress = function (legend) {

		this.types = [
			{ num_id: 1, nom_tipo: legend.addressType.NAME(1) },
			{ num_id: 2, nom_tipo: legend.addressType.NAME(2) },
			{ num_id: 3, nom_tipo: legend.addressType.NAME(3) },
			{ num_id: 4, nom_tipo: legend.addressType.NAME(4) },
			{ num_id: 5, nom_tipo: legend.addressType.NAME(5) }
		];

		this.parseType = function (address) {
			address.ttTipo = this.types[address.idi_tip_ender - 1];
		};

		this.parseAddressToString = function (address) {
			return '(' + address.ttTipo.nom_tipo + ') ' + address.nom_lograd_ender + ', ' +
					address.nom_bairro + ' - ' + address.nom_cidade + ', ' +
					address.nom_unid_federac + ', ' + address.cod_cep + ' - ' + address.nom_pais;
		};

	};
	helperAccountAddress.$inject = ['crm.legend'];

	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryAccount = function ($totvsresource, factoryGeneric, factoryGenericZoom,
							   factoryGenericTypeahead, factoryGenericDetail,
							   factoryGenericCreateUpdate, factoryPreference, ReportService, accountHelper) {

		var factory,
			actions = angular.copy(factoryGenericCreateUpdate.customActions);

		actions.DTSGetNoCountRequest = {
			method: 'GET',
			isArray: true,
			headers: { noCountRequest: true }
		};

		factory = $totvsresource.REST(CRMURL.accountService + ':method/:account/:id', undefined,  actions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericDetail);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy =  ['nom_razao_social']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc = [true]; }

			if (options.type !== 1) {
				if (!options.entity) {
					options.entity = 0; // 0. ALL 1. CONTA 2. CONTATO 3. CLIENTE/CONTATO
				}
			} else {
				if (!options.entity) {
					options.entity = 1; // 0. ALL 1. CONTA 2. CONTATO 3. CLIENTE/CONTATO
				}
			}

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};


		factory.getContacts = function (idAccount, callback) {
			return this.TOTVSQuery({method: 'contact', account: idAccount}, callback);
		};

		factory.deleteContact = function (idAccount, idContact, callback) {
			return this.TOTVSRemove({method: 'contact', account: idAccount, contact: idContact}, callback);
		};

		factory.getSummary = function (idAccount, callback) {

			var options = {
					type   : 4, // 1. TYPEAHEAD|ZOOM 2. LIST 3. DETAIL 4. SUMMARY
					entity : 1, // 0. ALL 1. CONTA 2. CONTATO
					count  : false,
					end    : 1
				},
				parameters = {
					property: 'num_id',
					value:	  idAccount
				};

			return factory.findRecords(parameters, options, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			}, this);
		};

		factory.checkDuplicated = function (type, value, registry, callback) {
			return this.TOTVSGet({method: 'check_duplicated', type: type, value: value, registry: registry}, function (result) {
				if (callback) {
					var value = false;
					if (result && result.log_duplicado) {
						value = (result.log_duplicado === true);
					}
					callback(value);
				}
			});
		};

		factory.getAccountByERPCode = function (code, callback) {
			return factory.typeahead({
				property: 'cod_pessoa_erp',
				value: code
			}, { end: 1 }, function (result) {

				if (angular.isArray(result) && result.length > 0) {
					result = result[0];
				} else {
					result = undefined;
				}

				if (callback) { callback(result); }
			}, this);
		};

		// Preferencias
		factory.getDefaultCountry = function (callback) {
			return this.getPreferenceAsInteger('PAIS_DEFAULT', callback);
		};

		factory.isResponsibleEnabled = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_RESPONSA', callback);
		};

		factory.isToValidateEMSOnConversion = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_ACC_ERP_REQ', callback);
		};

		// 12.1.14 - omitir contato na pesquisa
		factory.isHideContact = function (callback) {
			return factoryPreference.getPreferenceAsBoolean('LOG_HIDE_CONTATO', callback);
		};

		factory.getDocumentIdentificationType = function (callback) {
			return factoryPreference.getPreferenceAsInteger('NUM_TIP_DOCTO_CARTEIRINHA', callback);
		};

		// Textos da Conta
		factory.getObservations = function (idAccount, callback) {
			return this.TOTVSQuery({method: 'observation', account: idAccount}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addObservation = function (idAccount, model, callback) {
			return this.DTSPost({method: 'observation', account: idAccount}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteObservation = function (idObservation, callback) {
			return this.TOTVSRemove({method: 'observation', id: idObservation}, callback);
		};

		// Estilos da Conta
		factory.getStyles = function (idAccount, callback) {
			return this.TOTVSQuery({method: 'style', account: idAccount}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addStyles = function (idAccount, models, callback) {
			return this.DTSPost({method: 'style', account: idAccount}, models, callback);
		};

		factory.addStyle = function (idAccount, model, callback) {
			return this.DTSPost({method: 'style', account: idAccount}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deleteStyle = function (idStyle, callback) {
			return this.TOTVSRemove({method: 'style', id: idStyle}, callback);
		};

		// Potencialidades da Conta
		factory.getPotentials = function (idAccount, callback) {
			return this.TOTVSQuery({method: 'potential', account: idAccount}, function (result) {
				if (result) { result.reverse(); }
				if (callback) { callback(result); }
			});
		};

		factory.addPotential = function (idAccount, model, callback) {
			return this.DTSPost({method: 'potential', account: idAccount}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deletePotential = function (idStyle, callback) {
			return this.TOTVSRemove({method: 'potential', id: idStyle}, callback);
		};

		// Telefones da Conta
		factory.getPhones = function (idAccount, callback) {
			return this.TOTVSQuery({method: 'phone', account: idAccount}, callback);
		};
		
		factory.getAccountDetailPreferences = function(callback) {
			return this.TOTVSQuery({method: 'account_detail_preferences'}, callback);
		};

		factory.addPhone = function (idAccount, model, callback) {
			return this.DTSPost({method: 'phone', account: idAccount}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updatePhone = function (id, idAccount, model, callback) {
			return this.DTSPut({method: 'phone', id: id, account: idAccount}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.deletePhone = function (idPhone, callback) {
			return this.TOTVSRemove({method: 'phone', id: idPhone}, callback);
		};

		// Enderecos da Conta
		factory.getAddress = function (idAccount, callback) {
			return this.TOTVSQuery({method: 'address', account: idAccount}, callback);
		};

		factory.updateAddress = function (id, idAccount, model, callback) {
			return this.DTSPut({method: 'address', id: id, account: idAccount}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.addAddress = function (idAccount, models, callback) {
			return this.DTSPost({method: 'address', account: idAccount}, models, function (result) {
				if (callback) { callback(result); }
			});
		};

		factory.deleteAddress = function (idAddress, callback) {
			return this.TOTVSRemove({method: 'address', id: idAddress}, callback);
		};

		factory.getEdit = function (id, type, callback) {
			return this.TOTVSQuery({method: 'edit', id: id, type: type}, callback);

		};

		factory.validateConvert = function (callback) {
			return this.TOTVSGet({method: 'validate_convert'}, function (result) {
				if (callback) {
					var value = false;
					if (result && result.isOk) {
						value = (result.isOk === true);
					}
					callback(value);
				}
			});
		};

		factory.printContactRelationship = function (id, callback) {
			return ReportService.run('crm/rel_vinculo', {
				program: '/report/crm/crm0000',
				resultFileName: 'crm_vinculo_' + id,
				num_id_contat: id
			}, {}, callback);
		};

		factory.exportSearch = function (filters, entity, isOnline, callback) {

			var i,
				name,
				now = new Date(),
				properties = [],
				values = [],
				publish = (isOnline !== true);

			name = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
			name = name + '_' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
			name = name + '_CRM_CONTAS';

			if (angular.isUndefined(filters)) {
				filters = [];
			} else if (!angular.isArray(filters)) {
				filters = [ filters ];
			}

			for (i = 0; i < filters.length; i++) {
				properties.push(filters[i].property);
				values.push(filters[i].value);
			}

			return ReportService.run('crm/rel_account_export', {
				program: '/report/crm/crm0004',
				format: 'XLSX',
				download: isOnline,
				publish: publish,
				resultFileName: name,
				c_properties: properties,
				c_values: values,
				i_entity: entity
			}, {}, callback);
		};

		factory.setDefaultContact = function (id, contactId, callback) {
			return this.TOTVSUpdate({method: 'set_default_contact', id: id, contactid: contactId}, {}, callback);
		};

		factory.getCountAccounts = function (parameters, callback) {

			var i, properties = [], values = [];

			if (parameters) {
				if (parameters instanceof Array) {
					for (i = 0; i < parameters.length; i++) {
						properties.push(parameters[i].property);
						values.push(parameters[i].value);
					}
				} else if (parameters.property) {
					properties.push(parameters.property);
					values.push(parameters.value);
				}
			}

			parameters = { method: 'count', properties: properties, values: values };

			return this.TOTVSGet(parameters, function (result) {
				if (callback) { callback(result); }
			});
		};

		// widget account
		factory.getAccountPortfolio = function (options, callback) {
			var parameters = {
				method: 'accountportfolio',
				config: accountHelper.selectedAccountConfig,
				quicksearchtext: options.quickSearchText,
				start: options.start,
				pagesize: options.pageSize
			};

			return this.DTSGetNoCountRequest(parameters, function (result) {
				if (callback) { callback(result); }
			});
		};

		return factory;
	};

	factoryAccount.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.detail.factory',
		'crm.generic.create.update.factory', 'crm.crm_param.factory', 'ReportService', 'crm.account.helper'
	];

	factoryContact = function ($totvsresource, factoryGeneric, factoryGenericZoom,
							 factoryGenericTypeahead) {

		var factory = $totvsresource.REST(CRMURL.accountService + ':method/:id');

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);

		factory.findRecords = function (parameters, options, callback) {

			options = options || {};

			if (!options.orderBy) { options.orderBy	= ['nom_razao_social']; }
			if (CRMUtil.isUndefined(options.asc)) { options.asc =  [true]; }
			if (CRMUtil.isUndefined(options.entity)) {
				// 0. ALL 1. CONTA 2. CONTATO 3.CONTA&CONTATO
				options.entity =  2;
			}

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.getSummary = function (idContact, callback) {

			var options = {
					type   : 4, // 1. TYPEAHEAD|ZOOM 2. LIST 3. DETAIL 4. SUMMARY
					entity : 2, // 0. ALL 1. CONTA 2. CONTATO
					count  : false,
					end    : 1
				},
				parameters = {
					property: 'num_id',
					value:	  idContact
				};

			return factory.findRecords(parameters, options, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			}, this);
		};

		factory.getBond = function (idAccount, idContact, callback) {
			return this.TOTVSQuery({method: 'bond', account: idAccount, contact: idContact},
								   function (result) {
					if (callback) {
						callback((result && result.length > 0 ? result[0] : undefined));
					}
				});
		};

		return factory;
	}; // factoryContact

	factoryContact.$inject = [
		'$totvsresource', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.account.helper', accountHelper);
	index.register.service('crm.account-address.helper', helperAccountAddress);

	index.register.factory('crm.crm_pessoa.conta.factory', factoryAccount);
	index.register.factory('crm.crm_pessoa.contato.factory', factoryContact);

});
