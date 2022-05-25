define([
	'index',
	(rfiBaseDir + '/mcc/js/api/fchmatfillquotations.js'),
], function (index) {

	viewController.$inject = ['$rootScope', '$scope', 'rfi.mcc.fchmatfillquotations.factory', '$modal', '$state', 'totvs.app-notification.Service'];
	function viewController($rootScope, $scope, fchmatfillquotations, $modal, $state, appNotificationService) {
		var ctrl = this;
		ctrl.guid = undefined;
		ctrl.param = undefined;
		ctrl.quotesList = undefined;
		ctrl.gridOptions = undefined;
		ctrl.itemManufacturers = undefined;
		$rootScope.i18nContext = i18nContext;

		// # Purpose: Método executado na inicialização do controller.
		// # Parameters: 
		// # Notes:
		ctrl.init = function () {

			if ($rootScope.viewQuotationParam == undefined) {
				window.location.href = '../..' + rfiBaseUrl + '/auth/?guid=' + $state.params.guid;
			} else {
				ctrl.param = $rootScope.viewQuotationParam;
			}
			
			ctrl.getFillQuotes();

			var itemManufacturersParam = {
				'stringName': ctrl.param.item
			}
			fchmatfillquotations.getItemManufacturers({}, itemManufacturersParam, function(result) {
				ctrl.itemManufacturers = [];
				if (result) {
					ctrl.itemManufacturers = result;
				}
			});

		};
		
		// # Purpose: Método executado na ação do botão "Voltar".
		// # Parameters:
		// # Notes:
		ctrl.back = function() {
			window.history.back();
		}

		// # Purpose: Método executado na ação do botão "Adicionar" para adicionar uma cotação.
		// # Parameters:
		// # Notes:
		ctrl.addQuotation = function() {
			ctrl.param.edit = false;
			if (ctrl.param.quote)
				delete ctrl.param.quote;
			var modalInstance = $modal.open({
				templateUrl: rfiBaseDir + '/mcc/rfimcc1000/quotation/rfi.include.html',
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
			modalInstance.result.then(function() {
				ctrl.getFillQuotes();
			});
		}
		
		// # Purpose: Método executado ao clicar no botão remover para eliminar uma cotação. 
		// # Parameters: objeto de cotação a ser eliminado
		// # Notes:
		ctrl.delete = function(quote) {
			var param = {
				pNrOrdem: quote['numero-ordem'],
				pCodEmitente: quote['cod-emitente'],
				pItCodigo: quote['it-codigo'],
				pSeqCotac: quote['seq-cotac']
			};
			appNotificationService.question(
				{
					title: $rootScope.i18n('l-delete-quotation', [], $rootScope.i18nContext),
					text: $rootScope.i18n('l-delete-quotation-confirmation', [], $rootScope.i18nContext),
					size: 'lg',
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							fchmatfillquotations.removeQuotation({}, param,function(result){
								if (result) ctrl.getFillQuotes();
							});
						}
					}
				}
			);
		}

		// # Purpose: Método executado ao clicar no botão editar para alterar os dados de uma cotação existente. 
		// # Parameters: objeto de cotação a ser eliminado
		// # Notes:
		ctrl.edit = function(quote) {
			ctrl.param.quote = quote;
			ctrl.param.edit = true;
			var modalInstance = $modal.open({
				templateUrl: rfiBaseDir + '/mcc/rfimcc1000/quotation/rfi.include.html',
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
			modalInstance.result.then(function() {
				ctrl.getFillQuotes();
			});
		}

		// # Purpose: Método executado durante a inicialização do controller para buscar as cotações.
		// # Parameters:
		// # Notes:
		ctrl.getFillQuotes = function () {
			var parameters = {
				numeroOrdem: ctrl.param.orderNumber,
				date: null,
				currency: 0,
				vendor: $rootScope.ttVendor.vendor
			};
			
			fchmatfillquotations.getFillQuotes(parameters,function(result){
				if(result){
					ctrl.quotesList = result;
				}
			});
		}

		ctrl.init();

		$scope.$on('$destroy', function () {
			ctrl = undefined;
		});
	};	
	
	index.register.controller('rfi.mcc.quotation.view.ctrl', viewController);
});
