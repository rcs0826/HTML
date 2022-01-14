define(['index'], function (index) {

	'use strict';
	console.log("Customização Customer(V01)!!");
	
	customerCustomService.$inject = ['customization.generic.Factory', '$stateParams', 'salesorder.customer.Factory', 'custom.salesorder.customer.Factory'];
	function customerCustomService(customService, $stateParams, customer, customCustomer) {
		var service;

		service = {
			// método do evento customizado no controller
			afterLoadCustomer: function (param) {
				
				//console.log("afterLoadCustomer-ini!!");
				var controller = param.controller;
				
				if(controller.customerDadosLogisticos == undefined){
					customCustomer.getCustomerDadosLogisticos({codEmitente: $stateParams.customerId}, function(result) {
						controller.customerDadosLogisticos = result;
						//console.dir(result);
					});	
				}
				
				//console.dir(controller);
				//console.log("afterLoadCustomer-fim!!");
				
			},
			
			customPage: function (params, element) {
				//console.log("customPage-ini!!");

				//console.dir(params);
				//console.dir(element);

				var html,
					compiledHTML;

				//Recuperando o objeto que possui a divisão tabset
				//var tabsetForm = element.find(".row .group-content .col-xs-12:first");
				var tabsetForm = element.find(".row .group-content");

				//console.dir(tabsetForm);

				// definimos a customização que será adicionada ao elemento
				html = 
/*				
					'<tab heading="{{ \'Dados Logísticos\' | i18n }}">' +
						'<totvs-list-item ng-repeat="contact in controller.customerContacts">' +
							'<totvs-list-item-content>' +
								'<div ng-include="\'/custom/mpd/customer-dadoslogisticos-fields.jsp\'"></div>' +
							'</totvs-list-item-content>' +
						'</totvs-list-item>';
*/
				html = 
					'<div class="col-xs-12">' + 
					'<totvs-group-content title="{{ \'Dados Logísticos\' | i18n}}">' +
						'<div ng-include="\'/dts/custom/mpd/customer-dadoslogisticos-fields.jsp\'"></div>' +
					'</totvs-group-content>' +
					'</div>';
					
				compiledHTML = customService.compileHTML(params, html);

				tabsetForm.append(compiledHTML);
				
 				//console.log("customPage-fim!!");
			}
			
		}
		
		angular.extend(service, customService);

		return service;
	}

	// Registra o serviço com um nome especifico
	index.register.factory('custom.dts.mpd.customer', customerCustomService);
	index.register.factory('custom.salesorder.customer', customerCustomService);
	
	customCustomer.$inject = ['$totvsresource'];
    function customCustomer($totvsresource, genericService) {

        var specificResources = {
            'getCustomerDadosLogisticos': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/esp/fchesp0001/dadoslogisticos/:codEmitente',
                params: {codEmitente: '@codEmitente'}
            }
        };

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/esp/fchesp0001', {}, specificResources);
		
        return factory;
    }
    index.register.factory('custom.salesorder.customer.Factory', customCustomer);
});
