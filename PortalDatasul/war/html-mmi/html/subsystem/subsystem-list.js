define(['index',
		'/dts/mmi/js/dbo/bomn258.js'
		], function(index) {
	
	/**
	 * Controller List
	 */
	subsystemListCtrl.$inject = [
		'$rootScope', 
		'$scope',  
		'$modal',
		'totvs.app-main-view.Service',
		'mmi.bomn258.Service',
		'TOTVSEvent'
	];
	
	function subsystemListCtrl($rootScope,
								 $scope,
								 $modal,
								 appViewService,
								 bomn258Service,
								 TOTVSEvent) {
	
		/**
		 * Variável Controller
		 */
		var controller = this;
	
		/**
		 * Variáveis
		 */
		this.listResult = [];       // array que mantem a lista de registros
		this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
		this.disclaimers = [];      // array que mantem a lista de filtros aplicados
		var quickSearchText = "";   // atributo que contem o valor da pesquisa rápida
		this.advancedSearch = {}    // objeto para manter as informações do filtro avançado
		var filter = "";
		var createTab;
		var previousView;
		
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		/**
		 * Abertura da tela de pesquisa avançada
		 */
	    this.openAdvancedSearch = function() {
	    	controller.quickSearchText = "";
	    	
	        var modalInstance = $modal.open({
	          templateUrl: '/dts/mmi/html/subsystem/subsystem.advanced.search.html',
	          controller: 'mmi.subsystem.SearchCtrl as controller',
	          size: 'lg',
	          resolve: {
	            model: function () {
	              // passa o objeto com os dados da pesquisa avançada para o modal	              
	              return controller.advancedSearch;
	            }
	          }
	        });
	        
	        // quando o usuario clicar em pesquisar:
	        modalInstance.result.then(function () {
	            // cria os disclaimers
	        	controller.addDisclaimers();
	            // e chama o busca dos dados
	            controller.loadData();
	        });
	    }
	    
	    /**
	     * Método para adicionar os disclaimers relativos a tela de pesquisa avançada
	     */ 
	    this.addDisclaimers = function() {
	        // reinicia os disclaimers
	        controller.disclaimers = [];        

	        if (controller.advancedSearch.codini || controller.advancedSearch.codfin) {
	            var faixa = '0', deate = ' do início';
	            if (controller.advancedSearch.codini)  {
	                faixa = controller.advancedSearch.codini;
	                deate = ' de ' + controller.advancedSearch.codini;
	            }
	            if (controller.advancedSearch.codfin) {
	                faixa = faixa + ';' + controller.advancedSearch.codfin;
	                deate = deate + ' até ' + controller.advancedSearch.codfin;
	            } else {
	                faixa = faixa + ';ZZZZZZZZ';
	                deate = deate + ' até o final';
	            }
	            // adicionar o disclaimer para o campo cod-sistema, para faixa o value é "inicio;final"
	            controller.addDisclaimer('cod-sub-sist', faixa, $rootScope.i18n('l-subsystem') + deate);
	        }


	        /*if (controller.advancedSearch.sistemaRange) {
	            var faixa2 = '0', deate2 = ' do início';
	            if (controller.advancedSearch.sistemaRange['start'])  {
	                faixa2 = controller.advancedSearch.sistemaRange['start'];
	                deate2 = ' de ' + controller.advancedSearch.sistemaRange['start'];
	            }
	            if (controller.advancedSearch.sistemaRange['end']) {
	                faixa2 = faixa2 + ';' + controller.advancedSearch.sistemaRange['end'];
	                deate2 = deate2 + ' até ' + controller.advancedSearch.sistemaRange['end'];
	            } else {
	              	faixa2 = faixa2 + ';9999999';
	                deate2 = deate2 + ' até o final';
	            }
	            // adicionar o disclaimer para o campo cod-sub-sist, para faixa o value é "inicio;final"
	            controller.addDisclaimer('cod-sistema', faixa2, $rootScope.i18n('l-system') + deate2);
	        }*/
	        
	        if (controller.advancedSearch.sistemaini || controller.advancedSearch.sistemafin) {
	            var faixa = '0', deate = ' do início';
	            if (controller.advancedSearch.sistemaini)  {
	                faixa = controller.advancedSearch.sistemaini;
	                deate = ' de ' + controller.advancedSearch.sistemaini;
	            }
	            if (controller.advancedSearch.sistemafin) {
	                faixa = faixa + ';' + controller.advancedSearch.sistemafin;
	                deate = deate + ' até ' + controller.advancedSearch.sistemafin;
	            } else {
	                faixa = faixa + ';ZZZZZZZZ';
	                deate = deate + ' até o final';
	            }
	            // adicionar o disclaimer para o campo cod-sistema, para faixa o value é "inicio;final"
	            controller.addDisclaimer('cod-sistema', faixa, $rootScope.i18n('l-system') + deate);
	        }


	        // adicionar o disclaimer para descricao
	        if (controller.advancedSearch.descricao)
	            controller.addDisclaimer('des-sub-sist', '*' + controller.advancedSearch.descricao  + '*', $rootScope.i18n('l-description') + ": " + controller.advancedSearch.descricao);

	    }
	    
	    /**
	     * Adiciona um objeto na lista de disclaimers
	     */ 
	    this.addDisclaimer = function(property, value, label) {
	        controller.disclaimers.push({
	            property: property,
	            value: value,
	            title: label
	        });
	    }
	    
	    /**
	     * Remove um disclaimer
	     */
	    this.removeDisclaimer = function(disclaimer) {
	        // pesquisa e remove o disclaimer do array
	        var index = controller.disclaimers.indexOf(disclaimer);
	        if (index != -1) {
	            controller.disclaimers.splice(index, 1);
	        }
	         
	        // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
	        if (disclaimer.property == null)
	            controller.quickSearchText = '';
	        if (disclaimer.property == 'cod-sub-sist') {
	            controller.advancedSearch.codini = '';
	            controller.advancedSearch.codfin = '';
	        }  
	        if (disclaimer.property == 'des-sub-sist'){
	            controller.advancedSearch.descricao = ''
	        }

	        if (disclaimer.property == 'cod-sistema'){
	            controller.advancedSearch.sistemaini = '';
	            controller.advancedSearch.sistemafin = '';
	        }
	        
	        // limpa texto da pesquisa rápida
	        if (controller.quickSearchText) {
	        	controller.quickSearchText = "";
	        }
	          
	        // recarrega os dados quando remove um disclaimer
	        controller.loadData();
	    }
	    
	    /**
	     * Método de pesquisa para filtro rápido
	     */
	    this.search = function(isMore) {
	    	this.addQuickSearchDisclaimer();
	    	this.loadData(isMore);
	    }
	    
	    /**
		 * Adiciona disclaimers do filtro rápido
		 */
		this.addQuickSearchDisclaimer = function() {
			if (this.quickSearchText === "" || this.quickSearchText === undefined) {
				this.disclaimers = undefined;
			} else {
				var placeholder = $rootScope.i18n('l-code-description');
				this.disclaimers = [{
					property : placeholder, 
					value : this.quickSearchText, 
					title : placeholder + ": " + this.quickSearchText
				}];
			}
		}
		
		/**
		 * Método de leitura dos dados
		 */
		this.loadData = function(isMore) {
	        // valores default para o inicio e pesquisa
	        var startAt = 0;
	        var where = '';
	        
	        // se não é busca de mais dados, inicializa o array de resultado
	        if (!isMore) {
	            controller.listResult = [];
	            // zera contador de total de registros
		        controller.totalRecords = 0;
	        }
	        
	        // calcula o registro inicial da busca
	        startAt = controller.listResult.length;
	        
	        // monta a lista de propriedades e valores a partir dos disclaimers
	        var properties = [];
	        var values = [];
	        
	        // se houver pesquisa rápida, monta o where
	        if (controller.quickSearchText) {
	            where = "cod-sub-sist matches '*" + this.quickSearchText + "*'";
	            where = where + " OR ";
	            where = where + "des-sub-sist matches '*" + this.quickSearchText + "*'";
	        } else {
		        angular.forEach(controller.disclaimers, function (filter) {
		        	if (filter.property) {
		                properties.push(filter.property);
		                values.push(filter.value);	                
		            }	            
		        });
	        }
	        
	        // monta os parametros para o service
	        var parameters = {
	            property: properties,
	            value: values,
	        };
	         
	        if (where)
	            parameters.where = where;
	        
	        // chama o findRecords
	        bomn258Service.findRecords(startAt, undefined, parameters, function(result) {	        
	        	// se tem result
	            if (result) {
	                 
	                // para cada item do result
	                angular.forEach(result, function (value) {
	                     
	                    // se tiver o atributo $length e popula o totalRecords
	                    if (value && value.$length) {
	                        controller.totalRecords = value.$length;
	                    }
	                    // adicionar o item na lista de resultado
	                    controller.listResult.push(value);
	                });            
	            }
	        });
	    }

		/**
		 * Remove registro da base de dados
		 */
		this.delete = function(record) {
	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titulo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar	            
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                     
	                	// chama o metodo de remover registro do service
	                    bomn258Service.deleteRecord(record['cod-sub-sist'], function(result) {
	                    	
	                    	if (!result.$hasError) {
	                    		
	                    		// remove o item da lista
	                            var index = controller.listResult.indexOf(record);
	                            
	                            if (index != -1) {
	                                 
	                                controller.listResult.splice(index, 1);
	                                 
	                                controller.totalRecords--;
	                                 
	                                // notifica o usuario que o registro foi removido
	                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                	type: 'success', // tipo de notificação
		                                title: $rootScope.i18n('msg-item-deleted'), // titulo da notificação
		                                detail: $rootScope.i18n('msg-success-deleted') // detalhe da notificação
	                                });
	                            }
	                        }
	                    });
	                }
	            }
	        });
	    }
		
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
		
		this.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-subsystem'), 'mmi.subsystem.ListCtrl', controller);
			previousView = appViewService.previousView;
			
			if (previousView.controller) {
				// Validação para não recarregar os dados ao trocar de aba
				if (createTab === false && previousView.controller !== "mmi.subsystem.DetailCtrl" && previousView.controller !== "mmi.subsystem.EditCtrl") {
	                return;
				}
			}
			
			controller.loadData();
		}
		
		if ($rootScope.currentuserLoaded) { this.init(); }
		
		// *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
		
		$scope.$on('$destroy', function () {
			controller = undefined;
		});
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
					
	}
	
	// *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************
	
	subsystemSearchCtrl.$inject = [ 	    
 		'$modalInstance', 
 	    'model'];
 	
 	function subsystemSearchCtrl ($modalInstance, 
 								model) {
 	     
 	    // recebe os dados de pesquisa atuais e coloca no controller
 	    this.advancedSearch = model;
 	     
 	    // ação de pesquisar
 	    this.search = function () {
 	        // close é o fechamento positivo
 	        $modalInstance.close();
 	    }
 	     
 	    // ação de fechar
 	    this.close = function () {
 	        // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    }
 	}
	
	index.register.controller('mmi.subsystem.ListCtrl', subsystemListCtrl);
	index.register.controller('mmi.subsystem.SearchCtrl', subsystemSearchCtrl);
			
});