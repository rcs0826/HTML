define(['index',
	'/dts/mmi/js/dbo/bomn134.js',
	'/dts/mmi/js/dbo/bomn136.js',
	'/dts/mmi/js/dbo/bomn131.js',
	'/dts/mmi/js/dbo/bomn132.js',
	'/dts/mmi/js/dbo/bomn160.js',
	'/dts/mmi/html/order/task/task-list.js',
	'/dts/mmi/html/order/task/task-detail.js',
	'/dts/mmi/html/order/task/task-edit.js',
	'/dts/mmi/html/order/laborreport/laborreport-edit.js',
	'/dts/mce/js/zoom/usuar-mater.js',
	'/dts/mmi/html/order/specialty/specialty-list.js',
	'/dts/mmi/html/order/specialty/specialty-edit.js',
	'/dts/mmi/html/order/materials/materials-list.js',
	'/dts/mmi/html/order/shift/shift-list.js',
	'/dts/mmi/html/order/materials/materials-edit.js',
	'/dts/mmi/html/order/epi/epi-list.js',
	'/dts/mmi/html/order/method/method-list.js',
	'/dts/mmi/html/order/tool/tool-list.js',
	'/dts/mmi/html/order/tool/tool-edit.js',
	'/dts/mmi/html/order/history/history-list.js',
	'/dts/mmi/html/order/task/tabs/task-report.js',
	'/dts/mmi/html/order/pert/pert-list.js',
	'/dts/mmi/html/order/task/tabs/task-history.js'
], function (index) {

	/**
	 * Controller Detail 
	 */
	orderDetailCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$state',
		'$location',
		'$filter',
		'$modal',
		'totvs.app-main-view.Service',
		'mmi.bomn134.Service',
		'mmi.bomn136.Service',
		'mmi.bomn131.Service',
		'helperOrder',
		'TOTVSEvent',
		'fchmip.fchmiporder.Factory',
		'fchmip.fchmipparameter.Factory',
		'fchmcd.fchmcd0001.Factory',
		'helperHistory'
	];

	function orderDetailCtrl($rootScope,
		$scope,
		$stateParams,
		$state,
		$location,
		$filter,
		$modal,
		appViewService,
		bomn134Service,
		bomn136Service,
		bomn131Service,
		helperOrder,
		TOTVSEvent,
		fchmiporderFactory,
		fchmipparameterFactory,
		fchmcd0001Factory,
		helperHistory) {

		controller = this;
		detailOrderCtrl = this;

		/**
		 * Ordem de manutenção
		 */
		this.model = {};

		/**
		 * Número da ordem de manutenção
		 */
		this.orderNumber = 0;

		/**
		 * Lista de tarefas
		 */
		this.listOfTasks = [];

		/**
		 * Indica se a tarefa é nova
		 */
		this.isNewTask;

		/**
		 * Indica se mostra datas da ordem
		 */
		this.showOrderDates = false;

		/**
		 * Indica se mostra contabilização
		 */
		this.showAccounting = false;

		/**
		 * Indica se mostra plano de manutenção
		 */
		this.showOrderPlan = false;

		/**
		 * Indica se mostra plano de parada
		 */
		this.showStopPlan = false;

		/**
		 * Indica se mostra manutenção de origem
		 */
		this.showOriginMaintenance = false;

		/**
		 * Indica se mostra mais informações da ordem
		 */
		this.showOrderMoreInfo = false;

		this.tpManut = "";

		this.closeOthers = false;
		$scope.oneAtATime = true;

		$scope.status = {
			isFirstOpen: true,
			isFirstDisabled: false
		};

		this.showTasks = true;

		this.showShift = false;

		this.showEpi = false;

		this.showMethod = false;

		this.ttSelecao = {};

		this.showOrderDetail = true;

		this.siteCode;

		this.reloadSpecialty = false;

		this.reloadMaterials = false;

		this.reloadEpi = false;

		this.reloadTools = false;

		this.reloadShift = false;

		this.reloadMethod = false;

		this.reloadPert = false;

		this.reloadHistory = false;

		// *************************************************************************************
		// *** FUNÇÕES - ORDEM DE MANUTENÇÃO
		// *************************************************************************************

		/**
		 * Método de leitura do registro
		 */
		this.load = function () {
			controller.model = helperOrder.data;
			controller.tpManut = controller.model["tp-manut"];
			controller.validateShift();
			controller.orderNumber = controller.model['nr-ord-produ'];
			controller.showOrderMoreInfo = controller.model['narrativa'] !== "";
			controller.downloadUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/downloadFile?filename=' + controller.model["cod-docto-anexo"];
			controller.listaAnexos = [];
			controller.downloadUrl = controller.downloadUrl.split("+").join("%2B");
			controller.downloadUrl = controller.downloadUrl.split("#").join("%23");
			controller.downloadUrl = controller.downloadUrl.split("&").join("%26");
			controller.saveUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/uploadFile';
			this.usuarioLogado = $rootScope.currentuser.login;
			this.buscarAnexos();
		}

		this.buscarAnexos = function () {
			fchmiporderFactory.buscarAnexos(controller.model['nr-ord-produ'], function (result) {
				if (result && result.length > 0) {
					controller.listaAnexos = result;
				}
			});
		}

		/**
		 * Método de busca da matris de unidade negocio
		 */
		this.openUnidNegoc = function () {

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/order/order.business.unit.html',
				controller: 'mmi.order.BusinesUnitCtrl as businessUnitCtrl',
				backdrop: 'static',
				keyboard: true,
				size: 'lg',
				resolve: {
					model: function () {
						return controller.model;
					}
				}
			});
			modalInstance.result.then(function () {
				angular.element('totvs-editable').popover('destroy');
			}, function () {
				angular.element('totvs-editable').popover('destroy');
			});
		}

		/**
		 * Carrega os dados da ordem de manutenção
		 */
		this.loadData = function (id) {
			if (isNaN(id)) {
				controller.showOrderDetail = false;
				return;
			}

			controller.ttSelecao = {
				startAt: 1,
				filtro: 1,
				nrOrdProdu: id
			};

			fchmiporderFactory.getListOrder(controller.ttSelecao, function (result) {
				if (result && result.ttOrdem) {

					if (result.ttOrdem.length > 0) {
						controller.showOrderDetail = true;
						helperOrder.data = result.ttOrdem[0];
						helperOrder.data.showButton = undefined;
						$rootScope.$broadcast('getListOrder');
						controller.load();
					} else {
						controller.showOrderDetail = false;
					}
				}
			});
		}

		/**
		 * Realiza a copia da ordem de manutenção
		 */
		this.openOrderCopy = function () {

			var nrOrderMasked = $filter('orderNumberMask')(String(controller.model['nr-ord-produ']));

			if (controller.model["cd-manut"] == null || controller.model["cd-manut"] == undefined || controller.model["cd-manut"] == "") {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-question',
					text: $rootScope.i18n('msg-question-order-copy', [nrOrderMasked]),
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							controller.copy(controller.model["nr-ord-produ"], 1);
						}
					}
				});
			} else {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mmi/html/order/order.copy.html',
					controller: 'mmi.order.CopyCtrl as controller',
					size: 'md',
					backdrop: 'static',
					keyboard: true,
					resolve: {
						model: function () {
							return controller.model;
						}
					}
				});

				modalInstance.result.then(function () {
					controller.copy(controller.model["nr-ord-produ"], controller.model.acao);
				});
			}
		}

		/**
		 * Remove ordem de manutenção
		 */
		this.remove = function (value) {

			var nrOrderMasked = $filter('orderNumberMask')(String(controller.model['nr-ord-produ']));

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('l-confirm-delete-record', [nrOrderMasked]),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function (isPositiveResult) {
					if (isPositiveResult) {

						fchmiporderFactory.deleteOrder(controller.model['nr-ord-produ'], function (result) {
							if (!result.$hasError) {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success',
									title: $rootScope.i18n('msg-order-delete'),
									detail: $rootScope.i18n('msg-success-order-delete')
								});
								$state.go('dts/mmi/order.start');
								helperOrder.data.reloadList = true;
							}
						});
					}
				}
			});
		}

		/**
		 * Libera ordem de manutenção
		 */
		this.release = function (value) {
			fchmiporderFactory.releaseOrder(value['nr-ord-produ'], function (result) {
				if (!result.$hasError) {
					if (!result.hasWarning) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-order-release'),
							detail: $rootScope.i18n('l-order-release-success')
						});
					}

					if (result.ttOrdem) {
						angular.copy(result.ttOrdem[0], value);
					}
				}
			});
		}

		/**
		 * Bloqueia ordem de manutenção
		 */
		this.block = function (value) {
			fchmiporderFactory.blockOrder(value['nr-ord-produ'], function (result) {
				if (!result.$hasError) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-order-block'),
						detail: $rootScope.i18n('l-order-block-success')
					});
					angular.copy(result.ttOrdem[0], value);
				}
			});
		}

		/**
		 * Executa a tela para Realizar a Suspensao/Reativacao
		 */
		this.openOrderSuspend = function (value) {

			var model = value;

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/order/order.suspend.html',
				controller: 'mmi.order.SuspendCtrl as controller',
				size: 'md',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return model;
					}
				}
			});

			modalInstance.result.then(function () {
				value["estado-om"] = model["estado-om"];
				if (model['estado-om'] === 3) {
					model.situacao = 3;
				} else {
					value.situacao = model.estado === 1 ? 1 : 2;
				}

				this.reloadHistory = true;
				controller.loadOrderHistory();
				$rootScope.$broadcast('loadOrder');
			});
		}

		this.loadOrderHistory = function () {

			fchmiporderFactory.getOrderHistory(detailOrderCtrl.model['nr-ord-produ'], function (result) {

				$scope.listOfHistory = helperHistory.data;
				$scope.listOfHistory.length = 0;

				if (result) {
					angular.forEach(result, function (value) {
						value.data = $filter('date')(value.data, 'dd/MM/yyyy'),
							$scope.listOfHistory.push(value);
					});
				}
			});

			controller.load();
		}

		/**
		 * Mostra plano de manutenção
		 */
		this.openOrderPlan = function () {
			controller.showOrderPlan = !controller.showOrderPlan;
		}

		/**
		 * Mostra datas da ordem de manutenção
		 */
		this.openOrderDates = function () {
			controller.showOrderDates = !controller.showOrderDates;
		}

		/**
		 * Mostra dados de contabilização
		 */
		this.openAccounting = function () {
			controller.showAccounting = !controller.showAccounting;
		}

		/**
		 * Mostra plano de parada
		 */
		this.openStopPlan = function () {
			controller.showStopPlan = !controller.showStopPlan;
		}

		/**
		 * Mostra manutenção de origem
		 */
		this.openOriginMaintenance = function () {
			controller.showOriginMaintenance = !controller.showOriginMaintenance;
		}

		/**
		 * Mostra mais informações da ordem de manutenção
		 */
		this.openOrderMoreInfo = function () {
			controller.showOrderMoreInfo = !controller.showOrderMoreInfo;
		}

		/**
		 * Valida se habilita aba para informar o turno
		 */
		this.validateShift = function () {
			fchmipparameterFactory.getIntParam("tp-turno", function (result) {
				if (result.pFieldValue == 2) {
					controller.showShift = true;
				} else {
					controller.showShift = false;
				}
			});
		}

		/**
		 * Abre tela de edição da ordem
		 */
		this.openOrderEdit = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/order/order.edit.html',
				controller: 'mmi.order.EditCtrl as controller',
				size: 'lg',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return controller.model;
					}
				}
			});

			modalInstance.result.then(function () {
				angular.copy(helperOrder.data, controller.model);
				controller.loadOrderHistory();

			}, function () {
				helperOrder.data.nrOrdemFiltro = undefined;
			});
		}

		/**
		 * Redireciona para a tela de detalhar
		 */
		this.redirectToDetail = function () {
			$location.path('dts/mmi/order/detail/' + helperOrder.data['nr-ord-produ']);
		}

		/**
		 * Realiza a Copia da Ordem
		 */
		this.copy = function (nrOrdem, acao) {

			parameters = {
				'nr-ord-produ': nrOrdem,
				'iAcao': parseInt(acao)
			}

			fchmiporderFactory.copyOrder(parameters, function (result) {

				if (!result.$hasError) {
					if (result.length > 0) {
						helperOrder.data = result[0];
						helperOrder.data.showButton = undefined;
						controller.redirectToDetail();
						var nrOrderMasked = $filter('orderNumberMask')(String(helperOrder.data['nr-ord-produ']));
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('msg-order-create'),
							detail: $rootScope.i18n('msg-success-order-created-number', nrOrderMasked)
						});

					}
				}
			});
		}

		controller.openOrderClose = function (order) {
			var model = {};
			model.order = order;

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/order/order.close.html',
				controller: 'mmi.order.CloseCtrl as closeCtrl',
				size: 'lg',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return model;
					}
				}
			});

			modalInstance.result.then(function () {
				angular.copy(model.result, order);
				$rootScope.$broadcast('loadOrder');
			});
		}


		this.onSuccess = function () {
			if ($('.template-upload .k-file-success')) {
				$('.template-upload ').remove();
				$('.k-file-success').remove();
				$('.k-upload-files').remove();
			}
		};

		this.onError = function () {
			controller.ttAnexo = undefined;
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'error',
				title: $rootScope.i18n('msg-anexo'),
				detail: $rootScope.i18n('msg-file-send-error')
			});
		};

		this.onSelect = function (value) {
			controller.parametros = {};
			controller.parametros.ttAnexo = [];
			controller.parametros.pNrOrdProdu = controller.model['nr-ord-produ'];

			angular.forEach(value.files, function (anexo) {
				controller.parametros.ttAnexo.push({ 'nomeAnexo': anexo.name });
			});
		};

		this.onComplete = function () {
			controller.salvarAnexos();
		};

		this.salvarAnexos = function () {
			fchmiporderFactory.salvarAnexos(controller.parametros, function (result) {
				if (result != undefined) {
					controller.listaAnexos = result;
					controller.parametros.ttAnexo = [];
				}
			});
		}

		this.removerAnexo = function (itemSelecionado) {
			controller.parametros = {};
			controller.parametros.numId = itemSelecionado.numId;
			controller.parametros.pNrOrdProdu = controller.model['nr-ord-produ'];
			controller.confirmaRemoverAnexo(itemSelecionado);
		};

		this.confirmaRemoverAnexo = function (itemSelecionado) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('l-confirm-delete-record', [itemSelecionado.nomeAnexo]),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						fchmiporderFactory.removerAnexo(controller.parametros, function (result) {
							if (result != undefined) {
								controller.listaAnexos = removerPorId(controller.listaAnexos, itemSelecionado.numId);
							}
						});
					}
				}
			});
		};

		function removerPorId(listaAnexos, id) {
			return listaAnexos.filter(function (novaLista) {
				return novaLista.numId !== id;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			if (appViewService.startView($rootScope.i18n('l-maintenance-order'), 'mmi.order.DetailCtrl', controller)) {
			}

			helperOrder.data.showButton = undefined;

			previousView = appViewService.previousView;

			if (previousView.controller == "mmi.order.ListCtrl") {
				helperOrder.data.reloadList = false;
				controller.showOrderDetail = true;
				controller.load();
			} else {
				controller.loadData($stateParams.id);
			}
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			controller = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

	}

	// *********************************************************************************
	// *** Controller da Matriz de Unidade de Negocio
	// *********************************************************************************

	orderBusinesUnitCtrl.$inject = [
		'$modalInstance',
		'$scope',
		'$rootScope',
		'model',
		'fchmip.fchmiporder.Factory',
		'$filter',
		'TOTVSEvent'];

	function orderBusinesUnitCtrl($modalInstance,
		$scope,
		$rootScope,
		model,
		fchmiporderFactory,
		$filter,
		TOTVSEvent) {

		var businessUnitCtrl = this;

		businessUnitCtrl.canEdit = true;
		businessUnitCtrl.ttBusinesUnit = [];

		businessUnitCtrl.model = model;

		this.loadRecords = function () {
			fchmiporderFactory.getBusinesUnitOM(businessUnitCtrl.model['nr-ord-produ'], function (result) {
				if (result) {
					angular.forEach(result.ttBusinessUnit, function (value) {
						businessUnitCtrl.ttBusinesUnit.push(value);
					});
					businessUnitCtrl.canEdit = result.lPermiteAlteracao;
				}
			});
		}

		this.save = function () {
			var percentual = 0;
			var total = 0;
			var params = {};
			var matriz = [];
			var percIncorreto = false;

			angular.forEach(businessUnitCtrl.ttBusinesUnit, function (value) {
				percentual = String(value['val-perc-unid-negoc']).replace(",", ".");
				percentual = Number.parseFloat(percentual);
				if (percentual < 0) {
					percIncorreto = true;
				}
				if (percentual > 0) {
					total += percentual;
					matriz.push(value);
				}
			});

			if ((total !== 0 && total !== 100) || percIncorreto) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: ($rootScope.i18n('l-business-unit-matrix')),
					detail: ($rootScope.i18n('msg-total-percent-100'))
				});
			} else {

				params.pNrOrdProdu = businessUnitCtrl.model['nr-ord-produ'];
				params.ttUnidNegocioOMAux = matriz;

				fchmiporderFactory.createMatrix(params, function (result) {
					if (!result.$hasError) {
						if (total > 0) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: ($rootScope.i18n('l-business-unit-matrix')),
								detail: ($rootScope.i18n('msg-matrix-generated-success'))
							});
						}
						$modalInstance.close();
					}
				});
			}
		}

		this.cancel = function () {
			$modalInstance.close();
		}

		this.init = function () {
			businessUnitCtrl.loadRecords();
		}

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});

		if ($rootScope.currentuserLoaded) { this.init(); }
	}

	index.register.service('helperHistory', function () {
		return {
			data: []
		};
	});

	index.register.controller('mmi.order.DetailCtrl', orderDetailCtrl);
	index.register.controller('mmi.order.TaskDetailCtrl', taskDetailCtrl);
	index.register.controller('mmi.order.TaskEditCtrl', taskEditController);
	index.register.controller('mmi.order.LaborReportCtrl', laborReportCtrl);
	index.register.controller('mmi.order.BusinesUnitCtrl', orderBusinesUnitCtrl);
});