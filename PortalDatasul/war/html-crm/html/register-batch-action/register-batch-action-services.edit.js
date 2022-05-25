/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1005.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';
	var modalRegisterBatchActionEdit,
		controllerRegisterBatchActionEdit;

		// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalRegisterBatchActionEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

            // registrar acao em lote
            scope.$modalInstance = $modal.open({
                templateUrl: '/dts/crm/html/register-batch-action/register-batch-action.edit.html',
                controller: 'crm.register-batch-action.edit.control as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                scope: scope,
                resolve: { parameters: function () { return params; } }
            });

			return scope.$modalInstance.result;
		};
	};
	modalRegisterBatchActionEdit.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerRegisterBatchActionEdit = function ($rootScope, $scope, $filter, TOTVSEvent, appViewService, $location,
                                                   historyFactory, campaignFactory, userFactory, helper, historyHelper, preferenceFactory, $stateParams, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlRegisterBatchActionEdit = this,
			parameters = $scope.parameters || {},
			$modalInstance = $scope.$modalInstance || undefined;
        
        CRMControlRegisterBatchActionEdit.publicId = $stateParams.publicId || undefined;
        CRMControlRegisterBatchActionEdit.publicName = $stateParams.publicName || undefined;

		this.name = 'edit';
		this.model = undefined;
		this.defaults = undefined;
		this.accessRestriction = undefined;

		this.campaigns = [];
		this.actions = [];
		this.objectives = [];
		this.results = [];
		this.medias = [];
		this.users = [];
        
		this.canOverrideCampaign = true;
		this.canOverrideAction = true;

		this.isAllowedRetroactiveHistory = false;

		this.isModal = $scope.isModal === true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (CRMControlRegisterBatchActionEdit.isInvalidForm()) { return; }

			var vo = CRMControlRegisterBatchActionEdit.convertToSave(),
				historyPostPersist;

			if (!vo) { return; }

			historyPostPersist = function (result) {
                
                if (result) {
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-history', [], 'dts/crm'),
                        detail: $rootScope.i18n('msg-save-register-batch-action', [], 'dts/crm')
                    });
                    
                    CRMControlRegisterBatchActionEdit.afterSave(result);
                    
                } else {
                    return; 
                }
                
			};

			historyFactory.persistBatch(CRMControlRegisterBatchActionEdit.publicId, vo, function (result) {
				historyPostPersist(result);     
			});

		};

		this.cancel = function () {
			CRMControlRegisterBatchActionEdit.closeView();
		};

		this.closeView = function (result) {
			if ($modalInstance) {
                if (result) {
                    $modalInstance.close(result);
                } else {
                    $modalInstance.dismiss('cancel');
                }
			} else {
                
				// Legacy...
				var view = {
					active: true,
					name: $rootScope.i18n('nav-register-batch-action', [], 'dts/crm'),
					url: $location.url()
				};

				if (angular.isFunction(appViewService.getPageActive)) {
					view = appViewService.getPageActive();
				}

				appViewService.removeView(view);     
                              
            }
		};

		this.validadeParameterModel = function () {

			var now,
				history = CRMControlRegisterBatchActionEdit.model || {};

			history.initialHour = {};

			now = new Date();

			history.initialHour.start = $filter('date')(now, 'HH:mm');

			now.setHours(now.getHours() + 1);
			history.initialHour.end = $filter('date')(now, 'HH:mm');

			history.initialDate = {
				start	: new Date().getTime(),
				end		: new Date().getTime()
			};

			history.dateTimeBase = new Date();

			history.dateEnd = history.dateTimeBase;

			if (CRMControlRegisterBatchActionEdit.isAllowedRetroactiveHistory !== true) {
				history.dateStart = history.dateTimeBase;
			}

			if (history.ttCampanha && history.ttCampanha.num_id) {

				CRMControlRegisterBatchActionEdit.defaults.num_id_campanha = history.ttCampanha.num_id;

				if (history.ttAcao && history.ttAcao.num_id) {
					CRMControlRegisterBatchActionEdit.defaults.num_id_acao = history.ttAcao.num_id;
				}

				if (history.ttResultado && history.ttResultado.num_id) {
					CRMControlRegisterBatchActionEdit.defaults.num_id_restdo = history.ttResultado.num_id;
				}

				if (history.ttMidia && history.ttMidia.num_id) {
					CRMControlRegisterBatchActionEdit.defaults.num_id_mid = history.ttMidia.num_id;
				}
			}
		};

		this.validateParameters = function () {

			if (CRMControlRegisterBatchActionEdit.defaults.num_id_campanha) {
				CRMControlRegisterBatchActionEdit.canOverrideCampaign = CRMControlRegisterBatchActionEdit.defaults.num_id_campanha <= 0;
			} else {
				CRMControlRegisterBatchActionEdit.canOverrideCampaign = parameters.canOverrideCampaign || true;
			}

			if (CRMUtil.isDefined(parameters.canOverrideAction)) {
				CRMControlRegisterBatchActionEdit.canOverrideAction = parameters.canOverrideAction === true;
			} else {
				CRMControlRegisterBatchActionEdit.canOverrideAction = true;
			}

			if (CRMControlRegisterBatchActionEdit.defaults.dsl_histor_acao && CRMControlRegisterBatchActionEdit.defaults.dsl_histor_acao.length > 0) {
				CRMControlRegisterBatchActionEdit.model.dsl_histor_acao = CRMControlRegisterBatchActionEdit.defaults.dsl_histor_acao;
			}
		};

		this.loadPreferences = function (callback) {

			var count = 0,
				total = 1;

			historyFactory.isAllowedRetroactiveHistory(function (result) {
				CRMControlRegisterBatchActionEdit.isAllowedRetroactiveHistory = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.getCampaigns = function () {

			campaignFactory.getAllCampaigns(true, $rootScope.currentuser.idCRM, function (result) {

				CRMControlRegisterBatchActionEdit.campaigns = result || [];

				if (!result || result.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: 'Usuário não possui acesso a nehuma campanha!'
					});
					return;
				}

				var i,
					campaign,
					campaignToSelect;

				for (i = 0; i < CRMControlRegisterBatchActionEdit.campaigns.length; i++) {

					campaign = CRMControlRegisterBatchActionEdit.campaigns[i];

					if (CRMControlRegisterBatchActionEdit.defaults.num_id_campanha > 0) {
						if (CRMControlRegisterBatchActionEdit.defaults.num_id_campanha === campaign.num_id) {
							campaignToSelect = campaign;
							break;
						}
					} else if (i === 0) {
						campaignToSelect = campaign;
					}
                    
				}

				if (campaignToSelect) {
					CRMControlRegisterBatchActionEdit.model.ttCampanha = campaignToSelect;
					CRMControlRegisterBatchActionEdit.onChangeCampaign();
				} else if (CRMControlRegisterBatchActionEdit.defaults.num_id_campanha > 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-history', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-campaign-user', [], 'dts/crm')
					});
					return;
				}
			});

		};

		this.getActions = function () {

			CRMControlRegisterBatchActionEdit.model.ttAcao = undefined;
			CRMControlRegisterBatchActionEdit.model.ttResultado = undefined;
			CRMControlRegisterBatchActionEdit.model.ttMidia = undefined;

			if (!CRMControlRegisterBatchActionEdit.model.ttCampanha) { return []; }

			campaignFactory.getAllActions(CRMControlRegisterBatchActionEdit.model.ttCampanha.num_id,
                                          $rootScope.currentuser.idCRM, function (result) {

					CRMControlRegisterBatchActionEdit.actions = result || [];

					var i,
						action,
						actionToSelect;

					for (i = 0; i < CRMControlRegisterBatchActionEdit.actions.length; i++) {

						action = CRMControlRegisterBatchActionEdit.actions[i];

						if (CRMControlRegisterBatchActionEdit.defaults.num_id_acao > 0) {
							if (CRMControlRegisterBatchActionEdit.defaults.num_id_acao === action.num_id) {
								actionToSelect = action;
								break;
							}
						} else if (action.log_acao_default === true  || CRMControlRegisterBatchActionEdit.actions.length === 1) {
							actionToSelect = action;
							break;
						}
					}

					if (actionToSelect) {
						CRMControlRegisterBatchActionEdit.model.ttAcao = actionToSelect;
						CRMControlRegisterBatchActionEdit.onChangeAction();
					}
				});
		};

		this.getMedias = function () {

			CRMControlRegisterBatchActionEdit.model.ttMidia = undefined;

			if (!CRMControlRegisterBatchActionEdit.model.ttCampanha || !CRMControlRegisterBatchActionEdit.model.ttAcao) { return []; }

			campaignFactory.getAllMedias(CRMControlRegisterBatchActionEdit.model.ttCampanha.num_id, CRMControlRegisterBatchActionEdit.model.ttAcao.num_id, function (result) {

				CRMControlRegisterBatchActionEdit.medias = result || [];

				var i,
					media,
					mediaToSelect;

				for (i = 0; i < CRMControlRegisterBatchActionEdit.medias.length; i++) {

					media = CRMControlRegisterBatchActionEdit.medias[i];

					if (CRMControlRegisterBatchActionEdit.defaults.num_id_mid > 0) {
						if (CRMControlRegisterBatchActionEdit.defaults.num_id_mid === media.num_id) {
							mediaToSelect = media;
							break;
						}
					} else if (media.log_mid_default === true || CRMControlRegisterBatchActionEdit.medias.length === 1) {
						mediaToSelect = media;
						break;
					}
				}

				if (mediaToSelect) {
					CRMControlRegisterBatchActionEdit.model.ttMidia = mediaToSelect;
				}
			});
		};

		this.getResults = function () {

			CRMControlRegisterBatchActionEdit.model.ttResultado = undefined;

			if (!CRMControlRegisterBatchActionEdit.model.ttCampanha || !CRMControlRegisterBatchActionEdit.model.ttAcao) { return []; }

			campaignFactory.getAllResults(CRMControlRegisterBatchActionEdit.model.ttCampanha.num_id, CRMControlRegisterBatchActionEdit.model.ttAcao.num_id, function (data) {

				CRMControlRegisterBatchActionEdit.results = data || [];

				var i,
					result,
					resultToSelect;

				for (i = 0; i < CRMControlRegisterBatchActionEdit.results.length; i++) {

					result = CRMControlRegisterBatchActionEdit.results[i];

					if (CRMControlRegisterBatchActionEdit.defaults.num_id_restdo > 0) {
						if (CRMControlRegisterBatchActionEdit.defaults.num_id_restdo === result.num_id) {
							resultToSelect = result;
							break;
						}
					} else if (result.log_restdo_default === true || CRMControlRegisterBatchActionEdit.results.length === 1) {
						resultToSelect = result;
						break;
					}
				}

				if (resultToSelect) {
					CRMControlRegisterBatchActionEdit.model.ttResultado = resultToSelect;
					CRMControlRegisterBatchActionEdit.onChangeResult();
				}
			});
		};

		this.getResultDetails = function () {

			CRMControlRegisterBatchActionEdit.model.ttDetalhamento = undefined;

			if (!CRMControlRegisterBatchActionEdit.model.ttResultado) { return []; }

			campaignFactory.getAllDetails(CRMControlRegisterBatchActionEdit.model.ttResultado.num_id, function (result) {

				CRMControlRegisterBatchActionEdit.details = result || [];

				if (CRMControlRegisterBatchActionEdit.details.length === 1) {
					CRMControlRegisterBatchActionEdit.model.ttDetalhamento = CRMControlRegisterBatchActionEdit.details[0];
				}
			});
		};

		this.onChangeCampaign = function () {
			CRMControlRegisterBatchActionEdit.getActions();
		};

		this.onChangeAction = function () {
			CRMControlRegisterBatchActionEdit.getResults();
			CRMControlRegisterBatchActionEdit.getMedias();
		};

		this.onChangeResult = function () {
			CRMControlRegisterBatchActionEdit.getResultDetails();
		};

		this.isInvalidForm = function () {

			var message,
				messages = [],
				isInvalidForm = false,
				isValidTimeRange;

			if (!CRMControlRegisterBatchActionEdit.model.initialDate) {
				isInvalidForm = true;
				messages.push('l-date');
			}

			if (CRMControlRegisterBatchActionEdit.model.initialDate && !CRMControlRegisterBatchActionEdit.model.initialDate.start) {
				isInvalidForm = true;
				messages.push('l-date-start');
			}

			if (CRMControlRegisterBatchActionEdit.model.initialDate && !CRMControlRegisterBatchActionEdit.model.initialDate.end) {
				isInvalidForm = true;
				messages.push('l-date-end');
			}

			if (!CRMControlRegisterBatchActionEdit.model.initialHour) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlRegisterBatchActionEdit.model.initialHour && !CRMControlRegisterBatchActionEdit.model.initialHour.start)
					|| (CRMControlRegisterBatchActionEdit.model.initialHour.start.length === 0)) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if ((CRMControlRegisterBatchActionEdit.model.initialHour && !CRMControlRegisterBatchActionEdit.model.initialHour.end)
					|| CRMControlRegisterBatchActionEdit.model.initialHour.end.length === 0) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if (!CRMControlRegisterBatchActionEdit.model.dsl_histor_acao || CRMControlRegisterBatchActionEdit.model.dsl_histor_acao.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (!CRMControlRegisterBatchActionEdit.model.ttCampanha) {
				isInvalidForm = true;
				messages.push('l-campaign');
			}

			if (!CRMControlRegisterBatchActionEdit.model.ttAcao) {
				isInvalidForm = true;
				messages.push('l-action');
			}

			if (!CRMControlRegisterBatchActionEdit.model.ttMidia) {
				isInvalidForm = true;
				messages.push('l-media');
			}

			if (!CRMControlRegisterBatchActionEdit.model.ttResultado) {
				isInvalidForm = true;
				messages.push('l-result');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-history', messages);
			}

			if (!isInvalidForm) {

				isValidTimeRange = helper.validateTimeRange(
					CRMControlRegisterBatchActionEdit.model.initialDate,
					CRMControlRegisterBatchActionEdit.model.initialHour,
					CRMControlRegisterBatchActionEdit.model.dateTimeBase || new Date()
				);

				if (isValidTimeRange > -1) {

					/*Conforme conversado com o analista, no resgistro de ação deve considerar somente a data, o horario pode ser retroativo marcado o parametro ou não.*/
					/*if (isValidTimeRange === 0 && CRMControlRegisterBatchActionEdit.isAllowedRetroactiveHistory !== true) {
						message = 'msg-period-before-record';
					} else */

					if (isValidTimeRange === 1) {
						message = 'msg-period-start-after-end';
						isInvalidForm = true;
					} else if (isValidTimeRange === 2) {
						message = 'msg-period-end-before-start';
						isInvalidForm = true;
					}
				}
			}

			if (message) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-history', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {
					ttHistoricoVO: {},
					dsl_histor_acao: {}
				};

			vo.ttHistoricoVO.dat_inic = CRMControlRegisterBatchActionEdit.model.initialDate.start;
			vo.ttHistoricoVO.hra_inic = CRMControlRegisterBatchActionEdit.model.initialHour.start;

			vo.ttHistoricoVO.dat_fim  = CRMControlRegisterBatchActionEdit.model.initialDate.end;
			vo.ttHistoricoVO.hra_fim  = CRMControlRegisterBatchActionEdit.model.initialHour.end;

			if (CRMControlRegisterBatchActionEdit.model.dateTimeBase) {
				vo.ttHistoricoVO.dat_cadastro = CRMControlRegisterBatchActionEdit.model.dateTimeBase.getTime();
				vo.ttHistoricoVO.hra_cadastro = $filter('date')(CRMControlRegisterBatchActionEdit.model.dateTimeBase, 'HH:mm');
			} else {
				vo.ttHistoricoVO.dat_cadastro = CRMControlRegisterBatchActionEdit.model.dat_cadastro;
				vo.ttHistoricoVO.hra_cadastro = CRMControlRegisterBatchActionEdit.model.hra_cadastro;
			}

			vo.ttHistoricoVO.num_id_usuar = $rootScope.currentuser.idCRM;

			vo.dsl_histor_acao = CRMControlRegisterBatchActionEdit.model.dsl_histor_acao;

			if (CRMControlRegisterBatchActionEdit.model.ttCampanha) {
				vo.ttHistoricoVO.num_id_campanha = CRMControlRegisterBatchActionEdit.model.ttCampanha.num_id;
			}

			if (CRMControlRegisterBatchActionEdit.model.ttAcao) {
				vo.ttHistoricoVO.num_id_acao = CRMControlRegisterBatchActionEdit.model.ttAcao.num_id;
			}

			if (CRMControlRegisterBatchActionEdit.model.ttMidia) {
				vo.ttHistoricoVO.num_id_mid = CRMControlRegisterBatchActionEdit.model.ttMidia.num_id;
			}

			if (CRMControlRegisterBatchActionEdit.model.ttResultado) {
				vo.ttHistoricoVO.num_id_restdo = CRMControlRegisterBatchActionEdit.model.ttResultado.num_id;
			}

			if (CRMControlRegisterBatchActionEdit.model.ttDetalhamento) {
				vo.ttHistoricoVO.num_id_detmnto = CRMControlRegisterBatchActionEdit.model.ttDetalhamento.num_id;
			}

			return vo;
		};

		this.afterSave = function (history) {
			$rootScope.$broadcast(CRMEvent.scopeSaveHistory, []);
            CRMControlRegisterBatchActionEdit.closeView(history);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControlRegisterBatchActionEdit.model = parameters.history ? angular.copy(parameters.history) : {};
		CRMControlRegisterBatchActionEdit.defaults = parameters.defaults || {};

		if (CRMControlRegisterBatchActionEdit.isModal !== true) {
			appViewService.startView($rootScope.i18n('nav-register-batch-action', [], 'dts/crm'), 'crm.register-batch-action.edit.control', CRMControlRegisterBatchActionEdit);
		}

		helper.loadCRMContext(function () {

			accessRestrictionFactory.getUserRestrictions('history.edit', $rootScope.currentuser.login, function (result) {
				CRMControlRegisterBatchActionEdit.accessRestriction = result || {};

				CRMControlRegisterBatchActionEdit.loadPreferences(function () {

					CRMControlRegisterBatchActionEdit.validadeParameterModel();
					CRMControlRegisterBatchActionEdit.validateParameters();

					if (CRMControlRegisterBatchActionEdit.canOverrideCampaign !== true && CRMControlRegisterBatchActionEdit.canOverrideAction !== true) {
						CRMControlRegisterBatchActionEdit.onChangeAction();
					} else {
						CRMControlRegisterBatchActionEdit.getCampaigns();
					}
				});
			});

		});

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlRegisterBatchActionEdit = undefined;
		});

	};
	controllerRegisterBatchActionEdit.$inject = [
		'$rootScope', '$scope', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service', '$location',
		'crm.crm_histor_acao.factory', 'crm.crm_campanha.factory', 'crm.crm_usuar.factory', 'crm.helper', 'crm.history.helper', 'crm.crm_param.factory', '$stateParams', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.register-batch-action.modal.edit', modalRegisterBatchActionEdit);
	index.register.controller('crm.register-batch-action.edit.control', controllerRegisterBatchActionEdit);
});
