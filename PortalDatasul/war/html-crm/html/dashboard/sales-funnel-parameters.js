/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/

define([
    'index',
    '/dts/crm/js/crm-services.js',
    '/dts/crm/js/api/fchcrm1007.js',
    '/dts/crm/js/api/fchcrm1002.js',
    '/dts/crm/js/api/fchcrm1001.js',
    '/dts/crm/html/opportunity/opportunity-services.detail.js',
    '/dts/crm/html/opportunity/opportunity-services.list.js'
], function (index) {

    'use strict';

    var modalParametersEdit,
        controllerSalesFunnelModal;

    // *************************************************************************************
    // *** MODAL EDIT
    // *************************************************************************************
    modalParametersEdit = function ($modal) {
        this.open = function (params) {

            var template,
                instance;

            template = '/dts/crm/html/dashboard/sales-funnel-parameters.html';
            instance = $modal.open({
                templateUrl: template,
                controller: 'crm.dashboard.sales-funnel.controller.modal as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: { parameters: function () { return params; } }
            });

            return instance.result;
        };
    };

    modalParametersEdit.$inject = ['$modal'];

    // *************************************************************************************
    // *** CONTROLLER MODAL
    // *************************************************************************************

    controllerSalesFunnelModal = function ($rootScope, $scope, $modalInstance, $filter, $location, $totvsprofile,
                                                  parameters, TOTVSEvent, helper,  modalParametersEdit,
                                                   opportunityFactory, userFactory, campaignFactory) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************

        var CRMControllerConfig = this;
        this.config = {};
        this.strategies = undefined;
        this.users      = undefined;
        this.campaigns  = undefined;
        this.types = [];
        this.isUserPortfolio = parameters.isUserPortfolio || false;
        this.tooltipMessage = $rootScope.i18n('msg-responsible-disabled', [], 'dts/crm');
        
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************


        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.apply = function (doApply) {

            if (CRMControllerConfig.isInvalidForm() || !CRMControllerConfig.config) { return; }

            var closeObj = {};

            closeObj.apply = doApply;
            closeObj.customFilter = {};
            closeObj.customFilter = CRMControllerConfig.config;

            $modalInstance.close(closeObj);
        };

        this.isInvalidForm = function () {

            var messages = [],
                isInvalidForm = false,
                fields = '',
                message = '',
                isPlural,
                i;

            if (!CRMControllerConfig.config.ttEstrategia) {
                isInvalidForm = true;
                messages.push('l-sales-strategy');
            }

            if (!CRMControllerConfig.config.ttTipoFunil) {
                isInvalidForm = true;
                messages.push('l-type');
            }

            if (isInvalidForm) {

                isPlural = messages.length > 1;

                message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

                for (i = 0; i < messages.length; i += 1) {
                    fields += $rootScope.i18n(messages[i], [], 'dts/crm');
                    if (isPlural && i !== (messages.length - 1)) {
                        fields += ', ';
                    }
                }

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'error',
                    title:  $rootScope.i18n('l-opportunity-funnel', [], 'dts/crm'),
                    detail: $rootScope.i18n(message, [fields], 'dts/crm')
                });
            }

            return isInvalidForm;
        };

        this.getStrategies = function () {

            CRMControllerConfig.strategies = [];

            opportunityFactory.getAllStrategies(function (result) {
                if (!result) { return; }
                CRMControllerConfig.strategies = result || [];
            }, true);
        };

        this.getUsers = function (value) {

            if (!value || value === '') { return []; }

            var filters = [{
                property: 'nom_usuar',
                value: helper.parseStrictValue(value)
            }, {
                property: 'custom.subordinate',
                value: true
            }];

            userFactory.typeahead(filters, undefined, function (result) {
                CRMControllerConfig.users = result || [];
            });
        };

        this.getCampaigns = function () {

            CRMControllerConfig.campaigns = [];

            campaignFactory.getAllCampaigns(true, $rootScope.currentuser.idCRM, function (result) {

                CRMControllerConfig.campaigns = result || [];

                if (!result || result.length === 0) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'warning',
                        title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
                        detail: $rootScope.i18n('msg-not-found-campaign-user', [], 'dts/crm')
                    });
                }
            });
        };

        this.onChangeStrategy = function () {
            var strategy = CRMControllerConfig.config.ttEstrategia;

            if (!strategy) { return; }

            opportunityFactory.validateEstrategy(strategy.num_id);
        };

        this.loadPreferences = function () {

            opportunityFactory.isIntegratedWithGP(function (result) {
                CRMControllerConfig.isIntegratedWithGP = result;

                if (result === true) {
                    CRMControllerConfig.types.push({ num_id: 1, nom_tipo: $rootScope.i18n('l-value-simulation',             [], 'dts/crm')},
                                                   { num_id: 2, nom_tipo: $rootScope.i18n('l-quantity',                     [], 'dts/crm')},
                                                   { num_id: 3, nom_tipo: $rootScope.i18n('l-number-of-lifes-accomplished', [], 'dts/crm')});
                } else {
                    CRMControllerConfig.types.push({ num_id: 1, nom_tipo: $rootScope.i18n('l-opportunity-value', [], 'dts/crm')},
                                                   { num_id: 2, nom_tipo: $rootScope.i18n('l-quantity',          [], 'dts/crm')},
                                                   { num_id: 3, nom_tipo: $rootScope.i18n('l-items', [], 'dts/crm')});
                }
            });
        };

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        CRMControllerConfig.config = parameters.config;

        this.init = function () {
            CRMControllerConfig.getStrategies();
            CRMControllerConfig.getCampaigns();
            CRMControllerConfig.loadPreferences();

            if (CRMControllerConfig.config.ttEstrategia) {
                CRMControllerConfig.onChangeStrategy();
            }
        };

        CRMControllerConfig.init();

    };

    controllerSalesFunnelModal.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter',
        '$location', '$totvsprofile', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.dashboard.sales-funnel.modal.parameter', 'crm.crm_oportun_vda.factory', 'crm.crm_usuar.factory', 'crm.crm_campanha.factory'];

    // *************************************************************************************
    // *** REGISTER
    // *************************************************************************************

    index.register.service('crm.dashboard.sales-funnel.modal.parameter', modalParametersEdit);
    index.register.controller('crm.dashboard.sales-funnel.controller.modal', controllerSalesFunnelModal);
});
