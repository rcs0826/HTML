define(['index',
        '/dts/mmi/js/dbo/bomn267.js'
		], function(index) {
	
	/**
	 * Controller List
	 */
	trainingListCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$modal',
		'totvs.app-main-view.Service',
		'mmi.bomn267.Service',
		'TOTVSEvent'
	];
	
	function trainingListCtrl(
			$rootScope,
			$scope,
			$modal,
			appViewService,
			bomn267Service,
			TOTVSEvent) {

		var controller = this;
		controller.listResult = [];       // array que mantem a lista de registros
		controller.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
		controller.disclaimers = [];      // array que mantem a lista de filtros aplicados
		var quickSearchText = "";   // atributo que contem o valor da pesquisa rápida
		controller.advancedSearch = {};    // objeto para manter as informações do filtro avançado
		var filter = "";		
		var createTab;
		var previousView;
		
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		/**
		 * Abertura da tela de pesquisa avançada
		 */
	    controller.openAdvancedSearch = function() {
	    	controller.quickSearchText = "";
	    	
	        var modalInstance = $modal.open({
	          templateUrl: '/dts/mmi/html/training/training.advanced.search.html',
	          controller: 'mmi.training.SearchCtrl as controller',
			  size: 'md',
			  backdrop: 'static',
			  keyboard: true,
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
	    controller.addDisclaimers = function() {
	        // reinicia os disclaimers
	        controller.disclaimers = [];        
	        
	        // para a faixa de codigos, tem que tratar e colocar em apenas um disclaimer
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
	            controller.addDisclaimer('cdn-curso', faixa, $rootScope.i18n('l-code') + deate);
			}
			if(controller.advancedSearch['log-ativo'] === true){
				controller.addDisclaimer('log-ativo',
				controller.advancedSearch['log-ativo'],
				$rootScope.i18n('l-active') + ": " + $rootScope.i18n('l-yes') );
			}
			if(controller.advancedSearch['log-ativo'] === false){
				controller.addDisclaimer('log-ativo',
				controller.advancedSearch['log-ativo'],
				$rootScope.i18n('l-active') + ": " + $rootScope.i18n('l-no') );
			}
			if(controller.advancedSearch['log-ativo'] === 'ambos'){
				controller.addDisclaimer('log-ativo',
				controller.advancedSearch['log-ativo'],
				$rootScope.i18n('l-active') + ": " + $rootScope.i18n('l-both') 
			);
			}
	        if (controller.advancedSearch.descricao)
				controller.addDisclaimer('des-curso', '*' + 
				controller.advancedSearch.descricao  + '*', 
				$rootScope.i18n('l-description') + ": " + 
				controller.advancedSearch.descricao);	        	        
	    }
	    
	    controller.addDisclaimer = function(property, value, label) {
		    controller.disclaimers.push({
	            property: property,
	            value: value,
	            title: label
	        });
	    }
	    
	    controller.removeDisclaimer = function(disclaimer) {
	        // pesquisa e remove o disclaimer do array
	        var index = controller.disclaimers.indexOf(disclaimer);
	        if (index != -1) {
	            controller.disclaimers.splice(index, 1);
	        }
	         
	        // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
	        if (disclaimer.property == null)
	            controller.quickSearchText = '';
	        if (disclaimer.property == 'cdn-curso') {
	            controller.advancedSearch.codini = '';
	            controller.advancedSearch.codfin = '';
	        }  
	        if (disclaimer.property == 'des-curso') {
	            controller.advancedSearch.descricao = ''
	        }
	        
	        if (controller.quickSearchText) {
	        	controller.quickSearchText = "";
	        }
	        controller.loadData();
	    }
	    
	    /**
	     * Método de pesquisa para filtro rápido
	     */
	    controller.search = function(isMore) {
	    	controller.addQuickSearchDisclaimer();
	    	controller.loadData(isMore);
	    }
	    
		controller.addQuickSearchDisclaimer = function() {
			if (controller.quickSearchText === "" || controller.quickSearchText === undefined) {
				controller.disclaimers = undefined;
			} else {
				var placeholder = $rootScope.i18n('l-code-description');
				controller.disclaimers = [{
					property : placeholder, 
					value : controller.quickSearchText, 
					title : placeholder + ": " + controller.quickSearchText
				}];
			}
		}
		
		/**
		 * Método de leitura dos dados
		 */
		controller.loadData = function(isMore) {
	        var startAt = 0;
	        var where = '';

			if (!isMore) {
	            controller.listResult = [];
		        controller.totalRecords = 0;
	        }
	        
	        startAt = controller.listResult.length;
	        var properties = [];
	        var values = [];
	        if (controller.quickSearchText) {
	            where = "string(cdn-curso) matches '*" + controller.quickSearchText + "*'";
	            where = where + " OR ";
	            where = where + "des-curso matches '*" + controller.quickSearchText + "*'";
	        } else {
		        angular.forEach(controller.disclaimers, function (filter) {
		        	if (filter.property) {
						if (filter.value !== "ambos") {
							properties.push(filter.property);						
							values.push(filter.value);	   
						}		                             
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
	        bomn267Service.findRecords(startAt, undefined, parameters, function(result) {	        
	            // se tem result
	            if (result) {
	                 
	                // para cada item do result
	                angular.forEach(result, function (value) {
	                     
	                    // se tiver o atributo $length e popula o totalRecords
	                    if (value && value.$length) {
	                        controller.totalRecords = value.$length;
						}
						
						if (value['log-ativo'] === true){
							value.traducao = $rootScope.i18n('l-yes');
						} else {
							value.traducao = $rootScope.i18n('l-no');
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
		controller.delete = function(record) {
	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titulo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-record', record['cdn-curso']), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar	            
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                     
	                	// chama o metodo de remover registro do service
	                    bomn267Service.deleteRecord(record['cdn-curso'], function(result) {
	                    	
	                    	if (!result.$hasError) {
	                    		
	                    		// remove o item da lista
	                            var index = controller.listResult.indexOf(record);
	                            
	                            if (index != -1) {
	                                 
	                                controller.listResult.splice(index, 1);
	                                 
	                                controller.totalRecords--;
	                                 
	                                // notifica o usuario que o registro foi removido
	                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                	type: 'success', // tipo de notificação
		                                title: $rootScope.i18n('msg-record-deleted'), // titulo da notificação
		                                detail: $rootScope.i18n('msg-record-success-deleted') // detalhe da notificação
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
		
		controller.init = function() {

			createTab = appViewService.startView($rootScope.i18n('l-trainings'), 'mmi.training.ListCtrl', controller);
			previousView = appViewService.previousView;
			controller.advancedSearch['log-ativo'] = true;

			if (previousView.controller) {			
				// Validação para não recarregar os dados ao trocar de aba
				if (createTab === false && previousView.controller !== "mmi.training.DetailCtrl" && previousView.controller !== "mmi.training.EditCtrl") {
	                return;
				}
			}
			
			controller.loadData();
		}
		
		if ($rootScope.currentuserLoaded) { controller.init(); }
		
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
	
	trainingSearchCtrl.$inject = [ 	    
			'$modalInstance', 
			'model'];
 	
 	function trainingSearchCtrl ($modalInstance, 
 							     model) {
		var controller = this;  
									
 	    // recebe os dados de pesquisa atuais e coloca no controller
		 controller.advancedSearch = model;
		 
 	    // ação de pesquisar
 	    controller.search = function () {
 	        // close é o fechamento positivo
 	        $modalInstance.close();
 	    }
 	     
 	    // ação de fechar
 	    controller.close = function () {
 	        // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    }
 	}
	
	index.register.controller('mmi.training.ListCtrl', trainingListCtrl);
	index.register.controller('mmi.training.SearchCtrl', trainingSearchCtrl);
	
			
});