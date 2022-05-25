define(['index',  
		'/dts/mpd/js/userpreference.js', 
		'/dts/mpd/js/portal-factories.js', 
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/zoom/repres.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js'], function (index) {
	
	index.stateProvider
	
	.state('dts/mpd/salescharge', {  
		abstract: true,				 
		template: '<ui-view/>'       
	})
	.state('dts/mpd/salescharge.start', {
	  url:'/dts/mpd/salescharge',
	  controller:'salesorder.salescharge.Controller',
	  controllerAs: 'controller',
	  templateUrl:'/dts/mpd/html/salescharge/salescharge.html'
	});
	

	saleschargeCtrl.$inject = ['$rootScope', 
							   'salesorder.salescharge.Factory', 
							   'userPreference', 
							   'totvs.app-main-view.Service', 
							   'portal.generic.Controller', 
							   'portal.getUserData.factory', 
							   '$filter', 
							   '$q', 
							   '$modal', 
							   'mpd.companyChange.Factory',
							   'mpd.fchdis0035.factory'];

	function saleschargeCtrl($rootScope, 
							 salescharge, 
							 userPreference, 
							 appViewService, 
							 genericController, 
							 userdata, 
							 $filter, 
							 $q, 
							 $modal, 
							 companyChange,
							 fchdis0035) {
		
		var controller = this;
		var i18n = $filter('i18n');
		var date = $filter('date');
		
		controller.realizados = i18n('l-accomp');
		
		this.advancedSearch = {model: {}};
		controller.advancedSearch.model.tipoNatureza = 0; 
        controller.advancedSearch.model.tipoOrigem   = 0; 
		controller.advancedSearch.naturezaContabil = [
                {tipoNatureza: 0, descNatureza: i18n('l-account-nature-0')},
                {tipoNatureza: 1, descNatureza: i18n('l-account-nature-1')},
                {tipoNatureza: 2, descNatureza: i18n('l-account-nature-2')}
            ];
            
        controller.advancedSearch.origemComis = [
                {tipoOrigem: 0, descOrigem: i18n('l-commission-origin-0')},
				{tipoOrigem: 1, descOrigem: i18n('l-commission-origin-1')},
				{tipoOrigem: 2, descOrigem: i18n('l-commission-origin-2')},
            ];    

		
		genericController.decorate(this, salescharge);
		
        this.loadMore = function() {
			this.findRecords(controller.listResult.length, controller.filterBy);
        };
        		        
               
        this.search = function() {        	
            this.clearDefaultData(true, this);
            this.addFilters();
            this.loadData();
        }
		
		this.removeSelectedFilter = function(filter) {

			controller.removeFilter(filter);
			if (filter.property == "simpleFilter") {
				controller.quickSearchText = '';
			}
			if (filter.property == "previstos") {
				delete controller.advancedSearch.model['realizados'];
			}
			if (filter.property == "realizados") {
				delete controller.advancedSearch.model['previstos'];
			}
			if (filter.property == "representatives") {
				controller.advancedSearch.listRepres = '';
			}
			delete controller.advancedSearch.model[filter.property];
            controller.loadData();
        }
		
               
		controller.addFilters = function() {
		
			controller.clearFilter();
		
			if(controller.advancedSearch.model.dtTransIni) {
				controller.addFilter('dtTransIni',controller.advancedSearch.model.dtTransIni, '', i18n('l-transaction-start') + ':' + date(controller.advancedSearch.model.dtTransIni, 'shortDate'));
			}
			if(controller.advancedSearch.model.dtTransFim) {
				controller.addFilter('dtTransFim',controller.advancedSearch.model.dtTransFim, '', i18n('l-transaction-end') + ':' + date(controller.advancedSearch.model.dtTransFim, 'shortDate'));
			}
            
            if(controller.advancedSearch.model.nomeAbrevIni){
                controller.addFilter('nomAbrevIni', controller.advancedSearch.model.nomeAbrevIni, '', i18n('l-initial-short-name') + ':' + controller.advancedSearch.model.nomeAbrevIni);
            }
            
            if(controller.advancedSearch.model.nomeAbrevFim){
                controller.addFilter('nomAbrevFim', controller.advancedSearch.model.nomeAbrevFim, '', i18n('l-final-short-name') + ':' + controller.advancedSearch.model.nomeAbrevFim);
            }
                                            
            if(controller.advancedSearch.model.tipoNatureza) {
                
                var idx1 = controller.advancedSearch.model.tipoNatureza;
                var labelNatureza = controller.advancedSearch.naturezaContabil[idx1].descNatureza;       
                controller.addFilter('naturezaCont',controller.advancedSearch.model.tipoNatureza, '', i18n('l-natureza') + ':' + labelNatureza);
            }
            
            if(controller.advancedSearch.model.tipoOrigem) {
                var idx2 = controller.advancedSearch.model.tipoOrigem;
                var labelOrigem = controller.advancedSearch.origemComis[idx2].descOrigem;
                controller.addFilter('origem',controller.advancedSearch.model.tipoOrigem, '', i18n('l-commission-origin') + ":" + labelOrigem);
            }
            
            if(controller.quickSearchText) {
                controller.addFilter('simpleFilter',controller.quickSearchText, '', i18n('l-nome-abrev') + ':' + controller.quickSearchText);
			}

			if (controller.codeRepresentatives) {
                controller.addFilter("representatives", controller.codeRepresentatives, '', i18n('l-representantes') + ": " + controller.representativesNames);
            }
		}
		            
        this.loadData = function () {
        	 this.findRecords(null, controller.filterBy);
        }
		
		this.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/salescharge/salescharge-adv-search.html',
			  controller: 'salesorder.salescharge.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
				model: function () {
				  return controller.advancedSearch;
				}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				controller.codeRepresentatives = controller.advancedSearch.codeRepresentatives;
            	controller.representativesNames = controller.advancedSearch.representativesNames;
			    controller.addFilters();
                controller.loadData();
			});
		}
		
		
		if (appViewService.startView(i18n('l-commissions'), 'salesorder.salescharge.Controller', this)) {  
		
			var paramVisibleFieldsMetasRepres = {cTable: "comissao-repres-detalhe"};

			fchdis0035.getVisibleFields(paramVisibleFieldsMetasRepres, function(result) {

				controller.comissaoRepresDetalheVisibleFields = result;	

				// Busca todas as empresas vinculadas ao usuario logado | M�todo getDataCompany presente na fchdis0035api.js |
				if (companyChange.checkContextData() === false){
					companyChange.getDataCompany(true);
				}
				
				// busca os dados novamente quando feita a troca de empresa
				$rootScope.$$listeners['mpd.selectCompany.event'] = [];
				$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
					controller.loadData();	
				});
				
				//Faz o filtro pelo cliente selecionado
				if($rootScope.selectedcustomer){
					controller.advancedSearch.model.nomeAbrevIni = $rootScope.selectedcustomer['nome-abrev'];
					controller.advancedSearch.model.nomeAbrevFim = $rootScope.selectedcustomer['nome-abrev'];				
				}

				//Faz o filtro pelos representantes selecionados
				if($rootScope.selectedRepresentatives){                
					var codRepList = "";
					var nomeAbrevList = "";
					var icountRepres = 0;
					var disclaimers = [];
									
					angular.forEach($rootScope.selectedRepresentatives, function (value, key) {
					
						icountRepres = icountRepres + 1;
						codRepList = codRepList + value['cod-rep'] + '|';
						if (icountRepres < 4) {                    
							if (nomeAbrevList == "") nomeAbrevList = value['cod-rep'] + ' - ' + value['nome'];
							else nomeAbrevList = nomeAbrevList + ', ' + value['cod-rep'] + ' - ' + value['nome'];
						}
						disclaimers.push({
							property: 'repres',
							value: value['cod-rep'],
							title: value['cod-rep'] + ' - ' + value['nome']
						});
					});

					if (icountRepres > 3) {
						nomeAbrevList = nomeAbrevList + '...';
					}            

					controller.codeRepresentatives = codRepList;
					controller.representativesNames = nomeAbrevList;
					controller.advancedSearch.listRepres = disclaimers;				
				}
				
				$q.all([userPreference.getPreference('salescharge.dataini'),
						userPreference.getPreference('salescharge.datafim')]).then(function (results) {
							
						var dtIni = new Date();
						var dtFim = new Date();
						
						if (results && results[0].prefValue) {
							dtIni = new Date(parseFloat(results[0].prefValue));
						} else {
							dtIni.setMonth(dtIni.getMonth() - 1);						
						}
						
						if (results && results[1].prefValue) {
							dtFim = new Date(parseFloat(results[1].prefValue));                         
						}
						
						controller.advancedSearch.model.dtTransIni = dtIni.getTime();
						controller.advancedSearch.model.dtTransFim = dtFim.getTime();
						controller.addFilters();
						controller.loadData();
					
				});
			});
           
            
		}else {
		
			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				controller.loadData();	
			});  		
		}		        
            
        controller.setQuickFilter  = function(key){
            controller.addFilters();
            switch(key) {
                case "PREVISTOS":
                    controller.addFilter("previstos", true, "", i18n('l-forecast') + " " + i18n('l-yes'));
                    controller.addFilter("realizados", false, "", i18n('l-accomp') + " " + i18n('l-no'));
                break;
                case "REALIZADOS":
                    controller.addFilter("previstos", false, "", i18n('l-forecast') + " " + i18n('l-no'));
                    controller.addFilter("realizados", true, "", i18n('l-accomp') + " " + i18n('l-yes'));
                break;
            }
            controller.loadData();
        }    
         
		

	} // function saleschargeCtrl(loadedModules) 

	index.register.controller('salesorder.salescharge.Controller', saleschargeCtrl);

	saleschargeAdvSearchController.$inject = ['$modalInstance', 'model'];
	function saleschargeAdvSearchController ($modalInstance, model) {
		
		this.advancedSearch = model;
		var controller = this;

		if (this.advancedSearch.listRepres){
			controller.disclaimers = this.advancedSearch.listRepres;
		}
		
		this.search = function () {

			this.codeRepresentatives = "";
			this.representativesNames = "";
			
			controller.icountRepres = 0;			

			angular.forEach(controller.disclaimers, function (value, key) {
                if (value.property === "repres") {
					controller.icountRepres = controller.icountRepres + 1;
					controller.codeRepresentatives = controller.codeRepresentatives + value.value + '|';
                    if (controller.icountRepres < 4) {                        
                        if (controller.representativesNames == "") controller.representativesNames = value.title;
                        else controller.representativesNames = controller.representativesNames + ', ' + value.title;
                    }
                }
			});
			
			if (controller.icountRepres > 3) {
                controller.representativesNames = controller.representativesNames + '...';
			}
			
			this.advancedSearch.codeRepresentatives = controller.codeRepresentatives;
			this.advancedSearch.representativesNames = controller.representativesNames;
			this.advancedSearch.listRepres = controller.disclaimers;
			
			$modalInstance.close();
		}
		
		this.close = function () {
			$modalInstance.dismiss();
		}

		this.onZoomSelectRepresentatives = function () {
			
			if (!this.selectedRepresentatives) return;

            if (this.selectedRepresentatives.objSelected && this.selectedRepresentatives.size >= 0) {
                this.selectedRepresentatives = this.selectedRepresentatives.objSelected;
            }

            if (!angular.isArray(this.selectedRepresentatives)) {
                this.selectedRepresentatives = [this.selectedRepresentatives];
			}

            var representatives = [];
            this.disclaimers = [];
            for (var i = 0; i < this.selectedRepresentatives.length; i++) {
                var representatives = this.selectedRepresentatives[i];
                controller.addDisclaimer("repres", representatives['cod-rep'], representatives['cod-rep'] + ' - ' + representatives['nome'] + ' ');
            }

            this.allRepresentatives = representatives;
            delete this.selectedRepresentatives;
		}
		
		// adiciona um objeto na lista de disclaimers
        this.addDisclaimer = function (property, value, label) {
            controller.disclaimers.push({
                property: property,
                value: value,
                title: label
            });
        }

        // remove um disclaimer
        this.removeDisclaimer = function (disclaimer) {
            // pesquisa e remove o disclaimer do array
            var index = controller.disclaimers.indexOf(disclaimer);
            if (index != -1) {
                controller.disclaimers.splice(index, 1);
            }
		}	
	}
	index.register.controller('salesorder.salescharge.adv-search.Controller', saleschargeAdvSearchController);
	
});