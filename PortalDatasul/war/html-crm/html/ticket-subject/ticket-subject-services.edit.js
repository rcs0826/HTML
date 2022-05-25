/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
    '/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var modalTicketSubject,
		controllerTicketSubjectEdit;

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerTicketSubjectEdit = function ($rootScope, $scope, $modalInstance, $filter, TOTVSEvent, parameters, helper,
		subjectHelper, ticketSubjectFactory, legend, preferenceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlSubjectEdit = this;

		this.model = undefined;
		this.editMode = false;
        this.isIntegratedWithGP = false;

		this.types = [
			{num_id: 1, nom_tipo: legend.subjectType.NAME(1)},
			{num_id: 2, nom_tipo: legend.subjectType.NAME(2)},
			{num_id: 3, nom_tipo: legend.subjectType.NAME(3)},
			{num_id: 4, nom_tipo: legend.subjectType.NAME(4)}
		];
        
        this.manifestationTypes = [
            {num_id: 1, nom_tipo: legend.manifestationType.NAME(1)},
            {num_id: 2, nom_tipo: legend.manifestationType.NAME(2)},
            {num_id: 3, nom_tipo: legend.manifestationType.NAME(3)},
            {num_id: 4, nom_tipo: legend.manifestationType.NAME(4)},
            {num_id: 5, nom_tipo: legend.manifestationType.NAME(5)},
            {num_id: 6, nom_tipo: legend.manifestationType.NAME(6)},
            {num_id: 7, nom_tipo: legend.manifestationType.NAME(7)},
            {num_id: 8, nom_tipo: legend.manifestationType.NAME(8)}
        ];
        
        this.serviceCategories = [];


		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.init = function () {
			this.validadeParameterModel();
			this.loadPreferences();
		};

		this.loadPreferences = function () {
            preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlSubjectEdit.isIntegratedWithGP = result;
			});
		};

		this.validadeParameterModel = function () {
			var subject = this.model || {};

			this.editMode = (subject.num_id > 0);

			subjectHelper.parseSubjectType(subject);
            subjectHelper.parseManifestationType(subject);
            this.filterServiceCategory();
            subjectHelper.parseServiceCategory(subject);
			
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.save = function () {

			if (this.isInvalidForm()) { return; }

			var vo = this.convertToSave();

			if (!vo) { return; }

			if (this.editMode) {
				ticketSubjectFactory.updateRecord(vo.num_id, vo, CRMControlSubjectEdit.afterSave);
			} else {
				ticketSubjectFactory.saveRecord(vo, CRMControlSubjectEdit.afterSave);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.nom_assunto_ocor || this.model.nom_assunto_ocor.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}
            		
			if (CRMControlSubjectEdit.isIntegratedWithGP) {
                
                if (!this.model.ttManifestationType || this.model.ttManifestationType.num_id === undefined) {
                    isInvalidForm = true;
                    messages.push('l-manifestation-type');
                }

                if ((!this.model.ttServiceCategory || !this.model.ttServiceCategory.num_id) &&
                        (this.model.ttManifestationType && this.model.ttManifestationType.num_id > 1)) {
                    isInvalidForm = true;
                    messages.push('l-service-category');
                }
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-subject', messages);
			}
            
			return isInvalidForm;
		};

		this.convertToSave = function () {
			if (!this.model) { return; }

			var vo = {};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
			}

			if (this.model.ttType) {
				vo.idi_tip_assunto_ocor = this.model.ttType.num_id;
			}
            
            if (this.model.ttManifestationType) {
				vo.idi_tip_manif = this.model.ttManifestationType.num_id;
			}
            
            if (this.model.ttServiceCategory) {
				vo.idi_categ_atendim  = this.model.ttServiceCategory.num_id;
			}

			vo.nom_assunto_ocor     = this.model.nom_assunto_ocor;
			vo.log_suspenso         = this.model.log_suspenso;

			return vo;
		};

		this.afterSave = function (subject) {

			if (!subject) { return; }

			if (CRMControlSubjectEdit.editMode) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-subject', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-update-generic',
							[$rootScope.i18n('l-subject', [], 'dts/crm').toLowerCase(), subject.nom_assunto_ocor], 'dts/crm')
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-subject', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-generic',
							[$rootScope.i18n('l-subject', [], 'dts/crm').toLowerCase(), subject.nom_assunto_ocor], 'dts/crm')
				});
			}

			$rootScope.$broadcast(CRMEvent.scopeSaveSubject, subject);

			$modalInstance.close(subject);
		};

        
        this.filterServiceCategory = function () {
            var type = CRMControlSubjectEdit.model.ttManifestationType ? CRMControlSubjectEdit.model.ttManifestationType.num_id  : 0;
            
            CRMControlSubjectEdit.serviceCategories = [];
            CRMControlSubjectEdit.model.ttServiceCategory = undefined;

            if (type >= 1 && type <= 4) {
                CRMControlSubjectEdit.serviceCategories.push(
                    { num_id: 1, nom_tipo: legend.serviceCategory.NAME(1) },
                    { num_id: 2, nom_tipo: legend.serviceCategory.NAME(2) },
                    { num_id: 3, nom_tipo: legend.serviceCategory.NAME(3) },
                    { num_id: 4, nom_tipo: legend.serviceCategory.NAME(4) }
                );
            } else if (type === 5) {
                CRMControlSubjectEdit.serviceCategories.push(
                    { num_id: 5, nom_tipo: legend.serviceCategory.NAME(5) },
                    { num_id: 6, nom_tipo: legend.serviceCategory.NAME(6) },
                    { num_id: 7, nom_tipo: legend.serviceCategory.NAME(7) },
                    { num_id: 22, nom_tipo: legend.serviceCategory.NAME(22) },
                    { num_id: 23, nom_tipo: legend.serviceCategory.NAME(23) }
                );
            } else if (type === 6) {
                CRMControlSubjectEdit.serviceCategories.push(
                    { num_id: 8, nom_tipo: legend.serviceCategory.NAME(8) },
                    { num_id: 9, nom_tipo: legend.serviceCategory.NAME(9) },
                    { num_id: 10, nom_tipo: legend.serviceCategory.NAME(10) },
                    { num_id: 11, nom_tipo: legend.serviceCategory.NAME(11) },
                    { num_id: 12, nom_tipo: legend.serviceCategory.NAME(12) },
                    { num_id: 13, nom_tipo: legend.serviceCategory.NAME(13) },
                    { num_id: 14, nom_tipo: legend.serviceCategory.NAME(14) },
                    { num_id: 15, nom_tipo: legend.serviceCategory.NAME(15) },
                    { num_id: 16, nom_tipo: legend.serviceCategory.NAME(16) },
                    { num_id: 17, nom_tipo: legend.serviceCategory.NAME(17) },
                    { num_id: 24, nom_tipo: legend.serviceCategory.NAME(24) },
                    { num_id: 41, nom_tipo: legend.serviceCategory.NAME(41) }
                );
            } else if (type === 7) {
                CRMControlSubjectEdit.serviceCategories.push(
                    { num_id: 18, nom_tipo: legend.serviceCategory.NAME(18) },
                    { num_id: 19, nom_tipo: legend.serviceCategory.NAME(19) },
                    { num_id: 20, nom_tipo: legend.serviceCategory.NAME(20) },
                    { num_id: 21, nom_tipo: legend.serviceCategory.NAME(21) }
                );
            } else if (type === 8) {
                CRMControlSubjectEdit.serviceCategories.push(
                    { num_id: 25, nom_tipo: legend.serviceCategory.NAME(25) },
                    { num_id: 26, nom_tipo: legend.serviceCategory.NAME(26) },
                    { num_id: 27, nom_tipo: legend.serviceCategory.NAME(27) },
                    { num_id: 28, nom_tipo: legend.serviceCategory.NAME(28) },
                    { num_id: 29, nom_tipo: legend.serviceCategory.NAME(29) },
                    { num_id: 30, nom_tipo: legend.serviceCategory.NAME(30) },
                    { num_id: 31, nom_tipo: legend.serviceCategory.NAME(31) },
                    { num_id: 32, nom_tipo: legend.serviceCategory.NAME(32) },
                    { num_id: 33, nom_tipo: legend.serviceCategory.NAME(33) },
                    { num_id: 34, nom_tipo: legend.serviceCategory.NAME(34) },
                    { num_id: 35, nom_tipo: legend.serviceCategory.NAME(35) },
                    { num_id: 36, nom_tipo: legend.serviceCategory.NAME(36) },
                    { num_id: 37, nom_tipo: legend.serviceCategory.NAME(37) },
                    { num_id: 38, nom_tipo: legend.serviceCategory.NAME(38) },
                    { num_id: 39, nom_tipo: legend.serviceCategory.NAME(39) },
                    { num_id: 40, nom_tipo: legend.serviceCategory.NAME(40) },
                    { num_id: 41, nom_tipo: legend.serviceCategory.NAME(41) }
                );
            }
            
        };
		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.subject ? angular.copy(parameters.subject) : {};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlSubjectEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	}; // controllerTicketSubjectEdit

	controllerTicketSubjectEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.ticket-subject.helper', 'crm.crm_assunto_ocor.factory', 'crm.legend', 'crm.crm_param.factory'
	];

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalTicketSubject = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-subject/ticket-subject.edit.html',
				controller: 'crm.ticket-subject.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalTicketSubject.$inject = ['$modal'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket-subject.modal.edit', modalTicketSubject);
	index.register.controller('crm.ticket-subject.edit.control', controllerTicketSubjectEdit);
});
