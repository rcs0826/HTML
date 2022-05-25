/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
    '/dts/crm/js/api/fchcrm1006.js',
    '/dts/crm/js/api/fchcrm1003.js',
    '/dts/crm/js/api/fchcrm1045.js',
    '/dts/crm/html/dashboard/ticket-summary-parameters.js',
    '/dts/crm/html/ticket/ticket-services.list.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketSummary;

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************
	controllerTicketSummary = function ($rootScope, $scope, ticketFactory, modalTicketSummaryParameter, $totvsprofile, helperTicket, serviceTicketParam, $location, modalTicketEdit, accountFactory, accountHelper, accessRestrictionFactory) {
        
        var CRMControl = this;
        
        this.accessRestriction = undefined;
        this.series = [];
		this.categories = [];
		this.data = undefined;
		this.options = {};
        this.accountSelected = undefined;
        this.tooltip = "";
        this.disclaimers = [];

        this.loadData = function () {
            var disclaimers = angular.copy(CRMControl.disclaimers);
            
            if (CRMControl.accountSelected && CRMControl.accountSelected.num_id) {
                disclaimers.push({
                    property: 'num_id_pessoa',
                    value: CRMControl.accountSelected.num_id
                });
                
                CRMControl.tooltip = "<b>" + $rootScope.i18n('l-selected-customer', [], 'dts/mpd/') + "</b>: " + CRMControl.accountSelected.nom_razao_social + " (" + CRMControl.accountSelected.cod_pessoa_erp + ")";
            }
                
            ticketFactory.getTicketSummary(disclaimers, function (result) {
                CRMControl.apply(result);
            });
        };
        
        this.refresh = function () {
            CRMControl.loadData();
        };

        this.apply = function (result) {
            var i,
                val_total;
            
            if (result && result[0].$length > 0) {

                val_total = result[0].$length;

                CRMControl.data = [];
                for (i = 0; i < result.length; i++) {

                    CRMControl.data.push({
                        category: $rootScope.i18n(result[i].nom_grupo, [], 'dts/crm'),
                        value: (result[i].val_total_grupo / val_total * 100).toFixed(2),
                        total: result[i].val_total_grupo,
                        color: result[i].nom_cor,
                        ids: result[i].nom_total_grupo
                    });

                }
            } else {
                CRMControl.data = [];
            }

			CRMControl.options = {
				legend: {
					position: "bottom",
					visible: true
				},
				chartArea: {
					height: 330
				},
				valueAxis: {
					majorUnit: 1
				},
				seriesDefaults: {
					labels: {
						visible: true,
						background: "transparent",
						template: "#= category #: \n #= value #%"
					}
				},
				tooltip: {
					visible: true,
					template: function (dataItem) {
						return dataItem.dataItem.category + ": " +  dataItem.dataItem.total;
					}
				},
				series: [{
					overlay: {
						gradient: "roundedBevel"
					},
					startAngle: 180,
					data: CRMControl.data,
					type: "pie"
				}]
			};
		};
        
        this.onClick = function (event) {
			if (!event) {
				return;
			}
			CRMControl.openDetail(false, event.dataItem.ids);
		};
		
        this.showConfig = function () {
            
			modalTicketSummaryParameter.open({
				disclaimers: CRMControl.disclaimers
			}).then(function (result) {

				if (!result) {
					return;
				}

				CRMControl.disclaimers = angular.copy(result.disclaimers);

				CRMControl.loadData();
				CRMControl.saveConfig(CRMControl.disclaimers);
			});
		};
        
        this.getConfig = function (callback) {
			$totvsprofile.remote.get(helperTicket.ticketSummaryConfig, undefined, function (result) {

				if (result && angular.isArray(result)) {
					result = result[0];
				}

				if (result && result.dataValue) {
					result = result.dataValue;
				}
                
				result = CRMControl.parseConfigToModel(result);

				if (callback) { callback(result); }
			});
		};
        
        this.parseConfigToModel = function (config) {
			var disclaimers;
            
            if (config) {
                disclaimers = angular.copy(config.dsResumoOcorrencias.ttFilterTicket);
            }

			return {
				disclaimers: disclaimers
			};
		};


		this.saveConfig = function (disclaimers, callback) {

			var config;

			config = CRMControl.parseConfig(disclaimers);

			$totvsprofile.remote.set(helperTicket.ticketSummaryConfig, {dataValue: config}, callback);
		};

		this.parseConfig = function (disclaimers) {

			var template;

			template = {
				"dsResumoOcorrencias": {
					"ttFilterTicket": disclaimers,
                    "ttFilterAccount": [{
                        num_id : CRMControl.accountSelected ? CRMControl.accountSelected.num_id : 0
                    }]
				}
			};

			return template;
		};
        
        this.onClick = function (event) {

			if (!event) {
				return;
			}

			CRMControl.openDetail(event.dataItem.ids);
		};

        this.openDetail = function (ids) {
			var param;

            if (ids === undefined) {
				ids = 0;
			}
            
			param = [{
				source : 'l-widget-ticket-summary',
				value : helperTicket.ticketSummaryConfig,
                model : ids
			}];

			serviceTicketParam.setParamTicket(param, function (callback) {
				$scope.safeApply(function () {
					$location.path('/dts/crm/ticket/');
				});
			});
		};
        
        $scope.safeApply = function (fn) {
			var phase = (this.$root ? this.$root.$$phase : undefined);

			if (phase === '$apply' || phase === '$digest') {
				if (fn && (typeof (fn) === 'function')) {
					fn();
				}
			} else {
				this.$apply(fn);
			}
		};
        
        this.getAccountByERPCode = function (erpCode, callback) {
            accountFactory.getAccountByERPCode(erpCode, function (result) {
                callback(result);
            });
        };
        
        $scope.$on('selectedcustomer', function (event) {
			if ($scope.selectedAccountCRM) {
                return;
            }
            
			if (CRMControl.accountSelected === $scope.selectedcustomer) {
                return;
            } else {
                CRMControl.getAccountByERPCode($scope.selectedcustomer['cod-emitente'], function (result) {
                    CRMControl.accountSelected = result;
                    
                    CRMControl.loadData();
                    CRMControl.saveConfig(CRMControl.disclaimers);
                });
            }
		});

        
        $scope.$watch(function () {
			return $rootScope.selectedAccountCRM;
		}, function (data, oldData) {
            if (data === undefined && oldData === data) {
                return;
            } else {
                CRMControl.accountSelected = data;
            }
            
            CRMControl.loadData();
            CRMControl.saveConfig(CRMControl.disclaimers);
		}, true);

        
        this.openTicket = function () {
            modalTicketEdit.open({ ticket: {}});
		};

        
        this.init = function () {
            var total = 2,
                count = 0,
                isAccountSelected = false,
                loadData = function () {
                    if (!isAccountSelected) {
                        CRMControl.loadData();
                    }
                };
            
            accessRestrictionFactory.getUserRestrictions('ticket.list', $rootScope.currentuser.login, function (result) {
                CRMControl.accessRestriction = result || {};
            });

            
            CRMControl.getConfig(function (result) {
                if (result && (result.disclaimers && result.disclaimers.length > 0)) {
                    CRMControl.disclaimers = result.disclaimers;
                } else {
                    CRMControl.disclaimers.push(
                        { property: 'period_type', value: 3 },
                        { property: 'custom.idi_agrupador', value: 1 }
                    );
                }
                count++;
                if (count === total) {
                    loadData();
                }
            });
            
            $totvsprofile.remote.get(accountHelper.selectedAccountConfig, undefined, function (result) {
                    
                
                isAccountSelected = CRMControl.parseConfigSelectedAccountToModel(result);
                count++;
                if (count === total) {
                    loadData();
                }
            });

        };
        
        //Refatorar os demais widgets
        this.parseConfigSelectedAccountToModel = function (result) {
			var dsCarteiraClienteCRM,
                selectedAccount;

            if (result && angular.isArray(result)) {
                result = result[0];
            }
            if (result && result.dataValue) {
                result = result.dataValue;
            }

			dsCarteiraClienteCRM = result ? result.dsCarteiraClienteCRM : undefined;

			if (dsCarteiraClienteCRM && dsCarteiraClienteCRM.selectedAccount) {
				selectedAccount = dsCarteiraClienteCRM.selectedAccount;
			}

			return selectedAccount !== undefined;
		};
        
        this.init();
	};

	controllerTicketSummary.$inject = [
		'$rootScope', '$scope', 'crm.crm_ocor.factory', 'crm.dashboard.ticket-summary.modal.parameter', '$totvsprofile', 'crm.ticket.helper', 'crm.ticket.param-service', '$location', 'crm.ticket.modal.edit', 'crm.crm_pessoa.conta.factory', 'crm.account.helper',
        'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.controller('crm.dashboard.ticket-summary.controller', controllerTicketSummary);
});


