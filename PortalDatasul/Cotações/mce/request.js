
/************************************************/
/* Autor....: Victor Alves - Quali IT       	*/
/* Descricao: Exemplo UPC (html.mce.cd1406)		*/
/************************************************/
define(['index',
		'totvs-html-framework', 
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js',
        '/dts/mcc/js/mcc-utils.js',
        '/dts/custom/men/js/zoom/item.js',     
    ],

function (index, custom, request) {	

    /* Função de formatação de casas decimais */
	function getFormattedPrice(price){
		return new Intl.NumberFormat('pt-BR', {style:'currency', currency:'BRL',
				minimumFractionDigits:5}).format(price);
	}

	requestCustomService.$inject = ['customization.generic.Factory',
									'$timeout', 
									'$rootScope', 
									'$stateParams',
									'$state',
									'TOTVSEvent',
									'mcc.ccapi354.Factory', 'custom.dts.mce.factoryRequestEsp', 'mcc.request.ModalRequestQuestion' ];

	function requestCustomService(customService, 
								  $timeout,
								  $rootScope,
								  $stateParams,
								  $state,
								  TOTVSEvent,
								  requestFactory, requestFactoryEsp, modalRequestQuestion  /*, $rootScope, $scope, $stateParams, $window, $location, $state*/ ) {

		var requestCustomService = this;
		
					
		service = {
			
			// Funcao para tela CD1406 (Criacao de REQUISICAO)
			customRequest_edit: function (params, element) {	
					
				return "OK";
			},	
			
			/* Evento customizado da tela Item (Adicionar ITEM) */
			customRequest_editItem: function (params, element) {	
			
				$timeout( function(){		
							
					//Criando campo na tela de item da requisicao
					
					container = element.first('');	
					var requestNum = container.querySelectorAll("form > fieldset");
					var lEmergencial = false;
					
					requestNum.prepend('<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">' +				
										'<input type="radio" id="lCompras" name="cbNatureza" value="0" checked>  ' +
										'<label for="teste">Compras</label> ' +
										'<input type="radio" id="lServicos" name="cbNatureza" value="1" > ' +
										'<label for="teste1">Serviços</label> ' +
										'<input type="radio" id="lBeneficiamento" name="cbNatureza" value="2" > ' +
										'<label for="teste2">Beneficiamento</label> ' +
										'</div>' 																			
										);
										
					container = element.first('');	
					var observacao = container.querySelectorAll("form > fieldset > form");
					
					obsEletronica = observacao.find('textarea[id="controller_model.ttrequestitemdefault[narrativa]"]').parent("div").parent("div").parent().parent().parent();
					
					obsEletronica.append('<field type="textarea" class="col-md-12 col-sm-12 ng-pristine ng-untouched ng-valid ' +
									'col-xs-12 ng-valid-maxlength" maxlength="2000" id="ObsEletronica" ng-model="controller.model.ttrequestitemdefault[\'epcValue\']"> ' + 
									' <div class="field-container ng-scope"><label class="field-label ng-binding" for="esp-observacao-eletronica" ' +
									'tooltip="Observação Eletrônica" tooltip-placement="top">Observação Eletrônica</label> ' +
									'<div class="field-input"><div class="input-group" style="min-height: 100px;"> ' + 
									'<textarea class="form-control ng-pristine  ng-untouched ng-valid ng-valid-maxlength" ' +
									'bind="" rows="3" maxlength="2000" name="esp-observacao-eletronica" ' +
									'id="esp-observacao-eletronica" ng-model="controller.model.ttrequestitemdefault[\'epcValue\']"></textarea></div></div></div></field>');
									
					// Desabilitar o campo urgente aguarda um tempo para carregar a tabela				
					Urgente = element.find('input[ng-model="controller.model.ttRequestItemDefault[\'log-1\']"]'); 
					
					$timeout( function(){	
					
						Urgente.attr   ("disabled"    ,"disabled"    );
						Urgente.attr   ("ng-disabled" ,"true"        );
					
						customService.compileHTML(params, Urgente);
					
					},500);
					
					/* Busca botão salvar */
					btnSave 	   = element.find('button[ng-click="controller.save();"]'   ); 	
					btnSaveNew     = element.find('button[ng-click="controller.saveNew();"]'); 		
					
					/* retira click do botão */
					btnSave.off('click');
					btnSaveNew.off('click');

					/* Adicionar evento especifico */
					btnSave.attr   ("ng-click" ,"controller.Esp_Save();"    );
					btnSaveNew.attr("ng-click" ,"controller.Esp_SaveNew();" );
					
					var lCreateItem = true;
				
					/* Significa que é alteração - preencher campos especificos */
					if ($stateParams) {
						$stateParams.item = !$stateParams.item ? "" : decodeURIComponent(decodeURIComponent(decodeURIComponent($stateParams.item)));
						if ($stateParams.req && $stateParams.seq) {
							
							lCreateItem = false;
							
							obsEletronicaModify = element.find('textarea[id="esp-observacao-eletronica"]'   ); 	
							
							// $stateParams.req  = numero da requisicao
							// $stateParams.seq  = sequencia
							// $stateParams.item = item
							
							requestFactoryEsp.GetCamposExtRequisicaoItem({  pNrRequisicao: $stateParams.req, 
																			pItCodigo    : $stateParams.item,
																			pSequencia   : $stateParams.seq}, 
																			function(result) {						
																			

							$("#esp-observacao-eletronica").val(result['QP_pObsEletronica']);
							
							setValueChecked('cbNatureza',result['QP_pNatureza']);
							
							
						});
						}
					}					
					/* Compila HTML com novos boto~es */
					customService.compileHTML(params, btnSave);
					customService.compileHTML(params, btnSaveNew);	

				}, 500 );
				
				// Salva a criação ou edição de um item da requisição
			    params.controller.save = async function() {
					
					params.controller.setModelFields();
																				
					if (params.controller.isInvalidForm()) { return; }
					// se for a tela de edição, faz o update
					//if ($state.is('dts/'+$scope.module+'/request.itemEdit')) {
					if ($stateParams) {
					
						$stateParams.item = !$stateParams.item ? "" : decodeURIComponent(decodeURIComponent(decodeURIComponent($stateParams.item)));
						
						if ($stateParams.req && $stateParams.seq) 
						{
							return new Promise(function(resolve, reject) {

								requestFactory.createUpdateRequestItem({pAction: "UPDATE", pLastItem: true}, 
																	   {'ttRequestItemOriginal': [params.controller.model.ttRequestItemDefault], 
																	    'ttGenericBusinessUnit': params.controller.model.ttGenericBusinessUnit}, 
								function(result) {						
							
								if(!result['$hasError']){
									params.controller.onSaveUpdate(true);
									resolve("ok");
																	
								}
								else
								{
									resolve("nok");
								}							
							})});
						} 
						else 
						{ 
							// senão faz o create
							var lOkPadrao = await params.controller.saveItem(true); 
							return lOkPadrao;
						}
					}
				}
				
				//edixxxx
				// Faz uma requisição ao servidor passando o item a ser criado
				params.controller.saveItem = function(isLastItem){
					
					return new Promise(function(resolve, reject) {
					
						if(params.controller.model.ttRequest && params.controller.model.ttRequest.situacao == 3){
							params.modalRequestQuestion.open({}).then(function(result) {
								var changeRequestStatus = false;
								if(result && result.changeRequestStatus){
									changeRequestStatus = true;
								}
								
								requestFactory.createUpdateRequestItem_v2( {pAction: "CREATE", pLastItem: isLastItem, pChangeRequestStatus: changeRequestStatus}, 
																		{'ttRequestItemOriginal': [params.controller.model.ttRequestItemDefault], 
																		 'ttGenericBusinessUnit': params.controller.model.ttGenericBusinessUnit}, function(result) {
									if(!result['$hasError'])
									{
										
										params.controller.onSaveUpdate(false);
										resolve('ok');
									}
									else
									{
										resolve('nok');
									}										
								});		    		
							});
						}else{
							requestFactory.createUpdateRequestItem( {pAction: "CREATE", pLastItem: isLastItem}, 
																	{'ttRequestItemOriginal': [params.controller.model.ttRequestItemDefault], 
																	 'ttGenericBusinessUnit': params.controller.model.ttGenericBusinessUnit}, function(result) {
								if(!result['$hasError'])
								{
									params.controller.onSaveUpdate(false);
									resolve('ok');
								}
								else 
								{
									resolve('nok');
								}
							});
						}
					});
				}				
				//edixxxx
				
				
				/* Metodos especificos (BOTÃO SALVAR) */
				params.controller.Esp_Save = async function()
				{			
					/*await modalRequestQuestion.open({}).then(function(result) {
						console.log(result);    		
					});*/
				
					var lOk = await params.controller.Esp_Validate();
					
					if (lOk == "ok")
					{						
					
						try
						{		 
							var lOkPadrao = await params.controller.save();
							
							if (lOkPadrao == "ok")
							{
								
								cbNatureza = element.find('input[name="cbNatureza"]'   ); 
								cbNaturezaCheck = 0;
							
								for (var i = 0; i < cbNatureza.length ; i++)
								{
									if(cbNatureza[i].checked)
									{
										cbNaturezaCheck = i;
									}
								}
							
								obsEletronica = element.find('textarea[id="esp-observacao-eletronica"]'   ); 	
								
								iSequencia = 0;
								lLog1 = false;
								try
								{
									if (params.controller.model.ttRequestItemDefault['sequencia'] !== 'undefined')
									{
										iSequencia = params.controller.model.ttRequestItemDefault['sequencia'];
									}
									
									if (params.controller.model.ttRequestItemDefault['log-1'] !== 'undefined')
									{
										lLog1 = params.controller.model.ttRequestItemDefault['log-1'];
									}
								}
								catch (e)
								{}
													
								
								requestFactoryEsp.postEspConfirmaRequisicaoItem({pNrRequisicao   : params.controller.requestNumber, 
																				 pItCodigo       : params.selectControllers['it-codigo'].selected['it-codigo'], 
																				 pSequencia      : iSequencia, 
																				 pObsEletronica  : obsEletronica.val(),
																				 pNatureza       : cbNaturezaCheck,
																				 pEmergencial    : lLog1 },															 
																				 function(result) {						
				
								}); 
						
							}
						
						}
						catch(e)
						{
							console.log("### ERRO " + e.message);
						} 										
					} 
				};

				/* Definicao - Metodos especificos (BOTÃO SALVAR E NOVO) */
				params.controller.Esp_SaveNew = async function()
				{
	/*				$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
						detail: 'Clicou botão SaveNew'
					});*/
					
					params.controller.savedAndContinued = true;
					params.controller.Esp_Save();

					
				};

				/* Definicao da funcao ESP_VALIDATE */
				params.controller.Esp_Validate = async function()
				{
					/* Adiciona a validação especifica aqui */
					/*$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
						detail: 'Clicou botão SaveNew'
					});*/

					dtEntrega = element.find('div[id="requestDeliveryDate"] > input'); 
					lCompras  = element.find('div[id="lcompras"]'); 
					
					/* Executa request Promise para aguardar retorno */
					return new Promise(function(resolve, reject) {
						requestFactoryEsp.getEspValidate({pNrRequisicao: params.controller.requestNumber, 
						 								pItCodigo    : params.selectControllers['it-codigo'].selected['it-codigo'],
														pDataEntrega : dtEntrega.val(),  
														pCtCodigo    : params.selectControllers['ct-codigo'].selected['cod_cta_ctbl'],
														pScCodigo    : params.selectControllers['sc-codigo'].selected['cod_ccusto'], 
														pNarrativa   : params.controller.model.ttRequestItemDefault['narrativa'],
														pNumOrdInv   : params.controller.model.ttRequestItemDefault['num-ord-inv'],
														/*pNumOrdInv   : ordInv.val() */ }, function(result) {						
														
							lEmergencial = false;
							params.controller.model.ttRequestItemDefault['log-1'] = false;
							
							if (result['$hasError']) {		
								resolve("nok");
								return "nok";							
							}				
							else
							{
								if ( result['QP_pMSG'] != "" )  
								{
									if (confirm(result['QP_pMSG']) == true) 
									{  
										params.controller.model.ttRequestItemDefault['dt-entrega'] = StringToDate(result['QP_pDataEntrega']);
									} else 
									    { 
									        alert('ATENÇÃO ORDEM EMERGENCIAL - Data mínima de entrega : ' + result['QP_pDataEntrega'] );
											lEmergencial = true;
											params.controller.model.ttRequestItemDefault['log-1'] = true;
                                        }
							    }
								resolve("ok");
								return "ok";
							}		
						});
					});				
				}
			
			},
		};

		angular.extend(service, customService);
		return service;

	};

	index.register.factory('custom.dts.mce.request', requestCustomService);

	/* TOTVS */
    mceCustomService.$inject = ['customization.generic.Factory', '$rootScope','TOTVSEvent', 'mcc.ccapi354.Factory', '$location', '$state'];  
    function mceCustomService(customService, $rootScope, TOTVSEvent, requestFactory, $location, $state){  
        service = {     
        customRequest_editItem:function(params, element){
                
                var scoper = angular.element(element).scope()
                var actualscope =  scoper.$parent;
                
                actualscope.$watch("controller.itemZoomField['it-codigo']", function(newValue, oldValue) {                                           
                    if (newValue != "" && newValue != undefined) {
                        if (oldValue != undefined ){
							if (oldValue != newValue){
								params.controller.AtivaLeave();
							}
						}else{params.controller.AtivaLeave();}
                    }                 
                });                 

                params.controller.AtivaLeave = function() {
                    params.controller.fieldLeave("it-codigo", params.controller.itemZoomField);                    
                };

                var btZoom = element.find('button')[4];
                var inputbtgroup = element.find('.input-group-btn')[0];
                btZoom.remove();
    			
                var html =      '<button class="botaonovo btn btn-default ng-pristine ng-untouched ng-valid ng-isolate-scope ng-scope" ng-model="controller.itemZoomField" zoom="" zoom-service="men.item.zoom2" tooltip="Item">'
						+ 		'<span class="glyphicon glyphicon-search" aria-hidden="true"></span>'
						+ 		'</button>';
				
				var compiledHTML = customService.compileHTML(params, html);
                inputbtgroup.append(compiledHTML[0]);	
            },
        };
        angular.extend(service, customService);
        return service;
    }  
    index.register.factory('custom.dts.mce.request', mceCustomService);       
});

function StringToDate(date)
{
	dtSplit = date.split('/').reverse();
	return new Date(dtSplit[0], dtSplit[1] - 1, dtSplit[2]);
}

function getValueChecked(parname)
{
	var x = document.getElementsByName(parname); 
	for (var i = 0; i < x.length; i++) {
		if (x[i].checked == true) { 
			return x[i].value;
		}
    }
    return "";
}

function setValueChecked(prname,val){
	var x = document.getElementsByName(prname);    
	for (var i = 0; i < x.length; i++) {
		if (x[i].value == val) {
			x[i].checked = true;
        }
    }
}

