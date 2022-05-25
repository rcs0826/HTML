/*globals index, define, angular, CRMURL, CRMUtil, CRMRestService*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js'
], function (index) {

	'use strict';

	// *************************************************************************************
	// *** HELPER
	// *************************************************************************************

	var helperAttribute,
		factoryAttribute;

	helperAttribute = function (helper, legend, $rootScope, $filter) {

		var CRMAttributeHelper = this;

		/* idi_process */
		this.process = [
			{num_id: 1, nom_process: $rootScope.i18n('l-account', [], 'dts/crm')},
			//{num_id: 2, nom_process: $rootScope.i18n('l-history', [], 'dts/crm')},
			{num_id: 3, nom_process: $rootScope.i18n('l-ticket', [], 'dts/crm')},
			{num_id: 4, nom_process: $rootScope.i18n('l-opportunity', [], 'dts/crm')}
			//{num_id: 5, nom_process: $rootScope.i18n('l-task', [], 'dts/crm')}
		];

		/* idi_sit */
		this.situation = [
			{num_id: 1, nom_situation: $rootScope.i18n('l-developing', [], 'dts/crm')},
			{num_id: 2, nom_situation: $rootScope.i18n('l-released', [], 'dts/crm')},
			{num_id: 3, nom_situation: $rootScope.i18n('l-suspended', [], 'dts/crm')}
		];

		/* idi_tip_atrib */
		this.attributeTypes = [
			{num_id: 1, nom_type: $rootScope.i18n('l-text', [], 'dts/crm'), is_multi_value: false, edit_size: 1, detail_size: 1},
			{num_id: 2, nom_type: $rootScope.i18n('l-multi-select', [], 'dts/crm'), is_multi_value: true, edit_size: 1, detail_size: 1},
			{num_id: 3, nom_type: $rootScope.i18n('l-select', [], 'dts/crm'), is_multi_value: true, edit_size: 1, detail_size: 1},
			{num_id: 4, nom_type: $rootScope.i18n('l-radio', [], 'dts/crm'), is_multi_value: true, edit_size: 1, detail_size: 1},
			{num_id: 5, nom_type: $rootScope.i18n('l-checkbox', [], 'dts/crm'), is_multi_value: true, edit_size: 1, detail_size: 1},
			{num_id: 6, nom_type: $rootScope.i18n('l-date', [], 'dts/crm'), is_multi_value: false, edit_size: 1, detail_size: 1},
			{num_id: 7, nom_type: $rootScope.i18n('l-time', [], 'dts/crm'), is_multi_value: false, edit_size: 1, detail_size: 1},
			{num_id: 8, nom_type: $rootScope.i18n('l-integer', [], 'dts/crm'), is_multi_value: false, edit_size: 1, detail_size: 1},
			{num_id: 9, nom_type: $rootScope.i18n('l-decimal', [], 'dts/crm'), is_multi_value: false, edit_size: 1, detail_size: 1} /*,
			{num_id: 10, nom_type: $rootScope.i18n('l-zoom', [], 'dts/crm'), is_multi_value: false},
			{num_id: 11, nom_type: $rootScope.i18n('l-others', [], 'dts/crm'), is_multi_value: false} */
		];

		/* idi_tip_pessoa */
		this.personTypes = [
			{num_id: 1, name: $rootScope.i18n('l-type-person-1', [], 'dts/crm')},
			{num_id: 2, name: $rootScope.i18n('l-type-person-2', [], 'dts/crm')},
			{num_id: 3, name: $rootScope.i18n('l-foreign', [], 'dts/crm')},
			{num_id: 4, name: $rootScope.i18n('l-trading', [], 'dts/crm')}
		];

		/* idi_tip_cta */
		this.accountTypes = [
			{num_id: 1, name: $rootScope.i18n('l-lead', [], 'dts/crm')},
			{num_id: 2, name: $rootScope.i18n('l-client', [], 'dts/crm')},
			{num_id: 3, name: $rootScope.i18n('l-contact', [], 'dts/crm')},
			{num_id: 4, name: $rootScope.i18n('l-provider', [], 'dts/crm')},
			{num_id: 5, name: $rootScope.i18n('l-client-provider', [], 'dts/crm')},
			{num_id: 6, name: $rootScope.i18n('l-client-contact', [], 'dts/crm')},
			{num_id: 7, name: $rootScope.i18n('l-provider-contact', [], 'dts/crm')},
			{num_id: 8, name: $rootScope.i18n('l-client-provider-contact', [], 'dts/crm')}
		];

		this.parsePersonType = function (attribute) {
			if (!attribute || !attribute.idi_tip_pessoa || attribute.idi_tip_pessoa < 1) { return; }

			switch (attribute.idi_tip_pessoa) {
			case 1: /* texto */
				attribute.nom_tip_pessoa = $rootScope.i18n('l-type-person-1', [], 'dts/crm');
				break;
			case 2:
				attribute.nom_tip_pessoa = $rootScope.i18n('l-type-person-2', [], 'dts/crm');
				break;
			case 3:
				attribute.nom_tip_pessoa = $rootScope.i18n('l-foreign', [], 'dts/crm');
				break;
			case 4:
				attribute.nom_tip_pessoa = $rootScope.i18n('l-trading', [], 'dts/crm');
				break;
			default:
				attribute.nom_tip_pessoa = $rootScope.i18n('l-others', [], 'dts/crm');
			}
		};

		this.parseAccountType = function (attribute) {
			if (!attribute || !attribute.idi_tip_cta || attribute.idi_tip_cta < 1) { return; }

			switch (attribute.idi_tip_cta) {
			case 1: /* texto */
				attribute.nom_tip_cta = $rootScope.i18n('l-lead', [], 'dts/crm');
				break;
			case 2:
				attribute.nom_tip_cta = $rootScope.i18n('l-client', [], 'dts/crm');
				break;
			case 3:
				attribute.nom_tip_cta = $rootScope.i18n('l-contact', [], 'dts/crm');
				break;
			case 4:
				attribute.nom_tip_cta = $rootScope.i18n('l-provider', [], 'dts/crm');
				break;
			case 5:
				attribute.nom_tip_cta = $rootScope.i18n('l-client-provider', [], 'dts/crm');
				break;
			case 6:
				attribute.nom_tip_cta = $rootScope.i18n('l-client-contact', [], 'dts/crm');
				break;
			case 7:
				attribute.nom_tip_cta = $rootScope.i18n('l-provider-contact', [], 'dts/crm');
				break;
			case 8:
				attribute.nom_tip_cta = $rootScope.i18n('l-client-provider-contact', [], 'dts/crm');
				break;
			default:
				attribute.nom_tip_cta = $rootScope.i18n('l-others', [], 'dts/crm');
			}
		};

		this.parseProcess = function (attribute) {
			if (!attribute || !attribute.idi_process) { return; }

			switch (attribute.idi_process) {
			case 1: /* texto */
				attribute.nom_process = $rootScope.i18n('l-account', [], 'dts/crm');
				break;
			case 2:
				attribute.nom_process = $rootScope.i18n('l-history', [], 'dts/crm');
				break;
			case 3:
				attribute.nom_process = $rootScope.i18n('l-ticket', [], 'dts/crm');
				break;
			case 4:
				attribute.nom_process = $rootScope.i18n('l-opportunity', [], 'dts/crm');
				break;
			case 5:
				attribute.nom_process = $rootScope.i18n('l-task', [], 'dts/crm');
				break;
			default:
				attribute.nom_process = $rootScope.i18n('l-others', [], 'dts/crm');
			}
		};

		this.parseType = function (attribute) {
			if (!attribute || !attribute.idi_tip_atrib) { return; }

			switch (attribute.idi_tip_atrib) {
			case 1: /* texto */
				attribute.nom_tip_atrib = $rootScope.i18n('l-text', [], 'dts/crm');
				break;
			case 2:
				attribute.nom_tip_atrib = $rootScope.i18n('l-multi-select', [], 'dts/crm');
				break;
			case 3:
				attribute.nom_tip_atrib = $rootScope.i18n('l-select', [], 'dts/crm');
				break;
			case 4:
				attribute.nom_tip_atrib = $rootScope.i18n('l-radio', [], 'dts/crm');
				break;
			case 5:
				attribute.nom_tip_atrib = $rootScope.i18n('l-checkbox', [], 'dts/crm');
				break;
			case 6:
				attribute.nom_tip_atrib = $rootScope.i18n('l-date', [], 'dts/crm');
				break;
			case 7:
				attribute.nom_tip_atrib = $rootScope.i18n('l-time', [], 'dts/crm');
				break;
			case 8:
				attribute.nom_tip_atrib = $rootScope.i18n('l-integer', [], 'dts/crm');
				break;
			case 9:
				attribute.nom_tip_atrib = $rootScope.i18n('l-decimal', [], 'dts/crm');
				break;
			case 10:
				attribute.nom_tip_atrib = $rootScope.i18n('l-zomm', [], 'dts/crm');
				break;
			default:
				attribute.nom_tip_atrib = $rootScope.i18n('l-others', [], 'dts/crm');
			}
		};

		this.parseSituation = function (attribute) {
			attribute.idi_sit = attribute.idi_sit || 1;
			attribute.nom_situation = $rootScope.i18n('l-developing', [], 'dts/crm');

			if (attribute.idi_sit === 2) {
				attribute.nom_situation = $rootScope.i18n('l-released', [], 'dts/crm');
			} else if (attribute.idi_sit === 3) {
				attribute.nom_situation = $rootScope.i18n('l-suspended', [], 'dts/crm');
			}
		};

		this.parseAttributeColor = function (attribute) {
			attribute.nom_cor = 'crm-attribute-yellow';

			if (attribute.idi_sit === 2) {
				attribute.nom_cor = 'crm-attribute-green';
			} else if (attribute.idi_sit === 3) {
				attribute.nom_cor = 'crm-attribute-dark';
			}
		};

		this.parseAttributeText = function (attribute, editMode, dsl_atrib) {
			attribute.log_obrig = dsl_atrib.log_obrig || false;
			attribute.num_max_length = dsl_atrib.num_max_length || "1000";
			attribute.nom_mask = dsl_atrib.nom_mask || "";

			if (!editMode) {
				attribute.dsl_atrib = dsl_atrib.dsl_default || "";
			}
		};

		this.parseAttributeMultiValue = function (attribute, editMode, dsl_atrib) {
			var i,
				listData;

			if (attribute.dsl_atrib && attribute.dsl_atrib.length > 0) {
				listData = attribute.dsl_atrib.split("|");
			} else {
				listData = [];
			}

			attribute.log_obrig = dsl_atrib.log_obrig || false;
			attribute.data = [];
			attribute.items = [];

			for (i = 0; i < dsl_atrib.itens.length; i++) {
				attribute.data.push({"id": dsl_atrib.itens[i].name, "name": dsl_atrib.itens[i].name});
			}

			for (i = 0; i < listData.length; i++) {
				attribute.items.push({"id": listData[i], "name": listData[i]});
			}

			if (!editMode) {
				for (i = 0; i < dsl_atrib.itens.length; i++) {
					if (dsl_atrib.itens[i].log_default) {
						attribute.items.push({"id": dsl_atrib.itens[i].name, "name": dsl_atrib.itens[i].name});
					}
				}
			}
		};

		this.parseAttributeDate = function (attribute, editMode, dsl_atrib) {
			attribute.log_obrig = dsl_atrib.log_obrig || false;
			attribute.dsl_atrib = parseInt(attribute.dsl_atrib, "");

			if (!editMode) {
				if (CRMUtil.isDefined(dsl_atrib.dt_default)) {
					attribute.val_atrib = dsl_atrib.dt_default;
				} else if (CRMUtil.isDefined(dsl_atrib.ttDefaultOption)) {
					if (dsl_atrib.ttDefaultOption.num_id === 2) {
						attribute.val_atrib = new Date().getTime();
					} else {
						attribute.val_atrib = dsl_atrib.dt_default;
					}
				}
			} else {
				if (attribute.val_atrib === 0) {
					attribute.val_atrib = undefined;
				}
			}
		};

		this.parseAttributeHour = function (attribute, editMode, dsl_atrib) {
			var date = new Date();

			attribute.log_obrig = dsl_atrib.log_obrig || false;

			if (!editMode) {
				if (CRMUtil.isDefined(dsl_atrib.hr_default)) {
					attribute.hra_atrib = dsl_atrib.hr_default;
				} else if (CRMUtil.isDefined(dsl_atrib.ttDefaultOption)) {
					attribute.hra_atrib = date.getHours() + ":" + date.getMinutes();
				}
			}
		};

		this.parseAttributeInteger = function (attribute, editMode, dsl_atrib) {
			attribute.log_obrig = dsl_atrib.log_obrig || false;
			attribute.num_max_length = dsl_atrib.num_max_length || 9;

			if (!editMode) {
				if (CRMUtil.isDefined(dsl_atrib.val_default)) {
					attribute.num_atrib = dsl_atrib.val_default;
				}
			}
		};

		this.parseAttributeDecimal = function (attribute, editMode, dsl_atrib) {
			attribute.log_obrig = dsl_atrib.log_obrig || false;
			attribute.num_max_length = dsl_atrib.num_max_length || 13;

			if (CRMUtil.isDefined(dsl_atrib.ttDecimalPrecision)) {
				attribute.m_dec = dsl_atrib.ttDecimalPrecision.value || 2;
			}

			if (!editMode) {
				if (CRMUtil.isDefined(dsl_atrib.ttDefaultOption)) {
					attribute.dsl_atrib = dsl_atrib.val_default;
				}
			}
		};

		this.parseAttributeCheckBox = function (attribute, editMode, dsl_atrib) {
			var listData,
				i,
				j;

			if (attribute.dsl_atrib && attribute.dsl_atrib.length > 0) {
				listData = attribute.dsl_atrib.split("|");
			} else {
				listData = [];
			}

			attribute.dsl_atrib = dsl_atrib;
			attribute.log_obrig = dsl_atrib.log_obrig || false;

			for (i = 0; i < dsl_atrib.itens.length; i++) {

				for (j = 0; j < listData.length; j++) {
					if (dsl_atrib.itens[i].name === listData[j]) {
						dsl_atrib.itens[i].selected = true;
					}
				}

				if (!editMode) {
					if (dsl_atrib.itens[i].log_default) {
						dsl_atrib.itens[i].selected = true;
					}
				}
			}
		};

		this.parseAttributeRadioAndCombo = function (attribute, editMode, dsl_atrib) {
			var i;
			attribute.log_obrig = dsl_atrib.log_obrig || false;
			attribute.options = [];

			for (i = 0; i < dsl_atrib.itens.length; i++) {
				attribute.options.push({"value": dsl_atrib.itens[i].name, "label": dsl_atrib.itens[i].name});

				if (!editMode && dsl_atrib.itens[i].log_default === true) {
					attribute.dsl_atrib = dsl_atrib.itens[i].name;
				}
			}
		};

		this.parseAttribute = function (attribute, editMode, isAdvanced) {
			var dsl_atrib = JSON.parse(attribute.dsl_atrib_json);

			if (isAdvanced === true) {
				dsl_atrib.log_obrig = false;

				if (dsl_atrib.ttDefaultOption) {
					delete dsl_atrib.ttDefaultOption;
				}

				delete dsl_atrib.val_default;
				delete attribute.val_atrib;
				delete attribute.num_atrib;
				delete attribute.dsl_atrib;
			}

			if (CRMUtil.isDefined(dsl_atrib)) {

				switch (attribute.idi_tip_atrib) {
				case 1:
					this.parseAttributeText(attribute, editMode, dsl_atrib);
					break;
				case 2:
					this.parseAttributeMultiValue(attribute, editMode, dsl_atrib);
					break;
				case 3:
					this.parseAttributeRadioAndCombo(attribute, editMode, dsl_atrib);
					break;
				case 4:
					this.parseAttributeRadioAndCombo(attribute, editMode, dsl_atrib);
					break;
				case 5:
					this.parseAttributeCheckBox(attribute, editMode, dsl_atrib);
					break;
				case 6:
					this.parseAttributeDate(attribute, editMode, dsl_atrib);
					break;
				case 7:
					this.parseAttributeHour(attribute, editMode, dsl_atrib);
					break;
				case 8:
					this.parseAttributeInteger(attribute, editMode, dsl_atrib);
					break;
				case 9:
					this.parseAttributeDecimal(attribute, editMode, dsl_atrib);
					break;

				}
			}
		};

		this.parseAttributeValue = function (attribute) {

			var attr, dateIni, dateEnd;

			attr = {
				value: undefined,
				title: undefined
			};

			switch (attribute.idi_tip_atrib) {
			case 1:
				attr.value = helper.parseStrictValue(attribute.dsl_atrib);
				attr.title = attribute.nom_atrib + ": " + attribute.dsl_atrib;
				break;
			case 2:
				attr.value = undefined;
				attr.title = attribute.nom_atrib + ": ";

				if (attribute.items && attribute.items.length > 0) {
					attr.value = attribute.items.map(function (elem) {
						return elem.name;
					}).map(function (value, count) {
						if (count === 0) {
							attr.title += value;
						} else {
							attr.title += " " + $rootScope.i18n('l-or', [], 'dts/crm') + " " + value;
						}
						return value;
					}).join(";");
				}

				break;
			case 3:
				attr.value = attribute.dsl_atrib;
				attr.title = attribute.nom_atrib + ": " + attribute.dsl_atrib;
				break;
			case 4:
				attr.value = attribute.dsl_atrib;
				attr.title = attribute.nom_atrib + ": " + attribute.dsl_atrib;
				break;
			case 5:
				attr.value = undefined;
				attr.title = attribute.nom_atrib + ": ";
				if (angular.isObject(attribute.dsl_atrib)) {
					if (attribute.dsl_atrib.itens && attribute.dsl_atrib.itens.length > 0) {
						attr.value = attribute.dsl_atrib.itens.filter(function (elem) {
							return elem.selected ? true : false;
						}).map(function (value, count) {
							if (count === 0) {
								attr.title += value.name;
							} else {
								attr.title += " " + $rootScope.i18n('l-or', [], 'dts/crm') + " " + value.name;
							}
							return value.name;
						}).join(";");
					}
				}
				break;
			case 6:
				try {
					if (attribute.val_atrib === null) {
						attribute.val_atrib = undefined;
					}

					dateIni = new Date(attribute.val_atrib);
					dateEnd = new Date(attribute.val_atrib);

					dateIni.setMilliseconds(0);
					dateIni.setSeconds(0);
					dateIni.setMinutes(0);
					dateIni.setHours(0);

					dateEnd.setMilliseconds(999);
					dateEnd.setSeconds(59);
					dateEnd.setMinutes(59);
					dateEnd.setHours(23);

					if (!(dateEnd instanceof Date && isFinite(dateEnd)) || !(dateIni instanceof Date && isFinite(dateIni))) {
						attr.value = undefined;
					} else {
						attr.value = dateIni.getTime().toString() + ";" + dateEnd.getTime().toString();
						attr.title = attribute.nom_atrib + ": " + $filter('date')(dateIni, $rootScope.i18n('l-date-format', [], 'dts/crm')).toString();
					}
				} catch (err) {
					attr.value = undefined;
				}
				break;
			case 7:
				attr.value = attribute.hra_atrib;
				attr.title = attribute.nom_atrib + ": " + attribute.hra_atrib;
				break;
			case 8:
				attr.value = attribute.num_atrib;
				attr.title = attribute.nom_atrib + ": " + attribute.num_atrib;

				if (isNaN(attr.value)) {
					attr.value = undefined;
				}
				break;
			case 9:
				attr.value = attribute.dsl_atrib;
				attr.title = attribute.nom_atrib + ": " + attribute.dsl_atrib;
				break;

			}

			if (attr.value === undefined || attr.value === null || attr.value === "") {
				return undefined;
			}

			return attr;
		};

		this.parseAttributeToDisclaimers = function (list) {

			var i,
				attr,
				attribute,
				disclaimers;

			if (!angular.isArray(list)) {
				return;
			}

			disclaimers = [];

			for (i = 0; i < list.length; i++) {

				attribute = list[i];

				attr = this.parseAttributeValue(attribute);

				if (CRMUtil.isDefined(attr) && CRMUtil.isDefined(attr.value)) {

					disclaimers.push({
						property: 'customfields.' + attribute.num_id,
						value: attr.value,
						title: attr.title
					});

				}

			}

			return disclaimers;
		};

		this.parseAsterisk = function (value) {
			var count;

			if (!value) {
				return undefined;
			}

			count = value.length - 1;

			if (value.indexOf("*") === 0 && value.lastIndexOf("*") === count) {
				return value.substr(1, (count - 1));
			} else {
				return value;
			}
		};

		this.parseDisclaimersToCustomFields = function (disclaimers, model, fn) {

			var fnFilter,
				fnMap,
				prop,
				i;

			if (!angular.isArray(model)) {
				model = [];
			}

			if (!angular.isArray(disclaimers)) {
				return;
			}

			fnFilter = function (item) {
				var bool = (item.num_id === parseInt(prop, 10));
				return bool;
			};

			fnMap = function (item, value, param) {
				var arr = [];

				switch (item.idi_tip_atrib) {
				case 1:
					item.dsl_atrib = CRMAttributeHelper.parseAsterisk(value);
					break;
				case 2:
					item.dsl_atrib = value;
					item.items = value.split(";").map(function (vlr) {
						return {
							id: vlr,
							name: vlr
						};
					});
					break;
				case 3:
					item.dsl_atrib = value;
					break;
				case 4:
					item.dsl_atrib = value;
					break;
				case 5:
					value.split(";").map(function (vlr) {
						item.dsl_atrib.itens.filter(function (e) {
							return (e.name === vlr);
						}).map(function (item) {
							item.selected = true;
						});
					});
					break;
				case 6:
					item.val_atrib = new Date(parseInt(value.split(";")[0], 10)).getTime();
					break;
				case 7:
					item.hra_atrib = value;
					break;
				case 8:
					item.num_atrib = value;
					break;
				case 9:
					item.dsl_atrib = value;
					break;
				}
			};

			for (i = 0; i < disclaimers.length; i++) {

				prop = disclaimers[i].property.split('.')[1];

				if (prop !== undefined) {

					model.filter(fnFilter).map(function (item) {
						fnMap(item, disclaimers[i].value, prop[1]);
					});

				}
			}

			if (fn) {
				fn(model);
			}

		};

		this.parseMask = function (attribute) {

			var replaceAll = function replaceAll(str, de, para) {
				var pos = str.indexOf(de);
				while (pos > -1) {
					str = str.replace(de, para);
					pos = str.indexOf(de);
				}
				return (str);
			};

			attribute.parseMask = {nom_mask : helper.replaceAll(attribute.properties.nom_mask, "#", "A")};
		};

		this.isInvalidForm = function (customFields, callback) {
			var messages = [],
				i;

			for (i = 0; i < customFields.length; i++) {

				if (customFields[i].idi_tip_atrib === 1 || customFields[i].idi_tip_atrib === 3 || customFields[i].idi_tip_atrib === 4 || customFields[i].idi_tip_atrib === 5 || customFields[i].idi_tip_atrib === 9) {

					if (customFields[i].log_obrig && (CRMUtil.isUndefined(customFields[i].dsl_atrib) || customFields[i].dsl_atrib === "")) {
						messages.push(customFields[i].nom_atrib);
					}

				} else if (customFields[i].idi_tip_atrib === 2) {

					if (customFields[i].log_obrig && (CRMUtil.isUndefined(customFields[i].items) || customFields[i].items.length <= 1)) {
						if (customFields[i].items.length === 0 || customFields[i].items[0].name === "") {
							messages.push(customFields[i].nom_atrib);
						}
					}

				} else if (customFields[i].idi_tip_atrib === 6) {

					if (customFields[i].log_obrig && (CRMUtil.isUndefined(customFields[i].val_atrib) || customFields[i].val_atrib === "" || customFields[i].val_atrib === 0)) {
						messages.push(customFields[i].nom_atrib);
					}

				} else if (customFields[i].idi_tip_atrib === 7) {

					if (customFields[i].log_obrig && (CRMUtil.isUndefined(customFields[i].hra_atrib) || customFields[i].hra_atrib === "")) {
						messages.push(customFields[i].nom_atrib);
					}

				} else if (customFields[i].idi_tip_atrib === 8) {
					if (customFields[i].log_obrig && (CRMUtil.isUndefined(customFields[i].num_atrib) || customFields[i].num_atrib === "")) {
						messages.push(customFields[i].nom_atrib);
					}
				}
			}

			if (callback) {
				callback(messages);
			}
		};

		this.convertToSave = function (customFields, num_id_process, idi_process, callback) {
			var ttAtributoVO = [],
				i,
				j,
				list = "",
				listArray = [];

			for (i = 0; i < customFields.length; i++) {
				listArray = [];

				if (customFields[i].idi_tip_atrib === 2) {

					for (j = 0; j < customFields[i].items.length; j++) {
						if (customFields[i].items[j].name.length > 0) {

							listArray.push(customFields[i].items[j].name);
						}
					}
					list = listArray.join("|");

					ttAtributoVO.push({
						"num_id" : customFields[i].num_id,
						"num_id_entidade": num_id_process,
						"dsl_atrib"    : list,
						"idi_process" : idi_process,
						"idi_tip_atrib" : customFields[i].idi_tip_atrib
					});

				} else if (customFields[i].idi_tip_atrib === 5) {

					for (j = 0; j < customFields[i].dsl_atrib.itens.length; j++) {
						if (customFields[i].dsl_atrib.itens[j].selected) {
							listArray.push(customFields[i].dsl_atrib.itens[j].name);

						}
					}
					list = listArray.join("|");

					ttAtributoVO.push({
						"num_id" : customFields[i].num_id,
						"num_id_entidade": num_id_process,
						"dsl_atrib"    : list,
						"idi_process" : idi_process,
						"idi_tip_atrib" : customFields[i].idi_tip_atrib
					});

				} else if (customFields[i].idi_tip_atrib === 6) {
					ttAtributoVO.push({
						"num_id" : customFields[i].num_id,
						"num_id_entidade": num_id_process,
						"val_atrib"    : customFields[i].val_atrib,
						"idi_process" : idi_process,
						"idi_tip_atrib" : customFields[i].idi_tip_atrib
					});

				} else if (customFields[i].idi_tip_atrib === 7) {
					ttAtributoVO.push({
						"num_id" : customFields[i].num_id,
						"num_id_entidade": num_id_process,
						"hra_atrib"    : customFields[i].hra_atrib,
						"idi_process" : idi_process,
						"idi_tip_atrib" : customFields[i].idi_tip_atrib
					});

				} else if (customFields[i].idi_tip_atrib === 8) {
					ttAtributoVO.push({
						"num_id" : customFields[i].num_id,
						"num_id_entidade": num_id_process,
						"num_atrib"    : customFields[i].num_atrib,
						"idi_process" : idi_process,
						"idi_tip_atrib" : customFields[i].idi_tip_atrib
					});

				} else {
					ttAtributoVO.push({
						"num_id" : customFields[i].num_id,
						"num_id_entidade": num_id_process,
						"dsl_atrib"    : customFields[i].dsl_atrib,
						"idi_process" : idi_process,
						"idi_tip_atrib" : customFields[i].idi_tip_atrib
					});
				}
			}

			if (callback) {
				callback(ttAtributoVO);
			}
		};

		this.parseAttributeType = function (attribute) {

			var i;

			for (i = 0; i < this.attributeTypes.length; i++) {

				if (attribute.idi_tip_atrib === this.attributeTypes[i].num_id) {
					attribute.type = angular.copy(this.attributeTypes[i]);
					break;
				}

			}
		};

		this.isClearfixNeeded = function (list, isDetail) {
			var count = 0, temp, i, divider;

			if (isDetail) {
				divider = 4;
			} else {
				divider = 2;
			}

			for (i = 0; i < list.length; i++) {

				if (isDetail) {
					if (list[i].type.num_id === 1 && list[i].dsl_atrib_json.num_max_length > 100) {
						list[i].isClearFix = true;
						count = 0;
					} else {
						count = count + list[i].type.detail_size;
					}
				} else {
					if ((list[i].type.num_id === 2) || (list[i].type.num_id === 1 && list[i].dsl_atrib_json.num_max_length > 100)) {
						list[i].isClearFix = true;
						count = 0;
					} else {
						count = count + list[i].type.edit_size;
					}
				}

				if (count % divider === 0) {
					list[i].isClearFix = true;
					count = 0;
				}
			}

		};

		this.parseGroup = function (list, callback) {

			var i, j, index, listGroup = [];

			for (i = 0; i < list.length; i++) {
				if (listGroup.length > 0) {
					index = -1;

					for (j = 0; j < listGroup.length; j++) {
						if (listGroup[j].id === list[i].idi_process) {
							index = j;
							break;
						}
					}

					if (index === -1) {
						listGroup.push({id: list[i].idi_process, name: list[i].nom_process, attributes: []});
						index = listGroup.length - 1;
					}

					listGroup[index].attributes.push(list[i]);
				} else {
					index = 0;
					listGroup.push({id: list[i].idi_process, name: list[i].nom_process, attributes: []});
					listGroup[index].attributes.push(list[i]);
				}

			}

			if (callback) { callback(listGroup); }
		};
	};

	helperAttribute.$inject = ['crm.helper', 'crm.legend', '$rootScope', '$filter'];


	// *************************************************************************************
	// *** FACTORY
	// *************************************************************************************

	factoryAttribute = function ($totvsresource, $cacheFactory, factoryGeneric, factoryGenericZoom,
						 factoryGenericTypeahead, factoryGenericCreateUpdate, factoryGenericDelete) {

		var factory,
			cache = $cacheFactory('crm.attribute.Cache');

		factory = $totvsresource.REST(CRMRestService + '1083/:method/:id',
			undefined,  factoryGenericCreateUpdate.customActions);

		angular.extend(factory, factoryGenericZoom);
		angular.extend(factory, factoryGenericTypeahead);
		angular.extend(factory, factoryGenericCreateUpdate);
		angular.extend(factory, factoryGenericDelete);

		factory.findRecords = function (parameters, options, callback) {
			options = options || {};

			//if (!options.orderBy) { options.orderBy =  ['nom_atrib']; }
			//if (CRMUtil.isUndefined(options.asc)) { options.asc =  [true]; }

			return factoryGeneric.findRecords(parameters, options, callback, this);
		};

		factory.saveAttribute = function (model, callback) {
			return this.DTSPost({method: 'attribute'}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.updateAttribute = function (id, model, callback) {
			return this.DTSPut({method: 'attribute', id: id}, model, function (result) {
				if (callback) { callback((result && result.length > 0 ? result[0] : undefined)); }
			});
		};

		factory.removeAttribute = function (id, callback) {
			return this.TOTVSRemove({id: id}, callback);
		};

		factory.getCustomFields = function (idProcess, idEntity, callback) {
			return this.TOTVSQuery({method: 'custom_fields', idProcess: idProcess, idEntity: idEntity}, function (result) {
				if (callback) {
					callback(result);
				}
			});

		};

		factory.reorderAttributes = function (attributes, callback) {
			return this.TOTVSUpdate({ method: 'attribute_order', attributes: attributes }, { method: 'attribute_order' }, callback);
		};

		return factory;
	};

	factoryAttribute.$inject = [
		'$totvsresource', '$cacheFactory', 'crm.generic.factory', 'crm.generic.zoom.factory',
		'crm.generic.typeahead.factory', 'crm.generic.create.update.factory', 'crm.generic.delete.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.attribute.helper', helperAttribute);

	index.register.factory('crm.crm_atrib.factory', factoryAttribute);

});
