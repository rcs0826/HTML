define(['index',
        '/dts/mcf/js/zoom/modelo-cf.js',
		'/dts/mcf/js/utils/bootstrap-treeview.js'
		], function(index) {

	modalNewCFG.$inject = ['$modal'];
	function modalNewCFG($modal) {
        this.open = function (params) {
        	params.isModal = true;
            var instance = $modal.open({
                templateUrl: '/dts/mcf/html/smartconfiguration/smartconfiguration.configuration.html',
                controller: 'mcf.smartconfiguration.modal.ConfigurationCtrl as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: { $stateParams: function () { return params; } }
            });
            return instance.result;
        }
    }

	function configurationCtrl(controller,
							   $modalInstance,
							   $rootScope,
							   $window,
							   $scope, 
							   $stateParams, 
							   $state,
							   $modal,
							   $filter,
							   $location,
							   $compile,
							   appViewService,
							   cfapi004,
							   appNotificationService,
							   TOTVSEvent) {
								   

		/**
		 * Variaveis
		 */
		//controller.model = {}; // mantem o conteudo do registro em detalhamento		
		controller.tgError	     	= false;
		controller.btnConfigurar 	= false;
		controller.tgEditar			= false;
		controller.tgTabela			= false;
		controller.tgAvancar 		= true;
		controller.tgVoltar 		= false;
		controller.tgReconfig       = false;
		controller.lOperations      = true;
		controller.lData      		= true;
		controller.lForms		    = true;
		controller.lAtuVarCost		= false;
		controller.tgCancela        = false;
		controller.tgStart			= true;
		controller.narrativa		= "";
		controller.tbChaveFilho     = "";
		controller.tpCampo 			= "";
		controller.pNivel    		= 1;
		controller.nivelAtual 		= 1;
		controller.ultimoNivel 		= 0;
		controller.numCFG 			= 0;
		controller.dadosTreeTela 	= [];
		controller.ListFieldEnter	= [];
		controller.ListField 		= [];
		controller.ListFieldTree	= [];
		controller.ListFieldEditar 	= [];
		controller.qtdTotalCompon	= 0;
		controller.qtdCompon		= 0;
		controller.lastListField 	= [];
		controller.ttRowErrors      = [];
		controller.inputValue		= 0;
		controller.ttDetailConfiguration = 
		[{
			moCodigo      : "",
			descModelo    : "",
			itemCriado    : "",
			descItem      : "",
			numCFG        : 0,
			descCFG       : "",
			tgReconfig    : false
		}];
		controller.ttTree = 
		[{
			nivel       : 0,
			idObjeto    : 0,
			seq         : 0,
			chavePai    : "",
			chaveFilho  : "",
			texto       : "",
			textoHTML   : "",
			valorHTML   : "",
			imagem      : 0,
			imgExp      : 0,
			expand      : false,
			oper        : 0,
			operOld     : 0,
			operNav     : 0,
			regDuplic   : "?",
			cTpDado     : "",
			tipoResult  : ""
		}];
		controller.ttTreeBKP = 
		[{
			nivel       : 0,
			idObjeto    : 0,
			seq         : 0,
			chavePai    : "",
			chaveFilho  : "",
			texto       : "",
			textoHTML   : "",
			valorHTML   : "",
			imagem      : 0,
			imgExp      : 0,
			expand      : false,
			oper        : 0,
			operOld     : 0,
			operNav     : 0,
			regDuplic   : "?",
			cTpDado     : "",
			tipoResult  : ""
		}];
		controller.ttVariavel = 
		[{
			seqMod          : 0,
			seqPai          : 0,
			seqVar          : 0,
			cConfig         : "",
			nivel           : 0, 
			tgPrimeiro      : false,
			moCodigo        : "",
			nomeVar         : "",
			nomeCte         : "",
			sequenciaRes    : 0,
			sequenciaVar    : 0,
			descricao       : "",
			tipoValor       : 0,
			valorChar       : 0,
			valorDec        : 0,
			tipoResult      : "",
			cTipoResult     : "",
			abreviatura     : "",
			tgGeraNarrativa : "",
			indTipoVar      : 0,
			nrTabela        : "",
			endereco        : "?",
			cTpDado         : ""
		}];
		controller.ttVarCFG = 
		[{
			nome        : "",
			valor       : 0,
			texto       : "",
			nrTabela    : 0,
			tipoRes     : 0,
			abrevNar    : "",
			sequencia   : 0,
			moCodigo    : ""
		}];
		controller.ttOperModelo = 
		[{
			cConfig           : "",
			moCodigo          : "",
			numIdOperacao     : 0,
			itCodigo          : "",
			opCodigo          : 0,
			codRoteiro        : "",
			tempoHomem        : 0,
			tempoMaquin       : 0,
			tempoPrepar       : 0,
			qtdTempoPosProces : 0,
			valOperacItem     : 0,
			nivel             : 0,
			seqPai            : 0,
			endereco          : "",
			sequencial        : 0
		}];

	    /**
	     * Metodo para a acao de cancelar
	     */	    
	    controller.cancel = function() {
			// solicita que o usuario confirme o cancelamento da edicao/inclusao
			// dismiss e o fechamento quando cancela ou quando clicar fora do modal (ESC)
			if (controller.isModal) {
				$modalInstance.close(controller.numCFG);
			} else {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-question',
					text: $rootScope.i18n('l-cancel-operation'),
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function(isPositiveResult) {
						if (isPositiveResult) { // se confirmou, navega para a pagina anterior
							$location.path('dts/mcf/smartconfiguration');
							//$window.history.back();
						}
					}
				});
			}
	    }

	    controller.back = function() {
			if (controller.tgEditar) {
				alert("Para voltar de nivel será necessário sair do modo de edição de campos!");
			} else {
				if (controller.pNivel <= 1) {
					controller.tgStart       = false;
					controller.btnConfigurar = false;
					controller.buscaDados    = false;
					controller.dadosTreeTela = [];
					controller.ListField     = [];
					controller.ListFieldEditar = [];

					if (controller.tgReconfig){
						controller.recuperaConfiguracao();
					}
				} else {
					controller.navegaConfig("V", controller.pNivel - 1, false, 0 );
				}
			}
	    }

	    controller.advanced = function() {
			controller.btnConfigurar = true;
			controller.tgEditar = false;
			controller.navegaConfig("A", controller.pNivel, true, 4 );
		}

	    controller.navegaConfig = function(pDirecao, pNivel, pOper, pVar) {
			var param = {
				pTipo: 9, /*Parametro passado para resolver BUG Progress INPUT-OUTPUT */
				ttDetailConfiguration:controller.ttDetailConfiguration,
				ttTree:controller.ttTree,
				ttTreeBKP:controller.ttTreeBKP,
				ttVariavel:controller.ttVariavel,
				ttVarCFG:controller.ttVarCFG,
				ttOperModelo:controller.ttOperModelo,
				ttRowErrors:controller.ttRowErrors,
				pDirecao:pDirecao,
				pOper:pOper,
				pVar:pVar, 
				pNarrativa:controller.narrativa,
				pEstAvancar:controller.tgAvancar, 
				pEstVoltar:controller.tgVoltar, 
				pNivel:pNivel,
				pNivelAtu:controller.nivelAtual,
				pUltimoNivel:controller.ultimoNivel
			};

			cfapi004.navegaConfig(param, function(result){
				if (result.$hasError){
					alert("Erro-51");
					if (controller.isModal) {
						alert("Erro-52");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-53");
						$window.history.back();
					}
					alert("Erro-54");
				}else if (result){

					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.ttDetailConfiguration = result.ttDetailConfiguration;
						controller.ttTree 		= result.ttTree;
						controller.ttTreeBKP 	= result.ttTreeBKP;
						controller.ttVariavel 	= result.ttVariavel;
						controller.ttVarCFG 	= result.ttVarCFG;
						controller.ttOperModelo = result.ttOperModelo;
						controller.pNivel       = result.pNivel;
						controller.nivelAtual   = result.pNivelAtu;
						controller.ultimoNivel  = result.pUltimoNivel;
						controller.tgAvancar	= result.pEstAvancar;
						controller.tgVoltar 	= result.pEstVoltar;
						controller.narrativa	= result.pNarrativa;

						$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/

						//Atualiza nivel na tela
						$('#idNivel')[0].value = controller.pNivel;

						$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
						controller.iniciaEdicaoTreeView();
						controller.geraTreeView();
					}
				}
			});
		}

	    controller.save = function(pIndAprov) {
			var param = {
				pTipo: 9, /*Parametro passado para resolver BUG Progress INPUT-OUTPUT */
				ttDetailConfiguration:controller.ttDetailConfiguration,
				ttTree:controller.ttTree,
				ttTreeBKP:controller.ttTreeBKP,
				ttVariavel:controller.ttVariavel,
				ttVarCFG:controller.ttVarCFG,
				ttOperModelo:controller.ttOperModelo,
				ttRowErrors:controller.ttRowErrors,
				pIndAprov:pIndAprov, /*1-Pre Salvamento:Aberto, 5-Salvar:Processo Aprovado*/
				pNarrativa:controller.narrativa,
				tgPedido:false
			};

			cfapi004.gravaConfiguracao(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					controller.tgError = false;
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							if (resultErrors.ErrorSubType != "warning") {
								controller.tgError = true;
							}
							if(resultErrors){
								var alert = {
									type: resultErrors.ErrorSubType,
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					}
					if (!controller.tgError) {
						controller.dadosTreeTela = [];
						controller.ListField     = [];
						var alert = {
							type: 'success',
							title: "Confirmação Configuração!",
							size: 'md',
							detail: "Configuração: " + controller.numCFG + ", Salva com SUCESSO." 
						};
						appNotificationService.notify(alert);

						if (!controller.isModal)
							$location.path('dts/mcf/smartconfiguration');
						else
							$modalInstance.close(controller.numCFG);
					}
				}
			});
		}

	    controller.changeDescConfigur = function() {
			controller.ttDetailConfiguration[0].descCFG = controller.descConfigur;
	    }
		controller.changeField = function(pTipo, pValor){
			if ((controller.itemCriado != "" || controller.moCodigo != "")
			&&  (controller.itemCriado != controller.itemTela
				|| controller.moCodigo != controller.modeloTela))
				{
					controller.getModeloCFG("T",pTipo, pValor);
				}
		}

		controller.getModeloCFG = function(pOrigem,pTipo, pValor){
			if ((controller.itemCriado != "" || controller.moCodigo   != "")
			&&  (controller.itemCriado != controller.itemTela
				|| controller.moCodigo != controller.modeloTela)
			|| (pOrigem == "C"))
			{
				var param = {
						pTipo: pTipo,
						pValor: pValor,
						ttDetailConfiguration:controller.ttDetailConfiguration
					};

				cfapi004.getModeloCFG(param, function(result){
					controller.tgStart = true;
					if (result.$hasError){
						alert("Erro-01");
						if (controller.isModal) {
							alert("Erro-02");
							$modalInstance.dismiss();
						}
						else {
							alert("Erro-03");
							$window.history.back();
						}
						alert("Erro-04");
					}else if (result){
						//alert("Leon:" + result.ttRowErrors.length);
						//console.log("Retorno:", result);
						if (result.ttRowErrors.length > 0){
							controller.ttDetailConfiguration = [];
							controller.descItem		= "";
							controller.descModelo	= "";
							if (pTipo == 1) {
								controller.moCodigo		= "";
							} else {
								controller.itemCriado	= "";
							}
							angular.forEach(result.ttRowErrors,function(resultErrors){
								controller.tgError = true;
								if(resultErrors){
									var alert = {
										type: 'error',
										title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
										size: 'md',
										detail: resultErrors.ErrorDescription
									};
									appNotificationService.notify(alert);
								}
							});
						} else {
							controller.tgError = false;
							controller.ttDetailConfiguration = result.ttDetailConfiguration;
							if (result.ttDetailConfiguration.length == 0) {
								controller.buscaDados 	= false;
								controller.erro 		= true;
								controller.descItem		= "";
								controller.descModelo	= "";
								if (pTipo == 1) {
									controller.moCodigo		= "";
								} else {
									controller.itemCriado	= "";
								}
							}
							else {
								$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/

								/**Atualizando Tela 
								 * pTipo = 1 - Por Item
								 * pTipo = 2 - Por Modelo
								*/
								if (pTipo == 1) {
									controller.moCodigo		= controller.ttDetailConfiguration[0].moCodigo;
								} else {
									controller.itemCriado	= controller.ttDetailConfiguration[0].itemCriado;
								}
								controller.descItem		= controller.ttDetailConfiguration[0].descItem;
								controller.descModelo	= controller.ttDetailConfiguration[0].descModelo;
								controller.itemTela		= controller.itemCriado;
								controller.modeloTela	= controller.moCodigo;
								controller.buscaDados	= true;
								controller.erro 		= false;

								if (pOrigem == "C") {
									controller.configurar();
								}
							}
						}
					}
				});
			}
		}

	    controller.configurar = function(pTipoConfig){

			if (pTipoConfig == 2) { //Reconfiguracao}
				controller.buscaDados   = false;
				controller.btnConfigurar = true;
				controller.geraTreeView();
			} else if ((controller.numCFG !=0 && !controller.tgStart)) {
				controller.getModeloCFG("C",1,controller.itemCriado);
			} else {
				if (controller.itemCriado == "" || controller.moCodigo == "" || controller.erro == true	){
					alert("É necessário informar Item ou Modelo VALIDO para iniciar Configuração!");
				} else {
					if (controller.buscaDados)
					{
						var param = {
								pTipo: 9, /*Parametro passado para resolver BUG Progress INPUT-OUTPUT */
								ttDetailConfiguration:controller.ttDetailConfiguration
							};
						cfapi004.inicializaConfig(param, function(result){
							if (result.$hasError){
								alert("Erro-11");
								if (controller.isModal) {
									alert("Erro-12");
									$modalInstance.dismiss();
								}
								else {
									alert("Erro-13");
									$window.history.back();
								}
								alert("Erro-14");
							} else if (result){
								if (result.ttRowErrors.length > 0){
									angular.forEach(result.ttRowErrors,function(resultErrors){
										controller.tgError = true;
										if(resultErrors){
											var alert = {
												type: 'error',
												title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
												size: 'md',
												detail: resultErrors.ErrorDescription
											};
											appNotificationService.notify(alert);
										}
									});
								} else {
									controller.ttDetailConfiguration = result.ttDetailConfiguration;
									controller.ttTree 		= result.ttTree;
									controller.ttTreeBKP 	= result.ttTreeBKP;
									controller.ttVariavel 	= result.ttVariavel;
									controller.ttVarCFG 	= result.ttVarCFG;
									controller.ttOperModelo = result.ttOperModelo;
									controller.numCFG 		= controller.ttDetailConfiguration[0].numCFG;
									controller.tgAvancar    = result.pEstAvancar;
									controller.nivelAtual   = result.pNivelAtu;
									controller.ultimoNivel  = result.pUltimoNivel;
									controller.buscaDados   = false;
									controller.btnConfigurar = true;
									controller.geraTreeView();

								} 
							}
						});
					} else {
						$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
						angular.forEach(controller.ListField, function(node){
							$('#' + node.chaveFilho + "Editar").css("display", "");
							$('#' + node.chaveFilho + "Salvar").css("display", "none");
							$('#' + node.chaveFilho + "Cancel").css("display", "none");
							$('#' + node.chaveFilho + "Fechar").css("display", "none");
							$('#' + node.chaveFilho + "Input").css("display", "none");
						});					
					}
				}
			}
		}

		controller.clickEditar = function(pEditar, pListField, pConfig){
			controller.ListFieldEnter = pConfig;
			if (controller.tgAvancar) {
				if (pConfig != undefined) {
					if (((pConfig.imagem == 6 || pConfig.imagem == 7) || pListField.imagem == 12) || (pListField.imagem == 9 && controller.tgFamilia)) {
						controller.tgFamilia = true;
						controller.tpCampo = "Dec";
						controller.tgTabela = false;
					} else {
						controller.tgFamilia = false;
					}
				} else {
					controller.tgFamilia = false;
				}
			
				if (controller.tgEditar && pEditar && pListField.imagem != 12 && !controller.tgFamilia) {
					controller.ListFieldEditar = [];				
					controller.retornaClickEditar(controller.lastListField, pConfig);
					controller.clickEditar(pEditar,pListField, pConfig);
				} else {
					//Tratamento Itens Familia
					if (pEditar == true){
						controller.tgEditar = true;
						controller.lastListField = pListField;
						$('#' + pListField.chaveFilho + "Editar").css("display", "none");
						$('#' + pListField.chaveFilho + "Input").css("display", "");
						$('#' + pListField.chaveFilho + "label").css("display", "none");

						if (pListField.imagem != 12 && !controller.tgFamilia) {
							controller.ListFieldEditar = [];
							angular.forEach(controller.ttTree, function(pNode) {
								if (pNode.chavePai == pListField.chaveFilho){
									controller.tgTabela = true;
									controller.ListFieldEditar.push({	'text'				: pNode.texto,
																		'textHTML'  		: pNode.textoHTML,
																		'valueHTML' 		: pNode.valorHTML,
																		'nivel'				: pNode.nivel,
																		'idObjeto'			: pNode.idObjeto,
																		'chaveFilho'		: pNode.chaveFilho,
																		'oper'				: pNode.oper,
																		'chavePai' 			: pNode.chavePai,
																		'imagem' 			: pNode.imagem,
																		'seq'				: pNode.seq,
																		'icon' 				: controller.buscaImagem(pNode.imagem),
																		'infComplementar' 	: pNode.infComplementar});
								}
							});
							if(pListField.imagem == 6 || pListField.imagem == 7){
								angular.forEach(controller.ListField, function(pResult){
									if(pResult.chaveFilho == controller.ListFieldEditar[0].chavePai){
										pResult.infComplementarFilho = controller.ListFieldEditar[0].infComplementar;
									}
								});
							}
								
						}
						
						if(pListField.imagem == 9 && controller.tgFamilia){
							controller.inputValue = pListField.valueHTML;
						}

						if (!controller.tgTabela) {
							controller.tbChaveFilho = pListField.chaveFilho;
							controller.iniciaEdicaoTreeView(pListField, pConfig);
							
							$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
							$('#' + pListField.chaveFilho + "Input").focus();
							$('#' + pListField.chaveFilho + "Salvar").css("display", "");
							$('#' + pListField.chaveFilho + "Cancel").css("display", "");
						} else {
							$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
							$('#' + pListField.chaveFilho + "Input").css("display", "none");
							$('#' + pListField.chaveFilho + "label").css("display", "");
							$('#' + pListField.chaveFilho + "Fechar").css("display", "");

							angular.forEach(controller.ListFieldEditar, function(node){
								$('#' + node.chaveFilho + "Editar").css("display", "");
								$('#' + node.chaveFilho + "Cancel").css("display", "none");
								$('#' + node.chaveFilho + "Salvar").css("display", "none");
								$('#' + node.chaveFilho + "Fechar").css("display", "none");
								$('#' + node.chaveFilho + "Input").css("display", "none");
							});
						}
					} else {
						if (controller.tgTabela) {
							controller.tgEditar = false;
							controller.tbChaveFilho = pListField.chaveFilho;
							controller.iniciaEdicaoTreeView(pListField, pConfig);
						} else {
							//Atualiza valor decimal nas tabelas temporárias e também dos itens relacioados a familia
							if (controller.tpCampo == "Dec") {
								controller.confirmaEdicaoDec(pListField, pConfig);
							}
							if (controller.tpCampo == "Char") {
								controller.confirmaEdicaoChr(pListField, pConfig);
							}
						}
					}
				}
			}
		}
		
		controller.fecharCampo = function(chaveCampo){
			controller.ListFieldEditar = [];
			controller.tgEditar = false;
			$('#' + chaveCampo + "Editar").css("display", "");
			$('#' + chaveCampo + "Fechar").css("display", "none");			
		}

		controller.retornaClickEditar = function(pListField, pConfig){
			if (!controller.tgError) {
				controller.tgEditar = false;
				controller.tgTabela = false;
				$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
				$('#' + pListField.chaveFilho + "Editar").css("display", "");
				$('#' + pListField.chaveFilho + "Salvar").css("display", "none");
				$('#' + pListField.chaveFilho + "Cancel").css("display", "none");
				$('#' + pListField.chaveFilho + "Fechar").css("display", "none");
				$('#' + pListField.chaveFilho + "Input").css("display", "none");
				$('#' + pListField.chaveFilho + "label").css("display", "");
			} else {
				controller.tgError = false;
				controller.tgEditar = false;
				controller.clickEditar(true, controller.lastListField, pConfig);
			}
		}

		controller.formatNumber = function(cNumber){
			let c1,c2;

			if(cNumber != 0){
				c1 = cNumber.replace(".","");
				c2 = c1.replace(",",".");
				
				return parseFloat(c2);
			}else {
				return 0;
			}
			
		}

		controller.toLocaleString = function(cNumber){
			return parseFloat(cNumber).toLocaleString('de-DE', {minimumFractionDigits: 4});
		}

		controller.confirmaEdicaoDec = function(pListField, pConfig){
			
			pListField.valueHTML = controller.toLocaleString($('#' + pListField.chaveFilho + "Input")[0].value);
			
			var param = {
				pTipo: 9, /*Parametro passado para resolver BUG Progress INPUT-OUTPUT */
				ttDetailConfiguration:controller.ttDetailConfiguration,
				ttTree:controller.ttTree,
				ttTreeBKP:controller.ttTreeBKP,
				ttVariavel:controller.ttVariavel,
				ttVarCFG:controller.ttVarCFG,
				ttOperModelo:controller.ttOperModelo,
				ttRowErrors:controller.ttRowErrors,
				pValDec:$('#' + pListField.chaveFilho + "Input")[0].value,
				pChave:pListField.chaveFilho,
				pNivelAtu:controller.nivelAtual,
				pUltimoNivel:controller.ultimoNivel
			};

			cfapi004.confirmaEdicaoDec(param, function(result){
				if (result.$hasError){
					alert("Erro-21");
					if (controller.isModal) {
						alert("Erro-22");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-23");
						$window.history.back();
					}
					alert("Erro-24");
				}else if (result){
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							controller.lastListField = pListField;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						
						/* Somatória para campo quantidade componente familia */
						if(controller.tgFamilia){
							angular.forEach(controller.ListField, function(result){
								if(result.chaveFilho == pListField.chavePai){
									if(pListField.imagem == 9){										
										result.qtdTotalCompon = (controller.formatNumber(pListField.valueHTML) + controller.formatNumber(result.qtdTotalCompon) - controller.formatNumber(controller.inputValue)).toLocaleString('de-DE', {minimumFractionDigits: 4});
									} else{
										result.qtdTotalCompon = (controller.formatNumber(pListField.valueHTML) + controller.formatNumber(result.qtdTotalCompon)).toLocaleString('de-DE', {minimumFractionDigits: 4}); 
										result.qtdCompon ++;
									}
								}
							});
						}

						controller.ttDetailConfiguration = result.ttDetailConfiguration;
						controller.ttTree 		= result.ttTree;
						controller.ttTreeBKP 	= result.ttTreeBKP;
						controller.ttVariavel 	= result.ttVariavel;
						controller.ttVarCFG 	= result.ttVarCFG;
						controller.ttOperModelo = result.ttOperModelo;
						controller.nivelAtual   = result.pNivelAtu;
						controller.ultimoNivel  = result.pUltimoNivel;

						//Tratativa Itens Familia
						if (pListField.imagem == 12) {
							controller.ListEditarField = [];
							angular.forEach(controller.ttTree, function(pNode) {
								if (pNode.chavePai == pListField.chavePai){
									controller.ListEditarField.push({	'text'		: pNode.texto,
																		'textHTML'  : pNode.textoHTML,
																		'valueHTML' : pNode.valorHTML,
																		'nivel'		: pNode.nivel,
																		'idObjeto'	: pNode.idObjeto,
																		'chaveFilho': pNode.chaveFilho,
																		'oper'		: pNode.oper,
																		'chavePai' 	: pNode.chavePai,
																		'imagem' 	: pNode.imagem,
																		'seq'		: pNode.seq,
																		'icon' 		: controller.buscaImagem(pNode.imagem),
																		'tipoResult': pNode.tipoResult});
								}
							});
							controller.ListFieldEditar = controller.ListEditarField;
							$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/

							angular.forEach(controller.ListFieldEditar, function(node){
								$('#' + node.chaveFilho + "Editar").css("display", "");
								$('#' + node.chaveFilho + "Salvar").css("display", "none");
								$('#' + node.chaveFilho + "Cancel").css("display", "none");
								$('#' + node.chaveFilho + "Fechar").css("display", "none");
								$('#' + node.chaveFilho + "Input").css("display", "none");
							});
						}
						//Atualizar dados da tela conforme retorno do progress
						controller.AtualizaDadosTela();
					}
				}
				$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
				controller.retornaClickEditar(pListField, pConfig);
			});
		}

		controller.confirmaEdicaoChr = function(pListField, pConfig){
			pListField.valueHTML = $('#' + pListField.chaveFilho + "Input")[0].value;

			var param = {
				pTipo: 9, /*Parametro passado para resolver BUG Progress INPUT-OUTPUT */
				ttDetailConfiguration:controller.ttDetailConfiguration,
				ttTree:controller.ttTree,
				ttTreeBKP:controller.ttTreeBKP,
				ttVariavel:controller.ttVariavel,
				ttVarCFG:controller.ttVarCFG,
				ttOperModelo:controller.ttOperModelo,
				ttRowErrors:controller.ttRowErrors,
				pValChr:pListField.valueHTML,
				pChave:pListField.chaveFilho,
				pNivelAtu:controller.nivelAtual,
				pUltimoNivel:controller.ultimoNivel
			};
			cfapi004.confirmaEdicaoChr(param, function(result){
				if (result.$hasError){
					alert("Erro-31");
					if (controller.isModal) {
						alert("Erro-32");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-33");
						$window.history.back();
					}
					alert("Erro-34");
				}else if (result){
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							controller.lastListField = pListField;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.ttDetailConfiguration = result.ttDetailConfiguration;
						controller.ttTree 		= result.ttTree;
						controller.ttTreeBKP 	= result.ttTreeBKP;
						controller.ttVariavel 	= result.ttVariavel;
						controller.ttVarCFG 	= result.ttVarCFG;
						controller.ttOperModelo = result.ttOperModelo;
						controller.nivelAtual   = result.pNivelAtu;
						controller.ultimoNivel  = result.pUltimoNivel;
						//Atualizar dados da tela conforme retorno do progress
						controller.AtualizaDadosTela();
					}
				}
				$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
				controller.retornaClickEditar(pListField, pConfig);
			});
		}


		controller.selectItemFamily = function(pListField, pConfig){
			
			controller.tgCheckBox = true;
			if (pListField.imagem == 12) {
				controller.clickEditar(true, pListField, pConfig);			
			} else {
				controller.tgCancela = true;
				controller.tgTabela = false;
				controller.tbChaveFilho = pListField.chaveFilho;
				controller.iniciaEdicaoTreeView(pListField, pConfig);
				
				/* Somatória para campo quantidade componente familia */
				angular.forEach(controller.ListField, function(result){
					if(result.chaveFilho == pListField.chavePai){
						result.qtdTotalCompon = (controller.formatNumber(result.qtdTotalCompon) - controller.formatNumber(pListField.valueHTML)).toLocaleString('de-DE', {minimumFractionDigits: 4});
						result.qtdCompon --; 

					}
				});
			}
		}

		controller.cancelEdicao = function(pListField, pConfig){
			
			//$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
			controller.tgError = false;
			controller.tgCheckBox = false;
			controller.retornaClickEditar(pListField, pConfig);
		}

		controller.iniciaEdicaoTreeView = function(pListField, pConfig){
			var param = {
				pTipo: 9, /*Parametro passado para resolver BUG Progress INPUT-OUTPUT */
				ttDetailConfiguration:controller.ttDetailConfiguration,
				ttTree:controller.ttTree,
				ttTreeBKP:controller.ttTreeBKP,
				ttVariavel:controller.ttVariavel,
				ttVarCFG:controller.ttVarCFG,
				ttOperModelo:controller.ttOperModelo,
				ttRowErrors:controller.ttRowErrors,
				pChave:controller.tbChaveFilho,
				pFmtDec:"",
				pValDec:0, 
				pFmtChr:"", 
				pValChr:"", 
				pCancela:controller.tgCancela,
				pNivelAtu:controller.nivelAtual,
				pUltimoNivel:controller.ultimoNivel
			};
			cfapi004.iniciaEdicaoTreeView(param, function(result){
				if (result.$hasError){
					alert("Erro-41");
					if (controller.isModal) {
						alert("Erro-42");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-43");
						$window.history.back();
					}
					alert("Erro-44");
				}else if (result){
					if (pListField != undefined) {
						if (result.pFmtDec != null){
							controller.tpCampo = "Dec";
							$('#' + pListField.chaveFilho + "Input")[0].type = "number";
							$('#' + pListField.chaveFilho + "Input")[0].value = result.pValDec;
						} else if (result.pFmtChr != null){
							controller.tpCampo = "Char";
							$('#' + pListField.chaveFilho + "Input")[0].type = "text";
							$('#' + pListField.chaveFilho + "Input")[0].value = result.pValChr;
						} else {
							controller.tpCampo = "";
						}
					}
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							controller.lastListField = pListField;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
							if (pListField != undefined) {
								angular.forEach(controller.ListField, function(result){
									if(result.chaveFilho == pListField.chavePai){
										result.valueHTML = "";
									}
								});
							}
						});
					} else {

						controller.ttDetailConfiguration = result.ttDetailConfiguration;
						controller.ttTree 		= result.ttTree;
						controller.ttTreeBKP 	= result.ttTreeBKP;
						controller.ttVariavel 	= result.ttVariavel;
						controller.ttVarCFG 	= result.ttVarCFG;
						controller.ttOperModelo = result.ttOperModelo;
						controller.nivelAtual   = result.pNivelAtu;
						controller.ultimoNivel  = result.pUltimoNivel;

						if (controller.tgCancela){
							controller.tgCancela = false;

							//Tratativa Itens Familia
							controller.ListEditarField = [];
							angular.forEach(controller.ttTree, function(pNode) {
								if (pNode.chavePai == pListField.chavePai){
									controller.ListEditarField.push({	'text'		: pNode.texto,
																		'textHTML'  : pNode.textoHTML,
																		'valueHTML' : pNode.valorHTML,
																		'nivel'		: pNode.nivel,
																		'idObjeto'	: pNode.idObjeto,
																		'chaveFilho': pNode.chaveFilho,
																		'oper'		: pNode.oper,
																		'chavePai' 	: pNode.chavePai,
																		'imagem' 	: pNode.imagem,
																		'seq'		: pNode.seq,
																		'icon' 		: controller.buscaImagem(pNode.imagem),
																		'tipoResult': pNode.tipoResult});
								}
							});
							controller.ListFieldEditar = controller.ListEditarField;
							$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/

							angular.forEach(controller.ListFieldEditar, function(node){
								$('#' + node.chaveFilho + "Editar").css("display", "");
								$('#' + node.chaveFilho + "Salvar").css("display", "none");
								$('#' + node.chaveFilho + "Cancel").css("display", "none");
								$('#' + node.chaveFilho + "Fechar").css("display", "none");
								$('#' + node.chaveFilho + "Input").css("display", "none");
							});
						}

						//Atualizar dados da tela conforme retorno do progress
						controller.AtualizaDadosTela();

						$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
						if (controller.tgTabela){
							if (pListField != undefined) {
								controller.fecharCampo(pListField.chavePai);
							}
						}
					}
				}
			});
		}

		controller.buscaImagem = function(pImagem){
			if (pImagem == 12)
				imagem = "glyphicon glyphicon-file";
			else if (pImagem == 10)
				imagem = "glyphicon glyphicon-object-align-horizontal";
			else if (pImagem == 3)
				imagem = "glyphicon glyphicon-hdd";
			else if (pImagem == 4)
				imagem = "glyphicon glyphicon-inbox";
			else if (pImagem == 5)
				imagem = "glyphicon glyphicon-unchecked";
			else if (pImagem == 6)
				imagem = "glyphicon glyphicon-duplicate";
			else if (pImagem == 9)
				imagem = "glyphicon glyphicon glyphicon-check";
			else if (pImagem == 16)
				imagem = "glyphicon glyphicon-exclamation-sign";
			else if (pImagem == 0)
				imagem = "glyphicon glyphicon-list-alt";
			else
				imagem = "glyphicon glyphicon-list-alt";

			//glyphicon glyphicon-ban-circle
			//glyphicon glyphicon-unchecked


			return imagem;
		}


		controller.AtualizaDadosTela = function(){

			angular.forEach(controller.ttTree, function(pNode) {

				angular.forEach(controller.ListField, function(pxListField){
					if (	pNode.nivel 	 == pxListField.nivel
						&& 	pNode.chaveFilho == pxListField.chaveFilho
						&& 	pNode.chavePai 	 == pxListField.chavePai){
						pxListField.text		= pNode.texto;
						pxListField.textHTML	= pNode.textoHTML;
						pxListField.valueHTML	= pNode.valorHTML;
						pxListField.imagem		= pNode.imagem;
						pxListField.icon		= controller.buscaImagem(pNode.imagem);
					}
				});
			});
		}
		
		controller.itemSelecionado = function(pListField, pConfig){
			controller.tbChaveFilho = pListField.chaveFilho;
			angular.forEach(controller.ListField, function(xNode){
				if (xNode.chaveFilho == pListField.chavePai) {
					xNode.valueHTML = pListField.text;
				};
			});
			angular.forEach(controller.ttTree, function(xNode){
				if (xNode.chaveFilho == pListField.chavePai) {
					xNode.valorHTML = pListField.text;
				};
			});

			controller.clickEditar(false, pListField);
		}

		controller.geraTreeView = function(){
			controller.Resumo = false;
			controller.dadosTreeTela = [];
			controller.ListField = [];
			controller.ListFieldEditar = [];

			angular.forEach(controller.ttTree, function(node){
				if (node.idObjeto == 1 && node.oper > 0 ) {
					//Nivel resumo
					if(controller.tgAvancar) {
						if (node.nivel == controller.pNivel - 1){
							controller.montaTree(controller.dadosTreeTela, node);
							node.oper = 0;
						}
					} else {
						if (node.nivel == 999){

							chavePaiNode = node.chaveFilho;
							controller.dadosTreeTela.push({	'text'		: node.texto,
															'textHTML'  : node.textoHTML,
															'valueHTML' : node.valorHTML,
															'nivel'		: node.nivel,
															'idObjeto'	: node.idObjeto,
															'chaveFilho': node.chaveFilho,
															'oper'		: node.oper,
															'chavePai' 	: node.chavePai,
															'imagem' 	: node.imagem,
															'seq'		: node.seq,
															'icon' 		: controller.buscaImagem(node.imagem),
															'tipoResult': node.tipoResult});

							controller.ListField.push({	'text'		: node.texto,
														'textHTML'  : node.textoHTML,
														'valueHTML' : node.valorHTML,
														'nivel'		: node.nivel,
														'idObjeto'	: node.idObjeto,
														'chaveFilho': node.chaveFilho,
														'oper'		: node.oper,
														'chavePai' 	: node.chavePai,
														'imagem' 	: node.imagem,
														'seq'		: node.seq,
														'icon' 		: controller.buscaImagem(node.imagem),
														'tipoResult': node.tipoResult});
						}
					}
				}
			});


			if(!controller.tgAvancar){
				controller.montaTreeFinal("normal");
			}

			$('#ListNivelTreeModel').treeview({
				data: controller.dadosTreeTela,         // data is not optional
				levels: 1,
				backColor: 'green',
				primaryKey: 'id',
				showBorder: true
			});
			$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/

			angular.forEach(controller.ListField, function(node){
				$('#' + node.chaveFilho + "Editar").css("display", "");
				$('#' + node.chaveFilho + "Salvar").css("display", "none");
				$('#' + node.chaveFilho + "Cancel").css("display", "none");
				$('#' + node.chaveFilho + "Fechar").css("display", "none");
				$('#' + node.chaveFilho + "Input").css("display", "none");
			});

			//Tratativa somatoria Familia

			/* Somatória para campo quantidade componente familia */
			angular.forEach(controller.ListField, function(result){
				if (result.imagem == 6) {
					angular.forEach(controller.ttTree, function(pNode) {
						if (pNode.chavePai == result.chaveFilho){
							if(pNode.imagem == 9){
								result.qtdTotalCompon = (controller.formatNumber(pNode.valorHTML) + controller.formatNumber(result.qtdTotalCompon)).toLocaleString('de-DE', {minimumFractionDigits: 4}); 
								result.qtdCompon ++;
							}
						}
					});
				}
			});
		}

		controller.montaTree = function(list, node){
			if (node != undefined){
				if (node.chavePai == ""){
					
					controller.dadosTreeTela.push({	'text'		: node.texto,
													'textHTML'  : node.textoHTML,
													'valueHTML' : node.valorHTML,
													'nivel'		: node.nivel,
													'idObjeto'	: node.idObjeto,
													'chaveFilho': node.chaveFilho,
													'oper'		: node.oper,
													'chavePai' 	: node.chavePai,
													'imagem' 	: node.imagem,
													'seq'		: node.seq,
													'icon' 		: controller.buscaImagem(node.imagem),
													'tipoResult': node.tipoResult});

					controller.ListField.push({	'text'		: node.texto,
												'textHTML'  : node.textoHTML,
												'valueHTML' : node.valorHTML,
												'nivel'		: node.nivel,
												'idObjeto'	: node.idObjeto,
												'chaveFilho': node.chaveFilho,
												'oper'		: node.oper,
												'chavePai' 	: node.chavePai,
												'imagem' 	: node.imagem,
												'seq'		: node.seq,
												'icon' 		: controller.buscaImagem(node.imagem),
												'tipoResult': node.tipoResult});
				} else {
					controller.isNewNode = true;
					angular.forEach(list, function(l, i, obj) {
						if (l.chaveFilho == node.chavePai && controller.isNewNode == true){
							if (obj[i].nodes == undefined)
								obj[i].nodes = [];

							obj[i].nodes.push({	'text'		: node.texto,
												'textHTML'  : node.textoHTML,
												'valueHTML' : node.valorHTML,
												'nivel'		: node.nivel,
												'idObjeto'	: node.idObjeto,
												'chaveFilho': node.chaveFilho,
												'oper'		: node.oper,
												'chavePai' 	: node.chavePai,
												'imagem' 	: node.imagem,
												'seq'		: node.seq,
												'icon' 		: controller.buscaImagem(node.imagem),
												'tipoResult': node.tipoResult});

							controller.ListField.push({	'text'					: node.texto,
														'textHTML'  			: node.textoHTML,
														'valueHTML' 			: node.valorHTML,
														'nivel'					: node.nivel,
														'idObjeto'				: node.idObjeto,
														'chaveFilho'			: node.chaveFilho,
														'oper'					: node.oper,
														'chavePai' 				: node.chavePai,
														'imagem' 				: node.imagem,
														'seq'					: node.seq,
														'icon' 					: controller.buscaImagem(node.imagem),
														'tipoResult'			: node.tipoResult,
														'infComplementar'		: node.infComplementar,
														'infComplementarFilho' 	: "Acesse a opção para visualizar",
														'qtdTotalCompon' 		: 0,
														'qtdCompon'				: 0	});
							
							controller.isNewNode = false;
						} else {
						}
					});
				}
			}
		}
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
		 
		controller.recuperaConfiguracao = function() {

			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				pItemCFG:$stateParams.pItemCotacao,
				pNumCFG:$stateParams.pNumCFG,
				pTpProcess:$stateParams.pTpProcess, //ReConfiguration, PendProduct
			};

			cfapi004.recuperaConfiguracao(param, function(result){
				if (result.$hasError){
					alert("Erro-51");
					if (controller.isModal) {
						alert("Erro-52");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-53");
						$window.history.back();
					}
					alert("Erro-54");
				}else if (result){
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.ttDetailConfiguration = result.ttDetailConfiguration;
						controller.ttTree 		= result.ttTree;
						controller.ttTreeBKP 	= result.ttTreeBKP;
						controller.ttVariavel 	= result.ttVariavel;
						controller.ttVarCFG 	= result.ttVarCFG;
						controller.ttOperModelo = result.ttOperModelo;
						controller.nivelAtual   = result.pNivelAtu;
						controller.ultimoNivel  = result.pUltimoNivel;
						controller.tgAvancar	= result.pEstAvancar;

						controller.numCFG       = controller.ttDetailConfiguration[0].numCFG;
						controller.moCodigo		= controller.ttDetailConfiguration[0].moCodigo;
						controller.itemCriado	= controller.ttDetailConfiguration[0].itemCriado;
						controller.descItem		= controller.ttDetailConfiguration[0].descItem;
						controller.descModelo	= controller.ttDetailConfiguration[0].descModelo;
						controller.descConfigur = controller.ttDetailConfiguration[0].descCFG;
						controller.itemTela		= controller.itemCriado;
						controller.modeloTela	= controller.moCodigo;
						controller.buscaDados   = true;
						controller.btnConfigurar = false;
					}
				}
			});
		}

		// *********************************************************************************
	    // *** INI - TREELIST
	    // *********************************************************************************
		controller.montaTreeFinal = function(param){

			if(param == "oper"){
				controller.lOperations = !controller.lOperations;
			}else if(param == "data"){
				controller.lData = !controller.lData;
			}else if(param == "forms"){
				controller.lForms = !controller.lForms;
			}

			controller.ttTreeFinal = [];
			angular.forEach(controller.ttTree, function(node){
				if (node.nivel === 999) {

					if ((node.imagem == 3)
					|| (node.imagem != 3 && node.imagem != 4 && node.imagem != 10 && node.imagem != 11)
					|| (controller.lOperations == true && node.imagem == 10) 
					|| (controller.lForms == true && (     node.tipoResult == 4 
														|| node.tipoResult == 5 
														|| node.tipoResult == 6 
														|| node.tipoResult == 8))
					|| (controller.lData == true && (	(node.tipoResult == 1 && node.imagem != 10) 
													  || node.tipoResult == 2 || node.tipoResult == 3 || node.tipoResult == 7))
					|| (controller.lData == true && (node.imagem == 11))
						){					
						controller.ttTreeFinal.push({	
						'textHTML'  : node.textoHTML,
						'valueHTML' : node.valorHTML,
						'nivel'		: node.nivel,
						'chaveFilho': node.chaveFilho,
						'chavePai' 	: node.chavePai,
						'id'		: node.chaveFilho,
						'seq'		: node.seq,
						'level'		: node.nivel,
						'parentId'	: node.chavePai == "" ? null:node.chavePai});
					}
				}
			});

			controller.ttTreeFinal = controller.ttTreeFinal.sort(function(a,b){ return a.seq - b.seq});

			var dataSource = new kendo.data.TreeListDataSource({
				transport: {
					read: function(options) {
						setTimeout(function() {
							if (!options.data.id) {
								options.success(controller.ttTreeFinal);
							}
						}, 1000);
					}
				},
				schema: {
					model: {
						id: "id",
						expanded: true
					}
				}
			});

			if ($("#treeList").data("kendoTreeList") == undefined) {
				controller.createTreeList(dataSource);
			} else {
				$("#treeList").data("kendoTreeList").setDataSource(dataSource);
			}
		
		}
        controller.createTreeList = function(dataSource) {
			$("#treeList").kendoTreeList({
				dataSource: dataSource,
				selectable: false,
				resizable: false,
				reorderable: false,
				sortable: false,
				columns:[
					{
						field: "textHTML", 
						title: "Configuração",
						attributes: {
								class: "table-cell",
							  	style: "text-align: left; font-size: 14px"
								},
						width: "450px",
					},
					{ 
						field: "valueHTML", 
						title: "Valores Selecionados",
						attributes: {
								class: "table-cell",
							  	style: "color: blue; text-align: left; font-size: 14px"
								},
						width: "150px",
					},
					/******************,
					{	
						attributes:{
							style: "text-align: center;"
						},
						command: [ {
							name: "detailColumn",
							text: "Detalhar",
							click: function(e) {
								// e.target is the DOM element representing the button
								var tr = $(e.target).closest("tr"); // get the current table row (tr)
								// get the data bound to the current table row
								var data = this.dataItem(tr);

								alert("OLA:" + data.textHTML);
								//controller.ttItemCostsScenaryVO.itemCode = data.itemCode;
								//controller.ttItemCostsScenaryVO.itemReference = data.itemReference;
								//controller.ttItemCostsScenaryVO.sequence = data.sequence;

								if(data.quantity >= 0){
									//controller.openDetail(data);
								}else{
									//controller.notification();
								}
							}
						}]
					}******************/
				],
				messages: {
					noRows: "Nenhum registro disponível"
				}
			});
						
		}
		


		// *********************************************************************************
	    // *** INI - TREELIST
	    // *********************************************************************************


		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	    controller.init = function() {
			previousView 			 = appViewService.previousView;
		   if (appViewService.startView($rootScope.i18n('l-configuration'), 'mcf.smartconfiguration.ConfigurationCtrl', controller)) {
				// se e a abertura da tab, implementar aqui inicializacao do controller
			}

	    	controller.isModal = false;
			
	        if ($stateParams.isModal != undefined){	     
	        	controller.isModal = $stateParams.isModal;
	        }

			// Processo Reconfiguracao
			if ($stateParams.pNumCFG != 0) {
				controller.tgReconfig	 = true;
				controller.pNivel		 = 1;

				controller.recuperaConfiguracao();
			}
	    }
	     
	    // se o contexto da aplicacao ja carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { 
			controller.isModal 		 = false;
			controller.itemCriado	 = "";
			controller.itemTela      = "";
			controller.descItem 	 = "";
			controller.moCodigo 	 = "";
			controller.modeloTela 	 = "";
			controller.descModelo 	 = "";
			controller.descConfigur  = "";
			controller.init();
			$scope.$apply(); /*Comando para garantir que todos os dados da tela estao renderizados*/
		}
	     
	    // *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			alert("2-Eliminar Metodo");
	        controller.init();
	    });
		

		controller.checkIfEnterKeyWasPressed = function($event, pListField, pConfig ) {
			var keyCode = $event.which || $event.keyCode;
			if (keyCode === 13) {
				// Do that thing you finally wanted to do
				controller.clickEditar(false, pListField, pConfig);
			}
		}

		/* Ação ENTER dos campos input
		$('body').on('keydown', '.inputType', function (event) {
			if (event.keyCode === 13) {
				controller.clickEditar(false, controller.lastListField, controller.ListFieldEnter);
			}
		   });
		    */
	}

	/*****************
	 * Porque destes campos abaixo.
	 * **/
	
	/**
	 * Controller */

	smartconfigurationConfigurationCtrl.$inject = [
		'$rootScope',
		'$window',
		'$scope',
		'$stateParams', 
		'$state',
		'$modal',
		'$filter',
		'$location',
		'$compile',
		'totvs.app-main-view.Service',
		'cfapi004.Factory', /*Api de integracao com o produto */
		'totvs.app-notification.Service',
		'TOTVSEvent'
	];
	function smartconfigurationConfigurationCtrl(
							   $rootScope,
							   $window,
							   $scope, 
							   $stateParams, 
							   $state,
							   $modal,
							   $filter,
							   $location,
							   $compile,
							   appViewService,
							   cfapi004,
							   appNotificationService,
							   TOTVSEvent) {
		configurationCtrl(this,
				   undefined,
				   $rootScope,
				   $window,
				   $scope, 
				   $stateParams, 
				   $state,
				   $modal,
				   $filter,
				   $location,
				   $compile,
				   appViewService,
				   cfapi004,
				   appNotificationService,
				   TOTVSEvent);
	}
	
	/**
	 * Controller */
	 
	smartconfigurationConfigurationModalCtrl.$inject = [
	    '$modalInstance',
		'$rootScope',
		'$window',
		'$scope',
		'$stateParams', 
		'$state',
		'$modal',
		'$filter',
		'$location',
		'$compile',
		'totvs.app-main-view.Service',
		'cfapi004.Factory', /*Api de integracao com o produto */
		'totvs.app-notification.Service',
		'TOTVSEvent'
	];
	function smartconfigurationConfigurationModalCtrl(
							   $modalInstance,
							   $rootScope,
							   $window,
							   $scope, 
							   $stateParams, 
							   $state,
							   $modal,
							   $filter,
							   $location,
							   $compile,
							   appViewService,
							   cfapi004,
							   appNotificationService,
							   TOTVSEvent) {
		configurationCtrl(this,
				   $modalInstance,
				   $rootScope,
				   $window,
				   $scope, 
				   $stateParams, 
				   $state,
				   $modal,
				   $filter,
				   $location,
				   $compile,
				   appViewService,
				   cfapi004,
				   appNotificationService,
				   TOTVSEvent);
	}

	index.register.controller('mcf.smartconfiguration.ConfigurationCtrl', smartconfigurationConfigurationCtrl);
	index.register.controller('mcf.smartconfiguration.modal.ConfigurationCtrl', smartconfigurationConfigurationModalCtrl);
	index.register.service('mcf.pendingproduct.NewConfiguration.modal', modalNewCFG);

});


