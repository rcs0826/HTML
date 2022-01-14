define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js', '/dts/mpd/js/zoom/estabelec.js'], function (index) {

	'use strict';
	console.log("Customização Order(V02)!!");
	
	orderCustomService.$inject = ['$rootScope','customization.generic.Factory', '$stateParams', 'TOTVSEvent', 'salesorder.salesorders.Factory'];
	function orderCustomService($rootScope, customService, $stateParams, TOTVSEvent, orderResource) {
		var service;

		service = {

			// método do evento customizado no controller
			afterLoadOrder: function (params) {
				//console.log("afterLoadOrder-ini!!");
				
				//Grava o valor do emitente para ser recuperado pelo Zoom
				//console.dir(params.controller.orderDetail);

				//$stateParams.emitenteId = params.controller.orderDetail['cod-emitente'];
				//console.log('emitenteId: ' + $stateParams.emitenteId);

				//console.log("afterLoadOrder-fim!!");
			},

			onEditOrderItem: function (params) {},

			customListItem: function (params, element) {
				//console.log("customListItem-ini!!");

				//console.dir(params);
				//console.dir(element);

				var html,
				compiledHTML;

				// Verifica se foi chamado pela itemsearchgrid ou itemsearchlist

				// itemsearchglist
				if (element[0].nodeName == 'DIV') {
					//console.log('itemsearchlist');

					// Recuperando o objeto que possui a divisão page-form
					var formListItem = element.find(".page-form .form-horizontal");
					//console.dir(formListItem);

					// definimos a customização que será adicionada ao elemento, nesse caso incluímos 2 novos campos para exibição
					html = '<field maxlength="50" type="input" ng-model="item[\'epcValue\']" class="col-xs col-sm-6 col-md-4">' +
						'<label>{{ \'Bonificação\' | i18n }}</label>' +
						'</field>';

					html = html + '<field maxlength="50" type="input" ng-model="item[\'epcValue2\']" class="col-xs col-sm-6 col-md-4">' +
						'<label>{{ \'Tubete\' | i18n }}</label>' +
						'</field>';

					compiledHTML = customService.compileHTML(params, html);

					formListItem.append(compiledHTML);

				}

				// itemsearchgrid
				if (element[0].nodeName == 'TR') {
					var row,
					tbody,
					theader,
					table;

					// Recuperando o objeto tbody
					row = element[0];
					tbody = row.parentElement;

					// Recuperando o objeto table
					table = tbody.parentElement;

					// Recuperando o objeto
					theader = table.children[0];
					row = theader.children[0];

					// Verifica se a linha já possui o header */
					if (row.children.length <= 6) {
						var titulo = row.ownerDocument.createElement('th');
						titulo.setAttribute("class", "ng-binding");
						titulo.setAttribute("style", "min-width:100px");

						var textnode = document.createTextNode(" Bonificação ");
						titulo.appendChild(textnode);
						row.appendChild(titulo);

						var titulo2 = row.ownerDocument.createElement('th');
						titulo2.setAttribute("class", "ng-binding");
						titulo2.setAttribute("style", "min-width:100px");

						var textnode2 = document.createTextNode(" Tubete ");
						titulo2.appendChild(textnode2);
						row.appendChild(titulo2);


					}

					// Incluindo a coluna da bonificação
					html = '<td style="min-width:100px">' +
						'<input class="form-control" type="text" ng-model="item[\'epcValue\']">' +
						'</td>';


					compiledHTML = customService.compileHTML(params, html);
					element.append(compiledHTML);


					html = '<td style="min-width:100px">' +
						'<input class="form-control" type="text" ng-model="item[\'epcValue2\']">' +
						'</td>';


					compiledHTML = customService.compileHTML(params, html);
					element.append(compiledHTML);
				}

				//console.log("customListItem-fim!!");
			},

			// método do evento customizado nas paginas na tag HTML
			customPage: function (params, element) {
				//console.log("customPage-order-ini!!");

				// Recupera os parametros
				//console.dir(params);
				//console.dir(element);
				
				// Atualizando as informaçoes do codigo do emitente
				//console.log(params.controller);
				//params.controller.getHeader();
				//console.log('cod-emitente: ' + params.controller.order['cod-emitente']);
				
				//$stateParams.emitenteId = params.controller.orderDetail['cod-emitente'];
				//console.log('emitenteId: ' + $stateParams.emitenteId);
				
				// Pelo controler verifica aonde esta sendo chamado
				
				// ordercontroller
				//if(params.controller.hasOwnProperty('codEmit')){

					// procuramos um elemento que tem a class "form-horizontal"
					//var formRow,
					//    html,
					//    compiledHTML;

					// Recuperando o objeto que possui a divisão page-form
					// .row .col-md-12
					//formRow = element.find(".page-content .col-xs .page-details .row:first");
					//formRow = formRow.find("accordion:first");
					//formRow = element.find(".form-horizontal .ng-scope:first");

					// definimos a customização que será adicionada ao elemento, nesse caso incluímos 2 novos campos para exibição
					//
					//html = '<totvs-page-detail-info title="{{\'Estágio\' | i18n}}" class="col-xs-6 col-sm-6 col-md-4">' +
					//   	'{{controller.orderDetail[\'epc-val\']}}' +
					//  '</totvs-page-detail-info>'
					//
					//html = '<field class="col-md-4 col-xs-12 col-sm-12" ng-model="controller.orderDetail[\'epc-val\']" disabled="true">' +
					//       '<label>{{ \'Estágio\' | i18n }}</label>' +
					//  '</field>';

					//compiledHTML = customService.compileHTML(params, html);

					//formRow.prepend(compiledHTML);

				//}

				// editordercontroller
				if (params.controller.hasOwnProperty('changeEstab')) {

					//console.log("customPage-order-editordercontroller!!");

					// Incluindo no controller o tipo de frete
					params.controller.tiposFrete = [{
							epcValue: '1',
							descEpcValue: 'CIF'
						}, {
							epcValue: '2',
							descEpcValue: 'FOB'
						}
					];

					// Incluindo no controller paletizado
					params.controller.paletizado = [{
							epcValue: '1',
							descEpcValue: 'SIM'
						}, {
							epcValue: '2',
							descEpcValue: 'NÃO'
						}
					];


					// procuramos um elemento que tem a class "form-horizontal"
					var formHorizontal,
					html,
					compiledHTML;

					// Recuperando o objeto que possui a divisão page-form
					formHorizontal = element.find(".form-horizontal");

					// definimos a customização que será adicionada ao elemento, nesse caso incluímos 2 novos campos para exibição
					html =  '<totvs-page-detail-info-group>{{ \'Informações Adicionais\' | i18n }}</totvs-page-detail-info-group>' +
						'<field type="combo" ng-model="controller.order[\'epcValue\']"' +
						'ng-disabled="controller.orderDisabled"' +
						'ng-options="item.epcValue as item.descEpcValue for item in controller.tiposFrete">' +
						'<label>{{\'Tipo de Frete\' | i18n}}</label>' +
						'</field>';

					compiledHTML = customService.compileHTML(params, html);

					formHorizontal.append(compiledHTML);

                                        html =	'<field type="combo" ng-model="controller.order[\'epcValuePaletizado\']"' +
						'ng-disabled="controller.orderDisabled"' +
						'ng-options="item.epcValue as item.descEpcValue for item in controller.paletizado">' +
						'<label>{{\'Paletizadoz\' | i18n}}</label>' +
						'</field>';

					formHorizontal = element.find(".form-horizontal");

					compiledHTML = customService.compileHTML(params, html);

					formHorizontal.append(compiledHTML);





				}

				// modalSearchItemcontroller
				if (params.controller.hasOwnProperty('nrSequencia')) {

					//console.log("customPage-order-modalSearchItemcontroller-ini!!");

					params.controller.addItemsToAfterOriginal = params.controller.addItemsToAfter;
					
					params.controller.addItemsToAfter = async function(item){
						//console.log('addItemsToAfter - Ini');
						//console.dir(params.controller);
						
						// Verifica se o item já foi escolhido 
						var that = this;
						this.itemEscolhido = false;
						angular.forEach(params.controller.itemsListoToAddAfter, function(itemEscolhido) {
							if (itemEscolhido['it-codigo'].trim() === item['it-codigo'].trim() &&
							    itemEscolhido['cod-refer'].trim() === item['cod-refer'].trim()) {
								that.itemEscolhido = true;
							}
						});

						// Neste ponto a validaçao e com relação ao temporário
						if (this.itemEscolhido){
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
							   title: $rootScope.i18n('l-warning'),
							   detail: $rootScope.i18n('Item já selecionado')
							});
							return;
						}
						
						// Verifica se o item já está no pedido
						orderResource.getOrder({nrPedido: params.controller.nrPedido}, function(result) {
							//console.dir(result);
							if (result.$hasError) {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									title: $rootScope.i18n('l-warning'),
									detail: $rootScope.i18n('Problema para recuperar os itens da ordem')
								});
							}
							
							angular.forEach(result.ttOrderItem, function(orderItem) {
								if (orderItem['it-codigo'].trim() === item['it-codigo'].trim() &&
								    orderItem['cod-refer'].trim() === item['cod-refer'].trim()) {
									that.itemEscolhido = true;
								}
							});
						});
						
						// Esperando até a conclusão da chamada
						await params.controller.sleep(1000);
						
						//console.log('itemEscolhido: ' + this.itemEscolhido);
						if (this.itemEscolhido){
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
							   title: $rootScope.i18n('l-warning'),
							   detail: $rootScope.i18n('Item já incluído no pedido')
							});
						}						
						
						// Não foi escolhido nem inserido no pedido, deixa adicionar
						if (!this.itemEscolhido) params.controller.addItemsToAfterOriginal(item);
						
						//console.log('addItemsToAfter - fim');
					};
					
					params.controller.sleep = function(ms) {
						return new Promise(resolve => setTimeout(resolve, ms));
					};
					
					//console.log("customPage-order-modalSearchItemcontroller-fim!!");
				}

				//console.log("customPage-order-fim!!");
			}
			
		}
		angular.extend(service, customService);

		return service;
	}
	// Registra o serviço com um nome específico
	index.register.factory('custom.dts.mpd.order', orderCustomService);
		
	// Servico para recuperar as informaçoes do estabelecimento, interfere no zoom	customCustomer.$inject = ['$totvsresource'];
	customZoomEstabelec.$inject = ['$totvsresource'];
    function customZoomEstabelec($totvsresource, genericService) {

        var specificResources = {
            'getListaEstabelecimento': {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/api/esp/fchesp0001/listaestabelecimento/:orderId',
                params: {orderId: '@orderId'}
            }
        };

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/esp/fchesp0001', {}, specificResources);
		
        return factory;
    }
    index.register.factory('custom.mpd.estabelecSE.zoom', customZoomEstabelec);	

	// Informações para tratar o zoom do estabelecimento
	serviceZoomEstabelecimentoEspec.$inject = ['mpd.estabelec.zoom', '$stateParams', '$totvsresource', 'custom.mpd.estabelecSE.zoom'];
	function serviceZoomEstabelecimentoEspec(serviceZoomEstabelecimentoSE, $stateParams, $totvsresource, customZoomEstabelec) {

		var service = {};

		angular.extend(service, serviceZoomEstabelecimentoSE); // Extende o serviço de zoom padrão

		service.afterQuery = function (zoomResultList, parameters) {

			//console.log('afterQuery-ini');
			//console.dir(parameters);

			customZoomEstabelec.getListaEstabelecimento({orderId: $stateParams.orderId}, function(result) {
				
				// Recupera a lista e elimina as que nao pertencerem
			    for (var i = 0; i < zoomResultList.length; i++) {
					
					var achou = false;
					result.forEach(function(listaEstabelec) {
						if (listaEstabelec.stop) { return; }
						if (zoomResultList[i]['cod-estabel'] == listaEstabelec['cod-estabel']){
							achou = true;
							listaEstabelec.stop = true;
						}
					})
					if (!achou) {
						zoomResultList.splice(i, 1);
						i--;
					}
				}
			});
			
			//console.dir(zoomResultList);
			//console.log('afterQuery-fim');
			
		};

		return service;
	}
	index.register.service('mpd.estabelecSE.zoom', serviceZoomEstabelecimentoEspec);
	index.register.service('mpd.estabelecSE.select', serviceZoomEstabelecimentoEspec);

});
