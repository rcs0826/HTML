/*global $, index, define, angular, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1096.js',
    '/dts/crm/html/preference-financial/classification-services.select.js',
    '/dts/crm/html/preference-financial/group-services.select.js'
], function (index) {
   
    'use strict';
    
    var controllerPreferenceFinancial;
    
    // *************************************************************************************
	// *** Controller Parametros Situação Financeira
	// *************************************************************************************

	controllerPreferenceFinancial = function ($scope, $rootScope, TOTVSEvent, helper, preferenceFinancialFactory, modalSelectionClass, modalSelectionGroup) {
        
        var CRMControlPreferenceFinancial = this;
        
        this.model = {};
        
        this.load = function () {
            preferenceFinancialFactory.findRecords(function (result) {
                if (result[0]) {
                    CRMControlPreferenceFinancial.model = result[0];
                }
            });
            
        };
        
        this.init = function () {
            var viewName = $rootScope.i18n('nav-preference-financial', [], 'dts/crm'),
				viewController = 'crm.preference-financial.list.control';

			helper.startView(viewName, viewController, CRMControlPreferenceFinancial);

			helper.loadCRMContext(function () {
                CRMControlPreferenceFinancial.load();
			});
        };
        
        this.save = function () {
            var vo;
            
            if (this.isInvalidForm()) { return; }
            
            vo = this.convertToSave();
            
            preferenceFinancialFactory.updateRecord(vo, function (result) {
                if (result) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-preference-financial', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-record-success-generic', [
							$rootScope.i18n('nav-preference-financial')
						], 'dts/crm')
					});
                }
            });
        };
        
        this.isInvalidForm = function () {
            var isInvalid,
                messages = [];
            
            if (CRMUtil.isUndefined(this.model) || !this.model.val_min) {
                isInvalid = true;
                messages.push('l-minimum-value');
            }

            if (CRMUtil.isUndefined(this.model) || !this.model.num_dias_atraso) {
                isInvalid = true;
                messages.push('l-number-days-late');
            }
            
            if (isInvalid) {
				helper.showInvalidFormMessage('nav-preference-financial', messages);
			}
            
            return isInvalid;
            
        };
        
        this.convertToSave = function () {
            return {
                ttParametros: {
                    "val_min": CRMControlPreferenceFinancial.model.val_min,
                    "num_dias_atraso": CRMControlPreferenceFinancial.model.num_dias_atraso
                },
                ttGrupos: CRMControlPreferenceFinancial.model.ttGrupos,
                ttClasses: CRMControlPreferenceFinancial.model.ttClasses
            };
        };
        
        this.removeClass = function (index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-confirm-delete',
                cancelLabel: 'btn-cancel',
                confirmLabel: 'btn-confirm',
                text: $rootScope.i18n('msg-confirm-delete', [
                    $rootScope.i18n('l-classification', [], 'dts/crm').toLowerCase(), this.model.ttClasses[index].nom_clas_clien
                ], 'dts/crm'),
                callback: function (isPositiveResult) {
                    if (!isPositiveResult) { return; }
                    
                    CRMControlPreferenceFinancial.model.ttClasses.splice(index, 1);
                    CRMControlPreferenceFinancial.save();
                }
            });
        };
        
        this.removeGroup = function (index) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-confirm-delete',
                cancelLabel: 'btn-cancel',
                confirmLabel: 'btn-confirm',
                text: $rootScope.i18n('msg-confirm-delete', [
                    $rootScope.i18n('l-group-client', [], 'dts/crm').toLowerCase(), this.model.ttGrupos[index].nom_grp_clien
                ], 'dts/crm'),
                callback: function (isPositiveResult) {
                    if (!isPositiveResult) { return; }

                    CRMControlPreferenceFinancial.model.ttGrupos.splice(index, 1);
                    CRMControlPreferenceFinancial.save();
                }
            });
        };
        
        this.selectClassifications = function () {
            var i;
            
            modalSelectionClass.open().then(function (result) {
                if (!CRMControlPreferenceFinancial.model.ttClasses) {
                    CRMControlPreferenceFinancial.model.ttClasses = [];
                }
                
                if (result) {
                    for (i = 0; i < result.length; i++) {
                        CRMControlPreferenceFinancial.model.ttClasses.push({
                            "num_id": result[i].num_id,
                            "nom_clas_clien": result[i].nom_clas_clien
                        });
                    }
                    CRMControlPreferenceFinancial.save();
                }
            });
        };
        
        this.selectGroups = function () {
            var i;
            
            modalSelectionGroup.open().then(function (result) {
                if (!CRMControlPreferenceFinancial.model.ttGrupos) {
                    CRMControlPreferenceFinancial.model.ttGrupos = [];
                }
                
                if (result) {
                    for (i = 0; i < result.length; i++) {
                        CRMControlPreferenceFinancial.model.ttGrupos.push({
                            "num_id": result[i].num_id,
                            "nom_grp_clien": result[i].nom_grp_clien
                        });
                    }
                    CRMControlPreferenceFinancial.save();
                }
            });
        };
        
        this.openProgressCreateCalendar = function () {
            this.openProgress("cdp/cd8600.w", "cd8600", []);
		};

		this.openProgress  = function (path, program, param) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('nav-preference-financial', [], 'dts/crm'),
				detail: $rootScope.i18n('msg-open-di-flex', [], 'dts/crm')
			});
			$rootScope.openProgramProgress(path, program, param);
		};
        
        this.executeCalendar = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'btn-execute-progress-calendar',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-execute-calendar', ['crm00438'], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					preferenceFinancialFactory.executeCalendar(function (result) {
						if (result.l_ok) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'info',
								title: $rootScope.i18n('nav-preference-financial', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-success-creation-calendar', [], 'dts/crm')
							});
						}
					});
				}
			});
		};
        
        if ($rootScope.currentuserLoaded) {	this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlPreferenceFinancial = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlPreferenceFinancial.init();
		});
        
    };

    controllerPreferenceFinancial.$inject = ['$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_param_sit_financ.factory', 'crm.classification.modal.selection', 'crm.group.modal.selection'];
    
    // ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.preference-financial.list.control', controllerPreferenceFinancial);
});