/**
 * 
 *		controller.LLmontaTreeFinal = function(param){			

			let chaveCampo = "";
			controller.ListFieldTree = [];

			if(param == "oper"){
				controller.lOperations = !controller.lOperations;
			}else if(param == "data"){
				controller.lData = !controller.lData;
			}else if(param == "forms"){
				controller.lForms = !controller.lForms;
			}

			angular.forEach(controller.ListField, function(result){
				if(result.chavePai == ""){
					chaveCampo = result.chaveFilho;
				}
			});
			angular.forEach(controller.ListField, function(node){
				let chaveOrdem = 0;
				
				if(node.chavePai == chaveCampo){
					chaveOrdem = 1;
				}else {
					chaveOrdem = node.imagem;
				}
				
				if ((node.imagem == 3) ||
					(controller.lOperations == true && node.imagem == 10) ||
					(controller.lForms == true && (node.tipoResult == 4 || node.tipoResult == 5 || node.tipoResult == 6 || node.tipoResult == 8)) ||
					(controller.lData == true && ((node.tipoResult == 1 && node.imagem != 10) || node.tipoResult == 2 || node.tipoResult == 3 || node.tipoResult == 7)) ||
					(controller.lData == true && node.imagem == 11) ||
					(node.imagem != 3 && node.imagem != 4 && node.imagem != 10 && node.imagem != 11)){					
					controller.ListFieldTree.push({	'text'		: node.text,
													'textHTML'  : node.textHTML,
													'valueHTML' : node.valueHTML,
													'nivel'		: node.nivel,
													'idObjeto'	: node.idObjeto,
													'chaveFilho': node.chaveFilho,
													'oper'		: node.oper,
													'chavePai' 	: node.chavePai,
													'imagem' 	: node.imagem,
													'seq'		: node.seq,
													'ordem'		: chaveOrdem,
													'icon' 		: controller.buscaImagem(node.imagem),
													'tipoResult': node.tipoResult });

				}
			});
		}
 
 */