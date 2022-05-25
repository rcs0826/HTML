define([
    'index',
    'angularAMD',	
    '/dts/mce/js/api/fch/fchmat/fchmattransferbetweenwarehouses-services.js',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/men/js/zoom/item.js',
    '/dts/mce/js/zoom/deposito.js',
    '/dts/mce/js/zoom/localizacao.js',
    '/dts/mce/js/zoom/saldo-estoq.js',
    '/dts/mcc/js/zoom/tab-unidade.js',
    '/dts/mce/js/mce-utils.js'
], function (index) {
    transferBetweenWarehousesController.$inject = ['$rootScope', '$scope',
												  'totvs.app-main-view.Service', 'mce.transferBetweenWarehouse.Factory',
												  'mce.utils.Service', '$location', 'TOTVSEvent', '$stateParams'];

    function transferBetweenWarehousesController($rootScope, $scope, appViewService, transferBetweenWarehousesFactory,
        mceHelper, $location, TOTVSEvent, $stateParams) {
        var controller = this;
        var fieldsNeverRequired = ['nr-etiquetas', 'nro-docto', 'serie-docto'];
        var fieldsThatAllowBlank = ['cod-localiz-dest', 'lote-dest'];        

        controller.model = {};
        angular.extend(this, mceHelper);

        this.getDefaults = function (fieldName) {
            var ttTransferTransactionValues = [];
            ttTransferTransactionValues.push(controller.model);

            transferBetweenWarehousesFactory.setDefaultsTransfer({
                    pType: "",
                    pFieldName: fieldName
                }, ttTransferTransactionValues,
                function (result) {
                    controller.listOfEnabledFields = result.ttEnableFields;
                    controller.model = result.ttTransferTransactionDefault[0];
                    if (fieldName == 'it-codigo' || fieldName == 'cod-estabel') {
                        controller.balanceObject = {};
                        controller.warehouseObj = '';
                        controller.locationObj = '';
                        controller.model['dt-vali-lote-orig'] = undefined;
                        controller.model['cod-refer-orig'] = '';
                        controller.model['lote-orig'] = '';
                        controller.model['dt-vali-lote-orig'] = undefined;
                        controller.model['lote-dest'] = ''; 
                    }
                    $('#transferFormFields').find('field').each(function () {

                        var modelString = $(this).attr('data-ng-model');
                        var screenField = modelString.substring(modelString.indexOf('[') + 2,
                            modelString.indexOf(']') - 1);
                        var indexField = mceHelper.findIndexByAttr(controller.listOfEnabledFields,
                            'campo',
                            screenField);
                        if (indexField !== undefined && fieldsNeverRequired.indexOf(screenField) > 0) {
                            $(this).attr('required', controller.listOfEnabledFields[indexField].habilitado);
                        }
                    });

                }
            );
        };
        this.fillBalanceFields = function (objSelected, oldValueSelected) {
            controller.model['cod-depos-orig'] = objSelected['cod-depos'];
            controller.model['cod-localiz-orig'] = objSelected['cod-localiz'];
            controller.model['dt-vali-lote-orig'] = objSelected['dt-vali-lote'];
            controller.model['cod-refer-orig'] = objSelected['cod-refer'];
            controller.model['lote-orig'] = objSelected['lote'];
            controller.warehouseObj = objSelected['cod-depos'] + ' - ' + objSelected["_"]['desc-depos'];
            controller.locationObj = objSelected['cod-localiz'] + ' - ' + objSelected["_"]['desc-localiz'];
            controller.getDefaults('lote-orig');
            
        }
        this.getMessageFromMissingFields = function (arrayOfFields) {
            var carriageReturn = "\n";
            var listOfFields = carriageReturn;
            angular.forEach(arrayOfFields, function (singleField) {
                listOfFields += carriageReturn;
                listOfFields += $scope.i18n("l-field") + ': ' + singleField.label + " / " +
                    $scope.i18n("l-section") + ': ' + singleField.section;
            });
            listOfFields += carriageReturn;
            return listOfFields;
        };

        this.createTransfer = function () {
            var ttTransferTransactionValues = [];
            var canSave = false;
            ttTransferTransactionValues.push(controller.model);
            var missingFields = [];
            missingFields = mceHelper.validateMissingFields($("#transferFormFields"), true, fieldsThatAllowBlank);
            var msg = undefined;
            if (missingFields.length > 0) {
                msg = controller.getMessageFromMissingFields(missingFields);
            }
            if (msg !== undefined) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n("l-title-missing-fields"),
                    detail: $rootScope.i18n('l-msg-missing-fields').replace('&1', msg)
                });
            } else {
                transferBetweenWarehousesFactory.createTransfer({},
                    ttTransferTransactionValues,
                    function (result) {
                        if (!result.$hasError) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'info',
                                title: $rootScope.i18n(''),
                                detail: $rootScope.i18n('l-warehouse-transfer-success')
                            });

                            controller.cleanFields();
                            controller.fillWithInitialValues();

                        }
                    });
            }

        };

        this.cleanFields = function () {
            controller.model = {};
            controller.model.quantidade = 0;
            controller.balanceObject = {};
            controller.warehouseObj = '';
            controller.locationObj = '';
        };
        this.init = function () {
			
			//COMPATIBILIDADE padStart para IE 11 
			// https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
			// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
			if (!String.prototype.padStart) {
				String.prototype.padStart = function padStart(targetLength,padString) {
					targetLength = targetLength>>0; //truncate if number or convert non-number to 0;
					padString = String((typeof padString !== 'undefined' ? padString : ' '));
					if (this.length > targetLength) {
						return String(this);
					}
					else {
						targetLength = targetLength-this.length;
						if (targetLength > padString.length) {
							padString += padString.repeat(targetLength/padString.length); //append to original to ensure we are longer than needed
						}
						return padString.slice(0,targetLength) + String(this);
					}
				};
			}			
			
			
			var today = new Date();
			var dateString;			
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();

			dateString = mm + '/' + dd + '/' + yyyy;
			controller.model['dt-trans'] = 	new Date(dateString);
			
            var alreadyOpened = false;
            var isStateParams = $stateParams.site && $stateParams.itemCode;
            alreadyOpened = appViewService.startView($rootScope.i18n('l-transfer-between-warehouses'),
                'mce.ce0206.Controller',
                controller);
            if (!alreadyOpened && !isStateParams) {
                controller.fillWithInitialValues();
            } else if (isStateParams) {
                if (controller.model['cod-estabel'] == $stateParams.site && 
                    controller.model['it-codigo'] == $stateParams.itemCode) {
                    return;
                }
                controller.model['cod-estabel'] = $stateParams.site;
                controller.model['it-codigo'] = $stateParams.itemCode;
                              
                setTimeout(function () {
                    document.getElementById("btnOrigin").click();
                }, 1000)
            }
        };
        this.fillWithInitialValues = function () {
            transferBetweenWarehousesFactory.initializeInterface(
                function (result) {
                    if (!result.$hasError) {
                        transferBetweenWarehousesFactory.setDefaultsTransfer({
                                pType: "create",
                                pFieldName: ""
                            }, {
                                ttTransferTransaction: undefined
                            },
                            function (result) {
                                controller.listOfEnabledFields = result.ttEnableFields;
                                controller.model = result.ttTransferTransactionDefault[0];
                            });

                    }
                });
        }
        if ($rootScope.currentuserLoaded) {
            this.init();
        };

        $scope.$on('$destroy', function () {
            controller = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });


    }

    index.register.controller('mce.ce0206.Controller', transferBetweenWarehousesController);

});