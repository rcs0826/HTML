/*globals index, define, angular, TOTVSEvent, CRMUtil */
define([
    'index',
    '/dts/crm/js/api/fchcrm1054.js',
    '/dts/crm/js/api/fchcrm1003.js',
    '/dts/crm/js/zoom/crm_pessoa.js',
    '/dts/crm/js/api/fchcrm1101.js',
    '/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function (index) {
    'use strict';
    
    var controller;
    
    controller = function ($scope, $rootScope, TOTVSEvent, helper, targetFactory, accountFactory, modalSchedule, backgroundRoutinesFactory) {
        var CRMControl = this;
        
        this.programName = "crm251";
        
        this.init = function () {
			this.getSummary();
		};
        
        this.getSummary = function () {
			backgroundRoutinesFactory.getInfoSchedule(CRMControl.programName, function (result) {
				CRMControl.summary = (result && result.length > 0) ? result : [];
			});
		};
        
        this.getTargets = function (value) {
			if (!value || value === '') {
				return [];
			}

            var filter = { property: 'nom_public_alvo', value: helper.parseStrictValue(value) };

			targetFactory.typeahead(filter, undefined, function (result) {
				CRMControl.targets = result;
			});
		};
        
        this.getAccounts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControl.accounts = result;
			});
		};
        
        this.onChangeAccount = function () {
            this.model.ttPublic = undefined;
            this.model.all = false;
        };
        
        this.onChangeTarget = function () {
            this.model.ttConta = undefined;
            this.model.all = false;
        };
        
        this.onChangeAll = function () {
            if (!this.model.all) {
                this.model.ttConta = undefined;
                this.model.ttPublic = undefined;
            }
        };
        
        this.openModalSchedule = function (callback) {
			modalSchedule.open({
				programName: CRMControl.programName
			}).then(function (result) {
				if (callback) { callback(result); }
			});
		};
        
        this.execute = function () {
            if (CRMControl.isInvalidForm()) { return; }
            
            CRMControl.openModalSchedule(function (schedule) {
                var vo = CRMControl.convertToSave(schedule);
                
                backgroundRoutinesFactory.createClassTransition(vo, function (result) {

					if (result.$hasError === true) { return; }

					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign-action-trans-class', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-class-transition-data-success', [
								$rootScope.i18n('l-campaign-action-trans-class')
							], 'dts/crm')
						});
					}

				});
            });
        };
        
        this.convertToSave = function (schedule) {
            var vo = {},
				ttTransicaoClasse = {},
				ttRPWSchedule = {};
            
            vo.ttTransicaoClasse = {
				num_id_pessoa: this.model.ttConta ? this.model.ttConta.num_id : 0,
				num_id_publico: this.model.ttPublic ? this.model.ttPublic.num_id : 0,
                log_todos: this.model.all ? true : false
			};
            
            vo.ttRPWSchedule = {
				RPWServer: schedule.RPWServer,
				executeDate: schedule.executeDate,
				initialHour: schedule.initialHour,
				isAutomaticCalendar: schedule.isAutomaticCalendar
			};

			return vo;
        };
        
        this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;
            
            if (CRMUtil.isUndefined(CRMControl.model)) {
                isInvalidForm = true;
                messages.push('l-public');
                messages.push('l-account');
                messages.push('l-all');
            }

            
            if (CRMUtil.isDefined(CRMControl.model) && !CRMControl.model.all && CRMUtil.isUndefined(CRMControl.model.ttConta) && CRMUtil.isUndefined(CRMControl.model.ttPublic)) {
                isInvalidForm = true;
                messages.push('l-public');
                messages.push('l-account');
                messages.push('l-all');
            }
            
			if (isInvalidForm) {
				helper.showInvalidFormMessageAtLeastOne('l-campaign-action-trans-class', messages);
			}

			return isInvalidForm;
		};
        
        this.init();

    };

    controller.$inject = [
        '$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_public.factory', 'crm.crm_pessoa.conta.factory', 'crm.rpw-schedule.modal.edit', 'crm.crm_backgroundruntimes.factory', 'crm.crm_pessoa.conta.zoom'
    ];
    
    index.register.controller('class-transition-rpw.control', controller);
});
