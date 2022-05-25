define([
	'index',
	(rfiBaseDir + '/mcc/js/api/fchmatfillquotations.js'),
	(rfiBaseDir + '/mcc/rfimcc1000/quotation/rfi.include.ctrl.js')
], function (index) {

	answerControl.$inject = ['$rootScope', '$scope', '$state', 'rfi.mcc.fchmatfillquotations.factory', '$modal', 'totvs.app-notification.Service'];
	function answerControl($rootScope, $scope, $state, fchmatfillquotations, $modal, appNotificationService) {
		var ctrl = this;
		ctrl.guid = undefined;
		ctrl.param = undefined;
		ctrl.quotations = undefined;
		ctrl.quotationsCloneArray = undefined;
		$rootScope.i18nContext = i18nContext;
		ctrl.withoutDescMessage = $rootScope.i18n('l-without-description',[],$rootScope.i18nContext);
		ctrl.listOfDelivery = [];
		ctrl.filters = [
			{id: 0, title: $rootScope.i18n('l-filled',[],$rootScope.i18nContext)},
			{id: 1, title: $rootScope.i18n('l-not-filled',[],$rootScope.i18nContext)},
			{id: 2, title: $rootScope.i18n('l-all',[],$rootScope.i18nContext)}
		]
		

		// # Purpose: Método executado na inicialização do controller.
		// # Parameters: 
		// # Notes:
		ctrl.init = function () {

			ctrl.param = $state.params;
			
			var parameters = {
				guid: ctrl.param.guid,
			};
			
			if ($rootScope.ttVendor == undefined) {
				window.location.href = '../..' + rfiBaseUrl + '/auth/?guid=' + parameters.guid;
			} else {
				parameters.codFornec = $rootScope.ttVendor.vendor;
			}

			fchmatfillquotations.getRequisitions(parameters,function(result){
				if(result){
					ctrl.quotations = result;
					ctrl.quotationsCloneArray = ctrl.quotations.slice(0);
				}
			})

		};

		// # Purpose: Método executado na ação do botão "Cotar".
		// # Parameters: quotation - Objeto com os dados do item a ser cotado.
		// # Notes:
		ctrl.quote = function(quotation) {
			ctrl.param.item = quotation['it-codigo'];
			ctrl.param.orderNumber = quotation['numero-ordem'];
			$modal.open({
				templateUrl: rfiBaseDir +'/mcc/rfimcc1000/quotation/rfi.include.html',
				controller: 'rfi.mcc.quotation.include.ctrl as controller',
				size: 'lg',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return ctrl.param;
					}
				}
			});
		}

		// # Purpose: Método executado na ação do botão "Encerrar cotações".
		// # Parameters:
		// # Notes:
		ctrl.closeQuotation = function () {
			
			var parameters = {
				guid: ctrl.param.guid
			};

			appNotificationService.question(
				{
					title: $rootScope.i18n('l-close-quotation',[],$rootScope.i18nContext),
					text: $rootScope.i18n('l-close-quotation-explanation',[],$rootScope.i18nContext),
					size: 'lg',
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							$state.go('rfi/mcc/rfimcc1000.finished', {guid: ctrl.param.guid});
						}
					}
				}
			);
		}

		// # Purpose: Método executado na ação do link "Exibir detalhes".
		// # Parameters: orderNumber - Número da ordem de compras.
		// # Notes:
		ctrl.onShowDetails = function(orderNumber) {
			var parameters = {
				numeroOrdem: orderNumber
			};

			fchmatfillquotations.getDeliverySchedule(parameters,function(result){
				if(result){
					ctrl.quotationsCloneArray.forEach(element => {
						if (element['numero-ordem'] === orderNumber) {
							element.entregas = result;
						}
					});
				}
			})
		}

		// # Purpose: Redireciona para tela de visualização de cotações
		// # Parameters: quotation - Objeto com os dados do item a ser cotado.
		// # Notes:
		ctrl.viewQuotation = function(quotation) {
			$rootScope.viewQuotationParam = {
				'item': quotation['it-codigo'],
				'descItem': quotation['it-codigo-desc'],
				'quantity': quotation['qt-solic'],
				'unitMetric': quotation['un'] + ' - ' + quotation['un-desc'],
				'guid': ctrl.guid,
				'orderNumber': quotation['numero-ordem'],
				'codEstab': quotation['cod-estabel'],
				'itemVendor': quotation['itemVendor']
			};
			$state.go('rfi/mcc/rfimcc1000.quotation', {guid: ctrl.param.guid});
		}

		// # Purpose: ação dos filtros de preechimento
		// # Parameters: element - Objeto com o valor do filtro selecionado.
		// # Notes:
		ctrl.selectFilter = function(element) {
			ctrl.filterOrders();
			if (element.id == 0)
				ctrl.filterFilled();
			else if (element.id == 1)
				ctrl.notFilterFilled();
		}

		// # Purpose: Filtra todas as ordens preenchidas
		// # Parameters:
		// # Notes:
		ctrl.filterFilled = function() {
			var array = ctrl.quotations.filter(function(element) {
				return element['itemPreenchido'];
			});
			ctrl.quotations = array;
		}

		// # Purpose: Filtra todas as ordens não preenchidas
		// # Parameters:
		// # Notes:
		ctrl.notFilterFilled = function() {
			var array = ctrl.quotations.filter(function(element) {
				return !element['itemPreenchido'];
			});
			ctrl.quotations = array;
		}

		// # Purpose: Método executado na ação do botão "Voltar".
		// # Parameters:
		// # Notes:
		ctrl.back = function() {
			window.history.back();
		}

		// # Purpose: Método executado na ação do botão "X" que limpa os filtros.
		// # Parameters:
		// # Notes:
		ctrl.cleanSearch = function() {
			ctrl.customFilter = '';
			ctrl.quotations = ctrl.quotationsCloneArray;
		}

		// # Purpose: Método acionado ao digitar no campo do filtro de pesquisa.
		// # Parameters:
		// # Notes:
		ctrl.filterOrders = function() {
			if (ctrl.customFilter && ctrl.customFilter.length > 1) {
				var array = ctrl.quotationsCloneArray.filter(function(element) {
					return element['it-codigo'].indexOf(ctrl.customFilter) >= 0 || 
								 element['it-codigo-desc'].indexOf(ctrl.customFilter) >= 0 || 
								 String(element['numero-ordem']).indexOf(ctrl.customFilter) >= 0 ||
								 element['narrativa'].indexOf(ctrl.customFilter) >= 0;
				});
				ctrl.quotations = array;
			} else {
				ctrl.quotations = ctrl.quotationsCloneArray;
			}
		}

		ctrl.init();

		$scope.$on('$destroy', function () {
			ctrl = undefined;
		});
	};	
	
	index.register.controller('rfi.mcc.answer.ctrl', answerControl);
});
