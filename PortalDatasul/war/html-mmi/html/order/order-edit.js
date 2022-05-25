define(['index',
	'/dts/mce/js/mce-utils.js',
	'/dts/utb/js/zoom/cta-ctbl-integr.js',
	'/dts/utb/js/zoom/ccusto.js',
	'/dts/mce/js/zoom/unid-negoc.js',
	'/dts/mpd/js/zoom/estabelec.js',
	'/dts/mcc/js/zoom/sub-div-ordem.js',
	'/dts/mce/js/api/fch/fchmat/fchmatintegrationaccountcostcenter-services.js',
	'/dts/mmi/js/zoom/ord-manut.js'
], function (index) {

	/**
	 * Controller Edit 
	 */
	orderEditCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$window',
		'$location',
		'$state',
		'$filter',
		'totvs.app-main-view.Service',
		'mmi.equipto.zoom',
		'mmi.manut.zoom',
		'mmi.tag.zoom',
		'mmi.mntplanejador.zoom',
		'mmi.tipo-manut.zoom',
		'mmi.equipe.zoom',
		'fchmip.fchmiporder.Factory',
		'helperOrder',
		'mmi.plano.zoom',
		'TOTVSEvent',
		'helperPlanoOrigZoom',
		'fchmip.fchmipparameter.Factory',
		'totvs.utils.Service',
		'$modalInstance',
		'model',
		'$timeout',
		'mce.fchmatIntegrationAccountCostCenterFactory.factory',
		'mmi.utils.Service'
	];

	function orderEditCtrl($rootScope,
		$scope,
		$stateParams,
		$window,
		$location,
		$state,
		$filter,
		appViewService,
		serviceZoomEquipment,
		serviceZoomMaintenance,
		serviceZoomTag,
		serviceZoomMntPlanejador,
		serviceZoomTipoManut,
		serviceZoomTeam,
		fchmiporderFactory,
		helperOrder,
		serviceZoomMaintenancePlan,
		TOTVSEvent,
		helperPlanoOrigZoom,
		fchmipparameterFactory,
		totvsUtils,
		$modalInstance,
		model,
		$timeout,
		fchmatIntegrationAccountCostCenterFactory,
		mmiUtils) {

		var controller = this;

		$scope.serviceZoomEquipment = serviceZoomEquipment;

		// *********************************************************************************
		// *** Atributos
		// *********************************************************************************

		// mantem o conteudo do registro em edição/inclusão
		this.model = {};

		// título que será mostrado no breadcrumb de edição do html
		var breadcrumbTitle;

		// título que será mostrado no header de edição do html
		var headerTitle;

		// variável para controlar se o usuário selecionou a opção Salvar e Novo
		var isSaveNew = false;

		// variável para indicar a abertura da tela e não aplicar o leave do equipamento
		var applyLeaveEquipto = false;

		// variável para indicar a abertura da tela e não aplicar o leave da manutenção
		var applyLeaveManut = false;

		// variável para indicar a abertura da tela e não aplicar o leave do tipo de manutenção
		var applyLeaveTipoManut = false;

		// variável para indicar a abertura da tela e não aplicar o leave da parada
		var applyLeaveParada = false;

		// variável para indicar a abertura da tela e não aplicar o leave da sequencia de parada
		var applyLeaveSequencia = false;

		var applyLeaveUrgency = true;

		var leaveManut = false;

		var lNaoTemMaisInvest = false;

		var lOrdemComMatriz = false;

		var alterouContaInvest = false;

		var exibeContaDespesa = true;

		var cdParadaOriginal;
		var cdParada = "";

		this.showStopPlan = true;

		this.showMaintenance = true;

		this.showDates = true;

		// Objeto que será ultilizado no metodo getObjectFromValue no de ordem de investimento
		this.investmentOrderInit = {};

		/**
	     * Mostra plano de parada
	     */
		this.openStopPlan = function () {
			controller.showStopPlan = !controller.showStopPlan;
		}

	    /**
	     * Mostra plano de manutenção
	     */
		this.openMaintenance = function () {
			controller.showMaintenance = !controller.showMaintenance;
		}

	    /**
	     * Mostra datas
	     */
		this.openDates = function () {
			controller.showDates = !controller.showDates;
		}

	    /**
	     * Leave Tipo de Manutenção
	     */
		controller.leaveCdTipo = function () {

			if (controller.model['cd-equipto'] && controller.model['cd-equipto']['cd-equipto'] !== undefined && controller.applyLeaveTipoManut) {
				if (controller.model['cd-tipo']) {
					if (!controller.isNew) {
						controller.model['ct-codigo'] = controller.model['cd-tipo']['ct-ordem'];
						controller.model['ct-desp'] = controller.model['cd-tipo']['ct-despesa'];
						controller.verificaUtilizacaoCCusto();
					}
					if (controller.leaveManut == false) {
						controller.calculaPrioridade();
					}
					controller.leaveManut = false;
				}
			} else {
				controller.applyLeaveTipoManut = true;
				controller.leaveManut = false;
			}

			if (controller.model['cd-tipo']) {
				controller.model['tp-manut'] = controller.model['cd-tipo']['tp-manut'];
				controller.setClasse();
				if (controller.model['tp-manut'] != 10) {
					controller.model['cd-inspecao'] = undefined;
				}
			} else {
				controller.model['des-classe'] = "";
			}
		}

	    /**
	     * Verifica utilização de centro de custo
	     */
		this.verificaUtilizacaoCCusto = function () {
			var params = {
				'epCodigo': controller.model['ep-codigo'],
				'cEstabel': controller.model['cd-equipto']['cod-estabel'],
				'dtManut': controller.model['dt-manut'],
				'ctCodigo': controller.model['cd-tipo']['ct-ordem'],
				'ctDesp': controller.model['cd-tipo']['ct-despesa']
			}

			fchmiporderFactory.verificaUtilizacaoCCusto(params, function (result) {
				if (!result.$hasError) {
					controller.logCtCodigo = result.logCtCodigo;
					controller.logCtDesp = result.logCtDesp;

					if (result.logCtCodigo) {
						controller.model['sc-codigo'] = controller.model['cd-tipo']['sc-ordem'];
					} else {
						controller.model['sc-codigo'] = undefined;
					}
					if (result.logCtDesp) {
						controller.model['sc-desp'] = controller.model['cd-tipo']['sc-despesa'];
						if (!controller.model['sc-desp'] && controller.model['cd-equipto']) {
							controller.model['sc-desp'] = controller.model['cd-equipto']['cc-codigo'];
						}
					} else {
						controller.model['sc-desp'] = undefined;
					}
				}
			});

		}

	    /**
	     * Leave Urgência
	     */
		controller.leaveUrgency = function () {
			if (controller.urgency != controller.model['urgencia'] || controller.applyLeaveUrgency) {
				controller.applyLeaveTipoManut = true;
				controller.leaveCdTipo();
				controller.applyLeaveUrgency = false;
			}

			controller.urgency = angular.copy(controller.model['urgencia']);
		}

	    /**
	     * Leave Equipamento
	     */
		controller.leaveCdEquipto = function () {

			if (controller.model['cd-equipto'] !== undefined && controller.applyLeaveEquipto) {
				if ((model.length < 1 || controller.isSaveNew) || (model != 'new' && controller.model.estado < 7)) {
					controller.model['cd-tag'] = controller.model['cd-equipto']['cd-tag'] !== "" ? controller.model['cd-equipto']['cd-tag'] : undefined;
					controller.model['cd-planejado'] = mmiUtils.converteValorBranco(controller.model['cd-equipto']['cd-planejado']);
					controller.model['cod-estabel'] = controller.model['cd-equipto']['cod-estabel'];
					controller.model['cod-unid-negoc'] = controller.model['cd-equipto']['cod-unid-negoc'];
					if (controller.model.estado == 1) {
						controller.verificaUtilizacaoCCusto();
					}
				}

				if (controller.model['cd-manut'] !== undefined || controller.model['cd-tipo'] !== undefined) {
					controller.calculaPrioridade();
				}
			}

			if (controller.model['cd-equipto'] == undefined) {
				helperPlanoOrigZoom.data.cdEqpto = " ";
				helperPlanoOrigZoom.data.fmEqpto = " ";
			} else {
				helperPlanoOrigZoom.data.cdEqpto = controller.model['cd-equipto']['cd-equipto'];
				helperPlanoOrigZoom.data.fmEqpto = controller.model['cd-equipto']['fm-equipto'];
			}

			if (controller.model['cd-tag'] == "")
				helperPlanoOrigZoom.data.cdTag = " ";
			else
				helperPlanoOrigZoom.data.cdTag = controller.model['cd-tag'];

			controller.applyLeaveEquipto = true;
		}

	    /**
	     * Legenda do plano origem
	     */
		controller.setLegPlano = function (plano) {
			if (plano == 'manut')
				return $rootScope.i18n('l-standard-maintenance');
			else if (plano == 'man-eq-tag')
				return $rootScope.i18n('l-equipment-plan-tag');
			else if (plano == 'man-equip')
				return $rootScope.i18n('l-equipment-plan');
			else if (plano == 'man-fam')
				return $rootScope.i18n('l-family-plan');
			else if (plano == 'man-tag-fam')
				return $rootScope.i18n('l-family-plan-tag');

		}

	    /**
	     * Seleciona manutenção no zoom
	     */
		controller.selectedCdManut = function (sel) {

			controller.planoOrigSel = sel['planoOrig'];
			controller.cdManutSel = sel['cdManut'];
			controller.planoOrig = sel['planoOrig'];

			controller.desPlanoOrigSel = controller.setLegPlano(sel['planoOrig']);

			controller.initCdManut = sel;

			controller.model['cd-tipo'] = sel.cdTipo;
			controller.model['des-man-corr'] = sel.descManut;
			controller.model['cd-equip-res'] = mmiUtils.converteValorBranco(sel.equipRes);
			controller.model['cd-planejado'] = mmiUtils.converteValorBranco(sel.cdPlanejador);

			controller.isSel = true;
		}

	    /**
	     * Leave Manutenção
	     */
		controller.leaveCdManut = function () {

			if (controller.model['cd-equipto']) {
				if (controller.model['cd-equipto']['cd-equipto'] !== undefined && controller.applyLeaveManut) {
					if (controller.model['cd-manut'] !== undefined || controller.model['cd-tipo'] !== undefined) {
						controller.leaveManut = true;
						controller.calculaPrioridade();
					}
				}
			}

			if (controller.model['cd-manut'] !== undefined && controller.model['cd-manut'].cdManut !== undefined && controller.applyLeaveManut) {

				if (!controller.isSel) {
					if (controller.isNew) {
						controller.model['cd-tipo'] = controller.model['cd-manut'].cdTipo;
						controller.model['des-man-corr'] = controller.model['cd-manut'].descManut ? controller.model['cd-manut'].descManut : controller.model['cd-manut'].descricao;
						controller.model['narrativa'] = controller.model['cd-manut'].narrativa;

						if (controller.model['cd-manut'].sintoma !== "") controller.model['cd-sint-padr'] = controller.model['cd-manut'].sintoma;

						var cdPlanejador = controller.model['cd-manut'].cdPlanejador ? controller.model['cd-manut'].cdPlanejador : controller.model['cd-manut'].cdPlanejado;
						if (cdPlanejador && cdPlanejador !== "") controller.model['cd-planejado'] = cdPlanejador;

						var cdEquipe = controller.model['cd-manut'].equipRes ? controller.model['cd-manut'].equipRes : controller.model['cd-manut'].equipeResp;
						if (cdEquipe && cdEquipe !== "") controller.model['cd-equip-res'] = cdEquipe;

					}
					controller.model['plano-orig'] = controller.model['cd-manut'].planoOrig;
					if (controller.model['tp-manut'] == 10 && (controller.model['cd-inspecao'] == undefined || controller.model['cd-inspecao'] == "")) {
						controller.model['cd-inspecao'] = controller.model['cd-manut'].cdInspecao;
					}
				} else
					controller.isSel = false;

				controller.desPlanoOrigSel = controller.setLegPlano(controller.model['plano-orig']);

			} else {
				if (controller.applyLeaveManut) controller.desPlanoOrigSel = "";
				controller.applyLeaveManut = true;
			}
		}

	    /**
	     * Calcula prioridade da ordem
	     */
		controller.calculaPrioridade = function () {
			params = {
				'cPlanoOrigem': controller.model['cd-manut'] == undefined ? "" : controller.model['cd-manut'].planoOrig,
				'cEquipto': controller.model['cd-equipto']['cd-equipto'] == undefined ? "" : controller.model['cd-equipto']['cd-equipto'],
				'cFmEquipto': controller.model['cd-equipto']['fm-equipto'] == undefined ? "" : controller.model['cd-equipto']['fm-equipto'],
				'cManut': controller.model['cd-manut'] == undefined ? "" : controller.model['cd-manut'].cdManut,
				'cTag': controller.model['cd-tag'] == undefined ? "" : controller.model['cd-tag'],
				'cTipoManut': controller.model['cd-tipo'] == undefined ? "" : controller.model['cd-tipo']['cd-tipo'],
				'iUrgencia': controller.model['urgencia'] == undefined ? 0 : controller.model['urgencia']
			}

			fchmiporderFactory.calculaPrioridade(params, function (result) {
				if (result) {
					controller.model['prioridade'] = result.iPrioridade;
					if (result.lAlteraPlano) {
						controller.model['cd-manut'].planoOrig = "manut";
						controller.desPlanoOrigSel = controller.setLegPlano("manut");
					}
				}
			});
		}

	    /**
	     * Leave Tag
	     */
		controller.leaveTag = function () {
			helperPlanoOrigZoom.data.cdTag = controller.model['cd-tag'];
		}

	    /**
	     * Leave Sequencia de Parada
	     */
		controller.leaveSequencia = function () {
			if (controller.applyLeaveSequencia) {
				var sequencia = controller.model.sequencia;

				if (sequencia) {
					controller.model['dt-prev-manut'] = sequencia['dt-inicio'];
					controller.model['dt-prev'] = sequencia['dt-termino'];
					controller.calculaDatas();
				}
			} else {
				controller.applyLeaveSequencia = true;
			}
		}

	    /**
	     * Método de leitura do regstro
	     */
		this.load = function () {
			angular.copy(model, controller.model);
			controller.desPlanoOrigSel = controller.model['des-plano-orig'];
			controller.headerTitle = $filter("orderNumberMask")(controller.model["nr-ord-produ"]) + " - " + controller.model["des-man-corr"];
		}

		/**
		 * Método para buscar as datas conforme a parada
		 */
		this.retornaDataInicioOrdem = function () {

			if (controller.applyLeaveParada) {
				if (controller.validateParada()) {

					controller.updateHelper();

					fchmiporderFactory.retornaDataInicioOrdem(controller.model['cd-parada'], function (result) {

						if (result) {
							controller.cdParada = controller.model['cd-parada'];
							controller.model['sequencia'] = mmiUtils.converteValorBranco(result.piSequencia);
							controller.model['cd-projeto'] = mmiUtils.converteValorBranco(result.pcCdProjeto);
							controller.model['dt-prev-manut'] = result.pDtInicio;
							controller.model['dt-prev'] = result.pDtTermino;
						}

						controller.calculaDatas();
					});
				}
			} else {
				if (controller.cdParadaOriginal != controller.model['cd-parada']) {
					controller.applyLeaveParada = true;
				}
			}
		}

		this.validateParada = function () {
			return controller.model['cd-parada'] != "" && controller.model['cd-parada'] != undefined && controller.model['cd-parada'] != null;
		}

		this.changeCdParada = function () {
			if (!controller.validateParada()) {
				controller.model['sequencia'] = undefined;
				controller.applyLeaveParada = true;
			}
		}

		/**
		 * Método para calcular datas
		 */
		this.calculaDatas = function () {
			if (!controller.isValidDate(controller.model['dt-prev-manut'])) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-invalid-value'),
					detail: $rootScope.i18n('msg-invalid-date')
				});
				return;
			}

			if (!controller.validateParada()) {
				var planoOrigem = controller.model['plano-orig'];

				if (planoOrigem == "manut") planoOrigem = "";

				var params = {
					'sequencia': !controller.model['sequencia'] ? 0 : controller.model['sequencia'],
					'planoOrig': planoOrigem,
					'cdManut': !controller.model['cd-manut'].cdManut ? "" : controller.model['cd-manut'].cdManut,
					'cdEquipto': controller.model['cd-equipto']['cd-equipto'],
					'cdTag': controller.model['cd-tag'],
					'cdParada': !controller.model['cd-parada'] ? "" : controller.model['cd-parada'],
					'dtPrevManut': new Date(controller.model['dt-prev-manut']),
					'dtPrev': new Date(helperOrder.data['dt-prev']),
					'durMan': controller.model['dur-man']
				}

				fchmiporderFactory.calculaDatas(params, function (datas) {
					if (datas) {
						controller.model['dt-prev-manut'] = datas.pDtManut;
						controller.model['dt-prev'] = datas.pDtPrev;
						controller.model['dt-ini-cedo'] = datas.pDtIniCedo;
						controller.model['dt-ini-tarde'] = datas.pDtIniTarde;
					}
				});
			} else {
				controller.model['dt-ini-cedo'] = controller.model['dt-prev-manut'];
				controller.model['dt-ini-tarde'] = controller.model['dt-prev-manut'];
			}
		}

		/**
	     * Método para salvar o registro
	     */
		this.save = function (again) {
			controller.close = true;
			controller.isSaveNew = again;

			if (this.isInvalidForm()) {
				return;
			}

			this.setParametersToSave();

			if (!controller.isNew) {
				if (controller.lOrdemComMatriz == true && controller.model['num-ord-inv'] > 0) {
					// envia um evento para perguntar ao usuário
					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: 'l-question', // titulo da mensagem
						text: $rootScope.i18n('l-confirm-delete-matrix'), // texto da mensagem
						cancelLabel: 'l-no', // label do botão cancelar
						confirmLabel: 'l-yes', // label do botão confirmar
						callback: function (isPositiveResult) { // função de retorno
							if (isPositiveResult) { // se foi clicado o botão confirmar
								fchmiporderFactory.updateOrder(parameters, function (result) {
									if (result[0] != undefined) {
										if (!result.$hasError) {
											controller.onSaveUpdate(true, result);
											helperOrder.data = result[0];
											if (again === false)
												$modalInstance.close();
										}
									}
								});
							}
						}
					});
				} else {
					fchmiporderFactory.updateOrder(parameters, function (result) {
						if (result[0] != undefined) {
							if (!result.$hasError) {
								controller.onSaveUpdate(true, result);
								helperOrder.data = result[0];
								if (again === false)
									$modalInstance.close();
							}
						}
					});
				}

			} else {
				if (controller.model['cd-equipto'].situacao == 1) {
					controller.createOrder(function () {
						if (controller.close == true) {
							if (again === false) {
								$modalInstance.close();
								controller.redirectToDetail();
							}

						}
					});
				} else {
					//Valida parametro para verificar se permite equipamento nao ativo
					fchmipparameterFactory.getIntParam("perm-equip", function (result) {

						if (result.pFieldValue == 1) {
							controller.createOrder(function () {
								if (controller.close == true) {
									if (again === false) {
										$modalInstance.close();
										controller.redirectToDetail();//$modalInstance.close();			        					
									}
								}
							});
						} else if (result.pFieldValue == 2) {
							$rootScope.$broadcast(TOTVSEvent.showQuestion, {
								title: 'l-question',
								text: $rootScope.i18n('l-msg-active-equipment-validation-order'),
								cancelLabel: 'l-no',
								confirmLabel: 'l-yes',
								callback: function (isPositiveResult) {
									if (isPositiveResult) {
										controller.createOrder(function () {
											if (controller.close == true) {
												if (again === false) {
													$modalInstance.close();
													controller.redirectToDetail();//$modalInstance.close();
												}
											}
										});
									}
								}
							});
						} else if (result.pFieldValue == 3) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-msg-equipment-not-active'),
								detail: $rootScope.i18n('l-msg-detail-equipment-not-active-order')
							});
						}

					});
				}
			}
		}

		this.createOrder = function (callback) {

			fchmiporderFactory.createOrder(parameters, function (result) {
				if (result[0] != undefined) {
					controller.onSaveUpdate(false, result);
					callback();
				}
				else {
					controller.close = false;
					callback();
				}
			});
		}

		this.setParametersToSave = function () {

			parameters = {
				'nr-ord-produ': controller.model["nr-ord-produ"],
				'cd-equipto': controller.model['cd-equipto']['cd-equipto'] == undefined ? "" : controller.model['cd-equipto']['cd-equipto'],
				'plano-orig': controller.model['plano-orig'],
				'cd-tag': controller.model['cd-tag'] == undefined ? "" : controller.model['cd-tag'],
				'cd-manut': controller.model['cd-manut'] == undefined ? "" : controller.model['cd-manut'].cdManut,
				'cd-tipo': controller.model['cd-tipo']['cd-tipo'],
				'cd-planejado': controller.model['cd-planejado'] == undefined ? "" : controller.model['cd-planejado'],
				'cd-equip-res': controller.model['cd-equip-res'] == undefined ? "" : controller.model['cd-equip-res'],
				'cd-sint-padr': controller.model['cd-sint-padr'] == undefined ? "" : controller.model['cd-sint-padr'],
				'prioridade': controller.model['prioridade'] == undefined ? "" : controller.model['prioridade'],
				'des-man-corr': controller.model['des-man-corr'] == undefined ? "" : controller.model['des-man-corr'],
				'narrativa': controller.model['narrativa'] == undefined ? "" : controller.model['narrativa'],
				'cod-docto-anexo': controller.model['cod-docto-anexo'] == undefined ? "" : controller.model['cod-docto-anexo'],
				'cd-causa-padr': controller.model['cd-causa-padr'] == undefined ? "" : controller.model['cd-causa-padr'],
				'cd-interv-padr': controller.model['cd-interv-padr'] == undefined ? "" : controller.model['cd-interv-padr'],
				'cd-projeto': controller.model['cd-projeto'] == undefined ? "" : controller.model['cd-projeto'],
				'urgencia': controller.model['urgencia'],
				'dt-prev': controller.model['dt-prev'],
				'dt-prev-manut': controller.model['dt-prev-manut'],
				'dt-ini-cedo': controller.model['dt-ini-cedo'],
				'dt-ini-tarde': controller.model['dt-ini-tarde'],
				'cd-parada': controller.model['cd-parada'] == undefined ? "" : controller.model['cd-parada'],
				'sequencia': controller.model['sequencia'] == undefined ? 0 : controller.model['sequencia']['sequencia'],
				'dur-man': controller.model['dur-man'],
				'cd-inspecao': controller.model['tp-manut'] == 10 ? controller.model['cd-inspecao'] : "",
				'tempo-para': controller.model['tempo-para'],
				'cod-estabel': controller.model['cod-estabel'] == undefined ? "" : controller.model['cod-estabel'],
				'cod-unid-negoc': controller.model['cod-unid-negoc'] == undefined ? "" : controller.model['cod-unid-negoc'],
				'ct-codigo': controller.model['ct-codigo'] == undefined ? "" : controller.model['ct-codigo'],
				'sc-codigo': controller.model['sc-codigo'] == undefined ? "" : controller.model['sc-codigo'],
				'ct-desp': controller.model['ct-desp'] == undefined ? "" : controller.model['ct-desp'],
				'sc-desp': controller.model['sc-desp'] == undefined ? "" : controller.model['sc-desp'],
				'num-ord-inv': controller.model['num-ord-inv'],
				'nr-ord-orig': mmiUtils.getIntValue(controller.model['nr-ord-orig']),
				'cd-tarefa-orig': mmiUtils.getIntValue(controller.model['cd-tarefa-orig'])
			}

			parameters.ttAnexo = [];

            angular.forEach(this.model.ttAnexo, function (anexo) {
                parameters.ttAnexo.push({ 'nomeAnexo': anexo.name });
            });
		}

	    /**
	     * Método para notificar o usuário da gravação do registro com sucesso
	     */
		this.onSaveUpdate = function (isUpdate, result) {
			if (!result.$hasError) {
				orderNumber = $filter("orderNumberMask")(result[0]['nr-ord-produ']);

				if (controller.isSaveNew === true) {
					controller.init();
					$('#cd-equipto').find('*').filter(':input:visible:first').focus();
					controller.desPlanoOrigSel = "";
				} else {
					helperOrder.data = angular.copy(result[0]);
				}

				if (helperOrder.data)
					helperOrder.data.reloadList = true;

				if (controller.lNaoTemMaisInvest == true && controller.lOrdemComMatriz == true) {
					/* notifica o usuario que conseguiu salvar o registro */
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('msg-warning-invest'),
						detail: $rootScope.i18n('msg-warning-order-invest')
					});
				}

				// notifica o usuario que conseguiu salvar o registro
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: (isUpdate ? $rootScope.i18n('msg-order-update') : $rootScope.i18n('msg-order-create')),
					detail: (isUpdate ? $rootScope.i18n('msg-success-order-update-number', orderNumber) : $rootScope.i18n('msg-success-order-created-number', orderNumber))
				});
			}
		}

		/*Busca centro de custo da conta ordem*/
		this.onLeaveCtCodigo = function () {

			var ctCodigo;

			if (controller.model.estado >= 7) {
				controller.logCtCodigo = false;
				return;
			}

			if (controller.model['ct-codigo']) {
				ctCodigo = controller.model['ct-codigo'].replace(new RegExp(/\./g), "");
			}

			params = {
				'epCodigo': controller.model['ep-codigo'],
				'cEstabel': controller.model['cod-estabel'],
				'cConta': ctCodigo,
				'dtManut': controller.model['dt-manut']
			}

			fchmiporderFactory.verificaUtilizacaoLeaveCusto(params, function (result) {
				if (result) {
					controller.logCtCodigo = result.logCusto;
					if (result.logCusto == false) {
						controller.model['sc-codigo'] = undefined;
					}

				}
			});

		}

		/*Busca centro de custo da conta despesa*/
		this.onLeaveCtDesp = function () {

			var ctDesp;

			if (controller.model.estado >= 7) {
				controller.logCtDesp = false;
				return;
			}

			if (controller.model['ct-desp']) {
				ctDesp = controller.model['ct-desp'].replace(new RegExp(/\./g), "");
			}

			if (controller.model.estado > 1) {
				controller.logCtDesp = false;
				return;
			}

			if (controller.model['cod-estabel'] === undefined) {
				return;
			}

			params = {
				'epCodigo': controller.model['ep-codigo'],
				'cEstabel': controller.model['cod-estabel'],
				'cConta': ctDesp,
				'dtManut': controller.model['dt-manut']
			}

			fchmiporderFactory.verificaUtilizacaoLeaveCusto(params, function (result) {
				if (result) {
					controller.logCtDesp = result.logCusto;
					if (result.logCusto == false) {
						controller.model['sc-desp'] = undefined;
					}
				}
			});

		}

		this.onLeaveCodEstabel = function () {

			params = {
				'nrOrd': controller.model['nr-ord-produ'],
				'ordEstado': controller.model.estado,
			}

			fchmiporderFactory.validaEstabelecimento(params, function (result) {
				if (result) {
					controller.logDisable = result.lDesabilita;
				}
			});

		}



	    /**
	     * Verifica Contas Investimento
	     */


		this.verificaContasOrdemInvest = function () {
			var params = {
				'iNrOrdProdu': controller.model['nr-ord-produ'],
				'iNrOrdemInvest': controller.model['num-ord-inv'] != undefined ? controller.model['num-ord-inv'] : 0,
				'cAcao': 'Update'
			}

			if (controller.model['num-ord-inv'] == "" || controller.model['num-ord-inv'] == undefined) {
				controller.model['num-ord-inv'] = 0;
			}

			fchmiporderFactory.verificaContasOrdemInvest(params, function (result) {
				if (!result.$hasError) {
					if (controller.model['num-ord-inv'] != 0) {
						controller.exibeContaDespesa = result.logHabilitaCtDesp;
						controller.model['ct-desp'] = result.cCtDesp;
						controller.model['sc-desp'] = result.cScDesp;
						if (result.cUnidNegocOm != "") {
							controller.model['cod-unid-negoc'] = result.cUnidNegocOm;
						}
						/* Variavel para controlar se a ordem tem matriz, se tem irá questionar se deseja excluir */
						controller.lOrdemComMatriz = result.lOrdemComMatriz;
						controller.alterouContaInvest = true;
						controller.logCtDesp = result.utilizaCentroCusto;
					} else {
						if (result.lNaoTemMaisInvest == true || controller.alterouContaInvest == true) {
							controller.lNaoTemMaisInvest = result.lNaoTemMaisInvest;
							if (controller.model.estado == 1 || controller.model.estado == 2) {
								controller.exibeContaDespesa = true;
							}
							controller.alterouContaInvest = false;
							controller.leaveCdTipo();
							/* Variavel para controlar a exibicao de mensagem de advertencia */
							controller.lNaoTemMaisInvest = result.lNaoTemMaisInvest;
							/* Variavel para controlar se a ordem tem matriz, se tem matriz e a ordem de investimento estiver
							 * estiver zerada, sera exibida uma mensagem informando que a matriz da ordem não será alterada */
							controller.lOrdemComMatriz = result.lOrdemComMatriz;
						}
					}
				}
			});
		}


		/**
	     * Método para verificar se o formulario é invalido
	     */
		this.isInvalidForm = function () {
			var messages = [];
			var isInvalidForm = false;

			if (this.model['cd-equipto'] == undefined || this.model['cd-equipto'].length === 0) {
				isInvalidForm = true;
				messages.push('l-equipment');
			}

			if (this.model['cd-tipo'] == undefined || this.model['cd-tipo'].length === 0) {
				isInvalidForm = true;
				messages.push('l-maintenance-type');
			}

			if (isInvalidForm) {
				angular.forEach(messages, function (item) {
					var warning = '';
					warning = $rootScope.i18n('l-field');
					warning = warning + ' ' + $rootScope.i18n(item);
					warning = warning + ' ' + $rootScope.i18n('l-is-required');
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: warning
					});
				});
			}
			return isInvalidForm;
		}


		/** upload **/

		controller.saveUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/uploadFile';


		this.onSelect = function () {
			$scope.$apply(function () {
				controller.carregandoArquivos = true;
			});

			angular.forEach(controller.model.ttAnexo, function (result) {
                result.name = result.name.replace(/&amp;/g, '&');
            });
		}

		this.onSuccess = function (value) {
			$scope.$apply(function () {
				controller.carregandoArquivos = false;
			});
			controller.model.ttAnexo = controller.model.files;
			controller.removerDeleteGrid();
		}

		this.onError = function (value) {
			$scope.$apply(function () {
				controller.carregandoArquivos = false;
			});
			controller.model.ttAnexo = undefined;

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'error',
				title: $rootScope.i18n('msg-anexo'),
				detail: $rootScope.i18n('msg-file-send-error')
			});
		}

		this.remover = function () {
			controller.habilitarSalvar();

		};

		this.uploadCompleto = function () {
			controller.removerDeleteGrid();
		};

		this.upload = function () {
			controller.removerDeleteGrid();
		};

		controller.removerDeleteGrid = function () {
			if ($('.k-delete')) {
				$('.k-delete').remove();
			}
		};

		this.onCancel = function () {
			controller.habilitarSalvar();
		};

		controller.habilitarSalvar = function () {
			$scope.$apply(function () {
				controller.carregandoArquivos = false;
			});

			if (controller.model.files != undefined) {
				var carregandoArquivos = controller.model.files.filter(function (element) {
					return element.isntUploaded;
				});
				if (carregandoArquivos.length > 0) {
					$scope.$apply(function () {
						controller.carregandoArquivos = true;
					});
				}
			}

		};

	    /**
	     * Redireciona para a tela de detalhar
	     */
		this.redirectToDetail = function () {
			$location.path('dts/mmi/order/detail/' + helperOrder.data['nr-ord-produ']);
		}

		this.updateHelper = function () {
			if (helperOrder.data && helperOrder.data['cd-parada'] != undefined) {
				helperOrder.data['cd-parada'] = controller.model['cd-parada'];
			}
		}

		controller.atualizaOrdemOrigem = function () {
			helperOrder.data.nrOrdemFiltro = mmiUtils.getIntValue(controller.model['nr-ord-orig']);
			controller.model['cd-tarefa-orig'] = 0;
		}

	    /**
	     * Valida se data é valida
	     */
		this.isValidDate = function (data) {
			if (data == null || data == undefined) {
				return false;
			}
			return true;
		}

	    /**
	     * Seta descrição da classe de manutenção
	     */
		this.setClasse = function () {
			var desClasse;

			switch (controller.model['tp-manut']) {
				case 1:
					desClasse = $rootScope.i18n('l-systematic2', [], 'dts/mmi');
					break;
				case 2:
					desClasse = $rootScope.i18n('l-predictive', [], 'dts/mmi');
					break;
				case 3:
					desClasse = $rootScope.i18n('l-calibration', [], 'dts/mmi');
					break;
				case 4:
					desClasse = $rootScope.i18n('l-lubrification', [], 'dts/mmi');
					break;
				case 5:
					desClasse = $rootScope.i18n('l-productive', [], 'dts/mmi');
					break;
				case 6:
					desClasse = $rootScope.i18n('l-general-services', [], 'dts/mmi');
					break;
				case 7:
					desClasse = $rootScope.i18n('l-palleative', [], 'dts/mmi');
					break;
				case 8:
					desClasse = $rootScope.i18n('l-remedial', [], 'dts/mmi');
					break;
				case 9:
					desClasse = $rootScope.i18n('l-others', [], 'dts/mmi');
					break;
				case 10:
					desClasse = $rootScope.i18n('l-inspection', [], 'dts/mmi');
					break;
				case 11:
					desClasse = $rootScope.i18n('l-investigation', [], 'dts/mmi');
					break;
			};

			controller.model['des-classe'] = desClasse;
		}

		this.setFocus = function () {
			$timeout(function () {
				$('#cd-equipto').find('*').filter(':input:visible:first').focus();
			}, 500);
		}


		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helperPlanoOrigZoom.data = {};
			controller.plans = {};

			controller.isNew = true;
			controller.leaveManut = false;

			if (model == 'new' || controller.isSaveNew) {
				helperOrder.data = undefined;
				this.model = {};
				controller.headerTitle = $rootScope.i18n('l-new-order');
				this.breadcrumbTitle = this.headerTitle;
				this.idDisabled = false;
				this.model['dt-prev-manut'] = new Date();
				controller.applyLeaveEquipto = true;
				controller.applyLeaveManut = true;
				controller.applyLeaveTipoManut = true;
				controller.applyLeaveParada = true;
				controller.applyLeaveSequencia = true;
				controller.isModel = true;
				controller.removeUrl = ' ';
				model = [];
			} else if (model) {
				this.load();
				controller.isNew = false;
				controller.applyLeaveEquipto = false;
				controller.applyLeaveTipoManut = false;
				controller.applyLeaveUrgency = true;
				controller.applyLeaveManut = !controller.model['cd-manut'] ? true : false;
				controller.applyLeaveParada = false;
				controller.applyLeaveSequencia = false;
				this.breadcrumbTitle = $rootScope.i18n('l-edit');
				this.idDisabled = true;
				controller.isModel = true;
				controller.onLeaveCtDesp();
				controller.onLeaveCtCodigo();

				if (controller.model.estado < 3) {
					controller.onLeaveCodEstabel();
				} else {
					controller.logDisable = true;
				}

				controller.urgencies = [{ value: 1, label: $rootScope.i18n('l-very-urgent') },
				{ value: 2, label: $rootScope.i18n('l-urgent') },
				{ value: 3, label: $rootScope.i18n('l-not-urgent') }];

				controller.urgency = angular.copy(controller.model['urgencia']);

				controller.cdParadaOriginal = controller.model['cd-parada'];
				controller.cdParada = controller.model['cd-parada'];

				fchmatIntegrationAccountCostCenterFactory.getIntegrationAccountCostCenterFilter({
					company: controller.model['ep-codigo'],
					dateMovto: controller.model['dt-manut'],
					site: controller.model['cod-estabel'],
					module: 'CEP'
				}, function (result) {
					controller.plans.accountPlan = result[0].accountPlan;
					controller.plans.centerCostPlan = result[0].centerCostPlan;

					controller.integrationAccountInit = {
						filters: {
							'cod_modul_dtsul': 'CEP',
							'cod_plano_cta_ctbl': controller.plans.accountPlan
						}
					};

					controller.costCenterInit = {
						filters: {
							'cod_plano_ccusto': controller.plans.centerCostPlan
						}
					};
				});

				controller.investmentOrderInit = {
					filter: { 'ep-codigo': controller.model['ep-codigo'] },
					method: 'gotoempresaordem'
				};

				controller.limpaPontosContas();
				controller.converteValorBranco();

				if ((controller.model['num-ord-inv'] != 0 || controller.model['num-ord-inv'] != "") && controller.model.estado > 2) {
					controller.exibeContaDespesa = false;
				}

				helperOrder.data.nrOrdemFiltro = mmiUtils.getIntValue(controller.model['nr-ord-orig']);
			}

			controller.setFocus();

			controller.isSaveNew = false;
		}

		controller.limpaPontosContas = function () {
			controller.model['ct-codigo'] = mmiUtils.removePontos(controller.model['ct-codigo']);
			controller.model['sc-codigo'] = mmiUtils.removePontos(controller.model['sc-codigo']);
			controller.model['ct-desp'] = mmiUtils.removePontos(controller.model['ct-desp']);
			controller.model['sc-desp'] = mmiUtils.removePontos(controller.model['sc-desp']);
		}

		controller.converteValorBranco = function () {
			controller.model['cd-tag'] = mmiUtils.converteValorBranco(controller.model['cd-tag']);
			controller.model['cd-planejado'] = mmiUtils.converteValorBranco(controller.model['cd-planejado']);
			controller.model['cd-equip-res'] = mmiUtils.converteValorBranco(controller.model['cd-equip-res']);
			controller.model['cd-sint-padr'] = mmiUtils.converteValorBranco(controller.model['cd-sint-padr']);
			controller.model['cd-causa-padr'] = mmiUtils.converteValorBranco(controller.model['cd-causa-padr']);
			controller.model['cd-interv-padr'] = mmiUtils.converteValorBranco(controller.model['cd-interv-padr']);
			controller.model['cd-manut'] = mmiUtils.converteValorBranco(controller.model['cd-manut']);
			controller.model['cd-inspecao'] = mmiUtils.converteValorBranco(controller.model['cd-inspecao']);
			controller.model['cd-parada'] = mmiUtils.converteValorBranco(controller.model['cd-parada']);
			controller.model['sequencia'] = mmiUtils.converteValorBranco(controller.model['sequencia']);
			controller.model['cd-projeto'] = mmiUtils.converteValorBranco(controller.model['cd-projeto']);
		}

		this.closeEdit = function () {
			controller.model['cd-parada'] = controller.cdParadaOriginal;
			controller.updateHelper();
			if (helperOrder.data) helperOrder.data.nrOrdemFiltro = undefined;
			$modalInstance.dismiss();
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			helperOrder.data.nrOrdemFiltro = undefined;
			$modalInstance.dismiss('cancel');
		});

	}

	index.register.service('helperPlanoOrigZoom', function () {
		return {
			data: {}
		};
	});


	index.register.controller('mmi.order.EditCtrl', orderEditCtrl);

});