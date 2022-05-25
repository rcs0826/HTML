define(['index',
	'/dts/mcc/js/api/ccapi362.js'
	], function(index){

		configVendorEmailController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'mcc.ccapi362.Factory'];		
		function configVendorEmailController($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, ccapi362 ){

			var ctrl = this;	
            ctrl.model = {};
            ctrl.model.processQuotation = 0;
            ctrl.model.vendorNumber = 0;
            ctrl.model.infoSend = [];
			
			/* 
			 * Objetivo: método de inicialização da tela
			 * Parâmetros: 
			 */
			ctrl.init = function() {	 
                ctrl.model.processQuotation = parameters.cddSolicit;
                ctrl.model.vendorNumber = parameters.vendorNumber;
                
                ccapi362.getVendorDetail({'processQuotation' : parameters.cddSolicit,
                                          'vendorNumber' : parameters.vendorNumber}, 
                function(result){
                    ctrl.afterGetData(result);
                });
            }
            
            /* 
             * Objetivo: Método executado após a busca das informações
             * Parâmetros: result: Dados retornados dos métodos de busca
             */
            ctrl.afterGetData = function(result){
                if(result){ 
                    ctrl.model.infoSend = result[0];
                }
            }
            
            /* 
			 * Objetivo: Salva as informações de tela
			 * Parâmetros: 
			 */
			ctrl.apply = function(){	
                ccapi362.saveVendorQuotationProcess({},{'pcAction' : 'UPDATE',
                                                        'ttVendorQuotationProcess' : ctrl.model.infoSend}, function(result){
                if(!result['$hasError']){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-process-vendor', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-process-vendor', [], 'dts/mcc') + ': ' + parameters.vendorNumber + ', ' +
                        $rootScope.i18n('l-success-updated', [], 'dts/mcc') + '!'
                    });
                    ctrl.closeTotvsEditable();
                    $modalInstance.close();
                }
            });
                
				
			}
            
			/* 
			 * Objetivo: Cancelar alterações feitas e fechar o modal 
			 * Parâmetros: 
			 */
			ctrl.cancel = function() {     
                ctrl.closeTotvsEditable();
				$modalInstance.dismiss('cancel');
			}	
            
            /* 
			 * Objetivo: Fechar o totvs-editable no fechamento da modal
			 * Parâmetros: 
			 */
            ctrl.closeTotvsEditable = function () {
                $('totvs-editable').each(function (i, o) {
                    if ($(o).data('bs.popover')) {
                        $(o).popover('destroy');
                    }
                }); 
            }
            
            /* 
			 * Objetivo: Formatar os e-mails para que tenham sempre um espaço após o ; para serem apresentados
             *           corretamente em tela
			 * Parâmetros: value: Valor que digitado para os e-mails
			 */
            ctrl.applyEmail = function(value){
                ctrl.model.infoSend['des-e-mail'] = value.replace(new RegExp(' ', 'g'), '');
                ctrl.model.infoSend['des-e-mail'] = value.replace(new RegExp(';', 'g'), '; ');
            };

			ctrl.init();
		}

		index.register.controller('mcc.requestquotation.modal.ConfigVendorEmailCtrl', configVendorEmailController);
        
	});
