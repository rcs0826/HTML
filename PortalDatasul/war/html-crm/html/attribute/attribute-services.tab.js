/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1083.js'
], function (index) {

	'use strict';
	var controllerAttributeTab;


	controllerAttributeTab = function ($rootScope, $scope, TOTVSEvent, helper, attributeHelper) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAttributeTab = this;

		this.listOfAttribute = undefined;

		this.listOfAttributeCount = 0;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
			CRMControlAttributeTab.listOfAttribute = this.entity.ttCampoPersonalizado;

			if (CRMUtil.isUndefined(CRMControlAttributeTab.listOfAttribute)) {
				return;
			}

			this.listOfAttributeCount = this.listOfAttribute.length;

			var i = 0,
				j = 0,
				replaceAll = function replaceAll(str, de, para) {
					var pos = str.indexOf(de);
					while (pos > -1) {
						str = str.replace(de, para);
						pos = str.indexOf(de);
					}
					return (str);
				};

			for (i = 0; i < CRMControlAttributeTab.listOfAttribute.length; i++) {


				attributeHelper.parseAttributeType(CRMControlAttributeTab.listOfAttribute[i]);

				CRMControlAttributeTab.listOfAttribute[i].dsl_atrib_json = JSON.parse(CRMControlAttributeTab.listOfAttribute[i].dsl_atrib_json);

				/*  quebra os valores para apresentar com separador virgula na tela
					2. Multipla Seleção
					5. Checkbox
				*/

				if (CRMControlAttributeTab.listOfAttribute[i].idi_tip_atrib === 1 && CRMUtil.isDefined(CRMControlAttributeTab.listOfAttribute[i].dsl_atrib_json.nom_mask)) {
					CRMControlAttributeTab.listOfAttribute[i].dsl_atrib_json.nom_mask = replaceAll(CRMControlAttributeTab.listOfAttribute[i].dsl_atrib_json.nom_mask, "#", "A");
				}

				if (CRMControlAttributeTab.listOfAttribute[i].idi_tip_atrib === 6) {
					if (CRMControlAttributeTab.listOfAttribute[i].val_atrib < 1) {
						CRMControlAttributeTab.listOfAttribute[i].val_atrib = undefined;
					}
				}

				if (CRMControlAttributeTab.listOfAttribute[i].idi_tip_atrib === 2 || CRMControlAttributeTab.listOfAttribute[i].idi_tip_atrib === 5) {

					if (CRMControlAttributeTab.listOfAttribute[i].dsl_atrib) {
						while ((j = CRMControlAttributeTab.listOfAttribute[i].dsl_atrib.indexOf("|", j)) !== -1) {
							CRMControlAttributeTab.listOfAttribute[i].dsl_atrib = CRMControlAttributeTab.listOfAttribute[i].dsl_atrib.replace("|", ", ");
						}
					}
				}
			}
			attributeHelper.isClearfixNeeded(CRMControlAttributeTab.listOfAttribute, true);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (entity) {
			this.entity = entity;
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAttributeTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, entity) {
			CRMControlAttributeTab.init(entity);
		});

		$scope.$on(CRMEvent.scopeSaveAccount, function (event, entity) {
			CRMControlAttributeTab.init(entity);
		});

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, entity) {
			CRMControlAttributeTab.init(entity);
		});

		$scope.$on(CRMEvent.scopeSaveTicket, function (event, entity) {
			CRMControlAttributeTab.init(entity);
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, entity) {
			CRMControlAttributeTab.init(entity);
		});
		
		$scope.$on(CRMEvent.scopeSaveOpportunity, function (event, entity) {
			CRMControlAttributeTab.init(entity);
		});
		
	}; // controllerAttributeTab
	controllerAttributeTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.attribute.helper'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.attribute.tab.control', controllerAttributeTab);

});
