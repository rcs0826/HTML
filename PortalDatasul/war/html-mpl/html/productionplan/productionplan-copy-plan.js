define(['index'], function(index) {
	
	/**
	 * Controller Modal Necessidades
	 */
	
	CopyPlanCtrl.$inject = ['$modalInstance',
	                        '$rootScope',
	                        'model',
		                    'mpl.periodo.zoom',
		                    'fchman.fchmanproductionplan.Factory',
		                    'fchman.fchmanproductionplanitem.Factory',
                            'mpl.pl-prod.zoom',
		                    'mpl.periodo.zoom',
		            		'TOTVSEvent'];
    
    function CopyPlanCtrl ($modalInstance,
                           $rootScope,
                           model,
                           servicePeriodZoom,
                           fchmanproductionplanFactory,
                           fchmanproductionplanitemFactory,
                           servicePlanoProducaoZoom,
                           servicePeriodZoom,
                   		   TOTVSEvent) {
        
        var controller = this;
    	
        // recebe os dados de pesquisa atuais e coloca no controller
        this.model = model;
        this.isOpen = true;
        
        controller.model.sourcePlan = {'cd-plano': controller.model.planCode,
                                       'descricao': controller.model.planDescription};
        controller.model.targetPlan = "";
        
        if (controller.model.planType == "PV") {
            controller.model['cd-tipo'] = 2;
        } else if (controller.model.planType == "PP") {
            controller.model['cd-tipo'] = 1;
        }
        
        controller.model.copyType = 1;
        
        // Definição dos services de zoom
        this.servicePeriodZoom = servicePeriodZoom;
        this.servicePlanoProducaoZoom = servicePlanoProducaoZoom;
        
        this.ttBooleanReturn = [];
        
        /* Função....: onChangeCopyType
           Descrição.: evento ng-change do radio Plano/Quantidade
           Parâmetros: state: 1 - Plano, 2 - Quantidade */
        this.onChangeCopyType = function (state) {
            controller.model.copyType = state;
            controller.model.targetPlan = "";
        };
        
        /* Função....: onChangeInitialPeriod
           Descrição.: evento ng-change do campo Periodo Inicial
           Parâmetros:  */
        this.onLeaveInitialPeriod = function() {
            if (controller.model.initialPeriodString != undefined) {
                
                var parameters = {
                    period: controller.model.initialPeriodString.split("/")[0],
                    year: controller.model.initialPeriodString.split("/")[1],
                    planType: controller.model['cd-tipo'],
                };

                // Retorna o período referente a data informada
                controller.getDateOfPeriod(parameters, function(result) {
                    if (result) {
                        // para cada item do result
                        angular.forEach(result, function (value) {
                            if (value.periodValue != -1 && value.yearValue != -1) {
                                controller.model.initialDate = value.dateValue;
                                controller.model.initialPeriodString = controller.formatPeriod(controller.model.initialPeriodString);
                            }
                        });
                    }
                });
            }
        };
        
        /* Função....: onChangeFinalPeriod
           Descrição.: evento ng-change do campo Periodo Final
           Parâmetros:  */
        this.onLeaveFinalPeriod = function() {
            if (controller.model.finalPeriodString != undefined) {
                
                var parameters = {
                    period: controller.model.finalPeriodString.split("/")[0],
                    year: controller.model.finalPeriodString.split("/")[1],
                    planType: controller.model['cd-tipo'],
                };

                // Retorna o período referente a data informada
                controller.getDateOfPeriod(parameters, function(result) {
                    if (result) {
                        // para cada item do result
                        angular.forEach(result, function (value) {
                            if (value.periodValue != -1 && value.yearValue != -1) {
                                controller.model.finalDate = value.dateValue;
                                controller.model.finalPeriodString = controller.formatPeriod(controller.model.finalPeriodString);
                            }
                        });
                    }
                });
            }
        };
        
        /* Função....: onChangeInitialDate
           Descrição.: evento ng-change do campo Data Inicial
           Parâmetros:  */
        this.onChangeInitialDate = function() {
            
            var parameters = {
                date: controller.model.initialDate,
            };
            
            controller.getPeriodOfDate(controller.model['cd-tipo'], parameters, function (result) {
                if (result) {
                    angular.forEach(result, function (value) {
                        if (value.periodValue != -1 && value.yearValue != -1) {
                            controller.model.initialPeriodString = controller.formatPeriod(value.periodValue + "/" + value.yearValue);
                            controller.model.initialDate = value.dateValue;
                        }
                    });
                }
            });
        };
        
        /* Função....: onChangeDataFinal
           Descrição.: evento ng-change do campo Data Final
           Parâmetros:  */
        this.onChangeDataFinal = function() {
            
            var parameters = {
                date: controller.model.finalDate,
            };
            
            controller.getPeriodOfDate(controller.model['cd-tipo'], parameters, function (result) {
                if (result) {
                    angular.forEach(result, function (value) {
                        if (value.periodValue != -1 && value.yearValue != -1) {
                            controller.model.finalPeriodString = controller.formatPeriod(value.periodValue + "/" + value.yearValue);
                            controller.model.finalDate = value.finalDateValue;
                        }
                    });
                }
            });
        };
        
        /* Função....: formatPeriod
           Descrição.: formata o campo de período no formato "PPP/AAAA"
           Parâmetros: periodo */
        this.formatPeriod = function (params) {
            var fullPeriod = params;
            var period = fullPeriod.split("/")[0];
            var year = fullPeriod.split("/")[1];
            period = parseInt(fullPeriod.split("/")[0]);
            period = ("00" + period).slice(-3);
            year = fullPeriod.split("/")[1];
            fullPeriod = period + "/" + year;

            if (!period || !year) {
                return "000/0000";
            } else {
                return fullPeriod;
            }
        };
        
        
        /* Função....: getPeriodOfDate
           Descrição.: Retorna o período referente a data informada
           Parâmetros: periodType - tipo do período, de acordo com o plano de produção informado
                       parameters - date
                       callback   - funcao com o retorno da requisicao */
        this.getPeriodOfDate = function (periodType, parameters, callback) {
            fchmanproductionplanitemFactory.getPeriodOfDate(periodType, parameters, callback);
        };
        
        
        /* Função....: getPeriodOfDate
           Descrição.: Retorna a data do período informado
           Parâmetros: parameters - period, year, planType
                       callback   - funcao com o retorno da requisicao */
        this.getDateOfPeriod = function (parameters, callback) {
            fchmanproductionplanitemFactory.getDateOfPeriod(parameters, callback);
        };
        
        /* Função....: confirm
           Descrição.: ação de clicar no botão confirmar
           Parâmetros:  */
        this.confirm = function () {
            
            var parameters;
            
            if (controller.model.copyType == 1) {
                parameters = {
                    planCodeDestination: controller.model.targetPlan,
                    period: controller.model.initialPeriodString,
                    planCodeSource: controller.model.sourcePlan['cd-plano']
                };

                fchmanproductionplanFactory.productionPlanCompleteCopy(parameters, function(result) {
                    if (result) {
                        if (!result['$hasError']) {
                            // notifica o usuario os estabelecimentos foram atualizados
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', // tipo de notificação
                                title: $rootScope.i18n('l-copy-plano'), // titulo da notificação
                                detail: $rootScope.i18n('msg-plan-copy-success') // detalhe da notificação
                            });

                            // fecha a janela
                            $modalInstance.close();
                        }
                    }
                });
            } else if (controller.model.copyType == 2) {
                
                parameters = {
                    initialPeriod: controller.model.initialPeriodString,
                    planCodeDestination: controller.model.targetPlan['cd-plano'],
                    finalPeriod: controller.model.finalPeriodString,
                    isCopyQuantities: controller.model.copyQuantity,
                    planCodeSource: controller.model.sourcePlan['cd-plano']
                };
                
                fchmanproductionplanFactory.validateCopyQuantities(parameters, function(result) {
                    if (result && !result['$hasError']) {
                        if (result[0] && result[0].booleanValue) {
                            // envia um evento para perguntar ao usuário
                            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                title: $rootScope.i18n('msg-plan-has-items'),          // titulo da mensagem
                                text: $rootScope.i18n('msg-plan-has-items-question'),  // texto da mensagem
                                cancelLabel: 'l-no',                                // label do botão cancelar
                                confirmLabel: 'l-yes',                              // label do botão confirmar
                                callback: function(isPositiveResult) {              // função de retorno
                                    if (isPositiveResult) { // se foi clicado o botão confirmar
                                        fchmanproductionplanFactory.productionPlanCopyQuantities(parameters, function(resultCopy) {
                                            if (resultCopy && !resultCopy['$hasError']) {
                                                // notifica o usuario os estabelecimentos foram atualizados
                                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                                    type: 'success', // tipo de notificação
                                                    title: $rootScope.i18n('l-copy-plano'), // titulo da notificação
                                                    detail: $rootScope.i18n('msg-plan-copy-success') // detalhe da notificação
                                                });

                                                // fecha a janela
                                                $modalInstance.close();

                                                return isPositiveResult;
                                            }
                                        });
                                    }
                                }
                            });
                        } else if (result[0] && !result[0].booleanValue) {
                            // notifica o usuario os estabelecimentos foram atualizados
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', // tipo de notificação
                                title: $rootScope.i18n('l-copy-plano'), // titulo da notificação
                                detail: $rootScope.i18n('msg-plan-copy-success') // detalhe da notificação
                            });

                            // fecha a janela
                            $modalInstance.close();
                        }
                    }
                });
            }
        };
        
        /* Função....: close
           Descrição.: ação de clicar no botão fechar
           Parâmetros:  */
        this.close = function () {
            // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
            $modalInstance.dismiss();
        };
    };
    
    index.register.controller('mpl.productionplanitem.CopyPlanCtrl', CopyPlanCtrl);
    
});