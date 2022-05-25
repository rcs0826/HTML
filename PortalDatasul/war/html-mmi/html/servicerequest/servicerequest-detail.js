define(['index',
	'/dts/mmi/js/dbo/bomn150.js',
	'/dts/mmi/html/servicerequest/servicerequest.add.js'
], function (index) {

	/**
	 * Controller Detail
	 */
	serviceRequestDetailCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$state',
		'$location',
		'totvs.app-main-view.Service',
		'mmi.bomn150.Service',
		'helperServiceRequest',
		'helperEquipment',
		'helperTag',
		'TOTVSEvent',
		'mmi.servicerequest.modal',
		'fchmip.fchmipservicerequest.Factory',
		'$timeout'
	];

	function serviceRequestDetailCtrl(
		$rootScope,
		$scope,
		$state,
		$location,
		appViewService,
		bomn150Service,
		helperServiceRequest,
		helperEquipment,
		helperTag,
		TOTVSEvent,
		NewServiceModal,
		fchmipservicerequest,
		$timeout
	) {

		controller = this;
		this.model = {};
		this.showRequestDates = true;
		this.showValuesBudgets = false;
		this.showOriginMaintenance = false;
		this.showNarrative = false;
		this.mostrarAnexos = false;
		this.showCancellReason = true;
		this.mostrarAguardo = true;
		this.loginCurrentUser = $rootScope.currentuser.login;
		this.isDisabledRemove = false;
		this.isDisabledEdit = false;
		$scope.listaAnexos = [];
		this.saveUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmipservicerequest/uploadFile';

		$scope.oneAtATime = true;
		$scope.status = {
			isFirstOpen: true,
			isFirstDisabled: false
		};

		this.delete = function () {

			if (!controller.isDisabledRemove) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-question',
					text: $rootScope.i18n('l-confirm-delete-operation'),
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							bomn150Service.deleteRecord(controller.model['nr-soli-serv'], function (result) {
								if (!result.$hasError) {
									$rootScope.$broadcast(TOTVSEvent.showNotification, {
										type: 'success',
										title: $rootScope.i18n('msg-service-request-delete'),
										detail: $rootScope.i18n('msg-success-service-request-delete')
									});
									$state.go('dts/mmi/servicerequest.start');
									// Quando remove um registro, recarrega a lista
									helperServiceRequest.data.reloadList = true;
								}
							});
						}
					}
				});
			}
		}

		this.openEdit = function (value) {
			if (!controller.isDisabledEdit)
				NewServiceModal.open(
					{ value: value, edit: true }
				).then(function () {
					controller.init();
				});
		}

		this.openOM = function () {
			$location.path('dts/mmi/orderdetailing/' + controller.model['nr-ord-produ']);
		}

		this.load = function (id) {
			controller.model = {}
			controller.model = helperServiceRequest.data;
			controller.downloadUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmipservicerequest/downloadFile?filename='; //+ controller.model["cod-docto-anexo"];
			if (controller.model['des-narrativa'] !== undefined && controller.model['des-narrativa'] !== '') {
				controller.showNarrative = true;
			}
		}

		this.buscarAnexos = function () {
			fchmipservicerequest.buscarAnexos(controller.model['nr-soli-serv'], function (result) {
				if (result && result.length > 0) {
					$scope.listaAnexos = result;
					controller.mostrarAnexos = true;
				} else {
					$scope.listaAnexos = [];
					controller.mostrarAnexos = false;
				}
			});
		}

		this.openRequestDates = function () {
			controller.showRequestDates = !controller.showRequestDates;
		}

		this.openValuesBudgets = function () {
			controller.showValuesBudgets = !controller.showValuesBudgets;
		}

		this.openOriginMaintenance = function () {
			controller.showOriginMaintenance = !controller.showOriginMaintenance;
		}

		this.openNarrative = function () {
			controller.showNarrative = !controller.showNarrative;
		}

		this.abrirAnexos = function () {
			controller.mostrarAnexos = !controller.mostrarAnexos;
		}

		this.openCancell = function () {
			controller.showCancellReason = !controller.showCancellReason;
		}

		this.abrirAguardo = function () {
			controller.mostrarAguardo = !controller.mostrarAguardo;
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

		this.removerAnexo = function (itemSelecionado) {
			controller.parametros = {};
			controller.parametros.numId = itemSelecionado.numId;
			controller.parametros.pNrSoliServ = controller.model['nr-soli-serv'];
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
						fchmipservicerequest.removerAnexo(controller.parametros, function (result) {
							if (!result.$hasError) {
								$scope.listaAnexos = removerPorId($scope.listaAnexos, itemSelecionado.numId);
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

		this.onSelect = function (value) {
			controller.parametros = {};
			controller.parametros.ttAnexo = [];
			controller.parametros.pNrSoliServ = controller.model['nr-soli-serv'];

			angular.forEach(value.files, function (anexo) {
					controller.parametros.ttAnexo.push({ 'nomeAnexo': anexo.name });
			});
			
		};		

		this.onComplete = function () {			
			controller.salvarAnexos();			
		};

		this.salvarAnexos = function () {
			fchmipservicerequest.salvarAnexos(controller.parametros, function (result) {
				if (result != undefined) {
					$scope.listaAnexos = result;
					controller.parametros.ttAnexo = [];
				}
			});
		}

		this.init = function () {
			if (appViewService.startView($rootScope.i18n('l-service-request'), 'mmi.servicerequest.DetailCtrl', controller)) {
				// se é a abertura da tab, implementar aqui inicialização do controller
			}

			previousView = appViewService.previousView;
			helperServiceRequest.data.reloadList = true;
			controller.isDisabledEdit = false;
			controller.isDisabledRemove = false;

			if (helperServiceRequest.data.estado == 3 || helperServiceRequest.data.estado == 4 || helperServiceRequest.data.estado == 5)
				controller.isDisabledEdit = true;


			if (helperServiceRequest.data.estado == 3 || helperServiceRequest.data.estado == 4 || helperServiceRequest.data.estado == 5)
				controller.isDisabledRemove = true;

			controller.load();
			controller.buscarAnexos();
		}

		this.openEquipment = function () {
			helperEquipment.data = helperServiceRequest.data;
			helperEquipment.data.pagina = 1;

			$location.path('/dts/mmi/equipment/dashboard');
		}

		this.openTag = function () {
			helperTag.data = helperServiceRequest.data;
			helperTag.data.pagina = 1;

			$location.path('/dts/mmi/tag/dashboard');
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		$scope.$on('$destroy', function () {
			controller = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

	}

	index.register.controller('mmi.servicerequest.DetailCtrl', serviceRequestDetailCtrl);
	index.register.service('helperEquipment', function () {
		return {
			data: {}
		};
	});
	index.register.service('helperTag', function () {
		return {
			data: {}
		};
	});

});
