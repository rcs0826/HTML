function getElementCS(element, text, remAlter){
	let objRef;
	for (var i = 0; i < element.children.length; i++) {
		if (element.children[i].innerHTML.trim() == text.trim()) {
			console.info("Achou",element.children[i]);

			var obj = element.children[i];
				objRef = obj;				
			for (var x = 0; x < remAlter; x++) {
				objRef = (x==0)?obj.parentElement:objRef.parentElement;
			}
			objRef.remove();
			break;
		}
		else{
			getElementCS(element.children[i], text,remAlter);
		}
	}
	return ;
}
//var body = document.getElementsByTagName("body");
//getElementCS(body[0], "Pesquisa de Itens",6);
/************************************************/
/* Autor....: Victor Alves - Quali IT       	*/
/* Descricao: Exemplo UPC (html.mce.cd1406)		*/
/************************************************/
define(['index', 'totvs-html-framework', ], function (index, custom) {
	 console.log("Customização Order(V02-NOVO)!!");
	/* Função de formatação de casas decimais */
	 requestCustomService.$inject = ['customization.generic.Factory', '$timeout', '$rootScope', '$stateParams', '$state'];
	 function requestCustomService(customService, $timeout, $rootScope, $stateParams, $state) {
		 var requestCustomService = this;
		 var html, compiledHTML;
		 //alert("teste renata");
		 var service = {
			 orderItems: function (params, element) {
				 console.info("element",element);
				 console.info("params",params);
				 // Esconde o Botão de cancelar 
				 //element[0].children[0].children[0].children[0].children[0].children[0].children[2].style = "display:none";
				 console.info("orderItems");
				//this.getElementCS(element, "Pesquisa de Itens",6);
				 return "OK";
			}
			,customListItem: function (params, element) {
				console.info("customListItem");
			}
			, customPage: function (params, element) {
				 console.info("cp element",element);
				 console.info("cp params",params);
				 //element.find('div[is-open="controller.openSearchItems"]').remove();
				 console.info("customPage");
				 //console.dir();
				 element[0].children[0].children[1].children[0].children[0].children[0].children[1].remove();
				//this.getElementCS(element, "Pesquisa de Itens",6);
				 //0 1 0 0 0 1
			}
			, pd4000itemfields:function (params, element) {
				 //teste.remove();
				 console.info("item element",element);
				 console.info("item params",params);
				 html = addInput("num","6", "Desconto Bonificação", "epcValue");
				 //html += addInput("text","2", "Teste", "epcValue1");
				 compiledHTML = customService.compileHTML(params, html);
				 element.append(compiledHTML);
				 return "OK";
			}
			, 
		}
		 $timeout(function(){			 		
			console.info("$timeout");
			var body = document.getElementsByTagName("body");
			getElementCS(body[0], "Pesquisa de Itens",6);
		} ,2000);

		 $rootScope.$on('customPage', function(event) {				 		
			console.info("$scope.$on");
			var body = document.getElementsByTagName("body");
			getElementCS(body[0], "Pesquisa de Itens",6);
		 });

		 angular.extend(service, customService);
		 $("#menu-loading").hide();
		 return service;
	};
	 index.register.factory('custom.dts.mpd.order2', requestCustomService);
});
 
function addInput(type, tamanho, title, newItem){
	let html = '<field class="col-xs-12 col-sm-12 col-md-{{tamanho}} ng-pristine ng-untouched ng-valid" type="decimal" ng-model="itemController.item[\'{{newItem}}\']" ng-disabled="false" data-m-dec="4" id="itemcontroller_item[{{newItem}}]" > <div class="field-container ng-scope"> <label class="field-label ng-binding" for="itemcontroller_item[{{newItem}}]" tooltip="{{title}}}" tooltip-placement="top">{{title}}</label> <div class="field-input"> <div class="input-group"> <input class="form-control ng-pristine ng-untouched ng-valid" bind="" type="text" {{num}} ng-model-options="{ debounce: 100 }" ng-model="item[{{newItem}}]" ng-disabled="false" data-m-dec="4" name="itemcontroller_item[{{newItem}}]" id="itemcontroller_item[{{newItem}}]" > </div> </div> </div> </field>';

	html = html.replace(/{{tamanho}}/g,tamanho);
	html = html.replace(/{{title}}/g,title);
	html = html.replace(/{{newItem}}/g,newItem);

	if(type == "num"){
		html = html.replace(/{{num}}/g,'autonumeric="" data-a-dec="," data-a-sep="."');
	}

	return html;
}
