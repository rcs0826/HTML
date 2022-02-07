define(['index'], function (index) {

	'use strict';
	console.log("Customização SalesOrders(V01)!!");

	function salesOrderCustomService(customService) {
		var service;

		service = {
			customListItem: function (params, element) {
				//console.log("customListItem-ini!!");

				//console.dir(params);
				//console.dir(element);

				var html,
				compiledHTML;

				// Recuperando o objeto que possui a divisão page-form
				var formListItem = element.find(".item-info .row:first");
				//console.dir(formListItem);

				// definimos a customização que será adicionada ao elemento
				html = '<totvs-list-item-info class="col-xs-6 col-lg-4" title="{{\'Estágio\' | i18n}}">{{order[\'contato\']}}</totvs-list-item-info>'

					compiledHTML = customService.compileHTML(params, html);

				formListItem.append(compiledHTML);

				//console.log("customListItem-fim!!");

			}
		}
		angular.extend(service, customService);

		return service;
	}
	salesOrderCustomService.$inject = ['customization.generic.Factory'];

	// Registra o serviço com um nome especifico
	index.register.factory('custom.dts.mpd.salesorders', salesOrderCustomService);
});
