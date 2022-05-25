define([ 
	'index',
	'/dts/mla/js/api/mla0010.js',
	'/dts/mla/js/dbo/boin786.js',
	'/dts/mla/js/zoom/mla-usuar-aprov.js',
	'/dts/mla/js/mlaService.js'
], function(index) {
	
	// ########################################################
	// ### CONTROLLER LISTAGEM
	// ########################################################	
	alternativeUserListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'mla.mla0010.Factory', 'mla.boin786.Factory', '$injector', 'mla.service.mlaService', '$timeout', 'TOTVSEvent'];
	function alternativeUserListController($rootScope, $scope, appViewService, mla0010, boin786, $injector, mlaService, $timeout, TOTVSEvent){
		var alternativeUserListControl = this;

		// método para carregar o filtro default
		alternativeUserListControl.loadDefaults = function(){
			alternativeUserListControl.isFluig = $rootScope.isFluig;
			alternativeUserListControl.disclaimers.push({
				property: 'cod-usuar',
				value: $rootScope.currentuser.login,
				title: $rootScope.i18n('l-user') + ': ' + $rootScope.currentuser['login'],
				fixed: true,
				model: {
					value : {
						user: $rootScope.currentuser['login']
					}
				}
			});
		};

		// método que busca os usuários alternativos no ERP
		alternativeUserListControl.load = function(isMore){
			/* Atualiza código da empresa corrente */
			if ($rootScope.filtersMLA.selectedCompany !== undefined) {
				alternativeUserListControl.companycode = $rootScope.filtersMLA.selectedCompany;
                alternativeUserListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
			}

			if (!isMore) {
				alternativeUserListControl.listOfAlternativeUsers = [];
				alternativeUserListControl.listOfAlternativeUsersCount = 0;
			}

            mla0010.getAlternatives({pCodUsuar: $rootScope.currentuser.login}, function(result) {
            	if(result){
					alternativeUserListControl.listOfAlternativeUsers = result;
		    		alternativeUserListControl.listOfAlternativeUsersCount = result.length;
	    		}
            });
		};

		//método para remover um filtro
		alternativeUserListControl.removeDisclaimer = function(disclaimer) {
			var index = alternativeUserListControl.disclaimers.indexOf(disclaimer);
			if (index != -1) {
				alternativeUserListControl.disclaimers.splice(index, 1);
				alternativeUserListControl.load(false);
			}
		}

		//método para remover um usuário alternativo no ERP
	    alternativeUserListControl.removeRecord = function(alternativo){
	    	$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-remove') + ": <b>" + alternativo['cod-usuar-altern'] +"</b>?",
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	boin786.deleteRecord({pCodUsuar: $rootScope.currentuser['login'], pCodUsuarAltern: alternativo['cod-usuar-altern']}, function(result) {	
							var index = alternativeUserListControl.listOfAlternativeUsers.indexOf(alternativo);
							if (index != -1) {
								alternativeUserListControl.listOfAlternativeUsers.splice(index, 1);		
								alternativeUserListControl.listOfAlternativeUsersCount -= 1;
							}	            		        	
				 			// notifica o usuario que conseguiu eliminar o registro
					        $rootScope.$broadcast(TOTVSEvent.showNotification, {
					            type: 'success',
					            title: $rootScope.i18n('l-alternative-user'),
					            detail: $rootScope.i18n('l-alternative-user') + ': ' + alternativo['cod-usuar-altern'] + ', ' +
					            $rootScope.i18n('l-success-deleted') + '!'
					        });
			            });
	                }
	            }
	        });
	    }


	    //método de inicialização da tela de listagem de usuários alternativos	     
	    alternativeUserListControl.init = function() {
            alternativeUserListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            alternativeUserListControl.estabcode = $rootScope.filtersMLA.selectedEstab;

	    	createTab = appViewService.startView($rootScope.i18n('l-alternative-users'), 'mla.alternativeuser.ListCtrl', alternativeUserListControl);
			previousView = appViewService.previousView;			

			/* Lógica de comparação do código da empresa para a navegação entre abas */
            if(alternativeUserListControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== alternativeUserListControl.companycode){
                    alternativeUserListControl.load(false);
                }
            }
			/*########*/

	        if( createTab === false && previousView.controller &&
	        	previousView.controller != "mla.alternativeuser.EditCtrl" && 
	        	alternativeUserListControl.listOfAlternativeUsers){
	        	return;
	    	}

	        alternativeUserListControl.listOfAlternativeUsers = [];
			alternativeUserListControl.listOfAlternativeUsersCount = 0;
			alternativeUserListControl.disclaimers = [];

	        alternativeUserListControl.loadDefaults();
        	alternativeUserListControl.load(false);
	    }

	    /* Objetivo: Iniciar a tela (executa o método inicial - MENU HTML) */
		if($rootScope.currentuserLoaded){   
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                alternativeUserListControl.init();
            }
		}

		/* Objetivo: Iniciar a tela (executa o método inicial - PORTAL) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                alternativeUserListControl.init();
            }
		});

	    /* busca os dados novamente quando é feita a troca de empresa */
		$scope.$on("mla.selectCompany.event", function (event, currentcompany) {
			//Atualiza rootScope com empresa selecionada
			mlaService.afterSelectCompany(currentcompany);

			alternativeUserListControl.load(false);
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
            alternativeUserListControl.companycode = $rootScope.filtersMLA.selectedCompany;
            alternativeUserListControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            alternativeUserListControl.init();
		});
        
        /* Evento de carregamento de dados do usuário 
           (defaults de ordenação, visualização de pendências) */	
        $scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});
	}

	// ########################################################
	// ### CONTROLLER EDIÇÃO/CRIAÇÃO
	// ########################################################
	alternativeUserEditController.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'totvs.app-main-view.Service', 'mla.mla0010.Factory', 'mla.boin786.Factory', '$injector', 'mla.service.mlaService', 'totvs.utils.Service', '$timeout', 'TOTVSEvent'];
    function alternativeUserEditController($rootScope, $scope, $stateParams, $state, appViewService, mla0010, boin786, $injector, mlaService, totvsUtilsService, $timeout, TOTVSEvent) {
    	alternativeUserEditControl = this;

    	// metodo de leitura do regstro
	    alternativeUserEditControl.loadUpdate = function(alternativo) {
	    	alternativeUserEditControl.model = {}; // zera o model	        
    		boin786.getRecord({pCodUsuar: $rootScope.currentuser['login'], pCodUsuarAltern: alternativo}, function(result) {	                
            	if(result){
            		alternativeUserEditControl.model = result;
                    alternativeUserEditControl.validStart = alternativeUserEditControl.model['validade-ini'];
                    alternativeUserEditControl.validEnd = alternativeUserEditControl.model['validade-fim'];
        			alternativeUserEditControl.username = alternativeUserEditControl.model['cod-usuar-altern'];
        			alternativeUserEditControl.breadcrumb = alternativeUserEditControl.model['cod-usuar-altern'];
        			alternativeUserEditControl.breadcrumbShort = alternativeUserEditControl.breadcrumb;
            	}
            });
	    }

	    //método que retorna os valores default criação da requisicaçõ
	    alternativeUserEditControl.loadNew = function(){
            if(alternativeUserEditControl.model === undefined)
                alternativeUserEditControl.model = {}; // zera o model
            /* Atualiza código da empresa corrente */
	        if($rootScope.filtersMLA.selectedCompany !== undefined) {
                alternativeUserEditControl.companycode = $rootScope.filtersMLA.selectedCompany;
                alternativeUserEditControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            }
            
	    	if ($injector.has('totvs.app-bussiness-Contexts.Service')){
	    		alternativeUserEditControl.username = $rootScope.currentuser['user-desc'];
	    	}else
	    		alternativeUserEditControl.username = $rootScope.currentuser['username'];
    		
    		alternativeUserEditControl.model['cod-usuar'] = $rootScope.currentuser['login'];
    		if($rootScope.currentcompany !== undefined)
				alternativeUserEditControl.model['ep-codigo'] = $rootScope.currentcompany['companycode'];
    		else
				alternativeUserEditControl.model['ep-codigo'] = "";
    		$timeout(function(){
            	totvsUtilsService.focusOn('codUsuar');
            },500);
	    }

	    // metodo para salvar o registro
	    alternativeUserEditControl.save = function() {
            
            if(alternativeUserEditControl.validStart !== undefined){
	    		alternativeUserEditControl.model['validade-ini'] = alternativeUserEditControl.validStart;
	    	}
            
            if(alternativeUserEditControl.validEnd !== undefined){
	    		alternativeUserEditControl.model['validade-fim'] = alternativeUserEditControl.validEnd;
	    	}

	        // verificar se o formulario tem dados invalidos
	        if (alternativeUserEditControl.isInvalidForm()) { return; }

	        // se for a tela de edição, faz o update
	        if ($state.is('dts/mla/alternativeuser.edit')) {               
	            boin786.updateRecord({pCodUsuar: $rootScope.currentuser['login'], pCodUsuarAltern: alternativeUserEditControl.model['cod-usuar-altern']}, alternativeUserEditControl.model, function(result) {
	                alternativeUserEditControl.onSaveUpdate(true);
	                if(alternativeUserEditControl.isSaveNew)
                		alternativeUserEditControl.init();
	            });
	        } else { // senão faz o create
	            boin786.saveRecord(alternativeUserEditControl.model, function(result) {	                
	                alternativeUserEditControl.onSaveUpdate(false);	      
	                if(alternativeUserEditControl.isSaveNew)
                		alternativeUserEditControl.init();
	            });
	        }
	    }

	    // metodo para salvar e iniciar a criação de outro registro
	    alternativeUserEditControl.saveNew = function(){
	    	alternativeUserEditControl.isSaveNew = true;	    	
	    	alternativeUserEditControl.save();
	    }

	    // metodo para verificar se o formulario é invalido
	    alternativeUserEditControl.isInvalidForm = function() {
	        var messages = [];
	        var isInvalidForm = false;			
	         
	        if (!alternativeUserEditControl.model['cod-usuar-altern'] || alternativeUserEditControl.model['cod-usuar-altern'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-alternative');
	        }
            
            if (!alternativeUserEditControl.validStart) {
	            isInvalidForm = true;
	            messages.push('l-initial-validity');
	        }
            
            if (!alternativeUserEditControl.validEnd) {
	            isInvalidForm = true;
	            messages.push('l-final-validity');
	        }
            
            if(alternativeUserEditControl.validStart &&
               alternativeUserEditControl.validEnd &&  
               alternativeUserEditControl.validStart > alternativeUserEditControl.validEnd)
				messages.push('l-invalid-range');
            
	         
	        // se for invalido, monta e mostra a mensagem
	        if (isInvalidForm) {
	            var warning = $rootScope.i18n('l-field');
	            if (messages.length > 1) {
	                warning = $rootScope.i18n('l-fields');
	            }
	            angular.forEach(messages, function(item) {
	                warning = warning + ' ' + $rootScope.i18n(item) + ',';
	            });
	            if (messages.length > 1) {
	                warning = warning + ' ' + $rootScope.i18n('l-requireds');
	            } else {
	                warning = warning + ' ' + $rootScope.i18n('l-required');
	            }
	            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention'),
	                detail: warning
	            });
	        }

	        return isInvalidForm;
	    }
	    
	    // metodo para notificar o usuario da gravaçao do registro com sucesso
	    alternativeUserEditControl.onSaveUpdate = function(isUpdate) {
	     	        
	        alternativeUserEditControl.redirectToList();
	     
	        // notifica o usuario que conseguiu salvar o registro
	        $rootScope.$broadcast(TOTVSEvent.showNotification, {
	            type: 'success',
	            title: $rootScope.i18n('l-alternative-user'),
	            detail: $rootScope.i18n('l-alternative-user') + ': ' + alternativeUserEditControl.model['cod-usuar-altern'] + ', ' +
	            (isUpdate ? $rootScope.i18n('l-success-updated') : $rootScope.i18n('l-success-created')) + '!'
	        });
	    }

	    // metodo para a ação de cancelar
	    alternativeUserEditControl.cancel = function() {
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	//window.history.back();
	                	$state.go('dts/mla/alternativeuser.start');
	                }
	            }
	        });
	    }

	    // redireciona para a tela de detalhar
	    alternativeUserEditControl.redirectToList = function() {
	    	if(!alternativeUserEditControl.isSaveNew)	    		
	    		$state.go('dts/mla/alternativeuser.start');
	    }
	    
	    // método de inicialização da tela (primeiro método que será chamado) 
	    alternativeUserEditControl.init = function() {
            alternativeUserEditControl.companycode = $rootScope.filtersMLA.selectedCompany;
            alternativeUserEditControl.estabcode = $rootScope.filtersMLA.selectedEstab;

	    	createTab = appViewService.startView($rootScope.i18n('l-alternative-users'), 'mla.alternativeuser.EditCtrl', alternativeUserEditControl);
	        previousView = appViewService.previousView;

	        /* Lógica de comparação do código da empresa para a navegação entre abas */
            if(alternativeUserEditControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== alternativeUserEditControl.companycode){
                    alternativeUserEditControl.loadNew();
                }
            }

			alternativeUserEditControl.isEdit = $state.is('dts/mla/alternativeuser.edit');
	        if(alternativeUserEditControl.model && alternativeUserEditControl.isEdit && previousView.controller &&
	        	previousView.controller != "mla.alternativeuser.ListCtrl" &&
	        	previousView.controller != "mla.alternativeuser.DetailCtrl"){
	        	if(alternativeUserEditControl.model['cod-usuar-altern'] === $stateParams.alternativo){
	        		return;
	        	}
	        }

	        if(	createTab === false && previousView.controller &&
	        	$state.is('dts/mla/alternativeuser.new') &&
	        	alternativeUserEditControl.model &&
	        	previousView.controller != "mla.alternativeuser.ListCtrl") {
	        	return;
	        }
	        
        	// Limpa campos
	        alternativeUserEditControl.model = {};	        
            alternativeUserEditControl.validStart = undefined;
            alternativeUserEditControl.validEnd = undefined;
		    alternativeUserEditControl.username = undefined;

	       	alternativeUserEditControl.isEdit = $state.is('dts/mla/alternativeuser.edit');
			alternativeUserEditControl.isSaveNew = false;

	        // se houver parametros na URL
	        if ($stateParams && $stateParams.alternativo) {	            
	            alternativeUserEditControl.loadUpdate($stateParams.alternativo);	            
	        }else { // se não, incica com o model em branco (inclusão)	   	        	        	
	            alternativeUserEditControl.loadNew(); //busca os valores defaults para criação do registro.
	            alternativeUserEditControl.breadcrumb = $rootScope.i18n('l-new-user');
	            alternativeUserEditControl.breadcrumbShort = $rootScope.i18n('btn-new');
	        }
	    }

	    $scope.$on("mla.currentcompanySelected.event", function(event){
            alternativeUserEditControl.companycode = $rootScope.filtersMLA.selectedCompany;
            alternativeUserEditControl.estabcode = $rootScope.filtersMLA.selectedEstab;

	    	alternativeUserEditControl.loadNew(); //busca os valores defaults para criação do registro.
            alternativeUserEditControl.init();
		});
        
        /* Evento de carregamento de dados do usuário 
           (defaults de ordenação, visualização de pendências) */	
        $scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});

	    /* Objetivo: Iniciar a tela (executa o método inicial - MENU HTML) */
		if($rootScope.currentuserLoaded){
            if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                alternativeUserEditControl.init();
            }
		}

		/* Objetivo: Iniciar a tela (executa o método inicial - PORTAL) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                alternativeUserEditControl.init();
            }
		});
    }

	// ########################################################
	// ### CONTROLLER LISTAGEM
	// ########################################################	
	alternativeUserDetailController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'mla.mla0010.Factory', 'mla.boin786.Factory', '$injector', 'mla.service.mlaService', '$timeout', 'TOTVSEvent'];
	function alternativeUserDetailController($rootScope, $scope, $state, $stateParams, appViewService, mla0010, boin786, $injector, mlaService, $timeout, TOTVSEvent) {
		var alternativeUserDetailControl = this;
		
		//método para buscar as informações de um usuário alternativo no ERP
		alternativeUserDetailControl.load = function(alternativo){
			
			mla0010.getAlternative({pCodUsuar: $rootScope.currentuser['login'], pCodUsuarAlternativo: alternativo}, function(result) {	                
            	if(result){
            		if(result[0]){
            			alternativeUserDetailControl.model = result[0];
            			alternativeUserDetailControl.username = alternativeUserDetailControl.model['cod-usuar-altern'];
            		}
            	}
            });	    	
		};

		//método para retornar ao state de listagem de usuários alternativos
		alternativeUserDetailControl.back = function () {
			$state.go('dts/mla/alternativeuser.start');
		}

		//método para remover o usuário alternatito do ERP
		alternativeUserDetailControl.remove = function(){
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-remove') + ": <b>" + $stateParams.alternativo +"</b>?",
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	boin786.deleteRecord({pCodUsuar: $rootScope.currentuser['login'], pCodUsuarAltern: $stateParams.alternativo}, function(result) {	
							alternativeUserDetailControl.redirectToList();			
				 			// notifica o usuario que conseguiu eliminar o registro
					        $rootScope.$broadcast(TOTVSEvent.showNotification, {
					            type: 'success',
					            title: $rootScope.i18n('l-alternative-user'),
					            detail: $rootScope.i18n('l-alternative-user') + ': ' + $stateParams.alternativo + ', ' +
					            $rootScope.i18n('l-success-deleted') + '!'
					        });
			            });
	                }
	            }
	        });
		}

	    // redireciona para a tela de detalhar
	    alternativeUserDetailControl.redirectToList = function() {
	    	$state.go('dts/mla/alternativeuser.start');
	    }

		//método de inicialização da tela de detalhe
	    alternativeUserDetailControl.init = function() {
            alternativeUserDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
            alternativeUserDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;

	    	createTab = appViewService.startView($rootScope.i18n('l-alternative-users'), 'mla.alternativeuser.DetailCtrl', alternativeUserDetailControl);
			alternativeUserDetailControl.model = {};
			alternativeUserDetailControl.username = undefined;

			/* Lógica de comparação do código da empresa para a navegação entre abas */
            if(alternativeUserDetailControl.companycode !== undefined){
                if($rootScope.filtersMLA.selectedCompany !== alternativeUserDetailControl.companycode){
                    alternativeUserDetailControl.load($stateParams.alternativo);
                }
            }

			if ($stateParams && $stateParams.alternativo) {	            
	            alternativeUserDetailControl.load($stateParams.alternativo);
	        }
	    }

	    /* Objetivo: Iniciar a tela (executa o método inicial - MENU HTML) */
		if($rootScope.currentuserLoaded){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                alternativeUserDetailControl.init();
            }
		}

		/* Objetivo: Iniciar a tela (executa o método inicial - PORTAL) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
			if ($rootScope.userMLAInformation === undefined) {
                mlaService.getUsuarInformation({}, function(result) {},{});
            } else {
                alternativeUserDetailControl.init();
            }
		});

		/* Empresa carregada */
		$scope.$on("mla.currentcompanySelected.event", function(){
            alternativeUserDetailControl.companycode = $rootScope.filtersMLA.selectedCompany;
            alternativeUserDetailControl.estabcode = $rootScope.filtersMLA.selectedEstab;
            alternativeUserDetailControl.init();
		});
        
        /* Evento de carregamento de dados do usuário 
           (defaults de ordenação, visualização de pendências) */	
        $scope.$on("mla.usermlainfo.event", function (event, userMLaInformation) {
            mlaService.getDadosEmpresa();
		});
	}

		
	// ########################################################
	// ### Registers
	// ########################################################	
	index.register.controller('mla.alternativeuser.ListCtrl', alternativeUserListController);
	index.register.controller('mla.alternativeuser.EditCtrl', alternativeUserEditController);
	index.register.controller('mla.alternativeuser.DetailCtrl', alternativeUserDetailController);	
});
