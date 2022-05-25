/*globals index, define, angular, TOTVSEvent, CRMUtil */
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-utils.js',
	'/dts/crm/js/crm-factories.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'ng-load!/dts/crm/js/libs/3rdparty/ng-draggable/ng-draggable.js'
], function (index) {

	'use strict';

	var controllerAttributeList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controllerAttributeList = function ($scope, $rootScope, TOTVSEvent, helper, factory, userPreferenceModal,
										modalEdit, attributeHelper, filterHelper, modalAttributeAdvancedSearch) {

		var CRMControl = this;

		this.list = [];
		this.listCount = 0;
		this.quickFilters = [];
		this.disclaimers = [];
		this.fixedDisclaimers = [];
		this.isPendingListSearch = false;
		this.listByGroup = [];
        this.disclaimers = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.selectQuickFilter = function (filters) {
			filterHelper.selectQuickFilter(
				filters,
				CRMControl.disclaimers,
				CRMControl.fixedDisclaimers,
				function (newDisclaimers) {
					CRMControl.disclaimers = newDisclaimers.disclaimers;
					CRMControl.fixedDisclaimers = newDisclaimers.fixedDisclaimers;
					CRMControl.quickSearchText = undefined;
					CRMControl.search();
				}
			);
		};

		this.removeDisclaimer = function (disclaimer) {
			var i,
				index = CRMControl.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControl.disclaimers.splice(index, 1);
				for (i = 0; i < CRMControl.fixedDisclaimers.length; i++) {
					if (CRMControl.fixedDisclaimers[i].property === disclaimer.property) {
						CRMControl.disclaimers.push(CRMControl.fixedDisclaimers[i]);
						break;
					}
				}
				CRMControl.search();
			}
		};
        
        this.quickSearch = function () {
            CRMControl.disclaimers = [];
            CRMControl.search();
        };

		this.search = function () {

			var i, options, filters = [];

			if (CRMControl.isPendingListSearch === true) {
				return;
			}

			CRMControl.listCount = 0;

			// N HA NECESSIDADE DE PAGINACAO, POUCOS REGISTROS POR PROCESSO
			CRMControl.list = [];
			CRMControl.listByGroup = [];

			options = {
				start: CRMControl.list.length,
				end: 9999999
			};
            
            if (CRMControl.quickSearchText && CRMControl.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControl.quickSearchText)
				});
			}


            for (i = 0; i < CRMControl.disclaimers.length; i++) {
                if (CRMControl.disclaimers[i].property === 'nom_atrib') {
                    filters.push({
                        property: CRMControl.disclaimers[i].property,
                        value: helper.parseStrictValue(CRMControl.disclaimers[i].value)
                    });
                    
                } else if (CRMControl.disclaimers[i].property === 'idi_process' || CRMControl.disclaimers[i].property === 'idi_tip_atrib') {
                    filters.push({
                        property: CRMControl.disclaimers[i].property,
                        value: CRMControl.disclaimers[i].value.num_id
                    });
                    
                } else if (CRMControl.disclaimers[i].property === 'log_obrig') {
                    filters.push({
                        property: 'custom.log_obrig',
                        value: CRMControl.disclaimers[i].value
                    });
                    
                } else if (CRMControl.disclaimers[i].property === 'idi_sit') {
                    filters.push({
                        property: 'idi_sit',
                        value: CRMControl.disclaimers[i].value
                    });
                }
            }
            
			CRMControl.isPendingListSearch = true;

			factory.findRecords(filters, options, function (result) {

				if (result && result.length > 0) {
					for (i = 0; i < result.length; i++) {
						CRMControl.parseAttribute(result[i]);
					}
				}

				CRMControl.addInList(result);
				CRMControl.isPendingListSearch = false;

			});
		};

		this.selectGroup = function (group) {
			if (CRMControl.selectedGroup) {
				CRMControl.selectedGroup.$selected = false;
			}

			group.$selected = true;
			CRMControl.selectedGroup = group;
		};

		this.parseAttribute = function (attribute) {
			attribute.properties = JSON.parse(attribute.dsl_atrib);
			attributeHelper.parseSituation(attribute);
			attributeHelper.parseProcess(attribute);
			attributeHelper.parseType(attribute);
			attributeHelper.parseAccountType(attribute);
			attributeHelper.parsePersonType(attribute);
			attributeHelper.parseAttributeColor(attribute);

			if (attribute.idi_tip_atrib === 1 && CRMUtil.isDefined(attribute.properties.nom_mask)) {
				attributeHelper.parseMask(attribute);
			}
		};

		this.updateInList = function (attribute, old) {
			old = old || attribute;

			var index, idx;

			CRMControl.parseAttribute(attribute);

			idx = CRMControl.listByGroup.indexOf(CRMControl.selectedGroup);
			index = CRMControl.listByGroup[idx].attributes.indexOf(old);
			CRMControl.listByGroup[idx].attributes[index] = attribute;

			index = CRMControl.list.indexOf(old);
			CRMControl.list[index] = attribute;
		};

		this.addInList = function (list, isNew) {

			var i, attribute, index;

			if (!list) { return; }

			if (!angular.isArray(list)) {
				list = [list];
				CRMControl.listCount += 1;
			}

			for (i = 0; i < list.length; i += 1) {

				attribute = list[i];

				if (attribute && attribute.$length) {
					CRMControl.listCount = attribute.$length;
				}

				CRMControl.parseAttribute(attribute);
				CRMControl.list.push(attribute);
			}

			CRMControl.listByGroup = [];

			attributeHelper.parseGroup(CRMControl.list, function (groups) {
				CRMControl.listByGroup = groups;

				if (CRMControl.listByGroup && CRMControl.listByGroup.length > 0) {
					index = 0;

					if (CRMControl.selectedGroup) {
						for (i = 0; i < CRMControl.listByGroup.length; i++) {
							if (CRMControl.selectedGroup.id === CRMControl.listByGroup[i].id) {
								index = i;
							}
						}
					}

					CRMControl.selectGroup(CRMControl.listByGroup[index]);
				}
			});
		};

		this.addEdit = function (attribute) {

			modalEdit.open({
				attribute: attribute
			}).then(function (results) {
				results = results || [];
				var i, result;
				for (i = 0; i < results.length; i++) {
					result = results[i];
					if (CRMUtil.isUndefined(result)) { continue; }

					if (CRMUtil.isDefined(attribute) && attribute.num_id === result.num_id) {
						CRMControl.updateInList(result, attribute);
					} else {
						CRMControl.addInList(result, true);
					}
				}
			});

		};

		this.remove = function (attribute) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-custom-field', [], 'dts/crm').toLowerCase(), attribute.nom_atrib
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					var index, idx;

					factory.deleteRecord(attribute.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						idx = CRMControl.listByGroup.indexOf(CRMControl.selectedGroup);

						if (idx !== -1) {
							index = CRMControl.listByGroup[idx].attributes.indexOf(attribute);
							if (index !== -1) {
								CRMControl.listByGroup[idx].attributes.splice(index, 1);
							}
						}

						index = CRMControl.list.indexOf(attribute);

						if (index !== -1) {
							CRMControl.list.splice(index, 1);
							CRMControl.listCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-custom-field', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.updateStatus = function (status, attribute) {
			if (!status || !attribute || CRMUtil.isUndefined(attribute.num_id)) { return; }

			var statusName,
				vo,
				ttAtributo = {num_id: attribute.num_id};

			if (status === 'developing') {
				statusName = 'l-developing';
				ttAtributo.idi_sit = 1;
			} else if (status === 'released') {
				statusName = 'l-released';
				ttAtributo.idi_sit = 2;
			} else if (status === 'suspended') {
				statusName = 'l-suspended';
				ttAtributo.idi_sit = 3;
			}

			vo = {dsl_obs: '', ttAtributo: ttAtributo};

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-to-update',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-custom-field-confirm-change-status', [
					attribute.nom_atrib, ($rootScope.i18n(statusName, [], 'dts/crm'))
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }

					factory.updateRecord(attribute.num_id, vo, function (result) {

						if (result.$hasError === true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-custom-field', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-custom-field', [], 'dts/crm'), attribute.nom_atrib], 'dts/crm')
						});

						CRMControl.updateInList(result, attribute);
					});
				}
			});

		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'attribute.list' });
		};

		this.onAttributeDropComplete = function ($to, $data, $event) {

			var i,
				$from,
				attr,
				newOrder   = [],
				attributes = CRMControl.selectedGroup.attributes;

			// $from = $data.num_ord_acao - 1;
			for (i = 0; i < attributes.length; i++) {

				attr = attributes[i];

				if (attr.num_id === $data.num_id) {
					$from = i;
					break;
				}
			}

			CRMControl.selectedGroup.attributes.move($from, $to);

			for (i = 0; i < attributes.length; i++) {
				attr = attributes[i];
				attr.num_ordem = i + 1;
				newOrder.push(attr.num_id);
			}

			factory.reorderAttributes(newOrder);
		};
        
        this.openAdvancedSearch = function () {
            modalAttributeAdvancedSearch.open({
                disclaimers: angular.copy(CRMControl.disclaimers)
            }).then(function (result) {
                CRMControl.quickSearchText = "";
                CRMControl.disclaimers = result.disclaimers || [];
                CRMControl.search();
            });
        };
        
		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-custom-field', [], 'dts/crm'),
				viewController = 'crm.attribute.list.control';

			helper.loadCRMContext(function () {

				CRMControl.quickFilters = [{
					property: 'idi_sit',
					value: 1,
					title: $rootScope.i18n('l-developing', [], 'dts/crm'),
					fixed: false,
					model : {
						property: "idi_sit",
						value: 1
					}
				}, {
					property: 'idi_sit',
					value: 2,
					title: $rootScope.i18n('l-released', [], 'dts/crm'),
					fixed: false,
					model : {
						property: "idi_sit",
						value: 2
					}
				}, {
					property: 'idi_sit',
					value: 3,
					title: $rootScope.i18n('l-suspended', [], 'dts/crm'),
					fixed: false,
					model : {
						property: "idi_sit",
						value: 3
					}
				}];

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.search();
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});
	};

	controllerAttributeList.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_atrib.factory', 'crm.user.modal.preference',
		'crm.attribute.modal.edit', 'crm.attribute.helper', 'crm.filter.helper',
        'crm.attribute.modal.advanced.search'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.attribute.list.control', controllerAttributeList);
});
