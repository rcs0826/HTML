/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js'
], function (index) {

	'use strict';

	var modalScriptEditStatus,
		controllerScriptEditStatus;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalScriptEditStatus = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/script/script.edit-status.html',
				controller: 'crm.script.edit-status.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; }}
			});

			return scope.$modalInstance.result;
		};
	};

	modalScriptEditStatus.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerScriptEditStatus = function ($rootScope, $scope, parameters, legend, $modalInstance,
											scriptFactory, TOTVSEvent, helper, scriptHelper) {

		var CRMControlScriptEditStatus = this;

		this.model = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.save = function () {
			if (CRMControlScriptEditStatus.isInvalidForm()) { return; }

			var vo = CRMControlScriptEditStatus.convertToSave();

			if (!vo) { return; }

			scriptFactory.updateRecord(vo.num_id, vo, CRMControlScriptEditStatus.afterSave);
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				message,
				initialDate,
				finalDate,
				isValidDate,
				validateData,
				validateDataLessThenToday,
				validateDateBetween;

			validateData = function (model) {
				if (!model.expiration || !model.expiration.startDate || !model.expiration.endDate) {
					isInvalidForm = true;
					messages.push('l-expiration-date');
				}
			};

			validateData(CRMControlScriptEditStatus.model);

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-script', messages);
			}

			if (!isInvalidForm) {

				if (CRMControlScriptEditStatus.model.ttQuestionarioPagina && CRMControlScriptEditStatus.model.ttQuestionarioPagina.length > 0){

					for (var i = 0; i < CRMControlScriptEditStatus.model.ttQuestionarioPagina.length; i++) {
						var page = CRMControlScriptEditStatus.model.ttQuestionarioPagina[i];
						if (!page.ttQuestionarioQuestao || page.ttQuestionarioQuestao.length === 0) {
							isInvalidForm = true;

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type:   'error',
								title:  $rootScope.i18n('l-script', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-script-page-without-questions', page.nom_pag, 'dts/crm')
							});

							break;
						}
					}
				} else {
					isInvalidForm = true;
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-script', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-script-without-pages', [], 'dts/crm')
					});
				}
			}

			if (!isInvalidForm) {
				initialDate = CRMControlScriptEditStatus.model.expiration.startDate;
				finalDate = CRMControlScriptEditStatus.model.expiration.endDate;

				validateDateBetween = function (model) {
					if (Math.abs(finalDate - initialDate) < 86400000) {
						isInvalidForm = true;

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-script-valid-less-then-one-day', [], 'dts/crm')
						});
					}

				};

				validateDataLessThenToday = function (date, isInitialDate) {
					isValidDate = helper.equalsDate(new Date(date), new Date(), true);

					if (isValidDate < 0) {
						isInvalidForm = true;

						if (isInitialDate === true) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type:   'error',
								title:  $rootScope.i18n('l-script', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-script-start-early-than-today', [], 'dts/crm')
							});
						} else {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type:   'error',
								title:  $rootScope.i18n('l-script', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-script-end-early-than-today', [], 'dts/crm')
							});
						}
					}
				};

				if (CRMControlScriptEditStatus.model.val_inic_valid > 86400000) {
					if (initialDate !== CRMControlScriptEditStatus.model.val_inic_valid) {
						validateDataLessThenToday(initialDate, true);
					}
				} else {
					validateDataLessThenToday(initialDate, true);
				}

				if (CRMControlScriptEditStatus.model.log_edit_remove === false) {
					if (initialDate !== CRMControlScriptEditStatus.model.val_inic_valid) {
						isInvalidForm = true;

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-script-already-been-answered', [], 'dts/crm')
						});

						CRMControlScriptEditStatus.model.expiration.startDate = CRMControlScriptEditStatus.model.val_inic_valid;
					}
				}

				validateDataLessThenToday(finalDate, false);
				validateDateBetween(CRMControlScriptEditStatus.model);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var modelToSave = {},
				removeTimeFromDate;

			removeTimeFromDate = function (date) {
				date = new Date(date);
				date.setHours(0);
				date.setMinutes(0);
				date.setMilliseconds(0);
				return date.getTime();
			};

			if (CRMControlScriptEditStatus.model.num_id && CRMControlScriptEditStatus.model.num_id > 0) {
				modelToSave.num_id = CRMControlScriptEditStatus.model.num_id;
			}

			if (CRMControlScriptEditStatus.model.expiration) {
				modelToSave.val_inic_valid = removeTimeFromDate(CRMControlScriptEditStatus.model.expiration.startDate);
				modelToSave.val_fim_valid = removeTimeFromDate(CRMControlScriptEditStatus.model.expiration.endDate);
			}

			modelToSave.num_livre_1 = CRMControlScriptEditStatus.model.num_livre_1;

			return modelToSave;
		};

		this.afterSave = function (script) {
			var message;

			if (script) {
				$rootScope.$broadcast(CRMEvent.scopeSaveScript, script);
			}

			message = $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-script', [], 'dts/crm'), script.nom_script], 'dts/crm');

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-script', [], 'dts/crm'),
				detail: message
			});

			$modalInstance.close(script);

		};

		this.validadeParameterModel = function () {
			var model = CRMControlScriptEditStatus.model,
				status = CRMControlScriptEditStatus.status,
				initial,
				final,
				today,
				days = 1,
				getDate = function (datetime) {
					if (CRMUtil.isUndefined(datetime) || datetime < 86400000) {
						datetime = new Date();
					} else {
						datetime = new Date(datetime);
					}

					datetime.setHours(0);
					datetime.setMinutes(0);
					datetime.setMilliseconds(0);

					return datetime.getTime();
				};

			if (CRMUtil.isDefined(status)) {
				today = getDate();
				initial = getDate(model.val_inic_valid);
				final = getDate(model.val_fim_valid);

				if (final <= today) {
					final = today + (days * 24 * 60 * 60 * 1000); /* acrescenta 1 dia a partir de hoje */
				}

				model.expiration = {
					startDate: initial,
					endDate: final
				};

				switch (status) {
				case 'published':
					model.num_livre_1 = 2;
					break;
				case 'postpone':
					model.num_livre_1 = 2;
					break;
				case 'reopen':
					model.num_livre_1 = 2;
					break;
				}

			}

		};

		this.load = function (id) {
			scriptFactory.getRecord(id, function (result) {

				if (!CRMUtil.isDefined(result)) { return; }

				CRMControlScriptEditStatus.model = result;

				CRMControlScriptEditStatus.validadeParameterModel();
			});

		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		this.init = function () {

			CRMControlScriptEditStatus.status = parameters.status || undefined;

			CRMControlScriptEditStatus.model = undefined;
			helper.loadCRMContext(function () {
				CRMControlScriptEditStatus.load(parameters.script.num_id);
			});

		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlScriptEditStatus.init();
		});

		$scope.$on('$destroy', function () {
			CRMControlScriptEditStatus = undefined;
		});


	};

	controllerScriptEditStatus.$inject = ['$rootScope', '$scope', 'parameters', 'crm.legend', '$modalInstance',
								   'crm.crm_script.factory', 'TOTVSEvent', 'crm.helper', 'crm.script.helper'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.script.modal.edit-status', modalScriptEditStatus);

	index.register.controller('crm.script.edit-status.control', controllerScriptEditStatus);

});
