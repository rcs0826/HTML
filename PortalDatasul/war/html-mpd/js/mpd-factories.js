define([
	'index',
	'/dts/mpd/js/mpd-utils.js',
	'/dts/mpd/js/api/fchdis0035api.js'
], function(index) {
	
	// ########################################################
	// ### Services
	// ########################################################

	factoryMessage.$inject = ['$totvsresource'];
	function factoryMessage($totvsresource) {

		var factory = $totvsresource.REST(MpdURL.messageService);
		
		return factory;
	}
	
	factoryCompanyChange.$inject = ['$rootScope','mpd.fchdis0035.factory', '$injector'];
	function factoryCompanyChange($rootScope,fchdis0035,$injector) {
		var service ={
		    
            /* 
             * Objetivo: Preenche o combo-box com as empresas poss�veis para serem selecionadas e seta a empresa do 
             *           usu�rio ou todas as empresas. 
             * Par�metros:
             * Observa��es:
             */
            getDataCompany:function(reload){  
									
                if ($injector.has('totvs.app-bussiness-Contexts.Service')) {
                    if(reload || $rootScope.currentcompany === undefined){
								                        
                        bussinessContexts = null;  
                        bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');

                        var contextdata = bussinessContexts.getContextData('selected.company');  	
												
                        fchdis0035.getDataCompany({}, function(result){
                            
							empresas = result['ttUserCompany']; 
                                                 
                            var companies = [];
                            var selectedCompany;
							
							if ((!contextdata) && (empresas.length > 1))
                            bussinessContexts.setContext('selected.company', 
                                                         'Lendo Empresas...', 
                                                         'glyphicon-th-large', 
                                                         [{name: 'Lendo Empresas...'}], 
                                                         null);
							                    
                            for (var i = 0; i < empresas.length; i++) {
                                
                                companies[i]      = new Object();
                                companies[i].name = empresas[i]['cod-empresa'] + " - " + empresas[i]['razao-social'];
                                
                                if (empresas[i]['cod-empresa'] == result['p-cod-empresa']) {
                                    selectedCompany   = empresas[i];
                                    companies[i].icon = 'glyphicon-ok';
                                    $rootScope.currentcompany = {companycode: empresas[i]['cod-empresa'], 
                                                                 companyname: empresas[i]['razao-social']};
                                }        
                                       
                                companies[i].data  = {companyId: empresas[i]['cod-empresa']};
                                companies[i].click = service.selectCompany;
                                service.companies  = companies;
                                
                            }
                            
							
							if(empresas.length > 1){
								bussinessContexts.setContextData('selected.company', 
															{name: selectedCompany['cod-empresa'] + " - " + selectedCompany['razao-social'], 
															 data: {companyId: selectedCompany['cod-empresa']},
															 options: companies
															});
															
								$rootScope.$broadcast("mpd.currentcompanySelected.event", $rootScope.currentcompany);
                            }
                        });
                    }
                }
            },                   
                        
            /* 
             * Objetivo: Seta a empresa no banco de dados ap�s a troca da empresa pelo usu�rio atrav�s do portal
             * Par�metros: 
             * Observa��es:
             */
            selectCompany: function(item){             
                
                if(bussinessContexts === undefined || bussinessContexts === null)
                   bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
				                       
                fchdis0035.setCompanyId(item.data.companyId);
				
                fchdis0035.getChangeCompany({pCodEmpresa:item.data.companyId},function(result){       
				
                    // altera a empresa do cabe�alho e o �cone de 'check' na lista de empresas
                    for(i=0; i<service.companies.length; i++){
                        if(service.companies[i].data.companyId === item.data.companyId)
                            service.companies[i].icon = 'glyphicon-ok';
                        else
                            service.companies[i].icon = '';
                    }  
                                      
                    bussinessContexts.setContextData('selected.company', 
                                {name: item.name, 
                                 data: {companyId: item.data.companyId},
                                 options: service.companies
                                });
                                
                    $rootScope.currentcompany = {companycode: item.data.companyId, 
                                                 companyname: item.name};
                    
                    $rootScope.$broadcast("mpd.selectCompany.event", $rootScope.currentcompany);
                    
                });
                   
            },
           
		    /* 
             * Objetivo: Verifica se o contexto respons�vel por apresentar as empresas j� esta carregado em tela
             * Par�metros: 
             * Observa��es:
             */
			checkContextData: function() {			
				if ($injector.has('totvs.app-bussiness-Contexts.Service')){
					bussinessContexts = null;  
					bussinessContexts = $injector.get('totvs.app-bussiness-Contexts.Service');
							
					if (bussinessContexts && bussinessContexts.getContextData('selected.company')) {
						return true;
					}else{
						return false;
					}
				}else{
					return "noContextDirectiveAvailable";
				}
			}
                       
		};
		
		return service;
			
	}	
	
	
	// ########################################################
	// ### Registers
	// ########################################################
	
	index.register.factory('mpd.messages.Factory', factoryMessage);
	index.register.factory('mpd.companyChange.Factory', factoryCompanyChange);
});