/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalOpportunityCompetitorEdit,
		controllerOpportunityCompetitorEdit;

	modalOpportunityCompetitorEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/opportunity/competitor/competitor.edit.html',
				controller: 'crm.competitor.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalOpportunityCompetitorEdit.$inject = ['$rootScope', '$modal'];

	controllerOpportunityCompetitorEdit = function ($rootScope, $scope, $filter, TOTVSEvent, appViewService, $location, helper, accountFactory, opportunityFactory, $modalInstance, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************
		var CRMControlOpportunityCompetitorEdit = this,
			parameters;

		this.accessRestriction = undefined;

		this.competitors = undefined;

		this.model = {};

		this.parameters = $scope.parameters || {};

		this.model = this.parameters.competitor || {};

		this.isEdit = this.parameters.isEdit || false;

		this.onChangeCompetitor = function (concorrenteConta) {

			CRMControlOpportunityCompetitorEdit.contacts = [];

			this.model.ttConcorrenteContato = undefined;

			if (CRMUtil.isDefined(concorrenteConta)) {
				this.getContacts(concorrenteConta.num_id);
			}
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }

			var filters = [{ property: 'nom_razao_social', value: helper.parseStrictValue(value) },
						  { property: 'log_concorrente', value: true }];
			accountFactory.typeahead(filters, undefined, function (result) {
				if (!result) { return; }
				CRMControlOpportunityCompetitorEdit.competitors = result;
			});
		};

		this.getContacts = function (idAccount) {
			accountFactory.getContacts(idAccount, function (result) {
				if (!result) { return; }
				CRMControlOpportunityCompetitorEdit.contacts = result;
			});
		};

		this.cancel = function () {
			$modalInstance.close();
		};

		this.save = function (saveNew) {

			var vo = {};

			if (this.model.ttConcorrenteConta) {
				vo.num_id_pessoa = this.model.ttConcorrenteConta.num_id;
			} else {
				helper.showInvalidFormMessage('nav-competitor', 'l-competitor');
				return;
			}

			if (this.model.ttConcorrenteContato) {
				vo.num_id_contat = this.model.ttConcorrenteContato.num_id;
			}

			if (this.model.num_seq) {
				vo.num_seq = this.model.num_seq;
			} else {
				helper.showInvalidFormMessage('nav-competitor', 'l-weight');
				return;
			}

			if (this.model.val_oportun_vda) {
				vo.val_oportun_vda = this.model.val_oportun_vda;
			} else {
				helper.showInvalidFormMessage('nav-competitor', 'l-opportunity-value');
				return;
			}

			if (this.model.dsl_observacao) {
				vo.dsl_observacao = this.model.dsl_observacao;
			}

			if (CRMControlOpportunityCompetitorEdit.isEdit) {

				vo.num_id = CRMControlOpportunityCompetitorEdit.model.num_id;

				opportunityFactory.updateCompetitor(CRMControlOpportunityCompetitorEdit.parameters.opportunity.num_id, vo.num_id, vo, function (result) {

					if (!result) { return; }

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-competitor', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-related-generic', [
							$rootScope.i18n('l-competitor', [], 'dts/crm'),
							CRMControlOpportunityCompetitorEdit.model.ttConcorrenteConta.nom_razao_social,
							CRMControlOpportunityCompetitorEdit.parameters.opportunity.des_oportun_vda
						], 'dts/crm')
					});

					CRMControlOpportunityCompetitorEdit.afterSave(saveNew);
				});
			} else {
				opportunityFactory.addCompetitor(CRMControlOpportunityCompetitorEdit.parameters.opportunity.num_id, vo, function (result) {

					if (!result) { return; }

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-competitor', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-related-generic', [
							$rootScope.i18n('l-competitor', [], 'dts/crm'),
							CRMControlOpportunityCompetitorEdit.model.ttConcorrenteConta.nom_razao_social,
							CRMControlOpportunityCompetitorEdit.parameters.opportunity.des_oportun_vda
						], 'dts/crm')
					});

					CRMControlOpportunityCompetitorEdit.afterSave(saveNew);
				});
			}
		};

		this.afterSave = function (saveNew) {
			if (!saveNew) {
				$modalInstance.close();
			} else {
				CRMControlOpportunityCompetitorEdit.model = {};
				CRMControlOpportunityCompetitorEdit.contacts = [];
				CRMControlOpportunityCompetitorEdit.isEdit = false;
			}
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('opportunity.competitor.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunityCompetitorEdit.accessRestriction = result || {};
			});

			if (CRMControlOpportunityCompetitorEdit.model.ttConcorrenteConta) {
				CRMControlOpportunityCompetitorEdit.getContacts(
					CRMControlOpportunityCompetitorEdit.model.ttConcorrenteConta.num_id
				);
			}
		};

		CRMControlOpportunityCompetitorEdit.init();


	};

	controllerOpportunityCompetitorEdit.$inject = [
		'$rootScope', '$scope', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service', '$location', 'crm.helper', 'crm.crm_pessoa.conta.factory', 'crm.crm_oportun_vda.factory', '$modalInstance', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.opportunity.competitor.modal.edit', modalOpportunityCompetitorEdit);
	index.register.controller('crm.competitor.edit.control', controllerOpportunityCompetitorEdit);

});
