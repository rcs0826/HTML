define([  
    'index',
    'angularAMD',   
    '/dts/mce/js/zoom/deposito.js',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mce/js/zoom/localizacao.js',
    '/dts/mce/js/zoom/saldo-estoq.js',
    '/dts/mce/js/zoom/unid-negoc.js',
    '/dts/mcp/js/zoom/ord-prod.js',
    '/dts/men/js/zoom/item.js',
    '/dts/mcc/js/zoom/referencia.js',
    '/dts/mcc/js/zoom/sub-div-ordem.js',
    '/dts/mcc/js/zoom/tab-unidade.js',
    '/dts/utb/js/zoom/cta-ctbl-integr.js',
    '/dts/utb/js/zoom/ccusto.js',
    '/dts/mce/js/mce-utils.js',
    '/dts/mce/js/api/fch/fchmat/fchmatmaterialreturn-services.js',
    '/dts/mce/js/api/fch/fchmat/fchmatintegrationaccountcostcenter-services.js'   
    ], function (index) {

    ce0205aEditCtrl.$inject = ['$rootScope', '$scope', '$location', 'totvs.app-main-view.Service', 'mce.fchmatMaterialReturnFactory.factory', 'mce.fchmatIntegrationAccountCostCenterFactory.factory', 'mce.utils.Service', 'TOTVSEvent', '$stateParams'];

    function ce0205aEditCtrl($rootScope, $scope, $location, appViewService, fchmatMaterialReturnFactory, fchmatIntegrationAccountCostCenterFactory, mceUtils, TOTVSEvent, $stateParams) {

        /* Controller Definitions */
        var controller = this;

        this.integrationAccountInit = {};
        this.costCenterInit = {};

        controller.ttManualRequisition = {};
        controller.plans = {};

        angular.extend(this, mceUtils);

        /* Função....: getDefaults
           Descrição.: disparada ao sair do campo
           Parâmetros: fieldName 
        */
        this.getDefaults = function (fieldName) {

            if(($stateParams.site && $stateParams.itemCode && $stateParams.warehouse)
            && ( fieldName == "cod-estabel" || fieldName == "cod-depos" || fieldName == "it-codigo" )) {
                if (fieldName == "it-codigo" && controller.ttManualRequisition['it-codigo'] == $stateParams.itemCode) {
                    return;
                }
                if (fieldName == "cod-estabel" && controller.ttManualRequisition['cod-estabel'] == $stateParams.site) {
                    return;
                }
                if (fieldName == "cod-depos" && controller.ttManualRequisition['cod-depos'] == $stateParams.warehouse) {
                    return;
                }
            }

			if (controller.ttManualRequisition[fieldName] != undefined) {
				
				fchmatMaterialReturnFactory.setDefaultsRequisitionReturn({
						pType: "",
						pFieldName: fieldName
					}, controller.ttManualRequisition,
					function (result) {
						controller.listOfEnabledFields = result.ttEnableFields;
						controller.ttManualRequisition = result.ttManualRequisitionDefault[0];

						// Busca plano de contas para o Estabelecimento    
						if (fieldName == 'cod-estabel') {
							controller.getIntegrationAccountCostCenterFilter();
						}

						if (fieldName == 'cod-depos') {
							controller.fillLocationWithBlank();
						}

					});
			}

        };

        /* Função....: changeAccount
           Descrição.: disparada ao alterar o campo conta contabil
           Parâmetros:  
        */
        this.changeAccount = function () {

            if (controller.ttManualRequisition['ct-codigo'] !== undefined &&
                controller.ttManualRequisition['ct-codigo'] !== "" &&
                controller.ttManualRequisition['ct-codigo'] !== null) {

                controller.ttManualRequisition['sc-codigo'] = undefined;

                //busca os defaults para a conta
                this.getDefaults('ct-codigo');

                //retonra se habilia o nao o campo centro de custo
                fchmatIntegrationAccountCostCenterFactory.enableCostCenter({
                        site: controller.ttManualRequisition['cod-estabel'],
                        account: controller.ttManualRequisition['ct-codigo'],
                        isEmergencyal: false
                    }, {},
                    function (result) {
                        var index = mceUtils.findIndexByAttr(controller.listOfEnabledFields, 'campo', 'sc-codigo');
                        controller.listOfEnabledFields[index].habilitado = result.isEnableCostCenter;

                        if (!controller.listOfEnabledFields[index].habilitado) {
                            controller.ttManualRequisition['sc-codigo'] = undefined;

                        }
                    });

            }
        };

        /* Função....: getIntegrationAccountCostCenterFilter
           Descrição.: configurar filtros para os zooms MD de conta e centro ems5.                 
           Parâmetros: <não há> 
        */
        this.getIntegrationAccountCostCenterFilter = function () {
            //retorna se habilita ou nao o campo centro de custo
            fchmatIntegrationAccountCostCenterFactory.getIntegrationAccountCostCenterFilter({
                site: controller.ttManualRequisition['cod-estabel'],
                module: 'CEP'
            }, function (result) {
                controller.plans.accountPlan = result[0].accountPlan;
                controller.plans.centerCostPlan = result[0].centerCostPlan;

                controller.integrationAccountInit = {
                    filters: {
                        'cod_modul_dtsul': 'CEP',
                        /* MODULO ESTOQUE */
                        'cod_plano_cta_ctbl': controller.plans.accountPlan
                    }
                };

                controller.costCenterInit = {
                    filters: {
                        'cod_plano_ccusto': controller.plans.centerCostPlan
                    }
                };
            });
        };

        /* Função....: validateLot
           Descrição.: valida a data de validade do lote em relacao a data de transacao
           Parâmetros: <não há> 
        */
        this.validateLot = function (callback) {
            return fchmatMaterialRequisitionFactory.validateLot({}, controller.ttManualRequisition, function (result) {});
        };

        this.sucessNotification = function () {
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type: 'success',
                title: $rootScope.i18n('l-material-requisition-return', undefined, 'dts/mce'),
                detail: $rootScope.i18n('l-success-action', [$rootScope.i18n('l-material-requisition-return'), 'dts/mce'])
            });
        };

        /* Função....: validateAndCreateRequisitionReturn
           Descrição.: disparada ao clicar no botão Salvar
           Parâmetros: <não há> 
        */
        this.validateAndCreateRequisitionReturn = function () {
            // Valida campos do formulario
            if (controller.isInvalidForm()) {
                return;
            }

            // Verifica data validade do lote
            fchmatMaterialReturnFactory.validateLot({}, controller.ttManualRequisition, function (result) {
                if (result.pValidate) { //Data de Validade do Lote Vencida
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'l-question-date-valid-lot',
                        cancelLabel: 'l-cancel',
                        confirmLabel: 'l-confirm',
                        text: $scope.i18n('l-msg-question-date-valid-lot'),
                        callback: function (isPositiveResult) {
                            if (isPositiveResult) {
                                // Cria requisicao
                                fchmatMaterialReturnFactory.createRequisitionReturn({}, controller.ttManualRequisition,
                                    function (result) {
                                        if (!result.$hasError) {
                                            controller.sucessNotification();
                                            controller.emptyModels(); // limpa objetos de tela
                                            controller.init();

                                        }
                                    });
                            }
                        }
                    });
                } else {
                    // Cria requisicao               
                    fchmatMaterialReturnFactory.createRequisitionReturn({}, controller.ttManualRequisition,
                        function (result) {
                            if (!result.$hasError) {
                                controller.sucessNotification();
                                controller.emptyModels(); // limpa objetos de tela
                                controller.init();

                            }
                        });
                }
            });
        };

        /* Função....: limpa os objetos de tela
           Descrição.: disparada ao clicar no botão Cancel
           Parâmetros: fieldName 
        */
        this.emptyModels = function () {
            controller.ttManualRequisition = {};
        }


        /* Função....: isInvalidForm
           Descrição.: responsável por validar o formulário
           Parâmetros: <não há> 
        */
        this.isInvalidForm = function () {
            var warning = '';
            var isInvalidForm = false;
            var missingFields = [];

            missingFields = mceUtils.validateMissingFields($("#returnFormFields"), false);


            if (missingFields.length > 0) {
                isInvalidForm = true;
                // Monta mensagem campos obrigatórios                       
                warning = $rootScope.i18n('l-field') + ":";

                if (missingFields.length > 1)
                    warning = $rootScope.i18n('l-fields') + ":";

                angular.forEach(missingFields, function (item) {
                    warning = warning + ' ' + $rootScope.i18n(item.label) + ',';
                });

                if (missingFields.length > 1)
                    warning = warning + ' ' + $rootScope.i18n('l-requireds-2') + '. ';
                else
                    warning = warning + ' ' + $rootScope.i18n('l-required-2') + '. ';

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }


        /* Função....: init
            Descrição.: responsável por inicializar o controller principal
            Parâmetros: <não há>
         */
        this.init = function () {

            var isStateParams = $stateParams.site && $stateParams.itemCode && $stateParams.warehouse;

            createTab = appViewService.startView($rootScope.i18n('l-material-requisition-return'), 'mce.ce0205a.EditCtrl', controller);

            if (createTab === false && !isStateParams) {
                return;
            } else {
                $('#estab').focus();
            }

            if (isStateParams) {
                controller.emptyModels(); // limpa objetos de tela
                fchmatMaterialReturnFactory.returnDataFromDashboard({}, 
                    {'site': $stateParams.site,'itemCode': $stateParams.itemCode,'warehouse': $stateParams.warehouse}, 
                    function(result){ 
                        controller.listOfEnabledFields = result.ttEnableFields;
                        controller.ttManualRequisition = result.ttManualRequisitionDefault[0];

                        // Busca plano de contas para o Estabelecimento  
                        controller.getIntegrationAccountCostCenterFilter();
                    })
            
            } else {
                fchmatMaterialReturnFactory.initializeInterface(function (result) {
                    if (!result.$hasError) {
    
                        fchmatMaterialReturnFactory.setDefaultsRequisitionReturn({
                                pType: "create",
                                pFieldName: ""
                            }, controller.ttManualRequisition,
                            function (result) {
                                controller.listOfEnabledFields = result.ttEnableFields;
                                controller.ttManualRequisition = result.ttManualRequisitionDefault[0];
    
                                // Busca plano de contas para o Estabelecimento  
                                controller.getIntegrationAccountCostCenterFilter();
                        });
                    }
                }); 
            }

        };

        /* Função....: fillLocationWithBlank
           Descrição.: responsável por alterar o valor do model de localização para forçar
                       busca quando o código é branco.
           Parâmetros: <não há>
        */
        this.fillLocationWithBlank = function () {
            var index = mceUtils.findIndexByAttr(controller.listOfEnabledFields, 'campo', 'cod-localiz');
            if ((controller.ttManualRequisition['cod-localiz'] == "" &&
                    controller.listOfEnabledFields[index].habilitado) &&
                controller.ttManualRequisition['cod-depos'] &&
                controller.ttManualRequisition['cod-estabel']) {

                controller.ttManualRequisition['cod-localiz'] = " ";

            }
        };
		
		/* Função....: fillBalanceFieldsLote
		   Descrição.: Carrega campo retornado do Lote
		   Parâmetros: objSelected: Objeto retornado
		*/
		this.fillBalanceFieldsLote = function (objSelected, oldValueSelected) {
			controller.ttManualRequisition['cod-refer'] = objSelected['cod-refer'];            
		}

        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            ce0205aEditCtrl = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            ce0205aEditCtrl.init();
        });
    }



    /**********************************************************************************/
    /*   REGISTERS                                                                    */
    /**********************************************************************************/
    index.register.controller('mce.ce0205a.EditCtrl', ce0205aEditCtrl);
});