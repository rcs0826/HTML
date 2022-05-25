define(['index'], function(index) {
	
	/**
	 * Controller List
	 */
	productionplanListCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$modal',
		'$filter',
		'totvs.app-main-view.Service',
		'mpl.boin318.Service',
		'fchman.fchmanproductionplan.Factory',
		'TOTVSEvent'
	];
	
	function productionplanListCtrl($rootScope,
								 $scope,
								 $modal,
								 $filter,
								 appViewService,
								 boin318Service,
								 fchmanproductionplanFactory,
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
		var createTab;
		var previousView;
		
 	    var day = new Date().getDate();
 	    var month = new Date().getMonth();
 	    var year = new Date().getFullYear(); 	     	    
 	    var today = new Date(year, month, day);
 	    var startDate = new Date(year,(month - 1), day);
 	    
		
		this.advancedSearch = {
				dateRange : { start: Date.parse(startDate), end: Date.parse(today) },
				lAtivo : true,
				lInativo : true,
				plVenda : true,
				plProdu : true
		}    // objeto para manter as informações do filtro avançado
		
		var filter = "";
		this.ttProductionPlanParam = {
				planCodeString: "",
				initialDate: Date.parse('01/01/1900'),
				finalDate: Date.parse("12/31/9999"),
				initialPeriod: "",
				finalPeriod: "",
				isActive: true,
				isInactive: true,
				isProductionPlan: true,
				isPlanSale: true,				
		};
		
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		/**
		 * Abertura da tela de pesquisa avançada
		 */
	    this.openAdvancedSearch = function() {
	    	controller.quickSearchText = "";
	    	
	        var modalInstance = $modal.open({
	        	templateUrl: '/dts/mpl/html/productionplan/productionplan.advanced.search.html',
	        	controller: 'mpl.productionplan.SearchCtrl as controller',
	        	size: 'lg',
	        	resolve: {
	        		model: function () {
	        			//passa o objeto com os dados da pesquisa avançada para o modal	  
	        			
	        			return controller.advancedSearch;
	        		}
	        
	        	
	        	}
	        });
	        
	        // quando o usuario clicar em pesquisar:
	        modalInstance.result.then(function () {	        	
	 	    	
 	    		controller.ttProductionPlanParam.planCodeString = controller.advancedSearch.cdPlano;
 	    		var auxString = "";

 	    		if (!controller.advancedSearch.cdPlano) 
 	    			controller.ttProductionPlanParam.planCodeString = "";
	 	    	
	 	    	if (controller.advancedSearch.dateRange != undefined){
	 	    			controller.ttProductionPlanParam.initialDate = controller.advancedSearch.dateRange['start'];
	 	    			controller.ttProductionPlanParam.finalDate = controller.advancedSearch.dateRange['end'];
	 	    	} else {
	 	    		controller.ttProductionPlanParam.initialDate = "";
	 	    		controller.ttProductionPlanParam.finalDate = "";
	 	    	}
	 	    	
	 	    	if (controller.advancedSearch.initialPeriodString == undefined)
	 	    		controller.advancedSearch.initialPeriodString = "000/0000";
	 	    	else {	 	    		
	 	    		auxString = String(controller.advancedSearch.initialPeriodString);
	 	    		if (auxString.split('/').length == 1){
		 	    		auxString = auxString.split('');
		 	    		auxString.splice(3,0,'/');
		 	    		auxString = auxString.join('');
		 	    		if (auxString == '/')
		 	    			auxString = '000/0000';
		 	    		
		 	    		controller.advancedSearch.initialPeriodString = auxString;
	 	    		}
	 	    	}
	 	    	
	 	    	if (controller.advancedSearch.finalPeriodString == undefined)
	 	    		controller.advancedSearch.finalPeriodString = "999/9999";
	 	    	else {
	 	    		auxString = String(controller.advancedSearch.finalPeriodString);
	 	    		if (auxString.split('/').length == 1){
		 	    		auxString = auxString.split('');
		 	    		auxString.splice(3,0,'/');
		 	    		auxString = auxString.join('');
	 	    		if (auxString == '/')
		 	    			auxString = '999/9999';
		 	    		
		 	    		controller.advancedSearch.finalPeriodString = auxString;
	 	    		}
	 	    	}
	 	    	
 	    		controller.ttProductionPlanParam.initialPeriod = controller.advancedSearch.initialPeriodString;
 	    		controller.ttProductionPlanParam.finalPeriod = controller.advancedSearch.finalPeriodString;	 	    	
 	    		controller.ttProductionPlanParam.isActive = controller.advancedSearch.lAtivo;
 	    		controller.ttProductionPlanParam.isInactive = controller.advancedSearch.lInativo;	 	    
 	    		controller.ttProductionPlanParam.isProductionPlan = controller.advancedSearch.plProdu;
				controller.ttProductionPlanParam.isPlanSale = controller.advancedSearch.plSale;	    	        	
	 	    	
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
	        
	        // para a faixa de codigos, tem que tratar e colocar em apenas um disclaimer
	        if (controller.advancedSearch.dateRange) {
	            var faixa = '0', deate = ' do início';
	            if (controller.advancedSearch.dateRange['start'])  {	            		
	            	faixa = controller.advancedSearch.dateRange['start'];	            	
	                deate = ' de ' + $filter('date')(controller.advancedSearch.dateRange['start'], 'dd/MM/yyyy');
	            }
	            if (controller.advancedSearch.dateRange['end']) {
	                faixa = faixa + ';' + controller.advancedSearch.dateRange['end'];
	                deate = deate + ' até ' + $filter('date')(controller.advancedSearch.dateRange['end'], 'dd/MM/yyyy');
	            } else {
	                faixa = faixa + ';99999999';
	                deate = deate + ' até o final';
	            }
	            // adicionar o disclaimer para o campo data-inicio, para faixa o value é "inicio;final"
	            controller.addDisclaimer('data-inicio', faixa, $rootScope.i18n('l-date') + deate);
	        }
	        
	        
	        // para a faixa de codigos, tem que tratar e colocar em apenas um disclaimer            
            if (controller.advancedSearch.initialPeriodString)  {
                faixa = controller.advancedSearch.initialPeriodString;
                deate = ' de ' + controller.advancedSearch.initialPeriodString;
            } else {
            	var faixa = '000/0000', deate = ' do início';
            }
            if (controller.advancedSearch.finalPeriodString) {
                faixa = faixa + ';' + controller.advancedSearch.finalPeriodString;
                deate = deate + ' até ' + controller.advancedSearch.finalPeriodString;
            } else {
                faixa = faixa + ';999/9999';
                deate = deate + ' até o final';
            }
            // adicionar o disclaimer para o campo periodRange, para faixa o value é "inicio;final"
            controller.addDisclaimer('nr-per-ini', faixa, $rootScope.i18n('l-period') + deate);
	        
	        // adicionar o disclaimer para descricao
	        if (controller.advancedSearch.cdPlano)
	            controller.addDisclaimer('descricao', '*' + controller.advancedSearch.cdPlano  + '*', $rootScope.i18n('l-plan') + ": " + controller.advancedSearch.cdPlano);
	        
	        if (controller.advancedSearch.lAtivo){
	        	var plEstado = true;
	            controller.addDisclaimer('pl-estado', plEstado, $rootScope.i18n('l-active'));
	        }
	        
	        if (controller.advancedSearch.lInativo){
	        	var plEstado = true;
	            controller.addDisclaimer('pl-estado', plEstado, $rootScope.i18n('l-inact'));
	        }
	        
	        if (controller.advancedSearch.plVenda)
	            controller.addDisclaimer('ordens-fabr', controller.advancedSearch.plVenda, $rootScope.i18n('l-plan-sale'));
	        
	        if (controller.advancedSearch.plProdu)
	            controller.addDisclaimer('ordens-comp', controller.advancedSearch.plProdu, $rootScope.i18n('l-production-plan'));
	        
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
	        if (disclaimer.property == 'cd-plano') {
	            controller.advancedSearch.planCodeString = '';
	            controller.advancedSearch.planCodeString = '';
	        }  
	        if (disclaimer.property == 'descricao') {
	            controller.advancedSearch.descricao = ''
	        }
	        if (disclaimer.property == 'pl-estado'){
	    		if (disclaimer.title == 'Inativo')
	    			controller.advancedSearch.lInativo = false;
	    		else
	    			controller.advancedSearch.lAtivo = false;
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
	    	this.loadDataQuickSearch(isMore);
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
	            controller.totalRecords = 0;
	        }
	        
	        // calcula o registro inicial da busca
	        //startAt = controller.listResult.length;
        	startAt = controller.totalRecords
	        
	        // monta a lista de propriedades e valores a partir dos disclaimers
	        var properties = [];
	        controller.values = [];
	        var auxValue;
	        
	        controller.ttProductionPlanParam.isProductionPlan = false;
    		controller.ttProductionPlanParam.isPlanSale = false;
    		controller.ttProductionPlanParam.isActive = false;
			controller.ttProductionPlanParam.isInactive = false;	      
			
		    if (controller.quickSearchText != ""){
		    	controller.search(isMore);
		    }else{
			
		        angular.forEach(controller.disclaimers, function (filter) {
		        	auxValue = [];	        	
		        	if (filter.property) {
		        		if(filter.property == 'data-inicio' || filter.property == 'periodRange'){
		        			auxValue = filter.value.split(';');
		        			if(filter.property == 'data-inicio'){	        				
	        					controller.ttProductionPlanParam.initialDate = parseInt(auxValue[0]);
	        					controller.ttProductionPlanParam.finalDate = parseInt(auxValue[1]);
		        			}
		        			if(filter.property == 'periodRange'){	        				
		        				controller.ttProductionPlanParam.initialPeriod = auxValue[0];
		        	    		controller.ttProductionPlanParam.finalPeriod = auxValue[1];
		        			}		        			
		        		}	        		
		        		if (filter.property == 'pl-estado'){
		        			if (filter.title == 'Ativo')
		        				controller.ttProductionPlanParam.isActive = filter.value;
		        			else
		        				controller.ttProductionPlanParam.isInactive = filter.value;	     
		        		}
		        		if (filter.property == 'ordens-comp')
		        			controller.ttProductionPlanParam.isProductionPlan = filter.value;
		        		
						if (filter.property == 'ordens-fabr')
							controller.ttProductionPlanParam.isPlanSale = filter.value;
		        		
		            }	            
		        });	      
		     
	        
	        	fchmanproductionplanFactory.getProductionPlanList(controller.ttProductionPlanParam, function(result){
	 	        	if (result) {
		                 
		                // para cada item do result
		                angular.forEach(result, function (value) {
		                     
		                    // se tiver o atributo $length e popula o totalRecords
		                    if (value && value.$length) {
		                        controller.totalRecords = value.$length;
		                    } else {
		                    	controller.totalRecords++;	                    	
		                    }
		                    // adicionar o item na lista de resultado
		                    controller.listResult.push(value);
		                });
		            }
	 	        });
		    }
	    }
		
		
		/**
		 * Método de leitura dos dados
		 */
		this.loadDataQuickSearch = function(isMore) {
	        // valores default para o inicio e pesquisa
	        var startAt = 0;
	        var where = '';
	        
	        // se não é busca de mais dados, inicializa o array de resultado
	        if (!isMore) {
	            controller.listResult = [];
	        }
	        
	        // calcula o registro inicial da busca
	        startAt = controller.listResult.length;
	        
	        // monta a lista de propriedades e valores a partir dos disclaimers
	        var properties = [];
	        var values = [];
	        
	        // se houver pesquisa rápida, monta o where
	        if (controller.quickSearchText) {
	        	var intQuickSearch = parseInt(controller.quickSearchText);
	        	
	        	if (!isNaN(intQuickSearch)){
	        		where = "pl-prod.cd-plano = " + this.quickSearchText;
	        		where = where + " OR ";
	        	}       	
	            where = where + "pl-prod.descricao matches '*" + this.quickSearchText + "*'";
	        }
	        
	        // monta os parametros para o service
	        var parameters = {
	            property: properties,
	            value: values,
	        };
	         
	        if (where)
	            parameters.where = where;
	        	        
	        controller.totalRecords = 0;
	        
	        boin318Service.findRecords(startAt,10,parameters, function(result){
 	        	if (result) {
	                // para cada item do result
	                angular.forEach(result, function (value) {
	                     
	                    // se tiver o atributo $length e popula o totalRecords
	                    if (value && value.$length) {
	                        controller.totalRecords = value.$length;
	                    } 
	                    // adicionar o item na lista de resultado
	                    controller.listResult.push({
	                    	planCode: value['cd-plano'],
	                    	planDescription: value['descricao'],
	                    	planType: value['tipo-plano'],
	                    	isMultiSites: value['log-multi-estabel'],
	                    	percentualCalculation: value['num-perc-calc'],
	                    	initialPeriod: value['nr-per-ini'],
                    		initialPeriodYear:value['ano-per-ini'],
                    		finalPeriod: value['nr-per-fim'],
                			finalPeriodYear: value['ano-per-fim'],
                			planStatus: value['pl-estado']
	                    });	                    
	                });
	            }
 	        });
	    }
		
		/**
		 * Retorna o estado do plano 
		 */
		this.getEstado = function(estado){
			if (estado == 1)
				return $rootScope.i18n('l-active');
			else
				return $rootScope.i18n('l-inact');			
		}
		
		this.traduzLog = function(inputLog){
			if (inputLog)
				return $rootScope.i18n('l-yes');
			else
				return $rootScope.i18n('l-no');
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
	                	
	                	var ttProductionPlanSummary = [];
	                	
	                	
	                	fchmanproductionplanFactory.getProductionPlanPortletSummary(record.planCode, function(result){
	                		if (result){
	                			ttProductionPlanSummary = result[0];
	                			ttProductionPlanSummary.isSelected = true;
	                			fchmanproductionplanFactory.removeProductionPlan(ttProductionPlanSummary, function(result){
	    	                    	
	    	                    	if (result) {
	    	                    		
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
	                		
	                	});
	                }
	            }
	        });
	    }
        
        /**
		 * Definir itens do plano
		 */
		this.setSite = function (record) {
            
            var model = {
        			planCode: record.planCode,
                    planDescription: record.planDescription
	    	};

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpl/html/productionplan/productionplan.set.site.html',
                controller: 'mpl.productionplanitem.SetSiteCtrl as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        // passa o objeto model para o modal
                        return model;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function () {
                
            });
        }
        
        /**
		 * Copiar Planos
		 */
		this.copyPlan = function (record) {
            
            var model = record;

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpl/html/productionplan/productionplan.copy.plan.html',
                controller: 'mpl.productionplanitem.CopyPlanCtrl as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        // passa o objeto model para o modal
                        return model;
                    }
                }
            });
            
            // quando o usuario clicar em salvar:
            modalInstance.result.then(function () {
                // recarrega os dados quando copiar um plano
                controller.loadData();
            });
        }
		
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
		
		this.init = function() {
			
			createTab = appViewService.startView($rootScope.i18n('l-production-plan'), 'mpl.productionplan.ListCtrl', controller);
			previousView = appViewService.previousView;
			
			if (previousView.controller) {		
	            // Validação para não recarregar os dados ao trocar de aba
				if (createTab === false && previousView.controller !== "mpl.productionplan.DetailCtrl" && previousView.controller !== "mpl.productionplan.EditCtrl") {
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
	
	productionplanSearchCtrl.$inject = [ 	    
 		'$modalInstance', 
 		'$scope',
 	    'model',
 	    '$filter',
 	    'fchman.fchmanproductionplan.Factory'];

 	
 	function productionplanSearchCtrl ($modalInstance,$scope,model,$filter,fchmanproductionplanFactory) {
 	      		 	
 	    // recebe os dados de pesquisa atuais e coloca no controller
 	    this.advancedSearch = model;
 	    
 	    this.planCodeChange = function(){
 	    	this.advancedSearch.cdPlano = $filter('planCodeFilter')(this.advancedSearch.cdPlano); 	    	
 	    }
 	    
	    this.closeOther = false;
	    $scope.oneAtATime = true;
	    
	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };

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
	index.register.filter('planCodeFilter', function(){
		return function (input) {return input.replace(/[^0-9;-]/g, '')};
	});
 	
	index.register.controller('mpl.productionplan.ListCtrl', productionplanListCtrl);
	index.register.controller('mpl.productionplan.SearchCtrl', productionplanSearchCtrl);
			
});