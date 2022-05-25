define([
  'index',
  (rfiBaseDir + '/mcc/js/api/fchmatfillquotations.js'),
], function (index) {

  includeController.$inject = ['$rootScope', '$scope', 'rfi.mcc.fchmatfillquotations.factory', 'model', '$modalInstance'];
  function includeController($rootScope, $scope, fchmatfillquotations, model, $modalInstance) {
    var ctrl = this;
    ctrl.guid = undefined;
    ctrl.param = undefined;
    ctrl.unitMetricList = undefined;
    ctrl.paymentCondition = undefined;
    ctrl.carriers = undefined;
    ctrl.currencies = undefined;
    ctrl.itemManufacturers = undefined;
    ctrl.ttCompany = $rootScope.ttCompany;
    ctrl.fields = {};
    ctrl.pType = '';
    ctrl.edit = false;
    ctrl.ttQuotationsDefault = undefined;
    ctrl.hasError = false;
    $rootScope.i18nContext = i18nContext;

    // # Purpose: Método executado na inicialização do controller.
    // # Parameters: 
    // # Notes: Neste método está toda a busca dos valores dos combo-boxes.
    ctrl.init = function () {
      
      ctrl.pType = 'create';
      ctrl.edit = model.edit;

      var itemParameter = {
        'itemCode': model.item,
        'vendorCode': $rootScope.ttVendor.vendor
      };

	  fchmatfillquotations.getLists({}, itemParameter, function (result) {
        if (result) {		
			if (result.ttItemVendorUnitVO) {
				ctrl.unitMetricList = [];
				result.ttItemVendorUnitVO.forEach(element => {
					ctrl.unitMetricList.push({
						value: element['unitOfMeasure'],
						label: element['unitOfMeasure'] + ' - ' + element['unitOfMeasureDescription']
					});
				});
			}
		
		    if (result.ttPaymentTerms) {
				ctrl.paymentCondition = [];
				result.ttPaymentTerms.forEach(element => {
					ctrl.paymentCondition.push({
						value: element['cod-cond-pag'],
						label: element['cod-cond-pag'] + ' - ' + element['descricao']
					});
				});
			}

			if (result.ttCarrier) {
				ctrl.carriers = [];
				result.ttCarrier.forEach(element => {
					ctrl.carriers.push({
						value: element['cod-transp'],
						label: element['cod-transp'] + ' - ' + element['nome-abrev']
					});
				});
			}

			if (result.ttCurrency) {
				ctrl.currencies = [];
				result.ttCurrency.forEach(element => {
					ctrl.currencies.push({
						value: element['mo-codigo'],
						label: element['mo-codigo'] + ' - ' + element['descricao']
					});
				});
			}      

			if (result.ttManufacturerVO) {
				ctrl.itemManufacturers = [];
				result.ttManufacturerVO.forEach(element => {
					if (element['manufacturerCode'] > 0) {
						ctrl.itemManufacturers.push({
							value: element['manufacturerCode'],
							label: element['manufacturerCode'] + ' - ' + element['manufacturerDescription']
						});
					}
				});
			}	

			/* Chama os defaults da cotação após carregar as listas */
			var defaultsQuotationParam = {
				'pType': ctrl.pType,
				'pFieldName': '',
				'cod-emitente': $rootScope.ttVendor.vendor,
				'numero-ordem': model.orderNumber,
				'it-codigo': model.item
			}

			if (model.quote) {
				defaultsQuotationParam = model.quote;
				defaultsQuotationParam.pFieldName = '';
				defaultsQuotationParam.pType = 'update';
				ctrl.pType = 'update';
			}

			fchmatfillquotations.setDefaultsQuotation({},defaultsQuotationParam, function (result) {
				if (result) {
				  ctrl.fillQuotationsDefault(result);
				}
			});
        }
      });
    };

    // # Purpose: Realiza o calculo dos campos de descontos(porcentagem e valor) e da aliquota do IPI
    // # Parameters: field - nome do campo a ser calculado.
    // # Notes:
    ctrl.calcFields = function (field) {
      setTimeout(function() {
        ctrl.ttQuotationsDefault['pType'] = ctrl.pType;
        ctrl.ttQuotationsDefault['pFieldName'] = field;
        fchmatfillquotations.setDefaultsQuotation({}, ctrl.ttQuotationsDefault, function (result) {
          if (result) {
            ctrl.fillQuotationsDefault(result);
          }
        });
      }, 0);
    }

    // # Purpose: Método auxiliar para preechimento dos campos conforme o retorno do back-end.
    // # Parameters: object - Objeto com os dados atualizados vindo do back-end.
    // # Notes:
    ctrl.fillQuotationsDefault = function (object) {
      ctrl.fields = {};
      object.ttEnableFields.forEach(function (element) {
        ctrl.fields[element.campo] = element.habilitado
      });
      ctrl.ttQuotationsDefault = object.ttQuotationsDefault[0];

      if (ctrl.ttQuotationsDefault['preco-fornec'] == null) {
        ctrl.ttQuotationsDefault['preco-fornec'] = 0;
      }

      if (ctrl.ttQuotationsDefault['prazo-entreg'] == null) {
        ctrl.ttQuotationsDefault['prazo-entreg'] = 0;
      }

      if (ctrl.ttQuotationsDefault['aliquota-ipi'] == null) {
        ctrl.ttQuotationsDefault['aliquota-ipi'] = 0;
      }

      if (ctrl.ttQuotationsDefault['valor-taxa'] == null) {
        ctrl.ttQuotationsDefault['valor-taxa'] = 0;
      }

      if (ctrl.ttQuotationsDefault['perc-descto'] == null) {
        ctrl.ttQuotationsDefault['perc-descto'] = 0;
      }

      if ((ctrl.ttQuotationsDefault['manufacturer'] == null || 
           ctrl.ttQuotationsDefault['manufacturer'] == 0)
        && ctrl.itemManufacturers.length > 0) {
		if (ctrl.itemManufacturers[0].value) {
			ctrl.ttQuotationsDefault['manufacturer'] = ctrl.itemManufacturers[0].value;
		}
      }

    };

    // # Purpose: Método executado na ação do botão "Salvar e novo".
    // # Parameters:
    // # Notes:
    ctrl.newQuote = function () {
      var defaultsQuotationParam = {
        'pType': ctrl.pType,
        'pFieldName': '',
        'cod-emitente': $rootScope.ttVendor.vendor,
        'numero-ordem': model.orderNumber,
        'it-codigo': model.item
      }
      fchmatfillquotations.setDefaultsQuotation({}, defaultsQuotationParam, function (result) {
        if (result) {
          ctrl.fillQuotationsDefault(result);
        }
      });
    }

    // # Purpose: Método executado na ação do botão "Salvar".
    // # Parameters:
    // # Notes:
    ctrl.save = function (closeModal) {
      
      // Validações
      if (ctrl.ttQuotationsDefault['valor-frete'] == null || ctrl.ttQuotationsDefault['valor-frete'] === '') {
        ctrl.ttQuotationsDefault['valor-frete'] = 0;
      }
      
      if (ctrl.ttQuotationsDefault['aliquota-icm'] == null || ctrl.ttQuotationsDefault['aliquota-icm'] === '') {
        ctrl.ttQuotationsDefault['aliquota-icm'] = 0;
      }

      if (ctrl.ttQuotationsDefault['aliquota-ipi'] == null || ctrl.ttQuotationsDefault['aliquota-ipi'] === '') {
        ctrl.ttQuotationsDefault['aliquota-ipi'] = 0;
      }      

      var param = {
        pType: ctrl.pType,
        ttQuotations: ctrl.ttQuotationsDefault
      };
      setTimeout(function () {
        fchmatfillquotations.addUpdateQuotation({}, param, function (result) {
          if (result && !result.$hasError) {
            if (closeModal) {
              delete model.quote;
              ctrl.closeModal();
            } else {
              ctrl.newQuote();
            }
          }
        });
      }, 0);
    }

    // # Purpose: Método executado na ação do botão "Fechar".
    // # Parameters:
    // # Notes:
    ctrl.closeModal = function () {
      $modalInstance.close();
    }

    ctrl.init();

    $scope.$on('$destroy', function () {
      ctrl = undefined;
    });
  };

  index.register.controller('rfi.mcc.quotation.include.ctrl', includeController);
});
